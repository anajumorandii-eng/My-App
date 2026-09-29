import test from 'node:test';
import assert from 'node:assert/strict';
import { INCLINACAO, alturaAoMeioDia, declinacao, diaDoAno, duracaoDoDia, escreverDia, escreverHoras, estacaoNoSul } from './estacoesDoAno';

const perto = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;

test('declinação: zero nos equinócios, ±23,44° nos solstícios', () => {
  assert.ok(perto(declinacao(355), -INCLINACAO, 0.05)); // 21 dez
  assert.ok(perto(declinacao(172), INCLINACAO, 0.1)); // 21 jun
  assert.ok(perto(declinacao(81), 0, 0.5)); // 22 mar
  assert.ok(perto(declinacao(265), 0, 1)); // 22 set
});

test('no equinócio o dia tem 12 horas em qualquer latitude', () => {
  for (const lat of [-3.12, -23.55, -30.03, 45]) assert.ok(perto(duracaoDoDia(lat, 81), 12, 0.1), String(lat));
});

test('no Equador o dia tem 12 horas o ano inteiro', () => {
  for (const d of [1, 100, 172, 300, 355]) assert.ok(perto(duracaoDoDia(0, d), 12, 1e-9));
});

test('solstício de dezembro em São Paulo: Sol quase a pino e dia mais longo', () => {
  assert.ok(alturaAoMeioDia(-23.55, 355) > 89.8);
  const dez = duracaoDoDia(-23.55, 355), jun = duracaoDoDia(-23.55, 172);
  assert.ok(perto(dez, 13.4, 0.1), String(dez));
  assert.ok(perto(jun, 24 - dez, 0.1), 'dezembro e junho se espelham');
  // Mais ao sul, a diferença entre verão e inverno cresce.
  assert.ok(duracaoDoDia(-30.03, 355) > dez);
});

test('estação no hemisfério sul', () => {
  assert.equal(estacaoNoSul(10), 'verão');
  assert.equal(estacaoNoSul(172), 'inverno');
  assert.equal(estacaoNoSul(300), 'primavera');
  assert.equal(estacaoNoSul(100), 'outono');
});

test('escrita de datas e horas', () => {
  assert.equal(escreverDia(172), '21 jun');
  assert.equal(escreverDia(1), '1 jan');
  assert.equal(escreverDia(365), '31 dez');
  assert.equal(diaDoAno(new Date(2026, 8, 29)), 272);
  // Ano bissexto: 29/2 conta como 28/2, e o resto do ano não anda um dia.
  assert.equal(diaDoAno(new Date(2028, 1, 29)), 59);
  assert.equal(escreverDia(diaDoAno(new Date(2028, 2, 1))), '1 mar');
  assert.equal(diaDoAno(new Date(2028, 11, 30)), 364);
  assert.equal(diaDoAno(new Date(2028, 11, 31)), 365);
  assert.equal(escreverHoras(13.42), '13 h 25 min');
  assert.equal(escreverHoras(11.999), '12 h 00 min');
});
