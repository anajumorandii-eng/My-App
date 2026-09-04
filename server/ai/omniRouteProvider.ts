import { AiGenerationError } from './errors';
import { AiGenerationRequest, AiProvider, AiProviderResult, AiStream, AiTask } from './types';

const DEFAULT_DEEP_MODEL = 'juju-deep-v1';
const DEFAULT_FAST_MODEL = 'juju-fast-v1';

const DEEP_TASKS = new Set<AiTask>([
  'socratic',
  'content-explanation',
  'answer-correction',
  'error-hypothesis',
  'question-explanation',
  'backlog-exercise',
  'backlog-correction',
  'discursive-feedback',
]);

export interface OmniRouteOptions {
  baseUrl: string | undefined;
  apiKey: string | undefined;
  deepModel?: string;
  fastModel?: string;
  fetch?: typeof fetch;
}

interface ChatCompletionUsage { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number }

interface ChatCompletionResponse {
  choices?: Array<{ message?: { content?: unknown } }>;
  usage?: ChatCompletionUsage;
}

interface ChatCompletionChunk {
  choices?: Array<{ delta?: { content?: unknown } }>;
  usage?: ChatCompletionUsage;
}

function toUsage(usage: ChatCompletionUsage | undefined) {
  return usage ? {
    promptTokens: usage.prompt_tokens,
    completionTokens: usage.completion_tokens,
    totalTokens: usage.total_tokens,
  } : undefined;
}

/**
 * Recorta os frames "data: ..." de um corpo SSE. O servidor pode partir a
 * resposta em qualquer ponto, inclusive no meio de uma linha, então o que
 * sobra sem \n fica no buffer para o próximo pedaço.
 */
export function* parseSseFrames(buffer: string): Generator<string, string, void> {
  let rest = buffer;
  let cut = rest.indexOf('\n');
  while (cut !== -1) {
    const line = rest.slice(0, cut).trim();
    rest = rest.slice(cut + 1);
    if (line.startsWith('data:')) yield line.slice(5).trim();
    cut = rest.indexOf('\n');
  }
  return rest;
}

function normalizedBaseUrl(value: string | undefined): string {
  return (value ?? '').trim().replace(/\/+$/, '');
}

export function selectOmniRouteModel(
  task: AiTask,
  deepModel = DEFAULT_DEEP_MODEL,
  fastModel = DEFAULT_FAST_MODEL,
): string {
  return DEEP_TASKS.has(task) ? deepModel : fastModel;
}

export class OmniRouteProvider implements AiProvider {
  readonly name = 'omniroute';
  readonly model = 'task-aware';
  readonly isConfigured: boolean;

  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly deepModel: string;
  private readonly fastModel: string;
  private readonly fetchFn: typeof fetch;

  constructor(options: OmniRouteOptions) {
    this.baseUrl = normalizedBaseUrl(options.baseUrl);
    this.apiKey = options.apiKey?.trim() ?? '';
    this.deepModel = options.deepModel?.trim() || DEFAULT_DEEP_MODEL;
    this.fastModel = options.fastModel?.trim() || DEFAULT_FAST_MODEL;
    this.fetchFn = options.fetch ?? fetch;
    this.isConfigured = Boolean(this.baseUrl && this.apiKey);
  }

  modelForTask(task: AiTask): string {
    return selectOmniRouteModel(task, this.deepModel, this.fastModel);
  }

  async generate({ task, prompt, signal }: AiGenerationRequest): Promise<AiProviderResult> {
    if (!this.isConfigured) throw new Error('OmniRoute API not configured.');

    const primaryModel = this.modelForTask(task);
    try {
      return await this.complete(primaryModel, prompt, signal);
    } catch (error) {
      if (primaryModel === this.fastModel || signal?.aborted) throw error;
      const fallback = await this.complete(this.fastModel, prompt, signal);
      return { ...fallback, fallback: true };
    }
  }

  /**
   * Mesma seleção de modelo e mesmo fallback do generate(), mas o fallback só
   * vale antes do primeiro pedaço de texto: depois que a aluna já começou a
   * ler, recomeçar com outro modelo trocaria a resposta debaixo dos olhos dela.
   */
  async *generateStream({ task, prompt, signal }: AiGenerationRequest): AiStream {
    if (!this.isConfigured) throw new Error('OmniRoute API not configured.');

    const primaryModel = this.modelForTask(task);
    let emitiu = false;

    try {
      return yield* this.streamComplete(primaryModel, prompt, signal, () => { emitiu = true; });
    } catch (error) {
      if (emitiu || primaryModel === this.fastModel || signal?.aborted) throw error;
      const fallback = yield* this.streamComplete(this.fastModel, prompt, signal);
      return { ...fallback, fallback: true };
    }
  }

  private async *streamComplete(model: string, prompt: string, signal?: AbortSignal, onDelta?: () => void): AiStream {
    const response = await this.fetchFn(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        stream: true,
        // Sem isto o total de tokens não vem no fluxo, e as métricas de custo
        // ficariam vazias justamente nas respostas mais longas.
        stream_options: { include_usage: true },
      }),
      signal,
    });

    if (!response.ok) throw new AiGenerationError(`OmniRoute respondeu com HTTP ${response.status}.`);
    if (!response.body) throw new AiGenerationError('OmniRoute não devolveu corpo para streaming.');

    const decoder = new TextDecoder();
    const reader = response.body.getReader();
    let buffer = '';
    let texto = '';
    let usage: ChatCompletionUsage | undefined;

    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const frames = parseSseFrames(buffer);
        let frame = frames.next();
        while (!frame.done) {
          const dado = frame.value;
          if (dado !== '[DONE]') {
            try {
              const chunk = JSON.parse(dado) as ChatCompletionChunk;
              if (chunk.usage) usage = chunk.usage;
              const delta = chunk.choices?.[0]?.delta?.content;
              if (typeof delta === 'string' && delta.length > 0) {
                texto += delta;
                onDelta?.();
                yield delta;
              }
            } catch {
              // Frame malformado no meio do fluxo não invalida o que já veio.
            }
          }
          frame = frames.next();
        }
        buffer = frame.value;
      }
    } finally {
      reader.releaseLock();
    }

    if (!texto) throw new AiGenerationError('OmniRoute encerrou o fluxo sem conteúdo textual.');
    return { text: texto, model, usage: toUsage(usage) };
  }

  private async complete(model: string, prompt: string, signal?: AbortSignal): Promise<AiProviderResult> {
    const response = await this.fetchFn(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        stream: false,
      }),
      signal,
    });

    if (!response.ok) {
      throw new AiGenerationError(`OmniRoute respondeu com HTTP ${response.status}.`);
    }

    let body: ChatCompletionResponse;
    try {
      body = await response.json() as ChatCompletionResponse;
    } catch (error) {
      throw new AiGenerationError('OmniRoute retornou JSON inválido.', { cause: error });
    }

    const content = body.choices?.[0]?.message?.content;
    if (typeof content !== 'string') {
      throw new AiGenerationError('OmniRoute retornou uma resposta sem conteúdo textual.');
    }
    return { text: content, model, usage: toUsage(body.usage) };
  }
}
