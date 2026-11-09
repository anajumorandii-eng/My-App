import assert from 'node:assert/strict';
import test from 'node:test';
import { fitBookletArtwork } from './bookletCoverLayout';

function alphaFixture(leftTop: number, rightTop: number, bottom: number) {
  const alpha = new Uint8Array(100 * 100);
  for (let y = 0; y < bottom; y++) for (let x = 3; x < 97; x++) {
    if ((x < 49 && y >= leftTop) || (x > 50 && y >= rightTop)) alpha[y * 100 + x] = 255;
  }
  return alpha;
}

test('mantém a escala máxima da arte que já respeita as reservas nativas', () => {
  const fit = fitBookletArtwork(alphaFixture(21, 35, 83), 100, 100, 842);
  assert.equal(fit.scale, 1);
  assert.equal(fit.left, 0);
  assert.equal(fit.top, 0);
});

test('encaixa objetos fora das reservas sem cortar, separar a dobra ou distorcer as proporções', () => {
  const fit = fitBookletArtwork(alphaFixture(10, 25, 95), 100, 100, 842);
  assert.ok(fit.scale < 1);
  assert.ok(fit.top + .10 * fit.scale >= .20 - 1e-9);
  assert.ok(fit.top + .25 * fit.scale >= .34 - 1e-9);
  assert.ok(fit.top + .95 * fit.scale <= .84 + 1e-9);
  assert.equal(fit.left + .5 * fit.scale, .5, 'o eixo da conexão permanece na dobra');
  assert.ok(fit.top + .95 * (fit.scale + .001) > .84, 'aumentar mais invadiria a reserva do rodapé');
});

test('imagem sem alfa útil mantém o enquadramento e usa a proteção nativa do compositor', () => {
  assert.equal(fitBookletArtwork(undefined, 100, 100, 842).scale, 1);
  assert.equal(fitBookletArtwork(new Uint8Array(10000).fill(255), 100, 100, 842).scale, 1);
  assert.equal(fitBookletArtwork(new Uint8Array(10000), 100, 100, 842).scale, 1);
});
