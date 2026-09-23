import type { InteractiveSummary } from '../types/summary';
import { buildVisualCoverage } from './visualCoverage';
import type { CoverageRow } from './visualCoverage';

export interface QualityReview {
  chapterId: string;
  mechanism: string;
  relation: string;
  status: 'insuficiente' | 'em-validacao' | 'aprovado';
  evidencePaths: string[];
  notes: string;
}

export interface QualityRow extends Omit<CoverageRow, 'ignored'> {
  status: QualityReview['status'] | 'nao-revisado';
  mechanism: string;
  relation: string;
  evidencePaths: string[];
  notes: string;
}

export function buildQualityInventory(summaries: InteractiveSummary[], reviews: QualityReview[]): QualityRow[] {
  const ids = new Set(summaries.map(summary => summary.id));
  const byId = new Map<string, QualityReview>();
  for (const review of reviews) {
    if (!ids.has(review.chapterId)) throw new Error(`Capítulo inexistente na revisão: ${review.chapterId}`);
    if (byId.has(review.chapterId)) throw new Error(`Revisão duplicada: ${review.chapterId}`);
    byId.set(review.chapterId, review);
  }
  return buildVisualCoverage(summaries).rows.map(({ ignored: _ignored, ...coverage }) => {
    const review = byId.get(coverage.id);
    return {
      ...coverage,
      status: review?.status ?? 'nao-revisado',
      mechanism: review?.mechanism ?? '',
      relation: review?.relation ?? '',
      evidencePaths: review?.evidencePaths ?? [],
      notes: review?.notes ?? '',
    };
  });
}
