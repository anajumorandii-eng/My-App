import React from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import { BRAZIL } from './GeografiaFisica';
import { ArrowHead, type Scene } from './cenaKit';
import './AguasBiomas.css';

// Lote 16: águas e biomas. As duas hidrografias e as duas biogeografias
// abriam com a mesma cena genérica (a de bacia e a de contexto), o que fazia
// capítulos diferentes parecerem o mesmo. Cada cena aqui tem uma forma
// própria: a mundial compara rios e escassez em vinhetas, a do Brasil põe as
// bacias no mapa, a Biogeografia I corta a vegetação em perfil e a II
// acompanha o pulso da água no Pantanal e no litoral. Fatos e números vêm só
// do resumo de cada capítulo; o que é desenho sem medida diz isso na prancha.

function usePaced() {
  const t = useSceneMotion();
  return (duration: number, delay = 0) => (t.duration === 0 ? t : { ...t, duration, delay });
}

/** Valor inicial de uma animação de entrada: sob movimento reduzido a cena
 *  nasce no estado final, sem passar pelo inicial. */
function useFrom() {
  const t = useSceneMotion();
  return <T,>(from: T, to: T) => (t.duration === 0 ? to : from);
}

const Frame = ({ kicker }: { kicker: string }) => <>
  <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
  <text x="30" y="40" className="bi-kicker">{kicker}</text>
</>;

