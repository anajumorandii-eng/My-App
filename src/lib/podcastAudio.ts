import { podcastWavDuration, readPodcastCues, type PodcastCue } from './podcastTiming';
import { splitPodcastScript, mergePodcastWav } from './podcastChunks';
import type { PodcastSpeechOptions } from './podcastConfig';
import { getFirebaseIdToken } from './auth';

export class PodcastAudioError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = 'PodcastAudioError';
  }
}

interface PodcastAudioErrorBody {
  error?: string;
  code?: string;
}

// A autenticação acompanha todos os trechos porque a síntese tem custo por uso.
export async function synthesizePodcastAudio(text: string, voiceName: string, options?: PodcastSpeechOptions, control?: { signal?: AbortSignal; onProgress?: (completed: number, total: number) => void; onCues?: (cues: PodcastCue[]) => void }): Promise<Blob> {
  const chunks = splitPodcastScript(text, options?.speakers === 2);
  const parts: Uint8Array[] = [];
  const cues: PodcastCue[] = [];
  let offset = 0;
  const idToken = await getFirebaseIdToken();
  if (!idToken) {
    throw new PodcastAudioError('Entre na sua conta para ouvir com voz natural.', 401, 'AUTH_REQUIRED');
  }

  for (const chunk of chunks) {
    control?.signal?.throwIfAborted();
    const timeout = AbortSignal.timeout(160000);
    const signal = control?.signal ? AbortSignal.any([control.signal, timeout]) : timeout;
    const response = await fetch('/api/podcast-audio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
      body: JSON.stringify({ text: chunk, voiceName, options }),
      signal,
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as PodcastAudioErrorBody;
      throw new PodcastAudioError(
        body.error || 'Não foi possível gerar o áudio agora.',
        response.status,
        body.code,
      );
    }

    const audio = new Uint8Array(await response.arrayBuffer());
    const duration = podcastWavDuration(audio);
    const marked = readPodcastCues(audio);
    const normalize = (value: string) => value.replace(/^Host[12]:\s*/gm, '').replace(/\s+/g, ' ').trim();
    const timing = marked.length && normalize(marked.map(cue => cue.text).join(' ')) === normalize(chunk) ? marked : [{ start: 0, end: duration, text: chunk }];
    cues.push(...timing.map(cue => ({ ...cue, start: cue.start + offset, end: cue.end + offset })));
    offset += duration; parts.push(audio);
    control?.onProgress?.(parts.length, chunks.length);
  }
  control?.signal?.throwIfAborted();
  const merged = mergePodcastWav(parts);
  control?.onCues?.(cues);
  return new Blob([merged], { type: 'audio/wav' });
}

export function podcastAudioErrorMessage(error: unknown): string {
  if (error instanceof PodcastAudioError) return error.message;
  if (error instanceof DOMException && ['TimeoutError', 'AbortError'].includes(error.name)) return 'A geração do áudio demorou demais. Tente novamente; os trechos concluídos ficam em cache.';
  return error instanceof Error ? error.message : 'Não foi possível gerar o áudio agora.';
}

export async function fetchPodcastVoices(signal?: AbortSignal): Promise<{ provider: string; voices: import('./podcastConfig').PodcastVoiceOption[] }> {
  const idToken = await getFirebaseIdToken();
  if (!idToken) throw new PodcastAudioError('Conecte sua conta para escolher as vozes.', 401, 'AUTH_REQUIRED');
  const timeout = AbortSignal.timeout(25000);
  const response = await fetch('/api/podcast-audio/voices', { headers: { Authorization: `Bearer ${idToken}` }, signal: signal ? AbortSignal.any([signal, timeout]) : timeout });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new PodcastAudioError(body.error || 'Não foi possível consultar as vozes.', response.status, body.code);
  if (!Array.isArray(body.voices) || !body.voices.length || body.voices.some((v: any) => typeof v.value !== 'string' || typeof v.label !== 'string')) throw new PodcastAudioError('O catálogo de vozes está indisponível.');
  return { provider: body.provider, voices: body.voices };
}
