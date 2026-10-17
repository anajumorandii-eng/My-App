import React from 'react';
import { Link } from 'react-router-dom';
import { interactiveSummaries } from '../data/interactiveSummaries';
import { mockTopics } from '../data/mockData';
import { prioritySummarySubject } from '../lib/actionablePriorities';

export function StudyJourneyLinks({ topicId, chapter }: { topicId: string; chapter?: string }) {
  const query = new URLSearchParams({ topic: topicId });
  if (chapter) query.set('chapter', chapter);
  const topic = mockTopics.find(item => item.id === topicId);
  const summary = topic && interactiveSummaries.find(item => item.subject === prioritySummarySubject(topic) && (item.topic === topic.name || topic.chapters?.includes(item.topic)) && (!chapter || item.topic === chapter));
  const links = [
    ...(summary ? [{ label: 'Ler o capítulo', href: `/resumos?summary=${encodeURIComponent(summary.id)}` }, { label: 'Explorar o visual', href: `/visual?summary=${encodeURIComponent(summary.id)}` }] : []),
    { label: 'Explicar ao tutor', href: `/tutor?${query}` },
    { label: 'Aprofundar a estratégia', href: `/estrategias?${query}` },
    { label: 'Ouvir e discutir', href: `/podcast?${query}` },
    { label: 'Conferir com questões', href: `/questoes?${query}` },
  ];
  return <nav aria-label="Continuar estudando este assunto" className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 text-left">
    <p className="text-sm font-semibold mb-2">Continue com o mesmo assunto</p>
    <div className="flex flex-wrap gap-x-4 gap-y-2">{links.map(link => <Link key={link.label} to={link.href} className="ni-link text-sm">{link.label}</Link>)}</div>
  </nav>;
}
