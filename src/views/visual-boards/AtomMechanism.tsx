import React, { useState } from 'react';
import { MechanismFrame, TimeControl, useMechanismTime } from './MechanismFrame';

export const hydrogenEnergy = (n: number) => -13.6 / (n * n);
export default function AtomMechanism() {
  const [bohr, setBohr] = useState(false);
  const [emission, setEmission] = useState(true);
  const clock = useMechanismTime();
  const from = emission ? 3 : 2;
  const to = emission ? 2 : 3;
  const energy = Math.abs(hydrogenEnergy(to) - hydrogenEnergy(from));
  const y = (n: number) => 358 - (hydrogenEnergy(n) + 13.6) * 20;
  const rays = [0, 1, 2, 3, 4, 5].map(i => ({ start: 171 + i * 16, end: 171 + i * 16 }));
  return <MechanismFrame note={bohr ? 'Hidrogênio no modelo de Bohr. Altura representa energia; não a trajetória espacial de um elétron.' : 'Montagem e trajetórias esquemáticas. O número de raios desenhados não representa a proporção experimental.'} controls={<>
    <div className="mechanism-options" role="group" aria-label="Evidência atômica"><button type="button" aria-pressed={!bohr} onClick={() => { clock.seek(0); setBohr(false); }}>Lâmina de ouro</button><button type="button" aria-pressed={bohr} onClick={() => { clock.seek(0); setBohr(true); }}>Níveis de Bohr</button></div>
    <h3>{bohr ? 'A diferença de energia vira um fóton.' : 'A maioria atravessa; poucas desviam muito.'}</h3>
    {bohr && <div className="mechanism-options" role="group" aria-label="Transição eletrônica">{['Emissão 3 → 2', 'Absorção 2 → 3'].map((label, i) => <button type="button" key={label} aria-pressed={emission === (i === 0)} onClick={() => { clock.seek(0); setEmission(i === 0); }}>{label}</button>)}</div>}
    <p role="status">{bohr ? `${emission ? 'Emissão' : 'Absorção'}: |ΔE| = ${energy.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} eV. O fóton tem energia hν = |ΔE|.` : 'Os grandes desvios de algumas partículas alfa sustentam a existência de um núcleo pequeno, denso e positivo. A maior parte do volume permite a passagem.'}</p>
    <p>{bohr ? 'O elétron aparece apenas nos níveis permitidos. A troca de nível é mostrada como um salto; a posição do fóton é esquemática, sem escala de tempo.' : 'O resultado contraria uma carga positiva espalhada uniformemente. Ele não determina, sozinho, os níveis de energia de Bohr.'}</p>
    <TimeControl clock={clock} label={bohr ? 'Demonstração da transição' : 'Percurso das partículas alfa'} />
  </>}>
    <svg viewBox="0 0 520 440" role="img" aria-label={bohr ? `Hidrogênio: ${emission ? 'emissão do nível 3 para 2' : 'absorção do nível 2 para 3'}` : 'Experimento de Rutherford com fonte alfa, lâmina fina de ouro e tela detectora'}>
      <text x="24" y="30" className="mf-heading">{bohr ? 'BOHR / NÍVEIS DISCRETOS' : 'RUTHERFORD / ESPALHAMENTO ALFA'}</text>
      {bohr ? <>
        <path d="M53 385V63" className="mf-axis" /><text x="24" y="66">E</text>
        {[1, 2, 3].map(n => <g key={n}><path d={`M83 ${y(n)}H330`} stroke="var(--mf-blue)" strokeWidth="2" /><text x="343" y={y(n) + 5}>n={n} · {hydrogenEnergy(n).toFixed(2)} eV</text></g>)}
        <path d={`M204 ${y(from)}V${y(to)}`} stroke="var(--mf-red)" strokeDasharray="4 4" strokeWidth="2" />
        <circle aria-label={`Elétron no nível ${clock.time < .5 ? from : to}`} cx="204" cy={y(clock.time < .5 ? from : to)} r="7" fill="var(--mf-red)" />
        <path d={`M${emission ? 224 : 440} 208L${emission ? 440 : 224} 208`} stroke="var(--mf-gold)" strokeDasharray="3 4" />
        <g transform={`translate(${emission ? 224 + 216 * clock.time : 440 - 216 * clock.time} 208)`}><path d="M-14 0q5-15 10 0t10 0 10 0" fill="none" stroke="var(--mf-gold)" strokeWidth="3" /></g>
        <text x="317" y="240" textAnchor="middle">fóton · hν</text>
        <text x="260" y="415" textAnchor="middle">A energia não varia continuamente.</text>
      </> : <>
        <path d="M316 73C512 70 520 365 316 369" fill="none" stroke="var(--mf-green)" strokeWidth="13" />
        <text x="337" y="56">tela detectora</text>
        <path d="M28 177H89V254H28Z" fill="color-mix(in srgb,var(--vs-ink) 15%,var(--vs-paper))" stroke="var(--vs-ink)" />
        <circle cx="60" cy="216" r="12" fill="var(--mf-red)" /><text x="26" y="285">fonte α</text>
        <path d="M235 116l18 7v205l-18-7Z" fill="var(--mf-gold)" stroke="var(--vs-ink)" /><text x="176" y="359">lâmina fina de ouro</text>
        {rays.map((ray, i) => <g key={i}><path d={`M90 ${ray.start}H460`} stroke="var(--mf-blue)" opacity=".3" /><circle cx={90 + 370 * clock.time} cy={ray.start} r="3" fill="var(--mf-blue)" /></g>)}
        <path d="M90 216H244L404 103M90 223H244L146 115" fill="none" stroke="var(--mf-red)" strokeWidth="2" />
        {[{x:404,y:103,start:216},{x:146,y:115,start:223}].map(p => { const after = Math.max(0, (clock.time - .42) / .58); return <circle key={p.x} cx={clock.time <= .42 ? 90 + 154 * clock.time / .42 : 244 + (p.x - 244) * after} cy={clock.time <= .42 ? p.start : p.start + (p.y - p.start) * after} r="4" fill="var(--mf-red)" />; })}
        <text x="260" y="408" textAnchor="middle">Núcleo pequeno, denso e positivo.</text>
      </>}
    </svg>
  </MechanismFrame>;
}
