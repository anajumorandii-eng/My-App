import { buildReviewInsight } from '../lib/reviewInsights';
import type { TopicMastery } from '../types';

export function ReviewInsightCard({ mastery }: { mastery: TopicMastery }) {
  const insight = buildReviewInsight(mastery);
  return <details className="mt-3 rounded-lg border border-[var(--line)] p-3">
    <summary className="cursor-pointer text-sm font-semibold">Insight de revisão · {insight.minutes} min · {insight.title}</summary>
    <div className="space-y-2 mt-3 text-xs leading-relaxed">
      <p><b>Evidência disponível:</b> {insight.evidence}</p>
      <p><b>O que fazer:</b> {insight.action}</p>
      <p><b>Como conferir:</b> {insight.success}</p>
    </div>
  </details>;
}
