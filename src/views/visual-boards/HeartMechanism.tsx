import React, { useState } from 'react';
import { MechanismFrame, TimeControl, useMechanismTime } from './MechanismFrame';

const stops = [
  { label: 'Corpo → veias cavas', text: 'Após as trocas nos tecidos, o sangue com menos O₂ retorna pelas veias cavas ao átrio direito.', x: 160, y: 232, oxygenated: false },
  { label: 'Átrio → ventrículo direito', text: 'O sangue atravessa a valva tricúspide e chega ao ventrículo direito.', x: 166, y: 333, oxygenated: false },
  { label: 'Ventrículo direito → pulmões', text: 'As artérias pulmonares saem do coração levando sangue com menos O₂ aos pulmões.', x: 123, y: 115, oxygenated: false },
  { label: 'Pulmões → átrio esquerdo', text: 'Após ganhar O₂ nos capilares pulmonares, o sangue retorna pelas veias pulmonares ao átrio esquerdo.', x: 348, y: 232, oxygenated: true },
  { label: 'Átrio → ventrículo esquerdo', text: 'O sangue atravessa a valva mitral e chega ao ventrículo esquerdo.', x: 354, y: 333, oxygenated: true },
  { label: 'Ventrículo esquerdo → corpo', text: 'A aorta leva sangue com mais O₂ aos tecidos. A circulação sistêmica se completa pelo retorno venoso.', x: 260, y: 445, oxygenated: true },
];
const routes = [
  [[260,445],[70,445],[70,232],[160,232]],
  [[160,232],[164,282],[166,333]],
  [[166,333],[114,333],[85,176],[123,115]],
  [[123,115],[220,80],[380,115],[422,178],[422,232],[348,232]],
  [[348,232],[350,282],[354,333]],
  [[354,333],[454,333],[454,445],[260,445]],
];
export default function HeartMechanism() {
  const [active, setActive] = useState(0);
  const clock = useMechanismTime();
  const route = routes[active];
  const index = Math.min(Math.floor(clock.time * (route.length - 1)), route.length - 2);
  const t = clock.time * (route.length - 1) - index;
  const a = route[index]; const b = route[index + 1];
  return <MechanismFrame note="Esquema de conexões, não corte anatômico. Azul e vermelho indicam oxigenação relativa; o sangue não é azul." controls={<>
    <h3>Duas circulações, um percurso contínuo.</h3>
    <div className="mechanism-options" role="group" aria-label="Percurso do sangue">{stops.map((stop, i) => <button type="button" key={stop.label} aria-pressed={active === i} onClick={() => { clock.seek(0); setActive(i); }}>{i + 1}. {stop.label}</button>)}</div>
    <p role="status">{stops[active].text}</p>
    <p>Artéria sai do coração; veia chega ao coração. Essa classificação depende da direção, não da quantidade de O₂.</p>
    <TimeControl clock={clock} label="Percurso do trecho selecionado" />
  </>}>
    <svg viewBox="0 0 520 510" role="img" aria-label={`Circulação humana: ${stops[active].label}`}>
      <text x="25" y="29" className="mf-heading">SIGA O FLUXO ENTRE AS CAVIDADES</text>
      <path d="M210 62C147 62 115 93 116 137Q157 171 220 139V72M293 62C356 62 388 93 387 137Q346 171 283 139V72" fill="color-mix(in srgb,var(--mf-red) 12%,var(--vs-paper))" stroke="var(--mf-red)" strokeWidth="2" />
      <path d="M252 55V92m0-9-61 39m61-39 61 39" fill="none" stroke="var(--vs-ink)" strokeWidth="3" /><text x="252" y="172" textAnchor="middle">pulmões · trocas gasosas</text>
      <path d="M144 197Q104 211 115 275L147 371Q220 426 255 394V228Q198 181 144 197Z" fill="color-mix(in srgb,var(--mf-blue) 15%,var(--vs-paper))" stroke="var(--mf-blue)" strokeWidth="3" />
      <path d="M255 228Q310 181 366 197 408 211 397 275L367 371Q296 426 255 394Z" fill="color-mix(in srgb,var(--mf-red) 15%,var(--vs-paper))" stroke="var(--mf-red)" strokeWidth="4" />
      {routes.map((r, i) => <path key={i} d={r.map((p, j) => `${j ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ')} fill="none" stroke={i < 3 ? 'var(--mf-blue)' : 'var(--mf-red)'} strokeWidth={active === i ? 4 : 2} opacity={active === i ? 1 : .28} />)}
      <path d="M127 279H236M274 279H387" stroke="var(--vs-ink)" opacity=".5" strokeDasharray="4 5" />
      <text x="191" y="255" textAnchor="middle">AD</text><text x="193" y="355" textAnchor="middle">VD</text><text x="323" y="255" textAnchor="middle">AE</text><text x="319" y="355" textAnchor="middle">VE</text>
      <circle cx={a[0] + (b[0] - a[0]) * t} cy={a[1] + (b[1] - a[1]) * t} r="7" fill={stops[active].oxygenated ? 'var(--mf-red)' : 'var(--mf-blue)'} stroke="var(--vs-paper)" strokeWidth="2" />
      <text x="260" y="471" textAnchor="middle">corpo · trocas nos tecidos</text><text x="260" y="500" textAnchor="middle" className="mf-small">AD/VD: lado direito · AE/VE: lado esquerdo</text>
    </svg>
  </MechanismFrame>;
}
