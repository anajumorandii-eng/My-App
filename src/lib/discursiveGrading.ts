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

/**
 * Lê a nota que a correção por IA escreve na linha "Nota estimada: …". Saída
 * de modelo é dado suspeito: só aceita "X de 4" com X entre 0 e 4, ou um
 * percentual de 0 a 100, e devolve null em qualquer outra forma, em vez de
 * mostrar um número inventado em destaque.
 */
export function parseAiScore(text: string): string | null {
  const line = text.match(/nota estimada\s*:\s*\**\s*([^\n*]+)/i)?.[1]?.trim();
  if (!line) return null;
  const outOf4 = line.match(/^(\d(?:[.,]5|[.,]0)?)\s*(?:de|\/)\s*4\b/);
  if (outOf4) { const v = Number(outOf4[1].replace(',', '.')); return v >= 0 && v <= 4 ? `${outOf4[1].replace('.', ',')} de 4` : null; }
  const pct = line.match(/^(\d{1,3})\s*%/);
  if (pct) { const v = Number(pct[1]); return v <= 100 ? `${v}%` : null; }
  return null;
}

export type SuggestedVerdicts = Record<string, { verdict: CheckVerdict; where?: MissWhere }>;

/** "a1", "a2", "b1"… na ordem dos itens e dos critérios. */
export function criterionIds(checks: string[][], letters: string[]): string[][] {
  return checks.map((item, i) => item.map((_, j) => `${letters[i] ?? i + 1}${j + 1}`));
}

/**
 * Lê o bloco JSON de marcação que a correção por IA põe no fim. Como os
 * parsers de errorDiagnosis, nunca lança: ignora id desconhecido, veredito
 * fora da lista e "onde" inválido, e devolve só o que pôde validar. O
 * resultado preenche a correção guiada, que a estudante ainda confere.
 */
export function parseCriteriaVerdicts(text: string, validIds: string[]): SuggestedVerdicts {
  const block = text.match(/```(?:json)?\s*([\s\S]*?)```/)?.[1];
  if (!block) return {};
  let data: unknown;
  try { data = JSON.parse(block); } catch { return {}; }
  const list = (data as { criterios?: unknown })?.criterios;
  if (!Array.isArray(list)) return {};
  const ids = new Set(validIds);
  const verdicts = new Set<CheckVerdict>(['completo', 'parcial', 'faltou']);
  const out: SuggestedVerdicts = {};
  for (const raw of list) {
    const entry = raw as { id?: unknown; veredito?: unknown; onde?: unknown };
    if (typeof entry?.id !== 'string' || !ids.has(entry.id)) continue;
    if (typeof entry.veredito !== 'string' || !verdicts.has(entry.veredito as CheckVerdict)) continue;
    const verdict = entry.veredito as CheckVerdict;
    const where = typeof entry.onde === 'string' && entry.onde in MISS_LABELS ? entry.onde as MissWhere : undefined;
    out[entry.id] = verdict !== 'completo' && where ? { verdict, where } : { verdict };
  }
  return out;
}

/** O texto da correção sem o bloco de marcação, que é dado para a tela, não leitura. */
export function stripCriteriaBlock(text: string): string {
  return text.replace(/```(?:json)?[\s\S]*?(```|$)/, '').trimEnd();
}
