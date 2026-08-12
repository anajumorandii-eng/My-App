import React, { useMemo, useState } from 'react';
import { mockStudyMethods } from '../data/mockData';
import { StudyMethod } from '../types';
import { FlaskConical, ChevronDown, Brain, Repeat as RepeatIcon, Target, Zap } from 'lucide-react';

const CATEGORY_META: Record<StudyMethod['category'], { label: string; icon: React.ElementType; color: string }> = {
  aquisicao: { label: 'Aquisição', icon: Brain, color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' },
  retencao: { label: 'Retenção', icon: RepeatIcon, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' },
  aplicacao: { label: 'Aplicação', icon: Target, color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20' },
  foco: { label: 'Foco', icon: Zap, color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20' },
};

export default function Laboratorio() {
  const [categoryFilter, setCategoryFilter] = useState<StudyMethod['category'] | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(mockStudyMethods[0]?.id ?? null);

  const filtered = useMemo(
    () => (categoryFilter === 'all' ? mockStudyMethods : mockStudyMethods.filter((m) => m.category === categoryFilter)),
    [categoryFilter]
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center">
          <FlaskConical className="w-7 h-7 mr-3 text-indigo-500" />
          Laboratório & Métodos
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Técnicas de estudo com evidência científica, prontas para aplicar hoje.
        </p>
      </header>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setCategoryFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
            categoryFilter === 'all'
              ? 'bg-indigo-600 border-indigo-600 text-white'
              : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
          }`}
        >
          Todas
        </button>
        {(Object.entries(CATEGORY_META) as [StudyMethod['category'], typeof CATEGORY_META[StudyMethod['category']]][]).map(([value, meta]) => (
          <button
            key={value}
            onClick={() => setCategoryFilter(value)}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              categoryFilter === value
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
            }`}
          >
            <meta.icon className="w-4 h-4 mr-1.5" />
            {meta.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((method) => {
          const meta = CATEGORY_META[method.category];
          const isExpanded = expandedId === method.id;
          return (
            <div key={method.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
              <button
                onClick={() => setExpandedId(isExpanded ? null : method.id)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <div className="flex items-center min-w-0">
                  <span className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 shrink-0 ${meta.color}`}>
                    <meta.icon className="w-5 h-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-semibold">{method.name}</h3>
                    <p className="text-sm text-zinc-500 mt-0.5 truncate">{method.summary}</p>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-zinc-400 shrink-0 ml-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-1 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Como aplicar</p>
                    <ol className="space-y-2">
                      {method.steps.map((step, i) => (
                        <li key={i} className="flex text-sm text-zinc-600 dark:text-zinc-400">
                          <span className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mr-3 shrink-0 text-xs font-medium text-zinc-500">
                            {i + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {method.bestFor.map((tag) => (
                      <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
