import React, { useState } from 'react';
import { MechanismFrame, TimeControl, useMechanismTime } from './MechanismFrame';

const cases = [
  { label: 'Brønsted–Lowry', title: 'O próton muda de parceiro.', left: 'CH₃COOH', right: 'NH₃', products: 'CH₃COO⁻ + NH₄⁺', detail: 'CH₃COOH doa H⁺; NH₃ recebe H⁺. Os pares conjugados são CH₃COOH/CH₃COO⁻ e NH₄⁺/NH₃.', moving: 'H⁺' },
  { label: 'Lewis', title: 'Um par eletrônico forma a ligação.', left: 'NH₃', right: 'BF₃', products: 'H₃N→BF₃', detail: 'O nitrogênio da amônia doa um par eletrônico; o boro de BF₃ o recebe. Não há transferência de próton neste exemplo.', moving: '••' },
  { label: 'Equação iônica', title: 'Espectadores permanecem na solução.', left: 'H₃O⁺', right: 'OH⁻', products: '2 H₂O', detail: 'HCl e NaOH em água: Na⁺ e Cl⁻ aparecem inalterados nos dois lados. Cancelá-los na escrita não os retira da solução. H₃O⁺ + OH⁻ → 2 H₂O.', moving: 'H⁺' },
] as const;

export default function AcidTheoryMechanism() {
  const [index, setIndex] = useState(0);
  const clock = useMechanismTime();
  const c = cases[index];
  return <MechanismFrame note="Esquemas de transformação e contabilidade de espécies; não representam trajetórias moleculares, velocidades nem proporções de equilíbrio. O par eletrônico de Lewis torna-se compartilhado na ligação." controls={<>
    <h3>{c.title}</h3>
    <div className="mechanism-options" role="group" aria-label="Teoria ou representação">{cases.map((item,n)=><button key={item.label} type="button" aria-pressed={n===index} onClick={()=>{clock.seek(0);setIndex(n);}}>{item.label}</button>)}</div>
    <p role="status">{c.detail}</p>
    <TimeControl clock={clock} label="Transformação ácido-base" />
  </>}>
    <svg viewBox="0 0 520 420" role="img" aria-label={`${c.label}: ${c.detail}`}>
      <text x="25" y="30" className="mf-heading">ÁCIDOS E BASES / O QUE É TRANSFERIDO?</text>
      <circle cx="120" cy="175" r="65" fill="var(--mf-red)" opacity=".12" />
      <circle cx="400" cy="175" r="65" fill="var(--mf-blue)" opacity=".12" />
      <text x="120" y="180" textAnchor="middle">{c.left}</text><text x="400" y="180" textAnchor="middle">{c.right}</text>
      <path d="M180 140Q260 65 340 140" fill="none" stroke="var(--vs-ink)" strokeDasharray="4 5" />
      <g transform={`translate(${180+160*clock.time},${140-150*clock.time*(1-clock.time)})`}>
        <circle r="23" fill="var(--vs-paper)" stroke="var(--mf-gold)" strokeWidth="2" /><text y="6" textAnchor="middle">{c.moving}</text>
      </g>
      {index===2 && <g fill="none"><text x="70" y="260">Na⁺</text><text x="390" y="260">Cl⁻</text><text x="260" y="292" textAnchor="middle">continuam dissolvidos</text></g>}
      <text x="260" y="350" textAnchor="middle">{clock.time===1?'Resultado:':'Ao concluir:'} {c.products}</text>
      <text x="260" y="392" textAnchor="middle">{index===1?'Base doa o par; ácido recebe.':'Ácido doa H⁺; base recebe.'}</text>
    </svg>
  </MechanismFrame>;
}
