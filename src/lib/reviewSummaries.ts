import { normalizeReviewOptions, reviewBoard, type ReviewOptions } from './strategicReview';
import type { StrategyGuide } from './strategyGuides';
import { canonicalExamBoard } from './questionExamFilters';

export function reviewSummaryKey(subject: string, topicId: string, chapter: string, board: string, options?: ReviewOptions): string {
  if (options) { const normalized = normalizeReviewOptions(options); const { sourceText, ...config } = normalized; return JSON.stringify(['strategic-review-v2', sourceFingerprint(JSON.stringify([subject, topicId, chapter, config, sourceText]))]); }
  return JSON.stringify(['review-summary', subject, topicId, chapter, canonicalExamBoard(board)]);
}
export const isReviewSummary = (guide: StrategyGuide) => guide.kind === 'review-summary';
export function selectReviewSummaries(guides: Record<string, StrategyGuide>, subject = '', board = '') {
  return Object.values(guides).filter(guide => isReviewSummary(guide) && (!subject || guide.subject === subject) && (!board || (guide.targetBoards ?? [guide.board]).some(value => reviewBoard(value) === reviewBoard(board))))
    .sort((a, b) => b.savedAt.localeCompare(a.savedAt));
}

function sourceFingerprint(text: string) {
  let a = 2166136261, b = 5381;
  for (const char of text) { a = Math.imul(a ^ char.charCodeAt(0), 16777619); b = Math.imul(b, 33) ^ char.charCodeAt(0); }
  return `${text.length}:${a >>> 0}:${b >>> 0}`;
}
