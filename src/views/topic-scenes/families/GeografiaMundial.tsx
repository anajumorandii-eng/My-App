import React from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import { Arrow, ArrowHead, Person, type Scene } from './cenaKit';
import './GeografiaMundial.css';

function usePaced() {
  const t = useSceneMotion();
  return (duration: number, delay = 0) => (t.duration === 0 ? t : { ...t, duration, delay });
}

// Lote 9 da régua de História e Geografia: clima, relevo e biogeografia em
// escala mundial. O Lote 3 (GeografiaFisica) já desenhou o Brasil em mapa,
// perfil e coluna de solo; aqui a escala é o planeta, então as composições são
// outras — corte de continente com os cinco fatores do clima, bloco da América
// do Sul de oeste a leste, faixa de latitudes com a célula de Hadley, o Nilo de
// montante a jusante e uma mesma paisagem lida por três correntes. Tudo que é
// nome, número ou exemplo vem do resumo do capítulo; o que é só desenho diz
// "sem escala" no próprio kicker.

type Paced = ReturnType<typeof usePaced>;

function Thermo({ x, y, level, from, on, p }: { x: number; y: number; level: number; from: number; on: boolean; p: Paced }) {
  const h = (f: number) => 32 * f;
  return <g>
    <rect x={x - 4.5} y={y} width="9" height="38" rx="4.5" className="gm-thermo" />
    <motion.rect x={x - 2} width="4" rx="2" className="gm-mercury" initial={false}
      animate={on ? { y: [y + 36 - h(from), y + 36 - h(level)], height: [h(from), h(level)] } : { y: y + 36 - h(level), height: h(level) }}
      transition={p(1.4, on ? 0.5 : 0)} />
    <circle cx={x} cy={y + 42} r="6.5" className="gm-mercury" />
  </g>;
}

// Clima mundial: o mesmo corte recebe um fator por recorte, e o último acende
// todos e os liga ao mesmo ponto — é a tese do capítulo ("nenhum desses
// fatores atua isoladamente"), e a cena a desenha como convergência.
const CLIMATE_CHIPS = [
  { x: 30, w: 92, label: 'latitude', icon: 'M-7 0h14M-5.6 -4h11.2M-5.6 4h11.2' },
  { x: 135, w: 92, label: 'altitude', icon: 'M-8 6L-2 -6L2 0L4 -3L9 6Z' },
  { x: 240, w: 143, label: 'continentalidade', icon: 'M-8 5v-6l4-4 4 4v6ZM2 5q2-2 3.5 0t3.5 0' },
  { x: 396, w: 99, label: 'correntes', icon: 'M-8 -1q4-4 8 0t8 0M-8 5q4-4 8 0t8 0' },
  { x: 508, w: 80, label: 'relevo', icon: 'M-9 7l6-8 3 3 3-5 6 10Z' },
];

