import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Tipologia } from './Tipologia';
import type { SceneEntry } from '../types';

const entryComNota: SceneEntry = {
  chapterId: 'summary-sociologia-tipos-de-acao-social',
  family: 'tipologia',
  question: 'Que tipos de sentido orientam a ação social?',
  nota: 'São tipos ideais: na realidade, as ações costumam combinar mais de um tipo.',
  items: [
    { label: 'Racional-fim', claim: 'busca o meio mais eficiente para um fim dado', section: 'Os quatro tipos', quote: 'orientada por cálculo de meios e fins' },
    { label: 'Tradicional', claim: 'repete o costume estabelecido', section: 'Os quatro tipos', quote: 'orientada pelo costume arraigado' },
  ],
};

const entrySemNota: SceneEntry = {
  ...entryComNota,
  chapterId: 'summary-sociologia-outra',
  nota: undefined,
};

describe('Tipologia', () => {
  it('abre com a pergunta e nenhum tipo em foco', () => {
    render(<Tipologia entry={entryComNota} />);
    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('Que tipos de sentido');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('revela a afirmação do tipo escolhido por teclado, com aria-pressed', () => {
    render(<Tipologia entry={entryComNota} />);
    const botao = screen.getByRole('button', { name: 'Tradicional' });
    fireEvent.click(botao);
    expect(screen.getByRole('status')).toHaveTextContent('repete o costume estabelecido');
    expect(botao).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Racional-fim' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('troca o tipo em foco sem acumular a afirmação anterior', () => {
    render(<Tipologia entry={entryComNota} />);
    fireEvent.click(screen.getByRole('button', { name: 'Tradicional' }));
    fireEvent.click(screen.getByRole('button', { name: 'Racional-fim' }));
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('busca o meio mais eficiente');
    expect(status).not.toHaveTextContent('costume arraigado');
  });

  it('mostra a citação do tipo em foco', () => {
    render(<Tipologia entry={entryComNota} />);
    fireEvent.click(screen.getByRole('button', { name: 'Racional-fim' }));
    expect(screen.getByText(/cálculo de meios e fins/)).toBeInTheDocument();
  });

  it('exibe a nota de combinação quando a entrada a fornece', () => {
    render(<Tipologia entry={entryComNota} />);
    expect(screen.getByText(/costumam combinar mais de um tipo/)).toBeInTheDocument();
  });

  it('não exibe nenhum texto genérico de combinação quando a entrada não fornece nota', () => {
    render(<Tipologia entry={entrySemNota} />);
    expect(screen.queryByText(/combinam/)).not.toBeInTheDocument();
    expect(screen.queryByText(/costumam combinar/)).not.toBeInTheDocument();
  });

  it('mostra a mudança de códon e o efeito antes do toque no capítulo de mutações', () => {
    const mutation = { ...entrySemNota, chapterId: 'summary-biologia-mutacoes-genicas', items: [
      { label: 'Silenciosa', claim: 'mesmo aminoácido', section: 'Alterações', quote: 'degeneração' },
      { label: 'Frameshift', claim: 'quadro deslocado', section: 'Alterações', quote: 'inserção' },
    ] };
    render(<Tipologia entry={mutation} />);
    expect(screen.getByText('GAA → Glu')).toBeInTheDocument();
    expect(screen.getByText('GAG → Glu')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('tab', { name: 'Frameshift' }));
    expect(screen.getByText('AUG | CAA | ACC…')).toBeInTheDocument();
  });
});
