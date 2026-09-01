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
import { addUserAttempt, getUserStudySessionsForDate, saveUserStudySession } from '../lib/userData';
import { applyReviewOutcome, qualityFromAnswerCorrectness, qualityFromStudyVerification } from '../lib/spacedRepetition';
import { Skeleton } from '../components/ui/Skeleton';
import { Panel } from '../components/ui/Panel';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { CrivoCore, type CrivoCoreState } from '../components/CrivoCore';
import { SubjectAtmosphere } from '../features/daily-plan/components/SubjectAtmosphere';
import { getSubjectProfile } from '../design-system/crivoSubjects';
import { useReducedMotion } from 'motion/react';

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
  const reducedMotion = useReducedMotion();
  const { mastery, updateMastery, isPersisted } = useUserMastery();
  const { user } = useAuth();
  const activeUid = user?.uid ?? null;
  const localDate = todayInSaoPaulo();
  const { availability, allocatedActions: dailyPlan, loading: dailyPlanLoading } = useDailyPlan(localDate);
  const { questions } = useQuestions();

  const [selectedAction, setSelectedAction] = useState<AllocatedStudyAction | null>(null);
  const [secondsLeft, setSecondsLeft] = useState((selectedAction?.allocatedMinutes ?? 0) * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const completedIdsRef = useRef<string[]>([]);
  const [verifiedIds, setVerifiedIds] = useState<string[]>([]);
  const [sessions, setSessions] = useState<Record<string, StudySessionRecord>>({});
  const [syncError, setSyncError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [timerAnnouncement, setTimerAnnouncement] = useState('');
  const [reconciledUid, setReconciledUid] = useState<string | null | undefined>(undefined);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionReconciliationLoading = reconciledUid !== activeUid;

  useEffect(() => {
    setIsRunning(false);
    completedIdsRef.current = [];
    setCompletedIds([]);
    setVerifiedIds([]);
    setSessions({});
    setSelectedAction(null);
    setSecondsLeft(0);
    setTimerAnnouncement('');
    setIsVerifying(false);
    setSyncError(null);

    if (!activeUid) {
      setReconciledUid(null);
      return;
    }

    let active = true;
    getUserStudySessionsForDate(activeUid, localDate).then((persistedSessions) => {
      if (!active) return;
      const latestSessions = persistedSessions.reduce<Record<string, StudySessionRecord>>((byActionId, session) => {
        if (!byActionId[session.actionId]) byActionId[session.actionId] = session;
        return byActionId;
      }, {});
      const completed = [...new Set(persistedSessions.map((session) => session.actionId))];
      completedIdsRef.current = completed;
      setCompletedIds(completed);
      setSessions(latestSessions);
      setVerifiedIds([...new Set(persistedSessions
        .filter((session) => session.verification)
        .map((session) => session.actionId))]);
    }).catch(() => {
      if (active) setSyncError('Não foi possível recuperar os blocos já concluídos hoje. Você ainda pode estudar normalmente.');
    }).finally(() => {
      if (active) setReconciledUid(activeUid);
    });

    return () => {
      active = false;
    };
  }, [activeUid, localDate]);

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
    setIsVerifying(false);
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
    setSyncError(null);

    // Mesma FORMA/ORDEM de chamada que Questoes.tsx já faz a cada resposta:
    // alimenta o domínio + agenda SM-2 (spacedRepetition.ts) e grava a
    // tentativa individual — essa é a evidência REAL da Sessão, anterior ao
    // cronômetro, não um substituto da checagem pós-cronômetro
    // (verifyLearning, abaixo). Diferente de Questoes.tsx, aqui o retorno
    // Promise<boolean> de updateMastery É checado (mesmo idioma não
    // bloqueante que verifyLearning já usa neste arquivo): a resposta não é
    // desfeita nem bloqueia o avanço por uma falha de sincronização, mas
    // também não finge sucesso incondicional quando a escrita de domínio
    // falha silenciosamente.
    updateMastery((prev) =>
      prev.map((m) =>
        m.topicId === currentActivityQuestion.topicId
          ? { ...m, ...applyReviewOutcome(m, qualityFromAnswerCorrectness(correct)), origin: 'observed' }
          : m
      )
    ).then((saved) => {
      if (!saved) setSyncError('Não foi possível registrar essa resposta no seu domínio. Ela pode não persistir.');
    }).catch(() => {
      setSyncError('Não foi possível registrar essa resposta no seu domínio. Ela pode não persistir.');
    });

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
    setIsVerifying(true);
    try {
      const verifiedSession = { ...session, verification: result, verifiedAt };
      if (user) await saveUserStudySession(user.uid, verifiedSession);
      const saved = await updateMastery((items) => items.map((item) => item.topicId === selectedAction.topicId
        ? { ...item, ...applyReviewOutcome(item, qualityFromStudyVerification(result), new Date(verifiedAt)), origin: 'observed' }
        : item));
      if (!saved) throw new Error('mastery-persistence-failed');
      setSessions((current) => ({ ...current, [selectedAction.id]: verifiedSession }));
      setVerifiedIds((ids) => [...ids, selectedAction.id]);
    } catch {
      setSyncError('Não foi possível registrar a checagem. Tente novamente antes de sair.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Applies the ?topic= deep link at most once per topic. Without the ref
  // guard, completing that same action changes `mastery` -> `dailyPlan`
  // recomputes -> this effect re-fires (searchParams didn't change, but its
  // dailyPlan dependency did) and resets the timer right after the block
  // was just finished.
  const appliedTopicRef = useRef<string | null>(null);
  useEffect(() => {
    if (sessionReconciliationLoading) return;
    const topicId = searchParams.get('topic');
    if (!topicId || appliedTopicRef.current === topicId) return;
    const requested = dailyPlan.find((action) => action.topicId === topicId);
    if (requested) {
      appliedTopicRef.current = topicId;
      setSelectedAction(requested);
      setSecondsLeft(requested.allocatedMinutes * 60);
      setTimerAnnouncement('');
    }
  }, [dailyPlan, searchParams, sessionReconciliationLoading]);

  useEffect(() => {
    if (sessionReconciliationLoading) return;
    if (selectedAction && dailyPlan.some((action) => action.id === selectedAction.id)) return;
    const next = dailyPlan[0] ?? null;
    setSelectedAction(next);
    setSecondsLeft((next?.allocatedMinutes ?? 0) * 60);
    setTimerAnnouncement('');
  }, [dailyPlan, selectedAction, sessionReconciliationLoading]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setTimerAnnouncement('Cronômetro concluído: 00:00');
            if (selectedAction) completeAction(selectedAction, selectedAction.allocatedMinutes * 60);
            return 0;
          }
          const next = prev - 1;
          if (next % 60 === 0) setTimerAnnouncement(`Tempo restante: ${formatTime(next)}`);
          return next;
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
    setTimerAnnouncement('');
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft((selectedAction?.allocatedMinutes ?? 0) * 60);
    setTimerAnnouncement(`Cronômetro reiniciado: ${formatTime((selectedAction?.allocatedMinutes ?? 0) * 60)}`);
  };

  const markComplete = () => {
    setIsRunning(false);
    setTimerAnnouncement(`Cronômetro concluído: ${formatTime(secondsLeft)}`);
    if (selectedAction) completeAction(selectedAction, totalSeconds - secondsLeft);
  };

  const totalSeconds = (selectedAction?.allocatedMinutes ?? 0) * 60;
  const progress = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;
  const isDone = selectedAction ? completedIds.includes(selectedAction.id) : false;
  const isVerified = selectedAction ? verifiedIds.includes(selectedAction.id) : false;
  const coreState: CrivoCoreState = isVerifying
    ? 'recalibrating'
    : isDone
      ? 'ready'
      : isRunning
        ? 'converging'
        : 'listening';

  // Aviso não bloqueante: só é possível afirmar que o ?topic= da URL não
  // existe no plano depois que o plano termina de carregar — antes disso,
  // um dailyPlan ainda vazio pareceria "tópico inválido" por engano.
  const requestedTopicId = searchParams.get('topic');
  const showTopicFallbackWarning = !!requestedTopicId
    && !dailyPlanLoading
    && !dailyPlan.some((action) => action.topicId === requestedTopicId);

  const activeProfile = selectedAction ? getSubjectProfile(selectedAction.subject) : null;

  return (
    <SubjectAtmosphere subject={selectedAction?.subject} focus={isRunning ? 1 : 0.45}>
      <div className="space-y-8" data-geometry={activeProfile?.fieldType}>
      <header>
        <h1 className="text-3xl font-display font-semibold tracking-tight text-text-primary mb-2 flex items-center">
          <StartIcon className="w-7 h-7 mr-3 text-action-primary" />
          Sessão de Estudo
        </h1>
        <p className="text-text-secondary">
          Escolha um bloco do seu plano e execute com foco cronometrado.
        </p>
        <p className="text-sm text-text-secondary mt-2"><span>{availability?.totalMinutes ?? 0} min</span> efetivos hoje</p>
        {showTopicFallbackWarning && (
          <p className="text-sm text-status-warning mt-2">{TOPIC_FALLBACK_WARNING}</p>
        )}
        {!isPersisted && (
          <p className="flex items-center text-xs text-text-muted mt-2">
            <CloudOff className="w-3.5 h-3.5 mr-1.5" />
            Modo demonstração — conecte sua conta Google em "Conexões Google" para salvar seu progresso de verdade.
          </p>
        )}
      </header>

      {sessionReconciliationLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Panel elevation="elevated" className="lg:col-span-1 p-4 space-y-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </Panel>
          <Panel elevation="elevated" className="lg:col-span-2 p-8 flex flex-col items-center gap-6">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-56 w-56 rounded-full" />
          </Panel>
        </div>
      ) : (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Panel elevation="elevated" className="lg:col-span-1 p-4">
          <h3 className="text-sm font-semibold text-text-secondary px-2 mb-2">Blocos de hoje</h3>
          <div className="space-y-1">
            {dailyPlan.map((action) => (
              <Button
                key={action.id}
                variant={selectedAction?.id === action.id ? 'secondary' : 'ghost'}
                onClick={() => selectAction(action)}
                className={`w-full justify-between text-left ${
                  selectedAction?.id === action.id
                    ? 'bg-surface-strong text-text-primary'
                    : ''
                }`}
              >
                <div className="min-w-0">
                  <p className="font-medium truncate">{action.topicName}</p>
                  <p className="text-xs text-text-secondary">{action.allocatedMinutes} min • {action.subject} • {formatIsoTimeInSaoPaulo(action.intervalStart)}–{formatIsoTimeInSaoPaulo(action.intervalEnd)}</p>
                </div>
                {completedIds.includes(action.id) && <CheckCircle2 className="w-4 h-4 text-status-success shrink-0 ml-2" />}
              </Button>
            ))}
            {dailyPlan.length === 0 && (
              <EmptyState title="Nenhum bloco planejado para hoje" description="Quando houver disponibilidade, seu plano de estudo aparecerá aqui." className="py-8" />
            )}
          </div>
        </Panel>

        <Panel elevation="elevated" className="lg:col-span-2 p-8 flex flex-col items-center justify-center text-center">
          {selectedAction ? (
            <>
              <div className="w-full flex items-start justify-between gap-4">
                <div className="min-w-0 text-left">
                  <p className="text-sm font-medium text-text-secondary mb-1 capitalize">{selectedAction.type.replace('_', ' ')} • {selectedAction.subject}</p>
                  <h2 className="text-2xl font-display font-semibold text-text-primary mb-4">{selectedAction.topicName}</h2>
                </div>
                <CrivoCore state={coreState} subject={selectedAction.subject} topicId={selectedAction.topicId} size={72} />
              </div>

              {showHonestFocusLabel && (
                <p className="text-xs text-text-secondary mb-6 max-w-md">{HONEST_FOCUS_LABEL}</p>
              )}

              {showMiniActivity && currentActivityQuestion && (
                <div className="w-full max-w-xl text-left mb-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-action-primary mb-3">
                    Mini-atividade antes do cronômetro • Questão {activityIndex + 1} de {activityPool.length}
                  </p>
                  <p className="text-base font-medium mb-4 leading-relaxed">{currentActivityQuestion.prompt}</p>
                  <div className="space-y-2 mb-4">
                    {currentActivityQuestion.options.map((option) => {
                      const isSelected = activitySelectedOptionId === option.id;
                      const isCorrectOption = option.id === currentActivityQuestion.correctOptionId;
                      let stateClasses = 'border-border-subtle';
                      if (activityAnswered && isCorrectOption) {
                        stateClasses = 'border-status-success bg-status-success/10';
                      } else if (activityAnswered && isSelected && !isCorrectOption) {
                        stateClasses = 'border-status-error bg-status-error/10';
                      }
                      return (
                        <Button
                          key={option.id}
                          variant="secondary"
                          onClick={() => answerActivityQuestion(option.id)}
                          disabled={activityAnswered}
                          className={`w-full justify-between text-left ${stateClasses}`}
                        >
                          <span>{option.text}</span>
                          {activityAnswered && isCorrectOption && <CheckCircle2 className="w-4 h-4 text-status-success shrink-0 ml-2" />}
                          {activityAnswered && isSelected && !isCorrectOption && <XCircle className="w-4 h-4 text-status-error shrink-0 ml-2" />}
                        </Button>
                      );
                    })}
                  </div>
                  {activityAnswered && (
                    <p className="text-sm mb-4 text-text-secondary">{currentActivityQuestion.explanation}</p>
                  )}
                  {syncError && <p className="text-sm text-status-error mb-4">{syncError}</p>}
                  <Button
                    onClick={advanceActivity}
                    disabled={!activityAnswered}
                    className="w-full"
                  >
                    {activityIndex + 1 < activityPool.length ? 'Próxima questão' : 'Concluir mini-atividade e iniciar cronômetro'}
                  </Button>
                </div>
              )}

              {!showMiniActivity && (
                <>
                  {activityCompleted && activityPool.length > 0 && (
                    <p className="text-xs text-status-success mb-6 max-w-md">
                      Mini-atividade concluída: {activityResults.filter((r) => r.correct).length} de {activityPool.length} corretas. Agora o cronômetro conta o esforço de estudo focado.
                    </p>
                  )}

                  <div className="relative w-56 h-56 mb-8">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" strokeWidth="8" className="stroke-surface-strong" />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        strokeWidth="8"
                        strokeLinecap="round"
                        className={`stroke-action-primary ${reducedMotion ? '' : 'transition-all duration-1000 ease-linear'}`}
                        strokeDasharray={2 * Math.PI * 45}
                        strokeDashoffset={2 * Math.PI * 45 * (1 - progress / 100)}
                      />
                    </svg>
                    <div aria-live="polite" aria-atomic="true" className="absolute inset-0 flex items-center justify-center">
                      <span aria-hidden="true" className="text-4xl font-bold text-text-primary tabular-nums">{formatTime(secondsLeft)}</span>
                      <span className="sr-only">{timerAnnouncement}</span>
                    </div>
                  </div>

                  {isDone ? (
                    <div className="flex items-center text-status-success font-medium mb-4">
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Tempo de estudo registrado
                    </div>
                  ) : null}

                  {isDone && !isVerified && (
                    <div className="w-full max-w-xl p-4 mb-5 rounded-card border border-border-subtle bg-surface-secondary text-left">
                      <p className="font-semibold text-sm mb-1">Checagem rápida de aprendizagem</p>
                      <p className="text-xs text-text-secondary mb-3">Sem consultar o material, você consegue explicar a ideia central ou resolver um exemplo básico? O tempo conta como esforço; somente esta evidência altera o domínio.</p>
                      <div className="flex flex-wrap gap-2">
                        {([
                          ['nao_consegui', 'Ainda não consigo'],
                          ['com_ajuda', 'Consigo com ajuda'],
                          ['sem_apoio', 'Consigo sem apoio'],
                        ] as const).map(([value, label]) => (
                          <Button key={value} variant="secondary" size="sm" onClick={() => verifyLearning(value)} loading={isVerifying}>
                            {label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  {isVerified && <p className="text-sm text-status-success mb-4">Checagem registrada; o plano foi recalculado com essa evidência.</p>}
                  {syncError && <p className="text-sm text-status-error mb-4">{syncError}</p>}

                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => {
                        const nextRunning = !isRunning;
                        setTimerAnnouncement(`Cronômetro ${nextRunning ? 'iniciado' : 'pausado'}: ${formatTime(secondsLeft)}`);
                        setIsRunning(nextRunning);
                      }}
                      disabled={secondsLeft === 0}
                      aria-pressed={isRunning}
                    >
                      {isRunning ? <Pause className="w-5 h-5" aria-hidden="true" /> : <PlayCircle className="w-5 h-5" aria-hidden="true" />}
                      {isRunning ? 'Pausar' : 'Iniciar'}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={resetTimer}
                      aria-label="Zerar cronômetro"
                    >
                      <RotateCcw className="w-4 h-4" aria-hidden="true" />
                      Reiniciar
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={markComplete}
                      disabled={isDone}
                    >
                      <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                      Concluir
                    </Button>
                  </div>
                </>
              )}
            </>
          ) : (
            <EmptyState title="Selecione um bloco de estudo" description="Escolha um bloco à esquerda para começar." />
          )}
        </Panel>
      </div>
      )}
      </div>
    </SubjectAtmosphere>
  );
}
