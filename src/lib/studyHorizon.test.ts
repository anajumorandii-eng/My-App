import test from 'node:test';
import assert from 'node:assert/strict';
import { buildStudyHorizon } from './studyHorizon';
import { createCourseRoutine } from '../features/availability/courseRoutine';
import type { StudentGoals } from '../types';
const goals: StudentGoals = { primaryGoal: 'Medicina', secondaryGoals: [], boardWeights: [{ board: 'Unicamp', weight: 1, phaseFocus: 'ambas' }] };
test('horizonte usa rotina salva e respeita prova e véspera sem inventar exceções futuras', () => {
  const horizon = buildStudyHorizon(createCourseRoutine('2026-10-13T12:00:00Z'), goals, '2026-10-13', '2026-10-19');
  const days = horizon.flatMap((week) => week.days);
  assert.equal(days.length, 7);
  assert.equal(days.find((day) => day.date === '2026-10-18')?.minutes, 0);
  assert.equal(days.find((day) => day.date === '2026-10-17')?.minutes, 90);
  assert.ok(days.find((day) => day.date === '2026-10-13')!.minutes > 200);
  assert.equal(horizon.reduce((n, week) => n + week.minutes, 0), days.reduce((n, day) => n + day.minutes, 0));
});
test('horizonte vazio e datas inválidas não produzem calendário enganoso', () => {
  const schedule = createCourseRoutine('2026-10-13T12:00:00Z');
  assert.deepEqual(buildStudyHorizon(schedule, goals, '2026-10-20', '2026-10-19'), []);
  assert.throws(() => buildStudyHorizon(schedule, goals, '2026-02-30', '2026-10-19'));
});
