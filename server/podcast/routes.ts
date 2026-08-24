import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { GeminiTtsService } from './ttsService';

const MAX_TEXT_LENGTH = 2000;

// Curated subset of Gemini's ~30 prebuilt voices, picked for a warm,
// intelligible narrator tone rather than exposing the full catalog blind.
export const PODCAST_VOICES = ['Charon', 'Kore', 'Aoede', 'Puck'] as const;
export const DEFAULT_PODCAST_VOICE = 'Charon';

function resolveVoiceName(value: unknown): string {
  return typeof value === 'string' && (PODCAST_VOICES as readonly string[]).includes(value)
    ? value
    : DEFAULT_PODCAST_VOICE;
}

export function createPodcastAudioRouter(ttsService: GeminiTtsService): Router {
  const router = Router();

  router.post('/', async (req, res) => {
    const requestId = randomUUID();
    const startedAt = Date.now();
    const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
    const voiceName = resolveVoiceName(req.body?.voiceName);

    if (!text) {
      return res.status(400).json({ error: 'O texto do episódio é obrigatório.', code: 'INVALID_TTS_REQUEST', requestId });
    }
    if (text.length > MAX_TEXT_LENGTH) {
      return res.status(400).json({
        error: `O texto excede o limite de ${MAX_TEXT_LENGTH} caracteres.`,
        code: 'INVALID_TTS_REQUEST',
        requestId,
      });
    }
    if (!ttsService.isConfigured) {
      return res.status(503).json({
        error: 'Narração com voz natural não está disponível no momento.',
        code: 'TTS_UNAVAILABLE',
        requestId,
      });
    }

    try {
      const { buffer, mimeType } = await ttsService.synthesize(text, voiceName);
      const durationMs = Date.now() - startedAt;
      console.info(JSON.stringify({ event: 'podcast_tts_request', requestId, userId: res.locals.userId, voiceName, textLength: text.length, status: 200, durationMs }));
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Cache-Control', 'private, max-age=86400');
      res.setHeader('X-Request-Id', requestId);
      res.send(buffer);
    } catch (error) {
      const durationMs = Date.now() - startedAt;
      console.error(`[TTS ${requestId}] synthesis failed:`, error);
      console.info(JSON.stringify({ event: 'podcast_tts_request', requestId, userId: res.locals.userId, voiceName, textLength: text.length, status: 502, durationMs }));
      res.status(502).json({
        error: 'Não foi possível gerar o áudio agora. Tente novamente.',
        code: 'TTS_GENERATION_FAILED',
        requestId,
      });
    }
  });

  return router;
}
