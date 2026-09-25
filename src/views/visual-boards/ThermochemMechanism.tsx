import React, { useState } from 'react';
import { MechanismFrame, TimeControl, useMechanismTime } from './MechanismFrame';

export function enthalpyProfile(progress: number, endothermic: boolean) {
  const start = endothermic ? 275 : 155;
  const end = endothermic ? 155 : 275;
  return progress <= .5 ? start + (75 - start) * Math.sin(Math.PI * progress) : 75 + (end - 75) * (1 - Math.cos(Math.PI * (progress - .5)));
}

export default function ThermochemMechanism({ hess = false }: { hess?: boolean }) {
  const [endo, setEndo] = useState(false);
  const [indirect, setIndirect] = useState(true);
  const clock = useMechanismTime();
  const start = endo ? 275 : 155;
  const end = endo ? 155 : 275;
  const profile = Array.from({ length: 81 }, (_, i) => `${i ? 'L' : 'M'}${80 + i * 4.5} ${enthalpyProfile(i / 80, endo)}`).join(' ');
  const hessPoints = indirect ? [{ x: 105, y: 120 }, { x: 255, y: 200 }, { x: 405, y: 320 }] : [{ x: 105, y: 120 }, { x: 405, y: 320 }];
  const local = indirect ? Math.min(clock.time * 2, 1) : clock.time;
  const a = indirect && clock.time > .5 ? hessPoints[1] : hessPoints[0];
  const b = indirect && clock.time <= .5 ? hessPoints[1] : hessPoints[hessPoints.length - 1];
  const t = indirect && clock.time > .5 ? clock.time * 2 - 1 : local;
  return <MechanismFrame note={hess ? 'Estados A, B e C hipotéticos. Valores em kJ por reação como escrita; não são dados de uma substância.' : 'Perfil energético esquemático. O eixo horizontal é o avanço da reação, não o tempo.'} controls={<>
    <div className="mechanism-options" role="group" aria-label={hess ? 'Caminhos da reação' : 'Troca de calor'}>
      {(hess ? ['Por B', 'Direto'] : ['Exotérmica', 'Endotérmica']).map((label, i) => <button type="button" key={label} aria-pressed={hess ? indirect === (i === 0) : endo === (i === 1)} onClick={() => { clock.seek(0); if (hess) setIndirect(i === 0); else setEndo(i === 1); }}>{label}</button>)}
    </div>
    <h3>{hess ? 'O caminho muda; o saldo permanece.' : endo ? 'O sistema recebe calor.' : 'O sistema entrega calor.'}</h3>
    <p role="status">{hess ? indirect ? 'A → B: −40 kJ. B → C: −60 kJ. Soma: −100 kJ.' : 'A → C: −100 kJ. Mesmos estados inicial e final, mesmo ΔH.' : endo ? 'Hprodutos > Hreagentes: ΔH positivo. O calor é absorvido pelo sistema.' : 'Hprodutos < Hreagentes: ΔH negativo. O calor é liberado para a vizinhança.'}</p>
    <p>{hess ? 'Somar equações exige cancelar os intermediários. Ao inverter uma equação, inverta o sinal de ΔH; ao multiplicá-la, multiplique também ΔH.' : 'Ea é a diferença entre o nível dos reagentes e o pico. O sinal de ΔH não basta para determinar velocidade ou espontaneidade.'}</p>
    <TimeControl clock={clock} label={hess ? 'Percurso entre os estados' : 'Avanço da reação'} />
  </>}>
    <svg viewBox="0 0 520 455" role="img" aria-label={hess ? `Lei de Hess: ${indirect ? 'A para B para C' : 'A para C'}, variação total menos 100 quilojoules` : `Perfil ${endo ? 'endotérmico, delta H positivo' : 'exotérmico, delta H negativo'}, com barreira de ativação`}>
      <text x="26" y="28" className="mf-heading">{hess ? 'LEI DE HESS / ENTALPIA É FUNÇÃO DE ESTADO' : 'ENTALPIA / OLHE PARA O SISTEMA'}</text>
      <path d="M45 345V55m0 290H478" className="mf-axis" /><text x="22" y="65">H</text><text x="295" y="373">avanço da reação</text>
      {hess ? <>
        {[{ x: 105, y: 120, name: 'A', h: '0' }, { x: 255, y: 200, name: 'B', h: '−40' }, { x: 405, y: 320, name: 'C', h: '−100' }].map(p => <g key={p.name}><path d={`M${p.x - 35} ${p.y}h70`} stroke="var(--mf-blue)" strokeWidth="3" /><text x={p.x} y={p.y - 15} textAnchor="middle">{p.name} · {p.h} kJ</text></g>)}
        <path d="M105 120 405 320" stroke="var(--mf-red)" strokeWidth={indirect ? 1 : 3} strokeDasharray={indirect ? '4 5' : undefined} />
        <path d="M105 120 255 200 405 320" fill="none" stroke="var(--mf-blue)" strokeWidth={indirect ? 3 : 1} strokeDasharray={indirect ? undefined : '4 5'} />
        <circle cx={a.x + (b.x - a.x) * t} cy={a.y + (b.y - a.y) * t} r="7" fill="var(--mf-gold)" stroke="var(--vs-ink)" />
        <text x="260" y="418" textAnchor="middle">−40 + (−60) = −100 kJ</text>
      </> : <>
        <path d={profile} fill="none" stroke="var(--mf-blue)" strokeWidth="3" />
        <path d={`M65 ${start}h67M404 ${end}h65`} stroke="var(--mf-blue)" strokeWidth="3" />
        <text x="75" y={start + 27}>reagentes</text><text x="389" y={end + 27}>produtos</text>
        <path d={`M166 ${start}V75m-5 0h10M161 ${start}h10M166 75H260`} fill="none" stroke="var(--mf-gold)" strokeDasharray="4 4" /><text x="135" y={(start + 75) / 2}>Ea</text>
        <path d={`M474 ${start}V${end}m-5 0h10M469 ${start}h10`} fill="none" stroke="var(--mf-red)" strokeWidth="2" /><text x="393" y="225">ΔH {endo ? '> 0' : '< 0'}</text>
        <circle cx={80 + 360 * clock.time} cy={enthalpyProfile(clock.time, endo)} r="7" fill="var(--mf-gold)" stroke="var(--vs-ink)" />
        <rect x="54" y="397" width="134" height="38" rx="5" fill="none" stroke="var(--mf-blue)" /><text x="121" y="422" textAnchor="middle">sistema</text><text x="404" y="422" textAnchor="middle">vizinhança</text>
        <path d={endo ? 'M327 416H205l8-6m-8 6 8 6' : 'M205 416H327l-8-6m8 6-8 6'} fill="none" stroke="var(--mf-red)" strokeWidth="2" />
        <circle cx={endo ? 327 - 122 * clock.time : 205 + 122 * clock.time} cy="416" r="5" fill="var(--mf-red)" />
        <text x="262" y="403" textAnchor="middle" className="mf-small">calor</text>
      </>}
    </svg>
  </MechanismFrame>;
}
