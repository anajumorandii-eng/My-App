import React, { useMemo, useState } from 'react';
import { mockTopics } from '../data/mockData';
import { StudyMethod } from '../types';
import { useUserMastery } from '../hooks/useUserMastery';
import { useStudyMethods } from '../hooks/useStudyMethods';
import { requestAiText } from '../lib/aiClient';
import { AiText } from '../components/AiText';
import { FlaskConical, ChevronDown, Brain, Repeat as RepeatIcon, Target, Zap, Sparkles, CheckCircle2 } from 'lucide-react';

// Métodos que não ficam só na teoria: já rodam de verdade no motor do
// plano (spacedRepetition.ts agenda as revisões; interleaving.ts intercala
// as matérias no plano de hoje) — não apenas descritos aqui como sugestão.
const ACTIVE_IN_ENGINE = new Set(['method_spaced_repetition', 'method_interleaving']);

const CATEGORY_META: Record<StudyMethod['category'], { label: string; icon: React.ElementType; color: string }> = {
  aquisicao: { label: 'Aquisição', icon: Brain, color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' },
  retencao: { label: 'Retenção', icon: RepeatIcon, color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' },
  aplicacao: { label: 'Aplicação', icon: Target, color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20' },
  foco: { label: 'Foco', icon: Zap, color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20' },
};

export default function Laboratorio() {
  const { mastery } = useUserMastery();
  const { studyMethods, syncError } = useStudyMethods();
  const [categoryFilter, setCategoryFilter] = useState<StudyMethod['category'] | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(studyMethods[0]?.id ?? null);
  const [examples, setExamples] = useState<Record<string, string>>({});
  const [loadingExampleFor, setLoadingExampleFor] = useState<string | null>(null);

  const filtered = useMemo(
    () => (categoryFilter === 'all' ? studyMethods : studyMethods.filter((m) => m.category === categoryFilter)),
    [studyMethods, categoryFilter]
  );

  const weakestTopic = useMemo(() => {
    const sorted = [...mastery].sort((a, b) => a.level - b.level);
    const topicId = sorted[0]?.topicId;
    return mockTopics.find((t) => t.id === topicId) ?? mockTopics[0];
  }, [mastery]);

  const fetchExample = async (method: StudyMethod) => {
    setLoadingExampleFor(method.id);
    try {
      const data = await requestAiText('method-example', {
        methodName: method.name,
        methodSummary: method.summary,
        topic: weakestTopic.name,
        subject: weakestTopic.subject,
      });
      setExamples((prev) => ({ ...prev, [method.id]: data.text }));
    } catch (error) {
      console.error('Failed to fetch method example:', error);
    } finally {
      setLoadingExampleFor(null);
    }
  };

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
        {syncError && <p className="text-xs text-rose-500 mt-2">{syncError}</p>}
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
                    <h3 className="font-semibold flex items-center flex-wrap gap-2">
                      {method.name}
                      {ACTIVE_IN_ENGINE.has(method.id) && (
                        <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Ativo no seu plano
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-zinc-500 mt-0.5 truncate">{method.summary}</p>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-zinc-400 shrink-0 ml-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-1 border-t border-zinc-100 dark:border-zinc-800">
                  {method.id === 'method_spaced_repetition' && (
                    <p className="mt-4 text-xs text-zinc-500 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-3">
                      Isso já roda de verdade: cada tópico tem seu próprio intervalo, recalculado a cada vez que você avalia como lembrou em "Revisões Adaptativas" ou responde uma questão em "Questões & Tentativas".
                    </p>
                  )}
                  {method.id === 'method_interleaving' && (
                    <p className="mt-4 text-xs text-zinc-500 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-3">
                      Isso já roda de verdade: o plano do dia (em "Plano" e "Hoje") intercala matérias automaticamente, em vez de deixar vários itens seguidos da mesma matéria.
                    </p>
                  )}
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

                  <div className="mt-4">
                    {!examples[method.id] && (
                      <button
                        onClick={() => fetchExample(method)}
                        disabled={loadingExampleFor === method.id}
                        className="flex items-center px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 disabled:opacity-50 transition-colors"
                      >
                        <Sparkles className={`w-3.5 h-3.5 mr-1.5 ${loadingExampleFor === method.id ? 'animate-pulse' : ''}`} />
                        {loadingExampleFor === method.id
                          ? 'Gerando exemplo...'
                          : `Exemplo aplicado ao meu ponto fraco (${weakestTopic.name})`}
                      </button>
                    )}
                    {examples[method.id] && (
                      <div className="flex items-start p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300 text-sm">
                        <Sparkles className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                        <AiText text={examples[method.id]} className="flex-1" />
                      </div>
                    )}
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
