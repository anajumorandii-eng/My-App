import test from 'node:test';
import assert from 'node:assert/strict';
import { parseStudyPlan, studyPlanForDate, daysBetween } from './studyPlan';

// Dados fictícios de propósito: o cronograma real mora só na conta.
const raw = {
  version: 1,
  title: 'Cronograma de teste',
  exams: [{ label: 'Prova B', date: '2026-03-20' }, { label: 'Prova A', date: '2026-03-10', endDate: '2026-03-11' }, { label: 'sem data' }],
  deadlines: [{ label: 'Inscrição', date: '2026-03-05' }, { label: 'Vencido', date: '2026-02-01' }],
  phases: [{ id: 'f1', label: 'Fase 1', start: '2026-03-01', end: '2026-03-10', focus: 'Prova A' }],
  rules: ['Corrigir logo após cada bloco', ''],
  eveChecklist: ['Documento'],
  days: {
    '2026-03-02': {
      title: 'Segunda', kind: 'study', blocks: [
        { start: '19:00', end: '20:30', label: 'Bloco C', activity: 'Matemática', resource: 'questoes', path: '/questoes?board=X' },
        { start: '14:15', end: '16:15', label: 'Bloco A', activity: 'Biologia', questions: 25, resource: 'questoes', path: 'https://fora.example' },
        { start: '17:00', end: '16:00', label: 'invertido', activity: 'x' },
        { start: '20:30', end: '21:00', label: 'Revisão', activity: 'Erros', resource: 'apagar-tudo' },
      ],
    },
    'não é data': { title: 'x', kind: 'study', blocks: [] },
    '2026-03-03': { title: 'tipo inválido', kind: 'festa', blocks: [] },
  },
};

test('descarta item inválido sem recusar o cronograma inteiro', () => {
  const plan = parseStudyPlan(raw);
  assert.ok(plan);
  assert.deepEqual(Object.keys(plan.days), ['2026-03-02']);
  assert.deepEqual(plan.days['2026-03-02'].blocks.map((b) => b.label), ['Bloco A', 'Bloco C', 'Revisão']);
  assert.deepEqual(plan.exams.map((e) => e.label), ['Prova A', 'Prova B']);
  assert.deepEqual(plan.rules, ['Corrigir logo após cada bloco']);
});

test('o botão de um bloco não sai do recurso dele', () => {
  const blocks = parseStudyPlan(raw)!.days['2026-03-02'].blocks;
  assert.equal(blocks[0].path, undefined);
  assert.equal(blocks[1].path, '/questoes?board=X');
  assert.equal(blocks[2].resource, undefined);
});

test('documento sem versão ou sem dias não vira cronograma', () => {
  assert.equal(parseStudyPlan({ ...raw, version: 2 }), null);
  assert.equal(parseStudyPlan({ ...raw, days: [] }), null);
  assert.equal(parseStudyPlan(null), null);
});

test('lê fase, provas, prazos e o bloco em andamento do dia', () => {
  const today = studyPlanForDate(parseStudyPlan(raw)!, '2026-03-02', '16:20');
  assert.equal(today.phase?.id, 'f1');
  assert.equal(today.day?.title, 'Segunda');
  assert.equal(today.currentBlockIndex, 1);
  assert.deepEqual(today.upcomingExams.map((e) => [e.label, e.days]), [['Prova A', 8], ['Prova B', 18]]);
  assert.deepEqual(today.deadlines.map((d) => [d.label, d.days]), [['Inscrição', 3]]);
});

test('prova de dois dias segue listada no segundo dia; depois do último bloco não há bloco atual', () => {
  const plan = parseStudyPlan(raw)!;
  assert.deepEqual(studyPlanForDate(plan, '2026-03-11').upcomingExams.map((e) => [e.label, e.days]), [['Prova A', 0], ['Prova B', 9]]);
  assert.equal(studyPlanForDate(plan, '2026-03-02', '21:30').currentBlockIndex, null);
  assert.equal(studyPlanForDate(plan, '2026-03-04').day, undefined);
});

test('conta dias corridos atravessando mês e horário de verão', () => {
  assert.equal(daysBetween('2026-10-26', '2026-11-01'), 6);
  assert.equal(daysBetween('2026-02-27', '2026-03-02'), 3);
});
