import test from 'node:test';
import assert from 'node:assert/strict';
import { sampleAcrossSubtopics, PER_SUBTOPIC, WITHOUT_SUBTOPIC, MIN_ITEMS, MAX_ITEMS } from './diagnosticSample';

type Item = { id: string; chapter?: string };
const make = (chapter: string | undefined, count: number, prefix: string): Item[] =>
  Array.from({ length: count }, (_, i) => ({ id: `${prefix}${i}`, chapter }));
const count = (sample: Item[], chapter: string | undefined) => sample.filter((i) => (i.chapter || undefined) === chapter).length;
const unique = (sample: Item[]) => new Set(sample.map((i) => i.id)).size === sample.length;

// Forma de Ecologia no banco: 12 subtópicos de 2 a 6 questões e 44 sem subtópico.
const ecologia = [...Array.from({ length: 12 }, (_, s) => make(`S${s}`, 2 + (s % 5), `s${s}-`)).flat(), ...make(undefined, 44, 'x'), ...make('', 2, 'v')];

test('tópico com muitos subtópicos: uma questão de cada, mais a cota dos sem subtópico', () => {
  const sample = sampleAcrossSubtopics(ecologia, (i) => i.chapter);
  for (let s = 0; s < 12; s++) assert.equal(count(sample, `S${s}`), PER_SUBTOPIC);
  assert.equal(count(sample, undefined), WITHOUT_SUBTOPIC, 'sem subtópico e subtópico vazio são o mesmo grupo');
  assert.equal(sample.length, 12 + WITHOUT_SUBTOPIC);
  assert.ok(unique(sample));
});

test('nunca passa do teto, mesmo com mais subtópicos que ele', () => {
  const ingles = Array.from({ length: 18 }, (_, s) => make(`S${s}`, 4, `s${s}-`)).flat();
  const sample = sampleAcrossSubtopics(ingles, (i) => i.chapter);
  assert.equal(sample.length, MAX_ITEMS);
  assert.ok(new Set(sample.map((i) => i.chapter)).size === MAX_ITEMS, 'cada vaga do teto vai para um subtópico diferente');
});

test('tópico pequeno completa o piso sem repetir questão e espalhando entre subtópicos', () => {
  const pequeno = [...make('A', 5, 'a'), ...make('B', 5, 'b'), ...make('C', 1, 'c')];
  const sample = sampleAcrossSubtopics(pequeno, (i) => i.chapter);
  assert.equal(sample.length, MIN_ITEMS);
  assert.ok(unique(sample));
  assert.ok(count(sample, 'A') >= 3 && count(sample, 'B') >= 3, 'a sobra sai de A e B, não toda de um só');
});

test('com menos questões que o piso, usa todas', () => {
  const minimo = make('A', 3, 'a');
  assert.equal(sampleAcrossSubtopics(minimo, (i) => i.chapter).length, 3);
  assert.deepEqual(sampleAcrossSubtopics([], () => undefined), []);
});

test('sorteia dentro do subtópico: em sorteios diferentes, questões diferentes', () => {
  const seen = new Set<string>();
  for (let run = 0; run < 30; run++) for (const item of sampleAcrossSubtopics(ecologia, (i) => i.chapter)) if (item.chapter === 'S4') seen.add(item.id);
  assert.ok(seen.size > PER_SUBTOPIC);
});
