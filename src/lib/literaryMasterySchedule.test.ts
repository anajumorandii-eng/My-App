import assert from 'node:assert/strict';
import test from 'node:test';
import { applyLiteraryReviewOutcome } from './literaryMasterySchedule';

test('applyLiteraryReviewOutcome: primeira tentativa forte sobe o nível e agenda a próxima', () => {
  const now = new Date('2026-08-22T00:00:00');
  const next = applyLiteraryReviewOutcome('u1', 'w1', 'formal', undefined, 5, now);
  assert.equal(next.level, 5);
  assert.equal(next.reviewCount, 1);
  assert.equal(next.workId, 'w1');
  assert.equal(next.dimension, 'formal');
});

test('applyLiteraryReviewOutcome: esquecer reseta o intervalo e derruba o nível', () => {
  const now = new Date('2026-08-22T00:00:00');
  const prev = {
    userId: 'u1', workId: 'w1', dimension: 'interpretive' as const,
    level: 60, uncertainty: 0.2, errorSignals: 0,
    lastReviewed: now.toISOString(), easeFactor: 2.5, intervalDays: 15, reviewCount: 4,
  };
  const next = applyLiteraryReviewOutcome('u1', 'w1', 'interpretive', prev, 1, now);
  assert.equal(next.intervalDays, 1);
  assert.equal(next.reviewCount, 0);
  assert.equal(next.level, 56);
  assert.equal(next.errorSignals, 1);
});

test('applyLiteraryReviewOutcome: preserva unitId quando informado', () => {
  const now = new Date('2026-08-22T00:00:00');
  const next = applyLiteraryReviewOutcome('u1', 'w1', 'factual', undefined, 4, now, 'unit-3');
  assert.equal(next.unitId, 'unit-3');
});
