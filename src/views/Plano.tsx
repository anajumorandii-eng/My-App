import React, { useMemo } from 'react';
import { AlertTriangle, CalendarClock, Clock, CloudOff, Flag, Map } from 'lucide-react';
import { formatIsoTimeInSaoPaulo, todayInSaoPaulo } from '../features/availability/time';
import { useDailyPlan } from '../hooks/useDailyPlan';
import { useStudentGoals } from '../hooks/useStudentGoals';
import { currentStudyPhase } from '../lib/studyPhase';
import { upcomingMilestones } from '../lib/studyRoadmap';
import { daysUntil } from '../data/examCalendar';
import { getSubjectProfile } from '../design-system/crivoSubjects';
import { getMotionConfigForSubject } from '../design-system/crivoMotionPresets';
import { SubjectAtmosphere } from '../features/daily-plan/components/SubjectAtmosphere';
import { motion } from 'motion/react';

function formatDatePtBr(iso: string): string {
  const [, month, day] = iso.split('-');
  return `${day}/${month}`;
}

const SUBJECT_COLORS: Record<string, string> = {
  Biologia: 'bg-emerald-500',
  Matemática: 'bg-indigo-500',
  Física: 'bg-amber-500',
  Química: 'bg-rose-500',
  Geografia: 'bg-teal-500',
  História: 'bg-orange-500',
  Português: 'bg-violet-500',
  Inglês: 'bg-sky-500',
};

