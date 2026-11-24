import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import katex from 'katex';
import type { Question } from '../types.ts';
import { boardPriorities } from './boardPrep.ts';
import { famerpDiscursiveThemes, famerpPatterns, famerpTheory } from '../data/examTheory/famerp/index.ts';
import type { ChapterTheory } from '../data/examTheory/types.ts';
import { famerp2022Discursive } from '../data/discursiveFamerp2022.ts';
import { famerp2023Discursive } from '../data/discursiveFamerp2023.ts';
import { famerp2024Discursive } from '../data/discursiveFamerp2024.ts';
import { famerp2025Discursive } from '../data/discursiveFamerp2025.ts';
import { famerp2026Discursive } from '../data/discursiveFamerp2026.ts';

const bank = JSON.parse(readFileSync(new URL('../../public/questions.json', import.meta.url), 'utf8')) as Question[];
const priorityKeys = boardPriorities(bank, 'FAMERP').chapters.map((c) => `${c.topicId}::${c.chapter}`);
const NATUREZA = new Set(['Biologia', 'Química', 'Física']);

// Toda fórmula do texto passa pelo KaTeX em modo estrito de erro: uma barra
// esquecida no LaTeX vira texto vermelho na tela, e isso não aparece no tsc.
function mathOf(text: string): string[] {
  return [...text.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g)].map((m) => m[1] ?? m[2]);
}
function allText(t: ChapterTheory): string[] {
  return [t.howItFalls, t.explanation, ...(t.formulas ?? []).map((f) => f.meaning), ...t.applications, ...t.strategy,
    ...t.examples.flatMap((e) => [e.prompt, ...e.steps]), ...(t.discursive ? [t.discursive.prompt, ...t.discursive.modelAnswer, ...t.discursive.scoring] : []),
    ...t.traps.flatMap((x) => [x.trap, x.fix])];
}
function assertDeep(key: string, t: ChapterTheory) {
  assert.ok(t.explanation.length > 600, `${key}: explicação rasa`);
  assert.ok(t.applications.length >= 3, `${key}: onde se aplica`);
  assert.ok(t.strategy.length >= 2, `${key}: estratégia`);
  assert.ok(t.examples.length >= 1 && t.examples.every((e) => e.steps.length >= 1), `${key}: exemplos`);
  assert.ok(t.traps.length >= 2, `${key}: armadilhas`);
  for (const f of t.formulas ?? []) assert.doesNotThrow(() => katex.renderToString(f.tex, { throwOnError: true }), `${key}: ${f.tex}`);
  for (const text of allText(t)) for (const tex of mathOf(text)) {
    assert.doesNotThrow(() => katex.renderToString(tex, { throwOnError: true }), `${key}: $${tex}$`);
    // "16/1,6×10⁻¹⁹" compila no KaTeX e lê-se (16/1,6)×10⁻¹⁹: denominador em
    // notação científica precisa de \frac ou parênteses. A revisão pegou dois.
    assert.doesNotMatch(tex, /\/\s*[\d{},.]+\s*\\times\s*10/, `${key}: denominador sem agrupar em $${tex}$`);
  }
}

describe('teoria da Famerp: objetiva', () => {
  it('todo capítulo que mais cai tem teoria, e não sobra teoria órfã', () => {
    assert.deepEqual(priorityKeys.filter((k) => !famerpTheory[k]), [], 'importar um ano novo criou prioridade sem teoria');
    assert.deepEqual(Object.keys(famerpTheory).filter((k) => !priorityKeys.includes(k)), []);
  });

  it('cada capítulo é aprofundado e suas fórmulas compilam', () => {
    for (const [key, t] of Object.entries(famerpTheory)) assertDeep(key, t);
  });

  it('capítulo de Biologia, Química ou Física traz discursiva com resposta-modelo e critério', () => {
    const subjectOf = new Map(boardPriorities(bank, 'FAMERP').chapters.map((c) => [`${c.topicId}::${c.chapter}`, c.subject]));
    for (const [key, t] of Object.entries(famerpTheory)) {
      if (!NATUREZA.has(subjectOf.get(key)!)) continue;
      assert.ok(t.discursive && t.discursive.modelAnswer.length >= 2 && t.discursive.scoring.length >= 2, `${key}: discursiva`);
    }
  });
});

