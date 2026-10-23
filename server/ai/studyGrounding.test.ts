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

test('OCR corrompido não entra no prompt nem nas fontes devolvidas', async () => {
  const prompts: string[] = [];
  const service = new AiService({ name: 'fixture', model: 'fixture', isConfigured: true,
    generate: async request => { prompts.push(request.prompt); return 'Explicação sem apostila.'; },
    async *generateStream(request) { prompts.push(request.prompt); yield 'Explicação '; return { text: 'Explicação sem apostila.', model: 'fixture' }; },
  });
  const app = express(); app.use(express.json());
  app.use('/api/ai', createAiRouter(service, undefined, { getReference: async () => ({ subject: 'Matemática', topicName: 'Funções', chapters: [], text: 'Dq MO NKrAO < 80 >\nOpen Save Rec Play exe Prefs\nCAPÍTULO\n43 Ângulos em polígonos' }) }));
  const server = app.listen(0);
  try {
    await new Promise<void>(resolve => server.once('listening', resolve));
    const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/ai/review-tip`;
    const body = JSON.stringify({ subject: 'Matemática', topic: 'Funções', level: 40, daysSinceReview: 0 });
    const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).serverSources, undefined);
    const streamed = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' }, body });
    assert.equal(streamed.status, 200);
    assert.doesNotMatch(await streamed.text(), /serverSources|AS1/);
    assert.equal(prompts.length, 2);
    for (const prompt of prompts) assert.doesNotMatch(prompt, /Open Save|NKrAO|\[AS1\]/);
  } finally { server.closeAllConnections(); await new Promise<void>(resolve => server.close(() => resolve())); }
});

test('Geometria Plana usa a extração conferida em vez do OCR antigo em JSON e SSE', async () => {
  const prompts: string[] = [];
  const service = new AiService({ name: 'fixture', model: 'fixture', isConfigured: true,
    generate: async request => { prompts.push(request.prompt); return 'Explicação [AS1].'; },
    async *generateStream(request) { prompts.push(request.prompt); yield 'Explicação '; return { text: 'Explicação [AS1].', model: 'fixture' }; },
  });
  const app = express(); app.use(express.json());
  let oldReferenceReads = 0;
  app.use('/api/ai', createAiRouter(service, undefined, { getReference: async () => { oldReferenceReads++; throw new Error('referência antiga indisponível'); } }));
  const server = app.listen(0);
  try {
    await new Promise<void>(resolve => server.once('listening', resolve));
    const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/ai/review-tip`;
    const body = JSON.stringify({ subject: 'Matemática', topic: 'Geometria Plana', chapter: 'Ângulos em Polígonos', level: 40, daysSinceReview: 0 });
    const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
    assert.equal(response.status, 200);
    const source = (await response.json()).serverSources[0];
    assert.equal(source.id, 'AS1');
    assert.equal(source.excerpt, true);
    assert.equal(source.format, 'markdown');
    assert.match(source.url, /1LY2wYXIO2vQnoq5yunu4jFe7BR2sIx1k/);
    assert.ok(source.content.includes('S_i=(n-2)\\cdot180^\\circ'));
    assert.ok(source.content.includes('\\frac{360^\\circ}{n}'));
    assert.doesNotMatch(source.content, /Triângulos|Open Save|NKrAO/);
    const streamed = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' }, body });
    assert.equal(streamed.status, 200);
    const frames = await streamed.text();
    assert.match(frames, /serverSources/);
    assert.match(frames, /AS1/);
    assert.equal(oldReferenceReads, 0);
    for (const prompt of prompts) {
      assert.ok(prompt.includes('S_i=(n-2)\\cdot180^\\circ'));
      assert.doesNotMatch(prompt, /Open Save|NKrAO/);
    }
  } finally { server.closeAllConnections(); await new Promise<void>(resolve => server.close(() => resolve())); }
});
test('revisões mantêm opções no fluxo HTTP real e devolvem só os formatos selecionados',async()=>{
  let prompt='';let referenceReads=0;
  const service=new AiService({name:'fixture',model:'fixture',isConfigured:true,generate:async request=>{prompt=request.prompt;return 'Revisão';}});
  const app=express();app.use(express.json());app.use('/ai',createAiRouter(service,undefined,{getReference:async()=>{referenceReads++;return null;}}));
  const server=app.listen(0);
  try{
    await new Promise<void>(resolve=>server.once('listening',resolve));
    const url=`http://127.0.0.1:${(server.address() as AddressInfo).port}/ai/review-tip`;
    const base={topic:'Vacinação',subject:'Biologia',guideMode:'review-summary',level:40,daysSinceReview:0,referenceText:'[F1] Boletim fornecido de 2025.',reviewOptions:{sourceMode:'provided',materialKind:'current-affairs',sourceDate:'2025-10-01',depth:'quick'}};
    const response=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...base,targetBoards:['UNICAMP'],reviewOptions:{...base.reviewOptions,scopes:{UNICAMP:'second'}}})});
    assert.equal(response.status,200);
    const result=await response.json();
    assert.deepEqual(result.serverSources.map((s:{board:string})=>s.board),['UNICAMP']);
    assert.match(prompt,/Segunda fase/);assert.match(prompt,/2025-10-01/);assert.match(prompt,/Um mini-exemplo/);assert.match(prompt,/\[R1\].*UNICAMP/);
    assert.doesNotMatch(prompt,/FUVEST|Fuvest/);assert.equal(referenceReads,0);
    const general=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...base,targetBoards:[],board:'FUVEST'})});
    assert.equal(general.status,200);assert.equal((await general.json()).serverSources,undefined);
    assert.match(prompt,/Nenhuma banca selecionada/);assert.doesNotMatch(prompt,/FUVEST|Fuvest/);
  }finally{server.closeAllConnections();await new Promise<void>(resolve=>server.close(()=>resolve()));}
});
