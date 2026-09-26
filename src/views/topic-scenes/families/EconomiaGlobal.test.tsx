import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { geografia } from '../data/geografia';
import { HistoriaGeografia } from './HistoriaGeografia';

describe('cenas do Lote 10: economia, indústria e ordem mundial', () => {
  it.each([
    ['summary-geografia-producao-agricola-mundial', /mecanização, escala e destino da colheita/, 'O QUE OS SEPARA', 'Sistemas intermediários', 'mercado formal'],
    ['summary-geografia-industria-i', /taylorismo, fordismo e toyotismo na mesma esteira/, 'Frederick Taylor', 'Coexistência hoje', 'Quarta Revolução'],
    ['summary-geografia-o-espaco-industrial-brasileiro-i', /capital do café, ferrovia e porto/, 'A BASE QUE O CAFÉ DEIXOU', 'Efeito cumulativo', 'mais da metade do valor da produção industrial nacional'],
    ['summary-geografia-geografia-do-turismo', /sol e praia, cultural e ecoturismo, negócios e eventos/, 'litoral nordestino', 'Negócios/eventos', 'dias úteis'],
    ['summary-geografia-blocos-economicos', /cada grau acrescentando um compromisso/, 'cada um, sua tarifa', 'União monetária', 'uma só moeda para os três'],
    ['summary-geografia-desigualdades-globais', /deterioração dos termos de troca/, 'cada vez mais sacas', 'Baixa competitividade', 'compete mal lá fora'],
    ['summary-geografia-do-mundo-bipolar-ao-multipolar', /reformas de Gorbachev, queda do Muro/, 'Pacto de Varsóvia', 'Momento unipolar', 'resta um polo'],
  ] as const)('desenha o mecanismo de %s', async (chapterId, name, text, button, after) => {
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
