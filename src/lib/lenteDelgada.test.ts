import test from 'node:test';
import assert from 'node:assert/strict';
import { imagemDaLente, naturezaDaImagem, raiosNotaveis } from './lenteDelgada';

test('objeto em 2f forma imagem em 2f, real, invertida e do mesmo tamanho', () => {
  const imagem = imagemDaLente(20, 10)!;
  assert.equal(imagem.pLinha, 20);
  assert.equal(imagem.aumento, -1);
  assert.equal(naturezaDaImagem(imagem), 'real, invertida e do mesmo tamanho');
});

test('além de 2f a imagem é menor; entre f e 2f, maior', () => {
  assert.equal(imagemDaLente(30, 10)!.tamanho, 'menor');
  assert.equal(imagemDaLente(15, 10)!.tamanho, 'maior');
  assert.equal(imagemDaLente(15, 10)!.pLinha, 30);
});

test('objeto no foco não forma imagem; dentro do foco a imagem é virtual e direita', () => {
  assert.equal(imagemDaLente(10, 10), null);
  const lupa = imagemDaLente(5, 10)!;
  assert.equal(lupa.real, false);
  assert.equal(naturezaDaImagem(lupa), 'virtual, direita e maior');
});

test('os três raios notáveis saem do topo do objeto e chegam ao mesmo ponto da imagem', () => {
  const p = 25, f = 10, h = 4;
  const raios = raiosNotaveis(p, f, h);
  const imagem = imagemDaLente(p, f)!;
  for (const raio of raios) {
    assert.deepEqual(raio[0], { x: -p, y: h });
    assert.ok(Math.abs(raio[2].x - imagem.pLinha) < 1e-9);
    assert.ok(Math.abs(raio[2].y - imagem.aumento * h) < 1e-9);
  }
  // O raio paralelo passa pelo foco imagem depois da lente.
  const [, naLente, fim] = raios[0];
  const yNoFoco = naLente.y + ((fim.y - naLente.y) / (fim.x - naLente.x)) * (f - naLente.x);
  assert.ok(Math.abs(yNoFoco) < 1e-9);
  // O raio que passa pelo foco objeto sai paralelo ao eixo.
  assert.ok(Math.abs(raios[2][1].y - raios[2][2].y) < 1e-9);
});

test('a bancada recusa desenhar imagem virtual, em vez de traçar raio errado', () => {
  assert.throws(() => raiosNotaveis(5, 10, 1));
});
