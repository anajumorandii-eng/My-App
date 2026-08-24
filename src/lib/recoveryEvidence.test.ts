import assert from 'node:assert/strict';
import test from 'node:test';
import { applyRecoveryEvidence, preserveLegacyMasteryRows } from './recoveryEvidence';
import { BacklogItem, TopicMastery } from '../types';

const backlogItem: BacklogItem = {
  id: 'backlog-1',
  topicId: 'bio_ecologia',
  state: 2,
  dependencia: 2,
  incidencia: 2,
  lacuna: 2,
  urgencia: 2,
  custo: 2,
  independentSuccesses: 0,
  canExplainTypicalError: false,
  supportLevel: 3,
  dateAdded: '2026-08-01T00:00:00.000Z',
};

const masteryItem: TopicMastery = {
  topicId: 'bio_ecologia',
  level: 40,
  uncertainty: 0.5,
  lastReviewed: '2026-08-01T00:00:00.000Z',
  errorSignals: 1,
};

test('evidência nova atualiza backlog e domínio no mesmo resultado', () => {
  const result = applyRecoveryEvidence(
    [backlogItem],
    [masteryItem],
    { id: 'evidence-1', backlogItemId: 'backlog-1', topicId: 'bio_ecologia', outcome: 'independente', occurredAt: '2026-08-23T12:00:00.000Z' },
    false,
  );

  assert.equal(result.applied, true);
  assert.equal(result.backlog[0].independentSuccesses, 1);
  assert.equal(result.mastery[0].level, 45);
});

test('repetir o mesmo evidenceId é idempotente', () => {
  const result = applyRecoveryEvidence(
    [backlogItem],
    [masteryItem],
    { id: 'evidence-1', backlogItemId: 'backlog-1', topicId: 'bio_ecologia', outcome: 'independente', occurredAt: '2026-08-23T12:00:00.000Z' },
    true,
  );

  assert.equal(result.applied, false);
  assert.deepEqual(result.backlog, [backlogItem]);
  assert.deepEqual(result.mastery, [masteryItem]);
});

test('nova tentativa independente no mesmo dia não aumenta domínio novamente', () => {
  const itemWithEvidence = { ...backlogItem, independentSuccesses: 1, lastIndependentSuccessAt: '2026-08-23T09:00:00.000Z' };
  const result = applyRecoveryEvidence(
    [itemWithEvidence],
    [masteryItem],
    { id: 'evidence-2', backlogItemId: 'backlog-1', topicId: 'bio_ecologia', outcome: 'independente', occurredAt: '2026-08-23T20:00:00.000Z' },
    false,
  );

  assert.equal(result.applied, true);
  assert.equal(result.backlog[0].independentSuccesses, 1);
  assert.equal(result.mastery[0].level, 40);
});

test('evidência rejeita backlogItemId que não pertence ao tópico informado', () => {
  assert.throws(() => applyRecoveryEvidence(
    [backlogItem],
    [masteryItem],
    { id: 'evidence-3', backlogItemId: 'backlog-1', topicId: 'mat_funcoes', outcome: 'independente', occurredAt: '2026-08-24T12:00:00.000Z' },
    false,
  ), /não corresponde/);
});

test('reconciliação preserva linhas legadas de domínio fora do catálogo atual', () => {
  const legacy = { ...masteryItem, topicId: 'legacy_topic', level: 63 };
  const reconciled = [{ ...masteryItem, level: 45 }];
  assert.deepEqual(preserveLegacyMasteryRows([masteryItem, legacy], reconciled), [
    { ...masteryItem, level: 45 },
    legacy,
  ]);
});
