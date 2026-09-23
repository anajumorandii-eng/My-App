import React, { useId, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { GEOGRAPHY_CONTEXTS, type GeographyContext, type GeographyContextId } from '../../lib/geographyContextLab';
import { STAGE_LABEL } from '../../lib/visualStudy';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import type { BoardProps } from '../visual-boards/types';
import './GeographyRemainingInstrument.css';
import { GEOGRAPHY_CONTEXT_DIAGRAM_IDS, GeographyContextDiagram } from './GeographyContextDiagrams';

function ContextScene({ config, index }: { config: GeographyContext; index: number }) {
  const reduced = useReducedMotion();
  const marker = useId().replace(/:/g, '');
  const positions = [[62, 88], [160, 158], [258, 88]] as const;
  return <svg className="vs-plane" viewBox="0 0 320 250" role="img" aria-label={`${config.title}: ${config.cases[index].label} em foco`} data-geography-context={config.chapterId}>
    <defs><marker id={marker} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5 0 7Z" fill="var(--vs-burgundy)" /></marker></defs>
    <path d="M42 188Q90 125 160 180T278 180V231H42Z" fill="color-mix(in srgb,var(--vs-green) 22%,transparent)" />
    <path d="M84 99Q117 122 141 144M179 144Q207 122 236 99" fill="none" stroke="var(--vs-ink-muted)" strokeWidth="4" markerEnd={`url(#${marker})`} />
    {config.cases.map((item, itemIndex) => {
      const [x, y] = positions[itemIndex];
      const active = itemIndex === index;
      return <motion.g key={item.label} initial={false} animate={{ scale: active ? 1.08 : 1, opacity: active ? 1 : .55 }} transition={{ duration: reduced ? 0 : .25 }} style={{ transformOrigin: `${x}px ${y}px` }}>
        <circle cx={x} cy={y} r="38" fill={active ? 'color-mix(in srgb,var(--vs-burgundy) 22%,var(--vs-paper))' : 'var(--vs-paper)'} stroke={active ? 'var(--vs-burgundy)' : 'var(--vs-ink-muted)'} strokeWidth="4" />
        <text x={x} y={y - 3} textAnchor="middle" fill="var(--vs-ink)" fontSize="12" fontWeight="800">{item.label}</text>
        <text x={x} y={y + 15} textAnchor="middle" fill="var(--vs-ink-muted)" fontSize="9">{item.location}</text>
      </motion.g>;
    })}
    <text x="160" y="239" textAnchor="middle" fill="var(--vs-ink)" fontSize="11" fontWeight="800">{config.relation}</text>
  </svg>;
}

/**
 * Motor genérico do laboratório de três recortes, extraído para servir tanto
 * `geographyContextInstrument` (Geografia) quanto o par equivalente de
 * Atualidades (`currentAffairsContextInstrument`, em
 * `CurrentAffairsContextInstrument.tsx`) sem duplicar a cena nem o `BoardShell`
 * — só a tabela de configuração muda de um capítulo para outro.
 */
export function buildContextInstrument(config: GeographyContext) {
  return function GeographyContextBoard(props: BoardProps) {
    const [index, setIndex] = useState(0);
    const selected = config.cases[index];
    const pair = boardPair(props);
    const first = props.map.nodes[1] ?? props.map.nodes[0];
    const second = props.map.nodes[2] ?? props.map.nodes.at(-1);
    return <BoardShell kicker="Leitura territorial" title={config.title} subtitle={config.question}
      condition={{ label: 'Recorte', value: selected.label }} ariaLabel={`Instrumento geográfico: ${props.map.title}`} emphasis={pair.emphasis}
      scene={<div className="vs-instrument">{GEOGRAPHY_CONTEXT_DIAGRAM_IDS.has(config.chapterId) ? <GeographyContextDiagram config={config} index={index} /> : <ContextScene config={config} index={index} />}<div className="vs-plane-controls"><div className="vs-plane-control"><p>Alterne a escala de leitura:</p><div className="vs-geography-options" role="group" aria-label={`Recortes de ${config.title}`}>{config.cases.map((item, itemIndex) => <button key={item.label} type="button" aria-pressed={index === itemIndex} onClick={() => setIndex(itemIndex)}>{item.label}</button>)}</div></div></div><dl className="vs-plane-readouts" aria-live="polite"><div><dt>Onde</dt><dd>{selected.location}</dd></div><div><dt>Observe</dt><dd>{selected.observation}</dd></div><div data-pivot="true"><dt>Conclua</dt><dd>{selected.conclusion}</dd></div></dl><p className="vs-instrument-dica">{config.caution}</p></div>}
      left={{ label: STAGE_LABEL[first?.stage ?? 'conceito'], headline: first?.label ?? props.map.title, detail: first?.excerpt ?? config.question, formula: config.relation }} right={{ label: STAGE_LABEL[second?.stage ?? 'aplicacao'], headline: second?.label ?? props.map.title, detail: second?.excerpt ?? selected.observation, formula: selected.conclusion }} leftState={pair.leftState} rightState={pair.rightState} leftSelected={pair.leftSelected} rightSelected={pair.rightSelected} onSelectLeft={pair.selectLeft} onSelectRight={pair.selectRight} equation={{ label: 'Relação territorial', general: config.relation, condition: selected.label, reduced: selected.conclusion }} closing={config.caution} />;
  };
}

export function geographyContextInstrument(id: GeographyContextId) {
  return buildContextInstrument(GEOGRAPHY_CONTEXTS[id]);
}
