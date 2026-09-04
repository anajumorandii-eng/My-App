import React, { useState } from 'react';
import {
  essayStructure,
  interventionFormula,
  repertoireGuidance,
  essayBoardProfiles,
  commonMistakes,
  revisionChecklist,
} from '../data/essayModule';
import { PenLine, ChevronDown, Lightbulb, AlertTriangle, CheckCircle2, XCircle, MessageSquareQuote, Sparkles, Save } from 'lucide-react';
import { aiErrorMessage, requestAiText } from '../lib/aiClient';
import { AnswerCorrection, parseAnswerCorrection } from '../lib/tutorContracts';
import { AiText } from '../components/AiText';
import { Panel } from '../components/ui/Panel';
import { PALETTES, PALETTE_INK } from '../prototypes/NucleoInstrumentalPrototype';
import { SUBJECT_ICONS } from './Dashboard';

type Tab = 'pratica' | 'estrutura' | 'bancas' | 'erros' | 'checklist';

const TABS: { id: Tab; label: string }[] = [
  { id: 'pratica', label: 'Escrever e Reescrever' },
  { id: 'estrutura', label: 'Guia de Estrutura' },
  { id: 'bancas', label: 'Por Vestibular' },
  { id: 'erros', label: 'Erros que Limitam a Nota' },
  { id: 'checklist', label: 'Checklist de Revisão' },
];

const PART_ORDER: Array<'Introdução' | 'Desenvolvimento' | 'Conclusão'> = ['Introdução', 'Desenvolvimento', 'Conclusão'];
const REDACAO_PALETTE = PALETTES.Português;

