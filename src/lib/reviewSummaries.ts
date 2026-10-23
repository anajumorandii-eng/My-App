import type { StrategyGuide } from './strategyGuides';
import { canonicalExamBoard } from './questionExamFilters';

export function reviewSummaryKey(subject: string, topicId: string, chapter: string, board: string): string {
  return JSON.stringify(['review-summary', subject, topicId, chapter, canonicalExamBoard(board)]);
}
export const isReviewSummary = (guide: StrategyGuide) => guide.kind === 'review-summary';
export function selectReviewSummaries(guides: Record<string, StrategyGuide>, subject = '', board = '') {
  return Object.values(guides).filter(guide => isReviewSummary(guide) && (!subject || guide.subject === subject) && (!board || canonicalExamBoard(guide.board) === canonicalExamBoard(board)))
    .sort((a, b) => b.savedAt.localeCompare(a.savedAt));
}
