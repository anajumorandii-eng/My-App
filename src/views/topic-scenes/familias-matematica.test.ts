import { describe, it, expect } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { matematica, matematicaSemCena } from './data/matematica';

const capitulosDeMatematica = interactiveSummaries.filter((s) => s.subject === 'Matemática').map((s) => s.id);

describe('Atribuição de família em Matemática', () => {
  it('cobre os 83 capítulos, cada um exatamente uma vez', () => {
    const atribuidos = [...matematica.map((e) => e.chapterId), ...matematicaSemCena.map((g) => g.chapterId)];
    expect(new Set(atribuidos).size, 'nenhum capítulo atribuído duas vezes').toBe(atribuidos.length);
    expect([...atribuidos].sort()).toEqual([...capitulosDeMatematica].sort());
  });

  it('só cita capítulos que existem no catálogo', () => {
    const ids = new Set(interactiveSummaries.map((s) => s.id));
    for (const entry of matematica) expect(ids.has(entry.chapterId), entry.chapterId).toBe(true);
    for (const gap of matematicaSemCena) expect(ids.has(gap.chapterId), gap.chapterId).toBe(true);
  });

  it('declara um motivo para cada lacuna', () => {
    for (const gap of matematicaSemCena) expect(gap.motivo.length, gap.chapterId).toBeGreaterThan(10);
  });
});
