import React, { useMemo } from 'react';
import { useStudentGoals } from '../hooks/useStudentGoals';
import { buildRoadmap, upcomingMilestones } from '../lib/studyRoadmap';
import { daysUntil } from '../data/examCalendar';
import { Flag, CalendarClock, Clock } from 'lucide-react';
import { Panel } from '../components/ui/Panel';
import { PALETTES, PALETTE_INK } from '../prototypes/NucleoInstrumentalPrototype';
import { SUBJECT_ICONS } from './Dashboard';

const RETAFINAL_PALETTE = PALETTES.História;

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
    <div
      className="ni-main"
      style={{
        '--primary': RETAFINAL_PALETTE.primary,
        '--secondary': RETAFINAL_PALETTE.secondary,
        '--wash': RETAFINAL_PALETTE.wash,
      } as React.CSSProperties}
    >
      {/* Route Breadcrumb */}
      <div className="ni-route">
        <span>DECISÃO</span>
        <i />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[var(--primary)] text-[var(--ink-on-primary)]">
            <Flag className="w-3 h-3" />
          </span>
          HORIZONTE
        </span>
        <i />
        <b>RETA FINAL</b>
      </div>

      {/* Main Title */}
      <div className="ni-title">
        <div>
          <h1>Os últimos dias decidem.</h1>
          <p>Roteiro semana a semana até seus vestibulares — integrando novos tópicos e revisão estratégica.</p>
        </div>
        <div className="ni-state">
          <i /> {totalNetHours}h líquidas estimadas · Crivo Roteiro
        </div>
      </div>

      {/* Milestone countdown cards */}
      {milestones.length > 0 && (
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {milestones.slice(0, 3).map((exam) => (
            <Panel
              key={exam.id}
              subject="História"
              interactive
              className="ni-panel p-5 transition-colors"
            >
              <div className="flex items-center text-[10px] font-mono text-[var(--dim)] mb-1 uppercase tracking-wider">
                <CalendarClock className="w-3.5 h-3.5 mr-1.5 text-[var(--primary)]" />
                {exam.label}
              </div>
              <p className="text-2xl font-bold font-mono text-[var(--primary)]">
                {daysUntil(exam.date) === 0 ? 'É hoje' : `${daysUntil(exam.date)} dias`}
              </p>
              <p className="text-[11px] font-mono text-[var(--dim)] mt-1">{formatDatePtBr(exam.date)}</p>
            </Panel>
          ))}
        </section>
      )}

      {/* Summary net hours banner */}
      <Panel subject="História" className="ni-panel p-5 mb-4">
        <div className="flex items-center text-xs text-[var(--dim)]">
          <Clock className="w-4 h-4 mr-2 text-[var(--primary)] shrink-0" />
          <span>
            Nas próximas {weeks.length} semanas, você tem cerca de <b className="text-[var(--text)] font-mono">{totalNetHours}h</b> de estudo líquido no total (descontados cursinho e pausas obrigatórias).
          </span>
        </div>
      </Panel>

      {/* Weekly roadmap */}
      <div className="space-y-3">
        {weeks.map((week) => {
          const hours = Math.round((week.netStudyMinutes / 60) * 10) / 10;
          return (
            <Panel
              key={week.weekStart}
              subject="História"
              className="ni-panel p-4 flex items-center gap-3"
            >
              <div className="w-1.5 self-stretch rounded-full bg-[var(--primary)] shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center flex-wrap gap-2 mb-1">
                  <span className="text-xs font-semibold text-[var(--text)] font-mono">{formatRange(week.weekStart, week.weekEnd)}</span>
                  <span
                    className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: RETAFINAL_PALETTE.primary, color: PALETTE_INK }}
                  >
                    {week.phase.label}
                  </span>
                  {week.milestones.map((m) => (
                    <span
                      key={m.id}
                      className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-[var(--surface2)] text-[var(--dim)] border border-[var(--line)]"
                    >
                      {m.board} — {m.label.split('—')[1]?.trim() ?? m.label}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-[var(--dim)] font-mono">
                  ≈{hours}h líquidas · {Math.round(week.phase.reviewRatio * 100)}% revisão / {Math.round((1 - week.phase.reviewRatio) * 100)}% conteúdo novo
                </p>
              </div>
            </Panel>
          );
        })}

        {weeks.length === 0 && (
          <div className="text-center py-12 border border-dashed border-[var(--line)] rounded-xl text-xs text-[var(--dim)]">
            Nenhuma banca ativa em "Perfil" — selecione a Fuvest e suas demais prioridades para ver o roteiro.
          </div>
        )}
      </div>
    </div>
  );
}
