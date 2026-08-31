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
import { SubjectAtmosphere } from '../features/daily-plan/components/SubjectAtmosphere';

type Tab = 'pratica' | 'estrutura' | 'bancas' | 'erros' | 'checklist';

const TABS: { id: Tab; label: string }[] = [
  { id: 'pratica', label: 'Escrever e Reescrever' },
  { id: 'estrutura', label: 'Guia de Estrutura' },
  { id: 'bancas', label: 'Por Vestibular' },
  { id: 'erros', label: 'Erros que Limitam a Nota' },
  { id: 'checklist', label: 'Checklist de Revisão' },
];

const PART_ORDER: Array<'Introdução' | 'Desenvolvimento' | 'Conclusão'> = ['Introdução', 'Desenvolvimento', 'Conclusão'];

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

  return (
    <SubjectAtmosphere subject="redacao" focus={0.4}>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500" data-geometry="argument">
      <header>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2 h-2 rounded-full bg-ember-500 shadow-[0_0_8px_var(--color-ember-500)]" />
          <span className="text-[11px] font-mono tracking-widest uppercase text-ember-600 dark:text-ember-400">Ateliê de Escrita & Correção Analítica · Crivo</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold italic text-text-primary tracking-tight flex items-center gap-3">
          <PenLine className="w-7 h-7 text-action-primary" />
          Módulo de Redação
        </h1>
        <p className="text-text-secondary mt-1 max-w-2xl text-base">
          Estrutura de texto, proposta de intervenção, repertório produtivo e análise de critérios específicos por vestibular.
        </p>
      </header>

      <div className="flex gap-2 flex-wrap">
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono tracking-wide transition-all ${
                active
                  ? 'bg-action-primary text-warm-50 font-bold shadow-sm ring-1 ring-white/20'
                  : 'border border-border-subtle hover:border-text-primary text-text-muted hover:text-text-primary bg-surface-default/70'
              }`}
            >
              {t.label.toUpperCase()}
            </button>
          );
        })}
      </div>

      {tab === 'pratica' && (
        <section className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select value={board} onChange={(e) => setBoard(e.target.value)} className="border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-xl px-4 py-3">
              {['ENEM', 'Fuvest', 'Unicamp', 'Unesp/Vunesp', 'Famerp', 'Unifesp'].map((item) => <option key={item}>{item}</option>)}
            </select>
            <input value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="Tema ou proposta de redação" className="md:col-span-2 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-xl px-4 py-3" />
          </div>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
            <div className="flex justify-between text-sm mb-2"><span className="font-semibold">Primeira versão</span><span className="text-zinc-500">{draft.trim() ? draft.trim().split(/\s+/).length : 0} palavras</span></div>
            <textarea value={draft} onChange={(e) => { setDraft(e.target.value); setCorrection(null); }} rows={16} placeholder="Escreva sua redação aqui..." className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 leading-7 outline-none focus:ring-2 focus:ring-indigo-500" />
            <div className="flex flex-wrap gap-2 mt-3">
              <button onClick={saveDraft} className="flex items-center px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg"><Save className="w-4 h-4 mr-2" />Salvar rascunho</button>
              <button onClick={correctEssay} disabled={correcting || !theme.trim() || !draft.trim()} className="flex items-center px-4 py-2 bg-indigo-600 disabled:bg-zinc-300 text-white rounded-lg"><Sparkles className="w-4 h-4 mr-2" />{correcting ? 'Corrigindo...' : 'Corrigir com IA'}</button>
            </div>
            {practiceError && <p className="text-sm text-rose-500 mt-3">{practiceError}</p>}
          </div>

          {correction && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  ['O que funcionou', correction.acertos],
                  ['Primeiro ponto de ruptura', correction.rupturaPoint],
                  ['Por que compromete o texto', correction.porque],
                  ['Correção mínima', correction.correcaoMinima],
                ].map(([title, content]) => <div key={title} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-sm"><p className="font-semibold mb-1 text-indigo-700 dark:text-indigo-300">{title}</p><AiText text={content} /></div>)}
              </div>
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm"><p className="font-semibold mb-1">Versão-modelo para comparação</p><AiText text={correction.respostaModelo} /></div>
              <div className="bg-white dark:bg-zinc-900 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-5">
                <div className="flex justify-between text-sm mb-2"><span className="font-semibold">Reescrita obrigatória</span><span className="text-zinc-500">Corrija primeiro o ponto de ruptura indicado</span></div>
                <textarea value={rewrite} onChange={(e) => setRewrite(e.target.value)} rows={16} className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 leading-7 outline-none focus:ring-2 focus:ring-indigo-500" />
                <button onClick={saveDraft} disabled={rewrite.trim() === draft.trim()} className="mt-3 flex items-center px-4 py-2 bg-emerald-600 disabled:bg-zinc-300 text-white rounded-lg"><Save className="w-4 h-4 mr-2" />Salvar reescrita</button>
              </div>
            </div>
          )}
        </section>
      )}

      {tab === 'estrutura' && (
        <div className="space-y-8">
          {PART_ORDER.map((part) => (
            <section key={part} className="space-y-3">
              <h2 className="text-xl font-semibold">{part}</h2>
              <div className="space-y-3">
                {essayStructure
                  .filter((s) => s.part === part)
                  .map((s) => (
                    <div key={s.title} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
                      <h3 className="font-semibold text-sm">{s.title}</h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">{s.description}</p>
                    </div>
                  ))}
              </div>
            </section>
          ))}

          <section>
            <h2 className="text-xl font-semibold mb-1">Fórmula da Proposta de Intervenção</h2>
            <p className="text-sm text-zinc-500 mb-3">
              Obrigatória no ENEM, cobrada explicitamente pela Unifesp, e um diferencial forte nas demais mesmo quando não é exigida.
            </p>
            <div className="space-y-3">
              {interventionFormula.map((el) => (
                <div key={el.letter} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm flex items-start">
                  <span className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mr-4 shrink-0 font-semibold text-sm">
                    {el.letter}
                  </span>
                  <div>
                    <h3 className="font-semibold text-sm">{el.title}</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">{el.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-1 flex items-center">
              <MessageSquareQuote className="w-5 h-5 mr-2 text-indigo-500" />
              Repertório Sociocultural Produtivo
            </h2>
            <p className="text-sm text-zinc-500 mb-3">
              A diferença entre um repertório que soma pontos e um que só ocupa espaço.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  Produtivo
                </p>
                <ul className="space-y-1.5">
                  {repertoireGuidance.productive.map((p, i) => (
                    <li key={i} className="text-sm text-zinc-600 dark:text-zinc-400 flex">
                      <span className="mr-2 text-emerald-400">•</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
                <p className="text-sm font-semibold text-rose-600 dark:text-rose-400 mb-2 flex items-center">
                  <XCircle className="w-4 h-4 mr-1.5" />
                  Não-produtivo
                </p>
                <ul className="space-y-1.5">
                  {repertoireGuidance.nonProductive.map((p, i) => (
                    <li key={i} className="text-sm text-zinc-600 dark:text-zinc-400 flex">
                      <span className="mr-2 text-rose-400">•</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Frases de conexão prontas para usar</p>
              <div className="flex flex-wrap gap-2">
                {repertoireGuidance.connectivePhrases.map((phrase, i) => (
                  <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300">
                    {phrase}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {tab === 'bancas' && (
        <section className="space-y-3">
          {essayBoardProfiles.map((b) => {
            const isExpanded = expandedBoard === b.board;
            return (
              <div key={b.board} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
                <button
                  onClick={() => setExpandedBoard(isExpanded ? null : b.board)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <div className="min-w-0 flex items-center">
                    <h3 className="font-semibold truncate">{b.board}</h3>
                    {b.uncertain && <AlertTriangle className="w-3.5 h-3.5 ml-2 text-amber-500 shrink-0" />}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-zinc-400 shrink-0 ml-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
                    {b.note && (
                      <div className="flex items-start p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 text-xs">
                        <AlertTriangle className="w-3.5 h-3.5 mr-2 mt-0.5 shrink-0" />
                        <p>{b.note}</p>
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Formato</p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{b.format}</p>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Pontuação</p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{b.scoring}</p>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Critérios de correção</p>
                      <div className="space-y-2">
                        {b.criteria.map((c) => (
                          <div key={c.name} className="pl-3 border-l-2 border-indigo-100 dark:border-indigo-900/40">
                            <p className="text-sm font-medium">{c.name}</p>
                            <p className="text-sm text-zinc-500">{c.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 flex items-center">
                        <XCircle className="w-4 h-4 mr-1.5 text-rose-500" />
                        O que zera ou penaliza pesado
                      </p>
                      <ul className="space-y-1.5">
                        {b.zeroRules.map((r, i) => (
                          <li key={i} className="text-sm text-zinc-600 dark:text-zinc-400 flex">
                            <span className="mr-2 text-rose-400">•</span>
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-start p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300 text-sm">
                      <Lightbulb className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                      <p>{b.keyToMaxScore}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </section>
      )}

      {tab === 'erros' && (
        <section className="space-y-3">
          <p className="text-sm text-zinc-500 mb-2">
            Erros que aparecem de forma consistente em todas as bancas pesquisadas — proteger contra eles vale mais pontos do que qualquer truque isolado.
          </p>
          {commonMistakes.map((m) => (
            <div key={m.mistake} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-sm flex items-center">
                <XCircle className="w-4 h-4 mr-2 text-rose-500 shrink-0" />
                {m.mistake}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{m.why}</p>
            </div>
          ))}
        </section>
      )}

      {tab === 'checklist' && (
        <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-zinc-500 mb-4">
            Rode essa lista antes de considerar a redação pronta — no treino e, mentalmente, na prova.
          </p>
          <ul className="space-y-3">
            {revisionChecklist.map((item, i) => (
              <li key={i} className="flex items-start text-sm text-zinc-700 dark:text-zinc-300">
                <CheckCircle2 className="w-4 h-4 mr-2.5 mt-0.5 text-indigo-500 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}
      </div>
    </SubjectAtmosphere>
  );
}
