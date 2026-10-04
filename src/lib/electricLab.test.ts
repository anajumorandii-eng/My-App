import assert from 'node:assert/strict';
import test from 'node:test';
import { ELECTRIC } from './electricLab';

test('corrente divide a carga pelo intervalo de tempo', () => assert.equal(ELECTRIC.current.readouts(8)[1].value, '4 A'));
test('lei de Ohm reduz a corrente quando a resistência aumenta', () => assert.equal(ELECTRIC.resistor.readouts(6)[1].value, '2 A'));
test('lei dos nós mantém a corrente distribuída igual à entrada', () => assert.equal(ELECTRIC.kirchhoff.readouts(7)[2].value, '7 A = 2 A + 5 A'));
test('capacitor aumenta energia com o quadrado da tensão', () => assert.equal(ELECTRIC.capacitor.readouts(6)[1].value, '36 μJ'));

test('estados decisivos mantêm carga, corrente, potência e energia coerentes', () => {
  for (const [q, i] of [[0, 0], [8, 4], [16, 8]]) assert.equal(ELECTRIC.current.readouts(q)[1].value, `${i} A`);
  for (const [i, p] of [[0, 0], [3, 36], [8, 96]]) assert.equal(ELECTRIC.power.readouts(i)[1].value, `${p} W`);
  for (const [r, i] of [[1, 12], [4, 3], [12, 1]]) assert.equal(ELECTRIC.resistor.readouts(r)[1].value, `${i} A`);
  for (const input of [2, 7, 12]) assert.equal(ELECTRIC.kirchhoff.readouts(input)[1].value, `${input - 2} A`);
  for (const [u, q, energy] of [[0, 0, 0], [6, 12, 36], [12, 24, 144]]) {
    assert.equal(ELECTRIC.capacitor.readouts(u)[0].value, `${q} μC`);
    assert.equal(ELECTRIC.capacitor.readouts(u)[1].value, `${energy} μJ`);
  }
});
