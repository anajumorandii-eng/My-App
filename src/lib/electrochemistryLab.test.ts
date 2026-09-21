import assert from 'node:assert/strict';
import test from 'node:test';
import { ELECTROCHEMISTRY } from './electrochemistryLab';

test('oxidação e redução conservam o número de elétrons', () => {
  const values = ELECTROCHEMISTRY.redox.readouts(4);
  assert.equal(values[0].value, '4 mol e⁻ cedidos');
  assert.equal(values[1].value, '4 mol e⁻ recebidos');
});

test('pilha relaciona corrente e resistência pela tensão ideal', () => {
  assert.equal(ELECTROCHEMISTRY.cells.readouts(5)[1].value, '0,22 A');
});

test('ddp positiva identifica processo espontâneo', () => {
  const values = ELECTROCHEMISTRY.spontaneous.readouts(0.34);
  assert.equal(values[0].value, '1,10 V');
  assert.equal(values[1].value, 'espontâneo');
});

test('eletrólise só é sustentada acima da tensão de decomposição', () => {
  assert.equal(ELECTROCHEMISTRY.electrolysis.readouts(2)[1].value, 'não sustentada');
  assert.equal(ELECTROCHEMISTRY.electrolysis.readouts(3)[1].value, 'em curso');
});

test('lei de Faraday calcula massa de cobre a partir da carga', () => {
  const values = ELECTROCHEMISTRY.quantitative.readouts(30);
  assert.equal(values[0].value, '3600 C');
  assert.equal(values[1].value, '1,19 g');
});