export function ClimateFactors({ active }: Scene) {
  const p = usePaced();
  const lit = [[0], [1], [2, 3], [0, 1, 2, 3, 4]][active] ?? [];
  const show = (k: number) => ({ initial: false as const, animate: { opacity: active === k ? 1 : 0 }, transition: p(0.4, active === k ? 0.2 : 0) });
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Fatores do clima em corte esquemático: latitude, altitude, continentalidade, correntes marítimas e relevo agindo juntos sobre o mesmo ponto; recorte ${active + 1} em foco`}>
    <ArrowHead id="gm-clima-head" />
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">FATORES DO CLIMA · CORTE SEM ESCALA</text>

    <rect x="10" y="236" width="140" height="48" className="gm-sea" />
    <path d="M140 284V238Q146 232 156 232L290 225L338 170L380 112L404 142L426 176L456 214L610 220V284Z" className="gm-land" />
    <path d="M366 131L380 112L394 130L387 126L380 133L373 127Z" className="gm-snow" />
    {[164, 182].map((x, k) => <path key={x} d={`M${x} 231v-12l7-6 7 6v12Z`} className="bi-house" transform={k ? 'translate(0 -1)' : undefined} />)}
    {[522, 540].map(x => <path key={x} d={`M${x} 219v-12l7-6 7 6v12Z`} className="bi-house" />)}

    <motion.g initial={false} animate={{ opacity: active === 0 || active === 3 ? 1 : 0.4 }} transition={p(0.4)}>
      <defs><clipPath id="gm-globe-clip"><circle cx="84" cy="108" r="36" /></clipPath></defs>
      <circle cx="84" cy="108" r="36" className="gm-globe" />
      <g clipPath="url(#gm-globe-clip)">
        <rect x="40" y="70" width="90" height="14" className="gm-cold-cap" />
        <rect x="40" y="132" width="90" height="14" className="gm-cold-cap" />
        <motion.rect x="40" width="90" className="gm-warm-band" initial={false}
          animate={{ y: active === 0 ? [104, 96] : 96, height: active === 0 ? [8, 24] : 24 }} transition={p(0.8, 0.9)} />
      </g>
      <path d="M48 108h72" className="gm-equator" />
      <circle cx="212" cy="108" r="12" className="gm-sun" />
      {[80, 108, 136].map((y, k) => <motion.path key={y} d={`M198 ${y}H${y === 108 ? 124 : 110}`} className="gm-ray" initial={false}
        animate={{ pathLength: active === 0 ? [0, 1] : 1 }} transition={p(0.7, active === 0 ? 0.1 + k * 0.15 : 0)} />)}
    </motion.g>
    <motion.g {...show(0)}>
      <text x="30" y="164" className="bi-small bi-strong">raio a pino: mais energia</text>
      <text x="30" y="180" className="bi-small">raio inclinado: menos energia</text>
    </motion.g>

    <Thermo x={250} y={176} level={0.8} from={0.8} on={false} p={p} />
    <Thermo x={316} y={88} level={0.28} from={0.8} on={active === 1} p={p} />
    <motion.g initial={false} animate={active === 1 ? { x: [300, 334], y: [192, 154], opacity: 1 } : { x: 334, y: 154, opacity: 0 }} transition={p(1.4, 0.3)}>
      <Person x={0} y={0} s={0.6} coat="bi-coat-army" />
    </motion.g>
    <motion.g {...show(1)}>
      <text x="420" y="78" className="bi-hand-sm">quanto mais alto, mais frio:</text>
      <text x="420" y="96" className="bi-hand-sm">o ar rarefeito retém</text>
      <text x="420" y="114" className="bi-hand-sm">menos calor</text>
    </motion.g>

    {[246, 258].map((y, k) => <motion.path key={y} d={`M${130 - k * 12} ${y}C100 ${y - 6} 60 ${y + 6} ${24 + k * 8} ${y}`} className="gm-current" markerEnd="url(#gm-clima-head)" initial={false}
      animate={{ pathLength: active === 2 ? [0, 1] : 1, opacity: active === 2 || active === 3 ? 1 : 0.35 }} transition={p(1, active === 2 ? k * 0.25 : 0)} />)}
    <text x="80" y="277" textAnchor="middle" className="gm-sea-text">corrente fria</text>
    <motion.g {...show(2)}>
      <path d="M204 146v64" className="gm-amp-track" />
      <motion.path d="M204 170v16" className="gm-amp" initial={false} animate={{ pathLength: active === 2 ? [0, 1] : 1 }} transition={p(0.8, 0.5)} />
      <text x="194" y="164" textAnchor="end" className="bi-small bi-strong">no litoral, o mar</text>
      <text x="194" y="180" textAnchor="end" className="bi-small">modera: amplitude</text>
      <text x="194" y="196" textAnchor="end" className="bi-small">térmica menor</text>
      <path d="M590 144v70" className="gm-amp-track" />
      <motion.path d="M590 148v62" className="gm-amp" initial={false} animate={{ pathLength: active === 2 ? [0, 1] : 1 }} transition={p(1.1, 0.7)} />
      <text x="578" y="160" textAnchor="end" className="bi-small bi-strong">no interior,</text>
      <text x="578" y="176" textAnchor="end" className="bi-small">amplitude maior</text>
      <text x="30" y="218" className="bi-hand-sm">fria: ar seco (Atacama)</text>
    </motion.g>

    <motion.g {...show(3)}>
      <Arrow d="M160 198C230 188 262 150 300 104S410 64 468 170" on={active === 3} p={p} head="gm-clima-head" delay={0.2} />
      <path d="M340 72a10 10 0 0 1 18-6a12 12 0 0 1 22 4a8 8 0 0 1 0 16h-38a8 8 0 0 1-2-14Z" className="gm-cloud" />
      {[348, 360, 372].map((x, k) => <motion.path key={x} d={`M${x} 94l-4 12`} className="gm-rain" initial={false}
        animate={active === 3 ? { y: [-8, 0], opacity: [0, 1] } : { y: 0, opacity: 0 }} transition={p(0.6, 0.6 + k * 0.15)} />)}
      <text x="232" y="152" textAnchor="end" className="bi-small bi-strong">barlavento: chuva</text>
      <text x="484" y="116" className="bi-small bi-strong">sotavento:</text>
      <text x="484" y="132" className="bi-small">sombra de chuva</text>
      {CLIMATE_CHIPS.map((c, k) => <motion.path key={c.label} d={`M${c.x + c.w / 2} 296Q${(c.x + c.w / 2 + 584) / 2} ${250 - k * 4} 584 214`} className="gm-link" initial={false}
        animate={{ pathLength: active === 3 ? [0, 1] : 1 }} transition={p(0.7, active === 3 ? 0.8 + k * 0.1 : 0)} />)}
      <path d="M584 214c-7-8-9-12-9-16a9 9 0 0 1 18 0c0 4-2 8-9 16Z" className="gm-pin" />
      <text x="600" y="182" textAnchor="end" className="bi-hand-sm">clima real</text>
    </motion.g>

    {CLIMATE_CHIPS.map((c, k) => {
      const on = lit.includes(k);
      return <motion.g key={c.label} initial={false} animate={{ y: on ? -2 : 0 }} transition={p(0.4, on ? 0.1 * k : 0)}>
        <rect x={c.x} y="298" width={c.w} height="30" rx="15" className={on ? 'gm-chip gm-chip-on' : 'gm-chip'} />
        <path transform={`translate(${c.x + 18} 313)`} d={c.icon} className={on ? 'gm-chip-icon gm-chip-icon-on' : 'gm-chip-icon'} />
        <text x={c.x + 32} y="317" className={on ? 'gm-chip-text gm-chip-text-on' : 'gm-chip-text'}>{c.label}</text>
      </motion.g>;
    })}
  </svg>;
}

// Geomorfologia mundial: um bloco da América do Sul de oeste a leste junta, no
// mesmo recorte de crosta, os três exemplos que o resumo dá — Andes, Bacia
// Amazônica, Escudo Brasileiro. Em cada recorte age o processo que dá idade à
// estrutura: erosão longa no cráton, camadas empilhadas na bacia, subducção
// levantando a cordilheira.
const FRONT = 'M30 190H118L126 226L136 200L166 140L186 104L196 92L208 106L232 150L262 196L346 202L430 198Q450 186 468 192T506 188T540 194T560 190';
const CARDS = [
  { x: 30, title: 'Dobras modernas', lines: ['dezenas de milhões de anos', 'ativas: sismos e vulcões'], idx: 2 },
  { x: 220, title: 'Bacias sedimentares', lines: ['camadas por milhões de anos', 'sobre rochas mais antigas'], idx: 1 },
  { x: 410, title: 'Crátons', lines: ['formados há bilhões de anos', 'estáveis e muito erodidos'], idx: 0 },
];

export function StructureBlock({ active }: Scene) {
  const p = usePaced();
  const show = (k: number) => ({ initial: false as const, animate: { opacity: active === k ? 1 : 0 }, transition: p(0.4, active === k ? 0.3 : 0) });
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Estruturas do relevo em bloco da América do Sul: dobras modernas nos Andes, bacia sedimentar amazônica e cráton do Escudo Brasileiro; recorte ${active + 1} em foco`}>
    <ArrowHead id="gm-geo-head" />
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">AMÉRICA DO SUL, OESTE → LESTE · SEM ESCALA</text>

    <path d={`${FRONT}V272H30Z`} transform="translate(26 -18)" className="gm-block-top" />
    <path d="M30 190H118L126 226L30 214Z" transform="translate(26 -18)" className="gm-ocean gm-ocean-back" />
    <path d="M560 190l26 -18V272l-26 18Z" className="gm-block-side" />
    <path d={`${FRONT}V290H30Z`} className="gm-crust" />
    <path d="M30 190H118L126 226L30 214Z" className="gm-ocean" />
    <path d="M30 214L126 226L300 290H244L116 244L30 236Z" className="gm-slab" />
    <text x="40" y="229" className="gm-slab-text">placa de Nazca</text>

    <motion.g initial={false} animate={{ opacity: active === 0 ? 1 : 0.55 }} transition={p(0.4)}>
      {[[446, 214], [476, 238], [506, 214], [530, 250], [458, 266], [512, 276], [544, 226]].map(([x, y], k) =>
        <path key={k} d={`M${x - 10} ${y}q5-6 10 0t10 0`} className="gm-foliation" />)}
    </motion.g>
    <motion.path d="M430 198L452 128L470 160L492 112L516 150L534 124L560 190" className="gm-ghost" initial={false}
      animate={{ opacity: active === 0 ? [1, 1, 0.25] : 0 }} transition={p(2.2, 0.2)} />
    {[0, 1, 2, 3].map(k => <motion.circle key={k} r="2.6" className="gm-grain" initial={false}
      animate={active === 0 ? { cx: [460 + k * 22, 470 + k * 22], cy: [140 + (k % 2) * 10, 188], opacity: [1, 0] } : { cx: 460, cy: 140, opacity: 0 }}
      transition={p(1.2, 0.4 + k * 0.2)} />)}
    <motion.g {...show(0)}>
      <text x="495" y="100" textAnchor="middle" className="bi-hand-sm">bilhões de anos de</text>
      <text x="495" y="116" textAnchor="middle" className="bi-hand-sm">erosão: relevo baixo</text>
    </motion.g>

    <defs><clipPath id="gm-basin-clip"><path d="M262 198Q346 208 430 200Q396 262 318 256Q274 238 262 198Z" /></clipPath></defs>
    <path d="M262 198Q346 208 430 200Q396 262 318 256Q274 238 262 198Z" className="gm-basin" />
    {[0, 1, 2, 3].map(k => <motion.path clipPath="url(#gm-basin-clip)" key={k} d={`M${272 + k * 5} ${246 - k * 12}Q346 ${254 - k * 12} ${420 - k * 4} ${238 - k * 12}`} className={`gm-strata gm-strata-${k % 2}`}
      initial={false} animate={{ pathLength: active === 1 ? [0, 1] : 1, opacity: active === 1 ? [0, 1] : 0.7 }} transition={p(0.6, active === 1 ? 0.3 + k * 0.35 : 0)} />)}
    <motion.g {...show(1)}>
      <path d="M300 172q10-7 20 0t20 0t20 0t20 0" className="gm-wave" />
      <text x="346" y="140" textAnchor="middle" className="bi-hand-sm">onde houve mares</text>
      <text x="346" y="156" textAnchor="middle" className="bi-hand-sm">rasos ou grandes rios</text>
    </motion.g>

    <motion.path d="M196 92L186 104L166 140L136 200L262 196L232 150L208 106Z" className="gm-andes" initial={false}
      animate={{ scaleY: active === 2 ? [0.82, 1] : 1 }} transition={p(1.4, 0.5)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }} />
    <path d="M190 97h12" className="gm-crater" />
    <ellipse cx="198" cy="206" rx="14" ry="6" className="gm-chamber" />
    <motion.path d="M198 200Q192 150 196 96" className="gm-magma" initial={false} animate={{ pathLength: active === 2 ? [0, 1] : 1, opacity: active === 2 ? 1 : 0.4 }} transition={p(1, 0.9)} />
    <motion.g {...show(2)}>
      <motion.g initial={false} animate={{ x: active === 2 ? [-14, 0] : 0 }} transition={p(1.2, 0.2)}>
        <Arrow d="M140 243L196 264" on={active === 2} p={p} head="gm-geo-head" delay={0.2} />
      </motion.g>
      {[0, 1, 2].map(k => <motion.circle key={k} r={5 + k * 2} className="gm-smoke" initial={false}
        animate={active === 2 ? { cx: [196, 204 + k * 12], cy: [88, 78 - k * 8], opacity: [0, 1] } : { cx: 196, cy: 80, opacity: 0 }} transition={p(0.8, 1.6 + k * 0.2)} />)}
      <path d="M126 236l6-6 4 8 6-8 4 6" className="gm-quake" />
      <text x="28" y="112" className="bi-hand-sm">Nazca mergulha</text>
      <text x="28" y="128" className="bi-hand-sm">sob a Sul-Americana</text>
    </motion.g>

    <text x="176" y="90" textAnchor="end" className={active === 2 ? 'bi-label bi-on' : 'bi-label'}>Andes</text>
    <text x="346" y="188" textAnchor="middle" className={active === 1 ? 'bi-small bi-strong gm-on' : 'bi-small bi-strong'}>Bacia Amazônica</text>
    <text x="495" y="176" textAnchor="middle" className={active === 0 ? 'bi-small bi-strong gm-on' : 'bi-small bi-strong'}>Escudo Brasileiro</text>
    <text x="72" y="182" textAnchor="middle" className="bi-tiny">Pacífico</text>

    {CARDS.map(c => {
      const on = active === c.idx;
      return <g key={c.title}>
        <rect x={c.x} y="298" width="180" height="46" rx="10" className={on ? 'gm-card gm-card-on' : 'gm-card'} />
        <text x={c.x + 12} y="314" className={on ? 'bi-small bi-strong gm-on' : 'bi-small bi-strong'}>{c.title}</text>
        {c.lines.map((line, k) => <text key={line} x={c.x + 12} y={327 + k * 12} className="bi-tiny">{line}</text>)}
      </g>;
    })}
  </svg>;
}

