import assert from 'node:assert/strict';
import test from 'node:test';
import { flashcardExamBoards, matchesFlashcardBoards } from './flashcardExamFilters';
import type { Flashcard } from '../types';

test('reconhece etiquetas de banca, modelos e COMVEST sem inventar instituição VUNESP', () => {
  assert.deepEqual(flashcardExamBoards({ tags: ['fuvest', '09_fuvest_1a_fase_assunto_disfarcado', '10_enem_contexto_e_habilidade', 'comvest', '13_vunesp_2a_fase_d_c_e_a'] }), ['FUVEST', 'ENEM', 'UNICAMP', 'VUNESP']);
  assert.deepEqual(flashcardExamBoards({ tags: ['vestibular', 'colecao_geral'] }), []);
  assert.equal(matchesFlashcardBoards({ tags: ['vunesp'] } as Flashcard, ['FAMERP', 'UNESP']), false);
  assert.equal(matchesFlashcardBoards({ tags: ['enem', 'fuvest'] } as Flashcard, ['FUVEST', 'UNICAMP']), true);
  assert.equal(matchesFlashcardBoards({ tags: [] } as unknown as Flashcard, []), true);
});
