import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { QuimicaTipologia } from './QuimicaTipologia';
import type { SceneEntry } from '../types';

const geometry: SceneEntry = {
  chapterId: 'summary-quimica-geometria-molecular',
  family: 'tipologia',
  question: 'Quais geometrias?',
  items: [
    { label: 'Linear', claim: 'dois pares, 180°', section: 'Geometrias', quote: 'linear' },
    { label: 'Angular (H2O)', claim: 'dois pares isolados', section: 'Geometrias', quote: 'angular' },
  ],
};

const organic: SceneEntry = {
  chapterId: 'summary-quimica-reconhecimento-de-funcoes-organicas-e-algumas-de-suas-propriedades',
  family: 'tipologia',
  question: 'Quais funções?',
  items: [{ label: 'Álcool', claim: 'hidroxila em carbono saturado', section: 'Funções', quote: 'álcool' }],
};

describe('QuimicaTipologia', () => {
  it('desenha geometrias moleculares em vez de círculos genéricos', () => {
    const { container } = render(<QuimicaTipologia entry={geometry} />);
    expect(container.querySelectorAll('.tc-chem-bond').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('.tc-chem-pair').length).toBeGreaterThan(0);
  });

  it('mostra a fórmula estrutural e revela a explicação ao selecionar', () => {
    render(<QuimicaTipologia entry={organic} />);
    expect(screen.getByText('R–OH')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /álcool/i }));
    expect(screen.getByRole('status')).toHaveTextContent('hidroxila em carbono saturado');
  });
});
