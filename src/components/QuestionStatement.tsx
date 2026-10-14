import React from 'react';
import type { Question } from '../types';

// A Ana Júlia pediu só o texto da questão, sem a página do PDF, e depois que
// as figuras viessem recortadas, sem link. A página inteira trazia as questões
// vizinhas; `figures` guarda só os desenhos desta questão, recortados por
// scripts/extrair-figuras.py. Não são links: ampliar abria a página de novo.
export function QuestionStatement({ question }: { question: Question }) {
  return <div className="space-y-3">
    <p className="whitespace-pre-line leading-relaxed">{question.prompt}</p>
    {question.figures?.map((figure, index) => <img key={figure.url} src={figure.url}
      alt={`Figura ${index + 1} da questão`} loading="lazy"
      className="block max-w-full h-auto mx-auto rounded-lg bg-white" />)}
  </div>;
}
