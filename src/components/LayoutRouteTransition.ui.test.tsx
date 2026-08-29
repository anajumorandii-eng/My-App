import React, { useEffect } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AnimatePresence, usePresence } from 'motion/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import Layout from './Layout';

function DraftPage() {
  return (
    <section>
      <h2>Hoje</h2>
      <input aria-label="Rascunho não salvo" defaultValue="Minha resposta" />
    </section>
  );
}

function StudySessionPage() {
  return <h2>Sessão de estudo</h2>;
}

function renderLayoutAt(pathname = '/') {
  return render(
    <MemoryRouter initialEntries={[pathname]}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DraftPage />} />
          <Route path="sessao" element={<StudySessionPage />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

function PresenceControlledRoute({ name }: { name: string }) {
  const [isPresent, safeToRemove] = usePresence();

  useEffect(() => {
    if (!isPresent) {
      const timer = window.setTimeout(() => safeToRemove?.(), 50);
      return () => window.clearTimeout(timer);
    }
  }, [isPresent, safeToRemove]);

  return <h2>{name}</h2>;
}

function PresenceLifecycle({ route }: { route: string }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <PresenceControlledRoute key={route} name={route} />
    </AnimatePresence>
  );
}

describe('Layout route transition', () => {
  beforeEach(() => {
    localStorage.setItem('juju_onboarding', 'true');
  });

  it('navigates away from a draft to /sessao without blocking the new route', async () => {
    renderLayoutAt();
    const draft = screen.getByLabelText('Rascunho não salvo');

    fireEvent.change(draft, { target: { value: 'Minha resposta alterada' } });
    fireEvent.click(screen.getAllByRole('link', { name: 'Sessão de Estudo' })[0]);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Sessão de estudo' })).toBeInTheDocument();
    });
    expect(screen.queryByLabelText('Rascunho não salvo')).not.toBeInTheDocument();
  });

  it('uses AnimatePresence wait lifecycle to keep the outgoing route until its exit completes', async () => {
    const { rerender } = render(<PresenceLifecycle route="Hoje" />);

    rerender(<PresenceLifecycle route="Sessão de estudo" />);

    expect(screen.getByRole('heading', { name: 'Hoje' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Sessão de estudo' })).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Sessão de estudo' })).toBeInTheDocument();
    });
  });
});
