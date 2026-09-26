import React from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import { BRAZIL } from './GeografiaFisica';
import { Arrow, ArrowHead, Person, type Scene } from './cenaKit';
import './HistoriaMundial.css';

function usePaced() {
  const t = useSceneMotion();
  return (duration: number, delay = 0) => (t.duration === 0 ? t : { ...t, duration, delay });
}

// Lote 13 da régua de História: capítulos que abriam com instrumento genérico
// (três caixas num eixo, polígonos abstratos) ou com o experimento de fontes.
// Cada cena desenha o mecanismo que o resumo explica — o excedente que faz a
// cidade, o mapa das Américas que se parte e se expande, a base social de cada
// revolução, as duas frentes da Segunda Guerra, os dois polos que nunca se
// tocam, as ditaduras sobrepostas no tempo e o litoral disputado. Datas, nomes
// e números vêm só do resumo; mapas são esquemáticos e a prancha diz isso.

type Paced = ReturnType<typeof usePaced>;

/** Camada que aparece só no recorte dela; as outras somem por opacidade para
 *  que o detector de colisão (que ignora opacidade 0) e a leitura concordem. */
function Layer({ on, p, children, delay = 0 }: { on: boolean; p: Paced; children: React.ReactNode; delay?: number }) {
  return <motion.g initial={false} animate={{ opacity: on ? 1 : 0 }} transition={p(0.45, on ? delay : 0)} style={{ pointerEvents: on ? 'auto' : 'none' }}>{children}</motion.g>;
}

// ---------------------------------------------------------------------------
// Introdução: o excedente no centro. Em cima, a passagem do acampamento à
// aldeia e da aldeia à cidade; embaixo, os dois vales que o resumo compara.
// A lente das fontes fica no rodapé, porque tudo o que se vê chegou por
// vestígios interpretados.
// ---------------------------------------------------------------------------
const TRADES = [
  { label: 'artesãos', tool: 'M-4 -3l8 8M2 -6l5 5-3 3-5-5Z' },
  { label: 'sacerdotes', tool: 'M-5 4h10M-3 4v-8h6v8' },
  { label: 'administradores', tool: 'M-5 -6h10v12h-10ZM-3 -2h6M-3 2h4' },
  { label: 'guerreiros', tool: 'M0 7v-14M-3 -4l3-4 3 4' },
];

const NILE = 'M456 312C450 294 466 282 458 264S466 250 462 244';

export function FirstCities({ active }: Scene) {
  const p = usePaced();
  const sacks = active >= 1 ? 6 : 2;
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Primeiras civilizações: de nômades a aldeias agrícolas e a cidades graças ao excedente, e a comparação entre as cidades-Estado do Tigre e Eufrates e o Estado centralizado do Nilo; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <ArrowHead id="hm-fc-head" />
    <text x="30" y="40" className="bi-kicker">REVOLUÇÃO AGRÍCOLA · A PARTIR DE c. 10.000 a.C.</text>

    {/* acampamento nômade */}
    <motion.g initial={false} animate={{ opacity: active <= 1 ? 1 : 0.5 }} transition={p(0.4)}>
      <path d="M52 132l26-42 26 42Z" className="hm-tent" />
      <path d="M78 90v42M70 132l8-16 8 16" className="hm-tent-line" />
      <Person x={124} y={104} s={0.78} coat="bi-coat-plain" />
      <path d="M136 132V84M133 88l3-6 3 6" className="hm-spear" />
      <path d="M40 146c20-6 40 4 60-2s40 4 64-2" className="hm-trail" />
      <text x="100" y="166" textAnchor="middle" className={active === 0 ? 'bi-label bi-on' : 'bi-label'}>nômades</text>
      <text x="100" y="180" textAnchor="middle" className="bi-tiny">caçadores-coletores</text>
    </motion.g>

    {/* aldeia agrícola com celeiro */}
    <motion.g initial={false} animate={{ opacity: active <= 1 ? 1 : 0.5 }} transition={p(0.4)}>
      <path d="M232 132v-22l16-12 16 12v22Z" className="hm-hut" />
      <path d="M244 132v-10h8v10" className="hm-tent-line" />
      <path d="M272 132v-16l12-9 12 9v16Z" className="hm-hut" />
      {[0, 1, 2, 3, 4].map(k => <motion.g key={k} initial={false} animate={{ scaleY: active >= 0 ? 1 : 0.2 }}
        transition={p(0.5, 0.1 * k)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}>
        <path d={`M${314 + k * 9} 132v-26`} className="hm-stalk" />
        <path d={`M${314 + k * 9} 108l-4-5M${314 + k * 9} 108l4-5M${314 + k * 9} 114l-4-5M${314 + k * 9} 114l4-5`} className="hm-grain" />
      </motion.g>)}
      {Array.from({ length: 6 }, (_, k) => {
        const col = k % 3, row = Math.floor(k / 3);
        return <motion.g key={k} initial={false} animate={{ opacity: k < sacks ? 1 : 0, y: k < sacks ? 0 : -8 }}
          transition={p(0.35, active >= 1 ? 0.15 * k : 0)}>
          <path d={`M${208 + col * 11 - (row ? -5 : 0)} ${132 - row * 11}c-5 0-6-9 0-11 6 2 5 11 0 11Z`} className="bi-sack-big" />
        </motion.g>;
      })}
      <text x="276" y="166" textAnchor="middle" className={active <= 1 ? 'bi-label bi-on' : 'bi-label'}>aldeia sedentária</text>
      <text x="276" y="180" textAnchor="middle" className="bi-tiny">agricultura e pecuária</text>
    </motion.g>

    {/* a cidade: muralha, portão, casas */}
    <motion.g initial={false} animate={{ opacity: active >= 1 ? 1 : 0.4 }} transition={p(0.4)}>
      <path d="M452 132V96h8v-6h8v6h12v-6h8v6h12v-6h8v6h12v-6h8v6h8v36Z" className="hm-wall" />
      <path d="M494 132v-16a8 8 0 0 1 16 0v16" className="hm-gate" />
      <path d="M466 96V78l10-8 10 8v18M520 96V74l12-10 12 10v22" className="hm-house" />
      <text x="508" y="166" textAnchor="middle" className={active === 1 ? 'bi-label bi-on' : 'bi-label'}>primeiras cidades</text>
      <text x="508" y="180" textAnchor="middle" className="bi-tiny">quem não planta também come</text>
    </motion.g>

    <Arrow d="M156 118C178 104 196 104 204 112" on p={p} head="hm-fc-head" />
    <Arrow d="M372 112C400 98 424 98 442 108" on={active >= 1} p={p} head="hm-fc-head" delay={0.3} />
    <Layer on={active === 0} p={p} delay={0.4}>
      <text x="176" y="80" textAnchor="middle" className="bi-hand-sm">vários centros,</text>
      <text x="176" y="96" textAnchor="middle" className="bi-hand-sm">não um só</text>
    </Layer>
    <Layer on={active === 1} p={p} delay={0.2}>
      <text x="408" y="76" textAnchor="middle" className="bi-hand-sm">excedente</text>
    </Layer>
    {TRADES.map((trade, k) => <motion.g key={trade.label} initial={false}
      animate={{ opacity: active === 1 ? 1 : 0, x: active === 1 ? 0 : -60 - 18 * k }} transition={p(0.7, active === 1 ? 0.5 + 0.15 * k : 0)}>
      <circle cx={400 + k * 34} cy={140} r={10} className="hm-trade" />
      <g transform={`translate(${400 + k * 34} 140)`}><path d={trade.tool} className="hm-trade-icon" /></g>
    </motion.g>)}
    <Layer on={active === 1} p={p} delay={0.9}>
      <text x="451" y="196" textAnchor="middle" className="bi-tiny">artesãos · sacerdotes · administradores · guerreiros</text>
    </Layer>

    {/* os dois vales */}
    <motion.rect x="30" y="206" width="272" height="118" rx="12" className="bi-panel" initial={false}
      animate={{ opacity: active === 3 ? 0.55 : 1 }} transition={p(0.4)} />
    <text x="46" y="226" className={active === 2 ? 'bi-panel-title hm-title-on' : 'bi-panel-title'}>TIGRE E EUFRATES</text>
    <path d="M58 244C98 262 132 262 170 282S238 312 280 314" className="hm-river" />
    <path d="M98 236C132 246 164 250 196 268S250 300 280 310" className="hm-river" />
    {[['Ur', 256, 296], ['Uruk', 196, 262], ['Babilônia', 150, 272]].map(([name, x, y], k) => <motion.g key={name as string}
      initial={false} animate={{ scale: active === 2 ? [1, 1.18, 1] : 1 }} transition={p(0.6, active === 2 ? 0.2 * k : 0)}
      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
      <g transform={`translate(${x} ${y})`}>
        <path d="M-9 6v-10h3v-3h3v3h6v-3h3v3h3v10Z" className="hm-city" />
      </g>
    </motion.g>)}
    <text x="240" y="304" textAnchor="end" className="bi-tiny">Ur</text>
    <text x="210" y="252" className="bi-tiny">Uruk</text>
    <text x="150" y="294" textAnchor="middle" className="bi-tiny">Babilônia</text>
    <Layer on={active === 2} p={p} delay={0.3}>
      <path d="M162 266l22-4M184 262l-5-4M184 262l-4 5M162 266l5-5M162 266l5 4" className="hm-rival" />
      <path d="M206 270l38 20M244 290l-7 1M244 290l-1-7M206 270l7-1M206 270l1 7" className="hm-rival" />
      <text x="228" y="276" className="bi-hand-sm">rivais</text>
    </Layer>
    <g transform="translate(70 284)">
      <rect x="-18" y="-16" width="36" height="28" rx="5" className="hm-tablet" />
      {[[-11, -8], [-3, -8], [5, -8], [-11, 0], [-1, 0], [9, 0]].map(([dx, dy], k) => <motion.path key={k}
        d={`M${dx} ${dy}l5 2-5 2ZM${dx + 4} ${dy + 2}h4`} className="hm-wedge" initial={false}
        animate={{ opacity: active === 2 || k < 3 ? 1 : 0.35 }} transition={p(0.25, active === 2 ? 0.5 + 0.12 * k : 0)} />)}
    </g>
    <text x="70" y="316" textAnchor="middle" className="bi-tiny">cuneiforme</text>

    <motion.rect x="318" y="206" width="272" height="118" rx="12" className="bi-panel" initial={false}
      animate={{ opacity: active === 2 ? 0.55 : 1 }} transition={p(0.4)} />
    <text x="334" y="226" className={active === 3 ? 'bi-panel-title hm-title-on' : 'bi-panel-title'}>VALE DO NILO</text>
    <motion.path d={NILE} className="hm-flood" initial={false}
      animate={{ opacity: active === 3 ? 0.9 : 0, strokeWidth: active === 3 ? 22 : 6 }} transition={p(1, 0.3)} />
    <path d={NILE} className="hm-river" />
    <path d="M462 244l-12-8M462 244l0-10M462 244l12-8" className="hm-river hm-delta" />
    {[[446, 300], [474, 282], [448, 262], [476, 252]].map(([x, y], k) => <g key={k}>
      <motion.path d={`M${x} ${y}L${526} 286`} className="hm-tie" initial={false}
        animate={{ pathLength: active === 3 ? 1 : 0.0001, opacity: active === 3 ? 1 : 0 }} transition={p(0.5, active === 3 ? 0.4 + 0.12 * k : 0)} />
      <rect x={x - 4} y={y - 4} width="8" height="8" rx="2" className="hm-village" />
    </g>)}
    <g transform="translate(534 280)">
      <path d="M-2 4c0-14 3-22 7-24 4 2 7 10 7 24Z" className="hm-hedjet" />
      <path d="M-14 16V-2h7v-12h4v14h14v16Z" className="hm-deshret" />
      <path d="M-7 -2c-6-4-9 2-5 6" className="hm-curl" />
      <path d="M-16 16h32" className="hm-tent-line" />
    </g>
    <text x="536" y="310" textAnchor="middle" className="bi-tiny">faraó: um só Estado</text>
    <g transform="translate(560 236)">
      <rect x="-15" y="-15" width="30" height="30" rx="5" className="hm-tablet hm-papyrus" />
      <path d="M-9 -7l3-3 3 3 3-3 3 3 3-3M-9 1l3-3 3 3 3-3 3 3 3-3" className="hm-glyph" />
      <path d="M-6 9h12" className="hm-glyph" />
    </g>
    <text x="560" y="264" textAnchor="middle" className="bi-tiny">hieróglifos</text>
    <Layer on={active === 3} p={p} delay={0.8}>
      <text x="334" y="262" className="bi-hand-sm">cheias</text>
      <text x="334" y="278" className="bi-hand-sm">previsíveis</text>
    </Layer>

    <text x="30" y="342" className="bi-foot">Lente do historiador: tudo chega por vestígios interpretados — reconstrução parcial.</text>
  </svg>;
}

