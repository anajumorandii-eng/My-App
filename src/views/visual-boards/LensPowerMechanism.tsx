import React, { useState } from 'react';
import { MechanismFrame, TimeControl, useMechanismTime } from './MechanismFrame';

export const lensPower = (medium: number, radius: number) => (1.5 / medium - 1) * (2 / radius);
export default function LensPowerMechanism() {
  const [medium,setMedium]=useState(1);
  const [radius,setRadius]=useState(.2);
  const [second,setSecond]=useState(0);
  const clock=useMechanismTime();
  const power=lensPower(medium,radius)+second;
  const scale=400;
  const fmt=(n:number)=>n.toLocaleString('pt-BR',{maximumFractionDigits:2});
  return <MechanismFrame note="Lentes delgadas, raios paraxiais e associação em contato no mesmo meio. n da lente = 1,5; R₁ = +R, R₂ = −R, com luz para a direita. V = 1/f em m⁻¹. O foco pode ficar fora da janela. A segunda lente é dada por sua vergência no meio selecionado." controls={<>
    <h3>Curvatura e meio mudam o foco.</h3>
    <label>Índice do meio: {fmt(medium)}<input type="range" min="1" max="1.6" step=".1" value={medium} onChange={e=>{clock.seek(0);setMedium(Number(e.target.value));}} /></label>
    <label>Raio de curvatura: {fmt(radius)} m<input type="range" min=".2" max=".5" step=".1" value={radius} onChange={e=>{clock.seek(0);setRadius(Number(e.target.value));}} /></label>
    <label>Segunda lente: {second} m⁻¹<input type="range" min="-5" max="5" step="1" value={second} onChange={e=>{clock.seek(0);setSecond(Number(e.target.value));}} /></label>
    <p role="status">V₁ = {fmt(lensPower(medium,radius))}; V₂ = {second}; V total = {fmt(power)} m⁻¹. {Math.abs(power)<1e-9?'Sistema afocal: raios paralelos permanecem paralelos.':`f = ${fmt(1/power)} m; ${power>0?'convergente':'divergente'}.`}</p>
    <TimeControl clock={clock} label="Traçado da lente equivalente" />
  </>}>
    <svg viewBox="0 0 520 420" role="img" aria-label={`Lente equivalente com vergência ${fmt(power)} por metro`}>
      <text x="25" y="30" className="mf-heading">FABRICANTE / ASSOCIAÇÃO EM CONTATO</text>
      <path d="M20 205H500" className="mf-axis" />
      <path d="M240 75V330" stroke="var(--mf-blue)" strokeWidth="8" />
      <text x="240" y="60" textAnchor="middle">lente equivalente</text>
      {[-1,1].map(sign=>{
        const y=205+sign*20, end=205+sign*20*(1-260*power/scale);
        return <g key={sign}><path d={`M20 ${y}H240L500 ${end}`} fill="none" stroke="var(--mf-gold)" strokeWidth="2" pathLength="1" strokeDasharray="1" strokeDashoffset={1-clock.time} />
          {power<0 && <path d={`M240 ${y}L20 ${205+sign*20*(1+220*power/scale)}`} fill="none" stroke="var(--mf-red)" strokeDasharray="5 5" />}</g>;
      })}
      <text x="260" y="365" textAnchor="middle">V₁ = (n lente / n meio − 1) × 2/R</text>
      <text x="260" y="400" textAnchor="middle">V total = V₁ + V₂</text>
    </svg>
  </MechanismFrame>;
}
