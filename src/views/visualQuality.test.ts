import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { interactiveSummaries } from '../data/interactiveSummaries';
import { buildQualityInventory, type QualityReview } from './visualQuality';
import { visualQualityReviews } from './visualQualityReviews';

const chapter = (id: string) => {
  const found = interactiveSummaries.find(summary => summary.id === id);
  if (!found) throw new Error(`Capítulo não encontrado: ${id}`);
  return found;
};

const review = (chapterId: string): QualityReview => ({
  chapterId, mechanism: 'sucessao', relation: 'mudança de comunidade',
  status: 'em-validacao', evidencePaths: [], notes: '',
});

describe('inventário de qualidade visual', () => {
  it('preserva o artefato vencedor e não infere qualidade da cobertura', () => {
    const rows = buildQualityInventory([
      chapter('bio-ecologia-introducao'), chapter('bio-ecologia-sucessao'),
    ], []);
    expect(rows.map(row => [row.id, row.primary, row.status])).toEqual([
      ['bio-ecologia-introducao', 'experiment', 'nao-revisado'],
      ['bio-ecologia-sucessao', 'scene', 'nao-revisado'],
    ]);
  });

  it('rejeita avaliações para capítulos inexistentes ou repetidos', () => {
    expect(() => buildQualityInventory([chapter('bio-ecologia-sucessao')], [review('inexistente')]))
      .toThrow(/inexistente/);
    expect(() => buildQualityInventory([chapter('bio-ecologia-sucessao')], [review('bio-ecologia-sucessao'), review('bio-ecologia-sucessao')]))
      .toThrow(/bio-ecologia-sucessao/);
  });

  it('mantém o relatório versionado em sincronia com os 613 capítulos', () => {
    const rows = buildQualityInventory(interactiveSummaries, visualQualityReviews);
    if (process.env.UPDATE_VISUAL_QUALITY === '1') {
      writeFileSync('docs/visual-personalizado/27-qualidade-visual.json', `${JSON.stringify(rows, null, 2)}\n`);
    }
    const saved = JSON.parse(readFileSync('docs/visual-personalizado/27-qualidade-visual.json', 'utf8'));
    expect(rows).toHaveLength(613);
    expect(new Set(rows.map(row => row.id)).size).toBe(613);
    expect(rows.filter(row => row.status === 'aprovado')).toHaveLength(6);
    expect(saved).toEqual(rows);
  });

  it('aponta para capturas existentes em todas as revisões', () => {
    for (const review of visualQualityReviews) {
      expect(review.evidencePaths, review.chapterId).toHaveLength(10);
      for (const path of review.evidencePaths) expect(existsSync(path), path).toBe(true);
    }
  });
});