// ---------------------------------------------------------------------------
// América no século XIX: um mapa esquemático em que a América hispânica se
// parte, os Estados Unidos avançam para o oeste e se dividem, e setas de
// comércio atravessam o Atlântico. O painel à direita diz o que o mapa mostra.
// ---------------------------------------------------------------------------
// Os Estados Unidos em quatro faixas recortadas pelo contorno: leste de 1776,
// Louisiana de 1803, o sudoeste tomado do México em 1848 e o noroeste, que o
// resumo não data e por isso fica sem rótulo.
const US_OUTLINE = 'M112 100L300 96L316 108L306 124L294 146L270 146L250 156L226 150L186 152L160 150L136 140L120 124Z';
const CANADA = 'M40 96C44 84 60 78 76 82L92 70C116 60 150 58 176 62C196 54 222 52 240 58C262 50 290 54 306 64C324 66 338 76 336 90C332 98 324 102 316 108L300 96L112 100L98 104C84 100 70 104 58 108C48 106 40 102 40 96Z';
const MEXICO = 'M136 140L160 150L186 152L226 150L214 164L222 180L214 186L198 176L178 170L154 158Z';
const CENTRAL = 'M214 186L222 180L232 190L240 198L234 200L224 194Z';
const SA_PIECES = [
  { d: 'M236 202L284 198L306 208L300 224L268 228L244 226Z', dx: -4, dy: -4 },
  { d: 'M244 226L268 228L268 240L284 250L280 264L262 268L248 252L236 236Z', dx: -7, dy: 0 },
  { d: 'M248 252L262 268L258 290L252 312L246 322L238 320L242 296L240 270Z', dx: -7, dy: 2 },
  { d: 'M262 268L280 264L292 272L304 286L294 296L282 308L270 318L254 322L258 290Z', dx: 3, dy: 3 },
];
const BRAZIL_SCHEMA = 'M306 208L338 214L360 234L352 258L332 282L310 290L292 272L280 264L284 250L268 240L268 228L300 224Z';

