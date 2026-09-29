import test from 'node:test';
import assert from 'node:assert/strict';
import { ANO_ATUAL, PERIODOS, fracao, periodoDoAno } from './periodosDoBrasil';

test('os períodos são contíguos: o fim de um é o começo do seguinte', () => {
  for (let i = 1; i < PERIODOS.length; i += 1) {
    assert.equal(PERIODOS[i].inicio, PERIODOS[i - 1].fim, PERIODOS[i].id);
    assert.equal(PERIODOS[i].abertura, PERIODOS[i - 1].fechamento, PERIODOS[i].id);
  }
  assert.equal(PERIODOS[0].inicio, 1500);
  assert.equal(PERIODOS.at(-1)!.fim, ANO_ATUAL);
});

test('as frações somam a história inteira, e a Colônia passa da metade', () => {
  const soma = PERIODOS.reduce((s, p) => s + fracao(p), 0);
  assert.ok(Math.abs(soma - 1) < 1e-12);
  assert.ok(fracao(PERIODOS[0]) > 0.5);
});

test('todo marco cai dentro do seu período', () => {
  for (const p of PERIODOS) for (const m of p.marcos) {
    assert.ok(m.ano > p.inicio && m.ano < p.fim, `${p.id}: ${m.ano}`);
  }
});

test('periodoDoAno: o ano de virada já é do período novo', () => {
  assert.equal(periodoDoAno(1822).id, 'imperio');
  assert.equal(periodoDoAno(1821).id, 'colonia');
  assert.equal(periodoDoAno(1937).id, 'era-vargas');
  assert.equal(periodoDoAno(2026).id, 'nova-republica');
});
