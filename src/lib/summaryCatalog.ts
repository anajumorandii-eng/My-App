import type { InteractiveSummary } from '../types/summary';
import type { SummaryMaterial } from '../data/summaryMaterials';

export type SummaryCatalogIssueCode =
  | 'duplicate-summary-id'
  | 'duplicate-section-id'
  | 'duplicate-question-id'
  | 'missing-question-section'
  | 'unknown-material'
  | 'missing-source-location'
  | 'missing-depth';

export interface SummaryCatalogIssue { code: SummaryCatalogIssueCode; summaryId: string; reference: string; }

export function validateSummaryCatalog(summaries: InteractiveSummary[], materials: SummaryMaterial[]): SummaryCatalogIssue[] {
  const issues: SummaryCatalogIssue[] = [];
  const summaryIds = new Set<string>();
  const materialsById = new Map(materials.map((item) => [item.id, item]));

  for (const summary of summaries) {
    if (summaryIds.has(summary.id)) issues.push({ code: 'duplicate-summary-id', summaryId: summary.id, reference: summary.id });
    summaryIds.add(summary.id);
    const depths = new Set(summary.sections.map((section) => section.depth));
    for (const depth of ['rapida', 'aprofundamento', 'prova'] as const) {
      if (!depths.has(depth)) issues.push({ code: 'missing-depth', summaryId: summary.id, reference: depth });
    }
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
      if (source.kind === 'material-interno' && (!source.materialId || !materialsById.has(source.materialId))) {
        issues.push({ code: 'unknown-material', summaryId: summary.id, reference: source.materialId ?? source.label });
      }
      const material = source.materialId ? materialsById.get(source.materialId) : undefined;
      if (material?.format === 'apostila' && !material.uncertain && (!material.chapter || !material.startPage || !material.endPage || material.endPage < material.startPage)) {
        issues.push({ code: 'missing-source-location', summaryId: summary.id, reference: source.materialId ?? source.label });
      }
    }
  }
  return issues;
}
