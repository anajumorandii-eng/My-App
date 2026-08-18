import assert from 'node:assert/strict';
import test from 'node:test';
import { OmniRouteProvider } from './omniRouteProvider';

test('envia uma requisição OpenAI-compatible ao OmniRoute', async () => {
  let requestedUrl = '';
  let requestedInit: RequestInit | undefined;
  const mockFetch: typeof fetch = async (input, init) => {
    requestedUrl = String(input);
    requestedInit = init;
    return new Response(JSON.stringify({
      choices: [{ message: { content: ' resposta do combo ' } }],
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  };
  const provider = new OmniRouteProvider(
    'secret-test-key',
    'https://omniroute.test/v1/',
    'juju-deep-v1',
    mockFetch,
  );

  const text = await provider.generate({ task: 'review-tip', prompt: 'Explique.' });

  assert.equal(text, ' resposta do combo ');
  assert.equal(requestedUrl, 'https://omniroute.test/v1/chat/completions');
  assert.equal(requestedInit?.method, 'POST');
  assert.equal((requestedInit?.headers as Record<string, string>).Authorization, 'Bearer secret-test-key');
  assert.deepEqual(JSON.parse(String(requestedInit?.body)), {
    model: 'juju-deep-v1',
    messages: [{ role: 'user', content: 'Explique.' }],
  });
});

test('não fica configurado sem API key', () => {
  const provider = new OmniRouteProvider(undefined);
  assert.equal(provider.isConfigured, false);
});

test('propaga erro seguro quando o OmniRoute rejeita a chamada', async () => {
  const mockFetch: typeof fetch = async () => new Response('detalhe interno', { status: 401 });
  const provider = new OmniRouteProvider('secret-test-key', undefined, undefined, mockFetch);

  await assert.rejects(
    provider.generate({ task: 'review-tip', prompt: 'Explique.' }),
    /status 401/,
  );
});
