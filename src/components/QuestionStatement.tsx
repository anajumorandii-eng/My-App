import React from 'react';
import type { Question } from '../types';

// A página inteira do PDF trazia as questões vizinhas e repetia o texto já
// transcrito; a Ana Júlia pediu só o texto, e repetiu o pedido quando as
// questões da Unicamp 2026 (que citam figura em 72 casos) seguiram mostrando
// a página aberta. Ela não aparece mais aberta em nenhuma questão. Quando o
// enunciado ou as alternativas dependem do que o texto não carrega (figura,
// gráfico, alternativa visual como fuvest_2025_q60), fica um botão fechado:
// tirar o acesso tornaria a questão irrespondível.
const DEPENDE_DA_PAGINA = /(figura|gr[aá]fico|imagem|tabela|mapa|charge|tirinha|esquema|diagrama|ilustra|quadrinho|cartum|p[aá]gina original|fora do recorte)/i;

export function needsOriginalPage(question: Question): boolean {
  if (!question.originalPages?.length) return false;
  return DEPENDE_DA_PAGINA.test(question.prompt) || question.options.some(option => DEPENDE_DA_PAGINA.test(option.text));
}

export function QuestionStatement({ question }: { question: Question }) {
  const pages = needsOriginalPage(question) ? question.originalPages ?? [] : [];
  return <div className="space-y-3">
    <p className="whitespace-pre-line leading-relaxed">{question.prompt}</p>
    {pages.length > 0 && <details className="text-sm">
      <summary className="cursor-pointer underline">Ver figura na prova original</summary>
      <div className="space-y-3 mt-2">
    {pages.map(page => <figure key={page.url} className="rounded-xl overflow-hidden border border-zinc-300 bg-white">
      <a href={page.url} target="_blank" rel="noreferrer" aria-label={`Ampliar página ${page.page} da questão`}>
        <img src={page.url} alt={`Página ${page.page} da prova original, com o enunciado, textos, figuras e alternativas. ${question.prompt}`} loading="lazy" className="w-full h-auto" />
      </a>
      <figcaption className="p-2 text-xs text-zinc-600">Página {page.page} do PDF · Toque para ampliar. Responda à questão indicada acima.</figcaption>
    </figure>)}
      </div>
    </details>}
  </div>;
}
