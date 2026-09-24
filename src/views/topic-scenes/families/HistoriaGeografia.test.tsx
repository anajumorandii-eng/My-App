import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { historia } from '../data/historia';
import { geografia } from '../data/geografia';
import { HistoriaGeografia } from './HistoriaGeografia';

describe('pranchas de História e Geografia', () => {
  it('separa a cronologia da Revolução Francesa das pressões que levaram ao Terror', async () => {
    const user = userEvent.setup();
    const entry = historia.find(item => item.chapterId === 'summary-historia-revolucao-francesa')!;
    render(<HistoriaGeografia entry={entry} />);
    const diagram = screen.getByRole('img', { name: /Revolução Francesa.*Terror/i });
    expect(diagram).toHaveTextContent('guerra externa + desconfiança interna');
    const terror = screen.getByRole('button', { name: 'O Terror' });
    terror.focus();
    await user.keyboard('{Enter}');
    expect(terror).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('fatores internos e externos');
    expect(diagram).toHaveAttribute('aria-label', expect.stringContaining('etapa 4'));
  });

  it('explica as propriedades preservadas por três projeções sem prometer um mapa sem distorção', async () => {
    const user = userEvent.setup();
    const entry = geografia.find(item => item.chapterId === 'summary-geografia-projecoes-cartograficas')!;
    render(<HistoriaGeografia entry={entry} />);
    const diagram = screen.getByRole('img', { name: /Propriedades cartográficas comparadas/i });
    expect(diagram).toHaveTextContent('forma local');
    expect(diagram).toHaveTextContent('área relativa');
    expect(diagram).toHaveTextContent('distância do centro');
    await user.click(screen.getByRole('button', { name: 'Equidistante' }));
    expect(screen.getByRole('status')).toHaveTextContent('ponto central');
    expect(diagram).toHaveAttribute('aria-label', expect.stringContaining('equidistante selecionada'));
  });

  it('liga cercamentos à fábrica e distingue documentação, pressão social e leis fabris', async () => {
    const user = userEvent.setup();
    const entry = historia.find(item => item.chapterId === 'summary-historia-revolucao-industrial')!;
    render(<HistoriaGeografia entry={entry} />);
    const diagram = screen.getByRole('img', { name: /Revolução Industrial.*leis fabris/i });
    expect(diagram).toHaveTextContent('mão de obra');
    expect(diagram).toHaveTextContent('documentação + pressão social');
    await user.click(screen.getByRole('button', { name: 'Leis fabris' }));
    expect(screen.getByRole('status')).toHaveTextContent('reformistas sociais');
  });

  it('contrasta chuva convectiva, orográfica e frontal pelo mecanismo de ascensão', async () => {
    const user = userEvent.setup();
    const entry = geografia.find(item => item.chapterId === 'summary-geografia-dinamica-climatica')!;
    render(<HistoriaGeografia entry={entry} />);
    const diagram = screen.getByRole('img', { name: /Chuva convectiva.*orográfica.*frontal/i });
    await user.click(screen.getByRole('button', { name: 'Orográfica' }));
    expect(diagram).toHaveTextContent('barreira do relevo');
    expect(screen.getByRole('status')).toHaveTextContent('barlavento');
    expect(diagram).toHaveAttribute('aria-label', expect.stringContaining('orográfica selecionada'));
  });
});
