import React from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import { BRAZIL } from './GeografiaFisica';
import { Arrow, ArrowHead, Person, type Scene } from './cenaKit';
import './EconomiaGlobal.css';

function usePaced() {
  const t = useSceneMotion();
  return (duration: number, delay = 0) => (t.duration === 0 ? t : { ...t, duration, delay });
}

// Lote 10 da régua de História e Geografia: economia, indústria e ordem
// mundial. Estes capítulos usavam fôrmas que só trocavam texto (tipologia,
// cadeia, escala); cada cena agora desenha o mecanismo que o resumo explica —
// para onde vai a colheita, o que a linha de montagem faz com o operário, por
// que São Paulo puxa mais indústria, que degrau um bloco sobe, por que a
// periferia exporta mais para comprar o mesmo. Nomes, datas e números saem do
// resumo do capítulo; quantidades desenhadas sem medida levam rodapé dizendo.

// Coordenadas reais do contorno BRAZIL (GeografiaFisica): y = 76,2 − 7,70·lat;
// x ≈ 616,8 + 7,9·lon.
const geo = (lat: number, lon: number) => [616.8 + 7.9 * lon, 76.2 - 7.7 * lat] as const;

function Coin({ x, y, r = 9, label = '$' }: { x: number; y: number; r?: number; label?: string }) {
  return <g>
    <circle cx={x} cy={y} r={r} className="eg-coin" />
    <text x={x} y={y + 3.5} textAnchor="middle" className="eg-coin-text">{label}</text>
  </g>;
}

function Factory({ x, y, s = 1, className = 'eg-factory' }: { x: number; y: number; s?: number; className?: string }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-22 0v-22l12-8v8l12-8v8l12-8v30ZM10 -22v-16h7v16" className={className} />
    <path d="M-16 -11h5v5h-5ZM-3 -11h5v5h-5ZM10 -11h5v5h-5Z" className="eg-window" />
  </g>;
}

function Globe({ x, y, r = 14 }: { x: number; y: number; r?: number }) {
  return <g>
    <circle cx={x} cy={y} r={r} className="eg-globe" />
    <path d={`M${x - r} ${y}h${2 * r}M${x} ${y - r}c${-r * 0.7} ${r * 0.5} ${-r * 0.7} ${r * 1.5} 0 ${2 * r}M${x} ${y - r}c${r * 0.7} ${r * 0.5} ${r * 0.7} ${r * 1.5} 0 ${2 * r}M${x - r * 0.85} ${y - r * 0.5}h${1.7 * r}M${x - r * 0.85} ${y + r * 0.5}h${1.7 * r}`} className="eg-globe-line" />
  </g>;
}

// Produção agrícola mundial: o mesmo campo, três destinos. O que separa os
// sistemas é mecanização, escala e para onde vai a colheita; o espectro de
// baixo lembra a nota do capítulo — eles coexistem, não são degraus.
const AGRI = [
  { mech: [0.04, 0.16], scale: [0.04, 0.16], dest: 0, marker: 60,
    lines: ['África Subsaariana · Ásia rural', 'pouco insumo; produtividade/ha reduzida'] },
  { mech: [0.84, 0.96], scale: [0.84, 0.96], dest: 2, marker: 560,
    lines: ['Centro-Oeste · Meio-Oeste · planícies argentinas', 'máquinas, química, sementes melhoradas'] },
  { mech: [0.3, 0.7], scale: [0.22, 0.5], dest: 1, marker: 310,
    lines: ['agricultura familiar comercial', 'orgânica e agroecológica: menos química'] },
];

export function AgricultureSystems({ active }: Scene) {
  const p = usePaced();
  const sys = AGRI[active];
  const track = (a: number) => 414 + 164 * a;
  const dests = [
    { x: 434, top: 'família', bottom: 'própria', icon: <path d="M-10 7v-9l10-8 10 8v9ZM-3 7v-6h6v6" className="bi-icon" /> },
    { x: 500, top: 'mercado', bottom: 'formal', icon: <path d="M-11 7v-11h22v11ZM-13 -4l13-8 13 8M-4 7v-6h8v6" className="bi-icon" /> },
    { x: 566, top: 'commodities', bottom: 'mundiais', icon: <g><circle r="9" className="bi-icon" /><path d="M-9 0h18M0 -9c-5 4-5 14 0 18M0 -9c5 4 5 14 0 18" className="bi-icon" /></g> },
  ];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Produção agrícola mundial: subsistência, larga escala e sistemas intermediários comparados por mecanização, escala e destino da colheita; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">SISTEMAS AGRÍCOLAS</text>
    <rect x="30" y="56" width="346" height="220" rx="14" className="bi-panel" />
    <motion.g key={`t-${active}`} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={p(0.4, 0.1)}>
      <text x="46" y="80" className="bi-small bi-strong">{sys.lines[0]}</text>
      <text x="46" y="96" className="bi-small">{sys.lines[1]}</text>
    </motion.g>

    {active === 0 && <g>
      <path d="M52 268L78 236H214L198 268Z" className="eg-field" />
      {[0, 1, 2, 3, 4, 5].map(k => <path key={k} d={`M${88 + k * 21} 238L${76 + k * 21} 266`} className="eg-furrow" />)}
      {[[92, 248], [114, 256], [136, 248], [158, 256], [180, 248]].map(([x, y], k) => <motion.path key={x} d={`M${x} ${y}v-8M${x} ${y - 5}l-5-4M${x} ${y - 5}l5-4`} className="eg-sprout"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={p(0.4, 0.3 + k * 0.12)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }} />)}
      <Person x={130} y={200} coat="bi-coat-green" hat="brim" />
      <motion.g initial={{ rotate: 0 }} animate={{ rotate: [0, -24, 0, -24, 0] }} transition={p(1.8, 0.4)} style={{ transformOrigin: '140px 214px' }}>
        <path d="M140 214l18 24" className="eg-tool" />
        <path d="M154 236l10 4-4 5Z" className="eg-blade" />
      </motion.g>
      <g transform="translate(314 262)">
        <path d="M-30 0v-34h60v34Z" className="bi-house" />
        <path d="M-36 -32L0 -58 36 -32Z" className="eg-roof" />
        <path d="M-7 0v-18h14v18" className="bi-house" />
      </g>
      <path d="M204 252Q246 270 276 250" className="bi-tie" />
      <motion.g initial={{ x: 0, opacity: 0 }} animate={{ x: 70, opacity: [0, 1, 1] }} transition={p(1.6, 0.8)}>
        <path d="M200 238h22l-3 12h-16Z" className="eg-crate" />
        <circle cx="206" cy="236" r="3" className="eg-berry" /><circle cx="213" cy="235" r="3" className="eg-leaf" />
      </motion.g>
      <text x="314" y="126" textAnchor="middle" className="bi-hand-sm">vai para a</text>
      <text x="314" y="144" textAnchor="middle" className="bi-hand-sm">mesa da casa</text>
    </g>}

    {active === 1 && <g>
      <path d="M40 268L62 222H330L356 268Z" className="eg-field-big" />
      {Array.from({ length: 12 }, (_, k) => <path key={k} d={`M${78 + k * 22} 224L${62 + k * 23} 266`} className="eg-furrow" />)}
      <motion.g initial={{ x: 0 }} animate={{ x: 150 }} transition={p(2.4, 0.3)}>
        <g transform="translate(78 246)">
          <path d="M-24 4v-12h18v-14h16v14h14v12Z" className="eg-tractor" />
          <path d="M-4 -20h10v10h-10Z" className="eg-glass" />
          <circle cx="-14" cy="6" r="10" className="eg-wheel" /><circle cx="-14" cy="6" r="3.5" className="eg-hub" />
          <circle cx="18" cy="9" r="6" className="eg-wheel" /><circle cx="18" cy="9" r="2" className="eg-hub" />
        </g>
      </motion.g>
      <g>
        <path d="M296 222V150a18 12 0 0 1 36 0V222Z" className="eg-silo" />
        <path d="M296 170h36M296 190h36M296 208h36" className="eg-silo-band" />
      </g>
      <Globe x={206} y={146} r={17} />
      <ArrowHead id="eg-head-agri" />
      <Arrow d="M292 158C268 142 250 140 230 144" on p={p} head="eg-head-agri" delay={0.6} />
      <text x="206" y="182" textAnchor="middle" className="bi-hand-sm">mercado mundial</text>
    </g>}

    {active === 2 && <g>
      <path d="M46 268L66 236H164L152 268Z" className="eg-field" />
      <path d="M162 268L176 236H256L252 268Z" className="eg-field" />
      {[0, 1, 2, 3].map(k => <path key={k} d={`M${80 + k * 22} 238L${70 + k * 22} 266`} className="eg-furrow" />)}
      {[0, 1, 2].map(k => <path key={`b-${k}`} d={`M${192 + k * 22} 238L${186 + k * 22} 266`} className="eg-furrow" />)}
      <Person x={108} y={208} s={0.85} coat="bi-coat-plain" hat="brim" />
      <Person x={214} y={208} s={0.85} coat="bi-coat-green" hat="cap" />
      <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={p(0.5, 0.5)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}>
        <path d="M240 178c0-16 12-24 26-24 0 14-10 24-26 24ZM240 178c4-8 10-14 18-18" className="eg-leaf" />
      </motion.g>
      <g transform="translate(326 262)">
        <path d="M-34 0v-40h68v40Z" className="eg-coop" />
        <path d="M-40 -38L0 -62 40 -38Z" className="eg-coop-roof" />
        <rect x="-24" y="-34" width="48" height="14" rx="3" className="eg-sign" />
        <text x="0" y="-23.5" textAnchor="middle" className="eg-sign-text">COOP.</text>
        <path d="M-8 0v-14h16v14" className="eg-coop" />
      </g>
      {[0, 1].map(k => <motion.path key={k} d={`M${128 + k * 106} 242h16v12h-16Z`} className="eg-crate" initial={{ x: 0, opacity: 0 }}
        animate={{ x: 150 - k * 96, opacity: [0, 1, 1, 0.9] }} transition={p(1.6, 0.6 + k * 0.4)} />)}
      <text x="326" y="178" textAnchor="middle" className="bi-hand-sm">escala menor,</text>
      <text x="326" y="194" textAnchor="middle" className="bi-hand-sm">mercado formal</text>
    </g>}

    <rect x="392" y="56" width="204" height="220" rx="14" className="bi-panel" />
    <text x="406" y="80" className="bi-panel-title">O QUE OS SEPARA</text>
    {[['mecanização', sys.mech, 106], ['escala', sys.scale, 156]].map(([name, range, y]) => {
      const [a, b] = range as number[];
      const yy = y as number;
      return <g key={name as string}>
        <text x="406" y={yy} className="bi-small bi-strong">{name as string}</text>
        <rect x={track(0)} y={yy + 8} width="164" height="8" rx="4" className="eg-track" />
        <motion.rect y={yy + 8} height="8" rx="4" className="eg-range" initial={false}
          animate={{ x: track(a), width: 164 * (b - a) }} transition={p(0.7, 0.2)} />
        <motion.circle cy={yy + 12} r="6" className="eg-knob" initial={false} animate={{ cx: track((a + b) / 2) }} transition={p(0.7, 0.2)} />
        <text x={track(0)} y={yy + 30} className="bi-tiny">{name === 'escala' ? 'menor' : 'baixa'}</text>
        <text x={track(1)} y={yy + 30} textAnchor="end" className="bi-tiny">{name === 'escala' ? 'maior' : 'alta'}</text>
      </g>;
    })}
    <text x="406" y="206" className="bi-small bi-strong">destino</text>
    {dests.map((d, k) => <g key={d.top}>
      <motion.circle cx={d.x} cy="228" r="15" initial={false} animate={{ scale: sys.dest === k ? 1.1 : 1 }} transition={p(0.4, 0.3)}
        className={sys.dest === k ? 'eg-dest-on' : 'eg-dest'} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
      <g transform={`translate(${d.x} 229)`}>{d.icon}</g>
      <text x={d.x} y="256" textAnchor="middle" className={sys.dest === k ? 'bi-tiny bi-strong' : 'bi-tiny'}>{d.top}</text>
      <text x={d.x} y="267" textAnchor="middle" className="bi-tiny">{d.bottom}</text>
    </g>)}

    <path d="M60 296H560" className="eg-spectrum" />
    <motion.circle cy="296" r="8" className="eg-knob" initial={false} animate={{ cx: sys.marker }} transition={p(0.8, 0.2)} />
    {[['subsistência', 60, 'start', 0], ['intermediários', 310, 'middle', 2], ['larga escala', 560, 'end', 1]].map(([label, x, anchor, k]) =>
      <text key={label as string} x={anchor === 'start' ? 44 : anchor === 'end' ? 576 : (x as number)} y="318" textAnchor={anchor as 'start' | 'middle' | 'end'}
        className={active === k ? 'bi-small bi-strong bi-on' : 'bi-small'}>{label as string}</text>)}
    <text x="30" y="342" className="bi-foot">Esquema ilustrativo, sem escala.</text>
    <text x="590" y="342" textAnchor="end" className="bi-hand-sm">coexistem: não é escada evolutiva</text>
  </svg>;
}

