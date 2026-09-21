import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import { mechanicsFinalInstrument } from './MechanicsFinalInstrument';
import type { MechanicsFinalId } from '../../lib/mechanicsFinalLab';

function props(topic: string) {
  const summary = interactiveSummaries.find(item => item.subject === 'Física' && item.topic === topic);
  return { map: buildVisualMap(summary!), states: {}, selectedId: null, onSelect: vi.fn(), hiddenEdgeIds: [], mode: 'explorar' as const };
}

describe('instrumentos finais de mecânica', () => {
  it('deixa os cinco objetos operáveis por controle nativo', () => {
    const chapters: Array<[MechanicsFinalId, string]> = [
      ['vertical-plane', 'Analisando Movimentos Contidos em um Plano Vertical'],
      ['mhs', 'Movimento Harmônico Simples (MHS)'],
      ['potential-energy', 'Trabalho e Energia: o Teorema da Energia Potencial'],
      ['nonconservative', 'Sistemas Conservativos e Sistemas Não Conservativos'],
      ['mass-energy', 'Equivalência Massa-Energia'],
    ];
    for (const [id, topic] of chapters) {
      const Component = mechanicsFinalInstrument(id);
      const view = render(<Component {...props(topic)} />);
      expect(screen.getByRole('img')).toBeInTheDocument();
      expect(screen.getByRole('slider')).toHaveAttribute('type', 'range');
      view.unmount();
    }
  });
  it('mostra a energia mecânica transformada quando o atrito aumenta', () => {
    const Component = mechanicsFinalInstrument('nonconservative');
    render(<Component {...props('Sistemas Conservativos e Sistemas Não Conservativos')} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '6' } });
    expect(screen.getAllByText('24 J').length).toBeGreaterThan(0);
  });
});
