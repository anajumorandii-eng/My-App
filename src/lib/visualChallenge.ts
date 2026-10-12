import type { InteractiveSummary } from '../types/summary';

/** Use the authored question-to-section link; never infer it from stage order. */
export function challengeSectionIndex(summary: InteractiveSummary): number {
  const sectionId = summary.retrieval[0]?.sectionId;
  const index = summary.sections.findIndex(section => section.id === sectionId);
  return index >= 0 ? index : 0;
}