// Indústria I: a mesma esteira sob quatro lógicas. Taylor cronometra a tarefa,
// Ford põe a tarefa na linha contínua e paga o operário para comprar o carro,
// Toyota tira o estoque e dá várias máquinas ao mesmo operário; hoje as
// lógicas convivem lado a lado.
const MODELS = [
  { title: 'TAYLORISMO', who: 'Frederick Taylor', lines: ['início do século XX', '', 'processo fragmentado', 'em tarefas simples', 'e repetitivas,', 'cronometradas para a', 'produtividade individual'] },
  { title: 'FORDISMO', who: 'Henry Ford', lines: ['a fragmentação de Taylor', '+ linha de montagem', 'contínua', '+ salários mais altos:', 'os operários viram', 'consumidores do que', 'produzem'] },
  { title: 'TOYOTISMO', who: 'Japão, pós-Segunda Guerra', lines: ['just-in-time: produz', 'sob demanda, sem', 'grandes estoques', 'qualidade a cargo dos', 'próprios trabalhadores', 'polivalência: um', 'operário, várias máquinas'] },
  { title: 'COEXISTÊNCIA HOJE', who: 'não é substituição total', lines: ['setores ainda em lógica', 'fordista, lado a lado', 'com fábricas muito', 'automatizadas da', 'Quarta Revolução', 'Industrial', ''] },
];

function Car({ x, y, done = true }: { x: number; y: number; done?: boolean }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-18 -2v-8l6-8h14l7 8h9v8Z" className={done ? 'eg-car' : 'eg-frame'} />
    <circle cx="-9" cy="-1" r="4" className="eg-wheel" /><circle cx="10" cy="-1" r="4" className="eg-wheel" />
  </g>;
}

