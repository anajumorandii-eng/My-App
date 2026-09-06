import assert from 'node:assert/strict';
import test from 'node:test';

import {
  flashcardNavigationReducer,
  initialFlashcardNavigationState,
} from './flashcardNavigation';

test('cada seleção avança para a tela seguinte', () => {
  let state = flashcardNavigationReducer(initialFlashcardNavigationState, {
    type: 'select_subject',
    subject: 'Biologia',
  });
  assert.deepEqual(state, { step: 'topic', subject: 'Biologia' });

  state = flashcardNavigationReducer(state, { type: 'select_topic', topicId: 'bio_ecologia' });
  assert.deepEqual(state, { step: 'subtopic', subject: 'Biologia', topicId: 'bio_ecologia' });

  state = flashcardNavigationReducer(state, { type: 'select_subtopic', subtopicId: 'Ciclos' });
  assert.deepEqual(state, {
    step: 'priority',
    subject: 'Biologia',
    topicId: 'bio_ecologia',
    subtopicId: 'Ciclos',
  });

  state = flashcardNavigationReducer(state, { type: 'select_priority', priority: 'essencial' });
  assert.deepEqual(state, {
    step: 'training_type',
    subject: 'Biologia',
    topicId: 'bio_ecologia',
    subtopicId: 'Ciclos',
    priority: 'essencial',
  });
});

test('escolher o tópico inteiro pula o recorte por subtópico', () => {
  let state = initialFlashcardNavigationState;
  state = flashcardNavigationReducer(state, { type: 'select_subject', subject: 'Biologia' });
  state = flashcardNavigationReducer(state, { type: 'select_topic', topicId: 'bio_ecologia' });
  state = flashcardNavigationReducer(state, { type: 'select_subtopic', subtopicId: undefined });

  assert.deepEqual(state, {
    step: 'priority',
    subject: 'Biologia',
    topicId: 'bio_ecologia',
    subtopicId: undefined,
  });
});

test('avança matéria, tópico, subtópico, prioridade e tipo antes da sessão', () => {
  let state = initialFlashcardNavigationState;
  state = flashcardNavigationReducer(state, { type: 'select_subject', subject: 'Biologia' });
  state = flashcardNavigationReducer(state, { type: 'select_topic', topicId: 'bio_ecologia' });
  state = flashcardNavigationReducer(state, { type: 'select_subtopic', subtopicId: 'Ciclos' });
  state = flashcardNavigationReducer(state, { type: 'select_priority', priority: 'essencial' });
  state = flashcardNavigationReducer(state, {
    type: 'select_training_type',
    trainingType: 'interpretacao',
  });

  assert.deepEqual(state, {
    step: 'session',
    subject: 'Biologia',
    topicId: 'bio_ecologia',
    subtopicId: 'Ciclos',
    priority: 'essencial',
    trainingType: 'interpretacao',
    allDueForTopic: false,
  });
});

test('volta de sessão filtrada até a matéria, removendo somente o posterior', () => {
  let state = initialFlashcardNavigationState;
  state = flashcardNavigationReducer(state, { type: 'select_subject', subject: 'Biologia' });
  state = flashcardNavigationReducer(state, { type: 'select_topic', topicId: 'bio_ecologia' });
  state = flashcardNavigationReducer(state, { type: 'select_subtopic', subtopicId: 'Ciclos' });
  state = flashcardNavigationReducer(state, { type: 'select_priority', priority: 'alta' });
  state = flashcardNavigationReducer(state, {
    type: 'select_training_type',
    trainingType: 'objetivos',
  });

  state = flashcardNavigationReducer(state, { type: 'back' });
  assert.deepEqual(state, {
    step: 'training_type',
    subject: 'Biologia',
    topicId: 'bio_ecologia',
    subtopicId: 'Ciclos',
    priority: 'alta',
  });
  state = flashcardNavigationReducer(state, { type: 'back' });
  assert.deepEqual(state, {
    step: 'priority',
    subject: 'Biologia',
    topicId: 'bio_ecologia',
    subtopicId: 'Ciclos',
    priority: 'alta',
  });
  state = flashcardNavigationReducer(state, { type: 'back' });
  assert.deepEqual(state, {
    step: 'subtopic',
    subject: 'Biologia',
    topicId: 'bio_ecologia',
    subtopicId: 'Ciclos',
  });
  state = flashcardNavigationReducer(state, { type: 'back' });
  assert.deepEqual(state, {
    step: 'topic',
    subject: 'Biologia',
    topicId: 'bio_ecologia',
  });
  state = flashcardNavigationReducer(state, { type: 'back' });
  assert.deepEqual(state, { step: 'subject', subject: 'Biologia' });
  state = flashcardNavigationReducer(state, { type: 'back' });
  assert.deepEqual(state, { step: 'subject' });
});

