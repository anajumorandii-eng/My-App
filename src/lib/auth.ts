import { initializeApp } from 'firebase/app';
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Firebase's default persistence reads/writes IndexedDB, which has a
// long-standing WebKit/Safari bug that throws "Database is closing/hidden"
// (common in Safari on iOS/iPadOS, especially in Private Browsing).
// localStorage persistence avoids IndexedDB entirely while also being more
// durable than sessionStorage (which didn't reliably survive a reload in
// testing on iPadOS Safari, likely due to iOS's aggressive tab
// suspension/eviction) — it's what lets Firestore-backed views keep
// working across a reload without forcing a fresh Google sign-in.
const persistenceReady = setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Failed to set auth persistence:', error);
});

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/calendar.readonly');
provider.addScope('https://www.googleapis.com/auth/drive.readonly');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

// Single source of truth for "who's connected", updated only at the exact
// points where a sign-in/sign-out is actually confirmed (not derived from a
// second, independent onAuthStateChanged subscription, which can miss the
// event if it fires before cachedAccessToken is assigned). Anything in the
// app that needs to know the signed-in user — beyond the Conexoes page
// itself — should subscribe here instead of listening to Firebase directly.
type ConnectedUserListener = (user: User | null) => void;
const connectedUserListeners = new Set<ConnectedUserListener>();
let connectedUser: User | null = null;

const setConnectedUser = (user: User | null) => {
  connectedUser = user;
  connectedUserListeners.forEach((listener) => listener(user));
};

export const subscribeToConnectedUser = (listener: ConnectedUserListener) => {
  connectedUserListeners.add(listener);
  listener(connectedUser);
  return () => {
    connectedUserListeners.delete(listener);
  };
};

// Keeps connectedUser in sync with Firebase's real auth state on every page,
// not just when Conexoes.tsx happens to be mounted (initAuth() is only ever
// called from there). Without this, reloading straight into e.g. /revisoes
// never re-establishes "who's signed in" even though Firebase itself
// already restored the session from localStorage — connectedUser would
// just stay at its initial null for that entire page load.
persistenceReady.then(() => {
  onAuthStateChanged(auth, (user) => {
    setConnectedUser(user);
  });
});

// Error codes where the popup itself couldn't be used (blocked, unsupported
// in an iframe, etc). For these we retry the sign-in via full-page redirect
// instead of just failing.
const POPUP_FALLBACK_ERROR_CODES = new Set([
  'auth/popup-blocked',
  'auth/cancelled-popup-request',
  'auth/operation-not-supported-in-this-environment',
]);

const describeAuthError = (error: any): string => {
  const code = error?.code as string | undefined;
  switch (code) {
    case 'auth/unauthorized-domain':
      return 'Este domínio não está autorizado no Firebase (Authentication > Settings > Authorized domains). Peça para um administrador adicioná-lo.';
    case 'auth/popup-closed-by-user':
      return 'A janela de login do Google foi fechada antes de concluir. Tente novamente.';
    case 'auth/access-denied':
    case 'auth/user-cancelled':
      return 'O Google negou o acesso. Se a tela de consentimento OAuth ainda está em modo de teste, sua conta precisa ser adicionada como "test user" no Google Cloud Console.';
    case 'auth/network-request-failed':
      return 'Falha de rede ao tentar conectar com o Google. Verifique sua conexão e tente novamente.';
    default:
      return error?.message || 'Não foi possível conectar sua conta Google. Tente novamente.';
  }
};

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: (error?: string) => void
) => {
  let unsubscribed = false;
  let realUnsubscribe: (() => void) | null = null;

  persistenceReady.then(() => {
    if (unsubscribed) return;

    // Picks up the token when we've just come back from a signInWithRedirect
    // fallback (the popup path never navigates away, so this is a no-op then).
    getRedirectResult(auth)
      .then((result) => {
        if (!result) return;
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential?.accessToken) {
          cachedAccessToken = credential.accessToken;
          setConnectedUser(result.user);
          if (onAuthSuccess) onAuthSuccess(result.user, cachedAccessToken);
        }
      })
      .catch((error) => {
        console.error('Redirect sign-in error:', error);
        if (onAuthFailure) onAuthFailure(describeAuthError(error));
      });

    realUnsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        if (cachedAccessToken) {
          setConnectedUser(user);
          if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
        } else if (!isSigningIn) {
          cachedAccessToken = null;
          // Firebase itself still recognizes this user (their session
          // survived the reload) even though the Google Calendar/Drive
          // access token didn't — that token is never persisted by design.
          // Keep Firestore-backed data (which only needs the uid) working;
          // only the Calendar/Drive-specific UI needs to prompt a
          // reconnect.
          setConnectedUser(user);
          if (onAuthFailure) {
            onAuthFailure('Sua sessão de acesso ao Google expirou. Clique em "Conectar com Google" novamente.');
          }
        }
      } else {
        cachedAccessToken = null;
        setConnectedUser(null);
        if (onAuthFailure) onAuthFailure();
      }
    });
  });

  return () => {
    unsubscribed = true;
    if (realUnsubscribe) realUnsubscribe();
  };
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    await persistenceReady;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Firebase Auth');
    }

    cachedAccessToken = credential.accessToken;
    setConnectedUser(result.user);
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    const code = error?.code as string | undefined;
    if (code && POPUP_FALLBACK_ERROR_CODES.has(code)) {
      console.warn(`Popup sign-in failed (${code}), falling back to redirect sign-in.`);
      await signInWithRedirect(auth, provider);
      // The page navigates away here; the result is picked up by
      // getRedirectResult() in initAuth() after the user comes back.
      return null;
    }
    console.error('Sign in error:', error);
    throw new Error(describeAuthError(error));
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
  setConnectedUser(null);
};

// Temporary on-screen diagnostics (no browser devtools available on the
// device this was reported from) — safe to remove once the persistence
// issue is confirmed fixed.
export const getAuthDebugInfo = () => {
  let localStorageWritable = false;
  try {
    localStorage.setItem('__juju_probe__', '1');
    localStorageWritable = localStorage.getItem('__juju_probe__') === '1';
    localStorage.removeItem('__juju_probe__');
  } catch {
    localStorageWritable = false;
  }

  const localStorageAuthKeys = Object.keys(localStorage).filter((k) => k.startsWith('firebase:'));
  const sessionStorageAuthKeys = Object.keys(sessionStorage).filter((k) => k.startsWith('firebase:'));

  return {
    localStorageWritable,
    localStorageAuthKeys,
    sessionStorageAuthKeys,
    currentUserUid: auth.currentUser?.uid ?? null,
    connectedUserUid: connectedUser?.uid ?? null,
    connectedUserListenerCount: connectedUserListeners.size,
    cachedAccessTokenPresent: !!cachedAccessToken,
    isSigningIn,
  };
};
