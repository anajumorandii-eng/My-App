import { describe, it, expect } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { gramatica, gramaticaSemCena } from './data/gramatica';

const capitulosDeGramatica = interactiveSummaries.filter((s) => s.subject === 'Gramática').map((s) => s.id);

describe('Atribuição de família em Gramática', () => {
  it('cobre os 26 capítulos, cada um exatamente uma vez', () => {
    const atribuidos = [...gramatica.map((e) => e.chapterId), ...gramaticaSemCena.map((g) => g.chapterId)];
    expect(new Set(atribuidos).size, 'nenhum capítulo atribuído duas vezes').toBe(atribuidos.length);
    expect([...atribuidos].sort()).toEqual([...capitulosDeGramatica].sort());
  });

  it('só cita capítulos que existem no catálogo', () => {
    const ids = new Set(interactiveSummaries.map((s) => s.id));
    for (const entry of gramatica) expect(ids.has(entry.chapterId), entry.chapterId).toBe(true);
    for (const gap of gramaticaSemCena) expect(ids.has(gap.chapterId), gap.chapterId).toBe(true);
  });

  it('declara um motivo para cada lacuna', () => {
    for (const gap of gramaticaSemCena) expect(gap.motivo.length, gap.chapterId).toBeGreaterThan(10);
  });
});
