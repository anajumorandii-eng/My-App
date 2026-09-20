import assert from 'node:assert/strict';
import test, { TestContext } from 'node:test';
import type { RequestHandler } from 'express';
import { GOOGLE_SCOPES, GoogleAccessTokenProvider, GoogleTokenResponse, OAuthClient } from './googleOAuth';
import { createGoogleOAuthRouter } from './googleOAuthRoutes';
import type { FirestoreGoogleOAuthStore, GoogleOAuthGrant, GoogleOAuthState } from './googleOAuthStore';
import { withApp, sendJson } from '../testing/httpTestServer';

const GRANT: GoogleOAuthGrant = {
  refreshToken: 'refresh-token-secreto',
  scope: GOOGLE_SCOPES.join(' '),
  connectedAt: '2026-09-01T10:00:00.000Z',
  updatedAt: '2026-09-01T10:00:00.000Z',
};

interface Harness {
  events: string[];
  grants: Map<string, GoogleOAuthGrant>;
  states: Map<string, GoogleOAuthState>;
  authUrlOptions: Record<string, unknown>[];
  store: FirestoreGoogleOAuthStore;
  tokens: GoogleAccessTokenProvider;
  createClient: () => OAuthClient;
}

function harness(options: { issued?: GoogleTokenResponse; getTokenFails?: boolean; revokeFails?: boolean; createStateFails?: boolean } = {}): Harness {
  const events: string[] = [];
  const grants = new Map<string, GoogleOAuthGrant>();
  const states = new Map<string, GoogleOAuthState>();
  const authUrlOptions: Record<string, unknown>[] = [];

  const store = {
    createState: async (uid: string, returnTo: string) => {
      if (options.createStateFails) throw new Error('Firestore fora do ar');
      const nonce = `nonce-${states.size + 1}`;
      states.set(nonce, { uid, returnTo, expiresAt: Date.now() + 60_000 } as GoogleOAuthState);
      return nonce;
    },
    consumeState: async (nonce: string) => {
      const state = states.get(nonce) ?? null;
      states.delete(nonce);
      events.push(`consumeState:${nonce}`);
      return state;
    },
    getGrant: async (uid: string) => grants.get(uid) ?? null,
    saveGrant: async (uid: string, grant: GoogleOAuthGrant) => { grants.set(uid, grant); events.push(`saveGrant:${uid}`); },
    deleteGrant: async (uid: string) => { grants.delete(uid); events.push(`deleteGrant:${uid}`); },
  } as unknown as FirestoreGoogleOAuthStore;

  const tokens = { forget: (uid: string) => { events.push(`forget:${uid}`); } } as unknown as GoogleAccessTokenProvider;

  const createClient = (): OAuthClient => ({
    generateAuthUrl: (opts) => { authUrlOptions.push(opts); return `https://accounts.google.com/o/oauth2/v2/auth?state=${String(opts.state)}`; },
    getToken: async () => {
      if (options.getTokenFails) throw new Error('invalid_grant');
      return { tokens: options.issued ?? { access_token: 'a', refresh_token: 'refresh-novo', scope: GOOGLE_SCOPES.join(' ') } };
    },
    setCredentials: () => undefined,
    getAccessToken: async () => ({ token: 'access' }),
    revokeToken: async () => {
      events.push('revoke');
      if (options.revokeFails) throw new Error('Google fora do ar');
    },
  });

  return { events, grants, states, authUrlOptions, store, tokens, createClient };
}

const comoAluna: RequestHandler = (_req, res, next) => {
  res.locals.userId = 'aluna1';
  next();
};

async function withOAuth(h: Harness, isConfigured: boolean, run: (baseUrl: string) => Promise<void>) {
  await withApp((app) => {
    app.use('/api/oauth/google', createGoogleOAuthRouter({
      store: h.store, tokens: h.tokens, createClient: h.createClient, isConfigured, requireAuth: comoAluna,
    }));
  }, run);
}

function callback(baseUrl: string, query: string) {
  return fetch(`${baseUrl}/api/oauth/google/callback${query}`, { redirect: 'manual' });
}

function silenciarErros(t: TestContext) {
  t.mock.method(console, 'error', () => undefined);
}

