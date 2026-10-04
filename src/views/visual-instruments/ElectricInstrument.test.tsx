import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import { electricInstrument } from './ElectricInstrument';
import type { ElectricId } from '../../lib/electricLab';

function props(summaryId: string) { return { map: buildVisualMap(interactiveSummaries.find((item) => item.id === summaryId)!), states: {}, selectedId: null, onSelect: vi.fn(), hiddenEdgeIds: [], mode: 'explorar' as const }; }
describe('instrumento de eletrodinâmica', () => {
  it('expõe controles nativos nos cinco capítulos elétricos', () => {
    const chapters: Array<[ElectricId, string]> = [['current', 'summary-fisica-corrente-eletrica'], ['power', 'summary-fisica-potencia-eletrica'], ['resistor', 'summary-fisica-resistores'], ['kirchhoff', 'summary-fisica-eletrodinamica-as-leis-de-kirchhoff'], ['capacitor', 'summary-fisica-capacitores']];
    for (const [id, summaryId] of chapters) { const Component = electricInstrument(id); const view = render(<Component {...props(summaryId)} />); expect(screen.getByRole('slider')).toHaveAttribute('type', 'range'); expect(screen.getByRole('img')).toBeInTheDocument(); view.unmount(); }
  });
  it('recalcula a corrente quando a resistência muda', () => { const Component = electricInstrument('resistor'); render(<Component {...props('summary-fisica-resistores')} />); fireEvent.change(screen.getByRole('slider'), { target: { value: '6' } }); expect(screen.getAllByText('2 A').length).toBeGreaterThan(0); });
});

const mechanisms: Array<[ElectricId, string, number[], string]> = [
  ['current', 'summary-fisica-corrente-eletrica', [0, 8, 16], 'Seção S'],
  ['power', 'summary-fisica-potencia-eletrica', [0, 3, 8], 'energia térmica'],
  ['resistor', 'summary-fisica-resistores', [1, 4, 12], 'Fonte ideal: 12 V'],
  ['kirchhoff', 'summary-fisica-eletrodinamica-as-leis-de-kirchhoff', [2, 7, 12], 'Malha: +12 − 4 − 8 = 0 V'],
  ['capacitor', 'summary-fisica-capacitores', [0, 6, 12], 'Campo: + → −'],
];
for (const [id, chapter, values, label] of mechanisms) {
  it(`${id}: mantém o mecanismo completo nos estados decisivos`, () => {
    const Component = electricInstrument(id); const view = render(<Component {...props(chapter)} />);
    for (const value of values) {
      fireEvent.change(screen.getByRole('slider'), { target: { value: String(value) } });
      expect(screen.getByText(id === 'capacitor' && value === 0 ? 'Campo nulo' : label)).toBeInTheDocument();
      const arrows = view.container.querySelectorAll('[data-flow]');
      if ((id === 'current' || id === 'power' || id === 'capacitor') && value === 0) expect(arrows).toHaveLength(0);
      else expect(arrows.length).toBeGreaterThan(0);
      if (id === 'kirchhoff') expect(view.container.querySelectorAll('[data-flow="branch-b"]')).toHaveLength(value === 2 ? 0 : 1);
    }
    view.unmount();
  });
}

it('remove sentidos de fluxo em repouso e posiciona a corrente no ramo do resistor', () => {
  const Current = electricInstrument('current'); const current = render(<Current {...props('summary-fisica-corrente-eletrica')} />);
  expect(screen.getByText('Deslocamento esquemático')).toBeInTheDocument();
  fireEvent.change(screen.getByRole('slider'), { target: { value: '0' } });
  expect(screen.getByText('elétrons sem deriva · |ΔQ| = 0 C')).toBeInTheDocument(); current.unmount();
  const Capacitor = electricInstrument('capacitor'); const capacitor = render(<Capacitor {...props('summary-fisica-capacitores')} />);
  fireEvent.change(screen.getByRole('slider'), { target: { value: '0' } });
  expect(screen.getByText('Campo nulo')).toBeInTheDocument(); capacitor.unmount();
  const Resistor = electricInstrument('resistor'); const resistor = render(<Resistor {...props('summary-fisica-resistores')} />);
  expect(resistor.container.querySelector('[data-flow="current"] path')).toHaveAttribute('d', 'M210 195L110 195'); resistor.unmount();
});

it('o caminho da corrente atravessa o resistor sem fio de desvio', () => {
  const Component=electricInstrument('resistor');
  render(<Component {...props('summary-fisica-resistores')} />);
  const wire=Array.from(screen.getByRole('img').querySelectorAll('path')).find(p=>p.getAttribute('d')?.startsWith('M40 108'))!;
  let x=0,y=0;
  const horizontal: Array<{from:number;to:number;y:number}>=[];
  for(const [,command,coordinates] of wire.getAttribute('d')!.matchAll(/([MHV])([^MHV]+)/g)){
    const numbers=coordinates.trim().split(/[ ,]+/).map(Number);
    if(command==='M') [x,y]=numbers;
    if(command==='V') y=numbers[0];
    if(command==='H'){ horizontal.push({from:x,to:numbers[0],y}); x=numbers[0]; }
  }
  const leads=horizontal.filter(segment=>segment.y===65);
  // Fios chegam aos terminais x=100 e x=190, sem atravessar o resistor.
  expect(leads.some(segment=>segment.to===100)).toBe(true);
  expect(leads.some(segment=>segment.from===190)).toBe(true);
  expect(leads.every(segment=>Math.max(segment.from,segment.to)<=100 || Math.min(segment.from,segment.to)>=190)).toBe(true);
});
