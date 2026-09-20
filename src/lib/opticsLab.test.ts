import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { angleOfRefraction, OPTICS, sphericalImageDistance } from './opticsLab';

describe('laboratório de óptica', () => {
  it('conserva o ângulo no espelho plano', () => {
    assert.equal(OPTICS['plane-mirror'].readouts(45)[1].value, '45°');
  });

  it('aproxima o raio da normal ao entrar no vidro', () => {
    assert.ok(Math.abs(angleOfRefraction(45) - 28.1) < 0.05);
  });

  it('troca o sinal da imagem ao cruzar o foco do espelho', () => {
    assert.ok(Math.abs((sphericalImageDistance(60) ?? 0) - 60) < 0.005);
    assert.ok(Math.abs((sphericalImageDistance(20) ?? 0) + 60) < 0.005);
    assert.equal(sphericalImageDistance(30), null);
  });
});
