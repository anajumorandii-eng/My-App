import { describe, it, expect } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { quimica, quimicaSemCena } from './data/quimica';

const capitulosDeQuimica = interactiveSummaries.filter((s) => s.subject === 'Química').map((s) => s.id);

describe('Atribuição de família em Química', () => {
  it('cobre os 48 capítulos, cada um exatamente uma vez', () => {
    const atribuidos = [...quimica.map((e) => e.chapterId), ...quimicaSemCena.map((g) => g.chapterId)];
    expect(new Set(atribuidos).size, 'nenhum capítulo atribuído duas vezes').toBe(atribuidos.length);
    expect([...atribuidos].sort()).toEqual([...capitulosDeQuimica].sort());
  });

  it('só cita capítulos que existem no catálogo', () => {
    const ids = new Set(interactiveSummaries.map((s) => s.id));
    for (const entry of quimica) expect(ids.has(entry.chapterId), entry.chapterId).toBe(true);
    for (const gap of quimicaSemCena) expect(ids.has(gap.chapterId), gap.chapterId).toBe(true);
  });

  it('declara um motivo para cada lacuna', () => {
    for (const gap of quimicaSemCena) expect(gap.motivo.length, gap.chapterId).toBeGreaterThan(10);
  });
});
