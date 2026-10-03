import { PODCAST_PACES, PODCAST_TONES } from '../../src/lib/podcastConfig';
import type { PodcastSpeechOptions } from '../../src/lib/podcastConfig';
import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { PodcastTtsValidationError, type PodcastTtsService } from './cloudTtsService';
import { PODCAST_VOICE_OPTIONS } from '../../src/lib/podcastConfig';

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

export function createPodcastAudioRouter(ttsService: PodcastTtsService): Router {
  const router = Router();

  router.get('/voices', async (_req, res) => {
    try {
      const voices = ttsService.getVoices ? await ttsService.getVoices() : [...PODCAST_VOICE_OPTIONS];
      res.setHeader('Cache-Control', 'private, max-age=300');
      res.json({ provider: ttsService.provider ?? 'gemini', voices });
    } catch {
      res.status(503).json({ error: 'Não foi possível consultar as vozes. Confira o acesso do servidor à API de voz.', code: 'TTS_VOICES_UNAVAILABLE' });
    }
  });

  router.post('/', async (req, res) => {
    const requestId = randomUUID();
    const startedAt = Date.now();
    const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';
    const isCloud = ttsService.provider === 'google-cloud';
    const voiceName = isCloud && typeof req.body?.voiceName === 'string' ? req.body.voiceName : resolveVoiceName(req.body?.voiceName);

    let options: PodcastSpeechOptions | undefined;
    if (req.body?.options !== undefined) {
      const input = req.body.options;
      if (!input || typeof input !== 'object' || typeof input.pace !== 'string' || typeof input.tone !== 'string' || ![1, 2].includes(input.speakers) || !Object.hasOwn(PODCAST_PACES, input.pace) || !Object.hasOwn(PODCAST_TONES, input.tone) || (input.speakers === 2 && (isCloud ? typeof input.secondVoice !== 'string' || !input.secondVoice || input.secondVoice.length > 150 : !(PODCAST_VOICES as readonly string[]).includes(input.secondVoice))) || (input.speakers === 2 && input.secondVoice === voiceName)) {
        return res.status(400).json({ error: 'Escolha vozes distintas e configurações válidas.', code: 'INVALID_TTS_REQUEST', requestId });
      }
      options = { speakers: input.speakers, secondVoice: input.speakers === 2 ? input.secondVoice : voiceName, pace: input.pace, tone: input.tone };
    }

    if (voiceName.length > 150) return res.status(400).json({ error: 'Voz inválida.', code: 'INVALID_TTS_REQUEST', requestId });
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

    const controller = new AbortController();
    const abort = () => { if (!res.writableEnded) controller.abort(); };
    res.on('close', abort);
    try {
      const { buffer, mimeType } = await ttsService.synthesize(text, voiceName, options, controller.signal);
      const durationMs = Date.now() - startedAt;
      console.info(JSON.stringify({ event: 'podcast_tts_request', requestId, userId: res.locals.userId, voiceName, textLength: text.length, status: 200, durationMs }));
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Cache-Control', 'private, max-age=86400');
      res.setHeader('X-Request-Id', requestId);
      res.send(buffer);
    } catch (error) {
      if (error instanceof PodcastTtsValidationError) return res.status(400).json({ error: error.message, code: 'INVALID_TTS_REQUEST', requestId });
      const durationMs = Date.now() - startedAt;
      console.error(`[TTS ${requestId}] synthesis failed:`, error);
      console.info(JSON.stringify({ event: 'podcast_tts_request', requestId, userId: res.locals.userId, voiceName, textLength: text.length, status: 502, durationMs }));
      res.status(502).json({
        error: 'Não foi possível gerar o áudio agora. Tente novamente.',
        code: 'TTS_GENERATION_FAILED',
        requestId,
      });
    } finally { res.off('close', abort); }
  });

  return router;
}
