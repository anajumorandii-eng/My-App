import { describe, it, expect } from 'vitest';
import { entradasValidas } from './sceneFor';
import { filosofia, filosofiaSemCena } from './data/filosofia';
import { sociologia, sociologiaSemCena } from './data/sociologia';
import { interactiveSummaries } from '../../data/interactiveSummaries';
describe('Contagem honesta de cenas-âncora', () => {
  it('conta só entradas com lastro, somando todas as matérias', () => { expect(entradasValidas().length).toBe(filosofia.length + sociologia.length); });
  it('não conta lacunas declaradas', () => {
    const ids = new Set(entradasValidas().map((e) => e.chapterId));
    for (const gap of [...filosofiaSemCena, ...sociologiaSemCena]) expect(ids.has(gap.chapterId), gap.chapterId).toBe(false);
  });
  it('cobre Filosofia inteira', () => { const total = interactiveSummaries.filter((s) => s.subject === 'Filosofia').length; expect(filosofia.length + filosofiaSemCena.length).toBe(total); });
  it('cobre Sociologia inteira', () => { const total = interactiveSummaries.filter((s) => s.subject === 'Sociologia').length; expect(sociologia.length + sociologiaSemCena.length).toBe(total); });
});
