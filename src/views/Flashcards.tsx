import React, { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { ArrowLeft, CloudOff, Layers, Loader2 } from 'lucide-react';
import { Flashcard, FlashcardPriority, FlashcardTrainingType } from '../types';
import { mockTopics } from '../data/mockData';
import { loadFlashcardsForSubject } from '../lib/flashcardContent';
import { useFlashcardReviews } from '../hooks/useFlashcardReviews';
import {
  FLASHCARD_PRIORITY_ORDER,
  FLASHCARD_TRAINING_TYPE_ORDER,
  FlashcardTopicSummary,
} from '../lib/flashcardCatalog';
import {
  flashcardNavigationReducer,
  initialFlashcardNavigationState,
} from '../lib/flashcardNavigation';
import {
  canSelectFlashcardTopic,
  createFlashcardLoadRequestToken,
  createFlashcardOwnerReset,
  createFlashcardSessionStart,
  createFlashcardStudySnapshot,
  invalidateFlashcardLoadRequests,
  isFlashcardDueNavigationBlocked,
  isCurrentFlashcardLoadRequest,
} from '../lib/flashcardStudyView';
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

const PRIORITY_LABELS: Record<FlashcardPriority, string> = {
  essencial: 'Essencial',
  alta: 'Alta',
  regular: 'Regular',
};

const TRAINING_TYPE_LABELS: Record<FlashcardTrainingType, string> = {
  objetivos: 'Objetivos',
  discursivos: 'Discursivos',
  interpretacao: 'Interpretação',
  pegadinhas: 'Pegadinhas',
  padroes_bancas: 'Padrões das bancas',
};

const OTHER_TOPICS_NAVIGATION_ID = '__other_flashcard_topics__';

function toSessionCard(card: Flashcard): SessionCard {
  return { id: card.id, front: card.front, back: card.back, label: card.chapter };
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
    >
      <ArrowLeft className="w-4 h-4 mr-1.5" /> Voltar
    </button>
  );
}

