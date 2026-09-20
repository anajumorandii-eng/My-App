import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import { opticsInstrument } from './OpticsInstrument';
import type { OpticsId } from '../../lib/opticsLab';

const props = (id: string) => ({ map: buildVisualMap(interactiveSummaries.find(item => item.id === id)!), states: {}, selectedId: null, onSelect: vi.fn(), hiddenEdgeIds: [], mode: 'explorar' as const });

describe('instrumento de óptica', () => {
  it('expõe quatro mecanismos com controles de faixa nativos', () => {
    const chapters: Array<[OpticsId, string]> = [
      ['plane-mirror', 'summary-fisica-reflexao-em-superficies-planas'],
      ['spherical-mirror', 'summary-fisica-reflexao-em-superficies-esfericas'],
      ['refraction', 'summary-fisica-refracao-fundamentos-leis-e-aplicacoes'],
      ['vision', 'summary-fisica-optica-da-visao'],
    ];
    for (const [id, chapter] of chapters) {
      const Component = opticsInstrument(id);
      const view = render(<Component {...props(chapter)} />);
      expect(screen.getByRole('img')).toBeInTheDocument();
      expect(screen.getByRole('slider')).toHaveAttribute('type', 'range');
      view.unmount();
    }
  });

  it('atualiza o ângulo refratado quando a incidência muda', () => {
    const Component = opticsInstrument('refraction');
    render(<Component {...props('summary-fisica-refracao-fundamentos-leis-e-aplicacoes')} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '30' } });
    expect(screen.getAllByText('19,5°').length).toBeGreaterThan(0);
  });
});
