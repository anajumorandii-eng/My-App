import { reviewFormatSources } from './reviewFormatSources';
import type { ReviewOptions } from '../../src/lib/strategicReview';
import { getReviewedApostilaReference } from '../../src/lib/reviewedApostilaReferences';
import { hasCorruptedApostilaText } from '../../src/lib/apostilaTextQuality';
import { withinCaptureBudget, type EvaluationService } from './evaluation';
import type { EvaluationRun } from '../../src/features/ai-evaluation/types';
import { isEvaluationAdmin } from './evaluationRoutes';
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
  { path: '/error-diagnosis', task: 'error-diagnosis' },
  { path: '/question-explanation', task: 'question-explanation' },
  { path: '/backlog-exercise', task: 'backlog-exercise' },
  { path: '/backlog-correction', task: 'backlog-correction' },
  { path: '/discursive-feedback', task: 'discursive-feedback' },
  { path: '/podcast-script', task: 'podcast-script' },
  { path: '/progress-insight', task: 'progress-insight' },
  { path: '/review-tip', task: 'review-tip' },
  { path: '/method-example', task: 'method-example' },
];

export function createAiRouter(service: AiService, metrics?: AiMetricsRecorder, apostilaReferences?: ApostilaReferenceStore, evaluation?: EvaluationService): Router {
  const router = Router();

  for (const { path, task } of ROUTES) {
    router.post(path, async (req, res) => {
      const requestId = randomUUID();
      res.setHeader('X-Request-Id', requestId);
      const startedAt = Date.now();
      let evaluationRun: EvaluationRun | null = null;
      let evaluationCapture: 'inactive' | 'saved' | 'failed' = 'inactive';
      let firstTokenMs: number | null = null;
      let partialText = '';
      let generationStartedAt = startedAt;
      const finishCapture = async (result: import('./types').AiGenerationResult | null) => {
        if (!evaluation || !evaluationRun) return;
        try {
          await withinCaptureBudget(evaluation.finish(res.locals.userId, evaluationRun, result, Date.now() - generationStartedAt, firstTokenMs, partialText));
          evaluationCapture = 'saved';
        } catch { evaluationCapture = 'failed'; console.warn('AI evaluation capture failed.'); }
      };
      try {
        const payload = validateAiPayload(task, req.body);
        const serverSources: import('../../src/lib/studySources').StudySource[] = [];

        if (task === 'review-tip' && payload.guideMode === 'review-summary') {
          const formats = reviewFormatSources((payload.reviewOptions as ReviewOptions).boards);
          serverSources.push(...formats);
          if (formats.length) payload.referenceText = `${payload.referenceText ?? ''}\n\n${formats.map(source => `[${source.id}] ${source.title}\nFonte: ${source.url}\n${source.content}`).join('\n\n')}`;
        }

        if (!(task === 'review-tip' && payload.guideMode === 'review-summary' && (payload.reviewOptions as ReviewOptions).sourceMode !== 'catalog') && ['content-explanation', 'review-tip', 'podcast-script'].includes(task) && typeof payload.topic === 'string' && typeof payload.subject === 'string') {
          try {
            const reference = getReviewedApostilaReference(payload.subject, payload.topic, typeof payload.chapter === 'string' ? payload.chapter : '')
              ?? await apostilaReferences?.getReference(payload.subject, payload.topic);
            if (reference && !hasCorruptedApostilaText(reference.text)) {
              const material = reference.text.slice(0, MAX_REFERENCE_CHARS_IN_PROMPT);
              payload.apostilaReference = material;
              if (task !== 'content-explanation') serverSources.push({ id: 'AS1', title: `Apostila: ${reference.subject} — ${reference.topicName}`, kind: 'resumo', content: material, excerpt: reference.excerpt || reference.text.length > material.length, ...(reference.url ? { url: reference.url } : {}), ...(reference.format ? { format: reference.format } : {}) });
              if (task === 'review-tip') payload.referenceText = `${payload.referenceText ?? ''}\n\n[AS1] Apostila do servidor: ${reference.subject} — ${reference.topicName}; trecho complementar\n${material}`;
              if (task === 'podcast-script') payload.sourceText = `${payload.sourceText ?? ''}\n\n[AS1] Apostila do servidor: ${reference.subject} — ${reference.topicName}; trecho complementar\n${material}`;
            }
          } catch (referenceError) {
            console.error('Falha ao buscar referência da apostila (seguindo sem grounding):', referenceError);
          }
        }

        const request = { task, prompt: buildAiPrompt(task, payload), userId: res.locals.userId as string | undefined };

        if (evaluation && isEvaluationAdmin(res.locals)) {
          try {
            evaluationRun = await withinCaptureBudget(evaluation.begin(res.locals.userId, { task, payload, requestId, prompt: request.prompt, source: String(req.get('X-Crivo-Source') ?? ''), ...service.describeTask(task) }));
          } catch { evaluationCapture = 'failed'; console.warn('AI evaluation capture failed.'); }
        }
        generationStartedAt = Date.now();

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
          const disconnected = new AbortController();
          const stream = service.generateStream({ ...request, signal: disconnected.signal });
          const onClose = () => {
            if (!res.writableEnded) disconnected.abort();
          };
          res.on('close', onClose);

          try {
            for (;;) {
              const passo = await stream.next();
              disconnected.signal.throwIfAborted();
              if (passo.done === true) {
                const result = passo.value;
                if (!result) throw new AiGenerationError('O fluxo terminou sem confirmar a conclusão.');
                const durationMs = Date.now() - startedAt;
                const estimatedCostUsd = estimateAiCostUsd(result.model, result.usage);
                console.info(JSON.stringify({ event: 'ai_request', requestId, userId: res.locals.userId, task, model: result.model, provider: result.provider, usage: result.usage, estimatedCostUsd, fallback: result.fallback, cached: result.cached, streamed: true, status: 200, durationMs }));
                metrics?.record({ task, model: result.model, usage: result.usage, estimatedCostUsd, fallback: result.fallback, cached: result.cached, status: 200, durationMs })
                  .catch((metricError) => console.error('AI metrics write failed:', metricError));
                await finishCapture(result);
                res.write(sseFrame({ done: true, ...result, requestId, evaluationCapture, ...(serverSources.length ? { serverSources } : {}) }));
                return res.end();
              }
              if (firstTokenMs === null && passo.value) firstTokenMs = Date.now() - generationStartedAt;
              partialText = (partialText + passo.value).slice(0, 64_001);
              res.write(sseFrame({ delta: passo.value }));
              // O middleware de compressão segura os pedaços até encher o
              // buffer; sem este flush o streaming chegaria tudo de uma vez.
              (res as unknown as { flush?: () => void }).flush?.();
            }
          } catch (streamError) {
            if (disconnected.signal.aborted || res.destroyed) {
              const durationMs = Date.now() - startedAt;
              console.info(JSON.stringify({ event: 'ai_request', requestId, userId: res.locals.userId, task, streamed: true, status: 499, durationMs, cancelled: true }));
              metrics?.record({ task, status: 499, durationMs })
                .catch(() => console.warn('AI cancellation metrics write failed.'));
              await finishCapture(null);
              return;
            }
            // Cabeçalho já foi enviado: o erro tem que ir pelo próprio fluxo,
            // não como status HTTP.
            const durationMs = Date.now() - startedAt;
            const isTimeout = streamError instanceof AiTimeoutError;
            console.error(`[AI ${requestId}] ${task} stream failed:`, streamError);
            console.info(JSON.stringify({ event: 'ai_request', requestId, userId: res.locals.userId, task, streamed: true, status: isTimeout ? 504 : 502, durationMs }));
            metrics?.record({ task, status: isTimeout ? 504 : 502, durationMs })
              .catch((metricError) => console.error('AI metrics write failed:', metricError));
            await finishCapture(null);
            res.write(sseFrame({
              evaluationCapture,
              error: isTimeout ? 'A resposta demorou mais do que o esperado. Tente novamente.' : 'Falha ao processar solicitação de IA',
              code: isTimeout ? 'AI_TIMEOUT' : 'AI_GENERATION_FAILED',
              requestId,
            }));
            return res.end();
          } finally {
            res.off('close', onClose);
            disconnected.abort();
            try { await stream.return?.(undefined as never); } catch { console.warn('AI stream cleanup failed.'); }
            if (evaluationRun?.status === 'running') await finishCapture(null);
          }
        }

        const result = await service.generate(request);
        const durationMs = Date.now() - startedAt;
        const estimatedCostUsd = estimateAiCostUsd(result.model, result.usage);
        console.info(JSON.stringify({ event: 'ai_request', requestId, userId: res.locals.userId, task, model: result.model, provider: result.provider, usage: result.usage, estimatedCostUsd, fallback: result.fallback, cached: result.cached, status: 200, durationMs }));
        metrics?.record({ task, model: result.model, usage: result.usage, estimatedCostUsd, fallback: result.fallback, cached: result.cached, status: 200, durationMs })
          .catch((metricError) => console.error('AI metrics write failed:', metricError));
        await finishCapture(result);
        res.json({ ...result, requestId, evaluationCapture, ...(serverSources.length ? { serverSources } : {}) });
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

        await finishCapture(null);
        return res.status(status).json({ error: message, code, requestId, evaluationCapture });
      }
    });
  }

  return router;
}
