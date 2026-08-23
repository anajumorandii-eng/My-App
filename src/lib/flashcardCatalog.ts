import {
  Flashcard,
  FlashcardPriority,
  FlashcardReview,
  FlashcardTrainingType,
  Topic,
} from '../types';
import { isDue } from './flashcardScheduler';
import { classifyFlashcard } from './flashcardTaxonomy';

export const FLASHCARD_PRIORITY_ORDER: FlashcardPriority[] = ['essencial', 'alta', 'regular'];
export const FLASHCARD_TRAINING_TYPE_ORDER: FlashcardTrainingType[] = [
  'objetivos',
  'discursivos',
  'interpretacao',
  'pegadinhas',
  'padroes_bancas',
];

export interface FlashcardBucketCount {
  total: number;
  due: number;
}

export interface FlashcardTopicSummary {
  topicId: string | null;
  label: string;
  total: number;
  due: number;
  buckets: Record<FlashcardPriority, Record<FlashcardTrainingType, FlashcardBucketCount>>;
}

export interface FlashcardSessionSelection {
  topicId: string | null;
  priority?: FlashcardPriority;
  trainingType?: FlashcardTrainingType;
  allDueForTopic: boolean;
}

function createBuckets(): FlashcardTopicSummary['buckets'] {
  return Object.fromEntries(
    FLASHCARD_PRIORITY_ORDER.map((priority) => [
      priority,
      Object.fromEntries(
        FLASHCARD_TRAINING_TYPE_ORDER.map((trainingType) => [trainingType, { total: 0, due: 0 }]),
      ),
    ]),
  ) as FlashcardTopicSummary['buckets'];
}

function createSummary(topicId: string | null, label: string): FlashcardTopicSummary {
  return { topicId, label, total: 0, due: 0, buckets: createBuckets() };
}

/**
 * Produz a visão de catálogo na ordem curricular. Cartões sem tópico ou que
 * apontam para um tópico que não está no currículo formam o único bucket final.
 */
export function buildFlashcardTopicIndex(
  cards: Flashcard[],
  topics: Topic[],
  reviews: Record<string, FlashcardReview>,
  now: Date = new Date(),
): FlashcardTopicSummary[] {
  const summariesByTopicId = new Map<string, FlashcardTopicSummary>(
    topics.map((topic) => [topic.id, createSummary(topic.id, topic.name)]),
  );
  const otherTopics = createSummary(null, 'Outros tópicos');

  for (const card of cards) {
    const summary = card.topicId ? summariesByTopicId.get(card.topicId) ?? otherTopics : otherTopics;
    const { priority, trainingType } = classifyFlashcard(card);
    const due = isDue(reviews[card.id], now);

    summary.total += 1;
    if (due) summary.due += 1;

    const bucket = summary.buckets[priority][trainingType];
    bucket.total += 1;
    if (due) bucket.due += 1;
  }

  return [
    ...topics.map((topic) => summariesByTopicId.get(topic.id)!),
    ...(otherTopics.total > 0 ? [otherTopics] : []),
  ];
}

/**
 * Seleciona cartões vencidos do tópico escolhido. `allDueForTopic` devolve
 * todo o tópico, com Essencial antes de Alta e Regular, sem alterar a ordem
 * original entre cartões da mesma prioridade.
 */
export function selectDueCards(
  cards: Flashcard[],
  selection: FlashcardSessionSelection,
  reviews: Record<string, FlashcardReview>,
  now: Date = new Date(),
): Flashcard[] {
  const dueCardsInTopic = cards.filter((card) =>
    (card.topicId ?? null) === selection.topicId && isDue(reviews[card.id], now),
  );

  if (selection.allDueForTopic) {
    return FLASHCARD_PRIORITY_ORDER.flatMap((priority) =>
      dueCardsInTopic.filter((card) => classifyFlashcard(card).priority === priority),
    );
  }

  return dueCardsInTopic.filter((card) => {
    const classification = classifyFlashcard(card);
    return (!selection.priority || classification.priority === selection.priority)
      && (!selection.trainingType || classification.trainingType === selection.trainingType);
  });
}
