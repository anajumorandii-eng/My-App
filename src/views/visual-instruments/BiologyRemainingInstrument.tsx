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
    case 'blood-groups': return <><circle cx="95" cy="142" r="42" fill={accent} opacity=".8"/><text x="95" y="151" textAnchor="middle" fill="white" fontSize="23">A</text>{[0,1,2,3].map(i => <g key={i} transform={`rotate(${i*90} 95 142)`}><path d="M95 100v-15m-8-7 8 7 8-7" stroke={accent} strokeWidth="3" fill="none"/></g>)}<path d="M143 142h24m-8-7 8 7-8 7" stroke={accent} strokeWidth="3" fill="none"/><circle cx="222" cy="142" r="43" {...line}/><text x="222" y="150" textAnchor="middle" fill="var(--vs-ink)" fontSize="23">{['O','A','B','AB'][value]}</text><text x="95" y="224" textAnchor="middle" fill="var(--vs-ink)" fontSize="12">hemácia · antígeno A</text><text x="222" y="214" textAnchor="middle" fill={accent} fontSize="12">{value === 0 || value === 2 ? 'anti-A presente' : 'sem anti-A'}</text><text x="222" y="232" textAnchor="middle" fill="var(--vs-ink)" fontSize="12">receptor</text></>;
    case 'locomotion': return <><circle cx="154" cy="157" r="13" fill={accent}/><path d="M154 157L61 210m93-53 111-65m-112 65-20-89m20 89 17 91" {...line}/><path d={`M75 196q55 ${-125 * ratio} 110-76`} stroke={accent} fill="none" strokeWidth="6"/></>;
    case 'endocrine': return <><circle cx="97" cy="90" r="32" {...line}/><circle cx="225" cy="90" r="32" {...line}/><circle cx="161" cy="208" r="32" {...line}/><path d="M130 90h62m17 30-37 57m-24 0-37-57" {...line}/><path d="M145 208q-107 5-49-85" stroke={accent} strokeWidth="4" fill="none"/></>;
    case 'inorganic': return <><rect x="55" y="52" width="88" height="139" rx="12" {...line}/><rect x="177" y="52" width="88" height="139" rx="12" {...line}/><path d="M160 45v153" stroke={accent} strokeWidth="7" strokeDasharray="4 5"/><motion.path d="M121 121h77" stroke="var(--vs-blue)" strokeWidth="6" initial={false} animate={{pathLength:ratio}}/></>;
    case 'cytoplasm-one': return <><circle cx="160" cy="145" r="91" {...line}/><path d="M88 185Q139 92 230 129M93 114Q168 204 236 90M78 145h164" stroke={accent} strokeWidth="5" fill="none"/><motion.circle cx="104" cy="145" r="10" fill="var(--vs-blue)" initial={false} animate={{cx:104+100*ratio}}/></>;
    case 'cytoplasm-two': return <><path d="M52 98q30-36 64 0t64 0" {...line}/><path d="M172 86q35-28 66 0t-20 56" {...line}/><circle cx="258" cy="143" r="25" {...line}/><motion.path d="M92 106H218" stroke={accent} strokeWidth="5" strokeDasharray="6 5" initial={false} animate={{pathLength:ratio}}/></>;
    case 'nucleus': return <><circle cx="160" cy="145" r="97" {...line}/><motion.path d="M94 152q25-79 55 0t55 0t35 0" stroke={accent} strokeWidth="7" fill="none" initial={false} animate={{opacity:1-ratio*.55}}/></>;
    case 'chromosome-mutations': return <><path d="M112 75l53 72-53 72m106-144-53 72 53 72" {...line}/><motion.path d="M165 147v72" stroke={accent} strokeWidth="6" initial={false} animate={{opacity:ratio}}/><circle cx="105" cy="241" r="18" {...line}/><circle cx="215" cy="241" r="18" {...line}/></>;
    case 'biotechnology': return <><rect x="112" y="57" width="96" height="147" rx="22" {...line}/><path d="M130 112q30-28 60 0t-60 0M130 150q30-28 60 0t-60 0" stroke={accent} strokeWidth="4" fill="none"/><motion.circle cx="160" cy="92" r="9" fill="var(--vs-blue)" initial={false} animate={{scale:1+ratio*2}}/></>;
    case 'cnidarians': return <><path d="M74 89q31-43 62 0v122q-31 28-62 0Z" {...line}/><path d="M211 79q35 34 0 73m0-73q-35 34 0 73m0-45v118m0-2-31 38m31-38 31 38" {...line}/></>;
    case 'body-plan': return <><ellipse cx="160" cy="145" rx="95" ry="56" {...line}/><motion.ellipse cx="160" cy="145" rx="55" ry="27" fill="var(--vs-burgundy)" initial={false} animate={{opacity:ratio}}/></>;
    case 'insects': case 'arachnids': return <><ellipse cx="160" cy="130" rx="38" ry="58" {...line}/>{Array.from({length:Math.round(value)*2},(_,n)=><path key={n} d={`M${145+(n%2)*30} ${100+Math.floor(n/2)*18}l${n%2?-45:45} ${-26+Math.floor(n/2)*10}`} {...line}/>)}</>;
    case 'fish': return <><path d="M62 145q59-74 136 0-77 74-136 0Zm136 0 58-50v100Z" {...line}/><path d="M100 145h77" stroke={accent} strokeWidth="6"/></>;
    case 'angiosperms': return <><path d="M160 228V126M160 157q-57-45-63-90 55 0 63 60m0 30q57-45 63-90-55 0-63 60" {...line}/><circle cx="160" cy="108" r="29" fill="var(--vs-burgundy)" opacity=".55"/><motion.circle cx="160" cy="189" r="24" fill="var(--vs-blue)" initial={false} animate={{scale:.5+ratio*.5}}/></>;
    case 'procaryotes': return <><rect x="65" y="83" width="94" height="79" rx="39" {...line}/><rect x="164" y="127" width="94" height="79" rx="39" {...line}/><motion.path d="M150 121q26-33 48 17" stroke={accent} strokeWidth="5" fill="none" initial={false} animate={{pathLength:ratio}}/></>;
    case 'senses': return <><path d="M62 145q50-77 100 0-50 77-100 0Z" {...line}/><circle cx="111" cy="145" r="20" fill="var(--vs-burgundy)"/><motion.path d="M170 145h82" stroke="var(--vs-blue)" strokeWidth="6" initial={false} animate={{pathLength:ratio}}/></>;
    case 'reproduction': return <><circle cx="82" cy="145" r="26" {...line}/><circle cx="160" cy="145" r="26" {...line}/><circle cx="238" cy="145" r="26" {...line}/><motion.path d="M108 145h104" stroke={accent} strokeWidth="5" initial={false} animate={{pathLength:ratio}}/></>;
    case 'plant-tissues': return <><path d="M145 227V79m30 148V79" {...line}/><path d="M160 78q-54 10-57-50 44 3 57 48m0 2q54 10 57-50-44 3-57 48" {...line}/><path d="M151 223V85" stroke="var(--vs-blue)" strokeWidth="5"/><path d="M169 223V85" stroke={accent} strokeWidth="5"/></>;
    case 'stems-leaves': return <><path d="M160 227V80m0 54q-56 0-73-47 53-14 73 43m0 25q56 0 73-47-53-14-73 43" {...line}/><motion.circle cx="160" cy="204" r="13" fill="var(--vs-blue)" initial={false} animate={{cy:204-90*ratio}}/></>;
    default: return <><path d="M65 200C115 70 205 70 255 200" {...line}/><motion.path d="M65 200H255" stroke={accent} strokeWidth="6" initial={false} animate={{pathLength:ratio}}/><circle cx="160" cy="140" r="32" fill="var(--vs-blue)" opacity=".35"/></>;
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
