import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import { planarGeometryInstrument } from './PlanarGeometryInstrument';

describe('instrumento de geometria plana', () => {
  it('recalcula a soma dos ângulos de um polígono pelo número de lados', () => {
    const summary = interactiveSummaries.find((item) => item.id === 'summary-matematica-angulos-em-poligonos')!;
    const Component = planarGeometryInstrument('angulos-poligono');
    render(<Component map={buildVisualMap(summary)} states={{}} selectedId={null} onSelect={vi.fn()} hiddenEdgeIds={[]} mode="explorar" />);
    fireEvent.change(screen.getByLabelText(/número de lados/i), { target: { value: '8' } });
    expect(screen.getAllByText('1080°').length).toBeGreaterThan(0);
    expect(screen.getByRole('img', { name: /um polígono vira triângulos/i })).toBeInTheDocument();
  });

  it('mantém o controle acessível por teclado como range nativo', () => {
    const summary = interactiveSummaries.find((item) => item.id === 'summary-matematica-semelhanca-de-triangulos')!;
    const Component = planarGeometryInstrument('semelhanca');
    render(<Component map={buildVisualMap(summary)} states={{}} selectedId={null} onSelect={vi.fn()} hiddenEdgeIds={[]} mode="explorar" />);
    expect(screen.getByLabelText(/razão de semelhança/i)).toHaveAttribute('type', 'range');
  });
});
