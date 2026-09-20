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
