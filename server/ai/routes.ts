import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { AiGenerationError, AiTimeoutError, AiUnavailableError, AiValidationError } from './errors';
import { buildAiPrompt } from './prompts';
import { AiService } from './service';
import { AiTask } from './types';
import { validateAiPayload } from './validation';
import { estimateAiCostUsd } from './cost';
import { AiMetricsRecorder } from './metrics';

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

export function createAiRouter(service: AiService, metrics?: AiMetricsRecorder): Router {
  const router = Router();

  for (const { path, task } of ROUTES) {
    router.post(path, async (req, res) => {
      const requestId = randomUUID();
      const startedAt = Date.now();
      try {
        const payload = validateAiPayload(task, req.body);
        const result = await service.generate({ task, prompt: buildAiPrompt(task, payload), userId: res.locals.userId });
        const durationMs = Date.now() - startedAt;
        const estimatedCostUsd = estimateAiCostUsd(result.model, result.usage);
        console.info(JSON.stringify({ event: 'ai_request', requestId, userId: res.locals.userId, task, model: result.model, provider: result.provider, usage: result.usage, estimatedCostUsd, fallback: result.fallback, cached: result.cached, status: 200, durationMs }));
        metrics?.record({ task, model: result.model, usage: result.usage, estimatedCostUsd, fallback: result.fallback, cached: result.cached, status: 200, durationMs })
          .catch((metricError) => console.error('AI metrics write failed:', metricError));
        res.json({ ...result, requestId });
      } catch (error) {
        const durationMs = Date.now() - startedAt;
        let status = 502;
        let code = 'AI_GENERATION_FAILED';
        let message = 'Falha ao processar solicitação de IA';

        if (error instanceof AiValidationError) {
          status = 400; code = 'INVALID_AI_REQUEST'; message = error.message;
        } else if (error instanceof AiUnavailableError) {
          status = 503; code = 'AI_UNAVAILABLE'; message = error.message;
        } else if (error instanceof AiTimeoutError) {
          status = 504; code = 'AI_TIMEOUT'; message = error.message;
        } else {
          const cause = error instanceof AiGenerationError ? error.cause : error;
          console.error(`[AI ${requestId}] ${task} failed:`, cause ?? error);
        }

        console.info(JSON.stringify({ event: 'ai_request', requestId, userId: res.locals.userId, task, status, durationMs }));
        metrics?.record({ task, status, durationMs })
          .catch((metricError) => console.error('AI metrics write failed:', metricError));

        return res.status(status).json({ error: message, code, requestId });
      }
    });
  }

  return router;
}