function Fish({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <path d="M-7 0q6-6 12 0q-6 6-12 0ZM-7 0l-5-4v8Z" className="ab-fish" />
    <circle cx="2" cy="-1" r="0.9" className="ab-eye" />
  </g>;
}

function House({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M-5 3v-6l5-4 5 4v6Z" className="ab-house" />;
}

function Flame({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0c-9 0-11-9-6-15 0 5 3 6 4 4-2-6 2-12 7-14-2 6 5 9 5 16 0 6-4 9-10 9Z" className="ab-flame" />
    <path d="M0 0c-4 0-5-4-2-7 1 2 2 2 3 1 0-2 2-4 3-5 0 3 2 5 2 7 0 3-2 4-6 4Z" className="ab-flame-core" />
  </g>;
}

function Drop({ x, y, s = 1, cls = 'ab-drop' }: { x: number; y: number; s?: number; cls?: string }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 -9C4 -3 6 0 6 3a6 6 0 0 1-12 0c0-3 2-6 6-12Z" className={cls} />;
}

function Cloud({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M-22 6a8 8 0 0 1 2-14a11 11 0 0 1 20-4a9 9 0 0 1 16 6a7 7 0 0 1 2 12Z" className="ab-cloud" />;
}

// ————————————————————————————————————————————————————————————————
// Hidrogeografia mundial: quatro vinhetas, uma por recorte, porque cada uma
// mede uma coisa diferente — comprimento contra vazão, ocupação ao longo do
// vale, o efeito de quem está a montante e a água por habitante.
// ————————————————————————————————————————————————————————————————

const NILE = 'M52 106C120 94 170 118 230 104S340 94 400 108S500 118 566 104';
const AMAZON = 'M52 254C120 244 180 264 250 252S350 244 426 252';

function LengthVsFlow() {
  const p = usePaced(); const s = useFrom();
  return <g>
    <text x="40" y="74" className="bi-label">Nilo</text>
    <text x="80" y="74" className="bi-small">mais de 6.600 km: o rio mais extenso do mundo</text>
    <rect x="40" y="84" width="540" height="44" rx="12" className="ab-sand" />
    {[70, 150, 262, 330, 452, 520].map((x, k) => <path key={x} d={`M${x} ${k % 2 ? 94 : 124}q14-9 28 0`} className="ab-dune" />)}
    <motion.path d={NILE} className="ab-river" initial={{ pathLength: s(0, 1) }} animate={{ pathLength: 1 }} transition={p(1.2, 0.2)} />
    <motion.path d={NILE} className="ab-flow-thin" initial={{ strokeDashoffset: s(0, -90) }} animate={{ strokeDashoffset: -90 }} transition={p(3, 1.2)} />
    <path d="M566 104l10-8M566 104h12M566 104l10 8" className="ab-river-thin" />
    <path d="M52 140H566M52 134v12M566 134v12" className="ab-measure" />
    <text x="309" y="158" textAnchor="middle" className="bi-tiny">comprimento</text>

    <text x="40" y="184" className="bi-label">Amazonas</text>
    <text x="126" y="184" className="bi-small">mais curto, porém com muito mais água</text>
    {[140, 240, 340].map((x, k) => <g key={x}>
      <Cloud x={x} y={212} s={0.9} />
      {[-10, 0, 10].map(dx => <motion.path key={dx} d={`M${x + dx} 220l-3 8`} className="ab-rain" initial={{ opacity: s(0, 1), y: s(-6, 0) }}
        animate={{ opacity: 1, y: 0 }} transition={p(0.6, 0.4 + k * 0.15)} />)}
    </g>)}
    <rect x="40" y="226" width="388" height="58" rx="12" className="ab-forest" />
    {Array.from({ length: 16 }, (_, k) => <circle key={k} cx={52 + k * 24} cy={230 + (k % 2) * 4} r="9" className="ab-canopy" />)}
    <rect x="424" y="214" width="156" height="76" rx="12" className="ab-sea" />
    <path d="M440 232q8-5 16 0t16 0M520 278q8-5 16 0t16 0" className="ab-wave" />
    <motion.path d={AMAZON} className="ab-river-wide" initial={{ pathLength: s(0, 1) }} animate={{ pathLength: 1 }} transition={p(1, 0.5)} />
    <motion.path d={AMAZON} className="ab-flow" initial={{ strokeDashoffset: s(0, -120) }} animate={{ strokeDashoffset: -120 }} transition={p(3, 1.3)} />
    <motion.ellipse cx="440" cy="252" rx="26" ry="18" className="ab-plume" initial={{ scale: s(0, 1) }} animate={{ scale: 1 }} transition={p(1, 1.5)} style={{ transformBox: 'fill-box', transformOrigin: 'left center' }} />
    <text x="514" y="244" textAnchor="middle" className="ab-on-sea-big">15% a 20%</text>
    <text x="514" y="260" textAnchor="middle" className="ab-on-sea">da água doce que</text>
    <text x="514" y="273" textAnchor="middle" className="ab-on-sea">os rios levam ao mar</text>
    <motion.text x="40" y="312" className="bi-hand-sm" initial={{ opacity: s(0, 1) }} animate={{ opacity: 1 }} transition={p(0.6, 1.8)}>chuva constante + drenagem imensa = muito mais vazão</motion.text>
    <text x="30" y="338" className="bi-foot">Esquemático: comprimentos e larguras sem escala.</text>
  </g>;
}

const NILE_VALLEY = 'M205 318C215 280 190 250 200 220S178 172 185 150';
function NileValley() {
  const p = usePaced(); const s = useFrom();
  const homes: [number, number][] = [[214, 298], [196, 282], [210, 254], [190, 234], [206, 208], [180, 186], [192, 168], [164, 112], [186, 104], [208, 112], [172, 126]];
  return <g>
    <rect x="40" y="56" width="290" height="266" rx="14" className="ab-sand" />
    <path d="M40 88V70a14 14 0 0 1 14-14h262a14 14 0 0 1 14 14v18Z" className="ab-sea" />
    {[[76, 150], [104, 262], [270, 164], [292, 250], [252, 296]].map(([x, y]) => <path key={`${x}-${y}`} d={`M${x} ${y}q14-9 28 0`} className="ab-dune" />)}
    <g transform="translate(84 124)">
      <circle r="10" className="ab-sun" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map(a => <path key={a} d="M0 -14v-5" transform={`rotate(${a})`} className="ab-sun-ray" />)}
    </g>
    <motion.path d="M185 150L138 90Q185 80 232 90Z" className="ab-green-fill" initial={{ opacity: s(0, 1) }} animate={{ opacity: 1 }} transition={p(0.6, 1.2)} />
    <motion.path d={NILE_VALLEY} className="ab-strip" initial={{ pathLength: s(0, 1) }} animate={{ pathLength: 1 }} transition={p(1.2, 0.2)} />
    <path d={NILE_VALLEY} className="ab-river" />
    <path d="M185 150L150 92M185 150V90M185 150L220 92" className="ab-river-thin" />
    {homes.map(([x, y], k) => <motion.g key={`${x}-${y}`} initial={{ opacity: s(0, 1), scale: s(0.4, 1) }} animate={{ opacity: 1, scale: 1 }}
      transition={p(0.4, 1 + k * 0.08)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}><House x={x} y={y} /></motion.g>)}
    <text x="96" y="210" textAnchor="middle" className="bi-small">deserto</text>
    <text x="284" y="210" textAnchor="middle" className="bi-small">deserto</text>
    <text x="244" y="130" className="bi-tiny">delta</text>
    <text x="236" y="276" className="bi-tiny">vale</text>

    <text x="352" y="84" className="bi-panel-title">EGITO</text>
    <text x="352" y="108" className="bi-small">o Nilo atravessa regiões áridas</text>
    <text x="352" y="126" className="bi-small">e vira fonte quase exclusiva</text>
    <text x="352" y="144" className="bi-small">de água do país</text>
    <text x="352" y="178" className="bi-label">quase toda a população</text>
    <text x="352" y="196" className="bi-label">e a agricultura numa</text>
    <text x="352" y="214" className="bi-label">faixa estreita: vale e delta</text>
    <path d="M352 232H590" className="ab-rule" />
    <text x="352" y="254" className="bi-small bi-strong">Mississippi e Yangtzé:</text>
    <text x="352" y="270" className="bi-small">agricultura e transporte fluvial</text>
    <motion.text x="352" y="302" className="bi-hand-sm" initial={{ opacity: s(0, 1) }} animate={{ opacity: 1 }} transition={p(0.6, 1.8)}>a ocupação segue a água</motion.text>
    <text x="30" y="342" className="bi-foot">Esquemático, sem escala.</text>
  </g>;
}

function Upstream() {
  const p = usePaced(); const s = useFrom();
  const countries = [['Laos', 272], ['Tailândia', 368], ['Camboja', 462], ['Vietnã', 556]] as const;
  return <g>
    <ArrowHead id="ab-head-mekong" />
    <text x="250" y="72" className="bi-panel-title">MEKONG · SUDESTE ASIÁTICO</text>
    <text x="250" y="96" className="bi-label">barragens nas cabeceiras</text>
    <text x="250" y="116" className="bi-small">alteram o regime de vazão que chega a jusante:</text>
    <text x="250" y="134" className="bi-small">pesca e agricultura de milhões de pessoas</text>

    <text x="40" y="104" className="bi-small bi-strong">China · cabeceiras</text>
    <path d="M24 262L64 150L88 176L118 122L150 190L176 262Z" className="ab-mountain" />
    <path d="M110 134l8-12 8 14-8-4Z" className="ab-snow" />
    <path d="M20 240H600V300H20Z" className="ab-ground" />
    <path d="M118 150C126 180 140 200 152 226" className="ab-river" />
    <motion.path d="M150 222H212V262H158Z" className="ab-reservoir" initial={{ scaleY: s(0, 1) }} animate={{ scaleY: 1 }} transition={p(0.8, 0.5)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }} />
    <motion.rect x="210" y="208" width="12" height="58" rx="2" className="ab-dam" initial={{ scaleY: s(0, 1) }} animate={{ scaleY: 1 }} transition={p(0.6, 0.2)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }} />
    <motion.path d="M224 252C300 246 360 258 430 251S540 246 598 252" className="ab-river-wide" initial={{ strokeWidth: s(16, 6) }} animate={{ strokeWidth: 6 }} transition={p(1.6, 1)} />
    <path d="M236 222H588" className="bi-arrow" markerEnd="url(#ab-head-mekong)" />
    <text x="240" y="214" className="bi-tiny">a jusante</text>
    {[300, 420, 530].map((x, k) => <motion.g key={x} initial={{ opacity: s(1, 0.35) }} animate={{ opacity: 0.35 }} transition={p(1, 1.4 + k * 0.1)}><Fish x={x} y={252} s={1.1} /></motion.g>)}
    {[252, 296, 344, 392, 440, 488, 532, 580].map((x, k) => <motion.path key={x} d={`M${x} 280v-9M${x} 275l-4-4M${x} 275l4-4`} className="ab-sprout"
      initial={{ opacity: s(1, 0.4) }} animate={{ opacity: 0.4 }} transition={p(1, 1.6 + k * 0.05)} />)}
    {[320, 415, 510].map(x => <path key={x} d={`M${x} 262V300`} className="ab-border" />)}
    {countries.map(([name, x]) => <text key={name} x={x} y="294" textAnchor="middle" className="bi-small">{name}</text>)}
    <motion.text x="30" y="322" className="bi-hand-sm" initial={{ opacity: s(0, 1) }} animate={{ opacity: 1 }} transition={p(0.6, 2)}>barragem é decisão soberana; a tensão vem sem acordo de repartição</motion.text>
    <text x="30" y="342" className="bi-foot">No Nilo, a mesma tensão entre Etiópia, Sudão e Egito. Esquemático.</text>
  </g>;
}

function WaterStress() {
  const p = usePaced(); const s = useFrom();
  return <g>
    <text x="30" y="72" className="bi-panel-title">ÁGUA RENOVÁVEL POR HABITANTE</text>
    <path d="M40 250H300" className="ab-axis" />
    <motion.rect x="50" y="212" width="50" height="38" rx="4" className="ab-bar-dry" initial={{ scaleY: s(0, 1) }} animate={{ scaleY: 1 }} transition={p(0.8, 0.3)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }} />
    <motion.rect x="145" y="96" width="50" height="154" rx="4" className="ab-bar-wet" initial={{ scaleY: s(0, 1) }} animate={{ scaleY: 1 }} transition={p(1, 0.5)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }} />
    <motion.path d="M40 190H300" className="ab-threshold" initial={{ opacity: s(0, 1) }} animate={{ opacity: 1 }} transition={p(0.6, 1.2)} />
    <text x="206" y="168" className="bi-tiny bi-warn">limiar crítico:</text>
    <text x="206" y="182" className="bi-tiny bi-warn">1.000 m³ por hab./ano</text>
    <text x="75" y="266" textAnchor="middle" className="bi-tiny">Oriente Médio e</text>
    <text x="75" y="278" textAnchor="middle" className="bi-tiny">Norte da África</text>
    <text x="170" y="266" textAnchor="middle" className="bi-tiny">Canadá, Brasil</text>
    <text x="170" y="278" textAnchor="middle" className="bi-tiny">e Rússia</text>
    <text x="75" y="204" textAnchor="middle" className="bi-tiny bi-warn">estresse severo</text>

    <text x="330" y="72" className="bi-panel-title">PARA ONDE VAI A ÁGUA DOCE</text>
    <rect x="330" y="84" width="260" height="24" rx="6" className="ab-bar-other" />
    <motion.rect x="330" y="84" width="182" height="24" rx="6" className="ab-bar-irr" initial={{ scaleX: s(0, 1) }} animate={{ scaleX: 1 }} transition={p(0.9, 0.4)} style={{ transformBox: 'fill-box', transformOrigin: 'left' }} />
    <text x="340" y="100" className="ab-bar-text">irrigação: mais de 70%</text>
    <text x="590" y="124" textAnchor="end" className="bi-tiny">indústria e uso doméstico, somados</text>

    <text x="330" y="160" className="bi-panel-title">ÁGUA VIRTUAL</text>
    <Drop x={362} y={200} s={1.6} />
    <path d="M346 218h32" className="ab-field" />
    <g transform="translate(546 196)"><circle r="9" className="ab-sun" />{[0, 60, 120, 180, 240, 300].map(a => <path key={a} d="M0 -12v-5" transform={`rotate(${a})`} className="ab-sun-ray" />)}</g>
    <path d="M386 204H522" className="ab-route" />
    <text x="454" y="222" textAnchor="middle" className="bi-tiny">alimento importado</text>
    <motion.g initial={{ x: s(0, 96) }} animate={{ x: 96 }} transition={p(1.6, 0.8)}>
      <path d="M394 212c-4-10 0-18 6-19l-2-4h12l-2 4c6 1 10 9 6 19Z" className="bi-sack-big" />
      <path d="M398 189h12" className="bi-sack-tie" />
      <path d="M404 208v-10M404 201l-3-3M404 201l3-3M404 205l-3-3M404 205l3-3" className="ab-grain" />
    </motion.g>
    <text x="362" y="236" textAnchor="middle" className="bi-tiny">país com água</text>
    <text x="546" y="236" textAnchor="middle" className="bi-tiny">país em estresse</text>
    <text x="330" y="262" className="bi-small">importar alimento poupa a água</text>
    <text x="330" y="278" className="bi-small">que a produção doméstica gastaria</text>
    <motion.text x="40" y="312" className="bi-hand-sm" initial={{ opacity: s(0, 1) }} animate={{ opacity: 1 }} transition={p(0.6, 1.8)}>não é só volume: mais gente divide a mesma água</motion.text>
    <text x="30" y="338" className="bi-foot">Barras ilustrativas; do texto vêm só o limiar de 1.000 m³ e os 70%.</text>
  </g>;
}

