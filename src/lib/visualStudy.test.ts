import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildVisualMap, chooseHiddenRelations, explainRelation, foldAnswer, gradeReconstruction,
  matchesRelation, minimalIntervention, nodeState, relationConfidence, relationEvidence,
  relationState, NODE_STATE_RANK,
} from './visualStudy';
import type { InteractiveSummary, RetrievalAttempt, SummaryProgress } from '../types/summary';

const STAGES = ['intuicao', 'conceito', 'aplicacao', 'estrategia', 'exercicio'] as const;

function makeSummary(): InteractiveSummary {
  return {
    id: 'fis-termo-01',
    title: 'Transformação adiabática',
    subject: 'Física',
    topic: 'Termodinâmica',
    priority: 'alta',
    boards: [{ board: 'Fuvest', phases: ['primeira'] }],
    prerequisites: ['Primeira Lei da Termodinâmica'],
    overview: 'Gases ideais sem troca de calor com o meio.',
    sections: STAGES.map((stage, index) => ({
      id: `fis-termo-01-editorial-v2-s${index + 1}`,
      title: `Seção ${index + 1}`,
      stage,
      depth: 'aprofundamento' as const,
      content: `Primeira frase da seção ${index + 1}. Segunda frase que não deve aparecer no resumo do nó.`,
    })),
    retrieval: [{
      id: 'fis-termo-01-q1',
      prompt: 'O que acontece com a energia interna quando Q = 0?',
      hint: 'Pense na Primeira Lei.',
      transferPrompt: 'E numa compressão?',
      expectedElements: [
        { label: 'Trabalho sobre o gás', keywords: ['trabalho sobre o gás'] },
        { label: 'Energia interna aumenta', keywords: ['energia interna aumenta'] },
        { label: 'Temperatura aumenta', keywords: ['temperatura aumenta'] },
      ],
    }],
    sources: [],
  };
}

function attempt(matched: string[], missing: string | null, date = '2026-01-01'): RetrievalAttempt {
  return { questionId: 'fis-termo-01-q1', answer: '...', matchedElements: matched, firstMissingElement: missing, date };
}

test('buildVisualMap deriva nós, arestas e relações do conteúdo real do resumo', () => {
  const map = buildVisualMap(makeSummary());
  assert.equal(map.nodes.length, 5);
  assert.equal(map.edges.length, 4);
  assert.deepEqual(map.edges.map((edge) => edge.kind), ['causa', 'consequencia', 'contraste', 'transferencia']);
  assert.equal(map.nodes[0].excerpt, 'Primeira frase da seção 1.');
  assert.equal(map.relations.length, 3);
  assert.equal(map.centerLabel, 'Termodinâmica');
  assert.equal(map.questionId, 'fis-termo-01-q1');
});

test('buildVisualMap não deixa aresta sem tipo se o capítulo fugir das cinco seções', () => {
  const summary = makeSummary();
  summary.sections = [...summary.sections, { ...summary.sections[4], id: 'extra', title: 'Seção 6' }];
  const map = buildVisualMap(summary);
  assert.equal(map.edges.length, 5);
  assert.ok(map.edges.every((edge) => typeof edge.kind === 'string'));
});

test('buildVisualMap sobrevive a capítulo sem pergunta de recuperação', () => {
  const summary = makeSummary();
  summary.retrieval = [];
  const map = buildVisualMap(summary);
  assert.deepEqual(map.relations, []);
  assert.equal(map.recallPrompt, null);
  assert.equal(map.questionId, null);
});

test('a normalização aceita resposta sem acento e em caixa diferente', () => {
  const map = buildVisualMap(makeSummary());
  const relation = map.relations[2];
  assert.equal(foldAnswer('  TEMPERATURA Aumenta '), 'temperatura aumenta');
  assert.ok(matchesRelation(relation, 'TEMPERATURA AUMENTA'));
  assert.ok(matchesRelation(relation, 'a temperatura aumenta muito'));
  assert.ok(!matchesRelation(relation, ''));
});

test('a correção distingue correta, parcial e incorreta', () => {
  const map = buildVisualMap(makeSummary());
  const alvo = map.relations[2].id;

  assert.equal(gradeReconstruction(map, alvo, 'a temperatura aumenta').grade, 'correta');

  // Conteúdo certo, vínculo trocado: é o "quase isso" do estudo de reconstrução,
  // não um erro cheio.
  const parcial = gradeReconstruction(map, alvo, 'o trabalho sobre o gás');
  assert.equal(parcial.grade, 'parcial');
  assert.equal(parcial.matchedRelationId, map.relations[0].id);

  assert.equal(gradeReconstruction(map, alvo, 'a pressão do meio externo').grade, 'incorreta');
  assert.equal(gradeReconstruction(map, 'inexistente', 'qualquer coisa').grade, 'incorreta');
});

test('os sete estados derivam da evidência real, inclusive a possível regressão', () => {
  const map = buildVisualMap(makeSummary());
  const relation = map.relations[0];
  const label = relation.label;
  const grade = (answers: RetrievalAttempt[]) => relationState(relationEvidence(relation, answers));

  assert.equal(grade([]), 'nao-avaliado');
  assert.equal(grade([attempt([], label)]), 'reconhece');
  assert.equal(grade([attempt([label], null)]), 'compreende');
  assert.equal(grade([attempt([label], null), attempt([label], null)]), 'aplica');
  assert.equal(grade([attempt([label], null), attempt([label], null), attempt([label], null)]), 'transfere');
  // Acerto depois do erro: instável, mas sem alerta de regressão.
  assert.equal(grade([attempt([], label), attempt([label], null)]), 'aplicacao-instavel');
  // Errou justamente na última: o que ela já reconstruía voltou a falhar.
  assert.equal(grade([attempt([label], null), attempt([], label)]), 'possivel-regressao');
});

