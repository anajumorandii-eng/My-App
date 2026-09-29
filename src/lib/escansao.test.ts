import test from 'node:test';
import assert from 'node:assert/strict';
import { TEXTO_DO_VERSO, VERSOS, metro, silabasGramaticais } from './escansao';

const semAcento = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
const letras = (s: string) => semAcento(s).toLowerCase().replace(/[^a-z]/g, '');

test('as sílabas recompõem o verso escrito, letra por letra', () => {
  for (const v of VERSOS) {
    assert.equal(letras(v.silabas.join('') + v.sobra), letras(TEXTO_DO_VERSO[v.id]), v.id);
  }
});

test('a última tônica é a última sílaba contada', () => {
  for (const v of VERSOS) assert.equal(v.tonicas.at(-1), v.silabas.length, v.id);
});

test('metros: redondilhas e decassílabo heroico (tônicas na 6ª e na 10ª)', () => {
  const nomes = Object.fromEntries(VERSOS.map((v) => [v.id, metro(v)]));
  assert.deepEqual(nomes, {
    'i-juca': 'redondilha menor',
    exilio: 'redondilha maior',
    amor: 'decassílabo heroico',
    lacio: 'decassílabo heroico',
  });
});

test('a elisão é o que separa a contagem poética da gramatical', () => {
  const amor = VERSOS.find((v) => v.id === 'amor')!;
  // A-mor-é-fo-go-que-ar-de-sem-se-ver: 11 gramaticais, 10 poéticas.
  assert.equal(silabasGramaticais(amor), 11);
  assert.equal(amor.silabas.length, 10);
});
