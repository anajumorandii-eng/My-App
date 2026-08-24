import assert from 'node:assert/strict';
import test from 'node:test';
import { AiGenerationError } from './errors';
import { OmniRouteProvider, selectOmniRouteModel } from './omniRouteProvider';

test('seleciona o combo deep para tarefas de raciocínio e fast para tarefas leves', () => {
  assert.equal(selectOmniRouteModel('discursive-feedback'), 'juju-deep-v1');
  assert.equal(selectOmniRouteModel('review-tip'), 'juju-fast-v1');
});

test('envia uma requisição Chat Completions autenticada ao combo correto', async () => {
  let requestUrl = '';
  let requestInit: RequestInit | undefined;
  const provider = new OmniRouteProvider({
    baseUrl: 'https://omniroute.example/v1/',
    apiKey: 'test-secret',
    fetch: async (url, init) => {
      requestUrl = String(url);
      requestInit = init;
      return new Response(JSON.stringify({
        choices: [{ message: { content: ' resposta do combo ' } }],
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    },
  });

  const result = await provider.generate({ task: 'socratic', prompt: 'Ajude o aluno.' });
  const payload = JSON.parse(String(requestInit?.body));

  assert.equal(typeof result === 'string' ? result : result.text, ' resposta do combo ');
  assert.equal(requestUrl, 'https://omniroute.example/v1/chat/completions');
  assert.equal(new Headers(requestInit?.headers).get('Authorization'), 'Bearer test-secret');
  assert.deepEqual(payload, {
    model: 'juju-deep-v1',
    messages: [{ role: 'user', content: 'Ajude o aluno.' }],
    stream: false,
  });
});

test('usa o combo fast como fallback quando o deep falha', async () => {
  const models: string[] = [];
  const provider = new OmniRouteProvider({
    baseUrl: 'https://omniroute.example/v1',
    apiKey: 'test-secret',
    fetch: async (_url, init) => {
      const model = JSON.parse(String(init?.body)).model;
      models.push(model);
      return model === 'juju-deep-v1'
        ? new Response('{}', { status: 503 })
        : new Response(JSON.stringify({ choices: [{ message: { content: 'fallback' } }] }), { status: 200 });
    },
  });

  const result = await provider.generate({ task: 'socratic', prompt: 'prompt' });
  assert.deepEqual(models, ['juju-deep-v1', 'juju-fast-v1']);
  assert.equal(typeof result === 'string' ? false : result.fallback, true);
});

test('rejeita erros HTTP e respostas sem conteúdo', async () => {
  const failing = new OmniRouteProvider({
    baseUrl: 'https://omniroute.example/v1',
    apiKey: 'test-secret',
    fetch: async () => new Response('{}', { status: 503 }),
  });
  await assert.rejects(
    failing.generate({ task: 'review-tip', prompt: 'prompt' }),
    AiGenerationError,
  );

  const empty = new OmniRouteProvider({
    baseUrl: 'https://omniroute.example/v1',
    apiKey: 'test-secret',
    fetch: async () => new Response('{}', { status: 200 }),
  });
  await assert.rejects(
    empty.generate({ task: 'review-tip', prompt: 'prompt' }),
    AiGenerationError,
  );
});
