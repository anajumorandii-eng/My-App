import { describe, expect, it } from 'vitest';
import { MOLECULAS, anguloEntre, ehPolar, momentoResultante } from '../../lib/geometriaMolecular';
import { ESTAGIOS, SEQUENCIA, dipoloResultante, ligacoesDe } from './vseprStages';

describe('estágios da cena de geometria molecular', () => {
  it('reproduz o ângulo de ligação de cada molécula (o livro arredonda o tetraedro para 109,5°)', () => {
    for (const id of SEQUENCIA) {
      const ligacoes = ligacoesDe(ESTAGIOS[id]);
      for (let i = 0; i < ligacoes.length; i++) for (let j = i + 1; j < ligacoes.length; j++) {
        expect(anguloEntre(ligacoes[i], ligacoes[j]), `${id} ${i}-${j}`).toBeCloseTo(MOLECULAS[id].anguloGraus, 0);
      }
    }
  });

  it('tem tantas ligações e pares livres quanto a molécula', () => {
    for (const id of SEQUENCIA) {
      const { nuvens } = ESTAGIOS[id];
      expect(nuvens.filter(n => n.tipo === 'ligacao')).toHaveLength(MOLECULAS[id].ligacoes.length);
      expect(nuvens.filter(n => n.tipo === 'par')).toHaveLength(MOLECULAS[id].paresNaoLigantes);
    }
  });

  it('usa direções unitárias', () => {
    for (const id of SEQUENCIA) for (const n of ESTAGIOS[id].nuvens) expect(Math.hypot(...n.direcao)).toBeCloseTo(1, 6);
  });

  it('soma das ligações concorda com a polaridade calculada na biblioteca', () => {
    for (const id of SEQUENCIA) {
      const s = ligacoesDe(ESTAGIOS[id]).reduce((a, v) => [a[0] + v[0], a[1] + v[1], a[2] + v[2]], [0, 0, 0]);
      expect(Math.hypot(s[0], s[1], s[2])).toBeCloseTo(momentoResultante(MOLECULAS[id]), 2);
      expect(dipoloResultante(ESTAGIOS[id]) !== null).toBe(ehPolar(MOLECULAS[id]));
    }
  });

  it('na água o dipolo aponta para o lado dos pares livres, longe dos hidrogênios', () => {
    const d = dipoloResultante(ESTAGIOS.H2O)!;
    for (const h of ligacoesDe(ESTAGIOS.H2O)) expect(anguloEntre(d, h)).toBeGreaterThan(90);
    for (const n of ESTAGIOS.H2O.nuvens.filter(x => x.tipo === 'par')) expect(anguloEntre(d, n.direcao)).toBeLessThan(90);
  });

  it('os pares livres da água ficam afastados das ligações e um do outro', () => {
    const { nuvens } = ESTAGIOS.H2O;
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) expect(anguloEntre(nuvens[i].direcao, nuvens[j].direcao)).toBeGreaterThan(100);
  });
});
