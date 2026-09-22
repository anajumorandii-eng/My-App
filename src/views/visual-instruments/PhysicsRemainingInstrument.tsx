import React, { useState } from 'react';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import { STAGE_LABEL } from '../../lib/visualStudy';
import { PHYSICS_REMAINING, type PhysicsRemainingId } from '../../lib/physicsRemainingLab';
import type { BoardProps } from '../visual-boards/types';

const short = (text?: string) => { const first = text?.trim().split(/(?<=[.!?])\s/)[0] ?? ''; return first.length > 180 ? `${first.slice(0, 176)}…` : first; };
const decimal = (value: number) => String(Math.round(value * 100) / 100).replace('.', ',');
const ink = { stroke: 'var(--vs-ink)', strokeWidth: 3, fill: 'none' };
const wine = { stroke: 'var(--vs-burgundy)', strokeWidth: 4, fill: 'none' };

function Scene({ id, value }: { id: PhysicsRemainingId; value: number }) {
  if (id === 'echo') {
    const wall = 110 + value * 135;
    return <g data-physics-system="echo">
      <path d="M24 228H294" {...ink}/><path d={`M${wall} 57V229`} stroke="var(--vs-ink)" strokeWidth="8"/><path d={`M${wall+10} 65V221`} stroke="var(--vs-ink-muted)" strokeWidth="2" strokeDasharray="4 5"/>
      <circle cx="58" cy="188" r="18" fill="var(--vs-burgundy)"/><path d="M48 180q10-9 20 0M48 191q10 9 20 0" {...ink}/>
      <path d={`M79 175H${wall-10}`} {...wine}/><path d={`M${wall-10} 201H79`} stroke="var(--vs-blue)" strokeWidth="4" fill="none" strokeDasharray="8 5"/>
      {[0,1,2].map(n => <path key={n} d={`M${85+n*9} ${175-n*6}q11 6 0 12`} stroke="var(--vs-burgundy)" strokeWidth="2" fill="none" opacity={.9-n*.22}/>) }
      <text x="58" y="151" textAnchor="middle" style={ink}>emissor</text><text x={wall} y="43" textAnchor="middle" style={ink}>obstáculo</text>
      <text x={(wall+75)/2} y="166" textAnchor="middle" style={{...ink,fontSize:12}}>ida</text><text x={(wall+75)/2} y="218" textAnchor="middle" style={{...ink,fontSize:12}}>volta</text>
      <path d={`M78 253H${wall-12}`} stroke="var(--vs-ink)" strokeWidth="2"/><path d={`M78 247v12M${wall-12} 247v12`} stroke="var(--vs-ink)" strokeWidth="2"/>
      <text x="160" y="283" textAnchor="middle" style={{...ink,fontSize:13}}>d = 340 · Δt / 2</text>
    </g>;
  }
  if (id === 'diffraction') {
    const spread = 18 + 78 / value;
    return <g data-physics-system="diffraction">
      <path d="M21 150H130" stroke="var(--vs-blue)" strokeWidth="12" opacity=".6"/><path d="M21 150H130" {...wine}/>
      <path d="M146 34V126M146 174V266M174 34V126M174 174V266" stroke="var(--vs-ink)" strokeWidth="7"/>
      <path d="M160 44v72M160 184v72" stroke="var(--vs-burgundy)" strokeWidth="3"/><text x="160" y="22" textAnchor="middle" style={ink}>fenda a</text>
      {[1,.65,.35].map((f,n)=><path key={n} d={`M168 150Q230 ${150-spread*f} 298 ${150-spread*f}M168 150Q230 ${150+spread*f} 298 ${150+spread*f}`} stroke={n?'var(--vs-ink-muted)':'var(--vs-burgundy)'} strokeWidth={n?2:4} fill="none" opacity={n?.75:1}/>) }
      <path d="M282 61V239" stroke="var(--vs-ink-muted)" strokeWidth="2" strokeDasharray="5 5"/><text x="289" y="279" textAnchor="end" style={{...ink,fontSize:12}}>anteparo</text>
      <text x="80" y="133" textAnchor="middle" style={{...ink,fontSize:12}}>frente de onda</text><text x="232" y="150" textAnchor="middle" style={{...ink,fontSize:12}}>θ</text>
      <text x="160" y="294" textAnchor="middle" style={{...ink,fontSize:13}}>sen θ ≈ λ/a</text>
    </g>;
  }
  if (id === 'tube-harmonics') {
    // Cada semiperfil é calculado a partir da mesma função. Não espelhe a
    // string pronta: ela já contém coordenadas numéricas, portanto um
    // replace textual não altera o sinal de y e desenha a mesma curva duas
    // vezes (a falha que escondia o ventre da onda estacionária).
    const profile = (sign: 1 | -1) => Array.from({ length: 81 }, (_, index) => {
      const x = 43 + index * 2.9;
      const y = 150 + sign * 52 * Math.sin((index / 80) * Math.PI * value / 2);
      return `${index ? 'L' : 'M'} ${x} ${y}`;
    }).join(' ');
    const upperProfile = profile(-1);
    const lowerProfile = profile(1);
    const nodeXs = Array.from({length:(value+1)/2},(_,n)=>43+n*(235*2/value));
    return <g data-physics-system="tube-harmonics">
      <path d="M34 78V223H286V78" fill="color-mix(in srgb,var(--vs-blue) 14%,transparent)" stroke="var(--vs-ink)" strokeWidth="4"/><path d="M34 223H286" stroke="var(--vs-ink)" strokeWidth="9"/>
      <path data-harmonic-profile="upper" d={upperProfile} {...wine}/><path data-harmonic-profile="lower" d={lowerProfile} stroke="var(--vs-blue)" strokeWidth="3" fill="none" opacity=".8"/>
      {nodeXs.map((x,n)=><g key={x}><path d={`M${x} 103v94`} stroke="var(--vs-ink-muted)" strokeWidth="1" strokeDasharray="3 4"/><circle cx={x} cy="150" r="5" fill="var(--vs-ink)"/><text x={x} y="245" textAnchor="middle" style={{...ink,fontSize:10}}>nó</text></g>)}
      <path d="M286 98v104" stroke="var(--vs-burgundy)" strokeWidth="4"/><text x="34" y="56" style={ink}>fechado</text><text x="286" y="56" textAnchor="end" style={ink}>aberto</text>
      <text x="160" y="283" textAnchor="middle" style={{...ink,fontSize:13}}>L = {value}λ/4 · apenas n ímpar</text>
    </g>;
  }
  if (id === 'circular-motion') {
    const small = 42; const large = value * 1.8;
    return <g data-physics-system="circular-motion">
      <circle cx="82" cy="151" r={small} fill="color-mix(in srgb,var(--vs-blue) 16%,transparent)" {...ink}/><circle cx="238" cy="151" r={large} fill="color-mix(in srgb,var(--vs-burgundy) 13%,transparent)" {...ink}/>
      <path d={`M82 109H238M82 193H238`} stroke="var(--vs-ink)" strokeWidth="5"/><path d="M82 151m-11 0h22M238 151m-11 0h22" {...wine}/>
      <path d={`M82 109a42 42 0 0 1 29 12`} {...wine}/><path d={`M238 ${151-large}a${large} ${large} 0 0 1 ${Math.min(large*.7,48)} ${Math.min(large*.35,24)}`} {...wine}/>
      <path d="M99 108l12 9-15 3" fill="var(--vs-burgundy)"/><path d={`M${238+Math.min(large*.6,48)} ${151-large+Math.min(large*.35,24)}l-12 9 2-15`} fill="var(--vs-burgundy)"/>
      <path d="M82 151H117" stroke="var(--vs-blue)" strokeWidth="4"/><path d={`M238 151H${238+Math.min(large-8,55)}`} stroke="var(--vs-blue)" strokeWidth="4"/>
      <text x="82" y="222" textAnchor="middle" style={ink}>R₁ = 10 cm</text>
      <text x="238" y={Math.min(151+large+24,278)} textAnchor="middle" style={ink}>R₂ = {value} cm</text>
      <text x="160" y="275" textAnchor="middle" style={{...ink,fontSize:13}}>mesma v na correia • ω₂ = ω₁R₁/R₂</text>
    </g>;
  }
  if (id === 'electric-field-map') {
    const rings = [34, 62, 92, 122]; const marker = 160 + value * 16;
    return <g data-physics-system="electric-field-map">
      {rings.map((r, index) => <circle key={r} cx="105" cy="150" r={r} fill="none" stroke="var(--vs-blue)" strokeWidth="2" strokeDasharray="5 4" opacity={1-index*.16}/>) }
      {[-62,-31,0,31,62].map(angle => { const radians = angle * Math.PI / 180; const x2=105+136*Math.cos(radians); const y2=150+136*Math.sin(radians); return <g key={angle}><path d={`M105 150L${x2} ${y2}`} {...wine}/><path d={`M${x2} ${y2}l-11 -4 5 11`} fill="var(--vs-burgundy)" transform={`rotate(${angle}, ${x2}, ${y2})`}/></g>; })}
      <circle cx="105" cy="150" r="18" fill="var(--vs-burgundy)"/><text x="105" y="157" textAnchor="middle" fill="white" fontWeight="800">+</text>
      <circle cx={marker} cy="150" r="7" fill="var(--vs-blue)"/><path d={`M${marker} 150v-31`} stroke="var(--vs-ink)" strokeWidth="2"/><text x={marker} y="108" textAnchor="middle" style={{...ink,fontSize:11}}>teste</text>
      <path d={`M${marker} 150h31`} stroke="var(--vs-ink)" strokeWidth="2"/><path d={`M${marker+24} 144l8 6-8 6`} fill="var(--vs-ink)"/>
      <text x="250" y="138" style={{...ink,fontSize:11}}>E</text><text x="160" y="286" textAnchor="middle" style={{...ink,fontSize:13}}>campo radial ⟂ equipotenciais circulares</text>
    </g>;
  }
  if (id === 'electric-meters') {
    const ammeter = value === 0;
    return <g data-physics-system="electric-meters">
      <path d="M36 78H280V226H36Z" {...ink}/><path d="M36 151H89M230 151H280" {...ink}/><path d="M119 151H201" {...ink}/>
      <rect x="201" y="126" width="29" height="50" rx="4" fill="color-mix(in srgb,var(--vs-burgundy) 16%,transparent)" {...ink}/><path d="M205 137h21M205 151h21M205 165h21" {...wine}/><text x="216" y="195" textAnchor="middle" style={{...ink,fontSize:11}}>R</text>
      {ammeter ? <><circle cx="104" cy="151" r="19" fill="var(--vs-blue)" {...ink}/><text x="104" y="157" textAnchor="middle" fill="white" fontWeight="800">A</text><path d="M104 101v30M104 171v30" stroke="var(--vs-ink-muted)" strokeWidth="2" strokeDasharray="4 4"/><text x="104" y="222" textAnchor="middle" style={ink}>em série</text></> : <><path d="M132 92V210M238 92V210" stroke="var(--vs-ink)" strokeWidth="3"/><circle cx="185" cy="92" r="19" fill="var(--vs-blue)" {...ink}/><text x="185" y="98" textAnchor="middle" fill="white" fontWeight="800">V</text><path d="M132 92h34M204 92h34" {...ink}/><text x="185" y="242" textAnchor="middle" style={ink}>em paralelo</text></>}
      <circle cx="59" cy="151" r="18" fill="var(--vs-burgundy)"/><path d="M59 139v24M48 151h22" stroke="white" strokeWidth="3"/><text x="160" y="282" textAnchor="middle" style={{...ink,fontSize:13}}>{ammeter ? 'Rₐ ≈ 0 Ω: toda a corrente passa por A' : 'Rᵥ muito alta: V não desvia corrente'}</text>
    </g>;
  }
  if (id === 'generator' || id === 'receiver') {
    const generator = id === 'generator'; const voltage = generator ? 24 - 2 * value : 100 + 2 * value;
    const y = 236 - Math.min(value * (generator ? 13 : 9), 150);
    return <g data-physics-system={id}>
      <path d="M45 236H286M45 38V236" {...ink}/><path d={generator ? "M45 58L285 214" : "M45 214L285 58"} {...wine}/><path d={`M45 ${y}L${45+value*20} ${y}`} stroke="var(--vs-blue)" strokeWidth="6"/>
      <circle cx={45+value*20} cy={y} r="7" fill="var(--vs-blue)"/><text x="28" y="55" textAnchor="end" style={ink}>{generator ? 'U' : 'U'}</text><text x="286" y="260" textAnchor="end" style={ink}>i</text>
      <text x="57" y="64" style={{...ink,fontSize:12}}>{generator ? 'ε = 24 V' : 'ε’ = 100 V'}</text><text x="270" y="221" textAnchor="end" style={{...ink,fontSize:12}}>{generator ? 'curto' : 'r’ i'}</text>
      <rect x="68" y="78" width="146" height="58" rx="10" fill="color-mix(in srgb,var(--vs-blue) 12%,transparent)" stroke="var(--vs-ink-muted)" strokeWidth="2"/>
      <text x="141" y="102" textAnchor="middle" style={ink}>{generator ? 'fonte entrega ao circuito' : 'motor recebe do circuito'}</text><text x="141" y="123" textAnchor="middle" style={{...ink,fontSize:12}}>{generator ? `U = ${voltage} V` : `U = ${voltage} V`}</text>
      <text x="164" y="282" textAnchor="middle" style={{...ink,fontSize:13}}>{generator ? 'U = ε − ri' : 'U = ε’ + r’i'}</text>
    </g>;
  }
  if (id === 'magnet-field') {
    const transform = `rotate(${value} 160 158)`;
    return <g data-physics-system="magnet-field">
      <g transform={transform}><rect x="76" y="135" width="168" height="46" rx="7" fill="var(--vs-burgundy)" {...ink}/><path d="M160 135v46" stroke="white" strokeWidth="3"/><text x="112" y="164" textAnchor="middle" fill="white" fontWeight="800">N</text><text x="207" y="164" textAnchor="middle" fill="white" fontWeight="800">S</text>
      {[28,52,76].map(offset => <path key={offset} d={`M78 ${150-offset}C124 ${58-offset/4} 196 ${58-offset/4} 242 ${150-offset}M78 ${150+offset}C124 ${242+offset/4} 196 ${242+offset/4} 242 ${150+offset}`} stroke="var(--vs-blue)" strokeWidth="2" fill="none" opacity=".8"/>)}</g>
      <circle cx="264" cy="77" r="25" fill="color-mix(in srgb,var(--vs-blue) 13%,transparent)" {...ink}/><path d="M264 96V58" {...wine}/><path d="M258 65l6-12 6 12" fill="var(--vs-burgundy)"/><text x="264" y="118" textAnchor="middle" style={{...ink,fontSize:11}}>bússola</text>
      <text x="160" y="284" textAnchor="middle" style={{...ink,fontSize:13}}>fora: N → S • dentro: S → N</text>
    </g>;
  }
  if (id === 'geometric-optics') {
    const screen = 110 + value * 20; const shadow = 17 + value * 7;
    return <g data-physics-system="geometric-optics">
      <circle cx="39" cy="150" r="14" fill="var(--vs-burgundy)"/><path d={`M53 150L${screen} ${150-shadow}M53 150L${screen} ${150+shadow}`} {...wine}/><path d="M106 105V195" stroke="var(--vs-ink)" strokeWidth="8"/><circle cx="106" cy="150" r="28" fill="var(--vs-ink)"/>
      <path d={`M${screen} 54V246`} stroke="var(--vs-blue)" strokeWidth="7"/><path d={`M${screen} ${150-shadow}V${150+shadow}`} stroke="color-mix(in srgb,var(--vs-burgundy) 38%,transparent)" strokeWidth="7"/><text x="39" y="184" textAnchor="middle" style={{...ink,fontSize:11}}>fonte</text><text x="106" y="229" textAnchor="middle" style={{...ink,fontSize:11}}>objeto</text><text x={screen} y="270" textAnchor="middle" style={{...ink,fontSize:11}}>tela</text>
      <path d={`M120 91H${screen-8}`} stroke="var(--vs-ink-muted)" strokeWidth="2"/><text x="170" y="82" textAnchor="middle" style={{...ink,fontSize:12}}>sombra</text>
      <text x="160" y="292" textAnchor="middle" style={{...ink,fontSize:13}}>raios tangentes delimitam a umbra</text>
    </g>;
  }
  if (id === 'optical-instruments') {
    const ratio = value / 8; const tube = 165 + Math.min(value / 20, 80);
    return <g data-physics-system="optical-instruments">
      <path d="M22 150H298" stroke="var(--vs-ink-muted)" strokeWidth="2" strokeDasharray="5 5"/><path d={`M71 90Q42 150 71 210M${tube} 91Q${tube+22} 150 ${tube} 209`} {...wine}/>
      <path d={`M28 91L71 130L${tube} 150M28 209L71 170L${tube} 150M${tube} 150L284 91M${tube} 150L284 209`} stroke="var(--vs-blue)" strokeWidth="3" fill="none"/>
      <path d={`M${tube+34} 112Q${tube+13} 150 ${tube+34} 188`} stroke="var(--vs-ink)" strokeWidth="5" fill="none"/><path d={`M${tube+78} 112Q${tube+99} 150 ${tube+78} 188`} stroke="var(--vs-ink)" strokeWidth="5" fill="none"/>
      <text x="70" y="237" textAnchor="middle" style={ink}>objetiva</text><text x={tube+56} y="237" textAnchor="middle" style={ink}>ocular</text><text x="161" y="75" textAnchor="middle" style={{...ink,fontSize:12}}>imagem real intermediária</text>
      <text x="161" y="283" textAnchor="middle" style={{...ink,fontSize:13}}>luneta: A = {decimal(ratio)}×</text>
    </g>;
  }
  if (id === 'wave-basics') {
    const wavelength = 52 + value * 17;
    const wave = Array.from({ length: 160 }, (_, n) => { const x = 25 + n * 1.7; return `${n ? 'L' : 'M'} ${x} ${150 - 37 * Math.sin((x - 25) * 2 * Math.PI / wavelength)}`; }).join(' ');
    return <g data-physics-system="wave-basics"><path d="M22 150H298" stroke="var(--vs-ink-muted)" strokeWidth="2"/><path d={wave} {...wine}/><path d={`M72 225H${72+wavelength}`} {...ink}/><path d={`M72 219v12M${72+wavelength} 219v12`} {...ink}/><text x={72+wavelength/2} y="246" textAnchor="middle" style={ink}>λ</text><path d="M38 150V113" stroke="var(--vs-blue)" strokeWidth="3"/><text x="49" y="118" style={ink}>A</text><text x="160" y="282" textAnchor="middle" style={{...ink,fontSize:13}}>v = λf • f permanece com a fonte</text></g>;
  }
  if (id === 'rope-boundary') {
    const fixed = value === 0; const reflected = fixed ? 174 : 126;
    return <g data-physics-system="rope-boundary"><path d="M20 150H278" stroke="var(--vs-ink-muted)" strokeWidth="2"/><path d="M20 150Q55 90 90 150T160 150" {...wine}/><path d={`M160 150Q195 ${reflected} 230 150T278 150`} stroke="var(--vs-blue)" strokeWidth="4" fill="none" strokeDasharray="7 4"/><path d="M282 68V232" stroke="var(--vs-ink)" strokeWidth={fixed ? 8 : 2}/>{!fixed && <circle cx="282" cy="150" r="11" fill="white" {...ink}/>}<text x="282" y="53" textAnchor="middle" style={ink}>{fixed ? 'fixa' : 'livre'}</text><text x="94" y="99" textAnchor="middle" style={{...ink,fontSize:12}}>incidente</text><text x="213" y={fixed ? 195 : 113} textAnchor="middle" style={{...ink,fontSize:12}}>refletida</text><text x="160" y="283" textAnchor="middle" style={{...ink,fontSize:13}}>{fixed ? 'crista retorna como vale' : 'crista retorna como crista'}</text></g>;
  }
  if (id === 'string-standing-wave') {
    const profile = (sign: 1 | -1) => Array.from({ length: 121 }, (_, index) => { const x = 35 + index * 2.1; const y = 150 + sign * 48 * Math.sin(Math.PI * value * index / 120); return `${index ? 'L' : 'M'} ${x} ${y}`; }).join(' ');
    const nodes = Array.from({length:value+1},(_,n)=>35+n*(252/value));
    return <g data-physics-system="string-standing-wave"><path d="M26 71V229M294 71V229" stroke="var(--vs-ink)" strokeWidth="8"/><path d={profile(-1)} {...wine}/><path d={profile(1)} stroke="var(--vs-blue)" strokeWidth="3" fill="none"/>{nodes.map(x=><g key={x}><circle cx={x} cy="150" r="4" fill="var(--vs-ink)"/><path d={`M${x} 214v15`} stroke="var(--vs-ink-muted)" strokeWidth="1"/></g>)}<text x="35" y="254" style={ink}>nó</text><text x="160" y="110" textAnchor="middle" style={{...ink,fontSize:12}}>ventre</text><text x="160" y="284" textAnchor="middle" style={{...ink,fontSize:13}}>L = {value}λ/2 • {value} ventres</text></g>;
  }
  const top = 191 - value * 9;
  return <g data-physics-system="quantum-photon">
    <rect x="44" y="38" width="104" height="198" rx="13" fill="color-mix(in srgb,var(--vs-blue) 12%,transparent)" stroke="var(--vs-ink)" strokeWidth="3"/>
    <path d="M60 207H134M60 164H134M60 108H134" {...ink}/><text x="142" y="211" style={ink}>E₀</text><text x="142" y="168" style={ink}>E₁</text><text x="142" y="112" style={ink}>E₂</text>
    <circle cx="97" cy="207" r="10" fill="var(--vs-blue)"/><path d={`M97 193V${top+15}`} {...wine}/><path d={`M88 ${top+28}l9-15 9 15`} fill="var(--vs-burgundy)"/>
    <circle cx="97" cy={top+38} r="10" fill="var(--vs-burgundy)"/><path d="M190 91q30-34 58 0t58 0" stroke="var(--vs-burgundy)" strokeWidth="5" fill="none"/>
    <path d="M190 121q30-34 58 0t58 0" stroke="var(--vs-blue)" strokeWidth="5" fill="none" opacity=".65"/><text x="248" y="63" textAnchor="middle" style={ink}>fótons incidentes</text>
    <path d="M194 195h94" stroke="var(--vs-ink-muted)" strokeWidth="2"/><text x="241" y="215" textAnchor="middle" style={{...ink,fontSize:12}}>E = hf</text><text x="160" y="283" textAnchor="middle" style={{...ink,fontSize:13}}>frequência maior → salto possível maior</text>
  </g>;
}

