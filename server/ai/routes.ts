import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { AiGenerationError, AiTimeoutError, AiUnavailableError, AiValidationError } from './errors';
import { buildAiPrompt } from './prompts';
import { AiService } from './service';
import { AiTask } from './types';
import { validateAiPayload } from './validation';

const ROUTES: Array<{ path: string; task: AiTask }> = [
  { path: '/socratic', task: 'socratic' },
  { path: '/error-hypothesis', task: 'error-hypothesis' },
  { path: '/question-explanation', task: 'question-explanation' },
  { path: '/backlog-exercise', task: 'backlog-exercise' },
  { path: '/backlog-correction', task: 'backlog-correction' },
  { path: '/discursive-feedback', task: 'discursive-feedback' },
  { path: '/podcast-script', task: 'podcast-script' },
  { path: '/progress-insight', task: 'progress-insight' },
  { path: '/review-tip', task: 'review-tip' },
  { path: '/method-example', task: 'method-example' },
];

export function createAiRouter(service: AiService): Router {
  const router = Router();

  for (const { path, task } of ROUTES) {
    router.post(path, async (req, res) => {
      const requestId = randomUUID();
      try {
        const payload = validateAiPayload(task, req.body);
        const result = await service.generate({ task, prompt: buildAiPrompt(task, payload) });
        res.json({ ...result, requestId });
      } catch (error) {
        if (error instanceof AiValidationError) {
          return res.status(400).json({ error: error.message, code: 'INVALID_AI_REQUEST', requestId });
        }
        if (error instanceof AiUnavailableError) {
          return res.status(503).json({ error: error.message, code: 'AI_UNAVAILABLE', requestId });
        }
        if (error instanceof AiTimeoutError) {
          return res.status(504).json({ error: error.message, code: 'AI_TIMEOUT', requestId });
        }

        const cause = error instanceof AiGenerationError ? error.cause : error;
        console.error(`[AI ${requestId}] ${task} failed:`, cause ?? error);
        return res.status(502).json({
          error: 'Falha ao processar solicitação de IA',
          code: 'AI_GENERATION_FAILED',
          requestId,
        });
      }
    });
  }

  return router;
}

