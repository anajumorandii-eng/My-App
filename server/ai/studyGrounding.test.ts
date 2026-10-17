import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import type { AddressInfo } from 'node:net';
import { AiService } from './service';
import { createAiRouter } from './routes';

test('apostila complementar é identificada no prompt e devolvida ao aluno em JSON e streaming', async () => {
  let prompt = '';
  const service = new AiService({ name: 'fixture', model: 'fixture', isConfigured: true,
    generate: async request => { prompt = request.prompt; return 'Explicação apoiada em [AS1].'; },
    async *generateStream(request) { prompt = request.prompt; yield 'Explicação '; return { text: 'Explicação [AS1].', model: 'fixture' }; },
  });
  const app = express(); app.use(express.json());
  app.use('/api/ai', createAiRouter(service, undefined, { getReference: async () => ({ subject: 'Biologia', topicName: 'Genética', chapters: [], text: 'A segregação envolve separação dos alelos.' }) }));
  const server = app.listen(0);
  try {
    await new Promise<void>(resolve => server.once('listening', resolve));
    const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/ai/review-tip`;
    const body = JSON.stringify({ subject: 'Biologia', topic: 'Genética', level: 40, daysSinceReview: 0, targetBoards: ['Unicamp', 'Fuvest'], learnerReflection: 'Não sei justificar minha primeira decisão.' });
    const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
    const result = await response.json();
    assert.equal(response.status, 200);
    assert.equal(result.serverSources[0].id, 'AS1');
    assert.match(result.serverSources[0].content, /separação dos alelos/);
    assert.match(prompt, /Não sei justificar/);
    const streamed = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' }, body });
    const frames = await streamed.text();
    assert.match(frames, /serverSources/);
    assert.match(frames, /AS1/);
  } finally { server.closeAllConnections(); await new Promise<void>(resolve => server.close(() => resolve())); }
});
