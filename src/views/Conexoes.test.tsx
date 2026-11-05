import React from 'react';
import { beforeEach, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import Conexoes from './Conexoes';
const mocks = vi.hoisted(() => ({
  login: vi.fn(), status: vi.fn(), start: vi.fn(),
}));
vi.mock('../lib/auth', () => ({
  initAuth: (_success: unknown, failure: () => void) => { failure(); return () => {}; },
  googleSignIn: mocks.login, authHeaders: async () => ({}),
}));
vi.mock('../lib/googleConnection', () => ({
  getGoogleConnectionStatus: mocks.status, startGoogleConnection: mocks.start,
  disconnectGoogle: vi.fn(), describeGoogleCallback: () => null,
}));
vi.mock('../components/ui/Panel', () => ({ Panel: ({ children }: React.PropsWithChildren) => <div>{children}</div> }));
beforeEach(() => {
  cleanup(); vi.clearAllMocks();
  mocks.login.mockResolvedValue({ uid: 'ana' });
  mocks.start.mockResolvedValue(undefined);
  mocks.status.mockResolvedValue({ connected: true });
  vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ events: [], files: [] }))));
});
test('login com autorização existente carrega os dados sem abrir outro consentimento', async () => {
  render(<Conexoes />);
  fireEvent.click(screen.getByRole('button', { name: 'Conectar com Google' }));
  await screen.findByRole('button', { name: 'Desconectar' });
  expect(mocks.start).not.toHaveBeenCalled();
});
test('login sem autorização inicia a conexão uma única vez', async () => {
  mocks.status.mockResolvedValue({ connected: false });
  render(<Conexoes />);
  fireEvent.click(screen.getByRole('button', { name: 'Conectar com Google' }));
  await waitFor(() => expect(mocks.start).toHaveBeenCalledExactlyOnceWith('/conexoes'));
});
test('cliques repetidos durante o login não abrem duas janelas', async () => {
  let finish!: (user: { uid: string }) => void;
  mocks.login.mockReturnValue(new Promise(resolve => { finish = resolve; }));
  render(<Conexoes />);
  const button = screen.getByRole('button', { name: 'Conectar com Google' });
  fireEvent.click(button); fireEvent.click(button);
  expect(mocks.login).toHaveBeenCalledTimes(1);
  finish({ uid: 'ana' });
  await screen.findByRole('button', { name: 'Desconectar' });
});
