import assert from 'node:assert/strict';
import test from 'node:test';
import { ENGLISH_INSTRUMENTS, englishInstrumentState } from './englishInstrumentLab';

test('cada instrumento oferece três contrastes linguísticos completos', () => {
  for (const config of Object.values(ENGLISH_INSTRUMENTS)) {
    assert.equal(config.states.length, 3);
    assert.ok(config.states.every(state => state.example && state.reading && state.trap));
  }
});

test('seleção limita o índice às estruturas existentes', () => {
  assert.equal(englishInstrumentState('modal-certainty', -2).label, 'might');
  assert.equal(englishInstrumentState('modal-certainty', 1).label, 'is expected to');
  assert.equal(englishInstrumentState('modal-certainty', 9).label, 'will');
});

test('conectores preservam a direção lógica entre causa e efeito', () => {
  assert.deepEqual(ENGLISH_INSTRUMENTS['cause-connectors'].states.map(state => state.reading), [
    'efeito because causa', 'causa; therefore, efeito', 'efeito as a result of causa',
  ]);
});

const themedDecisions = [
  ['poetry-reading', 'repetição', 'Still'],
  ['quantity-language', 'teto', 'kcal'],
  ['modal-certainty', 'possibilidade', 'Aftershocks'],
  ['hurricane-forecast', 'previsão', 'storm surge'],
  ['cause-connectors', 'causa', 'heat'],
  ['pollution-connectors', 'maioria', 'plastic'],
  ['research-claims', 'associação', 'memory'],
  ['warming-evidence', 'tendência', 'climate'],
  ['narrative-inference', 'sentimento', 'She'],
  ['bacteria-context', 'categoria', 'bacteria'],
  ['comparison-signals', 'diferença', 'virus'],
  ['stance-language', 'relatado', 'Women'],
  ['empowerment-language', 'necessária', 'education'],
  ['digital-conditions', 'benefício', 'Remote work'],
  ['probiotic-evidence', 'cepa', 'strain'],
  ['stem-cell-trials', 'potencial', 'Stem cells'],
  ['taxonomy-hierarchy', 'subconjunto', 'reptiles'],
] as const;

test('cada capítulo LG2 tem evidência temática e uma decisão interpretativa própria', () => {
  for (const [id, decision, vocabulary] of themedDecisions) {
    const config = ENGLISH_INSTRUMENTS[id as keyof typeof ENGLISH_INSTRUMENTS];
    assert.ok(config, `Configuração temática ausente: ${id}`);
    assert.match(config.states[0].example, new RegExp(vocabulary, 'i'));
    assert.match(config.states[0].reading, new RegExp(decision, 'i'));
    for (const state of config.states) {
      assert.ok(state.evidence?.length, `${id}: destaque textual ausente`);
      assert.ok(state.evidence.every(clue => state.example.includes(clue)), `${id}: evidência fora do trecho`);
      assert.ok(state.annotation, `${id}: achado ausente`);
      assert.ok(state.diagnosis, `${id}: diagnóstico ausente`);
    }
  }
});

test('regressões recusam exemplos transplantados entre domínios', () => {
  for (const id of ['hurricane-forecast', 'stem-cell-trials', 'warming-evidence', 'probiotic-evidence', 'digital-conditions', 'taxonomy-hierarchy'] as const) {
    const config = ENGLISH_INSTRUMENTS[id as keyof typeof ENGLISH_INSTRUMENTS];
    assert.ok(config, id);
    assert.doesNotMatch(JSON.stringify(config), /quake|aftershock|poor sleep|memory problems|pathogen|Maya|bus/i);
  }
});

test('Taxonomy permite inclusão sem converter subconjunto em equivalência', () => {
  const config = ENGLISH_INSTRUMENTS['taxonomy-hierarchy' as keyof typeof ENGLISH_INSTRUMENTS];
  assert.ok(config, 'hierarquia taxonômica ausente');
  assert.match(config.states[0].reading, /subconjunto/);
  assert.match(config.states[1].trap, /todos os vertebrados/);
  assert.match(config.states[2].reading, /exemplo/);
});

test('o achado do teto calórico aponta do limite para valores menores', () => {
  const state = ENGLISH_INSTRUMENTS['quantity-language'].states[0];
  assert.match(state.annotation, /parte do limite de 300.*valores menores/);
  assert.match(state.reading, /máximo 300/);
});
