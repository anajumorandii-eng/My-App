import assert from 'node:assert/strict';
import test from 'node:test';
import { EfficiencyEngine, computeBoardSignals, examFocusFor } from './efficiencyEngine';
import { Topic, TopicMastery, UserProfile, StudentGoals, BoardWeight } from '../types';

function topic(overrides: Partial<Topic> = {}): Topic {
  return { id: 't1', name: 'Tópico', subject: 'Biologia', prerequisites: [], ...overrides };
}

function mastery(overrides: Partial<TopicMastery> = {}): TopicMastery {
  return {
    topicId: 't1',
    level: 50,
    uncertainty: 0.3,
    errorSignals: 0,
    lastReviewed: new Date().toISOString(),
    ...overrides,
  };
}

function profile(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    targetCourse: 'Medicina',
    targetUniversities: [],
    targetExams: [],
    availableHoursPerWeek: 20,
    currentEnergyLevel: 'medium',
    autonomyIndex: 50,
    ...overrides,
  };
}

function goalsWith(boardWeights: BoardWeight[]): StudentGoals {
  return { primaryGoal: 'Teste', secondaryGoals: [], boardWeights };
}

const NO_GOALS = goalsWith([]);

test('generateDailyPlan prioriza domínio baixo e erros recorrentes', () => {
  const topics = [topic({ id: 'fraco', name: 'Fraco' }), topic({ id: 'forte', name: 'Forte' })];
  const masteryData = [
    mastery({ topicId: 'fraco', level: 10, errorSignals: 5, uncertainty: 0.9 }),
    mastery({ topicId: 'forte', level: 95, errorSignals: 0, uncertainty: 0.05 }),
  ];
  const plan = EfficiencyEngine.generateDailyPlan(masteryData, topics, profile(), 500, NO_GOALS);
  assert.equal(plan[0].topicId, 'fraco');
  assert.ok(plan[0].reasons.includes('dominio_insuficiente'));
  assert.ok(plan[0].reasons.includes('erro_recorrente'));
});

test('generateDailyPlan respeita o tempo disponível e marca tempo_disponivel só em quem entrou', () => {
  const topics = [topic({ id: 'a' }), topic({ id: 'b' })];
  const masteryData = [
    mastery({ topicId: 'a', level: 10 }), // theory, 45min
    mastery({ topicId: 'b', level: 10 }), // theory, 45min
  ];
  const plan = EfficiencyEngine.generateDailyPlan(masteryData, topics, profile(), 45, NO_GOALS);
  assert.equal(plan.length, 1);
  assert.ok(plan[0].reasons.includes('tempo_disponivel'));
});

test('generateDailyPlan sinaliza pré-requisito bloqueado', () => {
  const topics = [
    topic({ id: 'base', name: 'Base' }),
    topic({ id: 'avancado', name: 'Avançado', prerequisites: ['base'] }),
  ];
  const masteryData = [
    mastery({ topicId: 'base', level: 20 }),
    mastery({ topicId: 'avancado', level: 60 }),
  ];
  const plan = EfficiencyEngine.generateDailyPlan(masteryData, topics, profile(), 500, NO_GOALS);
  const avancado = plan.find((a) => a.topicId === 'avancado');
  assert.ok(avancado?.reasons.includes('prerequisito_bloqueado'));
});

test('generateDailyPlan sem bancas ativas não aplica boost de prova (multiplicador neutro)', () => {
  const topics = [topic({ id: 't1' })];
  const masteryData = [mastery({ topicId: 't1', level: 50 })];
  const plan = EfficiencyEngine.generateDailyPlan(masteryData, topics, profile(), 500, NO_GOALS);
  assert.ok(!plan[0].reasons.includes('proximidade_prova'));
  assert.ok(!plan[0].reasons.includes('incidencia_banca_prioritaria'));
});

test('computeBoardSignals ignora banca com peso zero', () => {
  const now = new Date('2026-10-02T00:00:00');
  const signals = computeBoardSignals(goalsWith([{ board: 'FUVEST', weight: 0, phaseFocus: 'ambas' }]), now);
  assert.equal(signals.length, 0);
});

test('computeBoardSignals calcula progresso a partir da prova real mais próxima da banca', () => {
  const now = new Date('2026-10-02T00:00:00'); // 30 dias antes da Fuvest 1ª fase (01/11/2026)
  const signals = computeBoardSignals(goalsWith([{ board: 'FUVEST', weight: 1, phaseFocus: 'ambas' }]), now);
  assert.equal(signals.length, 1);
  assert.equal(signals[0].board, 'Fuvest');
  assert.ok(Math.abs(signals[0].progress - (60 / 90)) < 1e-9);
});

test('computeBoardSignals respeita o foco de fase escolhido pela estudante', () => {
  const now = new Date('2026-10-02T00:00:00');
  // Só 2ª fase: ignora a 1ª fase de 01/11 e usa a 2ª fase de 06/12 (65 dias).
  const signals = computeBoardSignals(goalsWith([{ board: 'FUVEST', weight: 1, phaseFocus: '2a-fase' }]), now);
  assert.equal(signals.length, 1);
  assert.ok(Math.abs(signals[0].progress - (25 / 90)) < 1e-9);
});

