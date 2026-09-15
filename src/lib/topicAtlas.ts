import type { InteractiveSummary, SummarySection } from '../types/summary';

export interface AtlasPassage { id: string; text: string; sectionId: string; }

/** Source reading segments, never inferred causal relations or invented chart values. */
export function atlasPassages(section: SummarySection): AtlasPassage[] {
  const blocks = section.content.split(/\n\s*\n/).filter(Boolean);
  const passages = blocks.flatMap(block => {
    if (block.length < 440 || /\n|\$|\\\[|\\\(|\|/.test(block)) return [block];
    return block.split(/(?<=[.!?])\s+(?=[A-ZÀ-Ý])/u);
  });
  return passages.map((text, i) => ({ id: `${section.id}:passage:${i}`, text, sectionId: section.id }));
}

export function atlasCoverage(summary: InteractiveSummary) {
  const passages = summary.sections.flatMap(atlasPassages);
  return {
    sourceMap: passages.length > 0 && summary.sections.every(s => atlasPassages(s).length > 0),
    passageCount: passages.length,
    sectionIds: summary.sections.map(s => s.id),
  };
}
