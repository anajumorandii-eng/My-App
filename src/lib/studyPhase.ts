import { StudentGoals } from '../types';
import { daysUntil, examsForBoard } from '../data/examCalendar';

// Divide o tempo até a prova em três fases, cada uma com uma fração-alvo do
// tempo disponível dedicada a revisão (o resto vai pra conteúdo novo/prática).
// Os limiares (60 e 30 dias — ajustados a pedido da Ana Júlia, que prefere
// começar a rampa de revisão mais cedo, com margem de segurança maior) fazem
// a "revisão ativa" começar bem antes de outubro, dando tempo real de
// consolidação antes da reta final.
export interface StudyPhase {
  id: 'consolidacao' | 'revisao_ativa' | 'reta_final';
  label: string;
  reviewRatio: number; // 0 a 1 — fração do tempo disponível dedicada a revisão/erro
  description: string;
}

export const CONSOLIDACAO: StudyPhase = {
  id: 'consolidacao',
  label: 'Consolidação de conteúdo',
  reviewRatio: 0.35,
  description: 'Ainda dá tempo — o foco principal é acompanhar o conteúdo novo do cursinho, com revisão espaçada normal.',
};

export const REVISAO_ATIVA: StudyPhase = {
  id: 'revisao_ativa',
  label: 'Revisão ativa',
  reviewRatio: 0.6,
  description: 'A prova está chegando — a revisão passa a ocupar a maior parte do tempo, mas ainda sobra espaço para conteúdo novo.',
};

export const RETA_FINAL: StudyPhase = {
  id: 'reta_final',
  label: 'Reta final',
  reviewRatio: 0.85,
  description: 'Últimos dias antes da prova — quase todo o tempo vai para revisão, simulados e redação.',
};

export const STUDY_PHASES: StudyPhase[] = [CONSOLIDACAO, REVISAO_ATIVA, RETA_FINAL];

const REVISAO_ATIVA_THRESHOLD_DAYS = 60;
const RETA_FINAL_THRESHOLD_DAYS = 30;

export function phaseForDaysRemaining(days: number): StudyPhase {
  if (days <= RETA_FINAL_THRESHOLD_DAYS) return RETA_FINAL;
  if (days <= REVISAO_ATIVA_THRESHOLD_DAYS) return REVISAO_ATIVA;
  return CONSOLIDACAO;
}

// Menor número de dias até a próxima prova entre as bancas ATIVAS (peso > 0)
// — a fase é definida pela prova mais próxima que a estudante realmente
// prioriza, não pela banca de maior peso isoladamente nem por uma média.
// Retorna null se nenhuma banca ativa tem prova futura conhecida.
export function nearestActiveExamDays(goals: StudentGoals, now: Date = new Date()): number | null {
  let min: number | null = null;
  for (const boardWeight of goals.boardWeights) {
    if (boardWeight.weight <= 0) continue;
    const exams = examsForBoard(boardWeight.board, boardWeight.phaseFocus, now);
    if (exams.length === 0) continue;
    const remaining = daysUntil(exams[0].date, now);
    if (remaining < 0) continue;
    if (min === null || remaining < min) min = remaining;
  }
  return min;
}

// Sem nenhuma prova futura conhecida entre as bancas ativas, assume-se a fase
// mais conservadora (consolidação) — não há por que empurrar revisão pesada
// sem uma data real se aproximando.
export function currentStudyPhase(goals: StudentGoals, now: Date = new Date()): StudyPhase {
  const days = nearestActiveExamDays(goals, now);
  if (days === null) return CONSOLIDACAO;
  return phaseForDaysRemaining(days);
}