// Biogeografia mundial: a faixa vai do equador ao polo com os seis biomas do
// resumo. A célula de Hadley desenhada em cima é o que desfaz a pegadinha do
// "acaso": o ar que chove no equador é o mesmo que desce seco perto de 30°.
const lat = (d: number) => 60 + d * 5.6;
const BIOMES = [
  { x: 86, name: ['floresta', 'tropical'] },
  { x: 160, name: ['savana'] },
  { x: lat(30), name: ['deserto'] },
  { x: 330, name: ['floresta', 'temperada'] },
  { x: 430, name: ['taiga'] },
  { x: 526, name: ['tundra'] },
];

function BiomeIcon({ k }: { k: number }) {
  if (k === 0) return <g>{[-18, 0, 18].map((dx, i) => <g key={dx}>
    <path d={`M${dx} 0v-${30 + (i % 2) * 12}`} className="gm-trunk" />
    <circle cx={dx} cy={-34 - (i % 2) * 12} r={12 + (i % 2) * 2} className="gm-canopy" />
  </g>)}</g>;
  if (k === 1) return <g>
    <path d="M2 0v-22" className="gm-trunk" /><path d="M-16 -22q18-12 36 0Z" className="gm-canopy-dry" />
    {[-20, -8, 14, 22].map(dx => <path key={dx} d={`M${dx} 0l-3-8M${dx} 0l0-9M${dx} 0l3-8`} className="gm-grass" />)}
  </g>;
  if (k === 2) return <g>
    <path d="M-30 0q14-14 28-4t30 4Z" className="gm-dune" />
    <path d="M10 -2v-26m0 10h-7v-8m7 12h7v-10" className="gm-cactus" />
  </g>;
  if (k === 3) return <g>{[-14, 14].map(dx => <g key={dx}>
    <path d={`M${dx} 0v-22`} className="gm-trunk" />
    <ellipse cx={dx} cy={-30} rx="11" ry="13" className={dx < 0 ? 'gm-canopy-autumn' : 'gm-canopy'} />
  </g>)}</g>;
  if (k === 4) return <g>{[-18, 0, 18].map((dx, i) => <path key={dx} d={`M${dx} 0v-6M${dx - 9} -6L${dx} ${-34 - (i % 2) * 6}L${dx + 9} -6Z`} className="gm-conifer" />)}</g>;
  return <g>
    <path d="M-28 0q8-8 16-2t14-3t14 2t14 3Z" className="gm-tundra" />
    {[-20, -6, 10, 22].map(dx => <circle key={dx} cx={dx} cy={-4} r="2.2" className="gm-moss" />)}
    <path d="M-10 -14h12M-4 -20v12M-8 -18l8 8M0 -18l-8 8" className="gm-flake" />
  </g>;
}

