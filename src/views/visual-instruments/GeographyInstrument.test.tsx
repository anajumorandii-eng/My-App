import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import { geographyInstrument } from './GeographyInstrument';
import type { GeographyInstrumentId } from '../../lib/geographyInstrumentLab';

function props(summaryId: string) {
  const summary = interactiveSummaries.find((item) => item.id === summaryId);
  if (!summary) throw new Error(`Resumo ausente: ${summaryId}`);
  return { map: buildVisualMap(summary), states: {}, selectedId: null, onSelect: vi.fn(), hiddenEdgeIds: [], mode: 'explorar' as const };
}

describe('instrumentos de Geografia', () => {
  it('renderiza cinco mecanismos específicos com controle acessível', () => {
    const chapters: Array<[GeographyInstrumentId, string]> = [
      ['time-zones', 'summary-geografia-sistema-de-fusos-horarios'],
      ['map-scale', 'summary-geografia-linguagem-cartografica'],
      ['aquifer', 'summary-geografia-agua-na-superficie-terrestre'],
      ['energy-matrix', 'summary-geografia-matriz-energetica'],
      ['network-redundancy', 'summary-geografia-geografia-das-redes-mundiais'],
    ];
    for (const [id, summaryId] of chapters) {
      const Component = geographyInstrument(id);
      const view = render(<Component {...props(summaryId)} />);
      expect(screen.getByRole('img')).toBeInTheDocument();
      expect(screen.getByRole('slider')).toHaveAttribute('type', 'range');
      view.unmount();
    }
  });

  it('recalcula a distância real quando a medida no mapa muda', () => {
    const Component = geographyInstrument('map-scale');
    render(<Component {...props('summary-geografia-linguagem-cartografica')} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '10' } });
    expect(screen.getAllByText('25 km').length).toBeGreaterThan(0);
  });

  it('mostra isolamento quando a única rota de rede é rompida', () => {
    const Component = geographyInstrument('network-redundancy');
    render(<Component {...props('summary-geografia-geografia-das-redes-mundiais')} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '1' } });
    expect(screen.getByText('nó isolado')).toBeInTheDocument();
  });
});