test('revisa todos os vencidos e retorna ao tópico sem prioridade ou tipo', () => {
  let state = initialFlashcardNavigationState;
  state = flashcardNavigationReducer(state, { type: 'select_subject', subject: 'Biologia' });
  state = flashcardNavigationReducer(state, { type: 'select_topic', topicId: 'bio_ecologia' });
  state = flashcardNavigationReducer(state, { type: 'select_subtopic', subtopicId: undefined });
  state = flashcardNavigationReducer(state, { type: 'select_priority', priority: 'alta' });
  state = flashcardNavigationReducer(state, { type: 'back' });
  state = flashcardNavigationReducer(state, { type: 'back' });
  state = flashcardNavigationReducer(state, { type: 'back' });
  assert.deepEqual(state, {
    step: 'topic',
    subject: 'Biologia',
    topicId: 'bio_ecologia',
  });
  state = flashcardNavigationReducer(state, { type: 'review_all_due' });

  assert.deepEqual(state, {
    step: 'session',
    subject: 'Biologia',
    topicId: 'bio_ecologia',
    subtopicId: undefined,
    allDueForTopic: true,
  });

  state = flashcardNavigationReducer(state, { type: 'back' });
  assert.deepEqual(state, {
    step: 'topic',
    subject: 'Biologia',
    topicId: 'bio_ecologia',
  });
});

test('todos os vencidos a partir do subtópico preserva o recorte e volta para ele', () => {
  let state = initialFlashcardNavigationState;
  state = flashcardNavigationReducer(state, { type: 'select_subject', subject: 'Biologia' });
  state = flashcardNavigationReducer(state, { type: 'select_topic', topicId: 'bio_ecologia' });
  state = flashcardNavigationReducer(state, { type: 'review_all_due' });
  assert.deepEqual(state, {
    step: 'session',
    subject: 'Biologia',
    topicId: 'bio_ecologia',
    subtopicId: undefined,
    allDueForTopic: true,
  });

  state = flashcardNavigationReducer(state, { type: 'back' });
  state = flashcardNavigationReducer(state, { type: 'select_topic', topicId: 'bio_ecologia' });
  state = flashcardNavigationReducer(state, { type: 'select_subtopic', subtopicId: 'Ciclos' });
  state = flashcardNavigationReducer(state, { type: 'back' });
  state = flashcardNavigationReducer(state, { type: 'select_subtopic', subtopicId: 'Ciclos' });
  // De volta em 'priority'; o atalho só existe em 'topic' e 'subtopic'.
  const blocked = flashcardNavigationReducer(state, { type: 'review_all_due' });
  assert.strictEqual(blocked, state);
});