export function WorldWaters({ active }: Scene) {
  const p = usePaced(); const s = useFrom();
  const kicker = ['EXTENSÃO NÃO É VAZÃO', 'O NILO NO DESERTO', 'O RIO QUE CRUZA FRONTEIRAS', 'ESTRESSE HÍDRICO'][active];
  const Vignette = [LengthVsFlow, NileValley, Upstream, WaterStress][active];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Hidrogeografia mundial: o Nilo mais extenso e a Amazônica com mais vazão, a faixa estreita do vale do Nilo, barragens nas cabeceiras do Mekong e estresse hídrico abaixo de mil metros cúbicos por habitante; recorte ${active + 1} em foco`}>
    <Frame kicker={`HIDROGEOGRAFIA MUNDIAL · ${kicker}`} />
    <motion.g key={active} initial={{ opacity: s(0, 1) }} animate={{ opacity: 1 }} transition={p(0.4)}><Vignette /></motion.g>
  </svg>;
}

// ————————————————————————————————————————————————————————————————
// Hidrogeografia do Brasil: o mapa fica fixo e o recorte acende a bacia; o
// painel ao lado mostra o uso que aquela água tem. Coordenadas dos rios em
// graus reais (x ≈ 616,8 + 7,9·lon; y = 76,2 − 7,7·lat), traçado simplificado.
// ————————————————————————————————————————————————————————————————

const MAP_S = 0.9, MAP_X = 10, MAP_Y = 26;
const at = (x: number, y: number) => [MAP_X + MAP_S * x, MAP_Y + MAP_S * y] as const;
const BASINS = {
  amazonica: ['M64.5 108.5C100 106 120 100 142.8 100.1S170 96 184.7 94.7S210 86 226 80', 'M87.5 76C105 84 125 92 142.8 100.1', 'M112 144C125 128 140 112 152 102', 'M174.4 145.5C178 125 182 108 184.7 94.7'],
  parana: ['M213.9 230.2C205 245 195 258 186 274', 'M269 241.8C250 236 230 232 213.9 230.2', 'M245.5 218.7C235 224 222 228 213.9 230.2', 'M248.7 257.2C235 250 222 240 208 236'],
  saofrancisco: ['M250.2 231.7C256 220 262 212 262 209.4S270 190 273.9 178.6S288 155 296.9 148.6S312 146 315 148.6S326 154 333 158'],
};
const DAMS: [number, number][] = [[258, 239], [236, 234], [238, 252], [222, 243], [204, 244], [194, 260], [186, 272]];
const INTERMITTENT = ['M282 122l6 8 4 10', 'M300 112l8 10 8 6', 'M270 136l6 10 2 10', 'M322 124l-4 8'];

function BrazilRivers({ active }: Scene) {
  const p = usePaced(); const s = useFrom();
  const on = (b: keyof typeof BASINS) => (b === 'amazonica' && active === 0) || (b === 'parana' && active === 1) || (b === 'saofrancisco' && active === 3);
  return <g>
    <g transform={`translate(${MAP_X} ${MAP_Y}) scale(${MAP_S})`}>
      <path d={BRAZIL} className="ab-land" />
      {(Object.keys(BASINS) as (keyof typeof BASINS)[]).map(b => BASINS[b].map((d, k) => <motion.path key={`${b}-${k}`} d={d} className="ab-map-river" initial={false}
        animate={{ strokeWidth: on(b) ? (k === 0 ? 5 : 3.4) : (k === 0 ? 2.4 : 1.6), opacity: on(b) ? 1 : 0.6 }} transition={p(0.5)} />))}
      {active === 0 && BASINS.amazonica.map((d, k) => <motion.path key={`flow-${k}`} d={d} className="ab-map-flow" initial={{ strokeDashoffset: s(0, -60) }} animate={{ strokeDashoffset: -60 }} transition={p(2.6, 0.5)} />)}
      {active === 1 && DAMS.map(([x, y], k) => <motion.rect key={`${x}-${y}`} x={x - 1.8} y={y - 5} width="3.6" height="10" rx="1" className="ab-dam"
        initial={{ opacity: s(0, 1), scale: s(0, 1) }} animate={{ opacity: 1, scale: 1 }} transition={p(0.35, 0.3 + k * 0.15)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />)}
      {active === 2 && INTERMITTENT.map((d, k) => <motion.path key={d} d={d} className="ab-map-dry" initial={{ pathLength: s(0, 1) }} animate={{ pathLength: 1 }} transition={p(0.6, 0.3 + k * 0.15)} />)}
      {active === 3 && <>
        <motion.path d="M306 142C306 132 309 124 311 112" className="ab-canal" initial={{ pathLength: s(0, 1) }} animate={{ pathLength: 1 }} transition={p(0.9, 0.5)} />
        <motion.path d="M311 144C318 141 324 137 331 133" className="ab-canal" initial={{ pathLength: s(0, 1) }} animate={{ pathLength: 1 }} transition={p(0.9, 0.9)} />
      </>}
      <path d={BRAZIL} className="ab-outline" />
    </g>
    <text x={at(96, 128)[0]} y={at(96, 128)[1]} textAnchor="middle" className={active === 0 ? 'ab-map-label ab-map-on' : 'ab-map-label'}>Amazônica</text>
    <text x={at(178, 262)[0]} y={at(178, 262)[1]} textAnchor="end" className={active === 1 ? 'ab-map-label ab-map-on' : 'ab-map-label'}>Paraná</text>
    <text x={at(250, 202)[0]} y={at(250, 202)[1]} textAnchor="end" className={active === 3 ? 'ab-map-label ab-map-on' : 'ab-map-label'}>São Francisco</text>
    {active === 2 && <text x="238" y="152" textAnchor="middle" className="ab-map-label ab-map-on">rios intermitentes</text>}
  </g>;
}

function AmazonRoad() {
  const p = usePaced(); const s = useFrom();
  return <g>
    <text x="362" y="78" className="bi-panel-title">BACIA AMAZÔNICA</text>
    <text x="362" y="98" className="bi-small">a maior: 40% a 45% da água</text>
    <text x="362" y="114" className="bi-small">doce superficial do país</text>
    {Array.from({ length: 10 }, (_, k) => <circle key={`t${k}`} cx={366 + k * 24} cy={150 + (k % 2) * 4} r="11" className="ab-canopy" />)}
    <path d="M354 170C400 160 440 182 490 172S560 160 590 170V206C560 196 520 212 470 204S390 196 354 208Z" className="ab-water" />
    {Array.from({ length: 10 }, (_, k) => <circle key={`b${k}`} cx={366 + k * 24} cy={224 - (k % 2) * 4} r="11" className="ab-canopy" />)}
    <House x={374} y={166} s={1.6} /><House x={580} y={164} s={1.6} />
    <motion.g initial={{ x: s(0, 150) }} animate={{ x: 150 }} transition={p(2.2, 0.4)}>
      <path d="M392 190h40l-6 8h-30Z" className="ab-boat" />
      <path d="M400 190v-9h18v9" className="ab-boat-cabin" />
      <path d="M404 186h3M411 186h3" className="ab-boat-window" />
    </motion.g>
    <text x="362" y="262" className="bi-label">o rio é a principal via</text>
    <text x="362" y="280" className="bi-label">de pessoas e mercadorias</text>
    <text x="362" y="302" className="bi-small">poucas estradas: rodovia na</text>
    <text x="362" y="318" className="bi-small">floresta custa caro</text>
  </g>;
}

function DamStairs() {
  const p = usePaced(); const s = useFrom();
  const steps = [0, 1, 2, 3].map(k => ({ x0: 358 + 58 * k, floor: 152 + 26 * k }));
  return <g>
    <text x="362" y="78" className="bi-panel-title">BACIA DO PARANÁ</text>
    <text x="362" y="98" className="bi-small">a geração hidrelétrica domina</text>
    <path d="M358 152H416V178H474V204H532V230H590V262H358Z" className="ab-soil" />
    {steps.map(({ x0, floor }, k) => <g key={k}>
      <motion.rect x={x0 + 2} y={floor - 16} width="50" height="16" className="ab-water" initial={{ scaleY: s(0, 1) }} animate={{ scaleY: 1 }}
        transition={p(0.5, 0.3 + k * 0.35)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }} />
      <rect x={x0 + 52} y={floor - 22} width="6" height="48" rx="1.5" className="ab-dam" />
      <motion.path d={`M${x0 + 55} ${floor - 30}l-5 8h5l-4 8`} className="ab-bolt" initial={{ opacity: s(0, 1), scale: s(0.3, 1) }} animate={{ opacity: 1, scale: 1 }}
        transition={p(0.4, 0.7 + k * 0.35)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
    </g>)}
    <text x="561" y="252" textAnchor="middle" className="bi-tiny bi-strong">Itaipu</text>
    <text x="362" y="290" className="bi-label">sucessão de grandes usinas</text>
    <text x="362" y="308" className="bi-small">o maior parque hidrelétrico do país</text>
  </g>;
}

function DryRiver() {
  const p = usePaced(); const s = useFrom();
  const rain = [30, 34, 26, 18, 4, 2, 0, 0, 0, 2, 6, 14];
  return <g>
    <text x="362" y="78" className="bi-panel-title">SEMIÁRIDO NORDESTINO</text>
    {rain.map((h, k) => <motion.rect key={k} x={364 + k * 19} y={136 - h} width="13" height={Math.max(h, 1)} rx="2" className={k < 4 || k > 10 ? 'ab-rainbar' : 'ab-rainbar ab-rainbar-dry'}
      initial={{ scaleY: s(0, 1) }} animate={{ scaleY: 1 }} transition={p(0.4, 0.2 + k * 0.04)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }} />)}
    <path d="M362 137H590" className="ab-axis" />
    <text x="362" y="152" className="bi-tiny">chuva concentrada</text>
    <text x="590" y="152" textAnchor="end" className="bi-tiny">meses secos</text>
    <rect x="362" y="162" width="228" height="12" rx="6" className="ab-bed" />
    <motion.rect x="362" y="162" width="82" height="12" rx="6" className="ab-water" initial={{ scaleX: s(0, 1) }} animate={{ scaleX: 1 }} transition={p(0.6, 0.6)} style={{ transformBox: 'fill-box', transformOrigin: 'left' }} />
    <path d="M460 166l6 4 5-3M500 169l7-3 6 4M548 166l5 4 7-2" className="ab-crack" />
    <text x="590" y="188" textAnchor="end" className="bi-tiny">o leito seca: rio intermitente</text>

    <g transform="translate(410 234)">
      <path d="M-22 -26h44v34a4 4 0 0 1-4 4h-36a4 4 0 0 1-4-4Z" className="ab-tank" />
      <motion.rect x="-20" y="-18" width="40" height="28" rx="2" className="ab-water" initial={{ scaleY: s(0, 1) }} animate={{ scaleY: 1 }} transition={p(1, 1)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }} />
      <path d="M-26 -26h52M-10 -34h20v8" className="ab-tank-top" />
    </g>
    <text x="410" y="264" textAnchor="middle" className="bi-tiny">cisterna</text>
    <g transform="translate(530 238)">
      <path d="M-44 8q44 -28 88 0Z" className="ab-soil" />
      <motion.path d="M-34 6q34 -18 68 0Z" className="ab-water" initial={{ scaleY: s(0, 1) }} animate={{ scaleY: 1 }} transition={p(1, 1.2)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }} />
      <path d="M38 -2l8 -14h8l-8 20" className="ab-dam-wall" />
    </g>
    <text x="530" y="264" textAnchor="middle" className="bi-tiny">açude</text>
    <text x="362" y="290" className="bi-label">secar parte do ano é a norma</text>
    <text x="362" y="308" className="bi-small">açudes e cisternas guardam a chuva</text>
    <text x="362" y="322" className="bi-small">para os meses secos</text>
  </g>;
}

function Transposition() {
  const p = usePaced(); const s = useFrom();
  return <g>
    <text x="362" y="78" className="bi-panel-title">TRANSPOSIÇÃO</text>
    <text x="362" y="98" className="bi-small">dois eixos de canais levam parte</text>
    <text x="362" y="114" className="bi-small">da vazão do São Francisco ao</text>
    <text x="362" y="130" className="bi-small">Nordeste Setentrional:</text>
    <text x="362" y="148" className="bi-small bi-strong">Ceará, Rio Grande do Norte,</text>
    <text x="362" y="164" className="bi-small bi-strong">Paraíba e Pernambuco</text>
    <path d="M472 222v-36M458 222h28" className="ab-scale-post" />
    <motion.g initial={{ rotate: s(-8, 0) }} animate={{ rotate: 0 }} transition={p(1.6, 0.6)} style={{ transformBox: 'view-box', transformOrigin: '472px 186px' }}>
      <path d="M414 186H530" className="ab-scale-beam" />
      <path d="M414 186l-14 20h28ZM530 186l-14 20h28Z" className="ab-scale-string" />
      <path d="M398 206h32a16 7 0 0 1-32 0ZM514 206h32a16 7 0 0 1-32 0Z" className="ab-scale-pan" />
    </motion.g>
    <circle cx="472" cy="186" r="4" className="ab-scale-pivot" />
    <text x="414" y="244" textAnchor="middle" className="bi-small bi-strong">defensores</text>
    <text x="414" y="260" textAnchor="middle" className="bi-tiny">segurança hídrica</text>
    <text x="414" y="273" textAnchor="middle" className="bi-tiny">para milhões</text>
    <text x="530" y="244" textAnchor="middle" className="bi-small bi-strong">críticos</text>
    <text x="530" y="260" textAnchor="middle" className="bi-tiny">vazão do rio já caía;</text>
    <text x="530" y="273" textAnchor="middle" className="bi-tiny">a água chega a quem</text>
    <text x="530" y="286" textAnchor="middle" className="bi-tiny">mais precisa?</text>
    <motion.text x="362" y="316" className="bi-hand-sm" initial={{ opacity: s(0, 1) }} animate={{ opacity: 1 }} transition={p(0.6, 1.8)}>não dispensa cisternas e açudes</motion.text>
  </g>;
}

export function BrazilBasins({ active }: Scene) {
  const p = usePaced(); const s = useFrom();
  const Panel = [AmazonRoad, DamStairs, DryRiver, Transposition][active];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Hidrogeografia do Brasil: rios da Amazônia como estrada, escada de usinas no Paraná até Itaipu, rios intermitentes do semiárido e transposição do São Francisco; recorte ${active + 1} em foco`}>
    <Frame kicker="HIDROGEOGRAFIA DO BRASIL · BACIAS E USOS" />
    <BrazilRivers active={active} />
    <rect x="346" y="54" width="252" height="278" rx="14" className="bi-panel" />
    <motion.g key={active} initial={{ opacity: s(0, 1) }} animate={{ opacity: 1 }} transition={p(0.4)}><Panel /></motion.g>
    <text x="30" y="344" className="bi-foot">Mapa esquemático; rios, usinas e barras fora de escala.</text>
  </svg>;
}

