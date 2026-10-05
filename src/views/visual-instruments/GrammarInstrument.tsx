import React, {useState} from 'react';
import {motion,useReducedMotion} from 'motion/react';
import {GRAMMAR_INSTRUMENTS,type GrammarInstrumentId} from '../../lib/grammarInstrumentLab';
import {STAGE_LABEL} from '../../lib/visualStudy';
import BoardShell from '../visual-boards/BoardShell';
import {boardPair} from '../visual-boards/pair';
import type {BoardProps} from '../visual-boards/types';
import {GrammarMorphologyScene} from './GrammarMorphologyScenes';
import {GrammarSyntaxScene} from './GrammarSyntaxScenes';
import {GrammarApplication,grammarApplicationIds} from './GrammarApplications';
import {GrammarDrawingWindow} from './GrammarDrawingWindow';
const short=(text?:string)=>{const sentence=text?.trim().split(/(?<=[.!?])\s/)[0]??'';return sentence.length>180?`${sentence.slice(0,176)}…`:sentence;};
const morphology=new Set<GrammarInstrumentId>(['language-system','noun-class','text-type','noun-phrase','pronoun-reference','verbal-aspect','adverb-circumstance','implicit-meaning','discourse-type','lexical-context','ambiguity','word-formation']);
function GrammarScene({id,value}:{id:GrammarInstrumentId;value:number}){
 const reduced=useReducedMotion();
 return <GrammarDrawingWindow><svg className="grammar-drawing" viewBox={`0 0 760 ${grammarApplicationIds.has(id)?960:560}`} role="img" aria-label={`${GRAMMAR_INSTRUMENTS[id].name}; ${GRAMMAR_INSTRUMENTS[id].control.display(value)}`}>
 <path d="M16 12L744 16L740 547L20 550Z" fill="var(--vs-paper)" stroke="var(--vs-ink-muted)" strokeWidth="1"/>
 <motion.g initial={false} animate={{opacity:1}} transition={{duration:reduced?0:.25}}>{morphology.has(id)?<GrammarMorphologyScene id={id} value={value}/>:<GrammarSyntaxScene id={id} value={value}/>}</motion.g><GrammarApplication id={id}/>
 </svg></GrammarDrawingWindow>;
}

export function grammarInstrument(id: GrammarInstrumentId) {
  const config = GRAMMAR_INSTRUMENTS[id];
  return function GrammarBoard(props: BoardProps) {
    const pair = boardPair(props);
    const [value, setValue] = useState(config.control.initial);
    const readouts = config.readouts(value);
    const pivot = readouts.find((item) => item.pivot) ?? readouts[0];
    const first = props.map.nodes[1] ?? props.map.nodes[0];
    const second = props.map.nodes[2] ?? props.map.nodes.at(-1);
    return <div className="grammar-board"><BoardShell kicker="Oficina de estrutura" title={config.name} subtitle={config.question} condition={{ label: 'Leitura', value: pivot.value }} ariaLabel={`Instrumento de gramática: ${props.map.title}`} emphasis={pair.emphasis}
      scene={<div className="vs-instrument grammar-instrument"><GrammarScene id={id} value={value} /><p className="vs-instrument-dica">mude a construção e compare estrutura e sentido</p><div className="vs-plane-controls"><div className="vs-plane-control"><label htmlFor={`grammar-${id}`}><strong>{config.control.label}</strong><span>{config.control.description}</span><b>{config.control.display(value)}</b></label><input id={`grammar-${id}`} type="range" min={config.control.min} max={config.control.max} step={config.control.step} value={value} aria-valuetext={config.control.display(value)} onChange={(event) => setValue(Number(event.target.value))} /></div></div><dl className="vs-plane-readouts">{readouts.map((item) => <div key={item.label} data-pivot={item.pivot ? 'true' : undefined}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl></div>}
      left={{ label: STAGE_LABEL[first?.stage ?? 'conceito'], headline: first?.label ?? props.map.title, detail: short(first?.excerpt), formula: config.relation }} right={{ label: STAGE_LABEL[second?.stage ?? 'aplicacao'], headline: second?.label ?? props.map.title, detail: short(second?.excerpt), formula: pivot.value }}
      leftState={pair.leftState} rightState={pair.rightState} leftSelected={pair.leftSelected} rightSelected={pair.rightSelected} onSelectLeft={pair.selectLeft} onSelectRight={pair.selectRight}
      equation={{ label: 'Estrutura em foco', general: config.relation, condition: 'leitura', reduced: pivot.value }} closing={config.insight} /></div>;
  };
}
