import React from 'react';
import { NODE_STATE_LABEL, STAGE_LABEL, type NodeState, type VisualMap } from '../lib/visualStudy';
import { StudyObjectIcon } from './visual-boards/StudyObjectIcon';
import './HumanitiesWorkspace.css';

/** Seleciona os mesmos IDs do inspetor e do Caderno de Erros. Não cria evidência. */
export function HumanitiesConcepts({ map, states, selectedId, onSelect }: {
  map: VisualMap; states: Record<string, NodeState>; selectedId: string | null; onSelect: (id: string) => void;
}) {
  return <nav className="hu-concepts" aria-label="Conceitos do capítulo">
    <div className="hu-concepts-heading"><strong>Seu percurso neste capítulo</strong><span>Selecione um conceito para abrir o diagnóstico.</span></div>
    <div className="hu-concepts-path">
      {map.nodes.map((node, index) => <button type="button" key={node.id} aria-pressed={selectedId === node.id}
        onClick={() => onSelect(node.id)} className="hu-concept" data-concept-id={node.id}>
        <StudyObjectIcon subject={map.subject} topic={node.label} stage={node.stage} selected={selectedId === node.id} />
        <span><small>{String(index + 1).padStart(2, '0')} · {STAGE_LABEL[node.stage]}</small><strong>{node.label}</strong>
          <em>{NODE_STATE_LABEL[states[node.id] ?? 'nao-avaliado']}</em></span>
      </button>)}
    </div>
  </nav>;
}
