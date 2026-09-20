import { describe, expect, it } from 'vitest';
import { angleOfRefraction, OPTICS, sphericalImageDistance } from './opticsLab';

describe('laboratório de óptica', () => {
  it('conserva o ângulo no espelho plano', () => {
    expect(OPTICS['plane-mirror'].readouts(45)[1].value).toBe('45°');
  });

  it('aproxima o raio da normal ao entrar no vidro', () => {
    expect(angleOfRefraction(45)).toBeCloseTo(28.1, 1);
  });

  it('troca o sinal da imagem ao cruzar o foco do espelho', () => {
    expect(sphericalImageDistance(60)).toBeCloseTo(60);
    expect(sphericalImageDistance(20)).toBeCloseTo(-60);
    expect(sphericalImageDistance(30)).toBeNull();
  });
});
