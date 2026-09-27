import React, { useState } from 'react';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import { STAGE_LABEL } from '../../lib/visualStudy';
import { MECHANICS_FINAL, type MechanicsFinalId } from '../../lib/mechanicsFinalLab';
import type { BoardProps } from '../visual-boards/types';
import { Marca, Nota, Rotulo, Sombra, useKit } from './illustrationKit';

const text = { fontWeight: 800, fill: 'var(--vs-ink)' } as const;
function short(content?: string) { const first = content?.trim().split(/(?<=[.!?])\s/)[0] ?? ''; return first.length > 180 ? `${first.slice(0, 176)}…` : first; }

/**
 * Defeito de massa numa balança: de um lado os núcleons separados, do outro o
 * núcleo que eles formam. A cena antiga era um disco com duas bolinhas e uma
 * seta, e não dizia o que o resumo define — que o defeito é a diferença entre
 * a soma das massas dos núcleons isolados e a massa do núcleo. A balança
 * mostra essa diferença como inclinação, e a energia sai do lado que ficou
 * mais leve. A inclinação cresce com Δm; o valor escrito é o mesmo da leitura.
 */
function MassEnergyScene({ value }: { value: number }) {
  const kit = useKit();
  const energia = MECHANICS_FINAL['mass-energy'].readouts(value)[0].value;
  const t = (value * 0.9 * Math.PI) / 180;
  const pivo = { x: 160, y: 72 }, braco = 110;
  const esq = { x: pivo.x - braco * Math.cos(t), y: pivo.y + braco * Math.sin(t) };
  const dir = { x: pivo.x + braco * Math.cos(t), y: pivo.y - braco * Math.sin(t) };
  const prato = (c: { x: number; y: number }) => {
    const y = c.y + 62;
    return <g>
      <path d={`M${c.x} ${c.y}L${c.x - 38} ${y}M${c.x} ${c.y}L${c.x + 38} ${y}`} stroke="var(--vs-dim)" strokeWidth="1.5" />
      <path d={`M${c.x - 44} ${y}Q${c.x} ${y + 26} ${c.x + 44} ${y}Z`} fill={kit.metal} stroke="var(--vs-ink)" strokeWidth="2" />
      <circle cx={c.x} cy={c.y} r="3.5" fill="var(--vs-ink)" />
    </g>;
  };
  // Seis núcleons, três prótons e três nêutrons: afastados à esquerda, colados
  // à direita. A contagem é do desenho, não de um núcleo específico.
  const tipos = ['acc', 'azul', 'acc', 'azul', 'acc', 'azul'] as const;
  const soltos = [[-30, -9], [-10, -9], [10, -9], [30, -9], [-20, -28], [20, -28]];
  const colados = [[-11, -9], [0, -9], [11, -9], [-5.5, -19], [5.5, -19], [0, -29]];
  // A energia sai do núcleo formado: um leque de fótons que cresce com Δm.
  const nucleo = { x: dir.x, y: dir.y + 44 };
  const raios = Math.min(value, 6);
  const pontas: [number, number][] = [];
  const ondas = Array.from({ length: raios }, (_, k) => {
    const a = ((raios === 1 ? -90 : -160 + (k * 140) / (raios - 1)) * Math.PI) / 180;
    const r0 = 24, r1 = 32 + value * 2.2;
    const pts = Array.from({ length: 13 }, (_, i) => { const r = r0 + ((r1 - r0) * i) / 12; const w = Math.sin(i * 1.6) * 3; return [nucleo.x + r * Math.cos(a) - w * Math.sin(a), nucleo.y + r * Math.sin(a) + w * Math.cos(a)]; });
    pontas.push(pts[12] as [number, number]);
    return `M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L')}`;
  });
  return <g data-mechanics="mass-energy">
    <kit.Defs />
    <Sombra cx={pivo.x} cy={262} rx={58} />
    <path d={`M${pivo.x - 46} 258L${pivo.x - 30} 240H${pivo.x + 30}L${pivo.x + 46} 258Z`} fill={kit.metal} stroke="var(--vs-ink)" strokeWidth="2" />
    <rect x={pivo.x - 5} y={pivo.y} width="10" height={168} fill={kit.metal} stroke="var(--vs-ink)" strokeWidth="1.5" />
    <path d={`M${pivo.x - 9} ${pivo.y - 2}L${pivo.x} ${pivo.y - 20}L${pivo.x + 9} ${pivo.y - 2}`} fill="var(--vs-ink)" />
    <g transform={`rotate(${(-t * 180) / Math.PI} ${pivo.x} ${pivo.y})`}>
      <rect x={pivo.x - braco - 4} y={pivo.y - 4} width={2 * braco + 8} height="8" rx="4" fill={kit.metal} stroke="var(--vs-ink)" strokeWidth="1.5" />
    </g>
    {prato(esq)}{prato(dir)}
    {soltos.map(([dx, dy], k) => <circle key={`s${k}`} cx={esq.x + dx} cy={esq.y + 62 + dy} r="8.5" fill={kit.esfera(tipos[k])} />)}
    {colados.map(([dx, dy], k) => <circle key={`c${k}`} cx={dir.x + dx} cy={dir.y + 62 + dy} r="8.5" fill={kit.esfera(tipos[k])} />)}
    {ondas.map((d, k) => <path key={k} d={d} fill="none" stroke="var(--vs-amber)" strokeWidth="2.2" strokeLinecap="round" />)}
    <circle cx="22" cy="22" r="6" fill={kit.esfera('acc')} /><Rotulo x={32} y={26} ancora="start" tam={10.5} tom="dim">próton</Rotulo>
    <circle cx="82" cy="22" r="6" fill={kit.esfera('azul')} /><Rotulo x={92} y={26} ancora="start" tam={10.5} tom="dim">nêutron</Rotulo>
    <Rotulo x={esq.x} y={esq.y + 96} tam={11}>núcleons</Rotulo><Rotulo x={esq.x} y={esq.y + 109} tam={11}>separados</Rotulo>
    <Rotulo x={dir.x} y={dir.y + 96} tam={11}>núcleo</Rotulo><Rotulo x={dir.x} y={dir.y + 109} tam={11}>formado</Rotulo>
    {value > 0
      ? <Nota de={[esq.x - 30, esq.y + 76]} em={[14, 232]} ancora="start" texto={[`pesa ${value} mg a mais`, 'que o núcleo']} curva={-1} />
      : <Nota de={[pivo.x, pivo.y - 20]} em={[308, 40]} ancora="end" texto="sem defeito: equilíbrio" />}
    {value > 0 && <Nota de={pontas[pontas.length - 1]} em={[306, 232]} ancora="end" tom="ambar" texto={['a massa que falta', 'saiu como energia']} curva={1} />}
    <Marca x={98} y={271} w={124} h={20} />
    <Rotulo x={160} y={286} tam={14} tom="acc">E = {energia}</Rotulo>
  </g>;
}

