import assert from 'node:assert/strict';
import test from 'node:test';
import type { InteractiveSummary, SummaryProgressMap } from '../types/summary';
import {
  applySummaryAttempt,
  classifySummaryAnswer,
  deriveSummaryErrorEntries,
  getScheduledSummaryReviews,
  migrateSummaryProgressMap,
} from './summaryStudy';

const summary: InteractiveSummary = {
  id: 'fis-termologia', title: 'Termologia', subject: 'Física', topic: 'Calor', priority: 'muito-alta',
  prerequisites: [], overview: 'Resumo', boards: [{ board: 'Fuvest', phases: ['primeira', 'segunda'] }],
  sections: [{ id: 'exercise', title: 'Exercício', stage: 'exercicio', depth: 'prova', content: 'Resolva.' }],
  retrieval: [{ id: 'q1', sectionId: 'exercise', prompt: 'Explique a fusão.', hint: 'Energia.', transferPrompt: 'Transfira.', expectedElements: [
    { label: 'fase', keywords: ['fase'] }, { label: 'energia', keywords: ['energia'] },
  ] }],
  sources: [{ label: 'Questão Fuvest', kind: 'material-interno', materialId: 'disc_fuvest_fis_2024' }],
};
const iso = '2026-08-24T12:00:00.000Z';

test('classifica estados não respondido, incorreto, parcial e correto', () => {
  assert.equal(classifySummaryAnswer('', [], 'fase'), 'nao-respondida');
  assert.equal(classifySummaryAnswer('não sei', [], 'fase'), 'incorreta');
  assert.equal(classifySummaryAnswer('mudança de fase', ['fase'], 'energia'), 'parcial');
  assert.equal(classifySummaryAnswer('fase e energia', ['fase', 'energia'], null), 'correta');
});

test('erro parcial cria uma única entrada vinculada e agenda revisão em três dias', () => {
  const next = applySummaryAttempt({}, summary, summary.retrieval[0], {
    answer: 'mudança de fase', matchedElements: ['fase'], firstMissingElement: 'energia', transferUnlocked: false,
  }, iso);
  const errors = deriveSummaryErrorEntries(next, [summary]);
  assert.equal(errors.length, 1);
  assert.equal(errors[0].outcome, 'parcial');
  assert.equal(errors[0].summaryId, 'fis-termologia');
  assert.equal(errors[0].sectionId, 'exercise');
  assert.equal(errors[0].subject, 'Física');
  assert.deepEqual(errors[0].boards, ['Fuvest']);
  assert.deepEqual(errors[0].materialIds, ['disc_fuvest_fis_2024']);
  assert.equal(next['fis-termologia'].reviews.q1.nextReviewAt, '2026-08-27T12:00:00.000Z');
});

test('acerto inicial não cria entrada indevida no caderno', () => {
  const next = applySummaryAttempt({}, summary, summary.retrieval[0], {
    answer: 'fase e energia', matchedElements: ['fase', 'energia'], firstMissingElement: null, transferUnlocked: true,
  }, iso);
  assert.deepEqual(deriveSummaryErrorEntries(next, [summary]), []);
});

test('nova tentativa complementa o histórico sem duplicar a questão e marca evolução', () => {
  const first = applySummaryAttempt({}, summary, summary.retrieval[0], { answer: 'não sei', matchedElements: [], firstMissingElement: 'fase', transferUnlocked: false }, iso);
  const second = applySummaryAttempt(first, summary, summary.retrieval[0], { answer: 'fase e energia', matchedElements: ['fase', 'energia'], firstMissingElement: null, transferUnlocked: true }, '2026-08-25T12:00:00.000Z');
  const errors = deriveSummaryErrorEntries(second, [summary]);
  assert.equal(errors.length, 1);
  assert.equal(errors[0].resolved, true);
  assert.equal(errors[0].attempts.length, 2);
  assert.equal(errors[0].attempts[0].outcome, 'incorreta');
  assert.equal(errors[0].attempts[1].outcome, 'correta');
  assert.equal(second['fis-termologia'].reviews.q1.nextReviewAt, '2026-09-01T12:00:00.000Z');
});

test('revisão automática é criada, atualizada e ordenada por vencimento', () => {
  const due = applySummaryAttempt({}, summary, summary.retrieval[0], { answer: 'não sei', matchedElements: [], firstMissingElement: 'fase', transferUnlocked: false }, '2026-08-20T12:00:00.000Z');
  const queue = getScheduledSummaryReviews(due, [summary], new Date(iso));
  assert.equal(queue.length, 1);
  assert.equal(queue[0].isDue, true);
  assert.equal(queue[0].questionId, 'q1');
});

test('referência removida continua legível sem quebrar e perde apenas o link direto', () => {
  const progress = applySummaryAttempt({}, summary, summary.retrieval[0], { answer: 'não sei', matchedElements: [], firstMissingElement: 'fase', transferUnlocked: false }, iso);
  const [entry] = deriveSummaryErrorEntries(progress, []);
  assert.equal(entry.referenceMissing, true);
  assert.equal(entry.title, 'Termologia');
  assert.equal(entry.href, null);
});

test('migra dados antigos sem agenda nem metadados e preserva as respostas anteriores', () => {
  const legacy = { 'fis-termologia': { readSectionIds: ['exercise'], status: 'dificuldade', important: false, answers: [{ questionId: 'q1', answer: 'antiga', matchedElements: [], firstMissingElement: 'fase', date: iso }] } } as unknown as SummaryProgressMap;
  const migrated = migrateSummaryProgressMap(legacy, [summary]);
  assert.equal(migrated['fis-termologia'].answers.length, 1);
  assert.equal(migrated['fis-termologia'].answers[0].outcome, 'incorreta');
  assert.equal(migrated['fis-termologia'].answers[0].subject, 'Física');
  assert.equal(migrated['fis-termologia'].reviews.q1.nextReviewAt, '2026-08-25T12:00:00.000Z');
});
