import React, { useState } from 'react';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import { STAGE_LABEL } from '../../lib/visualStudy';
import { WAVES, type WavesId } from '../../lib/wavesLab';
import type { BoardProps } from '../visual-boards/types';
import { Marca, Nota, Rotulo, senoide, useKit } from './illustrationKit';

const ink = { stroke: 'var(--vs-ink)', strokeWidth: 3, fill: 'none' };
const wine = { stroke: 'var(--vs-burgundy)', strokeWidth: 4, fill: 'none' };
const short = (text?: string) => { const sentence = text?.trim().split(/(?<=[.!?])\s/)[0] ?? ''; return sentence.length > 180 ? `${sentence.slice(0, 176)}…` : sentence; };
const wave = (amplitude: number, phase = 0) => Array.from({ length: 17 }, (_, i) => `${i ? 'L' : 'M'} ${35 + i * 16} ${150 - amplitude * Math.sin((i / 16) * Math.PI * 4 + phase)}`).join(' ');

/**
 * Interferência em três faixas: onda 1 + onda 2 = resultado. Antes as três
 * curvas eram sobrepostas no mesmo eixo, com 17 pontos cada, e o que se via
 * era um novelo em zigue-zague. Separadas, a linha tracejada da crista da onda
 * 1 atravessa as três faixas e mostra o que a fase faz: onde a crista da onda
 * 2 cai em relação a ela, e o tamanho do que sobra embaixo.
 */
function InterferenceScene({ value }: { value: number }) {
  const kit = useKit();
  const fase = (value * Math.PI) / 180;
  const A = 15;
  const resultante = 2 * A * Math.abs(Math.cos(fase / 2));
  const cm = String(Math.round(4 * Math.abs(Math.cos(fase / 2)) * 10) / 10).replace('.', ',');
  const x0 = 58, x1 = 304, ciclos = 2;
  // A primeira crista da onda 1 fica em t = 1/(4·ciclos); a da onda 2 chega
  // antes na proporção da fase.
  const crista1 = x0 + (x1 - x0) / (4 * ciclos);
  const periodo = (x1 - x0) / ciclos;
  const recuo = crista1 - periodo * (fase / (2 * Math.PI));
  const crista2 = recuo < x0 ? recuo + periodo : recuo;
  const faixas = [{ y: 58, rotulo: 'onda 1' }, { y: 128, rotulo: 'onda 2' }];
  const yR = 218;
  const leitura = value === 0 ? 'crista + crista: reforça' : value === 180 ? 'crista + vale: anula' : value < 90 ? 'quase em fase: reforça' : 'quase oposta: enfraquece';
  // Em oposição não há crista: a nota aponta para a linha reta do meio.
  const cristaR = value === 180 ? 180 : x0 + periodo * ((Math.PI / 2 - fase / 2) / (2 * Math.PI));
  return <g data-waves="interference">
    <kit.Defs />
    {faixas.map(({ y, rotulo }, k) => <g key={rotulo}>
      <path d={`M${x0} ${y}H${x1}`} stroke="var(--vs-dim)" strokeWidth="1" strokeDasharray="3 4" opacity=".6" />
      <circle cx="30" cy={y} r="11" fill={kit.esfera(k ? 'azul' : 'tinta')} />
      <Rotulo x={30} y={y - 15} tam={10.5} tom="dim">{rotulo}</Rotulo>
      <path d={senoide({ x0, x1, y, amp: A, ciclos, fase: k ? fase : 0 })} fill="none" stroke={k ? 'var(--vs-blue)' : 'var(--vs-ink)'} strokeWidth="3" strokeLinecap="round" />
    </g>)}
    <Rotulo x={30} y={94} tam={18} tom="dim">+</Rotulo>
    <Rotulo x={30} y={178} tam={20} tom="dim">=</Rotulo>
    <path d={`M${crista1.toFixed(1)} 34V${yR + 36}`} stroke="var(--vs-amber)" strokeWidth="1.5" strokeDasharray="4 4" />
    <circle cx={crista1} cy={58 - A} r="4" fill="var(--vs-amber)" />
    <circle cx={crista2} cy={128 - A} r="4" fill="var(--vs-blue)" />
    <path d={`M${x0} ${yR}H${x1}`} stroke="var(--vs-dim)" strokeWidth="1" opacity=".7" />
    <path d={`${senoide({ x0, x1, y: yR, amp: resultante, ciclos, fase: fase / 2 })}L${x1} ${yR}L${x0} ${yR}Z`} fill="color-mix(in srgb, var(--vs-kit-acc, var(--vs-burgundy)) 18%, transparent)" stroke="none" />
    <path d={senoide({ x0, x1, y: yR, amp: resultante, ciclos, fase: fase / 2 })} fill="none" stroke="var(--vs-kit-acc, var(--vs-burgundy))" strokeWidth="5" strokeLinecap="round" />
    <Rotulo x={30} y={yR + 5} tam={10.5} tom="dim">soma</Rotulo>
    <Nota de={[cristaR, yR - resultante - 3]} em={[value < 90 ? 306 : 150, 168]} ancora={value < 90 ? 'end' : undefined} texto={leitura} curva={value < 90 ? -1 : 1} />
    <Marca x={106} y={270} w={108} h={20} />
    <Rotulo x={160} y={285} tam={15} tom="acc">Aᵣ = {cm} cm</Rotulo>
  </g>;
}

