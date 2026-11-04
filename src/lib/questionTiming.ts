import type { Question } from '../types';

/** Initial training budgets, not official exam limits or observed student averages. */
export function suggestedQuestionSeconds(difficulty: Question['difficulty']): number {
  return difficulty === 'easy' ? 120 : difficulty === 'hard' ? 300 : 180;
}
export function formatQuestionTime(seconds: number): string {
  const total = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0));
  const minutes = Math.floor(total / 60), rest = String(total % 60).padStart(2, '0');
  return `${String(minutes).padStart(2, '0')}:${rest}`;
}
export interface QuestionTiming {
  startedAt: string;
  completedAt: string;
  durationSeconds: number;
}