// ————————————————————————————————————————————————————————————————
// Biogeografia do Brasil I: cada bioma em perfil, com a adaptação que o
// resumo descreve. A faixa de baixo nomeia o que molda cada um — luz,
// ocupação, fogo e seca, água — e é o fio que liga os quatro perfis.
// ————————————————————————————————————————————————————————————————

const FACTORS = [
  { label: 'luz', icon: <g><circle r="5" className="ab-sun" />{[0, 90, 180, 270].map(a => <path key={a} d="M0 -7v-3" transform={`rotate(${a})`} className="ab-sun-ray" />)}</g> },
  { label: 'ocupação', icon: <House x={0} y={2} s={1.3} /> },
  { label: 'fogo e seca', icon: <Flame x={0} y={7} s={0.55} /> },
  { label: 'água', icon: <Drop x={0} y={3} s={0.9} /> },
];

function Tree({ x, base, top, r, cls = 'ab-canopy' }: { x: number; base: number; top: number; r: number; cls?: string }) {
  return <g>
    <path d={`M${x} ${base}V${top}`} className="ab-trunk" />
    <ellipse cx={x} cy={top - r * 0.4} rx={r * 1.5} ry={r} className={cls} />
  </g>;
}

function Strata() {
  const p = usePaced(); const s = useFrom();
  const bands = [['dossel', 100], ['sub-bosque', 188], ['solo', 268]] as const;
  return <g>
    {bands.map(([name, y], k) => <motion.g key={name} initial={{ opacity: s(0, 1) }} animate={{ opacity: 1 }} transition={p(0.4, 0.3 + k * 0.4)}>
      <text x="34" y={y} className="bi-small bi-strong">{name}</text>
      <path d={`M96 ${y - 20}v26`} className="ab-bracket" />
    </motion.g>)}
    {[[200, 124], [262, 110], [324, 128]].map(([x, top]) => <motion.path key={x} d={`M${x} 56V${top}`} className="ab-ray" initial={{ pathLength: s(0, 1) }} animate={{ pathLength: 1 }} transition={p(0.6, 0.2)} />)}
    {[[200, 164], [262, 160], [324, 170]].map(([x, y1]) => <motion.path key={x} d={`M${x} ${y1}V206`} className="ab-ray ab-ray-dim" initial={{ pathLength: s(0, 1) }} animate={{ pathLength: 1 }} transition={p(0.6, 0.8)} />)}
    {[232, 294].map(x => <motion.path key={x} d={`M${x} 214V262`} className="ab-ray ab-ray-faint" initial={{ pathLength: s(0, 1) }} animate={{ pathLength: 1 }} transition={p(0.6, 1.3)} />)}
    <rect x="22" y="136" width="382" height="80" className="ab-shade" />
    <rect x="22" y="216" width="382" height="60" className="ab-shade ab-shade-deep" />
    <path d="M22 276H404V296H22Z" className="ab-soil" />
    {[[164, 188, 16], [234, 196, 14], [300, 184, 16], [370, 194, 14]].map(([x, top, r]) => <Tree key={`m${x}`} x={x} base={276} top={top} r={r} cls="ab-canopy-mid" />)}
    {[[128, 104, 22], [196, 96, 24], [268, 102, 22], [338, 94, 24], [392, 108, 18]].map(([x, top, r]) => <Tree key={`t${x}`} x={x} base={276} top={top} r={r} />)}
    {[150, 250, 320].map(x => <path key={x} d={`M${x} 276q-6-8-12-8M${x} 276q0-10 2-14M${x} 276q6-8 12-8`} className="ab-fern" />)}
    <motion.g initial={{ opacity: s(0, 1), y: s(-10, 0) }} animate={{ opacity: 1, y: 0 }} transition={p(0.5, 1.6)}>
      <path d="M226 66q6-6 12 0q6-6 12 0" className="ab-bird" />
    </motion.g>
    <motion.g initial={{ opacity: s(0, 1) }} animate={{ opacity: 1 }} transition={p(0.5, 1.8)}>
      <path d="M266 232q-8-8-8 0q0 8 8 0q8-8 8 0q0 8-8 0Z" className="ab-butterfly" />
    </motion.g>
    <motion.g initial={{ opacity: s(0, 1) }} animate={{ opacity: 1 }} transition={p(0.5, 2)}>
      <ellipse cx="210" cy="270" rx="6" ry="4" className="ab-beetle" /><path d="M204 267l-3-3M216 267l3-3" className="ab-beetle-leg" />
    </motion.g>
  </g>;
}

