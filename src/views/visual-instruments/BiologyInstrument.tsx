import React, { useState } from 'react';
import { BIOLOGY_INSTRUMENTS, basePair, oxygenGradient, recombination, type BiologyInstrumentId } from '../../lib/biologyInstrumentLab';
import { STAGE_LABEL } from '../../lib/visualStudy';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import type { BoardProps } from '../visual-boards/types';

const ink = { stroke: 'var(--vs-ink)', strokeWidth: 3, fill: 'none' };
const red = { stroke: 'var(--vs-burgundy)', strokeWidth: 5, fill: 'none' };
// As frases de rodapé herdavam 16 px em negrito e passavam dos 320 do quadro
// (auditoria 39, §4.4); por isso levam tamanho explícito.
const T = ({ x, y, c = 'var(--vs-ink)', size = 12, w = 700, a = 'middle', children }: { x: number; y: number; c?: string; size?: number; w?: number; a?: 'start' | 'middle' | 'end'; children: React.ReactNode }) => <text x={x} y={y} textAnchor={a} fontSize={size} fontWeight={w} fill={c}>{children}</text>;

/** Escada de DNA com o par escolhido aceso: base, complemento, base do RNA e
 * as pontes de hidrogênio contadas (2 em A–T, 3 em C–G). */
function NucleicScene({ value }: { value: number }) {
  const par = basePair(value);
  const degraus = ['A', 'C', par.template, 'G', 'T'];
  return <g>{degraus.map((b, k) => { const y = 50 + k * 40; const ativo = k === 2; const c = basePair(['A', 'T', 'C', 'G'].indexOf(b));
    return <g key={k} opacity={ativo ? 1 : .35}>
      <rect x="40" y={y - 14} width="30" height="28" rx="5" fill="var(--vs-paper)" stroke={ativo ? 'var(--vs-burgundy)' : 'var(--vs-ink)'} strokeWidth="2.5" /><T x={55} y={y + 5} size={15}>{b}</T>
      {Array.from({ length: c.hydrogenBonds }, (_, h) => <path key={h} d={`M76 ${y - 6 + h * 6}H112`} stroke="var(--vs-burgundy)" strokeWidth="2" strokeDasharray="3 3" />)}
      <rect x="118" y={y - 14} width="30" height="28" rx="5" fill="var(--vs-paper)" stroke={ativo ? 'var(--vs-burgundy)' : 'var(--vs-ink)'} strokeWidth="2.5" /><T x={133} y={y + 5} size={15}>{c.dna}</T>
    </g>; })}
    <path d="M40 30V250M148 30V250" stroke="var(--vs-ink)" strokeWidth="3" />
    <T x={55} y={272}>molde</T><T x={133} y={272}>DNA</T>
    <path d="M168 130H200" stroke="var(--vs-ink)" strokeWidth="2" /><path d="M196 124l8 6-8 6" fill="none" stroke="var(--vs-ink)" strokeWidth="2" />
    <rect x="212" y="116" width="30" height="28" rx="5" fill="color-mix(in srgb,var(--vs-blue) 18%,var(--vs-paper))" stroke="var(--vs-blue)" strokeWidth="2.5" /><T x={227} y={135} size={15} c="var(--vs-blue)">{par.rna}</T>
    <T x={227} y={100} c="var(--vs-blue)">RNA</T>
    <T x={290} y={178} a="end" c="var(--vs-burgundy)">{par.template}–{par.dna}: {par.hydrogenBonds} pontes</T>
    <T x={236} y={252} w={600} c="var(--vs-dim)">no RNA, U no lugar de T</T>
  </g>;
}

/** Dois homólogos com A e B à distância em cM; o crossing-over entre eles
 * gera recombinantes na mesma proporção lida no instrumento. */