export function ProductionModels({ active }: Scene) {
  const p = usePaced();
  const m = MODELS[active];
  const stops = [90, 230, 370, 510];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Modelos produtivos: taylorismo, fordismo e toyotismo na mesma esteira, e a coexistência deles hoje; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <ArrowHead id="eg-head-ford" />
    <text x="30" y="40" className="bi-kicker">CHÃO DE FÁBRICA · MODELOS PRODUTIVOS</text>

    <path d="M60 234v28M200 234v28M340 234v28" className="eg-leg" />
    <motion.g initial={false} animate={{ opacity: active === 0 ? 0.3 : 1 }} transition={p(0.5)}>
      <rect x="40" y="222" width="330" height="12" rx="6" className="eg-belt" />
      {Array.from({ length: 11 }, (_, k) => <circle key={k} cx={50 + k * 31} cy="228" r="4" className="eg-roller" />)}
    </motion.g>
    <path d="M30 262H386" className="bi-ground" />

    {active === 0 && <g>
      {[100, 205, 310].map((x, k) => <g key={x}>
        <Person x={x} y={176} coat="bi-coat" />
        <rect x={x - 22} y="212" width="44" height="10" rx="2" className="eg-crate" />
        <text x={x} y="98" textAnchor="middle" className="bi-small bi-strong">tarefa {k + 1}</text>
        <circle cx={x} cy="134" r="16" className="eg-watch" />
        <path d={`M${x - 4} 115h8M${x} 115v3`} className="eg-watch-hand" />
        <motion.path d={`M${x} 134v-11`} className="eg-watch-hand" initial={{ rotate: 0 }} animate={{ rotate: 360 }}
          transition={p(1.6, 0.3 + k * 0.3)} style={{ transformOrigin: `${x}px 134px` }} />
      </g>)}
      <text x="205" y="280" textAnchor="middle" className="bi-hand-sm">cada gesto medido no cronômetro</text>
    </g>}

    {active === 1 && <g>
      {[95, 185, 275].map(x => <Person key={x} x={x} y={176} coat="bi-coat-army" hat="cap" />)}
      <motion.g initial={{ x: -46 }} animate={{ x: 0 }} transition={p(1.6, 0.2)}>
        <Car x={140} y={222} done={false} />
        <Car x={230} y={222} done={false} />
        <Car x={330} y={222} />
      </motion.g>
      <Arrow d="M334 196C330 104 120 100 98 158" on p={p} head="eg-head-ford" delay={1.2} />
      <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={p(0.4, 1.8)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <Coin x={216} y={124} r={11} />
      </motion.g>
      <text x="216" y="84" textAnchor="middle" className="bi-hand-sm">salário maior: quem monta, compra</text>
    </g>}

    {active === 2 && <g>
      <g transform="translate(70 170)">
        <path d="M-26 20v-30l26-16 26 16v30Z" className="bi-house" />
        <path d="M-16 20v-16h32v16" className="bi-house" />
        <motion.path d="M-30 -30L30 26M30 -30L-30 26" className="bi-cross" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={p(0.6, 0.3)} />
      </g>
      <text x="70" y="126" textAnchor="middle" className="bi-small bi-strong">estoque</text>
      <motion.g initial={{ x: 0 }} animate={{ x: [0, 100, 0, 100, 50] }} transition={p(2.6, 0.4)}>
        <Person x={190} y={170} coat="bi-coat-green" hat="cap" />
      </motion.g>
      {[190, 290].map(x => <g key={x}>
        <path d={`M${x - 22} 222v-30h44v30Z`} className="eg-machine" />
        <circle cx={x} cy="206" r="7" className="eg-gear" />
      </g>)}
      <motion.path d="M230 138l8 8 16-18" className="eg-check" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={p(0.5, 1.6)} />
      <motion.g initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={p(1.2, 0.8)}>
        <path d="M130 212h14v10h-14Z" className="eg-crate" />
      </motion.g>
      <text x="138" y="206" textAnchor="middle" className="bi-tiny">peça</text>
      <text x="138" y="280" textAnchor="middle" className="bi-hand-sm">chega na hora de usar</text>
    </g>}

    {active === 3 && <g>
      <path d="M200 70V262" className="eg-divider" />
      <text x="115" y="84" textAnchor="middle" className="bi-small bi-strong">lógica fordista</text>
      <text x="290" y="84" textAnchor="middle" className="bi-small bi-strong">fábrica automatizada</text>
      <Person x={100} y={176} coat="bi-coat-army" hat="cap" />
      <Car x={160} y={222} done={false} />
      <g transform="translate(270 222)">
        <path d="M-16 0v-12h32v12Z" className="eg-robot" />
        <motion.g initial={{ rotate: -20 }} animate={{ rotate: [-20, 25, -20, 25, 10] }} transition={p(2.6, 0.3)} style={{ transformOrigin: '0px -12px' }}>
          <path d="M-5 -12v-50h10v50Z" className="eg-robot" />
          <motion.g initial={{ rotate: 40 }} animate={{ rotate: [40, -10, 40, -10, 20] }} transition={p(2.6, 0.3)} style={{ transformOrigin: '0px -60px' }}>
            <path d="M-4 -64h44v8h-44Z" className="eg-robot" />
            <path d="M40 -66v12M40 -66h6M40 -54h6" className="eg-tool" />
          </motion.g>
          <circle cx="0" cy="-60" r="6" className="eg-gear" />
        </motion.g>
        <circle cx="0" cy="-12" r="6" className="eg-gear" />
      </g>
      <Car x={336} y={222} />
      <text x="200" y="280" textAnchor="middle" className="bi-hand-sm">convivem lado a lado</text>
    </g>}

    <rect x="400" y="56" width="196" height="206" rx="14" className="bi-panel" />
    <motion.g key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={p(0.45, 0.2)}>
      <text x="498" y="80" textAnchor="middle" className="bi-panel-title">{m.title}</text>
      <text x="498" y="98" textAnchor="middle" className="bi-small bi-strong">{m.who}</text>
      {m.lines.map((l, k) => l && <text key={l} x="498" y={124 + k * 18} textAnchor="middle" className="bi-small">{l}</text>)}
    </motion.g>

    <path d={`M${stops[0]} 298H${stops[3]}`} className="eg-line" />
    <motion.path d={`M${stops[0]} 298H${stops[3]}`} className="eg-line-on" initial={false} animate={{ pathLength: Math.max(active / 3, 0.001) }} transition={p(0.8)} />
    {['Taylor', 'Ford', 'Toyota', 'hoje'].map((name, k) => <g key={name}>
      <circle cx={stops[k]} cy="298" r="7" className={k === active ? 'eg-node-on' : k < active ? 'eg-node-past' : 'eg-node'} />
      <text x={stops[k]} y="321" textAnchor="middle" className={k === active ? 'bi-small bi-strong bi-on' : 'bi-small'}>{name}</text>
    </g>)}
    <text x="30" y="343" className="bi-foot">Ordem dos modelos; a linha não tem escala de tempo.</text>
  </svg>;
}

// Espaço industrial brasileiro I: o café paga a fábrica e a ferrovia já está
// pronta; depois a fábrica atrai fornecedor, que atrai fábrica. A cena mostra
// a concentração em São Paulo como processo que se alimenta, não como vocação
// geográfica natural — é a pegadinha do capítulo.
const SP = geo(-23.5, -46.6);
const toMapSP = (x: number, y: number) => [24 + 0.66 * x, 50 + 0.66 * y] as const;

export function IndustrialSaoPaulo({ active }: Scene) {
  const p = usePaced();
  const [sx, sy] = toMapSP(SP[0], SP[1]);
  const cluster = [[-14, -12], [12, -16], [-20, 8], [16, 8], [0, -26], [26, -4]];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Espaço industrial brasileiro: capital do café, ferrovia e porto fundam a indústria de São Paulo, e a aglomeração se retroalimenta; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <ArrowHead id="eg-head-sp" />
    <text x="30" y="40" className="bi-kicker">SÃO PAULO · POLO INDUSTRIAL</text>
    <path d={BRAZIL} transform="translate(24 50) scale(.66)" className="bi-land" />
    {cluster.map(([dx, dy], k) => <motion.circle key={k} cx={sx + dx} cy={sy + dy} r="4.5" className="eg-city" initial={false}
      animate={{ opacity: active === 1 ? 1 : 0, scale: active === 1 ? 1 : 0 }} transition={p(0.4, active === 1 ? 0.4 + k * 0.22 : 0)}
      style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />)}
    <circle cx={sx} cy={sy} r="6" className="eg-city" />
    <motion.circle cx={sx} cy={sy} r="14" className="eg-city-ring" initial={false} animate={{ r: active === 1 ? 32 : 14 }} transition={p(1.6, 0.3)} />
    <text x={sx - 8} y={sy + 50} textAnchor="middle" className="bi-small bi-strong">São Paulo</text>

    <rect x="262" y="56" width="334" height="234" rx="14" className="bi-panel" />
    <motion.g initial={false} animate={{ opacity: active === 0 ? 1 : 0 }} transition={p(0.4)}>
      <text x="278" y="80" className="bi-panel-title">A BASE QUE O CAFÉ DEIXOU</text>
      <g transform="translate(312 130)">
        <path d="M0 22v-10" className="eg-trunk" />
        <path d="M-18 8c-6-18 6-32 18-32s24 14 18 32Z" className="eg-bush" />
        {[[-8, -8], [6, -12], [-2, 2], [10, 0], [-12, 4]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="2.6" className="eg-berry" />)}
      </g>
      <text x="312" y="170" textAnchor="middle" className="bi-small bi-strong">café</text>
      <text x="312" y="184" textAnchor="middle" className="bi-tiny">exportado</text>
      <Arrow d="M340 128H388" on={active === 0} p={p} head="eg-head-sp" delay={0.3} />
      {[0, 1, 2, 3, 4].map(k => <motion.ellipse key={k} cx={424 + (k % 2) * 3} cy={150 - k * 7} rx="16" ry="5.5" className="eg-coin" initial={false}
        animate={{ y: active === 0 ? 0 : -12, opacity: active === 0 ? 1 : 0 }} transition={p(0.35, active === 0 ? 0.5 + k * 0.15 : 0)} />)}
      <motion.g initial={false} animate={{ scale: active === 0 ? 1 : 0 }} transition={p(0.4, active === 0 ? 1.3 : 0)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <Coin x={446} y={112} r={10} />
      </motion.g>
      <text x="424" y="170" textAnchor="middle" className="bi-small bi-strong">capital</text>
      <text x="424" y="184" textAnchor="middle" className="bi-tiny">acumulado</text>
      <Arrow d="M450 128H496" on={active === 0} p={p} head="eg-head-sp" delay={1.2} />
      <Factory x={540} y={146} s={1.3} />
      <text x="540" y="170" textAnchor="middle" className="bi-small bi-strong">indústria</text>
      <text x="540" y="184" textAnchor="middle" className="bi-tiny">investimento</text>

      <path d="M280 256H500" className="eg-rail" /><path d="M280 262H500" className="eg-rail" />
      {Array.from({ length: 12 }, (_, k) => <path key={k} d={`M${286 + k * 18} 253v12`} className="eg-sleeper" />)}
      <motion.g initial={false} animate={{ x: active === 0 ? 110 : 0 }} transition={p(2.2, 0.5)}>
        <path d="M324 252v-22h14v-8h8v8h12v22Z" className="eg-train" />
        <circle cx="330" cy="253" r="4" className="eg-wheel" /><circle cx="350" cy="253" r="4" className="eg-wheel" />
        <path d="M286 252v-16h32v16Z" className="eg-wagon" />
        <rect x="292" y="228" width="9" height="8" rx="2" className="bi-sack" /><rect x="303" y="228" width="9" height="8" rx="2" className="bi-sack" />
        <circle cx="342" cy="214" r="4" className="eg-smoke" /><circle cx="334" cy="206" r="5" className="eg-smoke" />
      </motion.g>
      <path d="M504 270h86v-10h-86Z" className="eg-sea" />
      <path d="M512 264q6-4 12 0t12 0 12 0 12 0 12 0" className="eg-wave" />
      <path d="M560 258h-40l6 -8h30ZM540 250v-18M540 234l12 10h-12" className="bi-ship" />
      <path d="M512 254V206h36M548 206v14" className="eg-crane" />
      <text x="360" y="280" textAnchor="middle" className="bi-tiny">ferrovia</text>
      <text x="548" y="284" textAnchor="middle" className="bi-tiny">porto</text>
      <text x="400" y="220" textAnchor="middle" className="bi-hand-sm">já construídos para o café</text>
    </motion.g>

    <motion.g initial={false} animate={{ opacity: active === 1 ? 1 : 0 }} transition={p(0.4)}>
      <text x="278" y="80" className="bi-panel-title">EFEITO CUMULATIVO</text>
      <Arrow d="M468 108C540 116 552 168 530 206" on={active === 1} p={p} head="eg-head-sp" delay={0.2} />
      <Arrow d="M488 242C452 262 400 262 366 242" on={active === 1} p={p} head="eg-head-sp" delay={0.7} />
      <Arrow d="M322 206C302 168 320 116 388 108" on={active === 1} p={p} head="eg-head-sp" delay={1.2} />
      <text x="428" y="104" textAnchor="middle" className="bi-small bi-strong">indústrias</text>
      <text x="540" y="228" textAnchor="middle" className="bi-small bi-strong">fornecedores</text>
      <text x="540" y="243" textAnchor="middle" className="bi-small bi-strong">e serviços</text>
      <text x="316" y="228" textAnchor="middle" className="bi-small bi-strong">mais</text>
      <text x="316" y="243" textAnchor="middle" className="bi-small bi-strong">indústrias</text>
      {[[-26, 0], [26, 0], [0, -30], [0, 30]].map(([dx, dy], k) => <motion.g key={k} initial={false}
        animate={{ opacity: active === 1 ? 1 : 0, scale: active === 1 ? 1 : 0.4 }} transition={p(0.4, active === 1 ? 0.2 + k * 0.45 : 0)}
        style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}>
        <Factory x={428 + dx} y={188 + dy} s={0.8} className={k === 0 ? 'eg-factory' : 'eg-factory-new'} />
      </motion.g>)}
      <text x="428" y="272" textAnchor="middle" className="bi-hand-sm">atraem-se</text>
    </motion.g>

    <motion.g key={`b-${active}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4, 0.4)}>
      {active === 0 ? <g>
        <text x="30" y="308" className="bi-small"><tspan className="bi-strong">+ mão de obra</tspan> imigrante europeia, depois migrante</text>
        <text x="30" y="324" className="bi-small"><tspan className="bi-strong">+ maior mercado consumidor</tspan> do país</text>
      </g> : <g>
        <text x="30" y="308" className="bi-small bi-strong">mais da metade do valor da produção industrial nacional</text>
        <text x="30" y="324" className="bi-small">em certos períodos do século XX</text>
        <rect x="400" y="300" width="190" height="14" rx="7" className="bi-gauge" />
        <motion.rect x="400" y="300" height="14" rx="7" className="bi-gauge-fill" initial={{ width: 0 }} animate={{ width: 190 * 0.56 }} transition={p(1, 0.6)} />
        <path d="M495 296v22" className="bi-marker" />
        <text x="495" y="330" textAnchor="middle" className="bi-tiny">metade</text>
      </g>}
    </motion.g>
    <text x="30" y="346" className="bi-foot">Contorno simplificado; posição e barra aproximadas.</text>
  </svg>;
}

// Geografia do turismo: cada tipo tem seu atrativo e ocupa o território de um
// jeito — o de sol e praia adensa a costa, o ecoturismo limita a entrada, o
// de negócios lota a metrópole nos dias úteis.
const toMapT = (x: number, y: number) => [14 + 0.74 * x, 44 + 0.74 * y] as const;
const PLACES: { name: string; at: readonly [number, number]; type: number; dx: number; dy: number; icon: (cls: string) => React.ReactNode }[] = [
  { name: 'litoral nordestino', at: toMapT(...geo(-8.5, -35.4)), type: 0, dx: 0, dy: 0,
    icon: cls => <g><circle r="4.5" className={cls} /><path d="M0 -9v2M0 7v2M-9 0h2M7 0h2" className={cls} /></g> },
  { name: 'cidades mineiras', at: toMapT(...geo(-20.4, -43.5)), type: 1, dx: 0, dy: 0,
    icon: cls => <path d="M-5 6v-8l5-5 5 5v8ZM0 -7v-4M-2 -9h4" className={cls} /> },
  { name: 'Amazônia', at: toMapT(...geo(-4, -60)), type: 1, dx: 0, dy: 0,
    icon: cls => <path d="M0 7v-5M-6 2l6-10 6 10Z" className={cls} /> },
  { name: 'Pantanal', at: toMapT(...geo(-18, -57)), type: 1, dx: 0, dy: 0,
    icon: cls => <path d="M0 7v-5M-6 2l6-10 6 10Z" className={cls} /> },
  { name: 'São Paulo', at: toMapT(...geo(-23.5, -46.6)), type: 2, dx: -8, dy: 8,
    icon: cls => <path d="M-6 7v-10h5v10M1 7v-14h5v14" className={cls} /> },
];

export function TourismTerritories({ active }: Scene) {
  const p = usePaced();
  const towers = [[314, 36], [338, 52], [362, 44], [386, 60], [410, 40], [434, 56], [458, 48], [482, 62], [506, 44], [530, 34], [554, 50]];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Geografia do turismo: sol e praia, cultural e ecoturismo, negócios e eventos no mapa do Brasil e no padrão de ocupação de cada tipo; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">TURISMO · TIPOS E TERRITÓRIOS</text>
    <path d={BRAZIL} transform="translate(14 44) scale(.74)" className="bi-land" />
    {PLACES.map(pl => {
      const on = pl.type === active;
      const [x, y] = [pl.at[0] + pl.dx, pl.at[1] + pl.dy];
      return <motion.g key={pl.name} initial={false} animate={{ scale: on ? 1.2 : 0.85, opacity: on ? 1 : 0.55 }} transition={p(0.5, on ? 0.2 : 0)}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <circle cx={x} cy={y} r="12" className={on ? 'eg-pin-on' : 'eg-pin'} />
        <g transform={`translate(${x} ${y})`}>{pl.icon(on ? 'eg-pin-icon-on' : 'eg-pin-icon')}</g>
      </motion.g>;
    })}
    <motion.g key={`m-${active}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4, 0.4)}>
      {active === 0 && <text x="244" y="153" textAnchor="end" className="bi-small bi-strong">litoral nordestino</text>}
      {active === 1 && <g>
        <text x="108" y="86" textAnchor="middle" className="bi-tiny bi-strong">Amazônia</text>
        <text x="100" y="228" textAnchor="middle" className="bi-tiny bi-strong">Pantanal</text>
        <text x="216" y="192" textAnchor="middle" className="bi-tiny bi-strong">cidades mineiras</text>
      </g>}
      {active === 2 && <text x="174" y="242" textAnchor="end" className="bi-small bi-strong">São Paulo</text>}
    </motion.g>

    <rect x="296" y="56" width="300" height="240" rx="14" className="bi-panel" />
    <motion.g initial={false} animate={{ opacity: active === 0 ? 1 : 0 }} transition={p(0.4)}>
      <text x="312" y="80" className="bi-panel-title">SOL E PRAIA</text>
      <text x="312" y="98" className="bi-small">litoral nordestino · Caribe</text>
      <g transform="translate(556 94)">
        <circle r="13" className="eg-sun" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map(a => <path key={a} d="M0 -18v-5" transform={`rotate(${a})`} className="eg-ray" />)}
      </g>
      <path d="M306 262h280v24h-280Z" className="eg-sea" />
      <path d="M314 272q7-5 14 0t14 0 14 0 14 0 14 0 14 0 14 0 14 0 14 0 14 0 14 0 14 0 14 0 14 0 14 0 14 0 14 0 14 0 14 0" className="eg-wave" />
      <path d="M306 246h280v16h-280Z" className="eg-sand" />
      {towers.map(([x, h], k) => <motion.g key={x} initial={false} animate={{ scaleY: active === 0 ? 1 : 0 }} transition={p(0.5, active === 0 ? 0.3 + k * 0.14 : 0)}
        style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}>
        <rect x={x} y={246 - h - 24} width="18" height={h + 24} className="eg-tower" />
        {Array.from({ length: Math.floor((h + 16) / 14) }, (_, r) => <rect key={r} x={x + 4} y={250 - h - 20 + r * 14} width="10" height="6" className="eg-window" />)}
      </motion.g>)}
      <text x="312" y="116" className="bi-small">clima tropical estável</text>
      <text x="446" y="136" textAnchor="middle" className="bi-hand-sm">hotéis se adensam na costa</text>
    </motion.g>

    <motion.g initial={false} animate={{ opacity: active === 1 ? 1 : 0 }} transition={p(0.4)}>
      <text x="312" y="80" className="bi-panel-title">CULTURAL</text>
      <text x="458" y="80" className="bi-panel-title">ECOTURISMO</text>
      <path d="M446 92V284" className="eg-divider" />
      <g transform="translate(372 208)">
        <path d="M-50 40v-34h22v34ZM28 40v-30h24v30Z" className="eg-church" />
        <path d="M-54 8l15-14 15 14ZM24 12l16-14 16 14Z" className="eg-roof" />
        <path d="M-20 40v-56h40v56Z" className="eg-church" />
        <path d="M-24 -14L0 -36 24 -14Z" className="eg-roof" />
        <path d="M0 -36v-14M-5 -45h10" className="bi-icon" />
        <path d="M-6 40v-16a6 6 0 0 1 12 0v16" className="eg-church" />
        <circle cx="0" cy="-2" r="5" className="eg-church" />
      </g>
      <text x="372" y="112" textAnchor="middle" className="bi-small">patrimônio tombado</text>
      <text x="372" y="126" textAnchor="middle" className="bi-small">pelo Iphan</text>
      {[[470, 206, 1], [574, 196, 1.2], [520, 184, 0.9]].map(([x, y, s]) => <g key={x} transform={`translate(${x} ${y}) scale(${s})`}>
        <path d="M0 26V6" className="eg-trunk" />
        <path d="M0 -22c14 0 18 14 12 22 6 6 0 16-12 14-12 2-18-8-12-14-6-8-2-22 12-22Z" className="eg-tree" />
      </g>)}
      <path d="M458 280C492 262 540 262 560 240" className="eg-trail" />
      <path d="M506 272v-26M530 268v-28M506 250h24" className="eg-gate" />
      {[0, 1].map(k => <motion.g key={k} initial={false} animate={{ x: active === 1 ? 40 + k * 20 : 0, opacity: active === 1 ? 1 : 0 }} transition={p(1.2, 0.4 + k * 0.4)}>
        <Person x={470} y={244} s={0.5} coat="bi-coat-green" />
      </motion.g>)}
      {[0, 1].map(k => <motion.g key={`w-${k}`} initial={false} animate={{ opacity: active === 1 ? 1 : 0 }} transition={p(0.4, 1.4 + k * 0.2)}>
        <Person x={470 - k * 14} y={258} s={0.5} coat="bi-coat-plain" />
      </motion.g>)}
      <text x="520" y="112" textAnchor="middle" className="bi-small">baixo impacto,</text>
      <text x="520" y="126" textAnchor="middle" className="bi-small">capacidade de</text>
      <text x="520" y="140" textAnchor="middle" className="bi-small">carga limitada</text>
    </motion.g>

    <motion.g initial={false} animate={{ opacity: active === 2 ? 1 : 0 }} transition={p(0.4)}>
      <text x="312" y="80" className="bi-panel-title">NEGÓCIOS E EVENTOS</text>
      <text x="312" y="98" className="bi-small">grandes metrópoles, como São Paulo</text>
      {[[318, 70], [340, 110], [366, 86], [540, 96], [562, 70]].map(([x, h]) => <g key={x}>
        <rect x={x} y={272 - h} width="20" height={h} className="eg-tower" />
        {Array.from({ length: Math.floor(h / 14) }, (_, r) => <rect key={r} x={x + 5} y={276 - h + r * 14} width="10" height="6" className="eg-window" />)}
      </g>)}
      <path d="M396 272v-34h140v34ZM400 238c10-34 122-34 132 0" className="eg-dome" />
      <text x="466" y="260" textAnchor="middle" className="bi-small bi-strong">centro de convenções</text>
      <path d="M306 272h280" className="bi-ground" />
      {[0, 1, 2, 3].map(k => <motion.g key={k} initial={false} animate={{ x: active === 2 ? 60 + k * 12 : 0, opacity: active === 2 ? [0, 1, 1] : 0 }} transition={p(1.2, 0.4 + k * 0.2)}>
        <Person x={330} y={258} s={0.42} coat={k % 2 ? 'bi-coat-dark' : 'bi-coat'} />
      </motion.g>)}
      <g transform="translate(420 118)">
        <rect x="0" y="0" width="160" height="44" rx="6" className="eg-calendar" />
        {['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom'].map((d, k) => <g key={d}>
          <motion.rect x={6 + k * 22} y="14" width="18" height="22" rx="3" className={k < 5 ? 'eg-day-on' : 'eg-day'} initial={false}
            animate={{ opacity: active === 2 ? 1 : 0.4 }} transition={p(0.3, active === 2 ? 0.5 + k * 0.1 : 0)} />
          <text x={15 + k * 22} y="29" textAnchor="middle" className={k < 5 ? 'eg-day-text' : 'bi-tiny'}>{d.slice(0, 1).toUpperCase()}</text>
        </g>)}
        <text x="80" y="10" textAnchor="middle" className="bi-tiny bi-strong">dias úteis</text>
      </g>
    </motion.g>
    <text x="30" y="322" className="bi-small"><tspan className="bi-strong">cada tipo, um padrão de ocupação:</tspan> sem hierarquia entre eles</text>
    <text x="30" y="342" className="bi-foot">Contorno simplificado; posições aproximadas; prédios ilustrativos.</text>
  </svg>;
}