export function BiomeBelt({ active }: Scene) {
  const p = usePaced();
  const on = (k: number) => (active === 0 && k === 0) || (active === 1 && k === 2) || (active === 2 && k >= 3);
  const show = (k: number) => ({ initial: false as const, animate: { opacity: active === k ? 1 : 0 }, transition: p(0.4, active === k ? 0.3 : 0) });
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Biomas por latitude do equador ao polo: floresta tropical sob a chuva da convergência, deserto sob o ar seco que desce perto de 30 graus, e de temperados a polares conforme a temperatura cai; recorte ${active + 1} em foco`}>
    <ArrowHead id="gm-bio-head" />
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">DO EQUADOR AO POLO · FAIXAS SEM ESCALA</text>

    <text x="152" y="72" textAnchor="middle" className={active === 1 ? 'bi-small bi-strong gm-on' : 'bi-small bi-strong'}>célula de Hadley</text>
    <motion.path d="M76 150V94Q76 84 86 84H218Q228 84 228 94V186" className="gm-cell" markerEnd="url(#gm-bio-head)" initial={false}
      animate={{ pathLength: active === 1 ? [0, 1] : 1, opacity: active === 2 ? 0.4 : 1 }} transition={p(1.8, 0.2)} />
    <motion.path d="M214 208H128" className="gm-cell gm-cell-low" markerEnd="url(#gm-bio-head)" initial={false}
      animate={{ opacity: active === 2 ? 0.3 : 0.8 }} transition={p(0.4)} />

    <motion.g initial={false} animate={{ opacity: active === 2 ? 0.4 : 1 }} transition={p(0.4)}>
      <path d="M98 118a9 9 0 0 1 16-5a11 11 0 0 1 20 4a7 7 0 0 1 0 14h-34a7 7 0 0 1-2-13Z" className="gm-cloud" />
    </motion.g>
    {[104, 116, 128].map((x, k) => <motion.path key={x} d={`M${x} 136l-3 10`} className="gm-rain" initial={false}
      animate={active === 0 ? { y: [-12, 0], opacity: [0, 1] } : { y: 0, opacity: active === 2 ? 0.2 : 0.6 }} transition={p(0.7, 0.4 + k * 0.15)} />)}
    <motion.g {...show(0)}>
      <text x="142" y="112" className="bi-hand-sm">ZCIT: o ar</text>
      <text x="142" y="128" className="bi-hand-sm">sobe e chove</text>
      <text x="142" y="144" className="bi-hand-sm">o ano todo</text>
    </motion.g>

    <motion.g initial={false} animate={{ scale: active === 1 ? [0, 1.2, 1] : 1, opacity: active === 2 ? 0.4 : 1 }} transition={p(0.6, active === 1 ? 1.6 : 0)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
      <circle cx="252" cy="150" r="12" className="gm-high" />
      <text x="252" y="155" textAnchor="middle" className="gm-high-text">A</text>
    </motion.g>
    <motion.g {...show(1)}>
      <text x="274" y="118" className="bi-hand-sm">ar já seco desce:</text>
      <text x="274" y="134" className="bi-hand-sm">alta pressão, sem nuvens</text>
      <text x="274" y="156" className="bi-small">Saara, Arábia, Austrália Central</text>
    </motion.g>

    <motion.g {...show(2)}>
      <text x="446" y="100" textAnchor="middle" className="bi-hand-sm">quanto mais longe do equador,</text>
      <text x="446" y="116" textAnchor="middle" className="bi-hand-sm">mais fria a média do ano</text>
    </motion.g>

    <path d="M20 222H600" className="gm-ground" />
    {BIOMES.map((b, k) => <g key={b.x}>
      <motion.g initial={false} animate={{ opacity: on(k) ? 1 : 0.55, y: on(k) ? -4 : 0 }}
        transition={p(0.5, on(k) && active === 2 ? 0.4 + (k - 3) * 0.35 : 0)}>
        <g transform={`translate(${b.x} 222)`}><BiomeIcon k={k} /></g>
      </motion.g>
      {b.name.map((line, i) => <text key={line} x={b.x} y={238 + i * 12} textAnchor="middle" className={on(k) ? 'bi-small bi-strong gm-on' : 'bi-tiny'}>{line}</text>)}
    </g>)}

    <path d="M60 266H564" className="gm-axis" />
    {[[0, '0° equador'], [30, '30°'], [90, '90° polo']].map(([d, label]) => <g key={label as string}>
      <path d={`M${lat(d as number)} 262v8`} className="gm-axis" />
      <text x={lat(d as number)} y="282" textAnchor={d === 0 ? 'start' : d === 90 ? 'end' : 'middle'} className="bi-tiny" dx={d === 0 ? -4 : d === 90 ? 4 : 0}>{label}</text>
    </g>)}
    <defs><linearGradient id="gm-temp" x1="0" x2="1"><stop offset="0" className="gm-stop-warm" /><stop offset=".5" className="gm-stop-mid" /><stop offset="1" className="gm-stop-cold" /></linearGradient></defs>
    <rect x="60" y="292" width="504" height="10" rx="5" fill="url(#gm-temp)" />
    <motion.g initial={false} animate={{ x: active === 2 ? [0, 504] : active === 1 ? lat(30) - 60 : 0 }} transition={p(active === 2 ? 2 : 0.8, 0.3)}>
      <circle cx="60" cy="297" r="8" className="gm-marker" />
    </motion.g>
    <text x="312" y="320" textAnchor="middle" className="bi-small">temperatura média cai com a latitude</text>
    <text x="30" y="342" className="bi-foot">O mesmo padrão se repete no hemisfério sul.</text>
  </svg>;
}

// Recursos hídricos: o Nilo de montante (Etiópia) a jusante (Egito), e a
// cadeia de quatro elos embaixo. O mapa é esquemático; o que ele precisa
// mostrar é só a ordem — quem está nas cabeceiras decide sobre a água de quem
// está depois.
const CHAIN = [
  { x: 80, label: 'barragem' },
  { x: 230, label: 'tensão' },
  { x: 380, label: 'ameaça' },
  { x: 530, label: 'escalada' },
];

function Gauge({ x, y, value, label, sub, on, p }: { x: number; y: number; value: number; label: string; sub: string; on: boolean; p: Paced }) {
  // A agulha anda pelo arco (pontos calculados), não em linha reta: é o
  // movimento de um medidor, e sem transform-origin não há o que desalinhar.
  const at = (f: number) => {
    const a = Math.PI * (1 - f);
    return [x + 30 * Math.cos(a), y - 30 * Math.sin(a)];
  };
  const steps = Array.from({ length: 7 }, (_, k) => at((value * k) / 6));
  return <g>
    <path d={`M${x - 36} ${y}A36 36 0 0 1 ${x + 36} ${y}`} className="gm-gauge" />
    <path d={`M${x + 25.5} ${y - 25.5}A36 36 0 0 1 ${x + 36} ${y}`} className="gm-gauge-hot" />
    <motion.line x1={x} y1={y} className="gm-needle" initial={false}
      animate={on ? { x2: steps.map(q => q[0]), y2: steps.map(q => q[1]) } : { x2: steps[6][0], y2: steps[6][1] }} transition={p(1.2, 0.5)} />
    <circle cx={x} cy={y} r="4" className="gm-needle-hub" />
    <text x={x} y={y + 18} textAnchor="middle" className="bi-small bi-strong">{label}</text>
    <text x={x} y={y + 31} textAnchor="middle" className="bi-tiny">{sub}</text>
  </g>;
}

export function NileBasin({ active }: Scene) {
  const p = usePaced();
  const show = (k: number) => ({ initial: false as const, animate: { opacity: active === k ? 1 : 0 }, transition: p(0.4, active === k ? 0.2 : 0) });
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Nilo de montante a jusante: barragem etíope sem acordo, tensão diplomática, dependência do Egito e risco de escalada; recorte ${active + 1} em foco`}>
    <ArrowHead id="gm-nilo-head" />
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">NILO · MAPA ESQUEMÁTICO, SEM ESCALA</text>

    <path d="M18 52H300Q268 66 226 62T150 70T84 66T18 72Z" className="gm-sea" />
    <text x="176" y="62" className="gm-sea-label">Mar Mediterrâneo</text>
    <motion.path d="M22 76L96 72Q112 80 128 76L150 88L152 150L22 150Z" className="gm-country" initial={false}
      animate={{ opacity: active >= 2 ? 1 : 0.5 }} transition={p(0.5)} />
    <path d="M22 150H152L156 180L178 196L150 240L22 240Z" className="gm-country gm-country-b" />
    <path d="M236 206L270 190L338 200L350 262L304 290L236 272Z" className="gm-country gm-country-c" />
    {[[306, 280], [330, 272]].map(([x, y]) => <path key={x} d={`M${x - 10} ${y}l10-12 10 12`} className="gm-peak" />)}
    <text x="56" y="128" className="gm-country-label">EGITO</text>
    <text x="52" y="210" className="gm-country-label">SUDÃO</text>
    <text x="294" y="222" textAnchor="middle" className="gm-country-label">ETIÓPIA</text>
    <text x="56" y="142" className="bi-tiny">a jusante</text>
    <text x="294" y="208" textAnchor="middle" className="bi-tiny">a montante</text>

    <motion.path d="M122 76C128 104 118 128 136 150S176 170 170 190S196 206 214 214" className="gm-river" initial={false}
      animate={{ strokeWidth: active === 0 ? [7, 3.5] : 3.5 }} transition={p(1.4, 0.8)} />
    <path d="M214 214C210 240 218 262 204 292" className="gm-river gm-river-white" />
    <path d="M214 214C236 222 250 236 270 236" className="gm-river gm-river-thin" />
    <path d="M278 238C290 244 302 252 316 262" className="gm-river" />
    <circle cx="122" cy="90" r="4" className="gm-city" />
    <text x="114" y="94" textAnchor="end" className="bi-tiny">Cairo</text>
    <motion.ellipse cx="296" cy="250" className="gm-reservoir" initial={false}
      animate={{ rx: active === 0 ? [4, 18] : 18, ry: active === 0 ? [2, 8] : 8 }} transition={p(1.4, 0.4)} />
    <path d="M270 228l14 20" className="gm-dam" />
    <text x="222" y="264" textAnchor="end" className="bi-tiny">Nilo Branco</text>
    <text x="266" y="252" textAnchor="end" className="bi-tiny">Nilo Azul</text>

    <motion.path d="M284 196C270 132 200 100 134 94" className="gm-tension" markerEnd="url(#gm-nilo-head)" initial={false}
      animate={{ pathLength: active === 1 ? [0, 1] : active > 1 ? 1 : 0, opacity: active >= 1 ? 1 : 0 }} transition={p(1, 0.3)} />
    {[[240, 124], [192, 104]].map(([x, y], k) => <motion.path key={x} d={`M${x - 6} ${y - 8}l8 6-6 2 8 8`} className="gm-bolt" initial={false}
      animate={{ opacity: active >= 1 ? 1 : 0, scale: active === 1 ? [0, 1.3, 1] : 1 }} transition={p(0.5, active === 1 ? 1 + k * 0.2 : 0)}
      style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />)}

    <rect x="366" y="54" width="232" height="226" rx="14" className="bi-panel" />
    <motion.g {...show(0)}>
      <text x="382" y="78" className="bi-panel-title">1 · BARRAGEM SEM ACORDO</text>
      <path d="M382 188H582" className="gm-axis" />
      <motion.rect x="384" width="92" className="gm-reservoir" initial={false}
        animate={{ y: active === 0 ? [180, 124] : 124, height: active === 0 ? [8, 64] : 64 }} transition={p(1.6, 0.4)} />
      <path d="M476 188V110h18l22 78Z" className="gm-dam-body" />
      <motion.path d="M518 184h58" className="gm-outflow" initial={false} animate={{ strokeWidth: active === 0 ? [9, 3] : 3 }} transition={p(1.6, 0.4)} />
      <text x="382" y="208" className="bi-small bi-strong">Grande Barragem do Renascimento</text>
      <text x="382" y="222" className="bi-small">Etíope, no Nilo Azul</text>
      <text x="382" y="246" className="bi-hand-sm">enchendo o reservatório, menos</text>
      <text x="382" y="262" className="bi-hand-sm">água chega ao Egito</text>
    </motion.g>
    <motion.g {...show(1)}>
      <text x="382" y="78" className="bi-panel-title">2 · TENSÃO DIPLOMÁTICA</text>
      <Person x={410} y={118} s={0.85} coat="bi-coat-green" />
      <Person x={554} y={118} s={0.85} coat="bi-coat-army" />
      <path d="M430 160h104" className="bi-beam" strokeWidth="4" />
      <g transform="translate(482 132)">
        <path d="M-22 -20h40a4 4 0 0 1 4 4v36h-40a4 4 0 0 1-4-4Z" className="gm-treaty" />
        <text x="0" y="8" textAnchor="middle" className="gm-treaty-mark">?</text>
      </g>
      <text x="410" y="182" textAnchor="middle" className="bi-tiny">Etiópia</text>
      <text x="554" y="182" textAnchor="middle" className="bi-tiny">Egito</text>
      <text x="382" y="210" className="bi-small bi-strong">sem tratado vinculante</text>
      <text x="382" y="224" className="bi-small">de repartição das águas</text>
      <text x="382" y="248" className="bi-hand-sm">obra doméstica vira</text>
      <text x="382" y="264" className="bi-hand-sm">tensão regional</text>
    </motion.g>
    <motion.g {...show(2)}>
      <text x="382" y="78" className="bi-panel-title">3 · AMEAÇA EXISTENCIAL</text>
      <defs><clipPath id="gm-drop-clip"><path d="M430 94c-18 24-28 40-28 56a28 28 0 0 0 56 0c0-16-10-32-28-56Z" /></clipPath></defs>
      <path d="M430 94c-18 24-28 40-28 56a28 28 0 0 0 56 0c0-16-10-32-28-56Z" className="gm-drop" />
      <g clipPath="url(#gm-drop-clip)">
        <motion.rect x="400" y="104" width="60" height="74" className="gm-drop-fill" initial={false}
          animate={{ scaleY: active === 2 ? [0, 1] : 1 }} transition={p(1.4, 0.4)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }} />
      </g>
      <text x="430" y="160" textAnchor="middle" className="gm-drop-text">{">90%"}</text>
      <text x="474" y="126" className="bi-small bi-strong">da água doce do</text>
      <text x="474" y="142" className="bi-small bi-strong">Egito vem do Nilo</text>
      <text x="382" y="208" className="bi-small">qualquer redução de vazão</text>
      <text x="382" y="222" className="bi-small">ameaça a segurança hídrica</text>
      <text x="382" y="236" className="bi-small">e alimentar</text>
    </motion.g>
    <motion.g {...show(3)}>
      <text x="382" y="78" className="bi-panel-title">4 · RISCO DE ESCALADA</text>
      <Gauge x={426} y={148} value={0.9} label="Egito" sub="sem alternativa" on={active === 3} p={p} />
      <Gauge x={538} y={148} value={0.3} label="outra bacia" sub="com alternativas" on={active === 3} p={p} />
      <text x="382" y="214" className="bi-hand-sm">o risco cresce com</text>
      <text x="382" y="230" className="bi-hand-sm">a dependência a jusante</text>
      <text x="382" y="262" className="bi-tiny">medidores ilustrativos, sem medida</text>
    </motion.g>

    <path d={`M${CHAIN[0].x} 312H${CHAIN[3].x}`} className="gm-chain" />
    <motion.path d={`M${CHAIN[0].x} 312H${CHAIN[3].x}`} className="gm-chain-on" initial={false}
      animate={{ pathLength: Math.max(active / 3, 0.001) }} transition={p(0.8)} />
    {CHAIN.map((c, k) => <g key={c.label}>
      <motion.circle cx={c.x} cy="312" r="11" className={k <= active ? 'gm-node gm-node-on' : 'gm-node'} initial={false}
        animate={{ scale: k === active ? 1.2 : 1 }} transition={p(0.4)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
      <text x={c.x} y="316" textAnchor="middle" className={k <= active ? 'gm-node-text gm-node-text-on' : 'gm-node-text'}>{k + 1}</text>
      <text x={c.x} y="340" textAnchor="middle" className={k === active ? 'bi-small bi-strong gm-on' : 'bi-small'}>{c.label}</text>
    </g>)}
  </svg>;
}

