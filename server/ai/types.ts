export type AiTask =
  | 'socratic'
  | 'content-explanation'
  | 'answer-correction'
  | 'error-hypothesis'
  | 'question-explanation'
  | 'backlog-exercise'
  | 'backlog-correction'
  | 'discursive-feedback'
  | 'podcast-script'
  | 'progress-insight'
  | 'review-tip'
  | 'method-example';

export interface AiGenerationRequest {
  task: AiTask;
  prompt: string;
  userId?: string;
  signal?: AbortSignal;
}

export interface AiUsage {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
}

export interface AiProviderResult {
  text: string;
  model?: string;
  usage?: AiUsage;
  fallback?: boolean;
}

export interface AiGenerationResult {
  text: string;
  provider: string;
  model: string;
  usage?: AiUsage;
  fallback?: boolean;
  cached?: boolean;
}

/**
 * Gerador que emite pedaços de texto conforme chegam e termina devolvendo o
 * resultado completo (texto inteiro, modelo, uso). Opcional no provedor: quem
 * não implementa continua atendido pelo generate() de uma vez só.
 */
export type AiStream = AsyncGenerator<string, AiProviderResult, void>;

/** O mesmo, já enriquecido pelo AiService (provedor, modelo, cache). */
export type AiResultStream = AsyncGenerator<string, AiGenerationResult, void>;

export interface AiProvider {
  readonly name: string;
  readonly model: string;
  readonly isConfigured: boolean;
  modelForTask?(task: AiTask): string;
  generate(request: AiGenerationRequest): Promise<string | AiProviderResult>;
  generateStream?(request: AiGenerationRequest): AiStream;
}
