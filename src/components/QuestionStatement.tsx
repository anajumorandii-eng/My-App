import React from 'react';
import type { Question } from '../types';
import { QuestionFigure } from './QuestionFigure';

// A tela usa somente a transcrição e as figuras da questão. As páginas
// preservadas são fontes de conferência, nunca parte do enunciado exibido.
export function QuestionStatement({ question }: { question: Question }) {
  const paragraphs = question.prompt.split(/\r?\n(?:[ \t]*\r?\n)+/);
  return <div className="min-w-0 space-y-3">
    {paragraphs.map((paragraph, index) => (
      <p key={index} className="whitespace-pre-line break-words leading-relaxed">{paragraph}</p>
    ))}
    {question.figures?.map((figure, index) => <QuestionFigure key={figure.url}
      url={figure.url} alt={`Figura ${index + 1} da questão`} />)}
  </div>;
}
