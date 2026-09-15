import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CamadasDeDeterminacao } from './CamadasDeDeterminacao';
import type { SceneEntry } from '../types';
const entry: SceneEntry = { chapterId: 'summary-filosofia-o-materialismo-historico', family: 'camadas-de-determinacao', question: 'O que determina as ideias de uma época?', items: [
  { label: 'Infraestrutura', claim: 'as relações de produção', section: 'Infraestrutura e superestrutura', quote: 'infraestrutura' },
  { label: 'Direito e Estado', claim: 'a forma jurídica acompanha a produção', section: 'Infraestrutura e superestrutura', quote: 'superestrutura' },
  { label: 'Ideias dominantes', claim: 'as da classe dominante', section: 'Modos de produção', quote: 'modo de produção' },
] };
describe('Camadas de determinação', () => {
  it('nomeia a base determinante', () => { render(<CamadasDeDeterminacao entry={entry} />); expect(screen.getByText('Infraestrutura')).toBeInTheDocument(); expect(screen.getByRole('img')).toHaveAccessibleName(/determina/); });
  it('revela a camada selecionada', () => { render(<CamadasDeDeterminacao entry={entry} />); fireEvent.click(screen.getByRole('button', { name: 'Ideias dominantes' })); expect(screen.getByRole('status')).toHaveTextContent('as da classe dominante'); });
  it('começa sem camada superior selecionada', () => { render(<CamadasDeDeterminacao entry={entry} />); expect(screen.queryByRole('status')).not.toBeInTheDocument(); });
});
