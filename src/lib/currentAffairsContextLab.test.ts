import assert from 'node:assert/strict';
import test from 'node:test';
import { CURRENT_AFFAIRS_CONTEXTS, classifyStatement, piecesOfLens } from './currentAffairsContextLab.ts';
import { interactiveSummaries } from '../data/interactiveSummaries.ts';

const cop30 = CURRENT_AFFAIRS_CONTEXTS['cop30-belem'];
const summary = interactiveSummaries.find((item) => item.id === cop30.chapterId);

test('o dossiê da COP30 aponta para um capítulo existente', () => {
  assert.ok(summary);
});

test('cada peça, lente e afirmação sai de uma seção com o mesmo tipo de evidência', () => {
  // A seção de estratégia (cop-l) não tem evidenceKind; contexto pode vir de
  // cop-t ou cop-u, que são as duas seções de contexto do capítulo.
  const kindOf = new Map(summary!.sections.map((section) => [section.id, section.evidenceKind]));
  for (const item of [...cop30.pieces, ...cop30.lenses, ...cop30.statements]) {
    const lens = 'lens' in item ? item.lens : undefined;
    assert.equal(kindOf.get(item.sectionId), lens, `${'id' in item ? item.id : item.lens} → ${item.sectionId}`);
  }
});

test('as quatro lentes têm peça na cena e afirmação para classificar', () => {
  for (const { lens } of cop30.lenses) {
    assert.ok(piecesOfLens(cop30, lens).length > 0, lens);
    assert.ok(cop30.statements.some((statement) => statement.lens === lens), lens);
  }
});

test('a ausência de rota para os fósseis é fato documental, não avaliação', () => {
  const rota = cop30.statements.find((statement) => statement.id === 's-rota')!;
  assert.deepEqual(classifyStatement(rota, 'interpretacao'), { correct: false, expected: 'fato' });
  assert.equal(classifyStatement(rota, 'fato').correct, true);
});

test('a regra de cada lente cabe na faixa da equação', () => {
  for (const { rule } of cop30.lenses) assert.ok(rule.length <= 28, rule);
});
