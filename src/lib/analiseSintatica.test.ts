import test from 'node:test';
import assert from 'node:assert/strict';
import { FRASES, predicado, temSujeito, textoDaFrase, type Frase, type Funcao } from './analiseSintatica';

const conta = (f: Frase, fn: Funcao) => f.termos.filter((t) => t.funcao === fn).length;

test('toda frase tem exatamente um verbo', () => {
  for (const f of FRASES) assert.equal(conta(f, 'verbo'), 1, f.id);
});

test('os complementos batem com a transitividade', () => {
  for (const f of FRASES) {
    const od = conta(f, 'objeto direto'), oi = conta(f, 'objeto indireto'), pv = conta(f, 'predicativo do sujeito');
    const esperado = { VTD: [1, 0, 0], VTI: [0, 1, 0], VTDI: [1, 1, 0], VI: [0, 0, 0], VL: [0, 0, 1] }[f.transitividade];
    assert.deepEqual([od, oi, pv], esperado, f.id);
  }
});

test('objeto indireto começa por preposição; objeto direto, não', () => {
  const preposicoes = /^(a|ao|aos|à|às|de|do|da|dos|das|em|com|para|por)\b/i;
  for (const f of FRASES) for (const t of f.termos) {
    if (t.funcao === 'objeto indireto') assert.match(t.texto, preposicoes, `${f.id}: ${t.texto}`);
    if (t.funcao === 'objeto direto') assert.doesNotMatch(t.texto, preposicoes, `${f.id}: ${t.texto}`);
  }
});

test('verbo de ligação dá predicado nominal; os outros, verbal', () => {
  for (const f of FRASES) assert.equal(predicado(f), f.transitividade === 'VL' ? 'predicado nominal' : 'predicado verbal');
});

test('só o verbo de fenômeno da natureza fica sem sujeito', () => {
  for (const f of FRASES) assert.equal(temSujeito(f), f.id !== 'vi', f.id);
});

test('os termos recompõem a frase, com maiúscula e ponto', () => {
  assert.equal(textoDaFrase(FRASES[2]), 'O professor entregou os simulados aos alunos.');
  for (const f of FRASES) assert.match(textoDaFrase(f), /^[A-ZÁÉÍÓÚ].*\.$/);
});
