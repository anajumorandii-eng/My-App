import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import { electrostaticsInstrument } from './ElectrostaticsInstrument';
import type { ElectrostaticsId } from '../../lib/electrostaticsLab';
function props(summaryId: string) { return { map: buildVisualMap(interactiveSummaries.find((item) => item.id === summaryId)!), states: {}, selectedId: null, onSelect: vi.fn(), hiddenEdgeIds: [], mode: 'explorar' as const }; }
describe('instrumento de eletrostática', () => {
  it('dá a cada um dos cinco fenômenos um controle acessível', () => { const chapters: Array<[ElectrostaticsId, string]> = [['coulomb', 'summary-fisica-forca-eletrica-lei-de-coulomb'], ['field', 'summary-fisica-campo-eletrico'], ['potential', 'summary-fisica-energia-potencial-e-potencial-eletrico'], ['uniform-field', 'summary-fisica-campo-eletrico-uniforme-abordagem-escalar-e-abordagem-vetorial'], ['charge-dynamics', 'summary-fisica-dinamica-das-cargas-eletricas']]; for (const [id, summaryId] of chapters) { const Component = electrostaticsInstrument(id); const view = render(<Component {...props(summaryId)} />); expect(screen.getByRole('img')).toBeInTheDocument(); expect(screen.getByRole('slider')).toHaveAttribute('type', 'range'); view.unmount(); } });
  it('atualiza a queda de potencial entre placas', () => { const Component = electrostaticsInstrument('uniform-field'); render(<Component {...props('summary-fisica-campo-eletrico-uniforme-abordagem-escalar-e-abordagem-vetorial')} />); fireEvent.change(screen.getByRole('slider'), { target: { value: '5' } }); expect(screen.getAllByText('20 V').length).toBeGreaterThan(0); });
});

describe('vetores e geometria eletrostática', () => {
  it('marca r entre centros e forças iguais de atração sem sobrepor cargas', () => {
    const Component = electrostaticsInstrument('coulomb');
    render(<Component {...props('summary-fisica-forca-eletrica-lei-de-coulomb')} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '1' } });
    const svg = screen.getByRole('img');
    const charges = svg.querySelectorAll('[data-charge]');
    expect(charges).toHaveLength(2);
    expect(Number(charges[1].getAttribute('cx')) - Number(charges[0].getAttribute('cx'))).toBeGreaterThan(20);
    expect(svg.querySelectorAll('[data-vector="force"]')).toHaveLength(2);
    expect(svg).toHaveTextContent('r = 1');
  });
  it('move o ponto de medida e reduz E sem alongar as linhas de campo', () => {
    const Component = electrostaticsInstrument('field');
    render(<Component {...props('summary-fisica-campo-eletrico')} />);
    const svg = screen.getByRole('img');
    const before = svg.querySelector('[data-probe]')?.getAttribute('cx');
    fireEvent.change(screen.getByRole('slider'), { target: { value: '8' } });
    expect(svg.querySelector('[data-probe]')?.getAttribute('cx')).not.toBe(before);
    expect(svg.querySelectorAll('[data-vector="field"]')).toHaveLength(6);
    expect(svg).toHaveTextContent('r = 8');
  });
  it('mostra potencial, energia e trabalho com equipotenciais contidas', () => {
    const Component = electrostaticsInstrument('potential');
    render(<Component {...props('summary-fisica-energia-potencial-e-potencial-eletrico')} />);
    const svg = screen.getByRole('img');
    for (const ring of svg.querySelectorAll('[data-equipotential]')) {
      expect(Number(ring.getAttribute('cx')) - Number(ring.getAttribute('r'))).toBeGreaterThanOrEqual(0);
    }
    expect(svg).toHaveTextContent('U = qV');
    expect(svg).toHaveTextContent('W');
  });
  it('identifica vetores E e F entre placas e ΔV negativo', () => {
    const Component = electrostaticsInstrument('uniform-field');
    render(<Component {...props('summary-fisica-campo-eletrico-uniforme-abordagem-escalar-e-abordagem-vetorial')} />);
    expect(screen.getByRole('img').querySelectorAll('[data-vector="field"]')).toHaveLength(4);
    expect(screen.getByRole('img').querySelector('[data-vector="force"]')).not.toBeNull();
    expect(screen.getAllByText('−12 V').length).toBeGreaterThan(0);
  });
  it('campo zero elimina E, F e a sem mover a carga', () => {
    const Component = electrostaticsInstrument('charge-dynamics');
    render(<Component {...props('summary-fisica-dinamica-das-cargas-eletricas')} />);
    const svg = screen.getByRole('img');
    const position = svg.querySelector('[data-charge]')?.getAttribute('cx');
    expect(svg).toHaveTextContent('m = 2 kg');
    fireEvent.change(screen.getByRole('slider'), { target: { value: '0' } });
    expect(svg.querySelectorAll('[data-vector]')).toHaveLength(0);
    expect(svg.querySelector('[data-charge]')?.getAttribute('cx')).toBe(position);
    expect(svg).toHaveTextContent('a = 0 m/s²');
  });
});

