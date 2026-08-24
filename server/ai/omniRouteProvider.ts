import { AiGenerationError } from './errors';
import { AiGenerationRequest, AiProvider, AiProviderResult, AiTask } from './types';

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

interface ChatCompletionResponse {
  choices?: Array<{ message?: { content?: unknown } }>;
  usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
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
    return {
      text: content,
      model,
      usage: body.usage ? {
        promptTokens: body.usage.prompt_tokens,
        completionTokens: body.usage.completion_tokens,
        totalTokens: body.usage.total_tokens,
      } : undefined,
    };
  }
}
