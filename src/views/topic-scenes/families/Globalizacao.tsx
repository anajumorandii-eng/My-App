import React from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import { ArrowHead, Person, type Scene } from './cenaKit';
import './Globalizacao.css';

function usePaced() {
  const t = useSceneMotion();
  return (duration: number, delay = 0) => (t.duration === 0 ? t : { ...t, duration, delay });
}

// Lote 18: globalização, redes, ordem internacional e União Europeia. Os
// quatro capítulos abriam com o mesmo instrumento genérico (três círculos,
// caixas num eixo) e só trocavam texto. Cada cena agora desenha o mecanismo
// que o resumo explica: o celular que atravessa a cadeia e para no gargalo; a
// rede que deixa Xangai mais perto de Nova York do que da cidade vizinha; o
// país que sai da mesa e volta; o carvão que atravessa a fronteira e vira
// moeda. Nomes, datas e números saem do resumo; o que é desenhado sem medida
// leva rodapé dizendo.

type Paced = ReturnType<typeof usePaced>;

// ─── ícones comuns ──────────────────────────────────────────────────────────

function Phone({ stage = 3 }: { stage?: number }) {
  return <g>
    <rect x="-9" y="-15" width="18" height="30" rx="4" className={stage === 0 ? 'gz-phone-sketch' : 'gz-phone'} />
    {stage >= 2 && <rect x="-6" y="-11" width="12" height="19" rx="1.5" className="gz-screen" />}
    {stage >= 1 && <rect x="-3.5" y="-4" width="7" height="7" rx="1" className="gz-chip" />}
    {stage >= 2 && <circle cx="0" cy="11" r="1.6" className="gz-phone-dot" />}
  </g>;
}

function Chip({ s = 1 }: { s?: number }) {
  const pins = [-7, 0, 7];
  return <g transform={`scale(${s})`}>
    {pins.map(k => <path key={k} d={`M${k} -17v5M${k} 12v5M-17 ${k}h5M12 ${k}h5`} className="gz-chip-pin" />)}
    <rect x="-12" y="-12" width="24" height="24" rx="3" className="gz-chip" />
    <rect x="-6" y="-6" width="12" height="12" rx="1.5" className="gz-chip-core" />
  </g>;
}

function GlobeIcon({ r = 14 }: { r?: number }) {
  return <g>
    <circle r={r} className="gz-globe" />
    <path d={`M${-r} 0h${2 * r}M0 ${-r}c${-r * 0.7} ${r * 0.5} ${-r * 0.7} ${r * 1.5} 0 ${2 * r}M0 ${-r}c${r * 0.7} ${r * 0.5} ${r * 0.7} ${r * 1.5} 0 ${2 * r}M${-r * 0.86} ${-r * 0.5}h${1.72 * r}M${-r * 0.86} ${r * 0.5}h${1.72 * r}`} className="gz-globe-line" />
  </g>;
}

function Coin({ x, y, r = 8, label = '$' }: { x: number; y: number; r?: number; label?: string }) {
  return <g>
    <circle cx={x} cy={y} r={r} className="gz-coin" />
    <text x={x} y={y + 3.4} textAnchor="middle" className="gz-coin-text">{label}</text>
  </g>;
}