function LinkageScene({ value }: { value: number }) {
  const r = recombination(value);
  const d = 20 + r.distanceCm * 3.6;
  return <g>
    {[70, 110].map((y, k) => <g key={y}><rect x="40" y={y - 10} width="240" height="20" rx="10" fill={k ? 'color-mix(in srgb,var(--vs-blue) 18%,var(--vs-paper))' : 'color-mix(in srgb,var(--vs-burgundy) 18%,var(--vs-paper))'} stroke="var(--vs-ink)" strokeWidth="2" />
      <circle cx="70" cy={y} r="6" fill="var(--vs-ink)" /><circle cx={70 + d} cy={y} r="6" fill="var(--vs-ink)" />
      <T x={70} y={y - 16} size={11}>{k ? 'a' : 'A'}</T><T x={70 + d} y={y - 16} size={11}>{k ? 'b' : 'B'}</T></g>)}
    {r.recombinant > 0 && <path d={`M${70 + d / 2 - 8} 78L${70 + d / 2 + 8} 102M${70 + d / 2 + 8} 78L${70 + d / 2 - 8} 102`} stroke="var(--vs-burgundy)" strokeWidth="3" />}
    <path d={`M70 136H${70 + d}`} stroke="var(--vs-dim)" strokeWidth="1.5" /><T x={70 + d / 2} y={152} size={11} w={600} c="var(--vs-dim)">{r.distanceCm} cM</T>
    <rect x="40" y="180" width={2.4 * r.parental} height="26" fill="color-mix(in srgb,var(--vs-ink) 18%,var(--vs-paper))" stroke="var(--vs-ink)" />
    <rect x={40 + 2.4 * r.parental} y="180" width={2.4 * r.recombinant} height="26" fill="color-mix(in srgb,var(--vs-burgundy) 40%,var(--vs-paper))" stroke="var(--vs-burgundy)" />
    <T x={40} y={226} a="start" w={600}>parentais {r.parental}%</T><T x={280} y={226} a="end" c="var(--vs-burgundy)">recombinantes {r.recombinant}%</T>
    <T x={160} y={262} w={600} c="var(--vs-dim)">mais distância, mais crossing-over</T>
  </g>;
}

/** Alvéolo e capilar: o O₂ atravessa na medida da diferença de pressão. */
function RespirationScene({ value }: { value: number }) {
  const g = oxygenGradient(value);
  const n = Math.round(g / 10);
  return <g>
    <circle cx="100" cy="130" r="74" fill="color-mix(in srgb,var(--vs-blue) 8%,var(--vs-paper))" stroke="var(--vs-ink)" strokeWidth="3" />
    <T x={100} y={80}>alvéolo</T><T x={100} y={98} size={11} w={600} c="var(--vs-dim)">{value} mmHg</T>
    <rect x="182" y="40" width="46" height="190" rx="22" fill="color-mix(in srgb,var(--vs-burgundy) 14%,var(--vs-paper))" stroke="var(--vs-burgundy)" strokeWidth="3" />
    <T x={205} y={34}>capilar</T><T x={205} y={250} size={11} w={600} c="var(--vs-dim)">40 mmHg</T>
    {Array.from({ length: n }, (_, k) => <g key={k}><circle cx={140 + (k % 3) * 18} cy={110 + Math.floor(k / 3) * 22} r="5" fill="var(--vs-blue)" /></g>)}
    {g > 0 ? <><path d="M150 180H186" stroke="var(--vs-blue)" strokeWidth={2 + g / 12} /><path d="M184 172l10 8-10 8" fill="var(--vs-blue)" /></> : <T x={150} y={190} c="var(--vs-burgundy)">sem gradiente</T>}
    <T x={160} y={276}>{g > 0 ? `diferença de ${g} mmHg: O₂ vai ao sangue` : 'sem diferença, sem difusão'}</T>
  </g>;
}

/** Caule iluminado de um lado: a auxina vai para a sombra, as células de lá
 * alongam mais e o ápice curva em direção à luz. */
function AuxinScene({ value }: { value: number }) {
  const sombra = value, luz = 100 - value;
  const curva = (sombra - 50) * 2.2;
  return <g>
    <circle cx="40" cy="60" r="18" fill="var(--vs-amber)" /><T x={40} y={96}>luz</T>
    {[0, 1, 2].map((k) => <path key={k} d={`M62 ${50 + k * 10}H96`} stroke="var(--vs-amber)" strokeWidth="2" />)}
    <path d={`M150 250C150 180 150 140 ${150 - curva * .6} 70`} fill="none" stroke="var(--vs-green)" strokeWidth="24" strokeLinecap="round" opacity=".35" />
    <path d={`M140 250C140 180 140 140 ${140 - curva * .6} 72`} fill="none" stroke="var(--vs-ink)" strokeWidth="2" />
    <path d={`M160 250C160 180 162 140 ${160 - curva * .6} 68`} fill="none" stroke="var(--vs-ink)" strokeWidth="2" />
    {Array.from({ length: Math.round(sombra / 10) }, (_, k) => <circle key={`s${k}`} cx={168 + (k % 2) * 8} cy={210 - k * 14} r="3.5" fill="var(--vs-burgundy)" />)}
    {Array.from({ length: Math.round(luz / 10) }, (_, k) => <circle key={`l${k}`} cx={126 - (k % 2) * 8} cy={210 - k * 14} r="3.5" fill="var(--vs-burgundy)" opacity=".5" />)}
    <T x={300} y={40} a="end" c="var(--vs-burgundy)">sombra: {sombra}% da auxina</T><T x={300} y={58} a="end" w={600} c="var(--vs-dim)">células alongam mais</T>
    <T x={160} y={280}>{sombra > 50 ? 'o caule curva para a luz' : 'auxina igual: cresce reto'}</T>
  </g>;
}

