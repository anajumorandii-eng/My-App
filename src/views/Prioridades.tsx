import React, { useMemo, useState } from 'react';
import { examPriorities, targetExamBoards, extraExamBoards } from '../data/examPriorities';
import { literaryWorks } from '../data/literaryWorks';
import { Target, ChevronDown, BookOpen, AlertTriangle } from 'lucide-react';
import { Panel } from '../components/ui/Panel';
import { PALETTES, PALETTE_INK } from '../prototypes/NucleoInstrumentalPrototype';
import { SUBJECT_ICONS } from './Dashboard';

export default function Prioridades() {
  const subjects = useMemo(() => examPriorities.map((s) => s.subject), []);
  const [activeSubject, setActiveSubject] = useState(subjects[0]);
  const [expandedBoard, setExpandedBoard] = useState<string | null>(null);
  const [expandedWork, setExpandedWork] = useState<string | null>(null);

  const data = examPriorities.find((s) => s.subject === activeSubject)!;
  const allBoards = [...targetExamBoards, ...extraExamBoards];

  // Map subject name to matching palette key
  const paletteKey = activeSubject === 'Língua Portuguesa' ? 'Português' : activeSubject;
  const currentPalette = PALETTES[paletteKey] ?? PALETTES.Matemática;
  const SubjIcon = SUBJECT_ICONS[paletteKey] ?? Target;

  return (
    <div
      className="ni-main"
      style={{
        '--primary': currentPalette.primary, '--primary-ink': currentPalette.readable,
        '--secondary': currentPalette.secondary,
        '--wash': currentPalette.wash,
      } as React.CSSProperties}
    >
      {/* Route Breadcrumb */}
      <div className="ni-route">
        <span>ANÁLISE</span>
        <i />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[var(--primary)] text-[var(--ink-on-primary)]">
            <SubjIcon className="w-3 h-3" />
          </span>
          INCIDÊNCIA
        </span>
        <i />
        <b>PRIORIDADES POR VESTIBULAR</b>
      </div>

      {/* Main Title */}
      <div className="ni-title">
        <div>
          <h1>Foque onde o retorno é maior.</h1>
          <p>Análise de incidência estatística de temas nas provas mais concorridas de Medicina.</p>
        </div>
        <div className="ni-state">
          <i /> {activeSubject} · Raio-X de Incidência
        </div>
      </div>

      {/* Subject Filter Bar */}
      <div className="ni-subjects">
        {subjects.map((subject) => {
          const active = activeSubject === subject;
          const key = subject === 'Língua Portuguesa' ? 'Português' : subject;
          const subPal = PALETTES[key] ?? PALETTES.Matemática;
          const Icon = SUBJECT_ICONS[key] ?? Target;
          return (
            <button
              key={subject}
              onClick={() => setActiveSubject(subject)}
              style={
                active
                  ? { backgroundColor: subPal.primary, color: PALETTE_INK, borderRadius: '4px', padding: '2px 8px', display: 'inline-flex', alignItems: 'center', gap: '6px' }
                  : { display: 'inline-flex', alignItems: 'center', gap: '6px' }
              }
            >
              <Icon className="w-3 h-3" style={{ color: active ? PALETTE_INK : subPal.primary }} />
              <span>{subject}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        {/* Regional Summary Panel */}
        <Panel subject={paletteKey} className="ni-panel p-5">
          <h2 className="font-display font-medium text-sm text-[var(--text)] mb-0.5">Resumo da região (todos os vestibulares)</h2>
          <p className="text-xs text-[var(--dim)] mb-4">Ranking agregado de temas mais cobrados em {activeSubject} — priorize os do topo primeiro.</p>
          <div className="space-y-3">
            {data.regionalSummary.map((topic, i) => (
              <div key={topic.theme} className="flex items-center gap-2">
                <span className="w-5 text-xs font-mono text-[var(--dim)] shrink-0">{i + 1}º</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-[var(--text)] truncate mr-2">{topic.theme}</span>
                    <span className="text-[11px] font-mono text-[var(--dim)] shrink-0">{topic.percent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[var(--surface2)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, (topic.percent / data.regionalSummary[0].percent) * 100)}%`,
                        backgroundColor: currentPalette.primary,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Breakdown by board */}
        <section>
          <h2 className="font-display font-medium text-sm text-[var(--text)] mb-3">Por vestibular</h2>
          <div className="space-y-3">
            {allBoards.map((board) => {
              const boardData = data.byBoard.find((b) => b.board === board);
              if (!boardData) return null;
              const isTarget = targetExamBoards.includes(board);
              const isExpanded = expandedBoard === board;
              return (
                <Panel key={board} subject={paletteKey} className="ni-panel overflow-hidden">
                  <button
                    onClick={() => setExpandedBoard(isExpanded ? null : board)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-[var(--surface2)] transition-colors"
                  >
                    <div className="flex items-center min-w-0">
                      <span
                        className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full mr-3 shrink-0"
                        style={{
                          backgroundColor: isTarget ? currentPalette.primary : 'var(--surface2)',
                          color: isTarget ? PALETTE_INK : 'var(--dim)',
                        }}
                      >
                        {board}
                      </span>
                      <span className="text-xs text-[var(--dim)] truncate">
                        {boardData.topics.slice(0, 2).map((t) => t.theme).join(' • ')}
                      </span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-[var(--dim)] shrink-0 ml-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  {isExpanded && (
                    <div className="px-5 pb-4 pt-1 border-t border-[var(--line)] space-y-2">
                      {boardData.topics.map((topic) => (
                        <div key={topic.theme} className="flex items-center justify-between text-xs py-1">
                          <span className="text-[var(--text)]">{topic.theme}</span>
                          <span className="text-[var(--dim)] font-mono">{topic.percent}%</span>
                        </div>
                      ))}
                    </div>
                  )}
                </Panel>
              );
            })}
          </div>
          {data.byBoard.length === 0 && (
            <p className="text-xs text-[var(--dim)] py-4">Sem dados por vestibular para essa matéria neste relatório.</p>
          )}
        </section>

        {/* Required reading section for Portuguese */}
        {activeSubject === 'Língua Portuguesa' && (
          <section className="mt-4">
            <h2 className="font-display font-medium text-sm text-[var(--text)] mb-1 flex items-center">
              <BookOpen className="w-4 h-4 mr-2 subject-text" />
              Obras de leitura obrigatória
            </h2>
            <p className="text-xs text-[var(--dim)] mb-3">
              Fuvest e Unicamp cobram obras literárias com peso decisivo na nota de Português.
            </p>
            <div className="space-y-4">
              {literaryWorks.map((list) => (
                <div key={list.board}>
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="font-display font-medium text-xs text-[var(--text)]">{list.board}</h3>
                    <span className="text-[11px] font-mono text-[var(--dim)]">{list.cycle}</span>
                  </div>
                  {list.note && (
                    <div className="flex items-start p-2.5 mb-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                      <AlertTriangle className="w-3.5 h-3.5 mr-1.5 mt-0.5 shrink-0 text-amber-400" />
                      <p>{list.note}</p>
                    </div>
                  )}
                  <Panel subject="Literatura" className="ni-panel divide-y divide-[var(--line)] overflow-hidden">
                    {list.works.map((work) => {
                      const key = `${list.board}_${work.title}`;
                      const isExpanded = expandedWork === key;
                      return (
                        <div key={key}>
                          <button
                            onClick={() => setExpandedWork(isExpanded ? null : key)}
                            className="w-full flex items-center justify-between p-3.5 text-left hover:bg-[var(--surface2)] transition-colors"
                          >
                            <div className="min-w-0">
                              <p className="font-medium text-xs text-[var(--text)] truncate">{work.title}</p>
                              <p className="text-[11px] text-[var(--dim)] mt-0.5">{work.author} • {work.movement}</p>
                            </div>
                            <ChevronDown className={`w-3.5 h-3.5 text-[var(--dim)] shrink-0 ml-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>
                          {isExpanded && (
                            <div className="px-4 pb-3 text-xs text-[var(--dim)] leading-relaxed">
                              {work.examAngle}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </Panel>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
