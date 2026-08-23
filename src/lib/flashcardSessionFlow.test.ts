import assert from 'node:assert/strict';
import test from 'node:test';

import {
  confirmFlashcardRating,
  startFlashcardSessionSnapshot,
} from './flashcardSessionFlow';

test('não confirma avanço quando avaliação retorna null ou false', async () => {
  assert.equal(await confirmFlashcardRating(() => null), false);
  assert.equal(await confirmFlashcardRating(() => false), false);
});

test('não confirma avanço quando avaliação rejeita', async () => {
  assert.equal(await confirmFlashcardRating(async () => {
    throw new Error('persistência indisponível');
  }), false);
});

test('confirma avanço somente quando avaliação retorna sucesso', async () => {
  assert.equal(await confirmFlashcardRating(() => true), true);
  assert.equal(await confirmFlashcardRating(async () => true), true);
});

test('snapshot mantém A, B, C durante a sessão e o próximo índice continua em B', () => {
  const initial = startFlashcardSessionSnapshot<string>(null, ['A', 'B', 'C']);
  assert.deepEqual(initial, ['A', 'B', 'C']);

  const afterRatingA = startFlashcardSessionSnapshot(initial, ['B', 'C']);
  assert.equal(afterRatingA, initial);
  assert.equal(afterRatingA?.[1], 'B');
});

test('nova sessão recalcula vencidos depois de limpar o snapshot', () => {
  assert.deepEqual(startFlashcardSessionSnapshot<string>(null, ['B', 'C']), ['B', 'C']);
});

test('não inicia sessão vazia nem substitui início existente', () => {
  assert.equal(startFlashcardSessionSnapshot<string>(null, []), null);
  const current = ['A'];
  assert.equal(startFlashcardSessionSnapshot(current, ['B']), current);
});
