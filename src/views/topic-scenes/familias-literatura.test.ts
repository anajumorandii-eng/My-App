import { describe, it, expect } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { literatura, literaturaSemCena } from './data/literatura';

const capitulosDeLiteratura = interactiveSummaries.filter((s) => s.subject === 'Literatura').map((s) => s.id);

describe('Atribuição de família em Literatura', () => {
  it('cobre os 37 capítulos, cada um exatamente uma vez', () => {
    const atribuidos = [...literatura.map((e) => e.chapterId), ...literaturaSemCena.map((g) => g.chapterId)];
    expect(new Set(atribuidos).size, 'nenhum capítulo atribuído duas vezes').toBe(atribuidos.length);
    expect([...atribuidos].sort()).toEqual([...capitulosDeLiteratura].sort());
  });

  it('só cita capítulos que existem no catálogo', () => {
    const ids = new Set(interactiveSummaries.map((s) => s.id));
    for (const entry of literatura) expect(ids.has(entry.chapterId), entry.chapterId).toBe(true);
    for (const gap of literaturaSemCena) expect(ids.has(gap.chapterId), gap.chapterId).toBe(true);
  });

  it('declara um motivo para cada lacuna', () => {
    for (const gap of literaturaSemCena) expect(gap.motivo.length, gap.chapterId).toBeGreaterThan(10);
  });
});
