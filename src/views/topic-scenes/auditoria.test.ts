import { describe, it, expect } from 'vitest';
import { entradasValidas } from './sceneFor';
import { filosofia, filosofiaSemCena } from './data/filosofia';
import { sociologia, sociologiaSemCena } from './data/sociologia';
import { historia, historiaSemCena } from './data/historia';
import { geografia, geografiaSemCena } from './data/geografia';
import { literatura, literaturaSemCena } from './data/literatura';
import { matematica, matematicaSemCena } from './data/matematica';
import { quimica, quimicaSemCena } from './data/quimica';
import { fisica, fisicaSemCena } from './data/fisica';
import { interactiveSummaries } from '../../data/interactiveSummaries';
describe('Contagem honesta de cenas-âncora', () => {
  it('conta só entradas com lastro, somando todas as matérias', () => { expect(entradasValidas().length).toBe(filosofia.length + sociologia.length + historia.length + geografia.length + literatura.length + matematica.length + quimica.length + fisica.length); });
  it('não conta lacunas declaradas', () => {
    const ids = new Set(entradasValidas().map((e) => e.chapterId));
    for (const gap of [...filosofiaSemCena, ...sociologiaSemCena, ...historiaSemCena, ...geografiaSemCena, ...literaturaSemCena, ...matematicaSemCena, ...quimicaSemCena, ...fisicaSemCena]) expect(ids.has(gap.chapterId), gap.chapterId).toBe(false);
  });
  it('cobre Filosofia inteira', () => { const total = interactiveSummaries.filter((s) => s.subject === 'Filosofia').length; expect(filosofia.length + filosofiaSemCena.length).toBe(total); });
  it('cobre Sociologia inteira', () => { const total = interactiveSummaries.filter((s) => s.subject === 'Sociologia').length; expect(sociologia.length + sociologiaSemCena.length).toBe(total); });
  it('cobre História inteira', () => { const total = interactiveSummaries.filter((s) => s.subject === 'História').length; expect(historia.length + historiaSemCena.length).toBe(total); });
  it('cobre Geografia inteira', () => { const total = interactiveSummaries.filter((s) => s.subject === 'Geografia').length; expect(geografia.length + geografiaSemCena.length).toBe(total); });
  it('cobre Literatura inteira', () => { const total = interactiveSummaries.filter((s) => s.subject === 'Literatura').length; expect(literatura.length + literaturaSemCena.length).toBe(total); });
  it('cobre Matemática inteira', () => { const total = interactiveSummaries.filter((s) => s.subject === 'Matemática').length; expect(matematica.length + matematicaSemCena.length).toBe(total); });
  it('cobre Química inteira', () => { const total = interactiveSummaries.filter((s) => s.subject === 'Química').length; expect(quimica.length + quimicaSemCena.length).toBe(total); });
  it('cobre Física inteira', () => { const total = interactiveSummaries.filter((s) => s.subject === 'Física').length; expect(fisica.length + fisicaSemCena.length).toBe(total); });
});
