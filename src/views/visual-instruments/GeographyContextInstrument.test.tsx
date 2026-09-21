import React from 'react';
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import { GEOGRAPHY_CONTEXTS, type GeographyContextId } from '../../lib/geographyContextLab';
import { geographyContextInstrument } from './GeographyContextInstrument';

describe('contextos territoriais de Geografia', () => {
  it('liga cada instrumento a um capítulo geográfico existente', () => {
    for (const config of Object.values(GEOGRAPHY_CONTEXTS)) {
      expect(interactiveSummaries.find((summary) => summary.id === config.chapterId)?.subject).toBe('Geografia');
    }
  });

  it('troca o recorte e atualiza a leitura territorial', () => {
    const id: GeographyContextId = 'electricity-system';
    const summary = interactiveSummaries.find((item) => item.id === GEOGRAPHY_CONTEXTS[id].chapterId)!;
    const Board = geographyContextInstrument(id);
    render(<Board map={buildVisualMap(summary)} states={{}} selectedId={null} onSelect={() => {}} hiddenEdgeIds={[]} mode="explorar" />);
    fireEvent.click(screen.getByRole('button', { name: 'Transmissão' }));
    expect(screen.getByRole('button', { name: 'Transmissão' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('img', { name: /Transmissão em foco/ })).toBeInTheDocument();
    expect(screen.getAllByText(/Linhas e subestações conectam distâncias/i).length).toBeGreaterThan(0);
  });
});
