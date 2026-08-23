import assert from 'node:assert/strict';
import test from 'node:test';

import {
  confirmFlashcardRating,
  clearFlashcardSessionSnapshot,
  cleanupFlashcardSessionLifecycle,
  createFlashcardSessionLifecycle,
  createFlashcardSessionIdentity,
  isFlashcardSessionLifecycleCurrent,
  renewFlashcardSessionLifecycle,
  resolveFlashcardRatingProgress,
  runFlashcardCompletion,
  setupFlashcardSessionLifecycle,
  startFlashcardSessionSnapshot,
  syncFlashcardSessionIdentity,
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

test('último sucesso conclui exatamente uma vez', () => {
  const progress = resolveFlashcardRatingProgress(true, 2, 3);
  let completions = 0;
  let completed = runFlashcardCompletion(progress, false, () => { completions += 1; });
  completed = runFlashcardCompletion(progress, completed, () => { completions += 1; });

  assert.deepEqual(progress, { advance: true, complete: true });
  assert.equal(completed, true);
  assert.equal(completions, 1);
});

test('falha não avança nem conclui e sucesso intermediário apenas avança', () => {
  assert.deepEqual(resolveFlashcardRatingProgress(false, 2, 3), {
    advance: false,
    complete: false,
  });
  const intermediate = resolveFlashcardRatingProgress(true, 1, 3);
  let completions = 0;
  assert.equal(runFlashcardCompletion(intermediate, false, () => { completions += 1; }), false);
  assert.deepEqual(intermediate, { advance: true, complete: false });
  assert.equal(completions, 0);
});

test('conclusão de Obras limpa o snapshot para a próxima lista recalculada', () => {
  assert.equal(clearFlashcardSessionSnapshot(['A', 'B', 'C']), null);
});

test('lifecycle restaura mounted após replay do StrictMode e desmonta no cleanup final', () => {
  const lifecycle = createFlashcardSessionLifecycle();
  setupFlashcardSessionLifecycle(lifecycle);
  cleanupFlashcardSessionLifecycle(lifecycle);
  setupFlashcardSessionLifecycle(lifecycle);
  assert.equal(lifecycle.mounted, true);

  const generation = lifecycle.generation;
  renewFlashcardSessionLifecycle(lifecycle);
  assert.equal(isFlashcardSessionLifecycleCurrent(lifecycle, generation), false);

  cleanupFlashcardSessionLifecycle(lifecycle);
  assert.equal(lifecycle.mounted, false);
  assert.equal(isFlashcardSessionLifecycleCurrent(lifecycle, lifecycle.generation), false);
});

test('array reconstruído com os mesmos IDs não renova geração nem reseta sessão', () => {
  const lifecycle = createFlashcardSessionLifecycle();
  setupFlashcardSessionLifecycle(lifecycle);
  const identity = createFlashcardSessionIdentity([{ id: 'A' }, { id: 'B' }, { id: 'C' }]);
  const generation = lifecycle.generation;

  const synced = syncFlashcardSessionIdentity(
    lifecycle,
    identity,
    [{ id: 'A' }, { id: 'B' }, { id: 'C' }],
  );

  assert.deepEqual(synced, { identity, reset: false });
  assert.equal(lifecycle.generation, generation);
  const indexAfterRating = 1;
  assert.equal(['A', 'B', 'C'][indexAfterRating], 'B');
});

test('sequência diferente renova geração e solicita reset', () => {
  const lifecycle = createFlashcardSessionLifecycle();
  const identity = createFlashcardSessionIdentity([{ id: 'A' }, { id: 'B' }]);
  const synced = syncFlashcardSessionIdentity(lifecycle, identity, [{ id: 'A' }, { id: 'C' }]);

  assert.equal(synced.reset, true);
  assert.equal(lifecycle.generation, 1);
});
