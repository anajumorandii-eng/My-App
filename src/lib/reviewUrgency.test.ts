import assert from 'node:assert/strict';
import test from 'node:test';
import { pendingReviewCount, urgencyOf } from './reviewUrgency';
import { TopicMastery } from '../types';

function mastery(overrides: Partial<TopicMastery> = {}): TopicMastery {
  return {
    topicId: 't1',
    level: 50,
    uncertainty: 0.1,
    errorSignals: 0,
    lastReviewed: new Date().toISOString(),
    ...overrides,
  };
}

test('urgência cresce com dias desde a revisão, incerteza e sinais de erro', () => {
  const fresh = urgencyOf(mastery());
  const stale = urgencyOf(mastery({ lastReviewed: new Date(Date.now() - 10 * 86400000).toISOString() }));
  const uncertain = urgencyOf(mastery({ uncertainty: 0.9 }));
  const errorProne = urgencyOf(mastery({ errorSignals: 5 }));

  assert.ok(stale > fresh);
  assert.ok(uncertain > fresh);
  assert.ok(errorProne > fresh);
});

test('urgência satura em 100', () => {
  const maxedOut = urgencyOf(mastery({
    lastReviewed: new Date(Date.now() - 365 * 86400000).toISOString(),
    uncertainty: 1,
    errorSignals: 20,
  }));
  assert.equal(maxedOut, 100);
});

test('conta apenas tópicos com urgência acima de 50', () => {
  const items = [
    mastery({ topicId: 'urgent', lastReviewed: new Date(Date.now() - 15 * 86400000).toISOString() }),
    mastery({ topicId: 'fine', lastReviewed: new Date().toISOString(), uncertainty: 0 }),
  ];
  assert.equal(pendingReviewCount(items), 1);
});
