import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import type { HistoryInstrumentId } from '../../lib/historyInstrumentLab';
import { buildVisualMap } from '../../lib/visualStudy';
import { historyInstrument } from './HistoryInstrument';

const CHAPTERS: Array<[HistoryInstrumentId, string]> = [
  ['america-xix', 'summary-historia-america-no-seculo-xix'],
  ['wwii-fronts', 'summary-historia-segunda-guerra-mundial-1939-1945'],
  ['cold-war', 'summary-historia-guerra-fria'],
  ['interiorization', 'summary-historia-a-interiorizacao-da-colonizacao'],
  ['mining-colony', 'summary-historia-a-mineracao-no-brasil-colonial'],
];

function props(summaryId: string) {
  const summary = interactiveSummaries.find(item => item.id === summaryId);
  if (!summary) throw new Error(`Capítulo ausente: ${summaryId}`);
  return { map: buildVisualMap(summary), states: {}, selectedId: null, onSelect: vi.fn(), hiddenEdgeIds: [], mode: 'explorar' as const };
}

describe('instrumentos históricos', () => {
  it('renderiza cinco cenas específicas com seletor acessível', () => {
    for (const [id, summaryId] of CHAPTERS) {
      const Component = historyInstrument(id);
      const view = render(<Component {...props(summaryId)} />);
      expect(screen.getByRole('img')).toHaveAccessibleName();
      expect(screen.getByRole('slider')).toHaveAttribute('type', 'range');
      view.unmount();
    }
  });

  it('troca o teatro da Segunda Guerra sem convertê-lo em cadeia causal', () => {
    const Component = historyInstrument('wwii-fronts');
    render(<Component {...props('summary-historia-segunda-guerra-mundial-1939-1945')} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '2' } });
    expect(screen.getAllByText('Pacífico').length).toBeGreaterThan(0);
    expect(screen.getAllByText('ilhas, Midway e rendição japonesa').length).toBeGreaterThan(0);
  });

  it('distingue a derrama dos outros mecanismos fiscais', () => {
    const Component = historyInstrument('mining-colony');
    render(<Component {...props('summary-historia-a-mineracao-no-brasil-colonial')} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '2' } });
    expect(screen.getAllByText('Derrama').length).toBeGreaterThan(0);
    expect(screen.getAllByText('cobrança compulsória').length).toBeGreaterThan(0);
  });
});
