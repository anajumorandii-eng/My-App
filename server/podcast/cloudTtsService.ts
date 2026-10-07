import { createHash } from 'node:crypto';
import { google } from 'googleapis';
import type { PodcastSpeechOptions } from '../../src/lib/podcastConfig';
import { mergePodcastWav } from '../../src/lib/podcastChunks';
import { pcmToWav, type TtsResult } from './ttsService';
import { readCachedAudio, writeCachedAudio } from './podcastStorage';

export interface PodcastVoice { value: string; label: string; gender?: string; }
export interface PodcastTtsService {
  readonly isConfigured: boolean;
  readonly provider?: string;
  getVoices?(): Promise<PodcastVoice[]>;
  synthesize(text: string, voiceName: string, options?: PodcastSpeechOptions, signal?: AbortSignal): Promise<TtsResult>;
}
interface CloudVoice { name?: string | null; languageCodes?: string[] | null; ssmlGender?: string | null; }
interface CloudRequest { input: { text: string }; voice: { languageCode: string; name: string }; audioConfig: { audioEncoding: string; sampleRateHertz: number; speakingRate: number }; }
export interface CloudTtsClient {
  listVoices(): Promise<{ voices?: CloudVoice[] | null }>;
  synthesize(body: CloudRequest, signal?: AbortSignal): Promise<{ audioContent?: string | null }>;
}
interface AudioStore { read(key: string): Promise<Buffer | null>; write(key: string, buffer: Buffer): Promise<void>; }

export class PodcastTtsValidationError extends Error {}

