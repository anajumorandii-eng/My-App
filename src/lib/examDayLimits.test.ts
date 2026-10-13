import assert from 'node:assert/strict';
import test from 'node:test';
import { applyExamDayLimits } from './examDayLimits';
import type { StudentGoals } from '../types';
const goals: StudentGoals = { primaryGoal: 'Medicina', secondaryGoals: [], boardWeights: [{ board: 'Unicamp', weight: 1, phaseFocus: 'ambas' }] };
const windows = [0, 1, 2].map((i) => ({ start: `2026-10-17T${14+i}:00:00-03:00`, end: `2026-10-17T${14+i}:50:00-03:00`, durationMinutes: 50 }));
test('prova ativa bloqueia o dia e véspera limita a 90 minutos de revisão', () => {
  assert.deepEqual(applyExamDayLimits(windows, '2026-10-18', goals), []);
  const eve = applyExamDayLimits(windows, '2026-10-17', goals);
  assert.equal(eve.reduce((sum, i) => sum + i.durationMinutes, 0), 90);
  assert.ok(eve.every((i) => i.purpose === 'review'));
});
test('prova inativa não bloqueia a rotina nem altera intervalos originais', () => {
  const inactive = { ...goals, boardWeights: [] };
  assert.deepEqual(applyExamDayLimits(windows, '2026-10-18', inactive), windows);
  assert.equal(windows[0].durationMinutes, 50);
});

test('Famerp oficial bloqueia as duas datas e Unifesp pendente não bloqueia', () => {
  const target = (board: string): StudentGoals => ({ ...goals, boardWeights: [{ board, weight: 1, phaseFocus: 'ambas' }] });
  assert.deepEqual(applyExamDayLimits(windows, '2026-12-10', target('Famerp')), []);
  assert.deepEqual(applyExamDayLimits(windows, '2026-12-11', target('Famerp')), []);
  assert.deepEqual(applyExamDayLimits(windows, '2026-12-17', target('Unifesp')), windows);
});
