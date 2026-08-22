import React, { useMemo, useState } from 'react';
import { Layers, CloudOff, Loader2 } from 'lucide-react';
import { Flashcard } from '../types';
import { loadFlashcardsForSubject } from '../lib/flashcardContent';
import { useFlashcardReviews } from '../hooks/useFlashcardReviews';
import { isDue } from '../lib/flashcardScheduler';
import FlashcardSession, { SessionCard } from '../components/FlashcardSession';

// Contagens conhecidas de antemão (conteúdo estático) — evita ter que
// buscar todo mundo só pra montar a grade de matérias.
const SUBJECTS: { name: string; count: number; colorClasses: string }[] = [
  { name: 'Biologia', count: 2403, colorClasses: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' },
  { name: 'Física', count: 2562, colorClasses: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300' },
  { name: 'Geografia', count: 1497, colorClasses: 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300' },
  { name: 'História', count: 1839, colorClasses: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300' },
  { name: 'Inglês', count: 298, colorClasses: 'bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300' },
  { name: 'Português', count: 3281, colorClasses: 'bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300' },
  { name: 'Matemática', count: 2479, colorClasses: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300' },
  { name: 'Química', count: 1538, colorClasses: 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300' },
  { name: 'Filosofia', count: 413, colorClasses: 'bg-stone-50 dark:bg-stone-900/20 text-stone-700 dark:text-stone-300' },
  { name: 'Sociologia', count: 315, colorClasses: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' },
];

function toSessionCard(card: Flashcard): SessionCard {
  return { id: card.id, front: card.front, back: card.back, label: card.chapter };
}

export default function Flashcards() {
  const { reviews, recordReview, isPersisted, syncError } = useFlashcardReviews();
  const [subject, setSubject] = useState<string | null>(null);
  const [cards, setCards] = useState<Flashcard[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const dueCards = useMemo(() => {
    if (!cards) return [];
    return cards.filter((c) => isDue(reviews[c.id]));
  }, [cards, reviews]);

  const openSubject = async (name: string) => {
    setSubject(name);
    setLoading(true);
    setLoadError(null);
    try {
      const data = await loadFlashcardsForSubject(name);
      setCards(data);
    } catch (error) {
      console.error('Failed to load flashcards:', error);
      setLoadError('Não foi possível carregar os flashcards dessa matéria.');
    } finally {
      setLoading(false);
    }
  };

  const backToPicker = () => {
    setSubject(null);
    setCards(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center">
          <Layers className="w-7 h-7 mr-3 text-indigo-500" />
          Flashcards
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Repetição espaçada por cartão — cada um tem sua própria data de revisão, que se ajusta pela sua resposta.
        </p>
        {!isPersisted && (
          <p className="flex items-center text-xs text-zinc-400 mt-2">
            <CloudOff className="w-3.5 h-3.5 mr-1.5" />
            Modo demonstração — conecte sua conta Google em "Conexões Google" para salvar seu progresso de verdade.
          </p>
        )}
        {syncError && <p className="text-xs text-rose-500 mt-2">{syncError}</p>}
      </header>

      {!subject && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {SUBJECTS.map(({ name, count, colorClasses }) => (
            <button
              key={name}
              onClick={() => openSubject(name)}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-left shadow-sm hover:shadow-md transition-shadow"
            >
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${colorClasses}`}>{name}</span>
              <p className="text-sm text-zinc-500 mt-2">{count.toLocaleString('pt-BR')} cartões</p>
            </button>
          ))}
        </div>
      )}

      {subject && loading && (
        <div className="flex items-center justify-center py-16 text-zinc-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Carregando flashcards de {subject}...
        </div>
      )}

      {subject && loadError && (
        <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 rounded-xl p-4 text-sm">
          {loadError}
        </div>
      )}

      {subject && cards && !loading && (
        <FlashcardSession
          title={subject}
          cards={dueCards.map(toSessionCard)}
          onRate={recordReview}
          onExit={backToPicker}
        />
      )}
    </div>
  );
}
