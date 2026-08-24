import assert from 'node:assert/strict';
import test from 'node:test';
import { buildRoadmap, upcomingMilestones } from './studyRoadmap';
import { StudentGoals, BoardWeight } from '../types';

function goalsWith(boardWeights: BoardWeight[]): StudentGoals {
  return { primaryGoal: 'Teste', secondaryGoals: [], boardWeights };
}

test('buildRoadmap gera uma semana por período de 7 dias, começando na segunda-feira', () => {
  const from = new Date('2026-08-21T00:00:00'); // sexta-feira
  const until = new Date('2026-09-10T00:00:00');
  const weeks = buildRoadmap(goalsWith([{ board: 'UNICAMP', weight: 1, phaseFocus: 'ambas' }]), from, until);
  assert.equal(weeks[0].weekStart, '2026-08-17'); // segunda da semana de 21/08
  for (const week of weeks) {
    const start = new Date(`${week.weekStart}T00:00:00`);
    assert.equal(start.getDay(), 1); // segunda-feira
  }
});

test('buildRoadmap soma minutos de estudo líquido da semana toda (seg-dom)', () => {
  const from = new Date('2026-08-17T00:00:00'); // segunda
  const weeks = buildRoadmap(goalsWith([{ board: 'UNICAMP', weight: 1, phaseFocus: 'ambas' }]), from, from);
  assert.equal(weeks.length, 1);
  assert.ok(weeks[0].netStudyMinutes > 0);
});

test('buildRoadmap marca a fase correta conforme a semana se aproxima da prova, e volta a subir a revisão pra 2ª fase', () => {
  const from = new Date('2026-07-01T00:00:00'); // mais de 60 dias antes da Unicamp (18/10)
  const until = new Date('2026-10-13T00:00:00'); // semana que contém a Unicamp 1ª fase (18/10)
  const weeks = buildRoadmap(goalsWith([{ board: 'UNICAMP', weight: 1, phaseFocus: 'ambas' }]), from, until);
  const firstWeek = weeks[0];
  const examWeek = weeks[weeks.length - 1];
  assert.equal(firstWeek.phase.id, 'consolidacao'); // mais de 60 dias antes da prova
  assert.equal(examWeek.phase.id, 'reta_final'); // semana da própria prova
});

test('buildRoadmap volta pra revisão ativa depois da 1ª fase, mirando a 2ª fase de novembro', () => {
  const from = new Date('2026-10-19T00:00:00'); // logo depois da Unicamp 1ª fase (18/10, domingo)
  const weeks = buildRoadmap(goalsWith([{ board: 'UNICAMP', weight: 1, phaseFocus: 'ambas' }]), from, from);
  // A 2ª fase da Unicamp é em 29-30/11 — a ~38 dias dessa semana, o que já
  // conta como revisão ativa (entre 30 e 60 dias) segundo a classificação.
  assert.equal(weeks[0].phase.id, 'revisao_ativa');
});

test('buildRoadmap inclui a prova como marco na semana em que ela cai', () => {
  const from = new Date('2026-10-12T00:00:00'); // segunda da semana da Unicamp 1ª fase (18/10, domingo)
  const weeks = buildRoadmap(goalsWith([{ board: 'UNICAMP', weight: 1, phaseFocus: 'ambas' }]), from, from);
  assert.equal(weeks.length, 1);
  assert.ok(weeks[0].milestones.some((m) => m.id === 'unicamp-1fase'));
});

test('buildRoadmap não inclui marco de banca inativa (peso zero)', () => {
  const from = new Date('2026-10-12T00:00:00');
  const weeks = buildRoadmap(goalsWith([{ board: 'UNICAMP', weight: 0, phaseFocus: 'ambas' }]), from, from);
  assert.equal(weeks[0].milestones.length, 0);
});

test('upcomingMilestones lista só provas futuras de bancas ativas, em ordem', () => {
  const now = new Date('2026-08-21T00:00:00');
  const milestones = upcomingMilestones(
    goalsWith([
      { board: 'UNICAMP', weight: 1, phaseFocus: 'ambas' },
      { board: 'FUVEST', weight: 1, phaseFocus: 'ambas' },
    ]),
    now
  );
  assert.ok(milestones.length > 0);
  assert.equal(milestones[0].id, 'unicamp-1fase'); // a mais próxima entre as duas bancas
  const dates = milestones.map((m) => m.date);
  assert.deepEqual(dates, [...dates].sort());
});