export function AmericasNineteenth({ active }: Scene) {
  const p = usePaced();
  const panel = [
    { title: 'INDEPENDÊNCIAS', lines: ['guerras longas contra', 'a Espanha', 'elites regionais preferem', 'unidades menores'], hand: 'repúblicas, no plural', note: 'Brasil: continuidade dinástica' },
    { title: 'MARCHA PARA O OESTE', lines: ['1803: Louisiana,', 'comprada da França', '1846–1848: guerra', 'com o México'], hand: '“Destino Manifesto”', note: 'e indígenas expulsos à força' },
    { title: 'GUERRA CIVIL', lines: ['1861–1865', 'Norte industrializado ×', 'Sul agrário e escravista', 'vence o Norte'], hand: 'fim da escravidão', note: 'governo federal mais forte' },
    { title: 'NEOCOLONIALISMO', lines: ['saem: café, açúcar,', 'minérios, carne', 'entram: empréstimos,', 'ferrovias e portos'], hand: 'dependência sem colônia', note: 'sobretudo capital britânico' },
  ][active];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`América no século XIX: fragmentação da América hispânica, expansão dos Estados Unidos para o oeste, Guerra Civil e neocolonialismo britânico; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <ArrowHead id="hm-am-head" />
    <defs><clipPath id="hm-us-clip"><path d={US_OUTLINE} /></clipPath></defs>
    <text x="30" y="40" className="bi-kicker">AMÉRICAS · SÉCULO XIX</text>

    <path d={CANADA} className="bi-land" />
    <path d="M232 64c4 12 18 18 30 10" className="hm-bay" />
    <path d="M48 170c10-6 22-6 30 0M60 190c10-6 22-6 30 0M326 300c10-6 22-6 30 0M338 316c10-6 22-6 30 0" className="hm-wave" />
    <text x="70" y="214" textAnchor="middle" className="hm-ocean">Pacífico</text>
    <text x="330" y="338" textAnchor="middle" className="hm-ocean">Atlântico</text>
    <g clipPath="url(#hm-us-clip)">
      <rect x="252" y="90" width="80" height="70" className="hm-us" />
      <motion.rect x="190" y="90" width="62" height="70" className="hm-us" initial={false}
        animate={{ opacity: active >= 1 ? 1 : 0.18 }} transition={p(0.5, active === 1 ? 0.3 : 0)} />
      <motion.rect x="100" y="90" width="90" height="32" className="hm-us" initial={false}
        animate={{ opacity: active >= 1 ? 1 : 0.18 }} transition={p(0.5, active === 1 ? 1.2 : 0)} />
      <motion.rect x="100" y="122" width="90" height="40" className="hm-hisp" initial={false}
        animate={{ opacity: active >= 1 ? 0 : 1 }} transition={p(0.5, active === 1 ? 0.9 : 0)} />
      <motion.rect x="100" y="122" width="90" height="40" className="hm-us" initial={false}
        animate={{ opacity: active >= 1 ? 1 : 0 }} transition={p(0.5, active === 1 ? 0.9 : 0)} />
      <Layer on={active === 2} p={p}>
        <rect x="190" y="124" width="142" height="40" className="hm-south" />
      </Layer>
    </g>
    <path d={US_OUTLINE} className="hm-us-edge" />
    <text x="292" y="92" textAnchor="middle" className="bi-tiny">1776</text>
    <Layer on={active === 1} p={p} delay={0.3}>
      <text x="220" y="118" textAnchor="middle" className="hm-zone-text">1803</text>
      <text x="160" y="138" textAnchor="middle" className="hm-zone-text">1848</text>
      <motion.path d="M252 94V156" className="hm-frontier" initial={false}
        animate={{ x: active === 1 ? [0, -62, -132] : 0 }} transition={p(1.6, 0.3)} />
    </Layer>
    <Layer on={active === 2} p={p}>
      <path d="M190 124H316" className="hm-split" />
      <path d="M228 120v-12l6-4v4l6-4v4l6-4v12Z" className="bi-factory" />
      <text x="254" y="118" className="hm-zone-text">Norte</text>
      <path d="M226 132h22M226 138h22M226 144h18" className="hm-rows" />
      <text x="254" y="142" className="hm-zone-text">Sul</text>
    </Layer>
    <text x={active === 2 ? 150 : 272} y="122" textAnchor="middle" className="hm-us-label">EUA</text>

    <path d={MEXICO} className="hm-hisp" />
    <path d={CENTRAL} className="hm-hisp" />
    <text x="186" y="166" textAnchor="middle" className="bi-tiny">México</text>

    <path d={BRAZIL_SCHEMA} className="hm-br" />
    <text x="322" y="250" textAnchor="middle" className="bi-tiny">Brasil</text>
    {SA_PIECES.map((piece, k) => <motion.path key={k} d={piece.d} className="hm-hisp" initial={false}
      animate={active === 0 ? { x: [0, 0, piece.dx], y: [0, 0, piece.dy] } : { x: piece.dx, y: piece.dy }}
      transition={p(1.4, active === 0 ? 0.3 + 0.12 * k : 0)} />)}
    <Layer on={active === 0} p={p}>
      <path d="M232 196C262 190 304 200 304 232S282 330 240 330C214 312 214 226 232 196Z" className="hm-dream" />
      <text x="170" y="238" textAnchor="middle" className="bi-hand-sm">Bolívar:</text>
      <text x="170" y="254" textAnchor="middle" className="bi-hand-sm">um só projeto</text>
    </Layer>

    <Layer on={active === 3} p={p}>
      <path d="M356 108l5-7 5 3-1 7 6 5-2 9 5 7-9 3-8-2 2-7-5-4 4-7Z" className="hm-uk" />
      <path d="M346 118c3-4 8-3 8 1s-3 8-7 6-3-4-1-7Z" className="hm-uk" />
      <text x="358" y="152" textAnchor="middle" className="bi-tiny">Reino Unido</text>
      <Arrow d="M346 240C362 216 364 190 360 160" on={active === 3} p={p} head="hm-am-head" delay={0.3} />
      <motion.path d="M380 160C388 206 380 252 354 278" className="hm-return" markerEnd="url(#hm-am-head)" initial={false}
        animate={{ pathLength: active === 3 ? 1 : 0 }} transition={p(0.8, 0.9)} />
      {[0, 1, 2].map(k => <motion.circle key={k} r="4" className="hm-cargo" initial={false}
        animate={active === 3 ? { cx: [348, 360], cy: [236 - k * 4, 168] } : { cx: 348, cy: 236 }}
        transition={p(1.2, 0.5 + 0.25 * k)} />)}
    </Layer>

    <rect x="400" y="56" width="192" height="232" rx="14" className="bi-panel" />
    <text x="414" y="80" className="bi-panel-title">{panel.title}</text>
    {panel.lines.map((line, k) => <motion.text key={`${active}-${k}`} x="414" y={108 + k * 22} className="bi-small"
      initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={p(0.4, 0.15 * k)}>{line}</motion.text>)}
    <motion.text key={`hand-${active}`} x="496" y="228" textAnchor="middle" className="bi-hand-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4, 0.8)}>{panel.hand}</motion.text>
    <text x="496" y="262" textAnchor="middle" className="bi-tiny">{panel.note}</text>

    <text x="496" y="316" textAnchor="middle" className="bi-foot">Mapa esquemático, sem escala.</text>
  </svg>;
}

// ---------------------------------------------------------------------------
// Grandes revoluções: a linha do tempo em ordem certa (México 1910, Rússia
// 1917, China 1949) e, embaixo, quem fez cada uma. O quarto recorte junta as
// duas que o resumo compara pela base social: cidade × campo.
// ---------------------------------------------------------------------------
const RY = (y: number) => 60 + (y - 1905) * (500 / 45);

export function CenturyRevolutions({ active }: Scene) {
  const p = usePaced();
  const lit = (k: number) => active === k || (active === 3 && k > 0);
  const events: [number, string, number][] = [[1910, '1910', 0], [1917, '1917', 1], [1938, '1938 · petróleo', 0], [1949, '1949', 2]];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Grandes revoluções do século XX em ordem: México 1910, Rússia 1917, China 1949, com a base social de cada uma; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <ArrowHead id="hm-rv-head" />
    <text x="30" y="40" className="bi-kicker">REVOLUÇÕES DO SÉCULO XX</text>

    <path d={`M${RY(1905)} 70H${RY(1950)}`} className="bi-axis" />
    {events.map(([y, label, k]) => <g key={label}>
      <motion.circle cx={RY(y)} cy="70" r="7" className={lit(k) ? 'hm-tl-on' : 'hm-tl'} initial={false}
        animate={{ scale: lit(k) ? 1.25 : 1 }} transition={p(0.4)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
      <text x={RY(y)} y="92" textAnchor="middle" className={lit(k) ? 'bi-small bi-strong' : 'bi-tiny'}>{label}</text>
    </g>)}

    {[0, 1, 2].map(k => <motion.rect key={k} x={30 + k * 190} y="106" width="180" height="210" rx="14" className="bi-panel" initial={false}
      animate={{ opacity: lit(k) ? 1 : 0.45, y: lit(k) ? -4 : 0 }} transition={p(0.4)} />)}

    {/* México: três lideranças puxando para lados diferentes */}
    <motion.g initial={false} animate={{ opacity: lit(0) ? 1 : 0.45 }} transition={p(0.4)}>
      <text x="44" y="126" className="bi-panel-title">MÉXICO · 1910–1920</text>
      <text x="44" y="142" className="bi-tiny">contra Porfirio Díaz</text>
      {[[120, 196], [84, 222], [156, 222]].map(([x, y], k) => <path key={k} d={`M120 214L${x} ${y}`} className="hm-rope" />)}
      <circle cx="120" cy="214" r="4" className="bi-seal" />
      {[
        { x: 120, y: 160, hat: 'top' as const, name: 'Madero', lx: 138, ly: 170, anchor: 'start' as const, dx: 0, dy: -6 },
        { x: 72, y: 206, hat: 'brim' as const, name: 'Villa · norte', lx: 76, ly: 252, anchor: 'middle' as const, dx: -7, dy: 2 },
        { x: 168, y: 206, hat: 'brim' as const, name: 'Zapata · sul', lx: 166, ly: 252, anchor: 'middle' as const, dx: 7, dy: 2 },
      ].map((leader, k) => <motion.g key={leader.name} initial={false}
        animate={{ x: active === 0 ? [0, leader.dx, 0, leader.dx] : 0, y: active === 0 ? [0, leader.dy, 0, leader.dy] : 0 }}
        transition={p(1.4, 0.2 + 0.1 * k)}>
        <Person x={leader.x} y={leader.y} s={0.7} coat={k === 0 ? 'bi-coat' : 'bi-coat-plain'} hat={leader.hat} />
        <text x={leader.lx} y={leader.ly} textAnchor={leader.anchor} className="bi-tiny">{leader.name}</text>
      </motion.g>)}
      <g transform="translate(58 276)">
        <path d="M-12 -12h22a3 3 0 0 1 3 3v22h-22a3 3 0 0 1-3-3Z" className="bi-scroll" />
        <path d="M-7 -5h14M-7 0h14M-7 5h10" className="bi-scroll-line" />
        <motion.circle cx="9" cy="9" r="5" className="bi-seal" initial={false} animate={{ scale: active === 0 ? [0, 1.25, 1] : 1 }} transition={p(0.5, 1.4)} />
      </g>
      <text x="80" y="272" className="bi-small bi-strong">Constituição 1917</text>
      <text x="80" y="285" className="bi-tiny">reforma agrária</text>
      <text x="80" y="297" className="bi-tiny">direitos trabalhistas</text>
      <text x="80" y="309" className="bi-tiny">subsolo nacional</text>
    </motion.g>

    {/* Rússia: dois momentos no mesmo ano */}
    <motion.g initial={false} animate={{ opacity: lit(1) ? 1 : 0.45 }} transition={p(0.4)}>
      <text x="234" y="126" className="bi-panel-title">RÚSSIA · 1917</text>
      <text x="234" y="148" className="bi-small bi-strong">Fevereiro</text>
      <motion.g initial={false} animate={active === 1 ? { rotate: [0, 0, -40], y: [0, 0, 16], opacity: [1, 1, 0.5] } : { rotate: -40, y: 16, opacity: 0.5 }}
        transition={p(1.1, 0.3)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}>
        <path d="M358 150l2-14 6 6 5-10 5 10 6-6 2 14Z" className="bi-crown" />
      </motion.g>
      <text x="234" y="164" className="bi-tiny">cai o czar Nicolau II</text>
      <text x="234" y="176" className="bi-tiny">governo provisório</text>
      <text x="234" y="188" className="bi-tiny">continua na guerra</text>
      <Arrow d="M244 196v12" on={lit(1)} p={p} head="hm-rv-head" delay={0.6} />
      <text x="234" y="226" className="bi-small bi-strong">Outubro</text>
      <text x="234" y="240" className="bi-tiny">bolcheviques, com Lênin</text>
      <text x="234" y="258" className="bi-hand-sm">“pão, terra e paz”</text>
      <text x="234" y="280" className="bi-tiny">1918–1922: guerra civil</text>
      <text x="234" y="294" className="bi-tiny">1922: URSS</text>
      <g transform="translate(372 286)">
        <path d="M-18 16v-18l8-5v5l8-5v5l8-5v23Z" className="bi-factory" />
        <path d="M6 16v-26h6v26" className="bi-factory" />
      </g>
    </motion.g>

    {/* China: o campo cerca a cidade; Chiang vai para Taiwan */}
    <motion.g initial={false} animate={{ opacity: lit(2) ? 1 : 0.45 }} transition={p(0.4)}>
      <text x="424" y="126" className="bi-panel-title">CHINA · 1949</text>
      <text x="424" y="148" className="bi-small bi-strong">Partido Comunista</text>
      <text x="424" y="162" className="bi-tiny">Mao Tsé-tung</text>
      {[0, 1, 2].map(k => <Person key={k} x={440 + k * 22} y={186} s={0.62} coat="bi-coat-green" hat="brim" />)}
      {[0, 1, 2, 3, 4, 5].map(k => <path key={k} d={`M${436 + k * 14} 228v-8M${436 + k * 14} 224l-4-4M${436 + k * 14} 224l4-4`} className="hm-stalk" />)}
      <path d="M428 230h92" className="hm-rows" />
      <text x="424" y="244" className="bi-small bi-strong">Kuomintang</text>
      <text x="424" y="258" className="bi-tiny">Chiang Kai-shek</text>
      <path d="M548 276c6-12 20-14 26-4 4 10-6 18-16 16-8-2-12-6-10-12Z" className="hm-island" />
      <text x="562" y="302" textAnchor="middle" className="bi-tiny">Taiwan</text>
      <motion.g initial={false} animate={active === 2 ? { x: [0, 60], y: [0, -6] } : { x: 60, y: -6 }} transition={p(1.2, 0.6)}>
        <Person x={500} y={270} s={0.55} coat="bi-coat" />
      </motion.g>
    </motion.g>

    <Layer on={active === 3} p={p} delay={0.4}>
      <path d="M300 322c0 10 190 10 190 0" className="hm-bracket" />
      <rect x="252" y="324" width="286" height="22" rx="8" className="hm-chip" />
      <text x="395" y="339" textAnchor="middle" className="hm-chip-text">operariado urbano × campesinato</text>
    </Layer>
    <Layer on={active !== 3} p={p}>
      <text x="30" y="342" className="bi-foot">Figuras esquemáticas; a ordem da linha é a das datas.</text>
    </Layer>
  </svg>;
}

// ---------------------------------------------------------------------------
// Segunda Guerra: duas frentes lado a lado — a Europa, com as flechas curtas
// da blitzkrieg e a longa até Stalingrado que depois volta, e o Pacífico, de
// Pearl Harbor ao Japão ilha a ilha. Embaixo, os anos e o mundo que sobra.
// ---------------------------------------------------------------------------
const WY = (y: number) => 44 + (y - 1939) * (330 / 6.4);

export function WorldWarTwo({ active }: Scene) {
  const p = usePaced();
  const europe = active <= 1;
  const marks: [number, string, number][] = [[1939.7, 'Polônia', 0], [1940.4, 'França', 0], [1941.5, 'Barbarossa', 1], [1942.9, 'Stalingrado', 1], [1941.95, 'Pearl Harbor', 2], [1945.6, 'Hiroshima e Nagasaki', 2]];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Segunda Guerra Mundial: blitzkrieg de 1939 a 1940, Frente Oriental até Stalingrado, Pacífico de Pearl Harbor a Hiroshima e Nagasaki, e o mundo bipolar de 1945; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <ArrowHead id="hm-ww-head" />
    <ArrowHead id="hm-ww-head2" />
    <text x="30" y="40" className="bi-kicker">SEGUNDA GUERRA MUNDIAL · 1939–1945</text>

    {/* Europa */}
    <motion.g initial={false} animate={{ opacity: active === 3 ? 0.4 : europe ? 1 : 0.55 }} transition={p(0.4)}>
      <rect x="30" y="54" width="300" height="190" rx="14" className="bi-panel" />
      <text x="44" y="74" className="bi-panel-title">EUROPA</text>
      <path d="M84 98c6-8 14-6 16 2 4 6 0 14-4 20 4 6-2 12-10 10-6-2-6-10-4-16-4-4-2-12 2-16Z" className="hm-country" />
      <path d="M62 152C70 138 88 132 104 136L122 148C126 160 122 172 114 182C106 192 92 196 80 190C70 184 60 172 62 160Z" className="hm-country" />
      <path d="M126 112C136 104 156 102 170 108L178 124C180 138 176 150 166 156L140 160C130 152 124 140 124 126Z" className="hm-country hm-axis" />
      <path d="M180 112C196 106 214 108 226 116L230 140C222 150 206 154 190 152L180 138Z" className="hm-country" />
      <path d="M236 84C262 72 300 70 318 78V236H252C244 214 240 190 238 166C236 140 232 110 236 84Z" className="hm-country hm-ussr" />
      <text x="92" y="168" textAnchor="middle" className="bi-tiny">França</text>
      <text x="151" y="134" textAnchor="middle" className="bi-tiny">Alemanha</text>
      <text x="205" y="132" textAnchor="middle" className="bi-tiny">Polônia</text>
      <text x="280" y="104" textAnchor="middle" className="bi-tiny">URSS</text>
      <circle cx="292" cy="196" r="5" className="hm-pin" />
      <text x="290" y="216" textAnchor="middle" className="bi-tiny">Stalingrado</text>

      <Arrow d="M162 120C174 112 186 114 198 120" on={active === 0} p={p} head="hm-ww-head" delay={0.2} />
      <Arrow d="M130 146C122 152 116 156 108 158" on={active === 0} p={p} head="hm-ww-head" delay={0.7} />
      {[0, 1].map(k => <motion.g key={k} initial={false}
        animate={active === 0 ? { x: k ? [0, -28] : [0, 26], opacity: [0, 1, 1] } : { x: 0, opacity: 0 }}
        transition={p(0.8, 0.3 + 0.5 * k)}>
        <g transform={`translate(${k ? 134 : 166} ${k ? 172 : 146})`}>
          <path d="M-9 0h18l-3 5h-12Z M-5 -5h10v5h-10Z M5 -3h7" className="hm-tank" />
        </g>
      </motion.g>)}
      <Layer on={active === 0} p={p} delay={0.4}>
        <text x="96" y="226" textAnchor="middle" className="bi-hand-sm">rápido: tanques,</text>
        <text x="96" y="240" textAnchor="middle" className="bi-hand-sm">motores, aviões</text>
      </Layer>

      <Arrow d="M178 146C220 160 254 178 284 192" on={active === 1} p={p} head="hm-ww-head" delay={0.2} />
      <motion.path d="M284 206C240 226 196 204 168 166" className="hm-return" markerEnd="url(#hm-ww-head2)" initial={false}
        animate={{ pathLength: active === 1 ? 1 : 0, opacity: active === 1 ? 1 : 0 }} transition={p(1, 1.1)} />
      <Layer on={active === 1} p={p} delay={0.3}>
        <text x="232" y="160" className="bi-tiny bi-strong">1941</text>
        <text x="178" y="226" textAnchor="middle" className="bi-hand-sm">virada: recuo até 1945</text>
      </Layer>
    </motion.g>

    {/* Pacífico */}
    <motion.g initial={false} animate={{ opacity: active === 3 ? 0.4 : active === 2 ? 1 : 0.55 }} transition={p(0.4)}>
      <rect x="340" y="54" width="252" height="190" rx="14" className="bi-panel hm-sea" />
      <text x="354" y="74" className="bi-panel-title">PACÍFICO</text>
      <path d="M382 98c10-6 16 4 12 14l-6 18c-4 10-12 16-18 12 6-8 8-18 6-28Z" className="hm-island" />
      <text x="374" y="160" textAnchor="middle" className="bi-tiny">Japão</text>
      <path d="M548 176c4-3 8-1 7 3-2 3-6 3-7-3ZM560 184c3-2 6 0 5 3-2 2-5 1-5-3Z" className="hm-island" />
      <text x="556" y="206" textAnchor="middle" className="bi-tiny">Pearl Harbor</text>
      {[[520, 150], [488, 130], [456, 142], [424, 118]].map(([x, y], k) => <motion.circle key={k} cx={x} cy={y} r="4" className="hm-isle" initial={false}
        animate={{ scale: active === 2 ? [1, 1.6, 1] : 1 }} transition={p(0.4, active === 2 ? 1.2 + 0.25 * k : 0)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />)}
      <motion.path d="M398 104C440 86 520 110 544 164" className="hm-attack" markerEnd="url(#hm-ww-head)" initial={false}
        animate={{ pathLength: active === 2 ? 1 : 0, opacity: active === 2 ? 1 : 0 }} transition={p(0.7, 0.2)} />
      <motion.path d="M550 170L520 150L488 130L456 142L424 118L402 114" className="hm-hop" initial={false}
        animate={{ pathLength: active === 2 ? 1 : 0, opacity: active === 2 ? 1 : 0 }} transition={p(1.3, 1.1)} />
      {[[392, 124], [386, 136]].map(([x, y], k) => <motion.circle key={k} cx={x} cy={y} r="10" className="hm-blast" initial={false}
        animate={{ scale: active === 2 ? [0, 1.4, 1] : 0, opacity: active === 2 ? 1 : 0 }} transition={p(0.5, 1.5 + 0.2 * k)}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />)}
      <Layer on={active === 2} p={p} delay={0.4}>
        <text x="470" y="86" textAnchor="middle" className="bi-tiny">ataque de dez. 1941</text>
        <text x="466" y="226" textAnchor="middle" className="bi-hand-sm">de ilha em ilha</text>
        <text x="354" y="186" className="bi-tiny">ago. 1945</text>
      </Layer>
    </motion.g>

    {/* anos */}
    <path d={`M${WY(1939)} 290H${WY(1945.8)}`} className="bi-axis" />
    {[1939, 1940, 1941, 1942, 1943, 1944, 1945].map(y => <g key={y}>
      <path d={`M${WY(y)} 285v10`} className="bi-tick" />
      <text x={WY(y)} y="310" textAnchor="middle" className="bi-tiny">{y}</text>
    </g>)}
    {marks.map(([y, label, k]) => <g key={label}>
      <motion.circle cx={WY(y)} cy="290" r="5" className={active === k ? 'hm-tl-on' : 'hm-tl'} initial={false}
        animate={{ scale: active === k ? 1.3 : 1 }} transition={p(0.4)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
    </g>)}
    {['set. 1939 Polônia → 1940 França', '1941 Barbarossa → 1942–43 Stalingrado', '1941 Pearl Harbor → 1945 Hiroshima e Nagasaki'].map((line, k) => <Layer key={k} on={active === k} p={p} delay={0.3}>
      <text x="212" y="272" textAnchor="middle" className="bi-small bi-strong">{line}</text>
    </Layer>)}

    {/* o mundo de 1945 */}
    <motion.g initial={false} animate={{ opacity: active === 3 ? 1 : 0.35 }} transition={p(0.4)}>
      <rect x="400" y="256" width="192" height="84" rx="12" className="bi-panel" />
      <text x="412" y="274" className="bi-panel-title">1945 EM DIANTE</text>
      <circle cx="424" cy="298" r="10" className="hm-pole-a" />
      <circle cx="476" cy="298" r="10" className="hm-pole-b" />
      <motion.path d="M436 298h28" className="hm-tension" initial={false} animate={{ pathLength: active === 3 ? 1 : 0.3 }} transition={p(0.6, 0.3)} />
      <text x="424" y="324" textAnchor="middle" className="bi-tiny">EUA</text>
      <text x="476" y="324" textAnchor="middle" className="bi-tiny">URSS</text>
      <text x="498" y="296" className="bi-tiny">ONU com veto</text>
      <text x="498" y="310" className="bi-tiny">descolonização</text>
    </motion.g>
    <Layer on={active === 3} p={p} delay={0.4}>
      <text x="212" y="272" textAnchor="middle" className="bi-small bi-strong">70 a 85 milhões de mortos</text>
    </Layer>
    <text x="30" y="342" className="bi-foot">Mapas esquemáticos, sem escala.</text>
  </svg>;
}

// ---------------------------------------------------------------------------
// Guerra Fria: dois polos que nunca se tocam. O centro muda de recorte a
// recorte — o muro entre os blocos, as guerras em terceiros países, a órbita
// e a Lua, o terceiro grupo de Bandung — e a linha embaixo acende os anos.
// ---------------------------------------------------------------------------
const CY = (y: number) => 40 + (y - 1947) * (540 / 44);

export function ColdWar({ active }: Scene) {
  const p = usePaced();
  const ticks: [number, string, number][] = [[1949, 'Otan', 0], [1955, 'Varsóvia', 0], [1961, 'Muro', 0], [1950, 'Coreia', 1], [1962, 'Cuba', 1], [1957, 'Sputnik', 2], [1969, 'Apollo 11', 2], [1955.4, 'Bandung', 3]];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Guerra Fria: Estados Unidos e União Soviética, Otan e Pacto de Varsóvia, guerras por procuração, corrida espacial e os não alinhados de Bandung; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <ArrowHead id="hm-cw-head" />
    <text x="30" y="40" className="bi-kicker">GUERRA FRIA · 1947–1991</text>

    {/* os dois polos */}
    {[
      { x: 96, cls: 'hm-pole-a', name: 'EUA', model: ['capitalismo', 'liberal'], bloc: 'Otan · 1949', k: 0 },
      { x: 524, cls: 'hm-pole-b', name: 'URSS', model: ['socialismo de', 'planejamento estatal'], bloc: 'Pacto de Varsóvia · 1955', k: 1 },
    ].map(pole => <g key={pole.name}>
      <motion.circle cx={pole.x} cy="140" r="52" className="hm-bloc-ring" initial={false}
        animate={{ pathLength: active === 0 ? 1 : 0.0001, opacity: active === 0 ? 1 : 0 }} transition={p(0.9, active === 0 ? 0.3 + 0.9 * pole.k : 0)} />
      <circle cx={pole.x} cy="140" r="36" className={pole.cls} />
      <text x={pole.x} y="145" textAnchor="middle" className="hm-pole-text">{pole.name}</text>
      {[0, 1, 2, 3, 4].map(m => <motion.circle key={m} cx={pole.x + 44 * Math.cos(m * 1.26 + 0.4)} cy={140 + 44 * Math.sin(m * 1.26 + 0.4)} r="4"
        className={pole.cls} initial={false} animate={{ opacity: active === 0 ? 1 : 0.35 }} transition={p(0.3, active === 0 ? 0.6 + 0.9 * pole.k + 0.08 * m : 0)} />)}
      <text x={pole.x} y="210" textAnchor="middle" className="bi-tiny">{pole.model[0]}</text>
      <text x={pole.x} y="222" textAnchor="middle" className="bi-tiny">{pole.model[1]}</text>
      <Layer on={active === 0} p={p} delay={0.4 + 0.9 * pole.k}>
        <text x={pole.x} y="76" textAnchor="middle" className="bi-small bi-strong">{pole.bloc}</text>
      </Layer>
    </g>)}

    {/* 1 · o muro */}
    <Layer on={active === 0} p={p}>
      {[0, 1, 2, 3, 4].map(r => <motion.g key={r} initial={false} animate={{ opacity: active === 0 ? 1 : 0, y: active === 0 ? 0 : -10 }} transition={p(0.3, 1.6 + 0.12 * r)}>
        {[0, 1].map(c => <rect key={c} x={290 + c * 20 - (r % 2) * 10} y={176 - r * 12} width="20" height="12" className="hm-brick" />)}
      </motion.g>)}
      <text x="310" y="206" textAnchor="middle" className="bi-small bi-strong">Muro de Berlim · 1961</text>
      <Arrow d="M180 110C260 88 360 88 440 110" on={active === 0} p={p} head="hm-cw-head" delay={1.1} />
      <text x="310" y="84" textAnchor="middle" className="bi-hand-sm">Varsóvia responde à Otan</text>
    </Layer>

    {/* 2 · guerras por procuração e Cuba */}
    <Layer on={active === 1} p={p}>
      <circle cx="260" cy="210" r="7" className="hm-pin" />
      <circle cx="360" cy="210" r="7" className="hm-pin" />
      <text x="260" y="234" textAnchor="middle" className="bi-small bi-strong">Coreia</text>
      <text x="260" y="248" textAnchor="middle" className="bi-tiny">1950–1953</text>
      <text x="360" y="234" textAnchor="middle" className="bi-small bi-strong">Vietnã</text>
      <text x="360" y="248" textAnchor="middle" className="bi-tiny">1955–1975</text>
      {[[132, 164, 252, 204], [132, 164, 352, 204], [488, 164, 268, 204], [488, 164, 368, 204]].map(([x1, y1, x2, y2], k) => <motion.path key={k}
        d={`M${x1} ${y1}Q${(x1 + x2) / 2} ${y1 + 10} ${x2} ${y2}`} className={k < 2 ? 'hm-supply-a' : 'hm-supply-b'} initial={false}
        animate={{ pathLength: active === 1 ? 1 : 0 }} transition={p(0.8, 0.2 + 0.15 * k)} />)}
      <text x="310" y="134" textAnchor="middle" className="bi-hand-sm">armam lados opostos,</text>
      <text x="310" y="150" textAnchor="middle" className="bi-hand-sm">sem se enfrentar</text>
      <g transform="translate(178 96)">
        <path d="M-12 2c6-6 18-6 24 0-6 4-18 4-24 0Z" className="hm-island" />
        <motion.circle r="14" className="hm-spark" initial={false} animate={{ scale: active === 1 ? [0, 1.3, 0.6] : 0.6, opacity: active === 1 ? [0, 1, 0.3] : 0 }} transition={p(1.2, 1)} />
      </g>
      <text x="200" y="100" className="bi-tiny">Cuba 1962: à beira,</text>
      <text x="200" y="112" className="bi-tiny">resolvida na diplomacia</text>
    </Layer>

    {/* 3 · corrida espacial */}
    <Layer on={active === 2} p={p}>
      <circle cx="310" cy="196" r="26" className="hm-earth" />
      <path d="M298 184c6 2 8 8 4 12M318 204c4-4 10-2 10 4" className="hm-earth-line" />
      <ellipse cx="310" cy="196" rx="66" ry="38" className="hm-orbit" />
      <motion.g initial={false} animate={active === 2 ? { x: [-66, -47, 0, 47, 66], y: [0, 27, 38, 27, 0] } : { x: 66, y: 0 }} transition={p(2, 0.3)}>
        <g transform="translate(310 196)">
          <circle r="4" className="hm-pole-b" />
          <path d="M-3 -3l-7-7M3 -3l7-7M-3 3l-7 7M3 3l7 7" className="hm-antenna" />
        </g>
      </motion.g>
      <text x="310" y="256" textAnchor="middle" className="bi-small bi-strong">Sputnik · 1957</text>
      <circle cx="408" cy="82" r="16" className="hm-moon" />
      <circle cx="402" cy="78" r="3" className="hm-crater" /><circle cx="413" cy="88" r="2" className="hm-crater" />
      <motion.path d="M318 170C336 128 366 100 392 90" className="hm-apollo" initial={false}
        animate={{ pathLength: active === 2 ? 1 : 0 }} transition={p(1, 1.6)} />
      <text x="408" y="118" textAnchor="middle" className="bi-small bi-strong">Apollo 11 · 1969</text>
      <text x="310" y="280" textAnchor="middle" className="bi-hand-sm">prestígio exibido para o mundo</text>
    </Layer>

    {/* 4 · não alinhados */}
    <Layer on={active === 3} p={p}>
      <motion.circle cx="310" cy="190" r="34" className="hm-third" initial={false}
        animate={{ scale: active === 3 ? [0.6, 1] : 1 }} transition={p(0.6, 0.2)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
      <text x="310" y="186" textAnchor="middle" className="bi-small bi-strong">Bandung</text>
      <text x="310" y="200" textAnchor="middle" className="bi-tiny">1955</text>
      <text x="310" y="104" textAnchor="middle" className="bi-small">Nehru · Sukarno · Nasser</text>
      <text x="310" y="120" textAnchor="middle" className="bi-tiny">Índia · Indonésia · Egito</text>
      {[[276, 182, 150, 160], [344, 182, 470, 160]].map(([x1, y1, x2, y2], k) => <motion.path key={k} d={`M${x1} ${y1}L${x2} ${y2}`}
        className="hm-pull" initial={false} animate={{ pathLength: active === 3 ? 1 : 0 }} transition={p(0.8, 0.9 + 0.3 * k)} />)}
      <text x="310" y="248" textAnchor="middle" className="bi-hand-sm">na prática, apoio de um ou outro</text>
    </Layer>

    <path d={`M${CY(1947)} 300H${CY(1991)}`} className="bi-axis" />
    <text x={CY(1947)} y="290" textAnchor="middle" className="bi-tiny">1947</text>
    <text x={CY(1991)} y="290" textAnchor="middle" className="bi-tiny">1991</text>
    {ticks.map(([y, label, k]) => <motion.circle key={label} cx={CY(y)} cy="300" r="5" className={active === k ? 'hm-tl-on' : 'hm-tl'} initial={false}
      animate={{ scale: active === k ? 1.3 : 1 }} transition={p(0.4)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />)}
    {[0, 1, 2, 3].map(k => <Layer key={k} on={active === k} p={p} delay={0.2}>
      {ticks.filter(t => t[2] === k).map(([y, label]) => <text key={label} x={CY(y)} y="322" textAnchor="middle" className="bi-tiny bi-strong">{`${label} ${Math.floor(y)}`}</text>)}
    </Layer>)}
    <text x="30" y="342" className="bi-foot">Os polos nunca se tocam: a disputa passa por terceiros.</text>
  </svg>;
}

// ---------------------------------------------------------------------------
// América Latina no século XX: um mapa do Cone Sul ao lado das barras de cada
// regime no tempo. As barras se sobrepõem — é essa sobreposição que torna
// possível a Operação Condor — e terminam de dois jeitos diferentes.
// ---------------------------------------------------------------------------
const LX = (y: number) => 290 + (y - 1930) * (270 / 60);
const CHILE = 'M67.7 214.8L76 269L64 307L60 346L52 384L52 423L48 461L56 492L32 477L24 446L36 423L36 384L44 346L52 307L59.8 253L61.4 218Z';
const ARGENTINA = 'M76 269L87.5 249.5L125 246L150 262L190 278.7L174.4 307.2L158.6 311L155.4 337.2L150 352L127 376L103.3 399.6L83.5 430.4L71.7 468.9L75.6 492L56 492L48 461L52 423L52 384L60 346L64 307Z';
const URUGUAY = 'M158.6 311L174.4 307.2L196.4 328L191.8 338L174.4 345L160 341L155.4 337.2Z';
const REGIMES = [
  { name: 'Brasil', start: 1964, end: 1985, y: 140 },
  { name: 'Argentina', start: 1976, end: 1983, y: 176 },
  { name: 'Chile', start: 1973, end: 1990, y: 212 },
  { name: 'Uruguai', start: 1973, end: 1985, y: 248 },
];
const CAPITALS: [number, number][] = [[238.4, 197.9], [155.4, 342.6], [58.7, 333.8], [172.8, 344.9]];

export function LatinAmericaTwentieth({ active }: Scene) {
  const p = usePaced();
  const map = (x: number, y: number) => [40 + 0.56 * x, 40 + 0.56 * y];
  const dictatorship = active >= 1;
  return <svg viewBox="0 0 620 360" role="img" aria-label={`América Latina no século XX: populismos de Vargas, Perón e Cárdenas, ditaduras no Brasil, na Argentina, no Chile e no Uruguai, Operação Condor e as duas saídas da redemocratização; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">AMÉRICA LATINA · 1930–1990</text>

    <g transform="translate(40 40) scale(.56)">
      {[
        { d: BRAZIL, k: 0 }, { d: ARGENTINA, k: 1 }, { d: CHILE, k: 2 }, { d: URUGUAY, k: 3 },
      ].map(({ d, k }) => <g key={k}>
        <path d={d} className="hm-map-country" />
        <motion.path d={d} className="hm-map-country hm-map-regime" initial={false}
          animate={{ opacity: dictatorship ? 1 : 0 }} transition={p(0.6, active === 1 ? 0.3 + 0.2 * k : 0)} />
      </g>)}
    </g>
    <text x="172" y="128" textAnchor="middle" className="bi-tiny">Brasil</text>
    <text x="104" y="252" textAnchor="middle" className="bi-tiny">Argentina</text>
    <text x="52" y="290" textAnchor="end" className="bi-tiny">Chile</text>
    <text x="154" y="246" className="bi-tiny">Uruguai</text>

    <Layer on={active === 2} p={p}>
      {[[0, 1], [1, 2], [2, 0], [3, 1]].map(([a, b], k) => {
        const [x1, y1] = map(...CAPITALS[a]); const [x2, y2] = map(...CAPITALS[b]);
        return <motion.path key={k} d={`M${x1} ${y1}Q${(x1 + x2) / 2 + 30} ${(y1 + y2) / 2 - 30} ${x2} ${y2}`} className="hm-condor" initial={false}
          animate={{ pathLength: active === 2 ? 1 : 0 }} transition={p(0.8, 0.3 + 0.25 * k)} />;
      })}
      {CAPITALS.map((c, k) => { const [x, y] = map(...c); return <circle key={k} cx={x} cy={y} r="3.5" className="hm-pin" />; })}
      <text x="150" y="300" textAnchor="middle" className="bi-hand-sm">além das fronteiras</text>
    </Layer>

    {/* barras no tempo */}
    <rect x="270" y="56" width="328" height="252" rx="14" className="bi-panel" />
    <text x={LX(1930)} y="78" className="bi-tiny bi-strong">populismos · 1930–1960</text>
    <motion.rect x={LX(1930)} y="84" width={LX(1960) - LX(1930)} height="20" rx="7" className="hm-populism" initial={false}
      animate={{ opacity: active === 0 ? 1 : 0.35 }} transition={p(0.4)} />
    <text x={(LX(1930) + LX(1960)) / 2} y="98" textAnchor="middle" className="hm-bar-sub">Vargas · Perón · Cárdenas</text>
    <Layer on={active === 0} p={p} delay={0.3}>
      <g transform={`translate(${LX(1966)} 136)`}>
        <path d="M-12 12v-14l6-4v4l6-4v4l6-4v18Z" className="bi-factory" />
        <path d="M6 12v-20h5v20" className="bi-factory" />
      </g>
      <text x={LX(1966) + 20} y="128" className="bi-tiny">indústria para</text>
      <text x={LX(1966) + 20} y="140" className="bi-tiny">substituir</text>
      <text x={LX(1966) + 20} y="152" className="bi-tiny">importações</text>
      <text x="500" y="204" textAnchor="middle" className="bi-hand-sm">fala direto ao</text>
      <text x="500" y="220" textAnchor="middle" className="bi-hand-sm">trabalhador urbano</text>
    </Layer>
    <path d={`M${LX(1959)} 110v176`} className="bi-marker" />
    <text x={LX(1959) - 4} y="298" textAnchor="end" className="bi-tiny">Cuba 1959</text>

    {REGIMES.map((r, k) => {
      const abrupt = r.name === 'Argentina';
      const gradual = r.name === 'Brasil';
      return <g key={r.name}>
        <text x="284" y={r.y + 4} className="bi-tiny bi-strong">{r.name}</text>
        <motion.rect x={LX(r.start)} y={r.y - 9} height="18" rx="4" className={abrupt && active === 3 ? 'hm-regime-bar hm-regime-hot' : 'hm-regime-bar'} initial={false}
          animate={{ width: dictatorship ? LX(r.end) - LX(r.start) : 0, opacity: active === 0 ? 0 : active === 3 && !gradual && !abrupt ? 0.35 : 1 }}
          transition={p(0.8, active === 1 ? 0.2 + 0.2 * k : 0)} />
        <Layer on={active === 1 || active === 2} p={p} delay={0.6 + 0.2 * k}>
          <text x={LX(r.start) - 4} y={r.y + 4} textAnchor="end" className="bi-tiny">{r.start}</text>
          <text x={LX(r.end) + 4} y={r.y + 4} className="bi-tiny">{r.end}</text>
        </Layer>
      </g>;
    })}
    <Layer on={active === 2} p={p} delay={0.4}>
      <rect x={LX(1976)} y="124" width={LX(1983) - LX(1976)} height="144" rx="4" className="hm-overlap" />
    </Layer>
    <Layer on={active === 3} p={p}>
      <motion.path d={`M${LX(1985)} 131L${LX(1989)} 131`} className="hm-ramp" initial={false} animate={{ pathLength: active === 3 ? 1 : 0 }} transition={p(0.8, 0.4)} />
      <circle cx={LX(1989)} cy="131" r="4" className="hm-pin" />
      <text x={LX(1989) - 4} y="116" textAnchor="middle" className="bi-tiny bi-strong">1989 direta</text>
      <path d={`M${LX(1982)} 176l4-6 3 10 4-8 3 6`} className="bi-crack" />
      <text x={LX(1982)} y="198" textAnchor="middle" className="bi-tiny bi-strong">Malvinas 1982</text>
      <text x="500" y="280" textAnchor="middle" className="bi-hand-sm">negociada × colapso</text>
    </Layer>

    <text x="30" y="342" className="bi-foot">Mapa esquemático; as barras usam as datas do resumo.</text>
  </svg>;
}

