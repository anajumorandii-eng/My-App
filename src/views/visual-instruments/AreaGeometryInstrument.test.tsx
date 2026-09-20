import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import { areaGeometryInstrument } from './AreaGeometryInstrument';

const props = (id: string) => ({
  map: buildVisualMap(interactiveSummaries.find((item) => item.id === id)!),
  states: {}, selectedId: null, onSelect: vi.fn(), hiddenEdgeIds: [], mode: 'explorar' as const,
});

describe('instrumento de áreas e medidas', () => {
  it('recalcula a área útil quando a abertura circular aumenta', () => {
    const Component = areaGeometryInstrument('areas-compostas');
    render(<Component {...props('summary-matematica-areas-de-figuras-planas')} />);
    fireEvent.change(screen.getByLabelText(/raio da região circular retirada/i), { target: { value: '5' } });
    expect(screen.getAllByText('221,46 m²').length).toBeGreaterThan(0);
  });

  it('expõe um range nativo para operar sem arraste', () => {
    const Component = areaGeometryInstrument('triangulo-retangulo');
    render(<Component {...props('summary-matematica-triangulo-retangulo')} />);
    expect(screen.getByLabelText(/primeira projeção na hipotenusa/i)).toHaveAttribute('type', 'range');
    expect(screen.getByRole('img', { name: /altura revela três triângulos/i })).toBeInTheDocument();
  });
});
