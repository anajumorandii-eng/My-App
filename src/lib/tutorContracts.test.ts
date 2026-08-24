import assert from 'node:assert/strict';
import test from 'node:test';
import { parseContentExplanation, parseAnswerCorrection } from './tutorContracts';

test('parseContentExplanation lê os 6 campos de um JSON válido', () => {
  const raw = JSON.stringify({
    intuicao: 'Sons agudos se aproximam, graves se afastam.',
    conceito: 'Efeito Doppler: variação da frequência percebida por movimento relativo entre fonte e observador.',
    aplicacao: 'Sirene de ambulância mudando de tom ao passar.',
    comoCai: 'Costuma aparecer em questões de física ondulatória com cálculo de frequência percebida.',
    pegadinha: 'Confundir a fórmula para fonte se aproximando com fonte se afastando.',
    checagem: 'O que acontece com a frequência percebida se a fonte se afasta do observador?',
  });
  const result = parseContentExplanation(raw);

  assert.match(result.intuicao, /Sons agudos/);
  assert.match(result.checagem, /frequência percebida/);
});

test('parseContentExplanation não quebra com texto sem JSON', () => {
  const result = parseContentExplanation('Resposta livre sem chaves nenhuma.');
  assert.match(result.conceito, /Resposta livre/);
  assert.match(result.intuicao, /não retornou/);
});

test('parseAnswerCorrection lê os 6 campos, incluindo padraoRecorrente null', () => {
  const raw = JSON.stringify({
    acertos: 'Identificou corretamente a massa e a força.',
    rupturaPoint: 'Somou força e massa em vez de dividir força por massa.',
    porque: 'A Segunda Lei de Newton é F = m·a, então a = F/m, não F+m.',
    correcaoMinima: 'Trocar a soma pela divisão.',
    respostaModelo: 'a = F/m = 10/2 = 5 m/s².',
    padraoRecorrente: null,
  });
  const result = parseAnswerCorrection(raw);

  assert.match(result.rupturaPoint, /Somou força e massa/);
  assert.equal(result.padraoRecorrente, null);
});

test('parseAnswerCorrection preserva um padraoRecorrente textual quando presente', () => {
  const raw = JSON.stringify({
    acertos: 'x', rupturaPoint: 'x', porque: 'x', correcaoMinima: 'x', respostaModelo: 'x',
    padraoRecorrente: 'Já é a terceira vez que troca soma por divisão em fórmulas físicas.',
  });
  const result = parseAnswerCorrection(raw);
  assert.match(result.padraoRecorrente ?? '', /terceira vez/);
});

test('parseAnswerCorrection não quebra com JSON malformado', () => {
  const result = parseAnswerCorrection('{ isso não é json válido');
  assert.equal(result.padraoRecorrente, null);
  assert.match(result.respostaModelo, /não é json válido/);
});
