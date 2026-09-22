import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { WRITING_INSTRUMENTS, writingInstrumentState, type WritingInstrumentId } from '../../lib/writingInstrumentLab';
import { STAGE_LABEL } from '../../lib/visualStudy';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import type { BoardProps } from '../visual-boards/types';

const ink = { fontWeight: 800, fill: 'var(--vs-ink)' } as const;
const accent = { fontWeight: 800, fill: 'var(--vs-burgundy)' } as const;

function WritingScene({ id, selected }: { id: WritingInstrumentId; selected: number }) {
  const state = writingInstrumentState(id, selected);
  const scene = WRITING_INSTRUMENTS[id].scene;
  const reduced = useReducedMotion();
  const transition = { duration: reduced ? 0 : .28, ease: 'easeOut' as const };
  if (scene === 'prompt') return <>
    <text x="24" y="38" style={{ ...accent, fontSize: 15 }}>leia o comando antes do rascunho</text>
    {[102, 68, 34].map((radius, item) => <motion.circle key={radius} cx="160" cy="150" r={radius} fill={item === selected ? 'color-mix(in srgb, var(--vs-burgundy) 14%, transparent)' : 'transparent'} initial={false} animate={{ stroke: item === selected ? 'var(--vs-burgundy)' : 'var(--vs-ink-muted)', strokeWidth: item === selected ? 5 : 2, opacity: item === selected ? 1 : .45 }} transition={transition} />)}
    <text x="160" y="144" textAnchor="middle" style={accent}>{selected === 0 ? 'EIXO' : selected === 1 ? 'RECORTE' : 'RESPOSTA'}</text><text x="160" y="166" textAnchor="middle" style={{ ...ink, fontSize: 11 }}>{selected === 0 ? 'amplo' : selected === 1 ? 'pedido' : 'da tese'}</text>
    <motion.path d="M54 250H266" stroke="var(--vs-ink-muted)" strokeWidth="3" initial={false} animate={{ pathLength: .35 + selected * .3 }} transition={transition} /><circle cx={54 + selected * 106} cy="250" r="9" fill="var(--vs-burgundy)"/><text x="160" y="282" textAnchor="middle" style={ink}>{state.label}</text>
  </>;
  if (scene === 'genre') return <>
    <text x="24" y="38" style={{ ...accent, fontSize: 15 }}>a forma também responde à proposta</text>
    {[['quem lê', 38], ['voz', 107], ['função', 176], ['efeito', 245]].map(([label, x], item) => <g key={String(label)}><motion.rect x={Number(x)} y={94 + (item === selected ? -12 : 0)} width="46" height="104" rx="10" fill="var(--vs-paper)" initial={false} animate={{ stroke: item === selected ? 'var(--vs-burgundy)' : 'var(--vs-ink-muted)', strokeWidth: item === selected ? 5 : 2 }} transition={transition}/><text x={Number(x)+23} y="132" textAnchor="middle" style={{ ...ink, fontSize: 10 }}>{label}</text><motion.path d={`M${Number(x)+11} 155H${Number(x)+35}`} stroke={item <= selected ? 'var(--vs-burgundy)' : 'var(--vs-ink-muted)'} strokeWidth="4" initial={false} animate={{ pathLength: item <= selected ? 1 : .25 }} transition={transition}/></g>)}
    <text x="160" y="246" textAnchor="middle" style={accent}>{state.label}</text><text x="160" y="278" textAnchor="middle" style={ink}>estrutura guiada por interlocutor</text>
  </>;
  if (scene === 'source') return <>
    <text x="24" y="38" style={{ ...accent, fontSize: 15 }}>coletânea: pista, não molde</text>
    {[['fonte A', 38], ['leitura', 134], ['texto', 230]].map(([label, x], item) => <g key={String(label)}><motion.rect x={Number(x)} y="78" width="52" height="112" rx="8" fill="var(--vs-paper)" initial={false} animate={{ stroke: item === selected ? 'var(--vs-burgundy)' : 'var(--vs-ink-muted)', strokeWidth: item === selected ? 5 : 2, opacity: item === 2 && selected === 0 ? .45 : 1 }} transition={transition}/><path d={`M${Number(x)+12} 108H${Number(x)+40}M${Number(x)+12} 124H${Number(x)+35}M${Number(x)+12} 140H${Number(x)+39}`} stroke="var(--vs-ink-muted)" strokeWidth="3"/><text x={Number(x)+26} y="174" textAnchor="middle" style={{ ...ink, fontSize: 10 }}>{label}</text>{item < 2 && <motion.path d={`M${Number(x)+58} 135H${Number(x)+89}`} stroke="var(--vs-burgundy)" strokeWidth="3" initial={false} animate={{ pathLength: item < selected ? 1 : .25 }} transition={transition}/>}</g>)}
    <text x="160" y="230" textAnchor="middle" style={accent}>{state.label}</text><text x="160" y="265" textAnchor="middle" style={{ ...ink, fontSize: 12 }}>compreender → reformular → argumentar</text>
  </>;
  if (scene === 'repertoire') return <>
    <text x="24" y="38" style={{ ...accent, fontSize: 15 }}>referência só vale quando explica</text>
    <motion.rect x="28" y="85" width="76" height="96" rx="12" fill="var(--vs-paper)" initial={false} animate={{ stroke: selected === 0 ? 'var(--vs-burgundy)' : 'var(--vs-ink)', strokeWidth: selected === 0 ? 5 : 2 }} transition={transition}/><text x="66" y="128" textAnchor="middle" style={accent}>LENTE</text><text x="66" y="150" textAnchor="middle" style={{ ...ink, fontSize: 10 }}>conceito</text>
    <motion.path d="M112 133H203" stroke="var(--vs-burgundy)" strokeWidth="4" initial={false} animate={{ pathLength: .35 + selected * .3 }} transition={transition}/><text x="158" y="122" textAnchor="middle" style={{ ...accent, fontSize: 10 }}>mecanismo</text>
    <motion.rect x="211" y="85" width="80" height="96" rx="12" fill="var(--vs-paper)" initial={false} animate={{ stroke: selected === 2 ? 'var(--vs-burgundy)' : 'var(--vs-ink)', strokeWidth: selected === 2 ? 5 : 2 }} transition={transition}/><text x="251" y="128" textAnchor="middle" style={accent}>TESE</text><text x="251" y="150" textAnchor="middle" style={{ ...ink, fontSize: 10 }}>explicada</text>
    <circle cx={66 + selected * 92} cy="224" r="8" fill="var(--vs-burgundy)"/><path d="M66 224H250" stroke="var(--vs-ink-muted)" strokeWidth="3"/><text x="160" y="264" textAnchor="middle" style={ink}>{state.label}</text>
  </>;
  if (scene === 'theme') return <>
    <text x="24" y="38" style={{ ...accent, fontSize: 15 }}>um recorte por vez, com profundidade</text>
    <motion.rect x="27" y="91" width="78" height="88" rx="12" fill="var(--vs-paper)" initial={false} animate={{ stroke: selected === 0 ? 'var(--vs-burgundy)' : 'var(--vs-ink)', strokeWidth: selected === 0 ? 5 : 2 }} transition={transition}/><text x="66" y="130" textAnchor="middle" style={accent}>EIXO</text><text x="66" y="150" textAnchor="middle" style={{ ...ink, fontSize: 10 }}>amplo</text>
    <motion.path d="M112 135H205" stroke="var(--vs-burgundy)" strokeWidth="4" initial={false} animate={{ pathLength: .35 + selected * .3 }} transition={transition}/><text x="158" y="122" textAnchor="middle" style={{ ...accent, fontSize: 10 }}>delimitar</text>
    <motion.rect x="213" y="91" width="80" height="88" rx="12" fill="var(--vs-paper)" initial={false} animate={{ stroke: selected === 2 ? 'var(--vs-burgundy)' : 'var(--vs-ink)', strokeWidth: selected === 2 ? 5 : 2 }} transition={transition}/><text x="253" y="130" textAnchor="middle" style={accent}>TESE</text><text x="253" y="150" textAnchor="middle" style={{ ...ink, fontSize: 10 }}>focada</text>
    <text x="160" y="229" textAnchor="middle" style={accent}>{state.label}</text><text x="160" y="264" textAnchor="middle" style={ink}>fator → consequência → posição</text>
  </>;
  if (id === 'evaluation') return <>
    <text x="24" y="42" style={{ ...accent, fontSize: 16 }}>folha de correção</text><path d="M24 57H296" stroke="var(--vs-ink-muted)" strokeWidth="2" strokeDasharray="4 4"/>
    {[['C1','norma'], ['C2','tema'], ['C3','tese'], ['C4','coesão'], ['C5','ação']].map(([code, cue], item) => <g key={code}><motion.rect x={18 + item * 59} y="90" width="48" height="120" rx="10" fill="var(--vs-paper)" initial={false} animate={{ stroke: item === selected ? 'var(--vs-burgundy)' : 'var(--vs-ink-muted)', strokeWidth: item === selected ? 5 : 2, y: item === selected ? 82 : 90 }} transition={transition} /><text x={42 + item * 59} y="137" textAnchor="middle" style={item === selected ? accent : ink}>{code}</text><text x={42 + item * 59} y="161" textAnchor="middle" style={{ fill: 'var(--vs-ink-muted)', fontSize: 10, fontWeight: 700 }}>{cue}</text><circle cx={42 + item * 59} cy="185" r={item === selected ? 8 : 5} fill={item === selected ? 'var(--vs-burgundy)' : 'var(--vs-ink-muted)'}/></g>)}
    <text x="160" y="252" textAnchor="middle" style={accent}>{state.label}</text>
  </>;
  if (id === 'idea-map') return <>
    <rect x="21" y="24" width="278" height="244" rx="13" fill="var(--vs-paper)" stroke="var(--vs-ink-muted)" strokeWidth="2"/><path d="M38 45H282" stroke="var(--vs-ink-muted)" strokeWidth="2" strokeDasharray="3 5"/>
    <circle cx="160" cy="145" r="42" fill="color-mix(in srgb,var(--vs-burgundy) 15%,var(--vs-paper))" stroke="var(--vs-burgundy)" strokeWidth="5" />
    {[[55,225,'causa'], [120,65,'recorte'], [200,65,'efeito'], [265,225,'ação']].map(([x, y, cue], index) => <g key={String(cue)}><motion.path d={`M160 145L${x} ${y}`} stroke="var(--vs-ink-muted)" strokeWidth="3" initial={false} animate={{ pathLength: selected === 0 ? .55 : 1, opacity: selected === 0 ? .55 : 1 }} transition={transition} /><motion.rect x={Number(x)-28} y={Number(y)-16} width="56" height="32" rx="8" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="2" initial={false} animate={{ scale: selected === 1 ? 1.08 : 1, stroke: selected === index ? 'var(--vs-burgundy)' : 'var(--vs-ink)' }} transition={transition}/><text x={x} y={Number(y)+4} textAnchor="middle" style={{...ink,fontSize:11,fontWeight:800}}>{cue}</text></g>)}
    <text x="160" y="151" textAnchor="middle" style={accent}>{selected === 0 ? 'TEMA' : selected === 1 ? 'TESE' : 'PLANO'}</text><text x="160" y="286" textAnchor="middle" style={ink}>{state.label}</text>
  </>;
  if (id === 'repertoire') return <>
    <text x="34" y="47" style={{...ink,fontSize:14}}>repertório só vale quando vira prova</text><rect x="28" y="75" width="94" height="112" rx="12" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3" /><rect x="198" y="75" width="94" height="112" rx="12" fill="var(--vs-paper)" stroke="var(--vs-burgundy)" strokeWidth="3" />
    <path d="M44 105H105M44 120H99M44 135H87" stroke="var(--vs-ink-muted)" strokeWidth="3"/><text x="75" y="165" textAnchor="middle" style={{...ink,fontSize:11}}>referência</text><text x="245" y="113" textAnchor="middle" style={{...accent,fontSize:13}}>TESE</text><text x="245" y="140" textAnchor="middle" style={{...ink,fontSize:11}}>explicada</text>
    <motion.path d="M128 132H191" stroke="var(--vs-burgundy)" initial={false} animate={{ strokeWidth: 3 + selected * 3, pathLength: selected === 0 ? .45 : selected === 1 ? .75 : 1, opacity: selected === 0 ? .55 : 1 }} transition={transition} strokeDasharray={selected === 0 ? '5 6' : undefined} /><text x="160" y="124" textAnchor="middle" style={{...accent,fontSize:12}}>ponte</text><text x="160" y="230" textAnchor="middle" style={accent}>{state.label}</text>
  </>;
  if (id === 'theme-axes') return <>
    <path d="M42 148H278M160 36V250" stroke="var(--vs-ink-muted)" strokeWidth="2" strokeDasharray="5 6"/>{['sociedade','problema','recorte'].map((name,item)=><g key={name}><motion.circle cx="160" cy="145" r={105-item*30} fill={item===selected?'color-mix(in srgb,var(--vs-burgundy) 13%,transparent)':'transparent'} initial={false} animate={{ stroke: item === selected ? 'var(--vs-burgundy)' : 'var(--vs-ink-muted)', strokeWidth: item === selected ? 6 : 2, opacity: item === selected ? 1 : .45 }} transition={transition}/><text x={160} y={45+item*30} textAnchor="middle" style={{...ink,fontSize:11}}>{name}</text></g>)}
    <text x="160" y="151" textAnchor="middle" style={accent}>{selected === 0 ? 'EIXO' : selected === 1 ? 'RECORTE' : 'TENSÃO'}</text><text x="160" y="282" textAnchor="middle" style={ink}>{state.label}</text>
  </>;
  return <>
    {[0, 1, 2].map((item) => <g key={item}><motion.rect x={28 + item * 98} y="95" width="78" height="92" rx="10" fill="var(--vs-paper)" initial={false} animate={{ stroke: item <= selected ? 'var(--vs-burgundy)' : 'var(--vs-ink-muted)', strokeWidth: item === selected ? 5 : 2, opacity: item <= selected ? 1 : .45 }} transition={transition} /><text x={67 + item * 98} y="147" textAnchor="middle" style={item === selected ? accent : ink}>{['MITO 1', 'MITO 2', 'BANCAS'][item]}</text>{item < 2 && <motion.path d={`M${108 + item * 98} 141H${124 + item * 98}`} stroke="var(--vs-ink-muted)" strokeWidth="3" initial={false} animate={{ pathLength: selected > item ? 1 : .25 }} transition={transition} />}</g>)}
    <text x="160" y="245" textAnchor="middle" style={accent}>{state.label}</text>
  </>;
}

