import { describe, it, expect } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { filosofia, filosofiaSemCena } from './data/filosofia';

const capitulosDeFilosofia = interactiveSummaries.filter((s) => s.subject === 'Filosofia').map((s) => s.id);

describe('Atribuição de família em Filosofia', () => {
  it('cobre os 35 capítulos, cada um exatamente uma vez', () => {
    const atribuidos = [...filosofia.map((e) => e.chapterId), ...filosofiaSemCena.map((g) => g.chapterId)];
    expect(new Set(atribuidos).size, 'nenhum capítulo atribuído duas vezes').toBe(atribuidos.length);
    expect([...atribuidos].sort()).toEqual([...capitulosDeFilosofia].sort());
  });

  it('só cita capítulos que existem no catálogo', () => {
    const ids = new Set(interactiveSummaries.map((s) => s.id));
    for (const entry of filosofia) expect(ids.has(entry.chapterId), entry.chapterId).toBe(true);
    for (const gap of filosofiaSemCena) expect(ids.has(gap.chapterId), gap.chapterId).toBe(true);
  });

  it('declara um motivo para cada lacuna', () => {
    for (const gap of filosofiaSemCena) expect(gap.motivo.length, gap.chapterId).toBeGreaterThan(10);
  });
});
