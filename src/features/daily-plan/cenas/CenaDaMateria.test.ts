import { describe, expect, it } from 'vitest';
import { CENAS_POR_MATERIA, temCena } from './CenaDaMateria';

describe('registro de cenas por matéria', () => {
  it('toda matéria com laboratório tem cena, qualquer que seja o tópico do dia', () => {
    // Por tópico, só a aba de Física mostrava cena: "Evolução" e
    // "Estequiometria" não são DNA nem molécula. A Ana Júlia escolheu o
    // laboratório fixo da matéria.
    expect(Object.keys(CENAS_POR_MATERIA).sort()).toEqual(['Biologia', 'Física', 'Química']);
    expect(temCena('Biologia')).toBe(true);
    expect(temCena('Química')).toBe(true);
  });

  it('matéria sem laboratório fica com o Núcleo', () => {
    expect(temCena('História')).toBe(false);
    expect(temCena(undefined)).toBe(false);
  });
});
