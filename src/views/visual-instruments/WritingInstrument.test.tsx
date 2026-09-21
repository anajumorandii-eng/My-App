import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import type { WritingInstrumentId } from '../../lib/writingInstrumentLab';
import { buildVisualMap } from '../../lib/visualStudy';
import { writingInstrument } from './WritingInstrument';

const CHAPTERS: Array<[WritingInstrumentId, string]> = [
  ['essay-myths', 'summary-redacao-a-dissertacao-no-vestibular-mitos-e-verdades'],
  ['evaluation', 'summary-redacao-o-que-se-avalia-na-dissertacao-competencias-e-habilidades'],
  ['idea-map', 'summary-redacao-organizando-as-ideias-brainstorm-e-mind-maps'],
  ['repertoire', 'summary-redacao-repertorio-o-diferencial-de-redacoes-de-sucesso'],
  ['theme-axes', 'summary-redacao-qual-sera-o-tema-deste-ano-grandes-eixos-tematicos'],
];

function props(summaryId: string) {
  const summary = interactiveSummaries.find((item) => item.id === summaryId);
  if (!summary) throw new Error(`Capítulo ausente: ${summaryId}`);
  return { map: buildVisualMap(summary), states: {}, selectedId: null, onSelect: vi.fn(), hiddenEdgeIds: [], mode: 'explorar' as const };
}

describe('instrumentos fundamentais de redação', () => {
  it('renderiza cinco oficinas autorais com controle acessível', () => {
    for (const [id, summaryId] of CHAPTERS) {
      const Component = writingInstrument(id);
      const view = render(<Component {...props(summaryId)} />);
      expect(screen.getByRole('img')).toHaveAccessibleName();
      expect(screen.getByRole('slider')).toHaveAccessibleName();
      expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext');
      view.unmount();
    }
  });

  it('mostra quando o repertório passa de citação decorativa a evidência', () => {
    const Component = writingInstrument('repertoire');
    render(<Component {...props('summary-redacao-repertorio-o-diferencial-de-redacoes-de-sucesso')} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '2' } });
    expect(screen.getAllByText('repertório produtivo').length).toBeGreaterThan(0);
    expect(screen.getByText('explicar como a referência sustenta a tese')).toBeInTheDocument();
  });
});
