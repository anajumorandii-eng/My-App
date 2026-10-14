import test from 'node:test';
import assert from 'node:assert/strict';
import { transparentFigurePixels } from './figureTransparency';

test('retira papel e adapta traços neutros ao tema sem mudar cores do gráfico', () => {
  const source = new Uint8ClampedArray(10 * 10 * 4).fill(255);
  source.set([0, 0, 0, 255], 44 * 4);
  source.set([220, 30, 40, 255], 45 * 4);
  const result = transparentFigurePixels(source, 10, 10, [240, 235, 225]);
  assert.equal(result[3], 0);
  assert.deepEqual([...result.slice(44 * 4, 44 * 4 + 4)], [240, 235, 225, 255]);
  assert.deepEqual([...result.slice(45 * 4, 45 * 4 + 4)], [220, 30, 40, 255]);
  assert.equal(source[3], 255);
  assert.deepEqual([...source.slice(44 * 4, 44 * 4 + 4)], [0, 0, 0, 255]);
});
test('preserva letras brancas dentro de uma área colorida e remove apenas o papel externo', () => {
  const source = new Uint8ClampedArray(7 * 7 * 4).fill(255);
  for (let y = 1; y < 6; y++) for (let x = 1; x < 6; x++) source.set([210, 30, 40, 255], (y * 7 + x) * 4);
  source.set([255, 255, 255, 255], (3 * 7 + 3) * 4);
  const result = transparentFigurePixels(source, 7, 7, [40, 40, 40]);
  assert.equal(result[3], 0);
  assert.deepEqual([...result.slice((3 * 7 + 3) * 4, (3 * 7 + 3) * 4 + 4)], [255, 255, 255, 255]);
  assert.deepEqual([...result.slice((2 * 7 + 2) * 4, (2 * 7 + 2) * 4 + 4)], [210, 30, 40, 255]);
});
