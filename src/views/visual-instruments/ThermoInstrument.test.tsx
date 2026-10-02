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
