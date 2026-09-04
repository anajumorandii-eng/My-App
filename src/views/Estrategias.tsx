import React, { useState } from 'react';
import {
  generalResolutionMethod,
  subjectStrategies,
  bancaStrategies,
  secondPhaseProtocols,
} from '../data/resolutionStrategies';
import { Compass, ChevronDown, Lightbulb, AlertTriangle } from 'lucide-react';
import { Panel } from '../components/ui/Panel';
import { PALETTES, PALETTE_INK } from '../prototypes/NucleoInstrumentalPrototype';
import { SUBJECT_ICONS } from './Dashboard';

type Tab = 'metodo' | 'materia' | 'banca' | 'segunda-fase';

const TABS: { id: Tab; label: string }[] = [
  { id: 'metodo', label: 'Método Geral' },
  { id: 'materia', label: 'Por Matéria' },
  { id: 'banca', label: 'Por Banca' },
  { id: 'segunda-fase', label: '2ª Fase (Discursiva)' },
];

const ESTRATEGIA_PALETTE = PALETTES.Filosofia;

export default function Estrategias() {
  const [tab, setTab] = useState<Tab>('metodo');
  const [expandedSubject, setExpandedSubject] = useState<string | null>(subjectStrategies[0]?.subject ?? null);
  const [expandedProtocol, setExpandedProtocol] = useState<string | null>(null);

  return (
    <div
      className="ni-main"
      style={{
        '--primary': ESTRATEGIA_PALETTE.primary, '--primary-ink': ESTRATEGIA_PALETTE.readable,
        '--secondary': ESTRATEGIA_PALETTE.secondary,
        '--wash': ESTRATEGIA_PALETTE.wash,
      } as React.CSSProperties}
    >
      {/* Route Breadcrumb */}
      <div className="ni-route">
        <span>ANÁLISE</span>
        <i />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[var(--primary)] text-[var(--ink-on-primary)]">
            <Compass className="w-3 h-3" />
          </span>
          HEURÍSTICAS
        </span>
        <i />
        <b>ESTRATÉGIAS DE RESOLUÇÃO</b>
      </div>

      {/* Main Title */}
      <div className="ni-title">
        <div>
          <h1>Onde cada ponto da prova mora.</h1>
          <p>Como pensar diante de uma questão: o método geral, nuances por matéria, estilo de banca e protocolos discursivos.</p>
        </div>
        <div className="ni-state">
          <i /> heurísticas ativas · Crivo Tático
        </div>
      </div>

      {/* Tab filter bar */}
      <div className="ni-subjects">
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={
                active
                  ? { backgroundColor: ESTRATEGIA_PALETTE.primary, color: PALETTE_INK, borderRadius: '4px', padding: '2px 8px' }
                  : undefined
              }
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Method Tab */}
      {tab === 'metodo' && (
        <section className="space-y-3">
          <p className="text-xs text-[var(--dim)] mb-2">
            Roteiro de 11 passos para qualquer questão de múltipla escolha — o objetivo é reconstruir o raciocínio rigoroso até o gabarito.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {generalResolutionMethod.map((s) => (
              <Panel key={s.step} subject="Filosofia" interactive className="ni-panel p-4 flex items-start gap-3">
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-bold text-xs font-mono"
                  style={{ backgroundColor: ESTRATEGIA_PALETTE.primary, color: PALETTE_INK }}
                >
                  {s.step}
                </span>
                <div>
                  <h3 className="font-display font-medium text-xs text-[var(--text)]">{s.title}</h3>
                  <p className="text-xs text-[var(--dim)] mt-0.5 leading-relaxed">{s.description}</p>
                </div>
              </Panel>
            ))}
          </div>
        </section>
      )}

      {/* Subject Tab */}
      {tab === 'materia' && (
        <section className="space-y-3">
          {subjectStrategies.map((s) => {
            const isExpanded = expandedSubject === s.subject;
            const pal = PALETTES[s.subject] ?? PALETTES.Matemática;
            const SubIcon = SUBJECT_ICONS[s.subject] ?? Compass;

            return (
              <Panel key={s.subject} subject={s.subject} className="ni-panel overflow-hidden">
                <button
                  onClick={() => setExpandedSubject(isExpanded ? null : s.subject)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-[var(--surface2)] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: pal.primary, color: PALETTE_INK }}
                    >
                      <SubIcon className="w-3.5 h-3.5" />
                    </span>
                    <h3 className="font-display font-medium text-sm text-[var(--text)]">{s.subject}</h3>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-[var(--dim)] shrink-0 ml-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-[var(--line)] space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-[var(--text)] mb-2 flex items-center">
                        <Lightbulb className="w-3.5 h-3.5 mr-1.5 subject-text" />
                        Como resolver
                      </p>
                      <ul className="space-y-1.5">
                        {s.tips.map((tip, i) => (
                          <li key={i} className="text-xs text-[var(--dim)] flex items-start">
                            <span className="mr-2 subject-text">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-2 border-t border-[var(--line)]">
                      <p className="text-xs font-semibold text-amber-400 mb-2 flex items-center">
                        <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                        Pegadinhas comuns
                      </p>
                      <ul className="space-y-1.5">
                        {s.pitfalls.map((p, i) => (
                          <li key={i} className="text-xs text-[var(--dim)] flex items-start">
                            <span className="mr-2 text-amber-400">•</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </Panel>
            );
          })}
        </section>
      )}

      {/* Board Tab */}
      {tab === 'banca' && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bancaStrategies.map((b) => (
            <Panel key={b.board} subject="Filosofia" interactive className="ni-panel p-5 space-y-3">
              <h3 className="font-display font-medium text-base text-[var(--text)]">{b.board}</h3>
              <p className="text-xs text-[var(--dim)] leading-relaxed">{b.profile}</p>
              <div className="p-3 rounded-lg border border-[var(--primary)]/30 bg-[var(--primary)]/10 text-xs text-[var(--text)] flex items-start gap-2">
                <Lightbulb className="w-4 h-4 subject-text shrink-0 mt-0.5" />
                <p className="leading-relaxed">{b.examStrategy}</p>
              </div>
            </Panel>
          ))}
        </section>
      )}

      {/* Second Phase Tab */}
      {tab === 'segunda-fase' && (
        <section className="space-y-3">
          <p className="text-xs text-[var(--dim)] mb-2">
            Protocolos para estruturar respostas discursivas — o examinador pontua o que ficou demonstrado com clareza no papel.
          </p>
          {secondPhaseProtocols.map((p) => {
            const key = `${p.board}_${p.name}`;
            const isExpanded = expandedProtocol === key;
            return (
              <Panel key={key} subject="Filosofia" className="ni-panel overflow-hidden">
                <button
                  onClick={() => setExpandedProtocol(isExpanded ? null : key)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-[var(--surface2)] transition-colors"
                >
                  <div className="min-w-0">
                    <h3 className="font-display font-medium text-sm text-[var(--text)] truncate">{p.board} — {p.name}</h3>
                    <p className="text-[11px] text-[var(--dim)] mt-0.5">{p.scope}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-[var(--dim)] shrink-0 ml-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-[var(--line)] space-y-4">
                    <div className="space-y-2.5">
                      {p.steps.map((step) => (
                        <div key={step.letter} className="flex items-start gap-3">
                          <span
                            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs font-mono"
                            style={{ backgroundColor: ESTRATEGIA_PALETTE.primary, color: PALETTE_INK }}
                          >
                            {step.letter}
                          </span>
                          <div>
                            <p className="text-xs font-semibold text-[var(--text)]">{step.title}</p>
                            <p className="text-xs text-[var(--dim)] mt-0.5 leading-relaxed">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {p.responseStructure && p.responseStructure.length > 0 && (
                      <div className="pt-3 border-t border-[var(--line)]">
                        <p className="text-xs font-semibold text-[var(--dim)] mb-1.5">Estrutura recomendada de resposta</p>
                        <ul className="space-y-1">
                          {p.responseStructure.map((r, i) => (
                            <li key={i} className="text-xs text-[var(--dim)] flex items-start">
                              <span className="mr-2 subject-text">•</span>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </Panel>
            );
          })}
        </section>
      )}
    </div>
  );
}
