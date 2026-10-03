import assert from 'node:assert/strict';
import test from 'node:test';
import { GeminiProvider } from './geminiProvider';
import { OmniRouteProvider } from './omniRouteProvider';
import { createAiProvider } from './provider';

test('seleciona o OmniRoute explicitamente', () => {
  const provider = createAiProvider({
    AI_PROVIDER: 'omniroute',
    OMNIROUTE_API_KEY: 'secret-test-key',
    OMNIROUTE_BASE_URL: 'https://omniroute.test/v1',
    AI_DEEP_MODEL: 'juju-deep-v1',
  });

  assert.ok(provider instanceof OmniRouteProvider);
  assert.equal(provider.isConfigured, true);
});

test('preserva Gemini como fallback compatível', () => {
  const provider = createAiProvider({ GEMINI_API_KEY: 'gemini-test-key' });
  assert.ok(provider instanceof GeminiProvider);
});

test('aceita a configuração do proxy Tailscale', () => {
  const provider = createAiProvider({
    AI_PROVIDER: 'omniroute',
    OMNIROUTE_API_KEY: 'secret-test-key',
    OMNIROUTE_BASE_URL: 'https://omniroute.test/v1',
    OMNIROUTE_PROXY_URL: 'http://localhost:1055',
  });

  assert.ok(provider instanceof OmniRouteProvider);
  assert.equal(provider.isConfigured, true);
});

test('respeita a rota compartilhada configurada em produção para podcasts', () => {
  const provider = createAiProvider({ AI_PROVIDER: 'omniroute', OMNIROUTE_API_KEY: 'secret-test-key', OMNIROUTE_BASE_URL: 'https://omniroute.test/v1', OMNIROUTE_MODEL: 'shared-text-route' });
  assert.equal(provider.modelForTask?.('podcast-script'), 'shared-text-route');
  assert.equal(provider.modelForTask?.('content-explanation'), 'shared-text-route');
});

test('rotas específicas prevalecem sobre a configuração compartilhada', () => {
  const provider = createAiProvider({ AI_PROVIDER: 'omniroute', OMNIROUTE_API_KEY: 'secret-test-key', OMNIROUTE_BASE_URL: 'https://omniroute.test/v1', OMNIROUTE_MODEL: 'shared-text-route', AI_DEEP_MODEL: 'reasoning-route', AI_FAST_MODEL: 'short-text-route' });
  assert.equal(provider.modelForTask?.('podcast-script'), 'short-text-route');
  assert.equal(provider.modelForTask?.('content-explanation'), 'reasoning-route');
});
