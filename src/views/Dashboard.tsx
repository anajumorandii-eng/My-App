import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CalendarClock, CheckCircle2, CloudOff, History, Stethoscope, WifiOff } from 'lucide-react';
import { useDailyPlan } from '../hooks/useDailyPlan';
import { useUserMastery } from '../hooks/useUserMastery';
import { useStudentGoals } from '../hooks/useStudentGoals';
import { useAuth } from '../context/AuthContext';
import { useAdaptiveRankingChange } from '../hooks/useAdaptiveRankingChange';
import { todayInSaoPaulo } from '../features/availability/time';
import { computeBoardSignals, examFocusFor } from '../lib/efficiencyEngine';
import { examsForBoard, daysUntil, sameBoard, VestibularExam } from '../data/examCalendar';
import { mockTopics } from '../data/mockData';
import { addPlanFeedback } from '../lib/userData';
import { deriveMasteryOrigin } from '../lib/masteryOrigin';
import { StudyAction, AllocatedStudyAction, RecommendationReason, DisagreeReason, PlanFeedback, RecommendationFactorKind, StudentGoals } from '../types';
import { CrivoCore } from '../components/CrivoCore';
import { TodayFocus } from '../features/daily-plan/components/TodayFocus';
import { DecisionSequence } from '../features/daily-plan/components/DecisionSequence';
import { FeedbackStatus } from '../features/daily-plan/components/DisagreeControl';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { PALETTES, SUBJECT_ICONS } from '../prototypes/NucleoInstrumentalPrototype';

export { SUBJECT_ICONS, PALETTES } from '../prototypes/NucleoInstrumentalPrototype';

const REASON_LABELS: Record<RecommendationReason, string> = {
  dominio_insuficiente: 'Domínio ainda insuficiente nesse tópico',
  erro_recorrente: 'Erros recorrentes recentes',
  revisao_urgente: 'Revisão está atrasada',
  prerequisito_bloqueado: 'Um pré-requisito ainda está fraco',
  incidencia_banca_prioritaria: 'Cai bastante na banca que você priorizou',
  proximidade_prova: 'Uma prova relevante está se aproximando',
  tempo_disponivel: 'Coube no seu tempo disponível hoje',
  fase_revisao_intensificada: 'Fase atual do seu plano prioriza revisão (prova se aproximando)',
};

const ACTION_LABELS: Record<StudyAction['type'], string> = {
  review: 'Revisar para consolidar',
  practice: 'Praticar sem apoio',
  theory: 'Reconstruir a base',
  error_analysis: 'Analisar erros recorrentes',
};

// The single most decision-relevant reason, for the one-line summary in
// TodayFocus — tempo_disponivel/fase_revisao_intensificada are about having
// fit the time budget, not about *why* this topic outranked the rest, so
// they're skipped here (they still show up inside "Por que isso?").
function mainReasonFor(action: StudyAction): string {
  const ranked = action.reasons.filter((r) => r !== 'tempo_disponivel' && r !== 'fase_revisao_intensificada');
  const primary = ranked[0] ?? action.reasons[0];
  return primary ? REASON_LABELS[primary] : 'Prioridade calculada a partir do seu histórico de estudo.';
}

const CONTRIBUTION_EPSILON = 0.01;
const EXAM_MULTIPLIER_EPSILON = 0.001;

function contributingFactor(action: StudyAction, kind: RecommendationFactorKind) {
  const factor = action.factors?.find((candidate) => candidate.kind === kind);
  return factor && factor.contribution > CONTRIBUTION_EPSILON ? factor : undefined;
}

