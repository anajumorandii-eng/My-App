import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { LITERARY_TRAITS, type LiteraryTraitId } from '../../lib/literaryTraitLab';
import { STAGE_LABEL } from '../../lib/visualStudy';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import type { BoardProps } from '../visual-boards/types';
import './LiteraryTraitInstrument.css';
import { LITERARY_FACET_ICONS } from './LiteraryFacetIcons';

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

// Cada faceta tem desenho próprio (LiteraryFacetIcons). O texto subiu de 9,5
// para 13,5: no quadro de 460 exibido em ~360 px, a nota caía para ~7 px
// efetivos (auditoria 35).
function TraitScene({ id, index }: { id: LiteraryTraitId; index: number }) {
  const config = LITERARY_TRAITS[id];
  const reduced = useReducedMotion();
  const icones = LITERARY_FACET_ICONS[id];
  const positions = [80, 230, 380] as const;
  return <svg className="vs-plane" viewBox="0 0 460 280" role="img" aria-label={`${config.title}: ${config.cases[index].label} em foco`} data-literary-trait={id}>
    {config.cases.map((item, itemIndex) => {
      const x = positions[itemIndex];
      const active = itemIndex === index;
      const [labelLine1, labelLine2] = wrapText(item.label, 16);
      const [noteLine1, noteLine2] = wrapText(item.note, 19);
      const cor = active ? 'var(--vs-burgundy)' : 'var(--vs-dim)';
      return <motion.g key={item.label} initial={false} animate={{ opacity: active ? 1 : .55 }} transition={{ duration: reduced ? 0 : .25 }}>
        <rect x={x - 66} y="24" width="132" height="120" rx="12" fill={active ? 'color-mix(in srgb,var(--vs-burgundy) 12%,var(--vs-paper))' : 'var(--vs-paper)'} stroke={cor} strokeWidth={active ? 3 : 1.5} />
        <g transform={`translate(${x} 84)`} stroke={cor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: cor }}>{icones[itemIndex]}</g>
        <text x={x} y="170" textAnchor="middle" fill="var(--vs-ink)" fontSize="14" fontWeight="800">{labelLine1}</text>
        {labelLine2 && <text x={x} y="187" textAnchor="middle" fill="var(--vs-ink)" fontSize="14" fontWeight="800">{labelLine2}</text>}
        <text x={x} y={labelLine2 ? 212 : 196} textAnchor="middle" fill="var(--vs-dim)" fontSize="13">{noteLine1}</text>
        {noteLine2 && <text x={x} y={labelLine2 ? 228 : 212} textAnchor="middle" fill="var(--vs-dim)" fontSize="13">{noteLine2}</text>}
      </motion.g>;
    })}
    {/* `config.relation` já aparece por extenso no painel de equação abaixo do
        `BoardShell`; imprimi-la aqui também vazaria (mesmo problema já
        registrado em `HistoryPhaseInstrument.tsx`). */}
    <text x="230" y="264" textAnchor="middle" fill="var(--vs-burgundy)" fontSize="14" fontWeight="800">{config.cases[index].label}</text>
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
