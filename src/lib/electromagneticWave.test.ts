import assert from 'node:assert/strict';
import { test } from 'node:test';
import { electromagneticWave } from './electromagneticWave';

test('campos transversais estão em fase e E×B aponta na propagação +x', () => {
  for (const x of [13, 40, 90, 170]) for (const phase of [0, .3, .8]) {
    const { electric: e, magnetic: b } = electromagneticWave(x, 2, phase, 40);
    assert.equal(e[0], 0); assert.equal(b[0], 0);
    assert.equal(e.reduce((sum, value, i) => sum + value * b[i], 0), 0);
    assert.equal(e[1], b[2]); assert.ok(e[1] * b[2] >= 0);
  }
});

test('mudar frequência conserva v=fλ; uma reprodução completa conserva o perfil', () => {
  for (const frequency of [1, 2, 3]) {
    const start = electromagneticWave(23, frequency, 0, 40);
    const finish = electromagneticWave(23, frequency, 1, 40);
    assert.equal(frequency * start.wavelength, 240);
    assert.ok(Math.abs(start.value - finish.value) < 1e-10);
  }
});
