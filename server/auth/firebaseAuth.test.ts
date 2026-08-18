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
  requireAdmin({} as any, Object.assign(denied, { locals: { userEmail: 'student@example.com' } }) as any, () => assert.fail());
  assert.equal(denied.statusCode, 403);
  process.env.ADMIN_EMAILS = previous;
});

test('identifica o usuário autenticado', async () => {
  const middleware = createRequireFirebaseAuth({ verifyIdToken: async () => ({ uid: 'ana', email: 'ana@example.com' }) });
  const res = response();
  let advanced = false;
  await middleware({ headers: { authorization: 'Bearer valid' } } as any, res as any, () => { advanced = true; });
  assert.equal(res.locals.userId, 'ana');
  assert.equal(res.locals.userEmail, 'ana@example.com');
  assert.equal(advanced, true);
});
