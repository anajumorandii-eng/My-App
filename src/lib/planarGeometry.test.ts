import assert from 'node:assert/strict';
import test from 'node:test';
import { PLANAR_CONFIGS } from './planarGeometry';

test('triângulo preserva a soma interna e o teorema do ângulo externo', () => {
  const values = PLANAR_CONFIGS['angulos-triangulo'].readouts(50);
  assert.deepEqual(values.map((item) => item.value), ['90°', '90°', '180°']);
});

test('polígono de oito lados é decomposto em seis triângulos', () => {
  const values = PLANAR_CONFIGS['angulos-poligono'].readouts(8);
  assert.deepEqual(values.map((item) => item.value), ['6', '1080°', '45°']);
});

test('ângulo inscrito mede metade do arco e do central', () => {
  const values = PLANAR_CONFIGS['angulos-circunferencia'].readouts(80);
  assert.deepEqual(values.map((item) => item.value), ['80°', '40°', '2 : 1']);
});

test('semelhança dobra comprimentos e quadruplica áreas', () => {
  const values = PLANAR_CONFIGS.semelhanca.readouts(2);
  assert.deepEqual(values.map((item) => item.value), ['2', '4', 'iguais']);
});

test('duas reflexões nos eixos invertem os dois sinais', () => {
  assert.equal(PLANAR_CONFIGS['simetria-ii'].readouts(-3)[2].value, '(3, 3)');
});
