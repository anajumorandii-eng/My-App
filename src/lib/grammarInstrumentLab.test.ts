import assert from 'node:assert/strict';
import test from 'node:test';
import { agreementCase, commaReading, crasisCase, nounPhrase, voiceCase } from './grammarInstrumentLab.ts';

test('sintagma preserva o substantivo como núcleo ao ganhar satélites', () => {
  assert.deepEqual(nounPhrase(0), ['propostas']);
  assert.deepEqual(nounPhrase(3), ['as', 'duas', 'propostas', 'urgentes']);
});
test('concordância distingue sujeito, impessoalidade e passiva sintética', () => {
  assert.equal(agreementCase(0).predicate, 'chegaram cedo');
  assert.equal(agreementCase(1).predicate, 'havia estudantes');
  assert.equal(agreementCase(2).predicate, 'vendem-se');
});
test('par de vírgulas altera o alcance da oração adjetiva', () => {
  assert.equal(commaReading(false).scope, 'somente os que estudaram');
  assert.equal(commaReading(true).scope, 'todos os alunos');
});
test('crase depende da fusão, não apenas de palavra feminina', () => {
  assert.equal(crasisCase(0).result, 'à');
  assert.equal(crasisCase(1).result, 'a');
});
test('voz passiva pode preservar ou ocultar o agente', () => {
  assert.equal(voiceCase(1).agent, 'professor');
  assert.equal(voiceCase(2).agent, 'não informado');
});
