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
// O cache em memória é limitado por BYTES, não por número de entradas. Um
// roteiro de 2.000 caracteres — o teto que routes.ts aceita — vira cerca de
// dois minutos de fala, e a 24 kHz/16 bits/mono isso dá ~6 MB de WAV. Com o
// limite antigo de 200 entradas, o cache sozinho passava de 1 GB, contra os
// 512 MiB que o Cloud Run dá por padrão (o Dockerfile não pede outro valor).
// E como há 87 episódios × 4 vozes, ele enchia mesmo em uso normal.
const MAX_CACHE_BYTES = 64 * 1024 * 1024;

// A Gemini devolve o PCM com a taxa declarada no mimeType
// (audio/L16;codec=pcm;rate=24000). Ler dali, em vez de assumir 24 kHz, evita
// que uma mudança de taxa no modelo produza um cabeçalho WAV errado — o áudio
// não falharia, tocaria acelerado ou arrastado, que é bem pior de diagnosticar.
export function sampleRateFromMimeType(mimeType: string | undefined): number {
  const match = /rate=(\d+)/.exec(mimeType ?? '');
  const rate = match ? Number(match[1]) : NaN;
  return Number.isFinite(rate) && rate > 0 ? rate : SAMPLE_RATE;
}

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
  private cacheBytes = 0;

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

    const wav = pcmToWav(Buffer.from(base64Data, 'base64'), sampleRateFromMimeType(part?.inlineData?.mimeType));
    this.rememberInMemory(cacheKey, wav);
    // Não bloqueia a resposta pro usuário — o upload falhando (ou demorando)
    // só significa que a próxima chamada regenera, igual a hoje.
    void writeCachedAudio(cacheKey, wav);

    return { buffer: wav, mimeType: 'audio/wav' };
  }

  // Cache em memória: mesmo episódio/voz não precisa ser regenerado duas vezes
  // na mesma instância, mantendo replays instantâneos e gratuitos. As entradas
  // mais antigas são descartadas até o total caber em MAX_CACHE_BYTES. Perder
  // uma entrada aqui não custa uma nova síntese: o áudio continua no Storage,
  // e readCachedAudio o traz de volta.
  private rememberInMemory(cacheKey: string, buffer: Buffer): void {
    const existing = this.cache.get(cacheKey);
    if (existing) this.cacheBytes -= existing.length;
    this.cache.set(cacheKey, buffer);
    this.cacheBytes += buffer.length;

    for (const oldestKey of this.cache.keys()) {
      if (this.cacheBytes <= MAX_CACHE_BYTES) break;
      // Nunca descarta o que acabou de entrar, mesmo que ele sozinho estoure o
      // limite: sem isso um áudio grande seria gravado e removido no mesmo
      // passo, e o cache nunca serviria para nada.
      if (oldestKey === cacheKey) continue;
      this.cacheBytes -= this.cache.get(oldestKey)!.length;
      this.cache.delete(oldestKey);
    }
  }
}
