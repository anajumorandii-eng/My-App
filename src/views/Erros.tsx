import React, { useEffect, useMemo, useState } from 'react';
import { mockErrorLogs, mockTopics } from '../data/mockData';
import { ErrorLog } from '../types';
import { useAuth } from '../context/AuthContext';
import { getUserErrorLogs, addUserErrorLog } from '../lib/userData';
import { requestAiTextStream } from '../lib/aiClient';
import { ERROR_TYPE_LABELS as TYPE_LABELS, INTERVENTION_LABELS, CONFIDENCE_LABELS } from '../lib/errorLabels';
import { AiText } from '../components/AiText';
import { BookX, Plus, Sparkles, CloudOff, Stethoscope } from 'lucide-react';
import { useSummaryProgress } from '../hooks/useSummaryProgress';
import { interactiveSummaries } from '../data/interactiveSummaries';
import SummaryErrorsPanel from '../components/SummaryErrorsPanel';
import { Panel } from '../components/ui/Panel';
import { PALETTES, PALETTE_INK } from '../prototypes/NucleoInstrumentalPrototype';
import { SUBJECT_ICONS } from './Dashboard';

const OUTCOME_LABELS: Record<NonNullable<ErrorLog['outcomeRating']>, string> = {
  melhorou: 'Melhorou',
  sem_mudanca: 'Sem mudança',
  ainda_dificil: 'Ainda difícil',
};

const ERROR_PALETTE = PALETTES.História;

