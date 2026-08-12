import React, { useState } from 'react';
import {
  generalResolutionMethod,
  subjectStrategies,
  bancaStrategies,
  secondPhaseProtocols,
} from '../data/resolutionStrategies';
import { Compass, ChevronDown, Lightbulb, AlertTriangle } from 'lucide-react';

type Tab = 'metodo' | 'materia' | 'banca' | 'segunda-fase';

const TABS: { id: Tab; label: string }[] = [
  { id: 'metodo', label: 'Método Geral' },
  { id: 'materia', label: 'Por Matéria' },
  { id: 'banca', label: 'Por Banca' },
  { id: 'segunda-fase', label: '2ª Fase (Discursiva)' },
];

export default function Estrategias() {
  const [tab, setTab] = useState<Tab>('metodo');
  const [expandedSubject, setExpandedSubject] = useState<string | null>(subjectStrategies[0]?.subject ?? null);
  const [expandedProtocol, setExpandedProtocol] = useState<string | null>(null);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center">
          <Compass className="w-7 h-7 mr-3 text-indigo-500" />
          Estratégias de Resolução
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Como pensar diante de uma questão: o método geral, o que muda por matéria, o estilo de cada banca e os protocolos de segunda fase.
        </p>
      </header>

      <div className="flex gap-2 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              tab === t.id
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'metodo' && (
        <section className="space-y-3">
          <p className="text-sm text-zinc-500 mb-2">
            Um roteiro de 11 passos para qualquer questão de múltipla escolha — o objetivo não é "chegar na resposta certa", é reconstruir o raciocínio que leva até lá.
          </p>
          {generalResolutionMethod.map((s) => (
            <div key={s.step} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm flex items-start">
              <span className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mr-4 shrink-0 font-semibold text-sm">
                {s.step}
              </span>
              <div>
                <h3 className="font-semibold text-sm">{s.title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">{s.description}</p>
              </div>
            </div>
          ))}
        </section>
      )}

      {tab === 'materia' && (
        <section className="space-y-3">
          {subjectStrategies.map((s) => {
            const isExpanded = expandedSubject === s.subject;
            return (
              <div key={s.subject} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
                <button
                  onClick={() => setExpandedSubject(isExpanded ? null : s.subject)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <h3 className="font-semibold">{s.subject}</h3>
                  <ChevronDown className={`w-4 h-4 text-zinc-400 shrink-0 ml-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 flex items-center">
                        <Lightbulb className="w-4 h-4 mr-1.5 text-indigo-500" />
                        Como resolver
                      </p>
                      <ul className="space-y-1.5">
                        {s.tips.map((tip, i) => (
                          <li key={i} className="text-sm text-zinc-600 dark:text-zinc-400 flex">
                            <span className="mr-2 text-indigo-400">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-1.5 text-amber-500" />
                        Pegadinhas comuns
                      </p>
                      <ul className="space-y-1.5">
                        {s.pitfalls.map((p, i) => (
                          <li key={i} className="text-sm text-zinc-600 dark:text-zinc-400 flex">
                            <span className="mr-2 text-amber-400">•</span>
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </section>
      )}

      {tab === 'banca' && (
        <section className="space-y-4">
          {bancaStrategies.map((b) => (
            <div key={b.board} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold mb-2">{b.board}</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">{b.profile}</p>
              <div className="flex items-start p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300 text-sm">
                <Lightbulb className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                <p>{b.examStrategy}</p>
              </div>
            </div>
          ))}
        </section>
      )}

      {tab === 'segunda-fase' && (
        <section className="space-y-3">
          <p className="text-sm text-zinc-500 mb-2">
            Protocolos para estruturar respostas discursivas — o corretor pontua o que ficou demonstrado no papel, não o que você "pensou".
          </p>
          {secondPhaseProtocols.map((p) => {
            const key = `${p.board}_${p.name}`;
            const isExpanded = expandedProtocol === key;
            return (
              <div key={key} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
                <button
                  onClick={() => setExpandedProtocol(isExpanded ? null : key)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <div className="min-w-0">
                    <h3 className="font-semibold truncate">{p.board} — {p.name}</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">{p.scope}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-zinc-400 shrink-0 ml-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
                    <div className="space-y-2">
                      {p.steps.map((step) => (
                        <div key={step.letter} className="flex items-start">
                          <span className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mr-3 shrink-0 font-bold text-xs">
                            {step.letter}
                          </span>
                          <div>
                            <p className="text-sm font-semibold">{step.title}</p>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {p.responseStructure && p.responseStructure.length > 0 && (
                      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                        <p className="text-xs font-semibold text-zinc-500 mb-1.5">Estrutura da resposta</p>
                        <ul className="space-y-1">
                          {p.responseStructure.map((r, i) => (
                            <li key={i} className="text-sm text-zinc-600 dark:text-zinc-400 flex">
                              <span className="mr-2 text-indigo-400">•</span>
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}
