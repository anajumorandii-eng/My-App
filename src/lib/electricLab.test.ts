import assert from 'node:assert/strict';
import test from 'node:test';
import { ELECTRIC } from './electricLab';

test('corrente divide a carga pelo intervalo de tempo', () => assert.equal(ELECTRIC.current.readouts(8)[1].value, '4 A'));
test('lei de Ohm reduz a corrente quando a resistência aumenta', () => assert.equal(ELECTRIC.resistor.readouts(6)[1].value, '2 A'));
test('lei dos nós mantém a corrente distribuída igual à entrada', () => assert.equal(ELECTRIC.kirchhoff.readouts(7)[2].value, '7 A = 2 A + 5 A'));
test('capacitor aumenta energia com o quadrado da tensão', () => assert.equal(ELECTRIC.capacitor.readouts(6)[1].value, '36 μJ'));