test('sem GOOGLE_CLIENT_ID/SECRET todas as rotas respondem 503, inclusive o callback', async () => {
  await withOAuth(harness(), false, async (baseUrl) => {
    for (const [method, path] of [['POST', '/start'], ['GET', '/status'], ['DELETE', '/'], ['GET', '/callback?code=x&state=y']]) {
      const res = await fetch(`${baseUrl}/api/oauth/google${path}`, { method, redirect: 'manual' });
      assert.equal(res.status, 503, `${method} ${path}`);
    }
  });
});

test('/start pede acesso offline com consentimento e o state criado para a aluna logada', async () => {
  const h = harness();
  await withOAuth(h, true, async (baseUrl) => {
    const res = await sendJson(baseUrl, 'POST', '/api/oauth/google/start', { returnTo: '/plano' });
    assert.equal(res.status, 200);
    const { url } = await res.json() as { url: string };
    assert.match(url, /state=nonce-1$/);

    assert.equal(h.states.get('nonce-1')?.uid, 'aluna1');
    assert.equal(h.states.get('nonce-1')?.returnTo, '/plano');
    assert.equal(h.authUrlOptions[0].access_type, 'offline');
    assert.equal(h.authUrlOptions[0].prompt, 'consent');
    assert.deepEqual(h.authUrlOptions[0].scope, GOOGLE_SCOPES);
    assert.equal(h.authUrlOptions[0].state, 'nonce-1');
  });
});

test('/start nunca aceita um returnTo que leve para fora do app', async () => {
  const h = harness();
  await withOAuth(h, true, async (baseUrl) => {
    for (const returnTo of ['https://evil.example/roubo', '//evil.example', 'javascript:alert(1)', 42, undefined]) {
      await sendJson(baseUrl, 'POST', '/api/oauth/google/start', { returnTo });
    }
    const guardados = [...h.states.values()].map((state) => state.returnTo);
    assert.deepEqual(guardados, ['/conexoes', '/conexoes', '/conexoes', '/conexoes', '/conexoes']);
  });
});

test('/start com o Firestore fora do ar responde 500 sem vazar a causa', async (t) => {
  silenciarErros(t);
  await withOAuth(harness({ createStateFails: true }), true, async (baseUrl) => {
    const res = await sendJson(baseUrl, 'POST', '/api/oauth/google/start', {});
    assert.equal(res.status, 500);
    const corpo = await res.text();
    assert.match(corpo, /GOOGLE_OAUTH_START_FAILED/);
    assert.doesNotMatch(corpo, /Firestore fora do ar/);
  });
});

test('callback com erro do Google volta para Conexões com o erro codificado', async () => {
  await withOAuth(harness(), true, async (baseUrl) => {
    const res = await callback(baseUrl, `?error=${encodeURIComponent('access_denied&x=1')}`);
    assert.equal(res.status, 302);
    assert.equal(res.headers.get('location'), `/conexoes?google=${encodeURIComponent('access_denied&x=1')}`);
  });
});

test('callback sem code ou sem state não consome nada', async () => {
  const h = harness();
  await withOAuth(h, true, async (baseUrl) => {
    for (const query of ['', '?code=abc', '?state=nonce-1']) {
      const res = await callback(baseUrl, query);
      assert.equal(res.headers.get('location'), '/conexoes?google=erro', query);
    }
    assert.deepEqual(h.events, []);
  });
});

test('callback com state desconhecido ou já usado volta como expirado e não grava nada', async () => {
  const h = harness();
  await withOAuth(h, true, async (baseUrl) => {
    const res = await callback(baseUrl, '?code=abc&state=inventado');
    assert.equal(res.headers.get('location'), '/conexoes?google=expirado');
    assert.deepEqual(h.events, ['consumeState:inventado']);
    assert.equal(h.grants.size, 0);
  });
});

test('callback grava a concessão para o dono do state, não para quem chamou, e o state vale uma vez', async () => {
  const h = harness();
  h.states.set('nonce-da-maria', { uid: 'maria', returnTo: '/plano', expiresAt: Date.now() + 60_000 } as GoogleOAuthState);

  await withOAuth(h, true, async (baseUrl) => {
    const res = await callback(baseUrl, '?code=abc&state=nonce-da-maria');
    assert.equal(res.headers.get('location'), '/plano?google=conectado');
    assert.equal(h.grants.get('maria')?.refreshToken, 'refresh-novo');
    assert.equal(h.grants.has('aluna1'), false);
    assert.deepEqual(h.events, ['consumeState:nonce-da-maria', 'saveGrant:maria', 'forget:maria']);

    const repetido = await callback(baseUrl, '?code=abc&state=nonce-da-maria');
    assert.equal(repetido.headers.get('location'), '/conexoes?google=expirado');
  });
});