function AtlanticFragments() {
  const p = usePaced(); const s = useFrom();
  return <g>
    <path d="M330 52H404V296H330Z" className="ab-sea" />
    {[96, 150, 204].map(y => <path key={y} d={`M344 ${y}q8-5 16 0t16 0t16 0`} className="ab-wave" />)}
    <path d="M22 236H330V296H22Z" className="ab-soil" />
    <path d="M318 236h18v60h-18Z" className="ab-sand" />
    <motion.path d="M30 236V196q14-18 28-4q14-18 28-2q14-18 28-2q14-18 28-2q14-18 28-2q14-18 28-2q14-18 28-2q14-18 28-2q14-18 28-2q14-18 22 2V236"
      className="ab-ghost" initial={{ opacity: s(1, 0.7) }} animate={{ opacity: 0.7 }} transition={p(0.8, 0.4)} />
    <text x="34" y="160" className="bi-tiny">cobertura original (tracejado)</text>
    {([['colonização', 34, 108], ['cidades, lavouras', 124, 238], ['fragmentos', 254, 0]] as const).map(([w, x, arrow], k) => <motion.g key={w} initial={{ opacity: s(0, 1) }} animate={{ opacity: 1 }} transition={p(0.4, 0.3 + k * 0.4)}>
      <text x={x} y="140" className="bi-small">{w}</text>
      {arrow > 0 && <path d={`M${arrow} 136h10m-4-4 4 4-4 4`} className="ab-step" />}
    </motion.g>)}
    {[[64, 94], [180, 204]].map(([a, b], k) => <motion.g key={a} initial={{ opacity: s(0, 1), scale: s(0.6, 1) }} animate={{ opacity: 1, scale: 1 }}
      transition={p(0.5, 0.8 + k * 0.2)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}>
      <Tree x={a} base={236} top={200} r={13} /><Tree x={b} base={236} top={192} r={15} />
      <path d={`M${(a + b) / 2} 172l3 6 6 1-6 2-3 6-3-6-6-2 6-1Z`} className="ab-endemic" />
    </motion.g>)}
    {[132, 144, 240, 252, 264].map((x, k) => <motion.path key={x} d={`M${x - 4} 236h8`} className="ab-field" initial={{ opacity: s(0, 1) }} animate={{ opacity: 1 }} transition={p(0.4, 1 + k * 0.05)} />)}
    {[[274, 26], [290, 40], [306, 32]].map(([x, h], k) => <motion.rect key={x} x={x - 6} y={236 - h} width="13" height={h} className="ab-building"
      initial={{ scaleY: s(0, 1) }} animate={{ scaleY: 1 }} transition={p(0.5, 1.1 + k * 0.12)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }} />)}
    <text x="34" y="258" className="ab-on-soil">menos de 15% da cobertura original</text>
    <rect x="34" y="266" width="280" height="10" rx="5" className="ab-gauge" />
    <motion.rect x="34" y="266" width="38" height="10" rx="5" className="ab-gauge-fill" initial={{ scaleX: s(0, 1) }} animate={{ scaleX: 1 }} transition={p(0.8, 1.4)} style={{ transformBox: 'fill-box', transformOrigin: 'left' }} />
    <path d="M76 262v18" className="ab-tick" />
    <text x="80" y="290" className="ab-on-soil-sm">15%</text>
    <motion.text x="34" y="80" className="bi-hand-sm" initial={{ opacity: s(0, 1) }} animate={{ opacity: 1 }} transition={p(0.6, 1.8)}>cada fragmento guarda</motion.text>
    <motion.text x="34" y="98" className="bi-hand-sm" initial={{ opacity: s(0, 1) }} animate={{ opacity: 1 }} transition={p(0.6, 1.9)}>espécies endêmicas</motion.text>
  </g>;
}

function CerradoFire() {
  const p = usePaced(); const s = useFrom();
  const trees = [120, 222, 322];
  return <g>
    <g transform="translate(372 78)"><circle r="12" className="ab-sun" />{[0, 45, 90, 135, 180, 225, 270, 315].map(a => <path key={a} d="M0 -16v-5" transform={`rotate(${a})`} className="ab-sun-ray" />)}</g>
    <path d="M22 200H404V296H22Z" className="ab-soil-poor" />
    {trees.map((x, k) => <motion.path key={`r${x}`} d={`M${x} 200q-4 30 -14 50q-6 14 -4 34M${x} 200q6 34 18 46q6 10 4 36M${x} 204q-16 14 -26 20`} className="ab-root"
      initial={{ pathLength: s(0, 1) }} animate={{ pathLength: 1 }} transition={p(1, 0.4 + k * 0.15)} />)}
    {trees.map(x => <g key={x}>
      <path d={`M${x} 200q-8-20 4-36q10-14-2-32`} className="ab-bark" />
      <path d={`M${x + 2} 150q14-6 22-18M${x} 140q-14-4-20-16`} className="ab-branch" />
      <circle cx={x + 24} cy="128" r="10" className="ab-canopy-dry" /><circle cx={x - 20} cy="120" r="9" className="ab-canopy-dry" /><circle cx={x + 2} cy="126" r="11" className="ab-canopy-dry" />
    </g>)}
    {Array.from({ length: 14 }, (_, k) => <path key={k} d={`M${34 + k * 27} 200l-3-9M${34 + k * 27} 200l1-11M${34 + k * 27} 200l5-8`} className="ab-grass" />)}
    <motion.rect x="22" y="196" width="370" height="6" className="ab-burnt" initial={{ scaleX: s(0, 1) }} animate={{ scaleX: 1 }} transition={p(2.6, 0.6)} style={{ transformBox: 'fill-box', transformOrigin: 'left' }} />
    <motion.g initial={{ x: s(0, 350) }} animate={{ x: 350 }} transition={p(2.6, 0.6)}>
      <Flame x={40} y={200} /><Flame x={56} y={200} s={0.7} /><Flame x={26} y={200} s={0.6} />
    </motion.g>
    <text x="34" y="74" className="bi-hand-sm">casca grossa: resiste ao fogo</text>
    <path d="M150 84q62 14 70 82" className="ab-leader" />
    <text x="254" y="240" className="ab-on-soil">raízes profundas</text>
    <text x="34" y="288" className="ab-on-soil-sm">solo pobre em nutrientes</text>
  </g>;
}

