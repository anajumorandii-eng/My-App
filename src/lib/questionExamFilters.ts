import type { Question } from '../types';

/** COMVEST is Unicamp; VUNESP alone does not identify UNESP or FAMERP. */
export function canonicalExamBoard(board: string): string {
  const normalized = board.trim().toUpperCase();
  return normalized === 'COMVEST' ? 'UNICAMP' : normalized;
}

// Questão autoral no estilo de uma banca entra no filtro dessa banca, mas só
// sem ano: ela não foi aplicada em edição nenhuma. Antes, o filtro exigia
// examSource, e as autorais estilo FUVEST sumiam ao escolher a FUVEST.
export function matchesExamFilters(question: Question, board: string, year: string): boolean {
  const banca = question.examSource ? question.examSource.board : question.styleOf;
  return Boolean((board === 'all' || (banca && canonicalExamBoard(banca) === board)) &&
    (year === 'all' || (year === 'unknown' ? Boolean(question.examSource && !question.examSource.year) :
      question.examSource?.year === Number(year))));
}
