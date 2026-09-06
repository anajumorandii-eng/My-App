import {
  Flashcard,
  FlashcardPriority,
  FlashcardReview,
  FlashcardTrainingType,
  Topic,
} from '../types';
import { isDue } from './flashcardScheduler';
import { classifyFlashcard } from './flashcardTaxonomy';
import { WITHOUT_CHAPTER_ID } from './topicHierarchy';

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

export interface FlashcardSubtopicSummary {
  /** Nome do capítulo, ou WITHOUT_CHAPTER_ID quando o cartão não declara um. */
  id: string;
  label: string;
  total: number;
  due: number;
}

export interface FlashcardTopicSummary {
  topicId: string | null;
  label: string;
  total: number;
  due: number;
  /** Subtópicos presentes neste tópico, na ordem dos capítulos do currículo. */
  subtopics: FlashcardSubtopicSummary[];
  buckets: Record<FlashcardPriority, Record<FlashcardTrainingType, FlashcardBucketCount>>;
}

export interface FlashcardSessionSelection {
  topicId: string | null;
  /** Ausente ou nulo estuda o tópico inteiro; um id restringe ao subtópico. */
  subtopicId?: string | null;
  priority?: FlashcardPriority;
  trainingType?: FlashcardTrainingType;
  allDueForTopic: boolean;
}

/** Chave de subtópico de um cartão. Cartões sem capítulo caem num balde próprio. */
export function flashcardSubtopicKey(card: Pick<Flashcard, 'chapter'>): string {
  const chapter = card.chapter?.trim();
  return chapter ? chapter : WITHOUT_CHAPTER_ID;
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
  return { topicId, label, total: 0, due: 0, subtopics: [], buckets: createBuckets() };
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
  // Contagem de subtópicos num mapa à parte: procurar na lista a cada cartão
  // seria quadrático, e o baralho tem dezenas de milhares deles.
  const subtopicCounts = new Map<FlashcardTopicSummary, Map<string, FlashcardBucketCount>>();

  for (const card of cards) {
    const summary = card.topicId ? summariesByTopicId.get(card.topicId) ?? otherTopics : otherTopics;
    const { priority, trainingType } = classifyFlashcard(card);
    const due = isDue(reviews[card.id], now);

    summary.total += 1;
    if (due) summary.due += 1;

    const bucket = summary.buckets[priority][trainingType];
    bucket.total += 1;
    if (due) bucket.due += 1;

    let counts = subtopicCounts.get(summary);
    if (!counts) {
      counts = new Map();
      subtopicCounts.set(summary, counts);
    }
    const key = flashcardSubtopicKey(card);
    const entry = counts.get(key) ?? { total: 0, due: 0 };
    entry.total += 1;
    if (due) entry.due += 1;
    counts.set(key, entry);
  }

  const chaptersByTopicId = new Map(topics.map((topic) => [topic.id, topic.chapters ?? []]));

  const withSubtopics = (summary: FlashcardTopicSummary): FlashcardTopicSummary => {
    const counts = subtopicCounts.get(summary) ?? new Map<string, FlashcardBucketCount>();
    // Capítulos declarados no currículo primeiro, na ordem de estudo; depois os
    // que só existem no baralho, em ordem alfabética; "sem subtópico" por último.
    const declared = summary.topicId ? chaptersByTopicId.get(summary.topicId) ?? [] : [];
    const declaredSet = new Set(declared);
    const extras = [...counts.keys()]
      .filter((key) => key !== WITHOUT_CHAPTER_ID && !declaredSet.has(key))
      .sort((a, b) => a.localeCompare(b, 'pt-BR'));
    const ordered = [
      ...declared.filter((chapter) => counts.has(chapter)),
      ...extras,
      ...(counts.has(WITHOUT_CHAPTER_ID) ? [WITHOUT_CHAPTER_ID] : []),
    ];
    return {
      ...summary,
      subtopics: ordered.map((id) => ({
        id,
        label: id === WITHOUT_CHAPTER_ID ? 'Sem subtópico' : id,
        total: counts.get(id)?.total ?? 0,
        due: counts.get(id)?.due ?? 0,
      })),
    };
  };

  return [
    ...topics.map((topic) => withSubtopics(summariesByTopicId.get(topic.id)!)),
    ...(otherTopics.total > 0 ? [withSubtopics(otherTopics)] : []),
  ];
}

/**
 * Seleciona cartões vencidos do tópico escolhido. `allDueForTopic` devolve
 * todo o tópico, com Essencial antes de Alta e Regular, sem alterar a ordem
 * original entre cartões da mesma prioridade.
 */
export function selectDueCards(
  cards: Flashcard[],
  topics: Topic[],
  selection: FlashcardSessionSelection,
  reviews: Record<string, FlashcardReview>,
  now: Date = new Date(),
): Flashcard[] {
  const knownTopicIds = new Set(topics.map((topic) => topic.id));
  const dueCardsInTopic = cards.filter((card) =>
    (selection.topicId === null
      ? !card.topicId || !knownTopicIds.has(card.topicId)
      : card.topicId === selection.topicId)
    && (!selection.subtopicId || flashcardSubtopicKey(card) === selection.subtopicId)
    && isDue(reviews[card.id], now),
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