describe('teoria da Famerp: como a prova cobra', () => {
  it('todo capítulo prioritário tem ao menos um tipo de cobrança, e não há tipo de capítulo inexistente', () => {
    for (const key of priorityKeys) assert.ok(famerpPatterns[key]?.length, `${key}: sem tipos de cobrança`);
    assert.deepEqual(Object.keys(famerpPatterns).filter((k) => !priorityKeys.includes(k)), []);
  });

  it('cada questão citada existe no banco e é daquele capítulo; nenhuma questão do capítulo fica de fora', () => {
    for (const [key, patterns] of Object.entries(famerpPatterns)) {
      const [topicId, chapter] = key.split('::');
      const real = bank.filter((q) => q.examSource?.board === 'FAMERP' && q.topicId === topicId && q.chapter === chapter && q.examSource.questionNumber)
        .map((q) => `${q.examSource!.year} q${q.examSource!.questionNumber}`);
      const cited = patterns.flatMap((p) => p.questions);
      for (const c of cited) assert.ok(real.includes(c), `${key}: ${c} não é questão deste capítulo`);
      assert.deepEqual(real.filter((r) => !cited.includes(r)), [], `${key}: questão real sem tipo`);
      for (const p of patterns) {
        assert.ok(p.solve.length >= 1 && p.asks.length > 20 && p.distractors.length > 20, `${key}: ${p.title}`);
        for (const tex of [p.asks, ...p.solve, p.distractors].flatMap(mathOf)) assert.doesNotThrow(() => katex.renderToString(tex, { throwOnError: true }), `${key}: $${tex}$`);
      }
    }
  });
});

describe('teoria da Famerp: discursivas', () => {
  const realYears = new Map<string, Set<number>>();
  for (const q of [...famerp2022Discursive, ...famerp2023Discursive, ...famerp2024Discursive, ...famerp2025Discursive, ...famerp2026Discursive]) {
    if (!realYears.has(q.subject)) realYears.set(q.subject, new Set());
    realYears.get(q.subject)!.add(q.year);
  }

  it('cobre as três matérias do 2º dia, com ids únicos e anos que existem no banco', () => {
    assert.deepEqual(new Set(famerpDiscursiveThemes.map((t) => t.subject)), NATUREZA);
    assert.equal(new Set(famerpDiscursiveThemes.map((t) => t.id)).size, famerpDiscursiveThemes.length);
    for (const t of famerpDiscursiveThemes) for (const y of t.years) assert.ok(realYears.get(t.subject)!.has(y), `${t.id}: ${y}`);
  });

  // Matéria cujos temas já têm tipos de cobrança precisa cobrir todas as
  // discursivas reais dela: uma questão sem tipo é um pedaço da prova que a
  // teoria não ensina a responder.
  it('os tipos de cobrança citam discursivas reais da matéria e cobrem todas', () => {
    const all = [...famerp2022Discursive, ...famerp2023Discursive, ...famerp2024Discursive, ...famerp2025Discursive, ...famerp2026Discursive];
    for (const subject of NATUREZA) {
      const themes = famerpDiscursiveThemes.filter((t) => t.subject === subject);
      if (!themes.some((t) => t.patterns?.length)) continue;
      const real = all.filter((q) => q.subject === subject).map((q) => q.id);
      const cited = themes.flatMap((t) => (t.patterns ?? []).flatMap((p) => p.questions)).map((c) => {
        const [year, q] = c.split(' q');
        return `disc_famerp_${year}_q${q.padStart(2, '0')}`;
      });
      for (const id of cited) assert.ok(real.includes(id), `${subject}: ${id} não é discursiva real da matéria`);
      assert.deepEqual(real.filter((id) => !cited.includes(id)), [], `${subject}: discursivas sem tipo`);
    }
  });

  it('cada tema é aprofundado, com discursiva de treino, e suas fórmulas compilam', () => {
    for (const t of famerpDiscursiveThemes) {
      assertDeep(t.id, t);
      assert.ok(t.discursive && t.discursive.modelAnswer.length >= 2, `${t.id}: discursiva`);
    }
  });
});

it('redações-modelo da Famerp: um por tema real, quatro parágrafos e extensão de prova', async () => {
  const { famerpEssayModels } = await import('../data/examTheory/famerp/redacao');
  const { medicineEssayGuides } = await import('../data/vunespMedicineEssayGuide');
  const realThemes = medicineEssayGuides.Famerp.themes;
  assert.deepEqual(famerpEssayModels.map((e) => `${e.year} ${e.theme}`).sort(), realThemes.map((t) => `${t.year} ${t.theme}`).sort());
  for (const e of famerpEssayModels) {
    assert.deepEqual(e.paragraphs.map((p) => p.role), ['Introdução', 'Desenvolvimento 1', 'Desenvolvimento 2', 'Conclusão'], `${e.year}`);
    // ~10 palavras por linha manuscrita: 240 a 360 palavras cabem em 25–30 linhas.
    const words = e.paragraphs.map((p) => p.text).join(' ').split(/\s+/).length;
    assert.ok(words >= 240 && words <= 360, `${e.year}: ${words} palavras`);
    assert.ok(e.repertoire.length >= 2 && e.recorteTraps.length >= 2, `${e.year}`);
  }
});
