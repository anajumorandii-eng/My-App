import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import Ajuda from './Ajuda';
afterEach(cleanup);

it('abre o manual na Leitura Crivo a partir da tela de Ajuda', () => {
  render(<Ajuda />);
  expect(screen.getByRole('heading', { level: 1, name: 'Manual do CRIVO' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Ler na Leitura Crivo' })).toBeEnabled();
});

// O sumário e as remissões ("veja a seção 9") usam âncoras no formato do
// GitHub; se o cálculo do id divergir, o link continua visível e não leva a lugar nenhum.
it('toda âncora interna do manual aponta para uma seção que existe', () => {
  const { container } = render(<Ajuda />);
  const links = [...container.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];
  expect(links.length).toBeGreaterThan(10);
  for (const link of links) expect(container.querySelector(`[id="${decodeURIComponent(link.getAttribute('href')!.slice(1))}"]`), link.getAttribute('href')!).not.toBeNull();
});

it('mostra o título uma vez só, no cabeçalho da tela', () => {
  render(<Ajuda />);
  expect(screen.getAllByRole('heading', { name: 'Manual do CRIVO' })).toHaveLength(1);
});
