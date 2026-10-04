import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import LensMechanism from './LensMechanism';
import LensPowerMechanism from './LensPowerMechanism';
import WaveMechanism from './WaveMechanism';
import { wavesInstrument } from '../visual-instruments/WavesInstrument';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';

const motion = vi.hoisted(() => ({ reduced: false }));
vi.mock('motion/react', async original => ({ ...await original<typeof import('motion/react')>(), useReducedMotion: () => motion.reduced }));
afterEach(cleanup);

function completeRays(container: HTMLElement) {
  const rays = Array.from(container.querySelectorAll('[data-optical-ray]'));
  expect(rays).toHaveLength(2);
  rays.forEach(ray => expect(Number(ray.getAttribute('stroke-dashoffset') ?? 0)).toBe(0));
  expect(container.querySelector('[data-optical-image]')?.getAttribute('opacity') ?? '1').toBe('1');
}

describe.each([false, true])('óptica estática (movimento reduzido=%s)', reduced => {
  it('mostra encontro real, prolongamentos virtuais e foco sem depender do relógio', () => {
    motion.reduced = reduced;
    const view = render(<LensMechanism />);
    completeRays(view.container);
    for (const choice of ['Em 2F', 'Entre F e 2F', 'Em F', 'Entre F e a lente', 'Além de 2F']) {
      fireEvent.click(screen.getByRole('button', { name: choice }));
      completeRays(view.container);
      expect(view.container.querySelector('svg')?.outerHTML).not.toMatch(/NaN|Infinity/);
    }
    fireEvent.click(screen.getByRole('button', { name: 'Entre F e a lente' }));
    expect(screen.getByLabelText('Prolongamentos virtuais, sem propagação de luz')).toHaveAttribute('opacity', '1');
    fireEvent.click(screen.getByRole('button', { name: 'Divergente' }));
    completeRays(view.container);
  });
  it('muda o foco da associação mantendo os raios completos, inclusive afocal', () => {
    motion.reduced = reduced;
    const view = render(<LensPowerMechanism />);
    completeRays(view.container);
    expect(view.container.querySelector('[data-equivalent-focus]')).toHaveAttribute('cx', '320');
    fireEvent.change(screen.getByRole('slider', { name: /Segunda lente/ }), { target: { value: '-5' } });
    completeRays(view.container);
    expect(screen.getByRole('status')).toHaveTextContent('afocal');
    expect(view.container.querySelector('[data-equivalent-focus]')).toBeNull();
    fireEvent.change(screen.getByRole('slider', { name: /Índice do meio/ }), { target: { value: '1.6' } });
    completeRays(view.container);
    expect(screen.getByRole('status')).toHaveTextContent('divergente');
  });
});

it('declara os três eixos e usa a mesma fase para E e B na perspectiva', () => {
  const view = render(<WaveMechanism kind="electromagnetic" />);
  expect(screen.getByText('y · E')).toBeInTheDocument();
  expect(screen.getByText('z · B')).toBeInTheDocument();
  expect(screen.getByText('x · propagação')).toBeInTheDocument();
  expect(screen.getAllByText(/perspectiva/).length).toBeGreaterThan(0);
  const check = () => {
    const samples = Array.from(view.container.querySelectorAll('[data-em-sample]'));
    expect(samples.length).toBeGreaterThan(8);
    samples.forEach(sample => {
      const e = sample.querySelector('[data-field="E"]')!, b = sample.querySelector('[data-field="B"]')!;
      const ev = Number(e.getAttribute('data-normalized-value'));
      expect(Number(b.getAttribute('data-normalized-value'))).toBeCloseTo(ev);
      expect(Number(e.getAttribute('y2')) - 230).toBeCloseTo(-40 * ev);
      expect(Number(b.getAttribute('x2')) - Number(b.getAttribute('x1'))).toBeCloseTo(40 * ev * .48);
      expect(Number(b.getAttribute('y2')) - 230).toBeCloseTo(40 * ev * .55);
    });
  };
  check();
  fireEvent.change(screen.getByRole('slider', { name: 'Fração de um período' }), { target: { value: '.25' } });
  check();
});

it('liga potência, área esférica, intensidade e curva de decibéis à distância', () => {
  const Component = wavesInstrument('sound-intensity');
  const summary = interactiveSummaries.find(item => item.id === 'summary-fisica-intensidade-sonora')!;
  const view = render(<Component map={buildVisualMap(summary)} states={{}} selectedId={null} onSelect={vi.fn()} hiddenEdgeIds={[]} mode="explorar" />);
  for (const r of [2, 1, 8]) {
    fireEvent.change(screen.getByRole('slider'), { target: { value: String(r) } });
    expect(screen.getByText('P = 8 W')).toBeInTheDocument();
    expect(screen.getByText(`r = ${r} m`)).toBeInTheDocument();
    const surface = view.container.querySelector('[data-sound-surface]')!;
    expect(Number(surface.getAttribute('data-area'))).toBeCloseTo(4 * Math.PI * r * r);
    const marker = view.container.querySelector('[data-sound-level]')!;
    const intensity = 8 / (4 * Math.PI * r * r);
    expect(Number(marker.getAttribute('data-intensity'))).toBeCloseTo(intensity);
    expect(Number(marker.getAttribute('data-db'))).toBeCloseTo(10 * Math.log10(intensity / 1e-12));
    expect(screen.getByText('β (dB)')).toBeInTheDocument();
    expect(screen.getByText('r (m)')).toBeInTheDocument();
  }
  const points = Array.from(view.container.querySelectorAll('[data-sound-curve-point]'));
  expect(points).toHaveLength(8);
  expect(Number(points[1].getAttribute('data-db')) - Number(points[0].getAttribute('data-db'))).toBeCloseTo(-6.0205999);
});
