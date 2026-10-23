import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { hasCorruptedApostilaText } from './apostilaTextQuality';
test('detecta o OCR corrompido mostrado no recorte AS1', () => {
  assert.equal(hasCorruptedApostilaText('q\nDq MO NKrAO < 80 > * oBãs:\nPBOGAX'), true);
  assert.equal(hasCorruptedApostilaText('| Open Save Rec Play exe Prefs\nCAPÍTULO\n43 Ângulos em polígonos'), true);
  assert.equal(hasCorruptedApostilaText('Open\nSave Rec\nPlay Prefs'), true);
});
test('preserva prosa, fórmulas e inglês legítimos', () => {
  for (const text of ['A soma dos ângulos internos é (n−2)·180°.', 'Use $A=\\frac{bh}{2}$.', 'Open the book and save your answer.', 'A segregação envolve separação dos alelos.']) {
    assert.equal(hasCorruptedApostilaText(text), false);
  }
});
