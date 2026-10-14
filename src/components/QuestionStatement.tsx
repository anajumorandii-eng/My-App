import React from 'react';
import type { Question } from '../types';

// As figuras recortadas substituem a página. O acervo antigo ainda contém
// gráficos e enunciados só na imagem: escondê-la antes da migração torna essas
// questões impossíveis de responder. Não há link na imagem em nenhum caso.
const VISUAL_DEPENDENCY = /(figura|gr[aá]fico|imagem|tabela|mapa|charge|tirinha|esquema|diagrama|ilustra|quadrinho|cartum|p[aá]gina original|fora do recorte|nas p[aá]ginas abaixo)/i;

export function QuestionStatement({ question }: { question: Question }) {
  const figures = question.figures ?? [];
  const legacyPages = !question.statementComplete && !figures.length && (VISUAL_DEPENDENCY.test(question.prompt) ||
    question.options.some(option => VISUAL_DEPENDENCY.test(option.text))) ? question.originalPages ?? [] : [];
  return <div className="space-y-3">
    <p className="whitespace-pre-line leading-relaxed">{question.prompt}</p>
    {figures.map((figure, index) => <img key={figure.url} src={figure.url}
      alt={`Figura ${index + 1} da questão`} loading="lazy"
      className="block max-w-full h-auto mx-auto rounded-lg bg-white" />)}
    {legacyPages.map(page => <img key={page.url} src={page.url}
      alt={`Material original da questão, página ${page.page}`} loading="lazy"
      className="block max-w-full h-auto mx-auto rounded-lg bg-white" />)}
  </div>;
}
