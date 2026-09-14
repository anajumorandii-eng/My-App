import React from 'react';
import { NODE_STATE_LABEL, STAGE_LABEL, type NodeState, type VisualMap } from '../lib/visualStudy';

/**
 * A cadeia de conceitos do capítulo, com o estado de cada elo.
 *
 * A referência aprovada traz isso como "Q = 0 → Trabalho → Energia interna →
 * Temperatura": a sequência que liga a condição ao que se observa. No Crivo essa
 * sequência não precisou ser inventada — são os cinco nós do mapa, na ordem fixa
 * de estágios, e a cor de cada elo sai da mesma evidência do Caderno de Erros.
 *
 * Em Reconstruir, o elo cujo vínculo o diagnóstico escondeu aparece como `?`.
 * É o ponto da quinta referência: ver **onde** está o buraco na estrutura, e não
 * só ler uma lista de lacunas embaixo da prancha. A reconstrução em si continua
 * acontecendo no formulário abaixo, com a mesma avaliação de sempre — aqui é
 * leitura, não uma segunda porta de resposta, porque duas portas fariam o mapa e
 * o Caderno discordarem sobre a mesma aluna.
 *
 * Vive fora do `BoardShell` de propósito: assim vale para as 26 pranchas, para o
 * instrumento manipulável e também para o capítulo que só tem o aviso — que é
 * justamente quem mais precisa de alguma estrutura na tela.
 */
export function ConceptChain({
  map, states, selectedId, onSelect, hiddenEdgeIds, escondendo,
}: {
  map: VisualMap;
  states: Record<string, NodeState>;
  selectedId: string | null;
  onSelect: (id: string) => void;
  hiddenEdgeIds: string[];
  /** Verdadeiro em Reconstruir: é quando o `?` faz sentido. */
  escondendo: boolean;
}) {
  if (map.nodes.length === 0) return null;

  return (
    <ol className="vs-chain" aria-label="Cadeia de conceitos do capítulo">
      {map.nodes.map((no, i) => {
        const estado: NodeState = states[no.id] ?? 'nao-avaliado';
        // A aresta que chega neste nó. Escondida, o elo vira lacuna.
        const arestaAnterior = i > 0 ? map.edges[i - 1] : null;
        const oculto = escondendo && !!arestaAnterior && hiddenEdgeIds.includes(arestaAnterior.id);

        return (
          <li key={no.id}>
            {i > 0 && (
              <span className={`vs-chain-arrow${oculto ? ' is-oculto' : ''}`} aria-hidden="true">
                {oculto ? '?' : '→'}
              </span>
            )}
            <button
              type="button"
              className={`vs-chain-link${selectedId === no.id ? ' is-selected' : ''}${oculto ? ' is-oculto' : ''}`}
              data-state={estado}
              onClick={() => onSelect(no.id)}
            >
              <span className="vs-chain-stage">{STAGE_LABEL[no.stage]}</span>
              <strong>{no.label}</strong>
              <span className="vs-chain-state">
                <span className="vs-swatch" aria-hidden="true" />
                {oculto ? 'elo a reconstruir' : NODE_STATE_LABEL[estado]}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

export default ConceptChain;