// Blocos econômicos: um bloco de três membros e um país de fora. Cada degrau
// acrescenta um compromisso ao anterior — muralhas próprias viram uma tarifa
// comum, mercadorias ganham a companhia de pessoas e capitais, três moedas
// viram uma. O erro que o capítulo mais aponta (todo bloco tem moeda comum)
// fica à vista: a moeda única só aparece no último degrau.
const STEPS = [
  { name: 'zona de livre comércio', add: 'tarifa interna zero', ex: 'USMCA' },
  { name: 'união aduaneira', add: '+ tarifa externa comum', ex: 'Mercosul*' },
  { name: 'mercado comum', add: '+ pessoas, capitais, serviços', ex: '' },
  { name: 'união econ. e monetária', add: '+ moeda única', ex: 'UE' },
];
const WALLS = [7, 15, 10];

export function BlocIntegration({ active }: Scene) {
  const p = usePaced();
  const strips = [64, 130, 196];
  const flows = [
    { x: 176, on: true, icon: <path d="M-7 -6h14v12h-14ZM-7 -1h14" className="eg-crate" /> },
    { x: 214, on: active >= 2, icon: <g><circle cx="0" cy="-5" r="3.5" className="bi-face" /><path d="M-6 8c0-6 2-9 6-9s6 3 6 9Z" className="bi-coat" /></g> },
    { x: 250, on: active >= 2, icon: <g><circle r="7" className="eg-coin" /><text y="3" textAnchor="middle" className="eg-coin-text">$</text></g> },
    { x: 286, on: active >= 2, icon: <g><path d="M-7 -3h14v10h-14Z" className="eg-crate" /><path d="M-3 -3v-3h6v3M-7 1h14" className="bi-icon" /></g> },
  ];
  const coinShapes = ['M0 -4l4 7h-8Z', 'M-3.5 -3.5h7v7h-7Z', 'M0 -4.5l4.5 4.5-4.5 4.5-4.5-4.5Z'];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Blocos econômicos: zona de livre comércio, união aduaneira, mercado comum e união econômica e monetária, cada grau acrescentando um compromisso ao anterior; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">BLOCOS ECONÔMICOS · GRAUS DE INTEGRAÇÃO</text>

    <g transform="translate(56 150)">
      <path d="M-20 12h40l-6 9h-28ZM-4 12v-20M-4 -6l14 10h-14" className="bi-ship" />
      <rect x="2" y="2" width="9" height="8" rx="1" className="eg-crate" />
    </g>
    <text x="56" y="186" textAnchor="middle" className="bi-small bi-strong">país</text>
    <text x="56" y="200" textAnchor="middle" className="bi-small bi-strong">de fora</text>
    {strips.map((y, k) => <g key={y}>
      <rect x="130" y={y} width="210" height="66" className={`eg-member eg-member-${'abc'[k]}`} />
      <text x="140" y={y + 18} className="bi-tiny bi-strong">membro {k + 1}</text>
    </g>)}
    <path d="M130 130H340M130 196H340" className="eg-border" />
    <rect x="130" y="64" width="210" height="198" rx="4" className="eg-bloc" />

    {strips.map((y, k) => <motion.rect key={`w-${y}`} y={y + 3} height="60" rx="2" className="eg-wall" initial={false}
      animate={{ x: 124 - (active >= 1 ? 12 : WALLS[k]), width: active >= 1 ? 12 : WALLS[k] }} transition={p(0.7, active === 1 ? 0.2 + k * 0.15 : 0)} />)}
    <motion.rect x="112" y="64" width="12" height="198" rx="2" className="eg-wall" initial={false}
      animate={{ opacity: active >= 1 ? 1 : 0 }} transition={p(0.4, active >= 1 ? 0.7 : 0)} />
    <motion.path d="M112 100h12M112 140h12M112 180h12M112 220h12" className="eg-wall-brick" initial={false}
      animate={{ opacity: active >= 1 ? 1 : 0 }} transition={p(0.4, active >= 1 ? 0.7 : 0)} />
    <text x="34" y="282" className="bi-tiny bi-strong">{active >= 1 ? 'tarifa externa comum' : 'cada um, sua tarifa'}</text>
    <ArrowHead id="eg-head-bloc" />
    {['M80 138C92 124 96 110 104 100', 'M84 150H104', 'M80 162C92 180 96 200 104 222'].map(d => <path key={d} d={d} className="bi-arrow-static" markerEnd="url(#eg-head-bloc)" />)}

    {flows.map((f, k) => <motion.g key={f.x} initial={false} animate={{ opacity: f.on ? 1 : 0 }} transition={p(0.4, f.on && k > 0 && active === 2 ? 0.2 + k * 0.2 : 0)}>
      <path d={`M${f.x} 92V234`} className="eg-flow" strokeDasharray="2 5" />
      <motion.g initial={false} animate={f.on ? { y: [0, 132, [66, 132, 0, 66][k]] } : { y: 0 }} transition={p(1.8, 0.2 + k * 0.15)}>
        <g transform={`translate(${f.x} 97)`}>{f.icon}</g>
      </motion.g>
    </motion.g>)}
    {strips.map((y, k) => <g key={`c-${y}`} transform={`translate(318 ${y + 36})`}>
      <motion.circle r="10" className="eg-coin" initial={false} animate={{ scale: active === 3 ? [1, 1.25, 1] : 1 }} transition={p(0.6, active === 3 ? 0.3 + k * 0.2 : 0)}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
      <motion.path d={coinShapes[k]} className="eg-coin-text" initial={false} animate={{ opacity: active === 3 ? 0 : 1 }} transition={p(0.3, 0.5)} />
      <motion.path d="M0 -6l1.8 3.8 4.2.5-3 2.9.8 4.2L0 3.4l-3.8 2 .8-4.2-3-2.9 4.2-.5Z" className="eg-coin-text" initial={false}
        animate={{ opacity: active === 3 ? 1 : 0 }} transition={p(0.3, active === 3 ? 0.8 + k * 0.1 : 0)} />
    </g>)}
    <text x="340" y="282" textAnchor="end" className="bi-tiny">{active === 3 ? 'uma só moeda para os três' : 'cada membro, sua moeda'}</text>

    {STEPS.map((s, k) => {
      const y = 232 - k * 52;
      const x = 360 + k * 12;
      const cls = k === active ? 'eg-step-on' : k < active ? 'eg-step-past' : 'eg-step';
      return <motion.g key={s.name} initial={false} animate={{ opacity: k <= active ? 1 : 0.55 }} transition={p(0.4, k === active ? 0.2 : 0)}>
        <rect x={x} y={y} width={596 - x} height="46" rx="8" className={cls} />
        <text x={x + 10} y={y + 19} className={k === active ? 'bi-small bi-strong bi-on' : 'bi-small bi-strong'}>{s.name}</text>
        <text x={x + 10} y={y + 36} className="bi-tiny">{s.add}</text>
        {s.ex && <text x="586" y={y + 19} textAnchor="end" className="bi-tiny bi-strong">{s.ex}</text>}
      </motion.g>;
    })}
    <text x="360" y="298" className="bi-hand-sm">moeda comum só no último degrau</text>
    <text x="30" y="320" className="bi-small">Todos os graus eliminam a tarifa entre os membros; muda o que vem junto.</text>
    <text x="30" y="342" className="bi-foot">*Mercosul: união aduaneira formal, com falhas na prática. Esquema, sem escala.</text>
  </svg>;
}

