import type { Flashcard } from '../types';
import { canonicalExamBoard } from './questionExamFilters';

const BOARDS = new Set(['ENEM', 'FUVEST', 'UNICAMP', 'UNESP', 'FAMERP', 'UNIFESP', 'VUNESP']);
const MODELS: Record<string, string> = {
  '09_fuvest_1a_fase_assunto_disfarcado': 'FUVEST',
  '10_enem_contexto_e_habilidade': 'ENEM',
  '11_fuvest_2a_fase_resposta_pontuavel': 'FUVEST',
  '12_unicamp_2a_fase_c_f_c_r': 'UNICAMP',
  '13_vunesp_2a_fase_d_c_e_a': 'VUNESP',
};

/** Bancas declaradas nas etiquetas: VUNESP sozinha não identifica uma instituição. */
export function flashcardExamBoards(card: Pick<Flashcard, 'tags'>): string[] {
  return [...new Set(card.tags.flatMap(tag => {
    const board = MODELS[tag.toLowerCase()] ?? canonicalExamBoard(tag);
    return BOARDS.has(board) ? [board] : [];
  }))];
}

export function matchesFlashcardBoards(card: Flashcard, boards: string[]): boolean {
  return boards.length === 0 || flashcardExamBoards(card).some(board => boards.includes(board));
}
