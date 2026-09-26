import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { geografia } from '../data/geografia';
import { sceneFor } from '../sceneFor';
import { HistoriaGeografia } from './HistoriaGeografia';

describe('cenas do Lote 19: indústria, geoeconomia e espaço agrário e industrial', () => {
  it.each([
    ['summary-geografia-industria-ii', /deslocalização da manufatura/, 'mão de obra mais barata', 'Economia circular', 'NÃO É SÓ RECICLAGEM'],
    ['summary-geografia-gedeconomia-mundial', /chips contra terras-raras/, 'litografia EUV', 'Desdolarização', 'moeda de reserva dominante'],
    ['summary-geografia-o-espaco-agrario-brasileiro', /correção do solo do Cerrado/, 'QUEM TEM A TERRA', 'Conflitos pela terra', 'GRILAGEM NA FRONTEIRA'],
    ['summary-geografia-o-espaco-industrial-brasileiro-ii', /guerra fiscal do ICMS/, 'empurra: a RMSP saturada', 'Desindustrialização precoce', 'cai antes de enriquecer'],
  ] as const)('desenha o mecanismo de %s', async (chapterId, name, text, button, after) => {
    expect(sceneFor(chapterId)).not.toBeNull();
    const user = userEvent.setup();
    const entry = geografia.find(item => item.chapterId === chapterId)!;
    render(<HistoriaGeografia entry={entry} />);
    const diagram = screen.getByRole('img', { name });
    expect(diagram).toHaveTextContent(text);
    const target = screen.getByRole('button', { name: button });
    await user.click(target);
    expect(target).toHaveAttribute('aria-pressed', 'true');
    expect(diagram).toHaveTextContent(after);
    expect(diagram).toHaveAttribute('aria-label', expect.stringContaining(`recorte ${entry.items.length}`));
  });

  it('não traz de volta o que o resumo do Espaço Industrial II não sustenta', () => {
    const entry = geografia.find(item => item.chapterId === 'summary-geografia-o-espaco-industrial-brasileiro-ii')!;
    const { container } = render(<HistoriaGeografia entry={entry} />);
    expect(container.textContent).not.toMatch(/comando concentrado|sedes|mercado consumidor|capital inicial/i);
  });
});
