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

// Calls the server's Gemini-TTS-backed narration endpoint and returns a
// playable audio blob. Requires sign-in — same guardrail as every other AI
// feature in the app, since each call has a real (small) cost.
export async function synthesizePodcastAudio(text: string, voiceName: string): Promise<Blob> {
  const idToken = await getFirebaseIdToken();
  if (!idToken) {
    throw new PodcastAudioError('Entre na sua conta para ouvir com voz natural.', 401, 'AUTH_REQUIRED');
  }

  const response = await fetch('/api/podcast-audio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
    body: JSON.stringify({ text, voiceName }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as PodcastAudioErrorBody;
    throw new PodcastAudioError(
      body.error || 'Não foi possível gerar o áudio agora.',
      response.status,
      body.code,
    );
  }

  return response.blob();
}

export function podcastAudioErrorMessage(error: unknown): string {
  return error instanceof PodcastAudioError ? error.message : 'Não foi possível gerar o áudio agora.';
}
