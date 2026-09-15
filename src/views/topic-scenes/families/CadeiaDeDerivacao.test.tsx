import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CadeiaDeDerivacao } from './CadeiaDeDerivacao';
import type { SceneEntry } from '../types';

const entry: SceneEntry = {
  chapterId: 'summary-filosofia-hobbes-e-o-estado-de-natureza',
  family: 'cadeia-de-derivacao',
  question: 'Como se chega da guerra de todos ao soberano?',
  items: [
    { label: 'Igualdade natural', claim: 'ninguém é tão forte que não possa ser morto', section: 'O estado de natureza', quote: 'estado de natureza' },
    { label: 'Guerra de todos', claim: 'a insegurança é permanente', section: 'O estado de natureza', quote: 'guerra' },
    { label: 'Pacto', claim: 'cada um abre mão do direito a tudo', section: 'O contrato', quote: 'contrato' },
    { label: 'Soberano', claim: 'o poder não é parte do pacto, e por isso não se dissolve', section: 'Consequências políticas', quote: 'soberano' },
  ],
};

describe('Cadeia de derivação', () => {
  it('abre com só o primeiro elo revelado', () => {
    render(<CadeiaDeDerivacao entry={entry} />);
    expect(screen.getByRole('status')).toHaveTextContent('ninguém é tão forte');
    expect(screen.queryByText('o poder não é parte do pacto, e por isso não se dissolve')).not.toBeInTheDocument();
  });

  it('avança um elo por vez', () => {
    render(<CadeiaDeDerivacao entry={entry} />);
    fireEvent.click(screen.getByRole('button', { name: 'Próximo elo' }));
    expect(screen.getByRole('status')).toHaveTextContent('a insegurança é permanente');
  });

  it('para no último elo e oferece recomeçar', () => {
    render(<CadeiaDeDerivacao entry={entry} />);
    fireEvent.click(screen.getByRole('button', { name: 'Próximo elo' }));
    fireEvent.click(screen.getByRole('button', { name: 'Próximo elo' }));
    fireEvent.click(screen.getByRole('button', { name: 'Próximo elo' }));
    expect(screen.getByRole('status')).toHaveTextContent('não se dissolve');
    expect(screen.queryByRole('button', { name: 'Próximo elo' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Recomeçar a cadeia' }));
    expect(screen.getByRole('status')).toHaveTextContent('ninguém é tão forte');
  });

  it('mostra quantos elos faltam', () => {
    render(<CadeiaDeDerivacao entry={entry} />);
    expect(screen.getByText('elo 1 de 4')).toBeInTheDocument();
  });
});
