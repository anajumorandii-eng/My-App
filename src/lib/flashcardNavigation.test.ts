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
  assert.deepEqual(state, { step: 'priority', subject: 'Biologia', topicId: 'bio_ecologia' });

  state = flashcardNavigationReducer(state, { type: 'select_priority', priority: 'essencial' });
  assert.deepEqual(state, {
    step: 'training_type',
    subject: 'Biologia',
    topicId: 'bio_ecologia',
    priority: 'essencial',
  });
});

test('avança matéria, tópico, prioridade e tipo antes da sessão', () => {
  let state = initialFlashcardNavigationState;
  state = flashcardNavigationReducer(state, { type: 'select_subject', subject: 'Biologia' });
  state = flashcardNavigationReducer(state, { type: 'select_topic', topicId: 'bio_ecologia' });
  state = flashcardNavigationReducer(state, { type: 'select_priority', priority: 'essencial' });
  state = flashcardNavigationReducer(state, {
    type: 'select_training_type',
    trainingType: 'interpretacao',
  });

  assert.deepEqual(state, {
    step: 'session',
    subject: 'Biologia',
    topicId: 'bio_ecologia',
    priority: 'essencial',
    trainingType: 'interpretacao',
    allDueForTopic: false,
  });
});

test('volta de sessão filtrada até a matéria, removendo somente o posterior', () => {
  let state = initialFlashcardNavigationState;
  state = flashcardNavigationReducer(state, { type: 'select_subject', subject: 'Biologia' });
  state = flashcardNavigationReducer(state, { type: 'select_topic', topicId: 'bio_ecologia' });
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
    priority: 'alta',
  });
  state = flashcardNavigationReducer(state, { type: 'back' });
  assert.deepEqual(state, {
    step: 'priority',
    subject: 'Biologia',
    topicId: 'bio_ecologia',
    priority: 'alta',
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
  state = flashcardNavigationReducer(state, { type: 'review_all_due' });

  assert.deepEqual(state, {
    step: 'session',
    subject: 'Biologia',
    topicId: 'bio_ecologia',
    allDueForTopic: true,
  });

  state = flashcardNavigationReducer(state, { type: 'back' });
  assert.deepEqual(state, {
    step: 'topic',
    subject: 'Biologia',
    topicId: 'bio_ecologia',
  });
});

test('trocar matéria limpa tópico, prioridade e tipo anteriores', () => {
  let state = initialFlashcardNavigationState;
  state = flashcardNavigationReducer(state, { type: 'select_subject', subject: 'Biologia' });
  state = flashcardNavigationReducer(state, { type: 'select_topic', topicId: 'bio_ecologia' });
  state = flashcardNavigationReducer(state, { type: 'select_priority', priority: 'essencial' });
  state = flashcardNavigationReducer(state, {
    type: 'select_training_type',
    trainingType: 'interpretacao',
  });
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
