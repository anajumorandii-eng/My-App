import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildGrant,
  GoogleAccessTokenProvider,
  GoogleNotConnectedError,
  isInvalidGrant,
  OAuthClient,
  safeReturnTo,
} from './googleOAuth';
import type { FirestoreGoogleOAuthStore, GoogleOAuthGrant } from './googleOAuthStore';

function storeDouble(initial: GoogleOAuthGrant | null) {
  let grant = initial;
  return {
    deleted: false,
    getGrant: async () => grant,
    deleteGrant: async function (this: { deleted: boolean }) {
      this.deleted = true;
      grant = null;
    },
  };
}

function clientDouble(behaviour: () => Promise<{ token?: string | null }>): OAuthClient {
  return {
    generateAuthUrl: () => 'https://accounts.google.com/o/oauth2/v2/auth',
    getToken: async () => ({ tokens: {} }),
    setCredentials: () => undefined,
    getAccessToken: behaviour,
    revokeToken: async () => undefined,
  };
}

const grant: GoogleOAuthGrant = {
  refreshToken: 'refresh-1',
  scope: 'calendar drive',
  connectedAt: '2026-09-01T00:00:00.000Z',
  updatedAt: '2026-09-01T00:00:00.000Z',
};

test('troca o refresh token por um access token', async () => {
  const store = storeDouble(grant);
  const provider = new GoogleAccessTokenProvider(store as unknown as FirestoreGoogleOAuthStore, () => clientDouble(async () => ({ token: 'access-1' })));
  assert.equal(await provider.getAccessToken('ana'), 'access-1');
});

test('reaproveita o token em cache dentro da margem', async () => {
  let calls = 0;
  const store = storeDouble(grant);
  const provider = new GoogleAccessTokenProvider(
    store as unknown as FirestoreGoogleOAuthStore,
    () => clientDouble(async () => { calls += 1; return { token: `access-${calls}` }; }),
    60_000,
  );

  assert.equal(await provider.getAccessToken('ana', 0), 'access-1');
  assert.equal(await provider.getAccessToken('ana', 30_000), 'access-1');
  assert.equal(calls, 1);

  // Passada a margem, renova.
  assert.equal(await provider.getAccessToken('ana', 90_000), 'access-2');
  assert.equal(calls, 2);
});

test('sem concessão guardada, pede reconexão em vez de falhar genérico', async () => {
  const store = storeDouble(null);
  const provider = new GoogleAccessTokenProvider(store as unknown as FirestoreGoogleOAuthStore, () => clientDouble(async () => ({ token: 'x' })));
  await assert.rejects(() => provider.getAccessToken('ana'), GoogleNotConnectedError);
});

test('apaga a concessão quando o Google responde invalid_grant', async () => {
  const store = storeDouble(grant);
  const provider = new GoogleAccessTokenProvider(store as unknown as FirestoreGoogleOAuthStore, () => clientDouble(async () => {
    throw Object.assign(new Error('invalid_grant'), { response: { data: { error: 'invalid_grant' } } });
  }));

  await assert.rejects(() => provider.getAccessToken('ana'), GoogleNotConnectedError);
  assert.equal(store.deleted, true);
});

test('propaga falhas que não são de autorização', async () => {
  const store = storeDouble(grant);
  const provider = new GoogleAccessTokenProvider(store as unknown as FirestoreGoogleOAuthStore, () => clientDouble(async () => {
    throw new Error('ECONNRESET');
  }));

  await assert.rejects(() => provider.getAccessToken('ana'), /ECONNRESET/);
  assert.equal(store.deleted, false);
});

test('reconhece invalid_grant nos dois formatos que o Google usa', () => {
  assert.equal(isInvalidGrant({ response: { data: { error: 'invalid_grant' } } }), true);
  assert.equal(isInvalidGrant(new Error('invalid_grant: token expired')), true);
  assert.equal(isInvalidGrant(new Error('quota exceeded')), false);
});

test('preserva o refresh token anterior quando o Google não manda um novo', () => {
  const rebuilt = buildGrant({ access_token: 'a', scope: 'calendar' }, grant, undefined, new Date('2026-09-05T10:00:00.000Z'));
  assert.equal(rebuilt?.refreshToken, 'refresh-1');
  assert.equal(rebuilt?.connectedAt, grant.connectedAt, 'a data original da conexão não se perde numa reautorização');
  assert.equal(rebuilt?.updatedAt, '2026-09-05T10:00:00.000Z');
});

test('recusa uma autorização sem refresh token e sem anterior', () => {
  assert.equal(buildGrant({ access_token: 'a' }, null, undefined), null);
});

test('só aceita caminhos internos como retorno', () => {
  assert.equal(safeReturnTo('/agenda'), '/agenda');
  assert.equal(safeReturnTo('https://exemplo.com'), '/conexoes');
  assert.equal(safeReturnTo('//exemplo.com'), '/conexoes');
  assert.equal(safeReturnTo(undefined), '/conexoes');
});