// Desigualdades globais: a balança de Prebisch. A periferia põe cada vez mais
// sacas no prato para comprar o mesmo produto industrializado; a resposta foi
// erguer um muro de tarifas e fabricar em casa, o que fez crescer o PIB
// industrial sem fazer a fábrica competir lá fora.
const CHAIN = [
  { title: 'termos de troca', sub: 'commodities perdem valor' },
  { title: 'substituição', sub: 'tarifas altas, 1930–1970' },
  { title: 'baixa competitividade', sub: 'PIB industrial cresce' },
];

function Sack({ x, y }: { x: number; y: number }) {
  return <g>
    <path d={`M${x - 11} ${y}q-1-14 4-16h14q5 2 4 16Z`} className="bi-sack-big" />
    <path d={`M${x - 4} ${y - 15}h8`} className="bi-sack-tie" />
  </g>;
}

export function TermsOfTrade({ active }: Scene) {
  const p = usePaced();
  const sacks = [[250, 144], [272, 144], [228, 144], [261, 128], [239, 128], [250, 112]];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Desigualdades globais: deterioração dos termos de troca, industrialização por substituição de importações e parques fabris pouco competitivos; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <ArrowHead id="eg-head-tt" />
    <text x="30" y="40" className="bi-kicker">CENTRO E PERIFERIA · PREBISCH E CEPAL</text>

    <g transform="translate(92 200)">
      {[0, 1, 2, 3].map(k => <path key={k} d={`M${-50 + k * 8} 30L${-34 + k * 8} 4`} className="eg-furrow" />)}
      <path d="M-56 30L-40 4H0L-8 30Z" className="eg-field" />
      {[0, 1, 2].map(k => <path key={`s-${k}`} d={`M${-38 + k * 12} 22v-8M${-38 + k * 12} 17l-4-3M${-38 + k * 12} 17l4-3`} className="eg-sprout" />)}
      <path d="M6 30l18-34 20 34Z" className="eg-mine" />
      <path d="M20 -14l14 12M26 -18l-8 10" className="eg-tool" />
    </g>
    <text x="92" y="84" textAnchor="middle" className="bi-label">periferia</text>
    <text x="92" y="100" textAnchor="middle" className="bi-tiny">commodities agrícolas</text>
    <text x="92" y="112" textAnchor="middle" className="bi-tiny">e minerais</text>
    <g transform="translate(530 226)">
      <Factory x={0} y={0} s={1.6} />
      <motion.g initial={false} animate={{ rotate: active === 0 ? 180 : 0 }} transition={p(2, 0.3)} style={{ transformOrigin: '-44px -52px' }}>
        <circle cx="-44" cy="-52" r="10" className="eg-gear" />
        <path d="M-44 -66v28M-58 -52h28" className="eg-tool" />
      </motion.g>
    </g>
    <text x="530" y="84" textAnchor="middle" className="bi-label">centro</text>
    <text x="530" y="100" textAnchor="middle" className="bi-tiny">manufaturados e</text>
    <text x="530" y="112" textAnchor="middle" className="bi-tiny">serviços de alta tecnologia</text>

    <motion.g initial={false} animate={{ opacity: active === 0 ? 1 : 0 }} transition={p(0.4)}>
      <path d="M310 226V96" className="eg-beam" />
      <path d="M294 234h32l-5-9h-22Z" className="eg-post" />
      <circle cx="310" cy="96" r="5" className="eg-post" />
      <path d="M226 96H394" className="eg-beam" />
      <path d="M250 96l-36 76M250 96l36 76M370 96l-36 76M370 96l36 76" className="eg-pan" />
      <path d="M210 172h80M330 172h80" className="eg-beam" />
      {sacks.map(([x, y], k) => <motion.g key={`${x}-${y}`} initial={false} animate={{ opacity: active === 0 ? 1 : 0, y: active === 0 ? 0 : -8 }}
        transition={p(0.35, active === 0 ? 0.3 + k * 0.25 : 0)}>
        <Sack x={x} y={y + 26} />
      </motion.g>)}
      <g transform="translate(370 170)">
        <path d="M-18 0v-24h36v24Z" className="eg-machine" />
        <circle cx="0" cy="-12" r="7" className="eg-gear" />
      </g>
      <text x="250" y="192" textAnchor="middle" className="bi-tiny bi-strong">cada vez mais sacas</text>
      <text x="370" y="192" textAnchor="middle" className="bi-tiny bi-strong">o mesmo produto</text>
      <text x="310" y="256" textAnchor="middle" className="bi-hand-sm">ao longo do século XX</text>
    </motion.g>

    <motion.g initial={false} animate={{ opacity: active >= 1 ? 1 : 0 }} transition={p(0.4)}>
      {Array.from({ length: 6 }, (_, r) => <motion.g key={r} initial={false} animate={{ opacity: active >= 1 ? 1 : 0, y: active >= 1 ? 0 : -14 }} transition={p(0.3, active === 1 ? 0.2 + r * 0.12 : 0)}>
        {(r % 2 ? [[340, 12], [352, 24], [376, 12]] : [[340, 24], [364, 24]]).map(([x, w]) => <rect key={x} x={x} y={214 - r * 20} width={w} height="20" className="eg-wall" />)}
      </motion.g>)}
      <text x="364" y="104" textAnchor="middle" className="bi-small bi-strong">tarifas altas</text>
      <motion.g initial={false} animate={active === 1 ? { x: [0, -58, -48, -58, -48] } : { x: 0 }} transition={p(1.6, 1.2)}>
        <g transform="translate(452 214)"><path d="M-14 20v-20h28v20Z" className="eg-crate" /><path d="M-14 8h28" className="eg-furrow" /></g>
      </motion.g>
      <text x="452" y="250" textAnchor="middle" className="bi-tiny">importado barrado</text>
      <motion.g initial={false} animate={{ scale: active === 2 ? 1.25 : 1 }} transition={p(0.9, 0.3)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}>
        <Factory x={260} y={234} s={1.2} className="eg-factory-new" />
      </motion.g>
      <text x="260" y="250" textAnchor="middle" className="bi-tiny">indústria nacional</text>
    </motion.g>

    <motion.g initial={false} animate={{ opacity: active === 2 ? 1 : 0 }} transition={p(0.4, active === 2 ? 0.5 : 0)}>
      <text x="196" y="96" className="bi-tiny bi-strong">PIB industrial</text>
      <rect x="196" y="102" width="96" height="10" rx="5" className="eg-meter" />
      <motion.rect x="196" y="102" height="10" rx="5" className="eg-meter-up" initial={false} animate={{ width: active === 2 ? 84 : 0 }} transition={p(0.9, 0.8)} />
      <text x="196" y="128" className="bi-tiny bi-strong">competitividade lá fora</text>
      <rect x="196" y="134" width="96" height="10" rx="5" className="eg-meter" />
      <motion.rect x="196" y="134" height="10" rx="5" className="eg-meter-down" initial={false} animate={{ width: active === 2 ? 22 : 0 }} transition={p(0.9, 1.2)} />
      <text x="452" y="140" textAnchor="middle" className="bi-hand-sm">cresce protegida,</text>
      <text x="452" y="158" textAnchor="middle" className="bi-hand-sm">compete mal lá fora</text>
    </motion.g>

    {CHAIN.map((c, k) => {
      const x = 30 + k * 190;
      const cls = k === active ? 'eg-card-on' : 'eg-card';
      return <g key={c.title}>
        <motion.rect x={x} y="272" width="170" height="46" rx="10" className={cls} initial={false} animate={{ opacity: k <= active ? 1 : 0.5 }} transition={p(0.4)} />
        <text x={x + 85} y="291" textAnchor="middle" className={k === active ? 'bi-small bi-strong bi-on' : 'bi-small bi-strong'}>{c.title}</text>
        <text x={x + 85} y="307" textAnchor="middle" className="bi-tiny">{c.sub}</text>
        {k < 2 && <Arrow d={`M${x + 172} 295H${x + 186}`} on={k < active} p={p} head="eg-head-tt" delay={0.2} />}
      </g>;
    })}
    <text x="30" y="340" className="bi-foot">Quantidades ilustrativas, sem escala. A base industrial criada não foi perdida.</text>
  </svg>;
}

