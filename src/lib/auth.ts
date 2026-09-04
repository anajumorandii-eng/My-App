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

export const getFirebaseIdToken = async (): Promise<string | null> => {
  await persistenceReady;
  return auth.currentUser?.getIdToken() ?? null;
};

/**
 * Cabeçalho de toda rota autenticada. O acesso à agenda e ao Drive não passa
 * mais por aqui: o servidor resolve o token do Google a partir do refresh
 * token guardado (ver src/lib/googleConnection.ts), então o navegador nunca
 * mais precisa segurar essa credencial.
 */
export const authHeaders = async (): Promise<Record<string, string>> => {
  const idToken = await getFirebaseIdToken();
  if (!idToken) throw new Error('Entre na sua conta para continuar.');
  return { Authorization: `Bearer ${idToken}` };
};

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

// Sem escopos de Calendar/Drive: este login é só identidade. A autorização
// de leitura da agenda e do Drive é pedida à parte, pelo fluxo de código de
// autorização do servidor (POST /api/oauth/google/start), que é o único jeito
// de obter acesso offline — e portanto de a conexão sobreviver a uma recarga.
const provider = new GoogleAuthProvider();

// Single source of truth for "who's connected", updated only at the exact
// points where a sign-in/sign-out is actually confirmed (not derived from a
// second, independent onAuthStateChanged subscription, which can miss the
// event if it fires before the sign-in is confirmed). Anything in the
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
  onAuthSuccess?: (user: User) => void,
  onAuthFailure?: (error?: string) => void
) => {
  let unsubscribed = false;
  let realUnsubscribe: (() => void) | null = null;

  persistenceReady.then(() => {
    if (unsubscribed) return;

    // Conclui o login quando voltamos de um signInWithRedirect (o caminho de
    // popup nunca sai da página, então aqui vira no-op).
    getRedirectResult(auth)
      .then((result) => {
        if (!result) return;
        setConnectedUser(result.user);
        if (onAuthSuccess) onAuthSuccess(result.user);
      })
      .catch((error) => {
        console.error('Redirect sign-in error:', error);
        if (onAuthFailure) onAuthFailure(describeAuthError(error));
      });

    realUnsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      setConnectedUser(user);
      if (user) {
        // A sessão do Firebase sobrevive à recarga, e a autorização do Google
        // agora também (ela vive no servidor). Não há mais o aviso de "sessão
        // de acesso ao Google expirou" que aparecia em todo F5.
        if (onAuthSuccess) onAuthSuccess(user);
      } else if (onAuthFailure) {
        onAuthFailure();
      }
    });
  });

  return () => {
    unsubscribed = true;
    if (realUnsubscribe) realUnsubscribe();
  };
};

export const googleSignIn = async (): Promise<User | null> => {
  try {
    await persistenceReady;
    const result = await signInWithPopup(auth, provider);
    setConnectedUser(result.user);
    return result.user;
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
  }
};

export const logout = async () => {
  await signOut(auth);
  setConnectedUser(null);
};
