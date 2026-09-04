import React, { Suspense, lazy } from 'react';

// O renderizador traz react-markdown, remark-math, rehype-katex e o CSS do
// KaTeX junto — 377 KB, mais que o dobro de qualquer tela do app. Importado
// direto, ele era baixado só por a tela ter a possibilidade de mostrar
// resposta de IA, mesmo quando não havia nenhuma. Assim só é buscado quando um
// texto de IA aparece de verdade.
const AiTextRenderer = lazy(() => import('./AiTextRenderer'));

export function AiText({ text, className = '' }: { text: string; className?: string }) {
  return (
    <Suspense
      // O texto puro enquanto o renderizador carrega: a aluna lê a resposta
      // imediatamente, e ela só é reformatada (listas, negrito, fórmulas)
      // quando o chunk chega.
      fallback={<div className={`space-y-2 whitespace-pre-wrap leading-relaxed ${className}`}>{text}</div>}
    >
      <AiTextRenderer text={text} className={className} />
    </Suspense>
  );
}