export function physicsRemainingInstrument(id: PhysicsRemainingId) {
  const config = PHYSICS_REMAINING[id];
  return function PhysicsRemainingBoard(props: BoardProps) {
    const [value, setValue] = useState(config.control.initial);
    const readouts = config.readouts(value);
    const pivot = readouts.find(item => item.pivot) ?? readouts[0];
    const pair = boardPair(props);
    const first = props.map.nodes[0];
    const second = props.map.nodes[2] ?? props.map.nodes.at(-1);
    return <BoardShell kicker="Laboratório de ondas e física moderna" title={config.name} subtitle={config.question} condition={{ label: 'Leitura', value: pivot.value }} ariaLabel={`Instrumento de física: ${props.map.title}`} emphasis={pair.emphasis} scene={<div className="vs-instrument"><svg className="vs-plane" viewBox="0 0 320 300" role="img" aria-label={`${config.name}; ${pivot.label}: ${pivot.value}`}><Scene id={id} value={value}/></svg><p className="vs-instrument-dica">mexa na grandeza e acompanhe a condição física desenhada</p><div className="vs-plane-controls"><div className="vs-plane-control"><label htmlFor={`physics-remaining-${id}`}><strong>{config.control.label}</strong><span>{config.control.description}</span><b>{value}</b></label><input id={`physics-remaining-${id}`} type="range" min={config.control.min} max={config.control.max} step={config.control.step} value={value} onChange={event => setValue(Number(event.target.value))}/></div></div><dl className="vs-plane-readouts">{readouts.map(item => <div key={item.label} data-pivot={item.pivot ? 'true' : undefined}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl></div>} left={{ label: STAGE_LABEL[first?.stage ?? 'conceito'], headline: first?.label ?? props.map.title, detail: short(first?.excerpt), formula: config.formula }} right={{ label: STAGE_LABEL[second?.stage ?? 'aplicacao'], headline: second?.label ?? props.map.title, detail: short(second?.excerpt), formula: pivot.value }} leftState={pair.leftState} rightState={pair.rightState} leftSelected={pair.leftSelected} rightSelected={pair.rightSelected} onSelectLeft={pair.selectLeft} onSelectRight={pair.selectRight} equation={{ label: 'Relação física', general: config.formula, condition: 'mostra', reduced: pivot.value }} closing={config.insight}/>;
  };
}
