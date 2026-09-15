import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ContrasteDePosicoes } from './ContrasteDePosicoes';
import type { SceneEntry } from '../types';

const entry: SceneEntry = {
  chapterId: 'summary-filosofia-heraclito-e-parmenides-o-ser-e-o-devir',
  family: 'contraste-de-posicoes',
  question: 'O que é real: o que muda ou o que permanece?',
  items: [
    { label: 'Heráclito', claim: 'o devir é o real; a permanência é aparência', section: 'Heráclito e o devir', quote: 'tudo flui' },
    { label: 'Parmênides', claim: 'o ser é; o não-ser não é, e mudar exigiria não-ser', section: 'Parmênides e o ser', quote: 'o ser é' },
  ],
};

describe('Contraste de posições', () => {
  it('abre com a pergunta e nenhuma posição escolhida', () => {
    render(<ContrasteDePosicoes entry={entry} />);
    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('O que é real');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('revela a afirmação só quando a posição é escolhida', () => {
    render(<ContrasteDePosicoes entry={entry} />);
    fireEvent.click(screen.getByRole('button', { name: 'Parmênides' }));
    expect(screen.getByRole('status')).toHaveTextContent('mudar exigiria não-ser');
    expect(screen.getByRole('button', { name: 'Parmênides' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Heráclito' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('troca a afirmação ao trocar de posição, sem acumular as duas', () => {
    render(<ContrasteDePosicoes entry={entry} />);
    fireEvent.click(screen.getByRole('button', { name: 'Parmênides' }));
    fireEvent.click(screen.getByRole('button', { name: 'Heráclito' }));
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('a permanência é aparência');
    expect(status).not.toHaveTextContent('não-ser');
  });

  it('mostra o trecho citado do capítulo sob demanda', () => {
    render(<ContrasteDePosicoes entry={entry} />);
    fireEvent.click(screen.getByRole('button', { name: 'Heráclito' }));
    fireEvent.click(screen.getByRole('button', { name: 'Ver o trecho do capítulo' }));
    expect(screen.getByText(/tudo flui/)).toBeInTheDocument();
  });
});
