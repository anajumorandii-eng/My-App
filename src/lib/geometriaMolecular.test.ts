import test from 'node:test';
import assert from 'node:assert/strict';
import { MOLECULAS, ORDEM, anguloEntre, ehPolar } from './geometriaMolecular';

test('o ângulo entre ligações vizinhas é o dos livros em cada molécula', () => {
  for (const id of ORDEM) {
    const m = MOLECULAS[id];
    const [a, b] = m.ligacoes;
    assert.ok(Math.abs(anguloEntre(a, b) - m.anguloGraus) < 0.05, `${id}: ${anguloEntre(a, b)}° ≠ ${m.anguloGraus}°`);
  }
});

test('ligações iguais entre si: o ângulo vale para todo par (simetria da geometria)', () => {
  for (const id of ['BF3', 'CH4', 'NH3'] as const) {
    const m = MOLECULAS[id];
    for (let i = 0; i < m.ligacoes.length; i += 1) for (let j = i + 1; j < m.ligacoes.length; j += 1) {
      assert.ok(Math.abs(anguloEntre(m.ligacoes[i], m.ligacoes[j]) - m.anguloGraus) < 0.05, `${id} ${i}-${j}`);
    }
  }
});

test('a polaridade sai da soma dos vetores e bate com os livros', () => {
  assert.equal(ehPolar(MOLECULAS.CO2), false);
  assert.equal(ehPolar(MOLECULAS.BF3), false);
  assert.equal(ehPolar(MOLECULAS.CH4), false);
  assert.equal(ehPolar(MOLECULAS.NH3), true);
  assert.equal(ehPolar(MOLECULAS.H2O), true);
});

test('pares de elétrons ao redor do central: ligantes + não ligantes', () => {
  const nuvens = (id: keyof typeof MOLECULAS) => MOLECULAS[id].paresLigantes + MOLECULAS[id].paresNaoLigantes;
  assert.equal(nuvens('CO2'), 2);
  assert.equal(nuvens('BF3'), 3);
  // Quatro nuvens nas três de baixo: é o par livre que tira NH₃ e H₂O do tetraedro.
  assert.equal(nuvens('CH4'), 4);
  assert.equal(nuvens('NH3'), 4);
  assert.equal(nuvens('H2O'), 4);
  for (const id of ORDEM) assert.equal(MOLECULAS[id].ligacoes.length, MOLECULAS[id].paresLigantes);
});