function Factory({ x, y, s = 1, off = false }: { x: number; y: number; s?: number; off?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-18 0v-18l10-7v7l10-7v7l10-7v25ZM8 -18v-13h6v13" className={off ? 'gz-factory-off' : 'gz-factory'} />
    <path d="M-13 -9h4v4h-4ZM-3 -9h4v4h-4ZM7 -9h4v4h-4Z" className="gz-window" />
  </g>;
}

function Tower({ x, y, h = 40, w = 16 }: { x: number; y: number; h?: number; w?: number }) {
  const rows = Math.floor((h - 8) / 8);
  return <g>
    <rect x={x - w / 2} y={y - h} width={w} height={h} rx="1.5" className="gz-tower" />
    {Array.from({ length: rows }, (_, k) => <path key={k} d={`M${x - w / 2 + 3} ${y - h + 6 + k * 8}h${w - 6}`} className="gz-tower-win" />)}
  </g>;
}

function House({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-9 0v-11h18v11Z" className="gz-house" />
    <path d="M-12 -10L0 -19 12 -10Z" className="gz-roof" />
  </g>;
}

// ─── 1. Globalização: o smartphone pela cadeia ──────────────────────────────

const STATIONS = [
  { x: 96, place: 'EUA', step: 'design' },
  { x: 238, place: 'Taiwan · Coreia do Sul', step: 'semicondutores' },
  { x: 380, place: 'China · Vietnã', step: 'montagem final' },
  { x: 522, place: 'mundo', step: 'distribuição' },
];
const SY = 128;

function StationIcon({ k }: { k: number }) {
  if (k === 0) return <g>
    <rect x="-15" y="-17" width="22" height="30" rx="2" className="gz-sheet" />
    <rect x="-10" y="-12" width="12" height="20" rx="3" className="gz-phone-sketch" />
    <path d="M5 13L17 -7l4 2.5L9 15.5Z" className="gz-pencil" />
    <path d="M5 13l-1 5 5-2.5" className="gz-pencil-tip" />
  </g>;
  if (k === 1) return <Chip s={0.95} />;
  if (k === 2) return <g>
    <path d="M-20 10h40" className="gz-belt" />
    <circle cx="-16" cy="13" r="3" className="gz-roller" /><circle cx="0" cy="13" r="3" className="gz-roller" /><circle cx="16" cy="13" r="3" className="gz-roller" />
    <g transform="translate(-7 -6) scale(0.62)"><Phone stage={2} /></g>
    <g transform="translate(9 -6) scale(0.62)"><Phone stage={1} /></g>
    <path d="M0 -24v8M-4 -16h8" className="gz-arm" />
  </g>;
  return <g>
    <GlobeIcon r={15} />
    <path d="M9 4h12l-2 13H11Z" className="gz-bag" />
    <path d="M12 4q3-6 6 0" className="gz-bag-handle" />
  </g>;
}

function SmartphoneChain({ active }: Scene) {
  const p = usePaced();
  const broken = active === 1;
  const seg = (i: number) => `M${STATIONS[i].x + 36} ${SY}C${STATIONS[i].x + 60} ${SY - 18} ${STATIONS[i + 1].x - 60} ${SY - 18} ${STATIONS[i + 1].x - 36} ${SY}`;
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Cadeia global de valor do smartphone: design nos EUA, semicondutores em Taiwan e Coreia do Sul, montagem na China ou no Vietnã, distribuição no mundo; o gargalo da pandemia, o dilema custo e resiliência e a reconfiguração; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">CADEIA GLOBAL DE VALOR</text>
    <rect x="22" y="54" width="576" height="164" rx="14" className="gz-sea" />
    {[[60, 78], [170, 206], [300, 72], [446, 204], [566, 80]].map(([x, y]) => <path key={x} d={`M${x} ${y}q6-4 12 0t12 0`} className="gz-wave" />)}
    <ArrowHead id="gz-head-chain" />

    {[0, 1, 2].map(i => {
      const dead = broken && i >= 1;
      return <motion.path key={i} d={seg(i)} className={dead ? 'gz-route-off' : 'gz-route'} markerEnd={dead ? undefined : 'url(#gz-head-chain)'}
        initial={false} animate={{ opacity: dead ? 0.55 : 1 }} transition={p(0.5)} />;
    })}

    {STATIONS.map((st, k) => {
      const shut = broken && k === 1;
      const dim = broken && k > 1;
      return <g key={st.place} opacity={dim ? 0.5 : 1}>
        <motion.circle cx={st.x} cy={SY} r="34" className={shut ? 'gz-stamp-shut' : active === 0 ? 'gz-stamp-on' : 'gz-stamp'}
          initial={false} animate={{ scale: shut ? [1, 1.08, 1] : 1 }} transition={p(0.6, 0.3)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
        <g transform={`translate(${st.x} ${SY})`}><StationIcon k={k} /></g>
        <text x={st.x} y={SY + 54} textAnchor="middle" className="gz-place">{st.place}</text>
        <text x={st.x} y={SY + 69} textAnchor="middle" className="bi-small">{st.step}</text>
      </g>;
    })}

    {/* O celular viaja e ganha as peças em cada etapa. */}
    {active === 0 && <motion.g key="trip" initial={{ x: STATIONS[0].x }} animate={{ x: STATIONS.map(s => s.x).flatMap((x, k) => k === 0 ? [x] : [x, x]) }}
      transition={{ ...p(1.8, 0.2), times: [0, 0.28, 0.4, 0.66, 0.78, 1] }}>
      <g transform="translate(0 76)"><Phone stage={3} /></g>
    </motion.g>}

    {broken && <g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4, 0.4)}>
        <path d={`M${STATIONS[1].x - 20} ${SY - 20}l40 40M${STATIONS[1].x + 20} ${SY - 20}l-40 40`} className="bi-cross" />
      </motion.g>
      <motion.g initial={{ x: STATIONS[0].x }} animate={{ x: [STATIONS[0].x, 196, 190, 196, 192] }} transition={p(1.2, 0.1)}>
        <g transform="translate(0 76)"><Phone stage={0} /></g>
      </motion.g>
      <text x="262" y="72" className="bi-hand-sm">fábricas fechadas: o chip não sai</text>
      {[1, 2].map(k => <text key={k} x={STATIONS[k + 1].x} y={SY - 42} textAnchor="middle" className="gz-stop">parado</text>)}
    </g>}

    {active === 2 && <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={p(0.6, 0.3)}>
      <circle cx="452" cy="80" r="17" className="gz-stamp-new" />
      <g transform="translate(452 80)"><Chip s={0.55} /></g>
      <path d="M466 92C486 102 500 106 508 100" className="gz-route-new" markerEnd="url(#gz-head-chain)" />
      <text x="476" y="70" className="bi-hand-sm">nearshoring</text>
      <text x="476" y="84" className="bi-tiny">mais perto do mercado</text>
      <path d={`M${STATIONS[1].x + 30} ${SY - 18}C300 60 380 58 434 76`} className="gz-route-new" />
    </motion.g>}

    {active === 3 && <motion.path d="M96 94C200 64 420 64 522 94" className="gz-route-new" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={p(1, 0.2)} />}
    {active === 3 && <text x="310" y="62" textAnchor="middle" className="bi-hand-sm">cadeias mais curtas, regionalizadas</text>}

    <rect x="22" y="228" width="576" height="100" rx="12" className="bi-panel" />
    <motion.g key={`panel-${active}`} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={p(0.45, 0.15)}>
      {active === 0 && <g>
        <text x="40" y="250" className="bi-panel-title">CADA ETAPA ONDE HÁ VANTAGEM</text>
        <text x="40" y="274" className="bi-small">cada país se especializa na etapa em que tem vantagem</text>
        <text x="40" y="290" className="bi-small">comparativa de custo, tecnologia ou mão de obra</text>
        <text x="40" y="314" className="bi-hand-sm">não é exportar pronto: o próprio processo se reparte</text>
        <g transform="translate(470 282)">
          <path d="M-36 -26h52l14 14v34h-66Z" className="gz-tag" />
          <circle cx="8" cy="-14" r="3" className="gz-tag-hole" />
          <text x="-6" y="4" textAnchor="middle" className="gz-tag-text">custo</text>
          <motion.path d="M-6 10v14M-12 18l6 6 6-6" className="gz-down" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={p(0.6, 0.9)} />
        </g>
        <text x="530" y="276" className="bi-tiny">reduz</text>
        <text x="530" y="290" className="bi-tiny">custos</text>
      </g>}
      {active === 1 && <g>
        <text x="40" y="250" className="bi-panel-title">COVID-19: UM PONTO FECHA, A CADEIA PARA</text>
        <g transform="translate(70 294)"><Chip s={0.8} /></g>
        <path d="M58 282l24 24M82 282l-24 24" className="bi-cross" />
        <text x="104" y="282" className="bi-small bi-strong">escassez de semicondutores</text>
        <text x="104" y="298" className="bi-small">originada principalmente em Taiwan</text>
        {[0, 1, 2, 3].map(k => <motion.g key={k} initial={{ opacity: 1 }} animate={{ opacity: 0.55 }} transition={p(0.5, 0.6 + k * 0.15)}>
          <Factory x={372 + k * 56} y={306} s={0.95} off />
          <path d={`M${366 + k * 56} 262v10M${372 + k * 56} 262v10`} className="gz-pause" />
        </motion.g>)}
        <text x="456" y="322" textAnchor="middle" className="bi-tiny">cadeias paradas em todo o mundo</text>
      </g>}
      {active === 2 && <g>
        <text x="40" y="250" className="bi-panel-title">O DILEMA DA EMPRESA</text>
        <path d="M310 318v-50" className="gz-post" />
        <path d="M296 320h28" className="gz-post" />
        <motion.g initial={{ rotate: -9 }} animate={{ rotate: 5 }} transition={p(1.2, 0.5)} style={{ transformOrigin: '310px 268px' }}>
          <path d="M214 268h192" className="gz-beam" />
          <path d="M226 268l-16 26h32ZM394 268l-16 26h32Z" className="gz-string" />
          <path d="M204 294h44a22 6 0 0 1-44 0ZM372 294h44a22 6 0 0 1-44 0Z" className="gz-pan" />
          <Coin x={218} y={286} r={6} /><Coin x={232} y={286} r={6} />
          <path d="M394 276l12 4v8c0 6-6 9-12 11-6-2-12-5-12-11v-8Z" className="gz-shield" />
        </motion.g>
        <text x="40" y="276" className="bi-small bi-strong">eficiência de custo</text>
        <text x="40" y="292" className="bi-small">poucos fornecedores</text>
        <text x="40" y="306" className="bi-small">especializados</text>
        <text x="580" y="276" textAnchor="end" className="bi-small bi-strong">resiliência</text>
        <text x="580" y="292" textAnchor="end" className="bi-small">diversificação</text>
        <text x="580" y="306" textAnchor="end" className="bi-small">geográfica</text>
      </g>}
      {active === 3 && <g>
        <text x="40" y="250" className="bi-panel-title">CRÍTICAS, POR RAZÕES DISTINTAS</text>
        <path d="M40 260h202a8 8 0 0 1 8 8v26a8 8 0 0 1-8 8H66l-10 10v-10H48a8 8 0 0 1-8-8v-26a8 8 0 0 1 8-8Z" className="gz-bubble" />
        <text x="50" y="276" className="bi-tiny">à esquerda: exploração do</text>
        <text x="50" y="290" className="bi-tiny">trabalho, fundo do poço regulatório</text>
        <path d="M270 260h170a8 8 0 0 1 8 8v26a8 8 0 0 1-8 8H304l-10 10v-10h-16a8 8 0 0 1-8-8v-26a8 8 0 0 1 8-8Z" className="gz-bubble" />
        <text x="280" y="276" className="bi-tiny">nacionalistas: repatriar</text>
        <text x="280" y="290" className="bi-tiny">indústrias, barreiras comerciais</text>
        <g transform="translate(524 298)">
          <path d="M-40 0a40 40 0 0 1 80 0" className="gz-gauge" />
          <path d="M-40 0a40 40 0 0 1 80 0" className="gz-gauge-hi" pathLength={1} strokeDasharray="0.28 1" strokeDashoffset="-0.62" />
          <motion.path d="M0 0L0 -30" className="gz-needle" initial={{ rotate: -40 }} animate={{ rotate: [-40, 10, 58] }} transition={p(1.3, 0.4)} style={{ transformOrigin: '0px 0px' }} />
          <circle r="4" className="gz-needle-hub" />
        </g>
        <text x="524" y="316" textAnchor="middle" className="bi-tiny">comércio: ainda elevado</text>
      </g>}
    </motion.g>
    <text x="310" y="344" textAnchor="middle" className="bi-foot">{active === 3 ? 'reconfiguração, mais que reversão · mapa esquemático, sem escala' : 'mapa esquemático, sem escala'}</text>
  </svg>;
}

// ─── 2. Redes mundiais ──────────────────────────────────────────────────────

/** Pontos de uma quadrática, para a bolinha de fluxo correr sobre a curva. */
function quad(a: [number, number], c: [number, number], b: [number, number], n = 9) {
  const xs: number[] = []; const ys: number[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    xs.push((1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t ** 2 * b[0]);
    ys.push((1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t ** 2 * b[1]);
  }
  return { xs, ys };
}

function Flow({ a, c, b, p, delay = 0, n = 3 }: { a: [number, number]; c: [number, number]; b: [number, number]; p: Paced; delay?: number; n?: number }) {
  const { xs, ys } = quad(a, c, b);
  return <>{Array.from({ length: n }, (_, k) => <motion.circle key={k} r="3.4" className="gz-packet" initial={{ cx: a[0], cy: a[1], opacity: 0 }}
    animate={{ cx: xs, cy: ys, opacity: [0, 1, 1, 1, 1, 1, 1, 1, 1, 0] }} transition={p(1.4, delay + k * 0.25)} />)}</>;
}

function NetworkMap({ active }: Scene) {
  const p = usePaced();
  const grid = <g className="gz-grid">
    {[90, 150, 210, 270].map(y => <path key={y} d={`M24 ${y}H596`} />)}
    {[110, 210, 310, 410, 510].map(x => <path key={x} d={`M${x} 56V300`} />)}
  </g>;
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Geografia das redes: nós e vazios, a hierarquia das cidades globais, os cabos submarinos e a localização dos data centers; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">{['NÓS E VAZIOS', 'CIDADES GLOBAIS', 'O FUNDO DO MAR', 'ONDE FICAM OS DATA CENTERS'][active]}</text>
    <ArrowHead id="gz-head-net" />

    {active === 0 && <g>
      {grid}
      <path d="M130 168Q315 30 500 168" className="gz-link-thick" />
      <Flow a={[130, 168]} c={[315, 30]} b={[500, 168]} p={p} delay={0.2} n={4} />
      <circle cx="130" cy="180" r="30" className="gz-node-big" />
      <Factory x={130} y={194} s={0.9} />
      <text x="130" y="232" textAnchor="middle" className="bi-label">Xangai</text>
      <text x="130" y="247" textAnchor="middle" className="bi-tiny">fábrica</text>
      <circle cx="500" cy="180" r="30" className="gz-node-big" />
      <Tower x={490} y={200} h={36} w={12} /><Tower x={506} y={200} h={28} w={12} />
      <text x="500" y="232" textAnchor="middle" className="bi-label">Nova York</text>
      <text x="500" y="247" textAnchor="middle" className="bi-tiny">matriz</text>
      <text x="315" y="66" textAnchor="middle" className="bi-hand">longe no mapa, perto na rede</text>
      <text x="315" y="84" textAnchor="middle" className="bi-tiny">cadeias logísticas e comunicação instantânea</text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.6, 1)}>
        <circle cx="262" cy="276" r="34" className="gz-void" />
        <House x={252} y={284} s={0.9} /><House x={274} y={286} s={0.75} />
        <text x="262" y="330" textAnchor="middle" className="bi-small bi-strong">cidade rural</text>
        <path d="M160 190L236 262" className="gz-ruler" />
        <text x="198" y="212" className="bi-tiny">poucas centenas</text>
        <text x="198" y="225" className="bi-tiny">de km</text>
        <text x="306" y="262" className="bi-hand-sm">perto no mapa,</text>
        <text x="306" y="279" className="bi-hand-sm">fora da rede</text>
        <text x="306" y="296" className="bi-tiny">vazio relativo</text>
      </motion.g>
      <text x="580" y="290" textAnchor="end" className="bi-tiny">nós: grandes cidades, portos</text>
    </g>}

    {active === 1 && <g>
      {[[[130, 110], [310, 80]], [[310, 80], [490, 110]], [[130, 110], [490, 110]]].map(([a, b], k) =>
        <motion.path key={k} d={`M${a[0]} ${a[1]}L${b[0]} ${b[1]}`} className="gz-link-thick" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={p(0.6, 0.1 + k * 0.15)} />)}
      <motion.path d="M310 214L130 110M310 214L310 80M310 214L490 110" className="gz-link-mid" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={p(0.7, 0.6)} />
      {[[124, 306], [212, 318], [408, 318], [496, 306]].map(([x, y], k) => <motion.path key={k} d={`M310 214L${x} ${y - 12}`} className="gz-link-thin" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={p(0.5, 1 + k * 0.08)} />)}
      {[{ x: 130, y: 110, n: 'Nova York' }, { x: 310, y: 80, n: 'Londres' }, { x: 490, y: 110, n: 'Tóquio' }].map(c => <g key={c.n}>
        <circle cx={c.x} cy={c.y} r="24" className="gz-node-big" />
        <Tower x={c.x - 6} y={c.y + 12} h={28} w={10} /><Tower x={c.x + 7} y={c.y + 12} h={20} w={10} />
        <text x={c.x} y={c.n === 'Londres' ? c.y - 32 : c.y + 40} textAnchor="middle" className="bi-label">{c.n}</text>
      </g>)}
      <circle cx="310" cy="214" r="20" className="gz-node-sp" />
      <Tower x={305} y={224} h={22} w={9} /><Tower x={316} y={224} h={16} w={9} />
      <text x="340" y="206" className="bi-label">São Paulo</text>
      <text x="340" y="222" className="bi-tiny">cidade global regional</text>
      <text x="340" y="236" className="bi-tiny">não é a capital política</text>
      {[[124, 306], [212, 318], [408, 318], [496, 306]].map(([x, y]) => <House key={x} x={x} y={y} s={0.7} />)}
      <text x="310" y="336" textAnchor="middle" className="bi-small">cidades menores do interior</text>
      <text x="40" y="190" className="bi-hand-sm">sedes, bolsas,</text>
      <text x="40" y="207" className="bi-hand-sm">finanças, direito</text>
      <text x="582" y="190" textAnchor="end" className="bi-hand-sm">liga mais forte</text>
      <text x="582" y="207" textAnchor="end" className="bi-hand-sm">para cima que</text>
      <text x="582" y="224" textAnchor="end" className="bi-hand-sm">para dentro</text>
    </g>}

    {active === 2 && <g>
      <path d="M22 118H598V300H22Z" className="gz-water" />
      {[60, 180, 420, 540].map(x => <path key={x} d={`M${x} 118q8-5 16 0t16 0`} className="gz-wave" />)}
      <path d="M22 300C120 288 220 306 310 296S500 290 598 300V330H22Z" className="gz-seabed" />
      <path d="M22 96H96L112 300H22Z" className="gz-cliff" />
      <path d="M598 96H524L508 300H598Z" className="gz-cliff" />
      <path d="M110 290C200 280 260 300 310 290S450 282 510 290" className="gz-cable" />
      <Flow a={[110, 290]} c={[310, 282]} b={[510, 290]} p={p} delay={0.1} n={4} />
      <text x="310" y="276" textAnchor="middle" className="gz-big">mais de 95%</text>
      <text x="310" y="322" textAnchor="middle" className="bi-small bi-strong">do tráfego internacional: cabos de fibra óptica</text>
      <text x="60" y="88" textAnchor="middle" className="bi-small bi-strong">continente</text>
      <text x="560" y="88" textAnchor="middle" className="bi-small bi-strong">continente</text>
      <g transform="translate(220 62)">
        <path d="M-6 -6h12v12h-12Z" className="gz-sat" />
        <path d="M-22 -4h14v8h-14ZM8 -4h14v8H8Z" className="gz-sat-wing" />
      </g>
      <path d="M220 72L200 114" className="gz-sat-beam" />
      <text x="246" y="60" className="bi-tiny">satélite: fração pequena,</text>
      <text x="246" y="73" className="bi-tiny">áreas remotas</text>
      {/* Ilha de rota única: a âncora corta o único cabo e ela apaga. */}
      <path d="M404 118q16-18 36 0Z" className="gz-island" />
      <path d="M422 118C424 180 430 240 432 288" className="gz-cable-thin" />
      <motion.circle cx="422" cy="104" r="4" className="gz-lamp" initial={{ opacity: 1 }} animate={{ opacity: 0.15 }} transition={p(0.3, 1.5)} />
      <motion.g initial={{ y: 0 }} animate={{ y: 96 }} transition={p(1, 0.5)}>
        <path d="M429 110v-40" className="gz-anchor-rope" />
        <path d="M429 112v18M421 118h16M417 124q12 14 24 0" className="gz-anchor" />
      </motion.g>
      <motion.path d="M417 214l24 12M417 226l24-12" className="bi-cross" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.3, 1.4)} />
      <path d="M404 70q-2-10 10-12h36a8 8 0 0 1 0 16h-44Z" className="gz-ship" />
      <text x="450" y="150" className="bi-hand-sm">rota única:</text>
      <text x="450" y="166" className="bi-hand-sm">um corte isola</text>
      <text x="140" y="150" className="bi-hand-sm">várias rotas resistem</text>
      <path d="M110 250C200 240 260 262 310 252S450 244 510 252" className="gz-cable-thin" />
    </g>}

    {active === 3 && <g>
      <g transform="translate(310 190)">
        <path d="M-70 60V-40h140V60Z" className="gz-dc" />
        <path d="M-80 -40h160l-10 -18h-140Z" className="gz-dc-roof" />
        {[-48, -16, 16, 48].map(x => <g key={x}>
          <rect x={x - 12} y="-28" width="24" height="80" rx="2" className="gz-rack" />
          {[0, 1, 2, 3, 4, 5].map(r => <motion.circle key={r} cx={x - 5} cy={-19 + r * 12} r="2" className="gz-led" initial={{ opacity: 0.25 }}
            animate={{ opacity: 1 }} transition={p(0.3, 0.2 + ((x + 48) / 32 + r) * 0.07)} />)}
          {[0, 1, 2, 3, 4, 5].map(r => <path key={`l${r}`} d={`M${x + 1} ${-19 + r * 12}h8`} className="gz-rack-line" />)}
        </g>)}
      </g>
      <text x="310" y="272" textAnchor="middle" className="bi-label">data center</text>
      <text x="310" y="288" textAnchor="middle" className="bi-tiny">milhares de servidores</text>
      {[
        { x: 118, y: 96, lines: ['energia abundante', 'e barata'], icon: <path d="M3 -14L-7 2h8l-4 13L11 -3H3Z" className="gz-bolt" /> },
        { x: 118, y: 196, lines: ['clima ameno:', 'refrigeração barata'], icon: <g><path d="M0 -13v26M-11 -6.5l22 13M-11 6.5l22-13" className="gz-snow" /></g> },
        { x: 118, y: 296, lines: ['perto de cabos', 'de fibra óptica'], icon: <path d="M-13 4C-6 -8 6 12 13 -2" className="gz-cable" /> },
      ].map((c, k) => <motion.g key={k} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={p(0.45, 0.2 + k * 0.25)}>
        <circle cx={c.x - 64} cy={c.y - 6} r="18" className="gz-crit" />
        <g transform={`translate(${c.x - 64} ${c.y - 6})`}>{c.icon}</g>
        <text x={c.x - 38} y={c.y - 9} className="bi-small bi-strong">{c.lines[0]}</text>
        <text x={c.x - 38} y={c.y + 6} className="bi-small">{c.lines[1]}</text>
        <path d={`M${c.x + 86} ${c.y - 6}L${240} ${190 + (k - 1) * 30}`} className="gz-link-thin" />
      </motion.g>)}
      {['Virgínia (EUA)', 'Irlanda', 'países nórdicos'].map((n, k) => <motion.g key={n} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={p(0.4, 1 + k * 0.2)}>
        <path d={`M460 ${116 + k * 60}c0-12 18-12 18 0 0 8-9 16-9 16s-9-8-9-16Z`} className="gz-pin" />
        <circle cx="469" cy={116 + k * 60} r="3" className="gz-pin-hole" />
        <text x="486" y={122 + k * 60} className="bi-small bi-strong">{n}</text>
      </motion.g>)}
      <text x="400" y="80" className="bi-hand-sm">onde se concentram:</text>
      <text x="566" y="316" textAnchor="end" className="bi-tiny">não só onde há mais usuários</text>
      <text x="566" y="330" textAnchor="end" className="bi-tiny">lógica diferente da indústria</text>
    </g>}
  </svg>;
}

