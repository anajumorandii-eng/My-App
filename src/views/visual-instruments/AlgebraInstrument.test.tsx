import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import { algebraInstrument } from './AlgebraInstrument';

const props = (id: string) => ({
  map: buildVisualMap(interactiveSummaries.find((item) => item.id === id)!),
  states: {}, selectedId: null, onSelect: vi.fn(), hiddenEdgeIds: [], mode: 'explorar' as const,
});

describe('instrumento de álgebra', () => {
  it('mostra que o candidato 1 é raiz espúria e 6 é solução', () => {
    const Component = algebraInstrument('igualdades');
    render(<Component {...props('summary-matematica-igualdades')} />);
    expect(screen.getAllByText('não — espúria').length).toBeGreaterThan(0);
    fireEvent.change(screen.getByLabelText(/candidato depois de elevar ao quadrado/i), { target: { value: '6' } });
    expect(screen.getAllByText('sim').length).toBeGreaterThan(0);
  });

  it('expõe o controle nativo e atualiza a receita da modelagem quadrática', () => {
    const Component = algebraInstrument('modelagem-quadratica');
    render(<Component {...props('summary-matematica-modelagem-algebrica-de-problemas-ii')} />);
    const control = screen.getByLabelText(/reduções de r\$4 no preço/i);
    expect(control).toHaveAttribute('type', 'range');
    fireEvent.change(control, { target: { value: '3' } });
    expect(screen.getAllByText('R$11020').length).toBeGreaterThan(0);
  });
});
