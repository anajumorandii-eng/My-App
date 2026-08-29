import React, { useEffect } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const motionState = vi.hoisted(() => ({
  reduced: false,
  mounts: [] as Array<{ initial: unknown; exit: unknown; transition: unknown }>,
}));

vi.mock('motion/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('motion/react')>();

  function RouteTransition({
    children,
    initial,
    exit,
    transition,
  }: React.PropsWithChildren<{ initial?: unknown; exit?: unknown; transition?: unknown }>) {
    useEffect(() => {
      motionState.mounts.push({ initial, exit, transition });
    }, []);

    return <div data-testid="route-transition">{children}</div>;
  }

  return {
    ...actual,
    AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
    motion: new Proxy(actual.motion, {
      get(target, property, receiver) {
        return property === 'div' ? RouteTransition : Reflect.get(target, property, receiver);
      },
    }),
    useReducedMotion: () => motionState.reduced,
  };
});

import Layout from './Layout';

function renderLayoutAt(pathname = '/') {
  return render(
    <MemoryRouter initialEntries={[pathname]}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<h2>Hoje</h2>} />
          <Route path="plano" element={<h2>Plano de estudo</h2>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe('Layout route transition', () => {
  beforeEach(() => {
    localStorage.setItem('juju_onboarding', 'true');
    motionState.reduced = false;
    motionState.mounts = [];
  });

  it('remounts the page container with an opacity fade when navigation changes pathname', () => {
    renderLayoutAt();

    fireEvent.click(screen.getAllByRole('link', { name: 'Plano' })[0]);

    expect(screen.getByRole('heading', { name: 'Plano de estudo' })).toBeInTheDocument();
    expect(motionState.mounts).toEqual([
      {
        initial: { opacity: 0 },
        exit: { opacity: 0 },
        transition: { duration: 0.16, ease: [0.4, 0, 0.2, 1] },
      },
      {
        initial: { opacity: 0 },
        exit: { opacity: 0 },
        transition: { duration: 0.16, ease: [0.4, 0, 0.2, 1] },
      },
    ]);
  });

  it('renders the new route immediately when reduced motion is preferred', () => {
    motionState.reduced = true;

    renderLayoutAt();

    fireEvent.click(screen.getAllByRole('link', { name: 'Plano' })[0]);

    expect(screen.getByRole('heading', { name: 'Plano de estudo' })).toBeInTheDocument();
    expect(motionState.mounts).toEqual([
      {
        initial: false,
        exit: undefined,
        transition: { duration: 0.16, ease: [0.4, 0, 0.2, 1] },
      },
      {
        initial: false,
        exit: undefined,
        transition: { duration: 0.16, ease: [0.4, 0, 0.2, 1] },
      },
    ]);
  });
});