function CaatingaCycle() {
  const p = usePaced(); const s = useFrom();
  const shrub = (x: number) => `M${x} 236v-26M${x} 220l-14-16M${x} 214l12-18M${x - 8} 212l-6-10M${x + 7} 206l8-6`;
  return <g>
    <path d="M22 236H404V296H22Z" className="ab-soil" />
    <path d="M213 58V292" className="ab-divider" />
    <text x="117" y="74" textAnchor="middle" className="bi-panel-title">NA SECA</text>
    <text x="308" y="74" textAnchor="middle" className="bi-panel-title">COM A CHUVA</text>
    <g transform="translate(60 104)"><circle r="12" className="ab-sun" />{[0, 45, 90, 135, 180, 225, 270, 315].map(a => <path key={a} d="M0 -16v-5" transform={`rotate(${a})`} className="ab-sun-ray" />)}</g>
    {[100, 160].map(x => <path key={x} d={shrub(x)} className="ab-branch" />)}
    {[[86, 206], [112, 198], [150, 210], [172, 202]].map(([x, y], k) => <motion.path key={`${x}`} d="M0 0q4-4 8 0q-4 4-8 0Z" className="ab-leaf-dry"
      initial={{ x: s(x, x + 6), y: s(y, 232), opacity: s(1, 0.9) }} animate={{ x: x + 6, y: 232, opacity: 0.9 }} transition={p(1.2, 0.3 + k * 0.15)} />)}
    <path d="M190 236v-40m0 14h-8v-10m8 18h8v-12" className="ab-cactus" />

    <Cloud x={308} y={98} s={1.3} />
    {[290, 304, 318, 332].map((x, k) => <motion.path key={x} d={`M${x} 114l-4 12`} className="ab-rain" initial={{ opacity: s(0, 1), y: s(-8, 0) }} animate={{ opacity: 1, y: 0 }} transition={p(0.5, 0.3 + k * 0.1)} />)}
    {[262, 336].map(x => <path key={x} d={shrub(x)} className="ab-branch" />)}
    {[[248, 204], [256, 196], [274, 196], [270, 206], [322, 204], [330, 196], [348, 198], [344, 208]].map(([x, y], k) => <motion.circle key={`${x}-${y}`} cx={x} cy={y} r="6" className="ab-leaf"
      initial={{ scale: s(0, 1) }} animate={{ scale: 1 }} transition={p(0.4, 0.9 + k * 0.06)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />)}
    {[[262, 190], [340, 188], [382, 190]].map(([x, y], k) => <motion.g key={x} initial={{ scale: s(0, 1) }} animate={{ scale: 1 }} transition={p(0.4, 1.5 + k * 0.1)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
      {[0, 72, 144, 216, 288].map(a => <circle key={a} cx={x} cy={y - 4} r="2.6" transform={`rotate(${a} ${x} ${y})`} className="ab-flower" />)}
      <circle cx={x} cy={y} r="1.8" className="ab-flower-core" />
    </motion.g>)}
    <path d="M382 236v-40m0 14h-8v-10m8 18h8v-12" className="ab-cactus" />
    <text x="117" y="258" textAnchor="middle" className="ab-on-soil">perde as folhas:</text>
    <text x="117" y="274" textAnchor="middle" className="ab-on-soil">poupa água</text>
    <text x="308" y="258" textAnchor="middle" className="ab-on-soil">floresce rápido</text>
    <text x="308" y="274" textAnchor="middle" className="ab-on-soil">revela biodiversidade</text>
  </g>;
}

const BIOMES = [
  { title: 'AMAZÔNIA', lines: ['floresta tropical úmida,', 'o maior bioma do país'], strong: ['dossel: copas altas', 'sub-bosque: sombreado', 'solo: pouca luz'], hand: ['cada espécie no seu', 'andar: muitas convivem'] },
  { title: 'MATA ATLÂNTICA', lines: ['quase toda a costa,', 'do RS ao Nordeste'], strong: ['primeira atingida:', 'colonização e cidades', 'no litoral'], hand: ['fragmento pequeno,', 'valor alto'] },
  { title: 'CERRADO', lines: ['savana tropical, o', 'segundo maior bioma'], strong: ['pressão: relevo plano', 'e calagem abrem soja,', 'milho e algodão'], hand: ['hotspot: alto', 'endemismo'] },
  { title: 'CAATINGA', lines: ['só existe no Brasil:', 'semiárido nordestino'], strong: ['chuva escassa', 'e irregular: guarda', 'água ou dorme'], hand: ['risco: desertificação', 'do solo'] },
];

export function BiomesProfile({ active }: Scene) {
  const p = usePaced(); const s = useFrom();
  const Stage = [Strata, AtlanticFragments, CerradoFire, CaatingaCycle][active];
  const b = BIOMES[active];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Biogeografia do Brasil I: estratos da Amazônia, fragmentos da Mata Atlântica, raízes e casca do Cerrado contra o fogo e a Caatinga entre a seca e a chuva; recorte ${active + 1} em foco`}>
    <Frame kicker="BIOGEOGRAFIA DO BRASIL · PERFIS" />
    <defs><clipPath id="ab-clip-bio1"><rect x="22" y="52" width="382" height="244" rx="12" /></clipPath></defs>
    <rect x="22" y="52" width="382" height="244" rx="12" className="ab-stage" />
    <motion.g key={active} clipPath="url(#ab-clip-bio1)" initial={{ opacity: s(0, 1) }} animate={{ opacity: 1 }} transition={p(0.4)}><Stage /></motion.g>
    <rect x="22" y="52" width="382" height="244" rx="12" className="ab-stage-edge" />

    <rect x="414" y="52" width="184" height="244" rx="12" className="bi-panel" />
    <motion.g key={`t${active}`} initial={{ opacity: s(0, 1), x: s(6, 0) }} animate={{ opacity: 1, x: 0 }} transition={p(0.4, 0.1)}>
      <text x="428" y="78" className="bi-panel-title">{b.title}</text>
      {b.lines.map((line, k) => <text key={line} x="428" y={100 + k * 16} className="bi-small">{line}</text>)}
      {b.strong.map((line, k) => <text key={line} x="428" y={148 + k * 17} className="bi-small bi-strong">{line}</text>)}
      {b.hand.map((line, k) => <text key={line} x="428" y={230 + k * 18} className="bi-hand-sm">{line}</text>)}
      <text x="428" y="284" className="bi-tiny">Esquemático, sem escala.</text>
    </motion.g>

    <text x="30" y="328" className="bi-small bi-strong">o que molda cada bioma</text>
    {FACTORS.map(({ label, icon }, k) => {
      const x = 194 + k * 101;
      return <g key={label}>
        <motion.rect x={x} y="310" width="97" height="28" rx="14" className="ab-chip" initial={false}
          animate={{ opacity: active === k ? 1 : 0.55 }} transition={p(0.4)} />
        {active === k && <motion.rect x={x} y="310" width="97" height="28" rx="14" className="ab-chip-on" initial={{ opacity: s(0, 1) }} animate={{ opacity: 1 }} transition={p(0.4)} />}
        <g transform={`translate(${x + 15} 324)`}>{icon}</g>
        <text x={x + 28} y="328" className={active === k ? 'ab-chip-text ab-chip-text-on' : 'ab-chip-text'}>{label}</text>
      </g>;
    })}
  </svg>;
}

// ————————————————————————————————————————————————————————————————
// Biogeografia do Brasil II: o mapa pequeno diz onde; o palco diz como. O
// Pantanal aparece duas vezes porque o resumo o trata duas vezes — o pulso que
// organiza a fauna e o fogo que os fatores humanos agravam.
// ————————————————————————————————————————————————————————————————

const MINI_S = 0.52, MINI_X = 14, MINI_Y = 46;
const mini = (x: number, y: number) => [MINI_X + MINI_S * x, MINI_Y + MINI_S * y] as const;
const COAST = 'M216.8 76.2L237.3 87L271.7 95.5L319.3 104.7L346.4 120.9L348.8 138.6L319.3 176.3L313.6 213.3L304.5 232.5L290.6 253.3L280.8 252.5L255.3 261L237.3 288.7L224.2 306.4L197.1 335.7';
const PLAIN = 'M214 196Q250 186 280 200Q310 258 350 258Q390 258 410 200Q440 184 470 196Q500 254 530 254Q566 254 598 198V332H214Z';

const PLACES = [
  { title: 'PANTANAL', lines: ['maior planície alagável', 'contínua do planeta', 'rio Paraguai e afluentes'] },
  { title: 'PAMPA', lines: ['porção mais meridional', 'do Rio Grande do Sul', 'clima subtropical'] },
  { title: 'LITORAL', lines: ['estuários e água salobra', 'restinga: solo arenoso', 'costeiro'] },
  { title: 'PANTANAL', lines: ['anos de seca extrema', 'incêndios de grande', 'escala'] },
];

function MiniMap({ active }: Scene) {
  const p = usePaced();
  const [px, py] = mini(166.5, 214.8);
  const [qx, qy] = mini(204, 314);
  const pantanal = active === 0 || active === 3;
  return <g>
    <g transform={`translate(${MINI_X} ${MINI_Y}) scale(${MINI_S})`}>
      <path d={BRAZIL} className="ab-land" />
      <path d="M162.6 199.4C164 215 160 232 161.8 245.6" className="ab-map-river" style={{ strokeWidth: 3 }} />
      <motion.path d={COAST} className="ab-coast" initial={false} animate={{ opacity: active === 2 ? 1 : 0 }} transition={p(0.5)} />
      <path d={BRAZIL} className="ab-outline" />
    </g>
    <motion.circle cx={px} cy={py} r="7" className="ab-pin" initial={false} animate={{ opacity: pantanal ? 1 : 0.35, scale: pantanal ? 1.2 : 1 }} transition={p(0.4)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
    <motion.circle cx={qx} cy={qy} r="6" className="ab-pin" initial={false} animate={{ opacity: active === 1 ? 1 : 0.35, scale: active === 1 ? 1.2 : 1 }} transition={p(0.4)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
    <text x={px - 12} y={py + 4} textAnchor="end" className={pantanal ? 'ab-map-label ab-map-on' : 'ab-map-label'}>Pantanal</text>
    <text x={qx - 10} y={qy + 4} textAnchor="end" className={active === 1 ? 'ab-map-label ab-map-on' : 'ab-map-label'}>Pampa</text>
    <text x="186" y="160" textAnchor="end" className={active === 2 ? 'ab-map-label ab-map-on' : 'ab-map-label'}>litoral</text>
  </g>;
}

function FloodPulse() {
  const p = usePaced(); const s = useFrom();
  const fish: [number, number, number, number][] = [[250, 176, 336, 244], [300, 182, 356, 248], [380, 174, 366, 240], [440, 180, 516, 240], [500, 172, 536, 246], [560, 178, 548, 238]];
  return <g>
    <motion.rect x="214" y="0" width="384" height="180" className="ab-flood" initial={{ y: s(158, 226) }} animate={{ y: 226 }} transition={p(1.8, 0.5)} />
    <path d={PLAIN} className="ab-plain" />
    {[[232, 192], [440, 186], [592, 196]].map(([x, y]) => <g key={x}><path d={`M${x} ${y}v-22`} className="ab-trunk" /><circle cx={x} cy={y - 28} r="10" className="ab-canopy" /></g>)}
    {fish.map(([x0, y0, x1, y1], k) => <motion.g key={k} initial={{ x: s(x0, x1), y: s(y0, y1) }} animate={{ x: x1, y: y1 }} transition={p(1.4, 1 + k * 0.05)}>
      <Fish x={0} y={0} flip={k % 2 === 1} />
    </motion.g>)}
    <motion.g initial={{ opacity: s(0, 1), x: s(-14, 0) }} animate={{ opacity: 1, x: 0 }} transition={p(0.6, 2.2)}>
      <g transform="translate(316 228)">
        <path d="M-3 0v-14M3 0v-14" className="ab-leg" />
        <path d="M-12 -18q4-8 14-6l6 2q-2 6-10 6Z" className="ab-heron" />
        <path d="M6 -22q6-6 2-14" className="ab-heron-neck" />
        <circle cx="8" cy="-37" r="3.4" className="ab-heron" />
        <path d="M11 -37l9 2-9 1Z" className="ab-beak" />
      </g>
    </motion.g>
    <motion.g initial={{ opacity: s(0, 1) }} animate={{ opacity: 1 }} transition={p(0.6, 2.4)}>
      <path d="M492 228q14-6 30-2l10 2-10 2q-16 4-30-2Z" className="ab-caiman" />
      <circle cx="526" cy="226" r="1.2" className="ab-eye" />
    </motion.g>
    <text x="230" y="78" className="bi-panel-title">PULSO DE INUNDAÇÃO</text>
    <rect x="470" y="68" width="70" height="10" rx="5" className="ab-gauge" />
    <motion.circle cy="73" r="7" className="ab-pulse-dot" initial={{ cx: s(475, 535) }} animate={{ cx: 535 }} transition={p(1.8, 0.5)} />
    <text x="464" y="77" textAnchor="end" className="bi-tiny">cheia</text>
    <text x="548" y="77" className="bi-tiny">seca</text>
    <text x="230" y="102" className="bi-small">na cheia a água espalha peixes e alimento;</text>
    <text x="230" y="118" className="bi-small">na seca eles ficam presos nas poças</text>
    <text x="230" y="290" className="ab-on-soil">aves e jacarés se concentram onde</text>
    <text x="230" y="306" className="ab-on-soil">o recurso ficou: fauna densa e visível</text>
  </g>;
}

function PampaField() {
  const p = usePaced(); const s = useFrom();
  const hill = 'M214 214Q300 184 400 206T598 200V332H214Z';
  return <g>
    <defs><clipPath id="ab-clip-soy"><motion.rect y="150" width="200" height="200" initial={{ x: s(600, 452) }} animate={{ x: 452 }} transition={p(1.8, 0.6)} /></clipPath></defs>
    <path d={hill} className="ab-grassland" />
    {Array.from({ length: 16 }, (_, k) => <path key={k} d={`M${226 + k * 23} ${226 + (k % 3) * 14}l-3-8M${226 + k * 23} ${226 + (k % 3) * 14}l1-10M${226 + k * 23} ${226 + (k % 3) * 14}l4-7`} className="ab-grass" />)}
    {[[270, 208], [334, 214], [396, 210]].map(([x, y], k) => <g key={x} transform={`translate(${x} ${y}) scale(${k === 1 ? -1.1 : 1.1} 1.1)`}>
      <path d="M-10 -3v9M-5 -3v9M5 -3v9M9 -3v9M-14 -11q-5 2-4 9" className="ab-cow" />
      <rect x="-14" y="-15" width="26" height="13" rx="6" className="ab-cow-body" />
      <ellipse cx="-3" cy="-10" rx="4.5" ry="3" className="ab-cow-patch" />
      <path d="M10 -12l7-3q5 0 5 4l-2 6q-2 2-5 0Z" className="ab-cow-body" />
      <path d="M16 -15l-1-4M19 -14l2-3" className="ab-cow" />
    </g>)}
    <g clipPath="url(#ab-clip-soy)">
      <path d={hill} className="ab-plowed" />
      {[0, 1, 2, 3, 4, 5].map(r => <path key={r} d={`M452 ${222 + r * 16}H598`} className="ab-furrow" />)}
      {[0, 1, 2, 3, 4, 5].flatMap(r => [0, 1, 2, 3, 4, 5].map(c => <path key={`${r}-${c}`} d={`M${466 + c * 24} ${220 + r * 16}v-6M${466 + c * 24} ${216 + r * 16}l-3-3M${466 + c * 24} ${216 + r * 16}l3-3`} className="ab-soy" />))}
    </g>
    <motion.path d="M452 198V332" className="ab-front" initial={{ x: s(148, 0) }} animate={{ x: 0 }} transition={p(1.8, 0.6)} />
    <text x="230" y="78" className="bi-panel-title">PAMPA · CAMPO NATIVO</text>
    <text x="230" y="102" className="bi-small">gramíneas de clima subtropical; a pecuária</text>
    <text x="230" y="118" className="bi-small">extensiva pode coexistir com o campo</text>
    <text x="320" y="176" textAnchor="middle" className="bi-small bi-strong">campo e gado</text>
    <text x="525" y="176" textAnchor="middle" className="bi-small bi-warn">lavoura de soja</text>
    <text x="230" y="292" className="ab-on-soil">a conversão para grãos</text>
    <text x="230" y="308" className="ab-on-soil">elimina o campo nativo</text>
    <motion.text x="230" y="146" className="bi-hand-sm" initial={{ opacity: s(0, 1) }} animate={{ opacity: 1 }} transition={p(0.6, 2)}>não é Cerrado: campo do extremo sul</motion.text>
  </g>;
}

function Mangrove() {
  const p = usePaced(); const s = useFrom();
  const trees = [318, 358, 398];
  return <g>
    <path d="M214 184H598V332H214Z" className="ab-estuary" />
    <path d="M470 184H598V332H470Z" className="ab-sea" />
    <path d="M214 180Q250 176 290 192L300 332H214Z" className="ab-sand" />
    {[232, 256, 276].map(x => <path key={x} d={`M${x} ${184}q-4-8-10-10M${x} 184q0-10 3-14M${x} 184q6-8 11-8`} className="ab-restinga" />)}
    {trees.map(x => <g key={x}>
      <path d={`M${x} 170V196M${x} 190q-14 4-18 28M${x} 190q14 4 18 28M${x} 194q-6 10-6 24M${x} 194q6 10 6 24`} className="ab-mangrove-root" />
      <ellipse cx={x} cy="160" rx="24" ry="15" className="ab-canopy" />
    </g>)}
    {[[330, 228], [372, 236]].map(([x, y], k) => <g key={`j${k}`}>{k ? <path d={`M${x} ${y}q5-4 10 0q-5 3-10 0Zm0 0l-3-2m3 2l-3 2`} className="ab-shrimp" /> : <Fish x={x} y={y} s={0.7} />}</g>)}
    <text x="306" y="262" className="ab-on-water">berçário: fase juvenil</text>
    {[[340, 222], [352, 238], [384, 224], [396, 240]].map(([x, y], k) => <motion.g key={k} initial={{ x: s(0, 170 - k * 10), y: s(0, 26 + k * 10), scale: s(1, 1.6) }}
      animate={{ x: 170 - k * 10, y: 26 + k * 10, scale: 1.6 }} transition={p(2, 1 + k * 0.15)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
      {k % 2 ? <path d={`M${x} ${y}q5-4 10 0q-5 3-10 0Zm0 0l-3-2m3 2l-3 2`} className="ab-shrimp" /> : <Fish x={x} y={y} s={0.7} />}
    </motion.g>)}
    <motion.path d="M590 196q-10-14-20 0t-20 0" className="ab-crest" initial={{ x: s(0, -110), scaleY: s(1, 0.3) }} animate={{ x: -110, scaleY: 0.3 }} transition={p(1.6, 0.4)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }} />
    <text x="230" y="78" className="bi-panel-title">MANGUEZAL · BERÇÁRIO</text>
    <text x="230" y="102" className="bi-small">peixes e crustáceos passam a fase juvenil</text>
    <text x="230" y="118" className="bi-small">entre as raízes, depois vão ao mar aberto</text>
    <text x="358" y="140" textAnchor="middle" className="bi-small bi-strong">manguezal</text>
    <text x="534" y="206" textAnchor="middle" className="ab-on-sea">mar aberto</text>
    <text x="534" y="220" textAnchor="middle" className="ab-on-sea">adultos: pesca</text>
    <text x="252" y="164" textAnchor="middle" className="bi-tiny">restinga</text>
    <text x="230" y="316" className="ab-on-water">raízes seguram sedimento e amortecem ressacas</text>
  </g>;
}

function PantanalFire() {
  const p = usePaced(); const s = useFrom();
  const causes = ['manejo inadequado do fogo', 'mudanças climáticas de origem antrópica', 'drenagem artificial de áreas úmidas'];
  return <g>
    <rect x="214" y="248" width="384" height="84" className="ab-flood" />
    <path d={PLAIN} className="ab-plain-dry" />
    {[[232, 192], [440, 186]].map(([x, y]) => <path key={x} d={`M${x} ${y}v-12l-4-4M${x} ${y - 8}l4-3`} className="ab-stump" />)}
    <path d="M592 196v-22" className="ab-trunk" /><circle cx="592" cy="168" r="10" className="ab-canopy-dry" />
    <motion.g initial={{ x: s(0, 300), opacity: s(1, 0.9) }} animate={{ x: 300, opacity: 0.9 }} transition={p(2.6, 0.5)}>
      <Flame x={246} y={198} /><Flame x={262} y={202} s={0.7} /><Flame x={232} y={196} s={0.6} />
      <path d="M246 170q-6-10 2-18q-6-10 4-16" className="ab-smoke" />
    </motion.g>
    <text x="230" y="78" className="bi-panel-title">FOGO NO PANTANAL</text>
    <text x="230" y="98" className="bi-small bi-warn">três fatores humanos agravam:</text>
    {causes.map((c, k) => <motion.g key={c} initial={{ opacity: s(0, 1), x: s(-10, 0) }} animate={{ opacity: 1, x: 0 }} transition={p(0.5, 0.8 + k * 0.3)}>
      <rect x="230" y={106 + k * 24} width="282" height="20" rx="10" className="ab-cause" />
      <text x="242" y={120 + k * 24} className="bi-small">{c}</text>
    </motion.g>)}
    <text x="230" y="290" className="ab-on-soil">o fogo é parte do regime em algum grau;</text>
    <text x="230" y="306" className="ab-on-soil">incêndios nesta escala não são só naturais</text>
  </g>;
}

export function WetlandsCoast({ active }: Scene) {
  const p = usePaced(); const s = useFrom();
  const Stage = [FloodPulse, PampaField, Mangrove, PantanalFire][active];
  const place = PLACES[active];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Biogeografia do Brasil II: pulso de inundação do Pantanal, campo nativo do Pampa diante da soja, manguezal como berçário e incêndios agravados no Pantanal; recorte ${active + 1} em foco`}>
    <Frame kicker="BIOGEOGRAFIA DO BRASIL · ÁGUA E LITORAL" />
    <MiniMap active={active} />
    <rect x="22" y="236" width="180" height="96" rx="12" className="bi-panel" />
    <motion.g key={`p${active}`} initial={{ opacity: s(0, 1) }} animate={{ opacity: 1 }} transition={p(0.4)}>
      <text x="34" y="258" className="bi-panel-title">{place.title}</text>
      {place.lines.map((line, k) => <text key={line} x="34" y={278 + k * 16} className="bi-small">{line}</text>)}
    </motion.g>
    <defs><clipPath id="ab-clip-bio2"><rect x="214" y="52" width="384" height="280" rx="12" /></clipPath></defs>
    <rect x="214" y="52" width="384" height="280" rx="12" className="ab-stage" />
    <motion.g key={active} clipPath="url(#ab-clip-bio2)" initial={{ opacity: s(0, 1) }} animate={{ opacity: 1 }} transition={p(0.4)}><Stage /></motion.g>
    <rect x="214" y="52" width="384" height="280" rx="12" className="ab-stage-edge" />
    <text x="30" y="346" className="bi-foot">Mapa e perfis esquemáticos, sem escala.</text>
  </svg>;
}

export const SCENES_LOTE16: Record<string, React.ComponentType<Scene>> = {
  'summary-geografia-hidrogeografia-mundial': WorldWaters,
  'summary-geografia-hidrogeografia-do-brasil': BrazilBasins,
  'summary-geografia-biogeografia-do-brasil-i': BiomesProfile,
  'summary-geografia-biogeografia-do-brasil-ii': WetlandsCoast,
};
export const HEADERS_LOTE16: Record<string, string> = {
  'summary-geografia-hidrogeografia-mundial': 'hidrografia comparada',
  'summary-geografia-hidrogeografia-do-brasil': 'bacias e usos da água',
  'summary-geografia-biogeografia-do-brasil-i': 'biomas em perfil',
  'summary-geografia-biogeografia-do-brasil-ii': 'água, campo e litoral',
};
