import assert from 'node:assert/strict';
import test from 'node:test';
import type { InteractiveSummary, SummaryProgressMap } from '../types/summary';
import { buildSummaryProgressDashboard } from './summaryProgressDashboard';

const summary: InteractiveSummary = {
  id: 'bio-real', title: 'Resumo real', subject: 'Biologia', topic: 'Genética', priority: 'muito-alta',
  prerequisites: [], overview: 'Resumo',
  boards: [{ board: 'Fuvest', phases: ['primeira', 'segunda'] }, { board: 'ENEM/Inep', phases: ['unica'] }],
  sections: [{ id: 's1', title: 'Conceito', stage: 'conceito', depth: 'rapida', content: 'Conteúdo' }],
  retrieval: [
    { id: 'q1', sectionId: 's1', prompt: 'Pergunta 1', expectedElements: [], hint: '', transferPrompt: '', board: 'Fuvest', phase: 'segunda' },
    { id: 'q2', sectionId: 's1', prompt: 'Pergunta 2', expectedElements: [], hint: '', transferPrompt: '', board: 'ENEM/Inep', phase: 'unica' },
  ],
  sources: [{ label: 'Interno', kind: 'material-interno', materialId: 'source' }],
};

const progress: SummaryProgressMap = {
  'bio-real': {
    readSectionIds: ['s1'], status: 'dificuldade', important: true, lastOpenedAt: '2026-08-23T12:00:00.000Z',
    answers: [
      { questionId: 'q1', answer: 'a', matchedElements: [], firstMissingElement: 'mecanismo', outcome: 'incorreta', date: '2026-08-20T12:00:00.000Z', board: 'Fuvest', phase: 'segunda' },
      { questionId: 'q1', answer: 'b', matchedElements: ['conceito'], firstMissingElement: 'mecanismo', outcome: 'parcial', date: '2026-08-21T12:00:00.000Z', board: 'Fuvest', phase: 'segunda' },
      { questionId: 'q2', answer: 'c', matchedElements: ['tudo'], firstMissingElement: null, outcome: 'correta', date: '2026-08-22T12:00:00.000Z', board: 'ENEM/Inep', phase: 'unica' },
    ],
    reviews: {
      q1: { questionId: 'q1', nextReviewAt: '2026-08-23T12:00:00.000Z', intervalDays: 1, lastOutcome: 'parcial' },
      q2: { questionId: 'q2', nextReviewAt: '2026-08-30T12:00:00.000Z', intervalDays: 7, lastOutcome: 'correta' },
    },
  },
  removed: {
    readSectionIds: [], status: 'dificuldade', important: false,
    answers: [{ questionId: 'gone', answer: 'x', matchedElements: [], firstMissingElement: 'fonte', outcome: 'incorreta', date: '2026-08-19T12:00:00.000Z', summaryTitle: 'Removido', subject: 'História', topic: 'Antigo' }],
  },
};

test('agrega respostas reais por disciplina, banca e fase sem transformar pendências em tentativas', () => {
  const model = buildSummaryProgressDashboard({ summaries: [summary], progress, now: new Date('2026-08-24T12:00:00.000Z') });
  assert.deepEqual(model.answers, { correct: 1, partial: 1, incorrect: 1, pending: 0 });
  assert.deepEqual(model.subjects.map(({ key, attempted, correct }) => ({ key, attempted, correct })), [
    { key: 'Biologia', attempted: 2, correct: 1 },
    { key: 'História', attempted: 1, correct: 0 },
  ]);
  assert.deepEqual(model.boards.map(({ key, attempted, correct }) => ({ key, attempted, correct })), [
    { key: 'Fuvest', attempted: 1, correct: 0 },
    { key: 'ENEM/Inep', attempted: 1, correct: 1 },
  ]);
  assert.deepEqual(model.phases.map(({ key, attempted, correct }) => ({ key, attempted, correct })), [
    { key: 'segunda', attempted: 1, correct: 0 },
    { key: 'unica', attempted: 1, correct: 1 },
  ]);
});

test('expõe reincidência, mecanismos difíceis, revisões e links profundos acionáveis', () => {
  const model = buildSummaryProgressDashboard({ summaries: [summary], progress, now: new Date('2026-08-24T12:00:00.000Z') });
  assert.equal(model.recurrences[0].attempts, 2);
  assert.equal(model.recurrences[0].href, '/resumos?summary=bio-real&question=q1');
  assert.deepEqual(model.difficulties.map((item) => [item.label, item.count]), [['mecanismo', 2], ['fonte', 1]]);
  assert.deepEqual(model.reviews, { overdue: 1, upcoming: 1, completed: 1 });
  assert.equal(model.continueStudy?.href, '/resumos?summary=bio-real');
  assert.equal(model.brokenReferences, 1);
});

test('não fabrica médias no primeiro acesso e tolera registros antigos incompletos', () => {
  const empty = buildSummaryProgressDashboard({ summaries: [summary], progress: {}, now: new Date('2026-08-24T12:00:00.000Z') });
  assert.equal(empty.hasStudyData, false);
  assert.equal(empty.overallAccuracy, null);
  assert.deepEqual(empty.answers, { correct: 0, partial: 0, incorrect: 0, pending: 2 });

  const legacy = buildSummaryProgressDashboard({ summaries: [summary], progress: { legacy: { readSectionIds: [], status: 'nao-iniciado', important: false, answers: [{ questionId: 'old', answer: '', matchedElements: [], firstMissingElement: null, date: 'invalid' }] } }, now: new Date('2026-08-24T12:00:00.000Z') });
  assert.equal(legacy.overallAccuracy, null);
  assert.equal(legacy.brokenReferences, 1);
});
