import { describe, it, expect } from 'vitest';
import { entradasValidas } from './sceneFor';
import { filosofia, filosofiaSemCena } from './data/filosofia';
import { interactiveSummaries } from '../../data/interactiveSummaries';
describe('Contagem honesta de cenas-âncora', () => {
  it('conta só entradas com lastro', () => { expect(entradasValidas().length).toBe(filosofia.length); });
  it('não conta lacunas declaradas', () => { const ids = new Set(entradasValidas().map((e) => e.chapterId)); for (const gap of filosofiaSemCena) expect(ids.has(gap.chapterId), gap.chapterId).toBe(false); });
  it('cobre Filosofia inteira', () => { const total = interactiveSummaries.filter((s) => s.subject === 'Filosofia').length; expect(entradasValidas().length + filosofiaSemCena.length).toBe(total); });
});
