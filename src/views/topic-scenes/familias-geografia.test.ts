import { describe, it, expect } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { geografia, geografiaSemCena } from './data/geografia';

const capitulosDeGeografia = interactiveSummaries.filter((s) => s.subject === 'Geografia').map((s) => s.id);

describe('Atribuição de família em Geografia', () => {
  it('cobre os 63 capítulos, cada um exatamente uma vez', () => {
    const atribuidos = [...geografia.map((e) => e.chapterId), ...geografiaSemCena.map((g) => g.chapterId)];
    expect(new Set(atribuidos).size, 'nenhum capítulo atribuído duas vezes').toBe(atribuidos.length);
    expect([...atribuidos].sort()).toEqual([...capitulosDeGeografia].sort());
  });

  it('só cita capítulos que existem no catálogo', () => {
    const ids = new Set(interactiveSummaries.map((s) => s.id));
    for (const entry of geografia) expect(ids.has(entry.chapterId), entry.chapterId).toBe(true);
    for (const gap of geografiaSemCena) expect(ids.has(gap.chapterId), gap.chapterId).toBe(true);
  });

  it('declara um motivo para cada lacuna', () => {
    for (const gap of geografiaSemCena) expect(gap.motivo.length, gap.chapterId).toBeGreaterThan(10);
  });
});
