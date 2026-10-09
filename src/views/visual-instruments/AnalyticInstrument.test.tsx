import React from 'react';
import {fireEvent,render} from '@testing-library/react';
import {expect,it,vi} from 'vitest';
import {interactiveSummaries} from '../../data/interactiveSummaries';
import {buildVisualMap} from '../../lib/visualStudy';
import {analyticInstrument} from './AnalyticInstrument';
import type {ConfigId} from '../../lib/analyticPlane';
const props=()=>({map:buildVisualMap(interactiveSummaries.find(x=>x.subject==='Matemática')!),states:{},selectedId:null,onSelect:vi.fn(),hiddenEdgeIds:[],mode:'explorar' as const});
it.each<[ConfigId,string]>([['circunferencia','compare com o raio'],['ponto-reta','pé da perpendicular'],['complexo','módulo é a distância']])('%s mantém nota fora dos números do eixo vertical', (id,note)=>{
 const C=analyticInstrument(id);const view=render(<C {...props()}/>);
 const text=Array.from(view.container.querySelectorAll('.vs-plane-note text')).find(n=>n.textContent===note)!;
 const left=Number(text.getAttribute('x'))-note.length*5.8/2,right=Number(text.getAttribute('x'))+note.length*5.8/2;
 expect(right<=140 || left>=162).toBe(true);
});

it.each<ConfigId>(['circunferencia','ponto-reta','complexo'])('%s conserva notas e geometria ao variar os extremos',id=>{
 const C=analyticInstrument(id);const view=render(<C {...props()}/>);const controls=Array.from(view.container.querySelectorAll('input[type="range"]'));
 for(const x of [Number(controls[0].getAttribute('min')),0,Number(controls[0].getAttribute('max'))]) for(const y of [Number(controls[1].getAttribute('min')),0,Number(controls[1].getAttribute('max'))]){
  fireEvent.change(controls[0],{target:{value:String(x)}});fireEvent.change(controls[1],{target:{value:String(y)}});
  for(const note of view.container.querySelectorAll('.vs-plane-note text')){
   const half=note.textContent!.length*5.8/2,lx=Number(note.getAttribute('x')),ly=Number(note.getAttribute('y'));
   expect(lx-half).toBeGreaterThanOrEqual(0);expect(lx+half).toBeLessThanOrEqual(320);expect(ly).toBeGreaterThanOrEqual(16);expect(ly).toBeLessThanOrEqual(292);
   expect(lx+half<=140||lx-half>=162).toBe(true);
   const label=view.container.querySelector('.vs-analytic-point text')!;
   const px=Number(label.getAttribute('x')),py=Number(label.getAttribute('y'));
   expect(lx+half<=px||lx-half>=px+12||ly+2<=py-10||ly-12>=py+2).toBe(true);
  }
 }
});
it('circunferência deixa o nome P fora da frase após o ajuste final dos eixos',()=>{
 const C=analyticInstrument('circunferencia');const view=render(<C {...props()}/>);
 const note=view.container.querySelector('[data-analytic-note="compare com o raio"] text')!;
 const label=view.container.querySelector('.vs-analytic-point text')!;
 const half=note.textContent!.length*5.8/2,nx=Number(note.getAttribute('x')),ny=Number(note.getAttribute('y')),px=Number(label.getAttribute('x')),py=Number(label.getAttribute('y'));
 expect(nx+half<=px||nx-half>=px+12||ny+2<=py-10||ny-12>=py+2).toBe(true);
});
it.each<ConfigId>(['circunferencia','ponto-reta','complexo'])('%s mantém formato da condição estável ao atravessar zero',id=>{
 const C=analyticInstrument(id);const view=render(<C {...props()}/>);const controls=Array.from(view.container.querySelectorAll('input[type="range"]'));
 const condition=()=>view.container.querySelector('.vs-q-callout')!;
 expect(condition()).toHaveAttribute('data-long','true');
 for(const value of ['0',controls[0].getAttribute('min')!,controls[0].getAttribute('max')!]){
  for(const input of controls)fireEvent.change(input,{target:{value}});
  expect(condition()).toHaveAttribute('data-long','true');
  expect(condition().textContent).toMatch(/\(−?\d+,\d; −?\d+,\d\)/);
 }
});


it('não desenha uma reta ou perpendicular inválida quando P coincide com A', () => {
 const C=analyticInstrument('duas-retas'); const view=render(<C {...props()}/>);
 const controls=Array.from(view.container.querySelectorAll('input[type="range"]'));
 fireEvent.change(controls[0],{target:{value:'0'}});fireEvent.change(controls[1],{target:{value:'-3'}});
 expect(view.container.querySelector('.vs-analytic-line--alt')).toBeNull();
 expect(view.container.textContent).toContain('indefinida: falta uma segunda reta');
 for(const path of view.container.querySelectorAll('svg path')) expect(path.getAttribute('d')).not.toMatch(/NaN|Infinity/);
 fireEvent.change(controls[0],{target:{value:'1'}});
 expect(view.container.querySelector('.vs-analytic-line--alt')).not.toBeNull();
});


it('oferece tangência exata sem classificar uma secante próxima como tangente', () => {
 const C=analyticInstrument('reta-circunferencia');const view=render(<C {...props()}/>);
 const controls=Array.from(view.container.querySelectorAll('input[type="range"]'));
 for(const input of controls)fireEvent.change(input,{target:{value:'2.1'}});
 expect(view.container.querySelector('.vs-plane-readouts [data-pivot] dd')).toHaveTextContent('secante');
 fireEvent.click(view.getByRole('button',{name:'Tangente'}));
 expect(view.container.querySelector('.vs-plane-readouts [data-pivot] dd')).toHaveTextContent('tangente');
 expect(view.container).toHaveTextContent('x = y = 3/√2');
 fireEvent.click(view.getByRole('button',{name:'Externa'}));
 expect(view.container.querySelector('.vs-plane-readouts [data-pivot] dd')).toHaveTextContent('externa');
});
