import React, { useEffect, useMemo, useState } from 'react';
import { mockErrorLogs, mockTopics } from '../data/mockData';
import { ErrorLog } from '../types';
import { useAuth } from '../context/AuthContext';
import { getUserErrorLogs, addUserErrorLog } from '../lib/userData';
import { BookX, Plus, Sparkles, CloudOff } from 'lucide-react';

const TYPE_LABELS: Record<ErrorLog['type'], string> = {
  conceptual: 'Conceitual',
  interpretation: 'Interpretação',
  calculation: 'Cálculo',
  strategy: 'Estratégia',
  attention: 'Atenção',
  time: 'Tempo',
  prerequisite: 'Pré-requisito',
};

export default function Erros() {
  const { user, isConnected } = useAuth();
  const [logs, setLogs] = useState<ErrorLog[]>(mockErrorLogs);
  const [typeFilter, setTypeFilter] = useState<ErrorLog['type'] | 'all'>('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ topicId: mockTopics[0].id, type: 'conceptual' as ErrorLog['type'], notes: '' });
  const [syncError, setSyncError] = useState<string | null>(null);

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

  const addLog = () => {
    if (!form.notes.trim()) return;
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
  };

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
              <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-3">{log.notes}</p>
              {log.aiHypothesis && (
                <div className="flex items-start p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300 text-sm">
                  <Sparkles className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                  <p>{log.aiHypothesis}</p>
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
