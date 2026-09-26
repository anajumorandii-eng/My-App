import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import AcidTheoryMechanism from './AcidTheoryMechanism';
import LensPowerMechanism, { lensPower } from './LensPowerMechanism';
import OsmosisMechanism from './OsmosisMechanism';
import MembraneMechanism from './MembraneMechanism';
vi.mock('motion/react', async original => ({...await original<typeof import('motion/react')>(),useReducedMotion:()=>true}));
afterEach(cleanup);
it('distingue doação de par eletrônico de transferência de próton e mantém espectadores',()=>{
  render(<AcidTheoryMechanism />);
  fireEvent.click(screen.getByRole('button',{name:'Lewis'}));
  expect(screen.getByRole('status')).toHaveTextContent('Não há transferência de próton');
  fireEvent.click(screen.getByRole('button',{name:'Equação iônica'}));
  expect(screen.getByRole('status')).toHaveTextContent('não os retira da solução');
  fireEvent.click(screen.getByRole('button',{name:'Reproduzir movimento'}));
  expect(screen.getByRole('slider')).toHaveValue('1');
});
it('anula a vergência com índices iguais e troca o sinal com meio mais refringente',()=>{
  expect(lensPower(1,.2)).toBe(5);
  expect(lensPower(1.5,.2)).toBe(0);
  expect(lensPower(1.6,.2)).toBeLessThan(0);
  expect(lensPower(1,.4)).toBe(2.5);
});
it('soma vergências em vez de distâncias focais e representa sistema afocal',()=>{
  render(<LensPowerMechanism />);
  fireEvent.change(screen.getByRole('slider',{name:/Segunda lente/}),{target:{value:'-5'}});
  expect(screen.getByRole('status')).toHaveTextContent('Sistema afocal');
  fireEvent.click(screen.getByRole('button',{name:'Reproduzir movimento'}));
  expect(screen.getByRole('slider',{name:'Traçado da lente equivalente'})).toHaveValue('1');
});
it('preserva estequiometria e saldo eletrogênico da bomba sem exigir movimento',()=>{
  render(<MembraneMechanism />);
  fireEvent.click(screen.getByRole('button',{name:'Bomba Na⁺/K⁺'}));
  expect(screen.getByRole('status')).toHaveTextContent('saldo de uma carga positiva para fora');
  fireEvent.click(screen.getByRole('button',{name:'Reproduzir movimento'}));
  expect(screen.getByRole('slider')).toHaveValue('1');
  fireEvent.click(screen.getByRole('button',{name:'Difusão facilitada'}));
  expect(screen.getByRole('slider')).toHaveValue('0');
  expect(screen.getByRole('status')).toHaveTextContent('sem consumo direto de ATP');
});

it('distingue plasmólise de equilíbrio isotônico e restaura o início ao mudar o meio',()=>{
  render(<OsmosisMechanism />);
  fireEvent.click(screen.getByRole('button',{name:'Hipertônico'}));
  expect(screen.getByRole('status')).toHaveTextContent('plasmólise');
  fireEvent.click(screen.getByRole('button',{name:'Reproduzir movimento'}));
  expect(screen.getByRole('slider')).toHaveValue('1');
  fireEvent.click(screen.getByRole('button',{name:'Isotônico'}));
  expect(screen.getByRole('slider')).toHaveValue('0');
  expect(screen.getByRole('status')).toHaveTextContent('trocas continuam');
});
