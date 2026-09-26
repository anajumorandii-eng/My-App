import React from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import { Person, type Scene } from './cenaKit';
import './OrienteMedio.css';

function usePaced() {
  const t = useSceneMotion();
  return (duration: number, delay = 0) => (t.duration === 0 ? t : { ...t, duration, delay });
}

// Lote 12 da régua de História e Geografia: Ásia, Oriente Médio, Questão
// Palestina e conflitos no mundo árabe. Os quatro capítulos abriam com a mesma
// ContextScene (três círculos e duas setas) e uma ressalva de "esquema que não
// descreve país específico" — o contrário do que o resumo ensina, que é
// território, passagem, fronteira e tempo. Aqui cada cena parte de um mapa
// esquemático desenhado de coordenadas reais (lon/lat, projeção retangular)
// e o recorte decide o que acontece sobre ele.
//
// Temas sensíveis: toda posição vem atribuída a quem a sustenta, como o resumo
// faz, e os dois lados de qualquer disputa usam as mesmas duas cores neutras
// (azul-petróleo e ocre) — nenhuma leitura de cor aponta vilão. O plano de
// partilha de 1947 não tem traçado desenhado porque o resumo não o descreve.

type LL = readonly [number, number];
type Proj = (lon: number, lat: number) => [number, number];

const projector = (x0: number, y0: number, lon0: number, lat0: number, kx: number, ky: number): Proj =>
  (lon, lat) => [x0 + (lon - lon0) * kx, y0 + (lat0 - lat) * ky];

