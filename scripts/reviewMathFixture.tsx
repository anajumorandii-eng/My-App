import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import AiTextRenderer from '../src/components/AiTextRenderer';
import {createStrategyPrintRoot} from '../src/lib/printStrategyGuide';
import {printStyles} from '../src/lib/printStyles';
import {nativeMathPrintStyles} from '../src/lib/printPdfFile';
export const formulas=[String.raw`\alpha + \beta + \gamma = 180^\circ`,String.raw`\beta = \frac{\theta}{2}`,String.raw`\sin\theta = \frac{\text{cateto oposto}}{\text{hipotenusa}}`,String.raw`A_{\text{setor}} = \frac{R^2\theta}{2}`,String.raw`\theta = 120^\circ = \frac{2\pi}{3}`,String.raw`A = 12\pi - 9\sqrt{3}`];
export function reviewMathFixture(){
 const content=document.createElement('article');Object.assign(content.dataset,{printSubject:'Matemática',printTopic:'Geometria plana',printSubtopic:'Ângulos na circunferência e área do círculo',printPurpose:'Revisão aprofundada'});
 const text=['## Fórmulas de validação',...formulas.map((formula,index)=>`Exemplo ${index+1}: $${formula}$.\n\n$$\n${formula}\n$$`),'## Tabela de fórmulas','| Expressão | Expressão | Expressão | Expressão |','|---|---|---|---|',...Array.from({length:12},(_,i)=>'| '+Array.from({length:4},(_,j)=>`$${formulas[(i+j)%formulas.length]}$`).join(' | ')+' |'),'| '+Array(4).fill(String.raw`$\sin\theta=\frac{\text{cateto oposto medido em centímetros}}{\text{hipotenusa medida em centímetros}}$`).join(' | ')+' |','## Texto e Unicode','No texto comum: α, β, γ, θ e π. Na matemática: $𝛼+β+γ=180^\\circ$ e $θ=2π/3$.',String.raw`Fórmula com texto e moeda: $𝛼 + \text{valor R\$ 12 e ângulo α}=β$.`].join('\n\n').replace('|---|---|---|---|\n\n','|---|---|---|---|\n').replace(/\n\n(?=\|)/g,'\n');
 content.innerHTML=renderToStaticMarkup(createElement(AiTextRenderer,{text}));
 const root=createStrategyPrintRoot(content,'Verificação matemática');
 return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>${printStyles}\n${nativeMathPrintStyles}</style></head><body>${root.outerHTML}</body></html>`;
}
