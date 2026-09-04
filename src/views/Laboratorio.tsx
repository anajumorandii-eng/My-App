import React, { useMemo, useState } from 'react';
import { mockTopics } from '../data/mockData';
import { StudyMethod } from '../types';
import { useUserMastery } from '../hooks/useUserMastery';
import { useStudyMethods } from '../hooks/useStudyMethods';
import { requestAiTextStream } from '../lib/aiClient';
import { AiText } from '../components/AiText';
import { FlaskConical, ChevronDown, Brain, Repeat as RepeatIcon, Target, Zap, Sparkles, CheckCircle2 } from 'lucide-react';
import { Panel } from '../components/ui/Panel';
import { PALETTES, PALETTE_INK } from '../prototypes/NucleoInstrumentalPrototype';

const ACTIVE_IN_ENGINE = new Set(['method_spaced_repetition', 'method_interleaving']);

const CATEGORY_META: Record<StudyMethod['category'], { label: string; icon: React.ElementType }> = {
  aquisicao: { label: 'Aquisição', icon: Brain },
  retencao: { label: 'Retenção', icon: RepeatIcon },
  aplicacao: { label: 'Aplicação', icon: Target },
  foco: { label: 'Foco', icon: Zap },
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
      let acumulado = '';
      const data = await requestAiTextStream('method-example', {
        methodName: method.name,
        methodSummary: method.summary,
        topic: weakestTopic.name,
        subject: weakestTopic.subject,
      }, (delta) => {
        acumulado += delta;
        setExamples((prev) => ({ ...prev, [method.id]: acumulado }));
      });
      setExamples((prev) => ({ ...prev, [method.id]: data.text }));
    } catch (error) {
      console.error('Failed to fetch method example:', error);
    } finally {
      setLoadingExampleFor(null);
    }
  };

  const currentPalette = PALETTES.Química;

  return (
    <div
      className="ni-main"
      style={{
        '--primary': currentPalette.primary,
        '--secondary': currentPalette.secondary,
        '--wash': currentPalette.wash,
      } as React.CSSProperties}
    >
      {/* Route Breadcrumb */}
      <div className="ni-route">
        <span>FERRAMENTAS</span>
        <i />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[var(--primary)] text-[var(--ink-on-primary)]">
            <FlaskConical className="w-3 h-3" />
          </span>
          CIÊNCIA DA APRENDIZAGEM
        </span>
        <i />
        <b>LABORATÓRIO DE MÉTODOS</b>
      </div>

      {/* Main Title */}
      <div className="ni-title">
        <div>
          <h1>Técnicas com evidência científica.</h1>
          <p>Metodologias comprovadas de retenção e aplicação integradas diretamente ao motor do plano.</p>
        </div>
        <div className="ni-state">
          <i /> {studyMethods.length} métodos catalogados
        </div>
      </div>

      {syncError && <p className="text-xs text-rose-500 mb-2">{syncError}</p>}

      {/* Filter bar */}
      <div className="ni-subjects">
        <button
          onClick={() => setCategoryFilter('all')}
          style={
            categoryFilter === 'all'
              ? { backgroundColor: currentPalette.primary, color: PALETTE_INK, borderRadius: '4px', padding: '2px 8px' }
              : undefined
          }
        >
          TODAS
        </button>
        {(Object.entries(CATEGORY_META) as [StudyMethod['category'], typeof CATEGORY_META[StudyMethod['category']]][]).map(([value, meta]) => {
          const active = categoryFilter === value;
          const Icon = meta.icon;
          return (
            <button
              key={value}
              onClick={() => setCategoryFilter(value)}
              style={
                active
                  ? { backgroundColor: currentPalette.primary, color: PALETTE_INK, borderRadius: '4px', padding: '2px 8px' }
                  : undefined
              }
            >
              <Icon className="w-3 h-3 inline mr-1" />
              {meta.label.toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* Methods list */}
      <div className="space-y-3">
        {filtered.map((method) => {
          const meta = CATEGORY_META[method.category];
          const isExpanded = expandedId === method.id;
          const Icon = meta.icon;

          return (
            <Panel
              key={method.id}
              subject="Química"
              className="ni-panel overflow-hidden"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : method.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-[var(--surface2)] transition-colors"
              >
                <div className="flex items-center min-w-0">
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center mr-3 shrink-0"
                    style={{ backgroundColor: 'var(--primary)', color: 'var(--ink-on-primary)' }}
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display font-medium text-xs text-[var(--text)] flex items-center flex-wrap gap-2">
                      {method.name}
                      {ACTIVE_IN_ENGINE.has(method.id) && (
                        <span className="inline-flex items-center text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                          Ativo no motor
                        </span>
                      )}
                    </h3>
                    <p className="text-[11px] text-[var(--dim)] mt-0.5 truncate">{method.summary}</p>
                  </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-[var(--dim)] shrink-0 ml-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 pt-1 border-t border-[var(--line)] space-y-4 text-xs">
                  {method.id === 'method_spaced_repetition' && (
                    <p className="p-3 rounded-xl border border-[var(--line)] bg-[var(--surface2)] text-[11px] text-[var(--dim)] leading-relaxed">
                      Já ativo: cada tópico tem seu próprio intervalo SM-2, recalculado a cada avaliação em Revisões Adaptativas ou resolução de questão.
                    </p>
                  )}
                  {method.id === 'method_interleaving' && (
                    <p className="p-3 rounded-xl border border-[var(--line)] bg-[var(--surface2)] text-[11px] text-[var(--dim)] leading-relaxed">
                      Já ativo: o motor intercala matérias e frentes cognitivas na rotina diária para evitar fadiga de foco contínuo.
                    </p>
                  )}

                  <div>
                    <p className="font-semibold text-[var(--text)] mb-2">Protocolo de aplicação</p>
                    <ol className="space-y-1.5">
                      {method.steps.map((step, i) => (
                        <li key={i} className="flex text-xs text-[var(--dim)]">
                          <span className="w-4 h-4 rounded-full bg-[var(--surface2)] border border-[var(--line)] flex items-center justify-center mr-2 shrink-0 text-[10px] font-mono text-[var(--text)]">
                            {i + 1}
                          </span>
                          <span className="text-[var(--text)]">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {method.bestFor.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-mono px-2 py-0.5 rounded-full border border-[var(--line)] bg-[var(--surface2)] text-[var(--dim)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div>
                    {!examples[method.id] && (
                      <button
                        onClick={() => fetchExample(method)}
                        disabled={loadingExampleFor === method.id}
                        className="flex items-center px-3 py-1.5 text-xs font-semibold text-[var(--primary)] border border-[var(--primary)] rounded-lg hover:bg-[var(--surface2)] disabled:opacity-50 transition-colors"
                      >
                        <Sparkles className={`w-3.5 h-3.5 mr-1.5 ${loadingExampleFor === method.id ? 'animate-pulse' : ''}`} />
                        {loadingExampleFor === method.id
                          ? 'Gerando exemplo...'
                          : `Exemplo aplicado ao meu ponto fraco (${weakestTopic.name})`}
                      </button>
                    )}
                    {examples[method.id] && (
                      <div className="p-3 rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/10 text-xs text-[var(--text)] leading-relaxed flex items-start gap-2">
                        <Sparkles className="w-4 h-4 mr-1 text-[var(--primary)] mt-0.5 shrink-0" />
                        <AiText text={examples[method.id]} className="flex-1" />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
