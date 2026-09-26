import React from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import { ArrowHead, Person, type Scene } from './cenaKit';
import './Populacao.css';

function usePaced() {
  const t = useSceneMotion();
  return (duration: number, delay = 0) => (t.duration === 0 ? t : { ...t, duration, delay });
}

// Lote 5 da régua de História e Geografia: população e cidade. Cada cena
// desenha o mecanismo que o capítulo explica — as duas taxas que se
// descolam na transição, a mão de obra que muda de setor, a cidade que
// serve às de baixo, a desigualdade distribuída no espaço, as forças que
// empurram e puxam quem migra, a vocação de cada modal. Números e nomes
// saem do resumo do capítulo; curvas, bonecos e pilhas são esquema, e a
// prancha diz isso no rodapé.

const smooth01 = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

// ---------------------------------------------------------------------------
// Dinâmica demográfica: as curvas se revelam até a fase do recorte, e a
// faixa entre elas — o crescimento vegetativo — é o que a pirâmide ao lado
// traduz em forma. A explosão da fase 2 aparece como a faixa que abre
// quando só a mortalidade cai.
const PHASE_X = [40, 122, 205, 288, 370];
const natality = (x: number) => (x <= 205 ? 92 + 3 * Math.sin(x / 9) : x <= 288 ? 92 + smooth01((x - 205) / 83) * 98 : 190 + smooth01((x - 288) / 60) * 8);
const mortality = (x: number) => (x <= 122 ? 100 + 6 * Math.sin(x / 7) : x <= 205 ? 100 + 6 * Math.sin(122 / 7) * (1 - smooth01((x - 122) / 20)) + smooth01((x - 122) / 83) * 76 : x <= 288 ? 176 + smooth01((x - 205) / 83) * 20 : 196 + smooth01((x - 288) / 60) * 6);
const XS = Array.from({ length: 67 }, (_, k) => 40 + k * 5);
const line = (f: (x: number) => number, xs: number[]) => xs.map(x => `${x} ${f(x).toFixed(1)}`).join('L');
const NAT_PATH = `M${line(natality, XS)}`;
const MORT_PATH = `M${line(mortality, XS)}`;
const GAP_PATH = `M${line(natality, XS)}L${line(mortality, [...XS].reverse())}Z`;

// Meia largura de cada faixa etária, da base (crianças) ao topo (idosos).
const PYRAMIDS = [
  [70, 58, 47, 37, 28, 20, 13, 7],
  [78, 67, 55, 44, 33, 23, 14, 8],
  [50, 54, 54, 50, 42, 32, 21, 11],
  [36, 40, 45, 48, 46, 40, 30, 18],
];

// Ícones de causa por fase; a fase 4 troca ícones pelos números de
// fecundidade que o resumo dá.
const ICONS: { label: string; draw: React.ReactNode }[][] = [
  [
    { label: 'natalidade alta', draw: <g><path d="M-2 -4v-12a12 12 0 0 1 12 12Z" className="po-hood" /><path d="M-14 -4h26q0 12-13 12t-13-12ZM-14 -4l-3-7h-4" className="bi-icon" /><circle cx="-7" cy="12" r="3" className="po-wheel" /><circle cx="6" cy="12" r="3" className="po-wheel" /></g> },
    { label: 'mortalidade alta', draw: <g><path d="M-12 14h24M-8 14v-18a8 8 0 0 1 16 0v18M0 -6v10M-4 -2h8" className="bi-icon" /></g> },
  ],
  [
    { label: 'saneamento', draw: <g><path d="M-14 -8h14a6 6 0 0 1 6 6v4M-8 -8v-5M-12 -13h8" className="bi-icon" /><path d="M6 6q-3 4 0 7q3-3 0-7Z" className="po-drop" /></g> },
    { label: 'vacinação', draw: <g transform="rotate(-35)"><rect x="-10" y="-4" width="16" height="8" rx="1.5" className="po-syringe" /><path d="M-10 0h-6M-16 -4v8M6 0h10M-6 -4v3M-2 -4v3M2 -4v3" className="bi-icon" /></g> },
    { label: 'medicina', draw: <path d="M-4 -12h8v8h8v8h-8v8h-8v-8h-8v-8h8Z" className="po-cross" /> },
  ],
  [
    { label: 'urbanização', draw: <path d="M-14 12V-6h10v18M-4 12V-14h12v26M8 12V0h8v12M-18 12h36" className="bi-icon" /> },
    { label: 'trabalho', draw: <path d="M-13 -4h26v16h-26ZM-5 -4v-5h10v5M-13 3h26" className="bi-icon" /> },
    { label: 'contracepção', draw: <g><rect x="-13" y="-8" width="26" height="18" rx="4" className="po-pill-card" />{[-7, 0, 7].map(x => <circle key={x} cx={x} cy="-2" r="2.4" className="po-pill-dot" />)}{[-7, 0, 7].map(x => <circle key={`b${x}`} cx={x} cy="5" r="2.4" className="po-pill-dot" />)}</g> },
  ],
  [],
];

