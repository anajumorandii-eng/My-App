import React, { useMemo, useState } from 'react';
import { CheckCircle2, Frown, Meh, Smile, RotateCcw, ArrowLeft } from 'lucide-react';
import { ReviewQuality, qualityFromSelfRating } from '../lib/flashcardScheduler';
import { confirmFlashcardRating } from '../lib/flashcardSessionFlow';
import type { FlashcardRatingResult } from '../lib/flashcardSessionFlow';

type SelfRating = 'fraco' | 'mediano' | 'forte';

const RATING_OPTIONS: { value: SelfRating; label: string; icon: typeof Frown; classes: string }[] = [
  { value: 'fraco', label: 'Esqueci', icon: Frown, classes: 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50' },
  { value: 'mediano', label: 'Foi difícil', icon: Meh, classes: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50' },
  { value: 'forte', label: 'Lembrei fácil', icon: Smile, classes: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50' },
];

export interface SessionCard {
  id: string;
  front: string;
  back: string;
  label?: string; // ex.: capítulo ou obra, mostrado como contexto acima da pergunta
}

interface FlashcardSessionProps {
  title: string;
  cards: SessionCard[];
  onRate: (cardId: string, quality: ReviewQuality) => FlashcardRatingResult | Promise<FlashcardRatingResult>;
  onExit: () => void;
}

export default function FlashcardSession({ title, cards, onRate, onExit }: FlashcardSessionProps) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [rating, setRating] = useState(false);
  const [ratingError, setRatingError] = useState<string | null>(null);
  const current = cards[index];

  const progressLabel = useMemo(() => `${Math.min(index + 1, cards.length)} de ${cards.length}`, [index, cards.length]);

  if (!current) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 text-center shadow-sm">
        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
        <h3 className="font-semibold text-lg mb-1">Sessão concluída!</h3>
        <p className="text-sm text-zinc-500 mb-5">Você revisou todos os cartões de {title.toLowerCase()} por agora.</p>
        <button
          onClick={onExit}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
        </button>
      </div>
    );
  }

  const rate = async (selfRating: SelfRating) => {
    if (rating) return;
    setRating(true);
    setRatingError(null);
    const confirmed = await confirmFlashcardRating(() => (
      onRate(current.id, qualityFromSelfRating(selfRating))
    ));
    setRating(false);
    if (!confirmed) {
      setRatingError('Não foi possível salvar esta revisão. Tente novamente.');
      return;
    }
    setRevealed(false);
    setIndex((i) => i + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={onExit} className="flex items-center text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Voltar
        </button>
        <span className="text-xs font-medium text-zinc-500">{progressLabel}</span>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm min-h-[220px] flex flex-col">
        {current.label && (
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-3">{current.label}</span>
        )}
        <div className="flex-1 flex flex-col justify-center">
          <div className="prose prose-zinc dark:prose-invert max-w-none text-base" dangerouslySetInnerHTML={{ __html: current.front }} />
          {revealed && (
            <div className="mt-5 pt-5 border-t border-zinc-100 dark:border-zinc-800">
              <div className="prose prose-zinc dark:prose-invert max-w-none text-base" dangerouslySetInnerHTML={{ __html: current.back }} />
            </div>
          )}
        </div>
      </div>

      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700"
        >
          <RotateCcw className="w-4 h-4 mr-2" /> Mostrar resposta
        </button>
      ) : (
        <div className="space-y-2">
          {ratingError && <p className="text-sm text-rose-600 dark:text-rose-400">{ratingError}</p>}
          <div className="flex gap-2">
            {RATING_OPTIONS.map(({ value, label, icon: Icon, classes }) => (
              <button
                key={value}
                onClick={() => void rate(value)}
                disabled={rating}
                className={`flex-1 flex items-center justify-center px-3 py-3 rounded-xl text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${classes}`}
              >
                <Icon className="w-4 h-4 mr-1.5" />
                {rating ? 'Salvando...' : label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
