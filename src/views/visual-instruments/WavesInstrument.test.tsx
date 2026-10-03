import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import { wavesInstrument } from './WavesInstrument';
import type { WavesId } from '../../lib/wavesLab';

function props(summaryId: string) { return { map: buildVisualMap(interactiveSummaries.find(item => item.id === summaryId)!), states: {}, selectedId: null, onSelect: vi.fn(), hiddenEdgeIds: [], mode: 'explorar' as const }; }
describe('instrumento de ondulatória', () => {
  it('expõe uma leitura visual e um controle nativo em cada fenômeno', () => {
    const chapters: Array<[WavesId, string]> = [['wave-equation', 'summary-fisica-equacao-fundamental-da-ondulatoria'], ['sound-intensity', 'summary-fisica-intensidade-sonora'], ['interference', 'summary-fisica-interferencia-de-ondas-analise-quantitativa-aplicacoes-e-batimento'], ['string-harmonics', 'summary-fisica-ondas-estacionarias-em-cordas'], ['doppler', 'summary-fisica-efeito-doppler-descricao-e-estudo-quantitativo']];
    for (const [id, summaryId] of chapters) { const Component = wavesInstrument(id); const view = render(<Component {...props(summaryId)} />); expect(screen.getByRole('img')).toBeInTheDocument(); expect(screen.getByRole('slider')).toHaveAttribute('type', 'range'); view.unmount(); }
  });
  it('mostra cancelamento quando as ondas ficam em oposição de fase', () => { const Component = wavesInstrument('interference'); render(<Component {...props('summary-fisica-interferencia-de-ondas-analise-quantitativa-aplicacoes-e-batimento')} />); fireEvent.change(screen.getByRole('slider'), { target: { value: '180' } }); expect(screen.getAllByText('0 cm').length).toBeGreaterThan(0); });
});

describe('frentes circulares do Doppler', () => {
  it('renderiza centros e raios físicos em repouso, no valor inicial e no máximo', () => {
    const Component = wavesInstrument('doppler');
    const view = render(<Component {...props('summary-fisica-efeito-doppler-descricao-e-estudo-quantitativo')} />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('min', '0');
    expect(slider).toHaveAttribute('max', '80');
    expect(slider).toHaveAttribute('step', '10');
    expect(slider).toHaveValue('40');
    for (const speed of [40, 0, 80]) {
      fireEvent.change(slider, { target: { value: String(speed) } });
      const fronts = Array.from(view.container.querySelectorAll('circle[data-doppler-front]'));
      expect(fronts).toHaveLength(4);
      fronts.forEach((front, i) => {
        const age = (i + 1) / 500;
        expect(Number(front.getAttribute('cx'))).toBeCloseTo(150 - speed * age * 32);
        expect(Number(front.getAttribute('cy'))).toBe(140);
        expect(Number(front.getAttribute('r'))).toBeCloseTo(340 * age * 32);
      });
      const heard = String(Math.round(500 * 340 / (340 - speed) * 10) / 10).replace('.', ',');
      expect(screen.getAllByText(`${heard} Hz`).length).toBeGreaterThan(0);
      expect(view.container.querySelector('[data-doppler-source]')).toHaveAttribute('cx', '150');
      expect(view.container.querySelector('[data-doppler-observer]')).toHaveAttribute('cx', '265');
    }
  });
});
