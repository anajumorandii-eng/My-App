import type { InteractiveSummary } from '../types/summary';
import type { SummaryMaterial } from '../data/summaryMaterials';

export type SummaryCatalogIssueCode =
  | 'duplicate-summary-id'
  | 'duplicate-section-id'
  | 'duplicate-question-id'
  | 'missing-question-section'
  | 'unknown-material';

export interface SummaryCatalogIssue { code: SummaryCatalogIssueCode; summaryId: string; reference: string; }

export function validateSummaryCatalog(summaries: InteractiveSummary[], materials: SummaryMaterial[]): SummaryCatalogIssue[] {
  const issues: SummaryCatalogIssue[] = [];
  const summaryIds = new Set<string>();
  const materialIds = new Set(materials.map((item) => item.id));

  for (const summary of summaries) {
    if (summaryIds.has(summary.id)) issues.push({ code: 'duplicate-summary-id', summaryId: summary.id, reference: summary.id });
    summaryIds.add(summary.id);
    const sectionIds = new Set<string>();
    for (const section of summary.sections) {
      if (sectionIds.has(section.id)) issues.push({ code: 'duplicate-section-id', summaryId: summary.id, reference: section.id });
      sectionIds.add(section.id);
    }
    const questionIds = new Set<string>();
    for (const question of summary.retrieval) {
      if (questionIds.has(question.id)) issues.push({ code: 'duplicate-question-id', summaryId: summary.id, reference: question.id });
      questionIds.add(question.id);
      if (question.sectionId && !sectionIds.has(question.sectionId)) issues.push({ code: 'missing-question-section', summaryId: summary.id, reference: question.sectionId });
    }
    for (const source of summary.sources) {
      if (source.kind === 'material-interno' && (!source.materialId || !materialIds.has(source.materialId))) {
        issues.push({ code: 'unknown-material', summaryId: summary.id, reference: source.materialId ?? source.label });
      }
    }
  }
  return issues;
}
