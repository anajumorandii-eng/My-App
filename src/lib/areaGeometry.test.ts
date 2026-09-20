import assert from 'node:assert/strict';
import test from 'node:test';
import { AREA_CONFIGS } from './areaGeometry';

test('as seis configurações têm controle válido e produzem leituras', () => {
  assert.equal(Object.keys(AREA_CONFIGS).length, 6);

  for (const config of Object.values(AREA_CONFIGS)) {
    assert.ok(config.control.min < config.control.initial);
    assert.ok(config.control.initial < config.control.max);
    assert.ok(config.control.step > 0);
    assert.ok(config.formula.length > 0);
    assert.ok(config.insight.length > 0);
    assert.ok(config.readouts(config.control.initial).some((item) => item.pivot));
  }
});

test('triângulo com projeções 9 e 16 recupera o exemplo 15-20-25', () => {
  const values = AREA_CONFIGS['triangulo-retangulo'].readouts(9);
  assert.deepEqual(values.map((item) => item.value), ['12 cm', '25 cm', '20 · 15 cm']);
});

test('setor de raio 6 e 60 graus exige conversão para radianos', () => {
  const values = AREA_CONFIGS['geometria-metrica'].readouts(60);
  assert.deepEqual(values.map((item) => item.value), ['1,05 rad', '6,28 cm', '18,85 cm²', '18,28 cm']);
});

test('hexágono regular de lado 4 se decompõe em seis triângulos', () => {
  const values = AREA_CONFIGS['areas-poligonos'].readouts(6);
  assert.deepEqual(values.map((item) => item.value), ['6', '24 cm', '3,46 cm', '41,57 cm²']);
});

test('coroa de raios 10 e 6 subtrai os quadrados dos raios', () => {
  const values = AREA_CONFIGS['area-circulo'].readouts(6);
  assert.deepEqual(values.map((item) => item.value), ['314,16 cm²', '113,1 cm²', '201,06 cm²']);
});

test('razão linear 4 por 3 leva área 27 a 48', () => {
  const values = AREA_CONFIGS['razoes-areas'].readouts(4 / 3);
  assert.deepEqual(values.map((item) => item.value), ['1,33', '1,33', '1,78', '48 cm²']);
});

test('terreno 20 por 15 desconta piscina de raio 3', () => {
  const values = AREA_CONFIGS['areas-compostas'].readouts(3);
  assert.deepEqual(values.map((item) => item.value), ['300 m²', '28,27 m²', '271,73 m²']);
});
