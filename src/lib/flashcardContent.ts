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

export async function loadFlashcardsForSubject(subject: string): Promise<Flashcard[]> {
  const res = await fetch(`/flashcards/${slugify(subject)}.json`);
  if (!res.ok) throw new Error(`Não foi possível carregar os flashcards de ${subject}.`);
  return res.json();
}

export async function loadObraFlashcards(): Promise<WorkFlashcard[]> {
  const res = await fetch('/flashcards/obras.json');
  if (!res.ok) throw new Error('Não foi possível carregar os flashcards de obras obrigatórias.');
  return res.json();
}
