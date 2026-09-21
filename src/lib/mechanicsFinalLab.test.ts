import assert from 'node:assert/strict';
import test from 'node:test';
import { MECHANICS_FINAL } from './mechanicsFinalLab';

test('identifica a perda de contato no topo da curva vertical', () => {
  assert.equal(MECHANICS_FINAL['vertical-plane'].readouts(5).find((item) => item.label === 'Contato')?.value, 'perdido');
  assert.equal(MECHANICS_FINAL['vertical-plane'].readouts(7).find((item) => item.label === 'Contato')?.value, 'mantido');
});
test('mantém força restauradora oposta ao deslocamento', () => {
  assert.equal(MECHANICS_FINAL.mhs.readouts(3)[0].value, '-12 N');
  assert.equal(MECHANICS_FINAL.mhs.readouts(-2)[0].value, '8 N');
});
test('conserva o balanço entre atrito e energia interna', () => assert.deepEqual(MECHANICS_FINAL.nonconservative.readouts(6).map((item) => item.value), ['-24 J', '24 J']));
test('converte miligrama de defeito em energia pela relação massa-energia', () => assert.equal(MECHANICS_FINAL['mass-energy'].readouts(5)[0].value, '45 × 10¹⁰ J'));
