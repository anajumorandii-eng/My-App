import React, { useState } from 'react';
import { MechanismFrame, TimeControl, useMechanismTime } from './MechanismFrame';

export default function OsmosisMechanism() {
  const [medium,setMedium]=useState(0);
  const clock=useMechanismTime();
  const labels=['Hipotônico','Isotônico','Hipertônico'];
  const delta=[1,0,-1][medium];
  const animal=62+delta*18*clock.time;
  const plant=70+(delta===1?7:delta===-1?-20:0)*clock.time;
  return <MechanismFrame note="Comparação qualitativa com solutos que não atravessam a membrana. Mesma pressão inicial; água cruza nos dois sentidos. As setas mostram o saldo. A parede limita a expansão vegetal; o desenho não simula ruptura nem prevê volumes reais." controls={<>
    <h3>Quem atravessa é a água.</h3>
    <div className="mechanism-options" role="group" aria-label="Tonicidade do meio externo">{labels.map((label,i)=><button key={label} type="button" aria-pressed={medium===i} onClick={()=>{clock.seek(0);setMedium(i);}}>{label}</button>)}</div>
    <p role="status">{delta===1?'Meio externo hipotônico: água entra. A célula animal aumenta; a vegetal fica túrgida, contida pela parede.':delta===-1?'Meio externo hipertônico: água sai. A célula animal encolhe; o protoplasto vegetal se retrai, afastando-se da parede (plasmólise).':'Meio isotônico: não há fluxo líquido de água; as trocas continuam nos dois sentidos. A célula vegetal pode permanecer flácida.'}</p>
    <TimeControl clock={clock} label="Mudança osmótica" />
  </>}>
    <svg viewBox="0 0 520 400" role="img" aria-label={`Osmose em células animal e vegetal: meio ${labels[medium].toLowerCase()}`}>
      <text x="25" y="30" className="mf-heading">OSMOSE / A PAREDE MUDA O DESFECHO</text>
      <text x="130" y="90" textAnchor="middle">animal</text><text x="385" y="90" textAnchor="middle">vegetal</text>
      <circle cx="130" cy="220" r={animal} fill="var(--mf-blue)" fillOpacity=".18" stroke="var(--mf-red)" strokeWidth="3" />
      <rect x="298" y="133" width="174" height="174" rx="12" fill="none" stroke="var(--mf-green)" strokeWidth="7" />
      <rect x={385-plant} y={220-plant} width={plant*2} height={plant*2} rx="20" fill="var(--mf-blue)" fillOpacity=".18" stroke="var(--mf-red)" strokeWidth="3" />
      {[130,385].map(x=><g key={x}><path d={`M${x} 110V180`} stroke="var(--mf-blue)" strokeDasharray="5 5" />
        <circle cx={x} cy={delta===0?145:delta===1?110+70*clock.time:180-70*clock.time} r="7" fill="var(--mf-blue)" />
        <text x={x+20} y="125">H₂O</text></g>)}
      <text x="130" y="355" textAnchor="middle">membrana flexível</text><text x="385" y="355" textAnchor="middle">parede resistente</text>
    </svg>
  </MechanismFrame>;
}
