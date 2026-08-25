import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeFlashcards } from './flashcardContent';

test('removes flashcards without a visible front or answer', () => {
  const cards = sanitizeFlashcards([
    { id: 'valid', front: '<b>Pergunta</b>', back: '<b>Resposta</b>' },
    { id: 'empty-front', front: '   ', back: 'Resposta' },
    { id: 'empty-back', front: 'Pergunta', back: '' },
    { id: 'both-empty', front: '', back: '' },
  ] as never);

  assert.deepEqual(cards.map((card) => card.id), ['valid']);
});
