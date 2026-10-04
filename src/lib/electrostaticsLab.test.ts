import assert from 'node:assert/strict';
import test from 'node:test';
import { ELECTRO } from './electrostaticsLab';
test('coulomb segue o inverso do quadrado da distância', () => assert.equal(ELECTRO.coulomb.readouts(3)[1].value, '4 F₀'));
test('campo uniforme converte deslocamento em potencial', () => assert.equal(ELECTRO['uniform-field'].readouts(3)[1].value, '12 V'));
test('a força elétrica escala com o campo', () => assert.equal(ELECTRO['charge-dynamics'].readouts(4)[1].value, '8 N'));
test('dinâmica declara massa e aceleração além da força', () => {
  assert.deepEqual(ELECTRO['charge-dynamics'].readouts(10).slice(2), [{ label: 'Massa', value: '2 kg' }, { label: 'Aceleração', value: '10 m/s²' }]);
});
test('potencial distingue energia da carga de prova e trabalho desde r=4', () => {
  assert.equal(ELECTRO.potential.readouts(8).find(item => item.label === 'Energia potencial')?.value, '6 U₀');
  assert.equal(ELECTRO.potential.readouts(8).find(item => item.label === 'Trabalho do campo (4 → r)')?.value, '6 U₀');
});
