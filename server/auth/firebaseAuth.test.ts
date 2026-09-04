import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequireFirebaseAuth, requireAdmin } from './firebaseAuth';

function response() {
  return {
    locals: {} as Record<string, unknown>, statusCode: 200, body: undefined as unknown,
    status(code: number) { this.statusCode = code; return this; },
    json(body: unknown) { this.body = body; return this; },
  };
}

test('exige um token Firebase', async () => {
  const middleware = createRequireFirebaseAuth({ verifyIdToken: async () => ({ uid: 'u1' }) });
  const res = response();
  await middleware({ headers: {} } as any, res as any, () => assert.fail('não deve avançar'));
  assert.equal(res.statusCode, 401);
});

test('restringe administração aos e-mails configurados', () => {
  const previous = process.env.ADMIN_EMAILS;
  process.env.ADMIN_EMAILS = 'admin@example.com';
  const denied = response();
  requireAdmin({} as any, Object.assign(denied, { locals: { userEmail: 'student@example.com', userEmailVerified: true } }) as any, () => assert.fail());
  assert.equal(denied.statusCode, 403);
  process.env.ADMIN_EMAILS = previous;
});

test('recusa administração quando o e-mail não foi verificado', () => {
  const previous = process.env.ADMIN_EMAILS;
  process.env.ADMIN_EMAILS = 'admin@example.com';
  const denied = response();
  requireAdmin({} as any, Object.assign(denied, { locals: { userEmail: 'admin@example.com', userEmailVerified: false } }) as any, () => assert.fail('não deve avançar'));
  assert.equal(denied.statusCode, 403);
  process.env.ADMIN_EMAILS = previous;
});

test('libera administração para um e-mail configurado e verificado', () => {
  const previous = process.env.ADMIN_EMAILS;
  process.env.ADMIN_EMAILS = 'admin@example.com';
  const allowed = response();
  let advanced = false;
  requireAdmin({} as any, Object.assign(allowed, { locals: { userEmail: 'admin@example.com', userEmailVerified: true } }) as any, () => { advanced = true; });
  assert.equal(advanced, true);
  process.env.ADMIN_EMAILS = previous;
});

test('pede checagem de revogação só quando configurado', async () => {
  const calls: (boolean | undefined)[] = [];
  const verifier = {
    verifyIdToken: async (_token: string, checkRevoked?: boolean) => {
      calls.push(checkRevoked);
      return { uid: 'ana', email: 'ana@example.com', email_verified: true };
    },
  };
  const padrao = createRequireFirebaseAuth(verifier);
  await padrao({ headers: { authorization: 'Bearer valid' } } as any, response() as any, () => {});
  const admin = createRequireFirebaseAuth(verifier, { checkRevoked: true });
  await admin({ headers: { authorization: 'Bearer valid' } } as any, response() as any, () => {});
  assert.deepEqual(calls, [false, true]);
});

test('identifica o usuário autenticado', async () => {
  const middleware = createRequireFirebaseAuth({ verifyIdToken: async () => ({ uid: 'ana', email: 'ana@example.com', email_verified: true }) });
  const res = response();
  let advanced = false;
  await middleware({ headers: { authorization: 'Bearer valid' } } as any, res as any, () => { advanced = true; });
  assert.equal(res.locals.userId, 'ana');
  assert.equal(res.locals.userEmail, 'ana@example.com');
  assert.equal(res.locals.userEmailVerified, true);
  assert.equal(advanced, true);
});
