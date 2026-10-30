import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import type { Question } from '../../src/types';
import { groundQuestion } from './questionGrounding';
import { OmniRouteProvider } from './omniRouteProvider';

test('comentário usa texto, alternativas, gabarito e imagens do ID conferido, sem confiar no corpo do cliente', async () => {
  const bank = JSON.parse(readFileSync('public/questions.json','utf8')) as Question[];
  const q = bank.find(q => q.figures?.length)!;
  const payload: Record<string, unknown> = { questionId:q.id, selectedOptionId:q.options[0].id,
    prompt:'enunciado adulterado', correctAnswer:'gabarito adulterado', subject:'outra matéria' };
  const images = await groundQuestion(payload);
  assert.ok(images?.length);
  assert.ok(images.every(i => i.data.length > 100 && /^image\//.test(i.mimeType)));
  assert.match(String(payload.prompt), /Alternativas:/);
  assert.ok(String(payload.prompt).startsWith(q.prompt));
  assert.equal(payload.subject,q.subject);
  assert.equal(payload.correctAnswer, `${q.correctOptionId.toUpperCase()}) ${q.options.find(o => o.id === q.correctOptionId)!.text}`);
  await assert.rejects(groundQuestion({questionId:'inexistente',selectedOptionId:'a'}),/não encontrada/);
  await assert.rejects(groundQuestion({questionId:q.id,selectedOptionId:'z'}),/Alternativa inválida/);
});

test('OmniRoute mantém comentário na rota profunda e inclui imagens também no fallback', async () => {
  const requests: any[]=[];
  const provider=new OmniRouteProvider({baseUrl:'https://fixture.test/v1',apiKey:'fixture',deepModel:'deep-comment',fastModel:'fallback',
    fetch:async (_url,init) => {
      const body=JSON.parse(String(init?.body));requests.push(body);
      if(body.model==='deep-comment') return new Response('bad request',{status:400});
      return Response.json({choices:[{message:{content:'Comentário concluído'}}]});
    }});
  await provider.generate({task:'question-explanation',prompt:'Questão e alternativas',images:[{mimeType:'image/webp',data:'ZmlndXJh'}]});
  assert.deepEqual(requests.map(r=>r.model),['deep-comment','fallback']);
  for (const request of requests) {
    assert.equal(request.messages[0].content[0].text,'Questão e alternativas');
    assert.equal(request.messages[0].content[1].image_url.url,'data:image/webp;base64,ZmlndXJh');
  }
});

test('streaming envia a mesma mídia e só conclui com quadro terminal válido',async()=>{
  let body:any;
  const provider=new OmniRouteProvider({baseUrl:'https://fixture.test/v1',apiKey:'fixture',deepModel:'deep-comment',
    fetch:async(_url,init)=>{body=JSON.parse(String(init?.body));return new Response('data: {"choices":[{"delta":{"content":"Comentário"}}]}\n\ndata: [DONE]\n\n',{headers:{'Content-Type':'text/event-stream'}});}});
  const stream=provider.generateStream({task:'question-explanation',prompt:'Questão',images:[{mimeType:'image/png',data:'ZmlndXJh'}]});
  assert.equal((await stream.next()).value,'Comentário');
  const done=await stream.next();assert.equal(done.done,true);
  assert.equal(body.model,'deep-comment');assert.equal(body.messages[0].content[1].image_url.url,'data:image/png;base64,ZmlndXJh');
});