export function DemographicTransition({ active }: Scene) {
  const p = usePaced();
  const cx = 500;
  const shape = [
    ['base larga, topo estreito', 'natalidade alta: população jovem'],
    ['triangular', 'hoje, partes da África Subsaariana'],
    ['barril', 'a base se estreita'],
    ['urna', 'mais adultos que jovens'],
  ][active];
  const note = [
    ['altas e equilibradas', 'crescimento lento, típico de', 'sociedades pré-industriais'],
    ['a mortalidade cai primeiro', 'saneamento, vacinação e medicina: explosão', 'demográfica (Europa séc. XIX; Brasil 1940–1970)'],
    ['a natalidade também cai', 'urbanização, mulher no mercado de trabalho,', 'contraceptivos, custo de criar filhos na cidade'],
    ['as duas baixas e estáveis', 'crescimento vegetativo perto de zero', 'ou negativo: Europa hoje e, cada vez mais, o Brasil'],
  ][active];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Transição demográfica em quatro fases: curvas de natalidade e mortalidade e a pirâmide etária que muda de forma; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">TRANSIÇÃO DEMOGRÁFICA</text>
    <defs><clipPath id="po-dd-reveal">
      <motion.rect x="34" y="60" height="190" initial={false} animate={{ width: PHASE_X[active + 1] - 32 }} transition={p(1.1)} />
    </clipPath></defs>

    <path d="M44 60h16" className="po-nat" /><text x="64" y="64" className="bi-tiny">natalidade</text>
    <path d="M128 60h16" className="po-mort" /><text x="148" y="64" className="bi-tiny">mortalidade</text>
    <rect x="222" y="54" width="14" height="10" rx="2" className="po-gap" /><text x="240" y="64" className="bi-tiny">crescimento vegetativo</text>

    {PHASE_X.slice(0, 4).map((x, k) => <g key={x}>
      <motion.rect x={x + 1} y="72" width={PHASE_X[k + 1] - x - 2} height="166" rx="6" className="po-band" initial={false}
        animate={{ opacity: k === active ? 1 : 0.25 }} transition={p(0.4)} />
      <text x={(x + PHASE_X[k + 1]) / 2} y="256" textAnchor="middle" className={k === active ? 'bi-small bi-strong po-on' : 'bi-tiny'}>fase {k + 1}</text>
    </g>)}
    <path d="M40 70V240H370" className="bi-axis" />
    <g clipPath="url(#po-dd-reveal)">
      <path d={GAP_PATH} className="po-gap" />
      <path d={NAT_PATH} className="po-nat" />
      <path d={MORT_PATH} className="po-mort" />
    </g>
    <motion.text x="186" y="126" textAnchor="middle" className="bi-hand-sm" initial={false} animate={{ opacity: active >= 1 ? 1 : 0 }} transition={p(0.4, 0.9)}>explosão</motion.text>

    <path d="M414 240V92" className="bi-axis" markerEnd="url(#po-head-age)" />
    <ArrowHead id="po-head-age" />
    <text x="414" y="80" textAnchor="middle" className="bi-tiny">idade</text>
    <text x={cx - 40} y="80" textAnchor="middle" className="bi-tiny">homens</text>
    <text x={cx + 40} y="80" textAnchor="middle" className="bi-tiny">mulheres</text>
    {PYRAMIDS[active].map((w, k) => {
      const y = 222 - k * 19;
      return <g key={k}>
        <motion.rect y={y} height="16" rx="2" className="po-male" initial={false} animate={{ x: cx - 1 - w, width: w }} transition={p(0.9, 0.05 * k)} />
        <motion.rect x={cx + 1} y={y} height="16" rx="2" className="po-female" initial={false} animate={{ width: w }} transition={p(0.9, 0.05 * k)} />
      </g>;
    })}
    <path d={`M${cx} 86V240`} className="po-midline" />
    <text x={cx} y="258" textAnchor="middle" className="bi-label bi-on">{shape[0]}</text>
    <text x={cx} y="274" textAnchor="middle" className="bi-tiny">{shape[1]}</text>

    <motion.g key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={p(0.5, 0.5)}>
      <text x="30" y="298" className="bi-hand">{note[0]}</text>
      <text x="30" y="318" className="bi-small">{note[1]}</text>
      <text x="30" y="333" className="bi-small">{note[2]}</text>
      {ICONS[active].map((ic, k) => {
        const x = ICONS[active].length === 2 ? 452 + k * 100 : 436 + k * 64;
        return <g key={ic.label}>
          <g transform={`translate(${x} 312)`}>{ic.draw}</g>
          <text x={x} y="342" textAnchor="middle" className="bi-tiny">{ic.label}</text>
        </g>;
      })}
      {active === 3 && <g>
        <rect x="462" y="298" width="22" height="34" rx="2" className="po-male" />
        <rect x="502" y="323" width="22" height="9" rx="2" className="po-female" />
        <path d="M454 320.5H532" className="po-replace" />
        <text x="473" y="294" textAnchor="middle" className="bi-tiny bi-strong">6,3</text>
        <text x="513" y="314" textAnchor="middle" className="bi-tiny bi-strong">&lt;1,7</text>
        <text x="538" y="298" className="bi-tiny bi-strong">filhos por</text>
        <text x="538" y="309" className="bi-tiny bi-strong">mulher</text>
        <text x="538" y="324" className="bi-tiny">reposição</text>
        <text x="538" y="335" className="bi-tiny bi-strong">2,1</text>
        <text x="473" y="344" textAnchor="middle" className="bi-tiny">1960</text>
        <text x="513" y="344" textAnchor="middle" className="bi-tiny">hoje</text>
      </g>}
    </motion.g>
    <text x="590" y="40" textAnchor="end" className="bi-tiny">curvas e pirâmides esquemáticas, sem escala</text>
  </svg>;
}

// ---------------------------------------------------------------------------
// Setores da economia: os mesmos doze trabalhadores mudam de setor conforme
// o recorte. Quem se move é a mão de obra, não o desenho do setor — é isso
// que a palavra "terciarização" descreve.
const SECTORS = [
  { x: 110, title: 'Primário', lines: ['agricultura, pecuária,', 'mineração e pesca'] },
  { x: 310, title: 'Secundário', lines: ['indústria de transformação,', 'construção civil'] },
  { x: 510, title: 'Terciário', lines: ['comércio, educação, saúde,', 'finanças, transporte'] },
];
const SPLIT = [[7, 3, 2], [3, 6, 3], [2, 3, 7]];
const COATS = ['bi-coat', 'bi-coat-green', 'bi-coat-plain', 'bi-coat-army', 'bi-coat-royal', 'po-coat-rose'];

function workerSpot(split: number[], i: number) {
  const sector = i < split[0] ? 0 : i < split[0] + split[1] ? 1 : 2;
  const rank = i - (sector === 0 ? 0 : sector === 1 ? split[0] : split[0] + split[1]);
  const row = Math.floor(rank / 4);
  const inRow = Math.min(4, split[sector] - row * 4);
  const col = rank % 4;
  return { x: SECTORS[sector].x + (col - (inRow - 1) / 2) * 32, y: 202 + row * 36 };
}

