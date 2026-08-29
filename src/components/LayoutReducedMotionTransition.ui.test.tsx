import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { useReducedMotion } from 'motion/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import Layout from './Layout';

const originalMatchMedia = window.matchMedia;

function DraftPage() {
  return <input aria-label="Rascunho reduzido" defaultValue="Rascunho" />;
}

function StudySessionPage() {
  return <h2>Sessão de estudo reduzida</h2>;
}

function ReducedMotionProbe() {
  return <output>{useReducedMotion() ? 'reduce' : 'no-preference'}</output>;
}

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn(() => ({
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })),
  });
});

afterAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: originalMatchMedia,
  });
});

describe('Layout reduced-motion route transition', () => {
  beforeEach(() => {
    localStorage.setItem('juju_onboarding', 'true');
  });

  it('renders /sessao immediately when the operating system prefers reduced motion', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <ReducedMotionProbe />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<DraftPage />} />
            <Route path="sessao" element={<StudySessionPage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('reduce')).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('link', { name: 'Sessão de Estudo' })[0]);

    expect(screen.getByRole('heading', { name: 'Sessão de estudo reduzida' })).toBeInTheDocument();
    expect(screen.queryByLabelText('Rascunho reduzido')).not.toBeInTheDocument();
  });
});
