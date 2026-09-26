import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import LensMechanism, { lensRays } from './LensMechanism';

vi.mock('motion/react', async original => ({ ...await original<typeof import('motion/react')>(), useReducedMotion: () => true }));
afterEach(cleanup);

describe('construção óptica', () => {
  it.each([175, 140, 105, 42])('conserva Gauss e a interseção para p=%s', p => {
    const r = lensRays(p);
    expect(1 / p + 1 / r.image.distancia).toBeCloseTo(1 / r.focal);
    expect(r.axis - r.height + r.image.distancia * r.height / r.focal).toBeCloseTo(r.imageY);
    expect(r.axis + r.image.distancia * r.height / p).toBeCloseTo(r.imageY);
    expect(r.parallel).toContain('L490 ');
    expect(r.central).toContain('L490 ');
  });
  it('distingue os prolongamentos virtuais da luz e permite construção estática', () => {
    render(<LensMechanism />);
    expect(screen.queryByLabelText('Prolongamentos virtuais, sem propagação de luz')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Entre F e a lente' }));
    expect(screen.getByRole('status')).toHaveTextContent('virtual e direita');
    expect(screen.getByLabelText('Prolongamentos virtuais, sem propagação de luz')).toHaveAttribute('stroke-dasharray', '5 5');
    fireEvent.click(screen.getByRole('button', { name: 'Reproduzir movimento' }));
    expect(screen.getByRole('slider', { name: 'Construção do traçado' })).toHaveValue('1');
    fireEvent.click(screen.getByRole('button', { name: 'Em 2F' }));
    expect(screen.getByRole('slider')).toHaveValue('0');
    expect(screen.getByRole('status')).toHaveTextContent('1×');
  });
});

it('representa divergência e foco sem coordenadas infinitas no SVG',()=>{
  const {container}=render(<LensMechanism />);
  fireEvent.click(screen.getByRole('button',{name:'Em F'}));
  expect(screen.getByRole('status')).toHaveTextContent('Sem imagem a distância finita');
  expect(container.querySelector('svg')?.outerHTML).not.toMatch(/Infinity|NaN/);
  fireEvent.click(screen.getByRole('button',{name:'Divergente'}));
  expect(screen.getByRole('status')).toHaveTextContent('virtual e direita');
  const r=lensRays(70,-70);
  expect(r.image.distancia).toBe(-35);
  expect(r.image.ampliacao).toBe(.5);
});