export function LaborSectors({ active }: Scene) {
  const p = usePaced();
  const split = SPLIT[active];
  const note = [
    ['países pobres: mão de obra no primário', 'o grau inicial da trajetória', ''],
    ['países industrializados: no secundário', 'durante a fase de industrialização', ''],
    ['economias maduras terciarizam', 'serviços: a maior fatia do emprego e do PIB', 'Brasil: mais de 70% no terciário — desindustrialização precoce'],
  ][active];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Setores da economia: a mão de obra passa do primário ao secundário e ao terciário ao longo do desenvolvimento; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">SETORES DA ECONOMIA · TERCIARIZAÇÃO</text>
    <ArrowHead id="po-head-sector" />
    {[0, 1].map(k => <motion.path key={k} d={k === 0 ? 'M162 78Q210 56 258 78' : 'M362 78Q410 56 458 78'} className="bi-arrow" markerEnd="url(#po-head-sector)"
      initial={false} animate={{ pathLength: active > k ? 1 : 0, opacity: active > k ? 1 : 0 }} transition={p(0.8, 0.2)} />)}

    {SECTORS.map((s, k) => <g key={s.title}>
      <motion.circle cx={s.x} cy="94" r="42" className="po-halo" initial={false} animate={{ opacity: k === active ? 1 : 0, scale: k === active ? 1 : 0.7 }} transition={p(0.6)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
      <path d={`M${s.x - 48} 132h96`} className="bi-ground" />
    </g>)}

    <g transform="translate(110 132)">
      <circle cx="30" cy="-44" r="9" className="po-sun" />
      {[-30, -14, 2].map(dx => <g key={dx} transform={`translate(${dx} 0)`}>
        <path d="M0 0V-36" className="po-stalk" />
        {[-30, -22, -14].map(dy => <path key={dy} d={`M0 ${dy}l-6-6M0 ${dy}l6-6`} className="po-stalk" />)}
      </g>)}
      <path d="M20 0l14-24M26 -28q10 2 14 10" className="bi-icon" />
      <path d="M22 -8q8 -8 16 0q-8 8-16 0ZM38 -8l6-5v10Z" className="po-fish" />
    </g>
    <g transform="translate(310 132)">
      <path d="M-42 0v-30l16-10v10l16-10v10l16-10v30Z" className="po-bld" />
      <path d="M10 0v-58h12V0" className="po-bld" />
      {[-34, -18, -2].map(x => <rect key={x} x={x} y="-20" width="8" height="8" className="po-window" />)}
      <path d="M26 0h16v-20h-16" className="po-bld" />
      {[0, 1, 2].map(k => <motion.circle key={k} cx={16 + k * 4} cy={-66 - k * 8} r={5 + k * 2} className="po-smoke" initial={false}
        animate={{ opacity: active === 1 ? 0.9 : 0.3, y: active === 1 ? [4, -2, 0] : 0 }} transition={p(1.2, 0.2 * k)} />)}
    </g>
    <g transform="translate(510 132)">
      <path d="M-44 0v-30h38v30Z" className="po-bld" />
      <path d="M-48 -30l4-10h38l4 10Z" className="po-awning" />
      <path d="M-38 -40l-2 10M-28 -40v10M-18 -40l2 10" className="po-awning-stripe" />
      <path d="M-36 0v-18h12v18" className="po-window" />
      <path d="M2 0v-50h40v50Z" className="po-bld" />
      <path d="M18 -42h8v6h6v8h-6v6h-8v-6h-6v-8h6Z" className="po-cross" />
      <rect x="10" y="-14" width="8" height="8" className="po-window" /><rect x="26" y="-14" width="8" height="8" className="po-window" />
    </g>

    {SECTORS.map((s, k) => <g key={`t-${s.title}`}>
      <text x={s.x} y="152" textAnchor="middle" className={k === active ? 'bi-label bi-on' : 'bi-label'}>{s.title}</text>
      {s.lines.map((l, j) => <text key={l} x={s.x} y={166 + j * 12} textAnchor="middle" className="bi-tiny">{l}</text>)}
    </g>)}

    {Array.from({ length: 12 }, (_, i) => {
      const spot = workerSpot(split, i);
      return <motion.g key={i} initial={false} animate={{ x: spot.x, y: spot.y }} transition={p(1.1, 0.04 * i)}>
        <Person x={0} y={0} s={0.7} coat={COATS[i % COATS.length]} />
      </motion.g>;
    })}

    <motion.g key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={p(0.5, 0.6)}>
      <text x="30" y="290" className="bi-hand">{note[0]}</text>
      <text x="30" y="308" className="bi-small">{note[1]}</text>
      {note[2] && <text x="30" y="323" className="bi-small bi-strong">{note[2]}</text>}
    </motion.g>
    <text x="590" y="344" textAnchor="end" className="bi-foot">Bonecos mostram a tendência, não proporções medidas.</text>
  </svg>;
}

// ---------------------------------------------------------------------------
// Hierarquia urbana: a rede é uma árvore em que cada cidade serve às de
// baixo. No recorte, o nível em foco acende e os fluxos sobem até ele — o
// alcance da influência é o que define o degrau, não o tamanho do desenho.
type Node = { x: number; parent?: number };
const LEVELS: { y: number; h: number; nodes: Node[] }[] = [
  { y: 286, h: 17, nodes: [50, 100, 142, 188, 232, 278, 322, 368].map((x, k) => ({ x, parent: Math.floor(k / 2) })) },
  { y: 236, h: 26, nodes: [75, 165, 255, 345].map((x, k) => ({ x, parent: Math.floor(k / 2) })) },
  { y: 180, h: 36, nodes: [120, 300].map(x => ({ x, parent: 0 })) },
  { y: 116, h: 56, nodes: [{ x: 210 }] },
];
const LEVEL_TEXT = [
  { title: 'Centros locais', lines: ['serviços básicos para', 'a própria população'] },
  { title: 'Centros sub-regionais', lines: ['serviços intermediários', 'a cidades menores ao redor'] },
  { title: 'Metrópoles regionais', lines: ['BH, Porto Alegre, Salvador,', 'Recife, Curitiba: serviços', 'da macrorregião'] },
  { title: 'Metrópole nacional', lines: ['São Paulo e Rio: todo o', 'território e a economia global'] },
];
const LABEL_Y = [274, 220, 144, 86];
const GUIDE_X = [384, 362, 336, 340];

function Skyline({ level }: { level: number }) {
  if (level === 0) return <g><path d="M-9 0v-11l9-7 9 7v11Z" className="po-bld" /><rect x="-3" y="-8" width="6" height="8" className="po-window" /></g>;
  if (level === 1) return <g><path d="M-18 0v-10l7-6 7 6v10Z" className="po-bld" /><rect x="-4" y="-26" width="12" height="26" className="po-bld" /><path d="M8 0v-14h10v14Z" className="po-bld" /><path d="M0 -20h4M0 -13h4" className="po-window-line" /></g>;
  if (level === 2) return <g><rect x="-20" y="-26" width="11" height="26" className="po-bld" /><rect x="-7" y="-36" width="14" height="36" className="po-bld po-bld-mid" /><rect x="9" y="-22" width="11" height="22" className="po-bld" /><path d="M-3 -30h6M-3 -23h6M-3 -16h6M-16 -20h4M-16 -12h4M12 -16h4M12 -8h4" className="po-window-line" /></g>;
  return <g>
    <rect x="-26" y="-40" width="12" height="40" className="po-bld" />
    <rect x="-12" y="-56" width="15" height="56" className="po-bld po-bld-top" />
    <path d="M-4.5 -56v-8" className="bi-icon" />
    <rect x="5" y="-46" width="13" height="46" className="po-bld po-bld-mid" />
    <rect x="20" y="-28" width="9" height="28" className="po-bld" />
    <path d="M-8 -48h8M-8 -40h8M-8 -32h8M-8 -24h8M-22 -32h5M-22 -22h5M9 -38h6M9 -28h6M9 -18h6" className="po-window-line" />
  </g>;
}

const bez = (a: [number, number], b: [number, number], t: number): [number, number] => {
  const c1: [number, number] = [a[0], a[1] + 20];
  const c2: [number, number] = [b[0], b[1] - 20];
  const u = 1 - t;
  return [0, 1].map(i => u * u * u * a[i] + 3 * u * u * t * c1[i] + 3 * u * t * t * c2[i] + t * t * t * b[i]) as [number, number];
};

export function UrbanHierarchy({ active }: Scene) {
  const p = usePaced();
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Hierarquia urbana brasileira: centros locais, centros sub-regionais, metrópoles regionais e metrópole nacional, com os fluxos subindo ao nível em foco; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">HIERARQUIA URBANA · BRASIL</text>
    <text x="590" y="40" textAnchor="end" className="bi-tiny">esquema, sem escala</text>

    {LEVELS.slice(0, 3).map((lv, li) => lv.nodes.map((n, k) => {
      const parent = LEVELS[li + 1].nodes[n.parent!];
      const from: [number, number] = [parent.x, LEVELS[li + 1].y];
      const to: [number, number] = [n.x, lv.y - lv.h - 3];
      const on = active === li + 1;
      return <g key={`e-${li}-${k}`}>
        <path d={`M${from[0]} ${from[1]}C${from[0]} ${from[1] + 20} ${to[0]} ${to[1] - 20} ${to[0]} ${to[1]}`} className={on ? 'po-edge po-edge-on' : 'po-edge'} />
        {on && <motion.circle r="3.5" className="po-flow" initial={{ cx: to[0], cy: to[1], opacity: 0 }}
          animate={{ cx: [to[0], bez(from, to, 0.5)[0], from[0]], cy: [to[1], bez(from, to, 0.5)[1], from[1]], opacity: [0, 1, 1, 0] }}
          transition={p(1.4, 0.3 + 0.1 * k)} />}
      </g>;
    }))}

    <g transform="translate(290 80)">
      <motion.g initial={false} animate={{ opacity: active === 3 ? 1 : 0.45 }} transition={p(0.4)}>
        <circle r="13" className="po-globe" />
        <path d="M-13 0h26M0 -13v26M-9 -9q9 9 0 18M9 -9q-9 9 0 18M-12 -6h24M-12 6h24" className="po-globe-line" />
      </motion.g>
      <motion.path d="M13 -4C40 -20 70 -16 96 -26M13 4C44 8 70 0 96 6" className="po-link" initial={false}
        animate={{ pathLength: active === 3 ? 1 : 0, opacity: active === 3 ? 1 : 0 }} transition={p(0.9, 0.3)} />
      {[[96, -26], [96, 6]].map(([x, y]) => <motion.circle key={y} cx={x} cy={y} r="3.5" className="po-flow po-flow-global" initial={false}
        animate={{ opacity: active === 3 ? 1 : 0 }} transition={p(0.3, 1.1)} />)}
      <text x="0" y="26" textAnchor="middle" className="bi-tiny">economia global</text>
    </g>
    <text x="178" y="84" textAnchor="end" className="bi-tiny bi-strong">São Paulo</text>
    <text x="178" y="97" textAnchor="end" className="bi-tiny bi-strong">Rio de Janeiro</text>

    {LEVELS.map((lv, li) => lv.nodes.map((n, k) => <g key={`n-${li}-${k}`}>
      <motion.ellipse cx={n.x} cy={lv.y + 1} rx={12 + li * 7} ry={4 + li * 1.5} className="po-halo" initial={false}
        animate={{ opacity: active === li ? 1 : 0, scale: active === li ? [0.6, 1.25, 1] : 0.6 }} transition={p(0.8, 0.1 * k)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
      <motion.g initial={false} animate={{ y: active === li ? -3 : 0 }} transition={p(0.5)}>
        <g transform={`translate(${n.x} ${lv.y})`} className={active === li ? 'po-lit' : undefined}><Skyline level={li} /></g>
      </motion.g>
    </g>))}
    {active === 0 && LEVELS[0].nodes.map((n, k) => <motion.circle key={`own-${k}`} r="2.5" className="po-flow" initial={{ cx: n.x + (k % 2 ? 16 : -16), cy: 296, opacity: 0 }}
      animate={{ cx: n.x, cy: 282, opacity: [0, 1, 0] }} transition={p(1.1, 0.3 + 0.08 * k)} />)}

    <rect x="404" y="58" width="190" height="256" rx="14" className="bi-panel" />
    {LEVEL_TEXT.map((t, li) => <g key={t.title}>
      <path d={`M${GUIDE_X[li]} ${LEVELS[li].y - 4}L394 ${LABEL_Y[li] - 4}H404`} className="po-guide" />
      <text x="416" y={LABEL_Y[li]} className={active === li ? 'bi-label bi-on' : 'bi-small bi-strong'}>{t.title}</text>
      <motion.g initial={false} animate={{ opacity: active === li ? 1 : 0 }} transition={p(0.4, 0.3)}>
        {t.lines.map((l, j) => <text key={l} x="416" y={LABEL_Y[li] + 15 + j * 13} className="bi-tiny">{l}</text>)}
      </motion.g>
    </g>)}

    <text x="30" y="336" className="bi-hand-sm">a hierarquia não é fixa: cidades do agronegócio ganharam funções de centro regional</text>
  </svg>;
}

// ---------------------------------------------------------------------------
// Segregação socioespacial: um corte da cidade, da encosta na periferia às
// torres do centro. A rede de água sob o chão para antes da periferia; é a
// mesma infraestrutura que falta à escola, ao emprego e à segurança.
export function UrbanSegregation({ active }: Scene) {
  const p = usePaced();
  const claims = [
    [['renda mais baixa', 'periferias e áreas degradadas,', 'infraestrutura deficiente'], ['renda mais alta', 'melhor infraestrutura,', 'serviços e segurança']],
    [['longe do emprego', 'distância física e tempo', 'de deslocamento'], ['escolas melhor equipadas', 'onde a arrecadação local', 'é maior']],
    [['mais exposição à violência', 'maior vulnerabilidade social,', 'menos serviços públicos'], ['presença de serviços', 'públicos e iluminação', '']],
  ][active];
  const hand = ['cada renda ocupa um pedaço da cidade', 'espoliação urbana: o mais pobre paga em tempo e custo', 'onde o serviço público falta, a vulnerabilidade cresce'][active];
  const shacks = [[76, 181, 'po-shack-a'], [108, 193, 'po-shack-b'], [136, 212, 'po-shack-c'], [162, 236, 'po-shack-a'], [186, 258, 'po-shack-b']] as const;
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Segregação socioespacial em corte: periferia na encosta e centro com infraestrutura; emprego, educação e violência dependem do lugar; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">SEGREGAÇÃO SOCIOESPACIAL</text>
    <text x="590" y="40" textAnchor="end" className="bi-tiny">corte esquemático</text>

    <motion.g key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.5, 0.2)}>
      {claims.map((c, side) => <g key={side}>
        {c.map((l, j) => l && <text key={l} x={side === 0 ? 30 : 590} y={66 + j * 15} textAnchor={side === 0 ? 'start' : 'end'}
          className={j === 0 ? (side === 0 ? 'bi-label po-warm' : 'bi-label po-cool') : 'bi-small'}>{l}</text>)}
      </g>)}
    </motion.g>

    <path d="M20 272H600V308H20Z" className="po-soil" />
    <path d="M20 272V186C60 170 104 176 150 214C174 234 196 258 214 272Z" className="po-hill" />
    <path d="M214 272Q235 292 256 272Z" className="po-water" />
    <path d="M256 264H396V272H256Z" className="po-road" />
    <path d="M262 268H392" className="po-road-dash" />

    <g transform="translate(44 181)">
      <path d="M-12 0v-16l12-8 12 8v16Z" className={active === 1 ? 'po-school po-school-on' : 'po-school'} />
      <path d="M0 -24v-10l8 3-8 3" className="po-flag" />
      <path d="M-3 0v-7h6v7" className="po-door" />
      <text x="0" y="16" textAnchor="middle" className="bi-tiny">escola</text>
    </g>
    {shacks.map(([x, y, c]) => <g key={x} transform={`translate(${x} ${y})`}>
      <path d="M-11 0v-14h22v14Z" className={c} />
      <path d="M-13 -13l13-6 13 6" className="po-roof" />
      <rect x="-3" y="-8" width="6" height="8" className="po-door" />
    </g>)}

    {[[420, 30, 100], [456, 36, 140], [498, 30, 118], [534, 40, 150], [580, 22, 84]].map(([x, w, h], k) => <g key={x}>
      <rect x={x} y={272 - h} width={w} height={h} className={k % 2 ? 'po-tower po-tower-b' : 'po-tower'} />
      {Array.from({ length: Math.floor((h - 14) / 14) }, (_, r) => <path key={r} d={`M${x + 6} ${272 - h + 12 + r * 14}h${w - 12}`} className="po-tower-win" />)}
    </g>)}
    <g transform="translate(546 132)"><rect x="-10" y="-10" width="20" height="20" rx="4" className="po-badge" /><path d="M-2 -6h4v4h4v4h-4v4h-4v-4h-4v-4h4Z" className="po-badge-cross" /></g>
    <g transform="translate(404 272)">
      <path d="M-14 0v-22l14-10 14 10v22Z" className={active === 1 ? 'po-school po-school-on' : 'po-school'} />
      <path d="M0 -32v-12l10 4-10 4" className="po-flag" />
      <path d="M-6 0v-10h12v10" className="po-door" />
    </g>
    {[430, 596].map(x => <g key={x}>
      <path d={`M${x} 272v-44q0-6 7-6`} className="po-lamp-post" />
      <motion.circle cx={x + 8} cy="224" r="4" className="po-lamp" initial={false} animate={{ opacity: active === 2 ? 1 : 0.7, scale: active === 2 ? [1, 1.6, 1.2] : 1 }} transition={p(0.8, 0.3)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
    </g>)}
    <g transform="translate(118 272)"><path d="M0 0v-40q0-6 7-6" className="po-lamp-post" /><circle cx="8" cy="-42" r="4" className="po-lamp-off" /><path d="M5 -45l6 6" className="po-lamp-broken" /></g>

    <path d="M20 290H596" className="po-pipe-ghost" />
    <motion.path d="M596 290H258" className="po-pipe" initial={false} animate={{ pathLength: active === 0 ? [0, 1] : 1 }} transition={p(1.2, 0.3)} />
    <text x="590" y="304" textAnchor="end" className="bi-tiny">rede de água e esgoto</text>
    <text x="30" y="304" className="bi-tiny">na periferia a rede não chega</text>

    <motion.g initial={false} animate={{ opacity: active === 0 ? 1 : 0 }} transition={p(0.4)}>
      <text x="324" y="162" textAnchor="middle" className="bi-hand-sm">concentrados no centro</text>
      {[
        { x: 258, label: 'infraestrutura', draw: <path d="M0 -8q-6 8-6 12a6 6 0 0 0 12 0q0-4-6-12Z" className="po-drop" /> },
        { x: 330, label: 'serviços', draw: <path d="M-3 -8h6v5h5v6h-5v5h-6v-5h-5v-6h5Z" className="po-badge-cross" /> },
        { x: 390, label: 'segurança', draw: <path d="M0 -9l8 3v5q0 7-8 10q-8-3-8-10v-5ZM-3 0l2 3 4-5" className="po-shield" /> },
      ].map((b, k) => <motion.g key={b.label} initial={false} animate={{ scale: active === 0 ? [0.4, 1.15, 1] : 0.4 }} transition={p(0.6, 0.4 + 0.15 * k)}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <circle cx={b.x} cy="192" r="15" className="po-badge" />
        <g transform={`translate(${b.x} 192)`}>{b.draw}</g>
        <text x={b.x} y="220" textAnchor="middle" className="bi-tiny">{b.label}</text>
      </motion.g>)}
    </motion.g>
    <motion.g initial={false} animate={{ opacity: active === 1 ? 1 : 0 }} transition={p(0.4)}>
      <g transform="translate(326 218)">
        <circle r="17" className="po-clock" />
        <path d="M0 -12v2M12 0h-2M0 12v-2M-12 0h2" className="bi-icon" />
        <motion.path d="M0 0V-10" className="po-clock-hand" initial={false} animate={{ rotate: active === 1 ? 720 : 0 }} transition={p(2, 0.3)} style={{ transformOrigin: '0px 0px' }} />
        <path d="M0 0h7" className="po-clock-hand" />
      </g>
      <text x="326" y="250" textAnchor="middle" className="bi-tiny">tempo</text>
    </motion.g>
    <motion.g initial={false} animate={{ x: active === 1 ? 368 : 196, opacity: active === 1 ? 1 : 0 }} transition={p(active === 1 ? 2 : 0.3, 0.3)}>
      <Person x={0} y={243} s={0.62} coat="po-coat-rose" />
    </motion.g>
    {[[64, 158], [150, 190], [196, 232]].map(([x, y], k) => <motion.g key={x} initial={false}
      animate={{ opacity: active === 2 ? 1 : 0, scale: active === 2 ? [0, 1.2, 1] : 0 }} transition={p(0.6, 0.3 + 0.15 * k)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
      <path d={`M${x} ${y - 10}l9 16h-18Z`} className="po-warn" />
      <path d={`M${x} ${y - 4}v5M${x} ${y + 3}v1`} className="po-warn-mark" />
    </motion.g>)}

    <text x="30" y="326" className="bi-hand-sm">{hand}</text>
    <text x="30" y="342" className="bi-foot">Nem sempre centro rico, periferia pobre: há condomínios de alta renda na periferia.</text>
  </svg>;
}

// ---------------------------------------------------------------------------
// Mobilidade populacional: a origem empurra, o destino puxa. A pessoa só
// atravessa no terceiro recorte, quando as duas famílias de fatores agem
// juntas — é a combinação, não um fator isolado, que o capítulo sustenta.
const PUSH = [
  { label: 'desemprego', icon: 'M-9 -4h18v12h-18ZM-4 -4v-4h8v4M-10 -10l20 20' },
  { label: 'violência', icon: 'M-9 -9h18v18h-18ZM-2 -9l3 7-4 4 5 7' },
  { label: 'conflito armado', icon: 'M-9 -9l18 18M9 -9l-18 18M-9 3l6 6M9 3l-6 6' },
  { label: 'desastres', icon: 'M-8 -2l8-7 8 7v4h-16ZM-10 6q3-3 5 0t5 0 5 0 5 0' },
  { label: 'perseguição', icon: 'M-10 0q10-10 20 0q-10 10-20 0ZM0 -3a3 3 0 1 0 0.1 0' },
  { label: 'sem serviços', icon: 'M-3 -9h6v6h6v6h-6v6h-6v-6h-6v-6h6ZM-10 10l20-20' },
];
const PULL = [
  { label: 'emprego', icon: 'M-9 -4h18v12h-18ZM-4 -4v-4h8v4M-9 1h18' },
  { label: 'salários', icon: 'M-8 8h16M-8 3h16M-8 -2h16M-8 -7h16' },
  { label: 'segurança', icon: 'M0 -10l9 3v5q0 8-9 11q-9-3-9-11v-5ZM-4 0l3 3 5-6' },
  { label: 'educação e saúde', icon: 'M-10 -6q5-3 10 0q5-3 10 0v14q-5-3-10 0q-5-3-10 0ZM0 -6v14' },
  { label: 'redes sociais', icon: 'M-7 -5a3 3 0 1 0 0.1 0M7 -5a3 3 0 1 0 0.1 0M0 6a3 3 0 1 0 0.1 0M-5 -3l4 7M5 -3l-4 7M-4 -5h8' },
];

export function MigrationForces({ active }: Scene) {
  const p = usePaced();
  const pushOn = active !== 1;
  const pullOn = active !== 0;
  const note = [
    ['a origem empurra', 'torna o lugar de origem', 'menos atrativo', ''],
    ['o destino puxa', 'parentes e conterrâneos já no', 'destino facilitam a chegada:', 'a migração em cadeia'],
    ['raramente um fator sozinho', 'várias pressões de expulsão com', 'várias atrações ao mesmo tempo;', 'o peso varia com quem migra'],
  ][active];
  const badge = (b: { label: string; icon: string }, k: number, x0: number, on: boolean, kind: 'push' | 'pull') => {
    const x = x0 + (k % 2) * 86;
    const y = 170 + Math.floor(k / 2) * 52;
    return <motion.g key={b.label} initial={false} animate={{ opacity: on ? 1 : 0.35, scale: on ? 1 : 0.92 }} transition={p(0.5, on ? 0.1 * k : 0)}
      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
      <circle cx={x} cy={y} r="17" className={kind === 'push' ? 'po-badge-push' : 'po-badge-pull'} />
      <path d={b.icon} transform={`translate(${x} ${y})`} className="po-badge-icon" />
      <text x={x} y={y + 30} textAnchor="middle" className="bi-tiny">{b.label}</text>
    </motion.g>;
  };
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Mobilidade populacional: fatores de expulsão na origem e de atração no destino, que em geral agem combinados; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">MIGRAÇÃO · EXPULSÃO E ATRAÇÃO</text>
    <defs>
      <marker id="po-head-push" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" className="po-head-push" /></marker>
      <marker id="po-head-pull" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" className="po-head-pull" /></marker>
    </defs>

    <text x="115" y="66" textAnchor="middle" className={active !== 1 ? 'bi-label po-warm' : 'bi-label'}>origem</text>
    <text x="515" y="66" textAnchor="middle" className={active !== 0 ? 'bi-label po-cool' : 'bi-label'}>destino</text>
    <path d="M60 130H176" className="bi-ground" />
    {[[82, 'po-shack-a'], [112, 'po-shack-c'], [146, 'po-shack-b']].map(([x, c]) => <g key={x} transform={`translate(${x} 130)`}>
      <path d="M-12 0v-18h24v18Z" className={c as string} /><path d="M-14 -17l14-8 14 8" className="po-roof" /><rect x="-3" y="-9" width="6" height="9" className="po-door" />
    </g>)}
    <path d="M100 130l4 6-4 5 5 7" className="bi-crack" />
    <path d="M454 130H578" className="bi-ground" />
    {[[464, 28, 36], [494, 40, 60], [532, 32, 48], [562, 20, 30]].map(([x, h, w]) => <g key={x}>
      <rect x={x - 12} y={130 - w} width={h * 0.7} height={w} className="po-tower" />
      {Array.from({ length: Math.floor((w - 8) / 10) }, (_, r) => <path key={r} d={`M${x - 8} ${130 - w + 8 + r * 10}h${h * 0.7 - 8}`} className="po-tower-win" />)}
    </g>)}
    <path d="M176 130H454" className="po-route" />

    {PUSH.map((b, k) => badge(b, k, 72, pushOn, 'push'))}
    {PULL.map((b, k) => badge(b, k, 472, pullOn, 'pull'))}

    <motion.path className="po-push" markerEnd="url(#po-head-push)" initial={false}
      animate={{ d: active === 2 ? 'M300 88C334 68 356 74 366 90' : 'M140 88C174 68 196 74 208 90', pathLength: pushOn ? 1 : 0, opacity: pushOn ? 1 : 0 }} transition={p(active === 2 ? 1.8 : 0.9, 0.4)} />
    <motion.path className="po-pull" markerEnd="url(#po-head-pull)" initial={false}
      animate={{ d: active === 2 ? 'M400 86C414 72 428 70 444 76' : 'M254 88C300 62 396 62 444 80', pathLength: pullOn ? 1 : 0, opacity: pullOn ? 1 : 0 }} transition={p(active === 2 ? 1.8 : 0.9, 0.4)} />
    <motion.g initial={false} animate={{ x: active === 2 ? 380 : active === 1 ? 236 : 222 }} transition={p(active === 2 ? 1.8 : 0.6, 0.4)}>
      <Person x={0} y={103} s={0.72} coat="bi-coat-green" />
      <path d="M8 104l10 -14" className="po-stick" /><circle cx="19" cy="88" r="6" className="po-bundle" />
    </motion.g>

    <motion.g key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={p(0.5, 0.5)}>
      <text x="315" y="190" textAnchor="middle" className="bi-hand">{note[0]}</text>
      {note.slice(1).map((l, j) => l && <text key={l} x="315" y={214 + j * 16} textAnchor="middle" className="bi-small">{l}</text>)}
    </motion.g>
    <text x="30" y="340" className="bi-foot">Ravenstein (séc. XIX): teoria clássica de expulsão e atração.</text>
  </svg>;
}

// ---------------------------------------------------------------------------
// Redes de transportes: o comprimento de cada faixa é a distância em que o
// modal rende — o caminhão sai de uma porta e para na outra, o trem e a
// barcaça vão longe. Embaixo, a ordem de custo por tonelada em longa
// distância que o resumo sustenta, em pilhas sem escala.
export function TransportModes({ active }: Scene) {
  const p = usePaced();
  const card = [
    { title: 'Rodoviário', lines: [['distâncias curtas e médias'], ['rotas flexíveis'], ['porta a porta, sem'], ['transbordo'], [''], ['no Brasil:', 'b'], ['mais de 60% da carga'], ['herança de JK (1950–60)'], ['encarece o custo Brasil']] },
    { title: 'Ferroviário', lines: [['grandes volumes de carga'], ['homogênea: minério, grãos'], ['médias e longas distâncias'], [''], ['limite:', 'b'], ['infraestrutura fixa cara'], ['e pouco flexível'], [''], ['dominante no ciclo'], ['cafeeiro (fim do séc. XIX)']] },
    { title: 'Hidroviário e aéreo', lines: [['hidroviário:', 'b'], ['o mais barato por tonelada'], ['em grandes distâncias;'], ['depende de rios navegáveis'], ['ou do litoral; mais lento'], [''], ['aéreo:', 'b'], ['o mais caro de todos:'], ['cargas de alto valor'], ['e baixo peso']] },
][active];
  const lane = (k: number) => ({ opacity: active === k ? 1 : 0.42 });
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Redes de transportes: rodoviário, ferroviário, hidroviário e aéreo, cada um com sua vocação de distância e carga; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">MODAIS E VOCAÇÕES</text>

    <motion.g initial={false} animate={lane(0)} transition={p(0.4)}>
      <text x="30" y="68" className={active === 0 ? 'bi-label bi-on' : 'bi-label'}>Rodoviário</text>
      <g transform="translate(40 104)"><path d="M-8 0v-20l12-8 12 8v20Z" className="po-barn" /><path d="M-2 0v-10h8v10" className="po-door" /></g>
      <rect x="58" y="96" width="196" height="14" rx="3" className="po-road" />
      <path d="M62 103H250" className="po-road-dash" />
      <g transform="translate(272 104)"><path d="M-12 0v-22h24v22Z" className="po-bld" /><path d="M-14 -22l3-7h22l3 7Z" className="po-awning" /><path d="M-4 0v-11h8v11" className="po-door" /></g>
      <text x="158" y="126" textAnchor="middle" className="bi-tiny">curtas e médias distâncias, porta a porta</text>
      <motion.g initial={false} animate={{ x: active === 0 ? 150 : 0 }} transition={p(active === 0 ? 1.6 : 0.5, 0.3)}>
        <path d="M60 94v-18h26v18ZM86 94v-12h9l5 6v6Z" className="po-truck" />
        <circle cx="68" cy="96" r="3.5" className="po-wheel" /><circle cx="92" cy="96" r="3.5" className="po-wheel" />
      </motion.g>
    </motion.g>

    <motion.g initial={false} animate={lane(1)} transition={p(0.4)}>
      <text x="30" y="146" className={active === 1 ? 'bi-label bi-on' : 'bi-label'}>Ferroviário</text>
      <path d="M52 186H384M52 192H384" className="po-rail" />
      {Array.from({ length: 29 }, (_, k) => <path key={k} d={`M${56 + k * 11.5} 183v12`} className="po-sleeper" />)}
      <text x="218" y="210" textAnchor="middle" className="bi-tiny">grandes volumes, médias e longas distâncias</text>
      <motion.g initial={false} animate={{ x: active === 1 ? 210 : 0 }} transition={p(active === 1 ? 1.8 : 0.5, 0.3)}>
        {[0, 1, 2].map(k => <g key={k}>
          <path d={`M${58 + k * 30} 183v-14h26v14Z`} className="po-wagon" />
          <path d={`M${60 + k * 30} 170q11-8 22 0`} className={k === 1 ? 'po-ore' : 'po-grain'} />
          <circle cx={63 + k * 30} cy="184" r="2.5" className="po-wheel" /><circle cx={79 + k * 30} cy="184" r="2.5" className="po-wheel" />
        </g>)}
        <path d="M148 183v-22h18l8 10v12ZM154 161v-6h5v6" className="po-loco" />
        <circle cx="156" cy="184" r="3" className="po-wheel" /><circle cx="168" cy="184" r="3" className="po-wheel" />
      </motion.g>
    </motion.g>

    <motion.g initial={false} animate={lane(2)} transition={p(0.4)}>
      <text x="30" y="232" className={active === 2 ? 'bi-label bi-on' : 'bi-label'}>Hidroviário e aéreo</text>
      <path d="M44 268q12-5 24 0t24 0 24 0 24 0 24 0 24 0 24 0 24 0 24 0 24 0 24 0 24 0 24 0V282H44Z" className="po-river" />
      <motion.g initial={false} animate={{ x: active === 2 ? 244 : 0 }} transition={p(active === 2 ? 2.2 : 0.5, 0.3)}>
        <path d="M52 262h80l-8 10h-64Z" className="po-barge" />
        {[0, 1, 2, 3].map(k => <rect key={k} x={62 + k * 16} y="252" width="14" height="10" className={k % 2 ? 'po-box-b' : 'po-box-a'} />)}
      </motion.g>
      <motion.g initial={false} animate={{ x: active === 2 ? 140 : 0, y: active === 2 ? -6 : 0 }} transition={p(active === 2 ? 1.2 : 0.5, 0.3)}>
        <path d="M190 238h36q8 0 8 3t-8 3h-36l-6-8h4ZM206 238l-8-9h6l12 9M206 244l-8 9h6l12-9" className="po-plane" />
      </motion.g>
    </motion.g>

    <text x="30" y="294" className="bi-tiny bi-strong">custo por tonelada em longa distância (ordem, sem escala)</text>
    {[['hidroviário', 1], ['ferroviário', 2], ['rodoviário', 3], ['aéreo', 5]].map(([label, n], k) => {
      const x = 70 + k * 88;
      const lit = active === 2 ? k === 0 || k === 3 : active === 1 ? k === 1 : k === 2;
      return <g key={label as string}>
        {Array.from({ length: n as number }, (_, j) => <motion.ellipse key={j} cx={x} cy={322 - j * 5} rx="11" ry="3.5" className={lit ? 'po-coin po-coin-on' : 'po-coin'}
          initial={false} animate={{ opacity: 1, y: lit ? [-6, 0] : 0 }} transition={p(0.4, lit ? 0.4 + 0.08 * j : 0)} />)}
        <text x={x} y="341" textAnchor="middle" className={lit ? 'bi-tiny bi-strong' : 'bi-tiny'}>{label}</text>
      </g>;
    })}

    <rect x="400" y="56" width="196" height="280" rx="14" className="bi-panel" />
    <text x="498" y="322" textAnchor="middle" className="bi-hand-sm">nenhum é o certo para tudo</text>
    <motion.g key={active} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={p(0.5, 0.2)}>
      <text x="414" y="82" className="bi-label bi-on">{card.title}</text>
      {card.lines.map(([l, b], j) => l && <text key={j} x="414" y={106 + j * 18} className={b ? 'bi-small bi-strong' : 'bi-small'}>{l}</text>)}
    </motion.g>
  </svg>;
}

export const SCENES_LOTE5: Record<string, React.ComponentType<Scene>> = {
  'summary-geografia-dinamica-demografica': DemographicTransition,
  'geo-bonus-demografico': LaborSectors,
  'summary-geografia-o-espaco-urbano-i': UrbanHierarchy,
  'summary-geografia-o-espaco-urbano-ii': UrbanSegregation,
  'summary-geografia-mobilidade-populacional': MigrationForces,
  'summary-geografia-as-redes-de-transportes': TransportModes,
};
export const HEADERS_LOTE5: Record<string, string> = {
  'summary-geografia-dinamica-demografica': 'geografia da população',
  'geo-bonus-demografico': 'geografia do trabalho',
  'summary-geografia-o-espaco-urbano-i': 'rede urbana',
  'summary-geografia-o-espaco-urbano-ii': 'geografia urbana',
  'summary-geografia-mobilidade-populacional': 'geografia da população',
  'summary-geografia-as-redes-de-transportes': 'circulação e logística',
};