function Scene({ id, value }: { id: BiologyInstrumentId; value: number }) {
  // Ácidos nucleicos e ligação eram um "X" de traços e dois pontos numa
  // linha: não mostravam o pareamento nem o crossing-over (revisão de 27/09).
  if (id === 'nucleic-acids') return <NucleicScene value={value} />;
  if (id === 'linkage') return <LinkageScene value={value} />;
  if (id === 'circulation') return <><path d="M24 146h63m-8-7 8 7-8 7M232 146h63m-8-7 8 7-8 7" {...red}/>{Array.from({length: value}, (_, i) => { const y = value === 1 ? 146 : 68 + i * 156 / (value - 1); return <path key={i} d={`M87 146C106 146 104 ${y} 134 ${y}H185C215 ${y} 213 146 232 146`} {...ink}/>; })}<text x="53" y="235" textAnchor="middle" fill="var(--vs-ink)" fontSize="12">artéria</text><text x="160" y="254" textAnchor="middle" fill="var(--vs-ink)" fontSize="12">capilares em paralelo · área total {value}×</text><text x="265" y="235" textAnchor="middle" fill="var(--vs-ink)" fontSize="12">veia</text><text x="160" y="280" textAnchor="middle" fill="var(--vs-burgundy)" fontSize="12">Q constante → velocidade ∝ 1/área</text></>;
  if (id === 'respiration') return <RespirationScene value={value} />;
  return <AuxinScene value={value} />;
}
function short(text?: string) { const sentence = text?.split(/(?<=[.!?])\s/)[0] ?? ''; return sentence.length > 180 ? `${sentence.slice(0, 176)}…` : sentence; }
export function biologyInstrument(id: BiologyInstrumentId) { const config = BIOLOGY_INSTRUMENTS[id]; return function BiologyBoard(props: BoardProps) { const [value, setValue] = useState(config.control.initial); const readouts = config.readouts(value); const pivot = readouts.find((item) => item.pivot) ?? readouts[0]; const pair = boardPair(props); const first = props.map.nodes[1] ?? props.map.nodes[0]; const second = props.map.nodes[2] ?? props.map.nodes.at(-1); return <BoardShell kicker="Laboratório de biologia" title={config.name} subtitle={config.question} condition={{ label: 'Leitura', value: pivot.value }} ariaLabel={`Instrumento de biologia: ${props.map.title}`} emphasis={pair.emphasis} scene={<div className="vs-instrument"><svg className="vs-plane" viewBox="0 0 320 300" role="img" aria-label={`${config.name}; ${pivot.label}: ${pivot.value}`}><Scene id={id} value={value}/></svg><div className="vs-plane-controls"><div className="vs-plane-control"><label htmlFor={`biology-${id}`}><strong>{config.control.label}</strong><span>{config.control.description}</span><b>{config.control.display(value)}</b></label><input id={`biology-${id}`} type="range" min={config.control.min} max={config.control.max} step={config.control.step} value={value} onChange={(event) => setValue(Number(event.target.value))}/></div></div><dl className="vs-plane-readouts">{readouts.map((item) => <div key={item.label} data-pivot={item.pivot ? 'true' : undefined}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl></div>} left={{ label: STAGE_LABEL[first?.stage ?? 'conceito'], headline: first?.label ?? props.map.title, detail: short(first?.excerpt), formula: config.relation }} right={{ label: STAGE_LABEL[second?.stage ?? 'aplicacao'], headline: second?.label ?? props.map.title, detail: short(second?.excerpt), formula: pivot.value }} leftState={pair.leftState} rightState={pair.rightState} leftSelected={pair.leftSelected} rightSelected={pair.rightSelected} onSelectLeft={pair.selectLeft} onSelectRight={pair.selectRight} equation={{ label: 'Relação biológica', general: config.relation, condition: 'mostra', reduced: pivot.value }} closing={config.insight}/>; }; }
