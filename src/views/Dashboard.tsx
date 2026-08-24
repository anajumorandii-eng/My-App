import React, { useMemo, useState } from 'react';
import { useUserMastery } from '../hooks/useUserMastery';
import { useUserProfile } from '../hooks/useUserProfile';
import { useDailyPlan } from '../hooks/useDailyPlan';
import { formatIsoTimeInSaoPaulo, todayInSaoPaulo } from '../features/availability/time';
import { useAuth } from '../context/AuthContext';
import { pendingReviewCount } from '../lib/reviewUrgency';
import { nextExams, daysUntil } from '../data/examCalendar';
import { addPlanFeedback } from '../lib/userData';
import { AllocatedStudyAction, RecommendationReason, DisagreeReason, PlanFeedback } from '../types';
import { PlayCircle, Target, Brain, AlertCircle, CloudOff, CalendarClock, ChevronDown, ChevronUp, ThumbsDown, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

const DISAGREE_OPTIONS: { value: DisagreeReason; label: string }[] = [
  { value: 'ja_estudei', label: 'Já estudei isso' },
  { value: 'sem_material', label: 'Não tenho esse material' },
  { value: 'nao_consigo_agora', label: 'Não consigo fazer agora' },
  { value: 'prioridade_errada', label: 'Prioridade errada' },
  { value: 'quero_outra_atividade', label: 'Quero escolher outra atividade' },
];

function ActionCard({
  action,
  index,
  actionLabel,
  onStart,
  userId,
}: {
  action: AllocatedStudyAction;
  index: number;
  actionLabel: string;
  onStart: () => void;
  userId: string | undefined;
}) {
  const [showReasons, setShowReasons] = useState(false);
  const [showDisagree, setShowDisagree] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);

  const sendDisagreement = (reason: DisagreeReason) => {
    const feedback: PlanFeedback = {
      id: `feedback_${action.id}_${Date.now()}`,
      actionId: action.id,
      topicId: action.topicId,
      reason,
      date: new Date().toISOString(),
    };
    if (userId) {
      addPlanFeedback(userId, feedback).catch((error) => console.error('Failed to save plan feedback:', error));
    }
    setShowDisagree(false);
    setFeedbackSent(true);
  };

  return (
    <div className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mr-4 text-zinc-500 font-medium shrink-0">
            {index + 1}
          </div>
          <div>
            <h4 className="font-semibold text-lg">{action.topicName}</h4>
            <div className="flex items-center text-sm text-zinc-500 mt-1 flex-wrap gap-x-3 gap-y-1">
              <span className="capitalize">{actionLabel}</span>
              <span>•</span>
              <span>{action.subject}</span>
              <span>•</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-medium">{action.estimatedMinutes} min</span>
              <span>•</span>
              <span>{formatIsoTimeInSaoPaulo(action.intervalStart)}–{formatIsoTimeInSaoPaulo(action.intervalEnd)}</span>
            </div>
          </div>
        </div>
        <button onClick={onStart} className="hidden sm:flex items-center px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg font-medium opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <PlayCircle className="w-4 h-4 mr-2" />
          Iniciar
        </button>
      </div>

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
        <button
          onClick={() => setShowReasons((v) => !v)}
          className="flex items-center text-xs font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          Por que isso?
          {showReasons ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
        </button>
        {!feedbackSent ? (
          <button
            onClick={() => setShowDisagree((v) => !v)}
            className="flex items-center text-xs font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            <ThumbsDown className="w-3.5 h-3.5 mr-1" />
            Discordo
          </button>
        ) : (
          <span className="flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <Check className="w-3.5 h-3.5 mr-1" />
            Registrado — o plano não muda sozinho por causa disso
          </span>
        )}
      </div>

      {showReasons && (
        <ul className="mt-3 space-y-1.5 text-xs text-zinc-500 pl-1">
          {action.reasons.map((reason) => (
            <li key={reason} className="flex items-start">
              <span className="w-1 h-1 rounded-full bg-zinc-400 mt-1.5 mr-2 shrink-0" />
              {REASON_LABELS[reason]}
            </li>
          ))}
        </ul>
      )}

      {showDisagree && (
        <div className="mt-3 flex flex-wrap gap-2">
          {DISAGREE_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => sendDisagreement(value)}
              className="px-3 py-1.5 rounded-full text-xs font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mastery, isPersisted } = useUserMastery();
  const { profile } = useUserProfile();
  const { availability, allocatedActions: dailyPlan } = useDailyPlan(todayInSaoPaulo());
  const availableMinutes = availability?.totalMinutes ?? 0;
  const primary = dailyPlan[0];
  const primaryMastery = mastery.find((item) => item.topicId === primary?.topicId);
  const overdueReviews = pendingReviewCount(mastery);
  const upcomingExams = useMemo(() => nextExams(new Date(), 3), []);
  const actionLabels = { review: 'Revisar para consolidar', practice: 'Praticar sem apoio', theory: 'Reconstruir a base', error_analysis: 'Analisar erros recorrentes' };

  const startAction = (topicId?: string) => navigate(topicId ? `/sessao?topic=${encodeURIComponent(topicId)}` : '/sessao');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <header>
        <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-1">ANA JÚLIA · MEDICINA</p>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Hoje</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Seu foco para hoje, ordenado por prioridade de impacto.
        </p>
        {!isPersisted && (
          <p className="flex items-center text-xs text-zinc-400 mt-2">
            <CloudOff className="w-3.5 h-3.5 mr-1.5" />
            Modo demonstração — conecte sua conta Google em "Conexões Google" para salvar seu progresso de verdade.
          </p>
        )}
      </header>

      {upcomingExams.length > 0 && (
        <section className="flex flex-wrap gap-3">
          {upcomingExams.map((exam) => (
            <div key={exam.id} className="flex items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 shadow-sm">
              <CalendarClock className="w-4 h-4 mr-2.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <div>
                <p className="text-sm font-medium leading-tight">{exam.label}</p>
                <p className="text-xs text-zinc-500 leading-tight mt-0.5">
                  {daysUntil(exam.date) === 0 ? 'É hoje' : `Faltam ${daysUntil(exam.date)} dias`}
                </p>
              </div>
            </div>
          ))}
        </section>
      )}

      {primary && (
        <section className="relative overflow-hidden rounded-3xl bg-indigo-600 text-white p-6 sm:p-8 shadow-lg">
          <div className="relative z-10 max-w-2xl">
            <p className="text-indigo-100 text-sm font-medium uppercase tracking-wider">Sua missão principal</p>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2">{primary.topicName}</h2>
            <p className="text-indigo-100 mt-3 text-lg">{actionLabels[primary.type]} em {primary.subject}. Esta ação lidera o plano por combinar lacuna, tempo sem revisão e sinais de erro.</p>
            <div className="flex flex-wrap gap-3 mt-6 text-sm"><span className="bg-white/15 px-3 py-1.5 rounded-full">{primary.estimatedMinutes} minutos</span><span className="bg-white/15 px-3 py-1.5 rounded-full">Domínio atual: {primaryMastery?.level ?? 0}%</span><span className="bg-white/15 px-3 py-1.5 rounded-full">{overdueReviews} revisões atrasadas</span></div>
            <button onClick={() => startAction(primary.topicId)} className="mt-7 inline-flex items-center bg-white text-indigo-700 px-5 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-colors"><PlayCircle className="w-5 h-5 mr-2"/>Começar agora</button>
          </div>
          <Brain className="absolute -right-10 -bottom-14 w-64 h-64 text-white/10" />
        </section>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center text-indigo-600 dark:text-indigo-400 mb-4">
            <Target className="w-5 h-5 mr-2" />
            <h3 className="font-medium">Tempo de Estudo</h3>
          </div>
          <p className="text-3xl font-bold"><span>{availableMinutes} min</span></p>
          <p className="text-sm text-zinc-500 mt-1">
            Calculado pela agenda semanal e pelas exceções do dia
          </p>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center text-emerald-600 dark:text-emerald-400 mb-4">
            <Brain className="w-5 h-5 mr-2" />
            <h3 className="font-medium">Autonomia</h3>
          </div>
          <p className="text-3xl font-bold">{profile.autonomyIndex}<span className="text-lg font-normal text-zinc-500 ml-1">/100</span></p>
          <p className="text-sm text-zinc-500 mt-1">Crescimento lento e sustentável.</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center text-rose-600 dark:text-rose-400 mb-4">
            <AlertCircle className="w-5 h-5 mr-2" />
            <h3 className="font-medium">Prioridade Máxima</h3>
          </div>
          <p className="text-xl font-bold truncate">{dailyPlan.length > 0 ? dailyPlan[0].topicName : 'Tudo em dia'}</p>
          <p className="text-sm text-zinc-500 mt-1">Revisão e Prática</p>
        </div>
      </div>

      <section className="rounded-2xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/60 dark:bg-indigo-950/20 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-wide text-indigo-600">Prioridade Fuvest</p><h2 className="text-lg font-bold mt-1">Retome seus resumos estratégicos</h2><p className="text-sm text-zinc-500 mt-1">Revisão rápida, aprofundamento e recuperação ativa com progresso salvo.</p></div>
        <button onClick={() => navigate("/resumos")} className="shrink-0 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-white font-semibold">Abrir resumos</button>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Ações Recomendadas</h2>
        <div className="space-y-4">
          {dailyPlan.map((action, index) => (
            <ActionCard
              key={action.id}
              action={action}
              index={index}
              actionLabel={actionLabels[action.type]}
              onStart={() => startAction(action.topicId)}
              userId={user?.uid}
            />
          ))}

          {dailyPlan.length === 0 && (
            <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
              <p className="text-zinc-500">Sem metas para hoje. Descanse.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
