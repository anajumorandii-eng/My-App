import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import { magnetismInstrument } from './MagnetismInstrument';
import type { MagnetismId } from '../../lib/magnetismLab';

function props(summaryId: string) { return { map: buildVisualMap(interactiveSummaries.find((item) => item.id === summaryId)!), states: {}, selectedId: null, onSelect: vi.fn(), hiddenEdgeIds: [], mode: 'explorar' as const }; }
describe('instrumento de magnetismo', () => {
  it('renderiza as cinco situações físicas distintas', () => {
    const chapters: Array<[MagnetismId, string]> = [
      ['fio-espira', 'summary-fisica-campo-magnetico-devido-a-corrente-em-fio-reto-e-espira-descricao-vetorial-e-aplicacoes'],
      ['carga-em-b', 'summary-fisica-forca-magnetica-e-analise-de-lancamentos-de-cargas-em-um-campo-magnetico-uniforme'],
      ['fios-paralelos', 'summary-fisica-analise-de-forca-magnetica-em-fios-percorridos-por-correntes-continuas'],
      ['lenz', 'summary-fisica-inducao-eletromagnetica-lei-de-lenz'],
      ['gerador', 'summary-fisica-inducao-eletromagnetica-analise-da-corrente-induzida-em-geradores'],
    ];
    for (const [id, summaryId] of chapters) { const Component = magnetismInstrument(id); const view = render(<Component {...props(summaryId)} />); expect(screen.getByRole('img')).toBeInTheDocument(); expect(screen.getByRole('slider')).toHaveAttribute('type', 'range'); view.unmount(); }
  });
  it('atualiza a força quando o ângulo entre velocidade e campo muda', () => {
    const Component = magnetismInstrument('carga-em-b'); render(<Component {...props('summary-fisica-forca-magnetica-e-analise-de-lancamentos-de-cargas-em-um-campo-magnetico-uniforme')} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '0' } }); expect(screen.getAllByText('0 N').length).toBeGreaterThan(0);
  });
});
