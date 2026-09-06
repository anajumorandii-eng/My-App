import React from 'react';
import type { Question } from '../types';

/** Preserves diagrams, equations and shared reading passages from the original. */
export function QuestionStatement({ question }: { question: Question }) {
  return <div className="space-y-3">
    <p className="whitespace-pre-line leading-relaxed">{question.prompt}</p>
    {question.originalPages?.map(page => <figure key={page.url} className="rounded-xl overflow-hidden border border-zinc-300 bg-white">
      <a href={page.url} target="_blank" rel="noreferrer" aria-label={`Ampliar página ${page.page} da questão`}>
        <img src={page.url} alt={`Página ${page.page} da prova original, com o enunciado, textos, figuras e alternativas. ${question.prompt}`} loading="lazy" className="w-full h-auto" />
      </a>
      <figcaption className="p-2 text-xs text-zinc-600">Página {page.page} · Toque para ampliar. Responda à questão indicada acima.</figcaption>
    </figure>)}
  </div>;
}
