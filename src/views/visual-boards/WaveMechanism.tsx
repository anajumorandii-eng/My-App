import React, { useState } from 'react';
import { MechanismFrame, TimeControl, useMechanismTime } from './MechanismFrame';

export type WaveKind = 'transverse' | 'sound' | 'electromagnetic';
export const wavelength = (frequency: number) => 240 / frequency;
export const waveValue = (x: number, frequency: number, phase: number) => Math.sin(2 * Math.PI * (x / wavelength(frequency) - phase));

export default function WaveMechanism({ kind }: { kind: WaveKind }) {
  const [frequency, setFrequency] = useState(2);
  const [amplitude, setAmplitude] = useState(40);
  const clock = useMechanismTime();
  const lambda = wavelength(frequency);
  const points = Array.from({ length: 121 }, (_, i) => ({ x: 50 + i * 3.5, value: waveValue(i * 3.5, frequency, clock.time) }));
  const curve = points.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(2)} ${(230 - amplitude * p.value).toFixed(2)}`).join(' ');
  return <MechanismFrame note={kind === 'electromagnetic' ? 'Campos em perspectiva; amplitudes de E e B normalizadas, sem escala comum de unidades.' : 'Modelo idealizado: uma reprodução equivale a um período, sem escala temporal real. Pontos representam posições do meio.'} controls={<>
    <h3>{kind === 'sound' ? 'A compressão avança. O meio oscila.' : kind === 'electromagnetic' ? 'Campos oscilantes, sem meio material.' : 'A onda avança. O ponto oscila.'}</h3>
    <label>Frequência relativa: {frequency}<input type="range" min="1" max="3" step="1" value={frequency} onChange={event => { clock.seek(0); setFrequency(Number(event.target.value)); }} /></label>
    <label>Amplitude relativa: {amplitude}<input type="range" min="20" max="60" step="10" value={amplitude} onChange={event => { clock.stop(); setAmplitude(Number(event.target.value)); }} /></label>
    <p role="status">Mesmo meio: v constante. Com f = {frequency}, λ = {lambda} unidades. A amplitude altera a oscilação, sem alterar λ neste modelo.</p>
    <p>{kind === 'sound' ? 'No ar, as partículas oscilam na mesma direção em que o som se propaga. Compressões e rarefações se deslocam.' : kind === 'electromagnetic' ? 'E e B são perpendiculares entre si e à propagação. A onda eletromagnética pode se propagar no vácuo.' : 'A marca vermelha acompanha um ponto da corda: ele sobe e desce, enquanto o perfil se propaga para a direita.'}</p>
    <TimeControl clock={clock} label="Fração de um período" />
  </>}>
    <svg viewBox="0 0 520 430" role="img" aria-label={kind === 'sound' ? 'Som longitudinal: compressões, rarefações e uma partícula oscilando horizontalmente' : kind === 'electromagnetic' ? 'Onda eletromagnética: campos E e B transversais à propagação' : 'Onda transversal com ponto do meio oscilando verticalmente'}>
      <text x="28" y="35" className="mf-heading">{kind === 'sound' ? 'SOM EM UM MEIO MATERIAL' : kind === 'electromagnetic' ? 'DOIS CAMPOS TRANSVERSAIS' : 'UMA CORDA EM OSCILAÇÃO'}</text>
      <path d="M50 100H470l-12-7m12 7-12 7" stroke="var(--mf-green)" strokeWidth="2" fill="none" /><text x="260" y="84" textAnchor="middle">propagação →</text>
      <path d="M35 230H488" className="mf-axis" />
      {kind === 'sound' ? <>
        {Array.from({ length: 43 }, (_, i) => Array.from({ length: 5 }, (_, row) => <circle key={`${i}-${row}`} cx={50 + i * 10 + amplitude * .16 * waveValue(i * 10, frequency, clock.time)} cy={190 + row * 20} r="2.6" fill="var(--mf-blue)" />))}
        <path d="M254 307H306m-52 0 8-5m-8 5 8 5m44-5-8-5m8 5-8 5" stroke="var(--mf-red)" fill="none" />
        <circle cx={280 + amplitude * .16 * waveValue(230, frequency, clock.time)} cy="230" r="6" fill="var(--mf-red)" />
        <text x="280" y="337" textAnchor="middle">oscilação paralela</text>
      </> : <>
        {kind === 'electromagnetic' && <>
          <path d={points.map((p, i) => `${i ? 'L' : 'M'}${(p.x + amplitude * p.value * .48).toFixed(2)} ${(230 + amplitude * p.value * .55).toFixed(2)}`).join(' ')} fill="none" stroke="var(--mf-green)" strokeWidth="3" />
          {points.filter((_, i) => i % 8 === 0).map(p => <path key={p.x} d={`M${p.x} 230l${amplitude * p.value * .48} ${amplitude * p.value * .55}`} stroke="var(--mf-green)" opacity=".4" />)}
          <text x="445" y="322" fill="var(--mf-green)">B</text><text x="30" y="175">E</text>
        </>}
        <path d={curve} fill="none" stroke="var(--mf-blue)" strokeWidth="3" />
        {kind === 'transverse' && <><path d="M280 150V310m0-160-6 10m6-10 6 10m-6 150-6-10m6 10 6-10" stroke="var(--mf-red)" opacity=".4" /><circle cx="280" cy={230 - amplitude * waveValue(230, frequency, clock.time)} r="6" fill="var(--mf-red)" /><text x="280" y="345" textAnchor="middle">ponto fixo na direção horizontal</text></>}
      </>}
      <path d={`M60 385h${lambda}m0-6v12M60 379v12`} fill="none" stroke="var(--vs-ink)" /><text x={60 + lambda / 2} y="410" textAnchor="middle">λ = {lambda}</text>
    </svg>
  </MechanismFrame>;
}