function Scene({ id, value }: { id: WavesId; value: number }) {
  if (id === 'wave-equation') { const spacing = 200 / value; return <><path d={wave(32)} {...wine}/>{Array.from({ length: Math.max(1, Math.floor(value / 2)) }, (_, i) => <path key={i} d={`M${50 + i * spacing} 225h${spacing}`} {...ink}/>) }<text x="160" y="260" textAnchor="middle" style={{ fontWeight: 800, fill: 'var(--vs-ink)' }}>mais f → menor λ</text></>; }
  if (id === 'sound-intensity') return <><circle cx="85" cy="150" r="14" fill="var(--vs-burgundy)"/><circle cx="85" cy="150" r={30 + value * 12} {...ink}/><circle cx="85" cy="150" r={15 + value * 6} {...wine}/><path d={`M85 150H${85 + 30 + value * 12}`} {...wine}/><circle cx={85 + 30 + value * 12} cy="150" r="7" fill="var(--vs-ink)"/><text x="160" y="270" textAnchor="middle" style={{ fontWeight: 800, fill: 'var(--vs-ink)' }}>a área cresce como r²</text></>;
  if (id === 'interference') return <InterferenceScene value={value} />;
  if (id === 'string-harmonics') { const nodes = Array.from({ length: value + 1 }, (_, i) => 35 + (250 * i) / value); const path = Array.from({ length: 81 }, (_, i) => { const x = 35 + i * 3.125; return `${i ? 'L' : 'M'} ${x} ${150 - 55 * Math.sin((i / 80) * Math.PI * value)}`; }).join(' '); return <><path d="M35 150H285" {...ink}/><path d={path} {...wine}/>{nodes.map(x => <circle key={x} cx={x} cy="150" r="6" fill="var(--vs-ink)"/>)}<text x="160" y="270" textAnchor="middle" style={{ fontWeight: 800, fill: 'var(--vs-ink)' }}>{value} ventre{value > 1 ? 's' : ''}; nós fixos</text></>; }
  const gap = 30 - value / 4; return <><circle cx="120" cy="150" r="17" fill="var(--vs-burgundy)"/><path d="M125 150h30" {...wine}/><path d="M108 118l-50-35M108 140l-68-12M108 162l-68 12M108 184l-50 35" {...ink}/><path d={`M132 118l${gap} -35M132 140l${gap + 18} -12M132 162l${gap + 18} 12M132 184l${gap} 35`} {...wine}/><circle cx="270" cy="150" r="8" fill="var(--vs-ink)"/><text x="160" y="270" textAnchor="middle" style={{ fontWeight: 800, fill: 'var(--vs-ink)' }}>frentes comprimidas à frente</text></>;
}

export function wavesInstrument(id: WavesId) {
  const config = WAVES[id];
  return function WavesBoard(props: BoardProps) {
    const [value, setValue] = useState(config.control.initial); const readouts = config.readouts(value); const pivot = readouts.find(item => item.pivot) ?? readouts[0]; const pair = boardPair(props); const first = props.map.nodes[1] ?? props.map.nodes[0]; const second = props.map.nodes[2] ?? props.map.nodes.at(-1);
    return <BoardShell kicker="Laboratório de ondulatória" title={config.name} subtitle={config.question} condition={{ label: 'Leitura', value: pivot.value }} ariaLabel={`Instrumento de ondulatória: ${props.map.title}`} emphasis={pair.emphasis} scene={<div className="vs-instrument"><svg className="vs-plane" viewBox="0 0 320 300" role="img" aria-label={`${config.name}; ${pivot.label}: ${pivot.value}`}><Scene id={id} value={value}/></svg><p className="vs-instrument-dica">mexa na grandeza e relacione a forma da onda à leitura</p><div className="vs-plane-controls"><div className="vs-plane-control"><label htmlFor={`waves-${id}`}><strong>{config.control.label}</strong><span>{config.control.description}</span><b>{value}</b></label><input id={`waves-${id}`} type="range" min={config.control.min} max={config.control.max} step={config.control.step} value={value} onChange={event => setValue(Number(event.target.value))}/></div></div><dl className="vs-plane-readouts">{readouts.map(item => <div key={item.label} data-pivot={item.pivot ? 'true' : undefined}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl></div>} left={{ label: STAGE_LABEL[first?.stage ?? 'conceito'], headline: first?.label ?? props.map.title, detail: short(first?.excerpt), formula: config.formula }} right={{ label: STAGE_LABEL[second?.stage ?? 'aplicacao'], headline: second?.label ?? props.map.title, detail: short(second?.excerpt), formula: pivot.value }} leftState={pair.leftState} rightState={pair.rightState} leftSelected={pair.leftSelected} rightSelected={pair.rightSelected} onSelectLeft={pair.selectLeft} onSelectRight={pair.selectRight} equation={{ label: 'Relação ondulatória', general: config.formula, condition: 'mostra', reduced: pivot.value }} closing={config.insight}/>;
  };
}
