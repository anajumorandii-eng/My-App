import assert from 'node:assert/strict';
import test, { TestContext } from 'node:test';
import { withApp, sendJson } from '../testing/httpTestServer';
import { createPodcastAudioRouter, DEFAULT_PODCAST_VOICE } from './routes';
import type { GeminiTtsService } from './ttsService';

interface FakeTts {
  service: GeminiTtsService;
  calls: Array<{ text: string; voiceName: string }>;
}

function fakeTts(options: { isConfigured?: boolean; fail?: boolean } = {}): FakeTts {
  const calls: FakeTts['calls'] = [];
  const service = {
    isConfigured: options.isConfigured ?? true,
    synthesize: async (text: string, voiceName: string) => {
      calls.push({ text, voiceName });
      if (options.fail) throw new Error('quota da Gemini esgotada: chave sk-segredo');
      return { buffer: Buffer.from('audio-de-teste'), mimeType: 'audio/wav' };
    },
  } as unknown as GeminiTtsService;
  return { service, calls };
}

// A rota registra um JSON por requisição e o erro de síntese; nada disso é o
// que os testes verificam.
function silenciarLogs(t: TestContext) {
  t.mock.method(console, 'info', () => undefined);
  t.mock.method(console, 'error', () => undefined);
}

async function withPodcast(tts: FakeTts, run: (baseUrl: string) => Promise<void>) {
  await withApp((app) => {
    app.use('/api/podcast-audio', createPodcastAudioRouter(tts.service));
  }, run);
}

test('recusa texto ausente, em branco ou que não é string, sem chamar a síntese', async (t) => {
  silenciarLogs(t);
  const tts = fakeTts();
  await withPodcast(tts, async (baseUrl) => {
    for (const body of [{}, { text: '' }, { text: '   \n ' }, { text: 42 }]) {
      const res = await sendJson(baseUrl, 'POST', '/api/podcast-audio', body);
      assert.equal(res.status, 400, JSON.stringify(body));
      assert.equal(((await res.json()) as { code: string }).code, 'INVALID_TTS_REQUEST');
    }
    assert.deepEqual(tts.calls, []);
  });
});

test('o limite é de 2000 caracteres: 2000 passa, 2001 é recusado', async (t) => {
  silenciarLogs(t);
  const tts = fakeTts();
  await withPodcast(tts, async (baseUrl) => {
    const noLimite = await sendJson(baseUrl, 'POST', '/api/podcast-audio', { text: 'a'.repeat(2000) });
    assert.equal(noLimite.status, 200);

    const acima = await sendJson(baseUrl, 'POST', '/api/podcast-audio', { text: 'a'.repeat(2001) });
    assert.equal(acima.status, 400);
    assert.match(((await acima.json()) as { error: string }).error, /2000/);
    assert.equal(tts.calls.length, 1);
  });
});

test('validação vem antes da disponibilidade: texto inválido é 400 mesmo sem a chave configurada', async (t) => {
  silenciarLogs(t);
  await withPodcast(fakeTts({ isConfigured: false }), async (baseUrl) => {
    const res = await sendJson(baseUrl, 'POST', '/api/podcast-audio', { text: '' });
    assert.equal(res.status, 400);
  });
});

test('sem a chave da Gemini o serviço responde 503 e não tenta sintetizar', async (t) => {
  silenciarLogs(t);
  const tts = fakeTts({ isConfigured: false });
  await withPodcast(tts, async (baseUrl) => {
    const res = await sendJson(baseUrl, 'POST', '/api/podcast-audio', { text: 'Olá' });
    assert.equal(res.status, 503);
    assert.equal(((await res.json()) as { code: string }).code, 'TTS_UNAVAILABLE');
    assert.deepEqual(tts.calls, []);
  });
});

test('devolve o áudio com o tipo certo, cache privado e o id da requisição', async (t) => {
  silenciarLogs(t);
  await withPodcast(fakeTts(), async (baseUrl) => {
    const res = await sendJson(baseUrl, 'POST', '/api/podcast-audio', { text: '  Bom dia  ' });
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('content-type'), 'audio/wav');
    assert.equal(res.headers.get('cache-control'), 'private, max-age=86400');
    assert.match(res.headers.get('x-request-id') ?? '', /^[0-9a-f-]{36}$/);
    assert.equal(Buffer.from(await res.arrayBuffer()).toString(), 'audio-de-teste');
  });
});

test('aparar o texto: a síntese recebe o texto sem espaços nas pontas', async (t) => {
  silenciarLogs(t);
  const tts = fakeTts();
  await withPodcast(tts, async (baseUrl) => {
    await sendJson(baseUrl, 'POST', '/api/podcast-audio', { text: '  Bom dia  ' });
    assert.equal(tts.calls[0].text, 'Bom dia');
  });
});

test('só as vozes da lista são aceitas; qualquer outra cai na padrão', async (t) => {
  silenciarLogs(t);
  const tts = fakeTts();
  await withPodcast(tts, async (baseUrl) => {
    await sendJson(baseUrl, 'POST', '/api/podcast-audio', { text: 'a', voiceName: 'Kore' });
    await sendJson(baseUrl, 'POST', '/api/podcast-audio', { text: 'a', voiceName: 'Voz-Que-Nao-Existe' });
    await sendJson(baseUrl, 'POST', '/api/podcast-audio', { text: 'a', voiceName: { toString: 'x' } });
    await sendJson(baseUrl, 'POST', '/api/podcast-audio', { text: 'a' });
    assert.deepEqual(tts.calls.map((call) => call.voiceName), ['Kore', DEFAULT_PODCAST_VOICE, DEFAULT_PODCAST_VOICE, DEFAULT_PODCAST_VOICE]);
  });
});

test('falha na síntese vira 502 sem repassar a mensagem interna do provedor', async (t) => {
  silenciarLogs(t);
  await withPodcast(fakeTts({ fail: true }), async (baseUrl) => {
    const res = await sendJson(baseUrl, 'POST', '/api/podcast-audio', { text: 'Olá' });
    assert.equal(res.status, 502);
    const corpo = await res.text();
    assert.match(corpo, /TTS_GENERATION_FAILED/);
    assert.doesNotMatch(corpo, /sk-segredo|quota/);
  });
});
