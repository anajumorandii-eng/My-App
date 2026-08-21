import assert from 'node:assert/strict';
import test from 'node:test';
import { urgencyOf, pendingReviewCount } from './reviewUrgency';
import { TopicMastery } from '../types';

function mastery(overrides: Partial<TopicMastery> = {}): TopicMastery {
  return {
    topicId: 't1',
    level: 50,
    uncertainty: 0.3,
    errorSignals: 0,
    lastReviewed: new Date('2026-08-01T00:00:00').toISOString(),
    ...overrides,
  };
}

test('urgencyOf é baixa quando o vencimento ainda está longe', () => {
  const m = mastery({ intervalDays: 20 }); // vence em 2026-08-21
  const urgency = urgencyOf(m, new Date('2026-08-05T00:00:00')); // 16 dias antes de vencer
  assert.ok(urgency < 10);
});

test('urgencyOf sobe conforme o vencimento se aproxima e satura perto de 100 quando bem atrasado', () => {
  const m = mastery({ intervalDays: 6 }); // vence em 2026-08-07
  const noDia = urgencyOf(m, new Date('2026-08-07T00:00:00'));
  const atrasado = urgencyOf(m, new Date('2026-08-20T00:00:00')); // 13 dias atrasado
  assert.ok(noDia >= 55 && noDia <= 65);
  assert.equal(atrasado, 100);
});

test('urgencyOf nunca ultrapassa 100 nem fica negativa', () => {
  const m = mastery({ intervalDays: 1, errorSignals: 10 });
  const urgency = urgencyOf(m, new Date('2027-01-01T00:00:00'));
  assert.ok(urgency <= 100 && urgency >= 0);
});

test('urgencyOf: sinais de erro empurram a urgência pra cima mesmo antes do vencimento', () => {
  const semErro = mastery({ intervalDays: 20, errorSignals: 0 });
  const comErro = mastery({ intervalDays: 20, errorSignals: 5 });
  const now = new Date('2026-08-05T00:00:00');
  assert.ok(urgencyOf(comErro, now) > urgencyOf(semErro, now));
});

test('pendingReviewCount conta só tópicos com urgência acima de 50', () => {
  const now = new Date('2026-08-20T00:00:00');
  const masteryState = [
    mastery({ topicId: 'vencido', intervalDays: 1 }), // venceu há muito
    mastery({ topicId: 'em_dia', intervalDays: 60 }), // longe do vencimento
  ];
  assert.equal(pendingReviewCount(masteryState, now), 1);
});
