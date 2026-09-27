import React, { useState } from 'react';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import { STAGE_LABEL } from '../../lib/visualStudy';
import { WAVES, type WavesId } from '../../lib/wavesLab';
import type { BoardProps } from '../visual-boards/types';
import { Brilho, Painel, Papel, Pilula, Rotulo, cor, senoide, useKit } from './illustrationKit';

const ink = { stroke: 'var(--vs-ink)', strokeWidth: 3, fill: 'none' };
const wine = { stroke: 'var(--vs-burgundy)', strokeWidth: 4, fill: 'none' };
const short = (text?: string) => { const sentence = text?.trim().split(/(?<=[.!?])\s/)[0] ?? ''; return sentence.length > 180 ? `${sentence.slice(0, 176)}…` : sentence; };
const wave = (amplitude: number, phase = 0) => Array.from({ length: 17 }, (_, i) => `${i ? 'L' : 'M'} ${35 + i * 16} ${150 - amplitude * Math.sin((i / 16) * Math.PI * 4 + phase)}`).join(' ');

/**
 * Interferência em três quadros: onda 1 + onda 2 = soma. Antes as três
 * curvas eram sobrepostas no mesmo eixo, com 17 pontos cada, e o que se via
 * era um novelo em zigue-zague. Separadas, a linha tracejada da crista da onda
 * 1 atravessa os três quadros e mostra o que a fase faz: onde a crista da
 * onda 2 cai em relação a ela, e o tamanho do que sobra embaixo.
 */
function InterferenceScene({ value }: { value: number }) {
  const kit = useKit();
  const fase = (value * Math.PI) / 180;
  const A = 13;
  const resultante = 2 * A * Math.abs(Math.cos(fase / 2));
  const cm = String(Math.round(4 * Math.abs(Math.cos(fase / 2)) * 10) / 10).replace('.', ',');
  const x0 = 62, x1 = 302, ciclos = 2;
  // A primeira crista da onda 1 fica em t = 1/(4·ciclos); a da onda 2 chega
  // antes na proporção da fase.
  const periodo = (x1 - x0) / ciclos;
  const crista1 = x0 + periodo / 4;
  const recuo = crista1 - periodo * (fase / (2 * Math.PI));
  const crista2 = recuo < x0 ? recuo + periodo : recuo;
  const leitura = value === 0 ? 'crista + crista: reforça' : value === 180 ? 'crista + vale: anula' : value < 90 ? 'quase em fase: reforça' : 'quase oposta: enfraquece';
  const faixas = [{ y: 52, titulo: 'ONDA 1', tom: 'roxo' as const, fase: 0 }, { y: 128, titulo: 'ONDA 2', tom: 'ciano' as const, fase }];
  const yR = 208;
  const soma = senoide({ x0, x1, y: yR, amp: resultante, ciclos, fase: fase / 2 });
  // Alto-falante de cartum: a fonte de cada onda, no lugar da bolinha solta.
  const falante = (y: number, tom: 'roxo' | 'ciano') => <g>
    <rect x="16" y={y - 8} width="10" height="16" rx="2" fill={cor(tom)} stroke="var(--vs-kit-contorno)" strokeWidth="1.3" />
    <path d={`M26 ${y - 8}L40 ${y - 16}V${y + 16}L26 ${y + 8}Z`} fill={cor(tom)} stroke="var(--vs-kit-contorno)" strokeWidth="1.3" strokeLinejoin="round" />
    <path d={`M26 ${y - 8}L40 ${y - 16}V${y + 16}L26 ${y + 8}Z`} fill={kit.lapis} />
    <path d={`M45 ${y - 7}q5 7 0 14M50 ${y - 11}q8 11 0 22`} fill="none" stroke={cor(tom)} strokeWidth="1.6" strokeLinecap="round" />
  </g>;
  const sinal = (y: number, texto: string) => <g>
    <circle cx="160" cy={y} r="9" fill={cor("sol")} stroke="var(--vs-kit-contorno)" strokeWidth="1.3" />
    <Rotulo x={160} y={y + 5} tam={14}>{texto}</Rotulo>
  </g>;
  return <g data-waves="interference">
    <kit.Defs />
    <Papel kit={kit} />
    {faixas.map(f => <g key={f.titulo}>
      <Painel x={8} y={f.y - 34} w={304} h={64} titulo={f.titulo} tom={f.tom} />
      {falante(f.y, f.tom)}
      <path d={`M${x0} ${f.y}H${x1}`} stroke="var(--vs-dim)" strokeWidth="1" strokeDasharray="3 4" opacity=".6" />
      <g filter={kit.tremido}><path d={senoide({ x0, x1, y: f.y, amp: A, ciclos, fase: f.fase })} fill="none" stroke={cor(f.tom)} strokeWidth="4" strokeLinecap="round" /></g>
    </g>)}
    {sinal(88, "+")}
    {sinal(166, "=")}
    <Painel x={8} y={yR - 34} w={304} h={70} titulo="SOMA" tom="laranja" />
    <path d={`M${x0} ${yR}H${x1}`} stroke="var(--vs-dim)" strokeWidth="1" opacity=".7" />
    <path d={`${soma}L${x1} ${yR}L${x0} ${yR}Z`} fill={`color-mix(in srgb, ${cor('laranja')} 35%, transparent)`} />
    <path d={`${soma}L${x1} ${yR}L${x0} ${yR}Z`} fill={kit.lapis} />
    <g filter={kit.tremido}><path d={soma} fill="none" stroke={cor('laranja')} strokeWidth="5" strokeLinecap="round" /></g>
    <path d={`M${crista1.toFixed(1)} 22V${yR + 30}`} stroke={cor('sol')} strokeWidth="1.8" strokeDasharray="4 4" />
    <Brilho x={crista1} y={52 - A - 7} r={6} />
    <circle cx={crista2} cy={128 - A} r="4.5" fill={cor('ciano')} stroke="var(--vs-kit-contorno)" strokeWidth="1" />
    <Brilho x={296} y={14} r={5} tom="roxo" /><Brilho x={284} y={22} r={3} />
    <Pilula x={14} y={258} w={292} tom="laranja">{leitura} · Aᵣ = {cm} cm</Pilula>
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
