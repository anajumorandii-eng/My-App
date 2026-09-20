import { describe, expect, it } from 'vitest';
import { MAGNETISM } from './magnetismLab';

describe('laboratório de magnetismo', () => {
  it('aumenta o campo relativo ao aumentar a corrente no fio', () => {
    expect(MAGNETISM['fio-espira'].readouts(8)[1].value).toBe('4 u.a.');
  });
  it('zera a força de uma carga que segue paralela ao campo', () => {
    expect(MAGNETISM['carga-em-b'].readouts(0)[1].value).toBe('0 N');
  });
  it('a fem induzida cresce quando a variação do fluxo é mais rápida', () => {
    expect(MAGNETISM.lenz.readouts(.5)[1].value).toBe('4 V');
    expect(MAGNETISM.lenz.readouts(1)[1].value).toBe('2 V');
  });
  it('liga velocidade angular à fem máxima do gerador', () => {
    expect(MAGNETISM.gerador.readouts(10)[1].value).toBe('4 V');
  });
});
