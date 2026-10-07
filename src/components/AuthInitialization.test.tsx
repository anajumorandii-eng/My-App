import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import type { User } from 'firebase/auth';

const sdk = vi.hoisted(() => ({
  listeners: [] as ((user: User | null) => void)[],
  errors: [] as ((error: Error) => void)[],
}));
vi.mock('firebase/app', () => ({ initializeApp: () => ({}) }));
vi.mock('firebase/auth', () => ({
  getAuth: () => ({ currentUser: null }),
  setPersistence: () => Promise.resolve(),
  browserLocalPersistence: {},
  GoogleAuthProvider: class {},
  onAuthStateChanged: (_auth: unknown, listener: (user: User | null) => void, onError?: (error: Error) => void) => {
    sdk.listeners.push(listener);
    if (onError) sdk.errors.push(onError);
    return () => {};
  },
  signInWithPopup: vi.fn(), signInWithRedirect: vi.fn(), getRedirectResult: vi.fn(), signOut: vi.fn(),
}));
import { AuthProvider, useAuth } from '../context/AuthContext';
import { subscribeToConnectedUser } from '../lib/auth';

it('does not publish a guest before Firebase restores the session; confirmed logout still publishes null', async () => {
  const observed = vi.fn();
  const unsubscribe = subscribeToConnectedUser(observed);
  // The original subscription immediately emitted its unconfirmed initial null.
  expect(observed).not.toHaveBeenCalled();
  function Probe() {
    const auth = useAuth();
    return <p>{('loading' in auth && auth.loading) ? 'restoring' : auth.user?.uid ?? 'guest'}</p>;
  }
  const view = render(<AuthProvider><Probe /></AuthProvider>);
  expect(screen.getByText('restoring')).toBeInTheDocument();
  await waitFor(() => expect(sdk.listeners).toHaveLength(1));
  const restored = { uid: 'restored-account' } as User;
  await act(async () => sdk.listeners[0](restored));
  expect(screen.getByText('restored-account')).toBeInTheDocument();
  expect(observed.mock.calls.map(call => call[0])).toEqual([restored]);
  const late = vi.fn();
  const unsubscribeLate = subscribeToConnectedUser(late);
  expect(late).toHaveBeenCalledExactlyOnceWith(restored);
  await act(async () => sdk.listeners[0](null));
  expect(screen.getByText('guest')).toBeInTheDocument();
  expect(observed.mock.calls.map(call => call[0])).toEqual([restored, null]);
  view.unmount();
  render(<AuthProvider><Probe /></AuthProvider>);
  expect(screen.getByText('guest')).toBeInTheDocument();
  unsubscribe(); unsubscribeLate();
});

it('finishes initialization if Firebase reports an authentication restore error', async () => {
  vi.resetModules();
  sdk.listeners.length = 0;
  sdk.errors.length = 0;
  const report = vi.spyOn(console, 'error').mockImplementation(() => {});
  const auth = await import('../lib/auth');
  const observed = vi.fn();
  const unsubscribe = auth.subscribeToConnectedUser(observed);
  try {
    expect(observed).not.toHaveBeenCalled();
    await waitFor(() => expect(sdk.errors).toHaveLength(1));
    sdk.errors[0](new Error('restore failed'));
    expect(observed).toHaveBeenCalledExactlyOnceWith(null);
  } finally { unsubscribe(); report.mockRestore(); }
});