test('tentativa que não avaliou elemento nenhum não vira erro', () => {
  const map = buildVisualMap(makeSummary());
  const evidence = relationEvidence(map.relations[0], [attempt([], null)]);
  assert.deepEqual(
    { hits: evidence.hits, misses: evidence.misses, attempts: evidence.attempts },
    { hits: 0, misses: 0, attempts: 0 },
  );
});

test('a confiança acompanha a escala já usada no app', () => {
  const map = buildVisualMap(makeSummary());
  const relation = map.relations[0];
  const level = (answers: RetrievalAttempt[]) => relationConfidence(relationEvidence(relation, answers));
  assert.equal(level([]), 'insufficient_data');
  assert.equal(level([attempt([relation.label], null)]), 'low');
  assert.equal(level([attempt([relation.label], null), attempt([relation.label], null)]), 'moderate');
  assert.equal(level([1, 2, 3].map(() => attempt([relation.label], null))), 'high');
});

test('a regressão fica fora da escada de estados', () => {
  assert.equal(NODE_STATE_RANK['possivel-regressao'], NODE_STATE_RANK.compreende);
  assert.ok(NODE_STATE_RANK.transfere > NODE_STATE_RANK.aplica);
});

test('o nó só passa de "não avaliado" quando há leitura ou evidência', () => {
  const map = buildVisualMap(makeSummary());
  const node = map.nodes[1];
  const progress = (read: string[]): SummaryProgress => ({ readSectionIds: read, status: 'em-revisao', important: false, answers: [] });

  assert.equal(nodeState(node, undefined, []), 'nao-avaliado');
  assert.equal(nodeState(node, progress([]), ['aplica']), 'reconhece');
  assert.equal(nodeState(node, progress([node.sectionId]), []), 'reconhece');
  assert.equal(nodeState(node, progress([node.sectionId]), ['aplica']), 'aplica');
  // Uma regressão em qualquer relação domina o nó: é alerta, não média.
  assert.equal(nodeState(node, progress([node.sectionId]), ['transfere', 'possivel-regressao']), 'possivel-regressao');
});

test('a ocultação prioriza a relação com evidência mais frágil', () => {
  const map = buildVisualMap(makeSummary());
  const [primeira, segunda, terceira] = map.relations;
  const answers = [
    attempt([primeira.label, segunda.label, terceira.label], null),
    attempt([primeira.label, terceira.label], segunda.label),
    attempt([primeira.label], segunda.label),
  ];
  const plan = chooseHiddenRelations(map, answers);
  assert.equal(plan.length, 2);
  // A segunda errou na última tentativa; a terceira é instável; a primeira
  // acertou sempre e não deve ser ocultada.
  assert.equal(plan[0].relationId, segunda.id);
  assert.ok(plan.every((item) => item.relationId !== primeira.id));
  assert.ok(plan[0].reason.length > 0);

  const semEvidencia = chooseHiddenRelations(map, []);
  assert.equal(semEvidencia.length, 2);
  assert.match(semEvidencia[0].reason, /Nunca houve tentativa/);
  assert.equal(chooseHiddenRelations(map, answers, 0).length, 0);
});

test('a intervenção mínima aponta o elo, não o capítulo inteiro', () => {
  const map = buildVisualMap(makeSummary());
  const [primeira, segunda, terceira] = map.relations;
  const answers = [
    attempt([primeira.label, segunda.label, terceira.label], null),
    attempt([primeira.label, terceira.label], segunda.label),
  ];
  const intervencao = minimalIntervention(map, answers);
  assert.ok(intervencao);
  assert.equal(intervencao.relationId, segunda.id);
  assert.equal(intervencao.label, segunda.label);
  assert.equal(intervencao.state, 'possivel-regressao');
  assert.equal(intervencao.action, 'Reconstruir esta relação');
  assert.match(intervencao.why, /voltou a falhar/);
});

test('não há intervenção quando toda relação já transfere', () => {
  const map = buildVisualMap(makeSummary());
  const todas = map.relations.map((relation) => relation.label);
  const answers = [1, 2, 3].map(() => attempt(todas, null));
  assert.equal(minimalIntervention(map, answers), null);
  assert.equal(minimalIntervention({ ...map, relations: [] }, answers), null);
});

test('"Por que isso?" apresenta hipótese como hipótese quando a evidência é rasa', () => {
  const map = buildVisualMap(makeSummary());
  const relation = map.relations[0];

  const vazio = explainRelation(relation, []);
  assert.equal(vazio.state, 'nao-avaliado');
  assert.equal(vazio.confidence, 'insufficient_data');
  assert.ok(vazio.caveat);

  const uma = explainRelation(relation, [attempt([relation.label], null)]);
  assert.equal(uma.confidence, 'low');
  assert.ok(uma.caveat, 'uma tentativa é indício, não fato');
  assert.match(uma.evidence.join(' '), /Última tentativa: acerto/);

  const firme = explainRelation(relation, [1, 2, 3].map(() => attempt([relation.label], null)));
  assert.equal(firme.state, 'transfere');
  assert.equal(firme.confidence, 'high');
  assert.equal(firme.caveat, null);
});
