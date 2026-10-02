import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import { AREA_CONFIGS, type AreaConfigId } from '../../lib/areaGeometry';
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

const coordinates = (element: Element) => element.getAttribute('points')!.split(' ').map(point => point.split(',').map(Number));
const length = (a: number[], b: number[]) => Math.hypot(a[0] - b[0], a[1] - b[1]);

function scene(id: AreaConfigId) {
  const Component = areaGeometryInstrument(id);
  const view = render(<Component {...props('summary-matematica-triangulo-retangulo')} />);
  return { ...view, svg: view.container.querySelector('svg.vs-area-plane')!, control: view.container.querySelector('input[type="range"]')! };
}

describe('fidelidade geométrica das medidas', () => {
  it.each([4, 9, 21])('mantém hipotenusa 25 e ângulo reto no ápice para m=%s', m => {
    const { svg, control } = scene('triangulo-retangulo');
    fireEvent.change(control, { target: { value: String(m) } });
    const [a, b, c] = coordinates(svg.querySelector('polygon')!);
    const scale = length(a, b) / 25;
    expect(a[1] - c[1]).toBeCloseTo(Math.sqrt(m * (25 - m)) * scale, 8);
    expect(c[0] - a[0]).toBeCloseTo(m * scale, 8);
    expect((a[0] - c[0]) * (b[0] - c[0]) + (a[1] - c[1]) * (b[1] - c[1])).toBeCloseTo(0, 7);
  });

  it('preserva o lado de 4 cm enquanto o número de lados muda', () => {
    const { svg, control } = scene('areas-poligonos');
    let initialSide = 0;
    for (const n of [3, 6, 10]) {
      fireEvent.change(control, { target: { value: String(n) } });
      const points = coordinates(svg.querySelector('polygon')!);
      const side = length(points[0], points[1]);
      if (!initialSide) initialSide = side;
      expect(side).toBeCloseTo(initialSide, 8);
      expect(length(points[0], [160, 150]) / side).toBeCloseTo(1 / (2 * Math.sin(Math.PI / n)), 8);
      expect(points).toHaveLength(n);
    }
  });

  it.each([2, 6, 9])('usa a mesma escala nos raios da coroa para r=%s', r => {
    const { svg, control } = scene('area-circulo');
    fireEvent.change(control, { target: { value: String(r) } });
    const circles = svg.querySelectorAll('circle');
    expect(Number(circles[1].getAttribute('r')) / Number(circles[0].getAttribute('r'))).toBeCloseTo(r / 10, 10);
  });

  it.each([0.5, 4 / 3, 3])('desenha razão linear k=%s sem saturação', k => {
    const { svg, control } = scene('razoes-areas');
    fireEvent.change(control, { target: { value: String(k) } });
    const polygons = svg.querySelectorAll('polygon');
    const first = coordinates(polygons[0]); const second = coordinates(polygons[1]);
    expect(length(second[0], second[1]) / length(first[0], first[1])).toBeCloseTo(k, 10);
    expect(length(second[0], second[2]) / length(first[0], first[2])).toBeCloseTo(k, 10);
    expect(svg.textContent).not.toContain('333333333');
  });

  it.each([1, 3, 7])('mantém terreno 20×15 e abertura na mesma escala para r=%s', r => {
    const { svg, control } = scene('areas-compostas');
    fireEvent.change(control, { target: { value: String(r) } });
    const rect = svg.querySelector('rect.vs-area-fill')!;
    const width = Number(rect.getAttribute('width')); const height = Number(rect.getAttribute('height'));
    expect(width / height).toBeCloseTo(20 / 15, 10);
    expect(Number(svg.querySelector('circle')!.getAttribute('r')) / width).toBeCloseTo(r / 20, 10);
  });

  it('formata o fator inicial nos controles sem cauda binária', () => {
    const { container } = scene('razoes-areas');
    expect(container.querySelector('.vs-plane-control b')!.textContent).toBe('1,33');
    expect(AREA_CONFIGS['razoes-areas'].control.initial).toBe(4 / 3);
  });
});

describe('posição da legenda da altura', () => {
  it.each([4, 9, 21])('mantém h² = m·n acima do triângulo para m=%s', m => {
    const { svg, control } = scene('triangulo-retangulo');
    fireEvent.change(control, { target: { value: String(m) } });
    const label = Array.from(svg.querySelectorAll('text')).find(text => text.textContent === 'h² = m·n')!;
    const apex = coordinates(svg.querySelector('polygon')!)[2];
    expect(label).toHaveAttribute('text-anchor', 'middle');
    expect(Number(label.getAttribute('x'))).toBe(160);
    expect(Number(label.getAttribute('y'))).toBeLessThan(apex[1] - 12);
  });
});
