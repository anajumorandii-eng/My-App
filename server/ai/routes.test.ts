import assert from 'node:assert/strict';
import test from 'node:test';
import express from 'express';
import type { AddressInfo } from 'node:net';
import { createAiRouter } from './routes';
import { AiService } from './service';
import { AiProvider } from './types';

function provider(overrides: Partial<AiProvider> = {}): AiProvider {
  return {
    name: 'fake',
    model: 'fake-model',
    isConfigured: true,
    generate: async () => 'resposta',
    ...overrides,
  };
}

async function withServer(service: AiService, run: (baseUrl: string) => Promise<void>) {
  const app = express();
  app.use(express.json());
  app.use('/api/ai', createAiRouter(service));
  const server = app.listen(0);
  try {
    await new Promise((resolve) => server.once('listening', resolve));
    const { port } = server.address() as AddressInfo;
    await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

test('repassa ao cliente a mensagem específica de uma falha do provedor, não o texto genérico', async () => {
  const service = new AiService(provider({
    generate: async () => {
      // Mesmo tipo de erro que OmniRouteProvider lança para um HTTP não-ok
      // (ex.: 401 de chave inválida, 429 de rate limit) — a mensagem
      // específica é o que permite diagnosticar a causa sem acesso aos
      // logs de produção.
      const { AiGenerationError } = await import('./errors');
      throw new AiGenerationError('OmniRoute respondeu com HTTP 401.');
    },
  }));

  await withServer(service, async (baseUrl) => {
    const res = await fetch(`${baseUrl}/api/ai/review-tip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: 'x', subject: 'y', level: 50, daysSinceReview: 3 }),
    });
    const body = await res.json() as { error: string; code: string };
    assert.equal(res.status, 502);
    assert.equal(body.code, 'AI_GENERATION_FAILED');
    assert.equal(body.error, 'OmniRoute respondeu com HTTP 401.');
  });
});

test('mantém a mensagem específica de um provedor não configurado', async () => {
  const service = new AiService(provider({ isConfigured: false }));

  await withServer(service, async (baseUrl) => {
    const res = await fetch(`${baseUrl}/api/ai/review-tip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: 'x', subject: 'y', level: 50, daysSinceReview: 3 }),
    });
    const body = await res.json() as { error: string; code: string };
    assert.equal(res.status, 503);
    assert.equal(body.code, 'AI_UNAVAILABLE');
    assert.equal(body.error, 'Serviço de IA não configurado.');
  });
});