// Paisagem e correntes: a mesma paisagem nos três recortes, porque é isso que
// as correntes disputam — não o que se vê, mas o que explica. Só muda a seta
// entre meio e sociedade, e o que a corrente acrescenta ao desenho.
export function ThreeReadings({ active }: Scene) {
  const p = usePaced();
  const show = (k: number) => ({ initial: false as const, animate: { opacity: active === k ? 1 : 0 }, transition: p(0.4, active === k ? 0.2 : 0) });
  const titles = ['DETERMINISMO', 'POSSIBILISMO', 'GEOGRAFIA CRÍTICA'];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`A mesma paisagem lida por três correntes: determinismo, em que o meio decide; possibilismo, em que a sociedade escolhe; geografia crítica, em que poder e desigualdade organizam o espaço; recorte ${active + 1} em foco`}>
    <ArrowHead id="gm-pais-head" />
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">UMA PAISAGEM, TRÊS LEITURAS</text>

    <defs><clipPath id="gm-view-clip"><rect x="26" y="54" width="300" height="226" rx="14" /></clipPath></defs>
    <g clipPath="url(#gm-view-clip)">
      <rect x="26" y="54" width="300" height="226" className="gm-view-sky" />
      <circle cx="270" cy="92" r="16" className="gm-sun" />
      <path d="M26 176L88 104L128 146L168 96L236 170L326 128V280H26Z" className="gm-hill-far" />
      <path d="M26 206Q110 180 190 200T326 196V280H26Z" className="gm-hill-near" />
      <path d="M26 252Q120 236 190 250T326 244" className="gm-river-view" />
      {[0, 1, 2, 3].map(k => <path key={k} d={`M${50 + k * 26} ${214 + (k % 2) * 3}h20`} className="gm-furrow" />)}
    </g>
    <rect x="26" y="54" width="300" height="226" rx="14" className="gm-view-frame" />

    <motion.g {...show(0)}>
      <Arrow d="M160 104C168 140 176 160 178 188" on={active === 0} p={p} head="gm-pais-head" delay={0.3} />
      {[190, 210, 230].map(x => <Person key={x} x={x} y={200} s={0.55} coat="bi-coat-plain" />)}
      <g transform="translate(96 150) rotate(-10)">
        <rect x="-50" y="-14" width="100" height="26" rx="4" className="bi-stamp" />
        <text x="0" y="4" textAnchor="middle" className="bi-stamp-text">REJEITADA</text>
      </g>
    </motion.g>
    <motion.g {...show(1)}>
      <Person x={200} y={198} s={0.6} coat="bi-coat-green" />
      {[
        { d: 'M206 226C186 234 120 222 90 226', end: [90, 226] },
        { d: 'M212 214C230 190 250 174 264 170', end: [264, 170] },
        { d: 'M214 228C238 238 262 244 290 250', end: [290, 250] },
      ].map((o, k) => <motion.path key={k} d={o.d} className={k === 0 ? 'gm-option gm-option-on' : 'gm-option'} initial={false}
        animate={{ pathLength: active === 1 ? [0, 1] : 1 }} transition={p(0.7, active === 1 ? 0.2 + k * 0.2 : 0)} />)}
      <motion.path d="M78 222l6-10 6 10M84 212v-10M80 206l4-4 4 4" className="gm-wheat" initial={false}
        animate={{ scale: active === 1 ? [1, 1.4, 1.2] : 1.2 }} transition={p(0.6, 1)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }} />
      <path d="M258 162q8-6 16 0M266 158v14" className="gm-pick" />
      <path d="M284 248h14l-3 5h-8ZM291 248v-9l5 5" className="gm-boat" />
    </motion.g>
    <motion.g {...show(2)}>
      <path d="M170 204v60" className="gm-fence" />
      {[176, 196, 216, 236].map(y => <path key={y} d={`M164 ${y}h12`} className="gm-fence" />)}
      <path d="M92 196v-18l16-12 16 12v18Z" className="gm-big-house" />
      {[210, 234, 258, 282].map((x, k) => <path key={x} d={`M${x} ${226 + (k % 2) * 6}v-9l6-5 6 5v9Z`} className="bi-house" />)}
      <motion.path d="M230 206C200 176 160 172 130 180" className="gm-flow" markerEnd="url(#gm-pais-head)" initial={false}
        animate={{ pathLength: active === 2 ? [0, 1] : 1 }} transition={p(0.9, 0.5)} />
      {[0, 1, 2].map(k => <motion.circle key={k} r="3.5" className="gm-coin" initial={false}
        animate={active === 2 ? { cx: [226, 180, 136], cy: [202, 178, 182], opacity: [0, 1, 0] } : { cx: 136, cy: 182, opacity: 0 }}
        transition={p(1.2, 0.8 + k * 0.3)} />)}
    </motion.g>

    <rect x="342" y="54" width="256" height="226" rx="14" className="bi-panel" />
    <motion.text key={active} x="470" y="80" textAnchor="middle" className="bi-panel-title" initial={{ opacity: p(1).duration === 0 ? 1 : 0 }} animate={{ opacity: 1 }} transition={p(0.4)}>{titles[active]}</motion.text>
    <g transform="translate(400 128)">
      <circle r="22" className={active === 0 ? 'gm-node-big gm-node-big-on' : 'gm-node-big'} />
      <path d="M-10 8l8-14 5 7 4-5 7 12Z" className="gm-node-icon" />
    </g>
    <text x="400" y="166" textAnchor="middle" className="bi-small bi-strong">meio</text>
    <g transform="translate(540 128)">
      <circle r="22" className={active !== 0 ? 'gm-node-big gm-node-big-on' : 'gm-node-big'} />
      <circle cx="-6" cy="-6" r="4" className="gm-node-icon" /><circle cx="7" cy="-6" r="4" className="gm-node-icon" />
      <path d="M-14 10c0-7 4-10 8-10s8 3 8 10M0 10c0-7 4-10 7-10s7 3 7 10" className="gm-node-icon" />
    </g>
    <text x="540" y="166" textAnchor="middle" className="bi-small bi-strong">sociedade</text>
    <motion.g {...show(0)}>
      <Arrow d="M428 122H508" on={active === 0} p={p} head="gm-pais-head" delay={0.2} />
      <text x="358" y="200" className="bi-small bi-strong">o meio decidiria o destino</text>
      <text x="358" y="214" className="bi-small">das sociedades</text>
      <text x="358" y="244" className="bi-hand-sm">simplifica relações complexas</text>
    </motion.g>
    <motion.g {...show(1)}>
      <Arrow d="M512 134H430" on={active === 1} p={p} head="gm-pais-head" delay={0.2} />
      <text x="470" y="126" textAnchor="middle" className="bi-tiny">escolhe</text>
      <text x="358" y="200" className="bi-small bi-strong">o meio oferece possibilidades;</text>
      <text x="358" y="214" className="bi-small">a sociedade explora ou não</text>
      <text x="358" y="244" className="bi-hand-sm">peso da ação humana e cultural</text>
    </motion.g>
    <motion.g {...show(2)}>
      <motion.path d="M520 108C500 92 440 92 420 108" className="gm-flow" markerEnd="url(#gm-pais-head)" initial={false}
        animate={{ pathLength: active === 2 ? [0, 1] : 1 }} transition={p(0.8, 0.3)} />
      <motion.path d="M428 140C450 152 492 152 516 140" className="gm-flow" markerEnd="url(#gm-pais-head)" initial={false}
        animate={{ pathLength: active === 2 ? [0, 1] : 1 }} transition={p(0.8, 0.6)} />
      <text x="358" y="200" className="bi-small bi-strong">poder, desigualdade e economia</text>
      <text x="358" y="214" className="bi-small">explicam a organização do espaço</text>
      <text x="470" y="115" textAnchor="middle" className="bi-tiny">produz</text>
      <text x="470" y="140" textAnchor="middle" className="bi-tiny">condiciona</text>
      <text x="358" y="244" className="bi-hand-sm">Milton Santos: objetos + ações</text>
    </motion.g>

    <path d="M40 312H580" className="gm-axis" />
    <rect x="40" y="304" width="316" height="16" rx="8" className={active < 2 ? 'gm-era gm-era-on' : 'gm-era'} />
    <rect x="370" y="304" width="210" height="16" rx="8" className={active === 2 ? 'gm-era gm-era-on' : 'gm-era'} />
    <text x="198" y="316" textAnchor="middle" className={active < 2 ? 'gm-era-text gm-era-text-on' : 'gm-era-text'}>tradicional · séc. XIX e início do XX</text>
    <text x="475" y="316" textAnchor="middle" className={active === 2 ? 'gm-era-text gm-era-text-on' : 'gm-era-text'}>crítica · 2ª metade do séc. XX</text>
    <text x="30" y="342" className="bi-foot">Paisagem ilustrativa: o que muda é a explicação, não o desenho.</text>
  </svg>;
}

export const SCENES_LOTE9: Record<string, React.ComponentType<Scene>> = {
  'summary-geografia-clima-mundial': ClimateFactors,
  'summary-geografia-geomorfologia-mundial': StructureBlock,
  'summary-geografia-biogeografia-mundial': BiomeBelt,
  'summary-geografia-geopolitica-dos-recursos-hidricos': NileBasin,
  'summary-geografia-paisagem-espaco-geografico-e-ciencia-geografica': ThreeReadings,
};

export const HEADERS_LOTE9: Record<string, string> = {
  'summary-geografia-clima-mundial': 'fatores combinados',
  'summary-geografia-geomorfologia-mundial': 'estruturas e tectônica',
  'summary-geografia-biogeografia-mundial': 'biomas e latitude',
  'summary-geografia-geopolitica-dos-recursos-hidricos': 'montante e jusante',
  'summary-geografia-paisagem-espaco-geografico-e-ciencia-geografica': 'correntes em contraste',
};
