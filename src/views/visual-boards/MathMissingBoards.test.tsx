import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import ProbabilityPairsBoard from './ProbabilityPairsBoard';
import RightTriangleBoard from './RightTriangleBoard';

function props(id: string) {
  const summary = interactiveSummaries.find((item) => item.id === id)!;
  return { map: buildVisualMap(summary), states: {}, selectedId: null, onSelect: vi.fn(), hiddenEdgeIds: [], mode: 'explorar' as const };
}

describe('pranchas de Matemática sem ilustração emprestada', () => {
  it('conta pares ordenados uma vez cada e explicita a hipótese de equiprobabilidade', () => {
    render(<ProbabilityPairsBoard {...props('mat-probabilidade-contagem')} />);
    const slider = screen.getByRole('slider', { name: /limite superior/i });
    fireEvent.change(slider, { target: { value: '6' } });
    expect(screen.getByRole('img', { name: /pares ordenados/i })).toBeInTheDocument();
    expect(screen.getByText('8 de 16 pares favoráveis')).toBeInTheDocument();
    expect(screen.getAllByText(/8\/16 = 1\/2/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/mesma chance/i).length).toBeGreaterThan(0);
    // Irredutível: mostra o valor, não a fração igualada a si mesma.
    fireEvent.change(slider, { target: { value: '9' } });
    expect(screen.getAllByText(/19\/49 ≈ 0,39/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/19\/49 = 19\/49/)).toBeNull();
  });

  it('relaciona catetos e hipotenusa sem depender de círculo de raio 1', () => {
    render(<RightTriangleBoard {...props('summary-matematica-trigonometria-no-triangulo-retangulo')} />);
    expect(screen.getByRole('img', { name: /triângulo retângulo.*hipotenusa 5/i })).toBeInTheDocument();
    const slider = screen.getByRole('slider', { name: /ângulo/i });
    fireEvent.change(slider, { target: { value: '30' } });
    expect(screen.getByText(/sen 30° = 2,50\/5,00 = 0,50/)).toBeInTheDocument();
    expect(screen.getByText(/cos 30° = 4,33\/5,00 = 0,87/)).toBeInTheDocument();
  });
});
