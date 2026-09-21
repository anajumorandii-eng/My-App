import assert from 'node:assert/strict';
import test from 'node:test';
import { GRAMMAR_INSTRUMENTS, agreementCase, commaReading, crasisCase, nounPhrase, voiceCase } from './grammarInstrumentLab.ts';

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

test('rodada de maximização de cobertura: cada instrumento novo distingue suas três leituras', () => {
  const ids = [
    'language-system', 'noun-class', 'text-type', 'adverb-circumstance', 'verb-syntax', 'implicit-meaning',
    'discourse-type', 'clause-punctuation', 'lexical-context', 'government', 'word-formation', 'nominal-function',
    'subject-type', 'noun-clause', 'adjective-clause', 'adverbial-clause',
  ] as const;
  for (const id of ids) {
    const config = GRAMMAR_INSTRUMENTS[id];
    const readings = [0, 1, 2].map((v) => config.readouts(v).find((r) => r.pivot)?.value ?? config.readouts(v)[0].value);
    assert.equal(new Set(readings).size, 3, `${id} precisa de três frases distintas`);
  }
});

test('verbo e sintaxe da oração distingue transitividade, não tempo/aspecto (capítulo diferente de "verbo")', () => {
  const readouts = GRAMMAR_INSTRUMENTS['verb-syntax'].readouts(1);
  assert.match(readouts[0].value, /encontrou o livro/);
});

test('regência mostra a preposição exigida pelo verbo, não pela palavra feminina (diferença de crase)', () => {
  assert.equal(GRAMMAR_INSTRUMENTS.government.readouts(2)[1].value, 'de');
});
