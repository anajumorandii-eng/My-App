import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import type { EnglishInstrumentId } from '../../lib/englishInstrumentLab';
import { buildVisualMap } from '../../lib/visualStudy';
import { englishInstrument } from './EnglishInstrument';

const CHAPTERS: Array<[EnglishInstrumentId, string]> = [
  ['poetry-reading', 'summary-lingua-inglesa-text-comprehension-songs-and-poems'],
  ['quantity-language', 'summary-lingua-inglesa-text-comprehension-calories-and-energy'],
  ['modal-certainty', 'summary-lingua-inglesa-text-comprehension-earthquakes'],
  ['cause-connectors', 'summary-lingua-inglesa-text-comprehension-ecology-greenhouse-gases'],
  ['research-claims', 'summary-lingua-inglesa-text-comprehension-the-human-brain'],
];

function props(summaryId: string) {
  const summary = interactiveSummaries.find(item => item.id === summaryId);
  if (!summary) throw new Error(`Capítulo ausente: ${summaryId}`);
  return { map: buildVisualMap(summary), states: {}, selectedId: null, onSelect: vi.fn(), hiddenEdgeIds: [], mode: 'explorar' as const };
}

describe('instrumentos de leitura em inglês', () => {
  it('renderiza cinco cenas linguísticas com seletor acessível', () => {
    for (const [id, summaryId] of CHAPTERS) {
      const Component = englishInstrument(id);
      const view = render(<Component {...props(summaryId)} />);
      expect(screen.getByRole('img')).toHaveAccessibleName();
      expect(screen.getByRole('slider')).toHaveAttribute('type', 'range');
      view.unmount();
    }
  });

  it('preserva a diferença entre possibilidade, expectativa e previsão categórica', () => {
    const Component = englishInstrument('modal-certainty');
    render(<Component {...props('summary-lingua-inglesa-text-comprehension-earthquakes')} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '1' } });
    expect(screen.getAllByText('is expected to').length).toBeGreaterThan(0);
    expect(screen.getAllByText('expectativa fundamentada').length).toBeGreaterThan(0);
  });

  it('expõe a generalização causal como pegadinha de leitura científica', () => {
    const Component = englishInstrument('research-claims');
    render(<Component {...props('summary-lingua-inglesa-text-comprehension-the-human-brain')} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '2' } });
    expect(screen.getAllByText('causalidade direta').length).toBeGreaterThan(0);
    expect(screen.getByText('aceitar sem desenho causal')).toBeInTheDocument();
  });
});
