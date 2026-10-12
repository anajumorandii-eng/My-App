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

/**
 * `porEtapa`: sem nó selecionado, a etapa do palco escolhe a ênfase — conceito
 * acende o lado do nó 1, aplicação o do nó 2. As pranchas autorais já animam a
 * cena pela ênfase (o pistão expande ou comprime, a lente converge ou diverge),
 * então é isso que faz a cena mudar quando a estudante troca de etapa. Opt-in:
 * prancha que não pede continua só com a seleção.
 */
export function boardPair({ map, states, selectedId, onSelect, activeStep }: BoardProps, options: { porEtapa?: boolean } = {}): BoardPair {
  const leftNode = map.nodes[1] ?? map.nodes[0] ?? null;
  const rightNode = map.nodes[2] ?? map.nodes[map.nodes.length - 1] ?? null;
  const leftId = leftNode?.id ?? null;
  const rightId = rightNode?.id ?? null;

  // Um mapa curto pode devolver o mesmo nó dos dois lados; então a ênfase só
  // vale quando os ids diferem, senão os dois cartões acenderiam juntos.
  const distintos = leftId !== null && rightId !== null && leftId !== rightId;
  const leftSelected = distintos && selectedId === leftId;
  const rightSelected = distintos && selectedId === rightId;

  const etapa = (): BoardPair['emphasis'] => {
    if (!options.porEtapa || !distintos || selectedId || activeStep === undefined) return 'nenhum';
    const stage = map.nodes[activeStep]?.stage;
    return stage === 'conceito' ? 'esquerda' : stage === 'aplicacao' ? 'direita' : 'nenhum';
  };

  return {
    leftId, rightId,
    leftState: leftId ? states[leftId] ?? 'nao-avaliado' : 'nao-avaliado',
    rightState: rightId ? states[rightId] ?? 'nao-avaliado' : 'nao-avaliado',
    leftSelected, rightSelected,
    emphasis: leftSelected ? 'esquerda' : rightSelected ? 'direita' : etapa(),
    selectLeft: () => leftId && onSelect(leftId),
    selectRight: () => rightId && onSelect(rightId),
  };
}
