import test from 'node:test';
import assert from 'node:assert/strict';
import { interactiveSummaries } from '../data/interactiveSummaries';
import { MATH_CHAPTER_FOCUS, chapterFocus } from './mathChapterFocus';

const ids = new Set(interactiveSummaries.map((item) => item.id));

test('todo foco aponta para um capítulo que existe', () => {
  for (const id of Object.keys(MATH_CHAPTER_FOCUS)) assert.ok(ids.has(id), id);
});

test('dois capítulos não abrem com o mesmo título nem a mesma pergunta', () => {
  const focos = Object.values(MATH_CHAPTER_FOCUS);
  assert.equal(new Set(focos.map((f) => f.title)).size, focos.length);
  assert.equal(new Set(focos.map((f) => f.subtitle)).size, focos.length);
});

test('capítulo sem foco próprio mantém o texto da família', () => {
  const familia = { title: 'Função quadrática', subtitle: 'pergunta' };
  assert.deepEqual(chapterFocus('summary-matematica-funcao-quadratica', familia), familia);
});
