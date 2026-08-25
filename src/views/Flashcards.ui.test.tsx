import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import Flashcards from './Flashcards';

// Firebase Auth always resolves asynchronously, even with a persisted
// session, so `currentOwnerUid` briefly reads as null on every fresh page
// load before flipping to the real uid a beat later. This mock reproduces
// that timeline instead of handing the component an already-resolved user.
let resolveAuth: (uid: string) => void;
const authResolved = new Promise<string>((resolve) => { resolveAuth = resolve; });

vi.mock('../context/AuthContext', async () => {
  const React = await import('react');
  return {
    useAuth: () => {
      const [user, setUser] = React.useState<{ uid: string } | null>(null);
      React.useEffect(() => {
        let cancelled = false;
        authResolved.then((uid) => {
          if (!cancelled) setUser({ uid });
        });
        return () => { cancelled = true; };
      }, []);
      return { user, isConnected: !!user };
    },
  };
});

vi.mock('../lib/flashcardReviews', () => ({
  getFlashcardReviews: vi.fn().mockResolvedValue([]),
  saveFlashcardReview: vi.fn().mockResolvedValue(undefined),
}));

const biologia = JSON.parse(
  readFileSync(path.resolve(__dirname, '../../public/flashcards/biologia.json'), 'utf8'),
);

beforeEach(() => {
  global.fetch = vi.fn().mockImplementation(() => (
    new Promise((resolve) => {
      // Resolves shortly after auth does — the exact window where a click
      // made right after the page renders races the owner-hydration effect.
      // Real subject files are several MB, so on a slow connection this gap
      // is the common case, not a rare edge case.
      setTimeout(() => resolve({ ok: true, json: async () => biologia }), 20);
    })
  )) as unknown as typeof fetch;
});

describe('abrir uma matéria enquanto o login ainda está resolvendo', () => {
  it('não descarta silenciosamente o clique feito antes do Firebase Auth confirmar o usuário', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Flashcards /></MemoryRouter>);

    // Clica assim que os cartões de matéria aparecem — antes do listener
    // assíncrono do Firebase Auth ter tido chance de disparar.
    const biologiaButton = await screen.findByRole('button', { name: /Biologia/ });
    await user.click(biologiaButton);

    // Login confirma o usuário real enquanto o fetch da matéria ainda está em voo.
    resolveAuth('real-user-uid');

    await waitFor(
      () => expect(screen.getByText(/escolha um tópico/)).toBeInTheDocument(),
      { timeout: 1000 },
    );
  });
});
