import { describe, expect, it } from 'vitest';
import { advanceSynthesis, newBaseOpacity } from './pcrAnimation';

describe('síntese desenhada na PCR', () => {
  it('termina com todos os 24 nucleotídeos novos visíveis em cada fita', () => {
    for (let order = 0; order < 24; order++) {
      expect(newBaseOpacity(0, order, 24)).toBe(0);
      expect(newBaseOpacity(1, order, 24)).toBe(1);
    }
  });

  it('revela primeiro a base junto ao primer, até alcançar a outra ponta', () => {
    expect(newBaseOpacity(.5, 0, 24)).toBe(1);
    expect(newBaseOpacity(.5, 11, 24)).toBe(1);
    expect(newBaseOpacity(.5, 12, 24)).toBe(0);
    expect(newBaseOpacity(.5, 23, 24)).toBe(0);
  });

  it('pausa manual congela a síntese e retomar continua do mesmo ponto', () => {
    expect(advanceSynthesis(.4, .05, true, false)).toBe(.4);
    expect(advanceSynthesis(.4, .05, false, false)).toBeCloseTo(.40525);
  });

  it('movimento reduzido apresenta o resultado completo', () => {
    expect(advanceSynthesis(.4, .05, false, true)).toBe(1);
    expect(advanceSynthesis(.4, .05, true, true)).toBe(1);
  });
});
