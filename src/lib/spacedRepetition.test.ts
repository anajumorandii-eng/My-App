import assert from 'node:assert/strict';
import test from 'node:test';
import {
  nextReviewDate,
  daysOverdue,
  applyReviewOutcome,
  qualityFromStudyVerification,
  applyDiscursiveSelfRatingOutcome,
  qualityFromSelfRating,
  qualityFromAnswerCorrectness,
  easeFactorOf,
  intervalDaysOf,
  reviewCountOf,
} from './spacedRepetition';

test('checagem de sessão distingue esforço de evidência de aprendizagem', () => {
  assert.equal(qualityFromStudyVerification('nao_consegui'), 2);
  assert.equal(qualityFromStudyVerification('com_ajuda'), 3);
  assert.equal(qualityFromStudyVerification('sem_apoio'), 4);
});
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

test('easeFactorOf/intervalDaysOf/reviewCountOf usam defaults sensatos quando ausentes', () => {
  const m = mastery();
  assert.equal(easeFactorOf(m), 2.5);
  assert.equal(intervalDaysOf(m), 1);
  assert.equal(reviewCountOf(m), 0);
});

test('nextReviewDate soma o intervalo atual à última revisão', () => {
  const m = mastery({ lastReviewed: new Date('2026-08-01T00:00:00').toISOString(), intervalDays: 6 });
  const due = nextReviewDate(m);
  assert.equal(due.toISOString().slice(0, 10), '2026-08-07');
});

test('daysOverdue é negativo antes do vencimento e positivo depois', () => {
  const m = mastery({ lastReviewed: new Date('2026-08-01T00:00:00').toISOString(), intervalDays: 6 });
  const before = daysOverdue(m, new Date('2026-08-05T00:00:00'));
  const after = daysOverdue(m, new Date('2026-08-10T00:00:00'));
  assert.ok(before < 0);
  assert.ok(after > 0);
});

test('qualityFromSelfRating segue o padrão fraco/mediano/forte já usado em DiscursiveAttempt', () => {
  assert.equal(qualityFromSelfRating('fraco'), 2);
  assert.equal(qualityFromSelfRating('mediano'), 3);
  assert.equal(qualityFromSelfRating('forte'), 5);
});

test('qualityFromAnswerCorrectness mapeia certo/errado pra nota alta/baixa', () => {
  assert.equal(qualityFromAnswerCorrectness(true), 4);
  assert.equal(qualityFromAnswerCorrectness(false), 1);
});

test('applyReviewOutcome com nota baixa (esqueceu) reseta o intervalo pra 1 dia e zera a sequência', () => {
  const m = mastery({ intervalDays: 20, reviewCount: 3, easeFactor: 2.6 });
  const patch = applyReviewOutcome(m, 1);
  assert.equal(patch.intervalDays, 1);
  assert.equal(patch.reviewCount, 0);
  assert.ok(patch.easeFactor < 2.6); // fator de facilidade cai
  assert.ok(patch.level < m.level); // domínio cai
  assert.equal(patch.errorSignals, m.errorSignals + 1);
});

test('applyReviewOutcome avança a sequência clássica 1 -> 6 -> anterior*ease em acertos consecutivos', () => {
  let m = mastery({ level: 50 });
  const r1 = applyReviewOutcome(m, 5);
  assert.equal(r1.intervalDays, 1);
  assert.equal(r1.reviewCount, 1);

  m = { ...m, ...r1 };
  const r2 = applyReviewOutcome(m, 5);
  assert.equal(r2.intervalDays, 6);
  assert.equal(r2.reviewCount, 2);

  m = { ...m, ...r2 };
  const r3 = applyReviewOutcome(m, 5);
  assert.equal(r3.reviewCount, 3);
  // O intervalo usa o fator de facilidade já atualizado por essa mesma
  // revisão (convenção do SM-2: a nova EF já vale pra calcular o novo
  // intervalo), não o fator anterior.
  assert.equal(r3.intervalDays, Math.round(6 * r3.easeFactor));
  assert.ok(r3.intervalDays > 6); // intervalo cresce de verdade
});

test('applyReviewOutcome: fator de facilidade nunca cai abaixo do piso mínimo', () => {
  let m = mastery({ easeFactor: 1.35 });
  // várias notas baixas seguidas
  for (let i = 0; i < 10; i++) {
    const patch = applyReviewOutcome(m, 0);
    m = { ...m, ...patch };
  }
  assert.ok(m.easeFactor! >= 1.3);
});

test('applyReviewOutcome: nota máxima aumenta o domínio e zera sinais de erro', () => {
  const m = mastery({ level: 50, errorSignals: 3 });
  const patch = applyReviewOutcome(m, 5);
  assert.ok(patch.level > 50);
  assert.equal(patch.errorSignals, 2);
});

test('applyReviewOutcome: domínio nunca passa de 100 nem fica negativo', () => {
  const alto = mastery({ level: 99 });
  assert.equal(applyReviewOutcome(alto, 5).level, 100);
  const baixo = mastery({ level: 1 });
  assert.equal(applyReviewOutcome(baixo, 0).level, 0);
});

test('applyReviewOutcome atualiza lastReviewed para o momento informado', () => {
  const m = mastery();
  const now = new Date('2026-09-01T12:00:00');
  const patch = applyReviewOutcome(m, 4, now);
  assert.equal(patch.lastReviewed, now.toISOString());
});

test('autoavaliação discursiva forte limita o ganho de domínio a dois pontos', () => {
  const m = mastery({ level: 50 });
  const patch = applyDiscursiveSelfRatingOutcome(m, 'forte');
  assert.equal(patch.level, 52);
  assert.equal(patch.reviewCount, 1);
});

test('autoavaliação discursiva fraca ainda registra lacuna e revisão próxima', () => {
  const m = mastery({ level: 50, errorSignals: 1, intervalDays: 12, reviewCount: 4 });
  const patch = applyDiscursiveSelfRatingOutcome(m, 'fraco');
  assert.equal(patch.level, 46);
  assert.equal(patch.errorSignals, 2);
  assert.equal(patch.intervalDays, 1);
  assert.equal(patch.reviewCount, 0);
});
