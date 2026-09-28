import assert from 'node:assert/strict';
import test from 'node:test';
import { AiGenerationError } from './errors';
import { OmniRouteProvider } from './omniRouteProvider';

test('envia uma requisição Chat Completions autenticada ao modelo único', async () => {
  let requestUrl = '';
  let requestInit: RequestInit | undefined;
  const provider = new OmniRouteProvider({
    baseUrl: 'https://omniroute.example/v1/',
    apiKey: 'test-secret',
    model: 'modelo-crivo',
    fetch: async (url, init) => {
      requestUrl = String(url);
      requestInit = init;
      return new Response(JSON.stringify({
        choices: [{ message: { content: ' resposta do modelo ' } }],
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    },
  });

  const result = await provider.generate({ task: 'socratic', prompt: 'Ajude o aluno.' });
  const payload = JSON.parse(String(requestInit?.body));

  assert.equal(typeof result === 'string' ? result : result.text, ' resposta do modelo ');
  assert.equal(requestUrl, 'https://omniroute.example/v1/chat/completions');
  assert.equal(new Headers(requestInit?.headers).get('Authorization'), 'Bearer test-secret');
  assert.deepEqual(payload, {
    model: 'modelo-crivo',
    messages: [{ role: 'user', content: 'Ajude o aluno.' }],
    stream: false,
  });
});

test('rejeita erros HTTP e respostas sem conteúdo', async () => {
  const failing = new OmniRouteProvider({
    baseUrl: 'https://omniroute.example/v1',
    apiKey: 'test-secret',
    model: 'modelo-crivo',
    fetch: async () => new Response('{}', { status: 503 }),
  });
  await assert.rejects(
    failing.generate({ task: 'review-tip', prompt: 'prompt' }),
    AiGenerationError,
  );

  const empty = new OmniRouteProvider({
    baseUrl: 'https://omniroute.example/v1',
    apiKey: 'test-secret',
    model: 'modelo-crivo',
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
    model: 'modelo-crivo',
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
  assert.equal(result.model, 'modelo-crivo');
  assert.deepEqual(result.usage, { promptTokens: 10, completionTokens: 7, totalTokens: 17 });
  assert.equal(corpo.stream, true, 'a requisição precisa pedir streaming');
  assert.deepEqual(corpo.stream_options, { include_usage: true });
});

test('um frame partido entre dois pedaços da rede não perde texto', async () => {
  const provider = new OmniRouteProvider({
    baseUrl: 'https://omniroute.example/v1',
    apiKey: 'k',
    model: 'modelo-crivo',
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

test('não tenta novamente após falha no meio do fluxo', async () => {
  // Recomeçar aqui substituiria a resposta debaixo dos olhos dela.
  let chamadas = 0;
  const provider = new OmniRouteProvider({
    baseUrl: 'https://omniroute.example/v1',
    apiKey: 'k',
    model: 'modelo-crivo',
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
  assert.equal(chamadas, 1, 'não deve repetir uma resposta já iniciada');
});

test('usa o mesmo modelo para o roteiro do podcast e para a correção', async () => {
  const models: string[] = [];
  const provider = new OmniRouteProvider({
    baseUrl: 'https://omniroute.example/v1',
    apiKey: 'k',
    model: 'modelo-crivo',
    fetch: async (_url, init) => {
      models.push(JSON.parse(String(init?.body)).model);
      return new Response(JSON.stringify({ choices: [{ message: { content: 'ok' } }] }), { status: 200 });
    },
  });
  await provider.generate({ task: 'podcast-script', prompt: 'roteiro' });
  await provider.generate({ task: 'discursive-feedback', prompt: 'correção' });
  assert.deepEqual(models, ['modelo-crivo', 'modelo-crivo']);
});

test('não configura OmniRoute sem AI_MODEL', () => {
  const provider = new OmniRouteProvider({ baseUrl: 'https://omniroute.example/v1', apiKey: 'k', model: undefined });
  assert.equal(provider.isConfigured, false);
});
