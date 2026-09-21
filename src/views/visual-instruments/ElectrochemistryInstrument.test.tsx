import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import type { ElectrochemistryId } from '../../lib/electrochemistryLab';
import { buildVisualMap } from '../../lib/visualStudy';
import { electrochemistryInstrument } from './ElectrochemistryInstrument';

const CHAPTERS: Array<[ElectrochemistryId, string]> = [
  ['redox', 'summary-quimica-processos-de-oxirreducao'],
  ['cells', 'summary-quimica-introducao-ao-estudo-das-pilhas-e-baterias'],
  ['spontaneous', 'summary-quimica-eletroquimica-de-processos-espontaneos'],
  ['electrolysis', 'summary-quimica-eletroquimica-de-processos-nao-espontaneos'],
  ['quantitative', 'summary-quimica-aspectos-quantitativos-da-eletroquimica-e-metalurgia'],
];

function props(summaryId: string) {
  const summary = interactiveSummaries.find(item => item.id === summaryId);
  if (!summary) throw new Error(`Capítulo ausente: ${summaryId}`);
  return { map: buildVisualMap(summary), states: {}, selectedId: null, onSelect: vi.fn(), hiddenEdgeIds: [], mode: 'explorar' as const };
}

describe('instrumento de eletroquímica', () => {
  it('renderiza cinco mecanismos próprios e oferece range acessível', () => {
    for (const [id, summaryId] of CHAPTERS) {
      const Component = electrochemistryInstrument(id);
      const view = render(<Component {...props(summaryId)} />);
      expect(screen.getByRole('img')).toHaveAccessibleName();
      expect(screen.getByRole('slider')).toHaveAttribute('type', 'range');
      view.unmount();
    }
  });

  it('atualiza a massa de cobre pela lei de Faraday', () => {
    const Component = electrochemistryInstrument('quantitative');
    render(<Component {...props('summary-quimica-aspectos-quantitativos-da-eletroquimica-e-metalurgia')} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '60' } });
    expect(screen.getAllByText('2,37 g').length).toBeGreaterThan(0);
  });

  it('distingue eletrólise sustentada da tensão insuficiente', () => {
    const Component = electrochemistryInstrument('electrolysis');
    render(<Component {...props('summary-quimica-eletroquimica-de-processos-nao-espontaneos')} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '2' } });
    expect(screen.getByText('não sustentada')).toBeInTheDocument();
  });
});
