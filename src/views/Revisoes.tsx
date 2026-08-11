import React, { useMemo, useState } from 'react';
import { mockMastery, mockTopics } from '../data/mockData';
import { TopicMastery } from '../types';
import { Repeat, CheckCircle2, AlertTriangle } from 'lucide-react';

function urgencyOf(mastery: TopicMastery): number {
  const daysSinceReview = (Date.now() - new Date(mastery.lastReviewed).getTime()) / 86400000;
  return Math.min(daysSinceReview * 5 + mastery.uncertainty * 50 + mastery.errorSignals * 8, 100);
}

const SUBJECT_COLORS: Record<string, string> = {
  Biologia: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20',
  Matemática: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20',
  Física: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20',
};

export default function Revisoes() {
  const [masteryState, setMasteryState] = useState<TopicMastery[]>(mockMastery);

  const queue = useMemo(() => {
    return masteryState
      .map((mastery) => {
        const topic = mockTopics.find((t) => t.id === mastery.topicId);
        return { mastery, topic, urgency: urgencyOf(mastery) };
      })
      .filter((entry) => entry.topic)
      .sort((a, b) => b.urgency - a.urgency);
  }, [masteryState]);

  const pendingToday = queue.filter((entry) => entry.urgency > 50).length;

  const markReviewed = (topicId: string) => {
    setMasteryState((prev) =>
      prev.map((m) =>
        m.topicId === topicId
          ? { ...m, lastReviewed: new Date().toISOString(), uncertainty: Math.max(m.uncertainty - 0.2, 0.05) }
          : m
      )
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center">
          <Repeat className="w-7 h-7 mr-3 text-indigo-500" />
          Revisões Adaptativas
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Fila ordenada por urgência: tempo desde a última revisão, incerteza e sinais de erro recentes.
        </p>
      </header>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex items-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${pendingToday > 0 ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'}`}>
          {pendingToday > 0 ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
        </div>
        <div>
          <p className="text-2xl font-bold">{pendingToday}</p>
          <p className="text-sm text-zinc-500">
            {pendingToday > 0 ? 'revisões urgentes pendentes' : 'nenhuma revisão urgente — tudo em dia'}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {queue.map(({ mastery, topic, urgency }) => (
          <div
            key={mastery.topicId}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center min-w-0">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full mr-4 shrink-0 ${SUBJECT_COLORS[topic!.subject] ?? 'bg-zinc-100 text-zinc-600'}`}>
                {topic!.subject}
              </span>
              <div className="min-w-0">
                <h4 className="font-semibold truncate">{topic!.name}</h4>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Domínio: {mastery.level}% • Última revisão: {new Date(mastery.lastReviewed).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            <div className="flex items-center shrink-0 ml-4 gap-4">
              <div className="hidden sm:flex items-center w-24">
                <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mr-2">
                  <div
                    className={`h-full ${urgency > 70 ? 'bg-rose-500' : urgency > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${urgency}%` }}
                  />
                </div>
                <span className="text-xs text-zinc-500 w-8 text-right">{Math.round(urgency)}%</span>
              </div>
              <button
                onClick={() => markReviewed(mastery.topicId)}
                className="flex items-center px-3 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Revisado
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
