import type { Question } from '../types';

/** COMVEST is Unicamp; VUNESP alone does not identify UNESP or FAMERP. */
export function canonicalExamBoard(board: string): string {
  const normalized = board.trim().toUpperCase();
  return normalized === 'COMVEST' ? 'UNICAMP' : normalized;
}

export function matchesExamFilters(question: Question, board: string, year: string): boolean {
  return Boolean((board === 'all' || (question.examSource && canonicalExamBoard(question.examSource.board) === board)) &&
    (year === 'all' || (year === 'unknown' ? Boolean(question.examSource && !question.examSource.year) :
      question.examSource?.year === Number(year))));
}