// ─── 3. Unilateralismo e multilateralismo ───────────────────────────────────

const SEATS: [number, number][] = [[400, 150], [460, 128], [520, 150], [520, 214], [400, 214]];

function Table({ dim = false }: { dim?: boolean }) {
  return <g opacity={dim ? 0.45 : 1}>
    <ellipse cx="460" cy="182" rx="80" ry="34" className="gz-table" />
    <path d="M430 176h60M436 188h48" className="gz-table-doc" />
  </g>;
}

function Multilateral({ active }: Scene) {
  const p = usePaced();
  const atTable = active === 1;
  const soloX = 150;
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Unilateralismo e multilateralismo: um país que age sozinho, o mesmo país à mesa com outros, as instituições do pós-guerra e o problema transfronteiriço que ninguém resolve sozinho; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">{['UNILATERALISMO', 'MULTILATERALISMO', 'INSTITUIÇÕES DO PÓS-1945', 'PROBLEMAS SEM FRONTEIRA'][active]}</text>
    <ArrowHead id="gz-head-multi" />

    {active <= 1 && <g>
      <rect x="30" y="58" width="236" height="232" rx="14" className={active === 0 ? 'gz-zone-on' : 'gz-zone'} />
      <rect x="296" y="58" width="294" height="232" rx="14" className={active === 1 ? 'gz-zone-on' : 'gz-zone'} />
      <text x="148" y="82" textAnchor="middle" className="bi-panel-title">SOZINHO</text>
      <text x="443" y="82" textAnchor="middle" className="bi-panel-title">À MESA · TRÊS OU MAIS</text>
      <Table dim={active === 0} />
      {SEATS.map(([x, y], k) => (k === 4 ? null : <g key={k} opacity={active === 0 ? 0.45 : 1}><Person x={x} y={y - 24} s={0.8} coat={['bi-coat-green', 'bi-coat-plain', 'bi-coat-royal', 'bi-coat'][k]} /></g>))}
      {/* O mesmo país vai e volta entre os dois modos. */}
      <motion.g initial={false} animate={{ x: atTable ? SEATS[4][0] - soloX : 0, y: atTable ? SEATS[4][1] - 24 - 170 : 0 }} transition={p(1.1, 0.2)}>
        <Person x={soloX} y={170} s={1} coat="gz-coat-us" />
        <circle cx={soloX + 16} cy={166} r="7" className="gz-badge" />
        <text x={soloX + 16} y={169.5} textAnchor="middle" className="gz-badge-text">A</text>
      </motion.g>
      {active === 0 && <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.5, 0.4)}>
        <motion.path d="M168 232C200 236 226 222 240 204" className="bi-arrow" markerEnd="url(#gz-head-multi)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={p(0.8, 0.6)} />
        <path d="M58 98h128a8 8 0 0 1 8 8v26a8 8 0 0 1-8 8h-78l-10 10v-10H58a8 8 0 0 1-8-8v-26a8 8 0 0 1 8-8Z" className="gz-bubble" />
        <text x="66" y="115" className="bi-tiny">interesse nacional</text>
        <text x="66" y="129" className="bi-tiny">considerado urgente</text>
        <text x="148" y="262" textAnchor="middle" className="bi-small bi-strong">decide sem buscar consenso</text>
        <text x="148" y="278" textAnchor="middle" className="bi-tiny">nem cooperação formal</text>
      </motion.g>}
      {active === 1 && <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.5, 0.9)}>
        <text x="443" y="258" textAnchor="middle" className="bi-small bi-strong">instituições, tratados, fóruns</text>
        <text x="443" y="274" textAnchor="middle" className="bi-tiny">consenso ou regras compartilhadas</text>
        <g opacity="0.35"><Person x={soloX} y={170} s={1} coat="gz-coat-ghost" /></g>
        <path d="M176 196C236 170 316 172 366 190" className="gz-route-new" markerEnd="url(#gz-head-multi)" />
        <text x="148" y="126" textAnchor="middle" className="bi-hand-sm">o mesmo país</text>
        <text x="148" y="143" textAnchor="middle" className="bi-hand-sm">faz os dois</text>
      </motion.g>}
      <text x="310" y="314" textAnchor="middle" className="bi-hand-sm">a escolha é situacional e estratégica, não fixa</text>
      <text x="310" y="336" textAnchor="middle" className="bi-foot">país A: figura genérica, não um país específico</text>
    </g>}

    {active === 2 && <g>
      <g transform="translate(160 176)">
        <path d="M-96 70h192" className="bi-ground" />
        <path d="M-80 70V-6h160V70Z" className="gz-hall" />
        <path d="M-90 -6L0 -52 90 -6Z" className="gz-hall-roof" />
        {[-58, -30, 0, 30, 58].map(x => <path key={x} d={`M${x} 0v64`} className="gz-column" />)}
        <text x="0" y="-16" textAnchor="middle" className="gz-hall-text">ONU · 1945</text>
      </g>
      <text x="160" y="270" textAnchor="middle" className="bi-small bi-strong">Conselho de Segurança</text>
      {[0, 1, 2, 3, 4].map(k => <motion.g key={k} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={p(0.35, 0.3 + k * 0.12)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <circle cx={76 + k * 21} cy="292" r="8.5" className="gz-veto" />
        <path d={`M${72 + k * 21} 289l4 6 4-6`} className="gz-veto-mark" />
      </motion.g>)}
      {[0, 1, 2, 3].map(k => <circle key={k} cx={214 + k * 17} cy="292" r="6.5" className="gz-rot" />)}
      <text x="112" y="316" textAnchor="middle" className="bi-tiny">5 permanentes: veto</text>
      <text x="246" y="316" textAnchor="middle" className="bi-tiny">rotativos: sem veto</text>
      <text x="160" y="334" textAnchor="middle" className="bi-tiny">EUA, Rússia, China, Reino Unido, França</text>
      {[
        { y: 76, t: 'OMC', a: 'regras de comércio,', b: 'arbitragem de disputas', icon: <path d="M-12 -4h24M0 -12v20M-12 -4l-5 10h10ZM12 -4l-5 10h10Z" className="bi-icon" /> },
        { y: 154, t: 'FMI', a: 'estabilidade, balanço', b: 'de pagamentos', icon: <g><path d="M-12 8h24M-9 8v-10M-3 8v-14M3 8v-8M9 8v-16" className="bi-icon" /></g> },
        { y: 232, t: 'Banco Mundial', a: 'projetos de desenvolvimento', b: 'de longo prazo', icon: <g><path d="M-10 8v-10l10-8 10 8v10ZM-3 8v-6h6v6" className="bi-icon" /></g> },
      ].map((c, k) => <motion.g key={c.t} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={p(0.45, 0.5 + k * 0.2)}>
        <rect x="316" y={c.y - 12} width="270" height="62" rx="10" className="gz-card" />
        <circle cx="346" cy={c.y + 19} r="18" className="gz-crit" />
        <g transform={`translate(346 ${c.y + 19})`}>{c.icon}</g>
        <text x="374" y={c.y + 10} className="bi-label">{c.t}</text>
        <text x="374" y={c.y + 26} className="bi-tiny">{c.a}</text>
        <text x="374" y={c.y + 39} className="bi-tiny">{c.b}</text>
      </motion.g>)}
      <text x="452" y="314" textAnchor="middle" className="bi-hand-sm">o veto reflete o poder de 1945</text>
      <text x="452" y="332" textAnchor="middle" className="bi-tiny">críticas: representatividade, condicionalidades</text>
    </g>}

    {active === 3 && <g>
      <path d="M30 250C120 236 200 256 310 246S500 238 590 250V290H30Z" className="gz-land" />
      {[170, 310, 450].map(x => <path key={x} d={`M${x} 238V292`} className="gz-border" />)}
      {[100, 240, 380, 520].map((x, k) => <House key={x} x={x} y={260 + (k % 2) * 4} s={1} />)}
      <Person x={100} y={196} s={0.9} coat="gz-coat-us" />
      <circle cx="114" cy="194" r="6" className="gz-badge" />
      <text x="114" y="197" textAnchor="middle" className="gz-badge-text">A</text>
      <motion.path d="M160 250V206h14V250" className="gz-wall" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={p(0.5, 0.2)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }} />
      <text x="84" y="316" className="bi-tiny">muro, fronteira fechada:</text>
      <text x="84" y="330" className="bi-tiny">a nuvem passa por cima</text>
      <motion.g initial={{ x: 0 }} animate={{ x: 330 }} transition={p(1.8, 0.4)}>
        <path d="M120 150c-16 0-22-18-8-24 0-16 22-20 30-8 8-10 28-6 28 8 14 2 14 24-2 24Z" className="gz-cloud" />
        <path d="M130 160q4 8 0 16M150 162q4 8 0 16M168 160q4 8 0 16" className="gz-drip" />
      </motion.g>
      {['clima', 'pandemias', 'IA', 'cibersegurança'].map((t, k) => <motion.g key={t} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={p(0.35, 0.3 + k * 0.15)}>
        <rect x={30 + k * 104 + (k === 3 ? 0 : 0)} y="62" width={k === 3 ? 124 : 94} height="26" rx="13" className="gz-chiplabel" />
        <text x={30 + k * 104 + (k === 3 ? 62 : 47)} y="79.5" textAnchor="middle" className="bi-small bi-strong">{t}</text>
      </motion.g>)}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.5, 1.6)}>
        <path d="M242 314C300 334 440 334 500 314" className="gz-hands" />
        {[240, 320, 400, 480].map(x => <motion.path key={x} d={`M${x + 10} 290L${x + 18} 312`} className="gz-link-thin" />)}
        <text x="580" y="316" textAnchor="end" className="bi-hand-sm">coordenação</text>
        <text x="580" y="333" textAnchor="end" className="bi-hand-sm">multilateral</text>
      </motion.g>
      <text x="420" y="160" textAnchor="end" className="bi-hand">nenhum país resolve sozinho</text>
      <text x="420" y="178" textAnchor="end" className="bi-tiny">o problema não respeita fronteiras</text>
    </g>}
  </svg>;
}

