import React from 'react';
import {render,fireEvent,screen} from '@testing-library/react';
import {it,expect,vi} from 'vitest';
import {interactiveSummaries} from '../../data/interactiveSummaries';
import {buildVisualMap} from '../../lib/visualStudy';
import {mechanicsFinalInstrument} from './MechanicsFinalInstrument';
import {DinamicaCena} from './PhysicsMechanismScenes';

function setup(id:'vertical-plane'|'mhs'|'potential-energy'|'nonconservative',slug:string){
 const C=mechanicsFinalInstrument(id);const summary=interactiveSummaries.find(s=>s.id===`summary-fisica-${slug}`)!;
 return render(<C map={buildVisualMap(summary)} states={{}} selectedId={null} onSelect={vi.fn()} hiddenEdgeIds={[]} mode="explorar"/>);
}
it('compara peso e normal no topo/fundo e retira normal impossível',()=>{
 const {container}=setup('vertical-plane','analisando-movimentos-contidos-em-um-plano-vertical');
 expect(container.querySelector('[data-vertical-location="top"] [data-force="normal"]')).not.toBeNull();
 expect(container.querySelector('[data-vertical-location="bottom"] [data-force="normal"]')).not.toBeNull();
 fireEvent.change(screen.getByRole('slider'),{target:{value:'0'}});
 expect(container.querySelector('[data-vertical-location="top"] [data-force="normal"]')).toBeNull();
 expect(container.querySelector('[data-vertical-location="top"] [data-force="weight"]')).not.toBeNull();
});
it('mhs liga F a x, velocidade aos extremos e energia ao equilíbrio',()=>{
 const {container}=setup('mhs','movimento-harmonico-simples-mhs');
 for(const x of [-5,0,5]){
  fireEvent.change(screen.getByRole('slider'),{target:{value:String(x)}});
  expect(container.querySelector('[data-mhs-state]')).toHaveAttribute('data-position',String(x));
  expect(container.querySelector('[data-force="restoring"]')!==null).toBe(x!==0);
  expect(container.querySelector('[data-vector="velocity"]')!==null).toBe(Math.abs(x)!==5);
 }
});
it('elevação mantém o corpo na mesma posição da cota h e peso vertical',()=>{
 const {container}=setup('potential-energy','trabalho-e-energia-o-teorema-da-energia-potencial');
 fireEvent.change(screen.getByRole('slider'),{target:{value:'10'}});
 expect(container.querySelector('[data-lift-position]')).toHaveAttribute('data-height','10');
 expect(container.querySelector('[data-force="weight"]')).not.toBeNull();
 expect(container.querySelector('[data-height-bracket]')).not.toBeNull();
});
it('atrio opõe deslocamento e conserva energia total com limite zero',()=>{
 const {container}=setup('nonconservative','sistemas-conservativos-e-sistemas-nao-conservativos');
 expect(container.querySelector('[data-force="friction"]')).not.toBeNull();
 expect(container.querySelector('[data-energy="kinetic"]')).toHaveAttribute('data-joules','28');
 expect(container.querySelector('[data-energy="internal"]')).toHaveAttribute('data-joules','12');
 fireEvent.change(screen.getByRole('slider'),{target:{value:'0'}});
 expect(container.querySelector('[data-force="friction"]')).toBeNull();
 expect(container.querySelector('[data-energy="kinetic"]')).toHaveAttribute('data-joules','40');
});
it('pares de terceira lei ligam fio e bloco, sem confundir as duas trações',()=>{
 const {container}=render(<svg><DinamicaCena id="corpos" v={3}/></svg>);
 expect(container.querySelectorAll('[data-third-law-pair]')).toHaveLength(2);
 expect(container.textContent).toContain('não formam um par');
});