test('callback sem refresh token e sem concessão anterior não registra a conexão', async () => {
  const h = harness({ issued: { access_token: 'a', refresh_token: null } });
  h.states.set('n1', { uid: 'maria', returnTo: '/conexoes', expiresAt: Date.now() + 60_000 } as GoogleOAuthState);
  await withOAuth(h, true, async (baseUrl) => {
    const res = await callback(baseUrl, '?code=abc&state=n1');
    assert.equal(res.headers.get('location'), '/conexoes?google=sem_refresh');
    assert.equal(h.grants.size, 0);
  });
});

test('callback sem refresh token mantém o anterior em vez de sobrescrever com nada', async () => {
  const h = harness({ issued: { access_token: 'a', refresh_token: null } });
  h.grants.set('maria', GRANT);
  h.states.set('n1', { uid: 'maria', returnTo: '/conexoes', expiresAt: Date.now() + 60_000 } as GoogleOAuthState);
  await withOAuth(h, true, async (baseUrl) => {
    const res = await callback(baseUrl, '?code=abc&state=n1');
    assert.equal(res.headers.get('location'), '/conexoes?google=conectado');
    assert.equal(h.grants.get('maria')?.refreshToken, GRANT.refreshToken);
  });
});

test('callback com a troca do código falhando volta com erro e não grava', async (t) => {
  silenciarErros(t);
  const h = harness({ getTokenFails: true });
  h.states.set('n1', { uid: 'maria', returnTo: '/conexoes', expiresAt: Date.now() + 60_000 } as GoogleOAuthState);
  await withOAuth(h, true, async (baseUrl) => {
    const res = await callback(baseUrl, '?code=abc&state=n1');
    assert.equal(res.headers.get('location'), '/conexoes?google=erro');
    assert.equal(h.grants.size, 0);
  });
});

test('/status informa se está conectada e nunca devolve o refresh token', async () => {
  const h = harness();
  await withOAuth(h, true, async (baseUrl) => {
    const antes = await (await sendJson(baseUrl, 'GET', '/api/oauth/google/status')).json();
    assert.deepEqual(antes, { connected: false });

    h.grants.set('aluna1', GRANT);
    const res = await sendJson(baseUrl, 'GET', '/api/oauth/google/status');
    const corpo = await res.text();
    assert.deepEqual(JSON.parse(corpo), { connected: true, connectedAt: GRANT.connectedAt, googleEmail: null });
    assert.doesNotMatch(corpo, /refresh/i);
  });
});

test('desconectar revoga no Google, apaga a concessão e limpa o cache', async () => {
  const h = harness();
  h.grants.set('aluna1', GRANT);
  await withOAuth(h, true, async (baseUrl) => {
    const res = await sendJson(baseUrl, 'DELETE', '/api/oauth/google/');
    assert.equal(res.status, 204);
    assert.deepEqual(h.events, ['revoke', 'deleteGrant:aluna1', 'forget:aluna1']);
    assert.equal(h.grants.size, 0);
  });
});

test('desconectar funciona mesmo quando a revogação no Google falha', async (t) => {
  silenciarErros(t);
  const h = harness({ revokeFails: true });
  h.grants.set('aluna1', GRANT);
  await withOAuth(h, true, async (baseUrl) => {
    const res = await sendJson(baseUrl, 'DELETE', '/api/oauth/google/');
    assert.equal(res.status, 204);
    assert.equal(h.grants.size, 0);
  });
});

test('desconectar sem concessão não chama o Google', async () => {
  const h = harness();
  await withOAuth(h, true, async (baseUrl) => {
    const res = await sendJson(baseUrl, 'DELETE', '/api/oauth/google/');
    assert.equal(res.status, 204);
    assert.deepEqual(h.events, ['deleteGrant:aluna1', 'forget:aluna1']);
  });
});
