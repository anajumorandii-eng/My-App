import test from 'node:test';
import assert from 'node:assert/strict';
import { DNA_B, MOLDE, codonDoPar, codons, geometriaDoPar, parNaPosicao, rnaMensageiro } from './duplaHelice';

test('medidas do DNA-B: 10 pares por volta × 0,34 nm = passo de 3,4 nm', () => {
  assert.ok(Math.abs(DNA_B.paresPorVolta * DNA_B.subidaPorParNm - DNA_B.passoNm) < 1e-9);
  const volta = geometriaDoPar(DNA_B.paresPorVolta);
  assert.ok(Math.abs(volta.angulo - 2 * Math.PI) < 1e-9);
  assert.ok(Math.abs(volta.alturaNm - DNA_B.passoNm) < 1e-9);
});

test('pareamento: A–T e C–G no DNA, U no lugar de T no RNA; 2 pontes em A–T, 3 em C–G', () => {
  for (let i = 0; i < MOLDE.length; i += 1) {
    const par = parNaPosicao(i);
    const esperado = { A: 'T', T: 'A', C: 'G', G: 'C' }[par.molde];
    assert.equal(par.complementar, esperado);
    assert.equal(par.rna, esperado === 'T' ? 'U' : esperado);
    assert.equal(par.pontesDeHidrogenio, par.molde === 'A' || par.molde === 'T' ? 2 : 3);
  }
});

test('transcrição e tradução: molde TAC GGC AAA ATT → AUG CCG UUU UAA → Met, Pro, Phe, fim', () => {
  assert.equal(rnaMensageiro().join(''), 'AUGCCGUUUUAA');
  assert.deepEqual(codons().map((c) => c.trinca), ['AUG', 'CCG', 'UUU', 'UAA']);
  assert.match(codons()[0].significado, /metionina/);
  assert.match(codons()[3].significado, /fim/);
  assert.equal(codonDoPar(4).trinca, 'CCG');
});

test('posição fora da sequência é presa às pontas', () => {
  assert.equal(parNaPosicao(-3).indice, 0);
  assert.equal(parNaPosicao(99).indice, MOLDE.length - 1);
});
