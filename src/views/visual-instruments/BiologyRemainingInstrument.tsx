import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { BIOLOGY_REMAINING, biologyRemainingReadout, type BiologyRemainingId } from '../../lib/biologyRemainingLab';
import { STAGE_LABEL } from '../../lib/visualStudy';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import type { BoardProps } from '../visual-boards/types';

const line = { stroke: 'var(--vs-ink)', strokeWidth: 2.5, fill: 'none' };
const accent = 'var(--vs-burgundy)';
/** O desenho central muda com o mecanismo, sem emprestar a imagem de outro capítulo. */
function BiologyMechanism({ id, value, ratio }: { id: BiologyRemainingId; value: number; ratio: number }) {
  switch (id) {
    case 'genetics-intro': return <><rect x="113" y="54" width="94" height="69" rx="19" {...line}/><text x="160" y="97" textAnchor="middle" fill={accent} fontSize="32">{["AA","Aa","aa"][value]}</text><path d="M160 124v50m0 0-67 28m67-28 67 28" {...line}/><text x="90" y="239" fill="var(--vs-ink)" fontSize="24">{value === 2 ? "a" : "A"}</text><text x="224" y="239" fill="var(--vs-ink)" fontSize="24">{value === 0 ? "A" : "a"}</text></>;
    case 'blood-groups': return <><circle cx="100" cy="145" r="51" fill={accent} opacity=".65"/><circle cx="219" cy="145" r="51" {...line}/><text x="100" y="152" textAnchor="middle" fill="white" fontSize="22">ABO</text><path d="M155 145h12" stroke={accent} strokeWidth="4"/><text x="220" y="152" textAnchor="middle" fill="var(--vs-ink)" fontSize="23">{['O','A','B','AB'][value]}</text></>;
    case 'locomotion': return <><circle cx="154" cy="157" r="13" fill={accent}/><path d="M154 157L61 210m93-53 111-65m-112 65-20-89m20 89 17 91" {...line}/><path d={`M75 196q55 ${-125 * ratio} 110-76`} stroke={accent} fill="none" strokeWidth="6"/></>;
    case 'endocrine': return <><circle cx="97" cy="90" r="32" {...line}/><circle cx="225" cy="90" r="32" {...line}/><circle cx="161" cy="208" r="32" {...line}/><path d="M130 90h62m17 30-37 57m-24 0-37-57" {...line}/><path d="M145 208q-107 5-49-85" stroke={accent} strokeWidth="4" fill="none"/></>;
  }
}
export function biologyRemainingInstrument(id: BiologyRemainingId) {
  const [name, question, label, min, max, step, initial, suffix, relation, insight, stations] = BIOLOGY_REMAINING[id];
  return function BiologyRemainingBoard(props: BoardProps) {
    const [value, setValue] = useState<number>(initial);
    const reduced = useReducedMotion();
    const ratio = (value - min) / (max - min);
    const readout = biologyRemainingReadout(id, value);
    const pair = boardPair(props);
    const first = props.map.nodes[0];
    const second = props.map.nodes[2] ?? props.map.nodes.at(-1);
    return <BoardShell kicker="Laboratório de biologia" title={name} subtitle={question} ariaLabel={`Instrumento de biologia: ${props.map.title}`} condition={{ label, value: readout }} emphasis={pair.emphasis} scene={<div className="vs-instrument"><svg className="vs-plane" viewBox="0 0 320 300" role="img" aria-label={`${name}: ${readout}`}><BiologyMechanism id={id} value={value} ratio={ratio}/><motion.path d="M70 265H250" stroke={accent} strokeWidth="3" fill="none" initial={false} animate={{ pathLength: ratio }} transition={{ duration: reduced ? 0 : .4 }}/><text x="160" y="292" textAnchor="middle" fill="var(--vs-ink)" fontSize="13">{stations.join(' → ')}</text></svg><div className="vs-plane-controls"><div className="vs-plane-control"><label htmlFor={`biology-rem-${id}`}><strong>{label}</strong><span>{question}</span><b aria-live="polite">{id === "genetics-intro" ? ["AA","Aa","aa"][value] : id === "blood-groups" ? ["O","A","B","AB"][value] : `${value}${suffix}`}</b></label><input id={`biology-rem-${id}`} type="range" min={min} max={max} step={step} value={value} onChange={event => setValue(Number(event.target.value))}/></div></div><dl className="vs-plane-readouts"><div data-pivot="true"><dt>Resultado do modelo</dt><dd aria-live="polite">{readout}</dd></div><div><dt>Etapas</dt><dd>{stations.join(' → ')}</dd></div></dl></div>} left={{ label: STAGE_LABEL[first?.stage ?? 'conceito'], headline: first?.label ?? props.map.title, detail: first?.excerpt?.slice(0, 180) ?? '', formula: relation }} right={{ label: STAGE_LABEL[second?.stage ?? 'aplicacao'], headline: second?.label ?? props.map.title, detail: second?.excerpt?.slice(0, 180) ?? '', formula: readout }} leftState={pair.leftState} rightState={pair.rightState} leftSelected={pair.leftSelected} rightSelected={pair.rightSelected} onSelectLeft={pair.selectLeft} onSelectRight={pair.selectRight} equation={{ label: 'Mecanismo', general: relation, condition: 'observa-se', reduced: readout }} closing={insight}/>;
  };
}
