import assert from 'node:assert/strict';
import test from 'node:test';

import { Flashcard, FlashcardReview, Topic } from '../types';
import {
  canSelectFlashcardTopic,
  createFlashcardLoadRequestToken,
  createFlashcardOwnerReset,
  createFlashcardSessionStart,
  createFlashcardStudySnapshot,
  invalidateFlashcardLoadRequests,
  isFlashcardDueNavigationBlocked,
  isCurrentFlashcardLoadRequest,
} from './flashcardStudyView';

test('bloqueia navegação por vencimento somente durante hidratação autenticada', () => {
  assert.equal(isFlashcardDueNavigationBlocked(true, true), true);
  assert.equal(isFlashcardDueNavigationBlocked(true, false), false);
  assert.equal(isFlashcardDueNavigationBlocked(false, true), false);
  assert.equal(isFlashcardDueNavigationBlocked(false, false), false);
});

test('não permite selecionar tópico sem cartões', () => {
  assert.equal(canSelectFlashcardTopic({ total: 0 }), false);
  assert.equal(canSelectFlashcardTopic({ total: 1 }), true);
});

test('invalida requisições antigas ao iniciar outra carga ou desmontar a tela', () => {
  let currentToken = 0;
  const firstRequest = createFlashcardLoadRequestToken(currentToken);
  currentToken = firstRequest;
  assert.equal(isCurrentFlashcardLoadRequest(firstRequest, currentToken), true);

  const secondRequest = createFlashcardLoadRequestToken(currentToken);
  currentToken = secondRequest;
  assert.equal(isCurrentFlashcardLoadRequest(firstRequest, currentToken), false);
  assert.equal(isCurrentFlashcardLoadRequest(secondRequest, currentToken), true);

  currentToken = invalidateFlashcardLoadRequests(currentToken);
  assert.equal(isCurrentFlashcardLoadRequest(firstRequest, currentToken), false);
  assert.equal(isCurrentFlashcardLoadRequest(secondRequest, currentToken), false);
});

test('troca de owner limpa navegação, cartões carregados e snapshot da sessão', () => {
  const now = new Date('2026-08-23T15:00:00.000Z');

  assert.deepEqual(createFlashcardOwnerReset('user-b', now), {
    ownerUid: 'user-b',
    navigationAction: { type: 'reset' },
    cards: null,
    sessionCards: [],
    selectionNow: now,
  });
});

test('usa o mesmo instante explícito para contagens e seleção de vencidos', () => {
  const topics: Topic[] = [
    { id: 'bio_ecologia', name: 'Ecologia', subject: 'Biologia', prerequisites: [] },
  ];
  const cards: Flashcard[] = [{
    id: 'card-1',
    subject: 'Biologia',
    topicId: 'bio_ecologia',
    chapter: 'Ecologia',
    front: 'Pergunta',
    back: 'Resposta',
    tags: ['prioridade_essencial', '01_basico_mapa_minimo'],
    source: 'sistema_priorizado',
  }];
  const reviews: Record<string, FlashcardReview> = {
    'card-1': {
      cardId: 'card-1',
      easeFactor: 2.5,
      intervalDays: 1,
      reviewCount: 1,
      dueDate: '2026-08-23T12:00:00.500Z',
      lastReviewed: '2026-08-22T12:00:00.000Z',
    },
  };

  const beforeDue = createFlashcardStudySnapshot(
    cards,
    topics,
    reviews,
    new Date('2026-08-23T12:00:00.000Z'),
  );
  assert.equal(beforeDue.topicIndex[0].due, 0);
  assert.deepEqual(beforeDue.selectDue({
    topicId: 'bio_ecologia',
    allDueForTopic: true,
  }), []);

  const whenDue = createFlashcardSessionStart(
    cards,
    topics,
    reviews,
    { topicId: 'bio_ecologia', allDueForTopic: true },
    new Date('2026-08-23T12:00:00.500Z'),
  );
  assert.equal(whenDue.snapshot.topicIndex[0].due, 1);
  assert.deepEqual(whenDue.sessionCards.map((card) => card.id), ['card-1']);
});
