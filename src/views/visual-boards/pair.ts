import type { NodeState } from '../../lib/visualStudy';
import type { BoardProps } from './types';

/**
 * O par de conceitos que toda prancha contrasta, tirado sempre dos mesmos
 * lugares do mapa.
 *
 * Os dois cartões são os nós 1 e 2 — conceito e aplicação, na ordem fixa de
 * estágios que `applyDeepSummaries` garante. Centralizar aqui é o que impede
 * cada prancha nova de escolher nós por conta própria: se uma pegasse o nó 3 e
 * outra o último, o mesmo estado apareceria em posições diferentes e a leitura
 * de cor deixaria de significar a mesma coisa entre capítulos.
 */
export interface BoardPair {
  leftId: string | null;
  rightId: string | null;
  leftState: NodeState;
  rightState: NodeState;
  leftSelected: boolean;
  rightSelected: boolean;
  emphasis: 'esquerda' | 'direita' | 'nenhum';
  selectLeft: () => void;
  selectRight: () => void;
}

export function boardPair({ map, states, selectedId, onSelect }: BoardProps): BoardPair {
  const leftNode = map.nodes[1] ?? map.nodes[0] ?? null;
  const rightNode = map.nodes[2] ?? map.nodes[map.nodes.length - 1] ?? null;
  const leftId = leftNode?.id ?? null;
  const rightId = rightNode?.id ?? null;

  // Um mapa curto pode devolver o mesmo nó dos dois lados; então a ênfase só
  // vale quando os ids diferem, senão os dois cartões acenderiam juntos.
  const distintos = leftId !== null && rightId !== null && leftId !== rightId;
  const leftSelected = distintos && selectedId === leftId;
  const rightSelected = distintos && selectedId === rightId;

  return {
    leftId, rightId,
    leftState: leftId ? states[leftId] ?? 'nao-avaliado' : 'nao-avaliado',
    rightState: rightId ? states[rightId] ?? 'nao-avaliado' : 'nao-avaliado',
    leftSelected, rightSelected,
    emphasis: leftSelected ? 'esquerda' : rightSelected ? 'direita' : 'nenhum',
    selectLeft: () => leftId && onSelect(leftId),
    selectRight: () => rightId && onSelect(rightId),
  };
}
