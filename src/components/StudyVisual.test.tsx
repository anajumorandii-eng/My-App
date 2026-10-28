import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import AiTextRenderer from './AiTextRenderer';
import { createStrategyPrintRoot } from '../lib/printStrategyGuide';
import { parseStudyVisual } from '../lib/studyVisual';
afterEach(cleanup);
const flow = { type: 'flow', title: 'Conservação de água', steps: ['Osmolaridade aumenta', 'Liberação de ADH aumenta', 'Reabsorção de água aumenta'], caption: 'Rins funcionantes e gradiente preservado.', question: 'O que muda se o receptor não responder?' };
it('renderiza o bloco de estudo como figura, preservando mecanismo e pergunta no PDF', () => {
  const text = '```study-visual\n' + JSON.stringify(flow) + '\n```';
  const { container } = render(<AiTextRenderer text={text} />);
  expect(container.querySelector('[data-study-visual="flow"]')).toBeTruthy();
  expect(screen.getByRole('list', { name: flow.title })).toBeInTheDocument();
  const root = createStrategyPrintRoot(container, 'Revisão');
  expect(root.querySelector('[data-study-visual]')?.textContent).toContain(flow.question);
  expect(container.querySelector('pre')).toBeNull();
});
it('mostra barras proporcionais com valores, unidade e origem didática', () => {
  const bars = { type: 'bars', title: 'Débito cardíaco', unit: 'L/min', data: [{ label: 'Repouso', value: 4.9 }, { label: 'Exercício', value: 14 }], caption: 'Dados didáticos.', question: 'Qual variável mudou?' };
  const { container } = render(<AiTextRenderer text={'```study-visual\n' + JSON.stringify(bars) + '\n```'} />);
  expect(container.querySelectorAll('svg')).toHaveLength(2);
  expect(container.textContent).toContain('4,9 L/min');
  expect(container.textContent).toContain('Dados didáticos.');
});
it('recusa estrutura incompleta, números inválidos e blocos excessivos', () => {
  expect(parseStudyVisual('{')).toBeUndefined();
  expect(parseStudyVisual(JSON.stringify({ ...flow, steps: ['uma'] }))).toBeUndefined();
  expect(parseStudyVisual(JSON.stringify({ ...flow, type: 'bars', unit: 'mg', data: [{ label: 'A', value: -1 }, { label: 'B', value: 2 }] }))).toBeUndefined();
  expect(parseStudyVisual('x'.repeat(8001))).toBeUndefined();
});
it('curvas têm eixos e valores acessíveis; PDF mantém o gráfico sem o controle interativo', () => {
 const visual={type:'line',title:'Concentração',caption:'Dados didáticos.',question:'A queda é constante?',xLabel:'Tempo (s)',yLabel:'Concentração (mol/L)',series:[{label:'A',points:[{x:0,y:1},{x:1,y:.5},{x:2,y:.3}]},{label:'B',points:[{x:0,y:0},{x:1,y:.5},{x:2,y:.7}]}]};
 const {container}=render(<AiTextRenderer text={'```study-visual\n'+JSON.stringify(visual)+'\n```'}/>);
 expect(screen.getByRole('img',{name:/Concentração/})).toBeInTheDocument();
 expect(container.querySelectorAll('polyline')).toHaveLength(2);
 expect(container.textContent).toContain('traços longos');
 const root=createStrategyPrintRoot(container,'Revisão');
 expect(root.querySelector('details[data-visual-data]')).toBeNull();
 expect(root.querySelector('polyline')).toBeTruthy();
 expect(root.textContent).toContain('Tempo (s)');
});
it('desenha a figura na tinta do app: sem quadro branco, sem cor fixa e com seta de reação em SVG', () => {
 // A primeira versão desenhava num quadro #fff, com setas "↓" de texto e
 // cores fixas, e destoava das pranchas e das tabelas dos resumos.
 const reaction={type:'reaction',title:'Oxidação',molecules:[{label:'Etanol',smiles:'CCO'},{label:'Etanal',smiles:'CC=O'}],conditions:['[O]'],caption:'Esquema didático.',question:'O que oxidou?'};
 const {container}=render(<AiTextRenderer text={'```study-visual\n'+JSON.stringify(reaction)+'\n```'}/>);
 const figure=container.querySelector('[data-study-visual="reaction"]')!;
 expect(figure.className).toContain('crivo-figure');
 expect(figure.textContent).not.toContain('↓');
 expect(figure.querySelector('.crivo-arrow__horizontal path')?.getAttribute('stroke')).toMatch(/^var\(--fig-o, #[0-9a-f]{6}\)$/);
 expect(figure.innerHTML).not.toMatch(/#fff\b|#ffffff|background:\s*white/i);
 expect(figure.querySelector('.crivo-figure__kicker')?.textContent).toBe('Reação');
});
it('desenha a figura geométrica com vértices, medidas e ângulo reto, também no PDF', () => {
 // Em Geometria o modelo só tinha curva, barra ou fluxo, e o resumo trazia
 // um gráfico sem relação com o triângulo em vez da figura.
 const visual={type:'geometry',title:'Triângulo 3-4-5',points:[{id:'A',x:0,y:0},{id:'B',x:4,y:0},{id:'C',x:0,y:3}],polygons:[{vertices:['A','B','C']}],segments:[{from:'A',to:'B',label:'4'},{from:'A',to:'C',label:'3'},{from:'B',to:'C',label:'5',dashed:true}],angles:[{vertex:'A',from:'B',to:'C',right:true}],caption:'Catetos 3 e 4.',question:'Qual é o seno de B?'};
 const {container}=render(<AiTextRenderer text={'```study-visual\n'+JSON.stringify(visual)+'\n```'}/>);
 const figure=container.querySelector('[data-study-visual="geometry"]')!;
 expect(figure.querySelector('.crivo-figure__kicker')?.textContent).toBe('Figura');
 expect(figure.querySelectorAll('polygon')).toHaveLength(1);
 expect(figure.querySelector('line[stroke-dasharray]')).toBeTruthy();
 // B–C é lado do triângulo e segmento tracejado: não pode haver traço
 // contínuo por baixo dele, senão o tracejado some.
 const solid=[...figure.querySelectorAll('line:not([stroke-dasharray])')].map(l=>[l.getAttribute('x1'),l.getAttribute('y1'),l.getAttribute('x2'),l.getAttribute('y2')].join());
 const dashed=figure.querySelector('line[stroke-dasharray]')!;
 const bc=[dashed.getAttribute('x1'),dashed.getAttribute('y1'),dashed.getAttribute('x2'),dashed.getAttribute('y2')];
 expect(solid).not.toContain(bc.join());
 expect(solid).not.toContain([bc[2],bc[3],bc[0],bc[1]].join());
 expect(figure.querySelector('polygon')?.getAttribute('stroke')).toBe('none');
 for (const text of ['A','B','C','3','4','5']) expect([...figure.querySelectorAll('svg text')].map(t=>t.textContent)).toContain(text);
 const root=createStrategyPrintRoot(container,'Revisão');
 expect(root.querySelector('.crivo-geometry polygon')).toBeTruthy();
});
it('recusa figura geométrica que cita ponto inexistente ou não desenha nada', () => {
 const base={type:'geometry',title:'T',caption:'c',question:'q',points:[{id:'A',x:0,y:0},{id:'B',x:1,y:0}]};
 expect(parseStudyVisual(JSON.stringify({...base,segments:[{from:'A',to:'B'}]}))).toBeDefined();
 expect(parseStudyVisual(JSON.stringify({...base,segments:[{from:'A',to:'Z'}]}))).toBeUndefined();
 expect(parseStudyVisual(JSON.stringify(base))).toBeUndefined();
 expect(parseStudyVisual(JSON.stringify({...base,points:[{id:'A',x:0,y:0},{id:'A',x:1,y:0}],segments:[{from:'A',to:'A'}]}))).toBeUndefined();
 expect(parseStudyVisual(JSON.stringify({...base,circles:[{center:'A',radius:-1}]}))).toBeUndefined();
});
