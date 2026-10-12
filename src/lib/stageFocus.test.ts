import assert from 'node:assert/strict';
import test from 'node:test';
import { interactiveSummaries } from '../data/interactiveSummaries';
import { buildVisualMap } from './visualStudy';
import {
  caseForStep, casesRevealing, focusScore, focusTerms, hiddenRelations, parameterFromText, planStageFocus, sentenceWith,
} from './stageFocus';

const geometria = interactiveSummaries.find((summary) => summary.id === 'summary-quimica-geometria-molecular')!;
const casos = ['Linear', 'Trigonal plana', 'Angular (SO2)', 'Tetraédrica', 'Piramidal trigonal', 'Angular (H2O)'].map((label) => ({ label, section: 'As geometrias mais comuns' }));

test('termos: fórmula com subscrito vira a mesma chave do texto e palavra vazia some', () => {
  assert.deepEqual(focusTerms('Angular (H₂O)'), ['angular', 'h2o']);
  assert.deepEqual(focusTerms('1. Glicólise'), ['glicolis']);
  assert.ok(!focusTerms('Etapa da rota').includes('etapa'));
});

test('"angular" não casa com "ângulos": a raiz não pode ser curta demais', () => {
  assert.equal(focusScore({ label: 'Angular (SO2)' }, 'os ângulos de ligação ficam comprimidos'), 0);
  assert.equal(focusScore({ label: 'Angular (SO2)' }, 'a geometria angular do SO₂'), 1 + 2);
});

test('plural e -ções casam com o singular', () => {
  assert.ok(focusScore({ label: 'Transformação' }, 'as transformações químicas') > 0);
  assert.ok(focusScore({ label: 'Alcalinos' }, 'o metal alcalino reage') > 0);
});

test('Geometria Molecular: cada etapa abre a molécula que a seção dela discute', () => {
  const plan = planStageFocus(casos, geometria.sections);
  const top = plan.byStep.map((focus) => (focus[0] === undefined ? null : casos[focus[0]].label));
  // "Por que isso importa" é a polaridade da água; "Pegadinhas", o CO2 apolar
  // de ligações polares; "Pratique", o metano comparado à amônia.
  assert.equal(top[2], 'Angular (H2O)');
  assert.equal(top[3], 'Linear');
  assert.equal(top[4], 'Tetraédrica');
  assert.ok(plan.byStep[4].includes(casos.findIndex((c) => c.label === 'Piramidal trigonal')));
  // A teoria da repulsão não cita molécula nenhuma: a etapa não força um caso,
  // e a cena fica na molécula em que estava.
  assert.deepEqual(plan.byStep[0], []);
  assert.equal(caseForStep(plan, 0, 4), null);
});

test('caso que nenhuma seção cita mora na seção de onde veio', () => {
  const plan = planStageFocus([{ label: 'Inexistente', section: 'B' }], [{ title: 'A', content: 'x' }, { title: 'B', content: 'y' }]);
  assert.deepEqual(plan.homeStep, [1]);
  assert.deepEqual(plan.byStep, [[], [0]]);
});

test('Reconstruir cobre o caso que entregaria a relação oculta, não todos', () => {
  const map = buildVisualMap(geometria);
  const ocultas = hiddenRelations(map.relations, map.edges, [map.edges[1].id]);
  assert.deepEqual(ocultas.map((r) => r.label), ['o CO2 e linear']);
  const itens = [{ label: 'Linear', claim: 'dois pares ligantes, ângulo de 180° (CO2)' }, { label: 'Tetraédrica', claim: '109,5° (CH4)' }];
  assert.deepEqual(casesRevealing(itens, ocultas), [0]);
});

test('parâmetro do texto: só número com a unidade do controle, na faixa e na grade', () => {
  const massa = { min: 18, max: 180, step: 18, unit: 'g' };
  assert.equal(parameterFromText('a massa molar da água é 18 g/mol', massa), null);
  assert.equal(parameterFromText('uma amostra de 36 g de água', massa), 36);
  assert.equal(parameterFromText('uma amostra de 40 g', massa), null);
  const temperatura = { min: 200, max: 600, step: 10, unit: 'K' };
  assert.equal(parameterFromText('a 27°C (300 K) ocupando 5 litros', temperatura), 300);
  assert.equal(parameterFromText('a 1000 K', temperatura), null);
  assert.equal(parameterFromText('pKa de 4', { min: 1, max: 7, step: 1, unit: '', control: 'pKa' }), 4);
});

test('a frase que explica um ponto é a que traz o termo como assunto', () => {
  const texto = 'Os pares de elétrons (sejam ligantes, sejam pares isolados) se repelem. Pares isolados exercem repulsão mais forte.';
  assert.equal(sentenceWith(texto, ['pares isolados']), 'Pares isolados exercem repulsão mais forte.');
  assert.equal(sentenceWith(texto, ['inexistente']), null);
});
