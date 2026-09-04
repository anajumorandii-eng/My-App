import assert from 'node:assert/strict';
import test from 'node:test';
import { registerHooks } from 'node:module';

// Mesmo padrão de src/lib/userData.test.ts: o módulo de auth é trocado por um
// duplo na resolução, sem precisar de framework de mock.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === './auth' && context.parentURL?.endsWith('/src/lib/aiClient.ts')) {
      return { shortCircuit: true, url: 'mock:ai-client-auth' };
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url === 'mock:ai-client-auth') {
      return {
        shortCircuit: true,
        format: 'module',
        source: 'export const getFirebaseIdToken = async () => "id-token";',
      };
    }
    return nextLoad(url, context);
  },
});

const { requestAiTextStream, AiRequestError } = await import('./aiClient.ts');

// requestAiTextStream usa window.setTimeout/clearTimeout para o relógio de
// silêncio entre pedaços; fora do navegador basta apontar pros globais.
(globalThis as { window?: unknown }).window = globalThis;

function sse(frames: string[]): Response {
  const restantes = [...frames];
  const body = new ReadableStream<Uint8Array>({
    pull(controller) {
      const proximo = restantes.shift();
      if (proximo === undefined) return controller.close();
      controller.enqueue(new TextEncoder().encode(proximo));
    },
  });
  return new Response(body, { status: 200, headers: { 'Content-Type': 'text/event-stream' } });
}

function comFetch<T>(resposta: Response | (() => Response), corpo: () => Promise<T>): Promise<T> {
  const original = globalThis.fetch;
  globalThis.fetch = (async () => (typeof resposta === 'function' ? resposta() : resposta)) as typeof fetch;
  return corpo().finally(() => { globalThis.fetch = original; });
}

test('entrega cada pedaço a onDelta e devolve a resposta completa', async () => {
  const pedacos: string[] = [];
  const resultado = await comFetch(
    sse([
      'data: {"delta":"A glic"}\n\n',
      'data: {"delta":"ólise "}\n\n',
      'data: {"delta":"ocorre no citosol."}\n\n',
      'data: {"done":true,"text":"A glicólise ocorre no citosol.","model":"juju-deep-v1"}\n\n',
    ]),
    () => requestAiTextStream('socratic', { question: 'q' }, (d) => pedacos.push(d)),
  );

  assert.deepEqual(pedacos, ['A glic', 'ólise ', 'ocorre no citosol.']);
  assert.equal(resultado.text, 'A glicólise ocorre no citosol.');
  assert.equal(resultado.model, 'juju-deep-v1');
});

test('remonta um frame partido entre dois pedaços da rede', async () => {
  // O servidor pode cortar em qualquer byte, inclusive dentro do JSON.
  const pedacos: string[] = [];
  const resultado = await comFetch(
    sse(['data: {"delta":"met', 'ade"}\n\ndata: {"done":true,"text":"metade"}\n\n']),
    () => requestAiTextStream('socratic', { question: 'q' }, (d) => pedacos.push(d)),
  );
  assert.deepEqual(pedacos, ['metade']);
  assert.equal(resultado.text, 'metade');
});

test('um frame de erro vira AiRequestError com a mensagem do servidor', async () => {
  await assert.rejects(
    () => comFetch(
      sse([
        'data: {"delta":"comec"}\n\n',
        'data: {"error":"A resposta demorou mais do que o esperado. Tente novamente.","code":"AI_TIMEOUT"}\n\n',
      ]),
      () => requestAiTextStream('socratic', { question: 'q' }, () => {}),
    ),
    (error: unknown) => error instanceof AiRequestError && error.code === 'AI_TIMEOUT',
  );
});

test('recusa um fluxo que termina sem o frame final', async () => {
  // Sem isto a tela ficaria com o texto pela metade achando que acabou.
  await assert.rejects(
    () => comFetch(
      sse(['data: {"delta":"só o começo"}\n\n']),
      () => requestAiTextStream('socratic', { question: 'q' }, () => {}),
    ),
    AiRequestError,
  );
});

test('repassa o erro do servidor quando a resposta nem chega a abrir', async () => {
  await assert.rejects(
    () => comFetch(
      new Response(JSON.stringify({ error: 'Seu limite diário de uso da IA foi atingido.', code: 'AI_DAILY_LIMITED' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }),
      () => requestAiTextStream('socratic', { question: 'q' }, () => {}),
    ),
    (error: unknown) => error instanceof AiRequestError && error.status === 429 && error.code === 'AI_DAILY_LIMITED',
  );
});
