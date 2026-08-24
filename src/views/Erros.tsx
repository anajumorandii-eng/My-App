import React, { useEffect, useMemo, useState } from 'react';
import { mockErrorLogs, mockTopics } from '../data/mockData';
import { ErrorLog } from '../types';
import { useAuth } from '../context/AuthContext';
import { getUserErrorLogs, addUserErrorLog } from '../lib/userData';
import { requestAiText } from '../lib/aiClient';
import { ERROR_TYPE_LABELS as TYPE_LABELS, INTERVENTION_LABELS, CONFIDENCE_LABELS } from '../lib/errorLabels';
import { AiText } from '../components/AiText';
import { BookX, Plus, Sparkles, CloudOff, Stethoscope } from 'lucide-react';
import { useSummaryProgress } from '../hooks/useSummaryProgress';
import { interactiveSummaries } from '../data/interactiveSummaries';
import SummaryErrorsPanel from '../components/SummaryErrorsPanel';

const OUTCOME_LABELS: Record<NonNullable<ErrorLog['outcomeRating']>, string> = {
  melhorou: 'Melhorou',
  sem_mudanca: 'Sem mudança',
  ainda_dificil: 'Ainda difícil',
};

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
      const data = await requestAiText('error-hypothesis', {
        topic: topic?.name ?? 'Tópico desconhecido',
        subject: topic?.subject ?? 'Matéria desconhecida',
        errorType: TYPE_LABELS[newLog.type],
        notes: newLog.notes,
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center">
            <BookX className="w-7 h-7 mr-3 text-indigo-500" />
            Caderno de Erros
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">Diagnóstico de padrões para atacar a causa raiz, não só o sintoma.</p>
          {!isConnected && (
            <p className="flex items-center text-xs text-zinc-400 mt-2">
              <CloudOff className="w-3.5 h-3.5 mr-1.5" />
              Modo demonstração — conecte sua conta Google para salvar seus erros de verdade.
            </p>
          )}
          {syncError && <p className="text-xs text-rose-500 mt-2">{syncError}</p>}
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Registrar erro
        </button>
      </header>

      <SummaryErrorsPanel progress={summaryProgress} summaries={interactiveSummaries} />

      {showForm && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Tópico</label>
              <select
                value={form.topicId}
                onChange={(e) => setForm((f) => ({ ...f, topicId: e.target.value }))}
                className="w-full bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {mockTopics.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Tipo de erro</label>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as ErrorLog['type'] }))}
                className="w-full bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {Object.entries(TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">O que aconteceu?</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={3}
              placeholder="Descreva o raciocínio que te levou ao erro..."
              className="w-full bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={addLog}
            disabled={!form.notes.trim()}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white rounded-lg font-medium transition-colors"
          >
            Salvar
          </button>
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setTypeFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
            typeFilter === 'all'
              ? 'bg-indigo-600 border-indigo-600 text-white'
              : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
          }`}
        >
          Todos ({logs.length})
        </button>
        {Object.entries(TYPE_LABELS).map(([value, label]) => {
          const count = countsByType[value as ErrorLog['type']];
          if (!count) return null;
          return (
            <button
              key={value}
              onClick={() => setTypeFilter(value as ErrorLog['type'])}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                typeFilter === value
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
              }`}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        {filtered.map((log) => {
          const topic = mockTopics.find((t) => t.id === log.topicId);
          return (
            <div key={log.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300">
                    {TYPE_LABELS[log.type]}
                  </span>
                  <span className="text-sm font-medium">{topic?.name ?? 'Tópico removido'}</span>
                </div>
                <span className="text-xs text-zinc-400">{new Date(log.date).toLocaleDateString('pt-BR')}</span>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-1">{log.breakPoint || log.notes}</p>
              {log.breakPoint && log.notes && (
                <p className="text-xs text-zinc-400 mb-3">{log.notes}</p>
              )}
              {log.evidence && (
                <p className="text-xs text-zinc-500 mb-3">Evidência: {log.evidence}</p>
              )}
              {log.confidence && (
                <p className="text-xs text-zinc-400 mb-3">{CONFIDENCE_LABELS[log.confidence]}</p>
              )}
              {log.aiHypothesis && (
                <div className="flex items-start p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300 text-sm mb-3">
                  <Sparkles className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                  <AiText text={log.aiHypothesis} className="flex-1" />
                </div>
              )}
              {!log.aiHypothesis && generatingHypothesisFor === log.id && (
                <div className="flex items-center p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 text-sm mb-3">
                  <Sparkles className="w-4 h-4 mr-2 shrink-0 animate-pulse" />
                  Gerando hipótese com IA...
                </div>
              )}

              {log.proposedIntervention && (
                <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 text-sm">
                  <div className="flex items-start mb-2">
                    <Stethoscope className="w-4 h-4 mr-2 mt-0.5 shrink-0 text-zinc-500" />
                    <div>
                      <p className="font-medium text-zinc-700 dark:text-zinc-300">{INTERVENTION_LABELS[log.proposedIntervention.type]}</p>
                      <p className="text-zinc-500">{log.proposedIntervention.description}</p>
                    </div>
                  </div>
                  {(!log.interventionStatus || log.interventionStatus === 'pendente') && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => setInterventionStatus(log, 'concluida')}
                        className="px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        Marcar como feita
                      </button>
                      <button
                        onClick={() => setInterventionStatus(log, 'recusada')}
                        className="px-3 py-1.5 rounded-full text-xs font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        Não vou fazer
                      </button>
                    </div>
                  )}
                  {log.interventionStatus === 'concluida' && !log.outcomeRating && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <span className="text-xs text-zinc-500 self-center mr-1">Como foi?</span>
                      {(Object.entries(OUTCOME_LABELS) as [NonNullable<ErrorLog['outcomeRating']>, string][]).map(([value, label]) => (
                        <button
                          key={value}
                          onClick={() => setOutcomeRating(log, value)}
                          className="px-3 py-1.5 rounded-full text-xs font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                  {log.interventionStatus === 'concluida' && log.outcomeRating && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">Feita — {OUTCOME_LABELS[log.outcomeRating]}</p>
                  )}
                  {log.interventionStatus === 'recusada' && (
                    <p className="text-xs text-zinc-400 mt-2">Recusada</p>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
            <p className="text-zinc-500">Nenhum erro registrado nessa categoria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
