import React from 'react';
import type { Question } from '../types';
import { QuestionFigure } from './QuestionFigure';

// A tela usa somente a transcrição e as figuras da questão. As páginas
// preservadas são fontes de conferência, nunca parte do enunciado exibido.
export function QuestionStatement({ question }: { question: Question }) {
  return <div className="space-y-3">
    <p className="whitespace-pre-line leading-relaxed">{question.prompt}</p>
    {question.figures?.map((figure, index) => <QuestionFigure key={figure.url}
      url={figure.url} alt={`Figura ${index + 1} da questão`} />)}
  </div>;
}
