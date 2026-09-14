import type { NodeState, VisualMap } from '../../lib/visualStudy';

/**
 * O que toda prancha recebe.
 *
 * A prancha desenha o conteúdo; ela não decide nem grava nada. Estado e
 * seleção chegam prontos de quem já os calculou a partir das tentativas
 * registradas, e `onSelect` devolve o clique para o mesmo lugar. É isso que
 * mantém a evidência do Visual idêntica à do Caderno de Erros: nenhuma prancha
 * tem como inventar um histórico próprio.
 */
export interface BoardProps {
  map: VisualMap;
  states: Record<string, NodeState>;
  selectedId: string | null;
  onSelect: (id: string) => void;
  hiddenEdgeIds: string[];
  mode: 'explorar' | 'testar' | 'reconstruir';
}
