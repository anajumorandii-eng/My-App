import React, { useMemo } from 'react';
import { AlertTriangle, CalendarClock, Clock, CloudOff, Flag, Map } from 'lucide-react';
import { formatIsoTimeInSaoPaulo, todayInSaoPaulo } from '../features/availability/time';
import { useDailyPlan } from '../hooks/useDailyPlan';
import { useStudentGoals } from '../hooks/useStudentGoals';
import { currentStudyPhase } from '../lib/studyPhase';
import { upcomingMilestones } from '../lib/studyRoadmap';
import { daysUntil } from '../data/examCalendar';
import { Panel } from '../components/ui/Panel';
import { PALETTES, PALETTE_INK } from '../prototypes/NucleoInstrumentalPrototype';
import { SUBJECT_ICONS } from './Dashboard';

function formatDatePtBr(iso: string): string {
  const [, month, day] = iso.split('-');
  return `${day}/${month}`;
}

const PLANO_PALETTE = PALETTES.Matemática;

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

  return (
    <div
      className="ni-main"
      style={{
        '--primary': PLANO_PALETTE.primary,
        '--secondary': PLANO_PALETTE.secondary,
        '--wash': PLANO_PALETTE.wash,
      } as React.CSSProperties}
    >
      {/* Route Breadcrumb */}
      <div className="ni-route">
        <span>DECISÃO</span>
        <i />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[var(--primary)] text-[var(--ink-on-primary)]">
            <Map className="w-3 h-3" />
          </span>
          PLANEJAMENTO
        </span>
        <i />
        <b>PLANO DE ESTUDO</b>
      </div>

      {/* Main Title */}
      <div className="ni-title">
        <div>
          <h1>Sua trajetória, semana a semana.</h1>
          <p>Roteiro dinâmico calibrado pelo seu domínio atual e pelas janelas de disponibilidade de hoje.</p>
        </div>
        <div className="ni-state">
          <i /> Fase {phase.label} · Crivo Scheduler
        </div>
      </div>

      {!isPersisted && (
        <p className="flex items-start text-xs text-[var(--dim)] mb-2">
          <CloudOff className="w-3.5 h-3.5 mr-1.5 mt-0.5 shrink-0" />
          Modo demonstração — conecte sua conta Google em "Perfil" para salvar seu progresso.
        </p>
      )}

      {/* Phase banner */}
      <Panel subject="Matemática" className="ni-panel p-5 mb-4">
        <div className="flex items-center min-w-0">
          <Flag className="w-5 h-5 mr-3 text-[var(--primary)] shrink-0" />
          <div className="min-w-0">
            <p className="font-display font-medium text-sm text-[var(--text)]">
              Fase atual: <b>{phase.label}</b>
              {nextMilestone && (
                <span className="font-normal text-[var(--dim)] ml-2">
                  — {nextMilestone.board} em {daysUntil(nextMilestone.date)} dias ({formatDatePtBr(nextMilestone.date)})
                </span>
              )}
            </p>
            <p className="text-xs text-[var(--dim)] mt-0.5">{phase.description}</p>
          </div>
        </div>
      </Panel>

      {/* Availability panel */}
      <Panel subject="Matemática" className="ni-panel p-5 mb-4 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium flex items-center text-[var(--dim)]">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-[var(--dim)]" />
              Disponibilidade efetiva hoje
            </p>
            <p className="text-[11px] text-[var(--dim)] mt-0.5">Calculado pela sua agenda semanal</p>
          </div>
          <span className="text-2xl font-bold font-mono text-[var(--primary)]">
            {effectiveMinutes} min
          </span>
        </div>

        {warnings.length > 0 && (
          <div className="space-y-2" aria-label="Avisos de disponibilidade">
            {warnings.map((warning, index) => (
              <p
                key={`${warning.code}-${index}`}
                className="flex items-start text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2"
              >
                <AlertTriangle className="w-3.5 h-3.5 mr-1.5 mt-0.5 shrink-0 text-amber-400" />
                {warning.message}
              </p>
            ))}
          </div>
        )}

        <div>
          <h2 className="text-xs font-display font-semibold flex items-center mb-2 text-[var(--text)]">
            <CalendarClock className="w-3.5 h-3.5 mr-1.5 text-[var(--primary)]" />
            Janelas de estudo
          </h2>
          <div className="flex flex-wrap gap-2">
            {availability?.intervals.map((interval) => (
              <span
                key={`${interval.start}-${interval.end}`}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-[var(--surface2)] text-[var(--text)] font-mono border border-[var(--line)]"
              >
                {formatIsoTimeInSaoPaulo(interval.start)}–{formatIsoTimeInSaoPaulo(interval.end)} · {interval.durationMinutes} min
              </span>
            ))}
            {!loading && availability?.intervals.length === 0 && (
              <p className="text-xs text-[var(--dim)]">Nenhuma janela completa disponível nesta data.</p>
            )}
            {loading && <p className="text-xs text-[var(--dim)]">Calculando sua disponibilidade...</p>}
          </div>
        </div>
      </Panel>

      {/* Today's allocated plan */}
      <section className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-medium text-base text-[var(--text)]">Plano de Hoje</h2>
          <span className="text-xs font-mono text-[var(--dim)]">
            {totalPlannedMinutes} de {effectiveMinutes} min ocupados
          </span>
        </div>

        <div className="space-y-3">
          {allocatedActions.map((action, index) => {
            const subPalette = PALETTES[action.subject] ?? PALETTES.Matemática;
            const SubIcon = SUBJECT_ICONS[action.subject] ?? Map;

            return (
              <Panel
                key={action.id}
                subject={action.subject}
                interactive
                className="ni-panel p-5 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center min-w-0">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center mr-3 shrink-0 text-xs font-mono font-bold"
                    style={{ backgroundColor: subPalette.primary, color: PALETTE_INK }}
                  >
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-display font-medium text-sm text-[var(--text)] truncate">{action.topicName}</h4>
                    <div className="flex items-center text-[11px] text-[var(--dim)] mt-0.5 space-x-2 font-mono">
                      <span className="capitalize">{action.type.replace('_', ' ')}</span>
                      <span>•</span>
                      <span>{action.subject}</span>
                      <span>•</span>
                      <span>{formatIsoTimeInSaoPaulo(action.intervalStart)}–{formatIsoTimeInSaoPaulo(action.intervalEnd)}</span>
                    </div>
                  </div>
                </div>
                <span
                  className="shrink-0 ml-4 text-xs font-mono font-semibold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: subPalette.primary, color: PALETTE_INK }}
                >
                  {action.allocatedMinutes} min
                </span>
              </Panel>
            );
          })}

          {!loading && allocatedActions.length === 0 && (
            <div className="text-center py-12 border border-dashed border-[var(--line)] rounded-xl text-xs text-[var(--dim)]">
              Nenhuma ação foi alocada nas janelas disponíveis hoje.
            </div>
          )}
        </div>
      </section>

      {/* Unallocated waitlist queue */}
      {unallocatedActions.length > 0 && (
        <section>
          <h2 className="font-display font-medium text-base text-[var(--text)] mb-3">Fila de Espera</h2>
          <Panel subject="Matemática" className="ni-panel divide-y divide-[var(--line)] overflow-hidden">
            {unallocatedActions.map((action) => {
              const pal = PALETTES[action.subject] ?? PALETTES.Matemática;
              const SubIcon = SUBJECT_ICONS[action.subject] ?? Map;
              return (
                <div key={action.id} className="p-4 flex items-center justify-between hover:bg-[var(--surface2)] transition-colors">
                  <div className="flex items-center min-w-0">
                    <span
                      className="w-5 h-5 rounded-full mr-3 shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: pal.primary, color: PALETTE_INK }}
                    >
                      <SubIcon className="w-3 h-3" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-xs text-[var(--text)] truncate">{action.topicName}</p>
                      <p className="text-[11px] text-[var(--dim)]">{action.subject} · {action.type.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-[var(--dim)] shrink-0 ml-4">{action.estimatedMinutes} min estimados</span>
                </div>
              );
            })}
          </Panel>
        </section>
      )}
    </div>
  );
}
