import test from 'node:test';
import assert from 'node:assert/strict';
import { sampleAcrossSubtopics, PER_SUBTOPIC, WITHOUT_SUBTOPIC } from './diagnosticSample';

type Item = { id: string; chapter?: string };
const make = (chapter: string | undefined, count: number, prefix: string): Item[] =>
  Array.from({ length: count }, (_, i) => ({ id: `${prefix}${i}`, chapter }));

const items = [...make('Populações', 6, 'p'), ...make('Biomas', 4, 'b'), ...make('Sucessão', 1, 's'), ...make(undefined, 44, 'x'), ...make('', 2, 'v')];
const count = (sample: Item[], chapter: string | undefined) => sample.filter((i) => (i.chapter || undefined) === chapter).length;

test('o tópico inteiro tira um sinal de cada subtópico, não todas as questões', () => {
  const sample = sampleAcrossSubtopics(items, (i) => i.chapter);
  assert.equal(count(sample, 'Populações'), PER_SUBTOPIC);
  assert.equal(count(sample, 'Biomas'), PER_SUBTOPIC);
  assert.equal(count(sample, 'Sucessão'), 1, 'subtópico com uma questão entra com ela, sem inventar outra');
  assert.equal(count(sample, undefined), WITHOUT_SUBTOPIC, 'sem subtópico e subtópico vazio são o mesmo grupo, com teto próprio');
  assert.equal(sample.length, PER_SUBTOPIC * 2 + 1 + WITHOUT_SUBTOPIC);
});

test('não repete questão e só devolve questões da entrada', () => {
  const sample = sampleAcrossSubtopics(items, (i) => i.chapter);
  assert.equal(new Set(sample.map((i) => i.id)).size, sample.length);
  assert.ok(sample.every((i) => items.includes(i)));
});

test('sorteia dentro do subtópico: em sorteios diferentes, questões diferentes', () => {
  const seen = new Set<string>();
  for (let run = 0; run < 30; run++) for (const item of sampleAcrossSubtopics(items, (i) => i.chapter)) if (item.chapter === 'Populações') seen.add(item.id);
  assert.ok(seen.size > PER_SUBTOPIC);
});

test('tópico vazio dá amostra vazia', () => {
  assert.deepEqual(sampleAcrossSubtopics([], () => undefined), []);
});
