import assert from 'node:assert/strict';
import test from 'node:test';
import type { Request, Response } from 'express';
import { MemoryDailyQuotaStore, createAiDailyLimit } from './rateLimit';

test('AI and podcast middleware share one memory quota per user', async () => {
  const store = new MemoryDailyQuotaStore();
  const ai = createAiDailyLimit({ maxRequests: 2, store });
  const podcast = createAiDailyLimit({ maxRequests: 2, store });
  async function consume(limit: typeof ai, userId: string) {
    let status = 200;
    let allowed = false;
    const res = { locals: { userId }, setHeader() {}, status(code: number) { status = code; return this; }, json() {} } as unknown as Response;
    await limit({} as Request, res, () => { allowed = true; });
    return { status, allowed };
  }
  assert.deepEqual(await consume(ai, 'aluna'), { status: 200, allowed: true });
  assert.deepEqual(await consume(podcast, 'aluna'), { status: 200, allowed: true });
  assert.deepEqual(await consume(ai, 'aluna'), { status: 429, allowed: false });
  assert.deepEqual(await consume(podcast, 'outra'), { status: 200, allowed: true });
});

test('memory quota resets on the next study date', async () => {
  const store = new MemoryDailyQuotaStore();
  assert.deepEqual(await store.consume('aluna', '2026-10-07', 1), { allowed: true, remaining: 0 });
  assert.deepEqual(await store.consume('aluna', '2026-10-07', 1), { allowed: false, remaining: 0 });
  assert.deepEqual(await store.consume('aluna', '2026-10-08', 1), { allowed: true, remaining: 0 });
});
