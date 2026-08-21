import { TopicMastery, Topic, UserProfile, StudyAction, StudentGoals, RecommendationReason } from '../types';
import { daysUntil, examsForBoard } from '../data/examCalendar';
import { topicIncidenceWeight } from './topicIncidence';
import { currentStudyPhase } from './studyPhase';
import { urgencyOf } from './reviewUrgency';
import { interleaveBySubject } from './interleaving';

// Dentro dos últimos 90 dias antes de uma prova, o plano é puxado para cima
// em duas camadas: um boost de urgência geral (essa prova está chegando)
// somado a um boost por tópico, proporcional a quanto aquele tema realmente
// cai naquela banca (dado real de examPriorities.ts via topicIncidence.ts).
// Os dois boosts são calculados por banca ATIVA e ponderados pelo peso que a
// estudante deu a cada uma (StudentGoals.boardWeights) — assim uma banca de
// peso baixo com prova perto não sequestra o plano de uma banca prioritária
// que ainda está longe; o maior sinal entre as bancas ativas é quem manda,
// não a soma de todas.
const DEADLINE_WINDOW_DAYS = 90;
const BASE_DEADLINE_BOOST = 0.3;
const INCIDENCE_BOOST_SCALE = 0.5;

// Acima desses limiares o fator já é considerado relevante o bastante pra
// aparecer em "Por que isso?" — abaixo disso ele existe matematicamente mas
// não é um motivo que valha mostrar pra estudante.
const PROXIMITY_REASON_THRESHOLD = 0.15;
const INCIDENCE_REASON_THRESHOLD = 0.12;
const LEARNING_NEEDED_REASON_THRESHOLD = 50;
const REVIEW_URGENCY_REASON_THRESHOLD = 70;
const ERROR_RECURRING_REASON_THRESHOLD = 3;
const PREREQUISITE_BLOCKED_LEVEL = 50;

export interface BoardSignal {
  board: string; // nome canônico da banca, como está em examCalendar.ts
  weight: number; // peso que a estudante deu a essa banca
  progress: number; // 0 (longe) a 1 (véspera) da prova mais próxima dessa banca
}

// `now` é injetável para deixar o boost de proximidade testável de forma
// determinística, sem depender da data real do relógio em relação às datas
// fixas de 2026 em examCalendar.ts.
export function computeBoardSignals(goals: StudentGoals, now: Date = new Date()): BoardSignal[] {
  const signals: BoardSignal[] = [];
  for (const boardWeight of goals.boardWeights) {
    if (boardWeight.weight <= 0) continue;
    const exams = examsForBoard(boardWeight.board, boardWeight.phaseFocus, now);
    if (exams.length === 0) continue;
    const remaining = daysUntil(exams[0].date, now);
    if (remaining < 0 || remaining > DEADLINE_WINDOW_DAYS) continue;
    const progress = (DEADLINE_WINDOW_DAYS - remaining) / DEADLINE_WINDOW_DAYS;
    signals.push({ board: exams[0].board, weight: boardWeight.weight, progress });
  }
  return signals;
}

export interface ExamFocus {
  multiplier: number;
  hasProximityReason: boolean;
  hasIncidenceReason: boolean;
}

export function examFocusFor(topic: Topic, signals: BoardSignal[]): ExamFocus {
  if (signals.length === 0) return { multiplier: 1, hasProximityReason: false, hasIncidenceReason: false };

  let urgencyTerm = 0;
  let incidenceTerm = 0;
  let hasProximityReason = false;
  let hasIncidenceReason = false;

  for (const signal of signals) {
    const proximityContribution = signal.progress * signal.weight;
    urgencyTerm = Math.max(urgencyTerm, proximityContribution);
    if (proximityContribution > PROXIMITY_REASON_THRESHOLD) hasProximityReason = true;

    const incidence = Math.min(topicIncidenceWeight(topic, signal.board), 1);
    const incidenceContribution = proximityContribution * incidence;
    incidenceTerm = Math.max(incidenceTerm, incidenceContribution);
    if (incidenceContribution > INCIDENCE_REASON_THRESHOLD) hasIncidenceReason = true;
  }

  const multiplier = 1 + (urgencyTerm * BASE_DEADLINE_BOOST) + (incidenceTerm * INCIDENCE_BOOST_SCALE);
  return { multiplier, hasProximityReason, hasIncidenceReason };
}

