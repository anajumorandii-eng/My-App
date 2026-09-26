import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { geografia } from '../data/geografia';
import { HistoriaGeografia } from './HistoriaGeografia';

describe('Lote 9 — clima, relevo e biogeografia mundiais', () => {
  it.each([
    ['summary-geografia-clima-mundial', /Fatores do clima em corte esquemático/, 'continentalidade', 'Nenhum isolado', 'sombra de chuva'],
    ['summary-geografia-geomorfologia-mundial', /Estruturas do relevo em bloco da América do Sul/, 'Escudo Brasileiro', 'Dobras modernas', 'Nazca mergulha'],
    ['summary-geografia-biogeografia-mundial', /Biomas por latitude do equador ao polo/, 'célula de Hadley', 'Temperado-polar', 'mais fria a média do ano'],
    ['summary-geografia-geopolitica-dos-recursos-hidricos', /Nilo de montante a jusante/, 'a montante', 'Risco de escalada', 'sem alternativa'],
    ['summary-geografia-paisagem-espaco-geografico-e-ciencia-geografica', /A mesma paisagem lida por três correntes/, 'REJEITADA', 'Geografia crítica', 'Milton Santos'],
  ] as const)('desenha o mecanismo de %s e acompanha o último recorte', async (chapterId, name, text, button, after) => {
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
});
