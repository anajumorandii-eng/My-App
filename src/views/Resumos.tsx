import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, Search, Star, ChevronDown, ChevronUp, Check, AlertTriangle, CloudOff, ExternalLink, ArrowLeft, Brain } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { interactiveSummaries } from '../data/interactiveSummaries';
import { evaluateRetrievalAnswer, filterSummaries, getReadingProgress } from '../lib/summaryEngine';
import { applySummaryAttempt } from '../lib/summaryStudy';
import { useSummaryProgress } from '../hooks/useSummaryProgress';
import { SubjectAtmosphere } from '../features/daily-plan/components/SubjectAtmosphere';
import { getSubjectProfile } from '../design-system/crivoSubjects';
import type { StudyStatus, SummaryDepth } from '../types/summary';
import { PALETTES, PALETTE_INK } from '../prototypes/NucleoInstrumentalPrototype';
import { SUBJECT_ICONS } from './Dashboard';

const LIT_PALETTE = PALETTES.Literatura;


const modeLabels: Record<SummaryDepth, string> = { rapida: 'Revisão rápida', aprofundamento: 'Aprofundamento', prova: 'Como cai na prova' };
const stageLabels = { intuicao: 'Intuição', conceito: 'Conceito', aplicacao: 'Aplicação', exercicio: 'Exercício', estrategia: 'Estratégia de prova' };
const statusLabels: Record<StudyStatus, string> = { 'nao-iniciado': 'Não iniciado', 'em-revisao': 'Em revisão', dificuldade: 'Com dificuldade', dominado: 'Dominado' };
const evidenceStyles = { fato: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300', contexto: 'bg-sky-50 text-sky-800 dark:bg-sky-950/40 dark:text-sky-300', interpretacao: 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300', hipotese: 'bg-violet-50 text-violet-800 dark:bg-violet-950/40 dark:text-violet-300' };

