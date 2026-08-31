import React, { useMemo } from 'react';
import { useStudentGoals } from '../hooks/useStudentGoals';
import { buildRoadmap, upcomingMilestones } from '../lib/studyRoadmap';
import { daysUntil } from '../data/examCalendar';
import { Flag, CalendarClock, Clock } from 'lucide-react';

const PHASE_STYLES: Record<string, { badge: string; bar: string }> = {
  consolidacao: {
    badge: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
    bar: 'bg-zinc-400',
  },
  revisao_ativa: {
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    bar: 'bg-amber-500',
  },
  reta_final: {
    badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
    bar: 'bg-rose-500',
  },
};

function formatDatePtBr(iso: string): string {
  const [, m, d] = iso.split('-');
  return `${d}/${m}`;
}

function formatRange(start: string, end: string): string {
  return `${formatDatePtBr(start)}–${formatDatePtBr(end)}`;
}

export default function RetaFinal() {
  const { goals } = useStudentGoals();

  const milestones = useMemo(() => upcomingMilestones(goals), [goals]);
  const horizon = useMemo(() => {
    if (milestones.length === 0) return null;
    return new Date(`${milestones[milestones.length - 1].date}T00:00:00`);
  }, [milestones]);

  const weeks = useMemo(() => {
    const from = new Date();
    const until = horizon ?? new Date(from.getFullYear(), from.getMonth() + 4, from.getDate());
    return buildRoadmap(goals, from, until);
  }, [goals, horizon]);

  const totalNetHours = useMemo(
    () => Math.round(weeks.reduce((sum, w) => sum + w.netStudyMinutes, 0) / 60),
    [weeks]
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2 h-2 rounded-full bg-ember-500 shadow-[0_0_8px_var(--color-ember-500)]" />
          <span className="text-[11px] font-mono tracking-widest uppercase text-ember-600 dark:text-ember-400">Horizonte de Provas · Crivo</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold italic text-text-primary tracking-tight flex items-center gap-3">
          <Flag className="w-7 h-7 text-action-primary" />
          Reta Final
        </h1>
        <p className="text-text-secondary mt-1 max-w-2xl text-base">
          Roteiro semana a semana até seus vestibulares, integrando o conteúdo novo do cursinho com a revisão que precisa entrar aos poucos.
        </p>
      </header>

      {milestones.length > 0 && (
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {milestones.slice(0, 3).map((exam) => (
            <div key={exam.id} className="bg-surface-default border border-border-subtle rounded-2xl p-5 shadow-soft-sm">
              <div className="flex items-center text-xs font-mono text-text-muted mb-1 uppercase tracking-wider">
                <CalendarClock className="w-4 h-4 mr-1.5 text-ember-500" />
                {exam.label}
              </div>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {daysUntil(exam.date) === 0 ? 'É hoje' : `${daysUntil(exam.date)} dias`}
              </p>
              <p className="text-xs text-zinc-400 mt-1">{formatDatePtBr(exam.date)}</p>
            </div>
          ))}
        </section>
      )}

      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center text-sm text-zinc-500">
          <Clock className="w-4 h-4 mr-2" />
          Nas próximas {weeks.length} semanas, você tem cerca de <span className="font-semibold text-zinc-700 dark:text-zinc-300 mx-1">{totalNetHours}h</span> de estudo líquido no total (15h–20:30/21h, já com pausas e o horário do cursinho descontados).
        </div>
      </section>

      <section className="space-y-3">
        {weeks.map((week) => {
          const style = PHASE_STYLES[week.phase.id];
          const hours = Math.round((week.netStudyMinutes / 60) * 10) / 10;
          return (
            <div
              key={week.weekStart}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex items-center gap-4"
            >
              <div className={`w-1.5 self-stretch rounded-full ${style.bar} shrink-0`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center flex-wrap gap-2 mb-1">
                  <span className="text-sm font-semibold">{formatRange(week.weekStart, week.weekEnd)}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${style.badge}`}>{week.phase.label}</span>
                  {week.milestones.map((m) => (
                    <span
                      key={m.id}
                      className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                    >
                      {m.board} — {m.label.split('—')[1]?.trim() ?? m.label}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-zinc-500">
                  ≈{hours}h líquidas essa semana · {Math.round(week.phase.reviewRatio * 100)}% revisão / {Math.round((1 - week.phase.reviewRatio) * 100)}% conteúdo novo
                </p>
              </div>
            </div>
          );
        })}

        {weeks.length === 0 && (
          <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-500">
              Nenhuma banca ativa com peso maior que zero em "Perfil" — marque a Fuvest e as demais que você prioriza para ver o roteiro.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
