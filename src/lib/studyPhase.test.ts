import assert from 'node:assert/strict';
import test from 'node:test';
import { phaseForDaysRemaining, nearestActiveExamDays, currentStudyPhase, CONSOLIDACAO, REVISAO_ATIVA, RETA_FINAL } from './studyPhase';
import { StudentGoals, BoardWeight } from '../types';

function goalsWith(boardWeights: BoardWeight[]): StudentGoals {
  return { primaryGoal: 'Teste', secondaryGoals: [], boardWeights };
}

test('phaseForDaysRemaining: mais de 60 dias é consolidação', () => {
  assert.equal(phaseForDaysRemaining(65).id, 'consolidacao');
});

test('phaseForDaysRemaining: entre 30 e 60 dias é revisão ativa', () => {
  assert.equal(phaseForDaysRemaining(45).id, 'revisao_ativa');
  assert.equal(phaseForDaysRemaining(60).id, 'revisao_ativa');
});

test('phaseForDaysRemaining: 30 dias ou menos é reta final', () => {
  assert.equal(phaseForDaysRemaining(30).id, 'reta_final');
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

test('currentStudyPhase: hoje (21/08), a 58 dias da Unicamp, já é revisão ativa (limiar de 60 dias)', () => {
  const now = new Date('2026-08-21T00:00:00');
  const phase = currentStudyPhase(
    goalsWith([
      { board: 'FUVEST', weight: 1, phaseFocus: 'ambas' },
      { board: 'UNICAMP', weight: 0.7, phaseFocus: 'ambas' },
    ]),
    now
  );
  assert.equal(phase.id, REVISAO_ATIVA.id);
});

test('currentStudyPhase: mais de 60 dias antes de qualquer prova ativa é consolidação', () => {
  const now = new Date('2026-07-01T00:00:00'); // mais de 60 dias antes da Unicamp (18/10)
  const phase = currentStudyPhase(goalsWith([{ board: 'UNICAMP', weight: 1, phaseFocus: 'ambas' }]), now);
  assert.equal(phase.id, CONSOLIDACAO.id);
});

test('currentStudyPhase: 45 dias antes de Unicamp (03/09) é revisão ativa', () => {
  const now = new Date('2026-09-03T00:00:00');
  const phase = currentStudyPhase(goalsWith([{ board: 'UNICAMP', weight: 1, phaseFocus: 'ambas' }]), now);
  assert.equal(phase.id, REVISAO_ATIVA.id);
});

test('currentStudyPhase: 20 dias antes de Unicamp já é reta final', () => {
  const now = new Date('2026-09-28T00:00:00');
  const phase = currentStudyPhase(goalsWith([{ board: 'UNICAMP', weight: 1, phaseFocus: 'ambas' }]), now);
  assert.equal(phase.id, RETA_FINAL.id);
});

test('currentStudyPhase: sem provas futuras conhecidas, cai em consolidação por padrão', () => {
  const now = new Date('2027-06-01T00:00:00'); // depois de todas as datas do calendário 2026
  const phase = currentStudyPhase(goalsWith([{ board: 'FUVEST', weight: 1, phaseFocus: 'ambas' }]), now);
  assert.equal(phase.id, CONSOLIDACAO.id);
});
