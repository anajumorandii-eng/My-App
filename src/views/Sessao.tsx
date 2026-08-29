import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useUserMastery } from '../hooks/useUserMastery';
import { useDailyPlan } from '../hooks/useDailyPlan';
import { useQuestions } from '../hooks/useQuestions';
import { formatIsoTimeInSaoPaulo, todayInSaoPaulo } from '../features/availability/time';
import { AllocatedStudyAction, Question } from '../types';
import { StudySessionRecord, StudyVerification } from '../types';
import { PlayCircle, Pause, RotateCcw, CheckCircle2, XCircle, PlayCircle as StartIcon, CloudOff } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { addUserAttempt, saveUserStudySession } from '../lib/userData';
import { applyReviewOutcome, qualityFromAnswerCorrectness, qualityFromStudyVerification } from '../lib/spacedRepetition';

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// Mesma lógica de embaralhamento que Diagnostico.tsx já usa (shuffled) —
// duplicada aqui de propósito: extrair um helper compartilhado entre a
// lógica de filtro/embaralhamento de questões desta tela e a de
// Diagnostico.tsx está fora do escopo desta tarefa (decisão já registrada no
// ledger da fase), mesmo parecendo repetitivo.
function shuffled<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Tipos de ação que ganham uma mini-atividade real (banco de MC do próprio
// tópico, ver useQuestions) antes do cronômetro contar esforço. 'theory' fica
// de fora de propósito: não existe banco de conteúdo teórico reaproveitável
// sem inventar um novo, então segue com o cronômetro focado de sempre,
// rotulado com honestidade (ver HONEST_FOCUS_LABEL).
const MINI_ACTIVITY_TYPES: ReadonlySet<AllocatedStudyAction['type']> = new Set(['practice', 'error_analysis', 'review']);
const MINI_ACTIVITY_SIZE = 3;
const HONEST_FOCUS_LABEL = 'Reconstrua a base sem apoio; ao final, avalie o que conseguiu.';
const TOPIC_FALLBACK_WARNING = 'O tópico solicitado não está mais no plano de hoje — mostrando sua prioridade atual.';

export default function Sessao() {
  const [searchParams] = useSearchParams();
  const { mastery, updateMastery, isPersisted } = useUserMastery();
  const { user } = useAuth();
  const { availability, allocatedActions: dailyPlan, loading: dailyPlanLoading } = useDailyPlan(todayInSaoPaulo());
  const { questions } = useQuestions();

  const [selectedAction, setSelectedAction] = useState<AllocatedStudyAction | null>(dailyPlan[0] ?? null);
  const [secondsLeft, setSecondsLeft] = useState((selectedAction?.allocatedMinutes ?? 0) * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const completedIdsRef = useRef<string[]>([]);
  const [verifiedIds, setVerifiedIds] = useState<string[]>([]);
  const [sessions, setSessions] = useState<Record<string, StudySessionRecord>>({});
  const [syncError, setSyncError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Banco de MC filtrado por tópico para a mini-atividade (ver
  // MINI_ACTIVITY_TYPES), embaralhado e recortado a até MINI_ACTIVITY_SIZE
  // perguntas. Deliberadamente memoizado só pela identidade da ação
  // selecionada (não por `questions`): uma vez sorteada a pool para esta
  // ação, ela não deve se re-embaralhar só porque o banco de questões
  // terminou de sincronizar com o Firestore no meio da atividade.
  const activityPool = useMemo<Question[]>(() => {
    if (!selectedAction || !MINI_ACTIVITY_TYPES.has(selectedAction.type)) return [];
    const candidates = questions.filter((q) => q.topicId === selectedAction.topicId);
    return shuffled(candidates).slice(0, MINI_ACTIVITY_SIZE);
  }, [selectedAction?.id, selectedAction?.type, selectedAction?.topicId]);

  const [activityIndex, setActivityIndex] = useState(0);
  const [activitySelectedOptionId, setActivitySelectedOptionId] = useState<string | null>(null);
  const [activityResults, setActivityResults] = useState<{ questionId: string; correct: boolean }[]>([]);
  const [activityCompleted, setActivityCompleted] = useState(false);

  // Troca de ação selecionada (clique manual, fallback de plano ou ?topic=)
  // reinicia o progresso da mini-atividade — cada bloco de estudo começa do
  // zero, nunca herdando a resposta selecionada do bloco anterior.
  useEffect(() => {
    setActivityIndex(0);
    setActivitySelectedOptionId(null);
    setActivityResults([]);
    setActivityCompleted(false);
  }, [selectedAction?.id]);

  const currentActivityQuestion = activityPool[activityIndex] ?? null;
  const activityAnswered = activitySelectedOptionId !== null;
  // 'theory' nunca entra aqui (fora de MINI_ACTIVITY_TYPES); dentro dos tipos
  // elegíveis, só vira mini-atividade de verdade se o banco tiver ao menos
  // uma questão MC para o tópico — sem isso, cai no mesmo cronômetro focado
  // e honesto do 'theory' (ver showHonestFocusLabel).
  const wantsMiniActivity = !!selectedAction && MINI_ACTIVITY_TYPES.has(selectedAction.type);
  const showMiniActivity = wantsMiniActivity && activityPool.length > 0 && !activityCompleted;
  const showHonestFocusLabel = !!selectedAction && (!wantsMiniActivity || activityPool.length === 0);

  const answerActivityQuestion = (optionId: string) => {
    if (!currentActivityQuestion || activityAnswered) return;
    const correct = optionId === currentActivityQuestion.correctOptionId;
    setActivitySelectedOptionId(optionId);
    setActivityResults((prev) => [...prev, { questionId: currentActivityQuestion.id, correct }]);

    // Mesmo par de chamadas que Questoes.tsx já faz a cada resposta: alimenta
    // o domínio + agenda SM-2 (spacedRepetition.ts) e grava a tentativa
    // individual — essa é a evidência REAL da Sessão, anterior ao cronômetro,
    // não um substituto da checagem pós-cronômetro (verifyLearning, abaixo).
    updateMastery((prev) =>
      prev.map((m) =>
        m.topicId === currentActivityQuestion.topicId
          ? { ...m, ...applyReviewOutcome(m, qualityFromAnswerCorrectness(correct)) }
          : m
      )
    );

    if (user) {
      addUserAttempt(user.uid, {
        id: `attempt_${Date.now()}`,
        questionId: currentActivityQuestion.id,
        topicId: currentActivityQuestion.topicId,
        correct,
        date: new Date().toISOString(),
      }).catch((error) => console.error('Failed to save session activity attempt:', error));
    }
  };

  const advanceActivity = () => {
    if (activityIndex + 1 < activityPool.length) {
      setActivityIndex((i) => i + 1);
      setActivitySelectedOptionId(null);
    } else {
      setActivityCompleted(true);
    }
  };

  const completeAction = useCallback((action: AllocatedStudyAction, elapsedSeconds: number) => {
    if (completedIdsRef.current.includes(action.id)) return;
    const completedAt = new Date().toISOString();
    const session: StudySessionRecord = {
      id: `${action.id}-${Date.now()}`,
      actionId: action.id,
      topicId: action.topicId,
      actionType: action.type,
      plannedMinutes: action.allocatedMinutes,
      completedMinutes: Math.max(1, Math.round(elapsedSeconds / 60)),
      completedAt,
    };
    completedIdsRef.current = [...completedIdsRef.current, action.id];
    setCompletedIds(completedIdsRef.current);
    setSessions((current) => ({ ...current, [action.id]: session }));
    setSyncError(null);
    if (user) saveUserStudySession(user.uid, session).catch(() => setSyncError('O bloco ficou salvo nesta tela, mas não sincronizou com a nuvem.'));
  }, [user]);

  const verifyLearning = async (result: StudyVerification) => {
    if (!selectedAction || verifiedIds.includes(selectedAction.id)) return;
    const session = sessions[selectedAction.id];
    if (!session) return;
    const verifiedAt = new Date().toISOString();
    setSyncError(null);
    try {
      const verifiedSession = { ...session, verification: result, verifiedAt };
      if (user) await saveUserStudySession(user.uid, verifiedSession);
      const saved = await updateMastery((items) => items.map((item) => item.topicId === selectedAction.topicId
        ? { ...item, ...applyReviewOutcome(item, qualityFromStudyVerification(result), new Date(verifiedAt)) }
        : item));
      if (!saved) throw new Error('mastery-persistence-failed');
      setSessions((current) => ({ ...current, [selectedAction.id]: verifiedSession }));
      setVerifiedIds((ids) => [...ids, selectedAction.id]);
    } catch {
      setSyncError('Não foi possível registrar a checagem. Tente novamente antes de sair.');
    }
  };

  // Applies the ?topic= deep link at most once per topic. Without the ref
  // guard, completing that same action changes `mastery` -> `dailyPlan`
  // recomputes -> this effect re-fires (searchParams didn't change, but its
  // dailyPlan dependency did) and resets the timer right after the block
  // was just finished.
  const appliedTopicRef = useRef<string | null>(null);
  useEffect(() => {
    const topicId = searchParams.get('topic');
    if (!topicId || appliedTopicRef.current === topicId) return;
    const requested = dailyPlan.find((action) => action.topicId === topicId);
    if (requested) {
      appliedTopicRef.current = topicId;
      setSelectedAction(requested);
      setSecondsLeft(requested.allocatedMinutes * 60);
    }
  }, [dailyPlan, searchParams]);

  useEffect(() => {
    if (selectedAction && dailyPlan.some((action) => action.id === selectedAction.id)) return;
    const next = dailyPlan[0] ?? null;
    setSelectedAction(next);
    setSecondsLeft((next?.allocatedMinutes ?? 0) * 60);
  }, [dailyPlan, selectedAction]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (selectedAction) completeAction(selectedAction, selectedAction.allocatedMinutes * 60);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, selectedAction, completeAction]);

  const selectAction = (action: AllocatedStudyAction) => {
    setIsRunning(false);
    setSelectedAction(action);
    setSecondsLeft(action.allocatedMinutes * 60);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft((selectedAction?.allocatedMinutes ?? 0) * 60);
  };

  const markComplete = () => {
    setIsRunning(false);
    if (selectedAction) completeAction(selectedAction, totalSeconds - secondsLeft);
  };

  const totalSeconds = (selectedAction?.allocatedMinutes ?? 0) * 60;
  const progress = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;
  const isDone = selectedAction ? completedIds.includes(selectedAction.id) : false;
  const isVerified = selectedAction ? verifiedIds.includes(selectedAction.id) : false;

  // Aviso não bloqueante: só é possível afirmar que o ?topic= da URL não
  // existe no plano depois que o plano termina de carregar — antes disso,
  // um dailyPlan ainda vazio pareceria "tópico inválido" por engano.
  const requestedTopicId = searchParams.get('topic');
  const showTopicFallbackWarning = !!requestedTopicId
    && !dailyPlanLoading
    && !dailyPlan.some((action) => action.topicId === requestedTopicId);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center">
          <StartIcon className="w-7 h-7 mr-3 text-indigo-500" />
          Sessão de Estudo
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Escolha um bloco do seu plano e execute com foco cronometrado.
        </p>
        <p className="text-sm text-zinc-500 mt-2"><span>{availability?.totalMinutes ?? 0} min</span> efetivos hoje</p>
        {showTopicFallbackWarning && (
          <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">{TOPIC_FALLBACK_WARNING}</p>
        )}
        {!isPersisted && (
          <p className="flex items-center text-xs text-zinc-400 mt-2">
            <CloudOff className="w-3.5 h-3.5 mr-1.5" />
            Modo demonstração — conecte sua conta Google em "Conexões Google" para salvar seu progresso de verdade.
          </p>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-zinc-500 px-2 mb-2">Blocos de hoje</h3>
          <div className="space-y-1">
            {dailyPlan.map((action) => (
              <button
                key={action.id}
                onClick={() => selectAction(action)}
                className={`w-full text-left px-3 py-3 rounded-lg transition-colors flex items-center justify-between ${
                  selectedAction?.id === action.id
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                    : 'hover:bg-zinc-50 dark:hover:bg-zinc-800'
                }`}
              >
                <div className="min-w-0">
                  <p className="font-medium truncate">{action.topicName}</p>
                  <p className="text-xs text-zinc-500">{action.allocatedMinutes} min • {action.subject} • {formatIsoTimeInSaoPaulo(action.intervalStart)}–{formatIsoTimeInSaoPaulo(action.intervalEnd)}</p>
                </div>
                {completedIds.includes(action.id) && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />}
              </button>
            ))}
            {dailyPlan.length === 0 && (
              <p className="text-sm text-zinc-500 px-3 py-4">Nenhum bloco planejado para hoje.</p>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center text-center">
          {selectedAction ? (
            <>
              <p className="text-sm font-medium text-zinc-500 mb-1 capitalize">{selectedAction.type.replace('_', ' ')} • {selectedAction.subject}</p>
              <h2 className="text-2xl font-bold mb-4">{selectedAction.topicName}</h2>

              {showHonestFocusLabel && (
                <p className="text-xs text-zinc-500 mb-6 max-w-md">{HONEST_FOCUS_LABEL}</p>
              )}

              {showMiniActivity && currentActivityQuestion && (
                <div className="w-full max-w-xl text-left mb-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500 mb-3">
                    Mini-atividade antes do cronômetro • Questão {activityIndex + 1} de {activityPool.length}
                  </p>
                  <p className="text-base font-medium mb-4 leading-relaxed">{currentActivityQuestion.prompt}</p>
                  <div className="space-y-2 mb-4">
                    {currentActivityQuestion.options.map((option) => {
                      const isSelected = activitySelectedOptionId === option.id;
                      const isCorrectOption = option.id === currentActivityQuestion.correctOptionId;
                      let stateClasses = 'border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800';
                      if (activityAnswered && isCorrectOption) {
                        stateClasses = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
                      } else if (activityAnswered && isSelected && !isCorrectOption) {
                        stateClasses = 'border-rose-500 bg-rose-50 dark:bg-rose-900/20';
                      }
                      return (
                        <button
                          key={option.id}
                          onClick={() => answerActivityQuestion(option.id)}
                          disabled={activityAnswered}
                          className={`w-full text-left px-4 py-3 rounded-xl border transition-colors flex items-center justify-between ${stateClasses}`}
                        >
                          <span>{option.text}</span>
                          {activityAnswered && isCorrectOption && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />}
                          {activityAnswered && isSelected && !isCorrectOption && <XCircle className="w-4 h-4 text-rose-500 shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                  </div>
                  {activityAnswered && (
                    <p className="text-sm mb-4 text-zinc-600 dark:text-zinc-400">{currentActivityQuestion.explanation}</p>
                  )}
                  <button
                    onClick={advanceActivity}
                    disabled={!activityAnswered}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white rounded-xl font-medium transition-colors"
                  >
                    {activityIndex + 1 < activityPool.length ? 'Próxima questão' : 'Concluir mini-atividade e iniciar cronômetro'}
                  </button>
                </div>
              )}

              {!showMiniActivity && (
                <>
                  {activityCompleted && activityPool.length > 0 && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-6 max-w-md">
                      Mini-atividade concluída: {activityResults.filter((r) => r.correct).length} de {activityPool.length} corretas. Agora o cronômetro conta o esforço de estudo focado.
                    </p>
                  )}

                  <div className="relative w-56 h-56 mb-8">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" strokeWidth="8" className="stroke-zinc-100 dark:stroke-zinc-800" />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        strokeWidth="8"
                        strokeLinecap="round"
                        className="stroke-indigo-600 dark:stroke-indigo-400 transition-all duration-1000 ease-linear"
                        strokeDasharray={2 * Math.PI * 45}
                        strokeDashoffset={2 * Math.PI * 45 * (1 - progress / 100)}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl font-bold tabular-nums">{formatTime(secondsLeft)}</span>
                    </div>
                  </div>

                  {isDone ? (
                    <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium mb-4">
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Tempo de estudo registrado
                    </div>
                  ) : null}

                  {isDone && !isVerified && (
                    <div className="w-full max-w-xl p-4 mb-5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-900/20 text-left">
                      <p className="font-semibold text-sm mb-1">Checagem rápida de aprendizagem</p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3">Sem consultar o material, você consegue explicar a ideia central ou resolver um exemplo básico? O tempo conta como esforço; somente esta evidência altera o domínio.</p>
                      <div className="flex flex-wrap gap-2">
                        {([
                          ['nao_consegui', 'Ainda não consigo'],
                          ['com_ajuda', 'Consigo com ajuda'],
                          ['sem_apoio', 'Consigo sem apoio'],
                        ] as const).map(([value, label]) => (
                          <button key={value} onClick={() => verifyLearning(value)} className="px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm hover:border-indigo-400">
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {isVerified && <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-4">Checagem registrada; o plano foi recalculado com essa evidência.</p>}
                  {syncError && <p className="text-sm text-rose-500 mb-4">{syncError}</p>}

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsRunning((r) => !r)}
                      disabled={secondsLeft === 0}
                      className="flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white rounded-xl font-medium transition-colors"
                    >
                      {isRunning ? <Pause className="w-5 h-5 mr-2" /> : <PlayCircle className="w-5 h-5 mr-2" />}
                      {isRunning ? 'Pausar' : 'Iniciar'}
                    </button>
                    <button
                      onClick={resetTimer}
                      className="flex items-center px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={markComplete}
                      disabled={isDone}
                      className="flex items-center px-4 py-3 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Concluir
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <p className="text-zinc-500">Selecione um bloco de estudo à esquerda para começar.</p>
          )}
        </div>
      </div>
    </div>
  );
}