export class EfficiencyEngine {
  /**
   * Deterministic ranking of study topics based on multiple weighted criteria.
   * Returns a prioritized list of actions to take.
   */
  public static generateDailyPlan(
    masteryData: TopicMastery[],
    topics: Topic[],
    profile: UserProfile,
    availableMinutesToday: number,
    goals: StudentGoals,
    now: Date = new Date()
  ): StudyAction[] {

    const actions: StudyAction[] = [];
    const boardSignals = computeBoardSignals(goals, now);
    const masteryByTopicId = new Map(masteryData.map((m) => [m.topicId, m]));

    masteryData.forEach(mastery => {
      const topic = topics.find(t => t.id === mastery.topicId);
      if (!topic) return;

      // 1. Learning Needed (Inverse to mastery level)
      const learningNeeded = 100 - mastery.level;

      // 2. Review Necessity — mesmo sinal de urgência baseado em repetição
      // espaçada usado em Revisões Adaptativas (reviewUrgency.ts), pra que as
      // duas telas concordem sobre o que está "vencido" pra revisão.
      const reviewNecessity = urgencyOf(mastery, now);

      // 3. Error Signal Urgency
      const errorSignal = mastery.errorSignals * 20; // 5 errors = 100 max signal

      // 4. Energy Adjustment
      let energyMultiplier = 1;
      if (profile.currentEnergyLevel === 'low') {
        // High error signal/low mastery gets penalized if low energy, better to do easier reviews
        if (learningNeeded > 80) energyMultiplier = 0.5;
      } else if (profile.currentEnergyLevel === 'high') {
        if (learningNeeded > 80) energyMultiplier = 1.5;
      }

      const examFocus = examFocusFor(topic, boardSignals);

      // Base Score Calculation
      const rawScore = (
        (learningNeeded * 0.4) +
        (reviewNecessity * 0.3) +
        (errorSignal * 0.3)
      ) * energyMultiplier * examFocus.multiplier;

      // Determine action type based on mastery state
      let type: StudyAction['type'] = 'practice';
      let estimatedMinutes = 30;

      if (mastery.level < 40) {
        type = 'theory';
        estimatedMinutes = 45;
      } else if (mastery.errorSignals > 3) {
        type = 'error_analysis';
        estimatedMinutes = 20;
      } else if (reviewNecessity > 70) {
        type = 'review';
        estimatedMinutes = 15;
      }

      const blockedPrerequisite = topic.prerequisites.some((prereqId) => {
        const prereqMastery = masteryByTopicId.get(prereqId);
        return prereqMastery !== undefined && prereqMastery.level < PREREQUISITE_BLOCKED_LEVEL;
      });

      const reasons: RecommendationReason[] = [];
      if (learningNeeded > LEARNING_NEEDED_REASON_THRESHOLD) reasons.push('dominio_insuficiente');
      if (mastery.errorSignals >= ERROR_RECURRING_REASON_THRESHOLD) reasons.push('erro_recorrente');
      if (reviewNecessity > REVIEW_URGENCY_REASON_THRESHOLD) reasons.push('revisao_urgente');
      if (blockedPrerequisite) reasons.push('prerequisito_bloqueado');
      if (examFocus.hasIncidenceReason) reasons.push('incidencia_banca_prioritaria');
      if (examFocus.hasProximityReason) reasons.push('proximidade_prova');

      actions.push({
        id: `action_${topic.id}_${now.toISOString().slice(0, 10)}`,
        type,
        topicId: topic.id,
        topicName: topic.name,
        subject: topic.subject,
        estimatedMinutes,
        priorityScore: rawScore,
        reasons,
      });
    });

    // Sort by highest priority first
    actions.sort((a, b) => b.priorityScore - a.priorityScore);

    // A fase atual (quão perto está a prova mais próxima entre as bancas
    // ativas) define quanto do tempo disponível deve ir para revisão/erro
    // versus conteúdo novo/prática. Preenchemos os dois "baldes"
    // separadamente, respeitando a ordem de prioridade dentro de cada um, e
    // só depois deixamos o tempo que sobrou de um balde vazar pro outro —
    // assim a reta final realmente empurra mais revisão pro plano de hoje,
    // sem desperdiçar minutos quando não há itens suficientes de um tipo.
    const phase = currentStudyPhase(goals, now);
    const reviewTypes = new Set<StudyAction['type']>(['review', 'error_analysis']);
    const reviewBudget = Math.round(availableMinutesToday * phase.reviewRatio);
    const contentBudget = availableMinutesToday - reviewBudget;

    let reviewTime = 0;
    let contentTime = 0;
    const finalPlan: StudyAction[] = [];
    const deferred: StudyAction[] = [];

    for (const action of actions) {
      const isReview = reviewTypes.has(action.type);
      const bucketTime = isReview ? reviewTime : contentTime;
      const bucketBudget = isReview ? reviewBudget : contentBudget;

      if (bucketTime + action.estimatedMinutes <= bucketBudget) {
        // Só quem entrou no plano de hoje ganha esse motivo — ele é sobre
        // ter cabido no tempo disponível, não sobre prioridade.
        action.reasons.push('tempo_disponivel');
        if (phase.id !== 'consolidacao' && isReview) action.reasons.push('fase_revisao_intensificada');
        finalPlan.push(action);
        if (isReview) reviewTime += action.estimatedMinutes;
        else contentTime += action.estimatedMinutes;
      } else {
        deferred.push(action);
      }
    }

    // Segunda passada: aproveita o tempo que sobrou de um balde no outro,
    // pra não desperdiçar minutos disponíveis quando faltam itens de um tipo.
    let totalTime = reviewTime + contentTime;
    for (const action of deferred) {
      if (totalTime + action.estimatedMinutes <= availableMinutesToday) {
        action.reasons.push('tempo_disponivel');
        finalPlan.push(action);
        totalTime += action.estimatedMinutes;
      }
    }

    finalPlan.sort((a, b) => b.priorityScore - a.priorityScore);
    // Prática intercalada: evita enfileirar vários itens seguidos da mesma
    // matéria só porque ela dominou o ranking de prioridade (ver
    // interleaving.ts) — melhora a discriminação entre conceitos/estratégias
    // na hora de aplicar o que foi estudado.
    return interleaveBySubject(finalPlan);
  }
}
