import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Minus, Plus, Waypoints } from 'lucide-react';
import { NODE_STATE_LABEL, RELATION_LABEL, STAGE_LABEL, type NodeState, type VisualMap } from '../lib/visualStudy';
import { StudyObjectIcon } from './visual-boards/StudyObjectIcon';

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
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const reduced = useReducedMotion();
  if (map.nodes.length === 0) return null;

  return (
    <section className="vs-branch-map" aria-label="Mapa expansível do capítulo">
      <header className="vs-map-heading">
        <div><Waypoints aria-hidden="true" /><h2>Mapa do capítulo</h2></div>
        <span>Abra um ramo para explorar a etapa.</span>
      </header>
      <div className="vs-map-tree">
        <div className="vs-map-root">
          <StudyObjectIcon subject={map.subject} topic={map.topic} />
          <span>{map.subject}</span>
          <strong>{map.title}</strong>
          <small>{map.nodes.length} etapas conectadas</small>
        </div>
    <ol className="vs-chain vs-map-branches" aria-label="Cadeia de conceitos do capítulo">
      {map.nodes.map((no, i) => {
        const estado: NodeState = states[no.id] ?? 'nao-avaliado';
        // A aresta que chega neste nó. Escondida, o elo vira lacuna.
        const arestaAnterior = i > 0 ? map.edges[i - 1] : null;
        const oculto = escondendo && !!arestaAnterior && hiddenEdgeIds.includes(arestaAnterior.id);

        return (
          <li key={no.id} className="vs-map-branch">
            {i > 0 && (
              <span className={`vs-chain-arrow${oculto ? ' is-oculto' : ''}`} aria-hidden="true">
                {oculto ? '?' : RELATION_LABEL[arestaAnterior?.kind ?? 'consequencia']}
              </span>
            )}
            <button
              type="button"
              className={`vs-chain-link${selectedId === no.id ? ' is-selected' : ''}${oculto ? ' is-oculto' : ''}`}
              data-state={estado}
              onClick={() => onSelect(no.id)}
              aria-pressed={selectedId === no.id}
            >
              <StudyObjectIcon subject={map.subject} stage={no.stage} selected={selectedId === no.id} />
              <span className="vs-map-node-text">
              <span className="vs-chain-stage">{STAGE_LABEL[no.stage]}</span>
              <strong>{no.label}</strong>
              <span className="vs-chain-state">
                <span className="vs-swatch" aria-hidden="true" />
                {oculto ? 'elo a reconstruir' : NODE_STATE_LABEL[estado]}
              </span>
              </span>
            </button>
            <button type="button" className="vs-map-expand"
              aria-expanded={expanded.has(no.id)}
              aria-controls={no.id + '-branch'}
              aria-label={(expanded.has(no.id) ? 'Recolher etapa: ' : 'Expandir etapa: ') + no.label}
              onClick={() => setExpanded(current => {
                const next = new Set(current);
                next.has(no.id) ? next.delete(no.id) : next.add(no.id);
                return next;
              })}>
              {expanded.has(no.id) ? <Minus aria-hidden="true" /> : <Plus aria-hidden="true" />}
            </button>
            <AnimatePresence initial={false}>
              {expanded.has(no.id) && <motion.div id={no.id + '-branch'} className="vs-map-leaf"
                initial={reduced ? false : { opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: reduced ? 0 : 0.2 }}>
                {oculto ? <p>Este elo está oculto. Use a atividade de reconstrução para recuperar a relação.</p> : <p>{no.excerpt}</p>}
                <button type="button" onClick={() => onSelect(no.id)}>Abrir conceito</button>
              </motion.div>}
            </AnimatePresence>
          </li>
        );
      })}
    </ol>
      </div>
    </section>
  );
}

export default ConceptChain;
