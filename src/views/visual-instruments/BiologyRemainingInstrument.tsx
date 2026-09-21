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
    case 'genetics-intro': {
      const genotype = ['AA', 'Aa', 'aa'][value];
      const gametes = value === 0 ? ['A', 'A'] : value === 1 ? ['A', 'a'] : ['a', 'a'];
      return <g data-bio-system="meiosis-segregation">
        <text x="160" y="28" textAnchor="middle" fill="var(--vs-dim)" fontSize="11">célula germinativa · par de homólogos</text>
        <rect x="74" y="46" width="172" height="104" rx="18" fill="var(--vs-paper-strong)" stroke="var(--vs-ink)" strokeWidth="2"/>
        {[0, 1].map((n) => <g key={n} transform={`translate(${116 + n * 58} 62)`}>
          <path d="M0 4c-15 17-15 44 0 61M16 4c15 17 15 44 0 61" stroke={n === 0 ? accent : 'var(--vs-blue)'} strokeWidth="7" fill="none" strokeLinecap="round"/>
          <text x="8" y="39" textAnchor="middle" fill="var(--vs-paper-strong)" fontSize="17" fontWeight="700">{genotype[n]}</text>
        </g>)}
        <path d="M160 151v34m0 0-73 30m73-30 73 30" stroke="var(--vs-ink)" strokeWidth="2.5" fill="none"/>
        <path d="M147 177l13 10 13-10" stroke={accent} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <text x="160" y="174" textAnchor="middle" fill={accent} fontSize="11" fontWeight="700">meiose: os homólogos se separam</text>
        {gametes.map((allele, n) => <g key={`${allele}-${n}`}>
          <circle cx={87 + n * 146} cy="244" r="32" fill="var(--vs-paper-strong)" stroke="var(--vs-blue)" strokeWidth="2.5"/>
          <text x={87 + n * 146} y="251" textAnchor="middle" fill={allele === 'A' ? accent : 'var(--vs-blue)'} fontSize="31" fontWeight="700">{allele}</text>
          <text x={87 + n * 146} y="290" textAnchor="middle" fill="var(--vs-dim)" fontSize="11">gameta</text>
        </g>)}
      </g>;
    }
    case 'blood-groups': {
      const receptor = ['O', 'A', 'B', 'AB'][value];
      const antiA = value === 0 || value === 2;
      return <g data-bio-system="abo-compatibility">
        <text x="76" y="30" textAnchor="middle" fill="var(--vs-dim)" fontSize="11">HEMÁCIA DOADA</text><text x="244" y="30" textAnchor="middle" fill="var(--vs-dim)" fontSize="11">PLASMA RECEPTOR</text>
        <ellipse cx="78" cy="128" rx="55" ry="42" fill="color-mix(in srgb, var(--vs-burgundy) 35%, var(--vs-paper-strong))" stroke={accent} strokeWidth="3"/>
        <ellipse cx="78" cy="128" rx="24" ry="16" fill="none" stroke={accent} strokeWidth="2" opacity=".7"/>
        {[[-39,-20], [39,-20], [-39,20], [39,20]].map(([x,y], i) => <g key={i}><path d={`M${78+x} ${128+y}l${x > 0 ? 9 : -9} ${y > 0 ? 8 : -8}`} stroke={accent} strokeWidth="3"/><text x={78+x+(x > 0 ? 15 : -15)} y={128+y+(y > 0 ? 15 : -10)} textAnchor="middle" fill={accent} fontSize="11" fontWeight="700">A</text></g>)}
        <text x="78" y="194" textAnchor="middle" fill="var(--vs-ink)" fontSize="12">antígenos A</text>
        <rect x="179" y="64" width="122" height="128" rx="18" fill="color-mix(in srgb, var(--vs-blue) 9%, var(--vs-paper-strong))" stroke="var(--vs-blue)" strokeWidth="2.5"/>
        <text x="240" y="93" textAnchor="middle" fill="var(--vs-ink)" fontSize="19" fontWeight="700">tipo {receptor}</text>
        {antiA ? <><path d="M215 129l10-14 10 14 10-14 10 14" stroke={accent} strokeWidth="3" fill="none"/><path d="M210 158l10-14 10 14 10-14 10 14" stroke={accent} strokeWidth="3" fill="none"/><text x="240" y="181" textAnchor="middle" fill={accent} fontSize="11" fontWeight="700">anti-A presente</text></> : <text x="240" y="147" textAnchor="middle" fill="var(--vs-blue)" fontSize="12" fontWeight="700">sem anti-A</text>}
        <path d="M139 128h32" stroke={antiA ? accent : 'var(--vs-blue)'} strokeWidth="4" strokeDasharray={antiA ? '0' : '6 5'} />
        <text x="160" y="238" textAnchor="middle" fill={antiA ? accent : 'var(--vs-blue)'} fontSize="13" fontWeight="700">{antiA ? 'anti-A reconhece A → aglutinação' : 'sem anti-A → transfusão compatível'}</text>
        <text x="160" y="266" textAnchor="middle" fill="var(--vs-dim)" fontSize="11">pergunta: há anticorpo contra o antígeno recebido?</text>
      </g>;
    }
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
    case 'senses': return <g data-bio-system="vision-hearing">
      <text x="82" y="28" textAnchor="middle" fill="var(--vs-dim)" fontSize="11">VISÃO</text><text x="238" y="28" textAnchor="middle" fill="var(--vs-dim)" fontSize="11">AUDIÇÃO</text>
      <path d="M20 103h29" stroke="var(--vs-amber)" strokeWidth="3"/><path d="M25 92h24M25 114h24" stroke="var(--vs-amber)" strokeWidth="2" opacity={.25 + ratio * .75}/>
      <path d="M50 103q44-57 92 0-48 57-92 0Z" fill="var(--vs-paper-strong)" stroke="var(--vs-ink)" strokeWidth="2.5"/>
      <path d="M79 69q-15 34 0 68" fill="none" stroke="var(--vs-blue)" strokeWidth="3"/><ellipse cx="101" cy="103" rx="19" ry="24" fill="color-mix(in srgb, var(--vs-blue) 18%, transparent)" stroke="var(--vs-blue)" strokeWidth="2"/>
      <path d="M121 60q24 43 0 86" fill="none" stroke={accent} strokeWidth="4"/><path d="M143 103h25" stroke={accent} strokeWidth="4"/>
      <text x="56" y="152" textAnchor="middle" fill="var(--vs-ink)" fontSize="10">córnea</text><text x="101" y="165" textAnchor="middle" fill="var(--vs-ink)" fontSize="10">cristalino</text><text x="143" y="152" textAnchor="middle" fill={accent} fontSize="10">retina</text><text x="155" y="179" textAnchor="middle" fill="var(--vs-dim)" fontSize="10">nervo óptico</text>
      <path d="M181 65q-20 15-7 48c7 18 27 21 33 2 6-19-7-31-14-18-5 10 13 17 25 4" fill="none" stroke="var(--vs-ink)" strokeWidth="2.5"/>
      <path d="M219 101h20l7-8 7 8 7-8 7 8" fill="none" stroke="var(--vs-blue)" strokeWidth="3"/>
      <path d="M270 90c30 0 30 46 0 46-30 0-30-46 0-46Zm0 9c18 0 18 28 0 28-18 0-18-28 0-28Z" fill="none" stroke={accent} strokeWidth="3"/>
      <path d="M286 113h22" stroke={accent} strokeWidth="4"/>
      <text x="194" y="155" textAnchor="middle" fill="var(--vs-ink)" fontSize="10">orelha</text><text x="238" y="174" textAnchor="middle" fill="var(--vs-ink)" fontSize="10">ossículos</text><text x="270" y="155" textAnchor="middle" fill={accent} fontSize="10">cóclea</text><text x="297" y="179" textAnchor="middle" fill="var(--vs-dim)" fontSize="10">nervo</text>
      <path d="M30 218h260" stroke="var(--vs-ink)" strokeWidth="1.5" opacity=".35"/>
      <text x="160" y="245" textAnchor="middle" fill={accent} fontSize="13" fontWeight="700">receptor especializado converte estímulo em impulso nervoso</text>
      <text x="160" y="270" textAnchor="middle" fill="var(--vs-dim)" fontSize="11">fotorreceptores na retina · células ciliadas na cóclea</text>
    </g>;
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
