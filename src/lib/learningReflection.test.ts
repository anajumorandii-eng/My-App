import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyReflection, readReflection, reflectionForTutor, saveReflection } from './learningReflection';

test('preserva antes/depois no contexto enviado e mantém conta e tópico separados', () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const values = new Map<string, string>();
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) } });
  try {
    saveReflection('A', 'genetica', { before: 'Lembrança '.repeat(700), reasoning: 'Hipótese '.repeat(600), after: 'Agora explico a relação com a segregação.', next: 'Vou explicar um contraexemplo.' });
    const context = reflectionForTutor('A', 'genetica');
    assert.ok(context.length <= 6000);
    assert.match(context, /Agora explico a relação/);
    assert.match(context, /contraexemplo/);
    assert.match(context, /recorte/);
    assert.deepEqual(readReflection('B', 'genetica'), emptyReflection());
    assert.equal(reflectionForTutor('A', 'outro-topico'), '');
  } finally {
    if (original) Object.defineProperty(globalThis, 'localStorage', original);
    else Reflect.deleteProperty(globalThis, 'localStorage');
  }
});
