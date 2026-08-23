import assert from 'node:assert/strict';
import test from 'node:test';

import { confirmFlashcardRating } from './flashcardSessionFlow';

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
