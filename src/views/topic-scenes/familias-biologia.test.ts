import { describe, it, expect } from 'vitest';
import chapters from '../../data/deepSummaryContent.json';
import { summaryCurriculum } from '../../data/summaryCurriculum';
import { biologia, biologiaSemCena } from './data/biologia';

// Biologia usa o `id` do currículo como chapterId (sem prefixo `summary-`,
// ao contrário de Geografia/História/Sociologia/Filosofia) — convenção
// fixada pela Parte A do inventário e mantida aqui. O catálogo real é
// cruzado por título entre deepSummaryContent.json (subject === 'Biologia')
// e summaryCurriculum.ts, tal como o inventário determinou.
type DeepChapter = { subject: string; topic: string };
const topicsDeBiologia = new Set((chapters as DeepChapter[]).filter((c) => c.subject === 'Biologia').map((c) => c.topic));
const capitulosDeBiologia = summaryCurriculum
  .find((item) => item.subject === 'Biologia')!
  .topics.filter((t) => topicsDeBiologia.has(t.title))
  .map((t) => t.id);

describe('Atribuição de família em Biologia (Parte A + Parte B, docs/visual-personalizado/15-familias-biologia.md)', () => {
  it('cobre os 72 capítulos, cada um exatamente uma vez', () => {
    const atribuidos = [...biologia.map((e) => e.chapterId), ...biologiaSemCena.map((g) => g.chapterId)];
    expect(new Set(atribuidos).size, 'nenhum capítulo atribuído duas vezes').toBe(atribuidos.length);
    expect([...atribuidos].sort()).toEqual([...capitulosDeBiologia].sort());
  });

  it('só cita capítulos que existem no catálogo real', () => {
    const ids = new Set(capitulosDeBiologia);
    for (const entry of biologia) expect(ids.has(entry.chapterId), entry.chapterId).toBe(true);
    for (const gap of biologiaSemCena) expect(ids.has(gap.chapterId), gap.chapterId).toBe(true);
  });

  it('declara um motivo específico (não genérico) para cada lacuna', () => {
    for (const gap of biologiaSemCena) expect(gap.motivo.length, gap.chapterId).toBeGreaterThan(10);
  });

  it('conta 33 lacunas no total (12 da Parte A + 21 da Parte B)', () => {
    expect(biologiaSemCena.length).toBe(33);
  });

  it('conta 39 SceneEntry no total (17 tipologia + 17 cadeia-de-derivacao + 4 escala-de-graus + 1 contraste-de-posicoes)', () => {
    expect(biologia.length).toBe(39);
    const porFamilia = biologia.reduce<Record<string, number>>((acc, e) => {
      acc[e.family] = (acc[e.family] ?? 0) + 1;
      return acc;
    }, {});
    expect(porFamilia).toEqual({
      tipologia: 17,
      'cadeia-de-derivacao': 17,
      'escala-de-graus': 4,
      'contraste-de-posicoes': 1,
    });
  });

  it('teste de completude de produção: biologia + biologiaSemCena fecha os 72 capítulos', () => {
    const atribuidosEmProducao = [...biologia.map((e) => e.chapterId), ...biologiaSemCena.map((g) => g.chapterId)];
    expect(biologia.length + biologiaSemCena.length).toBe(72);
    expect(atribuidosEmProducao.length).toBe(capitulosDeBiologia.length);
  });
});