export default function Flashcards() {
  const {
    reviews,
    recordReview,
    hydrationStatus,
    hydratedOwnerUid,
    currentOwnerUid,
    isReadyForStudy,
    retryHydration,
    isPersisted,
    syncError,
  } = useFlashcardReviews();
  const [navigation, dispatch] = useReducer(
    flashcardNavigationReducer,
    initialFlashcardNavigationState,
  );
  const [cards, setCards] = useState<Flashcard[] | null>(null);
  const [sessionCards, setSessionCards] = useState<Flashcard[]>([]);
  const [selectionNow, setSelectionNow] = useState(() => new Date());
  const [loadingSubject, setLoadingSubject] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [studyOwnerUid, setStudyOwnerUid] = useState<string | null>(currentOwnerUid);
  const latestLoadRequest = useRef(0);
  const previousHydrationStatus = useRef(hydrationStatus);

  useEffect(() => () => {
    latestLoadRequest.current = invalidateFlashcardLoadRequests(latestLoadRequest.current);
  }, []);

  useEffect(() => {
    const leftReady = currentOwnerUid !== null
      && previousHydrationStatus.current === 'ready'
      && hydrationStatus !== 'ready';
    previousHydrationStatus.current = hydrationStatus;
    if (studyOwnerUid === currentOwnerUid && !leftReady) return;

    // Firebase Auth always resolves asynchronously, even with a persisted
    // session — so on every fresh page load `currentOwnerUid` briefly reads
    // as null (unknown, not "logged out") before flipping to the real uid a
    // beat later. That first flip isn't an account switch — there's no
    // previous owner's session to protect against — so it shouldn't discard
    // a subject load already in flight (e.g. a click made the instant the
    // page rendered, before auth caught up) or the navigation under it.
    if (studyOwnerUid === null && currentOwnerUid !== null && !leftReady) {
      setStudyOwnerUid(currentOwnerUid);
      return;
    }

    const reset = createFlashcardOwnerReset(currentOwnerUid, new Date());
    latestLoadRequest.current = invalidateFlashcardLoadRequests(latestLoadRequest.current);
    dispatch(reset.navigationAction);
    setCards(reset.cards);
    setSessionCards(reset.sessionCards);
    setSelectionNow(reset.selectionNow);
    setLoadingSubject(null);
    setLoadError(null);
    setStudyOwnerUid(reset.ownerUid);
  }, [currentOwnerUid, hydrationStatus, studyOwnerUid]);

  const studyOwnerMatches = studyOwnerUid === currentOwnerUid;
  const reviewsOwnerMatches = !isPersisted || hydratedOwnerUid === currentOwnerUid;

  const dueNavigationBlocked = isFlashcardDueNavigationBlocked(
    isPersisted,
    !isReadyForStudy || !reviewsOwnerMatches,
  ) || !studyOwnerMatches;

  const subjectTopics = useMemo(
    () => mockTopics.filter((topic) => topic.subject === navigation.subject),
    [navigation.subject],
  );

  const studySnapshot = useMemo(
    () => (cards
      ? createFlashcardStudySnapshot(cards, subjectTopics, reviews, selectionNow)
      : null),
    [cards, reviews, selectionNow, subjectTopics],
  );

  const topicIndex = studySnapshot?.topicIndex ?? [];

  const selectedTopic = useMemo(
    () => topicIndex.find((topic) => (
      topic.topicId ?? OTHER_TOPICS_NAVIGATION_ID
    ) === navigation.topicId),
    [navigation.topicId, topicIndex],
  );

  const sessionTitle = useMemo(() => {
    if (navigation.step !== 'session' || !navigation.subject || !selectedTopic) return '';
    if (navigation.allDueForTopic) {
      return `${navigation.subject} — ${selectedTopic.label} — todos os vencidos`;
    }
    if (!navigation.priority || !navigation.trainingType) {
      return `${navigation.subject} — ${selectedTopic.label}`;
    }
    return `${navigation.subject} — ${selectedTopic.label} — ${PRIORITY_LABELS[navigation.priority]} — ${TRAINING_TYPE_LABELS[navigation.trainingType]}`;
  }, [navigation, selectedTopic]);

  const openSubject = async (name: string) => {
    if (dueNavigationBlocked || loadingSubject !== null) return;
    const requestToken = createFlashcardLoadRequestToken(latestLoadRequest.current);
    latestLoadRequest.current = requestToken;
    setLoadingSubject(name);
    setLoadError(null);
    try {
      const data = await loadFlashcardsForSubject(name);
      if (!isCurrentFlashcardLoadRequest(requestToken, latestLoadRequest.current)) return;
      setCards(data);
      setSelectionNow(new Date());
      dispatch({ type: 'select_subject', subject: name });
    } catch (error) {
      if (!isCurrentFlashcardLoadRequest(requestToken, latestLoadRequest.current)) return;
      console.error('Failed to load flashcards:', error);
      setLoadError('Não foi possível carregar os flashcards dessa matéria.');
    } finally {
      if (isCurrentFlashcardLoadRequest(requestToken, latestLoadRequest.current)) {
        setLoadingSubject(null);
      }
    }
  };

  const renewStudySnapshot = () => {
    if (!cards) return null;
    const now = new Date();
    const snapshot = createFlashcardStudySnapshot(cards, subjectTopics, reviews, now);
    setSelectionNow(now);
    return snapshot;
  };

  const chooseTopic = (topic: FlashcardTopicSummary) => {
    if (dueNavigationBlocked || !canSelectFlashcardTopic(topic)) return;
    const refreshedSnapshot = renewStudySnapshot();
    if (!refreshedSnapshot) return;
    const navigationTopicId = topic.topicId ?? OTHER_TOPICS_NAVIGATION_ID;
    const refreshedTopic = refreshedSnapshot.topicIndex.find((candidate) => (
      candidate.topicId ?? OTHER_TOPICS_NAVIGATION_ID
    ) === navigationTopicId);
    if (!refreshedTopic || !canSelectFlashcardTopic(refreshedTopic)) return;
    dispatch({ type: 'select_topic', topicId: navigationTopicId });
    dispatch({ type: 'back' });
  };

  const reviewAllDueForTopic = () => {
    if (dueNavigationBlocked || !selectedTopic) return;
    if (!cards) return;
    const now = new Date();
    const start = createFlashcardSessionStart(
      cards,
      subjectTopics,
      reviews,
      { topicId: selectedTopic.topicId, allDueForTopic: true },
      now,
    );
    setSelectionNow(now);
    setSessionCards(start.sessionCards);
    dispatch({ type: 'review_all_due' });
  };

  const startTrainingSession = (trainingType: FlashcardTrainingType) => {
    if (dueNavigationBlocked || !selectedTopic || !navigation.priority) return;
    if (!cards) return;
    const now = new Date();
    const start = createFlashcardSessionStart(
      cards,
      subjectTopics,
      reviews,
      {
        topicId: selectedTopic.topicId,
        priority: navigation.priority,
        trainingType,
        allDueForTopic: false,
      },
      now,
    );
    setSelectionNow(now);
    setSessionCards(start.sessionCards);
    dispatch({ type: 'select_training_type', trainingType });
  };

  const exitSession = () => {
    setSelectionNow(new Date());
    dispatch({ type: 'back' });
  };

  const priorityCounts = (priority: FlashcardPriority) => (
    selectedTopic
      ? FLASHCARD_TRAINING_TYPE_ORDER.reduce(
        (counts, trainingType) => ({
          total: counts.total + selectedTopic.buckets[priority][trainingType].total,
          due: counts.due + selectedTopic.buckets[priority][trainingType].due,
        }),
        { total: 0, due: 0 },
      )
      : { total: 0, due: 0 }
  );

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
            Modo demonstração — conecte sua conta Google em &quot;Conexões Google&quot; para salvar seu progresso de verdade.
          </p>
        )}
        {syncError && <p className="text-xs text-rose-500 mt-2">{syncError}</p>}
      </header>

      {dueNavigationBlocked && (!studyOwnerMatches || hydrationStatus !== 'error') && (
        <div className="flex items-center justify-center py-16 text-zinc-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Carregando seu progresso de flashcards...
        </div>
      )}

      {dueNavigationBlocked && hydrationStatus === 'error' && studyOwnerMatches && (
        <div className="rounded-xl bg-rose-50 p-5 text-center text-rose-700 dark:bg-rose-900/20 dark:text-rose-300">
          <p className="text-sm">Seu progresso não pôde ser carregado. Tente novamente antes de estudar.</p>
          <button
            onClick={retryHydration}
            className="mt-3 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!dueNavigationBlocked && navigation.step === 'subject' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {SUBJECTS.map(({ name, count, colorClasses }) => (
              <button
                key={name}
                onClick={() => openSubject(name)}
                disabled={loadingSubject !== null || dueNavigationBlocked}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-left shadow-sm hover:shadow-md transition-shadow disabled:opacity-60 disabled:cursor-wait"
              >
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${colorClasses}`}>{name}</span>
                <p className="text-sm text-zinc-500 mt-2">{count.toLocaleString('pt-BR')} cartões</p>
              </button>
            ))}
          </div>

          {loadingSubject && (
            <div className="flex items-center justify-center py-4 text-zinc-400">
              <Loader2 className="w-5 h-5 animate-spin mr-2" /> Carregando flashcards de {loadingSubject}...
            </div>
          )}

          {loadError && (
            <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 rounded-xl p-4 text-sm">
              {loadError}
            </div>
          )}
        </div>
      )}

      {!dueNavigationBlocked && navigation.step === 'topic' && (
        <div className="space-y-4">
          <BackButton onClick={() => dispatch({ type: 'back' })} />
          <div>
            <h2 className="text-xl font-semibold">{navigation.subject} — escolha um tópico</h2>
            <p className="text-sm text-zinc-500 mt-1">Selecione o recorte que deseja revisar.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {topicIndex.map((topic) => {
              const navigationTopicId = topic.topicId ?? OTHER_TOPICS_NAVIGATION_ID;
              const isSelected = navigation.topicId === navigationTopicId;
              return (
                <button
                  key={navigationTopicId}
                  onClick={() => chooseTopic(topic)}
                  disabled={!canSelectFlashcardTopic(topic)}
                  aria-pressed={isSelected}
                  className={`rounded-xl border p-4 text-left shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-zinc-200 bg-white hover:border-indigo-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-700'
                  }`}
                >
                  <span className="font-medium">{topic.label}</span>
                  <p className="mt-1 text-sm text-zinc-500">
                    {topic.total.toLocaleString('pt-BR')} cartões · {topic.due.toLocaleString('pt-BR')} vencidos
                  </p>
                </button>
              );
            })}
          </div>

          {selectedTopic && (
            <div className="flex flex-col gap-2 rounded-xl border border-zinc-200 bg-white p-4 sm:flex-row dark:border-zinc-800 dark:bg-zinc-900">
              <button
                onClick={reviewAllDueForTopic}
                disabled={selectedTopic.due === 0}
                className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Revisar todos os vencidos deste tópico
              </button>
              <button
                onClick={() => {
                  if (navigation.topicId) {
                    dispatch({ type: 'select_topic', topicId: navigation.topicId });
                  }
                }}
                className="flex-1 rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Escolher prioridade
              </button>
            </div>
          )}
        </div>
      )}

      {!dueNavigationBlocked && navigation.step === 'priority' && selectedTopic && (
        <div className="space-y-4">
          <BackButton onClick={() => dispatch({ type: 'back' })} />
          <div>
            <h2 className="text-xl font-semibold">{navigation.subject} — {selectedTopic.label}</h2>
            <p className="text-sm text-zinc-500 mt-1">Escolha a prioridade dos cartões.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {FLASHCARD_PRIORITY_ORDER.map((priority) => {
              const counts = priorityCounts(priority);
              return (
                <button
                  key={priority}
                  onClick={() => dispatch({ type: 'select_priority', priority })}
                  disabled={counts.total === 0}
                  className="rounded-xl border border-zinc-200 bg-white p-4 text-left shadow-sm hover:border-indigo-300 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-700"
                >
                  <span className="font-medium">{PRIORITY_LABELS[priority]}</span>
                  <p className="mt-1 text-sm text-zinc-500">
                    {counts.total.toLocaleString('pt-BR')} cartões · {counts.due.toLocaleString('pt-BR')} vencidos
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {!dueNavigationBlocked && navigation.step === 'training_type' && selectedTopic && navigation.priority && (
        <div className="space-y-4">
          <BackButton onClick={() => dispatch({ type: 'back' })} />
          <div>
            <h2 className="text-xl font-semibold">
              {navigation.subject} — {selectedTopic.label} — {PRIORITY_LABELS[navigation.priority]}
            </h2>
            <p className="text-sm text-zinc-500 mt-1">Escolha o tipo de treino.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FLASHCARD_TRAINING_TYPE_ORDER.map((trainingType) => {
              const counts = selectedTopic.buckets[navigation.priority][trainingType];
              return (
                <button
                  key={trainingType}
                  onClick={() => startTrainingSession(trainingType)}
                  disabled={counts.total === 0}
                  className="rounded-xl border border-zinc-200 bg-white p-4 text-left shadow-sm hover:border-indigo-300 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-700"
                >
                  <span className="font-medium">{TRAINING_TYPE_LABELS[trainingType]}</span>
                  <p className="mt-1 text-sm text-zinc-500">
                    {counts.total.toLocaleString('pt-BR')} cartões · {counts.due.toLocaleString('pt-BR')} vencidos
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {!dueNavigationBlocked && navigation.step === 'session' && selectedTopic && (
        sessionCards.length > 0 ? (
          <FlashcardSession
            title={sessionTitle}
            cards={sessionCards.map(toSessionCard)}
            onRate={recordReview}
            onExit={exitSession}
          />
        ) : (
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-lg font-semibold">Nenhum cartão vencido neste tópico</h3>
            <button
              onClick={exitSession}
              className="mt-5 inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {navigation.allDueForTopic ? 'Voltar ao tópico' : 'Voltar aos tipos de treino'}
            </button>
          </div>
        )
      )}
    </div>
  );
}
