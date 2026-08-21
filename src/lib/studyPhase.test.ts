import assert from 'node:assert/strict';
import test from 'node:test';
import { phaseForDaysRemaining, nearestActiveExamDays, currentStudyPhase, CONSOLIDACAO, REVISAO_ATIVA, RETA_FINAL } from './studyPhase';
import { StudentGoals, BoardWeight } from '../types';

function goalsWith(boardWeights: BoardWeight[]): StudentGoals {
  return { primaryGoal: 'Teste', secondaryGoals: [], boardWeights };
}

test('phaseForDaysRemaining: mais de 45 dias é consolidação', () => {
  assert.equal(phaseForDaysRemaining(58).id, 'consolidacao');
});

test('phaseForDaysRemaining: entre 20 e 45 dias é revisão ativa', () => {
  assert.equal(phaseForDaysRemaining(30).id, 'revisao_ativa');
  assert.equal(phaseForDaysRemaining(45).id, 'revisao_ativa');
});

test('phaseForDaysRemaining: 20 dias ou menos é reta final', () => {
  assert.equal(phaseForDaysRemaining(20).id, 'reta_final');
  assert.equal(phaseForDaysRemaining(0).id, 'reta_final');
});

test('nearestActiveExamDays ignora bancas com peso zero', () => {
  const now = new Date('2026-08-21T00:00:00');
  const days = nearestActiveExamDays(goalsWith([{ board: 'FUVEST', weight: 0, phaseFocus: 'ambas' }]), now);
  assert.equal(days, null);
});

test('nearestActiveExamDays pega a prova mais próxima entre bancas ativas (Unicamp antes de Fuvest)', () => {
  const now = new Date('2026-08-21T00:00:00');
  const days = nearestActiveExamDays(
    goalsWith([
      { board: 'FUVEST', weight: 1, phaseFocus: 'ambas' },
      { board: 'UNICAMP', weight: 0.7, phaseFocus: 'ambas' },
    ]),
    now
  );
  // Unicamp 1ª fase é 18/10/2026, 58 dias depois de 21/08.
  assert.equal(days, 58);
});

test('nearestActiveExamDays retorna null sem bancas ativas', () => {
  const now = new Date('2026-08-21T00:00:00');
  assert.equal(nearestActiveExamDays(goalsWith([]), now), null);
});

test('currentStudyPhase: hoje (21/08), com Fuvest e Unicamp ativas, ainda é consolidação', () => {
  const now = new Date('2026-08-21T00:00:00');
  const phase = currentStudyPhase(
    goalsWith([
      { board: 'FUVEST', weight: 1, phaseFocus: 'ambas' },
      { board: 'UNICAMP', weight: 0.7, phaseFocus: 'ambas' },
    ]),
    now
  );
  assert.equal(phase.id, CONSOLIDACAO.id);
});

test('currentStudyPhase: 30 dias antes de Unicamp (18/09) já é revisão ativa', () => {
  const now = new Date('2026-09-18T00:00:00');
  const phase = currentStudyPhase(goalsWith([{ board: 'UNICAMP', weight: 1, phaseFocus: 'ambas' }]), now);
  assert.equal(phase.id, REVISAO_ATIVA.id);
});

test('currentStudyPhase: 10 dias antes de Unicamp já é reta final', () => {
  const now = new Date('2026-10-08T00:00:00');
  const phase = currentStudyPhase(goalsWith([{ board: 'UNICAMP', weight: 1, phaseFocus: 'ambas' }]), now);
  assert.equal(phase.id, RETA_FINAL.id);
});

test('currentStudyPhase: sem provas futuras conhecidas, cai em consolidação por padrão', () => {
  const now = new Date('2027-06-01T00:00:00'); // depois de todas as datas do calendário 2026
  const phase = currentStudyPhase(goalsWith([{ board: 'FUVEST', weight: 1, phaseFocus: 'ambas' }]), now);
  assert.equal(phase.id, CONSOLIDACAO.id);
});
