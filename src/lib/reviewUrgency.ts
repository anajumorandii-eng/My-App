import { TopicMastery } from '../types';
import { daysOverdue } from './spacedRepetition';

// Urgência 0-100 baseada em quanto o tópico está de atrasado (ou perto de
// vencer) em relação à data programada pelo algoritmo de repetição espaçada
// (spacedRepetition.ts) — não mais um crescimento linear sem fim. A forma é
// pensada pra imitar a curva de esquecimento (Ebbinghaus, 1885): urgência
// baixa enquanto ainda falta bastante pro vencimento, subindo conforme a
// data se aproxima e saturando rápido depois que passa, porque é justamente
// aí que a retenção desaba.
const CLAMP_MIN = 0;
const CLAMP_MAX = 100;
const BASE_AT_DUE = 60; // urgência no dia exato do vencimento
const SLOPE_PER_DAY = 6; // quanto a urgência sobe/desce por dia de distância do vencimento
const ERROR_SIGNAL_WEIGHT = 8;
const ERROR_SIGNAL_CAP = 40;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function urgencyOf(mastery: TopicMastery, now: Date = new Date()): number {
  const overdue = daysOverdue(mastery, now);
  const base = clamp(BASE_AT_DUE + overdue * SLOPE_PER_DAY, CLAMP_MIN, CLAMP_MAX);
  // Erros recentes empurram a urgência pra cima independentemente do
  // calendário — um tópico que ela está errando muito não deveria esperar a
  // data agendada pra ser revisado.
  const errorBoost = Math.min(mastery.errorSignals * ERROR_SIGNAL_WEIGHT, ERROR_SIGNAL_CAP);
  return Math.min(CLAMP_MAX, base + errorBoost);
}

export function pendingReviewCount(masteryState: TopicMastery[], now: Date = new Date()): number {
  return masteryState.filter((mastery) => urgencyOf(mastery, now) > 50).length;
}
