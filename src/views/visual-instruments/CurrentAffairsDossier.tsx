import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { GeographyContext } from '../../lib/geographyContextLab';
import { STAGE_LABEL } from '../../lib/visualStudy';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import type { BoardProps } from '../visual-boards/types';

function DossierScene({ config, index }: { config: GeographyContext; index: number }) {
  const reduced = useReducedMotion();
  const labels = ['REGISTRO', 'CONTEXTO', 'AVALIAÇÃO'];
  return <svg className="vs-plane" viewBox="0 0 320 250" role="img" aria-label={`Dossiê: ${config.cases[index].label} em foco`}>
    <text x="24" y="31" fill="var(--vs-burgundy)" fontSize="15" fontWeight="900">DOSSIÊ · ATUALIDADES</text>
    <text x="24" y="49" fill="var(--vs-ink-muted)" fontSize="10">fato, contexto e crítica precisam permanecer distinguíveis</text>
    {config.cases.map((item, itemIndex) => <motion.g key={item.label} initial={false} animate={{ y: itemIndex === index ? -10 : 0, opacity: itemIndex === index ? 1 : .5 }} transition={{ duration: reduced ? 0 : .24 }}>
      <rect x={24 + itemIndex * 98} y="88" width="78" height="100" rx="10" fill="var(--vs-paper)" stroke={itemIndex === index ? 'var(--vs-burgundy)' : 'var(--vs-ink-muted)'} strokeWidth={itemIndex === index ? 5 : 2}/>
      <path d={`M${38 + itemIndex * 98} 122H${87 + itemIndex * 98}M${38 + itemIndex * 98} 138H${81 + itemIndex * 98}M${38 + itemIndex * 98} 154H${87 + itemIndex * 98}`} stroke="var(--vs-ink-muted)" strokeWidth="3" strokeLinecap="round"/>
      <text x={63 + itemIndex * 98} y="108" textAnchor="middle" fill={itemIndex === index ? 'var(--vs-burgundy)' : 'var(--vs-ink)'} fontSize="9" fontWeight="900">{labels[itemIndex]}</text>
    </motion.g>)}
    <text x="160" y="224" textAnchor="middle" fill="var(--vs-ink)" fontSize="12" fontWeight="800">{config.cases[index].label} · fonte e limite explícitos</text>
  </svg>;
}

export function currentAffairsDossier(config: GeographyContext) {
  return function CurrentAffairsBoard(props: BoardProps) {
    const [index, setIndex] = useState(0); const selected = config.cases[index]; const pair = boardPair(props);
    const first = props.map.nodes[1] ?? props.map.nodes[0]; const second = props.map.nodes[2] ?? props.map.nodes.at(-1);
    return <BoardShell kicker="Dossiê de atualidades" title={config.title} subtitle={config.question} condition={{ label: 'Documento em foco', value: selected.label }} ariaLabel={`Dossiê de atualidades: ${props.map.title}`} emphasis={pair.emphasis}
      scene={<div className="vs-instrument"><DossierScene config={config} index={index}/><div className="vs-plane-controls"><div className="vs-plane-control"><p>Separe registro, contexto e avaliação:</p><div className="vs-geography-options" role="group" aria-label={`Documentos de ${config.title}`}>{config.cases.map((item, itemIndex) => <button key={item.label} type="button" aria-pressed={index === itemIndex} onClick={() => setIndex(itemIndex)}>{item.label}</button>)}</div></div></div><dl className="vs-plane-readouts" aria-live="polite"><div><dt>Documento</dt><dd>{selected.location}</dd></div><div><dt>Registre</dt><dd>{selected.observation}</dd></div><div data-pivot="true"><dt>Leia criticamente</dt><dd>{selected.conclusion}</dd></div></dl><p className="vs-instrument-dica">{config.caution}</p></div>}
      left={{ label: STAGE_LABEL[first?.stage ?? 'conceito'], headline: first?.label ?? props.map.title, detail: first?.excerpt ?? config.question, formula: config.relation }} right={{ label: STAGE_LABEL[second?.stage ?? 'aplicacao'], headline: second?.label ?? props.map.title, detail: second?.excerpt ?? selected.observation, formula: selected.conclusion }} leftState={pair.leftState} rightState={pair.rightState} leftSelected={pair.leftSelected} rightSelected={pair.rightSelected} onSelectLeft={pair.selectLeft} onSelectRight={pair.selectRight} equation={{ label: 'Leitura de atualidades', general: config.relation, condition: selected.label, reduced: selected.conclusion }} closing={config.caution} />;
  };
}
