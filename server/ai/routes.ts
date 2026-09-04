import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { AiGenerationError, AiTimeoutError, AiUnavailableError, AiValidationError } from './errors';
import { buildAiPrompt } from './prompts';
import { AiService } from './service';
import { AiTask } from './types';
import { validateAiPayload } from './validation';
import { estimateAiCostUsd } from './cost';
import { AiMetricsRecorder } from './metrics';
import { ApostilaReferenceStore } from './apostilaReferenceStore';

// Prompt já é grande o bastante sem precisar de um trecho de apostila
// inteiro — isso aqui é só grounding factual/terminológico, não a fonte
// primária de conteúdo.
const MAX_REFERENCE_CHARS_IN_PROMPT = 3000;

/**
 * A mesma rota atende JSON e SSE. Quem não pede streaming continua recebendo
 * { text }, exatamente como antes — nenhuma tela precisa mudar de uma vez.
 */
function wantsStream(req: { headers: Record<string, unknown>; query: Record<string, unknown> }): boolean {
  const accept = String(req.headers.accept ?? '');
  return accept.includes('text/event-stream') || req.query.stream === '1';
}

function sseFrame(payload: unknown): string {
  return `data: ${JSON.stringify(payload)}\n\n`;
}

const ROUTES: Array<{ path: string; task: AiTask }> = [
  { path: '/socratic', task: 'socratic' },
  { path: '/content-explanation', task: 'content-explanation' },
  { path: '/answer-correction', task: 'answer-correction' },
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

export function createAiRouter(service: AiService, metrics?: AiMetricsRecorder, apostilaReferences?: ApostilaReferenceStore): Router {
  const router = Router();

  for (const { path, task } of ROUTES) {
    router.post(path, async (req, res) => {
      const requestId = randomUUID();
      const startedAt = Date.now();
      try {
        const payload = validateAiPayload(task, req.body);

        if (task === 'content-explanation' && apostilaReferences && typeof payload.topic === 'string' && typeof payload.subject === 'string') {
          try {
            const reference = await apostilaReferences.getReference(payload.subject, payload.topic);
            if (reference) payload.apostilaReference = reference.text.slice(0, MAX_REFERENCE_CHARS_IN_PROMPT);
          } catch (referenceError) {
            console.error('Falha ao buscar referência da apostila (seguindo sem grounding):', referenceError);
          }
        }

        const request = { task, prompt: buildAiPrompt(task, payload), userId: res.locals.userId as string | undefined };

        if (wantsStream(req as never) && service.supportsStreaming) {
          // Cabeçalhos antes do primeiro pedaço, e sem buffer no caminho: o
          // ganho todo do streaming é o texto aparecer enquanto é escrito.
          res.status(200);
          res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
          res.setHeader('Cache-Control', 'no-cache, no-transform');
          res.setHeader('Connection', 'keep-alive');
          res.setHeader('X-Accel-Buffering', 'no');
          res.flushHeaders();

          // Se a aluna fechar a tela, para de gerar em vez de seguir pagando
          // tokens por um texto que ninguém vai ler.
          //
          // Tem que ser o 'close' da RESPOSTA: o da requisição dispara assim
          // que o corpo do POST termina de chegar, o que abortaria o fluxo
          // logo no primeiro pedaço. E mesmo aqui é preciso checar
          // writableEnded, porque o evento também dispara no fim normal.
          const stream = service.generateStream(request);
          res.on('close', () => {
            if (!res.writableEnded) void stream.return?.(undefined as never);
          });

          try {
            for (;;) {
              const passo = await stream.next();
              if (passo.done === true) {
                const result = passo.value;
                const durationMs = Date.now() - startedAt;
                const estimatedCostUsd = estimateAiCostUsd(result.model, result.usage);
                console.info(JSON.stringify({ event: 'ai_request', requestId, userId: res.locals.userId, task, model: result.model, provider: result.provider, usage: result.usage, estimatedCostUsd, fallback: result.fallback, cached: result.cached, streamed: true, status: 200, durationMs }));
                metrics?.record({ task, model: result.model, usage: result.usage, estimatedCostUsd, fallback: result.fallback, cached: result.cached, status: 200, durationMs })
                  .catch((metricError) => console.error('AI metrics write failed:', metricError));
                res.write(sseFrame({ done: true, ...result, requestId }));
                return res.end();
              }
              res.write(sseFrame({ delta: passo.value }));
              // O middleware de compressão segura os pedaços até encher o
              // buffer; sem este flush o streaming chegaria tudo de uma vez.
              (res as unknown as { flush?: () => void }).flush?.();
            }
          } catch (streamError) {
            // Cabeçalho já foi enviado: o erro tem que ir pelo próprio fluxo,
            // não como status HTTP.
            const durationMs = Date.now() - startedAt;
            const isTimeout = streamError instanceof AiTimeoutError;
            console.error(`[AI ${requestId}] ${task} stream failed:`, streamError);
            console.info(JSON.stringify({ event: 'ai_request', requestId, userId: res.locals.userId, task, streamed: true, status: isTimeout ? 504 : 502, durationMs }));
            metrics?.record({ task, status: isTimeout ? 504 : 502, durationMs })
              .catch((metricError) => console.error('AI metrics write failed:', metricError));
            res.write(sseFrame({
              error: isTimeout ? 'A resposta demorou mais do que o esperado. Tente novamente.' : 'Falha ao processar solicitação de IA',
              code: isTimeout ? 'AI_TIMEOUT' : 'AI_GENERATION_FAILED',
              requestId,
            }));
            return res.end();
          }
        }

        const result = await service.generate(request);
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
          if (error instanceof AiGenerationError) message = error.message;
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
