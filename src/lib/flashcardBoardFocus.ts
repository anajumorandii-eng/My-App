import type { Flashcard } from '../types';
import { completeTopicEvidence } from './examEvidence';

/** As seis bancas cadastradas no app, na ordem em que a tela as apresenta. */
export const FLASHCARD_FOCUS_BOARDS = ['FUVEST', 'UNICAMP', 'UNESP', 'FAMERP', 'UNIFESP', 'ENEM'] as const;
export type FlashcardFocusBoard = typeof FLASHCARD_FOCUS_BOARDS[number];

export type BoardFocusLevel = 'frequente' | 'aparece' | 'nao-apareceu' | 'sem-dados';

export interface BoardFocus {
  board: FlashcardFocusBoard;
  level: BoardFocusLevel;
  /** Questões do tópico e da matéria nas provas classificadas da banca. */
  count: number;
  total: number;
  /** Provas em que o tópico apareceu, entre as que classificaram a matéria. */
  editions: number;
  observed: number;
  /** Como a banca cobra, em uma linha: o que treinar ao revisar este cartão. */
  how: string;
}

// Antes, o foco por banca vinha de cinco moldes fixos por capítulo ("FUVEST ·
// 1ª fase", "UNICAMP · CFCR", "VUNESP/FAMERP · DCEA"...), com o mesmo texto
// para todo assunto, inclusive os que a banca nunca cobrou. Aqui o método fica
// em uma linha por banca, e o peso sai das provas classificadas.
// Os roteiros (CFCR, DCEA) são didáticos, não rubricas oficiais; ver
// studyBoardProfiles em src/data/studyProtocols.ts.
const HOW: Record<FlashcardFocusBoard, string> = {
  FUVEST: '1ª fase objetiva com o assunto disfarçado em contexto; 2ª fase discursiva, pontuada por etapa explícita.',
  UNICAMP: 'Discursiva que parte de uma fonte: comando, dado da fonte, conceito e relação de volta à pergunta.',
  UNESP: 'Vunesp: resposta direta, conceito ou cálculo nomeado, explicação e aplicação ao caso.',
  FAMERP: 'Objetivas nos oito componentes; discursivas de Natureza com mecanismo, cálculo e unidade explícitos.',
  UNIFESP: 'Objetivas e discursivas com subitens; justificativa curta e conceito nomeado.',
  ENEM: 'Situação-problema: traduza o contexto para o conceito e aplique sem extrapolar o texto.',
};

const cache = new Map<string, BoardFocus[]>();

function focusFor(board: FlashcardFocusBoard, topicId: string, subject: string): BoardFocus {
  const records = completeTopicEvidence({ id: topicId, subject }, board);
  const count = records.reduce((sum, record) => sum + record.count, 0);
  const total = records.reduce((sum, record) => sum + record.total, 0);
  const observed = records.length;
  const editions = records.filter((record) => record.count > 0).length;
  const level: BoardFocusLevel = !observed || !total
    ? 'sem-dados'
    : count === 0
      ? 'nao-apareceu'
      // Presença em metade das provas sozinha marcava quase tudo como frequente:
      // circuitos aparece em 5 das 10 FUVEST, mas são 5 de 78 questões de Física.
      : editions / observed >= 0.5 && count / total >= 0.08 ? 'frequente' : 'aparece';
  return { board, level, count, total, editions, observed, how: HOW[board] };
}

const LEVEL_RANK: Record<BoardFocusLevel, number> = { frequente: 0, aparece: 1, 'nao-apareceu': 2, 'sem-dados': 3 };

/**
 * Foco de cada banca no tópico do cartão, da que mais cobra para a que menos.
 * Derivado a cada consulta das provas classificadas, nunca gravado no cartão:
 * uma nova prova classificada atualiza todos os cartões do tópico de uma vez.
 * Cartão sem tópico cadastrado não tem incidência para mostrar.
 */
export function flashcardBoardFocus(card: Pick<Flashcard, 'topicId' | 'subject'>): BoardFocus[] {
  if (!card.topicId) return [];
  const key = `${card.subject}:${card.topicId}`;
  const cached = cache.get(key);
  if (cached) return cached;
  const result = FLASHCARD_FOCUS_BOARDS
    .map((board) => focusFor(board, card.topicId!, card.subject))
    .map((focus, index) => ({ focus, index }))
    .sort((a, b) => LEVEL_RANK[a.focus.level] - LEVEL_RANK[b.focus.level]
      || (b.focus.total ? b.focus.count / b.focus.total : 0) - (a.focus.total ? a.focus.count / a.focus.total : 0)
      || a.index - b.index)
    .map(({ focus }) => focus);
  cache.set(key, result);
  return result;
}

/**
 * Bancas em que o tópico do cartão é frequente: o filtro "Bancas" usa esta
 * lista. Com qualquer aparição, quase toda banca casava com quase todo tópico
 * de Biologia, e escolher uma banca não tirava cartão nenhum da sessão.
 */
export function flashcardFocusBoards(card: Pick<Flashcard, 'topicId' | 'subject'>): FlashcardFocusBoard[] {
  return flashcardBoardFocus(card)
    .filter((focus) => focus.level === 'frequente')
    .map((focus) => focus.board);
}

export const BOARD_FOCUS_LABEL: Record<BoardFocusLevel, string> = {
  frequente: 'Frequente',
  aparece: 'Aparece',
  'nao-apareceu': 'Não apareceu',
  'sem-dados': 'Sem provas classificadas',
};

/** Leitura em uma linha, com a base da conta à vista. */
export function describeBoardFocus(focus: BoardFocus, subject: string): string {
  if (focus.level === 'sem-dados') return `Nenhuma prova da ${focus.board} com ${subject} classificada ainda.`;
  return `${focus.count} de ${focus.total} questões de ${subject}, em ${focus.editions} de ${focus.observed} ${focus.observed === 1 ? 'prova' : 'provas'}.`;
}

/** Só para testes: a lista de provas é estática, mas o cache não deve vazar entre casos. */
export function clearFlashcardBoardFocusCache() {
  cache.clear();
}
