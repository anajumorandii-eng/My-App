import assert from 'node:assert/strict';
import test from 'node:test';
import { AiGenerationError, AiTimeoutError, AiUnavailableError } from './errors';
import { AiService, parseAiTimeout } from './service';
import { AiProvider } from './types';

function provider(overrides: Partial<AiProvider> = {}): AiProvider {
  return {
    name: 'fake',
    model: 'fake-model',
    isConfigured: true,
    generate: async () => ' resposta ',
    ...overrides,
  };
}

test('normaliza a saída e informa provedor e modelo', async () => {
  const service = new AiService(provider());
  const result = await service.generate({ task: 'review-tip', prompt: 'prompt' });

  assert.deepEqual(result, { text: 'resposta', provider: 'fake', model: 'fake-model' });
});

test('falha de forma explícita quando não há provedor configurado', async () => {
  const service = new AiService(provider({ isConfigured: false }));
  await assert.rejects(
    service.generate({ task: 'review-tip', prompt: 'prompt' }),
    AiUnavailableError,
  );
});

test('rejeita resposta vazia do provedor', async () => {
  const service = new AiService(provider({ generate: async () => '   ' }));
  await assert.rejects(
    service.generate({ task: 'review-tip', prompt: 'prompt' }),
    AiGenerationError,
  );
});

test('aplica timeout à chamada do provedor', async () => {
  const service = new AiService(provider({
    generate: () => new Promise((resolve) => setTimeout(() => resolve('tarde'), 30)),
  }), 5);
  await assert.rejects(
    service.generate({ task: 'review-tip', prompt: 'prompt' }),
    AiTimeoutError,
  );
});

test('normaliza configuração inválida de timeout', () => {
  assert.equal(parseAiTimeout('500'), 150_000);
  assert.equal(parseAiTimeout('120000'), 120_000);
});

test('reaproveita cache apenas para o mesmo usuário e tarefa segura', async () => {
  let calls = 0;
  const service = new AiService(provider({ generate: async () => `resposta-${++calls}` }));
  const request = { task: 'review-tip' as const, prompt: 'prompt', userId: 'ana' };

  assert.equal((await service.generate(request)).text, 'resposta-1');
  const cached = await service.generate(request);
  assert.equal(cached.text, 'resposta-1');
  assert.equal(cached.cached, true);
  assert.equal((await service.generate({ ...request, userId: 'outra' })).text, 'resposta-2');
});

test('cancelamento externo aborta o streaming pendente e não cria cache parcial', async () => {
 let calls=0;
 const p=provider();
 p.generateStream=async function* ({signal}) {
  calls++;
  yield 'parcial';
  await new Promise<never>((_,reject)=>{
   const cancel=()=>reject(signal!.reason);
   if(signal?.aborted)cancel();else signal?.addEventListener('abort',cancel,{once:true});
  });
  return {text:'não deve concluir'};
 };
 const service=new AiService(p,5000);
 for(let attempt=0;attempt<2;attempt++){
  const controller=new AbortController();
  const stream=service.generateStream({task:'review-tip',prompt:'mesmo pedido',userId:'test-user',signal:controller.signal});
  assert.equal((await stream.next()).value,'parcial');
  const pending=stream.next();controller.abort();
  await assert.rejects(pending,(error:unknown)=>error instanceof Error && error.name==='AbortError');
 }
 assert.equal(calls,2);
});

test('streaming contínuo pode ultrapassar o limite de inatividade sem ser cortado', async () => {
 const p=provider();
 p.generateStream=async function* () {
  for(const piece of ['um ','dois ','três ']){
   await new Promise(resolve=>setTimeout(resolve,20));
   yield piece;
  }
  return {text:'um dois três',model:'test-route'};
 };
 const service=new AiService(p,50);
 const stream=service.generateStream({task:'review-tip',prompt:'pedido longo'});
 let text='';
 for(;;){const step=await stream.next();if(step.done){assert.equal(step.value.text,'um dois três');break;}text+=step.value;}
 assert.equal(text,'um dois três ');
});
