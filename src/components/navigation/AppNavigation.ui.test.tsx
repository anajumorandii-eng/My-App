import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AppNavigation } from './AppNavigation';

describe('AJ application navigation', () => {
  it('presents the AJ brand and five decision-oriented primary destinations', () => {
    render(
      <MemoryRouter>
        <AppNavigation />
      </MemoryRouter>,
    );

    expect(screen.getByText('AJ Intelligence')).toBeInTheDocument();
    expect(screen.getByText('Aprenda a aprender.')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Símbolo AJ' })).toBeInTheDocument();

    const mobileNavigation = screen.getByRole('navigation', { name: 'Navegação principal móvel' });
    const mobileLinks = Array.from(mobileNavigation.querySelectorAll('a'));
    expect(mobileLinks).toHaveLength(5);
    expect(mobileLinks.map((link) => link.textContent)).toEqual([
      'Hoje',
      'Plano',
      'Estudar',
      'Análises',
      'Agenda',
    ]);
  });

  it('keeps legacy product routes reachable through secondary navigation', () => {
    render(
      <MemoryRouter>
        <AppNavigation />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Resumos' })).toHaveAttribute('href', '/resumos');
    expect(screen.getByRole('link', { name: 'Caderno de Erros' })).toHaveAttribute('href', '/erros');
    expect(screen.getByRole('link', { name: 'Segunda fase' })).toHaveAttribute('href', '/treino-2a-fase');
  });
});
