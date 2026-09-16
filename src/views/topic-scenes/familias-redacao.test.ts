import { describe, it, expect } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { redacao, redacaoSemCena } from './data/redacao';

const capitulosDeRedacao = interactiveSummaries.filter((s) => s.subject === 'Redação').map((s) => s.id);

describe('Atribuição de família em Redação', () => {
  it('cobre os 58 capítulos, cada um exatamente uma vez', () => {
    const atribuidos = [...redacao.map((e) => e.chapterId), ...redacaoSemCena.map((g) => g.chapterId)];
    expect(new Set(atribuidos).size, 'nenhum capítulo atribuído duas vezes').toBe(atribuidos.length);
    expect([...atribuidos].sort()).toEqual([...capitulosDeRedacao].sort());
  });

  it('só cita capítulos que existem no catálogo', () => {
    const ids = new Set(interactiveSummaries.map((s) => s.id));
    for (const entry of redacao) expect(ids.has(entry.chapterId), entry.chapterId).toBe(true);
    for (const gap of redacaoSemCena) expect(ids.has(gap.chapterId), gap.chapterId).toBe(true);
  });

  it('declara um motivo para cada lacuna', () => {
    for (const gap of redacaoSemCena) expect(gap.motivo.length, gap.chapterId).toBeGreaterThan(10);
  });
});
