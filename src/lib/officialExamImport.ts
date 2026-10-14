import type { Question } from '../types';

const board = (q: Question) => q.examSource?.board.toUpperCase().replace('COMVEST', 'UNICAMP');

/** Existing ids carry student progress. A conflicting edition must be reviewed, never overwritten. */
export function appendReviewedQuestions(bank: Question[], additions: Question[]): Question[] {
  const byId = new Map(bank.map(q => [q.id, q]));
  if (byId.size !== bank.length) throw new Error('Banco existente contém ids duplicados.');
  const fresh: Question[] = [];
  for (const question of additions) {
    const existing = byId.get(question.id);
    if (existing) {
      if (JSON.stringify(existing) !== JSON.stringify(question)) throw new Error(`Conflito com registro existente: ${question.id}.`);
      continue;
    }
    const conflict = [...bank, ...fresh].find(q => board(q) === board(question) &&
      q.examSource?.year === question.examSource?.year &&
      q.examSource?.questionNumber === question.examSource?.questionNumber &&
      q.examSource?.phase === question.examSource?.phase);
    if (conflict) throw new Error(`Possível questão duplicada: ${conflict.id}. Confira a versão antes de importar.`);
    byId.set(question.id, question);
    fresh.push(question);
  }
  return [...bank, ...fresh];
}