const trace = (P: Proj, pts: readonly LL[], close = true) =>
  pts.map(([lon, lat], i) => {
    const [x, y] = P(lon, lat);
    return `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join('') + (close ? 'Z' : '');

/** Rótulo de lugar posicionado por lon/lat, com halo de papel para ler sobre o mapa. */
function Place({ P, ll, text, anchor = 'middle', className = 'om-place', dy = 0 }: { P: Proj; ll: LL; text: string; anchor?: 'start' | 'middle' | 'end'; className?: string; dy?: number }) {
  const [x, y] = P(ll[0], ll[1]);
  return <text x={x} y={y + dy} textAnchor={anchor} className={`${className} om-halo`}>{text}</text>;
}

// ——— Ícones desenhados à mão (centro em 0,0, ~24 px) ———
const Factory = ({ x, y, s = 1, className = 'om-factory' }: { x: number; y: number; s?: number; className?: string }) =>
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-13 10V-2l8 5V-2l8 5V-9h5v-5h4v24Z" className={className} />
    <path d="M-9 5h3M-1 5h3M7 5h3" className="om-factory-win" />
  </g>;

const Chip = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) =>
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-5 -9v-4M0 -9v-4M5 -9v-4M-5 9v4M0 9v4M5 9v4M-9 -5h-4M-9 0h-4M-9 5h-4M9 -5h4M9 0h4M9 5h4" className="om-chip-pin" />
    <rect x="-9" y="-9" width="18" height="18" rx="2.5" className="om-chip-body" />
    <rect x="-4" y="-4" width="8" height="8" rx="1" className="om-chip-core" />
  </g>;

const Drop = ({ x, y, s = 1, className = 'om-oil' }: { x: number; y: number; s?: number; className?: string }) =>
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 -8C3 -3 6 0 6 3.5a6 6 0 0 1-12 0C-6 0-3 -3 0 -8Z" className={className} />;

const Barrel = ({ x, y, on }: { x: number; y: number; on: boolean }) =>
  <g transform={`translate(${x} ${y})`}>
    <path d="M-11 -15h22q3 15 0 30h-22q-3-15 0-30Z" className={on ? 'om-barrel om-barrel-on' : 'om-barrel'} />
    <path d="M-12.5 -6h25M-12.5 6h25" className={on ? 'om-barrel-band om-barrel-band-on' : 'om-barrel-band'} />
  </g>;

const Dam = ({ x, y }: { x: number; y: number }) =>
  <g transform={`translate(${x} ${y})`}>
    <path d="M-7 6l2-12h10l2 12Z" className="om-dam" />
    <path d="M-4 -2h8M-5 2h10" className="om-dam-line" />
  </g>;

// ————————————————————————————————————————————————————————————————
// 1. Geopolítica e Geoeconomia da Ásia
// ————————————————————————————————————————————————————————————————
const PA = projector(22, 56, 60, 50, 3.42, 3.42);

const ASIA_MAIN: LL[] = [[57, 53], [141, 53], [140.5, 50], [140, 48], [138, 46], [135.5, 43.8], [133, 42.8], [131.5, 43], [130.7, 42.3], [129.7, 41], [129.7, 40.3], [128.4, 38.6], [129.4, 36.5], [129.4, 35.5], [129, 35.1], [127.5, 34.6], [126.4, 34.4], [126.5, 35.5], [126.8, 36.8], [126.5, 37.6], [125.2, 37.7], [125.3, 38.6], [124.7, 39.6], [124.2, 39.9], [121.3, 38.8], [122, 40.6], [121, 40.9], [119.5, 39.8], [118, 39.1], [117.6, 38.5], [118.8, 37.5], [119.2, 37.1], [120.7, 37.8], [122.5, 37.4], [122.3, 36.9], [120.8, 36.4], [119.3, 35], [120.2, 34.3], [120.8, 32.6], [121.9, 31.7], [121.8, 30.9], [121.9, 30.2], [121.5, 29], [120.6, 27.5], [119.6, 26], [118.6, 24.6], [117.2, 23.6], [116, 22.9], [114.3, 22.3], [113.3, 22.2], [111.8, 21.6], [110.4, 20.4], [110.2, 21.4], [109.7, 21.6], [108.5, 21.6], [106.7, 20.7], [105.9, 19.4], [105.7, 18.6], [106.6, 17.4], [107.8, 16.2], [108.8, 15.1], [109.2, 13.4], [109.2, 11.6], [108.1, 10.9], [106.8, 10.4], [105.1, 8.7], [104.8, 9.6], [104.4, 10.5], [103.5, 10.6], [102.6, 12.1], [101.7, 12.7], [100.9, 13.5], [100, 13.4], [99.2, 10.9], [99.8, 9.3], [100.3, 8.4], [100.6, 7.1], [101.5, 6.9], [102.3, 6.1], [103.1, 5.5], [103.4, 4.3], [103.4, 2.8], [104.2, 1.5], [103.5, 1.3], [102.4, 2.2], [101.3, 2.9], [100.6, 4.4], [100.3, 5.6], [99.7, 6.6], [98.6, 8.2], [98.3, 9.5], [98.6, 10.9], [98.5, 12.2], [97.8, 14.9], [97.6, 16.5], [96.5, 16.7], [95.4, 15.8], [94.3, 16], [94.5, 17.5], [94, 19], [93.6, 19.8], [92.4, 20.7], [92, 21.5], [91.8, 22.4], [90.6, 22.3], [89.8, 21.9], [88.9, 21.6], [88.2, 21.7], [86.9, 20.8], [86.5, 20], [85.1, 19.3], [84, 18.3], [82.2, 16.6], [81.2, 15.9], [80.2, 15.1], [80.3, 13.4], [79.9, 11.9], [79.8, 10.3], [78.9, 9.3], [78.2, 8.8], [77.5, 8.1], [76.6, 8.9], [76.1, 10.3], [75.5, 11.8], [74.8, 13], [74.4, 14.5], [73.5, 16], [73, 17.8], [72.8, 19.3], [72.9, 20.6], [72.6, 21.4], [71.1, 20.8], [70.1, 21.3], [69, 22.3], [69.6, 22.8], [68.3, 23.6], [67.4, 24], [67, 24.8], [66.4, 25.4], [64.5, 25.2], [62.8, 25.2], [61.5, 25.1], [60, 25.3], [57, 25.5]];
const ASIA_ISLANDS: LL[][] = [
  [[79.9, 9.8], [80.8, 9.3], [81.9, 7], [81.3, 6.2], [80.1, 6], [79.7, 8]],
  [[121.9, 25.1], [121.6, 24], [120.9, 22], [120.1, 23], [120.4, 24.5]],
  [[110.9, 20], [111, 19.5], [109.6, 18.2], [108.6, 19.2], [109.3, 20]],
  [[141.5, 41.3], [142, 39.5], [141, 38.2], [140.9, 36.9], [140.6, 35.4], [139.8, 35], [138.8, 34.6], [137, 34.6], [135.2, 33.8], [132.4, 34.3], [131, 34.1], [132.9, 35.5], [135.6, 35.6], [136.8, 37.2], [138.5, 37.8], [140, 39.7], [140, 40.8]],
  [[130, 33.5], [131.8, 33.3], [131.3, 31.4], [130.6, 31], [129.8, 32.7]],
  [[132.4, 34.2], [134.6, 34.1], [134.3, 33.2], [133, 32.8]],
  [[140.4, 41.5], [141.1, 42.4], [143.3, 41.9], [145.5, 43.3], [144.2, 44.1], [141.7, 45.4], [141.4, 43.4], [140.2, 42.8]],
  [[120.6, 18.5], [122.2, 18.5], [122, 16], [121.6, 14.2], [124, 13], [123.3, 13.8], [121, 13.8], [120.6, 14.5], [119.9, 16.3]],
  [[122, 7], [123.9, 8.6], [125.4, 9.8], [126.5, 7.3], [125.4, 5.6], [124, 6.5], [122.1, 6.9]],
  [[122.9, 11.9], [124.3, 12.4], [125.6, 11.2], [124.9, 10], [123.3, 9.3], [122.5, 10.6]],
  [[117.2, 8.4], [119.6, 11.3], [119.3, 10.2], [117.6, 8.2]],
  [[109, 1.5], [109.6, 2], [111, 1.7], [113, 3.2], [115.5, 5.3], [117, 7], [118.5, 5], [119, 4.6], [117.8, 1], [118.9, 0.8], [117.5, 0], [116.5, -2], [116, -3.8], [114, -3.5], [111, -3.1], [110, -1.5], [109, 0]],
  [[95.3, 5.6], [97.5, 5.2], [100.3, 2.3], [103.5, -0.5], [104.8, -2.2], [106, -3.2], [105.8, -5.8], [104.5, -5.9], [102, -4], [100.4, -1], [98.7, 1.7], [96, 4]],
  [[105.2, -6.8], [106.1, -6], [108.3, -6.3], [110.4, -6.9], [112.6, -6.9], [114.6, -7.7], [114.4, -8.7], [111, -8.2], [108.5, -7.8], [106.4, -7.4]],
  [[119.4, -5.5], [120.4, -5.5], [120.3, -2.9], [121, -2.7], [120.9, -1.4], [123.3, -0.9], [125, 1.5], [124.4, 0.4], [120.1, 0.5], [119.8, -0.1], [118.8, -2.6]],
  [[131, -1], [135, -3.3], [138, -1.6], [141, -2.6], [152, -5], [152, -11], [141, -9], [138, -8.4], [137.6, -5], [133, -4], [132, -2.8]],
];
const CHINA: LL[] = [[73.6, 39.4], [74.9, 37.2], [77.8, 35.5], [78.9, 34.3], [78.4, 32.5], [79.3, 31], [81.1, 30.2], [83.3, 29.5], [86, 27.9], [88.1, 27.9], [88.9, 27.3], [89.7, 28.2], [91.7, 27.8], [92.5, 27.8], [94.6, 29.3], [96.2, 29], [97.3, 28.3], [98.5, 27.6], [98.7, 25.9], [97.7, 24.8], [97.8, 23.9], [99.2, 22.1], [100.2, 21.4], [101.2, 21.2], [101.8, 22.4], [103.3, 22.8], [104.5, 22.8], [105.8, 22.9], [106.7, 22], [107.9, 21.5], [108.5, 21.6], [109.7, 21.6], [110.2, 21.4], [110.4, 20.4], [111.8, 21.6], [113.3, 22.2], [114.3, 22.3], [116, 22.9], [117.2, 23.6], [118.6, 24.6], [119.6, 26], [120.6, 27.5], [121.5, 29], [121.9, 30.2], [121.8, 30.9], [121.9, 31.7], [120.8, 32.6], [120.2, 34.3], [119.3, 35], [120.8, 36.4], [122.3, 36.9], [122.5, 37.4], [120.7, 37.8], [119.2, 37.1], [118.8, 37.5], [117.6, 38.5], [118, 39.1], [119.5, 39.8], [121, 40.9], [122, 40.6], [121.3, 38.8], [124.2, 39.9], [125.4, 40.6], [126.9, 41.8], [128.1, 42], [129.6, 42.4], [130.6, 42.4], [131.3, 44.9], [133.1, 45.1], [134.7, 48.3], [132.5, 47.8], [130.9, 48.9], [127.5, 49.8], [126, 52], [120, 52], [119.3, 47.6], [116, 46.7], [113, 44.8], [111.9, 43.7], [110.4, 42.8], [107.3, 42.4], [105, 41.6], [100.8, 42.7], [96.4, 42.7], [95.3, 44.2], [93.5, 45], [90.8, 45.3], [90.9, 46.9], [88.8, 48.1], [87.3, 49.1], [85.8, 48.5], [85.5, 47.1], [83, 47.2], [82.3, 45.5], [80.3, 45], [80.2, 42.1], [78.5, 41.6], [76.5, 40.4], [75.4, 40.6]];
const KASHMIR: LL[] = [[73.5, 34.5], [74.5, 36.2], [76.5, 36], [78, 35], [77.5, 33], [75.5, 32.5], [74, 33]];
const NINE_DASH: LL[] = [[108.2, 18.2], [109.6, 14.5], [109.9, 10.5], [110.6, 6.5], [112.5, 4], [115.2, 5.8], [117.4, 9], [118.7, 12.8], [119.3, 16.6], [120.6, 20.2]];

const ASIA_LAND_D = [trace(PA, ASIA_MAIN), ...ASIA_ISLANDS.map(i => trace(PA, i))].join('');
const CHINA_D = trace(PA, CHINA);
const KASHMIR_D = trace(PA, KASHMIR);
const DASHES = NINE_DASH.slice(0, -1).map(([a, b], i) => {
  const [c, d] = NINE_DASH[i + 1];
  return trace(PA, [[a, b], [a + (c - a) * 0.55, b + (d - b) * 0.55]], false);
});
const BRI_ROUTES = [
  { d: trace(PA, [[108.9, 34.3], [95, 39], [80, 40.2], [68, 38.2]], false), end: 'Ásia', at: [44, 88] as const, anchor: 'middle' as const },
  { d: trace(PA, [[113.3, 23], [111, 12], [105.5, 2.5], [103.6, 1.4], [100.5, 3.6], [97.5, 6.3], [92, 5.8], [81, 5.2], [63, 3.5]], false), end: 'África', at: [30, 204] as const, anchor: 'start' as const },
  { d: trace(PA, [[121.5, 31.2], [135, 27], [151, 22]], false), end: 'América Latina', at: [324, 172] as const, anchor: 'end' as const },
];
const ASIA_CAPTIONS = [
  ['o que a China combinou:', 'mão de obra barata, infraestrutura,', 'poupança e estratégia estatal'],
  ['investimento em dezenas de países', 'da Ásia, da África e da América', 'Latina, em troca de financiamento'],
  ['o que está em jogo no mar:', 'rotas comerciais estratégicas e', 'petróleo e gás no subsolo marinho'],
  ['a Ásia não é um bloco homogêneo:', 'renda altíssima e países ainda', 'em desenvolvimento, lado a lado'],
];
const STEPS = [
  { label: 'têxteis', icon: <path d="M-10 -8l6-4h8l6 4 4 6-5 3-2-2v13h-14v-13l-2 2-5-3Z" className="om-icon-fill" /> },
  { label: 'brinquedos', icon: <g><circle cx="-7" cy="-7" r="4" className="om-icon-fill" /><circle cx="7" cy="-7" r="4" className="om-icon-fill" /><circle r="9" className="om-icon-fill" /><path d="M-3 -2h.1M3 -2h.1M-2 3q2 2 4 0" className="om-icon-line" /></g> },
  { label: 'semicondutores', icon: <Chip x={0} y={0} s={0.85} /> },
  { label: 'IA · veículos elétricos', icon: <g><path d="M-13 4v-5l4-6h14l6 6h2v5Z" className="om-icon-fill" /><circle cx="-7" cy="5" r="3" className="om-icon-wheel" /><circle cx="8" cy="5" r="3" className="om-icon-wheel" /><path d="M1 -12l-4 7h4l-2 6 6-8h-4l2-5Z" className="om-bolt" /></g> },
];

export function AsiaAscent({ active }: Scene) {
  const p = usePaced();
  const fade = (k: number) => ({ initial: false as const, animate: { opacity: active === k ? 1 : 0 }, transition: p(0.45, active === k ? 0.1 : 0) });
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Geoeconomia da Ásia: a China sobe na cadeia de valor desde 1978, projeta o Cinturão e Rota, convive com focos de tensão e divide a produção no China plus one; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">ÁSIA · DESDE 1978</text>
    <defs>
      <clipPath id="om-asia-clip"><rect x="22" y="52" width="308" height="214" rx="12" /></clipPath>
      <pattern id="om-asia-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0v5" className="om-hatch-line" /></pattern>
      <marker id="om-asia-head" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" className="om-route-head" /></marker>
    </defs>
    <rect x="22" y="52" width="308" height="214" rx="12" className="om-sea" />
    <g clipPath="url(#om-asia-clip)">
      <path d={ASIA_LAND_D} className="om-land" />
      <motion.path d={CHINA_D} className="om-china" initial={false} animate={{ opacity: active === 2 ? 0.45 : 1 }} transition={p(0.4)} />
      <motion.path d={KASHMIR_D} fill="url(#om-asia-hatch)" className="om-zone" initial={false} animate={{ opacity: active === 2 ? 1 : 0 }} transition={p(0.5, active === 2 ? 1 : 0)} />
    </g>
    <rect x="22" y="52" width="308" height="214" rx="12" className="om-frame" />
    <Place P={PA} ll={[103, 35]} text="CHINA" className="om-country" />
    <Place P={PA} ll={[78.5, 22]} text="ÍNDIA" className="om-country" />
    <Place P={PA} ll={[140, 31]} text="JAPÃO" className="om-country" />

    {/* R1: fábricas surgem no litoral chinês enquanto os degraus sobem */}
    <motion.g {...fade(0)}>
      {([[113.5, 23.6], [120.6, 31.4], [117, 39.3]] as const).map(([lon, lat], k) => {
        const [x, y] = PA(lon, lat);
        return <motion.g key={lon} initial={false} animate={{ scale: active === 0 ? 1 : 0.4 }} transition={p(0.45, active === 0 ? 0.3 + k * 0.25 : 0)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}>
          <Factory x={x} y={y} s={0.62} />
        </motion.g>;
      })}
    </motion.g>

    {/* R2: rotas do Cinturão e Rota partem da China */}
    <motion.g {...fade(1)}>
      {BRI_ROUTES.map((r, k) => <g key={r.end}>
        <motion.path d={r.d} className="om-route" markerEnd="url(#om-asia-head)" initial={false}
          animate={{ pathLength: active === 1 ? 1 : 0 }} transition={p(1, active === 1 ? 0.2 + k * 0.3 : 0)} />
        <text x={r.at[0]} y={r.at[1]} textAnchor={r.anchor} className="om-place om-strong om-halo">{r.end}</text>
      </g>)}
      <g transform={`translate(${PA(95, 39)[0]} ${PA(95, 39)[1] - 12})`}>
        <path d="M-9 -5h18v9h-18ZM-6 -5v-3h12v3" className="om-icon-fill" /><circle cx="-5" cy="6" r="2" className="om-icon-wheel" /><circle cx="5" cy="6" r="2" className="om-icon-wheel" />
      </g>
      <g transform={`translate(${PA(92, 4.5)[0]} ${PA(92, 4.5)[1] - 13})`}>
        <path d="M0 -8v15M-6 2q6 8 12 0M-4 -4h8" className="om-icon-line" /><circle cx="0" cy="-9" r="2" className="om-icon-line" />
      </g>
      <path transform={`translate(${PA(80, 40.2)[0]} ${PA(80, 40.2)[1] - 14})`} d="M1 -8l-5 9h5l-2 7 7-10h-5l2-6Z" className="om-bolt" />
      <circle cx={PA(108.9, 34.3)[0]} cy={PA(108.9, 34.3)[1]} r="4" className="om-origin" />
    </motion.g>

    {/* R3: linha de nove traços, Taiwan e Caxemira */}
    <motion.g {...fade(2)}>
      {DASHES.map((d, k) => <motion.path key={d} d={d} className="om-dash" initial={false}
        animate={{ pathLength: active === 2 ? 1 : 0 }} transition={p(0.25, active === 2 ? 0.15 + k * 0.09 : 0)} />)}
      <Place P={PA} ll={[114, 13]} text="Mar do Sul" className="om-sea-label" />
      <Place P={PA} ll={[114, 13]} dy={11} text="da China" className="om-sea-label" />
      <Place P={PA} ll={[106.6, 16.4]} text="Vietnã" anchor="end" />
      <Place P={PA} ll={[123.2, 12.2]} text="Filipinas" anchor="start" />
      <Place P={PA} ll={[114.3, -1.2]} text="Malásia · Brunei" />
      <Place P={PA} ll={[122.8, 26.4]} text="Taiwan" anchor="start" />
      <motion.g initial={false} animate={{ scale: active === 2 ? [0.6, 1.25, 1] : 0.6 }} transition={p(0.6, active === 2 ? 0.9 : 0)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <Chip x={PA(121, 23.7)[0] + 20} y={PA(121, 23.7)[1] + 8} s={0.5} />
      </motion.g>
      <Place P={PA} ll={[78.6, 34.4]} text="Caxemira" anchor="start" />
      <Place P={PA} ll={[66.5, 29]} text="Paquistão" />
    </motion.g>

    {/* R4: China plus one, tigres, Japão que envelhece, Índia de Bangalore */}
    <motion.g {...fade(3)}>
      <Factory x={PA(113.5, 26)[0]} y={PA(113.5, 26)[1]} s={0.72} />
      {([[106.2, 15.5, 'Vietnã', 'end'], [110.5, -7.2, 'Indonésia', 'middle'], [121.2, 16.2, 'Filipinas', 'start']] as const).map(([lon, lat, name, anchor], k) => {
        const [x0, y0] = PA(113.5, 26);
        const [x, y] = PA(lon, lat);
        return <g key={name}>
          <motion.path d={`M${x0} ${y0 + 8}Q${(x0 + x) / 2 + 10} ${(y0 + y) / 2} ${x} ${y - 9}`} className="om-route" markerEnd="url(#om-asia-head)" initial={false}
            animate={{ pathLength: active === 3 ? 1 : 0 }} transition={p(0.7, active === 3 ? 0.2 + k * 0.25 : 0)} />
          <motion.g initial={false} animate={{ opacity: active === 3 ? 1 : 0, scale: active === 3 ? 1 : 0.5 }} transition={p(0.4, active === 3 ? 0.8 + k * 0.25 : 0)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}>
            <Factory x={x} y={y} s={0.5} className="om-factory om-factory-new" />
          </motion.g>
          <text x={x + (anchor === 'end' ? -10 : anchor === 'start' ? 10 : 0)} y={y + (anchor === 'middle' ? 16 : 4)} textAnchor={anchor} className="om-place om-strong om-halo">{name}</text>
        </g>;
      })}
      {([[127.6, 36.4], [121, 23.8], [114.2, 22.3], [103.8, 1.3]] as const).map(([lon, lat]) => {
        const [x, y] = PA(lon, lat);
        return <path key={lon} transform={`translate(${x} ${y})`} d="M0 -5l1.5 3.3 3.5.4-2.6 2.4.7 3.5L0 2.8l-3.1 1.8.7-3.5L-5 -1.3l3.5-.4Z" className="om-star" />;
      })}
      <g transform={`translate(${PA(143.5, 36.5)[0]} ${PA(143.5, 36.5)[1]})`}>
        <path d="M-9 -8h18v4h-18ZM-7 -2h14v4h-14ZM-4 4h8v4h-8Z" className="om-pyramid" />
      </g>
      <circle cx={PA(77.6, 13)[0]} cy={PA(77.6, 13)[1]} r="3.5" className="om-origin" />
      <Place P={PA} ll={[76.4, 12.6]} text="Bangalore" anchor="end" />
    </motion.g>

    {ASIA_CAPTIONS.map((lines, k) => <motion.g key={k} {...fade(k)}>
      {lines.map((line, i) => <text key={line} x="30" y={290 + i * 15} className={i === 0 ? 'bi-small bi-strong' : 'bi-small'}>{line}</text>)}
    </motion.g>)}

    <rect x="344" y="52" width="248" height="274" rx="14" className="bi-panel" />
    {/* painel R1: degraus da cadeia de valor */}
    <motion.g {...fade(0)}>
      <text x="360" y="78" className="bi-panel-title">SUBIDA NA CADEIA DE VALOR</text>
      <text x="360" y="96" className="bi-small">1978: reformas de Deng Xiaoping</text>
      <text x="360" y="112" className="bi-tiny">hoje: 2ª em PIB nominal; 1ª em PPC</text>
      {STEPS.map((s, k) => {
        const h = 48 + k * 32;
        const x = 362 + k * 56;
        return <g key={s.label}>
          <motion.rect x={x} width="52" rx="4" className={k < 2 ? 'om-step' : 'om-step om-step-high'} initial={false}
            animate={{ y: active === 0 ? 290 - h : 290, height: active === 0 ? h : 0 }} transition={p(0.55, active === 0 ? 0.2 + k * 0.3 : 0)} />
          <motion.g initial={false} animate={{ opacity: active === 0 ? 1 : 0, y: active === 0 ? 0 : 12 }} transition={p(0.4, active === 0 ? 0.45 + k * 0.3 : 0)}>
            <g transform={`translate(${x + 26} ${290 - h - 17})`}>{s.icon}</g>
            <text transform={`translate(${x + 30} ${282}) rotate(-90)`} className="om-step-text">{s.label}</text>
          </motion.g>
        </g>;
      })}
      <path d="M364 296v5h104v-5M476 296v5h108v-5" className="om-bracket" />
      <text x="416" y="316" textAnchor="middle" className="bi-tiny">baixo valor agregado</text>
      <text x="530" y="316" textAnchor="middle" className="bi-tiny">tecnologia avançada</text>
    </motion.g>

    {/* painel R2: financiamento para fora, dependência de volta */}
    <motion.g {...fade(1)}>
      <text x="360" y="78" className="bi-panel-title">2013 · CINTURÃO E ROTA</text>
      <text x="360" y="96" className="bi-small">a Nova Rota da Seda</text>
      {[['portos', <g key="a"><path d="M0 -8v15M-7 2q7 9 14 0M-4 -4h8" className="om-icon-line" /><circle cx="0" cy="-10" r="2" className="om-icon-line" /></g>],
        ['ferrovias', <g key="b"><path d="M-9 -6h18v10h-18ZM-6 -6v-3h12v3" className="om-icon-fill" /><circle cx="-5" cy="6" r="2.2" className="om-icon-wheel" /><circle cx="5" cy="6" r="2.2" className="om-icon-wheel" /></g>],
        ['energia', <path key="c" d="M1 -10l-6 11h6l-2 9 8-12h-6l2-8Z" className="om-bolt" />]].map(([label, icon], k) =>
        <motion.g key={label as string} initial={false} animate={{ scale: active === 1 ? 1 : 0.6 }} transition={p(0.4, active === 1 ? 0.2 + k * 0.15 : 0)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
          <circle cx={396 + k * 76} cy="128" r="17" className="om-badge" />
          <g transform={`translate(${396 + k * 76} 128)`}>{icon}</g>
          <text x={396 + k * 76} y="159" textAnchor="middle" className="bi-tiny">{label}</text>
        </motion.g>)}
      <rect x="356" y="180" width="70" height="44" rx="8" className="bi-block" />
      <text x="391" y="207" textAnchor="middle" className="bi-small bi-strong">China</text>
      <rect x="512" y="180" width="70" height="44" rx="8" className="bi-block" />
      <text x="547" y="199" textAnchor="middle" className="bi-tiny">país</text>
      <text x="547" y="212" textAnchor="middle" className="bi-tiny">receptor</text>
      <path d="M430 190h76" className="om-flow-line" markerEnd="url(#om-asia-head)" />
      <path d="M508 216h-76" className="om-flow-line om-flow-back" markerEnd="url(#om-asia-head)" />
      {[0, 1, 2].map(k => <motion.circle key={k} cy="190" r="4" className="om-coin" initial={false}
        animate={{ cx: active === 1 ? [436, 498] : 436, opacity: active === 1 ? [0, 1, 0] : 0 }} transition={p(1.1, active === 1 ? 0.6 + k * 0.35 : 0)} />)}
      <text x="468" y="182" textAnchor="middle" className="bi-tiny">financiamento</text>
      <text x="468" y="232" textAnchor="middle" className="bi-tiny">dependência</text>
      <text x="468" y="244" textAnchor="middle" className="bi-tiny">e influência</text>
      <text x="360" y="268" className="bi-small">crédito que muitos países não</text>
      <text x="360" y="283" className="bi-small">obteriam de outras fontes</text>
      <text x="360" y="310" className="bi-hand-sm">geoeconomia, não ajuda</text>
    </motion.g>

    {/* painel R3: três focos */}
    <motion.g {...fade(2)}>
      {[
        ['MAR DO SUL DA CHINA', 'China reivindica quase todo o mar', 'Vietnã, Filipinas, Malásia, Brunei e', 'Taiwan também reivindicam partes'],
        ['TAIWAN', 'para a China: "uma só China"', 'governo autônomo de fato desde 1949', 'papel central nos semicondutores'],
        ['CAXEMIRA', 'Índia × Paquistão, desde 1947', 'dividida na partição britânica', 'os dois lados têm armas nucleares'],
      ].map(([title, a, b, c], k) => <motion.g key={title} initial={false} animate={{ opacity: active === 2 ? 1 : 0, x: active === 2 ? 0 : 10 }} transition={p(0.45, active === 2 ? 0.2 + k * 0.35 : 0)}>
        <rect x="352" y={60 + k * 88} width="232" height="82" rx="10" className="om-card" />
        <text x="364" y={80 + k * 88} className="bi-panel-title">{title}</text>
        <text x="364" y={97 + k * 88} className="bi-small">{a}</text>
        <text x="364" y={112 + k * 88} className="bi-tiny">{b}</text>
        <text x="364" y={127 + k * 88} className="bi-tiny">{c}</text>
      </motion.g>)}
    </motion.g>

    {/* painel R4: China + 1 */}
    <motion.g {...fade(3)}>
      <text x="360" y="78" className="bi-panel-title">CHINA PLUS ONE</text>
      <Factory x={402} y={122} s={1.5} />
      <text x="402" y="156" textAnchor="middle" className="bi-tiny">China: fica</text>
      <text x="462" y="128" textAnchor="middle" className="om-plus">+</text>
      <motion.g initial={false} animate={{ x: active === 3 ? 0 : -40, opacity: active === 3 ? 1 : 0 }} transition={p(0.7, active === 3 ? 0.5 : 0)}>
        <Factory x={526} y={122} s={1.2} className="om-factory om-factory-new" />
        <text x="526" y="156" textAnchor="middle" className="bi-tiny">Vietnã e vizinhos</text>
      </motion.g>
      <text x="360" y="180" className="bi-small">diversifica sem sair da China:</text>
      <text x="360" y="195" className="bi-small">mão de obra mais barata e</text>
      <text x="360" y="210" className="bi-small">menos dependência de um só país</text>
      <path d="M360 222h216" className="om-rule" />
      <path transform="translate(366 244)" d="M-6 -5h12v3h-12ZM-4.5 0h9v3h-9ZM-2.5 5h5v3h-5Z" className="om-pyramid" />
      <text x="378" y="240" className="bi-tiny">Japão: indústria desde o séc. XIX;</text>
      <text x="378" y="252" className="bi-tiny">população envelhece e diminui</text>
      <path transform="translate(366 270)" d="M0 -5l1.5 3.3 3.5.4-2.6 2.4.7 3.5L0 2.8l-3.1 1.8.7-3.5L-5 -1.3l3.5-.4Z" className="om-star" />
      <text x="378" y="270" className="bi-tiny">tigres: Coreia do Sul, Taiwan, Hong</text>
      <text x="378" y="282" className="bi-tiny">Kong, Singapura; 1960 a 1990</text>
      <circle cx="366" cy="300" r="3.5" className="om-origin" />
      <text x="378" y="304" className="bi-tiny">Índia: Bangalore e pobreza rural</text>
    </motion.g>
    <text x="30" y="342" className="bi-foot">Mapa esquemático: contornos simplificados, posições aproximadas, sem escala.</text>
  </svg>;
}

// ————————————————————————————————————————————————————————————————
// 2. Geografia do Oriente Médio e 4. Conflitos no mundo árabe (mesma costa)
// ————————————————————————————————————————————————————————————————
const MED_EAST: LL[] = [[26.2, 40.6], [26.2, 40], [26.8, 39.5], [26.5, 38.4], [27.2, 38.2], [27.4, 37], [28.2, 36.7], [29.5, 36.2], [30.6, 36.8], [32, 36.6], [33, 36.1], [34.6, 36.8], [35.4, 36.6], [36.2, 36.6], [35.9, 35.4], [35.5, 34], [34.9, 32.8], [34.5, 31.6], [34.2, 31.3], [32.3, 31.2], [31, 31.6], [29.9, 31.2], [28, 31], [25, 31.6]];
const MED_WEST: LL[] = [[23, 32.6], [21, 32.9], [20, 32], [20, 31], [19, 30.3], [17.5, 31], [15.5, 31.8], [15, 32.3], [13, 32.9], [11.5, 33.1], [10.2, 34], [11, 35.2], [10.5, 36.5], [11.1, 37], [10.2, 37.2], [9.8, 37.3], [8.5, 36.9], [6.3, 37.1], [5, 36.8], [3, 36.8]];
const BLACK: LL[] = [[27, 43.5], [28, 42], [28.1, 41.6], [29.1, 41.2], [31.3, 41.1], [33.3, 42], [35.2, 42.1], [36.5, 41.3], [38.3, 40.9], [40, 41], [41.5, 41.5], [41.8, 43.5]];
const CASPIAN: LL[] = [[47.5, 43.5], [47.9, 42], [48.9, 41.8], [49.2, 40.4], [49.6, 40], [48.9, 38.4], [49.1, 37.6], [50.3, 37.1], [51.5, 36.8], [53.9, 36.9], [53.9, 37.3], [53.2, 39.3], [52.8, 40.5], [52.9, 41.8], [52.5, 43.5]];
const RED: LL[] = [[32.55, 29.95], [32.75, 29.6], [33.3, 28.7], [34.25, 27.75], [34.6, 28], [35.2, 28], [36.2, 26.4], [37.2, 25], [38.2, 23.8], [39.1, 21.8], [39.8, 20.3], [41.1, 18.6], [42.3, 16.6], [42.7, 15.4], [43.2, 13.3], [43.5, 12.6], [43.2, 12.4], [42.5, 13.2], [41.7, 13.9], [40.5, 15], [39.5, 15.6], [38.9, 17.2], [37.4, 19.8], [37.2, 21.3], [36.8, 22.3], [35.8, 23.9], [35.3, 24.7], [34.5, 25.8], [33.9, 27.1], [33.5, 27.8], [32.7, 28.8], [32.35, 29.6]];
const ARABIAN: LL[] = [[43.5, 12.7], [44.8, 12.8], [46, 13.4], [48, 14], [50.1, 15], [52.2, 15.8], [55.3, 17.4], [56.8, 18.5], [57.8, 19], [58.5, 20.4], [59.8, 22.5], [58.8, 23.6], [57.5, 23.8], [56.4, 24.8], [56.35, 26.35], [56.6, 26.9], [57.2, 26], [58.8, 25.6], [61.6, 25.2], [67, 25.3], [67, 8], [51.3, 8], [51.2, 11.8], [47, 11.1], [44.5, 10.4], [43.4, 11.5]];
const GULF: LL[] = [[56.35, 26.35], [56.1, 26.1], [56.2, 25.5], [55.5, 25.4], [54.6, 24.3], [53.5, 24.1], [52.2, 24.1], [51.6, 24.3], [51.3, 25.2], [51.5, 25.9], [51.2, 26.1], [50.8, 24.8], [50.4, 25.4], [50.1, 26.2], [49.6, 26.8], [48.9, 27.6], [48.5, 28.2], [48.1, 29.2], [48, 29.9], [48.6, 29.95], [49.1, 30.3], [50.1, 30.2], [50.6, 29.3], [51.1, 28.5], [51.5, 27.9], [52.6, 27.3], [53.6, 26.8], [54.8, 26.5], [55.6, 26.7], [56.3, 27.1], [56.6, 26.9]];
const ISLANDS_MED: LL[][] = [
  [[32.3, 35.1], [33.5, 35.4], [34.6, 35.7], [34, 34.9], [33, 34.6], [32.4, 34.8]],
  [[23.5, 35.5], [24.3, 35.4], [26.3, 35.3], [26.2, 35], [24.8, 34.9], [23.6, 35.2]],
  [[12.4, 38.1], [13.3, 38.2], [15.6, 38.3], [15.1, 37.2], [15.1, 36.7], [14.3, 36.8], [12.5, 37.6]],
  [[15.6, 39.5], [15.7, 38.2], [16.1, 38], [16.6, 38.4], [17.2, 39.5]],
  [[21.1, 39.5], [21.3, 38.3], [21.6, 37.6], [21.7, 36.8], [22.4, 36.4], [23.2, 36.4], [22.8, 37.5], [23.5, 38], [24.1, 38.2], [24.3, 39.5]],
];
const BORDERS: LL[][] = [
  [[35.9, 35.9], [36.6, 36.2], [36.7, 36.8], [38.2, 36.9], [40, 36.9], [41.2, 37.1], [42.3, 37.2], [43.6, 37.3], [44.8, 37.15], [44.2, 38], [44.5, 39.3], [44.8, 39.7], [43.5, 40.5], [43.4, 41.1], [42.8, 41.6], [41.5, 41.5]],
  [[44.8, 37.15], [45.5, 35.9], [46.1, 35.1], [45.6, 34.1], [46.2, 33.2], [47.4, 32.4], [48, 30.9], [48.5, 30]],
  [[42.3, 37.2], [41.3, 36.5], [41.2, 34.4], [38.8, 33.4]],
  [[38.8, 33.4], [36, 32.3], [35.6, 32.7]],
  [[35.95, 34.6], [36.6, 34.2], [36, 33.5], [35.8, 33.3], [35.1, 33.1]],
  [[38.8, 33.4], [39.3, 32.2], [37, 31.5], [38, 30.5], [36.5, 29.5], [35, 29.4]],
  [[35, 29.5], [35.5, 31.5], [35.6, 32.7]],
  [[38.8, 33.4], [40.4, 31.9], [44.7, 29.2], [46.5, 29.1], [48.4, 28.5]],
  [[46.5, 29.1], [47.1, 30], [48, 30]],
  [[34.2, 31.3], [34.9, 29.5]],
  [[25, 22], [36.9, 22]],
  [[25, 31.6], [25, 20]],
  [[42.8, 16.4], [44.1, 17.4], [46.4, 17.2], [47.5, 19], [52, 19], [53.1, 16.6], [52.2, 15.8]],
  [[52, 19], [55.6, 22], [55.2, 22.7], [51.6, 24.3]],
  [[55.2, 22.7], [56.3, 24.9]],
  [[61.2, 37], [60.5, 34.2], [60.8, 31.5], [61.6, 31.4], [62.8, 29.4], [61.8, 28.2], [61.6, 25.2]],
  [[53.9, 37.3], [55.5, 38], [57.3, 38.2], [59.5, 37.5], [61.2, 36.6]],
  [[44.8, 39.7], [46.5, 39], [48, 38.9], [48.9, 38.4]],
  [[8.6, 36.9], [8.2, 35.5], [8.3, 34.6], [7.5, 33.2], [9.1, 32.1], [9.5, 30.2]],
  [[11.5, 33.1], [10.3, 31.9], [10, 30.8], [9.5, 30.2], [10, 25], [11.5, 24.2]],
];
const KURDS: LL[] = [[37.6, 37.3], [39, 38.8], [41.5, 39.6], [44, 39.5], [45.5, 38.5], [47, 36.5], [47.4, 34.6], [46, 33.9], [44.6, 34.8], [43, 35.8], [41.2, 36.3], [39.5, 36.4], [38.2, 36.5]];

function coastPaths(P: Proj, west: boolean) {
  const med = west
    ? [[3, 40.2], [26.2, 40.2], ...MED_EAST, ...MED_WEST] as LL[]
    : [[24, 41.2], [26.2, 41.2], ...MED_EAST, [24, 31.6]] as LL[];
  return {
    seas: [med, BLACK, CASPIAN, RED, ARABIAN, GULF].map(s => trace(P, s)).join(''),
    islands: ISLANDS_MED.map(s => trace(P, s)).join(''),
    borders: BORDERS.map(b => trace(P, b, false)).join(''),
    kurds: trace(P, KURDS),
  };
}

const PM = projector(22, 52, 25, 42, 8, 8);
const ME = coastPaths(PM, false);
const EUPHRATES: LL[] = [[39.3, 39.6], [38.8, 39], [38.6, 38.3], [38.3, 37.5]];
const EUPHRATES_LOW: LL[] = [[38.3, 37.5], [38.1, 36.8], [38.3, 36.2], [39.1, 35.9], [40.2, 35.2], [40.9, 34.5], [41.9, 34.4], [43, 33.4], [43.9, 32.6], [44.6, 31.8], [45.6, 31.1], [46.5, 31], [47.3, 30.9]];
const TIGRIS: LL[] = [[39.8, 38.4], [40.9, 37.9], [41.8, 37.6]];
const TIGRIS_LOW: LL[] = [[41.8, 37.6], [42.4, 37.2], [43.1, 36.4], [43.3, 35.5], [43.8, 34.4], [44.4, 33.3], [45.2, 32.6], [46, 32], [46.8, 31.3], [47.3, 30.9], [47.9, 30.6], [48.4, 30]];
const JORDAN: LL[] = [[35.65, 33.2], [35.6, 32.8], [35.57, 32.3], [35.55, 31.75]];

const ME_PANEL_X = 358;

export function MiddleEastMap({ active }: Scene) {
  const p = usePaced();
  const fade = (k: number) => ({ initial: false as const, animate: { opacity: active === k ? 1 : 0 }, transition: p(0.45, active === k ? 0.1 : 0) });
  const [hx, hy] = PM(56.45, 26.55);
  const tanker = [[52.5, 26.8], [55.4, 26.5], [56.5, 26.5], [57.6, 25.3], [60, 24.1]].map(([a, b]) => PM(a, b));
  const suez = [[33.4, 33.4], [32.5, 31.6], [32.5, 30.2], [33.2, 28.6], [35.4, 26.3], [37.6, 22.8]].map(([a, b]) => PM(a, b));
  const [sx, sy] = PM(46.7, 24.7);
  const [ix, iy] = PM(51.4, 35.7);
  const proxies = [[45, 15.8], [38.2, 34.8], [35.95, 33.9]].map(([a, b]) => PM(a, b));
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Geografia do Oriente Médio: petróleo do Golfo, Ormuz e Suez, povos distintos com os curdos sem Estado, sunitas e xiitas, e a água do Tigre e do Eufrates; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">ORIENTE MÉDIO · TRÊS CONTINENTES</text>
    <defs>
      <clipPath id="om-me-clip"><rect x="22" y="52" width="324" height="258" rx="12" /></clipPath>
      <pattern id="om-me-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0v6" className="om-hatch-line" /></pattern>
      <marker id="om-me-head" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" className="om-route-head" /></marker>
    </defs>
    <g clipPath="url(#om-me-clip)">
      <rect x="22" y="52" width="324" height="258" className="om-land" />
      <path d={ME.seas} className="om-sea" />
      <path d={ME.islands} className="om-land" />
      <path d={ME.borders} className="om-border" />
      <path d={trace(PM, [[34.95, 29.5], [34.45, 28.05]], false)} className="om-strait" />
      <motion.path d={ME.kurds} fill="url(#om-me-hatch)" className="om-zone" initial={false} animate={{ opacity: active === 1 ? 1 : 0 }} transition={p(0.6, active === 1 ? 0.5 : 0)} />
      <motion.g initial={false} animate={{ opacity: active === 3 ? 1 : 0.55 }} transition={p(0.4)}>
        <path d={trace(PM, EUPHRATES, false)} className="om-river" />
        <path d={trace(PM, TIGRIS, false)} className="om-river" />
        <motion.path d={trace(PM, EUPHRATES_LOW, false)} className="om-river" initial={false} animate={{ strokeWidth: active === 3 ? 1.2 : 2.6 }} transition={p(1.2, active === 3 ? 0.9 : 0)} />
        <motion.path d={trace(PM, TIGRIS_LOW, false)} className="om-river" initial={false} animate={{ strokeWidth: active === 3 ? 1.2 : 2.6 }} transition={p(1.2, active === 3 ? 0.9 : 0)} />
        <path d={trace(PM, JORDAN, false)} className="om-river om-river-thin" />
      </motion.g>
    </g>
    <rect x="22" y="52" width="324" height="258" rx="12" className="om-frame" />
    <Place P={PM} ll={[29.3, 40.7]} text="EUROPA" className="om-continent" />
    <Place P={PM} ll={[58.5, 40]} text="ÁSIA" className="om-continent" />
    <Place P={PM} ll={[29.5, 18.5]} text="ÁFRICA" className="om-continent" />
    <Place P={PM} ll={[34, 39]} text="Turquia" className="om-place om-strong" />
    <Place P={PM} ll={[38.6, 35.4]} text="Síria" className="om-place om-strong" />
    <Place P={PM} ll={[43.4, 32.6]} text="Iraque" className="om-place om-strong" />
    <Place P={PM} ll={[55, 32.6]} text="Irã" className="om-place om-strong" />
    <Place P={PM} ll={[44.4, 22.2]} text="Arábia Saudita" className="om-place om-strong" />
    <Place P={PM} ll={[29.5, 26.5]} text="Egito" className="om-place om-strong" />
    <Place P={PM} ll={[47.6, 16.2]} text="Iêmen" className="om-place om-strong" />
    <Place P={PM} ll={[29, 32.2]} text="Mediterrâneo" className="om-sea-label" />

    {/* R1: petróleo do Golfo, Ormuz e Suez */}
    <motion.g {...fade(0)}>
      {([[48.6, 25.8], [46.2, 31.6], [50.3, 31.3], [47.6, 29.1], [54.4, 23.6]] as const).map(([lon, lat], k) => {
        const [x, y] = PM(lon, lat);
        return <motion.g key={lon} initial={false} animate={{ scale: active === 0 ? 1 : 0 }} transition={p(0.35, active === 0 ? 0.2 + k * 0.12 : 0)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}>
          <Drop x={x} y={y} s={1.1} />
        </motion.g>;
      })}
      <circle cx={hx} cy={hy} r="14" className="om-ring" />
      <text x={hx + 6} y={hy + 30} className="om-place om-strong om-halo">Ormuz</text>
      <motion.g initial={false} animate={active === 0 ? { x: tanker.map(t => t[0]), y: tanker.map(t => t[1]) } : { x: tanker[0][0], y: tanker[0][1] }} transition={p(2.4, active === 0 ? 0.6 : 0)}>
        <path d="M-9 -2h14l4 3-3 3h-15Z" className="om-ship" /><path d="M-5 -2v-3h5v3" className="om-ship" />
      </motion.g>
      <Place P={PM} ll={[32, 29.8]} text="Suez" anchor="end" className="om-place om-strong" dy={4} />
      <motion.path d={`M${suez.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L')}`} className="om-route" markerEnd="url(#om-me-head)" initial={false}
        animate={{ pathLength: active === 0 ? 1 : 0 }} transition={p(1.4, active === 0 ? 0.4 : 0)} />
    </motion.g>

    {/* R2: povos — os curdos atravessados por quatro fronteiras */}
    <motion.g {...fade(1)}>
      {([[34, 39, 'turcos'], [38.6, 35.4, 'árabes'], [43.4, 32.6, 'árabes'], [55, 32.6, 'persas'], [44.4, 22.2, 'árabes'], [29.5, 26.5, 'árabes']] as const).map(([lon, lat, people], k) => {
        const [x, y] = PM(lon, lat);
        return <motion.g key={`${lon}`} initial={false} animate={{ opacity: active === 1 ? 1 : 0, y: active === 1 ? 0 : -4 }} transition={p(0.35, active === 1 ? 0.15 + k * 0.08 : 0)}>
          <rect x={x - people.length * 2.9 - 6} y={y + 4} width={people.length * 5.8 + 12} height="15" rx="7.5" className="om-chip" />
          <text x={x} y={y + 15} textAnchor="middle" className="om-chip-text">{people}</text>
        </motion.g>;
      })}
      <Place P={PM} ll={[42.7, 37.9]} text="curdos" className="om-hand om-hand-kurd" />
    </motion.g>

    {/* R3: sunitas e xiitas — Arábia Saudita e Irã disputam por proxies */}
    <motion.g {...fade(2)}>
      {proxies.map(([x, y], k) => <g key={x}>
        <motion.path d={`M${sx} ${sy - 8}Q${(sx + x) / 2 - 24} ${(sy + y) / 2} ${x} ${y}`} className="om-proxy om-proxy-b" initial={false}
          animate={{ pathLength: active === 2 ? 1 : 0 }} transition={p(0.8, active === 2 ? 0.3 + k * 0.2 : 0)} />
        <motion.path d={k === 0 ? `M${ix} ${iy + 6}Q${(ix + x) / 2 + 20} ${(iy + y) / 2 + 30} ${x} ${y}` : `M${ix - 6} ${iy - 2}Q${(ix + x) / 2} ${Math.min(iy, y) - 34} ${x} ${y - 4}`} className="om-proxy om-proxy-a" initial={false}
          animate={{ pathLength: active === 2 ? 1 : 0 }} transition={p(0.8, active === 2 ? 0.5 + k * 0.2 : 0)} />
        <circle cx={x} cy={y} r="4.5" className="om-proxy-dot" />
      </g>)}
      <Place P={PM} ll={[35.2, 33.9]} text="Líbano" anchor="end" />
      <circle cx={sx} cy={sy} r="7" className="om-side om-side-b" />
      <circle cx={ix} cy={iy} r="7" className="om-side om-side-a" />
      {([[43.4, 32.6], [55, 32.6]] as const).map(([lon, lat]) => {
        const [x, y] = PM(lon, lat);
        return <g key={lon}><rect x={x - 38} y={y + 4} width="76" height="15" rx="7.5" className="om-chip om-chip-a" /><text x={x} y={y + 15} textAnchor="middle" className="om-chip-text">maioria xiita</text></g>;
      })}
    </motion.g>

    {/* R4: barragens do GAP a montante */}
    <motion.g {...fade(3)}>
      {([[38.3, 37.5], [41.8, 37.6]] as const).map(([lon, lat], k) => {
        const [x, y] = PM(lon, lat);
        return <motion.g key={lon} initial={false} animate={{ scale: active === 3 ? 1 : 0.3 }} transition={p(0.45, active === 3 ? 0.3 + k * 0.2 : 0)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}>
          <Dam x={x} y={y} />
        </motion.g>;
      })}
      <Place P={PM} ll={[40, 38.9]} text="GAP" className="om-place om-strong" />
      <Place P={PM} ll={[44.2, 31.2]} text="Eufrates" className="om-river-label" anchor="end" />
      <Place P={PM} ll={[44.9, 34.6]} text="Tigre" className="om-river-label" anchor="start" />
      <Place P={PM} ll={[35.95, 32.1]} text="Jordão" className="om-river-label" anchor="start" />
      <Drop x={PM(35.25, 31.9)[0] - 2} y={PM(35.25, 31.9)[1] + 16} s={0.9} className="om-water" />
    </motion.g>

    <rect x="354" y="52" width="238" height="274" rx="14" className="bi-panel" />
    <motion.g {...fade(0)}>
      <text x={ME_PANEL_X + 10} y="78" className="bi-panel-title">PETRÓLEO E PASSAGENS</text>
      {[0, 1, 2, 3, 4].map(k => <motion.g key={k} initial={false} animate={{ y: active === 0 && k === 0 ? [8, 0] : 0 }} transition={p(0.5, active === 0 ? 0.9 : 0)}>
        <Barrel x={384 + k * 44} y={112} on={k === 0} />
      </motion.g>)}
      <text x={ME_PANEL_X + 10} y="148" className="bi-small bi-strong">≈ 1/5 do petróleo consumido no</text>
      <text x={ME_PANEL_X + 10} y="163" className="bi-small bi-strong">mundo passa por Ormuz</text>
      <text x={ME_PANEL_X + 10} y="186" className="bi-small">maiores reservas provadas do</text>
      <text x={ME_PANEL_X + 10} y="201" className="bi-small">mundo ao redor do Golfo Pérsico</text>
      <text x={ME_PANEL_X + 10} y="224" className="bi-small">Suez liga Mediterrâneo e Mar</text>
      <text x={ME_PANEL_X + 10} y="239" className="bi-small">Vermelho: encurta Europa–Ásia</text>
      <text x={ME_PANEL_X + 10} y="258" className="bi-tiny bi-strong">potências externas:</text>
      <text x={ME_PANEL_X + 10} y="270" className="bi-tiny">Reino Unido e França, após a 1ª Guerra</text>
      <text x={ME_PANEL_X + 10} y="282" className="bi-tiny">EUA, desde meados do séc. XX</text>
      <text x={ME_PANEL_X + 10} y="306" className="bi-hand-sm">três continentes se ligam aqui</text>
    </motion.g>
    <motion.g {...fade(1)}>
      <text x={ME_PANEL_X + 10} y="78" className="bi-panel-title">POVOS DISTINTOS</text>
      {[['árabes', 'maioria em Arábia Saudita,', 'Egito, Iraque e Síria'], ['persas', 'maioria no Irã', ''], ['turcos', 'maioria na Turquia', '']].map(([who, a, b], k) => {
        const y = 100 + [0, 40, 64][k];
        return <g key={who}>
          <rect x={ME_PANEL_X + 10} y={y - 11} width="48" height="15" rx="7.5" className="om-chip" />
          <text x={ME_PANEL_X + 34} y={y} textAnchor="middle" className="om-chip-text">{who}</text>
          <text x={ME_PANEL_X + 66} y={y} className="bi-small">{a}</text>
          {b && <text x={ME_PANEL_X + 66} y={y + 15} className="bi-small">{b}</text>}
        </g>;
      })}
      <rect x={ME_PANEL_X + 8} y="184" width="222" height="104" rx="10" className="om-card" />
      <rect x={ME_PANEL_X + 18} y="196" width="20" height="14" fill="url(#om-me-hatch)" className="om-zone" />
      <text x={ME_PANEL_X + 46} y="208" className="bi-small bi-strong">curdos: um povo sem Estado</text>
      <text x={ME_PANEL_X + 18} y="230" className="bi-small">dezenas de milhões, divididos</text>
      <text x={ME_PANEL_X + 18} y="245" className="bi-small">entre Turquia, Iraque, Síria e Irã</text>
      <text x={ME_PANEL_X + 18} y="268" className="bi-tiny">um dos maiores grupos étnicos</text>
      <text x={ME_PANEL_X + 18} y="280" className="bi-tiny">sem Estado independente no mundo</text>
      <text x={ME_PANEL_X + 10} y="310" className="bi-hand-sm">um povo, quatro fronteiras</text>
    </motion.g>
    <motion.g {...fade(2)}>
      <text x={ME_PANEL_X + 10} y="78" className="bi-panel-title">SUNITAS E XIITAS</text>
      <text x={ME_PANEL_X + 10} y="98" className="bi-small">clivagem religiosa dentro do</text>
      <text x={ME_PANEL_X + 10} y="113" className="bi-small">islamismo, não étnica: atravessa</text>
      <text x={ME_PANEL_X + 10} y="128" className="bi-small">etnias diferentes</text>
      <text x={ME_PANEL_X + 10} y="146" className="bi-tiny">remonta à sucessão do profeta Maomé</text>
      <circle cx={ME_PANEL_X + 34} cy="184" r="16" className="om-side om-side-b" />
      <circle cx={ME_PANEL_X + 196} cy="184" r="16" className="om-side om-side-a" />
      <motion.path d={`M${ME_PANEL_X + 56} 184H${ME_PANEL_X + 174}`} className="om-rival" initial={false}
        animate={{ pathLength: active === 2 ? 1 : 0 }} transition={p(0.7, active === 2 ? 0.3 : 0)} />
      <text x={ME_PANEL_X + 115} y="178" textAnchor="middle" className="bi-tiny">disputa de influência</text>
      <text x={ME_PANEL_X + 34} y="216" textAnchor="middle" className="bi-tiny bi-strong">Arábia Saudita</text>
      <text x={ME_PANEL_X + 34} y="228" textAnchor="middle" className="bi-tiny">potência sunita</text>
      <text x={ME_PANEL_X + 196} y="216" textAnchor="middle" className="bi-tiny bi-strong">Irã</text>
      <text x={ME_PANEL_X + 196} y="228" textAnchor="middle" className="bi-tiny">potência xiita</text>
      <text x={ME_PANEL_X + 10} y="254" className="bi-small">por proxies: Iêmen, Síria, Líbano</text>
      <text x={ME_PANEL_X + 10} y="272" className="bi-tiny">xiitas: maioria no Irã, no Iraque e</text>
      <text x={ME_PANEL_X + 10} y="284" className="bi-tiny">em partes do Líbano</text>
      <text x={ME_PANEL_X + 10} y="310" className="bi-hand-sm">religião e influência juntas</text>
    </motion.g>
    <motion.g {...fade(3)}>
      <text x={ME_PANEL_X + 10} y="78" className="bi-panel-title">ÁGUA A JUSANTE</text>
      <text x={ME_PANEL_X + 10} y="96" className="bi-tiny">Tigre e Eufrates, da nascente ao Golfo</text>
      <path d={`M${ME_PANEL_X + 12} 132H${ME_PANEL_X + 226}`} className="om-bed" />
      <motion.path d={`M${ME_PANEL_X + 12} 132H${ME_PANEL_X + 62}`} className="om-flow" initial={false} animate={{ strokeWidth: 14 }} transition={p(0.4)} />
      <motion.path d={`M${ME_PANEL_X + 70} 132H${ME_PANEL_X + 226}`} className="om-flow" initial={false}
        animate={{ strokeWidth: active === 3 ? 5 : 14 }} transition={p(1.2, active === 3 ? 0.7 : 0)} />
      <g transform={`translate(${ME_PANEL_X + 66} 128) scale(1.6)`}><path d="M-5 8l1.5-14h7l1.5 14Z" className="om-dam" /></g>
      {[['Turquia', 36], ['Síria', 118], ['Iraque', 170], ['Golfo', 214]].map(([name, dx]) => <text key={name as string} x={ME_PANEL_X + (dx as number)} y="160" textAnchor="middle" className="bi-tiny">{name}</text>)}
      <text x={ME_PANEL_X + 66} y="112" textAnchor="middle" className="bi-tiny bi-strong">GAP</text>
      <text x={ME_PANEL_X + 10} y="186" className="bi-small">barragens turcas nas cabeceiras</text>
      <text x={ME_PANEL_X + 10} y="201" className="bi-small">reduzem a vazão para Síria e</text>
      <text x={ME_PANEL_X + 10} y="216" className="bi-small">Iraque: tensão diplomática</text>
      <text x={ME_PANEL_X + 10} y="240" className="bi-tiny">Jordão: Israel, Jordânia, Síria e</text>
      <text x={ME_PANEL_X + 10} y="252" className="bi-tiny">territórios palestinos</text>
      <text x={ME_PANEL_X + 10} y="270" className="bi-tiny">aquíferos da Cisjordânia: acesso</text>
      <text x={ME_PANEL_X + 10} y="282" className="bi-tiny">desigual à água</text>
      <text x={ME_PANEL_X + 10} y="310" className="bi-hand-sm">a montante, poder sobre a jusante</text>
    </motion.g>
    <text x="30" y="342" className="bi-foot">Mapa esquemático: contornos simplificados; áreas e vazões sem escala.</text>
  </svg>;
}

// ————————————————————————————————————————————————————————————————
// 3. Questão Palestina
// ————————————————————————————————————————————————————————————————
const PP = projector(22, 54, 33.95, 33.4, 75, 88);
const PAL_SEA: LL[] = [[33.5, 33.6], [35.25, 33.6], [35.2, 33.4], [35.1, 33.1], [35.07, 32.95], [34.96, 32.83], [34.95, 32.6], [34.87, 32.35], [34.78, 32.1], [34.68, 31.85], [34.52, 31.62], [34.38, 31.45], [34.22, 31.3], [34.0, 31.15], [33.5, 31.1]];
const DEAD_SEA: LL[] = [[35.47, 31.78], [35.58, 31.75], [35.6, 31.3], [35.52, 31.05], [35.4, 31.1], [35.42, 31.5]];
const WEST_BANK: LL[] = [[35.55, 32.4], [35.4, 32.52], [35.2, 32.55], [35.05, 32.4], [34.96, 32.18], [35.01, 31.97], [34.97, 31.82], [35.1, 31.8], [35.2, 31.73], [35.05, 31.55], [35.0, 31.43], [35.15, 31.36], [35.45, 31.35], [35.48, 31.6], [35.55, 31.85], [35.56, 32.1]];
const GAZA: LL[] = [[34.21, 31.32], [34.49, 31.6], [34.57, 31.54], [34.37, 31.27], [34.27, 31.22]];
const PAL_BORDERS: LL[][] = [
  [[34.22, 31.3], [34.6, 30.4], [34.9, 29.5]],
  [[35.4, 30.6], [35.4, 31.1]],
  [[35.55, 31.75], [35.57, 32.3], [35.6, 32.65]],
  [[35.1, 33.09], [35.5, 33.1], [35.6, 33.28], [35.8, 33.4]],
  [[35.65, 32.7], [35.8, 32.75], [35.9, 32.95]],
];
const SETTLEMENTS: LL[] = [[35.25, 32.36], [35.1, 32.3], [35.45, 32.3], [35.35, 32.44], [35.47, 31.92], [35.4, 31.72], [35.12, 31.62], [35.28, 31.55], [35.2, 31.45], [35.4, 31.48], [35.47, 32.12]];
const PAL_STOPS = [{ x: 246, year: '1917' }, { x: 352, year: '1947' }, { x: 458, year: '1948 · 1967' }, { x: 566, year: 'hoje' }];

export function PalestineTimeline({ active }: Scene) {
  const p = usePaced();
  const fade = (k: number) => ({ initial: false as const, animate: { opacity: active === k ? 1 : 0 }, transition: p(0.45, active === k ? 0.1 : 0) });
  const [jx, jy] = PP(35.22, 31.78);
  const gaza = GAZA.map(([a, b]) => PP(a, b));
  const [gx, gy] = PP(34.38, 31.43);
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Questão Palestina: Declaração Balfour de 1917, plano de partilha de 1947, guerras de 1948 e 1967 e impasses atuais sobre Jerusalém, assentamentos, Gaza e a solução de dois Estados; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">QUESTÃO PALESTINA · 1917 → HOJE</text>
    <defs>
      <clipPath id="om-pal-clip"><rect x="22" y="52" width="174" height="236" rx="12" /></clipPath>
      <pattern id="om-pal-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0v6" className="om-hatch-line" /></pattern>
      <marker id="om-pal-head" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" className="om-route-head" /></marker>
    </defs>
    <g clipPath="url(#om-pal-clip)">
      <rect x="22" y="52" width="174" height="236" className="om-land" />
      <motion.rect x="22" y="52" width="174" height="236" className="om-mandate" initial={false} animate={{ opacity: active === 0 ? 1 : 0 }} transition={p(0.5)} />
      <path d={trace(PP, PAL_SEA)} className="om-sea" />
      <path d={trace(PP, DEAD_SEA)} className="om-sea" />
      <ellipse cx={PP(35.59, 32.82)[0]} cy={PP(35.59, 32.82)[1]} rx="5" ry="8" className="om-sea" />
      <path d={PAL_BORDERS.map(b => trace(PP, b, false)).join('')} className="om-border" />
      <path d={trace(PP, JORDAN, false)} className="om-river om-river-thin" />
      <path d={trace(PP, WEST_BANK)} className="om-territory" />
      <path d={trace(PP, GAZA)} className="om-territory" />
      <motion.g initial={false} animate={{ opacity: active >= 2 ? 1 : 0 }} transition={p(0.6, active === 2 ? 1.3 : 0)}>
        <path d={trace(PP, WEST_BANK)} fill="url(#om-pal-hatch)" className="om-zone" />
        <path d={trace(PP, GAZA)} fill="url(#om-pal-hatch)" className="om-zone" />
      </motion.g>
    </g>
    <rect x="22" y="52" width="174" height="236" rx="12" className="om-frame" />
    <text transform="translate(44 196) rotate(-90)" className="om-sea-label">Mediterrâneo</text>
    <Place P={PP} ll={[35.45, 33.28]} text="Líbano" />
    <Place P={PP} ll={[35.95, 32.9]} text="Síria" />
    <Place P={PP} ll={[35.95, 31.0]} text="Jordânia" />
    <Place P={PP} ll={[34.3, 31.05]} text="Egito" />
    <Place P={PP} ll={[34.85, 31.1]} text="Israel" className="om-place om-strong" />
    <Place P={PP} ll={[35.26, 32.05]} text="Cisjordânia" className="om-place om-strong" />
    <text x={gx - 12} y={gy - 14} textAnchor="end" className="om-place om-strong om-halo">Gaza</text>
    <circle cx={jx} cy={jy} r="4" className="om-origin" />
    <text x={jx - 8} y={jy + 4} textAnchor="end" className="om-place om-strong om-halo">Jerusalém</text>

    {/* mapa por recorte */}
    <motion.g {...fade(0)}>
      {[[36, 104, 90, 128], [30, 150, 78, 160]].map(([x1, y1, x2, y2], k) =>
        <motion.path key={y1} d={`M${x1} ${y1}Q${(x1 + x2) / 2} ${Math.min(y1, y2) - 14} ${x2} ${y2}`} className="om-route" markerEnd="url(#om-pal-head)" initial={false}
          animate={{ pathLength: active === 0 ? 1 : 0 }} transition={p(0.8, active === 0 ? 0.6 + k * 0.25 : 0)} />)}
      <text x="30" y="283" className="om-place om-strong om-halo">mandato britânico</text>
    </motion.g>
    <motion.g {...fade(1)}>
      <motion.circle cx={jx} cy={jy} r="15" className="om-ring" initial={false} animate={{ scale: active === 1 ? [0.4, 1.15, 1] : 0.4 }} transition={p(0.8, active === 1 ? 0.3 : 0)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
      <text x={jx + 2} y={jy + 30} className="om-place om-strong om-halo">internacional</text>
    </motion.g>
    <motion.g {...fade(2)}>
      <text x="30" y="283" className="om-place om-strong om-halo">ocupados em 1967</text>
      <text x={jx + 8} y={jy + 22} className="om-place om-halo">Oriental</text>
    </motion.g>
    <motion.g {...fade(3)}>
      {SETTLEMENTS.map(([lon, lat], k) => {
        const [x, y] = PP(lon, lat);
        return <motion.rect key={`${lon}-${lat}`} x={x - 3} y={y - 3} width="6" height="6" rx="1" className="om-settle" initial={false}
          animate={{ scale: active === 3 ? 1 : 0 }} transition={p(0.3, active === 3 ? 0.3 + k * 0.08 : 0)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />;
      })}
      <motion.path d={`M${gaza.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L')}Z`} className="om-blockade" initial={false}
        animate={{ scale: active === 3 ? 1.6 : 1 }} transition={p(0.7, active === 3 ? 0.4 : 0)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
      <circle cx={jx} cy={jy - 14} r="7" className="om-question" />
      <text x={jx} y={jy - 10.5} textAnchor="middle" className="om-question-text">?</text>
    </motion.g>

    {/* linha do tempo */}
    <path d="M232 76H582" className="om-timeline" />
    <motion.path d="M232 76H582" className="om-timeline-on" initial={false} animate={{ pathLength: [0.1, 0.4, 0.7, 1][active] }} transition={p(0.8)} />
    {PAL_STOPS.map((s, k) => <g key={s.year}>
      <motion.circle cx={s.x} cy="76" r="6" className={k === active ? 'om-stop om-stop-on' : k < active ? 'om-stop om-stop-past' : 'om-stop'} initial={false} animate={{ scale: k === active ? 1.25 : 1 }} transition={p(0.4)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
      <text x={s.x} y="97" textAnchor="middle" className={k === active ? 'bi-small bi-strong' : 'bi-tiny'}>{s.year}</text>
    </g>)}
    <text x="232" y="62" className="bi-tiny">linha do tempo sem escala</text>

    <rect x="214" y="106" width="378" height="220" rx="14" className="bi-panel" />
    {/* R1: Balfour */}
    <motion.g {...fade(0)}>
      <g transform="translate(246 142)">
        <path d="M-18 -22h32a4 4 0 0 1 4 4v38h-32a4 4 0 0 1-4-4Z" className="bi-scroll" />
        <path d="M-12 -12h22M-12 -5h22M-12 2h16M-12 9h20" className="bi-scroll-line" />
        <motion.circle cx="10" cy="14" r="6" className="bi-seal" initial={false} animate={{ scale: active === 0 ? [0, 1.25, 1] : 0 }} transition={p(0.5, active === 0 ? 0.5 : 0)} />
      </g>
      <text x="278" y="128" className="bi-panel-title">DECLARAÇÃO BALFOUR · 1917</text>
      <text x="278" y="146" className="bi-small">governo britânico: apoio a um "lar</text>
      <text x="278" y="161" className="bi-small">nacional para o povo judeu"</text>
      {[0, 1, 2].map(k => <motion.g key={`z${k}`} initial={false} animate={{ x: active === 0 ? 0 : 16, opacity: active === 0 ? 1 : 0 }} transition={p(0.7, active === 0 ? 0.5 + k * 0.15 : 0)}>
        <Person x={250 + k * 26} y={196} s={0.62} coat={['bi-coat', 'bi-coat-plain', 'bi-coat-green'][k]} />
      </motion.g>)}
      <path d="M232 205h-10M226 200l-5 5 5 5" className="om-walk" />
      <text x="228" y="242" className="bi-small bi-strong">movimento sionista:</text>
      <text x="228" y="257" className="bi-small">Estado judeu como resposta</text>
      <text x="228" y="272" className="bi-small">à perseguição antissemita</text>
      <text x="228" y="287" className="bi-small">na Europa</text>
      {[0, 1, 2].map(k => <Person key={`a${k}`} x={430 + k * 26} y={196} s={0.62} coat={['bi-coat-plain', 'bi-coat', 'bi-coat-green'][k]} />)}
      <path d="M512 214v-10l8-6 8 6v10ZM518 214v-5h4v5" className="om-house" />
      <path d="M538 214v-8l6-5 6 5v8Z" className="om-house" />
      <text x="424" y="242" className="bi-small bi-strong">população árabe local:</text>
      <text x="424" y="257" className="bi-small">na região havia séculos;</text>
      <text x="424" y="272" className="bi-small">via a imigração como</text>
      <text x="424" y="287" className="bi-small">ameaça à sua presença</text>
      <text x="228" y="306" className="bi-tiny">anos 1930: a imigração cresce após a ascensão do nazismo</text>
      <text x="228" y="318" className="bi-tiny">o mesmo território reivindicado por duas comunidades</text>
    </motion.g>
    {/* R2: partilha */}
    <motion.g {...fade(1)}>
      <text x="228" y="128" className="bi-panel-title">ONU · PLANO DE PARTILHA · 1947</text>
      {[['Estado', 'judeu', ''], ['Estado', 'árabe', ''], ['Jerusalém sob', 'administração', 'internacional']].map(([a, b, c], k) => {
        const x = [228, 334, 440][k];
        const w = k === 2 ? 138 : 98;
        return <motion.g key={a + b} initial={false} animate={{ opacity: active === 1 ? 1 : 0, y: active === 1 ? 0 : 8 }} transition={p(0.4, active === 1 ? 0.2 + k * 0.2 : 0)}>
          <rect x={x} y="138" width={w} height="58" rx="8" className={k === 2 ? 'om-card om-card-ring' : 'om-card'} />
          <text x={x + w / 2} y={c ? 158 : 163} textAnchor="middle" className="bi-small">{a}</text>
          <text x={x + w / 2} y={c ? 172 : 178} textAnchor="middle" className="bi-small">{b}</text>
          {c && <text x={x + w / 2} y="186" textAnchor="middle" className="bi-small">{c}</text>}
        </motion.g>;
      })}
      {[['ACEITO', ['pelas lideranças', 'sionistas'], 228], ['REJEITADO', ['pelos países árabes e', 'pela liderança palestina'], 410]].map(([stamp, lines, x], k) =>
        <motion.g key={stamp as string} initial={false} animate={{ scale: active === 1 ? [1.4, 1] : 1.4, opacity: active === 1 ? 1 : 0 }} transition={p(0.4, active === 1 ? 0.9 + k * 0.35 : 0)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
          <rect x={x as number} y="210" width={k ? 100 : 76} height="22" rx="4" transform={`rotate(-3 ${x as number} 221)`} className="bi-stamp" />
          <text x={(x as number) + (k ? 50 : 38)} y="225" textAnchor="middle" transform={`rotate(-3 ${x as number} 221)`} className="bi-stamp-text">{stamp as string}</text>
          {(lines as string[]).map((line, i) => <text key={line} x={x as number} y={252 + i * 15} className="bi-small">{line}</text>)}
        </motion.g>)}
      <text x="410" y="284" className="bi-tiny">para quem rejeitou, injusto:</text>
      <text x="410" y="296" className="bi-tiny">terra desproporcional à minoria</text>
      <text x="410" y="308" className="bi-tiny">judaica de então</text>
      <text x="228" y="320" className="bi-tiny">o resumo não descreve o traçado: o mapa não o desenha</text>
    </motion.g>
    {/* R3: 1948 e 1967 */}
    <motion.g {...fade(2)}>
      <text x="228" y="128" className="bi-panel-title">1948 · INDEPENDÊNCIA E GUERRA</text>
      <text x="228" y="146" className="bi-small">Israel declara independência;</text>
      <text x="228" y="161" className="bi-small">na 1ª guerra árabe-israelense,</text>
      <text x="228" y="176" className="bi-small">amplia o território sob seu</text>
      <text x="228" y="191" className="bi-small">controle além do plano</text>
      {[0, 1, 2].map(k => <motion.g key={k} initial={false} animate={{ x: active === 2 ? [0, 22] : 0, opacity: active === 2 ? 1 : 0 }} transition={p(1.2, active === 2 ? 0.3 + k * 0.15 : 0)}>
        <Person x={470 + k * 24} y={144} s={0.58} coat={['bi-coat-plain', 'bi-coat', 'bi-coat-green'][k]} />
        <path d={`M${480 + k * 24} 152l7-3v8l-7 2Z`} className="om-bundle" />
      </motion.g>)}
      <text x="454" y="190" className="bi-tiny">centenas de milhares de</text>
      <text x="454" y="202" className="bi-tiny">palestinos deslocados —</text>
      <text x="454" y="214" className="bi-tiny">a Nakba, como os</text>
      <text x="454" y="226" className="bi-tiny">palestinos a chamam</text>
      <path d="M228 236h350" className="om-rule" />
      <text x="228" y="256" className="bi-panel-title">1967 · GUERRA DOS SEIS DIAS</text>
      <rect x="228" y="268" width="20" height="14" fill="url(#om-pal-hatch)" className="om-zone" />
      <text x="256" y="279" className="bi-small">ocupação israelense da Cisjordânia, da</text>
      <text x="256" y="294" className="bi-small">Faixa de Gaza e de Jerusalém Oriental</text>
      <text x="228" y="316" className="bi-tiny">territórios que seguem no centro da disputa</text>
    </motion.g>
    {/* R4: impasses */}
    <motion.g {...fade(3)}>
      {[
        ['Jerusalém', 'capital reivindicada por Israel e pelos palestinos;', 'status final indefinido', <g key="j"><circle r="7" className="om-question" /><text y="3.5" textAnchor="middle" className="om-question-text">?</text></g>],
        ['Assentamentos', 'fragmentam a Cisjordânia; ilegais para a maioria da', 'comunidade internacional; a posição israelense diverge', <g key="s"><rect x="-6" y="-6" width="5" height="5" className="om-settle" /><rect x="1" y="-2" width="5" height="5" className="om-settle" /><rect x="-4" y="2" width="5" height="5" className="om-settle" /></g>],
        ['Gaza', 'governada pelo Hamas desde 2007; bloqueio israelense', 'terrestre, aéreo e marítimo; Egito na fronteira sul', <path key="g" d="M-7 0a7 7 0 1 0 14 0a7 7 0 1 0-14 0" className="om-blockade" />],
        ['Vítimas civis', 'escaladas recentes: vítimas civis e destruição', 'de infraestrutura em ambos os lados', <g key="v"><path d="M-9 6v-7l5-4 5 4v7Z" className="om-house" /><path d="M2 6v-7l5-4 5 4v7Z" className="om-house" /><path d="M-5 -2l1 3-2 2M6 -2l1 3-2 2" className="om-crack" /></g>],
        ['Dois Estados', 'apoio formal de boa parte da comunidade internacional;', 'ceticismo crescente quanto à viabilidade', <g key="d"><path d="M-9 -4h7v9h-7ZM2 -4h7v9h-7Z" className="om-icon-fill" /></g>],
      ].map(([title, a, b, icon], k) => <motion.g key={title as string} initial={false} animate={{ opacity: active === 3 ? 1 : 0, x: active === 3 ? 0 : 8 }} transition={p(0.4, active === 3 ? 0.2 + k * 0.18 : 0)}>
        <g transform={`translate(238 ${124 + k * 41})`}>{icon}</g>
        <text x="258" y={128 + k * 41} className="bi-small bi-strong">{title}</text>
        <text x="258" y={141 + k * 41} className="bi-tiny">{a}</text>
        <text x="258" y={153 + k * 41} className="bi-tiny">{b}</text>
      </motion.g>)}
    </motion.g>
    <text x="30" y="342" className="bi-foot">{active === 3 ? 'Contornos aproximados; pontos de assentamento ilustrativos, sem localização real.' : 'Contornos aproximados, sem escala.'}</text>
  </svg>;
}

// ————————————————————————————————————————————————————————————————
// 4. Conflitos no mundo árabe
// ————————————————————————————————————————————————————————————————
const PW = projector(22, 54, 5, 38.5, 6.3, 6.3);
const AW = coastPaths(PW, true);
const RULER_LINES: LL[][] = [[[25, 31.6], [25, 22]], [[25, 22], [36.9, 22]], [[38.8, 33.4], [40.4, 31.9], [44.7, 29.2]], [[42.3, 37.2], [41.3, 36.5], [41.2, 34.4], [38.8, 33.4]], [[39.3, 32.2], [37, 31.5]]];
const WAVE = [
  { name: 'Tunísia', ll: [9.8, 35.2] as LL, fate: 0 },
  { name: 'Egito', ll: [31.2, 30] as LL, fate: 1 },
  { name: 'Líbia', ll: [15.5, 30.2] as LL, fate: 2 },
  { name: 'Síria', ll: [37.8, 34.8] as LL, fate: 2 },
  { name: 'Iêmen', ll: [45.5, 15.8] as LL, fate: 2 },
];
const FATES = [
  { title: 'Tunísia', lines: ['transição mais', 'estável rumo a', 'instituições', 'democráticas'], x: 24 },
  { title: 'Egito', lines: ['governo eleito', 'derrubado por', 'golpe militar', ''], x: 141 },
  { title: 'Líbia · Iêmen', lines: ['e Síria: colapso', 'da autoridade', 'central, guerras', 'civis longas'], x: 258 },
];
const AW_PANEL = 380;

export function ArabConflicts({ active }: Scene) {
  const p = usePaced();
  const fade = (k: number) => ({ initial: false as const, animate: { opacity: active === k ? 1 : 0 }, transition: p(0.45, active === k ? 0.1 : 0) });
  const [syx, syy] = PW(38.3, 35.1);
  const supporters = [
    { name: 'Rússia', from: [254, 56] as const, side: 'a', label: [248, 64, 'end'] as const },
    { name: 'Irã', from: PW(51.4, 35.7), side: 'a', label: null },
    { name: 'EUA', from: [26, 70] as const, side: 'b', label: [30, 64, 'start'] as const },
    { name: 'Turquia', from: PW(30, 38), side: 'b', label: [172, 64, 'end'] as const },
    { name: 'Golfo', from: PW(50.5, 25.8), side: 'b', label: null },
  ];
  const [ksx, ksy] = PW(46.7, 24.7);
  const [kix, kiy] = PW(51.4, 35.7);
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Conflitos no mundo árabe: a onda de 2010–2011, três desfechos, a guerra síria internacionalizada e as raízes estruturais; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">MUNDO ÁRABE · DESDE 2010</text>
    <defs>
      <clipPath id="om-aw-clip"><rect x="22" y="52" width="346" height="170" rx="12" /></clipPath>
      <pattern id="om-aw-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0v5" className="om-hatch-line" /></pattern>
      <marker id="om-aw-head" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" className="om-route-head" /></marker>
      <marker id="om-aw-head-a" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" className="om-head-a" /></marker>
      <marker id="om-aw-head-b" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" className="om-head-b" /></marker>
    </defs>
    <g clipPath="url(#om-aw-clip)">
      <rect x="22" y="52" width="346" height="170" className="om-land" />
      <path d={AW.seas} className="om-sea" />
      <path d={AW.islands} className="om-land" />
      <path d={AW.borders} className="om-border" />
      <motion.path d={AW.kurds} fill="url(#om-aw-hatch)" className="om-zone" initial={false} animate={{ opacity: active === 2 ? 1 : 0 }} transition={p(0.5, active === 2 ? 0.9 : 0)} />
      {RULER_LINES.map((l, k) => <motion.path key={k} d={trace(PW, l, false)} className="om-ruler-line" initial={false}
        animate={{ pathLength: active === 3 ? 1 : 0, opacity: active === 3 ? 1 : 0 }} transition={p(0.6, active === 3 ? 0.2 + k * 0.2 : 0)} />)}
    </g>
    <rect x="22" y="52" width="346" height="170" rx="12" className="om-frame" />
    {WAVE.map(w => <Place key={w.name} P={PW} ll={w.ll} dy={16} text={w.name} className="om-place om-strong" />)}
    <Place P={PW} ll={[53.5, 31]} text="Irã" className="om-place om-strong" />
    <Place P={PW} ll={[44.8, 21.3]} text="Arábia Saudita" className="om-place om-strong" />
    <Place P={PW} ll={[43.6, 32.6]} text="Iraque" className="om-place om-strong" />

    {/* R1: a onda se espalha */}
    <motion.g {...fade(0)}>
      {WAVE.map((w, k) => {
        const [x, y] = PW(w.ll[0], w.ll[1]);
        return <g key={w.name}>
          <motion.circle cx={x} cy={y} r="9" className="om-pulse" initial={false} animate={{ scale: active === 0 ? [0.3, 1.5, 1] : 0.3, opacity: active === 0 ? [0, 1, 0.8] : 0 }}
            transition={p(0.7, active === 0 ? 0.4 + k * 0.3 : 0)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
          <circle cx={x} cy={y} r="3.5" className="om-origin" />
        </g>;
      })}
      <text x="30" y="246" className="bi-panel-title">2010–2011 · A ONDA SE ESPALHA</text>
      {WAVE.map((w, k) => <motion.g key={w.name} initial={false} animate={{ opacity: active === 0 ? 1 : 0.2 }} transition={p(0.3, active === 0 ? 0.4 + k * 0.3 : 0)}>
        <rect x={30 + k * 67} y="258" width="60" height="22" rx="11" className="om-chip om-chip-hot" />
        <text x={60 + k * 67} y="273" textAnchor="middle" className="om-chip-text">{w.name}</text>
        {k < 4 && <path d={`M${91 + k * 67} 269h5`} className="om-bracket" />}
      </motion.g>)}
      <text x="30" y="304" className="bi-small">protestos populares, de país em país:</text>
      <text x="30" y="319" className="bi-small">os mesmos gatilhos estruturais</text>
    </motion.g>

    {/* R2: três desfechos */}
    <motion.g {...fade(1)}>
      {WAVE.map(w => {
        const [x, y] = PW(w.ll[0], w.ll[1]);
        const card = FATES[w.fate];
        return <g key={w.name}>
          <motion.path d={`M${x} ${y + 4}C${x} ${y + 40} ${card.x + 54} 200 ${card.x + 54} 234`} className={`om-fate om-fate-${w.fate}`} initial={false}
            animate={{ pathLength: active === 1 ? 1 : 0 }} transition={p(0.7, active === 1 ? 0.2 + w.fate * 0.3 : 0)} />
          <circle cx={x} cy={y} r="5" className={`om-fate-dot om-fate-dot-${w.fate}`} />
        </g>;
      })}
      {FATES.map((f, k) => <motion.g key={f.title} initial={false} animate={{ opacity: active === 1 ? 1 : 0, y: active === 1 ? 0 : 8 }} transition={p(0.4, active === 1 ? 0.5 + k * 0.3 : 0)}>
        <rect x={f.x} y="236" width="108" height="88" rx="10" className={`om-card om-fate-card-${k}`} />
        <g transform={`translate(${f.x + 94} 310)`}>
          {k === 0 && <path d="M-9 6h5v-5h5v-5h5v-5" className="om-fate-icon" />}
          {k === 1 && <path d="M-8 6v-8a6 6 0 0 1 12 0v4M1 0l3 4 3-4" className="om-fate-icon" />}
          {k === 2 && <path d="M-6 -6a8 8 0 1 0 12 0M0 -9v7" className="om-fate-icon" />}
        </g>
        <text x={f.x + 8} y="254" className="bi-small bi-strong">{f.title}</text>
        {f.lines.map((line, i) => line && <text key={line} x={f.x + 8} y={270 + i * 12.5} className="bi-tiny">{line}</text>)}
      </motion.g>)}
    </motion.g>

    {/* R3: Síria internacionalizada */}
    <motion.g {...fade(2)}>
      <circle cx={syx} cy={syy} r="12" className="om-ring" />
      {supporters.map((s, k) => {
        const [fx, fy] = s.from;
        return <g key={s.name}>
          <motion.path d={`M${fx} ${fy}Q${(fx + syx) / 2} ${(fy + syy) / 2 - 18} ${syx + (fx > syx ? 9 : -9)} ${syy + (fy > syy ? 6 : -6)}`} className={`om-proxy om-proxy-${s.side}`} markerEnd={`url(#om-aw-head-${s.side})`} initial={false}
            animate={{ pathLength: active === 2 ? 1 : 0 }} transition={p(0.7, active === 2 ? 0.2 + k * 0.2 : 0)} />
          {s.label && <text x={s.label[0]} y={s.label[1]} textAnchor={s.label[2]} className="om-place om-strong om-halo">{s.name}</text>}
        </g>;
      })}
      <Place P={PW} ll={[51, 26.6]} text="Golfo" anchor="start" className="om-place om-strong" />
      <rect x="30" y="237" width="16" height="4" className="om-swatch-a" />
      <text x="52" y="243" className="bi-small bi-strong">Rússia e Irã: apoio ao governo sírio</text>
      <path d="M30 259h16" className="om-proxy om-proxy-b" />
      <text x="52" y="263" className="bi-small bi-strong">EUA, Turquia e países do Golfo:</text>
      <text x="52" y="276" className="bi-tiny">apoio a facções da oposição, em momentos diferentes</text>
      <rect x="30" y="286" width="16" height="12" fill="url(#om-aw-hatch)" className="om-zone" />
      <text x="52" y="296" className="bi-small">curdos buscam autonomia; a Turquia se opõe</text>
      <text x="30" y="318" className="bi-tiny">autodenominado Estado Islâmico: surgiu no vácuo da guerra</text>
    </motion.g>

    {/* R4: raízes estruturais */}
    <motion.g {...fade(3)}>
      <motion.g initial={false} animate={{ x: active === 3 ? [0, 50] : 0 }} transition={p(1.2, active === 3 ? 0.2 : 0)}>
        <g transform="translate(112 196) rotate(-30)">
          <rect x="-34" y="-6" width="68" height="12" rx="2" className="om-ruler" />
          <path d="M-28 -6v5M-20 -6v3M-12 -6v5M-4 -6v3M4 -6v5M12 -6v3M20 -6v5M28 -6v3" className="om-ruler-tick" />
        </g>
      </motion.g>
      {([[48.5, 27.8], [50.4, 25.7], [47, 31]] as const).map(([lon, lat], k) => {
        const [x, y] = PW(lon, lat);
        return <motion.g key={lon} initial={false} animate={{ scale: active === 3 ? 1 : 0 }} transition={p(0.35, active === 3 ? 0.8 + k * 0.12 : 0)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}>
          <path transform={`translate(${x} ${y})`} d="M-5 6l5-14 5 14M-3 0h6M-4 3h8M0 -8v-3" className="om-derrick" />
        </motion.g>;
      })}
      {[PW(45.5, 15.8), [syx, syy] as const].map(([x, y], k) => <g key={x}>
        <motion.path d={`M${ksx} ${ksy}Q${(ksx + x) / 2 - 20} ${(ksy + y) / 2} ${x} ${y}`} className="om-proxy om-proxy-b" initial={false}
          animate={{ pathLength: active === 3 ? 1 : 0 }} transition={p(0.7, active === 3 ? 1.1 + k * 0.2 : 0)} />
        <motion.path d={`M${kix} ${kiy}Q${(kix + x) / 2 + 10} ${(kiy + y) / 2 + 20} ${x} ${y}`} className="om-proxy om-proxy-a" initial={false}
          animate={{ pathLength: active === 3 ? 1 : 0 }} transition={p(0.7, active === 3 ? 1.3 + k * 0.2 : 0)} />
      </g>)}
      <circle cx={ksx} cy={ksy} r="6" className="om-side om-side-b" />
      <circle cx={kix} cy={kiy} r="6" className="om-side om-side-a" />
      {[
        ['fronteiras', 'traçadas por Reino', 'Unido e França após', 'a 1ª Guerra', ''],
        ['petróleo', 'atrai potências', 'ocidentais e, mais', 'recente, Rússia', 'e China'],
        ['Arábia Saudita', '× Irã: rivalidade', 'que intensifica', 'conflitos locais', ''],
      ].map(([title, a, b, c, d], k) => <motion.g key={title} initial={false} animate={{ opacity: active === 3 ? 1 : 0, y: active === 3 ? 0 : 8 }} transition={p(0.4, active === 3 ? 0.4 + k * 0.3 : 0)}>
        <rect x={24 + k * 117} y="236" width="108" height="88" rx="10" className="om-card" />
        <text x={32 + k * 117} y="254" className="bi-small bi-strong">{title}</text>
        {[a, b, c, d].map((line, i) => line && <text key={line} x={32 + k * 117} y={272 + i * 13} className="bi-tiny">{line}</text>)}
      </motion.g>)}
    </motion.g>

    <rect x={AW_PANEL - 6} y="52" width="224" height="274" rx="14" className="bi-panel" />
    <motion.g {...fade(0)}>
      <text x={AW_PANEL + 8} y="78" className="bi-panel-title">GATILHOS COMUNS</text>
      {[
        ['regimes autoritários', 'de longa duração', <path key="h" d="M-7 -10h14M-7 10h14M-5 -10q0 8 5 10q5-2 5-10M-5 10q0-8 5-10q5 2 5 10" className="om-icon-line" />],
        ['corrupção', 'institucional generalizada', <g key="c"><circle r="9" className="om-coin" /><path d="M-4 -6l3 5-3 2 4 5" className="om-crack" /></g>],
        ['desigualdade', 'econômica persistente', <path key="d" d="M-9 9v-4h5v4M-2 9v-10h5v10M5 9v-19h5v19" className="om-icon-fill" />],
        ['desemprego alto entre', 'jovens com boa formação', <g key="j"><path d="M-10 -3l10-5 10 5-10 5Z" className="om-icon-fill" /><path d="M-6 -1v6q6 4 12 0v-6" className="om-icon-line" /></g>],
      ].map(([a, b, icon], k) => <motion.g key={a as string} initial={false} animate={{ opacity: active === 0 ? 1 : 0, x: active === 0 ? 0 : 8 }} transition={p(0.4, active === 0 ? 0.2 + k * 0.2 : 0)}>
        <g transform={`translate(${AW_PANEL + 22} ${108 + k * 48})`}>{icon}</g>
        <text x={AW_PANEL + 44} y={105 + k * 48} className="bi-small bi-strong">{a as string}</text>
        <text x={AW_PANEL + 44} y={119 + k * 48} className="bi-tiny">{b as string}</text>
      </motion.g>)}
      <text x={AW_PANEL + 8} y="306" className="bi-hand-sm">mesmos gatilhos, países</text>
      <text x={AW_PANEL + 8} y="320" className="bi-hand-sm">diferentes</text>
    </motion.g>
    <motion.g {...fade(1)}>
      <text x={AW_PANEL + 8} y="78" className="bi-panel-title">MESMA ONDA, TRÊS FINS</text>
      <motion.path d={`M${AW_PANEL + 106} 96V130`} className="om-fork" initial={false} animate={{ pathLength: active === 1 ? 1 : 0 }} transition={p(0.4, active === 1 ? 0.2 : 0)} />
      {[0, 1, 2].map(k => <motion.path key={k} d={`M${AW_PANEL + 106} 130C${AW_PANEL + 106} 150 ${AW_PANEL + 40 + k * 66} 146 ${AW_PANEL + 40 + k * 66} 172`} className={`om-fork om-fate-${k}`} initial={false}
        animate={{ pathLength: active === 1 ? 1 : 0 }} transition={p(0.5, active === 1 ? 0.5 + k * 0.2 : 0)} />)}
      {['Tunísia', 'Egito', 'guerras'].map((t, k) => <text key={t} x={AW_PANEL + 40 + k * 66} y="188" textAnchor="middle" className="bi-tiny bi-strong">{t}</text>)}
      <text x={AW_PANEL + 8} y="216" className="bi-small">erro comum: achar que os</text>
      <text x={AW_PANEL + 8} y="231" className="bi-small">resultados foram uniformes</text>
      <text x={AW_PANEL + 8} y="256" className="bi-tiny">os desfechos variaram por</text>
      <text x={AW_PANEL + 8} y="268" className="bi-tiny">diferenças estruturais de cada país</text>
      <text x={AW_PANEL + 8} y="310" className="bi-hand-sm">um gatilho, três caminhos</text>
    </motion.g>
    <motion.g {...fade(2)}>
      <text x={AW_PANEL + 8} y="78" className="bi-panel-title">POR QUE SE PROLONGOU</text>
      <path d={`M${AW_PANEL + 106} 176l-10 22h20Z`} className="om-fulcrum" />
      <motion.g initial={false} animate={{ rotate: active === 2 ? [0, -6, 5, -2, 0] : 0 }} transition={p(2, active === 2 ? 0.4 : 0)} style={{ transformBox: 'view-box', transformOrigin: `${AW_PANEL + 106}px 174px` }}>
        <rect x={AW_PANEL + 22} y="170" width="168" height="6" rx="3" className="bi-beam" />
        {[0, 1].map(k => <motion.rect key={`a${k}`} x={AW_PANEL + 28 + k * 22} width="18" height="14" rx="2" className="om-weight-a" initial={false}
          animate={{ y: active === 2 ? [120, 156] : 156, opacity: active === 2 ? 1 : 0 }} transition={p(0.5, active === 2 ? 0.4 + k * 0.6 : 0)} />)}
        {[0, 1].map(k => <motion.rect key={`b${k}`} x={AW_PANEL + 166 - k * 22} width="18" height="14" rx="2" className="om-weight-b" initial={false}
          animate={{ y: active === 2 ? [120, 156] : 156, opacity: active === 2 ? 1 : 0 }} transition={p(0.5, active === 2 ? 0.7 + k * 0.6 : 0)} />)}
      </motion.g>
      <text x={AW_PANEL + 38} y="146" textAnchor="middle" className="bi-tiny bi-strong">governo</text>
      <text x={AW_PANEL + 174} y="146" textAnchor="middle" className="bi-tiny bi-strong">oposição</text>
      <text x={AW_PANEL + 8} y="98" className="bi-tiny">cada potência externa sustenta um</text>
      <text x={AW_PANEL + 8} y="110" className="bi-tiny">lado com armas, dinheiro e diplomacia</text>
      <text x={AW_PANEL + 8} y="224" className="bi-small">nenhum lado alcança vitória</text>
      <text x={AW_PANEL + 8} y="239" className="bi-small">militar decisiva sozinho</text>
      <text x={AW_PANEL + 8} y="262" className="bi-tiny">interesses externos divergentes</text>
      <text x={AW_PANEL + 8} y="274" className="bi-tiny">dificultam um acordo de paz</text>
      <text x={AW_PANEL + 8} y="310" className="bi-hand-sm">apoio dos dois lados prolonga</text>
    </motion.g>
    <motion.g {...fade(3)}>
      <text x={AW_PANEL + 8} y="78" className="bi-panel-title">GUERRA POR PROCURAÇÃO</text>
      <circle cx={AW_PANEL + 38} cy="112" r="14" className="om-side om-side-b" />
      <circle cx={AW_PANEL + 174} cy="112" r="14" className="om-side om-side-a" />
      <text x={AW_PANEL + 38} y="142" textAnchor="middle" className="bi-tiny bi-strong">Arábia Saudita</text>
      <text x={AW_PANEL + 38} y="154" textAnchor="middle" className="bi-tiny">predom. sunita</text>
      <text x={AW_PANEL + 174} y="142" textAnchor="middle" className="bi-tiny bi-strong">Irã</text>
      <text x={AW_PANEL + 174} y="154" textAnchor="middle" className="bi-tiny">predom. xiita</text>
      <path d={`M${AW_PANEL + 58} 112H${AW_PANEL + 154}`} className="om-rival" />
      <motion.path d={`M${AW_PANEL + 98} 104l16 16M${AW_PANEL + 114} 104l-16 16`} className="om-crack" initial={false} animate={{ pathLength: active === 3 ? 1 : 0 }} transition={p(0.4, active === 3 ? 0.4 : 0)} />
      <text x={AW_PANEL + 106} y="98" textAnchor="middle" className="bi-tiny">confronto direto</text>
      <rect x={AW_PANEL + 60} y="184" width="92" height="30" rx="8" className="om-card" />
      <text x={AW_PANEL + 106} y="203" textAnchor="middle" className="bi-small bi-strong">Iêmen</text>
      <motion.path d={`M${AW_PANEL + 38} 160V199H${AW_PANEL + 58}`} className="om-proxy om-proxy-b" initial={false} animate={{ pathLength: active === 3 ? 1 : 0 }} transition={p(0.6, active === 3 ? 0.7 : 0)} />
      <motion.path d={`M${AW_PANEL + 174} 160V199H${AW_PANEL + 154}`} className="om-proxy om-proxy-a" initial={false} animate={{ pathLength: active === 3 ? 1 : 0 }} transition={p(0.6, active === 3 ? 0.9 : 0)} />
      <text x={AW_PANEL + 8} y="232" className="bi-tiny">Arábia Saudita: governo reconhecido</text>
      <text x={AW_PANEL + 8} y="244" className="bi-tiny">Irã: movimento houthi opositor</text>
      <text x={AW_PANEL + 8} y="266" className="bi-small">evitam o custo e o risco de</text>
      <text x={AW_PANEL + 8} y="281" className="bi-small">escalada do confronto direto</text>
      <text x={AW_PANEL + 8} y="310" className="bi-hand-sm">não é só sunita × xiita</text>
    </motion.g>
    <text x="30" y="342" className="bi-foot">Mapa esquemático: contornos simplificados, posições aproximadas, sem escala.</text>
  </svg>;
}

export const SCENES_LOTE12: Record<string, React.ComponentType<Scene>> = {
  'summary-geografia-geopolitica-e-geoeconomia-da-asia': AsiaAscent,
  'summary-geografia-geografia-do-oriente-medio': MiddleEastMap,
  'summary-geografia-questao-palestina': PalestineTimeline,
  'summary-geografia-conflitos-no-mundo-arabe': ArabConflicts,
};
export const HEADERS_LOTE12: Record<string, string> = {
  'summary-geografia-geopolitica-e-geoeconomia-da-asia': 'geoeconomia regional',
  'summary-geografia-geografia-do-oriente-medio': 'posição, povos e água',
  'summary-geografia-questao-palestina': 'território e tempo',
  'summary-geografia-conflitos-no-mundo-arabe': 'desfechos e atores',
};
