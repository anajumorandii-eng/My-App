import assert from 'node:assert/strict';
import test from 'node:test';
import { isDue, applyFlashcardReview, qualityFromSelfRating } from './flashcardScheduler';
import { FlashcardReview } from '../types';

test('isDue: cartão nunca revisado está sempre devido', () => {
  assert.equal(isDue(undefined), true);
});

test('isDue: respeita a data programada', () => {
  const now = new Date('2026-08-22T00:00:00');
  const review: FlashcardReview = {
    cardId: 'c1', easeFactor: 2.5, intervalDays: 6, reviewCount: 2,
    dueDate: new Date('2026-08-25T00:00:00').toISOString(),
    lastReviewed: new Date('2026-08-19T00:00:00').toISOString(),
  };
  assert.equal(isDue(review, now), false);
  assert.equal(isDue(review, new Date('2026-08-26T00:00:00')), true);
});

test('applyFlashcardReview: esquecer reseta o intervalo pra 1 dia', () => {
  const now = new Date('2026-08-22T00:00:00');
  const prev: FlashcardReview = {
    cardId: 'c1', easeFactor: 2.5, intervalDays: 15, reviewCount: 3,
    dueDate: now.toISOString(), lastReviewed: now.toISOString(),
  };
  const next = applyFlashcardReview('c1', prev, qualityFromSelfRating('fraco'), now);
  assert.equal(next.intervalDays, 1);
  assert.equal(next.reviewCount, 0);
});

test('applyFlashcardReview: lembrar fácil avança a sequência e adia bastante', () => {
  const now = new Date('2026-08-22T00:00:00');
  const next = applyFlashcardReview('c1', undefined, qualityFromSelfRating('forte'), now);
  assert.equal(next.reviewCount, 1);
  assert.equal(next.intervalDays, 1); // primeira repetição bem-sucedida
  assert.equal(new Date(next.dueDate).getTime() > now.getTime(), true);
});

test('applyFlashcardReview: cartão novo usa fator de facilidade padrão', () => {
  const now = new Date('2026-08-22T00:00:00');
  const next = applyFlashcardReview('c1', undefined, qualityFromSelfRating('mediano'), now);
  assert.equal(next.easeFactor > 0, true);
  assert.equal(next.cardId, 'c1');
});