// ─── 4. União Europeia ──────────────────────────────────────────────────────

const YEARS = [1951, 1992, 2010, 2015, 2020];
const yx = (y: number) => 70 + (y - 1951) * (480 / 69);

function Ring({ cx, cy, r, n, className }: { cx: number; cy: number; r: number; n: number; className: string }) {
  return <>{Array.from({ length: n }, (_, k) => {
    const a = (k / n) * Math.PI * 2 - Math.PI / 2;
    return <circle key={k} cx={cx + r * Math.cos(a)} cy={cy + r * Math.sin(a)} r="5" className={className} />;
  })}</>;
}

function EuropeanUnion({ active }: Scene) {
  const p = usePaced();
  const lit = active === 3 ? [3, 4] : [active];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`União Europeia: CECA de 1951, Tratado de Maastricht de 1992, o euro e a crise de 2010, refugiados a partir de 2015 e o Brexit em 2020; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">{['CARVÃO E AÇO', 'ALÉM DO COMÉRCIO', 'UMA MOEDA, SEM CÂMBIO PRÓPRIO', 'ONDE A INTEGRAÇÃO RANGE'][active]}</text>
    <ArrowHead id="gz-head-ue" />

    {/* Linha do tempo fixa, proporcional aos anos. */}
    <path d={`M${yx(1951) - 16} 304H${yx(2020) + 16}`} className="gz-timeline" />
    {YEARS.map((y, k) => {
      const on = lit.includes(k);
      return <g key={y}>
        <motion.circle cx={yx(y)} cy="304" r={on ? 7 : 5} className={on ? 'gz-year-on' : 'gz-year'} initial={false} animate={{ scale: on ? [1, 1.3, 1] : 1 }} transition={p(0.5, 0.1)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
        <text x={yx(y)} y="326" textAnchor="middle" className={on ? 'gz-year-text-on' : 'gz-year-text'}>{y}</text>
      </g>;
    })}
    <text x="310" y="344" textAnchor="middle" className="bi-foot">esquemático, sem escala espacial; a linha do tempo é proporcional</text>

    {active === 0 && <g>
      <path d="M310 196V270" className="gz-border" />
      <text x="170" y="72" textAnchor="middle" className="bi-small bi-strong">Alemanha</text>
      <text x="450" y="72" textAnchor="middle" className="bi-small bi-strong">França</text>
      <g transform="translate(150 190)">
        <path d="M-50 40l20-60h20l20 60Z" className="gz-mine" />
        <path d="M-40 -20h60" className="gz-beam" />
        <path d="M-30 -20v-26h20v26" className="gz-mine-tower" />
        <circle cx="-20" cy="-46" r="7" className="gz-wheel" />
        <path d="M-72 40h100" className="bi-ground" />
        {[[-60, 30], [-50, 26], [-44, 32]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r="5" className="gz-coal" />)}
      </g>
      <text x="150" y="252" textAnchor="middle" className="bi-label">carvão</text>
      <g transform="translate(470 190)">
        <path d="M-26 40V-10l10-20h32l10 20v50Z" className="gz-furnace" />
        <path d="M-6 -30v-24h12v24" className="gz-furnace" />
        <motion.path d="M-12 22c0-14 12-14 12-28 0 14 12 14 12 28Z" className="bi-flame" initial={{ scaleY: 0.4 }} animate={{ scaleY: 1 }} transition={p(0.8, 0.8)} />
        <path d="M-56 40h100" className="bi-ground" />
        <path d="M22 32h26v8h-26Z" className="gz-ingot" />
      </g>
      <text x="470" y="252" textAnchor="middle" className="bi-label">aço</text>
      <path d="M150 230H470" className="gz-rail" />
      {Array.from({ length: 17 }, (_, k) => <path key={k} d={`M${158 + k * 19} 226v8`} className="gz-sleeper" />)}
      <motion.g initial={{ x: 0 }} animate={{ x: 250 }} transition={p(1.6, 0.3)}>
        <path d="M168 224v-16h36v16Z" className="gz-wagon" />
        <circle cx="176" cy="226" r="3.5" className="gz-wheel" /><circle cx="196" cy="226" r="3.5" className="gz-wheel" />
        {[176, 186, 196].map(x => <circle key={x} cx={x} cy="206" r="4" className="gz-coal" />)}
      </motion.g>
      <text x="310" y="102" textAnchor="middle" className="bi-hand">a base material das guerras, interligada</text>
      <text x="310" y="122" textAnchor="middle" className="bi-tiny">interdependência que dificulta novas guerras</text>
      <g transform="translate(310 160)">
        {Array.from({ length: 6 }, (_, k) => <motion.circle key={k} cx={-50 + k * 20} cy="0" r="7" className={k < 2 ? 'gz-member-on' : 'gz-member'} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={p(0.3, 0.4 + k * 0.1)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />)}
        <text x="0" y="24" textAnchor="middle" className="bi-tiny">Alemanha, França e mais 4 fundadores</text>
      </g>
    </g>}

    {active === 1 && <g>
      <g transform="translate(200 170)">
        <path d="M-80 -90h150a10 10 0 0 1 10 10v160a10 10 0 0 1-10 10H-80Z" className="bi-scroll" />
        <path d="M-80 -90a10 10 0 0 0 0 20h10M-80 90a10 10 0 0 1 0-20h10" className="bi-scroll" />
        <text x="0" y="-60" textAnchor="middle" className="bi-date">Maastricht</text>
        <text x="0" y="-42" textAnchor="middle" className="bi-small">1992 · cria a União Europeia</text>
        {[
          { y: -12, t: 'comércio' },
          { y: 28, t: 'política externa' },
          { y: 68, t: 'cooperação em justiça' },
        ].map((c, k) => <motion.g key={c.t} initial={{ opacity: k === 0 ? 1 : 0, x: k === 0 ? 0 : 8 }} animate={{ opacity: 1, x: 0 }} transition={p(0.45, 0.4 + k * 0.35)}>
          <circle cx="-52" cy={c.y - 5} r="10" className={k === 0 ? 'gz-member' : 'bi-seal'} />
          {k > 0 && <path d={`M${-57} ${c.y - 5}l4 4 7-8`} className="gz-check" />}
          <text x="-34" y={c.y} className="bi-small bi-strong">{c.t}</text>
        </motion.g>)}
      </g>
      <text x="200" y="286" textAnchor="middle" className="bi-hand-sm">competências além do comércio</text>
      <text x="446" y="72" textAnchor="middle" className="bi-panel-title">AMPLIAÇÃO POR RODADAS</text>
      {Array.from({ length: 12 }, (_, k) => <motion.circle key={`w${k}`} cx={368 + (k % 3) * 22} cy={104 + Math.floor(k / 3) * 26} r="7" className="gz-member-on"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={p(0.25, 0.2 + k * 0.05)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />)}
      {Array.from({ length: 12 }, (_, k) => <motion.circle key={`e${k}`} cx={482 + (k % 3) * 22} cy={104 + Math.floor(k / 3) * 26} r="7" className="gz-member-east"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={p(0.25, 1 + k * 0.05)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />)}
      <text x="390" y="220" textAnchor="middle" className="bi-small bi-strong">Oeste primeiro</text>
      <text x="504" y="220" textAnchor="middle" className="bi-small bi-strong">Leste depois</text>
      <text x="504" y="236" textAnchor="middle" className="bi-tiny">após a Guerra Fria</text>
      <text x="446" y="270" textAnchor="middle" className="bi-tiny">pontos ilustrativos, não um por país</text>
    </g>}

    {active === 2 && <g>
      <text x="150" y="72" textAnchor="middle" className="bi-panel-title">20 DOS 27 USAM O EURO</text>
      {Array.from({ length: 27 }, (_, k) => {
        const euro = k < 20;
        const x = 70 + (k % 9) * 20; const y = 100 + Math.floor(k / 9) * 24;
        return <motion.g key={k} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={p(0.25, 0.1 + k * 0.03)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
          <circle cx={x} cy={y} r="8" className={euro ? 'gz-coin' : 'gz-member'} />
          {euro && <text x={x} y={y + 3.4} textAnchor="middle" className="gz-coin-text">€</text>}
        </motion.g>;
      })}
      <text x="150" y="182" textAnchor="middle" className="bi-small">sem custo de conversão entre eles</text>
      <text x="150" y="206" textAnchor="middle" className="bi-small">mas nenhum ajusta o câmbio sozinho</text>
      <path d="M300 64V280" className="gz-divider" />
      <text x="456" y="72" textAnchor="middle" className="bi-panel-title">GRÉCIA, 2010</text>
      <g transform="translate(386 160)">
        <path d="M-50 0a50 50 0 0 1 100 0" className="gz-gauge" />
        <text x="0" y="20" textAnchor="middle" className="bi-tiny">câmbio</text>
        <text x="56" y="4" className="bi-tiny">desvaloriza</text>
        <motion.path d="M0 0L0 -40" className="gz-needle" initial={{ rotate: -10 }} animate={{ rotate: [-10, 22, -6, 16, -8] }} transition={p(1.2, 0.2)} style={{ transformOrigin: '0px 0px' }} />
        <circle r="4.5" className="gz-needle-hub" />
        <motion.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={p(0.4, 1.3)}>
          <rect x="-12" y="-66" width="24" height="18" rx="3" className="gz-lock" />
          <path d="M-7 -66v-6a7 7 0 0 1 14 0v6" className="gz-lock-arc" />
        </motion.g>
      </g>
      <text x="386" y="204" textAnchor="middle" className="bi-small bi-strong">não pode desvalorizar</text>
      <text x="386" y="218" textAnchor="middle" className="bi-tiny">a moeda para competir</text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.5, 1.6)}>
        <path d="M522 120h40M522 150h40" className="gz-belt-strap" />
        <path d="M522 120c-10 0-10 30 0 30M562 120c10 0 10 30 0 30" className="gz-belt-strap" />
        <rect x="534" y="126" width="16" height="18" rx="2" className="gz-buckle" />
        <text x="542" y="180" textAnchor="middle" className="bi-small bi-strong">ajuste fiscal</text>
        <text x="542" y="194" textAnchor="middle" className="bi-small bi-strong">interno</text>
        <text x="590" y="240" textAnchor="end" className="bi-hand-sm">a alternativa dolorosa</text>
      </motion.g>
    </g>}

    {active === 3 && <g>
      <text x="160" y="72" textAnchor="middle" className="bi-panel-title">A PARTIR DE 2015: REFUGIADOS</text>
      <text x="36" y="148" className="bi-tiny">refugiados sírios</text>
      {[0, 1, 2].map(k => <motion.path key={k} d={`M36 ${162 + k * 10}H112`} className="gz-flow-line" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={p(0.5, 0.1 + k * 0.1)} />)}
      <motion.path d="M112 172C140 172 146 132 176 130" className="bi-arrow" markerEnd="url(#gz-head-ue)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={p(0.6, 0.6)} />
      <motion.path d="M112 172C140 172 146 222 168 224" className="bi-arrow" markerEnd="url(#gz-head-ue)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={p(0.6, 0.6)} />
      {[206, 234, 262].map(x => <House key={x} x={x} y={138} />)}
      <text x="234" y="160" textAnchor="middle" className="bi-tiny">solidariedade,</text>
      <text x="234" y="173" textAnchor="middle" className="bi-tiny">distribuição partilhada</text>
      <motion.path d="M184 200V246" className="gz-bar" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={p(0.4, 1)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }} />
      {[206, 234, 262].map(x => <House key={x} x={x} y={236} />)}
      <text x="234" y="258" textAnchor="middle" className="bi-tiny">resistem a cotas</text>
      <text x="234" y="271" textAnchor="middle" className="bi-tiny">obrigatórias</text>
      <text x="40" y="226" className="bi-hand-sm">divergências</text>
      <text x="40" y="243" className="bi-hand-sm">entre membros</text>
      <path d="M310 64V280" className="gz-divider" />
      <text x="456" y="72" textAnchor="middle" className="bi-panel-title">2020: BREXIT</text>
      <Ring cx={440} cy={170} r={64} n={27} className="gz-member-on" />
      <text x="440" y="166" textAnchor="middle" className="gz-big">27</text>
      <text x="440" y="184" textAnchor="middle" className="bi-tiny">Estados-membros</text>
      <motion.g initial={{ x: 0, y: 0 }} animate={{ x: 66, y: -18 }} transition={p(1.2, 0.5)}>
        <circle cx="498" cy="126" r="7" className="gz-member-leave" />
      </motion.g>
      <text x="580" y="140" textAnchor="end" className="bi-small bi-strong">Reino Unido</text>
      <text x="440" y="262" textAnchor="middle" className="bi-hand-sm">a primeira saída desde a fundação</text>
    </g>}
  </svg>;
}

export const SCENES_LOTE18: Record<string, React.ComponentType<Scene>> = {
  'summary-geografia-globalizacao-e-processos-economicos-atuais': SmartphoneChain,
  'summary-geografia-geografia-das-redes-mundiais': NetworkMap,
  'summary-geografia-unilateralismo-e-multilateralismo': Multilateral,
  'summary-geografia-uniao-europeia': EuropeanUnion,
};

export const HEADERS_LOTE18: Record<string, string> = {
  'summary-geografia-globalizacao-e-processos-economicos-atuais': 'cadeias globais de valor',
  'summary-geografia-geografia-das-redes-mundiais': 'geografia das redes',
  'summary-geografia-unilateralismo-e-multilateralismo': 'ordem internacional',
  'summary-geografia-uniao-europeia': 'integração europeia',
};
