import React, { useMemo, useState } from 'react';
import { AlertTriangle, ArrowRight, CheckCircle2, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import { deriveSummaryErrorEntries } from '../lib/summaryStudy';
import type { InteractiveSummary, SummaryProgressMap } from '../types/summary';

type ErrorFilter = 'ativos' | 'resolvidos' | 'todos';

export default function SummaryErrorsPanel({ progress, summaries }: { progress: SummaryProgressMap; summaries: InteractiveSummary[] }) {
  const [filter, setFilter] = useState<ErrorFilter>('ativos');
  const entries = useMemo(() => deriveSummaryErrorEntries(progress, summaries), [progress, summaries]);
  const filtered = entries.filter((entry) => filter === 'todos' || (filter === 'resolvidos' ? entry.resolved : !entry.resolved));

  return <section aria-labelledby="summary-errors-title" className="space-y-4">
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
      <div><p className="text-xs font-bold uppercase tracking-wide text-indigo-600">Recuperação ativa</p><h2 id="summary-errors-title" className="text-xl font-bold mt-1">Erros dos resumos</h2><p className="text-sm text-zinc-500 mt-1">Uma entrada por pergunta, com todas as tentativas preservadas.</p></div>
      <label className="text-sm"><span className="sr-only">Filtrar erros dos resumos</span><select aria-label="Filtrar erros dos resumos" value={filter} onChange={(event) => setFilter(event.target.value as ErrorFilter)} className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2"><option value="ativos">Ativos</option><option value="resolvidos">Resolvidos</option><option value="todos">Todos</option></select></label>
    </div>
    {filtered.length === 0 && <div role="status" className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 p-8 text-center text-zinc-500">Nenhum erro de resumo neste filtro.</div>}
    {filtered.map((entry) => <article key={entry.id} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
      <div className="flex flex-wrap items-center gap-2"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${entry.resolved ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300'}`}>{entry.resolved ? 'Resolvido em nova tentativa' : entry.outcome === 'parcial' ? 'Resposta parcial' : 'Resposta incorreta'}</span><span className="text-xs text-zinc-500">{entry.subject} · {entry.topic}</span></div>
      <h3 className="font-bold mt-3">{entry.title}</h3><p className="mt-2 text-sm leading-6">{entry.questionPrompt}</p>
      <dl className="grid sm:grid-cols-2 gap-2 mt-4 text-xs text-zinc-500"><div><dt className="font-semibold text-zinc-700 dark:text-zinc-300">Bancas</dt><dd>{entry.boards.join(', ') || 'Não disponível'}</dd></div><div><dt className="font-semibold text-zinc-700 dark:text-zinc-300">Materiais de origem</dt><dd>{entry.materialIds.join(', ') || 'Não disponível'}</dd></div></dl>
      {entry.firstMissingElement && <p className="mt-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 p-3 text-sm"><strong>Primeiro elo ausente:</strong> {entry.firstMissingElement}</p>}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><span className="inline-flex items-center text-xs text-zinc-500"><History className="w-4 h-4 mr-1.5"/>{entry.attempts.length} {entry.attempts.length === 1 ? 'tentativa' : 'tentativas'}</span>{entry.href ? <Link to={entry.href} className="inline-flex items-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white">Retomar pergunta <ArrowRight className="w-4 h-4 ml-2"/></Link> : <span className="inline-flex items-center text-sm text-amber-700 dark:text-amber-300"><AlertTriangle className="w-4 h-4 mr-2"/>O conteúdo original não está mais disponível.</span>}</div>
      {entry.resolved && <p className="mt-3 inline-flex items-center text-sm text-emerald-700 dark:text-emerald-300"><CheckCircle2 className="w-4 h-4 mr-2"/>O histórico anterior foi preservado.</p>}
    </article>)}
  </section>;
}