export class CloudTtsService implements PodcastTtsService {
  readonly provider = 'google-cloud';
  // A identidade gerenciada é obtida na primeira chamada. A prontidão só é
  // confirmada quando o catálogo ou a síntese respondem com sucesso.
  readonly isConfigured = true;
  private readonly client: CloudTtsClient;
  private readonly store: AudioStore;
  private voices: PodcastVoice[] = [];
  private voicesExpiresAt = 0;
  private voicesRequest: Promise<PodcastVoice[]> | null = null;
  private readonly cache = new Map<string, Buffer>();
  private cacheBytes = 0;
  private readonly flights = new Map<string, { promise: Promise<Buffer>; controller: AbortController; users: number }>();
  constructor(options: { client?: CloudTtsClient; cache?: AudioStore; projectId?: string } = {}) {
    const api = options.client ? null : google.texttospeech({ version: 'v1', auth: new google.auth.GoogleAuth({ scopes: ['https://www.googleapis.com/auth/cloud-platform'], ...(options.projectId ? { quotaProjectId: options.projectId } : {}) }) });
    this.client = options.client ?? {
      listVoices: async () => (await api!.voices.list({ languageCode: 'pt-BR' }, { timeout: 20000 })).data,
      synthesize: async (body, signal) => (await api!.text.synthesize({ requestBody: body }, { timeout: 120000, signal })).data,
    };
    this.store = options.cache ?? { read: readCachedAudio, write: writeCachedAudio };
  }
  async getVoices(): Promise<PodcastVoice[]> {
    if (this.voices.length && Date.now() < this.voicesExpiresAt) return this.voices;
    if (!this.voicesRequest) {
      this.voicesRequest = this.client.listVoices().then(result => {
        const voices = (result.voices ?? [])
          .filter(voice => voice.name && voice.languageCodes?.includes('pt-BR'))
          .map(voice => ({ value: voice.name!, label: voice.name!.replace(/^pt-BR-/, '').replace('Chirp3-HD-', 'Chirp HD · '), gender: voice.ssmlGender ?? undefined }))
          .sort((a, b) => Number(b.value.includes('Chirp3-HD')) - Number(a.value.includes('Chirp3-HD')) || a.value.localeCompare(b.value));
        if (!voices.length) throw new Error('O serviço não retornou vozes em português brasileiro.');
        this.voices = voices; this.voicesExpiresAt = Date.now() + 300000; return voices;
      }).finally(() => { this.voicesRequest = null; });
    }
    return this.voicesRequest;
  }
  async resolveVoice(value: string): Promise<string> {
    const voices = await this.getVoices();
    const match = voices.find(v => v.value === value) ?? (/^[A-Za-z]+$/.test(value) ? voices.find(v => v.value.endsWith(`Chirp3-HD-${value}`)) : undefined);
    if (!match) throw new PodcastTtsValidationError('Esta voz não está disponível. Escolha uma voz no catálogo atualizado.');
    return match.value;
  }
  async synthesize(text: string, voiceName: string, options?: PodcastSpeechOptions, signal?: AbortSignal): Promise<TtsResult> {
    if (!text.trim() || Buffer.byteLength(text, 'utf8') > 5000) throw new PodcastTtsValidationError('O trecho excede o limite de texto do serviço de voz.');
    const voice = await this.resolveVoice(voiceName);
    const secondVoice = options?.speakers === 2 ? await this.resolveVoice(options.secondVoice) : voice;
    if (options?.speakers === 2 && voice === secondVoice) throw new PodcastTtsValidationError('Escolha vozes diferentes para as duas pessoas.');
    const lines = options?.speakers === 2 ? text.split('\n').filter(line => line.trim()).map(line => {
      const match = /^Host([12]):\s*(.+)$/.exec(line);
      if (!match) throw new PodcastTtsValidationError('O diálogo precisa identificar cada fala como Host1: ou Host2:.');
      return { text: match[2], voice: match[1] === '1' ? voice : secondVoice };
    }) : [{ text, voice }];
    const rate = options?.pace === 'tranquilo' ? 0.9 : options?.pace === 'dinamico' ? 1.1 : 1;
    const key = createHash('sha256').update(JSON.stringify(['cloud-tts', voice, secondVoice, rate, text])).digest('hex');
    const deadline = AbortSignal.timeout(140000);
    const requestSignal = signal ? AbortSignal.any([signal, deadline]) : deadline;
    const buffer = await this.cachedAudio(key, async combinedSignal => {
      const parts: Buffer[] = [];
      for (const [i, line] of lines.entries()) {
        combinedSignal.throwIfAborted();
        const lineKey = createHash('sha256').update(JSON.stringify(['cloud-utterance', line.voice, rate, line.text])).digest('hex');
        const audio = await this.cachedAudio(lineKey, async turnSignal => {
          const result = await this.client.synthesize({ input: { text: line.text }, voice: { languageCode: 'pt-BR', name: line.voice }, audioConfig: { audioEncoding: 'LINEAR16', sampleRateHertz: 24000, speakingRate: rate } }, turnSignal);
          if (!result.audioContent) throw new Error('O serviço de voz retornou áudio vazio.');
          return Buffer.from(mergePodcastWav([Buffer.from(result.audioContent, 'base64')]));
        }, combinedSignal);
        if (i) parts.push(pcmToWav(Buffer.alloc(24000 * 2 * (options?.pace === 'tranquilo' ? 0.35 : 0.2))));
        parts.push(audio);
      }
      return Buffer.from(mergePodcastWav(parts));
    }, requestSignal);
    return { buffer, mimeType: 'audio/wav' };
  }
  private async cachedAudio(key: string, create: (signal: AbortSignal) => Promise<Buffer>, signal: AbortSignal): Promise<Buffer> {
    signal.throwIfAborted();
    const cached = this.cache.get(key);
    if (cached) return cached;
    let flight = this.flights.get(key);
    if (!flight) {
      const controller = new AbortController();
      const next = { promise: Promise.resolve(Buffer.alloc(0)), controller, users: 0 };
      next.promise = (async () => {
        const stored = await this.store.read(key); controller.signal.throwIfAborted();
        const buffer = stored ?? await create(controller.signal);
        this.remember(key, buffer);
        if (!stored) void this.store.write(key, buffer).catch(() => {});
        return buffer;
      })().finally(() => { if (this.flights.get(key) === next) this.flights.delete(key); });
      this.flights.set(key, next); flight = next;
    }
    const shared = flight; shared.users++;
    return new Promise<Buffer>((resolve, reject) => {
      let released = false;
      const release = () => {
        if (released) return; released = true; signal.removeEventListener('abort', abort); shared.users--;
        if (!shared.users && this.flights.get(key) === shared) { this.flights.delete(key); shared.controller.abort(); }
      };
      const abort = () => { release(); reject(signal.reason); };
      signal.addEventListener('abort', abort, { once: true });
      shared.promise.then(value => { release(); resolve(value); }, error => { release(); reject(error); });
      if (signal.aborted) abort();
    });
  }
  private remember(key: string, buffer: Buffer) {
    if (buffer.length > 64 * 1024 * 1024) return;
    const previous = this.cache.get(key); if (previous) this.cacheBytes -= previous.length;
    this.cache.set(key, buffer); this.cacheBytes += buffer.length;
    for (const oldest of this.cache.keys()) { if (this.cacheBytes <= 64 * 1024 * 1024) break; this.cacheBytes -= this.cache.get(oldest)!.length; this.cache.delete(oldest); }
  }
}