test('trocar matéria limpa tópico, prioridade e tipo anteriores', () => {
  let state = initialFlashcardNavigationState;
  state = flashcardNavigationReducer(state, { type: 'select_subject', subject: 'Biologia' });
  state = flashcardNavigationReducer(state, { type: 'select_topic', topicId: 'bio_ecologia' });
  state = flashcardNavigationReducer(state, { type: 'select_subtopic', subtopicId: 'Ciclos' });
  state = flashcardNavigationReducer(state, { type: 'select_priority', priority: 'essencial' });
  state = flashcardNavigationReducer(state, {
    type: 'select_training_type',
    trainingType: 'interpretacao',
  });
  state = flashcardNavigationReducer(state, { type: 'back' });
  state = flashcardNavigationReducer(state, { type: 'back' });
  state = flashcardNavigationReducer(state, { type: 'back' });
  state = flashcardNavigationReducer(state, { type: 'back' });
  state = flashcardNavigationReducer(state, { type: 'back' });
  state = flashcardNavigationReducer(state, { type: 'select_subject', subject: 'Química' });

  assert.deepEqual(state, { step: 'topic', subject: 'Química' });
});

test('reset volta ao estado inicial', () => {
  let state = flashcardNavigationReducer(initialFlashcardNavigationState, {
    type: 'select_subject',
    subject: 'Biologia',
  });

  state = flashcardNavigationReducer(state, { type: 'reset' });

  assert.deepEqual(state, initialFlashcardNavigationState);
});

test('rejeita ações fora da etapa exata e preserva a mesma referência', () => {
  let state = initialFlashcardNavigationState;

  let next = flashcardNavigationReducer(state, { type: 'select_topic', topicId: 'bio_ecologia' });
  assert.strictEqual(next, state);

  state = flashcardNavigationReducer(state, { type: 'select_subject', subject: 'Biologia' });
  next = flashcardNavigationReducer(state, { type: 'select_subject', subject: 'Química' });
  assert.strictEqual(next, state);
  next = flashcardNavigationReducer(state, { type: 'review_all_due' });
  assert.strictEqual(next, state);
  next = flashcardNavigationReducer(state, { type: 'select_priority', priority: 'essencial' });
  assert.strictEqual(next, state);

  state = flashcardNavigationReducer(state, { type: 'select_topic', topicId: 'bio_ecologia' });
  // Em 'subtopic' o atalho de vencidos é permitido, então o que se rejeita
  // aqui é escolher prioridade antes de passar pelo subtópico.
  next = flashcardNavigationReducer(state, { type: 'select_priority', priority: 'essencial' });
  assert.strictEqual(next, state);
  next = flashcardNavigationReducer(state, { type: 'select_topic', topicId: 'bio_citologia' });
  assert.strictEqual(next, state);

  state = flashcardNavigationReducer(state, { type: 'select_subtopic', subtopicId: 'Ciclos' });
  next = flashcardNavigationReducer(state, { type: 'select_subtopic', subtopicId: 'Outro' });
  assert.strictEqual(next, state);

  state = flashcardNavigationReducer(state, { type: 'select_priority', priority: 'essencial' });
  next = flashcardNavigationReducer(state, { type: 'select_priority', priority: 'alta' });
  assert.strictEqual(next, state);

  state = flashcardNavigationReducer(state, {
    type: 'select_training_type',
    trainingType: 'interpretacao',
  });
  next = flashcardNavigationReducer(state, {
    type: 'select_training_type',
    trainingType: 'objetivos',
  });
  assert.strictEqual(next, state);
  next = flashcardNavigationReducer(state, { type: 'select_subject', subject: 'Química' });
  assert.strictEqual(next, state);
});

test('não permite escolher prioridade na tela de tópico após voltar', () => {
  let state = initialFlashcardNavigationState;
  state = flashcardNavigationReducer(state, { type: 'select_subject', subject: 'Biologia' });
  state = flashcardNavigationReducer(state, { type: 'select_topic', topicId: 'bio_ecologia' });
  state = flashcardNavigationReducer(state, { type: 'select_subtopic', subtopicId: 'Ciclos' });
  state = flashcardNavigationReducer(state, { type: 'select_priority', priority: 'essencial' });
  state = flashcardNavigationReducer(state, { type: 'back' });
  state = flashcardNavigationReducer(state, { type: 'back' });
  state = flashcardNavigationReducer(state, { type: 'back' });

  const next = flashcardNavigationReducer(state, { type: 'select_priority', priority: 'alta' });
  assert.strictEqual(next, state);
});
