import test from 'node:test';
import assert from 'node:assert/strict';
import { imagemDeLenteConvergente } from './opticalImage';

test('objeto além do foco dá imagem real e invertida', () => {
  const i = imagemDeLenteConvergente(126, 46, 62);
  assert.equal(i.real, true);
  assert.equal(i.invertida, true, 'este é o caso mais cobrado, e era o que a prancha desenhava errado');
  assert.ok(i.distancia > 0, 'imagem real fica do outro lado da lente');
});

test('objeto entre o foco e a lente dá imagem virtual, direita e ampliada', () => {
  const i = imagemDeLenteConvergente(42, 34, 62);
  assert.equal(i.real, false);
  assert.equal(i.invertida, false);
  assert.ok(i.distancia < 0, 'imagem virtual fica do mesmo lado do objeto');
  assert.ok(i.ampliacao > 1, `deveria ampliar, veio ${i.ampliacao.toFixed(2)}×`);
});

test('objeto no dobro do foco dá imagem do mesmo tamanho', () => {
  const i = imagemDeLenteConvergente(124, 46, 62);
  assert.ok(Math.abs(i.ampliacao - 1) < 1e-9, `esperava 1×, veio ${i.ampliacao}`);
  assert.equal(i.invertida, true);
});
