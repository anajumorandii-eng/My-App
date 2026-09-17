import { describe, it, expect } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { fisica, fisicaSemCena } from './data/fisica';

const capitulosDeFisica = interactiveSummaries.filter((s) => s.subject === 'Física').map((s) => s.id);

describe('Atribuição de família em Física', () => {
  it('cobre os 85 capítulos, cada um exatamente uma vez', () => {
    const atribuidos = [...fisica.map((e) => e.chapterId), ...fisicaSemCena.map((g) => g.chapterId)];
    expect(new Set(atribuidos).size, 'nenhum capítulo atribuído duas vezes').toBe(atribuidos.length);
    expect([...atribuidos].sort()).toEqual([...capitulosDeFisica].sort());
  });

  it('só cita capítulos que existem no catálogo', () => {
    const ids = new Set(interactiveSummaries.map((s) => s.id));
    for (const entry of fisica) expect(ids.has(entry.chapterId), entry.chapterId).toBe(true);
    for (const gap of fisicaSemCena) expect(ids.has(gap.chapterId), gap.chapterId).toBe(true);
  });

  it('declara um motivo para cada lacuna', () => {
    for (const gap of fisicaSemCena) expect(gap.motivo.length, gap.chapterId).toBeGreaterThan(10);
  });
});
