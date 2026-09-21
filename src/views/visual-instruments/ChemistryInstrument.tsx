import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { CHEMISTRY, type ChemistryId, type ChemistryConfig } from '../../lib/chemistryInstrumentLab';
import { STAGE_LABEL } from '../../lib/visualStudy';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import type { BoardProps } from '../visual-boards/types';

function ChemistryDiagram({ config, value }: { config: ChemistryConfig; value: number }) {
  const reduced = useReducedMotion();
  const fraction = (value - config.min) / (config.max - config.min);
  const emphasis = 'var(--vs-burgundy)';
  const muted = 'var(--vs-ink-muted)';
  const ink = 'var(--vs-ink)';
  const transition = reduced ? { duration: 0 } : { duration: 0.38, ease: 'easeOut' as const };
  return <svg className="vs-plane" viewBox="0 0 320 270" role="img" aria-label={`${config.title}: ${config.control} ${value} ${config.unit}`}>
    {config.diagram === 'particles' && <>
      <motion.rect x="35" y="45" height="170" rx="12" fill="none" stroke={ink} strokeWidth="4" animate={{ width: config.title.includes('Seringa') ? 150 + 110 * fraction : 250 }} transition={transition} />
      {Array.from({ length: 12 }, (_, i) => <motion.circle key={i} cx={74 + (i % 4) * 54} cy={78 + Math.floor(i / 4) * 52} r="7" fill={emphasis} animate={{ x: (i % 2 ? 1 : -1) * fraction * 12, y: (i % 3 - 1) * fraction * 9, opacity: config.title.includes('Da massa') ? (i < Math.ceil((value / 18) / 10 * 12) ? 1 : .16) : 1 }} transition={transition} />)}
      <motion.path d="M0 45v170" fill="none" stroke={emphasis} strokeWidth="5" animate={{ x: config.title.includes('Seringa') ? 185 + 110 * fraction : 285 }} transition={transition} />
      <text x="160" y="242" textAnchor="middle" fill={ink} fontSize="13">{config.title.includes('Da massa') ? 'pontos ilustram proporção de mols' : config.title.includes('Seringa') ? 'amostra fixa · expansão' : 'amostra fixa · choques mais energéticos'}</text>
    </>}
    {config.title === 'Carbonato e acidez' && <>
      <path d="M62 203l37-110 61 27 62-27 36 110Z" fill="none" stroke={ink} strokeWidth="4" />
      <text x="160" y="172" textAnchor="middle" fill={ink} fontSize="22" fontWeight="800">CaCO₃</text>
      {[0, 1, 2, 3, 4].map(i => <motion.circle key={i} cx={63 + i * 47} cy={59 + (i % 2) * 20} r="8" fill={emphasis} animate={{ opacity: i < (1 - fraction) * 5 ? 1 : .14, y: i < (1 - fraction) * 5 ? 13 : 0 }} transition={transition} />)}
      <text x="160" y="244" textAnchor="middle" fill={ink} fontSize="15">H⁺ consome carbonato · dissolução</text>
    </>}
    {config.diagram === 'apparatus' && config.title !== 'Carbonato e acidez' && <>
      <path d="M55 42h210l-66 112v66H120v-66Z" fill="none" stroke={ink} strokeWidth="4" />
      <path d="M111 133h98" stroke={emphasis} strokeWidth="7" strokeDasharray="5 3" />
      {[80, 115, 155, 195, 235].map((x, i) => <motion.circle key={x} cx={x} cy={78 + (i % 2) * 20} r={i % 2 ? 5 : 11} fill={i % 2 ? muted : emphasis} animate={{ y: i % 2 ? 45 * fraction : 10 * fraction }} transition={transition} />)}
      <path d="M118 238h84" stroke={muted} strokeWidth="4" />
    </>}
    {config.diagram === 'equation' && <>
      <rect x="22" y="60" width="105" height="128" rx="12" fill="none" stroke={ink} strokeWidth="3" />
      <rect x="194" y="60" width="105" height="128" rx="12" fill="none" stroke={emphasis} strokeWidth="3" />
      <path d="M139 123h42m-12-11 12 11-12 11" stroke={emphasis} strokeWidth="5" fill="none" />
      {[0, 1, 2, 3].map((i) => <motion.circle key={i} cx={48 + (i % 2) * 53} cy={94 + Math.floor(i / 2) * 62} r="8" fill={muted} animate={{ opacity: fraction >= i / 4 ? 1 : .22 }} transition={transition} />)}
      {[0, 1, 2, 3].map((i) => <motion.circle key={i} cx={218 + (i % 2) * 53} cy={94 + Math.floor(i / 2) * 62} r="8" fill={emphasis} animate={{ opacity: fraction >= i / 4 ? 1 : .22 }} transition={transition} />)}
    </>}
    {config.title === 'Grau de polimerização' && <>
      {Array.from({ length: value }, (_, i) => <g key={i}><rect x={12 + i * 296 / value} y="105" width={290 / value} height="58" rx="4" fill="none" stroke={emphasis} strokeWidth="2" /><text x={12 + (i + .5) * 296 / value} y="139" textAnchor="middle" fill={ink} fontSize={value > 8 ? 8 : 11} fontWeight="800">C₂</text></g>)}
      <text x="160" y="87" textAnchor="middle" fill={ink} fontSize="14">n CH₂=CH₂ → [–CH₂–CH₂–]ₙ</text>
      <text x="160" y="210" textAnchor="middle" fill={ink} fontSize="14">{value} unidades · {2 * value} átomos de carbono</text>
    </>}
    {config.title === 'Adição ao alceno' && <>
      <text x="61" y="95" textAnchor="middle" fill={ink} fontSize="17" fontWeight="700">CH₂=CH₂</text><text x="61" y="130" textAnchor="middle" fill={emphasis} fontSize="15">+ H₂</text>
      <path d="M116 110h58m-12-9 12 9-12 9" stroke={emphasis} fill="none" strokeWidth="3" />
      <text x="145" y="94" textAnchor="middle" fill={ink} fontSize="11">catalisador</text>
      <text x="241" y="110" textAnchor="middle" fill={ink} fontSize="17" fontWeight="700">CH₃–CH₃</text>
      <text x="160" y="186" textAnchor="middle" fill={emphasis} fontSize="13">π da dupla → duas ligações C–H</text>
      <text x="160" y="218" textAnchor="middle" fill={ink} fontSize="12">1 mol de eteno consome 1 mol de H₂</text>
    </>}
    {config.title === 'Fórmula mínima e molecular' && <>
      {Array.from({ length: Math.min(value / 30, 6) }, (_, i) => <g key={i}><rect x={20 + i * 48} y="110" width="44" height="58" rx="8" fill="none" stroke={emphasis} strokeWidth="3" /><text x={42 + i * 48} y="145" textAnchor="middle" fill={ink} fontSize="12">CH₂O</text></g>)}
      <text x="160" y="207" textAnchor="middle" fill={ink} fontSize="14">múltiplos de CH₂O · 30 g/mol</text>
    </>}
    {config.diagram === 'molecule' && !['Grau de polimerização', 'Adição ao alceno', 'Fórmula mínima e molecular'].includes(config.title) && <>
      {Array.from({ length: config.title === 'Nome pela cadeia principal' ? value : 4 }, (_, i) => <g key={i}>
        {i > 0 && <path d={`M${46 + (i - 1) * (config.title === 'Nome pela cadeia principal' ? 31 : 58)} 140H${46 + i * (config.title === 'Nome pela cadeia principal' ? 31 : 58)}`} stroke={ink} strokeWidth="4" />}
        <circle cx={46 + i * (config.title === 'Nome pela cadeia principal' ? 31 : 58)} cy="140" r="14" fill={emphasis} /><text x={46 + i * (config.title === 'Nome pela cadeia principal' ? 31 : 58)} y="145" textAnchor="middle" fill="var(--vs-paper)" fontSize="13" fontWeight="800">C</text>
      </g>)}
      {config.title === 'Topologia da cadeia' && value > 0 && <><path d="M104 126V82" stroke={ink} strokeWidth="4" />{Array.from({ length: value }, (_, i) => <g key={i}><circle cx={104 + i * 31} cy="82" r="12" fill={emphasis} /><text x={104 + i * 31} y="87" textAnchor="middle" fill="var(--vs-paper)" fontSize="12">C</text></g>)}</>}
      <text x="160" y="215" textAnchor="middle" fill={ink} fontSize="14">{config.title === 'Nome pela cadeia principal' ? 'carbonos na cadeia principal' : 'cadeia principal · ramo no C2'}</text>
    </>}
    {config.title === 'Escala de pKa' && <>
      <path d="M35 152h250m-8-8 8 8-8 8" stroke={ink} strokeWidth="4" fill="none" />
      {[1, 3, 5, 7].map(v => <g key={v}><path d={`M${35 + (v - 1) / 6 * 245} 143v18`} stroke={muted} strokeWidth="2" /><text x={35 + (v - 1) / 6 * 245} y="183" textAnchor="middle" fill={ink}>{v}</text></g>)}
      <motion.circle cy="152" r="12" fill={emphasis} animate={{ cx: 35 + fraction * 245 }} transition={transition} />
      <text x="160" y="75" textAnchor="middle" fill={ink} fontSize="16">menor pKa → ácido mais forte</text>
    </>}
    {config.diagram === 'equilibrium' && config.title !== 'Escala de pKa' && <>
      <circle cx="80" cy="136" r="39" fill="none" stroke={ink} strokeWidth="4" />
      <circle cx="240" cy="136" r="39" fill="none" stroke={emphasis} strokeWidth="4" />
      <motion.path d="M126 109h70m-14-10 14 10-14 10" stroke={emphasis} strokeWidth="5" fill="none" animate={{ opacity: .35 + .65 * fraction }} transition={transition} />
      <motion.path d="M194 160h-70m14-10-14 10 14 10" stroke={ink} strokeWidth="5" fill="none" animate={{ opacity: 1 - .65 * fraction }} transition={transition} />
      <text x="80" y="143" textAnchor="middle" fill={ink} fontWeight="800">reagentes</text><text x="240" y="143" textAnchor="middle" fill={ink} fontWeight="800">produtos</text>
    </>}
    {config.diagram === 'energy' && <path d="M40 200l80-30 70-95 90 60" fill="none" stroke={emphasis} strokeWidth="5" />}
  </svg>;
}

