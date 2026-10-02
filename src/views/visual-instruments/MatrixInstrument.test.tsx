import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import { matrixInstrument } from './MatrixInstrument';
const props=(id:string)=>({map:buildVisualMap(interactiveSummaries.find(x=>x.id===id)!),states:{},selectedId:null,onSelect:vi.fn(),hiddenEdgeIds:[],mode:'explorar' as const});
describe('instrumento de matrizes e sistemas',()=>{
 it('confirma a solução simultânea do sistema',()=>{const C=matrixInstrument('sistemas');render(<C {...props('summary-matematica-sistemas-de-equacoes')}/>);expect(screen.getAllByText('sim — (6, 4)').length).toBeGreaterThan(0)});
 it('usa controle nativo para classificar sistemas',()=>{const C=matrixInstrument('discussao');render(<C {...props('summary-matematica-discussao-de-sistemas-lineares')}/>);const input=screen.getByLabelText(/secantes; 2: coincidentes/i);expect(input).toHaveAttribute('type','range');fireEvent.change(input,{target:{value:'3'}});expect(screen.getAllByText('nenhuma solução').length).toBeGreaterThan(0)});
});

const numbers = (path: Element) => path.getAttribute('d')!.match(/-?\d+(?:\.\d+)?/g)!.map(Number);

it('as retas do sistema se cruzam no par (6,4), não em (5,5)', () => {
 const C=matrixInstrument('sistemas');const view=render(<C {...props('summary-matematica-sistemas-de-equacoes')}/>);
 const lines=Array.from(view.container.querySelectorAll('.vs-matrix-line')).map(numbers);
 const candidate=view.container.querySelector('.vs-matrix-dot')!;
 const x=Number(candidate.getAttribute('cx')),y=Number(candidate.getAttribute('cy'));
 for(const [x1,y1,x2,y2] of lines) expect((x-x1)*(y2-y1)-(y-y1)*(x2-x1)).toBeCloseTo(0,6);
 fireEvent.change(screen.getByRole('slider'),{target:{value:'5'}});
 expect(screen.getAllByText('não').length).toBeGreaterThan(0);
});

it.each([0,3,10/3,4,5])('a área orientada do paralelogramo coincide com det(A) em c=%s', c=>{
 const C=matrixInstrument('determinante');const view=render(<C {...props('summary-matematica-determinantes')}/>);
 fireEvent.change(screen.getByRole('slider'),{target:{value:String(c)}});
 const points=numbers(view.container.querySelector('.vs-matrix-area')!);
 expect(points).toHaveLength(8);
 const [ox,oy,ux,uy,sx,sy,vx,vy]=points;
 expect(sx).toBeCloseTo(ux+vx-ox);expect(sy).toBeCloseTo(uy+vy-oy);
 const scale=(ux-ox)/2;
 expect(-((ux-ox)*(vy-oy)-(uy-oy)*(vx-ox))/(scale*scale)).toBeCloseTo(10-3*c,6);
});

it('permite demonstrar a matriz singular sem erro numérico de arredondamento',()=>{
 const C=matrixInstrument('determinante');render(<C {...props('summary-matematica-determinantes')}/>);
 expect(Number(screen.getByRole('slider').getAttribute('step'))).toBeCloseTo(1/3);
 fireEvent.change(screen.getByRole('slider'),{target:{value:String(10/3)}});
 expect(screen.getAllByText('não').length).toBeGreaterThan(0);
 expect(screen.getAllByText('colinear').length).toBeGreaterThan(0);
});
