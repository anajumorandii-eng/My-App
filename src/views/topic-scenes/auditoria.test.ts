import { describe, it, expect } from 'vitest';
import { entradasValidas } from './sceneFor';
import { filosofia, filosofiaSemCena } from './data/filosofia';
import { sociologia, sociologiaSemCena } from './data/sociologia';
import { historia, historiaSemCena } from './data/historia';
import { geografia, geografiaSemCena } from './data/geografia';
import { interactiveSummaries } from '../../data/interactiveSummaries';
describe('Contagem honesta de cenas-âncora', () => {
  it('conta só entradas com lastro, somando todas as matérias', () => { expect(entradasValidas().length).toBe(filosofia.length + sociologia.length + historia.length + geografia.length); });
  it('não conta lacunas declaradas', () => {
    const ids = new Set(entradasValidas().map((e) => e.chapterId));
    for (const gap of [...filosofiaSemCena, ...sociologiaSemCena, ...historiaSemCena, ...geografiaSemCena]) expect(ids.has(gap.chapterId), gap.chapterId).toBe(false);
  });
  it('cobre Filosofia inteira', () => { const total = interactiveSummaries.filter((s) => s.subject === 'Filosofia').length; expect(filosofia.length + filosofiaSemCena.length).toBe(total); });
  it('cobre Sociologia inteira', () => { const total = interactiveSummaries.filter((s) => s.subject === 'Sociologia').length; expect(sociologia.length + sociologiaSemCena.length).toBe(total); });
  it('cobre História inteira', () => { const total = interactiveSummaries.filter((s) => s.subject === 'História').length; expect(historia.length + historiaSemCena.length).toBe(total); });
  it('cobre Geografia inteira', () => { const total = interactiveSummaries.filter((s) => s.subject === 'Geografia').length; expect(geografia.length + geografiaSemCena.length).toBe(total); });
});