// Do mundo bipolar ao multipolar: dois polos, e a cena acompanha o que
// acontece com o soviético — o gasto militar pesa sobre a economia, as
// reformas soltam as tensões, o polo se parte — até restar um só.
const yearX = (y: number) => 50 + (y - 1947) * 8;
const SATS = [[-56, -20], [-50, 28], [56, -20], [50, 28]];

export function WorldOrder({ active }: Scene) {
  const p = usePaced();
  // Cinco fatias do mesmo círculo: na dissolução cada uma se afasta pela
  // própria bissetriz, então o polo se desfaz em vez de só sumir.
  const shards = Array.from({ length: 5 }, (_, k) => {
    const a0 = (-90 + k * 72) * Math.PI / 180;
    const a1 = a0 + 72 * Math.PI / 180;
    const mid = (a0 + a1) / 2;
    const pt = (a: number) => `${(300 + 36 * Math.cos(a)).toFixed(1)} ${(150 + 36 * Math.sin(a)).toFixed(1)}`;
    return { d: `M300 150L${pt(a0)}A36 36 0 0 1 ${pt(a1)}Z`, dx: 24 * Math.cos(mid), dy: 24 * Math.sin(mid), rot: (k % 2 ? 1 : -1) * (10 + k * 4) };
  });
  const su = [300, 150];
  const notes = [
    { title: 'ECONOMIA SUFOCADA', lines: ['gasto militar', 'desproporcional ao PIB', 'e planejamento central', 'rígido: não acompanha', 'a modernização', 'tecnológica ocidental'] },
    { title: 'REFORMAS DE GORBACHEV', lines: ['glasnost: abertura', 'política', 'perestroika: reforma', 'econômica', 'afrouxam o controle e', 'soltam tensões represadas'] },
    { title: 'FIM DA BIPOLARIDADE', lines: ['1989: cai o Muro de', 'Berlim, colapso do bloco', 'socialista europeu', 'dez. 1991: dissolução', 'formal da União', 'Soviética'] },
    { title: 'MOMENTO UNIPOLAR', lines: ['EUA: única superpotência', 'militar e econômica', 'por cerca de duas', 'décadas', 'depois: China, UE, Rússia,', 'Índia, Brasil… (multipolar)'] },
  ][active];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Do mundo bipolar ao multipolar: economia soviética sufocada, reformas de Gorbachev, queda do Muro e dissolução da URSS, momento unipolar americano; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">ORDEM MUNDIAL · 1947 EM DIANTE</text>

    <motion.g initial={false} animate={{ scale: active === 3 ? 1.35 : 1, x: active === 3 ? 60 : 0 }} transition={p(1, active === 3 ? 0.6 : 0)}
      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
      {SATS.map(([dx, dy]) => <circle key={`${dx}${dy}`} cx={120 + dx} cy={150 + dy} r="7" className="eg-sat-us" />)}
      <circle cx="120" cy="150" r="36" className="eg-us" />
      <text x="120" y="155" textAnchor="middle" className="eg-pole-text">EUA</text>
    </motion.g>
    <motion.g initial={false} animate={{ opacity: active === 3 ? 0 : 1 }} transition={p(0.5)}>
      <text x="120" y="222" textAnchor="middle" className="bi-tiny bi-strong">Otan</text>
    </motion.g>
    <motion.g initial={false} animate={{ opacity: active >= 2 ? 0 : 1 }} transition={p(0.5, active >= 2 ? 0.6 : 0)}>
      {SATS.map(([dx, dy]) => <circle key={`${dx}${dy}`} cx={su[0] - dx} cy={su[1] + dy} r="7" className="eg-sat-su" />)}
      <text x={su[0]} y="222" textAnchor="middle" className="bi-tiny bi-strong">Pacto de Varsóvia</text>
    </motion.g>
    <motion.g initial={false} animate={{ opacity: active >= 2 ? 0 : 1 }} transition={p(0.3, active >= 2 ? 0.5 : 0)}>
      <circle cx={su[0]} cy={su[1]} r="36" className="eg-su" />
      <text x={su[0]} y={su[1] + 5} textAnchor="middle" className="eg-pole-text">URSS</text>
    </motion.g>
    {shards.map(({ d, dx, dy, rot }, k) => <motion.path key={k} d={d} className="eg-su"
      initial={false} animate={active >= 2 ? { x: dx, y: dy, rotate: rot, opacity: active === 3 ? 0 : 1 } : { x: 0, y: 0, rotate: 0, opacity: 0 }}
      transition={p(0.9, active === 2 ? 0.6 + k * 0.1 : 0)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />)}

    <motion.g initial={false} animate={{ opacity: active === 0 ? 1 : 0, y: active === 0 ? 0 : -20 }} transition={p(0.6, active === 0 ? 0.3 : 0)}>
      <path d="M250 110v-24h100v24Z" className="eg-weight" />
      <path d="M258 104l6-14 6 14-6-3Z" className="eg-missile" />
      <text x="310" y="102" textAnchor="middle" className="eg-weight-text">gasto militar</text>
    </motion.g>
    <motion.g initial={false} animate={{ opacity: active === 0 ? 1 : 0 }} transition={p(0.4)}>
      <motion.g initial={false} animate={{ rotate: active === 0 ? [0, 120, 150, 160] : 0 }} transition={p(2, 0.4)} style={{ transformOrigin: `${su[0]}px ${su[1] + 20}px` }}>
        <circle cx={su[0]} cy={su[1] + 20} r="9" className="eg-gear" />
        <path d={`M${su[0]} ${su[1] + 7}v26M${su[0] - 13} ${su[1] + 20}h26`} className="eg-tool" />
      </motion.g>
      <text x={su[0]} y="240" textAnchor="middle" className="bi-small bi-warn">economia emperra</text>
    </motion.g>

    <motion.g initial={false} animate={{ opacity: active === 1 ? 1 : 0 }} transition={p(0.4)}>
      {[[-28, -40], [0, -48], [28, -40]].map(([dx, dy], k) => <motion.path key={k} d={`M${su[0] + dx} ${su[1] + dy + 10}q-6-8 0-14t0-14`} className="eg-steam"
        initial={false} animate={{ pathLength: active === 1 ? 1 : 0, y: active === 1 ? -6 : 0 }} transition={p(0.9, active === 1 ? 0.6 + k * 0.25 : 0)} />)}
      <rect x="214" y="232" width="70" height="18" rx="9" className="bi-plinth" />
      <text x="249" y="245" textAnchor="middle" className="bi-plinth-text">glasnost</text>
      <rect x="312" y="232" width="84" height="18" rx="9" className="bi-plinth" />
      <text x="354" y="245" textAnchor="middle" className="bi-plinth-text">perestroika</text>
    </motion.g>

    <motion.g initial={false} animate={{ opacity: active === 2 ? 1 : 0 }} transition={p(0.4)}>
      {[0, 1, 2, 3, 4, 5].map(k => <motion.rect key={k} x={196 + (k % 2) * 14} y={214 - Math.floor(k / 2) * 12} width="26" height="11" rx="1.5" className="eg-brick"
        initial={false} animate={active === 2 ? { x: (k % 2 ? 12 : -10) + k * 3, y: 20 - Math.floor(k / 2) * -2, rotate: (k % 2 ? 1 : -1) * 30 } : { x: 0, y: 0, rotate: 0 }}
        transition={p(0.8, active === 2 ? 0.2 + k * 0.06 : 0)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />)}
      <text x="216" y="268" textAnchor="middle" className="bi-tiny bi-strong">Muro de Berlim, 1989</text>
    </motion.g>

    <motion.text x="210" y="70" textAnchor="middle" className="bi-hand-sm" key={`h-${active === 3}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4, 0.8)}>
      {active === 3 ? 'resta um polo' : 'dois polos, sem confronto direto'}
    </motion.text>

    <rect x="418" y="56" width="178" height="206" rx="14" className="bi-panel" />
    <motion.g key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={p(0.45, 0.2)}>
      <text x="507" y="82" textAnchor="middle" className="bi-panel-title">{notes.title}</text>
      {notes.lines.map((l, k) => <text key={l} x="507" y={110 + k * 22} textAnchor="middle" className={active === 3 && k >= 4 ? 'bi-tiny' : 'bi-small'}>{l}</text>)}
    </motion.g>

    <rect x={yearX(1947)} y="290" width={yearX(1991) - yearX(1947)} height="12" className="eg-band-bi" />
    <motion.rect x={yearX(1991)} y="290" height="12" className="eg-band-uni" initial={false} animate={{ width: active === 3 ? yearX(2011) - yearX(1991) : 0 }} transition={p(1, 0.6)} />
    <path d={`M${yearX(1947)} 296H${yearX(2011)}`} className="bi-axis" />
    <text x={(yearX(1947) + yearX(1991)) / 2} y="282" textAnchor="middle" className="bi-tiny">ordem bipolar · Guerra Fria</text>
    <motion.text x={(yearX(1991) + yearX(2011)) / 2} y="282" textAnchor="middle" className="bi-tiny bi-strong" initial={false}
      animate={{ opacity: active === 3 ? 1 : 0 }} transition={p(0.4, 0.8)}>momento unipolar</motion.text>
    <motion.rect x={yearX(1980)} y="292" width={yearX(1990) - yearX(1980)} height="8" rx="4" className="bi-dot" initial={false} animate={{ opacity: active === 0 || active === 1 ? 1 : 0.35 }} transition={p(0.4)} />
    {[[1947, '1947', 318], [1989, '1989', 282], [1991, 'dez. 1991', 318]].map(([y, label, ty]) => <g key={label as string}>
      <motion.circle cx={yearX(y as number)} cy="296" r="4.5" className={y === 1991 ? 'bi-dot bi-dot-warn' : 'bi-dot'} initial={false}
        animate={{ scale: (active === 2 && y !== 1947) ? 1.6 : 1 }} transition={p(0.4, 0.4)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
      <text x={yearX(y as number) + (y === 1989 ? -4 : 0)} y={ty as number} textAnchor={y === 1947 ? 'start' : y === 1989 ? 'end' : 'middle'} className={active === 2 && y !== 1947 ? 'bi-tiny bi-strong' : 'bi-tiny'}>{label as string}</text>
    </g>)}
    <text x={(yearX(1980) + yearX(1990)) / 2 - 16} y="318" textAnchor="middle" className="bi-tiny">anos 1980</text>
    <text x="30" y="342" className="bi-foot">Polos e tamanhos são esquema; a faixa unipolar cobre “cerca de duas décadas”.</text>
  </svg>;
}

export const SCENES_LOTE10: Record<string, React.ComponentType<Scene>> = {
  'summary-geografia-producao-agricola-mundial': AgricultureSystems,
  'summary-geografia-industria-i': ProductionModels,
  'summary-geografia-o-espaco-industrial-brasileiro-i': IndustrialSaoPaulo,
  'summary-geografia-geografia-do-turismo': TourismTerritories,
  'summary-geografia-blocos-economicos': BlocIntegration,
  'summary-geografia-desigualdades-globais': TermsOfTrade,
  'summary-geografia-do-mundo-bipolar-ao-multipolar': WorldOrder,
};

export const HEADERS_LOTE10: Record<string, string> = {
  'summary-geografia-producao-agricola-mundial': 'sistemas agrícolas',
  'summary-geografia-industria-i': 'modelos produtivos',
  'summary-geografia-o-espaco-industrial-brasileiro-i': 'concentração industrial',
  'summary-geografia-geografia-do-turismo': 'tipos e territórios',
  'summary-geografia-blocos-economicos': 'graus de integração',
  'summary-geografia-desigualdades-globais': 'centro e periferia',
  'summary-geografia-do-mundo-bipolar-ao-multipolar': 'ordem mundial',
};
