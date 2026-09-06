import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildFlashcardTopicIndex,
  selectDueCards,
} from './flashcardCatalog';
import { Flashcard, FlashcardReview, Topic } from '../types';

const now = new Date('2026-08-23T12:00:00Z');

const topics: Topic[] = [
  { id: 'topic-physics', name: 'Física', subject: 'Física', prerequisites: [] },
  { id: 'topic-biology', name: 'Biologia', subject: 'Biologia', prerequisites: [] },
];

function card(patch: Partial<Flashcard>): Flashcard {
  return {
    id: 'card-default',
    subject: 'Física',
    topicId: 'topic-physics',
    chapter: 'Capítulo',
    front: 'Pergunta',
    back: 'Resposta',
    tags: [],
    source: 'sistema_priorizado',
    ...patch,
  };
}

function review(cardId: string, dueDate: string): FlashcardReview {
  return {
    cardId,
    easeFactor: 2.5,
    intervalDays: 1,
    reviewCount: 1,
    dueDate,
    lastReviewed: '2026-08-22T12:00:00Z',
  };
}

test('agrupa cada cartão uma vez e reúne tópicos ausentes ou desconhecidos em Outros tópicos', () => {
  const cards = [
    card({ id: 'essential', tags: ['prioridade_essencial', '01_basico_mapa_minimo'] }),
    card({ id: 'high', topicId: 'topic-biology', tags: ['prioridade_alta', '11_fuvest_2a_fase_resposta_pontuavel'] }),
    card({ id: 'missing-topic', topicId: undefined, tags: ['prioridade_regular', '01_basico_mapa_minimo'] }),
    card({ id: 'unknown-topic', topicId: 'removed-topic', tags: ['prioridade_regular', '01_basico_mapa_minimo'] }),
  ];

  const index = buildFlashcardTopicIndex(cards, topics, {}, now);

  assert.equal(index.reduce((sum, topic) => sum + topic.total, 0), 4);
  assert.deepEqual(index.map((topic) => topic.topicId), ['topic-physics', 'topic-biology', null]);
  assert.equal(index[2].label, 'Outros tópicos');
  assert.equal(index[2].total, 2);
});

test('conta cartões vencidos por prioridade e tipo, incluindo classificação fallback', () => {
  const cards = [
    card({ id: 'essential-due', tags: ['prioridade_essencial', '01_basico_mapa_minimo'] }),
    card({ id: 'high-future', tags: ['prioridade_alta', '11_fuvest_2a_fase_resposta_pontuavel'] }),
    card({ id: 'fallback-due', tags: ['tag_desconhecida'] }),
  ];
  const reviews = {
    'essential-due': review('essential-due', '2026-08-22T12:00:00Z'),
    'high-future': review('high-future', '2026-08-24T12:00:00Z'),
  };

  const [physics] = buildFlashcardTopicIndex(cards, topics, reviews, now);

  assert.equal(physics.total, 3);
  assert.equal(physics.due, 2);
  assert.deepEqual(physics.buckets.essencial.objetivos, { total: 1, due: 1 });
  assert.deepEqual(physics.buckets.alta.discursivos, { total: 1, due: 0 });
  assert.deepEqual(physics.buckets.regular.objetivos, { total: 1, due: 1 });
});

test('seleciona vencidos de um tópico por prioridade ou tipo', () => {
  const cards = [
    card({ id: 'essential-objective', tags: ['prioridade_essencial', '01_basico_mapa_minimo'] }),
    card({ id: 'high-discursive', tags: ['prioridade_alta', '11_fuvest_2a_fase_resposta_pontuavel'] }),
    card({ id: 'high-objective', tags: ['prioridade_alta', '01_basico_mapa_minimo'] }),
    card({ id: 'other-topic', topicId: 'topic-biology', tags: ['prioridade_alta', '01_basico_mapa_minimo'] }),
  ];
  const reviews = {
    'high-discursive': review('high-discursive', '2026-08-24T12:00:00Z'),
  };

  assert.deepEqual(
    selectDueCards(cards, topics, { topicId: 'topic-physics', priority: 'alta', allDueForTopic: false }, reviews, now).map((item) => item.id),
    ['high-objective'],
  );
  assert.deepEqual(
    selectDueCards(cards, topics, { topicId: 'topic-physics', trainingType: 'objetivos', allDueForTopic: false }, reviews, now).map((item) => item.id),
    ['essential-objective', 'high-objective'],
  );
});

