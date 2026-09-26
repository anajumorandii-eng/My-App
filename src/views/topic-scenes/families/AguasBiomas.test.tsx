import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HistoriaGeografia } from './HistoriaGeografia';
import { geografia } from '../data/geografia';
import { sceneFor } from '../sceneFor';
import { SCENES_LOTE16, HEADERS_LOTE16 } from './AguasBiomas';

describe('Lote 16: águas e biomas', () => {
  it.each([
    ['summary-geografia-hidrogeografia-mundial', /Hidrogeografia mundial/, 'mais de 6.600 km', 'Estresse hídrico', '1.000 m³ por hab./ano'],
    ['summary-geografia-hidrogeografia-do-brasil', /Hidrogeografia do Brasil/, '40% a 45% da água', 'Transposição', 'Paraíba e Pernambuco'],
    ['summary-geografia-biogeografia-do-brasil-i', /Biogeografia do Brasil I:/, 'sub-bosque', 'Caatinga: seca e chuva', 'perde as folhas:'],
    ['summary-geografia-biogeografia-do-brasil-ii', /Biogeografia do Brasil II:/, 'na seca eles ficam presos nas poças', 'Fogo no Pantanal', 'drenagem artificial de áreas úmidas'],
  ] as const)('desenha a cena própria de %s', async (chapterId, name, first, button, last) => {
    expect(sceneFor(chapterId)).not.toBeNull();
    expect(SCENES_LOTE16[chapterId]).toBeDefined();
    expect(HEADERS_LOTE16[chapterId]).toBeTruthy();
    const user = userEvent.setup();
    const entry = geografia.find(item => item.chapterId === chapterId)!;
    render(<HistoriaGeografia entry={entry} />);
    const diagram = screen.getByRole('img', { name });
    expect(diagram).toHaveTextContent(first);
    const target = screen.getByRole('button', { name: button });
    await user.click(target);
    expect(target).toHaveAttribute('aria-pressed', 'true');
    expect(diagram).toHaveTextContent(last);
    expect(diagram).toHaveAttribute('aria-label', expect.stringContaining(`recorte ${entry.items.length}`));
  });

  it('dá cenas diferentes às duas hidrografias e às duas biogeografias', () => {
    expect(SCENES_LOTE16['summary-geografia-hidrogeografia-mundial']).not.toBe(SCENES_LOTE16['summary-geografia-hidrogeografia-do-brasil']);
    expect(SCENES_LOTE16['summary-geografia-biogeografia-do-brasil-i']).not.toBe(SCENES_LOTE16['summary-geografia-biogeografia-do-brasil-ii']);
  });
});
