import assert from 'node:assert/strict';
import test from 'node:test';

import {
  beginFlashcardReviewHydration,
  canRecordFlashcardReview,
  completeFlashcardReviewHydration,
  failFlashcardReviewHydration,
  flashcardReviewDemoState,
  isFlashcardReviewStudyReady,
} from './flashcardReviewHydration';

test('fetch rejeitado permanece em erro e não libera estudo autenticado', () => {
  const loading = beginFlashcardReviewHydration(flashcardReviewDemoState, 'user-a');
  const failed = failFlashcardReviewHydration(loading, 'user-a');

  assert.deepEqual(failed, { status: 'error', ownerUid: 'user-a' });
  assert.equal(isFlashcardReviewStudyReady(failed, 'user-a'), false);
});

test('bloqueia escrita autenticada fora de ready e mantém demo funcional', () => {
  assert.equal(canRecordFlashcardReview(
    { status: 'loading', ownerUid: 'user-a' },
    'user-a',
  ), false);
  assert.equal(canRecordFlashcardReview(
    { status: 'error', ownerUid: 'user-a' },
    'user-a',
  ), false);
  assert.equal(canRecordFlashcardReview(
    { status: 'ready', ownerUid: 'user-a' },
    'user-b',
  ), false);
  assert.equal(canRecordFlashcardReview(
    { status: 'ready', ownerUid: 'user-a' },
    'user-a',
  ), true);
  assert.equal(canRecordFlashcardReview(flashcardReviewDemoState, null), true);
});

test('retry volta a loading e somente sucesso libera o owner atual', () => {
  const failed = { status: 'error', ownerUid: 'user-a' } as const;
  const retrying = beginFlashcardReviewHydration(failed, 'user-a');
  assert.deepEqual(retrying, { status: 'loading', ownerUid: 'user-a' });
  assert.equal(isFlashcardReviewStudyReady(retrying, 'user-a'), false);

  const ready = completeFlashcardReviewHydration(retrying, 'user-a');
  assert.deepEqual(ready, { status: 'ready', ownerUid: 'user-a' });
  assert.equal(isFlashcardReviewStudyReady(ready, 'user-a'), true);
});

test('reidratação do mesmo UID invalida ready antes do novo fetch', () => {
  const ready = { status: 'ready', ownerUid: 'user-a' } as const;

  assert.deepEqual(beginFlashcardReviewHydration(ready, 'user-a'), {
    status: 'loading',
    ownerUid: 'user-a',
  });
});
