import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { geografia } from '../data/geografia';
import { sceneFor } from '../sceneFor';
import { HistoriaGeografia } from './HistoriaGeografia';

describe('cenas do Lote 12: Ásia, Oriente Médio, Questão Palestina e mundo árabe', () => {
  it.each([
    ['summary-geografia-geopolitica-e-geoeconomia-da-asia', /China sobe na cadeia de valor desde 1978/, 'SUBIDA NA CADEIA DE VALOR', 'China plus one', 'CHINA PLUS ONE'],
    ['summary-geografia-geografia-do-oriente-medio', /petróleo do Golfo, Ormuz e Suez/, '1/5 do petróleo', 'Água a jusante', 'barragens turcas nas cabeceiras'],
    ['summary-geografia-questao-palestina', /Declaração Balfour de 1917/, 'DECLARAÇÃO BALFOUR · 1917', 'Impasses atuais', 'em ambos os lados'],
    ['summary-geografia-conflitos-no-mundo-arabe', /a onda de 2010–2011, três desfechos/, 'GATILHOS COMUNS', 'Raízes estruturais', 'GUERRA POR PROCURAÇÃO'],
  ] as const)('desenha a cena autoral de %s', async (chapterId, name, text, button, after) => {
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

  it('atribui cada posição da Questão Palestina a quem a sustenta', async () => {
    const user = userEvent.setup();
    const entry = geografia.find(item => item.chapterId === 'summary-geografia-questao-palestina')!;
    render(<HistoriaGeografia entry={entry} />);
    const diagram = screen.getByRole('img', { name: /Questão Palestina/ });
    await user.click(screen.getByRole('button', { name: '1947 · Partilha' }));
    expect(diagram).toHaveTextContent('pelas lideranças');
    expect(diagram).toHaveTextContent('pela liderança palestina');
    await user.click(screen.getByRole('button', { name: '1948 e 1967' }));
    expect(diagram).toHaveTextContent('como os');
  });
});
