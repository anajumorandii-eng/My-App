export type VariantLabel = "A" | "B";
export type Correctness = "correct" | "partial" | "incorrect" | "unchecked";
export interface VariantReview {
  label: VariantLabel;
  correctness: Correctness;
  clarity: number;
  instruction: number;
  usefulness: number;
}
export interface EvaluationReview {
  variants: VariantReview[];
  preference: VariantLabel | "tie" | "neither";
  comment: string;
  outcome: string;
  reviewedAt: string;
}
export interface EvaluationSession {
  id: string;
  title: string;
  status: "active" | "stopped" | "deleting";
  startedAt: string;
  endedAt: string | null;
  runCount: number;
}
export interface EvaluationVariant {
  label: VariantLabel;
  candidateId?: string;
  requestedModel?: string;
  model?: string;
  provider?: string;
  status: "running" | "completed" | "failed";
  text: string;
  error?: string;
  durationMs: number | null;
  firstTokenMs: number | null;
  cached: boolean;
  fallback: boolean;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
  textTruncated?: boolean;
}
export interface EvaluationRun {
  id: string;
  sessionId: string;
  kind: "live" | "comparison";
  task: string;
  source: string;
  payload: Record<string, unknown>;
  prompt: string;
  promptVersion: string;
  promptTruncated: boolean;
  startedAt: string;
  status: "running" | "completed" | "failed";
  variants: EvaluationVariant[];
  review?: EvaluationReview;
  parentRunId?: string;
}
export interface EvaluationCandidate {
  id: string;
  label: string;
  model: string;
}
export interface EvaluationDetail {
  session: EvaluationSession;
  runs: EvaluationRun[];
}
export interface EvaluationSummary {
  source: string;
  kind: EvaluationRun["kind"];
  distinctPrompts: number;
  task: string;
  model: string;
  samples: number;
  failures: number;
  cached: number;
  measured: number;
  averageDurationMs: number | null;
  averageFirstTokenMs: number | null;
  firstTokenSamples: number;
  rated: number;
  averageUsefulness: number | null;
  correctnessChecked: number;
  correct: number;
  wins: number;
}