test('examFocusFor não altera nada quando não há sinais de banca', () => {
  const focus = examFocusFor(topic({ id: 'bio_ecologia', subject: 'Biologia' }), []);
  assert.equal(focus.multiplier, 1);
  assert.equal(focus.hasProximityReason, false);
  assert.equal(focus.hasIncidenceReason, false);
});

test('examFocusFor usa o maior sinal entre bancas, não a soma (banca secundária perto não sequestra)', () => {
  const t = topic({ id: 'bio_ecologia', subject: 'Biologia' }); // tema com incidência real alta em Fuvest
  const onlyStrong = examFocusFor(t, [{ board: 'Fuvest', weight: 1, progress: 0.8 }]);
  const strongPlusWeak = examFocusFor(t, [
    { board: 'Fuvest', weight: 1, progress: 0.8 },
    { board: 'Famerp', weight: 0.1, progress: 0.9 },
  ]);
  // Um sinal de banca fraca a mais não deve empilhar por cima do forte —
  // o resultado com os dois sinais é idêntico ao só com o forte, porque o
  // combinador é max(), não soma.
  assert.ok(Math.abs(strongPlusWeak.multiplier - onlyStrong.multiplier) < 1e-9);
  assert.ok(onlyStrong.hasProximityReason);
  assert.ok(onlyStrong.hasIncidenceReason);
});

test('examFocusFor não penaliza tópico sem dado de incidência, mas também não o marca como relevante', () => {
  const semIncidencia = topic({ id: 'fis_estatica', subject: 'Física' });
  const focus = examFocusFor(semIncidencia, [{ board: 'Fuvest', weight: 1, progress: 0.8 }]);
  assert.equal(focus.hasIncidenceReason, false);
  assert.ok(focus.multiplier > 1); // ainda ganha o boost geral de urgência, só não o de incidência
});

test('generateDailyPlan em reta final reserva orçamento pra revisão mesmo quando o conteúdo novo teria prioridade maior', () => {
  const now = new Date('2026-10-08T00:00:00'); // 10 dias antes da Unicamp (18/10/2026) — reta final
  const goals = goalsWith([{ board: 'UNICAMP', weight: 1, phaseFocus: 'ambas' }]);
  const topics = [topic({ id: 'revisar_1', name: 'Revisar 1' }), topic({ id: 'novo_1', name: 'Novo 1' })];
  const masteryData = [
    // reviewNecessity>70 => type 'review', 15min
    mastery({ topicId: 'revisar_1', level: 80, uncertainty: 0.9, lastReviewed: new Date(now.getTime() - 20 * 86400000).toISOString() }),
    // level<40 => type 'theory', 45min — score bruto maior (learningNeeded alto), mas não deve caber
    mastery({ topicId: 'novo_1', level: 10, uncertainty: 0.3 }),
  ];
  // 50min disponíveis: reviewRatio 0.85 => orçamento de revisão 43min (cabe o
  // item de 15min), orçamento de conteúdo só 7min (não cabe o item de
  // 45min) — e nem sobra espaço geral pro conteúdo entrar por vazamento
  // (15 + 45 = 60 > 50).
  const plan = EfficiencyEngine.generateDailyPlan(masteryData, topics, profile(), 50, goals, now);
  assert.equal(plan.length, 1);
  assert.equal(plan[0].topicId, 'revisar_1');
  assert.ok(plan[0].reasons.includes('fase_revisao_intensificada'));
});

test('generateDailyPlan em consolidação (sem prova próxima) não marca fase_revisao_intensificada', () => {
  const now = new Date('2026-07-01T00:00:00'); // mais de 60 dias antes da Unicamp (18/10)
  const goals = goalsWith([{ board: 'UNICAMP', weight: 1, phaseFocus: 'ambas' }]);
  const topics = [topic({ id: 'revisar_1', name: 'Revisar 1' })];
  const masteryData = [
    mastery({ topicId: 'revisar_1', level: 80, uncertainty: 0.9, lastReviewed: new Date(now.getTime() - 20 * 86400000).toISOString() }),
  ];
  const plan = EfficiencyEngine.generateDailyPlan(masteryData, topics, profile(), 120, goals, now);
  assert.ok(!plan.some((a) => a.reasons.includes('fase_revisao_intensificada')));
});

test('generateDailyPlan não desperdiça orçamento de um balde quando falta item do outro tipo', () => {
  const now = new Date('2026-10-08T00:00:00'); // reta final, reviewRatio alto
  const goals = goalsWith([{ board: 'UNICAMP', weight: 1, phaseFocus: 'ambas' }]);
  const topics = [topic({ id: 'novo_1', name: 'Novo 1' })];
  // Só existe um item de conteúdo (theory, 45min) e nenhum de revisão — o
  // orçamento de revisão (não usado) deve poder vazar pro de conteúdo.
  const masteryData = [mastery({ topicId: 'novo_1', level: 10, uncertainty: 0.3 })];
  const plan = EfficiencyEngine.generateDailyPlan(masteryData, topics, profile(), 60, goals, now);
  assert.equal(plan.length, 1);
  assert.ok(plan[0].reasons.includes('tempo_disponivel'));
});
