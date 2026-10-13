import React from 'react';
import type { Question } from '../types';

// A página inteira do PDF trazia as questões vizinhas e repetia o texto já
// transcrito; a Ana Júlia pediu só o texto. A página fica apenas quando o
// enunciado ou as alternativas dependem de algo que o texto não carrega
// (figura, gráfico, tabela, alternativa visual como fuvest_2025_q60).
const DEPENDE_DA_PAGINA = /(figura|gr[aá]fico|imagem|tabela|mapa|charge|tirinha|esquema|diagrama|ilustra|quadrinho|cartum|p[aá]gina original|fora do recorte)/i;

export function needsOriginalPage(question: Question): boolean {
  if (!question.originalPages?.length) return false;
  return DEPENDE_DA_PAGINA.test(question.prompt) || question.options.some(option => DEPENDE_DA_PAGINA.test(option.text));
}

export function QuestionStatement({ question }: { question: Question }) {
  const pages = needsOriginalPage(question) ? question.originalPages ?? [] : [];
  return <div className="space-y-3">
    <p className="whitespace-pre-line leading-relaxed">{question.prompt}</p>
    {pages.map(page => <figure key={page.url} className="rounded-xl overflow-hidden border border-zinc-300 bg-white">
      <a href={page.url} target="_blank" rel="noreferrer" aria-label={`Ampliar página ${page.page} da questão`}>
        <img src={page.url} alt={`Página ${page.page} da prova original, com o enunciado, textos, figuras e alternativas. ${question.prompt}`} loading="lazy" className="w-full h-auto" />
      </a>
      <figcaption className="p-2 text-xs text-zinc-600">Página {page.page} do PDF · Toque para ampliar. Responda à questão indicada acima.</figcaption>
    </figure>)}
  </div>;
}
