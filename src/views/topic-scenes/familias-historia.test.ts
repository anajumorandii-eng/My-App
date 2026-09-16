import { describe, it, expect } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { historia, historiaSemCena } from './data/historia';

const capitulosDeHistoria = interactiveSummaries.filter((s) => s.subject === 'História').map((s) => s.id);

describe('Atribuição de família em História', () => {
  it('cobre os 49 capítulos, cada um exatamente uma vez', () => {
    const atribuidos = [...historia.map((e) => e.chapterId), ...historiaSemCena.map((g) => g.chapterId)];
    expect(new Set(atribuidos).size, 'nenhum capítulo atribuído duas vezes').toBe(atribuidos.length);
    expect([...atribuidos].sort()).toEqual([...capitulosDeHistoria].sort());
  });

  it('só cita capítulos que existem no catálogo', () => {
    const ids = new Set(interactiveSummaries.map((s) => s.id));
    for (const entry of historia) expect(ids.has(entry.chapterId), entry.chapterId).toBe(true);
    for (const gap of historiaSemCena) expect(ids.has(gap.chapterId), gap.chapterId).toBe(true);
  });

  it('declara um motivo para cada lacuna', () => {
    for (const gap of historiaSemCena) expect(gap.motivo.length, gap.chapterId).toBeGreaterThan(10);
  });
});
