// Correção guiada de discursiva: a estudante confere a própria resposta
// critério por critério (a lista de famerpExpectedChecks), marca se cada um
// está completo, parcial ou faltou, e diz onde errou. Módulo puro, para rodar
// em node:test.
//
// Por que assim: a autoavaliação antiga era um botão fraco/mediano/forte,
// decidido no olho. Isso não diz o que corrigir. Marcar critério por critério
// separa "não sabia o conceito" de "sabia e não escreveu o termo" ou "errou a
// unidade", e é essa separação que vira treino e entra no Caderno de Erros.

import type { DiscursiveAttempt, ErrorLog } from '../types';

export type CheckVerdict = 'completo' | 'parcial' | 'faltou';

/** Onde o ponto foi perdido. Os valores são tipos do Caderno de Erros. */
export type MissWhere = Extract<ErrorLog['type'],
  'conceptual' | 'concept_confusion' | 'interpretation' | 'calculation' | 'insufficient_justification' | 'time'>;

export const MISS_LABELS: Record<MissWhere, { label: string; hint: string }> = {
  conceptual: { label: 'Conceito errado', hint: 'Não sabia o conteúdo, ou o raciocínio partiu de uma ideia falsa.' },
  concept_confusion: { label: 'Termo impreciso', hint: 'Sabia a ideia, mas usou o nome errado ou genérico ("célula do sangue" em vez de "hemácia").' },
  interpretation: { label: 'Leitura do enunciado', hint: 'Respondeu outra pergunta, pulou uma parte do item ou leu mal o gráfico.' },
  calculation: { label: 'Conta ou unidade', hint: 'Montou certo e errou a conta, a conversão ou a unidade final.' },
  insufficient_justification: { label: 'Faltou justificar', hint: 'Deu a resposta sem o "por quê" que o item pedia.' },
  time: { label: 'Em branco ou sem tempo', hint: 'Não chegou a responder.' },
};

export const VERDICT_VALUE: Record<CheckVerdict, number> = { completo: 1, parcial: 0.5, faltou: 0 };

export interface CheckGrade { text: string; verdict: CheckVerdict; where?: MissWhere }
export interface ItemGrade { letter: string; checks: CheckGrade[] }
export interface DiscursiveGrading { items: ItemGrade[]; score: number }

/**
 * Nota estimada de 0 a 4. Cada item pesa igual, e dentro dele cada critério
 * pesa igual. O edital da Famerp diz que a questão vale de 0 a 4, mas não
 * publica a divisão interna: é estimativa, arredondada a meio ponto para não
 * fingir uma precisão que a banca não deu.
 */
export function estimateScore(items: ItemGrade[]): number {
  const graded = items.filter((item) => item.checks.length > 0);
  if (graded.length === 0) return 0;
  const mean = graded.reduce((sum, item) => sum + item.checks.reduce((s, c) => s + VERDICT_VALUE[c.verdict], 0) / item.checks.length, 0) / graded.length;
  return Math.round(mean * 4 * 2) / 2;
}

/** Leva a nota à escala da autoavaliação que o domínio já entende. */
export function ratingFromScore(score: number): DiscursiveAttempt['selfRating'] {
  return score >= 3.5 ? 'forte' : score >= 2 ? 'mediano' : 'fraco';
}

/** Completa a correção só quando todo critério tem veredito e todo erro tem onde. */
export function gradingProblems(items: ItemGrade[]): string[] {
  const problems: string[] = [];
  for (const item of items) for (const check of item.checks) {
    if (check.verdict !== 'completo' && !check.where) problems.push(`Item ${item.letter}: diga onde perdeu o ponto em "${check.text}"`);
  }
  return problems;
}

/** Um registro no Caderno por critério que não saiu completo. */
export function errorLogsFromGrading(grading: DiscursiveGrading, question: { id: string; topicId: string; board: string; year: number; topic: string }, date: string, makeId: () => string): ErrorLog[] {
  const logs: ErrorLog[] = [];
  for (const item of grading.items) for (const check of item.checks) {
    if (check.verdict === 'completo' || !check.where) continue;
    logs.push({
      id: makeId(), topicId: question.topicId, questionId: question.id, date, type: check.where,
      // 'media', não 'confirmado': é o diagnóstico dela contra a lista, sem
      // uma explicação validada (regra do Caderno de Erros).
      confidence: 'media',
      breakPoint: check.text,
      notes: `${question.board} ${question.year}, ${question.topic}, item ${item.letter}: critério ${check.verdict === 'parcial' ? 'parcial' : 'em falta'}, "${check.text}". Onde: ${MISS_LABELS[check.where].label.toLowerCase()}.`,
    });
  }
  return logs;
}

/** Onde ela mais perde ponto, somando as correções guiadas já salvas. */
export function missSummary(attempts: Pick<DiscursiveAttempt, 'grading'>[]): { where: MissWhere; count: number }[] {
  const counts = new Map<MissWhere, number>();
  for (const attempt of attempts) for (const item of attempt.grading?.items ?? []) for (const check of item.checks) {
    if (check.verdict !== 'completo' && check.where) counts.set(check.where, (counts.get(check.where) ?? 0) + 1);
  }
  return [...counts.entries()].map(([where, count]) => ({ where, count })).sort((a, b) => b.count - a.count);
}
