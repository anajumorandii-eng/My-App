import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { NODE_STATE_LABEL, type NodeState } from '../../lib/visualStudy';
import type { BoardProps } from './types';
import './IndependenceBoard.css';

type Focus = 'processo' | 'guerras' | 'continuidades' | 'nenhum';

function stateFor(states: Record<string, NodeState>, id?: string): NodeState {
  return id ? states[id] ?? 'nao-avaliado' : 'nao-avaliado';
}

/**
 * The declaration on 7 September is one event in a process, not its ending.
 * The horizontal route holds the political rupture; the three persistent
 * tracks make the social and economic continuities legible at the same time.
 */
export default function IndependenceBoard({ map, states, selectedId, onSelect }: BoardProps) {
  const reducedMotion = useReducedMotion();
  const [processo, guerras, continuidades] = map.nodes;
  const focus: Focus = selectedId === guerras?.id ? 'guerras'
    : selectedId === continuidades?.id ? 'continuidades'
      : selectedId === processo?.id ? 'processo' : 'nenhum';
  const cards = [
    { key: 'processo' as const, node: processo, title: 'O conflito vem antes do grito', detail: 'Cortes recolonizadoras, Dia do Fico e apoio de elites ajudam a explicar a ruptura política.' },
    { key: 'guerras' as const, node: guerras, title: '1822 não encerra o processo', detail: 'Bahia, Maranhão, Pará e Piauí tiveram resistência; a Bahia se consolidou em 2 de julho de 1823.' },
    { key: 'continuidades' as const, node: continuidades, title: 'A estrutura atravessa a mudança', detail: 'Escravidão, terra concentrada e monarquia permaneceram apesar da separação de Portugal.' },
  ];

  return <section className="independence-board vs-study-board" data-testid="visual-study-board" aria-label="Prancha da Independência do Brasil: ruptura política, guerras de consolidação e continuidades estruturais">
    <header className="independence-board__head">
      <div><span className="vs-board-kicker">História · processo, não efeméride</span><h2>A independência muda o governo — não apaga a estrutura.</h2><p>7 de setembro é uma passagem no processo. A consolidação envolve guerras regionais, e o país independente conserva pilares coloniais.</p></div>
      <div className="independence-board__seal"><span>1821–1823</span><strong>ruptura política</strong></div>
    </header>

    <p className="independence-board__hint">Percorra a prancha na horizontal para acompanhar 1821–1823. Com o foco na prancha, use as setas do teclado.</p>
    <div className="independence-board__viewport" tabIndex={0} role="region" aria-label="Percorrer a prancha da Independência" onKeyDown={event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        event.currentTarget.scrollBy({ left: event.key === 'ArrowRight' ? 160 : -160, behavior: reducedMotion ? 'instant' : 'smooth' });
      }
    }}>
    <div className="independence-board__map" data-focus={focus} role="img" aria-label="Linha do processo entre 1821 e julho de 1823, com Cortes recolonizadoras, Dia do Fico, 7 de setembro, guerras provinciais e consolidação da Bahia; abaixo, escravidão, terra concentrada e monarquia continuam">
      <svg viewBox="0 0 920 440" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs><linearGradient id="independence-paper" x1="0" x2="1"><stop stopColor="#f6eddd"/><stop offset="1" stopColor="#e9dcc5"/></linearGradient><marker id="independence-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 7 3 0 6Z" fill="#923d3e"/></marker></defs>
        <rect width="920" height="440" rx="18" fill="url(#independence-paper)"/>
        <path className="independence-board__route" d="M86 132H815" opacity=".25" markerEnd="url(#independence-arrow)"/>
        <motion.path initial={false} className="independence-board__route" d="M86 132H815" animate={{pathLength: focus === 'processo' ? .53 : 1}} transition={{duration: reducedMotion ? 0 : .8}}/>
        {[[110,'1821','Cortes\nrecolonizadoras'],[285,'jan. 1822','Dia do Fico'],[470,'7 set. 1822','proclamação'],[650,'1822–23','guerras\nprovinciais'],[812,'2 jul. 1823','Bahia\nconsolidada']].map(([x,date,label]) => <g key={String(x)} className="independence-board__event"><circle cx={x as number} cy="132" r="20"/><text x={x as number} y="94">{date as string}</text><text x={x as number} y="177">{String(label).split('\n').map((part, i) => <tspan key={part} x={x as number} dy={i ? 17 : 0}>{part}</tspan>)}</text></g>)}
        <path className="independence-board__connector" d="M650 153v54"/><path className="independence-board__connector" d="M812 153v54"/>
        <g className="independence-board__war"><path d="M573 234c37-30 87-30 128 0s90 30 138 0"/><text x="565" y="263">Bahia · Maranhão · Pará · Piauí</text><text x="565" y="284">tropas, voluntários e participação popular</text></g>
        {[[128,'escravidão','permanece após 1822'],[394,'terra concentrada','sem redistribuição'],[670,'monarquia / Bragança','continuidade dinástica']].map(([x,title,note]) => <g key={String(x)} className="independence-board__track"><path d={`M${x} 348h194`}/><circle cx={x} cy="348" r="7"/><text x={x} y="380">{title}</text><text x={x} y="401">{note}</text></g>)}
        <text className="independence-board__legend" x="48" y="327">CONTINUIDADES ESTRUTURAIS</text>
      </svg>
      <p><strong>Ruptura político-administrativa com Portugal</strong><span>não é sinônimo de ruptura social completa.</span></p>
    </div>
    </div>

    <div className="independence-board__cards" aria-label="Eixos para estudar a Independência do Brasil">
      {cards.map((card) => { const state = stateFor(states, card.node?.id); const active = focus === card.key; return <button key={card.key} type="button" data-active={active || undefined} data-state={state} onClick={() => card.node && onSelect(card.node.id)}><small>{NODE_STATE_LABEL[state]}</small><strong>{card.title}</strong><span>{card.detail}</span></button>; })}
    </div>
    <footer><strong>Pegadinha de prova:</strong> não trate 7 de setembro como fim automático das guerras, nem a separação política como abolição, reforma agrária ou república.</footer>
  </section>;
}
