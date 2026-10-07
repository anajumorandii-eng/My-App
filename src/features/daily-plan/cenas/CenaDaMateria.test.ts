import { describe, expect, it } from 'vitest';
import { CENAS_POR_MATERIA, temCena } from './CenaDaMateria';

/** As doze abas do Hoje, na ordem em que aparecem. */
const ABAS_DO_HOJE = [
  'Física', 'Matemática', 'Biologia', 'Química', 'História', 'Geografia',
  'Português', 'Literatura', 'Redação', 'Filosofia', 'Sociologia', 'Atualidades',
];

describe('registro de cenas por matéria', () => {
  it('toda aba do Hoje tem laboratório, qualquer que seja o tópico do dia', () => {
    // Por tópico, só a aba de Física mostrava cena: "Evolução" e
    // "Estequiometria" não são DNA nem molécula. A Ana Júlia escolheu o
    // laboratório fixo da matéria, e depois pediu o das outras oito.
    expect(Object.keys(CENAS_POR_MATERIA).sort()).toEqual([...ABAS_DO_HOJE].sort());
    for (const m of ABAS_DO_HOJE) expect(temCena(m), m).toBe(true);
  });

  it('matéria fora das abas usa a reserva da tela', () => {
    expect(temCena('Inglês')).toBe(false);
    expect(temCena(undefined)).toBe(false);
  });
});
