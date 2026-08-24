import React, { useMemo } from 'react';
import { AlertTriangle, ArrowRight, CalendarClock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getScheduledSummaryReviews } from '../lib/summaryStudy';
import type { InteractiveSummary, SummaryProgressMap } from '../types/summary';

export default function SummaryReviewsPanel({ progress, summaries, now = new Date() }: { progress: SummaryProgressMap; summaries: InteractiveSummary[]; now?: Date }) {
  const reviews = useMemo(() => getScheduledSummaryReviews(progress, summaries, now), [progress, summaries, now]);
  return <section aria-labelledby="summary-reviews-title" className="space-y-4">
    <div><p className="text-xs font-bold uppercase tracking-wide text-indigo-600">Repetição espaçada</p><h2 id="summary-reviews-title" className="text-xl font-bold mt-1">Revisões de resumos</h2><p className="text-sm text-zinc-500 mt-1">A revisão só é concluída quando você responde novamente.</p></div>
    {reviews.length === 0 && <div role="status" className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 p-8 text-center text-zinc-500">Nenhuma revisão de resumo programada.</div>}
    {reviews.map((review) => <article key={review.id} className={`rounded-2xl border p-5 ${review.isDue ? 'border-amber-300 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20' : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'}`}>
      <div className="flex flex-wrap gap-2 items-center"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${review.isDue ? 'bg-amber-200 text-amber-900 dark:bg-amber-900/50 dark:text-amber-200' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'}`}>{review.isDue ? 'Revisão vencida' : `Programada para ${new Date(review.nextReviewAt).toLocaleDateString('pt-BR')}`}</span><span className="text-xs text-zinc-500">Intervalo: {review.intervalDays} dias</span></div>
      <h3 className="font-bold mt-3">{review.summaryTitle}</h3><p className="text-sm text-zinc-500 mt-1">{review.subject} · {review.topic}</p><p className="text-sm mt-3">{review.questionPrompt}</p>
      <div className="mt-4">{review.href ? <Link to={review.href} className="inline-flex items-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white">Responder novamente <ArrowRight className="w-4 h-4 ml-2"/></Link> : <span className="inline-flex items-center text-sm text-amber-700 dark:text-amber-300"><AlertTriangle className="w-4 h-4 mr-2"/>Material removido; histórico preservado.</span>}</div>
    </article>)}
  </section>;
}