export default function Resumos() {
  const { progress, update, loading, syncError, isCloudSynced } = useSummaryProgress();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedSummaryId = searchParams.get('summary');
  const requestedQuestionId = searchParams.get('question');
  const [selectedId, setSelectedId] = useState<string | null>(requestedSummaryId);
  const [query, setQuery] = useState('');
  const [subject, setSubject] = useState(() => searchParams.get('subject') ?? '');
  const [board, setBoard] = useState(() => searchParams.get('board') ?? '');
  const [phase, setPhase] = useState(() => searchParams.get('phase') ?? '');
  const [status, setStatus] = useState<StudyStatus | ''>('');
  const [mode, setMode] = useState<SummaryDepth>(() => (localStorage.getItem('juju_summary_mode') as SummaryDepth) || 'rapida');
  const [expanded, setExpanded] = useState<string[]>([]); const [drafts, setDrafts] = useState<Record<string, string>>({}); const [feedbackId, setFeedbackId] = useState<string | null>(null);
  useEffect(() => { localStorage.setItem('juju_summary_mode', mode); }, [mode]);
  const filtered = useMemo(() => filterSummaries(interactiveSummaries, { query, subject, board, phase, status }, progress), [query, subject, board, phase, status, progress]);
  const summary = interactiveSummaries.find((item) => item.id === selectedId);
  const subjects = [...new Set(interactiveSummaries.map((item) => item.subject))];
  const boards = [...new Set(interactiveSummaries.flatMap((item) => item.boards.map((b) => b.board)))];
  useEffect(() => { if (requestedSummaryId) setSelectedId(requestedSummaryId); }, [requestedSummaryId]);
  useEffect(() => {
    if (!summary || !requestedQuestionId) return;
    const question = summary.retrieval.find((item) => item.id === requestedQuestionId);
    if (question?.sectionId) setExpanded((ids) => [...new Set([...ids, question.sectionId!])]);
    const frame = requestAnimationFrame(() => document.getElementById(`question-${requestedQuestionId}`)?.querySelector('textarea')?.focus());
    return () => cancelAnimationFrame(frame);
  }, [summary, requestedQuestionId]);

  if (loading) return <div role="status" className="py-24 text-center text-zinc-500"><BookOpen className="w-8 h-8 mx-auto mb-3 animate-pulse"/>Carregando seus resumos e progresso…</div>;

  if (requestedSummaryId && !summary) return <div className="space-y-5"><button onClick={() => { setSearchParams({}); setSelectedId(null); }} className="inline-flex items-center text-sm font-medium text-indigo-700 dark:text-indigo-300"><ArrowLeft className="w-4 h-4 mr-2"/>Voltar à biblioteca</button><div role="alert" className="rounded-2xl border border-amber-300 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20 p-6"><h1 className="font-bold">Resumo indisponível</h1><p className="text-sm mt-2">Este resumo ou pergunta não está mais disponível. O histórico permanece preservado no Caderno de Erros.</p></div></div>;

  if (summary) {
    const itemProgress = progress[summary.id] ?? { readSectionIds: [], status: 'nao-iniciado' as const, important: false, answers: [] };
    const visibleSections = summary.sections.filter((section) => mode === 'aprofundamento' ? true : section.depth === mode || (mode === 'prova' && section.stage === 'exercicio'));
    const markRead = (id: string) => update(summary.id, (current) => ({ ...current, readSectionIds: [...new Set([...current.readSectionIds, id])], status: current.status === 'nao-iniciado' ? 'em-revisao' : current.status, lastOpenedAt: new Date().toISOString() }));
    const subjectProfile = getSubjectProfile(summary.subject);
    return (
      <SubjectAtmosphere subject={summary.subject} focus={0.4}>
        <div className="space-y-6 pb-16" data-geometry={subjectProfile.fieldType}>
          <button onClick={() => { setSearchParams({}); setSelectedId(null); }} className="inline-flex items-center text-sm font-medium text-indigo-700 dark:text-indigo-300 hover:underline"><ArrowLeft className="w-4 h-4 mr-2"/>Voltar à biblioteca</button>
      {syncError && <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">{syncError}</div>}
      {requestedQuestionId && !summary.retrieval.some((item) => item.id === requestedQuestionId) && <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20 p-3 text-sm text-amber-900 dark:text-amber-200">A pergunta indicada não está mais disponível. O restante do resumo continua acessível.</div>}
      <header className="rounded-3xl bg-zinc-950 text-white p-6 sm:p-8">
        <div className="flex flex-wrap gap-2 mb-4"><span className="rounded-full bg-indigo-500 px-3 py-1 text-xs font-bold">Prioridade Fuvest</span><span className="rounded-full bg-white/10 px-3 py-1 text-xs">{summary.subject} · {summary.topic}</span>{summary.currentAffairs && <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-200">Verificado até {summary.currentAffairs.verifiedAt.split('-').reverse().join('/')}</span>}</div>
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">{summary.title}</h1><p className="mt-3 max-w-3xl text-zinc-300">{summary.overview}</p>
        <div className="mt-6 h-2 rounded-full bg-white/15" aria-label={`Progresso de leitura: ${getReadingProgress(summary, itemProgress)}%`}><div className="h-2 rounded-full bg-indigo-400" style={{ width: `${getReadingProgress(summary, itemProgress)}%` }}/></div>
        <div className="mt-4 flex flex-wrap gap-3"><select aria-label="Estado de domínio" value={itemProgress.status} onChange={(e) => update(summary.id, (p) => ({ ...p, status: e.target.value as StudyStatus }))} className="rounded-lg bg-white/10 px-3 py-2 text-sm"><option className="text-zinc-900" value="nao-iniciado">Não iniciado</option><option className="text-zinc-900" value="em-revisao">Em revisão</option><option className="text-zinc-900" value="dificuldade">Com dificuldade</option><option className="text-zinc-900" value="dominado">Dominado</option></select><button aria-pressed={itemProgress.important} onClick={() => update(summary.id, (p) => ({ ...p, important: !p.important }))} className="inline-flex items-center rounded-lg bg-white/10 px-3 py-2 text-sm"><Star className={`w-4 h-4 mr-2 ${itemProgress.important ? 'fill-amber-400 text-amber-400' : ''}`}/>Importante</button></div>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        <aside className="lg:sticky lg:top-6 lg:self-start space-y-4"><div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4"><p className="text-xs font-bold uppercase tracking-wide text-zinc-500 mb-3">Modo de estudo</p>{(Object.keys(modeLabels) as SummaryDepth[]).map((key) => <button key={key} onClick={() => setMode(key)} className={`w-full text-left rounded-lg px-3 py-2 text-sm mb-1 ${mode === key ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>{modeLabels[key]}</button>)}</div><nav aria-label="Índice do resumo" className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4"><p className="text-xs font-bold uppercase tracking-wide text-zinc-500 mb-3">Nesta leitura</p>{visibleSections.map((section) => <a key={section.id} href={`#${section.id}`} className="block py-1.5 text-sm hover:text-indigo-600">{itemProgress.readSectionIds.includes(section.id) ? '✓ ' : ''}{section.title}</a>)}</nav></aside>
        <main className="space-y-4">
          <section className="rounded-2xl border border-indigo-200 bg-indigo-50/70 dark:border-indigo-900 dark:bg-indigo-950/20 p-5"><h2 className="font-bold mb-2">Pré-requisitos</h2><p className="text-sm text-zinc-700 dark:text-zinc-300">{summary.prerequisites.join(' · ')}</p></section>
          {visibleSections.map((section) => { const isOpen = expanded.includes(section.id); const read = itemProgress.readSectionIds.includes(section.id); return <article id={section.id} key={section.id} className="scroll-mt-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden"><button aria-expanded={isOpen} onClick={() => setExpanded((ids) => isOpen ? ids.filter((id) => id !== section.id) : [...ids, section.id])} className="w-full p-5 flex items-start justify-between text-left"><div><span className="text-xs font-bold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">{stageLabels[section.stage]}</span><h2 className="text-lg font-bold mt-1">{section.title}</h2></div>{isOpen ? <ChevronUp/> : <ChevronDown/>}</button>{isOpen && <div className="px-5 pb-5"><div className="flex flex-wrap gap-2 mb-3">{section.evidenceKind && <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${evidenceStyles[section.evidenceKind]}`}>{section.evidenceKind === 'fato' ? 'Fato confirmado' : section.evidenceKind === 'contexto' ? 'Contexto estrutural' : section.evidenceKind === 'interpretacao' ? 'Interpretação sustentada' : 'Hipótese / cenário'}</span>}</div><p className="leading-7 text-zinc-700 dark:text-zinc-300">{section.content}</p>{section.callout && <p className="mt-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 p-3 text-sm text-amber-900 dark:text-amber-200">{section.callout}</p>}<button disabled={read} onClick={() => markRead(section.id)} className="mt-5 inline-flex items-center rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-2 text-sm font-medium disabled:opacity-60"><Check className="w-4 h-4 mr-2"/>{read ? 'Seção concluída' : 'Marcar como lida'}</button></div>}</article>; })}
          <section className="rounded-2xl border-2 border-indigo-200 dark:border-indigo-900 bg-white dark:bg-zinc-900 p-5 sm:p-6"><div className="flex items-center mb-2 text-indigo-700 dark:text-indigo-300"><Brain className="w-5 h-5 mr-2"/><h2 className="font-bold">Recuperação ativa</h2></div><p className="text-sm text-zinc-500 mb-5">O gabarito não aparece antes da sua tentativa. A correção preserva o que você acertou e aponta o primeiro elo ausente.</p>{summary.retrieval.map((question) => { const evaluation = feedbackId === question.id ? evaluateRetrievalAnswer(question, drafts[question.id] ?? '') : null; return <div id={`question-${question.id}`} key={question.id} className={`space-y-3 scroll-mt-6 rounded-xl ${requestedQuestionId === question.id ? 'ring-2 ring-indigo-400 p-3' : ''}`}><p className="font-semibold">{question.prompt}</p><textarea aria-label="Sua resposta" data-question-id={question.id} value={drafts[question.id] ?? ''} onChange={(e) => { setDrafts((d) => ({ ...d, [question.id]: e.target.value })); setFeedbackId(null); }} rows={5} className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent p-3" placeholder="Construa o raciocínio sem consultar o texto…"/><details><summary className="cursor-pointer text-sm text-zinc-500">Preciso de uma pista</summary><p className="mt-2 text-sm">{question.hint}</p></details><button disabled={!drafts[question.id]?.trim()} onClick={() => { const result = evaluateRetrievalAnswer(question, drafts[question.id]); update(summary.id, (p) => applySummaryAttempt({ [summary.id]: p }, summary, question, { answer: drafts[question.id], ...result })[summary.id]); setFeedbackId(question.id); }} className="rounded-xl bg-indigo-600 px-4 py-2.5 text-white font-semibold disabled:opacity-40">Enviar para correção</button>{evaluation && <div role="status" className="rounded-xl bg-zinc-100 dark:bg-zinc-800 p-4 text-sm"><p><strong>Você preservou:</strong> {evaluation.matchedElements.length ? evaluation.matchedElements.join(', ') : 'ainda nenhum elemento-chave identificável'}</p>{evaluation.firstMissingElement ? <p className="mt-2 text-amber-700 dark:text-amber-300"><strong>Primeiro elo ausente:</strong> {evaluation.firstMissingElement}. Reescreva incluindo esse mecanismo.</p> : <div className="mt-2 text-emerald-700 dark:text-emerald-300"><p><strong>Estrutura essencial completa.</strong></p><p className="mt-2"><strong>Transferência:</strong> {question.transferPrompt}</p></div>}</div>}</div>; })}</section>
          <section className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5"><h2 className="font-bold mb-3">Fontes e materiais usados</h2><div className="space-y-2">{summary.sources.map((source) => <div key={source.label} className="text-sm flex items-start justify-between gap-3"><span>{source.label}{source.materialId && <span className="text-zinc-500"> · {source.materialId}</span>}</span>{source.url && <a href={source.url} target="_blank" rel="noreferrer" className="text-indigo-600 inline-flex items-center">Abrir <ExternalLink className="w-3.5 h-3.5 ml-1"/></a>}</div>)}</div></section>
        </main>
      </div>
      </div>
      </SubjectAtmosphere>
    );
  }

  const LitIcon = SUBJECT_ICONS['Literatura'] ?? BookOpen;

  return (
    <div
      className="ni-main"
      style={{
        '--primary': LIT_PALETTE.primary,
        '--secondary': LIT_PALETTE.secondary,
        '--wash': LIT_PALETTE.wash,
      } as React.CSSProperties}
    >
      {/* Breadcrumb */}
      <div className="ni-route">
        <span>LIBRARY</span>
        <i />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[var(--primary)] text-[var(--ink-on-primary)]">
            <LitIcon className="w-3 h-3" />
          </span>
          LITERATURA
        </span>
        <i />
        <b>RESUMOS INTERATIVOS</b>
      </div>

      {/* Main Title */}
      <div className="ni-title">
        <div>
          <h1>Compreender, recuperar, aplicar.</h1>
          <p>Resumos com prioridade explícita para Fuvest — recuperação ativa integrada ao motor de repetição espaçada.</p>
        </div>
        <div className="ni-state">
          <i /> perfil {LIT_PALETTE.family} · {isCloudSynced ? 'sincronizado' : 'local'}
        </div>
      </div>

      {syncError && <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"><AlertTriangle className="inline w-4 h-4 mr-2"/>{syncError}</div>}
      <section aria-label="Filtros" className="rounded-2xl border border-[var(--line)] bg-[var(--surface2)] p-4"><div className="relative mb-3"><Search className="absolute left-3 top-3 w-4 h-4 text-[var(--dim)]"/><input value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Buscar nos resumos" placeholder="Buscar conceito, mecanismo ou pegadinha…" className="w-full rounded-xl border border-[var(--line)] bg-transparent py-2.5 pl-10 pr-3 text-[var(--text)]"/></div><div className="grid grid-cols-2 lg:grid-cols-4 gap-2"><select aria-label="Filtrar por disciplina" value={subject} onChange={(e) => setSubject(e.target.value)} className="rounded-lg border border-[var(--line)] bg-transparent p-2 text-[var(--text)]"><option value="">Todas as disciplinas</option>{subjects.map((x) => <option key={x}>{x}</option>)}</select><select aria-label="Filtrar por banca" value={board} onChange={(e) => setBoard(e.target.value)} className="rounded-lg border border-[var(--line)] bg-transparent p-2 text-[var(--text)]"><option value="">Todas as bancas</option>{boards.map((x) => <option key={x}>{x}</option>)}</select><select aria-label="Filtrar por fase" value={phase} onChange={(e) => setPhase(e.target.value)} className="rounded-lg border border-[var(--line)] bg-transparent p-2 text-[var(--text)]"><option value="">Todas as fases</option><option value="primeira">1ª fase</option><option value="segunda">2ª fase</option><option value="unica">Fase única</option></select><select aria-label="Filtrar por domínio" value={status} onChange={(e) => setStatus(e.target.value as StudyStatus | '')} className="rounded-lg border border-[var(--line)] bg-transparent p-2 text-[var(--text)]"><option value="">Todos os estados</option>{Object.entries(statusLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></div></section>
      {filtered.length === 0 ? <div className="rounded-2xl border border-dashed border-[var(--line)] py-16 text-center"><Search className="w-8 h-8 mx-auto text-[var(--dim)] mb-3"/><h2 className="font-bold text-[var(--text)]">Nenhum resumo encontrado</h2><p className="text-sm text-[var(--dim)] mt-1">Remova um filtro ou tente outro termo.</p></div> : <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{filtered.map((item) => { const p = progress[item.id]; return <button key={item.id} onClick={() => { setSelectedId(item.id); setSearchParams({ summary: item.id }); setExpanded(item.sections.filter((s) => s.depth === mode).slice(0, 1).map((s) => s.id)); update(item.id, (current) => ({ ...current, lastOpenedAt: new Date().toISOString() })); }} className="text-left rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 hover:border-[var(--primary)] focus-visible:outline-none focus-visible:ring-2" style={{'--tw-ring-color': LIT_PALETTE.primary} as React.CSSProperties}><div className="flex justify-between gap-3"><span className="text-xs font-bold uppercase tracking-wide" style={{color: LIT_PALETTE.primary}}>{item.subject}</span>{p?.important && <Star className="w-4 h-4 fill-amber-400 text-amber-400"/>}</div><h2 className="font-bold text-xl mt-2 text-[var(--text)]">{item.title}</h2><p className="text-sm text-[var(--dim)] mt-2">{item.overview}</p><div className="flex flex-wrap gap-2 mt-4"><span className="rounded-full px-2.5 py-1 text-[10px] font-mono" style={{backgroundColor: LIT_PALETTE.primary, color: PALETTE_INK}}>Fuvest · 1ª e 2ª fases</span>{item.currentAffairs && <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 text-xs">A.T.U.A.L.</span>}</div><div className="mt-4 flex items-center justify-between text-xs text-[var(--dim)]"><span>{statusLabels[p?.status ?? 'nao-iniciado']}</span><span>{getReadingProgress(item, p)}% lido</span></div></button>; })}</div>}
    </div>
  );
}