function Scene({ id, value }: { id: MechanicsFinalId; value: number }) {
  if (id === 'vertical-plane') return <><circle cx="160" cy="150" r="82" fill="none" stroke="var(--vs-ink)" strokeWidth="3"/><circle cx="160" cy="68" r="12" fill="var(--vs-burgundy)"/><path d="M160 82v48M142 104h36" stroke="var(--vs-burgundy)" strokeWidth="4"/><text x="185" y="113" style={text}>mg + N</text><text x="160" y="263" textAnchor="middle" style={text}>{value * value / 3 >= 10 ? 'contato: N ≥ 0' : 'contato se perde'}</text></>;
  if (id === 'mhs') { const x = 160 + value * 16; return <><path d={`M35 150H${x - 24}`} stroke="var(--vs-ink)" strokeWidth="3"/><path d={`M${x - 24} 150l8 -16 8 32 8 -32 8 32 8 -16`} fill="none" stroke="var(--vs-burgundy)" strokeWidth="4"/><rect x={x + 8} y="121" width="46" height="58" rx="7" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3"/><path d="M160 70v165" stroke="var(--vs-ink)" strokeDasharray="5 5"/><text x="160" y="266" textAnchor="middle" style={text}>equilíbrio x = 0</text></>; }
  if (id === 'potential-energy') { const y = 220 - value * 13; return <><path d="M45 230L270 230L270 70" fill="none" stroke="var(--vs-ink)" strokeWidth="3"/><path d="M60 225L250 80" stroke="var(--vs-burgundy)" strokeWidth="7"/><rect x="205" y={y} width="34" height="25" rx="4" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3"/><path d={`M260 230V${y + 12}`} stroke="var(--vs-burgundy)" strokeWidth="3"/><text x="274" y="155" style={text}>h</text></>; }
  if (id === 'nonconservative') return <><rect x="55" y="155" width="58" height="42" rx="6" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3"/><path d="M35 200H285" stroke="var(--vs-ink)" strokeWidth="4"/><path d="M80 215l12 9 12 -9 12 9 12 -9 12 9 12 -9 12 9 12 -9 12 9 12 -9 12 9" fill="none" stroke="var(--vs-burgundy)" strokeWidth="3"/><path d="M170 140h-62" stroke="var(--vs-burgundy)" strokeWidth="6"/><text x="175" y="128" style={text}>f atrito</text><text x="160" y="266" textAnchor="middle" style={text}>{value * 4} J viram energia interna</text></>;
  return <MassEnergyScene value={value} />;
}

export function mechanicsFinalInstrument(id: MechanicsFinalId) {
  const config = MECHANICS_FINAL[id];
  return function MechanicsFinalBoard(props: BoardProps) {
    const pair = boardPair(props);
    const [value, setValue] = useState(config.control.initial);
    const readouts = config.readouts(value);
    const pivot = readouts.find(readout => readout.pivot) ?? readouts[0];
    const first = props.map.nodes[1] ?? props.map.nodes[0];
    const second = props.map.nodes[2] ?? props.map.nodes.at(-1);
    return <BoardShell kicker="Laboratório de mecânica" title={config.name} subtitle={config.question} condition={{ label: '↔', value: pivot.value }} ariaLabel={`Instrumento de mecânica: ${props.map.title}`} emphasis={pair.emphasis}
      scene={<div className="vs-instrument"><svg className="vs-plane" viewBox="0 0 320 300" role="img" aria-label={`${config.name}; ${pivot.label}: ${pivot.value}`}><Scene id={id} value={value}/></svg><p className="vs-instrument-dica">mexa na grandeza e acompanhe a consequência física</p><div className="vs-plane-controls"><div className="vs-plane-control"><label htmlFor={`mechanics-final-${id}`}><strong>{config.control.label}</strong><span>{config.control.description}</span><b>{value}</b></label><input id={`mechanics-final-${id}`} type="range" min={config.control.min} max={config.control.max} step={config.control.step} value={value} onChange={event => setValue(Number(event.target.value))}/></div></div><dl className="vs-plane-readouts">{readouts.map(readout => <div key={readout.label} data-pivot={readout.pivot ? 'true' : undefined}><dt>{readout.label}</dt><dd>{readout.value}</dd></div>)}</dl></div>}
      left={{ label: STAGE_LABEL[first?.stage ?? 'conceito'], headline: first?.label ?? props.map.title, detail: short(first?.excerpt), formula: config.formula }} right={{ label: STAGE_LABEL[second?.stage ?? 'aplicacao'], headline: second?.label ?? props.map.title, detail: short(second?.excerpt), formula: pivot.value }} leftState={pair.leftState} rightState={pair.rightState} leftSelected={pair.leftSelected} rightSelected={pair.rightSelected} onSelectLeft={pair.selectLeft} onSelectRight={pair.selectRight} equation={{ label: 'Relação mecânica', general: config.formula, condition: 'mostra', reduced: pivot.value }} closing={config.insight} />;
  };
}
