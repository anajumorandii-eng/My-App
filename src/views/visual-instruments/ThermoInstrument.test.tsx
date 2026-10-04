import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import { thermoInstrument } from './ThermoInstrument';
import type { ThermoId } from '../../lib/thermoLab';

function props(summaryId: string) {
  return { map: buildVisualMap(interactiveSummaries.find((item) => item.id === summaryId)!), states: {}, selectedId: null, onSelect: vi.fn(), hiddenEdgeIds: [], mode: 'explorar' as const };
}

describe('instrumento de termodinâmica', () => {
  it('renderiza os três balanços e torna cada variável operável por teclado', () => {
    const chapters: Array<[ThermoId, string]> = [
      ['gas-work', 'summary-fisica-trabalho-da-forca-de-pressao-do-gas'],
      ['first-law', 'summary-fisica-primeira-lei-da-termodinamica'],
      ['carnot', 'summary-fisica-maquinas-termicas-e-ciclo-de-carnot'],
    ];
    for (const [id, summaryId] of chapters) {
      const Component = thermoInstrument(id);
      const view = render(<Component {...props(summaryId)} />);
      expect(screen.getByRole('img')).toBeInTheDocument();
      expect(screen.getByRole('slider')).toHaveAttribute('type', 'range');
      view.unmount();
    }
  });

  it('atualiza energia interna ao mudar o trabalho do gás', () => {
    const Component = thermoInstrument('first-law');
    render(<Component {...props('summary-fisica-primeira-lei-da-termodinamica')} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '7' } });
    expect(screen.getAllByText('5 J').length).toBeGreaterThan(0);
  });
});


it('mostra área isobárica até o eixo V, volumes positivos e sinal do trabalho', () => {
  const Component = thermoInstrument('gas-work');
  const { container } = render(<Component {...props('summary-fisica-trabalho-da-forca-de-pressao-do-gas')} />);
  const slider = screen.getByRole('slider');
  for (const delta of [4, -4, 0, 8]) {
    fireEvent.change(slider, { target: { value: String(delta) } });
    const scene = container.querySelector('[data-gas-work]')!;
    expect(scene).toHaveAttribute('data-initial-volume', '5');
    expect(scene).toHaveAttribute('data-final-volume', String(5 + delta));
    expect(scene).toHaveAttribute('data-work-sign', delta === 0 ? 'zero' : delta > 0 ? 'positive' : 'negative');
    const curve = container.querySelector('[data-isobar]')!;
    expect(curve.getAttribute('y1')).toBe(curve.getAttribute('y2'));
    expect(curve).toHaveAttribute('y1', '110');
    const area = container.querySelector('[data-work-area]')!;
    expect(Number(area.getAttribute('y')) + Number(area.getAttribute('height'))).toBe(230);
    expect(Number(area.getAttribute('width'))).toBe(16 * Math.abs(delta));
    expect(Number(area.getAttribute('x'))).toBe(Math.min(125, 45 + 16 * (5 + delta)));
    expect(Number(area.getAttribute('x'))).toBeGreaterThan(45);
    const direction = container.querySelector('[data-volume-direction]');
    if (delta === 0) expect(direction).toBeNull();
    else expect(Math.sign(Number(direction!.getAttribute('x2')) - Number(direction!.getAttribute('x1')))).toBe(Math.sign(delta));
    expect(screen.getAllByText(`${3 * delta} J`).length).toBeGreaterThan(0);
  }
  expect(screen.getByText('V (L)')).toBeInTheDocument();
  expect(screen.getByText('P (kPa)')).toBeInTheDocument();
});

it('orienta calor para o gás e trabalho conforme expansão, compressão e W nulo', () => {
  const Component = thermoInstrument('first-law');
  const { container } = render(<Component {...props('summary-fisica-primeira-lei-da-termodinamica')} />);
  for (const w of [-4, 0, 12, 16]) {
    fireEvent.change(screen.getByRole('slider'), { target: { value: String(w) } });
    const heat = container.querySelector('[data-energy-flow="heat"]')!;
    expect(heat).not.toBeNull();
    expect(Number(heat.getAttribute('x2'))).toBeGreaterThan(Number(heat.getAttribute('x1')));
    expect(heat.getAttribute('marker-end')).toBeTruthy();
    const work = container.querySelector('[data-energy-flow="work"]');
    if (w === 0) expect(work).toBeNull();
    else {
      expect(work).not.toBeNull();
      expect(Math.sign(Number(work!.getAttribute('x2')) - Number(work!.getAttribute('x1')))).toBe(Math.sign(w));
      expect(work!.getAttribute('marker-end')).toBeTruthy();
    }
    expect(screen.getByText(`ΔU = ${12 - w} J`)).toBeInTheDocument();
    expect(screen.getByText('W > 0: gás realiza · W < 0: gás recebe')).toBeInTheDocument();
  }
});

it('liga fontes à máquina e mostra quatro etapas reversíveis com temperaturas absolutas coerentes', () => {
  const Component = thermoInstrument('carnot');
  const { container } = render(<Component {...props('summary-fisica-maquinas-termicas-e-ciclo-de-carnot')} />);
  for (const qc of [1, 8, 18]) {
    fireEvent.change(screen.getByRole('slider'), { target: { value: String(qc) } });
    for (const name of ['hot', 'cold', 'work']) {
      const flow = container.querySelector(`[data-carnot-flow="${name}"]`)!;
      expect(flow).not.toBeNull();
      expect(flow.getAttribute('marker-end')).toBeTruthy();
      const a = name === 'work' ? 'x' : 'y';
      expect(Number(flow.getAttribute(`${a}2`))).toBeGreaterThan(Number(flow.getAttribute(`${a}1`)));
    }
    expect(screen.getAllByText(`Tc = ${30 * qc} K`).length).toBeGreaterThan(0);
    expect(screen.getAllByText('Th = 600 K').length).toBeGreaterThan(0);
    const stages = container.querySelectorAll('[data-carnot-stage]');
    expect(stages).toHaveLength(4);
    expect(stages[0]).toHaveTextContent('isotérmica');
    expect(stages[1]).toHaveTextContent('adiabática');
    expect(stages[2]).toHaveTextContent('isotérmica');
    expect(stages[3]).toHaveTextContent('adiabática');
    const hot = container.querySelector('[data-ts-hot]')!;
    const cold = container.querySelector('[data-ts-cold]')!;
    expect(Number(hot.getAttribute('y1'))).toBe(Number(hot.getAttribute('y2')));
    expect(Number(cold.getAttribute('y1'))).toBe(Number(cold.getAttribute('y2')));
    expect(Number(cold.getAttribute('y1'))).toBeGreaterThan(Number(hot.getAttribute('y1')));
    expect(screen.getByText(/Carnot ideal reversível/)).toBeInTheDocument();
  }
});
