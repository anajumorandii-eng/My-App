import type { SavedStudySelection } from './strategySelection';
import { normalizeReviewOptions, reviewBoard, type ReviewOptions } from './strategicReview';
import type { StrategyGuide } from './strategyGuides';
import { canonicalExamBoard } from './questionExamFilters';

export function reviewSummaryKey(subject: string, topicId: string, chapter: string, board: string, options?: ReviewOptions, selections?: SavedStudySelection[]): string {
  if (options) { const normalized = normalizeReviewOptions(options); const { sourceText, ...config } = normalized; if(config.topicCuts)config.topicCuts=Object.fromEntries(Object.entries(config.topicCuts).sort(([a],[b])=>a.localeCompare(b)).map(([id,cuts])=>[id,[...cuts].sort()])); return JSON.stringify(['strategic-review-v2', sourceFingerprint(JSON.stringify(normalized.sourceMode === 'catalog' && selections && selections.length > 1 ? [subject, topicId, chapter, config, sourceText, selections.map(item => [item.topicId, item.chapter]).sort((a,b) => a[0].localeCompare(b[0]))] : [subject, topicId, chapter, config, sourceText]))]); }
  return JSON.stringify(['review-summary', subject, topicId, chapter, canonicalExamBoard(board)]);
}
export const isReviewSummary = (guide: StrategyGuide) => guide.kind === 'review-summary';
export function selectReviewSummaries(guides: Record<string, StrategyGuide>, subject = '', board = '') {
  return Object.values(guides).filter(guide => !guide.deletedAt && isReviewSummary(guide) && (!subject || guide.subject === subject) && (!board || (guide.targetBoards ?? [guide.board]).some(value => reviewBoard(value) === reviewBoard(board))))
    .sort((a, b) => b.savedAt.localeCompare(a.savedAt));
}

function sourceFingerprint(text: string) {
  let a = 2166136261, b = 5381;
  for (const char of text) { a = Math.imul(a ^ char.charCodeAt(0), 16777619); b = Math.imul(b, 33) ^ char.charCodeAt(0); }
  return `${text.length}:${a >>> 0}:${b >>> 0}`;
}
