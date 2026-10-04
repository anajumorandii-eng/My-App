import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import { cartesianInstrument } from './CartesianInstrument';

it.each(['summary-matematica-introducao-as-funcoes','summary-matematica-funcao-constante-e-funcao-afim'].flatMap(id=>[1,2,-2,0,4,-4].map(b=>({id,b}))))('afasta a anotação da raiz das graduações sem mover a raiz em $id com b=$b', ({id,b})=>{
 const C=cartesianInstrument('afim');
 const map=buildVisualMap(interactiveSummaries.find(x=>x.id===id)!);
 const view=render(<C map={map} states={{}} selectedId={null} onSelect={vi.fn()} hiddenEdgeIds={[]} mode="explorar"/>);
 fireEvent.change(screen.getAllByRole('slider')[1],{target:{value:String(b)}});
 const note=Array.from(view.container.querySelectorAll('.vs-plane-note')).find(n=>n.querySelector('text')?.textContent==='raiz')!;
 const anchor=note.querySelector('circle')!;const label=note.querySelector('text')!;
 expect(Number(anchor.getAttribute('cx'))).toBeCloseTo(34+((-b+6)/12)*272);
 expect(Number(anchor.getAttribute('cy'))).toBeCloseTo(143);
 expect(Math.abs(Number(label.getAttribute('y'))-143)).toBeGreaterThan(20);
 expect(Math.abs(Number(label.getAttribute('x'))-164)).toBeGreaterThan(24);
});


it.each([-3,3])('separa a raiz da nota do intercepto no extremo a=%s', a=>{
 const C=cartesianInstrument('afim');
 const map=buildVisualMap(interactiveSummaries.find(x=>x.id==='summary-matematica-funcao-constante-e-funcao-afim')!);
 const view=render(<C map={map} states={{}} selectedId={null} onSelect={vi.fn()} hiddenEdgeIds={[]} mode="explorar"/>);
 fireEvent.change(screen.getAllByRole('slider')[0],{target:{value:String(a)}});
 for(const b of [-4,-2,0,1,2,4]){
  fireEvent.change(screen.getAllByRole('slider')[1],{target:{value:String(b)}});
  const notes=Array.from(view.container.querySelectorAll('.vs-plane-note'));
  const root=notes.find(n=>n.querySelector('text')?.textContent==='raiz')!;
  const intercept=notes.find(n=>n.querySelector('text')?.textContent==='corta y aqui')!;
  expect(Math.abs(Number(root.querySelector('text')!.getAttribute('y'))-Number(intercept.querySelector('text')!.getAttribute('y')))).toBeGreaterThan(24);
  expect(Number(root.querySelector('circle')!.getAttribute('cx'))).toBeCloseTo(34+((-b/a+6)/12)*272);
 }
});
