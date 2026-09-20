import assert from 'node:assert/strict';
import test from 'node:test';
import { ELECTRO } from './electrostaticsLab';
test('coulomb segue o inverso do quadrado da distância', () => assert.equal(ELECTRO.coulomb.readouts(3)[1].value, '4 F₀'));
test('campo uniforme converte deslocamento em potencial', () => assert.equal(ELECTRO['uniform-field'].readouts(3)[1].value, '12 V'));
test('a força elétrica escala com o campo', () => assert.equal(ELECTRO['charge-dynamics'].readouts(4)[1].value, '8 N'));
