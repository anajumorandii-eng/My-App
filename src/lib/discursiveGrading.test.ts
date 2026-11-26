import { it } from 'node:test';
import assert from 'node:assert/strict';
import { errorLogsFromGrading, estimateScore, gradingProblems, missSummary, ratingFromScore, type ItemGrade } from './discursiveGrading.ts';

const items = (a: ItemGrade['checks'], b: ItemGrade['checks']): ItemGrade[] => [{ letter: 'a', checks: a }, { letter: 'b', checks: b }];

it('nota estimada: itens pesam igual e arredonda a meio ponto', () => {
  assert.equal(estimateScore(items([{ text: 'x', verdict: 'completo' }, { text: 'y', verdict: 'completo' }], [{ text: 'z', verdict: 'completo' }])), 4);
  // item a inteiro (2 pontos) + item b com metade dos critérios (1 ponto)
  assert.equal(estimateScore(items([{ text: 'x', verdict: 'completo' }], [{ text: 'y', verdict: 'completo' }, { text: 'z', verdict: 'faltou', where: 'calculation' }])), 3);
  // parcial vale meio critério: (0,5 + 1)/2 = 0,75 × 4 = 3
  assert.equal(estimateScore(items([{ text: 'x', verdict: 'parcial', where: 'concept_confusion' }], [{ text: 'y', verdict: 'completo' }])), 3);
  assert.equal(estimateScore([]), 0);
});

it('escala de autoavaliação a partir da nota', () => {
  assert.deepEqual([4, 3.5, 3, 2, 1.5, 0].map(ratingFromScore), ['forte', 'forte', 'mediano', 'mediano', 'fraco', 'fraco']);
});

it('exige dizer onde errou em todo critério que não saiu completo', () => {
  const graded = items([{ text: 'Nomeia o CO₂.', verdict: 'parcial' }], [{ text: 'y', verdict: 'completo' }]);
  assert.equal(gradingProblems(graded).length, 1);
  graded[0].checks[0].where = 'concept_confusion';
  assert.deepEqual(gradingProblems(graded), []);
});

it('vira um registro do Caderno por critério perdido, sem confiança de confirmado', () => {
  let n = 0;
  const logs = errorLogsFromGrading({ score: 2, items: items([{ text: 'x', verdict: 'completo' }], [{ text: 'Potência = 60 W.', verdict: 'faltou', where: 'calculation' }]) },
    { id: 'q', topicId: 't', board: 'Famerp', year: 2026, topic: 'Ciclo' }, '2026-11-26', () => `e${++n}`);
  assert.equal(logs.length, 1);
  assert.equal(logs[0].type, 'calculation');
  assert.equal(logs[0].confidence, 'media');
  assert.equal(logs[0].breakPoint, 'Potência = 60 W.');
  assert.match(logs[0].notes, /item b/);
});

it('resume onde ela mais perde ponto', () => {
  const g = (where: 'calculation' | 'insufficient_justification') => ({ grading: { score: 0, items: [{ letter: 'a', checks: [{ text: 'x', verdict: 'faltou' as const, where }] }] } });
  assert.deepEqual(missSummary([g('calculation'), g('calculation'), g('insufficient_justification'), {}]), [{ where: 'calculation', count: 2 }, { where: 'insufficient_justification', count: 1 }]);
});

it('lê a nota da correção por IA só nas formas válidas', async () => {
  const { parseAiScore } = await import('./discursiveGrading.ts');
  assert.equal(parseAiScore('Item a: ...\n**Nota estimada: 2,5 de 4**\n**Avaliação: Mediano**'), '2,5 de 4');
  assert.equal(parseAiScore('Nota estimada: 3/4'), '3 de 4');
  assert.equal(parseAiScore('**Nota estimada: 75%**'), '75%');
  assert.equal(parseAiScore('Nota estimada: 7 de 4'), null);
  assert.equal(parseAiScore('Nota estimada: 150%'), null);
  assert.equal(parseAiScore('sem nota'), null);
});

it('lê a marcação dos critérios que a IA devolve, descartando o que não valida', async () => {
  const { parseCriteriaVerdicts, criterionIds, stripCriteriaBlock } = await import('./discursiveGrading.ts');
  const ids = criterionIds([['x', 'y'], ['z']], ['a', 'b']);
  assert.deepEqual(ids, [['a1', 'a2'], ['b1']]);
  const text = 'Correção.\n**Nota estimada: 3 de 4**\n```json\n{"criterios":[{"id":"a1","veredito":"completo","onde":"calculation"},{"id":"a2","veredito":"parcial","onde":"concept_confusion"},{"id":"b1","veredito":"faltou","onde":"inventado"},{"id":"c9","veredito":"faltou"},{"id":"b1","veredito":"talvez"}]}\n```';
  assert.deepEqual(parseCriteriaVerdicts(text, ids.flat()), {
    a1: { verdict: 'completo' },
    a2: { verdict: 'parcial', where: 'concept_confusion' },
    b1: { verdict: 'faltou' },
  });
  assert.deepEqual(parseCriteriaVerdicts('```json\n{"criterios":[{"id":"a1","veredito":"faltou","onde":"toString"},{"id":"a2","veredito":"parcial","onde":"constructor"}]}\n```', ['a1', 'a2']), { a1: { verdict: 'faltou' }, a2: { verdict: 'parcial' } });
  assert.deepEqual(parseCriteriaVerdicts('sem bloco', ['a1']), {});
  assert.deepEqual(parseCriteriaVerdicts('```json\n{quebrado\n```', ['a1']), {});
  assert.equal(stripCriteriaBlock(text), 'Correção.\n**Nota estimada: 3 de 4**');
  // Durante o streaming o bloco ainda não fechou: também some do texto.
  assert.equal(stripCriteriaBlock('Texto\n```json\n{"crit'), 'Texto');
});

it('separa a resposta nota máxima do resto da correção', async () => {
  const { splitIdealAnswer } = await import('./discursiveGrading.ts');
  const text = 'Item a: ok.\n\n## Resposta nota máxima\n\na) Doença de Chagas.\nb) Fibrose.\n\n## Como chegar lá\n\n1. Leia o comando.\n\n**Nota estimada: 3,5 de 4**';
  const { ideal, rest } = splitIdealAnswer(text);
  assert.equal(ideal, 'a) Doença de Chagas.\nb) Fibrose.');
  assert.match(rest, /^Item a: ok\.\n\n## Como chegar lá/);
  assert.match(rest, /Nota estimada/);
  assert.doesNotMatch(rest, /Resposta nota máxima/);
  // Seção no fim, sem título depois: vai até a linha da nota.
  assert.equal(splitIdealAnswer('## Resposta nota máxima\nX.\n**Nota estimada: 4 de 4**').ideal, 'X.');
  assert.deepEqual(splitIdealAnswer('Sem seção.'), { ideal: null, rest: 'Sem seção.' });
});
