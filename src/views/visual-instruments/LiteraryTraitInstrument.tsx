import React, { useId, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { LITERARY_TRAITS, type LiteraryTraitId } from '../../lib/literaryTraitLab';
import { STAGE_LABEL } from '../../lib/visualStudy';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import type { BoardProps } from '../visual-boards/types';
import './LiteraryTraitInstrument.css';

/**
 * Três facetas em cartões ao longo de um eixo — mesmo esquema de
 * `HistoryPhaseInstrument.tsx` (cartão + rótulo de duas linhas + eixo com
 * seta), porque o problema de espaço é o mesmo: rótulos de faceta como
 * "Contexto e desdobramentos" ou "Realismo x Naturalismo" não cabem no
 * círculo pequeno de `GeographyContextInstrument.tsx`, feito para nomes de
 * uma palavra ("Território", "Fluxo"). A diferença semântica para a cena de
 * história é que aqui os três cartões não são momentos no tempo — são
 * facetas (contexto, procedimento, autor/obra) do mesmo movimento ou campo, o
 * que troca `period` por `note`, uma síntese curta, e não uma data.
 */
function wrapText(text: string, maxCharsPerLine = 17): [string, string] {
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

function TraitScene({ id, index }: { id: LiteraryTraitId; index: number }) {
  const config = LITERARY_TRAITS[id];
  const reduced = useReducedMotion();
  const marker = useId().replace(/:/g, '');
  const positions = [95, 230, 365] as const;
  return <svg className="vs-plane" viewBox="0 0 460 280" role="img" aria-label={`${config.title}: ${config.cases[index].label} em foco`} data-literary-trait={id}>
    <defs><marker id={marker} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5 0 7Z" fill="var(--vs-dim)" /></marker></defs>
    <path d="M55 200H405" stroke="var(--vs-line)" strokeWidth="3" />
    <path d="M55 200H385" stroke="var(--vs-dim)" strokeWidth="2" markerEnd={`url(#${marker})`} />
    {config.cases.map((item, itemIndex) => {
      const x = positions[itemIndex];
      const active = itemIndex === index;
      const [labelLine1, labelLine2] = wrapText(item.label);
      const [noteLine1, noteLine2] = wrapText(item.note);
      return <motion.g key={item.label} initial={false} animate={{ scale: active ? 1.05 : 1, opacity: active ? 1 : .6 }} transition={{ duration: reduced ? 0 : .25 }} style={{ transformOrigin: `${x}px 200px` }}>
        <line x1={x} y1="200" x2={x} y2="163" stroke={active ? 'var(--vs-burgundy)' : 'var(--vs-dim)'} strokeWidth="4" />
        <rect x={x - 65} y="40" width="130" height="123" rx="9" fill={active ? 'color-mix(in srgb,var(--vs-burgundy) 22%,var(--vs-paper))' : 'var(--vs-paper)'} stroke={active ? 'var(--vs-burgundy)' : 'var(--vs-dim)'} strokeWidth="3" />
        <text x={x} y="66" textAnchor="middle" fill="var(--vs-ink)" fontSize="11.5" fontWeight="800">{labelLine1}</text>
        {labelLine2 && <text x={x} y="80" textAnchor="middle" fill="var(--vs-ink)" fontSize="11.5" fontWeight="800">{labelLine2}</text>}
        <line x1={x - 40} y1="92" x2={x + 40} y2="92" stroke="var(--vs-line)" strokeWidth="1.5" />
        <text x={x} y="112" textAnchor="middle" fill="var(--vs-dim)" fontSize="9.5">{noteLine1}</text>
        {noteLine2 && <text x={x} y="126" textAnchor="middle" fill="var(--vs-dim)" fontSize="9.5">{noteLine2}</text>}
        <circle cx={x} cy="200" r="7" fill={active ? 'var(--vs-burgundy)' : 'var(--vs-paper)'} stroke={active ? 'var(--vs-burgundy)' : 'var(--vs-ink)'} strokeWidth="3" />
      </motion.g>;
    })}
    {/* `config.relation` já aparece por extenso no painel de equação abaixo do
        `BoardShell`; imprimi-la aqui também vazaria (mesmo problema já
        registrado em `HistoryPhaseInstrument.tsx`), então a cena mostra só o
        rótulo curto do caso selecionado. */}
    <text x="230" y="260" textAnchor="middle" fill="var(--vs-dim)" fontSize="11">{config.cases[index].label}</text>
  </svg>;
}

export function literaryTraitInstrument(id: LiteraryTraitId) {
  const config = LITERARY_TRAITS[id];
  return function LiteraryTraitBoard(props: BoardProps) {
    const [index, setIndex] = useState(0);
    const selected = config.cases[index];
    const pair = boardPair(props);
    const first = props.map.nodes[1] ?? props.map.nodes[0];
    const second = props.map.nodes[2] ?? props.map.nodes.at(-1);
    return <BoardShell kicker="Traços de uma estética" title={config.title} subtitle={config.question}
      condition={{ label: 'Faceta', value: selected.label }} ariaLabel={`Instrumento literário: ${props.map.title}`} emphasis={pair.emphasis}
      scene={<div className="vs-instrument"><TraitScene id={id} index={index} /><div className="vs-plane-controls"><div className="vs-plane-control"><p>Alterne a faceta em foco:</p><div className="vs-literary-trait-options" role="group" aria-label={`Facetas de ${config.title}`}>{config.cases.map((item, itemIndex) => <button key={item.label} type="button" aria-pressed={index === itemIndex} onClick={() => setIndex(itemIndex)}>{item.label}</button>)}</div></div></div><dl className="vs-plane-readouts" aria-live="polite"><div><dt>Em síntese</dt><dd>{selected.note}</dd></div><div><dt>Observe</dt><dd>{selected.observation}</dd></div><div data-pivot="true"><dt>Conclua</dt><dd>{selected.conclusion}</dd></div></dl><p className="vs-instrument-dica">{config.caution}</p></div>}
      left={{ label: STAGE_LABEL[first?.stage ?? 'conceito'], headline: first?.label ?? props.map.title, detail: first?.excerpt ?? config.question, formula: config.relation }} right={{ label: STAGE_LABEL[second?.stage ?? 'aplicacao'], headline: second?.label ?? props.map.title, detail: second?.excerpt ?? selected.observation, formula: selected.conclusion }} leftState={pair.leftState} rightState={pair.rightState} leftSelected={pair.leftSelected} rightSelected={pair.rightSelected} onSelectLeft={pair.selectLeft} onSelectRight={pair.selectRight} equation={{ label: 'Relação da estética', general: config.relation, condition: selected.label, reduced: selected.conclusion }} closing={config.caution} />;
  };
}
