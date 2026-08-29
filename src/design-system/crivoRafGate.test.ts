import assert from 'node:assert/strict';
import test from 'node:test';
import { shouldRunLoop } from './crivoRafGate';

test('crivo raf gate: só permite animação com movimento, aba visível e tamanho disponível', () => {
  assert.equal(shouldRunLoop(false, 'visible', true), true);
  assert.equal(shouldRunLoop(true, 'visible', true), false);
  assert.equal(shouldRunLoop(false, 'hidden', true), false);
  assert.equal(shouldRunLoop(false, 'visible', false), false);
});
