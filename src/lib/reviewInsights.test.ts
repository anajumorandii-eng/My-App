import assert from 'node:assert/strict';
import test from 'node:test';
import { buildReviewInsight, buildErrorRevisitPlan } from './reviewInsights';
import type { TopicMastery, ErrorLog } from '../types';
const now = new Date('2026-10-13T18:00:00Z');
const mastery: TopicMastery = { topicId: 'bio_genetica', level: 35, uncertainty: .6, lastReviewed: '2026-10-01T18:00:00Z', errorSignals: 0 };
test('domínio baixo recomenda pré-requisito com evidência e critério, sem inventar padrão de erro', () => {
  const result = buildReviewInsight(mastery, now);
  assert.equal(result.minutes, 20);
  assert.match(result.action, /pré-requisito/);
  assert.match(result.evidence, /35%/);
  assert.ok(result.success.length > 20);
  assert.doesNotMatch(result.evidence, /erros de cálculo|erros de leitura/);
});
test('domínio alto incerto pede checagem independente antes de afirmar domínio', () => {
  const result = buildReviewInsight({ ...mastery, level: 90, uncertainty: .8, lastReviewed: now.toISOString(), intervalDays: 10 }, now);
  assert.match(result.action, /sem consulta/);
  assert.match(result.evidence, /incerteza/);
});
test('revisitas de erros seguem datas locais D+1/D+3/D+7 e não repetem checkpoints concluídos', () => {
  const error: ErrorLog = { id: 'e1', topicId: 'bio_genetica', questionId: 'q1', date: '2026-10-12T18:00:00Z', type: 'unknown', notes: '' };
  const result = buildErrorRevisitPlan([error], '2026-10-13');
  assert.deepEqual(result.map((r) => r.day), [1]);
  assert.equal(result[0].dueDate, '2026-10-13');
  assert.match(result[0].action, /primeiro passo/);
  assert.equal(buildErrorRevisitPlan([{ ...error, revisitResults: { '1': { completedAt: now.toISOString(), rating: 'independente' } } }], '2026-10-13').length, 0);
  assert.equal(buildErrorRevisitPlan([error], '2026-10-15')[0].day, 3);
  assert.equal(buildErrorRevisitPlan([error], '2026-10-19')[0].day, 7);
});

test('tentativa com ajuda não encerra a revisita e reaparece na data de nova tentativa', () => {
  const error: ErrorLog = { id: 'e2', topicId: 'bio_genetica', questionId: 'q2', date: '2026-10-12T18:00:00Z', type: 'conceptual', notes: '', revisitResults: { '1': { completedAt: now.toISOString(), rating: 'com_ajuda', nextAttemptDate: '2026-10-14' } } };
  assert.equal(buildErrorRevisitPlan([error], '2026-10-13').length, 0);
  const repeat = buildErrorRevisitPlan([error], '2026-10-14');
  assert.equal(repeat.length, 1);
  assert.equal(repeat[0].day, 1);
  assert.equal(repeat[0].dueDate, '2026-10-14');
});
