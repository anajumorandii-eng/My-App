import assert from 'node:assert/strict';
import test from 'node:test';
import katex from 'katex';
import { getReviewedApostilaReference, replaceCorruptedApostilaSource } from './reviewedApostilaReferences';

test('recupera polígonos com condições, frações e páginas conferidas', () => {
  const reference = getReviewedApostilaReference('matematica', 'Geometria Plana', 'Ângulos em Polígonos')!;
  assert.ok(reference);
  assert.match(reference.text, /polígono convexo/);
  assert.ok(reference.text.includes('S_i=(n-2)\\cdot180^\\circ'));
  assert.ok(reference.text.includes('\\frac{360^\\circ}{n}'));
  assert.doesNotMatch(reference.text, /PDF: páginas/);
  assert.match(reference.url!, /1LY2wYXIO2vQnoq5yunu4jFe7BR2sIx1k/);
  assert.equal(reference.excerpt, true);
});
test('visão geral cabe inteira no orçamento e todas as fórmulas são válidas', () => {
  const reference = getReviewedApostilaReference('Matemática', 'Geometria Plana')!;
  assert.ok(reference.text.length <= 3000);
  for (const [, math] of reference.text.matchAll(/\$([^$]+)\$/g)) {
    assert.doesNotThrow(() => katex.renderToString(math, { throwOnError: true }));
  }
  assert.doesNotMatch(reference.text, /Open Save|NKrAO/);
});
test('não atribui o recorte a capítulos ou matérias sem conferência', () => {
  assert.equal(getReviewedApostilaReference('Física', 'Geometria Plana'), null);
  assert.equal(getReviewedApostilaReference('Matemática', 'Funções'), null);
  assert.equal(getReviewedApostilaReference('Matemática', 'Geometria Plana', 'Áreas'), null);
});
test('substitui somente a apostila corrompida preservando sua identificação', () => {
  const source = { id: 'AS1', title: 'Apostila: matemática — Geometria Plana', kind: 'resumo' as const, content: 'Open Save Rec Play exe Prefs', excerpt: true };
  const replacement = replaceCorruptedApostilaSource(source, '')!;
  assert.equal(replacement.id, 'AS1');
  assert.ok(replacement.content.includes('S_i=(n-2)'));
  assert.equal(replaceCorruptedApostilaSource({ ...source, content: 'Texto legível.' }, ''), null);
  assert.equal(replaceCorruptedApostilaSource({ ...source, title: 'Resumo editorial' }, ''), null);
});
