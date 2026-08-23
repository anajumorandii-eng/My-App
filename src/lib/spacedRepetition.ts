import { StudyVerification, TopicMastery } from '../types';

// Algoritmo de repetição espaçada no estilo SM-2 (Wozniak, 1990 — a base do
// SuperMemo e, mais tarde, do Anki), fundamentado na curva de esquecimento
// de Ebbinghaus (1885): a retenção cai rápido depois de um certo intervalo
// sem revisão, e cada revisão bem-sucedida "achata" essa curva, permitindo
// esperar mais até a próxima. Cada tópico carrega seu próprio fator de
// facilidade (easeFactor) e intervalo (intervalDays), em vez de um cronograma
// fixo igual pra todo mundo.
const DEFAULT_EASE_FACTOR = 2.5;
const MIN_EASE_FACTOR = 1.3;
const FIRST_INTERVAL_DAYS = 1;
const SECOND_INTERVAL_DAYS = 6;

// Nota de qualidade da lembrança, 0-5, como no SM-2 original: abaixo de 3
// conta como "esqueceu" (reseta o intervalo); 3 ou mais conta como acerto,
// com o intervalo crescendo mais quanto maior a nota.
export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5;

const FORGOT_THRESHOLD = 3;

export function easeFactorOf(mastery: TopicMastery): number {
  return mastery.easeFactor ?? DEFAULT_EASE_FACTOR;
}

export function intervalDaysOf(mastery: TopicMastery): number {
  return mastery.intervalDays ?? FIRST_INTERVAL_DAYS;
}

export function reviewCountOf(mastery: TopicMastery): number {
  return mastery.reviewCount ?? 0;
}

/** Data programada da próxima revisão: última revisão + intervalo atual. */
export function nextReviewDate(mastery: TopicMastery): Date {
  const last = new Date(mastery.lastReviewed);
  return new Date(last.getTime() + intervalDaysOf(mastery) * 86400000);
}

/** Dias de atraso em relação à data programada — negativo quando ainda não venceu. */
export function daysOverdue(mastery: TopicMastery, now: Date = new Date()): number {
  return (now.getTime() - nextReviewDate(mastery).getTime()) / 86400000;
}

// Autoavaliação de lembrança no mesmo padrão de 3 pontos já usado em
// DiscursiveAttempt.selfRating ('fraco'/'mediano'/'forte') — mapeada pra
// nota 0-5 do SM-2.
export function qualityFromSelfRating(rating: 'fraco' | 'mediano' | 'forte'): ReviewQuality {
  if (rating === 'fraco') return 2;
  if (rating === 'mediano') return 3;
  return 5;
}

/**
 * Self-rating schedules the next review, but it is weaker evidence than an
 * objectively scored answer. A positive mastery change is capped at two
 * points per discursive attempt.
 */
export function applyDiscursiveSelfRatingOutcome(
  mastery: TopicMastery,
  rating: 'fraco' | 'mediano' | 'forte',
  now: Date = new Date()
): ReviewOutcomePatch {
  const outcome = applyReviewOutcome(mastery, qualityFromSelfRating(rating), now);
  return {
    ...outcome,
    level: outcome.level > mastery.level
      ? Math.min(100, mastery.level + Math.min(2, outcome.level - mastery.level))
      : outcome.level,
  };
}

// Resultado objetivo de responder uma questão (certo/errado) também vira
// nota de qualidade — toda tentativa de recuperação ativa (retrieval
// practice) deve alimentar o mesmo cronograma de repetição espaçada,
// não só o botão explícito de "revisado".
export function qualityFromAnswerCorrectness(correct: boolean): ReviewQuality {
  return correct ? 4 : 1;
}

export function qualityFromStudyVerification(result: StudyVerification): ReviewQuality {
  if (result === 'nao_consegui') return 2;
  if (result === 'com_ajuda') return 3;
  return 4;
}

export interface ReviewOutcomePatch {
  level: number;
  uncertainty: number;
  errorSignals: number;
  lastReviewed: string;
  easeFactor: number;
  intervalDays: number;
  reviewCount: number;
}

export interface Schedule {
  easeFactor: number;
  intervalDays: number;
  reviewCount: number;
}

/**
 * Núcleo do SM-2, isolado de TopicMastery pra poder ser reaproveitado por
 * qualquer coisa com repetição espaçada própria (tópicos, flashcards, etc.)
 * sem precisar forjar um objeto TopicMastery só pra extrair o agendamento.
 */
export function computeSchedule(prevEase: number, prevInterval: number, prevCount: number, quality: ReviewQuality): Schedule {
  const rawNextEase = prevEase + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  const easeFactor = Math.round(Math.max(MIN_EASE_FACTOR, rawNextEase) * 100) / 100;

  let intervalDays: number;
  let reviewCount: number;
  if (quality < FORGOT_THRESHOLD) {
    intervalDays = FIRST_INTERVAL_DAYS;
    reviewCount = 0;
  } else {
    reviewCount = prevCount + 1;
    if (reviewCount === 1) intervalDays = FIRST_INTERVAL_DAYS;
    else if (reviewCount === 2) intervalDays = SECOND_INTERVAL_DAYS;
    else intervalDays = Math.round(prevInterval * easeFactor);
  }

  return { easeFactor, intervalDays, reviewCount };
}

/**
 * Aplica o resultado de uma revisão/tentativa ao estado de repetição
 * espaçada de um tópico, seguindo a regra clássica do SM-2: uma nota abaixo
 * de 3 ("esqueceu") reseta o intervalo pra 1 dia e zera a sequência de
 * acertos; uma nota 3+ avança a sequência (1 dia -> 6 dias -> intervalo
 * anterior × fator de facilidade), e o fator de facilidade sobe ou desce
 * conforme a nota, ficando nunca abaixo de MIN_EASE_FACTOR.
 */
export function applyReviewOutcome(mastery: TopicMastery, quality: ReviewQuality, now: Date = new Date()): ReviewOutcomePatch {
  const { easeFactor, intervalDays, reviewCount } = computeSchedule(
    easeFactorOf(mastery),
    intervalDaysOf(mastery),
    reviewCountOf(mastery),
    quality
  );

  // Incerteza (já usada em outras partes do app) reflete diretamente a nota
  // da última revisão: 0 pra nota máxima, subindo conforme a lembrança foi
  // mais fraca.
  const uncertainty = Math.max(0.05, Math.min(1, (5 - quality) / 5));

  const levelDelta = quality >= 4 ? 5 : quality === 3 ? 1 : -4;
  const level = Math.min(100, Math.max(0, mastery.level + levelDelta));
  const errorSignals = quality < FORGOT_THRESHOLD ? mastery.errorSignals + 1 : Math.max(0, mastery.errorSignals - 1);

  return {
    level,
    uncertainty,
    errorSignals,
    lastReviewed: now.toISOString(),
    easeFactor,
    intervalDays,
    reviewCount,
  };
}
