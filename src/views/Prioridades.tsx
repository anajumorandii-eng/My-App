import React, { useMemo, useState } from 'react';
import { examPriorities, targetExamBoards, extraExamBoards } from '../data/examPriorities';
import { literaryWorks } from '../data/literaryWorks';
import { Target, ChevronDown, BookOpen, AlertTriangle } from 'lucide-react';

export default function Prioridades() {
  const subjects = useMemo(() => examPriorities.map((s) => s.subject), []);
  const [activeSubject, setActiveSubject] = useState(subjects[0]);
  const [expandedBoard, setExpandedBoard] = useState<string | null>(null);
  const [expandedWork, setExpandedWork] = useState<string | null>(null);

  const data = examPriorities.find((s) => s.subject === activeSubject)!;
  const allBoards = [...targetExamBoards, ...extraExamBoards];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center">
          <Target className="w-7 h-7 mr-3 text-indigo-500" />
          Prioridades por Vestibular
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Análise de incidência de temas nas provas de 2023-2025 (fonte: Anglo Analisa Região Sudeste), com foco nos seus vestibulares: Fuvest, Unicamp (Comvest), Famerp e Unifesp.
        </p>
      </header>

      <div className="flex gap-2 flex-wrap">
        {subjects.map((subject) => (
          <button
            key={subject}
            onClick={() => setActiveSubject(subject)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              activeSubject === subject
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
            }`}
          >
            {subject}
          </button>
        ))}
      </div>

      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-1">Resumo da região (todos os vestibulares)</h2>
        <p className="text-sm text-zinc-500 mb-5">Ranking agregado de temas mais cobrados em {activeSubject} — priorize os do topo primeiro.</p>
        <div className="space-y-3">
          {data.regionalSummary.map((topic, i) => (
            <div key={topic.theme} className="flex items-center">
              <span className="w-6 text-xs font-semibold text-zinc-400 shrink-0">{i + 1}º</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium truncate mr-2">{topic.theme}</span>
                  <span className="text-xs text-zinc-500 shrink-0">{topic.percent}%</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500"
                    style={{ width: `${Math.min(100, (topic.percent / data.regionalSummary[0].percent) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Por vestibular</h2>
        <div className="space-y-3">
          {allBoards.map((board) => {
            const boardData = data.byBoard.find((b) => b.board === board);
            if (!boardData) return null;
            const isTarget = targetExamBoards.includes(board);
            const isExpanded = expandedBoard === board;
            return (
              <div key={board} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
                <button
                  onClick={() => setExpandedBoard(isExpanded ? null : board)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <div className="flex items-center min-w-0">
                    <span className={`text-sm font-semibold px-2.5 py-1 rounded-full mr-3 shrink-0 ${
                      isTarget
                        ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                    }`}>
                      {board}
                    </span>
                    <span className="text-sm text-zinc-500 truncate">
                      {boardData.topics.slice(0, 2).map((t) => t.theme).join(' • ')}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-zinc-400 shrink-0 ml-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                    {boardData.topics.map((topic) => (
                      <div key={topic.theme} className="flex items-center justify-between text-sm py-1.5">
                        <span className="text-zinc-700 dark:text-zinc-300">{topic.theme}</span>
                        <span className="text-zinc-400 font-medium">{topic.percent}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {data.byBoard.length === 0 && (
          <p className="text-sm text-zinc-500 py-4">Sem dados por vestibular para essa matéria neste relatório.</p>
        )}
      </section>

      {activeSubject === 'Língua Portuguesa' && (
        <section>
          <h2 className="text-xl font-semibold mb-1 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-indigo-500" />
            Obras de leitura obrigatória
          </h2>
          <p className="text-sm text-zinc-500 mb-4">
            Fuvest e Unicamp são as únicas bancas do relatório onde "obras de leitura obrigatória" pesa de verdade na nota de Português (25% e ~18-22% das questões, respectivamente). Aqui está a lista vigente para o seu vestibular.
          </p>
          <div className="space-y-6">
            {literaryWorks.map((list) => (
              <div key={list.board}>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold">{list.board}</h3>
                  <span className="text-xs text-zinc-500">{list.cycle}</span>
                </div>
                {list.note && (
                  <div className="flex items-start p-3 mb-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 text-xs">
                    <AlertTriangle className="w-3.5 h-3.5 mr-2 mt-0.5 shrink-0" />
                    <p>{list.note}</p>
                  </div>
                )}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl divide-y divide-zinc-100 dark:divide-zinc-800 overflow-hidden">
                  {list.works.map((work) => {
                    const key = `${list.board}_${work.title}`;
                    const isExpanded = expandedWork === key;
                    return (
                      <div key={key}>
                        <button
                          onClick={() => setExpandedWork(isExpanded ? null : key)}
                          className="w-full flex items-center justify-between p-4 text-left"
                        >
                          <div className="min-w-0">
                            <p className="font-medium truncate">{work.title}</p>
                            <p className="text-xs text-zinc-500 mt-0.5">{work.author} • {work.movement}</p>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-zinc-400 shrink-0 ml-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        {isExpanded && (
                          <div className="px-4 pb-4 -mt-1">
                            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{work.examAngle}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