export function chemistryInstrument(id: ChemistryId) {
  const config = CHEMISTRY[id];
  return function ChemistryBoard(props: BoardProps) {
    const pair = boardPair(props);
    const [value, setValue] = useState(config.initial);
    const result = config.read(value);
    const first = props.map.nodes[0];
    const second = props.map.nodes[2] ?? props.map.nodes.at(-1);
    return <BoardShell
      kicker="Laboratório de Química" title={config.title} subtitle={config.question}
      condition={{ label: result.label, value: result.value }} ariaLabel={`Instrumento de Química: ${props.map.title}`} emphasis={pair.emphasis}
      scene={<div className="vs-instrument">
        <ChemistryDiagram config={config} value={value} />
        <div className="vs-plane-controls"><div className="vs-plane-control">
          <label htmlFor={`chem-${id}`}><strong>{config.control}</strong><span>{config.question}</span><b>{value} {config.unit}</b></label>
          <input id={`chem-${id}`} type="range" min={config.min} max={config.max} step={config.step} value={value} onChange={event => setValue(Number(event.target.value))} />
        </div></div>
        <dl className="vs-plane-readouts"><div data-pivot="true"><dt>{result.label}</dt><dd>{result.value}</dd></div><div><dt>Condição</dt><dd>{result.secondary}</dd></div></dl>
      </div>}
      left={{ label: STAGE_LABEL[first?.stage ?? 'conceito'], headline: first?.label ?? props.map.title, detail: first?.excerpt ?? '', formula: config.relation }}
      right={{ label: STAGE_LABEL[second?.stage ?? 'aplicacao'], headline: second?.label ?? props.map.title, detail: second?.excerpt ?? '', formula: result.value }}
      leftState={pair.leftState} rightState={pair.rightState} leftSelected={pair.leftSelected} rightSelected={pair.rightSelected}
      onSelectLeft={pair.selectLeft} onSelectRight={pair.selectRight}
      equation={{ label: 'Relação química', general: config.relation, condition: config.control, reduced: result.value }} closing={config.explanation}
    />;
  };
}
