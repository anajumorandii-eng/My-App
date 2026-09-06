import assert from 'node:assert/strict';
import test from 'node:test';

import { Topic } from '../types';
import {
  ALL,
  WITHOUT_CHAPTER_ID,
  WITHOUT_TOPIC_ID,
  buildTopicHierarchy,
  filterByHierarchy,
} from './topicHierarchy';

const topics: Topic[] = [
  {
    id: 'bio_celula',
    name: 'Estrutura Celular',
    subject: 'Biologia',
    prerequisites: [],
    chapters: ['Membranas', 'Núcleo', 'Citoplasma'],
  },
  {
    id: 'bio_genetica',
    name: 'Genética',
    subject: 'Biologia',
    prerequisites: ['bio_celula'],
    chapters: ['Mendel'],
  },
  {
    id: 'qui_atomo',
    name: 'Atomística',
    subject: 'Química',
    prerequisites: [],
    chapters: ['Modelos Atômicos'],
  },
];

const items = [
  { subject: 'Biologia', topicId: 'bio_celula', chapter: 'Núcleo' },
  { subject: 'Biologia', topicId: 'bio_celula', chapter: 'Membranas' },
  { subject: 'Biologia', topicId: 'bio_celula', chapter: 'Membranas' },
  { subject: 'Biologia', topicId: 'bio_celula', chapter: 'Assunto Extra' },
  { subject: 'Biologia', topicId: 'bio_celula' },
  { subject: 'Biologia', topicId: 'bio_genetica', chapter: 'Mendel' },
  { subject: 'Física', topicId: 'nao_existe', chapter: 'Cinemática' },
];

test('buildTopicHierarchy: segue a ordem do currículo, não a de inserção nem a alfabética', () => {
    const tree = buildTopicHierarchy(items, topics);
    assert.deepEqual(tree.map((node) => node.id), ['bio_celula', 'bio_genetica', WITHOUT_TOPIC_ID]);
  });

test('buildTopicHierarchy: omite tópicos do currículo que não têm nenhum item', () => {
    const tree = buildTopicHierarchy(items, topics);
    assert.equal(tree.some((node) => node.id === 'qui_atomo'), false);
  });

test('buildTopicHierarchy: ordena subtópicos pelo currículo, depois os extras, e "sem subtópico" por último', () => {
    const celula = buildTopicHierarchy(items, topics).find((node) => node.id === 'bio_celula')!;
    assert.deepEqual(celula.subtopics.map((sub) => sub.id), [
      'Membranas',
      'Núcleo',
      'Assunto Extra',
      WITHOUT_CHAPTER_ID,
    ]);
  });

test('buildTopicHierarchy: conta itens por tópico e por subtópico', () => {
    const celula = buildTopicHierarchy(items, topics).find((node) => node.id === 'bio_celula')!;
    assert.equal(celula.count, 5);
    assert.equal(celula.subtopics.find((sub) => sub.id === 'Membranas')!.count, 2);
    assert.equal(celula.subtopics.find((sub) => sub.id === WITHOUT_CHAPTER_ID)!.count, 1);
  });

test('buildTopicHierarchy: junta no balde final o que aponta para um tópico fora do currículo', () => {
    const orphan = buildTopicHierarchy(items, topics).find((node) => node.id === WITHOUT_TOPIC_ID)!;
    assert.equal(orphan.count, 1);
    assert.deepEqual(orphan.subtopics.map((sub) => sub.id), ['Cinemática']);
  });

test('buildTopicHierarchy: não devolve o balde final quando todo item tem tópico conhecido', () => {
    const tree = buildTopicHierarchy(items.slice(0, 6), topics);
    assert.equal(tree.some((node) => node.id === WITHOUT_TOPIC_ID), false);
  });

test('filterByHierarchy: sem filtro nenhum devolve tudo', () => {
    assert.equal((filterByHierarchy(items, {}, topics)).length, items.length);
  });

test('filterByHierarchy: filtra por matéria', () => {
    assert.equal((filterByHierarchy(items, { subject: 'Biologia' }, topics)).length, 6);
  });

test('filterByHierarchy: filtra por tópico', () => {
    assert.equal((filterByHierarchy(items, { topicId: 'bio_celula' }, topics)).length, 5);
  });

test('filterByHierarchy: filtra por subtópico', () => {
    const result = filterByHierarchy(items, { topicId: 'bio_celula', subtopicId: 'Membranas' }, topics);
    assert.equal((result).length, 2);
  });

test('filterByHierarchy: trata "sem subtópico" como um valor selecionável', () => {
    const result = filterByHierarchy(items, { subtopicId: WITHOUT_CHAPTER_ID }, topics);
    assert.deepEqual(result, [{ subject: 'Biologia', topicId: 'bio_celula' }]);
  });

test('filterByHierarchy: o balde final seleciona itens sem tópico ou fora do currículo', () => {
    const result = filterByHierarchy(items, { topicId: WITHOUT_TOPIC_ID }, topics);
    assert.deepEqual(result, [{ subject: 'Física', topicId: 'nao_existe', chapter: 'Cinemática' }]);
  });

test('filterByHierarchy: ALL em qualquer nível não restringe', () => {
    const result = filterByHierarchy(items, { subject: ALL, topicId: ALL, subtopicId: ALL }, topics);
    assert.equal((result).length, items.length);
  });
