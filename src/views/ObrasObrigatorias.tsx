import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, CloudOff, Loader2 } from 'lucide-react';
import { WorkFlashcard } from '../types';
import { loadObraFlashcards } from '../lib/flashcardContent';
import { useFlashcardReviews } from '../hooks/useFlashcardReviews';
import { isDue } from '../lib/flashcardScheduler';
import FlashcardSession, { SessionCard } from '../components/FlashcardSession';

function toSessionCard(card: WorkFlashcard): SessionCard {
  return { id: card.id, front: card.front, back: card.back };
}

export default function ObrasObrigatorias() {
  const { reviews, recordReview, isPersisted, syncError } = useFlashcardReviews();
  const [allCards, setAllCards] = useState<WorkFlashcard[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [work, setWork] = useState<string | null>(null);

  useEffect(() => {
    loadObraFlashcards()
      .then(setAllCards)
      .catch((error) => {
        console.error('Failed to load obra flashcards:', error);
        setLoadError('Não foi possível carregar os flashcards de obras obrigatórias.');
      })
      .finally(() => setLoading(false));
  }, []);

  const worksWithCounts = useMemo(() => {
    if (!allCards) return [];
    const counts = new Map<string, number>();
    for (const c of allCards) counts.set(c.work, (counts.get(c.work) ?? 0) + 1);
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [allCards]);

  const dueCards = useMemo(() => {
    if (!allCards || !work) return [];
    return allCards.filter((c) => c.work === work && isDue(reviews[c.id]));
  }, [allCards, work, reviews]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center">
          <BookOpen className="w-7 h-7 mr-3 text-indigo-500" />
          Obras Obrigatórias
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Flashcards por obra literária — separado do restante das matérias, do jeito que você pediu.
        </p>
        {!isPersisted && (
          <p className="flex items-center text-xs text-zinc-400 mt-2">
            <CloudOff className="w-3.5 h-3.5 mr-1.5" />
            Modo demonstração — conecte sua conta Google em "Conexões Google" para salvar seu progresso de verdade.
          </p>
        )}
        {syncError && <p className="text-xs text-rose-500 mt-2">{syncError}</p>}
      </header>

      {loading && (
        <div className="flex items-center justify-center py-16 text-zinc-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Carregando obras...
        </div>
      )}

      {loadError && (
        <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 rounded-xl p-4 text-sm">
          {loadError}
        </div>
      )}

      {!loading && !work && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {worksWithCounts.map(([name, count]) => (
            <button
              key={name}
              onClick={() => setWork(name)}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-left shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="font-semibold">{name}</p>
              <p className="text-sm text-zinc-500 mt-1">{count} cartões</p>
            </button>
          ))}
        </div>
      )}

      {!loading && work && (
        <FlashcardSession
          title={work}
          cards={dueCards.map(toSessionCard)}
          onRate={recordReview}
          onExit={() => setWork(null)}
        />
      )}
    </div>
  );
}
