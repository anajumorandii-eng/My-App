export type AiTask =
  | 'socratic'
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
}

export interface AiGenerationResult {
  text: string;
  provider: string;
  model: string;
}

export interface AiProvider {
  readonly name: string;
  readonly model: string;
  readonly isConfigured: boolean;
  generate(request: AiGenerationRequest): Promise<string>;
}

