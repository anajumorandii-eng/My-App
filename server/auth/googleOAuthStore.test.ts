import assert from 'node:assert/strict';
import test from 'node:test';
import type { Firestore } from 'firebase-admin/firestore';
import { FirestoreGoogleOAuthStore } from './googleOAuthStore';

/** Firestore em memória, só com o que este store usa. */
function firestoreDouble() {
  const data = new Map<string, Record<string, unknown>>();
  const db = {
    collection: (name: string) => ({
      doc: (id: string) => {
        const key = `${name}/${id}`;
        return {
          // Snapshot de verdade: uma cópia do valor no instante da leitura, como
          // o Firestore faz — não uma janela viva pro mapa.
          get: async () => {
            const value = data.get(key);
            const snapshot = value ? { ...value } : undefined;
            return { exists: snapshot !== undefined, data: () => snapshot };
          },
          set: async (value: Record<string, unknown>) => { data.set(key, value); },
          delete: async () => { data.delete(key); },
        };
      },
    }),
  };
  return { db: db as unknown as Firestore, data };
}

test('guarda e lê a concessão de uma aluna', async () => {
  const { db, data } = firestoreDouble();
  const store = new FirestoreGoogleOAuthStore(db);

  await store.saveGrant('ana', {
    refreshToken: 'refresh-1',
    scope: 'calendar',
    connectedAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
  });

  assert.equal((await store.getGrant('ana'))?.refreshToken, 'refresh-1');
  assert.equal(await store.getGrant('outra'), null);
  assert.ok(
    data.has('googleOAuthGrants/ana'),
    'a concessão fica fora de users/{uid}, onde as regras dariam leitura ao próprio navegador',
  );
});

test('apaga a concessão ao desconectar', async () => {
  const { db } = firestoreDouble();
  const store = new FirestoreGoogleOAuthStore(db);
  await store.saveGrant('ana', { refreshToken: 'r', scope: '', connectedAt: '', updatedAt: '' });
  await store.deleteGrant('ana');
  assert.equal(await store.getGrant('ana'), null);
});

test('o state é de uso único', async () => {
  const { db } = firestoreDouble();
  const store = new FirestoreGoogleOAuthStore(db);

  const nonce = await store.createState('ana', '/agenda', 0);
  const first = await store.consumeState(nonce, 1_000);
  assert.deepEqual(first, { uid: 'ana', returnTo: '/agenda', expiresAt: 600_000 });
  assert.equal(await store.consumeState(nonce, 1_000), null, 'o mesmo state não vale duas vezes');
});

test('o state expira', async () => {
  const { db } = firestoreDouble();
  const store = new FirestoreGoogleOAuthStore(db);
  const nonce = await store.createState('ana', '/conexoes', 0);
  assert.equal(await store.consumeState(nonce, 11 * 60_000), null);
});

test('um state desconhecido não autoriza ninguém', async () => {
  const { db } = firestoreDouble();
  const store = new FirestoreGoogleOAuthStore(db);
  assert.equal(await store.consumeState('inventado'), null);
});

test('cada state é imprevisível', async () => {
  const { db } = firestoreDouble();
  const store = new FirestoreGoogleOAuthStore(db);
  const nonces = new Set(await Promise.all([1, 2, 3, 4, 5].map(() => store.createState('ana', '/conexoes'))));
  assert.equal(nonces.size, 5);
  for (const nonce of nonces) assert.ok(nonce.length >= 32);
});
