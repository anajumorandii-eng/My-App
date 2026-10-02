import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
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

const pointList = (element: Element) => element.getAttribute('points')!.split(' ').map((p) => p.split(',').map(Number));
const angleAt = (a: number[], b: number[], c: number[]) => {
  const u = a.map((v, i) => v - b[i]); const v = c.map((v, i) => v - b[i]);
  return Math.acos((u[0] * v[0] + u[1] * v[1]) / (Math.hypot(...u) * Math.hypot(...v))) * 180 / Math.PI;
};
const mount = (id: Parameters<typeof planarGeometryInstrument>[0]) => {
  const Component = planarGeometryInstrument(id);
  return render(<Component map={buildVisualMap(interactiveSummaries.find((s) => s.id === 'summary-matematica-semelhanca-de-triangulos')!)} states={{}} selectedId={null} onSelect={vi.fn()} hiddenEdgeIds={[]} mode="explorar" />);
};
afterEach(cleanup);
describe('geometria real das cenas planas', () => {
  it.each([25, 65, 155])('transversal representa α=%s e alternos iguais', (value) => {
    const { container } = mount('fundamentos');
    fireEvent.change(screen.getByRole('slider'), { target: { value } });
    const l = container.querySelector('[data-geometry="transversal"]')!;
    const dx = Number(l.getAttribute('x2')) - Number(l.getAttribute('x1'));
    const dy = Number(l.getAttribute('y1')) - Number(l.getAttribute('y2'));
    expect(Math.atan2(dy, dx) * 180 / Math.PI).toBeCloseTo(value, 7);
    const marks = container.querySelectorAll('[data-angle]');
    expect(Array.from(marks).map((m) => Number(m.getAttribute('data-angle')))).toEqual([value, value]);
  });
  it.each([25, 50, 115])('triângulo tem A=%s, B=40 e C suplementar', (value) => {
    const { container } = mount('angulos-triangulo');
    fireEvent.change(screen.getByRole('slider'), { target: { value } });
    const [a,b,c] = pointList(container.querySelector('polygon')!);
    expect(angleAt(b,a,c)).toBeCloseTo(value, 7);
    expect(angleAt(a,b,c)).toBeCloseTo(40, 7);
    expect(angleAt(a,c,b)).toBeCloseTo(140-value, 7);
  });
  it.each([40, 100, 180, 240])('inscrito intercepta arco de %s fora do vértice', (value) => {
    const { container } = mount('angulos-circunferencia');
    fireEvent.change(screen.getByRole('slider'), { target: { value } });
    const [a,v,b] = pointList(container.querySelector('[data-geometry="inscribed-rays"]')!);
    expect(angleAt(a,v,b)).toBeCloseTo(value / 2, 7);
    const vertexAngle = (Math.atan2(v[0]-160, 150-v[1])*180/Math.PI+360)%360;
    expect(vertexAngle).toBeGreaterThan(value);
    expect(container.querySelector('[data-geometry="selected-arc"]')!.getAttribute('d')).toContain(` ${value > 180 ? 1 : 0} 1 `);
  });
  it.each([0.5, 1.5, 2.5])('semelhança multiplica todos os lados por %s sem recorte', (value) => {
    const { container } = mount('semelhanca');
    fireEvent.change(screen.getByRole('slider'), { target: { value } });
    const polygons = container.querySelectorAll('polygon');
    const a = pointList(polygons[0]); const b = pointList(polygons[1]);
    a.forEach((p,i) => {
      const j = (i+1)%3;
      expect(Math.hypot(b[i][0]-b[j][0],b[i][1]-b[j][1])/Math.hypot(p[0]-a[j][0],p[1]-a[j][1])).toBeCloseTo(value,7);
    });
    [...a,...b].forEach(([x,y]) => { expect(x).toBeGreaterThan(3); expect(x).toBeLessThan(317); expect(y).toBeGreaterThan(3); expect(y).toBeLessThan(297); });
    const area = (p: number[][]) => Math.abs(p.reduce((s,v,i)=>s+v[0]*p[(i+1)%3][1]-v[1]*p[(i+1)%3][0],0))/2;
    expect(area(b)/area(a)).toBeCloseTo(value*value,7);
  });
});
