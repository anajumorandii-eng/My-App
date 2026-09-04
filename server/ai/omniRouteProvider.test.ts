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

function sseResponse(frames: string[]): Response {
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      const encoder = new TextEncoder();
      for (const f of frames) controller.enqueue(encoder.encode(f));
      controller.close();
    },
  });
  return new Response(body, { status: 200, headers: { 'Content-Type': 'text/event-stream' } });
}

async function collect(stream: AsyncGenerator<string, { text: string; model?: string; usage?: unknown; fallback?: boolean }, void>) {
  const deltas: string[] = [];
  let passo = await stream.next();
  while (passo.done !== true) {
    deltas.push(passo.value);
    passo = await stream.next();
  }
  return { deltas, result: passo.value };
}

test('streaming emite os pedaços conforme chegam e devolve o texto completo', async () => {
  let corpo: any;
  const provider = new OmniRouteProvider({
    baseUrl: 'https://omniroute.example/v1',
    apiKey: 'k',
    fetch: async (_url, init) => {
      corpo = JSON.parse(String(init?.body));
      return sseResponse([
        'data: {"choices":[{"delta":{"content":"A glic"}}]}\n',
        'data: {"choices":[{"delta":{"content":"ólise "}}]}\n',
        'data: {"choices":[{"delta":{"content":"ocorre no citosol."}}]}\n',
        'data: {"usage":{"prompt_tokens":10,"completion_tokens":7,"total_tokens":17}}\n',
        'data: [DONE]\n',
      ]);
    },
  });

  const { deltas, result } = await collect(provider.generateStream({ task: 'socratic', prompt: 'p' }));

  assert.deepEqual(deltas, ['A glic', 'ólise ', 'ocorre no citosol.']);
  assert.equal(result.text, 'A glicólise ocorre no citosol.');
  assert.equal(result.model, 'juju-deep-v1');
  assert.deepEqual(result.usage, { promptTokens: 10, completionTokens: 7, totalTokens: 17 });
  assert.equal(corpo.stream, true, 'a requisição precisa pedir streaming');
  assert.deepEqual(corpo.stream_options, { include_usage: true });
});

test('um frame partido entre dois pedaços da rede não perde texto', async () => {
  const provider = new OmniRouteProvider({
    baseUrl: 'https://omniroute.example/v1',
    apiKey: 'k',
    // O servidor pode cortar em qualquer byte, inclusive no meio do JSON.
    fetch: async () => sseResponse([
      'data: {"choices":[{"delta":',
      '{"content":"inteiro"}}]}\ndata: [DONE]\n',
    ]),
  });

  const { deltas, result } = await collect(provider.generateStream({ task: 'review-tip', prompt: 'p' }));
  assert.deepEqual(deltas, ['inteiro']);
  assert.equal(result.text, 'inteiro');
});

test('cai no combo fast quando o deep falha antes do primeiro pedaço', async () => {
  const modelos: string[] = [];
  const provider = new OmniRouteProvider({
    baseUrl: 'https://omniroute.example/v1',
    apiKey: 'k',
    fetch: async (_url, init) => {
      const model = JSON.parse(String(init?.body)).model;
      modelos.push(model);
      if (model === 'juju-deep-v1') return new Response('erro', { status: 500 });
      return sseResponse(['data: {"choices":[{"delta":{"content":"do fast"}}]}\n', 'data: [DONE]\n']);
    },
  });

  const { deltas, result } = await collect(provider.generateStream({ task: 'socratic', prompt: 'p' }));
  assert.deepEqual(modelos, ['juju-deep-v1', 'juju-fast-v1']);
  assert.deepEqual(deltas, ['do fast']);
  assert.equal(result.fallback, true);
});

test('não troca de modelo depois que a aluna já começou a ler', async () => {
  // Recomeçar aqui substituiria a resposta debaixo dos olhos dela.
  let chamadas = 0;
  const provider = new OmniRouteProvider({
    baseUrl: 'https://omniroute.example/v1',
    apiKey: 'k',
    fetch: async () => {
      chamadas += 1;
      let primeiro = true;
      const body = new ReadableStream<Uint8Array>({
        pull(controller) {
          if (primeiro) {
            primeiro = false;
            controller.enqueue(new TextEncoder().encode('data: {"choices":[{"delta":{"content":"comecei"}}]}\n'));
            return;
          }
          controller.error(new Error('conexão caiu no meio'));
        },
      });
      return new Response(body, { status: 200 });
    },
  });

  const stream = provider.generateStream({ task: 'socratic', prompt: 'p' });
  assert.equal((await stream.next()).value, 'comecei');
  await assert.rejects(() => stream.next());
  assert.equal(chamadas, 1, 'não deve tentar o fast depois de já ter emitido');
});