export function writingInstrument(id: WritingInstrumentId) {
  const config = WRITING_INSTRUMENTS[id];
  return function WritingBoard(props: BoardProps) {
    const [selected, setSelected] = useState(0);
    const state = writingInstrumentState(id, selected);
    const pair = boardPair(props);
    const first = props.map.nodes[1] ?? props.map.nodes[0];
    const second = props.map.nodes[2] ?? props.map.nodes.at(-1);
    return <BoardShell kicker="Ateliê de argumentação" title={config.name} subtitle={config.question} condition={{ label: config.controlLabel, value: state.label }} ariaLabel={`Instrumento de redação: ${props.map.title}`} emphasis={pair.emphasis}
      scene={<div className="vs-instrument"><svg className="vs-plane" viewBox="0 0 320 300" role="img" aria-label={`${config.name}; ${state.label}: ${state.diagnosis}`}><WritingScene id={id} selected={selected} /></svg><p className="vs-instrument-dica">mude a decisão e observe o efeito no projeto do texto</p><div className="vs-plane-controls"><div className="vs-plane-control"><label htmlFor={`writing-${id}`}><strong>{config.controlLabel}</strong><span>{config.controlDescription}</span><b>{state.label}</b></label><input id={`writing-${id}`} type="range" min="0" max={config.states.length - 1} step="1" value={selected} aria-valuetext={state.label} onChange={(event) => setSelected(Number(event.target.value))} /></div></div><dl className="vs-plane-readouts"><div data-pivot="true"><dt>Diagnóstico</dt><dd>{state.diagnosis}</dd></div><div><dt>Próxima ação</dt><dd>{state.action}</dd></div></dl></div>}
      left={{ label: STAGE_LABEL[first?.stage ?? 'conceito'], headline: first?.label ?? props.map.title, detail: first?.excerpt ?? '', formula: config.relation }} right={{ label: STAGE_LABEL[second?.stage ?? 'aplicacao'], headline: second?.label ?? props.map.title, detail: second?.excerpt ?? '', formula: state.example }} leftState={pair.leftState} rightState={pair.rightState} leftSelected={pair.leftSelected} rightSelected={pair.rightSelected} onSelectLeft={pair.selectLeft} onSelectRight={pair.selectRight} equation={{ label: 'Projeto em foco', general: config.relation, condition: state.label, reduced: state.diagnosis }} closing={config.insight} />;
  };
}
