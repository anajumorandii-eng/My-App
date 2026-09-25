import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import PhMechanism, { concentrationRatio } from './PhMechanism';
vi.mock('motion/react', async original => ({ ...await original<typeof import('motion/react')>(), useReducedMotion: () => true }));
afterEach(cleanup);
it('compara concentrações por fatores e conserva a razão inversa', () => {
  expect(concentrationRatio(3,5)).toBe(100);
  expect(concentrationRatio(5,3)).toBe(.01);
  expect(concentrationRatio(7,7)).toBe(1);
  for(let a=1;a<=13;a++) expect(concentrationRatio(a,7)*concentrationRatio(7,a)).toBeCloseTo(1);
});
it('atualiza a comparação e mantém exploração sem movimento', () => {
  render(<PhMechanism />);
  fireEvent.change(screen.getByRole('slider',{name:'pH da solução A: 3'}),{target:{value:'7'}});
  expect(screen.getByRole('status')).toHaveTextContent('B tem maior concentração');
  fireEvent.click(screen.getByRole('button',{name:'Reproduzir movimento'}));
  expect(screen.getByRole('slider',{name:'Comparação na escala de pH'})).toHaveValue('1');
});
