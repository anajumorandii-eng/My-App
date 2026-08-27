import { Flashcard, WorkFlashcard } from '../types';

// Conteúdo estático (mesmo pra toda estudante, não muda por usuária) —
// ~17 mil cartões inteiros no bundle JS estourariam o tamanho do app à toa;
// em vez disso cada matéria é seu próprio arquivo, buscado só quando a
// aluna escolhe estudar aquela matéria.
function slugify(subject: string): string {
  return subject
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Keeps malformed source records out of the study flow. A card without a
 * prompt or answer cannot be studied and otherwise renders as a blank side.
 */
export function sanitizeFlashcards(cards: Flashcard[]): Flashcard[] {
  return cards.filter((card) => card.front.trim().length > 0 && card.back.trim().length > 0);
}

export async function loadFlashcardsForSubject(subject: string): Promise<Flashcard[]> {
  const res = await fetch(`/flashcards/${slugify(subject)}.json`);
  if (!res.ok) throw new Error(`Não foi possível carregar os flashcards de ${subject}.`);
  const cards = await res.json() as Flashcard[];
  return sanitizeFlashcards(cards);
}

export async function loadObraFlashcards(): Promise<WorkFlashcard[]> {
  const res = await fetch('/flashcards/obras.json');
  if (!res.ok) throw new Error('Não foi possível carregar os flashcards de obras obrigatórias.');
  return res.json();
}
