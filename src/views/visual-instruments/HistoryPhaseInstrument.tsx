import React, { useId, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { HISTORY_PHASES, type HistoryPhaseId } from '../../lib/historyPhaseLab';
import { STAGE_LABEL } from '../../lib/visualStudy';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import type { BoardProps } from '../visual-boards/types';
import './HistoryPhaseInstrument.css';
import { EngenhoScene } from './EngenhoScene';

/**
 * Quebra um rótulo em no máximo duas linhas por contagem de caractere, não
 * medição real de largura. O limite e a largura do cartão (120 unidades de
 * viewBox) foram conferidos com `getBBox` no navegador para o rótulo mais
 * longo de `HISTORY_PHASES` — "Redemocratização", uma única palavra de 16
 * caracteres que precisa caber sozinha numa linha sem quebrar. A primeira
 * versão desta cena usava cartões de 100 unidades em três posições mais
 * próximas (62/160/258): "Golpe de 1964" vazava sobre o cartão vizinho assim
 * que o cartão ativo crescia 8% pela animação de seleção — os dois cartões já
 * quase se tocavam mesmo parados. Este layout (cartões maiores, mais
 * espaçados, animação de apenas 5%) deixou folga em todos os 10 capítulos × 3
 * casos, conferidos um a um.
 */
function wrapLabel(text: string, maxCharsPerLine = 17): [string, string] {
  if (text.length <= maxCharsPerLine) return [text, ''];
  const words = text.split(' ');
  let first = '';
  let i = 0;
  while (i < words.length && (first ? `${first} ${words[i]}` : words[i]).length <= maxCharsPerLine) {
    first = first ? `${first} ${words[i]}` : words[i];
    i++;
  }
  return [first || words[0], words.slice(first ? i : 1).join(' ')];
}

function TimelineScene({ id, index }: { id: HistoryPhaseId; index: number }) {
  const config = HISTORY_PHASES[id];
  const reduced = useReducedMotion();
  const marker = useId().replace(/:/g, '');
  const positions = [95, 230, 365] as const;
  return <svg className="vs-plane" viewBox="0 0 460 260" role="img" aria-label={`${config.title}: ${config.cases[index].label} em foco`} data-history-phase={id}>
    <defs><marker id={marker} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5 0 7Z" fill="var(--vs-ink-muted)" /></marker></defs>
    <path d="M55 155H405" stroke="var(--vs-line)" strokeWidth="3" />
    <path d="M55 155H385" stroke="var(--vs-ink-muted)" strokeWidth="2" markerEnd={`url(#${marker})`} />
    {config.cases.map((item, itemIndex) => {
      const x = positions[itemIndex];
      const active = itemIndex === index;
      const [labelLine1, labelLine2] = wrapLabel(item.label);
      const labelY = labelLine2 ? 76 : 82;
      return <motion.g key={item.label} initial={false} animate={{ scale: active ? 1.05 : 1, opacity: active ? 1 : .6 }} transition={{ duration: reduced ? 0 : .25 }} style={{ transformOrigin: `${x}px 155px` }}>
        <line x1={x} y1="155" x2={x} y2="118" stroke={active ? 'var(--vs-burgundy)' : 'var(--vs-ink-muted)'} strokeWidth="4" />
        <rect x={x - 60} y="58" width="120" height="66" rx="9" fill={active ? 'color-mix(in srgb,var(--vs-burgundy) 22%,var(--vs-paper))' : 'var(--vs-paper)'} stroke={active ? 'var(--vs-burgundy)' : 'var(--vs-ink-muted)'} strokeWidth="3" />
        <text x={x} y={labelY} textAnchor="middle" fill="var(--vs-ink)" fontSize="11" fontWeight="800">{labelLine1}</text>
        {labelLine2 && <text x={x} y={labelY + 13} textAnchor="middle" fill="var(--vs-ink)" fontSize="11" fontWeight="800">{labelLine2}</text>}
        <text x={x} y="110" textAnchor="middle" fill="var(--vs-ink-muted)" fontSize="9.5">{item.period}</text>
        <circle cx={x} cy="155" r="7" fill={active ? 'var(--vs-burgundy)' : 'var(--vs-paper)'} stroke={active ? 'var(--vs-burgundy)' : 'var(--vs-ink)'} strokeWidth="3" />
      </motion.g>;
    })}
    {/* A fórmula completa (`config.relation`) já aparece no painel de equação
        abaixo do BoardShell, em texto HTML que quebra linha livremente. Uma
        cena de teste mostrou essa mesma string, mais longa que a de qualquer
        caso individual, vazando pelos dois lados do viewBox de 320px quando
        desenhada aqui dentro — por isso a cena mostra só o rótulo do caso
        selecionado, curto o bastante para caber. */}
    <text x="230" y="238" textAnchor="middle" fill="var(--vs-ink-muted)" fontSize="11">{config.cases[index].label} · {config.cases[index].period}</text>
  </svg>;
}

export function historyPhaseInstrument(id: HistoryPhaseId) {
  const config = HISTORY_PHASES[id];
  return function HistoryPhaseBoard(props: BoardProps) {
    const [index, setIndex] = useState(0);
    const selected = config.cases[index];
    const pair = boardPair(props);
    const first = props.map.nodes[1] ?? props.map.nodes[0];
    const second = props.map.nodes[2] ?? props.map.nodes.at(-1);
    return <BoardShell
      kicker="Linha do tempo comparada"
      title={config.title}
      subtitle={config.question}
      condition={{ label: 'Momento', value: selected.label }}
      ariaLabel={`Instrumento histórico: ${props.map.title}`}
      emphasis={pair.emphasis}
      scene={<div className="vs-instrument">
        {id === 'dinamica-interna-colonizacao' ? <EngenhoScene index={index} label={selected.label} /> : <TimelineScene id={id} index={index} />}
        <div className="vs-plane-controls"><div className="vs-plane-control">
          <p>Percorra a linha do tempo:</p>
          <div className="vs-history-phase-options" role="group" aria-label={`Momentos de ${config.title}`}>
            {config.cases.map((item, itemIndex) => <button key={item.label} type="button" aria-pressed={index === itemIndex} onClick={() => setIndex(itemIndex)}>{item.label}</button>)}
          </div>
        </div></div>
        <dl className="vs-plane-readouts" aria-live="polite">
          <div><dt>Quando</dt><dd>{selected.period}</dd></div>
          <div><dt>Observe</dt><dd>{selected.observation}</dd></div>
          <div data-pivot="true"><dt>Conclua</dt><dd>{selected.conclusion}</dd></div>
        </dl>
        <p className="vs-instrument-dica">{config.caution}</p>
      </div>}
      left={{ label: STAGE_LABEL[first?.stage ?? 'conceito'], headline: first?.label ?? props.map.title, detail: first?.excerpt ?? config.question, formula: config.relation }}
      right={{ label: STAGE_LABEL[second?.stage ?? 'aplicacao'], headline: second?.label ?? props.map.title, detail: second?.excerpt ?? selected.observation, formula: selected.conclusion }}
      leftState={pair.leftState}
      rightState={pair.rightState}
      leftSelected={pair.leftSelected}
      rightSelected={pair.rightSelected}
      onSelectLeft={pair.selectLeft}
      onSelectRight={pair.selectRight}
      equation={{ label: 'Relação histórica', general: config.relation, condition: selected.label, reduced: selected.conclusion }}
      closing={config.caution}
    />;
  };
}