export default function Redacao() {
  const [tab, setTab] = useState<Tab>('pratica');
  const [expandedBoard, setExpandedBoard] = useState<string | null>(essayBoardProfiles[0]?.board ?? null);
  const [board, setBoard] = useState('ENEM');
  const [theme, setTheme] = useState(() => localStorage.getItem('juju-essay-theme') ?? '');
  const [draft, setDraft] = useState(() => localStorage.getItem('juju-essay-draft') ?? '');
  const [rewrite, setRewrite] = useState(() => localStorage.getItem('juju-essay-rewrite') ?? '');
  const [correction, setCorrection] = useState<AnswerCorrection | null>(null);
  const [correcting, setCorrecting] = useState(false);
  const [practiceError, setPracticeError] = useState<string | null>(null);

  const saveDraft = () => {
    localStorage.setItem('juju-essay-theme', theme);
    localStorage.setItem('juju-essay-draft', draft);
    localStorage.setItem('juju-essay-rewrite', rewrite);
  };

  const correctEssay = async () => {
    if (!theme.trim() || !draft.trim()) return;
    saveDraft();
    setCorrecting(true);
    setPracticeError(null);
    try {
      const result = await requestAiText('answer-correction', {
        topic: `Redação — ${theme.trim()}`,
        subject: 'Língua Portuguesa / Redação',
        board,
        question: `Produza uma redação sobre o tema: ${theme.trim()}. Avalie tese, argumentação, coesão, repertório, adequação ao tema e ao perfil da banca ${board}.`,
        studentAnswer: draft.trim(),
      });
      setCorrection(parseAnswerCorrection(result.text));
      setRewrite(draft);
    } catch (error) {
      setPracticeError(aiErrorMessage(error));
    } finally {
      setCorrecting(false);
    }
  };

  const PenIcon = SUBJECT_ICONS['Português'] ?? PenLine;

  return (
    <div
      className="ni-main"
      style={{
        '--primary': REDACAO_PALETTE.primary,
        '--secondary': REDACAO_PALETTE.secondary,
        '--wash': REDACAO_PALETTE.wash,
      } as React.CSSProperties}
    >
      {/* Route Breadcrumb */}
      <div className="ni-route">
        <span>REDAÇÃO</span>
        <i />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[var(--primary)] text-[var(--ink-on-primary)]">
            <PenIcon className="w-3 h-3" />
          </span>
          ATELIÊ DE ESCRITA
        </span>
        <i />
        <b>TREINO DE REDAÇÃO</b>
      </div>

      {/* Main Title */}
      <div className="ni-title">
        <div>
          <h1>Escreva com estrutura, argumente com evidência.</h1>
          <p>Estrutura de texto, proposta de intervenção, repertório produtivo e análise de critérios específicos por vestibular.</p>
        </div>
        <div className="ni-state">
          <i /> ateliê de escrita · Crivo Redação
        </div>
      </div>

      {/* Tabs */}
      <div className="ni-subjects">
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={
                active
                  ? { backgroundColor: REDACAO_PALETTE.primary, color: PALETTE_INK, borderRadius: '4px', padding: '2px 8px' }
                  : undefined
              }
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Practice Tab */}
      {tab === 'pratica' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select
              value={board}
              onChange={(e) => setBoard(e.target.value)}
              className="border border-[var(--line)] bg-[var(--surface2)] text-[var(--text)] rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[var(--primary)]"
            >
              {['ENEM', 'Fuvest', 'Unicamp', 'Unesp/Vunesp', 'Famerp', 'Unifesp'].map((item) => (
                <option key={item} value={item} className="bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">{item}</option>
              ))}
            </select>
            <input
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="Tema ou proposta de redação..."
              className="md:col-span-2 border border-[var(--line)] bg-[var(--surface2)] text-[var(--text)] rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[var(--primary)]"
            />
          </div>

          <Panel subject="Português" className="ni-panel p-5">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="font-semibold text-[var(--text)]">Primeira versão (rascunho)</span>
              <span className="text-[var(--dim)] font-mono">{draft.trim() ? draft.trim().split(/\s+/).length : 0} palavras</span>
            </div>
            <textarea
              value={draft}
              onChange={(e) => { setDraft(e.target.value); setCorrection(null); }}
              rows={14}
              placeholder="Escreva sua redação aqui..."
              className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl p-4 text-xs text-[var(--text)] leading-relaxed outline-none focus:border-[var(--primary)]"
            />
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                onClick={saveDraft}
                className="flex items-center px-3 py-1.5 border border-[var(--line)] rounded-lg text-xs text-[var(--dim)] hover:text-[var(--text)] transition-colors"
              >
                <Save className="w-3.5 h-3.5 mr-1.5" />
                Salvar rascunho
              </button>
              <button
                onClick={correctEssay}
                disabled={correcting || !theme.trim() || !draft.trim()}
                className="flex items-center px-3.5 py-1.5 bg-[var(--primary)] text-[var(--ink-on-primary)] disabled:opacity-50 rounded-lg text-xs font-semibold transition-opacity"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                {correcting ? 'Corrigindo...' : 'Corrigir com IA'}
              </button>
            </div>
            {practiceError && <p className="text-xs text-rose-500 mt-2">{practiceError}</p>}
          </Panel>

          {correction && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  ['O que funcionou', correction.acertos],
                  ['Primeiro ponto de ruptura', correction.rupturaPoint],
                  ['Por que compromete o texto', correction.porque],
                  ['Correção mínima sugerida', correction.correcaoMinima],
                ].map(([title, content]) => (
                  <Panel key={title} subject="Português" className="ni-panel p-4 text-xs">
                    <p className="font-semibold mb-1 text-[var(--primary)]">{title}</p>
                    <AiText text={content} className="text-[var(--text)] leading-relaxed" />
                  </Panel>
                ))}
              </div>

              <Panel subject="Português" className="ni-panel p-5 text-xs">
                <p className="font-semibold mb-1 text-[var(--text)]">Versão-modelo para comparação</p>
                <AiText text={correction.respostaModelo} className="text-[var(--dim)] leading-relaxed" />
              </Panel>

              <Panel subject="Português" className="ni-panel p-5">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-semibold text-[var(--text)]">Reescrita obrigatória</span>
                  <span className="text-[var(--dim)]">Corrija primeiro o ponto de ruptura indicado</span>
                </div>
                <textarea
                  value={rewrite}
                  onChange={(e) => setRewrite(e.target.value)}
                  rows={14}
                  className="w-full bg-[var(--surface2)] border border-[var(--line)] rounded-xl p-4 text-xs text-[var(--text)] leading-relaxed outline-none focus:border-[var(--primary)]"
                />
                <button
                  onClick={saveDraft}
                  disabled={rewrite.trim() === draft.trim()}
                  className="mt-3 flex items-center px-4 py-2 bg-emerald-600 disabled:opacity-50 text-white rounded-lg text-xs font-semibold"
                >
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                  Salvar reescrita
                </button>
              </Panel>
            </div>
          )}
        </div>
      )}

      {/* Structure Guide Tab */}
      {tab === 'estrutura' && (
        <div className="space-y-6">
          {PART_ORDER.map((part) => (
            <section key={part} className="space-y-3">
              <h2 className="font-display font-medium text-sm text-[var(--text)]">{part}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {essayStructure
                  .filter((s) => s.part === part)
                  .map((s) => (
                    <Panel key={s.title} subject="Português" interactive className="ni-panel p-4">
                      <h3 className="font-semibold text-xs text-[var(--text)]">{s.title}</h3>
                      <p className="text-xs text-[var(--dim)] mt-0.5 leading-relaxed">{s.description}</p>
                    </Panel>
                  ))}
              </div>
            </section>
          ))}

          <section>
            <h2 className="font-display font-medium text-sm text-[var(--text)] mb-1">Fórmula da Proposta de Intervenção</h2>
            <p className="text-xs text-[var(--dim)] mb-3">
              Obrigatória no ENEM e cobrada explicitamente pela Unifesp.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {interventionFormula.map((el) => (
                <Panel key={el.letter} subject="Português" interactive className="ni-panel p-4 flex items-start gap-3">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-bold text-xs font-mono"
                    style={{ backgroundColor: REDACAO_PALETTE.primary, color: PALETTE_INK }}
                  >
                    {el.letter}
                  </span>
                  <div>
                    <h3 className="font-semibold text-xs text-[var(--text)]">{el.title}</h3>
                    <p className="text-xs text-[var(--dim)] mt-0.5 leading-relaxed">{el.description}</p>
                  </div>
                </Panel>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display font-medium text-sm text-[var(--text)] mb-1 flex items-center">
              <MessageSquareQuote className="w-4 h-4 mr-2 text-[var(--primary)]" />
              Repertório Sociocultural Produtivo
            </h2>
            <p className="text-xs text-[var(--dim)] mb-3">
              A diferença entre um repertório que soma pontos e um que só ocupa espaço.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Panel subject="Biologia" className="ni-panel p-5">
                <p className="text-xs font-semibold text-emerald-400 mb-2 flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                  Produtivo
                </p>
                <ul className="space-y-1.5">
                  {repertoireGuidance.productive.map((p, i) => (
                    <li key={i} className="text-xs text-[var(--dim)] flex items-start">
                      <span className="mr-2 text-emerald-400">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </Panel>
              <Panel subject="História" className="ni-panel p-5">
                <p className="text-xs font-semibold text-[#e08391] mb-2 flex items-center">
                  <XCircle className="w-3.5 h-3.5 mr-1.5" />
                  Não-produtivo
                </p>
                <ul className="space-y-1.5">
                  {repertoireGuidance.nonProductive.map((p, i) => (
                    <li key={i} className="text-xs text-[var(--dim)] flex items-start">
                      <span className="mr-2 text-[#e08391]">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </Panel>
            </div>
            <Panel subject="Português" className="ni-panel p-4 mt-3">
              <p className="text-xs font-semibold text-[var(--text)] mb-2">Conectivos e frases de ligação prontas</p>
              <div className="flex flex-wrap gap-2">
                {repertoireGuidance.connectivePhrases.map((phrase, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-mono px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: REDACAO_PALETTE.primary, color: PALETTE_INK }}
                  >
                    {phrase}
                  </span>
                ))}
              </div>
            </Panel>
          </section>
        </div>
      )}

      {/* Boards Tab */}
      {tab === 'bancas' && (
        <section className="space-y-3">
          {essayBoardProfiles.map((b) => {
            const isExpanded = expandedBoard === b.board;
            return (
              <Panel key={b.board} subject="Português" className="ni-panel overflow-hidden">
                <button
                  onClick={() => setExpandedBoard(isExpanded ? null : b.board)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-[var(--surface2)] transition-colors"
                >
                  <div className="min-w-0 flex items-center">
                    <h3 className="font-display font-medium text-sm text-[var(--text)] truncate">{b.board}</h3>
                    {b.uncertain && <AlertTriangle className="w-3.5 h-3.5 ml-2 text-amber-400 shrink-0" />}
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-[var(--dim)] shrink-0 ml-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-[var(--line)] space-y-3">
                    {b.note && (
                      <div className="flex items-start p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                        <AlertTriangle className="w-3.5 h-3.5 mr-1.5 mt-0.5 shrink-0 text-amber-400" />
                        <p>{b.note}</p>
                      </div>
                    )}

                    <div>
                      <p className="text-xs font-semibold text-[var(--text)] mb-0.5">Formato</p>
                      <p className="text-xs text-[var(--dim)] leading-relaxed">{b.format}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-[var(--text)] mb-0.5">Pontuação</p>
                      <p className="text-xs text-[var(--dim)] leading-relaxed">{b.scoring}</p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-[var(--text)] mb-1">Critérios de correção</p>
                      <div className="space-y-1.5">
                        {b.criteria.map((c) => (
                          <div key={c.name} className="pl-3 border-l-2 border-[var(--primary)]/40">
                            <p className="text-xs font-medium text-[var(--text)]">{c.name}</p>
                            <p className="text-[11px] text-[var(--dim)]">{c.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-[#e08391] mb-1 flex items-center">
                        <XCircle className="w-3.5 h-3.5 mr-1 text-[#e08391]" />
                        O que zera ou penaliza pesado
                      </p>
                      <ul className="space-y-1">
                        {b.zeroRules.map((r, i) => (
                          <li key={i} className="text-xs text-[var(--dim)] flex items-start">
                            <span className="mr-2 text-[#e08391]">•</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-lg border border-[var(--primary)]/30 bg-[var(--primary)]/10 text-xs text-[var(--text)] flex items-start gap-2">
                      <Lightbulb className="w-3.5 h-3.5 text-[var(--primary)] shrink-0 mt-0.5" />
                      <p className="leading-relaxed">{b.keyToMaxScore}</p>
                    </div>
                  </div>
                )}
              </Panel>
            );
          })}
        </section>
      )}

      {/* Common Mistakes Tab */}
      {tab === 'erros' && (
        <section className="space-y-3">
          <p className="text-xs text-[var(--dim)] mb-2">
            Erros que aparecem de forma consistente em todas as bancas pesquisadas — proteger contra eles vale mais pontos do que qualquer truque isolado.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {commonMistakes.map((m) => (
              <Panel key={m.mistake} subject="Português" interactive className="ni-panel p-4">
                <h3 className="font-semibold text-xs text-[#e08391] flex items-center">
                  <XCircle className="w-3.5 h-3.5 mr-1.5 shrink-0 text-[#e08391]" />
                  {m.mistake}
                </h3>
                <p className="text-xs text-[var(--dim)] mt-1 leading-relaxed">{m.why}</p>
              </Panel>
            ))}
          </div>
        </section>
      )}

      {/* Checklist Tab */}
      {tab === 'checklist' && (
        <Panel subject="Português" className="ni-panel p-6">
          <p className="text-xs text-[var(--dim)] mb-4">
            Rode essa lista antes de considerar a redação pronta — no treino e, mentalmente, na prova.
          </p>
          <ul className="space-y-3">
            {revisionChecklist.map((item, i) => (
              <li key={i} className="flex items-start text-xs text-[var(--text)]">
                <CheckCircle2 className="w-4 h-4 mr-2.5 mt-0.5 text-emerald-400 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </div>
  );
}
