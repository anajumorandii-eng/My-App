import assert from 'node:assert/strict';
import test from 'node:test';
import { conversationHistory } from './tutorWorkspace';

test('histórico socrático mantém raciocínio anterior e exclui falhas e respostas interrompidas', () => {
  assert.deepEqual(conversationHistory([
    { id: '1', sender: 'user', text: 'Acho que depende do X.' },
    { id: '2', sender: 'ai', text: 'Qual é a origem desse cromossomo?', state: 'complete' },
    { id: '3', sender: 'ai', text: 'Sem conexão', state: 'error' },
    { id: '4', sender: 'ai', text: 'Trecho incompleto', state: 'pending' },
  ]), [{ role: 'user', content: 'Acho que depende do X.' }, { role: 'assistant', content: 'Qual é a origem desse cromossomo?' }]);
});
test('histórico tem orçamento limitado, favorece mensagens recentes e indica cortes', () => {
  const history = conversationHistory(Array.from({ length: 25 }, (_, id) => ({ id: String(id), sender: 'user', text: `${id}: ${'a'.repeat(9000)}` })));
  assert.ok(history.length <= 12);
  assert.ok(history.reduce((sum, item) => sum + item.content.length, 0) <= 12000);
  assert.ok(history.at(-1)?.content.startsWith('24:'));
  assert.ok(history.every(item => item.content.endsWith('[trecho parcial]')));
});
