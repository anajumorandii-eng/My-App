import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GradeDeEixos } from './GradeDeEixos';
import type { SceneEntry } from '../types';

const entry: SceneEntry = {
  chapterId: 'summary-sociologia-anomia-e-coesao-social',
  family: 'grade-de-eixos',
  question: 'Que tipo de suicídio resulta do cruzamento entre integração e regulação?',
  eixos: {
    a: { nome: 'Integração', polos: ['insuficiente', 'excessiva'] },
    b: { nome: 'Regulação', polos: ['insuficiente', 'excessiva'] },
  },
  items: [
    { label: 'Egoísta', claim: 'integração insuficiente', section: 'O estudo sobre o suicídio', quote: 'por integração insuficiente', celula: { eixoA: 0, eixoB: 0 } },
    { label: 'Altruísta', claim: 'integração excessiva', section: 'O estudo sobre o suicídio', quote: 'por integração excessiva', celula: { eixoA: 1, eixoB: 0 } },
    { label: 'Anômico', claim: 'falta de regulação', section: 'O estudo sobre o suicídio', quote: 'por falta de regulação', celula: { eixoA: 0, eixoB: 1 } },
    { label: 'Fatalista', claim: 'regulação opressiva', section: 'O estudo sobre o suicídio', quote: 'por regulação opressiva', celula: { eixoA: 1, eixoB: 1 } },
  ],
};

describe('Grade de eixos', () => {
  it('abre com a pergunta e a célula inicial (polo 0 de cada eixo)', () => {
    render(<GradeDeEixos entry={entry} />);
    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('Que tipo de suicídio');
    expect(screen.getByRole('status')).toHaveTextContent('integração insuficiente');
  });

  it('rotula os eixos a partir da entrada, não de texto fixo', () => {
    render(<GradeDeEixos entry={entry} />);
    expect(screen.getByText('Integração')).toBeInTheDocument();
    expect(screen.getByText('Regulação')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'excessiva' })).toHaveLength(2);
  });

  it('move por teclado num eixo com aria-pressed e muda a célula', () => {
    render(<GradeDeEixos entry={entry} />);
    const botoes = screen.getAllByRole('button', { name: 'excessiva' });
    // primeiro grupo de botões "excessiva" pertence ao eixo Integração
    fireEvent.click(botoes[0]);
    expect(botoes[0]).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('integração excessiva');
  });

  it('troca a célula sem acumular a afirmação anterior', () => {
    render(<GradeDeEixos entry={entry} />);
    const [integracaoExcessiva] = screen.getAllByRole('button', { name: 'excessiva' });
    fireEvent.click(integracaoExcessiva);
    const status1 = screen.getByRole('status').textContent;
    const [integracaoInsuficiente] = screen.getAllByRole('button', { name: 'insuficiente' });
    fireEvent.click(integracaoInsuficiente);
    const status2 = screen.getByRole('status').textContent;
    expect(status2).not.toEqual(status1);
  });

  it('mostra a citação da célula selecionada', () => {
    render(<GradeDeEixos entry={entry} />);
    expect(screen.getByText(/por integração insuficiente/)).toBeInTheDocument();
  });

  it('mover em cada eixo independentemente muda a célula, provando que os dois eixos são o conteúdo', () => {
    render(<GradeDeEixos entry={entry} />);
    // estado inicial: Egoísta (0,0)
    expect(screen.getByRole('status')).toHaveTextContent('Egoísta');

    // mover só o eixo Regulação para 1 -> Anômico (0,1)
    const regulacaoExcessiva = screen.getAllByRole('button', { name: 'excessiva' })[1];
    fireEvent.click(regulacaoExcessiva);
    expect(screen.getByRole('status')).toHaveTextContent('Anômico');

    // mover também o eixo Integração para 1 -> Fatalista (1,1)
    const integracaoExcessiva = screen.getAllByRole('button', { name: 'excessiva' })[0];
    fireEvent.click(integracaoExcessiva);
    expect(screen.getByRole('status')).toHaveTextContent('Fatalista');
  });
});
