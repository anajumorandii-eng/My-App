import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarClock, CheckCircle2, CloudOff, History, Stethoscope, WifiOff } from 'lucide-react';
import { useDailyPlan } from '../hooks/useDailyPlan';
import { useUserMastery } from '../hooks/useUserMastery';
import { useAuth } from '../context/AuthContext';
import { useAdaptiveRankingChange } from '../hooks/useAdaptiveRankingChange';
import { todayInSaoPaulo } from '../features/availability/time';
import { pendingReviewCount } from '../lib/reviewUrgency';
import { nextExams, daysUntil } from '../data/examCalendar';
import { addPlanFeedback } from '../lib/userData';
import { deriveMasteryOrigin } from '../lib/masteryOrigin';
import { StudyAction, RecommendationReason, DisagreeReason, PlanFeedback } from '../types';
import { CrivoCore } from '../components/CrivoCore';
import { TodayFocus } from '../features/daily-plan/components/TodayFocus';
import { SubjectAtmosphere } from '../features/daily-plan/components/SubjectAtmosphere';
import { SecondaryActionList } from '../features/daily-plan/components/SecondaryActionList';
import { FeedbackStatus } from '../features/daily-plan/components/DisagreeControl';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';

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

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  // One shared source of truth for "what is today's plan" — the same hook
  // Plano and Sessão read, so the three views can never disagree about the
  // effective minutes, the first action, or its scheduled slot.
  const { availability, prioritizedActions, allocatedActions: dailyPlan, loading, warnings, isPersisted } = useDailyPlan(todayInSaoPaulo());
  const { mastery } = useUserMastery();

  const availableMinutes = availability?.totalMinutes ?? 0;
  const masteryOrigin = deriveMasteryOrigin(mastery, isPersisted);
  // Demo data counts as "has evidence" — it's a populated sample dataset,
  // not an untouched baseline; only a real account still at the baseline
  // (never diagnosed) counts as 'seed'.
  const hasEvidence = masteryOrigin !== 'seed';

  const primary = dailyPlan[0];
  const secondary = dailyPlan.slice(1);

  // `prioritizedActions` is the complete ranking that the allocator received.
  // Its complement to the allocated IDs is the only waiting queue that can
  // account for fragmented intervals as well as the total-time budget.
  const canWait = useMemo(() => {
    const planned = new Set(dailyPlan.map((action) => action.id));
    return prioritizedActions.filter((action) => !planned.has(action.id));
  }, [prioritizedActions, dailyPlan]);

  const overdueReviews = pendingReviewCount(mastery);
  const upcomingExams = useMemo(() => nextExams(new Date(), 3), []);
  // 'calendar-disconnected' is a normal state (and already covered by the
  // demo-mode notice), not something that went wrong — only real failures
  // are surfaced as a warning line.
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
      // Demo mode: nothing to persist, but the interaction still confirms —
      // it just won't survive a reload.
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

  return (
    <SubjectAtmosphere subject={primary?.subject}>
      <div className="crivo-today-stage">
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

            <details className="crivo-day-context">
              <summary>Contexto que entrou na decisão</summary>
              <div className="crivo-day-context-grid">
                <div>
                  <CalendarClock aria-hidden="true" />
                  <p><strong>{availableMinutes} min</strong><span>disponíveis hoje</span></p>
                </div>
                {upcomingExams.map((exam) => (
                  <div key={exam.id}>
                    <CalendarClock aria-hidden="true" />
                    <p><strong>{exam.label}</strong><span>{daysUntil(exam.date) === 0 ? 'É hoje' : `Faltam ${daysUntil(exam.date)} dias`}</span></p>
                  </div>
                ))}
                {overdueReviews > 0 && (
                  <div>
                    <History aria-hidden="true" />
                    <p>
                      <strong>{overdueReviews} {overdueReviews === 1 ? 'revisão atrasada' : 'revisões atrasadas'}</strong>
                      <span>Já pesam na ordem de hoje</span>
                    </p>
                  </div>
                )}
              </div>
            </details>

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

            <div className="crivo-decision-sequence">
              <SecondaryActionList title="Depois disso" actions={secondary} actionLabels={ACTION_LABELS} onStart={startAction} />
              <SecondaryActionList title="Pode esperar" actions={canWait} actionLabels={ACTION_LABELS} onStart={startAction} quiet />
            </div>
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
      </div>
    </SubjectAtmosphere>
  );
}