test('seleciona todos os vencidos do tópico pela prioridade, mantendo ordem original dentro dela', () => {
  const cards = [
    card({ id: 'regular-first', tags: ['prioridade_regular', '01_basico_mapa_minimo'] }),
    card({ id: 'high-first', tags: ['prioridade_alta', '01_basico_mapa_minimo'] }),
    card({ id: 'essential', tags: ['prioridade_essencial', '01_basico_mapa_minimo'] }),
    card({ id: 'high-second', tags: ['prioridade_alta', '05_comparacao_e_fronteira_conceitual'] }),
    card({ id: 'regular-second', tags: ['prioridade_regular', '11_fuvest_2a_fase_resposta_pontuavel'] }),
  ];

  const selected = selectDueCards(cards, topics, { topicId: 'topic-physics', allDueForTopic: true }, {}, now);

  assert.deepEqual(selected.map((item) => item.id), [
    'essential',
    'high-first',
    'high-second',
    'regular-first',
    'regular-second',
  ]);
});

test('seleciona o bucket Outros tópicos com cartões sem tópico e de tópico desconhecido', () => {
  const cards = [
    card({ id: 'missing-topic', topicId: undefined, tags: ['prioridade_regular', '01_basico_mapa_minimo'] }),
    card({ id: 'unknown-topic', topicId: 'removed-topic', tags: ['prioridade_alta', '01_basico_mapa_minimo'] }),
    card({ id: 'known-topic', topicId: 'topic-physics', tags: ['prioridade_essencial', '01_basico_mapa_minimo'] }),
  ];

  const selected = selectDueCards(cards, topics, { topicId: null, allDueForTopic: true }, {}, now);

  assert.deepEqual(selected.map((item) => item.id), ['unknown-topic', 'missing-topic']);
  assert.equal(selected.find((item) => item.id === 'unknown-topic')?.topicId, 'removed-topic');
});

test('indexa subtópicos na ordem dos capítulos do currículo', () => {
  const withChapters: Topic[] = [
    {
      id: 'topic-physics',
      name: 'Física',
      subject: 'Física',
      prerequisites: [],
      chapters: ['Cinemática', 'Dinâmica'],
    },
  ];
  const cards = [
    card({ id: 'a', chapter: 'Dinâmica' }),
    card({ id: 'b', chapter: 'Cinemática' }),
    card({ id: 'c', chapter: 'Cinemática' }),
    card({ id: 'd', chapter: 'Óptica' }),
    card({ id: 'e', chapter: '' }),
  ];

  const [physics] = buildFlashcardTopicIndex(cards, withChapters, {}, now);

  // Declarados no currículo primeiro, depois o extra, "sem subtópico" por último.
  assert.deepEqual(physics.subtopics.map((sub) => sub.label), [
    'Cinemática',
    'Dinâmica',
    'Óptica',
    'Sem subtópico',
  ]);
  assert.equal(physics.subtopics.find((sub) => sub.label === 'Cinemática')!.total, 2);
});

test('conta vencidos por subtópico separadamente do total', () => {
  const withChapters: Topic[] = [
    { id: 'topic-physics', name: 'Física', subject: 'Física', prerequisites: [], chapters: ['Cinemática'] },
  ];
  const cards = [
    card({ id: 'due', chapter: 'Cinemática' }),
    card({ id: 'future', chapter: 'Cinemática' }),
  ];
  const reviews = {
    due: review('due', '2026-08-22T12:00:00Z'),
    future: review('future', '2026-09-30T12:00:00Z'),
  };

  const [physics] = buildFlashcardTopicIndex(cards, withChapters, reviews, now);
  const cinematica = physics.subtopics.find((sub) => sub.label === 'Cinemática')!;

  assert.equal(cinematica.total, 2);
  assert.equal(cinematica.due, 1);
});

test('selectDueCards restringe ao subtópico quando ele é informado', () => {
  const cards = [
    card({ id: 'cinematica', chapter: 'Cinemática' }),
    card({ id: 'dinamica', chapter: 'Dinâmica' }),
  ];
  const reviews = {
    cinematica: review('cinematica', '2026-08-22T12:00:00Z'),
    dinamica: review('dinamica', '2026-08-22T12:00:00Z'),
  };

  const restrito = selectDueCards(
    cards,
    topics,
    { topicId: 'topic-physics', subtopicId: 'Cinemática', allDueForTopic: true },
    reviews,
    now,
  );
  assert.deepEqual(restrito.map((c) => c.id), ['cinematica']);

  // Sem subtópico o comportamento anterior é preservado: o tópico inteiro.
  const inteiro = selectDueCards(
    cards,
    topics,
    { topicId: 'topic-physics', allDueForTopic: true },
    reviews,
    now,
  );
  assert.equal(inteiro.length, 2);
});
