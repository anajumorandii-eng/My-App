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