export default function Erros() {
  const { user, isConnected } = useAuth();
  const { progress: summaryProgress } = useSummaryProgress();
  const [logs, setLogs] = useState<ErrorLog[]>(mockErrorLogs);
  const [typeFilter, setTypeFilter] = useState<ErrorLog['type'] | 'all'>('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ topicId: mockTopics[0].id, type: 'conceptual' as ErrorLog['type'], notes: '' });
  const [syncError, setSyncError] = useState<string | null>(null);
  const [generatingHypothesisFor, setGeneratingHypothesisFor] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLogs(mockErrorLogs);
      setSyncError(null);
      return;
    }
    let cancelled = false;
    getUserErrorLogs(user.uid)
      .then((data) => {
        if (!cancelled) setLogs(data);
      })
      .catch((error) => {
        console.error('Failed to load error logs:', error);
        if (!cancelled) setSyncError('Não foi possível carregar seus erros salvos. Mostrando dados de demonstração.');
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const filtered = useMemo(
    () => (typeFilter === 'all' ? logs : logs.filter((l) => l.type === typeFilter)),
    [logs, typeFilter]
  );

  const countsByType = useMemo(() => {
    const counts: Partial<Record<ErrorLog['type'], number>> = {};
    logs.forEach((l) => {
      counts[l.type] = (counts[l.type] ?? 0) + 1;
    });
    return counts;
  }, [logs]);

  const addLog = async () => {
    if (!form.notes.trim()) return;
    const topic = mockTopics.find((t) => t.id === form.topicId);
    const newLog: ErrorLog = {
      id: `err_${Date.now()}`,
      topicId: form.topicId,
      questionId: `manual_${Date.now()}`,
      date: new Date().toISOString(),
      type: form.type,
      notes: form.notes.trim(),
    };
    setLogs((prev) => [newLog, ...prev]);
    setForm({ topicId: mockTopics[0].id, type: 'conceptual', notes: '' });
    setShowForm(false);

    if (user) {
      addUserErrorLog(user.uid, newLog).catch((error) => {
        console.error('Failed to save error log:', error);
        setSyncError('Esse erro não foi salvo na nuvem — pode não persistir.');
      });
    }

    setGeneratingHypothesisFor(newLog.id);
    try {
      let acumulado = '';
      const data = await requestAiTextStream('error-hypothesis', {
        topic: topic?.name ?? 'Tópico desconhecido',
        subject: topic?.subject ?? 'Matéria desconhecida',
        errorType: TYPE_LABELS[newLog.type],
        notes: newLog.notes,
      }, (delta) => {
        acumulado += delta;
        setLogs((prev) => prev.map((l) => (l.id === newLog.id ? { ...l, aiHypothesis: acumulado } : l)));
      });
      const withHypothesis: ErrorLog = { ...newLog, aiHypothesis: data.text };
      setLogs((prev) => prev.map((l) => (l.id === newLog.id ? withHypothesis : l)));
      if (user) {
        addUserErrorLog(user.uid, withHypothesis).catch((error) => {
          console.error('Failed to save AI hypothesis:', error);
        });
      }
    } catch (error) {
      console.error('Failed to generate AI hypothesis:', error);
    } finally {
      setGeneratingHypothesisFor(null);
    }
  };

  const updateLog = (updated: ErrorLog) => {
    setLogs((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    if (user) {
      addUserErrorLog(user.uid, updated).catch((error) => {
        console.error('Failed to update error log:', error);
        setSyncError('Essa atualização não foi salva na nuvem — pode não persistir.');
      });
    }
  };

  const setInterventionStatus = (log: ErrorLog, interventionStatus: ErrorLog['interventionStatus']) =>
    updateLog({ ...log, interventionStatus });

  const setOutcomeRating = (log: ErrorLog, outcomeRating: ErrorLog['outcomeRating']) =>
    updateLog({ ...log, outcomeRating });

  return (
    <div
      className="ni-main"
      style={{
        '--primary': ERROR_PALETTE.primary, '--primary-ink': ERROR_PALETTE.readable,
        '--secondary': ERROR_PALETTE.secondary,
        '--wash': ERROR_PALETTE.wash,
      } as React.CSSProperties}
    >
      {/* Route Breadcrumb */}
      <div className="ni-route">
        <span>ANÁLISE</span>
        <i />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[var(--primary)] text-[var(--ink-on-primary)]">
            <BookX className="w-3 h-3" />
          </span>
          DIAGNÓSTICO
        </span>
        <i />
        <b>CADERNO DE ERROS</b>
      </div>

      {/* Main Title */}
      <div className="ni-title">
        <div>
          <h1>Transforme erros em acertos estruturados.</h1>
          <p>Diagnóstico por tipo de erro, causa raiz e intervenção — cada registro vira insumo para o motor de repetição.</p>
        </div>
        <div className="ni-state">
          <i /> {logs.length} erros mapeados · Crivo Cognitivo
        </div>
      </div>

      {!isConnected && (
        <p className="flex items-start text-xs text-[var(--dim)] mb-2">
          <CloudOff className="w-3.5 h-3.5 mr-1.5 mt-0.5 shrink-0" />
          Modo demonstração — conecte sua conta Google para salvar seus erros em nuvem.
        </p>
      )}
      {syncError && <p className="text-xs text-rose-500 mb-2">{syncError}</p>}

      {/* Actions & Filters */}
      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <div className="ni-subjects" style={{ margin: 0 }}>
          <button
            onClick={() => setTypeFilter('all')}
            style={
              typeFilter === 'all'
                ? { backgroundColor: ERROR_PALETTE.primary, color: PALETTE_INK, borderRadius: '4px', padding: '2px 8px' }
                : undefined
            }
          >
            Todos ({logs.length})
          </button>
          {Object.entries(TYPE_LABELS).map(([value, label]) => {
            const count = countsByType[value as ErrorLog['type']];
            if (!count) return null;
            const active = typeFilter === value;
            return (
              <button
                key={value}
                onClick={() => setTypeFilter(value as ErrorLog['type'])}
                style={
                  active
                    ? { backgroundColor: ERROR_PALETTE.primary, color: PALETTE_INK, borderRadius: '4px', padding: '2px 8px' }
                    : undefined
                }
              >
                {label} ({count})
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setShowForm((s) => !s)}
          className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[var(--primary)] text-[var(--ink-on-primary)] hover:opacity-90 transition-opacity"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Registrar erro
        </button>
      </div>

      <SummaryErrorsPanel progress={summaryProgress} summaries={interactiveSummaries} />

      {/* Manual log form */}
      {showForm && (
        <Panel subject="História" className="ni-panel p-6 space-y-4 mb-4">
          <h3 className="font-display font-medium text-base text-[var(--text)]">Novo Registro de Erro</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[var(--dim)] mb-1">Tópico</label>
              <select
                value={form.topicId}
                onChange={(e) => setForm((f) => ({ ...f, topicId: e.target.value }))}
                className="w-full bg-[var(--surface2)] text-[var(--text)] border border-[var(--line)] rounded-lg px-3 py-2 text-xs outline-none focus:border-[var(--primary)]"
              >
                {mockTopics.map((t) => (
                  <option key={t.id} value={t.id} className="text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-900">{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--dim)] mb-1">Tipo de erro</label>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as ErrorLog['type'] }))}
                className="w-full bg-[var(--surface2)] text-[var(--text)] border border-[var(--line)] rounded-lg px-3 py-2 text-xs outline-none focus:border-[var(--primary)]"
              >
                {Object.entries(TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value} className="text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-900">{label}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--dim)] mb-1">O que aconteceu no raciocínio?</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={3}
              placeholder="Descreva o passo específico onde o raciocínio divergiu do gabarito..."
              className="w-full bg-[var(--surface2)] text-[var(--text)] border border-[var(--line)] rounded-lg px-3 py-2 text-xs outline-none focus:border-[var(--primary)]"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={addLog}
              disabled={!form.notes.trim()}
              className="px-4 py-2 bg-[var(--primary)] text-[var(--ink-on-primary)] disabled:opacity-50 rounded-lg text-xs font-semibold transition-opacity"
            >
              Salvar Registro
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-3 py-2 border border-[var(--line)] rounded-lg text-xs text-[var(--dim)] hover:text-[var(--text)]"
            >
              Cancelar
            </button>
          </div>
        </Panel>
      )}

      {/* List of error logs */}
      <div className="space-y-3">
        {filtered.map((log) => {
          const topic = mockTopics.find((t) => t.id === log.topicId);
          const subPalette = PALETTES[topic?.subject ?? 'História'] ?? PALETTES.História;
          const SubjIcon = SUBJECT_ICONS[topic?.subject ?? 'História'] ?? BookX;

          return (
            <Panel
              key={log.id}
              subject={topic?.subject ?? 'História'}
              interactive
              className="ni-panel p-5 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
                    style={{ backgroundColor: subPalette.primary, color: PALETTE_INK }}
                  >
                    <SubjIcon className="w-3 h-3" />
                    {TYPE_LABELS[log.type]}
                  </span>
                  <span className="font-display font-medium text-sm text-[var(--text)]">{topic?.name ?? 'Tópico'}</span>
                </div>
                <span className="text-[11px] font-mono text-[var(--dim)]">{new Date(log.date).toLocaleDateString('pt-BR')}</span>
              </div>

              <p className="text-xs text-[var(--text)] leading-relaxed mb-1">{log.breakPoint || log.notes}</p>
              {log.breakPoint && log.notes && (
                <p className="text-[11px] text-[var(--dim)] mb-2">{log.notes}</p>
              )}
              {log.evidence && (
                <p className="text-[11px] text-[var(--dim)] mb-2">Evidência: <span className="text-[var(--text)]">{log.evidence}</span></p>
              )}
              {log.confidence && (
                <p className="text-[11px] font-mono text-[var(--dim)] mb-2">{CONFIDENCE_LABELS[log.confidence]}</p>
              )}

              {log.aiHypothesis && (
                <div className="mt-3 p-3 rounded-lg border border-[var(--primary)]/30 bg-[var(--primary)]/10 text-xs text-[var(--text)]">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 subject-text shrink-0 mt-0.5" />
                    <AiText text={log.aiHypothesis} className="flex-1" />
                  </div>
                </div>
              )}
              {!log.aiHypothesis && generatingHypothesisFor === log.id && (
                <div className="mt-3 flex items-center p-2.5 rounded-lg bg-[var(--surface2)] text-xs text-[var(--dim)]">
                  <Sparkles className="w-3.5 h-3.5 mr-2 animate-pulse subject-text" />
                  Gerando hipótese analítica com IA...
                </div>
              )}

              {log.proposedIntervention && (
                <div className="mt-3 p-3 rounded-lg bg-[var(--surface2)] border border-[var(--line)] text-xs">
                  <div className="flex items-start gap-2 mb-2">
                    <Stethoscope className="w-4 h-4 subject-text shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-[var(--text)]">{INTERVENTION_LABELS[log.proposedIntervention.type]}</p>
                      <p className="text-[var(--dim)] mt-0.5">{log.proposedIntervention.description}</p>
                    </div>
                  </div>
                  {(!log.interventionStatus || log.interventionStatus === 'pendente') && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => setInterventionStatus(log, 'concluida')}
                        className="px-2.5 py-1 rounded text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                      >
                        Marcar como feita
                      </button>
                      <button
                        onClick={() => setInterventionStatus(log, 'recusada')}
                        className="px-2.5 py-1 rounded text-xs font-medium border border-[var(--line)] text-[var(--dim)] hover:text-[var(--text)]"
                      >
                        Não vou fazer
                      </button>
                    </div>
                  )}
                  {log.interventionStatus === 'concluida' && !log.outcomeRating && (
                    <div className="flex gap-2 mt-2 flex-wrap items-center">
                      <span className="text-[11px] text-[var(--dim)] mr-1">Como foi?</span>
                      {(Object.entries(OUTCOME_LABELS) as [NonNullable<ErrorLog['outcomeRating']>, string][]).map(([value, label]) => (
                        <button
                          key={value}
                          onClick={() => setOutcomeRating(log, value)}
                          className="px-2 py-0.5 rounded text-xs border border-[var(--line)] text-[var(--dim)] hover:border-[var(--primary)] hover:text-[var(--text)] transition-colors"
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                  {log.interventionStatus === 'concluida' && log.outcomeRating && (
                    <p className="text-xs text-emerald-500 mt-2 font-medium">Feita — {OUTCOME_LABELS[log.outcomeRating]}</p>
                  )}
                  {log.interventionStatus === 'recusada' && (
                    <p className="text-xs text-[var(--dim)] mt-2">Recusada</p>
                  )}
                </div>
              )}
            </Panel>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 border border-dashed border-[var(--line)] rounded-xl text-[var(--dim)] text-xs">
            Nenhum erro registrado nessa categoria.
          </div>
        )}
      </div>
    </div>
  );
}
