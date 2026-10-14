import test from 'node:test';
import assert from 'node:assert/strict';
import { remainingReviewIntervals, reviewExamFocus, buildReviewBlocks } from './reviewSessionPlan';
import { mockStudentGoals } from '../data/mockData';
const goals = { ...mockStudentGoals, boardWeights: [{ board: 'Unicamp', weight: 100, phaseFocus: 'ambas' as const }] };
const window = (start: string, end: string, purpose?: 'review') => ({ start, end, durationMinutes: (Date.parse(end)-Date.parse(start))/60000, purpose });
test('retira horários passados e recorta uma janela em andamento', () => {
  const result = remainingReviewIntervals([
    window('2026-10-14T12:00:00Z','2026-10-14T13:00:00Z'),
    window('2026-10-14T14:00:00Z','2026-10-14T15:00:00Z','review'),
  ], '2026-10-14', goals, '2026-10-14T14:40:00Z');
  assert.equal(result.length,1); assert.equal(result[0].durationMinutes,20);
  assert.equal(result[0].start,'2026-10-14T14:40:00.000Z');
});
test('dia de prova não sugere estudo; véspera reserva no máximo 90 minutos leves', () => {
  assert.deepEqual(remainingReviewIntervals([window('2026-10-18T12:00:00Z','2026-10-18T15:00:00Z')], '2026-10-18', goals,'2026-10-18T10:00:00Z'),[]);
  const intervals=remainingReviewIntervals([window('2026-10-17T12:00:00Z','2026-10-17T15:00:00Z')], '2026-10-17', goals,'2026-10-17T10:00:00Z');
  assert.equal(intervals[0].durationMinutes,90); assert.equal(intervals[0].purpose,'review');
});
test('foco distingue fases e não escolhe uma banca desativada', () => {
  assert.equal(reviewExamFocus('2026-10-14',goals)?.exam.id,'unicamp-1fase');
  assert.equal(reviewExamFocus('2026-10-19',goals)?.exam.phase,'2a-fase');
  assert.equal(reviewExamFocus('2026-10-14',{...goals,boardWeights:[]}),null);
});
test('roteiro cabe numa janela contínua e separa primeira e segunda fase', () => {
  const intervals=[window('2026-10-14T14:00:00Z','2026-10-14T14:45:00Z','review')];
  const first=buildReviewBlocks(intervals,30,reviewExamFocus('2026-10-14',goals));
  assert.equal(first.reduce((s,b)=>s+b.minutes,0),30);
  assert.ok(first.some(b=>b.resource==='questoes'));
  assert.ok(!first.some(b=>b.resource==='redacao'));
  const second=buildReviewBlocks(intervals,45,reviewExamFocus('2026-11-20',goals));
  assert.ok(second.some(b=>b.resource==='discursivas'));
  assert.ok(second.some(b=>b.resource==='redacao'));
  assert.equal(buildReviewBlocks([window('2026-10-14T14:00:00Z','2026-10-14T14:04:00Z')],30,null).length,0);
});