it('distância entre centros e vetor E obedecem suas escalas físicas', () => {
  let Component=electrostaticsInstrument('coulomb');
  const view=render(<Component {...props('summary-fisica-forca-eletrica-lei-de-coulomb')} />);
  const distance=()=>{const c=screen.getByRole('img').querySelectorAll('[data-charge]');return Number(c[1].getAttribute('cx'))-Number(c[0].getAttribute('cx'));};
  fireEvent.change(screen.getByRole('slider'),{target:{value:'1'}}); const d=distance();
  fireEvent.change(screen.getByRole('slider'),{target:{value:'2'}}); expect(distance()).toBe(2*d);
  view.unmount(); Component=electrostaticsInstrument('field');
  render(<Component {...props('summary-fisica-campo-eletrico')} />);
  const length=()=>{const path=screen.getByRole('img').querySelector('[data-vector="measurement"] path')!;const n=path.getAttribute('d')!.match(/[0-9.]+/g)!.map(Number);return n[2]-n[0];};
  fireEvent.change(screen.getByRole('slider'),{target:{value:'1'}});const e=length();
  fireEvent.change(screen.getByRole('slider'),{target:{value:'2'}});expect(length()).toBe(e/4);
});

it('pontas não ultrapassam a origem em vetores de força curtos', () => {
  const Component=electrostaticsInstrument('coulomb');
  render(<Component {...props('summary-fisica-forca-eletrica-lei-de-coulomb')} />);
  fireEvent.change(screen.getByRole('slider'),{target:{value:'8'}});
  const paths=screen.getByRole('img').querySelectorAll('[data-vector="force"] path');
  for(const path of paths){
    const n=path.getAttribute('d')!.match(/-?[0-9.]+/g)!.map(Number);
    const low=Math.min(n[0],n[2]), high=Math.max(n[0],n[2]);
    expect(n[4]).toBeGreaterThanOrEqual(low);expect(n[4]).toBeLessThanOrEqual(high);
    expect(n[8]).toBeGreaterThanOrEqual(low);expect(n[8]).toBeLessThanOrEqual(high);
  }
});

it('dobrar r dobra a distância do ponto P à carga fonte no campo', () => {
 const Component=electrostaticsInstrument('field');
 render(<Component {...props('summary-fisica-campo-eletrico')} />);
 const svg=screen.getByRole('img'), slider=screen.getByRole('slider');
 const distance=()=>Number(svg.querySelector('[data-probe]')!.getAttribute('cx'))-Number(svg.querySelector('[data-charge]')!.getAttribute('cx'));
 fireEvent.change(slider,{target:{value:'2'}}); const before=distance();
 fireEvent.change(slider,{target:{value:'4'}}); expect(distance()).toBeCloseTo(before*2);
});
