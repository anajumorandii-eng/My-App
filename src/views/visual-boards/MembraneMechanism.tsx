import React, { useState } from 'react';
import { MechanismFrame, TimeControl, useMechanismTime } from './MechanismFrame';

export default function MembraneMechanism() {
  const [pump,setPump]=useState(false);
  const clock=useMechanismTime();
  const sodium=Math.min(1,clock.time*2);
  const potassium=Math.max(0,clock.time*2-1);
  return <MechanismFrame note="Representação de fluxo líquido e de um ciclo da bomba, sem escala molecular ou temporal. Partículas também se movem nos dois sentidos na difusão; o gradiente determina o saldo. Íons respondem ao gradiente eletroquímico." controls={<>
    <h3>{pump?'Três Na⁺ saem; dois K⁺ entram.':'Proteína não significa gasto de ATP.'}</h3>
    <div className="mechanism-options" role="group" aria-label="Transporte pela membrana">
      <button type="button" aria-pressed={!pump} onClick={()=>{clock.seek(0);setPump(false);}}>Difusão facilitada</button>
      <button type="button" aria-pressed={pump} onClick={()=>{clock.seek(0);setPump(true);}}>Bomba Na⁺/K⁺</button>
    </div>
    <p role="status">{pump?'Um ATP é hidrolisado por ciclo. Saem três cargas positivas e entram duas: saldo de uma carga positiva para fora.':'Soluto neutro: o fluxo líquido segue da maior para a menor concentração, por uma proteína, sem consumo direto de ATP.'}</p>
    <p>Transporte ativo primário usa energia diretamente, como esta ATPase. No secundário, o movimento de outro soluto a favor de seu gradiente fornece energia ao transporte contra o gradiente.</p>
    <TimeControl clock={clock} label="Percurso na membrana" />
  </>}>
    <svg viewBox="0 0 520 420" role="img" aria-label={pump?'Bomba de sódio e potássio: 3 Na⁺ para fora e 2 K⁺ para dentro por ATP':'Difusão facilitada de soluto neutro a favor do gradiente'}>
      <text x="25" y="30" className="mf-heading">MEMBRANA / SENTIDO E ENERGIA</text>
      <text x="30" y="75">meio extracelular</text><text x="30" y="375">citoplasma</text>
      {Array.from({length:15},(_,i)=><g key={i} stroke="var(--mf-gold)" fill="var(--mf-gold)">
        <circle cx={35+i*32} cy="180" r="7" /><path d={`M${32+i*32} 187V204M${38+i*32} 187V204`} />
        <circle cx={35+i*32} cy="230" r="7" /><path d={`M${32+i*32} 223V206M${38+i*32} 223V206`} />
      </g>)}
      <rect x="215" y="160" width="90" height="90" rx="22" fill="var(--vs-paper)" stroke="var(--mf-blue)" strokeWidth="4" />
      {pump?<>
        {[0,1,2].map(i=><g key={i} transform={`translate(${232+i*27},${305-190*sodium})`}><circle r="12" fill="var(--mf-gold)"/><text y="5" textAnchor="middle" className="mf-small">Na⁺</text></g>)}
        {[0,1].map(i=><g key={i} transform={`translate(${242+i*35},${110+190*potassium})`}><circle r="13" fill="var(--mf-blue)"/><text y="5" textAnchor="middle" className="mf-small">K⁺</text></g>)}
        <text x="390" y="280" textAnchor="middle">{clock.time===0?'ATP':'ADP + Pᵢ'}</text>
      </>:<>
        {[0,1,2,3,4,5].map(i=><circle key={i} cx={65+i*60} cy={105+(i%2)*30} r="7" fill="var(--mf-red)"/>)}
        <circle cx="80" cy="315" r="7" fill="var(--mf-red)"/>
        <circle cx="260" cy={125+190*clock.time} r="9" fill="var(--mf-red)" stroke="var(--vs-ink)"/>
        <text x="380" y="295" textAnchor="middle">fluxo líquido ↓</text>
      </>}
    </svg>
  </MechanismFrame>;
}
