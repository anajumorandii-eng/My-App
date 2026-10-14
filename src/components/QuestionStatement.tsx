import React from 'react';
import type { Question } from '../types';

// A Ana Júlia pediu três vezes só o texto da questão, sem a página do PDF.
// Nem a versão com a página atrás de um botão, mantida para questões com
// figura, atendeu: a página não aparece mais em nenhuma questão. As questões
// cujas alternativas são gráficos (fuvest_2025_q60, q69) ficam sem a figura
// por decisão dela.
export function QuestionStatement({ question }: { question: Question }) {
  return <p className="whitespace-pre-line leading-relaxed">{question.prompt}</p>;
}
