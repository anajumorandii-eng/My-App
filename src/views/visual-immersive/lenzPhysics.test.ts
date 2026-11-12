import { describe, expect, it } from 'vitest';
import { FAR, NEAR, PASS, facingPole, flux, inducedCurrent, inducedFieldDirection, magnetAt, motionFor, stillMagnet } from './lenzPhysics';

describe('física da cena de Lenz', () => {
  it('o fluxo cresce quando o polo norte chega perto da espira', () => {
    expect(flux(NEAR)).toBeGreaterThan(flux((FAR + NEAR) / 2));
    expect(flux((FAR + NEAR) / 2)).toBeGreaterThan(flux(FAR));
  });

  it('aproximar induz corrente anti-horária e campo de volta para o ímã: a face vira norte e repele', () => {
    const { x, v } = magnetAt('aproximando', PASS * .5);
    const i = inducedCurrent(x, v);
    expect(i).toBeGreaterThan(0);
    expect(inducedFieldDirection(i)).toBe(-1);
    expect(facingPole(i)).toBe('N');
  });

  it('afastar inverte tudo: corrente horária, campo a favor do ímã, face sul que atrai', () => {
    const { x, v } = magnetAt('afastando', PASS * .5);
    const i = inducedCurrent(x, v);
    expect(i).toBeLessThan(0);
    expect(inducedFieldDirection(i)).toBe(1);
    expect(facingPole(i)).toBe('S');
  });

  // É a pegadinha do capítulo: fluxo máximo não é corrente máxima.
  it('ímã parado não induz corrente, nem com o fluxo no máximo', () => {
    const parado = magnetAt('parado', 3);
    expect(flux(parado.x)).toBe(flux(NEAR));
    expect(flux(parado.x)).toBeGreaterThan(flux(FAR) * 5);
    expect(inducedCurrent(parado.x, parado.v)).toBe(0);
    expect(facingPole(0)).toBeNull();
    expect(inducedCurrent(FAR, 0)).toBe(0);
  });

  it('no vaivém a corrente troca de sentido junto com a velocidade', () => {
    const indo = magnetAt('vaivem', .4), voltando = magnetAt('vaivem', 2.9);
    expect(indo.v).toBeGreaterThan(0);
    expect(voltando.v).toBeLessThan(0);
    expect(inducedCurrent(indo.x, indo.v)).toBeGreaterThan(0);
    expect(inducedCurrent(voltando.x, voltando.v)).toBeLessThan(0);
  });

  it('a passada some antes de recomeçar, em vez de deixar o ímã parado na ponta', () => {
    expect(magnetAt('aproximando', PASS * .999).alpha).toBeLessThan(.1);
    expect(magnetAt('aproximando', PASS * .5).alpha).toBe(1);
  });

  it('o quadro parado de aproximar e afastar ainda tem velocidade, para a corrente aparecer', () => {
    expect(stillMagnet('aproximando').v).toBeGreaterThan(0);
    expect(stillMagnet('afastando').v).toBeLessThan(0);
    expect(stillMagnet('aproximando').alpha).toBe(1);
  });

  it('cada etapa tem o seu movimento, e a última depende do cenário', () => {
    expect([0, 1, 2, 3].map(phase => motionFor(phase, true))).toEqual(['longe', 'aproximando', 'aproximando', 'afastando']);
    expect(motionFor(4, true)).toBe('vaivem');
    expect(motionFor(4, false)).toBe('parado');
  });
});
