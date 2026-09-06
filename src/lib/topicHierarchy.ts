import { Topic } from '../types';

/**
 * Navegação em três níveis — matéria, tópico, subtópico — sobre qualquer
 * coleção que carregue `subject`, `topicId` e `chapter`. Questões objetivas e
 * flashcards têm formatos diferentes mas a mesma hierarquia, então a contagem
 * e a ordenação ficam aqui em vez de duplicadas nas duas telas.
 *
 * A ordem é a do currículo (`mockTopics`), não a alfabética nem a de inserção:
 * estudar segue a sequência de pré-requisitos, e uma lista fora de ordem
 * esconde essa informação. Itens que não batem com nenhum tópico do currículo
 * caem num balde final em vez de sumirem da tela.
 */

export const ALL = 'Todas' as const;
export const WITHOUT_TOPIC_ID = '__sem_topico__';
export const WITHOUT_CHAPTER_ID = '__sem_subtopico__';

export interface HierarchyItem {
  subject?: string;
  topicId?: string;
  chapter?: string;
}

export interface SubtopicNode {
  /** Nome do capítulo, ou WITHOUT_CHAPTER_ID quando o item não declara um. */
  id: string;
  label: string;
  count: number;
}

export interface TopicNode {
  /** Id do tópico do currículo, ou WITHOUT_TOPIC_ID para o balde final. */
  id: string;
  label: string;
  subject: string | null;
  count: number;
  subtopics: SubtopicNode[];
}

function subtopicKey(item: HierarchyItem): string {
  const chapter = item.chapter?.trim();
  return chapter ? chapter : WITHOUT_CHAPTER_ID;
}

function subtopicLabel(id: string): string {
  return id === WITHOUT_CHAPTER_ID ? 'Sem subtópico' : id;
}

/**
 * Monta a árvore de tópicos e subtópicos presentes em `items`. Tópicos do
 * currículo sem nenhum item são omitidos: um filtro que oferece uma opção
 * vazia faz a estudante clicar para não encontrar nada.
 */
export function buildTopicHierarchy(items: HierarchyItem[], topics: Topic[]): TopicNode[] {
  const nodesByTopicId = new Map<string, TopicNode>();
  const orphan: TopicNode = {
    id: WITHOUT_TOPIC_ID,
    label: 'Fora do currículo',
    subject: null,
    count: 0,
    subtopics: [],
  };
  // Contagem por subtópico separada da lista para não fazer busca linear por
  // item — com ~17 mil flashcards isso seria quadrático.
  const subtopicCounts = new Map<TopicNode, Map<string, number>>();

  const bump = (node: TopicNode, item: HierarchyItem) => {
    node.count += 1;
    let counts = subtopicCounts.get(node);
    if (!counts) {
      counts = new Map();
      subtopicCounts.set(node, counts);
    }
    const key = subtopicKey(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  };

  const knownTopics = new Map(topics.map((topic) => [topic.id, topic]));

  for (const item of items) {
    const topic = item.topicId ? knownTopics.get(item.topicId) : undefined;
    if (!topic) {
      bump(orphan, item);
      continue;
    }
    let node = nodesByTopicId.get(topic.id);
    if (!node) {
      node = { id: topic.id, label: topic.name, subject: topic.subject, count: 0, subtopics: [] };
      nodesByTopicId.set(topic.id, node);
    }
    bump(node, item);
  }

  const finish = (node: TopicNode): TopicNode => {
    const counts = subtopicCounts.get(node) ?? new Map<string, number>();
    // Dentro do tópico a ordem do currículo é a dos capítulos declarados;
    // capítulos que só existem nos dados vão depois, em ordem alfabética, e
    // "Sem subtópico" fica sempre por último.
    const declared = knownTopics.get(node.id)?.chapters ?? [];
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
      ...node,
      subtopics: ordered.map((id) => ({ id, label: subtopicLabel(id), count: counts.get(id) ?? 0 })),
    };
  };

  return [
    ...topics.filter((topic) => nodesByTopicId.has(topic.id)).map((topic) => finish(nodesByTopicId.get(topic.id)!)),
    ...(orphan.count > 0 ? [finish(orphan)] : []),
  ];
}

/** Aplica os três níveis de filtro. `ALL` em qualquer nível não restringe nada. */
export function filterByHierarchy<T extends HierarchyItem>(
  items: T[],
  filters: { subject?: string; topicId?: string; subtopicId?: string },
  topics: Topic[],
): T[] {
  const { subject = ALL, topicId = ALL, subtopicId = ALL } = filters;
  const knownTopicIds = new Set(topics.map((topic) => topic.id));
  return items.filter((item) => {
    if (subject !== ALL && item.subject !== subject) return false;
    if (topicId !== ALL) {
      if (topicId === WITHOUT_TOPIC_ID) {
        if (item.topicId && knownTopicIds.has(item.topicId)) return false;
      } else if (item.topicId !== topicId) {
        return false;
      }
    }
    if (subtopicId !== ALL && subtopicKey(item) !== subtopicId) return false;
    return true;
  });
}
