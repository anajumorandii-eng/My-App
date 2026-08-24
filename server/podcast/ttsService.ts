import { createHash } from 'node:crypto';
import { GoogleGenAI } from '@google/genai';
import { readCachedAudio, writeCachedAudio } from './podcastStorage';

export interface TtsResult {
  buffer: Buffer;
  mimeType: 'audio/wav';
}

const DEFAULT_TTS_MODEL = 'gemini-2.5-flash-preview-tts';
const SAMPLE_RATE = 24000;
const CHANNELS = 1;
const BIT_DEPTH = 16;
const MAX_CACHE_ENTRIES = 200;

// Gemini TTS returns raw 16-bit PCM (audio/L16;codec=pcm;rate=24000), which
// browsers can't play directly — it needs a standard 44-byte RIFF/WAVE header
// prepended before it's a file an <audio> element can decode.
export function pcmToWav(pcmData: Buffer, sampleRate = SAMPLE_RATE, channels = CHANNELS, bitDepth = BIT_DEPTH): Buffer {
  const byteRate = sampleRate * channels * (bitDepth / 8);
  const blockAlign = channels * (bitDepth / 8);
  const header = Buffer.alloc(44);
  header.write('RIFF', 0, 'ascii');
  header.writeUInt32LE(36 + pcmData.length, 4);
  header.write('WAVE', 8, 'ascii');
  header.write('fmt ', 12, 'ascii');
  header.writeUInt32LE(16, 16); // fmt chunk size (PCM)
  header.writeUInt16LE(1, 20); // audio format: 1 = PCM
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitDepth, 34);
  header.write('data', 36, 'ascii');
  header.writeUInt32LE(pcmData.length, 40);
  return Buffer.concat([header, pcmData]);
}

export class GeminiTtsService {
  readonly isConfigured: boolean;
  private readonly client: GoogleGenAI | null;
  private readonly model: string;
  private readonly cache = new Map<string, Buffer>();

  constructor(apiKey: string | undefined, model = DEFAULT_TTS_MODEL) {
    this.isConfigured = Boolean(apiKey);
    this.client = apiKey ? new GoogleGenAI({ apiKey }) : null;
    this.model = model;
  }

  async synthesize(text: string, voiceName: string): Promise<TtsResult> {
    if (!this.client) throw new Error('Gemini TTS not configured.');

    const cacheKey = createHash('sha256').update(`${this.model}\0${voiceName}\0${text}`).digest('hex');
    const cached = this.cache.get(cacheKey);
    if (cached) return { buffer: cached, mimeType: 'audio/wav' };

    // Segundo nível de cache, persistente entre reinícios/instâncias (o Map
    // acima é só em memória, então some a cada deploy e não é compartilhado
    // entre instâncias do Cloud Run) — ver podcastStorage.ts.
    const stored = await readCachedAudio(cacheKey);
    if (stored) {
      this.rememberInMemory(cacheKey, stored);
      return { buffer: stored, mimeType: 'audio/wav' };
    }

    const response = await this.client.models.generateContent({
      model: this.model,
      contents: text,
      config: {
        responseModalities: ['audio'],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } },
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
    const base64Data = part?.inlineData?.data;
    if (!base64Data) throw new Error('Gemini TTS returned no audio data.');

    const wav = pcmToWav(Buffer.from(base64Data, 'base64'));
    this.rememberInMemory(cacheKey, wav);
    // Não bloqueia a resposta pro usuário — o upload falhando (ou demorando)
    // só significa que a próxima chamada regenera, igual a hoje.
    void writeCachedAudio(cacheKey, wav);

    return { buffer: wav, mimeType: 'audio/wav' };
  }

  // Cache em memória com limite: mesmo episódio/voz nunca precisa ser
  // regenerado duas vezes na mesma instância, mantendo replays instantâneos
  // e gratuitos. Entrada mais antiga é descartada quando o limite é atingido.
  private rememberInMemory(cacheKey: string, buffer: Buffer): void {
    if (this.cache.size >= MAX_CACHE_ENTRIES) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) this.cache.delete(oldestKey);
    }
    this.cache.set(cacheKey, buffer);
  }
}