// ---------------------------------------------------------------------------
// Disputas europeias: o litoral português contestado três vezes. Os navios
// chegam a Guanabara, à Bahia e a Pernambuco; o último parte com o açúcar
// para o Caribe. A linha de baixo põe a União Ibérica no lugar certo.
// ---------------------------------------------------------------------------
const DY = (y: number) => 40 + (y - 1550) * (540 / 110);
const toBr = (x: number, y: number): [number, number] => [40 + 0.72 * x, 38 + 0.72 * y];
const SITES: [number, number][] = [toBr(275.5, 252.5), toBr(312.6, 176.1), toBr(341.1, 138.2), toBr(341.1, 138.2)];

function Ship({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-14 4h28l-6 8h-16Z" className="bi-ship" />
    <path d="M0 4v-22M0 -18l10 10H0M0 -6l-8 8H0" className="hm-sail" />
  </g>;
}

export function ColonialDisputes({ active }: Scene) {
  const p = usePaced();
  const [sx, sy] = SITES[active];
  const focus = Math.min(active, 2);
  const panel = [
    { title: 'FRANÇA ANTÁRTICA', date: '1555–1567 · Guanabara', lines: ['Villegagnon', 'pau-brasil', 'refúgio calvinista', 'aliança com tupinambás'], hand: 'primeira contestação' },
    { title: 'UNIÃO IBÉRICA', date: '1580–1640', lines: ['Portugal sob a Coroa', 'espanhola', 'Províncias Unidas × Espanha', 'Bahia 1624–25: repelida'], hand: 'alvo, na visão holandesa' },
    { title: 'PERNAMBUCO', date: 'desde 1630 · Nassau 1637–44', lines: ['Recife: obras, ciência', 'e pintura', 'tolerância religiosa', 'quase duas décadas e meia'], hand: 'Recife floresce' },
    { title: 'EXPULSÃO · 1654', date: 'Insurreição desde 1645', lines: ['Henrique Dias', 'Filipe Camarão', 'Companhia em desgaste', 'açúcar vai ao Caribe'], hand: 'nasce um concorrente' },
  ][active];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Disputas europeias no Brasil colonial: França Antártica na Guanabara, invasão holandesa da Bahia, Pernambuco sob Nassau e a expulsão de 1654 com o açúcar indo ao Caribe; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <ArrowHead id="hm-cd-head" />
    <text x="30" y="40" className="bi-kicker">LITORAL DISPUTADO · SÉCULOS XVI E XVII</text>

    <g transform="translate(40 38) scale(.72)">
      <path d={BRAZIL} className="bi-land" />
      <motion.path d="M300 108L346 121L349 139L334 160L312 152Z" className="hm-dutch" initial={false}
        animate={{ opacity: active === 2 ? 0.75 : active === 3 ? 0.25 : 0 }} transition={p(0.8, active === 2 ? 0.8 : 0)} />
    </g>
    <path d="M312 206c10-6 22-6 30 0M324 222c10-6 22-6 30 0" className="hm-wave" />
    <text x="340" y="246" textAnchor="middle" className="hm-ocean">Atlântico</text>
    {(['Guanabara', 'Salvador', 'Recife'] as const).map((name, k) => <g key={name}>
      <motion.circle cx={SITES[k][0]} cy={SITES[k][1]} r="5" className={k === focus ? 'hm-pin' : 'hm-pin hm-pin-off'} initial={false}
        animate={{ scale: k === focus ? 1.3 : 1 }} transition={p(0.4)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
      <text x={SITES[k][0] - 10} y={SITES[k][1] + 4} textAnchor="end" className={k === focus ? 'bi-small bi-strong' : 'bi-tiny'}>{name}</text>
    </g>)}

    {/* navio que chega, que é repelido ou que parte */}
    <motion.g key={`ship-${active}`} initial={{ x: 60, y: 0, opacity: 0 }}
      animate={active === 1 ? { x: [60, 16, 16, 60], opacity: [0, 1, 1, 0.5] } : active === 3 ? { x: [16, 24, 30], y: [0, -24, -60], opacity: [1, 1, 0] } : { x: 16, y: 0, opacity: 1 }}
      transition={p(active === 1 ? 2.2 : 1.4, 0.2)}>
      <Ship x={sx} y={sy} s={0.9} />
    </motion.g>
    <Layer on={active === 0} p={p} delay={0.6}>
      <g transform={`translate(${SITES[0][0] - 44} ${SITES[0][1] + 20})`}>
        {[0, 1, 2].map(k => <path key={k} d={`M${k * 6} ${k * 5}h22`} className="hm-log" />)}
      </g>
      <text x={SITES[0][0] - 28} y={SITES[0][1] + 48} textAnchor="middle" className="bi-tiny">pau-brasil</text>
    </Layer>
    <Layer on={active === 1} p={p} delay={1.4}>
      <text x={SITES[1][0] + 26} y={SITES[1][1] + 30} textAnchor="middle" className="bi-hand-sm">repelida</text>
    </Layer>
    <Layer on={active === 3} p={p} delay={0.3}>
      <motion.path d={`M${SITES[2][0]} ${SITES[2][1] - 8}C${SITES[2][0] + 10} 60 200 44 104 58`} className="hm-sugar-route" markerEnd="url(#hm-cd-head)" initial={false}
        animate={{ pathLength: active === 3 ? 1 : 0 }} transition={p(1.4, 0.8)} />
      <rect x="40" y="48" width="58" height="20" rx="6" className="hm-chip" />
      <text x="69" y="62" textAnchor="middle" className="hm-chip-text">Caribe</text>
      {[0, 1, 2].map(k => <motion.rect key={k} width="7" height="7" rx="1.5" className="hm-sugar" initial={false}
        animate={active === 3 ? { x: [SITES[2][0] - 3, 200 - k * 30, 120], y: [SITES[2][1] - 12, 50 + k * 2, 56], opacity: [0, 1, 0] } : { x: 120, y: 56, opacity: 0 }}
        transition={p(1.8, 1 + 0.3 * k)} />)}
    </Layer>

    <rect x="380" y="56" width="212" height="214" rx="14" className="bi-panel" />
    <text x="394" y="80" className="bi-panel-title">{panel.title}</text>
    <text x="394" y="98" className="bi-tiny">{panel.date}</text>
    {panel.lines.map((line, k) => <motion.text key={`${active}-${k}`} x="394" y={124 + k * 22} className="bi-small"
      initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={p(0.4, 0.15 * k)}>{line}</motion.text>)}
    <motion.text key={`hand-${active}`} x="394" y="248" className="bi-hand-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4, 0.8)}>{panel.hand}</motion.text>
    <motion.g key={`icon-${active}`} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={p(0.5, 0.5)}
      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
      <g transform="translate(560 226) scale(1.3)">
        {active === 0 && <><path d="M-14 8h26M-10 1h26M-14 -6h26" className="hm-log" /><circle cx="12" cy="8" r="2.4" className="hm-log-end" /><circle cx="16" cy="1" r="2.4" className="hm-log-end" /><circle cx="12" cy="-6" r="2.4" className="hm-log-end" /></>}
        {active === 1 && <><path d="M-18 4l2-10 4 4 3-6 3 6 4-4 2 10Z" className="bi-crown" /><path d="M2 4l2-10 4 4 3-6 3 6 4-4 2 10Z" className="bi-crown" /><path d="M-2 0h4" className="bi-icon" /></>}
        {active === 2 && <><path d="M-14 12v-22h28v22Z" className="bi-canvas" /><path d="M-10 4c4-6 8-2 10-6s8-2 10 2" className="bi-paint" /><path d="M-8 -4l3-3 3 3" className="bi-paint" /></>}
        {active === 3 && <><path d="M-12 12c-7 0-8-16 0-18 8 2 7 18 0 18Z" className="bi-sack-big" /><path d="M-12 -6v-3" className="bi-sack-tie" /><path d="M8 12c-7 0-8-16 0-18 8 2 7 18 0 18Z" className="bi-sack-big" /><path d="M8 -6v-3" className="bi-sack-tie" /></>}
      </g>
    </motion.g>

    {/* linha do tempo */}
    <path d={`M${DY(1550)} 306H${DY(1660)}`} className="bi-axis" />
    <rect x={DY(1580)} y="298" width={DY(1640) - DY(1580)} height="16" rx="4" className="hm-union" />
    <text x={(DY(1580) + DY(1640)) / 2} y="310" textAnchor="middle" className="hm-union-text">União Ibérica 1580–1640</text>
    {[[1555, 1567, 0], [1624, 1625, 1], [1630, 1654, 2], [1645, 1654, 3]].map(([a, b, k]) => <motion.rect key={k} x={DY(a)} y={k === 3 ? 320 : 318} width={Math.max(DY(b) - DY(a), 5)} height={k === 3 ? 6 : 10} rx="3"
      className={active === k ? 'hm-span-on' : 'hm-span'} initial={false} animate={{ opacity: active === k ? 1 : 0.5 }} transition={p(0.4)} />)}
    {[1550, 1600, 1650].map(y => <text key={y} x={DY(y)} y="292" textAnchor="middle" className="bi-tiny">{y}</text>)}
    <text x="30" y="344" className="bi-foot">Mapa esquemático; cada faixa da linha é um período do resumo.</text>
  </svg>;
}

export const SCENES_LOTE13: Record<string, React.ComponentType<Scene>> = {
  'summary-historia-introducao-a-historia-e-primeiras-civilizacoes': FirstCities,
  'summary-historia-america-no-seculo-xix': AmericasNineteenth,
  'summary-historia-grandes-revolucoes-do-seculo-xx': CenturyRevolutions,
  'summary-historia-segunda-guerra-mundial-1939-1945': WorldWarTwo,
  'summary-historia-guerra-fria': ColdWar,
  'summary-historia-america-latina-no-seculo-xx': LatinAmericaTwentieth,
  'summary-historia-disputas-europeias-no-brasil-colonial': ColonialDisputes,
};
export const HEADERS_LOTE13: Record<string, string> = {
  'summary-historia-introducao-a-historia-e-primeiras-civilizacoes': 'do excedente à cidade',
  'summary-historia-america-no-seculo-xix': 'mapa em transformação',
  'summary-historia-grandes-revolucoes-do-seculo-xx': 'base social comparada',
  'summary-historia-segunda-guerra-mundial-1939-1945': 'duas frentes',
  'summary-historia-guerra-fria': 'rivalidade sem confronto direto',
  'summary-historia-america-latina-no-seculo-xx': 'regimes no tempo',
  'summary-historia-disputas-europeias-no-brasil-colonial': 'litoral disputado',
};
