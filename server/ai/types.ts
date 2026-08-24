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

export interface AiProvider {
  readonly name: string;
  readonly model: string;
  readonly isConfigured: boolean;
  modelForTask?(task: AiTask): string;
  generate(request: AiGenerationRequest): Promise<string | AiProviderResult>;
}
