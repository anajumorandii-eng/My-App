import React, { useState } from 'react';
import { MechanismFrame, TimeControl, useMechanismTime } from './MechanismFrame';

export const concentrationRatio = (a: number, b: number) => 10 ** (b - a);

export default function PhMechanism() {
  const [a, setA] = useState(3);
  const [b, setB] = useState(5);
  const clock = useMechanismTime();
  const x = (ph: number) => 50 + ph * 30;
  const current = a + (b - a) * clock.time;
  const ratio = concentrationRatio(a, b);
  return <MechanismFrame note="Soluções aquosas ideais diluídas a 25 °C: pH ≈ −log[H₃O⁺]. Comparação de concentrações, não simulação de mistura ou diluição de um ácido específico." controls={<>
    <h3>Um passo no pH muda dez vezes a concentração.</h3>
    <label>pH da solução A: {a}<input type="range" min="1" max="13" step="1" value={a} onChange={e => {clock.seek(0);setA(Number(e.target.value));}} /></label>
    <label>pH da solução B: {b}<input type="range" min="1" max="13" step="1" value={b} onChange={e => {clock.seek(0);setB(Number(e.target.value));}} /></label>
    <p role="status">[H₃O⁺]A / [H₃O⁺]B = 10^{b - a} = {ratio.toLocaleString('pt-BR', {maximumSignificantDigits: 4})}. {a === b ? 'Concentrações iguais.' : a < b ? 'A tem maior concentração de H₃O⁺.' : 'B tem maior concentração de H₃O⁺.'}</p>
    <p>O marcador percorre a escala logarítmica. O mesmo deslocamento corresponde ao mesmo fator multiplicativo, não à mesma diferença de concentração.</p>
    <TimeControl clock={clock} label="Comparação na escala de pH" />
  </>}>
    <svg viewBox="0 0 520 440" role="img" aria-label={`Comparação de pH: solução A ${a}, solução B ${b}; razão de concentrações 10 elevado a ${b-a}`}>
      <text x="25" y="30" className="mf-heading">pH / DISTÂNCIA IGUAL, FATOR IGUAL</text>
      <rect x="50" y="130" width="210" height="40" fill="var(--mf-red)" opacity=".25" />
      <rect x="260" y="130" width="210" height="40" fill="var(--mf-blue)" opacity=".25" />
      <path d="M50 170H470M260 115V185" stroke="var(--vs-ink)" fill="none" />
      {[0,2,4,6,8,10,12,14].map(n => <text key={n} x={x(n)} y="200" textAnchor="middle">{n}</text>)}
      <text x="150" y="155" textAnchor="middle">ácida</text><text x="370" y="155" textAnchor="middle">básica</text>
      <text x="260" y="103" textAnchor="middle">7: neutra a 25 °C</text>
      <path d={`M${x(a)} 220V240H${x(b)}V220`} fill="none" stroke="var(--mf-green)" strokeWidth="3" />
      <circle cx={x(current)} cy="170" r="7" fill="var(--mf-gold)" stroke="var(--vs-ink)" />
      <text x="125" y="288" textAnchor="middle">A: pH {a}</text><text x="395" y="288" textAnchor="middle">B: pH {b}</text>
      <text x="125" y="322" textAnchor="middle">10^{-a} mol/L</text><text x="395" y="322" textAnchor="middle">10^{-b} mol/L</text>
      <text x="260" y="375" textAnchor="middle">ΔpH = {b-a} → fator 10^{b-a}</text>
      <text x="260" y="415" textAnchor="middle">Menor pH → maior [H₃O⁺]</text>
    </svg>
  </MechanismFrame>;
}
