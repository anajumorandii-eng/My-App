import { describe, it, expect } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { sociologia, sociologiaSemCena } from './data/sociologia';

const capitulos = interactiveSummaries.filter((s) => s.subject === 'Sociologia').map((s) => s.id);

describe('Atribuição de família em Sociologia', () => {
  it('cobre os 27 capítulos, cada um exatamente uma vez', () => {
    const atribuidos = [...sociologia.map((e) => e.chapterId), ...sociologiaSemCena.map((g) => g.chapterId)];
    expect(new Set(atribuidos).size, 'nenhum capítulo atribuído duas vezes').toBe(atribuidos.length);
    expect([...atribuidos].sort()).toEqual([...capitulos].sort());
  });

  it('só cita capítulos que existem no catálogo', () => {
    const ids = new Set(interactiveSummaries.map((s) => s.id));
    for (const e of sociologia) expect(ids.has(e.chapterId), e.chapterId).toBe(true);
    for (const g of sociologiaSemCena) expect(ids.has(g.chapterId), g.chapterId).toBe(true);
  });

  it('declara um motivo para cada lacuna', () => {
    for (const g of sociologiaSemCena) expect(g.motivo.length, g.chapterId).toBeGreaterThan(10);
  });
});
