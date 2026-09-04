import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, CloudOff, Loader2 } from 'lucide-react';
import { WorkFlashcard } from '../types';
import { loadObraFlashcards } from '../lib/flashcardContent';
import { useFlashcardReviews } from '../hooks/useFlashcardReviews';
import { isDue } from '../lib/flashcardScheduler';
import FlashcardSession, { SessionCard } from '../components/FlashcardSession';
import { createFlashcardReviewAccess } from '../lib/flashcardReviewHydration';
import {
  clearFlashcardSessionSnapshot,
  startFlashcardSessionSnapshot,
} from '../lib/flashcardSessionFlow';
import { Panel } from '../components/ui/Panel';
import { PALETTES } from '../prototypes/NucleoInstrumentalPrototype';
import { SUBJECT_ICONS } from './Dashboard';

function toSessionCard(card: WorkFlashcard): SessionCard {
  return { id: card.id, front: card.front, back: card.back };
}

export default function ObrasObrigatorias() {
  const {
    reviews,
    recordReview,
    hydrationStatus,
    currentOwnerUid,
    isReadyForStudy,
    retryHydration,
    isPersisted,
    syncError,
  } = useFlashcardReviews();
  const [allCards, setAllCards] = useState<WorkFlashcard[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [work, setWork] = useState<string | null>(null);
  const [sessionCards, setSessionCards] = useState<SessionCard[] | null>(null);
  const reviewAccess = createFlashcardReviewAccess(hydrationStatus, isReadyForStudy);

  useEffect(() => {
    setWork(null);
    setSessionCards((snapshot) => clearFlashcardSessionSnapshot(snapshot));
  }, [currentOwnerUid, reviewAccess.canStudy]);

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

  const startWorkSession = (name: string) => {
    if (!reviewAccess.canStudy || !allCards || sessionCards !== null) return;
    const candidates = allCards
      .filter((card) => card.work === name && isDue(reviews[card.id]))
      .map(toSessionCard);
    const snapshot = startFlashcardSessionSnapshot(sessionCards, candidates);
    if (!snapshot) return;
    setWork(name);
    setSessionCards(snapshot);
  };

  const exitWorkSession = () => {
    setWork(null);
    setSessionCards((snapshot) => clearFlashcardSessionSnapshot(snapshot));
  };

  const currentPalette = PALETTES.Literatura;
  const LitIcon = SUBJECT_ICONS['Literatura'] ?? BookOpen;

  return (
    <div
      className="ni-main"
      style={{
        '--primary': currentPalette.primary,
        '--secondary': currentPalette.secondary,
        '--wash': currentPalette.wash,
      } as React.CSSProperties}
    >
      {/* Route Breadcrumb */}
      <div className="ni-route">
        <span>LIBRARY</span>
        <i />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[var(--primary)] text-[var(--wash)]">
            <LitIcon className="w-3 h-3" />
          </span>
          LITERATURA
        </span>
        <i />
        <b>OBRAS OBRIGATÓRIAS</b>
      </div>

      {/* Main Title */}
      <div className="ni-title">
        <div>
          <h1>Todas as obras, um ciclo.</h1>
          <p>Flashcards temáticos por obra literária exigida na FUVEST e UNICAMP — repetição espaçada focada no repertório.</p>
        </div>
        <div className="ni-state">
          <i /> {worksWithCounts.length} obras cadastradas
        </div>
      </div>

      {!isPersisted && (
        <p className="flex items-start text-xs text-[var(--dim)] mb-2">
          <CloudOff className="w-3.5 h-3.5 mr-1.5 mt-0.5 shrink-0" />
          Modo demonstração — conecte sua conta Google para salvar seu progresso de verdade.
        </p>
      )}
      {syncError && <p className="text-xs text-rose-500 mb-2">{syncError}</p>}

      {loading && reviewAccess.canStudy && (
        <div className="flex items-center justify-center py-16 text-xs text-[var(--dim)] font-mono">
          <Loader2 className="w-4 h-4 animate-spin mr-2" /> Carregando acervo de obras...
        </div>
      )}

      {loadError && (
        <div className="border border-rose-500/30 bg-rose-500/10 text-rose-300 rounded-xl p-4 text-xs">
          {loadError}
        </div>
      )}

      {reviewAccess.showLoading && (
        <div className="flex items-center justify-center py-16 text-xs text-[var(--dim)] font-mono">
          <Loader2 className="w-4 h-4 animate-spin mr-2" /> Sincronizando dados de repetição espaçada...
        </div>
      )}

      {reviewAccess.showError && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-5 text-center text-rose-300 text-xs">
          <p>Seu progresso não pôde ser carregado. Tente novamente antes de estudar.</p>
          {reviewAccess.canRetry && (
            <button
              onClick={retryHydration}
              className="mt-3 rounded-lg bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-[var(--wash)]"
            >
              Tentar novamente
            </button>
          )}
        </div>
      )}

      {!loading && reviewAccess.canStudy && !work && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {worksWithCounts.map(([name, count]) => (
            <Panel
              key={name}
              subject="Literatura"
              interactive
              onClick={() => startWorkSession(name)}
              className="ni-panel p-4 text-left cursor-pointer hover:border-[var(--primary)] transition-colors"
            >
              <p className="font-display font-medium text-xs text-[var(--text)]">{name}</p>
              <p className="text-[11px] font-mono text-[var(--dim)] mt-1">{count} cartões de análise</p>
            </Panel>
          ))}
        </div>
      )}

      {!loading && reviewAccess.canStudy && work && sessionCards && (
        <FlashcardSession
          title={work}
          cards={sessionCards}
          onRate={recordReview}
          onExit={exitWorkSession}
          onComplete={exitWorkSession}
        />
      )}
    </div>
  );
}
