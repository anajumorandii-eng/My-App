import assert from 'node:assert/strict';
import test from 'node:test';
import express from 'express';
import compression from 'compression';
import { AddressInfo } from 'node:net';
import { createAiRouter } from './routes';
import { AiService } from './service';
import { AiGenerationRequest, AiProvider, AiProviderResult, AiStream } from './types';

/**
 * Vale a pena atravessar HTTP de verdade aqui: o middleware de compressão
 * segura pedaços pequenos até encher o buffer dele, e sem o flush por frame o
 * "streaming" chegaria inteiro de uma vez — funcionando nos testes de unidade
 * e não entregando nada do que promete na tela.
 */
function providerFake(pedacos: string[], atraso = 0): AiProvider {
  return {
    name: 'fake',
    model: 'fake-1',
    isConfigured: true,
    async generate(): Promise<AiProviderResult> {
      return { text: pedacos.join(''), model: 'fake-1' };
    },
    async *generateStream(_request: AiGenerationRequest): AiStream {
      for (const p of pedacos) {
        if (atraso) await new Promise((r) => setTimeout(r, atraso));
        yield p;
      }
      return { text: pedacos.join(''), model: 'fake-1', usage: { totalTokens: 42 } };
    },
  };
}

async function servidor(provider: AiProvider) {
  const app = express();
  app.use(compression());
  app.use(express.json());
  app.use((_req, res, next) => { res.locals.userId = 'ana'; next(); });
  app.use('/api/ai', createAiRouter(new AiService(provider, 5_000)));
  const server = app.listen(0);
  await new Promise((r) => server.once('listening', r));
  const { port } = server.address() as AddressInfo;
  return { url: `http://127.0.0.1:${port}`, fechar: () => new Promise((r) => server.close(() => r(undefined))) };
}

async function lerSse(url: string, body: unknown) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
    body: JSON.stringify(body),
  });
  const frames: Array<Record<string, unknown>> = [];
  const chegadas: number[] = [];
  const inicio = Date.now();
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let corte = buffer.indexOf('\n\n');
    while (corte !== -1) {
      const bruto = buffer.slice(0, corte).trim();
      buffer = buffer.slice(corte + 2);
      if (bruto.startsWith('data:')) {
        frames.push(JSON.parse(bruto.slice(5).trim()));
        chegadas.push(Date.now() - inicio);
      }
      corte = buffer.indexOf('\n\n');
    }
  }
  return { res, frames, chegadas };
}

test('a rota entrega os pedaços por SSE e fecha com o resultado completo', async () => {
  const { url, fechar } = await servidor(providerFake(['A glic', 'ólise ', 'ocorre no citosol.']));
  try {
    const { res, frames } = await lerSse(`${url}/api/ai/socratic`, { question: 'onde ocorre a glicólise?', topic: 'Respiração' });

    assert.match(res.headers.get('content-type') ?? '', /text\/event-stream/);
    assert.deepEqual(frames.slice(0, 3).map((f) => f.delta), ['A glic', 'ólise ', 'ocorre no citosol.']);

    const fim = frames.at(-1)!;
    assert.equal(fim.done, true);
    assert.equal(fim.text, 'A glicólise ocorre no citosol.');
    assert.equal(fim.model, 'fake-1');
    assert.ok(fim.requestId, 'o requestId precisa vir pra rastrear a chamada nos logs');
  } finally {
    await fechar();
  }
});

test('os pedaços chegam separados no tempo, não todos no fim', async () => {
  // Este é o teste que falharia se a compressão bufferizasse o fluxo.
  const { url, fechar } = await servidor(providerFake(['um', 'dois', 'três'], 60));
  try {
    const { chegadas } = await lerSse(`${url}/api/ai/socratic`, { question: 'p', topic: 'Respiração' });
    assert.ok(chegadas.length >= 4);
    assert.ok(
      chegadas[2] - chegadas[0] >= 80,
      `os pedaços chegaram praticamente juntos (${chegadas.join('ms, ')}ms) — o fluxo está sendo bufferizado`,
    );
  } finally {
    await fechar();
  }
});

test('sem pedir streaming, a resposta continua sendo o JSON de sempre', async () => {
  const { url, fechar } = await servidor(providerFake(['resposta inteira']));
  try {
    const res = await fetch(`${url}/api/ai/socratic`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: 'p', topic: 'Respiração' }),
    });
    assert.match(res.headers.get('content-type') ?? '', /application\/json/);
    const body = await res.json() as { text: string };
    assert.equal(body.text, 'resposta inteira');
  } finally {
    await fechar();
  }
});

test('uma falha no meio do fluxo vira frame de erro, não conexão morta', async () => {
  const quebrado: AiProvider = {
    name: 'fake', model: 'fake-1', isConfigured: true,
    async generate(): Promise<AiProviderResult> { return { text: 'x' }; },
    async *generateStream(): AiStream {
      yield 'começo';
      throw new Error('provedor caiu');
    },
  };
  const { url, fechar } = await servidor(quebrado);
  try {
    const { frames } = await lerSse(`${url}/api/ai/socratic`, { question: 'p', topic: 'Respiração' });
    assert.equal(frames[0].delta, 'começo');
    const ultimo = frames.at(-1)!;
    assert.equal(ultimo.code, 'AI_GENERATION_FAILED');
    assert.ok(ultimo.error, 'a aluna precisa receber a mensagem, não um fluxo que só para');
  } finally {
    await fechar();
  }
});
