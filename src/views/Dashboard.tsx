import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CloudOff, WifiOff, CalendarClock, Stethoscope, CheckCircle2 } from 'lucide-react';
import { EfficiencyEngine } from '../lib/efficiencyEngine';
import { mockTopics } from '../data/mockData';
import { useUserMastery } from '../hooks/useUserMastery';
import { useUserProfile } from '../hooks/useUserProfile';
import { useStudentGoals } from '../hooks/useStudentGoals';
import { useAvailableMinutes } from '../hooks/useAvailableMinutes';
import { useAuth } from '../context/AuthContext';
import { useAdaptiveRankingChange } from '../hooks/useAdaptiveRankingChange';
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
  const { mastery, isPersisted, loading: masteryLoading } = useUserMastery();
  const { profile, loading: profileLoading } = useUserProfile();
  const { goals } = useStudentGoals();
  const { minutes: availableMinutes, usingAuto, error: calendarError } = useAvailableMinutes();

  const masteryOrigin = deriveMasteryOrigin(mastery, isPersisted);
  // Demo data counts as "has evidence" — it's a populated sample dataset,
  // not an untouched baseline; only a real account still at the baseline
  // (never diagnosed) counts as 'seed'.
  const hasEvidence = masteryOrigin !== 'seed';

  const dailyPlan = useMemo(
    () => (hasEvidence ? EfficiencyEngine.generateDailyPlan(mastery, mockTopics, profile, availableMinutes, goals) : []),
    [mastery, profile, availableMinutes, goals, hasEvidence]
  );
  const deferredActions = useMemo(
    () => (hasEvidence ? EfficiencyEngine.generateDeferredActions(mastery, mockTopics, profile, availableMinutes, goals) : []),
    [mastery, profile, availableMinutes, goals, hasEvidence]
  );

  const primary = dailyPlan[0];
  const secondary = dailyPlan.slice(1, 4);
  const canWait = deferredActions.slice(0, 3);
  const overdueReviews = pendingReviewCount(mastery);
  const nearestExam = useMemo(() => nextExams(new Date(), 1)[0], []);
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

  if (masteryLoading || profileLoading) {
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
      <div className="space-y-6">
        <header>
          <h1 className="font-display text-3xl font-semibold text-text-primary">Hoje</h1>
          {!isPersisted && (
            <p className="flex items-center text-xs text-text-muted mt-2">
              <CloudOff className="w-3.5 h-3.5 mr-1.5 shrink-0" aria-hidden="true" />
              Modo demonstração — conecte sua conta Google em "Conexões Google" para salvar seu progresso de verdade.
            </p>
          )}
          {calendarError && (
            <p className="flex items-center text-xs text-status-warning mt-2">
              <WifiOff className="w-3.5 h-3.5 mr-1.5 shrink-0" aria-hidden="true" />
              Não foi possível carregar sua agenda do Google agora — usando sua estimativa manual de tempo.
            </p>
          )}
        </header>

        {/* Contexto do dia — só o que muda a decisão de hoje. */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-2.5 py-1.5 rounded-full bg-surface-secondary text-text-secondary">
            {availableMinutes} min disponíveis hoje{usingAuto ? ' (da sua agenda)' : ''}
          </span>
          {overdueReviews > 0 && (
            <span className="px-2.5 py-1.5 rounded-full bg-surface-secondary text-text-secondary">
              {overdueReviews} {overdueReviews === 1 ? 'revisão atrasada' : 'revisões atrasadas'}
            </span>
          )}
          {nearestExam && (
            <span className="px-2.5 py-1.5 rounded-full bg-surface-secondary text-text-secondary">
              {nearestExam.label} {daysUntil(nearestExam.date) === 0 ? 'é hoje' : `em ${daysUntil(nearestExam.date)} dias`}
            </span>
          )}
        </div>

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
            description={
              usingAuto
                ? 'Sua agenda do Google está ocupada durante toda a janela de estudo de hoje.'
                : 'Seu tempo disponível manual para hoje está em zero.'
            }
            action={
              <Button variant="secondary" onClick={() => navigate('/plano')}>
                Ajustar em Plano de Estudo
              </Button>
            }
          />
        ) : !primary ? (
          <EmptyState
            icon={CheckCircle2}
            title="Não precisa fazer nada extra hoje"
            description="Com base no seu histórico, você já tem evidências suficientes de domínio nos tópicos ativos e nenhuma revisão urgente pendente."
          />
        ) : (
          <div className="space-y-6">
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
            <SecondaryActionList title="Depois disso" actions={secondary} actionLabels={ACTION_LABELS} onStart={startAction} />
            <SecondaryActionList title="Pode esperar" actions={canWait} actionLabels={ACTION_LABELS} onStart={startAction} quiet />
          </div>
        )}
      </div>
    </SubjectAtmosphere>
  );
}
