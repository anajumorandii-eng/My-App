import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { biologia } from '../data/biologia';
import { BiologiaProcessos } from './BiologiaProcessos';

const chapter = (id: string) => {
  const entry = biologia.find(item => item.chapterId === id);
  if (!entry) throw new Error(`Capítulo não encontrado: ${id}`);
  return entry;
};

describe('atlas biológico por capítulo', () => {
  it('liga a profundidade à luz e ao pigmento das algas ao selecionar por teclado', async () => {
    const user = userEvent.setup();
    render(<BiologiaProcessos entry={chapter('summary-biologia-algas')}/>);
    const diagram = screen.getByRole('img', { name: /luz vermelha se atenua/i });
    expect(diagram).toHaveTextContent('vermelha');
    expect(diagram).toHaveTextContent('azul-verde');
    const red = screen.getByRole('button', { name: 'Vermelhas' });
    red.focus();
    await user.keyboard('{Enter}');
    expect(red).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('ficoeritrina');
  });

  it('mostra a posição da meiose em cada ciclo sem trocar os estágios n e 2n', () => {
    render(<BiologiaProcessos entry={chapter('summary-biologia-ciclos-de-vida')}/>);
    expect(screen.getByRole('img', { name: /Meiose zigótica: adulto n → gametas n → zigoto 2n → meiose/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Haplobionte diplonte' }));
    expect(screen.getByRole('img', { name: /Meiose gamética: adulto 2n → meiose → gametas n/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Diplobionte' }));
    expect(screen.getByRole('img', { name: /Meiose espórica: esporófito 2n → meiose → esporos n → gametófito n/i })).toBeInTheDocument();
  });
});