export default function Plano() {
  const { goals } = useStudentGoals();
  const phase = useMemo(() => currentStudyPhase(goals), [goals]);
  const nextMilestone = useMemo(() => upcomingMilestones(goals)[0], [goals]);
  const {
    availability,
    prioritizedActions,
    allocatedActions,
    loading,
    warnings,
    isPersisted,
  } = useDailyPlan(todayInSaoPaulo());

  const allocatedIds = new Set(allocatedActions.map(({ id }) => id));
  const unallocatedActions = prioritizedActions.filter(({ id }) => !allocatedIds.has(id));
  const effectiveMinutes = availability?.totalMinutes ?? 0;
  const totalPlannedMinutes = allocatedActions.reduce((total, action) => total + action.allocatedMinutes, 0);

  const firstSubject = allocatedActions[0]?.subject ?? prioritizedActions[0]?.subject;

  return (
    <SubjectAtmosphere subject={firstSubject}>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-ember-500 shadow-[0_0_8px_var(--color-ember-500)]" />
            <span className="text-[11px] font-mono tracking-widest uppercase text-ember-600 dark:text-ember-400">Motor de Planejamento · Crivo</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold italic text-text-primary tracking-tight flex items-center gap-3">
            <Map className="w-7 h-7 text-action-primary" />
            Plano de Estudo
          </h1>
          <p className="text-text-secondary mt-1 max-w-2xl text-base">
            Veja como suas prioridades cabem nas janelas efetivas de estudo de hoje calculadas pelo Crivo.
          </p>
          {!isPersisted && (
            <p className="flex items-center text-xs text-text-muted mt-2">
              <CloudOff className="w-3.5 h-3.5 mr-1.5" />
              Modo demonstração — conecte sua conta Google em &quot;Conexões Google&quot; para salvar seu progresso de verdade.
            </p>
          )}
        </header>

      <section className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center min-w-0">
          <Flag className="w-5 h-5 mr-3 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold text-indigo-900 dark:text-indigo-200">
              Fase atual: {phase.label}
              {nextMilestone && (
                <span className="font-normal text-indigo-700 dark:text-indigo-300">
                  {' '}— {nextMilestone.board} em {daysUntil(nextMilestone.date)} dias ({formatDatePtBr(nextMilestone.date)})
                </span>
              )}
            </p>
            <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">{phase.description}</p>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium flex items-center text-zinc-700 dark:text-zinc-300">
              <Clock className="w-4 h-4 mr-2 text-zinc-400" />
              Disponibilidade efetiva hoje
            </p>
            <p className="text-xs text-zinc-500 mt-1">Calculado pela sua agenda semanal</p>
          </div>
          <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {effectiveMinutes} min
          </span>
        </div>

        {warnings.length > 0 && (
          <div className="space-y-2" aria-label="Avisos de disponibilidade">
            {warnings.map((warning, index) => (
              <p
                key={`${warning.code}-${index}`}
                className="flex items-start text-sm text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 rounded-lg px-3 py-2"
              >
                <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                {warning.message}
              </p>
            ))}
          </div>
        )}

        <div>
          <h2 className="text-sm font-semibold flex items-center mb-3">
            <CalendarClock className="w-4 h-4 mr-2 text-indigo-500" />
            Janelas de estudo
          </h2>
          <div className="flex flex-wrap gap-2">
            {availability?.intervals.map((interval) => (
              <span
                key={`${interval.start}-${interval.end}`}
                className="text-sm px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
              >
                {formatIsoTimeInSaoPaulo(interval.start)}–{formatIsoTimeInSaoPaulo(interval.end)} · {interval.durationMinutes} min
              </span>
            ))}
            {!loading && availability?.intervals.length === 0 && (
              <p className="text-sm text-zinc-500">Nenhuma janela completa disponível nesta data.</p>
            )}
            {loading && <p className="text-sm text-zinc-500">Calculando sua disponibilidade...</p>}
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Plano de Hoje</h2>
          <span className="text-sm text-zinc-500">
            {totalPlannedMinutes} de {effectiveMinutes} min ocupados
          </span>
        </div>

        <div className="space-y-3">
          {allocatedActions.map((action, index) => {
            const mConfig = getMotionConfigForSubject(action.subject);
            return (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                whileHover={mConfig.hoverProps.whileHover}
                whileTap={mConfig.hoverProps.whileTap}
                data-geometry={getSubjectProfile(action.subject).fieldType}
                className="bg-surface-default border border-border-subtle rounded-xl p-5 shadow-soft-sm flex items-center justify-between transition-colors"
              >
                <div className="flex items-center min-w-0">
                  <div className="w-9 h-9 rounded-full bg-surface-secondary flex items-center justify-center mr-4 shrink-0 text-text-muted font-mono font-medium text-sm">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold truncate text-text-primary">{action.topicName}</h4>
                    <div className="flex items-center text-xs text-text-muted mt-1 space-x-3 font-mono">
                      <span className="capitalize">{action.type.replace('_', ' ')}</span>
                      <span>•</span>
                      <span>{action.subject}</span>
                      <span>•</span>
                      <span>{formatIsoTimeInSaoPaulo(action.intervalStart)}–{formatIsoTimeInSaoPaulo(action.intervalEnd)}</span>
                    </div>
                  </div>
                </div>
                <span className="shrink-0 ml-4 text-sm font-mono font-medium text-ember-600 dark:text-ember-400">
                  {action.allocatedMinutes} min
                </span>
              </motion.div>
            );
          })}

          {!loading && allocatedActions.length === 0 && (
            <div className="text-center py-12 bg-surface-secondary/40 rounded-xl border border-dashed border-border-subtle">
              <p className="text-text-muted">Nenhuma ação foi alocada nas janelas disponíveis hoje.</p>
            </div>
          )}
        </div>
      </section>

      {unallocatedActions.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Fila de Espera</h2>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl divide-y divide-zinc-100 dark:divide-zinc-800 overflow-hidden">
            {unallocatedActions.map((action) => (
              <div key={action.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center min-w-0">
                  <span className={`w-2 h-2 rounded-full mr-3 shrink-0 ${SUBJECT_COLORS[action.subject] ?? 'bg-zinc-400'}`} />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{action.topicName}</p>
                    <p className="text-xs text-zinc-500">{action.subject} · {action.type.replace('_', ' ')}</p>
                  </div>
                </div>
                <span className="text-xs text-zinc-500 shrink-0 ml-4">{action.estimatedMinutes} min estimados</span>
              </div>
            ))}
          </div>
        </section>
      )}
      </div>
    </SubjectAtmosphere>
  );
}
