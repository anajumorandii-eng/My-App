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
  assert.equal(parseAiTimeout('500'), 60_000);
  assert.equal(parseAiTimeout('120000'), 120_000);
});

