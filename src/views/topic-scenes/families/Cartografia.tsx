import React from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import { BRAZIL } from './GeografiaFisica';
import type { Scene } from './cenaKit';
import './Cartografia.css';


function usePaced() {
  const t = useSceneMotion();
  return (duration: number, delay = 0) => (t.duration === 0 ? t : { ...t, duration, delay });
}


// Lote 15: cartografia e água. Estes cinco capítulos abriam com instrumento
// genérico (polígonos abstratos, caixas e setas que só trocavam texto); cada
// cena agora desenha o procedimento que o resumo ensina — a conta do fuso, a
// conta da escala, o cruzamento de camadas, o mapa que deforma de propósito,
// a água que some do alcance. Números e nomes vêm do resumo do capítulo;
// o que é só desenho diz isso no rodapé.


const show = (on: boolean) => ({ opacity: on ? 1 : 0 });


// ---------------------------------------------------------------------------
// Fusos horários: a Terra vista do Polo Norte, com o Sol parado. Greenwich
// fica embaixo e o giro é anti-horário (de oeste para leste), então leste
// cai à direita, como no mapa. Os fusos são os teóricos de 15°; o resumo
// avisa que a linha real tem desvios, e o rodapé repete.
const TZ = { cx: 190, cy: 192, R: 108 };
const tzAngle = (lon: number) => ((90 - lon) * Math.PI) / 180;
const tzPoint = (lon: number, r: number): [number, number] => [TZ.cx + r * Math.cos(tzAngle(lon)), TZ.cy + r * Math.sin(tzAngle(lon))];
const wedge = (lon: number) => {
  const [x1, y1] = tzPoint(lon - 7.5, TZ.R);
  const [x2, y2] = tzPoint(lon + 7.5, TZ.R);
  return `M${TZ.cx} ${TZ.cy}L${x1.toFixed(1)} ${y1.toFixed(1)}A${TZ.R} ${TZ.R} 0 0 0 ${x2.toFixed(1)} ${y2.toFixed(1)}Z`;
};
// Arco por dentro da borda, de uma longitude a outra, rumo leste.
const eastArc = (from: number, to: number, r: number) => {
  const [x1, y1] = tzPoint(from, r);
  const [x2, y2] = tzPoint(to, r);
  const large = to - from > 180 ? 1 : 0;
  return `M${x1.toFixed(1)} ${y1.toFixed(1)}A${r} ${r} 0 ${large} 0 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
};


function Clock({ x, y, h, on = true }: { x: number; y: number; h: number; on?: boolean }) {
  const a = ((h % 12) / 12) * 2 * Math.PI;
  return <g transform={`translate(${x} ${y})`}>
    <circle r="13" className={on ? 'ct-clock ct-clock-on' : 'ct-clock'} />
    <path d={`M0 0L${(7 * Math.sin(a)).toFixed(1)} ${(-7 * Math.cos(a)).toFixed(1)}M0 0V-10`} className="ct-hand" />
  </g>;
}


function Calendar({ x, y, text, warn }: { x: number; y: number; text: string; warn?: boolean }) {
  return <g transform={`translate(${x} ${y})`}>
    <rect x="-20" y="-18" width="40" height="38" rx="5" className="ct-cal" />
    <rect x="-20" y="-18" width="40" height="11" rx="4" className={warn ? 'ct-cal-top ct-cal-warn' : 'ct-cal-top'} />
    <path d="M-10 -22v8M10 -22v8" className="ct-cal-ring" />
    <text y="14" textAnchor="middle" className="ct-cal-text">{text}</text>
  </g>;
}


function Plane({ x, y, rot = 0 }: { x: number; y: number; rot?: number }) {
  return <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <path d="M-12 0h24l4 -2-4 -2h-2L4 -12h-4l4 8H-6l-4-4h-3l3 6-3 6h3l4-4h10l-4 8h4l10-8h2l4-2" className="ct-plane" />
  </g>;
}


export function TimeZones({ active }: Scene) {
  const p = usePaced();
  const rim = [[0, 'UTC 0 · Greenwich'], [45, '+3'], [90, '+6'], [135, '+9'], [180, '±12'], [-45, '−3'], [-90, '−6']] as const;
  const [bx, by] = tzPoint(-45, TZ.R - 14);
  const [tx, ty] = tzPoint(135, TZ.R - 14);
  const [lx, ly] = tzPoint(0, TZ.R - 14);
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Fusos horários vistos do Polo Norte: 24 fusos de 15 graus, destino menos origem, voo São Paulo–Londres e Linha Internacional de Data; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">FUSOS · VISTA DO POLO NORTE</text>


    <g transform="translate(52 104)">
      {Array.from({ length: 8 }, (_, k) => <path key={k} d={`M${(24 * Math.cos(k * Math.PI / 4)).toFixed(1)} ${(24 * Math.sin(k * Math.PI / 4)).toFixed(1)}l${(8 * Math.cos(k * Math.PI / 4)).toFixed(1)} ${(8 * Math.sin(k * Math.PI / 4)).toFixed(1)}`} className="ct-ray" />)}
      <circle r="18" className="ct-sun" />
      <text y="4" textAnchor="middle" className="ct-sun-text">Sol</text>
    </g>
    <text x="52" y="152" textAnchor="middle" className="bi-tiny">parado</text>


    <motion.g initial={{ rotate: 0 }} animate={{ rotate: active === 0 ? [0, -360] : 0 }} transition={active === 0 ? p(2, 0.2) : { duration: 0 }}>
      {Array.from({ length: 24 }, (_, k) => <path key={k} d={wedge(k * 15)} className={k % 2 ? 'ct-zone ct-zone-b' : 'ct-zone'} />)}
      <motion.path d={wedge(0)} className="ct-zone-on" initial={false} animate={{ opacity: active === 0 ? 1 : 0.35 }} transition={p(0.4)} />
    </motion.g>
    <path d={`M${TZ.cx} ${TZ.cy - TZ.R}A${TZ.R} ${TZ.R} 0 0 1 ${TZ.cx} ${TZ.cy + TZ.R}Z`} className="ct-night" />
    <circle cx={TZ.cx} cy={TZ.cy} r={TZ.R} className="ct-rim" />
    <circle cx={TZ.cx} cy={TZ.cy} r="5" className="ct-pole" />
    <text x={TZ.cx + 8} y={TZ.cy - 8} className="bi-tiny ct-on-globe">Polo N</text>
    {rim.map(([lon, label]) => {
      const [x, y] = tzPoint(lon, TZ.R + 13);
      const c = Math.cos(tzAngle(lon));
      return <text key={label} x={x} y={y + 4} textAnchor={c > 0.3 ? 'start' : c < -0.3 ? 'end' : 'middle'} className={lon === 0 ? 'bi-tiny ct-strong' : 'bi-tiny'}>{label}</text>;
    })}
    <path d={eastArc(-100, -60, TZ.R + 34)} className="ct-spin" markerEnd="url(#ct-tz-head)" />
    <defs><marker id="ct-tz-head" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" className="ct-head" /></marker></defs>


    {/* Recorte 1: 360° ÷ 24 h */}
    <motion.g initial={false} animate={show(active === 0)} transition={p(0.4)}>
      <path d={eastArc(-7.5, 7.5, TZ.R - 26)} className="ct-measure" />
      <text x={TZ.cx} y={TZ.cy + TZ.R - 34} textAnchor="middle" className="ct-badge-text">15°</text>
      <rect x="352" y="62" width="244" height="236" rx="14" className="bi-panel" />
      <text x="372" y="88" className="bi-panel-title">UMA HORA, QUINZE GRAUS</text>
      <text x="474" y="136" textAnchor="middle" className="ct-big">360° ÷ 24 h</text>
      <text x="474" y="170" textAnchor="middle" className="ct-big ct-accent">= 15° por hora</text>
      <text x="372" y="202" className="bi-small">a Terra gira de oeste para leste</text>
      <text x="372" y="220" className="bi-small">24 fusos teóricos de 15° (1884)</text>
      <text x="372" y="238" className="bi-small">a leste de Greenwich: UTC+</text>
      <text x="372" y="256" className="bi-small">a oeste de Greenwich: UTC−</text>
      <text x="474" y="282" textAnchor="middle" className="bi-hand-sm">o Sol “nasce” antes a leste</text>
    </motion.g>


    {/* Recorte 2: Brasília → Tóquio */}
    <motion.g initial={false} animate={show(active === 1)} transition={p(0.4)}>
      <motion.path d={eastArc(-45, 135, TZ.R - 14)} className="ct-route" initial={false} animate={{ pathLength: active === 1 ? 1 : 0 }} transition={p(1.2, 0.3)} />
      <circle cx={bx} cy={by} r="6" className="ct-city" /><circle cx={tx} cy={ty} r="6" className="ct-city ct-city-b" />
      <text x={bx + 10} y={by - 8} className="bi-tiny ct-on-globe">Brasília</text>
      <text x={tx - 10} y={ty + 16} textAnchor="end" className="bi-tiny ct-on-globe">Tóquio</text>
      <rect x="352" y="62" width="244" height="236" rx="14" className="bi-panel" />
      <text x="372" y="88" className="bi-panel-title">DESTINO MENOS ORIGEM</text>
      <path d="M374 150H578" className="ct-axis" />
      {Array.from({ length: 13 }, (_, k) => <path key={k} d={`M${374 + k * 17} 145v10`} className="ct-tick" />)}
      <text x="374" y="172" textAnchor="middle" className="bi-tiny">−12</text>
      <text x="476" y="172" textAnchor="middle" className="bi-tiny">0</text>
      <text x="578" y="172" textAnchor="middle" className="bi-tiny">+12</text>
      <circle cx={476 - 3 * 8.5} cy="150" r="6" className="ct-city" />
      <circle cx={476 + 9 * 8.5} cy="150" r="6" className="ct-city ct-city-b" />
      <text x={476 - 3 * 8.5} y="132" textAnchor="middle" className="bi-tiny">UTC−3</text>
      <text x={476 + 9 * 8.5} y="132" textAnchor="middle" className="bi-tiny">UTC+9</text>
      <motion.path d={`M${476 - 3 * 8.5} 122Q${476 + 3 * 8.5} 98 ${476 + 9 * 8.5} 122`} className="ct-jump" initial={false}
        animate={{ pathLength: active === 1 ? 1 : 0 }} transition={p(0.8, 0.6)} />
      <text x="474" y="210" textAnchor="middle" className="ct-big">9 − (−3) = 12 h</text>
      <text x="474" y="240" textAnchor="middle" className="bi-small">Tóquio está 12 horas à frente</text>
      <text x="474" y="276" textAnchor="middle" className="bi-hand-sm">converta tudo para UTC antes</text>
    </motion.g>


    {/* Recorte 3: São Paulo → Londres, dois passos */}
    <motion.g initial={false} animate={show(active === 2)} transition={p(0.4)}>
      <motion.path d={eastArc(-45, 0, TZ.R - 14)} className="ct-route" initial={false} animate={{ pathLength: active === 2 ? 1 : 0 }} transition={p(1, 0.3)} />
      <circle cx={bx} cy={by} r="6" className="ct-city" /><circle cx={lx} cy={ly} r="6" className="ct-city ct-city-b" />
      <text x={bx + 10} y={by - 8} className="bi-tiny ct-on-globe">São Paulo</text>
      <text x={lx + 12} y={ly + 4} className="bi-tiny ct-on-globe">Londres</text>
      <rect x="352" y="62" width="244" height="236" rx="14" className="bi-panel" />
      <text x="372" y="88" className="bi-panel-title">VOO DE 11 HORAS</text>
      <Clock x={388} y={124} h={22} />
      <text x="410" y="120" className="bi-label">22h em São Paulo</text>
      <text x="410" y="134" className="bi-tiny">partida (UTC−3)</text>
      <motion.g initial={false} animate={{ opacity: active === 2 ? 1 : 0, x: active === 2 ? 0 : -10 }} transition={p(0.5, 0.5)}>
        <text x="380" y="164" className="ct-step">① + 11 h de voo</text>
        <Clock x={388} y={190} h={9} />
        <text x="410" y="186" className="bi-label">9h, hora de SP</text>
        <text x="410" y="200" className="bi-tiny">tempo decorrido, sem fuso</text>
      </motion.g>
      <motion.g initial={false} animate={{ opacity: active === 2 ? 1 : 0, x: active === 2 ? 0 : -10 }} transition={p(0.5, 1)}>
        <text x="380" y="230" className="ct-step">② + 3 h de fuso (0 − (−3))</text>
        <Clock x={388} y={256} h={12} />
        <text x="410" y="252" className="bi-label ct-accent">12h em Londres</text>
        <text x="410" y="266" className="bi-tiny">do dia seguinte</text>
      </motion.g>
      <motion.g initial={false} animate={active === 2 ? { x: [0, 8, 14], y: [0, 4, 6] } : { x: 0, y: 0 }} transition={p(1.2, 0.3)}>
        <Plane x={bx + 20} y={by + 10} rot={20} />
      </motion.g>
    </motion.g>


    {/* Recorte 4: Linha Internacional de Data */}
    <motion.g initial={false} animate={show(active === 3)} transition={p(0.4)}>
      <motion.path d={`M${TZ.cx} ${TZ.cy}V${TZ.cy - TZ.R - 4}`} className="ct-dateline" initial={false} animate={{ pathLength: active === 3 ? 1 : 0 }} transition={p(0.8, 0.2)} />
      <rect x="352" y="62" width="244" height="236" rx="14" className="bi-panel" />
      <text x="372" y="88" className="bi-panel-title">LINHA INTERNACIONAL DE DATA</text>
      <text x="372" y="110" className="bi-small">perto de 180°, com desvios</text>
      <Calendar x={400} y={152} text="−1" />
      <text x="430" y="148" className="bi-label">oeste → leste</text>
      <text x="430" y="164" className="bi-small">o calendário recua 1 dia</text>
      <motion.g initial={false} animate={{ scale: active === 3 ? [1, 1.18, 1] : 1 }} transition={p(0.6, 0.9)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <Calendar x={400} y={206} text="+1" warn />
      </motion.g>
      <text x="430" y="202" className="bi-label ct-accent">leste → oeste</text>
      <text x="430" y="218" className="bi-small">o calendário avança 1 dia</text>
      <text x="372" y="256" className="bi-small">12 fusos adiantados + 12 atrasados:</text>
      <text x="372" y="274" className="bi-small">aqui a volta de 24 h se fecha</text>
    </motion.g>
    <motion.text x={TZ.cx + 30} y={TZ.cy - TZ.R - 2} className="bi-hand-sm" initial={false} animate={show(active === 3)} transition={p(0.4, 0.6)}>Linha de Data</motion.text>


    <text x="30" y="340" className="bi-foot">Esquema fora de escala: fusos teóricos de 15°, sem os desvios políticos da linha real.</text>
  </svg>;
}


// ---------------------------------------------------------------------------
// Linguagem cartográfica: uma folha de mapa esquemática com um morro, duas
// cidades a 8 cm uma da outra, barra de escala e 1:50.000. A folha fica; o
// painel faz a conta, amplia a cópia, compara escalas e corta o perfil.
const CM = 24; // 1 cm da folha desenhada
const HILL = [0, 1, 2, 3, 4].map(k => ({ cx: 124 + 14 * k, rx: 20 + 22 * k, ry: 14 + 13 * k, alt: (5 - k) * 20 }));


function MapSheet({ active, p }: { active: number; p: ReturnType<typeof usePaced> }) {
  const dimOr = (on: boolean) => ({ opacity: on ? 1 : 0.4 });
  return <g>
    <rect x="28" y="56" width="284" height="258" rx="6" className="ct-sheet" />
    <text x="44" y="80" className="bi-small ct-strong">Mapa esquemático</text>
    <g transform="translate(286 84)">
      <path d="M0 -14L6 6L0 2L-6 6Z" className="ct-north" />
      <text y="20" textAnchor="middle" className="bi-tiny">N</text>
    </g>
    <motion.g initial={false} animate={dimOr(active === 0 || active === 3)} transition={p(0.4)}>
      {HILL.map((c, k) => <motion.ellipse key={k} cx={c.cx} cy="160" rx={c.rx} ry={c.ry} className="ct-contour" initial={false}
        animate={{ strokeWidth: active === 3 ? 2 : 1.3 }} transition={p(0.4, active === 3 ? 0.1 * k : 0)} />)}
      <circle cx="124" cy="160" r="2.5" className="ct-peak" />
      <motion.path d="M50 160H300" className="ct-section" initial={false} animate={{ pathLength: active === 3 ? 1 : 0, opacity: active === 3 ? 1 : 0 }} transition={p(0.7, 0.3)} />
      <motion.text x="46" y="154" className="bi-tiny" initial={false} animate={show(active === 3)} transition={p(0.3)}>O</motion.text>
      <motion.text x="298" y="154" className="bi-tiny" initial={false} animate={show(active === 3)} transition={p(0.3)}>L</motion.text>
    </motion.g>
    <motion.g initial={false} animate={dimOr(active === 0)} transition={p(0.4)}>
      <path d={`M60 250q40 -18 90 -6t${8 * CM - 90} -6`} className="ct-road" />
      <circle cx="60" cy="250" r="7" className="ct-town" /><text x="60" y="236" textAnchor="middle" className="bi-label">A</text>
      <circle cx={60 + 8 * CM} cy="238" r="7" className="ct-town" /><text x={60 + 8 * CM} y="224" textAnchor="middle" className="bi-label">B</text>
      <g>
        <rect x="52" y="262" width={8 * CM + 16} height="18" rx="3" className="ct-ruler" />
        {Array.from({ length: 9 }, (_, k) => <path key={k} d={`M${60 + k * CM} 262v${k % 2 ? 6 : 9}`} className="ct-ruler-tick" />)}
        <text x={60 + 8 * CM + 14} y="276" className="bi-tiny ct-strong">8 cm</text>
        <motion.path d={`M60 271H${60 + 8 * CM}`} className="ct-measure-run" initial={false} animate={{ pathLength: active === 0 ? 1 : 0 }} transition={p(1, 0.2)} />
      </g>
    </motion.g>
    <motion.g initial={false} animate={dimOr(active === 0 || active === 1)} transition={p(0.4)}>
      <path d={`M44 298h${2 * CM}`} className="ct-bar" /><path d={`M44 294v8M${44 + CM} 294v8M${44 + 2 * CM} 294v8`} className="ct-ruler-tick" />
      <text x={50 + 2 * CM} y="302" className="bi-tiny">1 km</text>
      <text x="296" y="302" textAnchor="end" className="bi-small ct-strong">1:50.000</text>
    </motion.g>
  </g>;
}


export function MapScale({ active }: Scene) {
  const p = usePaced();
  const chain = [['8 cm', 'medidos no mapa'], ['× 50.000', 'o denominador'], ['= 400.000 cm', ''], ['÷ 100 = 4.000 m', ''], ['÷ 1.000 = 4 km', 'distância real']];
  const prof = (x: number) => 380 + (x - 50) * 0.84;
  const profY = (h: number) => 266 - h * 1.25;
  const pts: [number, number][] = [[50, 6], [HILL[4].cx - HILL[4].rx, 20], [HILL[3].cx - HILL[3].rx, 40], [HILL[2].cx - HILL[2].rx, 60], [HILL[1].cx - HILL[1].rx, 80], [HILL[0].cx - HILL[0].rx, 100], [124, 108], [HILL[0].cx + HILL[0].rx, 100], [HILL[1].cx + HILL[1].rx, 80], [HILL[2].cx + HILL[2].rx, 60], [HILL[3].cx + HILL[3].rx, 40], [HILL[4].cx + HILL[4].rx, 20], [300, 10]];
  const profile = pts.map(([x, h], k) => `${k ? 'L' : 'M'}${prof(x).toFixed(1)} ${profY(h).toFixed(1)}`).join('');
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Linguagem cartográfica: régua de 8 centímetros a 1:50.000, escala gráfica na cópia ampliada, escala grande e pequena, curvas de nível em perfil; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">ESCALA · DO MAPA AO TERRENO</text>
    <MapSheet active={active} p={p} />


    <motion.g initial={false} animate={show(active === 0)} transition={p(0.4)}>
      <rect x="330" y="56" width="266" height="258" rx="14" className="bi-panel" />
      <text x="348" y="80" className="bi-panel-title">CÁLCULO · 1:50.000</text>
      {chain.map(([a, b], k) => <motion.g key={a} initial={false} animate={{ opacity: active === 0 ? 1 : 0, x: active === 0 ? 0 : -8 }} transition={p(0.4, 0.5 + k * 0.3)}>
        <text x="352" y={114 + k * 36} className={k === 4 ? 'ct-big ct-accent' : 'ct-big'}>{a}</text>
        {b && <text x="578" y={114 + k * 36} textAnchor="end" className="bi-tiny">{b}</text>}
      </motion.g>)}
      <text x="463" y="300" textAnchor="middle" className="bi-hand-sm">cuidado com cm, m e km</text>
    </motion.g>


    <motion.g initial={false} animate={show(active === 1)} transition={p(0.4)}>
      <rect x="330" y="56" width="266" height="258" rx="14" className="bi-panel" />
      <text x="348" y="80" className="bi-panel-title">CÓPIA AMPLIADA</text>
      <g>
        <rect x="350" y="96" width="70" height="56" rx="3" className="ct-sheet" />
        <path d="M356 136h24" className="ct-bar" /><text x="384" y="140" className="ct-micro">1 km</text>
        <text x="385" y="116" textAnchor="middle" className="ct-micro">original</text>
      </g>
      <motion.g initial={false} animate={{ scale: active === 1 ? 1.45 : 1 }} transition={p(1, 0.4)} style={{ originX: 0, originY: 0 }}>
        <rect x="450" y="96" width="70" height="56" rx="3" className="ct-sheet" />
        <path d="M456 136h24" className="ct-bar" /><text x="484" y="140" className="ct-micro">1 km</text>
        <text x="485" y="116" textAnchor="middle" className="ct-micro">cópia</text>
      </motion.g>
      <text x="350" y="222" className="bi-label">escala gráfica</text>
      <text x="350" y="238" className="bi-small">a barra cresce junto: continua certa</text>
      <text x="350" y="266" className="bi-label">1:50.000 impresso</text>
      <motion.path d="M562 254l14 14M576 254l-14 14" className="ct-x" initial={false} animate={{ pathLength: active === 1 ? 1 : 0 }} transition={p(0.4, 1.3)} />
      <text x="350" y="282" className="bi-small">o número não muda: fica errado</text>
    </motion.g>


    <motion.g initial={false} animate={show(active === 2)} transition={p(0.4)}>
      <rect x="330" y="56" width="266" height="258" rx="14" className="bi-panel" />
      <text x="348" y="80" className="bi-panel-title">GRANDE × PEQUENA</text>
      <g transform="translate(344 92) scale(0.28)"><path d={BRAZIL} className="ct-country" /></g>
      <rect x="452" y="94" width="128" height="118" rx="6" className="ct-sheet" />
      {[[460, 102], [498, 102], [536, 102], [460, 142], [498, 142], [536, 142]].map(([x, y]) => <g key={`${x}-${y}`}>
        <rect x={x} y={y} width="34" height="32" rx="2" className="ct-block" />
        <path d={`M${x + 6} ${y + 24}v-8l6-5 6 5v8ZM${x + 20} ${y + 26}v-10h8v10Z`} className="ct-house" />
      </g>)}
      <path d="M452 188H580" className="ct-street" />
      <motion.path d="M417 161L452 94M417 168L452 212" className="ct-lens" initial={false} animate={{ pathLength: active === 2 ? 1 : 0 }} transition={p(0.7, 0.4)} />
      <rect x="410" y="161" width="7" height="7" className="ct-lens-box" />
      <text x="348" y="238" className="bi-label">1:10.000.000 · escala pequena</text>
      <text x="348" y="254" className="bi-small">área extensa, pouco detalhe</text>
      <text x="348" y="280" className="bi-label ct-accent">1:5.000 · escala “grande”</text>
      <text x="348" y="296" className="bi-small">mostra área pequena, com detalhe</text>
    </motion.g>


    <motion.g initial={false} animate={show(active === 3)} transition={p(0.4)}>
      <rect x="330" y="56" width="266" height="258" rx="14" className="bi-panel" />
      <text x="348" y="80" className="bi-panel-title">PERFIL O–L DO MORRO</text>
      {[20, 40, 60, 80, 100].map(h => <g key={h}>
        <path d={`M380 ${profY(h)}H590`} className="ct-grid" />
        <text x="374" y={profY(h) + 3} textAnchor="end" className="ct-micro">{h} m</text>
      </g>)}
      <motion.path d={`${profile}L${prof(300)} 266L${prof(50)} 266Z`} className="ct-relief" initial={false} animate={{ opacity: active === 3 ? 1 : 0 }} transition={p(0.6, 0.5)} />
      <motion.path d={profile} className="ct-profile" initial={false} animate={{ pathLength: active === 3 ? 1 : 0 }} transition={p(1.2, 0.4)} />
      <text x="348" y="288" className="bi-small ct-strong">oeste: próximas, íngreme</text>
      <text x="588" y="306" textAnchor="end" className="bi-small ct-strong">leste: espaçadas, suave</text>
      <text x="348" y="104" className="bi-tiny">equidistância: 20 m</text>
    </motion.g>


    <text x="30" y="340" className="bi-foot">Folha, morro e cidades são esquemáticos; os números vêm dos exemplos do resumo.</text>
  </svg>;
}


// ---------------------------------------------------------------------------
// Cartografia digital: o mesmo território embaixo (mata, rio, estrada,
// cidade) e, em cima, o que cada tecnologia faz com ele. A faixa do chão
// fica em todos os recortes para que se veja que é sempre o mesmo lugar.
const layerPt = (x0: number, y0: number, u: number, v: number): [number, number] => [x0 + 190 * u + 56 * v, y0 - 36 * v];
const layerPath = (x0: number, y0: number) => {
  const c = [[0, 0], [1, 0], [1, 1], [0, 1]].map(([u, v]) => layerPt(x0, y0, u, v));
  return `M${c.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L')}Z`;
};
const pixelLand = (u: number, v: number) => Math.abs(v - (0.5 + 0.22 * Math.sin(u * 5))) < 0.14 ? 'ct-px-water' : u > 0.68 && v > 0.55 ? 'ct-px-town' : 'ct-px-forest';


function Satellite({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-26" y="-6" width="16" height="12" className="ct-panel-solar" />
    <rect x="10" y="-6" width="16" height="12" className="ct-panel-solar" />
    <path d="M-10 0h-0M-18 -6v12M18 -6v12" className="ct-solar-line" />
    <rect x="-9" y="-9" width="18" height="18" rx="3" className="ct-sat-body" />
    <circle cy="12" r="3" className="ct-lens-dot" />
  </g>;
}


function Ground() {
  return <g>
    <rect x="20" y="292" width="580" height="30" rx="8" className="ct-ground" />
    <path d="M20 310C120 300 160 318 260 306S420 300 600 312" className="ct-river-line" />
    <path d="M20 298H600" className="ct-road-line" />
    {[46, 72, 98, 124, 150, 176, 202].map((x, k) => <g key={x}><circle cx={x} cy={k % 2 ? 306 : 312} r="8" className="ct-tree" /></g>)}
    {[440, 468, 496, 524, 552].map((x, k) => <path key={x} d={`M${x} ${318 - (k % 2) * 4}v-12l8-7 8 7v12Z`} className="ct-house" />)}
  </g>;
}


export function DigitalMapping({ active }: Scene) {
  const p = usePaced();
  const x0 = 70;
  const layers = [
    { y: 128, label: 'densidade populacional', kind: 'pop' },
    { y: 168, label: 'vias', kind: 'road' },
    { y: 208, label: 'áreas de inundação', kind: 'flood' },
  ] as const;
  const dots = [[0.22, 0.45], [0.3, 0.6], [0.26, 0.3], [0.68, 0.42], [0.74, 0.52], [0.7, 0.3], [0.8, 0.4], [0.62, 0.56], [0.5, 0.8]];
  const floodPath = (y0: number) => {
    const a = layerPt(x0, y0, 0.58, 0), b = layerPt(x0, y0, 0.86, 0), c = layerPt(x0, y0, 0.86, 1), d = layerPt(x0, y0, 0.58, 1);
    return `M${a[0]} ${a[1]}Q${(a[0] + b[0]) / 2} ${a[1] + 3} ${b[0]} ${b[1]}L${c[0]} ${c[1]}Q${(c[0] + d[0]) / 2} ${c[1] - 3} ${d[0]} ${d[1]}Z`;
  };
  const content = (kind: string, y0: number) => <g>
    {(kind === 'flood' || kind === 'all') && <path d={floodPath(y0)} className="ct-flood" />}
    {(kind === 'road' || kind === 'all') && <path d={`M${layerPt(x0, y0, 0, 0.3).join(' ')}L${layerPt(x0, y0, 1, 0.5).join(' ')}M${layerPt(x0, y0, 0.45, 0).join(' ')}L${layerPt(x0, y0, 0.4, 1).join(' ')}`} className="ct-via" />}
    {(kind === 'pop' || kind === 'all') && dots.map(([u, v]) => { const [x, y] = layerPt(x0, y0, u, v); return <circle key={`${u}-${v}`} cx={x} cy={y} r="3.2" className="ct-dot" />; })}
  </g>;
  const [hx, hy] = layerPt(x0, 268, 0.72, 0.42);
  const coarse = 4, fine = 10;
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Cartografia digital: camadas do SIG cruzadas, sensoriamento remoto e GPS, resolução e revisita, da detecção à fiscalização; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">CARTOGRAFIA DIGITAL · MESMO TERRITÓRIO</text>
    <path d="M40 92Q310 44 580 92" className="ct-orbit" />
    <Ground />


    {/* Recorte 1: camadas do SIG */}
    <motion.g initial={false} animate={show(active === 0)} transition={p(0.4)}>
      {layers.map((l, k) => <motion.g key={l.kind} initial={false} animate={{ opacity: active === 0 ? 1 : 0, y: active === 0 ? 0 : -16 }} transition={p(0.5, 0.2 + k * 0.25)}>
        <path d={layerPath(x0, l.y)} className="ct-layer" />
        {content(l.kind, l.y)}
        <text x={x0 + 262} y={l.y - 12} className="bi-small">{l.label}</text>
      </motion.g>)}
      <path d={`M${x0} 128V268M${x0 + 190} 128V268M${x0 + 246} 92V232`} className="ct-stack-guide" />
      <motion.g initial={false} animate={{ opacity: active === 0 ? 1 : 0 }} transition={p(0.5, 1)}>
        <path d={layerPath(x0, 268)} className="ct-layer ct-layer-result" />
        {content('all', 268)}
        <text x={x0 + 262} y="256" className="bi-label ct-accent">cruzamento</text>
      </motion.g>
      <motion.circle cx={hx} cy={hy} r="15" className="ct-hit" initial={false} animate={{ scale: active === 0 ? [0, 1.3, 1] : 0 }} transition={p(0.6, 1.6)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
      <motion.text x="578" y="150" textAnchor="end" className="bi-hand-sm" initial={false} animate={show(active === 0)} transition={p(0.4, 1.8)}>muita gente em</motion.text>
      <motion.text x="578" y="168" textAnchor="end" className="bi-hand-sm" initial={false} animate={show(active === 0)} transition={p(0.4, 1.8)}>área de inundação</motion.text>
      <text x="578" y="198" textAnchor="end" className="bi-tiny">só aparece ao cruzar</text>
    </motion.g>


    {/* Recorte 2: imagem à distância × posição do receptor */}
    <motion.g initial={false} animate={show(active === 1)} transition={p(0.4)}>
      <Satellite x={150} y={76} />
      <motion.path d="M150 92L96 290H204Z" className="ct-cone" initial={false} animate={{ opacity: active === 1 ? 1 : 0, scaleY: active === 1 ? 1 : 0 }} transition={p(0.7, 0.3)} style={{ originY: 0 }} />
      <rect x="208" y="120" width="72" height="54" rx="3" className="ct-photo" />
      {Array.from({ length: 6 }, (_, i) => Array.from({ length: 4 }, (_, j) => <rect key={`${i}-${j}`} x={212 + i * 11} y={124 + j * 11.5} width="11" height="11.5" className={pixelLand(i / 6, j / 4)} />))}
      <text x="40" y="136" className="bi-label">sensoriamento</text>
      <text x="40" y="152" className="bi-label">remoto</text>
      <text x="40" y="172" className="bi-small">capta a imagem</text>
      <text x="40" y="186" className="bi-small">à distância</text>
      <text x="310" y="196" textAnchor="middle" className="ct-neq">≠</text>
      {[[380, 88], [474, 66], [566, 96]].map(([x, y], k) => <g key={x}>
        <Satellite x={x} y={y} s={0.7} />
        <motion.path d={`M${x} ${y + 10}L474 276`} className="ct-signal" initial={false} animate={{ pathLength: active === 1 ? 1 : 0 }} transition={p(0.6, 0.4 + k * 0.2)} />
      </g>)}
      <rect x="464" y="262" width="20" height="32" rx="4" className="ct-phone" />
      <path d="M474 252c-7 0-11 5-11 10 0 7 11 16 11 16s11-9 11-16c0-5-4-10-11-10Z" className="ct-pin" />
      <circle cx="474" cy="262" r="4" className="ct-pin-hole" />
      <text x="398" y="168" className="bi-label">GPS</text>
      <text x="398" y="186" className="bi-small">diz onde está</text>
      <text x="398" y="200" className="bi-small">o receptor</text>
    </motion.g>


    {/* Recorte 3: resolução × revisita */}
    <motion.g initial={false} animate={show(active === 2)} transition={p(0.4)}>
      <Satellite x={160} y={78} s={0.85} /><Satellite x={460} y={78} s={0.85} />
      {Array.from({ length: coarse }, (_, i) => Array.from({ length: coarse }, (_, j) => <rect key={`c${i}-${j}`} x={110 + i * 25} y={110 + j * 25} width="25" height="25" className={pixelLand((i + 0.5) / coarse, (j + 0.5) / coarse)} />))}
      {Array.from({ length: fine }, (_, i) => Array.from({ length: fine }, (_, j) => <rect key={`f${i}-${j}`} x={410 + i * 10} y={110 + j * 10} width="10" height="10" className={pixelLand((i + 0.5) / fine, (j + 0.5) / fine)} />))}
      <rect x="110" y="110" width="100" height="100" className="ct-frame" /><rect x="410" y="110" width="100" height="100" className="ct-frame" />
      <text x="160" y="232" textAnchor="middle" className="bi-label">resolução baixa</text>
      <text x="460" y="232" textAnchor="middle" className="bi-label">resolução altíssima</text>
      {Array.from({ length: 7 }, (_, k) => <motion.circle key={`a${k}`} cx={124 + k * 12} cy="254" r="4.5" className="ct-visit" initial={false} animate={{ scale: active === 2 ? 1 : 0 }} transition={p(0.25, 0.4 + k * 0.12)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />)}
      {Array.from({ length: 7 }, (_, k) => <circle key={`b${k}`} cx={424 + k * 12} cy="254" r="4.5" className={k === 0 ? 'ct-visit' : 'ct-visit-off'} />)}
      <text x="160" y="278" textAnchor="middle" className="bi-small">revisita diária</text>
      <text x="460" y="278" textAnchor="middle" className="bi-small">revisita rara</text>
      <text x="310" y="164" textAnchor="middle" className="bi-hand-sm">a escolha</text>
      <text x="310" y="182" textAnchor="middle" className="bi-hand-sm">depende do uso</text>
    </motion.g>


    {/* Recorte 4: da imagem à equipe em campo */}
    <motion.g initial={false} animate={show(active === 3)} transition={p(0.4)}>
      {[['antes', false], ['depois', true]].map(([label, cut], k) => <g key={label as string}>
        <rect x={40 + k * 92} y="104" width="72" height="56" rx="3" className="ct-photo" />
        {Array.from({ length: 6 }, (_, i) => Array.from({ length: 4 }, (_, j) => <rect key={`${i}-${j}`} x={44 + k * 92 + i * 11} y={108 + j * 12} width="11" height="12" className={cut && i >= 2 && i <= 4 && j >= 1 && j <= 2 ? 'ct-px-cut' : 'ct-px-forest'} />))}
        <text x={76 + k * 92} y="178" textAnchor="middle" className="bi-tiny">imagem {label}</text>
      </g>)}
      {[['alerta', 294], ['verificação', 390], ['equipe', 494]].map(([label, x], k) => <motion.g key={label} initial={false} animate={{ opacity: active === 3 ? 1 : 0.2 }} transition={p(0.4, 0.4 + k * 0.4)}>
        <circle cx={x as number} cy="132" r="22" className="ct-step-ring" />
        <text x={x as number} y="176" textAnchor="middle" className="bi-small">{label}</text>
      </motion.g>)}
      <path d="M288 120l6-10 6 10ZM294 138v2" className="ct-icon" /><path d="M294 126v8" className="ct-icon" />
      <circle cx="387" cy="129" r="8" className="ct-icon" /><path d="M393 135l8 8" className="ct-icon" />
      <path d="M480 138h20v-10h8l6 6v4h-34ZM486 142a3 3 0 1 0 0.1 0M506 142a3 3 0 1 0 0.1 0" className="ct-icon" />
      {[[216, 272], [316, 368], [412, 472]].map(([a, b], k) => <motion.path key={a} d={`M${a} 132H${b}`} className="ct-flow" markerEnd="url(#ct-dg-head)" initial={false} animate={{ pathLength: active === 3 ? 1 : 0 }} transition={p(0.4, 0.3 + k * 0.4)} />)}
      <text x="244" y="152" textAnchor="middle" className="bi-tiny">em dias</text>
      <path d="M500 156L540 272" className="ct-leader" />
      <text x="548" y="236" textAnchor="end" className="bi-tiny">deslocamento até</text>
      <text x="548" y="248" textAnchor="end" className="bi-tiny">área remota: atraso</text>
      <rect x="236" y="300" width="44" height="14" rx="4" className="ct-clearing" />
      <motion.g initial={false} animate={{ x: active === 3 ? -262 : 0 }} transition={p(2, 1.4)}>
        <g transform="translate(528 292)">
          <path d="M0 0v-18h30v18ZM30 0v-13h9l6 7v6Z" className="ct-truck" />
          <path d="M33 -11h5l4 5h-9Z" className="ct-truck-glass" />
          <circle cx="9" cy="1" r="4" className="ct-wheel" /><circle cx="37" cy="1" r="4" className="ct-wheel" />
        </g>
      </motion.g>
      <text x="310" y="252" textAnchor="middle" className="bi-hand-sm">detectar não é impedir</text>
    </motion.g>
    <defs><marker id="ct-dg-head" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" className="ct-head" /></marker></defs>


    <text x="30" y="344" className="bi-foot">Território, camadas e pixels são esquemáticos.</text>
  </svg>;
}


// ---------------------------------------------------------------------------
// Representações gráficas: a folha com seus elementos, a mesma costa em
// três escalas, o cartograma que troca área por população e o gráfico que
// guarda o dado mas perde a forma do território. Tamanhos são esquemáticos:
// o resumo afirma o sentido da mudança, não os números.
const COUNTRIES = [
  { name: 'Canadá', cx: 132, cy: 138, area: 100, pop: 24, vast: true },
  { name: 'China', cx: 432, cy: 132, area: 96, pop: 110, vast: false },
  { name: 'Índia', cx: 300, cy: 214, area: 58, pop: 100, vast: false },
  { name: 'Austrália', cx: 522, cy: 242, area: 86, pop: 20, vast: true },
] as const;


export function MapElements({ active }: Scene) {
  const p = usePaced();
  const elements = [
    ['título', 'tema e área'],
    ['legenda', 'o que cada cor quer dizer'],
    ['escala', 'converte em distância real'],
    ['orientação', 'onde fica o norte'],
    ['fonte e data', 'origem e atualidade'],
  ];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Representações gráficas: elementos do mapa, generalização por escala, anamorfose por população e gráfico sem forma de território; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">REPRESENTAR É ESCOLHER</text>


    {/* Recorte 1: elementos do mapa */}
    <motion.g initial={false} animate={show(active === 0)} transition={p(0.4)}>
      <rect x="30" y="56" width="300" height="258" rx="6" className="ct-sheet" />
      <rect x="44" y="68" width="272" height="24" rx="4" className="ct-el ct-el-0" />
      <text x="180" y="85" textAnchor="middle" className="bi-small ct-strong">USO DO SOLO</text>
      <rect x="44" y="102" width="190" height="160" rx="4" className="ct-mapframe" />
      <path d="M44 102h190v60c-40 10-70 -20-110 0s-60 10-80 0Z" className="ct-use-a" />
      <path d="M44 162c20 10 40 20 80 0s70 -10 110 0v60c-60 -20-120 30-190 0Z" className="ct-use-b" />
      <path d="M44 222c70 30 130 -20 190 0v40H44Z" className="ct-use-c" />
      <g>
        <rect x="244" y="102" width="72" height="84" rx="4" className="ct-el ct-el-1" />
        {[['ct-use-a', 'mata'], ['ct-use-b', 'lavoura'], ['ct-use-c', 'cidade']].map(([c, l], k) => <g key={l}>
          <rect x="252" y={112 + k * 24} width="14" height="14" rx="2" className={c} />
          <text x="272" y={123 + k * 24} className="bi-tiny">{l}</text>
        </g>)}
      </g>
      <g><rect x="44" y="270" width="112" height="30" rx="4" className="ct-el ct-el-2" />
        <path d="M54 288h60M54 284v8M84 284v8M114 284v8" className="ct-bar-thin" /><text x="120" y="292" className="bi-tiny">km</text></g>
      <g><rect x="258" y="196" width="46" height="60" rx="4" className="ct-el ct-el-3" />
        <path d="M281 208L288 232L281 227L274 232Z" className="ct-north" /><text x="281" y="248" textAnchor="middle" className="bi-tiny">N</text></g>
      <g><rect x="166" y="270" width="150" height="30" rx="4" className="ct-el ct-el-4" />
        <text x="241" y="290" textAnchor="middle" className="bi-tiny">Fonte · data</text></g>
      {[[44, 68], [244, 102], [44, 270], [258, 196], [166, 270]].map(([x, y], k) => <motion.g key={`b${k}`} initial={false} animate={{ scale: active === 0 ? [0, 1.2, 1] : 0 }} transition={p(0.4, 0.3 + k * 0.25)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <circle cx={x} cy={y} r="8" className="ct-num" />
        <text x={x} y={y + 3.5} textAnchor="middle" className="ct-num-text ct-num-sm">{k + 1}</text>
      </motion.g>)}
      {elements.map(([name, role], k) => <motion.g key={name} initial={false} animate={{ opacity: active === 0 ? 1 : 0, x: active === 0 ? 0 : 10 }} transition={p(0.4, 0.3 + k * 0.25)}>
        <circle cx="358" cy={82 + k * 38} r="11" className={`ct-num ct-num-${k}`} />
        <text x="358" y={86 + k * 38} textAnchor="middle" className="ct-num-text">{k + 1}</text>
        <text x="378" y={80 + k * 38} className="bi-label">{name}</text>
        <text x="378" y={95 + k * 38} className="bi-small">{role}</text>
      </motion.g>)}
      <text x="470" y="290" textAnchor="middle" className="bi-hand-sm">sem legenda, a cor vira enigma</text>
    </motion.g>


    {/* Recorte 2: generalização */}
    <motion.g initial={false} animate={show(active === 1)} transition={p(0.4)}>
      {[0, 1, 2].map(k => <motion.g key={k} initial={false} animate={{ opacity: active === 1 ? 1 : 0, y: active === 1 ? 0 : 8 }} transition={p(0.5, 0.2 + k * 0.4)}>
        <rect x={30 + k * 196} y="62" width="170" height="190" rx="6" className="ct-sheet" />
        <text x={115 + k * 196} y="82" textAnchor="middle" className="bi-small ct-strong">{['escala grande', 'escala média', 'escala pequena'][k]}</text>
      </motion.g>)}
      <path d="M40 240V96h60c6 8 -4 14 4 20s14 -6 18 4-8 12-2 18 12 0 14 8-6 10 0 16 10 -2 10 6-8 12-2 18 8 4 8 12-6 12-2 18 6 6 6 12V240Z" className="ct-landmass" />
      {[[152, 118, 6], [166, 150, 4], [160, 196, 5]].map(([x, y, r]) => <circle key={`${x}${y}`} cx={x} cy={y} r={r} className="ct-landmass" />)}
      <path d="M44 172c8 -4 14 6 22 2s10 -8 18 -4 8 8 16 4" className="ct-river-fine" />
      {[[58, 120], [70, 128], [62, 136], [82, 118], [76, 206], [90, 214]].map(([x, y]) => <rect key={`${x}${y}`} x={x} y={y} width="6" height="6" className="ct-house-fill" />)}
      <path d="M236 240V96h66c4 14 8 26 10 40s-2 26 4 42 6 32 4 62Z" className="ct-landmass" />
      <circle cx="352" cy="150" r="6" className="ct-landmass" />
      <path d="M240 172c14 -3 28 3 44 0" className="ct-river-fine" />
      <rect x="258" y="118" width="16" height="16" className="ct-house-fill" />
      <path d="M432 240V96h72c4 40 4 90 0 144Z" className="ct-landmass" />
      <circle cx="462" cy="130" r="5" className="ct-town" />
      {[0, 1].map(k => <path key={k} d={`M${204 + k * 196} 160h18`} className="ct-flow" markerEnd="url(#ct-rg-head)" />)}
      <defs><marker id="ct-rg-head" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" className="ct-head" /></marker></defs>
      <text x="115" y="272" textAnchor="middle" className="bi-small">ilhas, meandros, casas</text>
      <text x="311" y="272" textAnchor="middle" className="bi-small">agrupa e suaviza</text>
      <text x="507" y="272" textAnchor="middle" className="bi-small">omite o miúdo</text>
      <text x="310" y="302" textAnchor="middle" className="bi-hand-sm">generalizar é técnica, não defeito</text>
    </motion.g>


    {/* Recortes 3 e 4: o cartograma */}
    <motion.g initial={false} animate={show(active === 2)} transition={p(0.4)}>
      <motion.text x="30" y="66" className="bi-label" initial={false} animate={{ opacity: active === 2 ? [1, 1, 0] : 0 }} transition={p(1.6)}>tamanho = área real</motion.text>
      <motion.text x="30" y="66" className="bi-label ct-accent" initial={false} animate={{ opacity: active === 2 ? [0, 0, 1] : 0 }} transition={p(1.6)}>tamanho = população</motion.text>
      {COUNTRIES.map(c => {
        const s = active === 2 ? c.pop : c.area;
        const move = p(1, active === 2 ? 0.9 : 0);
        return <g key={c.name}>
          <motion.rect rx="8" className={`ct-country-${c.vast ? 'vast' : 'dense'}`} initial={false}
            animate={{ x: c.cx - s / 2, y: c.cy - s / 2, width: s, height: s }} transition={move} />
          <motion.text x={c.cx} textAnchor="middle" className="bi-label" initial={false} animate={{ y: c.cy + s / 2 + 16 }} transition={move}>{c.name}</motion.text>
          <motion.text x={c.cx} textAnchor="middle" className="bi-tiny" initial={false} animate={{ y: c.cy + s / 2 + 29 }} transition={move}>{c.vast ? 'vasto, pouco povoado' : 'populoso'}</motion.text>
        </g>;
      })}
      <text x="310" y="330" textAnchor="middle" className="bi-hand-sm">distorção de propósito, não erro</text>
    </motion.g>


    <motion.g initial={false} animate={show(active === 3)} transition={p(0.4)}>
      <rect x="30" y="56" width="270" height="258" rx="10" className="bi-panel" />
      <text x="48" y="80" className="bi-panel-title">GRÁFICO</text>
      <path d="M60 272H280M60 272V98" className="ct-axis" />
      {COUNTRIES.map((c, k) => <g key={c.name}>
        <motion.rect x={78 + k * 50} width="32" className={`ct-country-${c.vast ? 'vast' : 'dense'}`} initial={false}
          animate={{ y: 272 - c.pop * 1.4, height: c.pop * 1.4 }} transition={p(0.7, 0.3 + k * 0.1)} />
        <text x={94 + k * 50} y="290" textAnchor="middle" className="bi-tiny">{c.name}</text>
      </g>)}
      <text x="165" y="306" textAnchor="middle" className="bi-small">o dado, sem a forma do lugar</text>
      <rect x="320" y="56" width="270" height="258" rx="10" className="bi-panel" />
      <text x="338" y="80" className="bi-panel-title">ANAMORFOSE</text>
      {COUNTRIES.map(c => {
        const s = c.pop * 0.5, x = 318 + c.cx * 0.46, y = 64 + c.cy * 0.8;
        return <g key={c.name}>
          <rect x={x - s / 2} y={y - s / 2} width={s} height={s} rx="5" className={`ct-country-${c.vast ? 'vast' : 'dense'}`} />
          <text x={x} y={y + s / 2 + 13} textAnchor="middle" className="bi-tiny">{c.name}</text>
        </g>;
      })}
      <text x="455" y="306" textAnchor="middle" className="bi-small">o dado, no lugar de cada país</text>
    </motion.g>


    <text x="30" y="344" className="bi-foot">{active >= 2 ? 'Tamanhos esquemáticos: o resumo dá o sentido da mudança, não os números.' : 'Mapas e costas esquemáticos.'}</text>
  </svg>;
}


// ---------------------------------------------------------------------------
// Água na superfície: um corte do continente ao oceano. O chão, as camadas
// e o poço ficam; cada recorte acende uma parte — a proporção de água, a
// bacia cortada por uma fronteira, os dois tipos de aquífero, o poço que
// tira mais do que entra.
const SURFACE = 'M20 250L60 206L96 170L120 150L146 168L186 212L232 236L300 244';
const SURFACE_END = 'L470 262L470 330L20 330Z';
const PLAIN = { flat: 'C330 246 350 248 380 248C410 250 440 254 470 262', sunk: 'C330 250 350 256 380 256C410 254 440 256 470 262' };
const RIVER = { flat: 'M150 178C170 196 190 222 232 238C270 244 300 244 340 246C400 250 440 256 470 262', sunk: 'M150 178C170 196 190 222 232 238C270 244 300 246 340 250C400 256 440 256 470 262' };
const TABLE = { base: 'M232 258C290 258 320 260 350 260C380 260 420 262 470 266', low: 'M232 258C290 260 320 282 350 282C380 282 420 264 470 266' };


export function SurfaceWater({ active }: Scene) {
  const p = usePaced();
  const sunk = active === 3;
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Água na superfície terrestre: 97% nos oceanos, bacia atravessando fronteira, aquífero livre e confinado, superexplotação e subsidência; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">ÁGUA · DO CUME AO OCEANO</text>
    <defs>
      <clipPath id="ct-land-clip"><path d={`${SURFACE}${PLAIN.flat}${SURFACE_END}`} /></clipPath>
      <marker id="ct-w-head" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" className="ct-head" /></marker>
    </defs>


    <rect x="462" y="262" width="138" height="68" className="ct-ocean" />
    <path d="M470 262H600" className="ct-wave" />
    <motion.path d={`${SURFACE}${PLAIN.flat}${SURFACE_END}`} className="ct-soil" initial={false} animate={{ d: `${SURFACE}${sunk ? PLAIN.sunk : PLAIN.flat}${SURFACE_END}` }} transition={p(1.2, sunk ? 1.4 : 0)} />
    <g clipPath="url(#ct-land-clip)">
      <motion.path d="M150 170L178 200L244 280L470 280L470 292L236 292L166 190Z" className="ct-clay" initial={false} animate={{ opacity: active === 2 ? 1 : 0.7 }} transition={p(0.4)} />
      <motion.path d="M140 176L166 190L236 292L470 292L470 322L224 322L132 186Z" className="ct-aquifer-deep" initial={false} animate={{ opacity: active === 2 || active === 0 ? 1 : 0.6 }} transition={p(0.4)} />
      <motion.path d="M232 244L470 262L470 280L244 280Z" className="ct-aquifer-free" initial={false} animate={{ opacity: active === 2 || active === 3 ? 1 : 0.6 }} transition={p(0.4)} />
      <motion.path d={TABLE.base} className="ct-table" initial={false} animate={{ d: sunk ? TABLE.low : TABLE.base }} transition={p(1.4, sunk ? 0.4 : 0)} />
    </g>
    <path d="M104 164L120 150L136 162L128 160L120 166L112 160Z" className="ct-ice" />
    <motion.path d={RIVER.flat} className="ct-river" initial={false} animate={{ d: sunk ? RIVER.sunk : RIVER.flat }} transition={p(1.2, sunk ? 1.4 : 0)} />
    <ellipse cx="270" cy="243" rx="20" ry="3" className="ct-lake" />


    {/* Recorte 1: quanto é acessível */}
    <motion.g initial={false} animate={show(active === 0)} transition={p(0.4)}>
      <rect x="30" y="58" width="560" height="22" rx="5" className="ct-salt" />
      <motion.rect x="573" y="58" width="17" height="22" rx="3" className="ct-fresh" initial={false} animate={{ scale: active === 0 ? [1, 1.25, 1] : 1 }} transition={p(0.6, 0.6)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
      <text x="44" y="74" className="ct-bar-text">oceanos · salgada · cerca de 97%</text>
      <text x="566" y="74" textAnchor="end" className="ct-bar-text">doce 3%</text>
      <motion.path d="M573 82L360 102M590 82L590 102" className="ct-lens" initial={false} animate={{ pathLength: active === 0 ? 1 : 0 }} transition={p(0.6, 0.8)} />
      <motion.g initial={false} animate={{ opacity: active === 0 ? 1 : 0 }} transition={p(0.5, 1.2)}>
        <rect x="360" y="102" width="230" height="20" rx="4" className="ct-ice-bar" />
        <rect x="548" y="102" width="42" height="20" rx="3" className="ct-surface-bar" />
        <text x="370" y="116" className="ct-bar-text ct-bar-dark">geleiras e aquíferos fundos</text>
        <path d="M569 124v8" className="ct-leader" />
        <text x="590" y="144" textAnchor="end" className="bi-tiny ct-strong">rios e lagos:</text>
        <text x="590" y="156" textAnchor="end" className="bi-tiny">bem menos de 1% do total</text>
      </motion.g>
      <text x="30" y="108" className="bi-small">a água cobre cerca de 71% da superfície,</text>
      <text x="30" y="124" className="bi-small">mas quase toda está fora do alcance</text>
      <text x="530" y="306" textAnchor="middle" className="bi-small ct-on-water">oceano</text>
      <text x="70" y="160" textAnchor="middle" className="bi-tiny">geleira</text>
      <text x="270" y="232" textAnchor="middle" className="bi-tiny">lago</text>
      <text x="300" y="316" textAnchor="middle" className="bi-tiny ct-on-water">aquífero profundo</text>
    </motion.g>


    {/* Recorte 2: bacia e fronteira */}
    <motion.g initial={false} animate={show(active === 1)} transition={p(0.4)}>
      <path d="M92 100a12 12 0 0 1 10-16a16 16 0 0 1 30-2a11 11 0 0 1 14 18Z" className="ct-cloud" />
      {[100, 112, 126, 138].map((x, k) => <motion.path key={x} d={`M${x} ${106 + (k % 2) * 6}v12`} className="ct-rain" initial={false} animate={{ y: active === 1 ? [0, 18, 36] : 0, opacity: active === 1 ? [1, 1, 0] : 0 }} transition={p(1, 0.2 + k * 0.1)} />)}
      <path d="M120 144V112" className="ct-divide" />
      <text x="152" y="92" className="bi-label">divisor de águas</text>
      <path d="M114 138C104 146 90 158 80 176" className="ct-flow" markerEnd="url(#ct-w-head)" />
      <path d="M126 138C136 146 146 158 156 174" className="ct-flow" markerEnd="url(#ct-w-head)" />
      <text x="36" y="196" className="bi-tiny">outra bacia</text>
      <path d="M300 96V252" className="ct-border" />
      <text x="292" y="110" textAnchor="end" className="bi-label">país A</text>
      <text x="308" y="110" className="bi-label">país B</text>
      <text x="292" y="126" textAnchor="end" className="bi-small">a montante</text>
      <text x="308" y="126" className="bi-small">a jusante</text>
      <path d="M246 236h14v-20h8v10h10v10Z" className="ct-factory" />
      <text x="262" y="204" textAnchor="middle" className="bi-tiny">uso a montante</text>
      {[0, 1, 2, 3, 4].map(k => <motion.circle key={k} r="4" className="ct-pollution" initial={false}
        animate={active === 1 ? { cx: [278, 330, 390, 450], cy: [242, 244, 248, 256], opacity: [0, 1, 1, 0] } : { cx: 278, cy: 242, opacity: 0 }}
        transition={p(2.2, 0.4 + k * 0.35)} />)}
      <text x="440" y="170" textAnchor="middle" className="bi-hand-sm">o que se faz rio acima</text>
      <text x="440" y="188" textAnchor="middle" className="bi-hand-sm">chega rio abaixo</text>
    </motion.g>


    {/* Recorte 3: livre × confinado */}
    <motion.g initial={false} animate={show(active === 2)} transition={p(0.4)}>
      <path d="M346 238h26v8h-26ZM352 238v-10h14v10" className="ct-farm" />
      {[0, 1, 2].map(k => <motion.path key={k} d="M0 -4c-3 4-3 7 0 7s3-3 0-7Z" className="ct-drop" initial={false}
        animate={active === 2 ? { x: 354 + k * 8, y: [246, 262, 274], opacity: [0, 1, 0.8] } : { x: 354 + k * 8, y: 246, opacity: 0 }} transition={p(1.4, 0.4 + k * 0.3)} />)}
      <text x="330" y="80" className="bi-label">aquífero livre</text>
      <text x="330" y="98" className="bi-small">nível freático exposto à superfície:</text>
      <text x="330" y="114" className="bi-small">mais vulnerável à contaminação</text>
      <text x="30" y="80" className="bi-label">aquífero confinado</text>
      <text x="30" y="98" className="bi-small">protegido por camada impermeável,</text>
      <text x="30" y="114" className="bi-small">mas de recarga natural mais lenta</text>
      <motion.path d="M168 186L196 226" className="ct-recharge" markerEnd="url(#ct-w-head)" initial={false} animate={{ pathLength: active === 2 ? 1 : 0 }} transition={p(2.4, 0.6)} />
      <text x="206" y="200" className="bi-tiny">recarga</text>
      <text x="440" y="274" textAnchor="middle" className="bi-tiny ct-strong">livre</text>
      <text x="380" y="312" textAnchor="middle" className="bi-tiny ct-on-water">confinado</text>
      <text x="300" y="289" className="bi-tiny ct-on-clay">camada impermeável</text>
    </motion.g>


    {/* Recorte 4: superexplotação */}
    <motion.g initial={false} animate={show(active === 3)} transition={p(0.4)}>
      <motion.g initial={false} animate={{ y: sunk ? 6 : 0 }} transition={p(1.2, 1.4)}>
        <path d="M344 220h12v26h-12Z" className="ct-pump" />
        <path d="M350 246V280" className="ct-pipe" />
        <path d="M356 226h14" className="ct-pipe" />
        <motion.g initial={false} animate={{ rotate: sunk ? 6 : 0 }} transition={p(0.8, 2.2)} style={{ originX: 0, originY: 1 }}>
          <path d="M392 249v-20l14-12 14 12v20Z" className="ct-home" />
        </motion.g>
      </motion.g>
      <motion.path d="M384 252l6 8-4 6 5 8" className="ct-crack" initial={false} animate={{ pathLength: sunk ? 1 : 0 }} transition={p(0.6, 2.4)} />
      <text x="30" y="80" className="bi-label">extração maior que a recarga</text>
      <text x="30" y="98" className="bi-small">① o lençol freático rebaixa, década a década</text>
      <text x="30" y="116" className="bi-small">② as camadas antes sustentadas pela água</text>
      <text x="44" y="130" className="bi-small">se compactam: o solo afunda (subsidência)</text>
      <text x="600" y="176" textAnchor="end" className="bi-hand-sm">Cidade do México,</text>
      <text x="600" y="194" textAnchor="end" className="bi-hand-sm">Califórnia</text>
    </motion.g>


    <text x="30" y="344" className="bi-foot">Corte esquemático, sem escala; as proporções dentro dos 3% são ilustrativas.</text>
  </svg>;
}


export const SCENES_LOTE15: Record<string, React.ComponentType<Scene>> = {
  'summary-geografia-sistema-de-fusos-horarios': TimeZones,
  'summary-geografia-linguagem-cartografica': MapScale,
  'summary-geografia-cartografia-digital': DigitalMapping,
  'summary-geografia-representacoes-graficas-e-cartograficas': MapElements,
  'summary-geografia-agua-na-superficie-terrestre': SurfaceWater,
};
export const HEADERS_LOTE15: Record<string, string> = {
  'summary-geografia-sistema-de-fusos-horarios': 'fusos e cálculo de horário',
  'summary-geografia-linguagem-cartografica': 'escala e curvas de nível',
  'summary-geografia-cartografia-digital': 'geotecnologias',
  'summary-geografia-representacoes-graficas-e-cartograficas': 'linguagem dos mapas',
  'summary-geografia-agua-na-superficie-terrestre': 'recursos hídricos',
};