// RecommendationFactor intentionally stores the aggregate exam multiplier,
// not a board id. Rebuild that aggregate at the snapshot instant and only
// name a board when removing its signal actually lowers the action's score.
// This keeps the disclosure conservative: ties with no uniquely influential
// board produce no exam claim instead of inventing causality.
function causalExamsFor(action: StudyAction, goals: StudentGoals): VestibularExam[] {
  const hasExamReason = action.reasons.some((reason) =>
    reason === 'proximidade_prova' || reason === 'incidencia_banca_prioritaria',
  );
  const factor = contributingFactor(action, 'exam_relevance');
  const topic = mockTopics.find((candidate) => candidate.id === action.topicId);
  const calculatedAt = action.snapshot?.calculatedAt ? new Date(action.snapshot.calculatedAt) : null;

  if (!hasExamReason || !factor || !topic || !calculatedAt || Number.isNaN(calculatedAt.getTime())) return [];

  const signals = computeBoardSignals(goals, calculatedAt);
  const aggregate = examFocusFor(topic, signals).multiplier;
  if (Math.abs(aggregate - factor.rawValue) > EXAM_MULTIPLIER_EPSILON) return [];

  return signals
    .filter((_, signalIndex) => {
      const withoutSignal = signals.filter((__, candidateIndex) => candidateIndex !== signalIndex);
      return aggregate - examFocusFor(topic, withoutSignal).multiplier > CONTRIBUTION_EPSILON;
    })
    .flatMap((signal) => {
      const preference = goals.boardWeights.find((candidate) => sameBoard(candidate.board, signal.board));
      return examsForBoard(signal.board, preference?.phaseFocus ?? 'ambas', calculatedAt).slice(0, 1);
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    availability,
    prioritizedActions = [],
    allocatedActions: dailyPlan = [],
    loading = false,
    warnings = [],
    isPersisted = false,
  } = useDailyPlan(todayInSaoPaulo());
  const { mastery } = useUserMastery();
  const { goals } = useStudentGoals();

  const availableMinutes = availability?.totalMinutes ?? 0;
  const masteryOrigin = deriveMasteryOrigin(mastery, isPersisted);
  // Demo data counts as "has evidence" — it's a populated sample dataset,
  // not an untouched baseline; only a real account still at the baseline
  // (never diagnosed) counts as 'seed'.
  const hasEvidence = masteryOrigin !== 'seed';
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const SUBJECT_OPTIONS = [
    'Física',
    'Matemática',
    'Biologia',
    'Química',
    'História',
    'Geografia',
    'Português',
    'Literatura',
    'Redação',
    'Atualidades',
  ];

  const fallbackActionForSubject = (subj: string): StudyAction => {
    const topic = mockTopics.find((t) => t.subject.toLowerCase() === subj.toLowerCase()) ?? mockTopics[0];
    return {
      id: `preview_${topic.id}`,
      topicId: topic.id,
      topicName: topic.name,
      subject: topic.subject,
      type: 'practice',
      estimatedMinutes: 35,
      priorityScore: 85,
      reasons: ['dominio_insuficiente'],
      factors: [
        { kind: 'learning_gap', rawValue: 40, contribution: 0.42 },
        { kind: 'exam_relevance', rawValue: 1.25, contribution: 0.35 },
      ],
      snapshot: {
        calculatedAt: new Date().toISOString(),
        masteryLevel: 42,
        uncertainty: 0.25,
      },
    };
  };

  const candidateAction = selectedSubject
    ? ((prioritizedActions ?? []).find((a) => a.subject.toLowerCase() === selectedSubject.toLowerCase()) ?? fallbackActionForSubject(selectedSubject))
    : (dailyPlan[0] ?? (prioritizedActions ?? [])[0] ?? fallbackActionForSubject('Física'));

  const primary = useMemo((): AllocatedStudyAction => {
    return {
      ...candidateAction,
      allocatedMinutes: (candidateAction as any).allocatedMinutes ?? candidateAction.estimatedMinutes ?? 35,
      intervalStart: (candidateAction as any).intervalStart ?? new Date().toISOString(),
      intervalEnd: (candidateAction as any).intervalEnd ?? new Date(Date.now() + 35 * 60000).toISOString(),
    };
  }, [candidateAction]);

  const secondary = dailyPlan.slice(1);

  // `prioritizedActions` is the complete ranking that the allocator received.
  // Its complement to the allocated IDs is the only waiting queue that can
  // account for fragmented intervals as well as the total-time budget.
  const canWait = useMemo(() => {
    const planned = new Set(dailyPlan.map((action) => action.id));
    return (prioritizedActions ?? []).filter((action) => !planned.has(action.id));
  }, [prioritizedActions, dailyPlan]);

  const actionExams = useMemo(() => primary ? causalExamsFor(primary, goals) : [], [goals, primary]);
  const reviewFactor = primary?.reasons.includes('revisao_urgente')
    ? contributingFactor(primary, 'review_urgency')
    : undefined;
  const reviewUrgency = reviewFactor ? Math.round(Math.max(0, Math.min(100, reviewFactor.rawValue))) : undefined;
  const usedAvailability = primary?.reasons.includes('tempo_disponivel') ?? false;
  const hasDecisionContext = usedAvailability || reviewUrgency !== undefined || actionExams.length > 0;
  const failureWarnings = warnings.filter((warning) => warning.code !== 'calendar-disconnected');
  const { changed: rankingChanged, previousSubject } = useAdaptiveRankingChange(primary?.topicId, primary?.subject);

  const [feedbackStatus, setFeedbackStatus] = useState<FeedbackStatus>('idle');

  const startAction = (topicId?: string) => navigate(topicId ? `/sessao?topic=${encodeURIComponent(topicId)}` : '/sessao');

  const handleDisagree = async (reason: DisagreeReason) => {
    if (!primary) return;
    setFeedbackStatus('saving');
    const feedback: PlanFeedback = {
      id: `feedback_${primary.id}_${Date.now()}`,
      actionId: primary.id,
      topicId: primary.topicId,
      reason,
      date: new Date().toISOString(),
    };
    if (!user) {
      setFeedbackStatus('saved');
      return;
    }
    try {
      await addPlanFeedback(user.uid, feedback);
      setFeedbackStatus('saved');
    } catch (error) {
      console.error('Failed to save plan feedback:', error);
      setFeedbackStatus('error');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6" aria-busy="true" aria-live="polite">
        <span className="sr-only">Lendo seu histórico para montar o plano de hoje…</span>
        <div className="flex items-center gap-4 rounded-card border border-border-subtle bg-surface-elevated p-6 sm:p-8">
          <CrivoCore state="listening" size={56} />
          <div className="flex-1 space-y-2.5">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-3 w-44" />
          </div>
        </div>
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  const palette = PALETTES[primary?.subject ?? 'Matemática'] ?? PALETTES.Matemática;
  const SubIcon = SUBJECT_ICONS[primary?.subject ?? 'Matemática'] ?? BookOpen;

  return (
      <main
        className="ni-main crivo-observatorio-home"
        data-geometry="organic"
        style={{
          '--primary': palette.primary,
          '--secondary': palette.secondary,
          '--wash': palette.wash,
        } as React.CSSProperties}
      >
        <div className="ni-route">
          <span>DECISÃO</span>
          <i />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[var(--primary)] text-[var(--wash)]">
              <SubIcon className="w-3 h-3" />
            </span>
            {(primary?.subject ?? 'MATEMÁTICA').toUpperCase()}
          </span>
          <i />
          <b>{primary?.topicName}</b>
        </div>
        <div className="ni-title">
          <div>
            <h1>Sua trajetória, em decisões realizáveis.</h1>
            <p>O plano se reorganiza à medida que suas evidências mudam.</p>
          </div>
          <div className="ni-state"><i /> perfil {palette.family} · foco ativo</div>
        </div>
        <div className="ni-subjects" aria-label="Matérias">
            {SUBJECT_OPTIONS.map((subj) => {
              const active = (selectedSubject ?? primary?.subject ?? '').toLowerCase() === subj.toLowerCase();
              const subPal = PALETTES[subj] ?? PALETTES.Matemática;
              const Icon = SUBJECT_ICONS[subj] ?? BookOpen;
              return (
                <button
                  key={subj}
                  onClick={() => setSelectedSubject(subj)}
                  className={active ? 'active' : ''}
                  style={
                    active
                      ? { backgroundColor: subPal.primary, color: subPal.wash, borderRadius: '4px', padding: '2px 8px', display: 'inline-flex', alignItems: 'center', gap: '5px' }
                      : { display: 'inline-flex', alignItems: 'center', gap: '5px' }
                  }
                >
                  <Icon className="w-3 h-3 opacity-80" />
                  <span>{subj}</span>
                </button>
              );
            })}
        </div>

        {availableMinutes <= 0 && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-700 dark:text-amber-300 flex items-center justify-between mb-6">
            <span>Sua agenda semanal não tem janelas configuradas para hoje. Exibindo a prioridade calculada pelo Crivo.</span>
            <button onClick={() => navigate('/plano')} className="underline font-semibold ml-2 shrink-0">Ajustar agenda</button>
          </div>
        )}

        {primary ? (
          <>
            <TodayFocus
              key={primary.id}
              action={primary}
              actionLabel={ACTION_LABELS[primary.type]}
              mainReason={mainReasonFor(primary)}
              onStart={() => startAction(primary.topicId)}
              showAdaptiveUpdate={rankingChanged}
              previousSubject={previousSubject}
              userId={user?.uid}
              feedbackStatus={feedbackStatus}
              onDisagree={handleDisagree}
            />

            {hasDecisionContext && (
              <details className="crivo-day-context">
                <summary>Contexto que entrou na decisão</summary>
                <div className="crivo-day-context-grid">
                  {usedAvailability && (
                    <div>
                      <CalendarClock aria-hidden="true" />
                      <p><strong>{availableMinutes} min</strong><span>disponíveis hoje</span></p>
                    </div>
                  )}
                  {actionExams.map((exam) => {
                    const remainingDays = daysUntil(exam.date, new Date(primary.snapshot.calculatedAt));
                    return (
                      <div key={exam.id}>
                        <CalendarClock aria-hidden="true" />
                        <p><strong>{exam.label}</strong><span>{remainingDays === 0 ? 'É hoje' : `Faltam ${remainingDays} dias`}</span></p>
                      </div>
                    );
                  })}
                  {reviewUrgency !== undefined && (
                    <div>
                      <History aria-hidden="true" />
                      <p>
                        <strong>Urgência de revisão</strong>
                        <span>{reviewUrgency}% de urgência neste tópico</span>
                      </p>
                    </div>
                  )}
                </div>
              </details>
            )}

            {(!isPersisted || failureWarnings.length > 0) && (
              <aside className="crivo-today-notices" aria-label="Estado dos dados do plano">
                {!isPersisted && (
                  <p>
                    <CloudOff aria-hidden="true" />
                    Modo demonstração — conecte sua conta Google em "Conexões Google" para salvar seu progresso de verdade.
                  </p>
                )}
                {failureWarnings.map((warning) => (
                  <p key={warning.code} className="text-status-warning">
                    <WifiOff aria-hidden="true" />
                    {warning.message}
                  </p>
                ))}
              </aside>
            )}

            <DecisionSequence next={secondary} waiting={canWait} actionLabels={ACTION_LABELS} onStart={startAction} />
          </>
        ) : (
          <div className="crivo-today-empty">
            <header>
              <p className="crivo-decision-eyebrow">Hoje</p>
              <h1 className="font-display text-3xl font-semibold text-text-primary">Seu plano de estudo</h1>
            </header>
            {!hasEvidence ? (
              <EmptyState
                icon={Stethoscope}
                title="Ainda não há um diagnóstico seu"
                description="O plano de hoje é montado a partir do seu diagnóstico inicial. Sem ele, não há uma base real para recomendar prioridades — em vez de inventar uma, preferimos pedir o diagnóstico primeiro."
                action={<Button onClick={() => navigate('/diagnostico')}>Iniciar diagnóstico</Button>}
              />
            ) : availableMinutes <= 0 ? (
              <EmptyState
                icon={CalendarClock}
                title="Sem tempo disponível hoje"
                description="Sua agenda semanal, somada às exceções de hoje, não deixou nenhuma janela de estudo livre."
                action={
                  <Button variant="secondary" onClick={() => navigate('/plano')}>
                    Ajustar em Plano de Estudo
                  </Button>
                }
              />
            ) : (
              <EmptyState
                icon={CheckCircle2}
                title="Não precisa fazer nada extra hoje"
                description="Com base no seu histórico, você já tem evidências suficientes de domínio nos tópicos ativos e nenhuma revisão urgente pendente."
              />
            )}
          </div>
        )}
      </main>
  );
}
