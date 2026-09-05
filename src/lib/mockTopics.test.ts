import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { mockTopics, mockMastery, mockPodcastEpisodes, mockBacklog, mockErrorLogs } from '../data/mockData';
import type { Question } from '../types';
import { mockTopicDiscursivePrompts } from '../data/topicDiscursivePrompts';
import { SPLIT_TOPIC_PARENTS } from '../data/topicSplits';

// O banco de questões virou arquivo estático (public/questions.json) pra sair
// do bundle do cliente. A integridade dele contra o catálogo de tópicos
// continua sendo verificada aqui, lendo do disco.
const mockQuestions = JSON.parse(readFileSync('public/questions.json', 'utf8')) as Question[];

test('no topic id is duplicated', () => {
  const ids = mockTopics.map((t) => t.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('every prerequisite points at a real topic', () => {
  const ids = new Set(mockTopics.map((t) => t.id));
  for (const topic of mockTopics) {
    for (const prereq of topic.prerequisites) {
      assert.ok(ids.has(prereq), `${topic.id} lists an unknown prerequisite: ${prereq}`);
    }
  }
});

test('every topicId referenced elsewhere in the mock dataset resolves to a real topic', () => {
  const ids = new Set(mockTopics.map((t) => t.id));
  for (const m of mockMastery) assert.ok(ids.has(m.topicId), `mockMastery references unknown topic ${m.topicId}`);
  for (const q of mockQuestions) assert.ok(ids.has(q.topicId), `mockQuestions references unknown topic ${q.topicId}`);
  for (const p of mockPodcastEpisodes) assert.ok(ids.has(p.topicId), `mockPodcastEpisodes references unknown topic ${p.topicId}`);
  for (const b of mockBacklog) assert.ok(ids.has(b.topicId), `mockBacklog references unknown topic ${b.topicId}`);
  for (const e of mockErrorLogs) assert.ok(ids.has(e.topicId), `mockErrorLogs references unknown topic ${e.topicId}`);
  for (const d of mockTopicDiscursivePrompts) assert.ok(ids.has(d.topicId), `mockTopicDiscursivePrompts references unknown topic ${d.topicId}`);
});

test('no duplicate id within mockTopicDiscursivePrompts', () => {
  const ids = mockTopicDiscursivePrompts.map((d) => d.id);
  assert.equal(new Set(ids).size, ids.length, 'mockTopicDiscursivePrompts has a duplicate id');
});

test('every question/discursive-prompt chapter tag matches a real chapter of its topic', () => {
  const topicsById = new Map(mockTopics.map((t) => [t.id, t]));
  for (const q of mockQuestions) {
    if (!q.chapter) continue;
    const topic = topicsById.get(q.topicId);
    assert.ok(topic?.chapters?.includes(q.chapter), `${q.id} has chapter "${q.chapter}" not listed in ${q.topicId}'s chapters`);
  }
  for (const p of mockTopicDiscursivePrompts) {
    if (!p.chapter) continue;
    const topic = topicsById.get(p.topicId);
    assert.ok(topic?.chapters?.includes(p.chapter), `${p.id} has chapter "${p.chapter}" not listed in ${p.topicId}'s chapters`);
  }
});

test('every topic has exactly one mastery seed row', () => {
  const masteryIds = mockMastery.map((m) => m.topicId);
  assert.equal(new Set(masteryIds).size, masteryIds.length, 'no duplicate topicId in mockMastery');
  const topicIds = new Set(mockTopics.map((t) => t.id));
  const masterySet = new Set(masteryIds);
  assert.deepEqual(masterySet, topicIds, 'mockMastery must have exactly one row per topic, no more, no less');
});

test('every split-topic parent in topicSplits.ts is a real, retired (non-current) topic id', () => {
  const currentIds = new Set(mockTopics.map((t) => t.id));
  for (const [childId, parents] of Object.entries(SPLIT_TOPIC_PARENTS)) {
    assert.ok(currentIds.has(childId), `${childId} in SPLIT_TOPIC_PARENTS should be a current topic`);
    for (const parent of parents) {
      assert.ok(!currentIds.has(parent), `${parent} is listed as a retired parent but is still a current topic id`);
    }
  }
});

test('every topic has a non-empty chapters list sourced from the apostila', () => {
  for (const topic of mockTopics) {
    assert.ok(topic.chapters && topic.chapters.length > 0, `${topic.id} should have chapters`);
  }
});

test('no topic lists the same chapter twice', () => {
  for (const topic of mockTopics) {
    const unique = new Set(topic.chapters);
    assert.equal(unique.size, topic.chapters!.length, `${topic.id} has a duplicate chapter title`);
  }
});

test('no chapter title is blank', () => {
  for (const topic of mockTopics) {
    for (const chapter of topic.chapters!) {
      assert.ok(chapter.trim().length > 0, `${topic.id} has a blank chapter title`);
    }
  }
});

// contentStatus: 'pending' existe para o motor de eficiência não agendar bloco
// de estudo em tópico que abriria vazio. A marca só serve se for verdadeira, e
// ela erra dos dois lados: marcar um tópico que tem conteúdo o esconde do
// plano sem motivo; deixar de marcar um vazio devolve a sessão vazia. Os dois
// testes abaixo fecham as duas portas — quando alguém escrever a primeira
// questão de Sócrates e Platão, o primeiro teste quebra e cobra a remoção da
// marca.
test('todo tópico marcado como pending está mesmo sem conteúdo', () => {
  const comQuestao = new Set(mockQuestions.map((q) => q.topicId));
  const comDiscursiva = new Set(mockTopicDiscursivePrompts.map((d) => d.topicId));
  for (const topic of mockTopics) {
    if (topic.contentStatus !== 'pending') continue;
    assert.ok(
      !comQuestao.has(topic.id) && !comDiscursiva.has(topic.id),
      `${topic.id} já tem conteúdo — tire o contentStatus: 'pending' para ele voltar ao plano diário`,
    );
  }
});

test('todo tópico sem conteúdo está marcado como pending', () => {
  const comQuestao = new Set(mockQuestions.map((q) => q.topicId));
  const comDiscursiva = new Set(mockTopicDiscursivePrompts.map((d) => d.topicId));
  const vaziosNaoMarcados = mockTopics
    .filter((t) => !comQuestao.has(t.id) && !comDiscursiva.has(t.id) && t.contentStatus !== 'pending')
    .map((t) => t.id);
  assert.deepEqual(
    vaziosNaoMarcados,
    [],
    'estes tópicos não têm questão nem proposta discursiva e ainda assim entram no plano diário',
  );
});
