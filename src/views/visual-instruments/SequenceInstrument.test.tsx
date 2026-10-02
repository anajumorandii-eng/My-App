import React from 'react';
import {fireEvent, render, screen} from '@testing-library/react';
import {expect, it, vi} from 'vitest';
import {interactiveSummaries} from '../../data/interactiveSummaries';
import {buildVisualMap} from '../../lib/visualStudy';
import {sequenceInstrument} from './SequenceInstrument';
const props=()=>({map:buildVisualMap(interactiveSummaries.find(x=>x.subject==='Matemática')!),states:{},selectedId:null,onSelect:vi.fn(),hiddenEdgeIds:[],mode:'explorar' as const});
it.each([-3,0,6])('PA r=%s mantém todos os nós inteiros na cena',value=>{
 const C=sequenceInstrument('pa');const view=render(<C {...props()}/>);fireEvent.change(screen.getByRole('slider'),{target:{value:String(value)}});
 for(const node of view.container.querySelectorAll('.vs-seq-node')) {const y=Number(node.getAttribute('cy'));expect(y-15).toBeGreaterThanOrEqual(0);expect(y+15).toBeLessThanOrEqual(240);}
});
it.each([-2,0,2,4])('PG q=%s representa os termos sem saturação e numa escala linear',value=>{
 const C=sequenceInstrument('pg');const view=render(<C {...props()}/>);fireEvent.change(screen.getByRole('slider'),{target:{value:String(value)}});
 const ys=Array.from(view.container.querySelectorAll('.vs-seq-node')).map(n=>Number(n.getAttribute('cy')));
 const terms=Array.from({length:5},(_,i)=>3*value**i);
 if(value!==0) {const scale=(ys[0]-ys[1])/(terms[1]-terms[0]);for(let i=1;i<5;i++) expect(ys[i]).toBeCloseTo(ys[0]-(terms[i]-terms[0])*scale);expect(scale).toBeGreaterThan(0);}
 expect(Array.from(view.container.querySelectorAll('.vs-seq-text')).map(n=>n.textContent)).toEqual(terms.map(String));
});
