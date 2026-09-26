import React from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import { BRAZIL } from './GeografiaFisica';
import { ArrowHead, Person, type Scene } from './cenaKit';
import './AmbienteEnergia.css';

function usePaced() {
  const t = useSceneMotion();
  return (duration: number, delay = 0) => (t.duration === 0 ? t : { ...t, duration, delay });
}
type Paced = ReturnType<typeof usePaced>;

// Lote 17 da régua de História e Geografia: ambiente e energia. Estes seis
// capítulos abriam com instrumento genérico — três círculos, caixas num eixo —
// e o de Matriz Energética deixava a estudante arrastar a fatia fóssil de 0 a
// 100%, um número que o resumo não dá. Cada cena agora desenha o mecanismo:
// quem paga e quem ganha com o corte de emissão, a água que a barragem etíope
// segura, o satélite que manda o Ibama, a tomada dentro do tanque, o país que
// troca o nuclear por gás, o rejeito que vira alicerce da barragem. Números só
// os do resumo; o que é desenhado sem medida diz isso no rodapé.

// Mapa do Brasil (contorno BRAZIL em coordenadas reais: y = 76,2 − 7,70·lat;
// x ≈ 616,8 + 7,9·lon) reduzido para caber à esquerda da prancha. O texto fica
// fora do grupo escalado para não encolher abaixo de 9,5 px.
const MAP_S = 0.78;
const MAP_X = 14;
const MAP_Y = 36;
const geo = (lat: number, lon: number) => [616.8 + 7.9 * lon, 76.2 - 7.7 * lat] as const;
const onMap = (lat: number, lon: number) => {
  const [x, y] = geo(lat, lon);
  return [MAP_X + MAP_S * x, MAP_Y + MAP_S * y] as const;
};

// Quatro marcos no canto: dizem em qual recorte a estudante está sem repetir
// o rótulo do botão.
function Steps({ n, active }: { n: number; active: number }) {
  const x0 = 590 - (n - 1) * 22;
  return <g aria-hidden="true">
    <path d={`M${x0} 36H590`} className="ae-steps-line" />
    {Array.from({ length: n }, (_, k) => <circle key={k} cx={x0 + k * 22} cy="36" r={k === active ? 6.5 : 4} className={k === active ? 'ae-step ae-step-on' : k < active ? 'ae-step ae-step-past' : 'ae-step'} />)}
  </g>;
}

function Tree({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0v-9" className="ae-trunk" />
    <path d="M0 -26c-9 0-12 7-9 12-5 2-4 9 2 9h14c6 0 7-7 2-9 3-5 0-12-9-12Z" className="ae-leaf" />
  </g>;
}

function Coin({ x, y, r = 8 }: { x: number; y: number; r?: number }) {
  return <g>
    <circle cx={x} cy={y} r={r} className="ae-coin" />
    <text x={x} y={y + 3.5} textAnchor="middle" className="ae-coin-text">$</text>
  </g>;
}

function Fish({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <path d="M-10 0c5-7 14-7 18 0-4 7-13 7-18 0ZM-10 0l-7-6v12Z" className="ae-fish" />
    <circle cx="4" cy="-1.5" r="1.3" className="ae-fish-eye" />
  </g>;
}

function House({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-10 0v-12l10-8 10 8v12Z" className="ae-house" />
    <path d="M-3 0v-6h6v6" className="ae-house-door" />
  </g>;
}

function Chimney({ x, y, smoke, p, delay = 0 }: { x: number; y: number; smoke: number; p: Paced; delay?: number }) {
  return <g>
    <path d={`M${x - 16} ${y}v-16l10-7v7l10-7v7h4v-20h7v36Z`} className="ae-factory" />
    {[0, 1, 2].map(k => <motion.circle key={k} cx={x + 8 + k * 5} cy={y - 42 - k * 9} r={5 + k * 2} className="ae-smoke" initial={false}
      animate={{ opacity: smoke * (0.8 - k * 0.2), scale: 0.5 + smoke * 0.5 }} transition={p(0.8, delay + k * 0.1)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />)}
  </g>;
}

function CoolingTower({ x, y, s = 1, steam = 1, p, delay = 0 }: { x: number; y: number; s?: number; steam?: number; p: Paced; delay?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-16 0c4-12 4-24-2-36h36c-6 12-6 24-2 36Z" className="ae-tower" />
    <path d="M-14 -30h28" className="ae-tower-line" />
    {[0, 1].map(k => <motion.path key={k} d={`M${-8 + k * 10} -40c-6-6 4-10-2-16`} className="ae-steam" initial={false}
      animate={{ opacity: steam, pathLength: steam ? 1 : 0 }} transition={p(0.8, delay + k * 0.15)} />)}
  </g>;
}

function Turbine({ x, y, s = 1, spin, p }: { x: number; y: number; s?: number; spin: boolean; p: Paced }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 0V-38" className="ae-mast" />
    <g transform="translate(0 -38)">
      {/* O círculo invisível centra a caixa no cubo: sem ele, as três pás
          assimétricas giravam em torno de um ponto 5 px abaixo do eixo. */}
      <motion.g initial={false} animate={{ rotate: spin ? 240 : 0 }} transition={p(2.4)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <circle r="21" className="ae-none" />
        {[0, 120, 240].map(a => <path key={a} d="M0 0c3-5 3-14 0-20-2 6-2 15 0 20Z" className="ae-blade" transform={`rotate(${a})`} />)}
      </motion.g>
    </g>
    <circle cx="0" cy="-38" r="2.5" className="ae-hub" />
  </g>;
}

function Panel({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-14 -4l6-14h22l-6 14Z" className="ae-panel-solar" />
    <path d="M-11 -11h22M-3 -18l-5 14M5 -18l-5 14" className="ae-panel-grid" />
    <path d="M1 -4v6" className="ae-mast-thin" />
  </g>;
}

function Barrel({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-9 -12h18v24h-18Z" className="ae-barrel" />
    <path d="M-9 -4h18M-9 4h18" className="ae-barrel-band" />
  </g>;
}

function Coal({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-12 8l-2-8 7-7 9 1 6 6-2 8Z" className="ae-coal" />
    <path d="M-3 -6l2 6 7 2" className="ae-coal-edge" />
  </g>;
}

function GasFlame({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M0 10c-9 0-11-8-6-14 1 4 3 5 4 5-1-7 3-12 7-15-1 6 6 9 5 16-1 5-4 8-10 8Z" className="ae-gas" />
  </g>;
}

function Dam({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-24 0V-14h10V0Z" className="ae-water-fill" />
    <path d="M-14 0l4-22h6l6 22Z" className="ae-dam" />
    <path d="M2 -2h14" className="ae-water-line" />
  </g>;
}

// Desafios ambientais: quatro recortes, um mecanismo cada. O primeiro espalha
// o mesmo aquecimento em efeitos diferentes; o terceiro é o coração do
// capítulo — o custo sai de um país só e o benefício se reparte por todos.
export function GlobalCommons({ active }: Scene) {
  const p = usePaced();
  const feet = [
    'Efeitos por região: esquema, sem escala nem mapa real.',
    'Cardume e serviços: ilustrativo, sem medida.',
    'Moedas e nuvem: metáfora da assimetria, sem valor medido.',
    'Áreas esquemáticas, sem escala: mostram quem acumulou mais.',
  ];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Desafios ambientais do século XXI: efeitos regionais desiguais, serviços ecológicos perdidos, tragédia dos comuns e responsabilidade histórica; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">DESAFIOS AMBIENTAIS · SÉCULO XXI</text>
    <Steps n={4} active={active} />

    {active === 0 && <motion.g key="efeitos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4)}>
      <circle cx="310" cy="62" r="15" className="ae-sun" />
      <text x="310" y="67" textAnchor="middle" className="ae-sun-text">+°C</text>
      <text x="310" y="96" textAnchor="middle" className="bi-hand-sm">um aquecimento, efeitos diferentes</text>
      {[[84, 146], [210, 168], [372, 164], [504, 150]].map(([x, y], k) => <motion.path key={x} d={`M${310 + (x - 310) * 0.2} 106Q${(x + 310) / 2} 110 ${x} ${y - 20}`} className="ae-spread" markerEnd="url(#ae-head-0)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={p(0.7, 0.2 + k * 0.12)} />)}
      <ArrowHead id="ae-head-0" />

      <path d="M30 262H590" className="ae-ground" />
      <path d="M36 262L84 152L136 262Z" className="ae-mountain" />
      <path d="M70 186L84 152L99 186q-7 5-14 0q-8 5-15 0Z" className="ae-ice" />
      {[0, 1, 2].map(k => <motion.circle key={k} cx={76 + k * 8} cy="196" r="3" className="ae-drop" initial={{ y: 0, opacity: 0 }} animate={{ y: [0, 40, 56], opacity: [0, 1, 0] }} transition={p(1.4, 0.5 + k * 0.25)} />)}
      <text x="86" y="282" textAnchor="middle" className="bi-small">geleiras derretem</text>

      <path d="M136 262h150v8h-150Z" className="ae-sea" />
      <motion.rect x="136" y="246" width="150" height="24" className="ae-sea" initial={{ scaleY: 0.35 }} animate={{ scaleY: 1 }} transition={p(1.4, 0.8)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }} />
      <path d="M210 250q18-12 36 0Z" className="ae-island" />
      <House x={228} y={246} s={0.7} />
      <text x="224" y="282" textAnchor="middle" className="bi-small">mar sobe; ilha baixa</text>

      <circle cx="372" cy="190" r="12" className="ae-sun" />
      {[0, 60, 120, 180, 240, 300].map(a => <path key={a} d="M0 -17v-6" transform={`translate(372 190) rotate(${a})`} className="ae-ray" />)}
      <path d="M318 262h110" className="ae-dry" />
      <motion.path d="M334 262l6-6 5 4 6-7M364 262l5-5 6 3 4-6M394 262l6-6 5 5 6-7" className="ae-crack" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={p(0.9, 0.9)} />
      <text x="372" y="282" textAnchor="middle" className="bi-small">seca aqui</text>

      <path d="M488 176c-12 0-14-14-2-16 2-10 18-12 22-2 10-4 20 4 14 14Z" className="ae-cloud" />
      {[0, 1, 2, 3].map(k => <motion.path key={k} d={`M${492 + k * 9} 184l-3 10`} className="ae-rain" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={p(0.5, 0.6 + k * 0.1)} />)}
      <House x={528} y={256} s={0.8} />
      <motion.rect x="462" y="248" width="120" height="14" rx="3" className="ae-flood" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={p(1.2, 1)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }} />
      <text x="522" y="282" textAnchor="middle" className="bi-small">enchente ali</text>
      <text x="310" y="310" textAnchor="middle" className="bi-small">e mais: ondas de calor, furacões, incêndios florestais</text>
    </motion.g>}

    {active === 1 && <motion.g key="servicos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4)}>
      <rect x="30" y="62" width="270" height="228" rx="14" className="bi-panel" />
      <text x="46" y="86" className="bi-panel-title">ESTOQUE MARINHO</text>
      <path d="M46 110q20-8 40 0t40 0t40 0t40 0t40 0t26 0" className="ae-wave" />
      {[[80, 140], [120, 132], [160, 146], [200, 136], [100, 170], [140, 178], [182, 168], [222, 180]].map(([x, y], k) => <motion.g key={k}
        initial={{ opacity: 1 }} animate={{ opacity: k < 5 ? 0.12 : 1 }} transition={p(0.4, 0.4 + k * 0.1)}>
        <Fish x={x} y={y} s={0.9} flip={k % 2 === 1} />
      </motion.g>)}
      <motion.g initial={{ x: -40 }} animate={{ x: 0 }} transition={p(1.2, 0.2)}>
        <path d="M232 112L284 112L276 190Q258 204 240 190Z" className="ae-net-bag" />
        <path d="M244 112l-4 78M258 112v88M272 112l4 78M234 132h48M236 152h44M238 172h40" className="ae-net" />
        <path d="M258 112V84" className="ae-rope" />
      </motion.g>
      <path d="M60 222H226" className="ae-flow-thick" markerEnd="url(#ae-head-1)" />
      <text x="60" y="242" className="bi-small">retirada: além da reposição</text>
      <path d="M250 262H200" className="ae-flow-thin" markerEnd="url(#ae-head-1)" />
      <text x="60" y="270" className="bi-tiny">reposição natural</text>
      <ArrowHead id="ae-head-1" />

      <rect x="318" y="62" width="272" height="228" rx="14" className="bi-panel" />
      <text x="334" y="86" className="bi-panel-title">SERVIÇOS QUE O ECOSSISTEMA DÁ</text>
      {[
        { x: 370, label: 'polinização', icon: <g><path d="M0 8V-2" className="ae-stem" /><circle cx="0" cy="-6" r="4" className="ae-flower-core" />{[0, 72, 144, 216, 288].map(a => <ellipse key={a} cx="0" cy="-12" rx="3" ry="5" transform={`rotate(${a} 0 -6)`} className="ae-petal" />)}<ellipse cx="14" cy="-16" rx="5" ry="3.5" className="ae-bee" /><path d="M12 -19.5v7M16 -19.5v7" className="ae-bee-band" /></g> },
        { x: 454, label: 'água limpa', icon: <path d="M0 -20c8 12 11 17 11 23a11 11 0 0 1-22 0c0-6 3-11 11-23Z" className="ae-drop-big" /> },
        { x: 538, label: 'clima regional', icon: <g><path d="M-3 -10v18" className="ae-thermo" /><circle cx="-3" cy="10" r="5" className="ae-thermo-bulb" /><path d="M6 -6c-6 0-7-8-1-9 1-5 9-6 11-1 5-2 10 2 7 8Z" className="ae-cloud" /></g> },
      ].map(({ x, label, icon }, k) => <motion.g key={label} initial={{ opacity: 1 }} animate={{ opacity: 0.45 }} transition={p(0.5, 1 + k * 0.15)}>
        <g transform={`translate(${x} 130)`}>{icon}</g>
        <text x={x} y="162" textAnchor="middle" className="bi-small">{label}</text>
      </motion.g>)}
      {[350, 382, 414].map((x, k) => <motion.g key={x} initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={p(0.4, 0.5 + k * 0.12)}><Tree x={x} y={214} /></motion.g>)}
      {[350, 382, 414].map((x, k) => <motion.path key={`s-${x}`} d={`M${x - 5} 214h10v-6h-10Z`} className="ae-stump" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.3, 0.6 + k * 0.12)} />)}
      <text x="382" y="234" textAnchor="middle" className="bi-tiny">habitat destruído</text>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={p(0.4, 1.4)}>
        <Coin x={486} y={202} /><Coin x={506} y={198} /><Coin x={526} y={204} />
        <text x="506" y="234" textAnchor="middle" className="bi-tiny bi-warn">custo real</text>
      </motion.g>
      <text x="454" y="272" textAnchor="middle" className="bi-hand-sm">não é só estética: é comida e dinheiro</text>
    </motion.g>}

    {active === 2 && <motion.g key="comuns" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4)}>
      <path d="M60 106c-22 0-22-28 0-28 4-18 34-22 46-8 10-18 44-18 54 0 12-16 44-16 56 0 12-16 44-16 56 0 12-16 44-16 56 0 12-16 44-16 56 0 12-14 42-12 50 6 20 0 22 30 0 30Z" className="ae-sky" />
      <text x="310" y="100" textAnchor="middle" className="bi-small bi-strong">clima estável: benefício de todos</text>
      {[92, 214, 336, 458, 570].map((x, k) => <g key={x}>
        <path d={`M${x - 34} 250h68`} className="ae-ground" />
        <Chimney x={x - 6} y={250} smoke={k === 0 ? 0.25 : 1} p={p} delay={0.6} />
        <motion.path d={`M${x} 110V${146}`} className="ae-benefit" markerEnd="url(#ae-head-2)" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={p(0.5, 0.9 + k * 0.1)} />
        <text x={x} y="270" textAnchor="middle" className={k === 0 ? 'bi-small bi-strong' : 'bi-small'}>{k === 0 ? 'quem reduz' : 'país'}</text>
      </g>)}
      <ArrowHead id="ae-head-2" />
      {[0, 1, 2].map(k => <motion.g key={k} initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={p(0.5, 0.3 + k * 0.15)}>
        <Coin x={138 + k * 16} y={226} r={7} />
      </motion.g>)}
      <text x="36" y="294" className="bi-small bi-warn">custo: só dele, e já</text>
      {[1, 2].map(k => <motion.text key={k} x={[0, 214, 336][k]} y="286" textAnchor="middle" className="bi-hand-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4, 1.3 + k * 0.15)}>carona</motion.text>)}
      <text x="590" y="304" textAnchor="end" className="bi-tiny">Paris: metas voluntárias, sem sanção coercitiva</text>
    </motion.g>}

    {active === 3 && <motion.g key="historica" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4)}>
      <path d="M60 272H400M60 272V80" className="bi-axis" />
      <text x="60" y="292" className="bi-tiny">Revolução Industrial</text>
      <text x="400" y="292" textAnchor="end" className="bi-tiny">hoje</text>
      <text x="68" y="86" className="bi-tiny">emissões acumuladas</text>
      <motion.path d="M60 272C150 268 230 240 290 190S370 120 400 104V272Z" className="ae-accum-rich" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={p(1.4, 0.2)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }} />
      <motion.path d="M240 272C300 270 350 258 400 236V272Z" className="ae-accum-poor" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={p(1, 1.2)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }} />
      <Factory2 x={120} y={262} />
      <text x="300" y="176" textAnchor="end" className="bi-small bi-strong">desenvolvidos</text>
      <text x="394" y="262" textAnchor="end" className="bi-tiny">em desenvolvimento</text>

      <rect x="420" y="70" width="170" height="220" rx="14" className="bi-panel" />
      <Person x={462} y={104} coat="bi-coat" />
      <text x="490" y="104" className="bi-tiny">desenvolvidos:</text>
      <text x="490" y="118" className="bi-tiny">industrializaram</text>
      <text x="490" y="132" className="bi-tiny">sem restrição</text>
      <Person x={462} y={186} coat="bi-coat-green" />
      <text x="490" y="186" className="bi-tiny">em desenvolvimento:</text>
      <text x="490" y="200" className="bi-tiny">pedem espaço</text>
      <text x="490" y="214" className="bi-tiny">para crescer</text>
      <motion.path d="M462 246v-14" className="ae-benefit" markerEnd="url(#ae-head-3)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={p(0.6, 1.6)} />
      <ArrowHead id="ae-head-3" />
      <text x="505" y="270" textAnchor="middle" className="bi-hand-sm">justiça × urgência</text>
    </motion.g>}

    <text x="30" y="336" className="bi-foot">{feet[active]}</text>
  </svg>;
}

function Factory2({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-16 0v-14l9-6v6l9-6v6h4v-18h6v32Z" className="ae-factory" />
  </g>;
}

// Geopolítica ambiental: o mapa do Brasil com a floresta que absorve carbono e
// a pressão que chega de fora; os dois tratados lado a lado; o rio que corre
// de um soberano para outro; o gelo que recua e abre disputa.
export function EnvironmentalPower({ active }: Scene) {
  const p = usePaced();
  const clip = 'ae-br-clip';
  const [fx, fy] = onMap(-4, -62);
  const feet = [
    'Mapa esquemático; a mancha verde indica a floresta, sem limite exato.',
    'Kyoto 1997 e Paris 2015, como o resumo do capítulo os descreve.',
    'Rio esquemático: a largura do traço indica vazão, sem medida.',
    'Vista polar esquemática, sem escala; o recuo do gelo é ilustrativo.',
  ];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Geopolítica ambiental: Amazônia como sumidouro e alvo de pressão, Kyoto e Paris, a barragem etíope no Nilo e o degelo do Ártico; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">MEIO AMBIENTE COMO PODER</text>
    <Steps n={4} active={active} />

    {active === 0 && <motion.g key="amazonia" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4)}>
      <defs><clipPath id={clip}><path d={BRAZIL} /></clipPath></defs>
      <g transform={`translate(${MAP_X} ${MAP_Y}) scale(${MAP_S})`}>
        <path d={BRAZIL} className="ae-land" />
        <g clipPath={`url(#${clip})`}><path d="M10 20L250 20L262 110L220 170L120 182L10 160Z" className="ae-forest" /></g>
        <path d={BRAZIL} className="ae-outline" />
      </g>
      {[[-2, -66], [-6, -58], [-3, -54], [-8, -64], [-9, -56], [1, -60]].map(([la, lo]) => { const [x, y] = onMap(la, lo); return <Tree key={`${la}${lo}`} x={x} y={y + 8} s={0.62} />; })}
      {[-48, 0, 48].map((dx, k) => <motion.g key={dx} initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} transition={p(0.9, 0.3 + k * 0.2)}>
        <text x={fx + dx} y="76" textAnchor="middle" className="ae-co2">CO₂</text>
        <path d={`M${fx + dx} 82V${fy - 6}`} className="ae-sink" markerEnd="url(#ae-head-4)" />
      </motion.g>)}
      <ArrowHead id="ae-head-4" />
      <text x="96" y="216" textAnchor="middle" className="bi-small bi-strong">sumidouro de carbono</text>
      <text x="96" y="230" textAnchor="middle" className="bi-tiny">o Brasil como guardião</text>

      <rect x="318" y="62" width="272" height="232" rx="14" className="bi-panel" />
      <text x="334" y="86" className="bi-panel-title">A MESMA FLORESTA, DOIS LADOS</text>
      <g transform="translate(360 124)"><circle r="16" className="ae-badge-green" /><path d="M-7 1l5 5 9-11" className="ae-badge-icon" /></g>
      <text x="386" y="120" className="bi-small bi-strong">influência</text>
      <text x="386" y="134" className="bi-tiny">quem protege ganha voz</text>
      <g transform="translate(360 180)"><circle r="16" className="ae-badge-warn" /><path d="M0 -8v10M0 7v1" className="ae-badge-icon" /></g>
      <text x="386" y="176" className="bi-small bi-strong">pressão internacional</text>
      <text x="386" y="190" className="bi-tiny">sobre desmatamento e uso da terra</text>
      <g transform="translate(372 248)">
        <path d="M-26 8h52M-22 8v-26M22 8v-26" className="ae-gate-post" />
        <motion.path d="M-22 -14h44" className="ae-gate-bar" initial={{ rotate: -50 }} animate={{ rotate: 0 }} transition={p(0.8, 0.9)} style={{ transformBox: 'fill-box', transformOrigin: 'left center' }} />
      </g>
      <text x="410" y="240" className="bi-tiny">ameaça de barreira comercial</text>
      <text x="410" y="254" className="bi-tiny">europeia a produtos ligados</text>
      <text x="410" y="268" className="bi-tiny">a desmatamento ilegal</text>
    </motion.g>}

    {active === 1 && <motion.g key="acordos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4)}>
      {[
        { x: 30, year: 'KYOTO · 1997', a: 'metas obrigatórias', b: 'só para desenvolvidos', lit: [0, 1] },
        { x: 318, year: 'PARIS · 2015', a: 'metas voluntárias (NDCs)', b: 'para todos; sem sanção', lit: [0, 1, 2, 3, 4, 5] },
      ].map(({ x, year, a, b, lit }, side) => <g key={year}>
        <rect x={x} y="62" width="272" height="232" rx="14" className="bi-panel" />
        <text x={x + 16} y="86" className="bi-panel-title">{year}</text>
        <g transform={`translate(${x + 44} 132)`}>
          <path d="M-22 -28h40a4 4 0 0 1 4 4v48h-40a4 4 0 0 1-4-4Z" className="bi-scroll" />
          <path d="M-14 -16h26M-14 -8h26M-14 0h18M-14 8h24" className="bi-scroll-line" />
          {side === 0 ? <motion.g initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={p(0.5, 0.5)}>
            <path d="M8 16a6 6 0 0 1 12 0" className="ae-lock-arc" /><rect x="5" y="16" width="18" height="13" rx="2" className="ae-lock" />
          </motion.g> : <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={p(0.5, 0.5)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
            <circle cx="16" cy="22" r="9" className="ae-seal-open" /><path d="M12 22h8" className="ae-badge-icon" />
          </motion.g>}
        </g>
        <text x={x + 86} y="120" className="bi-small bi-strong">{a}</text>
        <text x={x + 86} y="136" className="bi-small">{b}</text>
        {[0, 1, 2, 3, 4, 5].map(k => <motion.g key={k} initial={{ opacity: 0.25 }} animate={{ opacity: lit.includes(k) ? 1 : 0.25 }} transition={p(0.4, 0.8 + k * 0.12)}>
          <Person x={x + 38 + k * 40} y={206} s={0.8} coat={k < 2 ? 'bi-coat' : 'bi-coat-green'} />
        </motion.g>)}
        <text x={x + 58} y="252" textAnchor="middle" className="bi-tiny">desenvolvidos</text>
        <text x={x + 178} y="252" textAnchor="middle" className="bi-tiny">em desenvolvimento</text>
        <text x={x + 16} y="278" className="bi-small">{side === 0 ? 'EUA nunca ratificaram' : 'EUA: saída e reingresso'}</text>
      </g>)}
      <g transform="translate(410 166)">
        <path d="M0 -12v18" className="ae-thermo-thin" /><circle cx="0" cy="8" r="4.5" className="ae-thermo-bulb" />
      </g>
      <text x="422" y="166" className="bi-tiny">bem abaixo de 2 °C;</text>
      <text x="422" y="179" className="bi-tiny">de preferência 1,5 °C</text>
      <motion.text x="310" y="316" textAnchor="middle" className="bi-hand-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4, 1.6)}>mais países, menos obrigação</motion.text>
    </motion.g>}

    {active === 2 && <motion.g key="nilo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4)}>
      <path d="M40 70q30-8 60 0t60 0t60 0" className="ae-wave" />
      <text x="40" y="92" className="bi-tiny">Mediterrâneo</text>
      <path d="M470 258C520 272 548 290 572 300" className="ae-river" strokeWidth="12" />
      <motion.path d="M470 258C420 240 390 214 340 196C290 178 250 170 210 140C176 114 150 100 124 84" className="ae-river" initial={{ strokeWidth: 12 }} animate={{ strokeWidth: 5 }} transition={p(1.4, 0.6)} />
      <g transform="translate(476 258) rotate(20)"><path d="M-4 -18h10v36h-10Z" className="ae-dam" /></g>
      <text x="460" y="284" textAnchor="end" className="bi-small bi-strong">Grande Barragem</text>
      <text x="460" y="298" textAnchor="end" className="bi-tiny">do Renascimento (Etiópia)</text>
      <text x="590" y="326" textAnchor="end" className="bi-small">Etiópia · montante</text>
      <text x="330" y="226" textAnchor="middle" className="bi-small">Sudão</text>
      <text x="40" y="178" className="bi-small bi-strong">Egito · jusante</text>
      {[[108, 106], [138, 124], [168, 144]].map(([x, y], k) => <motion.rect key={x} x={x} y={y} width="20" height="10" rx="2" className="ae-field" initial={{ opacity: 1 }} animate={{ opacity: 0.4 }} transition={p(0.6, 1.2 + k * 0.15)} />)}
      <text x="40" y="196" className="bi-tiny">lavoura e abastecimento</text>
      <text x="40" y="208" className="bi-tiny">dependem quase só do rio</text>
      <rect x="318" y="62" width="272" height="94" rx="14" className="bi-panel" />
      <text x="334" y="86" className="bi-panel-title">LEGAL, E AINDA ASSIM TENSO</text>
      <text x="334" y="108" className="bi-small">obra no território soberano</text>
      <text x="334" y="124" className="bi-small">da Etiópia; a vazão que chega</text>
      <text x="334" y="140" className="bi-small">ao Egito diminui</text>
      <text x="40" y="270" className="bi-tiny">também disputado:</text>
      <text x="40" y="284" className="bi-small">Tigre-Eufrates</text>
    </motion.g>}

    {active === 3 && <motion.g key="artico" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4)}>
      <circle cx="440" cy="186" r="118" className="ae-ocean" />
      <path d="M340 122c30-50 70-66 100-66M540 122c-30-50-70-66-100-66" className="ae-coast" />
      <path d="M332 146c-12 30-12 60 0 84M548 146c12 30 12 60 0 84" className="ae-coast" />
      <path d="M340 250c30 50 70 66 100 66M540 250c-30 50-70 66-100 66" className="ae-coast" />
      <motion.path d="M440 120c30 0 60 20 62 60 4 40-26 70-62 68-40 2-66-28-64-66 0-40 30-62 64-62Z" className="ae-ice" initial={{ scale: 1.25 }} animate={{ scale: 0.72 }} transition={p(1.6, 0.3)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
      <motion.path d="M352 172C362 110 420 88 470 96S548 136 530 190" className="ae-route" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={p(1.2, 1.4)} />
      {[[364, 216], [520, 226]].map(([x, y], k) => <motion.g key={x} initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={p(0.4, 1.9 + k * 0.2)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        {k === 0 ? <Barrel x={x} y={y} s={0.7} /> : <path d={`M${x - 8} ${y + 6}l4-12h8l4 12Z M${x - 4} ${y - 6}l4-6 4 6`} className="ae-mineral" />}
      </motion.g>)}
      <text x="440" y="190" textAnchor="middle" className="bi-small bi-strong">gelo recua</text>
      <text x="440" y="124" textAnchor="middle" className="bi-tiny">nova rota</text>
      <text x="30" y="100" className="bi-small bi-strong">Quem disputa a soberania</text>
      {['Rússia', 'Estados Unidos', 'Canadá', 'países nórdicos'].map((n, k) => <g key={n}>
        <circle cx="38" cy={124 + k * 22} r="4" className="bi-dot" />
        <text x="50" y={128 + k * 22} className="bi-small">{n}</text>
      </g>)}
      <text x="30" y="236" className="bi-small">aquecimento global →</text>
      <text x="30" y="252" className="bi-small">degelo acelerado →</text>
      <text x="30" y="268" className="bi-small">rotas e reservas acessíveis</text>
      <text x="30" y="300" className="bi-hand-sm">não é só ambiental</text>
    </motion.g>}

    <text x="30" y="336" className="bi-foot">{feet[active]}</text>
  </svg>;
}

// Políticas ambientais: o mesmo imóvel rural, visto de cima, nos quatro
// recortes. APP é lugar, Reserva Legal é proporção, o satélite acha a clareira
// e o Ibama vai até ela — e a curva do último recorte oscila com a lei parada.
const PLOT = { x: 34, y: 60, w: 256, h: 236 };
export function EnvironmentalLaw({ active }: Scene) {
  const p = usePaced();
  const river = `M${PLOT.x} 150C90 140 120 196 170 206S250 240 ${PLOT.x + PLOT.w} 250`;
  const rl = [0.8, 0.35, 0.2];
  const feet = [
    'Imóvel ilustrativo, visto de cima; sem escala.',
    'Quadrados proporcionais aos percentuais do Código Florestal.',
    'Esquema do fluxo de monitoramento; posições ilustrativas.',
    'Curva esquemática: mostra oscilação entre governos, sem valores.',
  ];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Políticas ambientais brasileiras: APP, Reserva Legal por bioma, Prodes e Deter orientando o Ibama, e lei robusta com fiscalização limitada; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">POLÍTICA AMBIENTAL BRASILEIRA</text>
    <Steps n={4} active={active} />

    <defs><clipPath id="ae-plot-clip"><rect x={PLOT.x} y={PLOT.y} width={PLOT.w} height={PLOT.h} rx="10" /></clipPath></defs>
    <rect x={PLOT.x} y={PLOT.y} width={PLOT.w} height={PLOT.h} rx="10" className="ae-plot" />
    <g clipPath="url(#ae-plot-clip)">
      {[0, 1, 2, 3, 4, 5, 6, 7].map(k => <Tree key={k} x={62 + (k % 4) * 30} y={94 + Math.floor(k / 4) * 28} s={0.6} />)}
      {[0, 1, 2, 3].map(k => <path key={k} d={`M${60 + k * 24} 262h16M${66 + k * 24} 276h16`} className="ae-pasture" />)}
      <ellipse cx="232" cy="106" rx="30" ry="22" className="ae-contour" />
      <ellipse cx="232" cy="106" rx="16" ry="10" className="ae-contour" />
      <motion.path d={river} className="ae-app" initial={false} animate={{ opacity: active === 0 ? 1 : 0.35, pathLength: active === 0 ? [0, 1] : 1 }} transition={p(1, 0.2)} />
      <motion.ellipse cx="232" cy="106" rx="36" ry="28" className="ae-app-fill" initial={false} animate={{ opacity: active === 0 ? 1 : 0.35 }} transition={p(0.6, 0.8)} />
      <path d={river} className="ae-river" strokeWidth="6" />
    </g>
    <path d="M150 296v-30h40v30" className="ae-fence" />
    <text x="170" y="286" textAnchor="middle" className="bi-tiny">sede</text>

    {active === 0 && <motion.g key="app" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4)}>
      <text x="232" y="148" textAnchor="middle" className="bi-small bi-strong">topo de morro</text>
      <text x="92" y="186" textAnchor="middle" className="bi-small bi-strong">margem de rio</text>
      <rect x="318" y="62" width="272" height="170" rx="14" className="bi-panel" />
      <text x="334" y="86" className="bi-panel-title">APP · O LUGAR DEFINE</text>
      <text x="334" y="110" className="bi-small">vegetação nativa mantida onde</text>
      <text x="334" y="126" className="bi-small">ela protege a água e as encostas</text>
      <g transform="translate(350 170)"><path d="M0 -14c6 9 8 13 8 17a8 8 0 0 1-16 0c0-4 2-8 8-17Z" className="ae-drop-big" /></g>
      <text x="366" y="174" className="bi-tiny">margens: proteção hídrica</text>
      <g transform="translate(350 204)"><path d="M-10 8l10-16 10 16Z" className="ae-mountain" /></g>
      <text x="366" y="208" className="bi-tiny">topos: proteção de encostas</text>
    </motion.g>}

    {active === 1 && <motion.g key="rl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4)}>
      <motion.rect x={PLOT.x + 6} y={PLOT.y + 6} width={PLOT.w - 12} height={(PLOT.h - 12) * 0.8} rx="6" className="ae-rl" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={p(1, 0.2)} style={{ transformBox: 'fill-box', transformOrigin: 'top' }} />
      <text x="162" y="236" textAnchor="middle" className="ae-rl-text">80% · Reserva Legal</text>
      <rect x="318" y="62" width="272" height="196" rx="14" className="bi-panel" />
      <text x="334" y="86" className="bi-panel-title">RESERVA LEGAL · QUANTO</text>
      {[['Amazônia', 'Legal'], ['Cerrado', 'na região'], ['demais', 'biomas']].map(([b, b2], k) => { const x = 346 + k * 84; return <g key={b}>
        <rect x={x} y="102" width="60" height="60" rx="4" className="ae-rl-box" />
        <motion.rect x={x} y="102" width="60" height={60 * rl[k]} rx="4" className="ae-rl" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={p(0.7, 0.5 + k * 0.2)} style={{ transformBox: 'fill-box', transformOrigin: 'top' }} />
        <text x={x + 30} y="182" textAnchor="middle" className="bi-label">{Math.round(rl[k] * 100)}%</text>
        <text x={x + 30} y="198" textAnchor="middle" className="bi-tiny">{b}</text>
        <text x={x + 30} y="210" textAnchor="middle" className="bi-tiny">{b2}</text>
      </g>; })}
      <text x="334" y="240" className="bi-tiny">percentual do imóvel, em qualquer parte dele</text>
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={p(0.5, 1.4)}>
        <Coin x={332} y={280} />
        <text x="346" y="278" className="bi-tiny">preservar além do exigido:</text>
        <text x="346" y="292" className="bi-tiny">pagamento por serviços ambientais</text>
      </motion.g>
    </motion.g>}

    {active === 2 && <motion.g key="satelite" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4)}>
      <motion.path d="M92 124l18-6 10 14-18 8Z" className="ae-clearing" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={p(0.5, 0.3)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
      <g transform="translate(310 92)">
        <rect x="-8" y="-8" width="16" height="16" rx="2" className="ae-sat" />
        <path d="M-30 -5h20v10h-20ZM10 -5h20v10H10Z" className="ae-panel-solar" />
      </g>
      <motion.path d="M310 100L104 128L316 102Z" className="ae-beam" initial={{ opacity: 0 }} animate={{ opacity: [0, 0.8, 0.5] }} transition={p(0.9, 0.6)} />
      <motion.circle cx="106" cy="128" r="8" className="ae-ping" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: [0.4, 2.2, 1.3], opacity: [0, 1, 0.9] }} transition={p(0.9, 1.3)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
      <text x="356" y="88" className="bi-small bi-strong">Inpe</text>
      <text x="356" y="102" className="bi-tiny">monitora por satélite</text>
      <rect x="318" y="126" width="272" height="104" rx="14" className="bi-panel" />
      <text x="334" y="150" className="bi-small bi-strong">Deter</text>
      <text x="382" y="150" className="bi-tiny">alerta quase em tempo real</text>
      <text x="334" y="176" className="bi-small bi-strong">Prodes</text>
      <text x="388" y="176" className="bi-tiny">desmatamento anual consolidado</text>
      <text x="334" y="206" className="bi-hand-sm">o alerta diz aonde ir</text>
      <g transform="translate(560 272)">
        <path d="M-20 4v-12h22l8 8v4Z" className="ae-truck" />
        <circle cx="-12" cy="6" r="4" className="ae-wheel" /><circle cx="4" cy="6" r="4" className="ae-wheel" />
      </g>
      <text x="530" y="298" textAnchor="end" className="bi-small bi-strong">Ibama</text>
      <motion.path d="M536 266Q300 300 120 136" className="ae-route" markerEnd="url(#ae-head-5)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={p(1.2, 1.8)} />
      <ArrowHead id="ae-head-5" />
    </motion.g>}

    {active === 3 && <motion.g key="tensao" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4)}>
      {[[140, 250], [250, 76], [262, 206]].map(([x, y], k) => <motion.path key={x} d={`M${x - 12} ${y}l10-7 14 3 2 10-16 4Z`} className="ae-clearing" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={p(0.5, 0.3 + k * 0.2)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />)}
      <Person x={96} y={214} s={0.8} coat="bi-coat-army" />
      <text x="96" y="252" textAnchor="middle" className="bi-tiny">poucos fiscais</text>
      <rect x="318" y="62" width="272" height="232" rx="14" className="bi-panel" />
      <text x="334" y="86" className="bi-panel-title">A LEI FICA; O RESULTADO OSCILA</text>
      <g transform="translate(346 112)"><path d="M-10 -10h20v22h-20Z" className="bi-scroll" /><path d="M-6 -4h12M-6 1h12M-6 6h8" className="bi-scroll-line" /></g>
      <path d="M364 112H574" className="ae-law-line" />
      <text x="370" y="104" className="bi-tiny">arcabouço legal: o mesmo</text>
      <path d="M340 240H574M340 240V140" className="bi-axis" />
      <motion.path d="M342 214C368 214 378 160 404 162S436 222 462 224S494 150 520 156S552 206 572 200" className="ae-oscill" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={p(1.6, 0.4)} />
      <text x="346" y="154" className="bi-tiny">desmatamento</text>
      <text x="574" y="256" textAnchor="end" className="bi-tiny">períodos de governo</text>
      <text x="334" y="280" className="bi-hand-sm">sem vontade política, a lei não basta</text>
    </motion.g>}

    <text x="30" y="336" className="bi-foot">{feet[active]}</text>
  </svg>;
}

// Matriz energética: sem cursor. O instrumento antigo deixava arrastar a
// fatia fóssil de 0 a 100%; o resumo só diz "mais de 80%" para o mundo e não
// dá número para o Brasil, então a cena marca o limiar citado e nada mais.
export function EnergyMatrix({ active }: Scene) {
  const p = usePaced();
  const feet = [
    'Conjuntos esquemáticos: o tamanho dos círculos não mede participação.',
    'A barra marca só o limiar do resumo: mais de 80%.',
    'Curvas ilustrativas de um dia, sem valores.',
    'Balança como metáfora: indica peso relativo, sem medida.',
  ];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Matriz energética: a elétrica dentro da energética, mais de 80% fóssil no mundo, fontes intermitentes e despacháveis, e a transição que muda o poder; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">MATRIZ ENERGÉTICA</text>
    <Steps n={4} active={active} />

    {active === 0 && <motion.g key="conjuntos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4)}>
      <ellipse cx="200" cy="186" rx="170" ry="122" className="ae-set-big" />
      <text x="200" y="88" textAnchor="middle" className="bi-label">matriz energética</text>
      <text x="200" y="104" textAnchor="middle" className="bi-tiny">todos os usos de energia</text>
      <motion.circle cx="262" cy="206" r="58" className="ae-set-small" initial={{ scale: 0.2 }} animate={{ scale: 1 }} transition={p(0.9, 0.3)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
      <text x="262" y="174" textAnchor="middle" className="bi-small bi-strong">matriz elétrica</text>
      <Dam x={250} y={214} s={0.9} />
      <Turbine x={286} y={232} s={0.7} spin p={p} />
      <text x="262" y="250" textAnchor="middle" className="bi-tiny">só eletricidade</text>
      {[
        { x: 100, y: 146, label: 'transporte', icon: <g><path d="M-16 4v-8l6-7h16l6 7h4v8Z" className="ae-car" /><circle cx="-9" cy="5" r="4" className="ae-wheel" /><circle cx="9" cy="5" r="4" className="ae-wheel" /></g> },
        { x: 100, y: 214, label: 'indústria', icon: <path d="M-14 8v-12l8-5v5l8-5v5h4v-12h5v24Z" className="ae-factory" /> },
        { x: 170, y: 270, label: 'aquecimento', icon: <GasFlame x={0} y={0} s={0.9} /> },
      ].map(({ x, y, label, icon }) => <g key={label}>
        <g transform={`translate(${x} ${y})`}>{icon}</g>
        <text x={x} y={y + 26} textAnchor="middle" className="bi-tiny">{label}</text>
      </g>)}

      <rect x="394" y="62" width="196" height="232" rx="14" className="bi-panel" />
      <text x="410" y="86" className="bi-panel-title">BRASIL</text>
      <circle cx="418" cy="112" r="6" className="ae-dot-green" />
      <text x="430" y="110" className="bi-small bi-strong">elétrica:</text>
      <text x="430" y="125" className="bi-tiny">majoritariamente renovável</text>
      <circle cx="418" cy="156" r="6" className="ae-dot-fossil" />
      <text x="430" y="154" className="bi-small bi-strong">transporte:</text>
      <text x="430" y="169" className="bi-tiny">gasolina e diesel, com</text>
      <text x="430" y="183" className="bi-tiny">etanol e biodiesel na mistura</text>
      <g transform="translate(446 234)">
        <path d="M-12 14v-30h18v30ZM-8 -12h10v8h-10Z" className="ae-pump" />
        <path d="M6 -6h6v16a4 4 0 0 0 8 0v-12" className="ae-hose" />
      </g>
      <g transform="translate(530 234)">
        <path d="M-10 -8h20v10a10 10 0 0 1-20 0Z" className="ae-plug" /><path d="M-5 -8v-9M5 -8v-9M0 12v8" className="ae-plug-pin" />
      </g>
      <text x="492" y="276" textAnchor="middle" className="bi-hand-sm">tomada ≠ tanque</text>
    </motion.g>}

    {active === 1 && <motion.g key="mundo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4)}>
      <text x="30" y="76" className="bi-small bi-strong">Consumo mundial de energia</text>
      <rect x="30" y="86" width="560" height="30" rx="8" className="ae-bar-bg" />
      <motion.rect x="30" y="86" width={560 * 0.8} height="30" rx="8" className="ae-bar-fossil" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={p(1.1, 0.2)} style={{ transformBox: 'fill-box', transformOrigin: 'left' }} />
      <path d={`M${30 + 560 * 0.8} 80v42`} className="ae-threshold" />
      <text x={30 + 560 * 0.8 - 8} y="106" textAnchor="end" className="ae-bar-text">fósseis: mais de 80%</text>
      <text x={30 + 560 * 0.8 + 8} y="134" className="bi-tiny">80%</text>
      {[
        { y: 176, label: 'petróleo', icon: <Barrel x={0} y={0} s={0.9} />, uses: ['transportes'] },
        { y: 226, label: 'carvão', icon: <Coal x={0} y={0} />, uses: ['geração elétrica', 'siderurgia'] },
        { y: 276, label: 'gás natural', icon: <GasFlame x={0} y={0} />, uses: ['geração elétrica', 'aquecimento', 'petroquímica'] },
      ].map(({ y, label, icon, uses }, k) => <g key={label}>
        <g transform={`translate(64 ${y})`}>{icon}</g>
        <text x="90" y={y + 4} className="bi-small bi-strong">{label}</text>
        {uses.map((u, j) => <motion.g key={u} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={p(0.5, 0.9 + k * 0.35 + j * 0.12)}>
          {j === 0 && <path d={`M172 ${y}H258`} className="ae-link" markerEnd="url(#ae-head-6)" />}
          <rect x={266 + j * 106} y={y - 13} width="98" height="24" rx="12" className="ae-use" />
          <text x={315 + j * 106} y={y + 3} textAnchor="middle" className="bi-tiny">{u}</text>
        </motion.g>)}
      </g>)}
      <ArrowHead id="ae-head-6" />
    </motion.g>}

    {active === 2 && <motion.g key="despacho" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4)}>
      <rect x="30" y="62" width="380" height="232" rx="14" className="bi-panel" />
      <text x="46" y="86" className="bi-panel-title">UM DIA NA REDE</text>
      <path d="M60 256H396M60 256V104" className="bi-axis" />
      <path d="M60 150H396" className="ae-demand" />
      <text x="392" y="144" textAnchor="end" className="bi-tiny">demanda</text>
      <motion.path d="M60 150H190C130 150 118 256 60 256Z" className="ae-fill-gap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.8, 1.2)} />
      <motion.path d="M190 150H396V256H320C260 256 250 150 190 150Z" className="ae-fill-gap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.8, 1.2)} />
      <motion.path d="M60 256C118 256 130 150 190 150C250 150 260 256 320 256H396" className="ae-intermit" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={p(1.1, 0.1)} />
      <text x="190" y="138" textAnchor="middle" className="bi-tiny">sol e vento</text>
      <text x="344" y="200" textAnchor="middle" className="bi-small bi-strong">despachável</text>
      <text x="344" y="214" textAnchor="middle" className="bi-tiny">acionada</text>
      <text x="344" y="226" textAnchor="middle" className="bi-tiny">sob demanda</text>
      <text x="60" y="276" className="bi-tiny">manhã</text>
      <text x="396" y="276" textAnchor="end" className="bi-tiny">noite</text>

      <rect x="426" y="62" width="164" height="232" rx="14" className="bi-panel" />
      <text x="442" y="86" className="bi-panel-title">INTERMITENTES</text>
      <circle cx="458" cy="116" r="11" className="ae-sun" />
      <Turbine x={500} y={132} s={0.8} spin p={p} />
      <text x="530" y="120" className="bi-tiny">eólica,</text>
      <text x="530" y="132" className="bi-tiny">solar</text>
      <text x="442" y="164" className="bi-panel-title">DESPACHÁVEIS</text>
      <Dam x={466} y={200} />
      <path d="M512 200c0-10 6-16 12-20 0 8 8 10 6 20Z" className="ae-leaf" />
      <text x="442" y="222" className="bi-tiny">hidráulica com reservatório,</text>
      <text x="442" y="234" className="bi-tiny">biomassa</text>
      <text x="442" y="262" className="bi-tiny">nuclear: baixa emissão,</text>
      <text x="442" y="274" className="bi-tiny">mas urânio é finito</text>
    </motion.g>}

    {active === 3 && <motion.g key="poder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4)}>
      <path d="M310 250v-150M280 250h60" className="ae-scale-post" />
      <motion.g initial={{ rotate: 0 }} animate={{ rotate: 12 }} transition={p(1.4, 0.4)} style={{ transformBox: 'view-box', transformOrigin: '310px 100px' }}>
        <path d="M150 100H470" className="ae-scale-beam" />
        <path d="M150 100l-40 70h80ZM470 100l-40 70h80Z" className="ae-scale-string" />
        <path d="M104 170h92q-6 16-46 16t-46-16ZM424 170h92q-6 16-46 16t-46-16Z" className="ae-scale-pan" />
        <Barrel x={132} y={156} s={0.8} /><GasFlame x={166} y={158} s={0.8} />
        {[[448, 'Li'], [474, 'Co'], [500, 'Ni']].map(([x, sym]) => <g key={sym as string}>
          <path d={`M${x as number - 10} 166l4-18h12l4 18Z`} className="ae-mineral" />
          <text x={x as number} y="162" textAnchor="middle" className="ae-sym">{sym}</text>
        </g>)}
      </motion.g>
      <text x="100" y="214" className="bi-small bi-strong">petróleo e gás</text>
      <text x="100" y="230" className="bi-tiny">perdem influência relativa</text>
      <text x="400" y="266" className="bi-small bi-strong">minerais críticos</text>
      <text x="400" y="282" className="bi-tiny">lítio, cobalto, níquel, terras-raras</text>
      <text x="30" y="276" className="bi-tiny">obstáculos: a intermitência pede armazenamento;</text>
      <text x="30" y="290" className="bi-tiny">usinas fósseis ainda não amortizadas resistem</text>
      <text x="590" y="84" textAnchor="end" className="bi-hand-sm">como o petróleo no século XX</text>
    </motion.g>}

    <text x="30" y="336" className="bi-foot">{feet[active]}</text>
  </svg>;
}

// Energia elétrica no mundo: a barra mundial fica no alto nos quatro recortes
// como régua; embaixo, cada país mostra por que se afasta dela.
const WORLD = [
  { key: 'coal', w: 34, cls: 'ae-seg-coal', label: 'carvão' },
  { key: 'gas', w: 26, cls: 'ae-seg-gas', label: 'gás e petróleo' },
  { key: 'hydro', w: 15, cls: 'ae-seg-hydro', label: 'hidro' },
  { key: 'nuclear', w: 9.5, cls: 'ae-seg-nuclear', label: 'nuclear' },
  { key: 'renew', w: 13.5, cls: 'ae-seg-renew', label: 'eólica etc.' },
];
const WORLD_TOTAL = WORLD.reduce((s, x) => s + x.w, 0);
export function WorldElectricity({ active }: Scene) {
  const p = usePaced();
  let acc = 30;
  const segs = WORLD.map(s => { const w = (s.w / WORLD_TOTAL) * 560; const seg = { ...s, x: acc, px: w }; acc += w; return seg; });
  const feet = [
    'Larguras aproximadas: o resumo dá valores "cerca de".',
    'Barra da França marca só o limiar citado: mais de 60%.',
    'Sequência esquemática da decisão alemã, sem escala.',
    'Crescimento ilustrativo: as duas fileiras sobem juntas, sem medida.',
  ];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Energia elétrica no mundo: geração mundial por fonte, França nuclear, Alemanha após Fukushima e China expandindo renováveis e carvão; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">ELETRICIDADE NO MUNDO</text>
    <Steps n={4} active={active} />
    <text x="30" y="64" className="bi-tiny">geração mundial</text>
    {segs.map((s, k) => <g key={s.key}>
      <motion.rect x={s.x} y="70" width={s.px} className={s.cls} initial={false}
        animate={{ height: active === 0 ? 28 : 18 }} transition={p(0.5, active === 0 ? k * 0.12 : 0)} />
      <motion.text x={s.x + s.px / 2} textAnchor="middle" className="ae-seg-text" initial={false} animate={{ y: active === 0 ? 88 : 83 }} transition={p(0.5)}>{s.label}</motion.text>
    </g>)}
    {active === 0 && <path d={`M${segs[0].x} 104h${segs[0].px + segs[1].px}`} className="ae-bracket" />}

    {active === 0 && <motion.g key="fontes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4)}>
      <text x={segs[0].x + (segs[0].px + segs[1].px) / 2} y="122" textAnchor="middle" className="bi-small bi-strong">fósseis: cerca de 60%</text>
      {[
        { x: 110, icon: <Chimney x={0} y={0} smoke={1} p={p} delay={0.4} />, a: 'carvão', b: 'mais de 1/3', c: 'China e Índia' },
        { x: 234, icon: <Dam x={6} y={0} s={1.2} />, a: 'hidrelétricas', b: 'cerca de 15%', c: 'Brasil, Canadá, Noruega' },
        { x: 368, icon: <CoolingTower x={0} y={0} p={p} delay={0.6} />, a: 'nuclear', b: '9% a 10%', c: 'EUA, França, China' },
        { x: 502, icon: <g><Turbine x={-12} y={0} spin p={p} /><Panel x={14} y={0} /></g>, a: 'eólica, solar, biomassa', b: '12% a 15%', c: 'base pequena, crescendo' },
      ].map(({ x, icon, a, b, c }, k) => <motion.g key={a} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={p(0.5, 0.4 + k * 0.15)}>
        <g transform={`translate(${x} 210)`}>{icon}</g>
        <text x={x} y="238" textAnchor="middle" className="bi-small bi-strong">{a}</text>
        <text x={x} y="254" textAnchor="middle" className="bi-small">{b}</text>
        <text x={x} y="270" textAnchor="middle" className="bi-tiny">{c}</text>
      </motion.g>)}
      <text x="310" y="304" textAnchor="middle" className="bi-hand-sm">o Brasil, com hidrelétricas, é exceção</text>
    </motion.g>}

    {active === 1 && <motion.g key="franca" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4)}>
      <rect x="30" y="102" width="560" height="192" rx="14" className="bi-panel" />
      <text x="46" y="126" className="bi-panel-title">FRANÇA</text>
      {[80, 130, 180].map((x, k) => <CoolingTower key={x} x={x} y={220} s={1.2} p={p} delay={0.3 + k * 0.2} />)}
      <path d="M50 220h170" className="ae-ground" />
      <rect x="250" y="146" width="320" height="24" rx="6" className="ae-bar-bg" />
      <motion.rect x="250" y="146" width={320 * 0.6} height="24" rx="6" className="ae-seg-nuclear" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={p(1, 0.3)} style={{ transformBox: 'fill-box', transformOrigin: 'left' }} />
      <path d={`M${250 + 320 * 0.6} 140v36`} className="ae-threshold" />
      <text x="250" y="140" className="bi-small bi-strong">nuclear: mais de 60% da eletricidade</text>
      <text x={250 + 320 * 0.6 + 6} y="188" className="bi-tiny">60%</text>
      <text x="250" y="210" className="bi-small">a maior proporção do mundo</text>
      <path d="M250 250H410" className="ae-base-line" />
      <motion.path d="M420 250c10-18 20-18 30 0s20 18 30 0 20-18 30 0 20 18 30 0 20-18 30 0" className="ae-intermit" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={p(1, 0.8)} />
      <text x="250" y="272" className="bi-tiny">base constante</text>
      <text x="420" y="272" className="bi-tiny">sol e vento variam</text>
      <text x="46" y="272" className="bi-tiny">baixíssima emissão na geração</text>
    </motion.g>}

    {active === 2 && <motion.g key="alemanha" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4)}>
      <rect x="30" y="102" width="160" height="192" rx="14" className="bi-panel" />
      <text x="46" y="126" className="bi-panel-title">DOIS ACIDENTES</text>
      <text x="46" y="152" className="bi-small bi-strong">Chernobyl · 1986</text>
      <text x="46" y="167" className="bi-tiny">falha de projeto e</text>
      <text x="46" y="180" className="bi-tiny">de operação humana</text>
      <text x="46" y="210" className="bi-small bi-strong">Fukushima · 2011</text>
      <text x="46" y="225" className="bi-tiny">tsunami danifica o</text>
      <text x="46" y="238" className="bi-tiny">resfriamento do reator</text>
      <motion.path d="M150 256h56" className="ae-link" markerEnd="url(#ae-head-7)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={p(0.5, 0.3)} />
      <ArrowHead id="ae-head-7" />
      <rect x="214" y="102" width="376" height="192" rx="14" className="bi-panel" />
      <text x="230" y="126" className="bi-panel-title">ALEMANHA · ENERGIEWENDE</text>
      {[256, 300].map((x, k) => <motion.g key={x} initial={{ opacity: 1 }} animate={{ opacity: 0.3 }} transition={p(0.6, 0.8 + k * 0.1)}>
        <CoolingTower x={x} y={210} p={p} steam={0} delay={0.6} />
      </motion.g>)}
      <motion.path d="M236 164l84 56M320 164l-84 56" className="bi-cross" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={p(0.6, 1)} />
      <text x="278" y="238" textAnchor="middle" className="bi-tiny">nuclear desativada</text>
      {[370, 404, 438].map((x, k) => <motion.g key={x} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={p(0.6, 1.3 + k * 0.15)}>
        {k === 1 ? <Panel x={x} y={210} s={1.1} /> : <Turbine x={x} y={210} spin p={p} />}
      </motion.g>)}
      <text x="404" y="238" textAnchor="middle" className="bi-tiny">eólica e solar</text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.6, 2)}>
        <path d="M478 196h96M478 206h96" className="ae-pipe" />
        <GasFlame x={528} y={180} s={0.9} />
        <text x="526" y="224" textAnchor="middle" className="bi-tiny">gás importado</text>
        <text x="526" y="238" textAnchor="middle" className="bi-tiny">e carvão de reserva</text>
      </motion.g>
      <text x="402" y="276" textAnchor="middle" className="bi-hand-sm">sai o nuclear, a reserva vira fóssil</text>
    </motion.g>}

    {active === 3 && <motion.g key="china" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4)}>
      <rect x="30" y="102" width="560" height="192" rx="14" className="bi-panel" />
      <text x="46" y="126" className="bi-panel-title">CHINA</text>
      <path d="M50 190H570M50 266H570" className="ae-ground" />
      {[0, 1, 2, 3, 4, 5, 6].map(k => <motion.g key={k} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={p(0.5, 0.3 + k * 0.18)}>
        {k % 2 === 0 ? <Panel x={220 + k * 48} y={190} s={1.1} /> : <Turbine x={220 + k * 48} y={190} s={0.9} spin p={p} />}
      </motion.g>)}
      {[0, 1, 2, 3].map(k => <motion.g key={k} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={p(0.5, 0.4 + k * 0.3)}>
        <Chimney x={246 + k * 84} y={266} smoke={1} p={p} delay={0.6 + k * 0.3} />
      </motion.g>)}
      <text x="46" y="160" className="bi-small bi-strong">renováveis</text>
      <text x="46" y="176" className="bi-tiny">maior investidor do mundo</text>
      <text x="46" y="238" className="bi-small bi-strong">carvão</text>
      <text x="46" y="254" className="bi-tiny">novas usinas para a demanda</text>
      <text x="310" y="286" textAnchor="middle" className="bi-hand-sm">maior emissor de CO₂ e maior investidor em renováveis</text>
    </motion.g>}

    <text x="30" y="336" className="bi-foot">{feet[active]}</text>
  </svg>;
}

// Produção mineral: onde a geologia pôs o minério e quem paga para tirá-lo.
// A barragem a montante é desenhada no corte porque é o método, e não só a
// data, que o capítulo cobra: cada alteamento se apoia no próprio rejeito.
export function MineralGeography({ active }: Scene) {
  const p = usePaced();
  const [cx, cy] = onMap(-6, -50.2);
  const [qx, qy] = onMap(-20.2, -43.8);
  const feet = [
    'Mapa esquemático; faixas do corte ilustrativas, sem escala de tempo.',
    'Esquema de origem, sem mapa em escala nem volumes.',
    'Corte esquemático de uma barragem de rejeitos, sem escala.',
    'Percurso esquemático do mercúrio, sem medida.',
  ];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Produção mineral: ferro no Quadrilátero e em Carajás, minerais críticos para baterias, barragem de alteamento a montante e mercúrio do garimpo; recorte ${active + 1} em foco`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">PRODUÇÃO MINERAL</text>
    <Steps n={4} active={active} />

    {active === 0 && <motion.g key="ferro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4)}>
      <g transform={`translate(${MAP_X} ${MAP_Y}) scale(${MAP_S})`}>
        <path d={BRAZIL} className="ae-land" /><path d={BRAZIL} className="ae-outline" />
      </g>
      {[[cx, cy, 'Carajás (PA)', 12], [qx, qy, 'Quadrilátero', 12]].map(([x, y, n, dx], k) => <motion.g key={n as string} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={p(0.5, 0.4 + k * 0.3)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}>
        <path d={`M${x} ${y}c-7-9-10-13-10-18a10 10 0 0 1 20 0c0 5-3 9-10 18Z`} className="ae-pin" />
        <circle cx={x as number} cy={(y as number) - 18} r="4" className="ae-pin-dot" />
        <text x={(x as number) + (dx as number)} y={(y as number) - 14} className="bi-small bi-strong">{n}</text>
      </motion.g>)}
      <text x={qx + 12} y={qy} className="bi-tiny">Ferrífero (MG)</text>

      <rect x="318" y="62" width="272" height="232" rx="14" className="bi-panel" />
      <text x="334" y="86" className="bi-panel-title">ESCUDO BRASILEIRO · CORTE</text>
      {[0, 1, 2, 3, 4].map(k => <motion.rect key={k} x="344" y={236 - k * 24} width="220" height="20" rx="3" className={k % 2 === 0 ? 'ae-layer-iron' : 'ae-layer-rock'}
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={p(0.5, 0.4 + k * 0.25)} />)}
      <path d="M334 250V132" className="ae-link" markerEnd="url(#ae-head-8)" />
      <ArrowHead id="ae-head-8" />
      <text x="344" y="276" className="bi-tiny">formações antigas; bilhões de anos</text>
      <text x="344" y="116" className="bi-tiny">concentração → teor de ferro elevado</text>
      <text x="30" y="316" className="bi-hand-sm">a geologia decide onde está o minério</text>
    </motion.g>}

    {active === 1 && <motion.g key="criticos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4)}>
      {[
        { y: 92, sym: 'Li', a: 'lítio', b: 'triângulo: Argentina, Bolívia, Chile', c: 'e Austrália' },
        { y: 168, sym: 'Co', a: 'cobalto', b: 'República Democrática do Congo', c: '' },
        { y: 244, sym: 'TR', a: 'terras-raras', b: 'China: extração e, sobretudo,', c: 'refino' },
      ].map(({ y, sym, a, b, c }, k) => <motion.g key={sym} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={p(0.5, 0.2 + k * 0.25)}>
        <rect x="30" y={y - 26} width="290" height="62" rx="12" className="bi-panel" />
        <circle cx="62" cy={y + 5} r="20" className="ae-element" />
        <text x="62" y={y + 11} textAnchor="middle" className="ae-element-text">{sym}</text>
        <text x="92" y={y} className="bi-small bi-strong">{a}</text>
        <text x="92" y={y + 15} className="bi-tiny">{b}</text>
        {c && <text x="92" y={y + 28} className="bi-tiny">{c}</text>}
        <motion.path d={`M322 ${y + 5}C380 ${y + 5} 400 180 440 180`} className="ae-link" markerEnd="url(#ae-head-9)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={p(0.7, 0.8 + k * 0.25)} />
      </motion.g>)}
      <ArrowHead id="ae-head-9" />
      <g transform="translate(486 180)">
        <rect x="-34" y="-50" width="68" height="100" rx="10" className="ae-battery" />
        <rect x="-12" y="-58" width="24" height="10" rx="3" className="ae-battery" />
        <motion.rect x="-26" y="-42" width="52" height="84" rx="6" className="ae-battery-fill" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={p(1, 1.6)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }} />
        <path d="M4 -24l-12 22h10l-6 20 14-26H0Z" className="ae-bolt" />
      </g>
      <text x="486" y="258" textAnchor="middle" className="bi-small bi-strong">baterias</text>
      <text x="486" y="274" textAnchor="middle" className="bi-tiny">veículos elétricos</text>
      <text x="30" y="316" className="bi-tiny">e o cobre? Chile e Peru, nas formações vulcânicas dos Andes</text>
    </motion.g>}

    {active === 2 && <motion.g key="barragem" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4)}>
      <path d="M30 262H590" className="ae-ground" />
      <path d="M40 262H174L182 238H156L164 212H138L146 186H120L128 160H40Z" className="ae-tailings" />
      <text x="84" y="226" textAnchor="middle" className="ae-inner-text">rejeito</text>
      {[0, 1, 2, 3].map(k => <motion.path key={k} d={`M${204 - k * 18} ${262 - k * 26}h${-30}l8 -24h18Z`} className="ae-dike"
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={p(0.3, 0.2 + k * 0.2)} />)}
      <text x="176" y="112" className="bi-tiny">cada alteamento avança</text>
      <text x="176" y="126" className="bi-tiny">sobre o próprio rejeito</text>
      <path d="M186 132L150 156" className="ae-link" markerEnd="url(#ae-head-10)" />
      <ArrowHead id="ae-head-10" />
      <motion.path d="M190 188l8 12-6 10 8 12" className="ae-crack" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={p(0.3, 1)} />
      {[470, 500].map(x => <House key={x} x={x} y={252} s={0.9} />)}
      <motion.path d="M200 262C260 250 300 262 360 258S470 262 590 256V262H200Z" className="ae-mud" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={p(0.9, 1.1)} style={{ transformBox: 'fill-box', transformOrigin: 'left' }} />
      <text x="420" y="284" textAnchor="middle" className="bi-small">rios contaminados por centenas de quilômetros</text>
      <rect x="318" y="62" width="272" height="112" rx="14" className="bi-panel" />
      <text x="334" y="86" className="bi-panel-title">MINAS GERAIS</text>
      <text x="334" y="110" className="bi-label">Mariana · 2015</text>
      <text x="334" y="132" className="bi-label">Brumadinho · 2019</text>
      <text x="334" y="154" className="bi-tiny">centenas de mortes; o mesmo método</text>
      <motion.g initial={{ opacity: 0, scale: 1.4 }} animate={{ opacity: 1, scale: 1 }} transition={p(0.4, 1.5)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <rect x="378" y="186" width="200" height="48" rx="6" className="bi-stamp" transform="rotate(-4 478 210)" />
        <text x="478" y="205" textAnchor="middle" className="bi-stamp-text" transform="rotate(-4 478 210)">PROIBIDO</text>
        <text x="478" y="226" textAnchor="middle" className="bi-tiny" transform="rotate(-4 478 210)">para novas barragens</text>
      </motion.g>
      <text x="30" y="306" className="bi-small bi-strong">alteamento a montante</text>
    </motion.g>}

    {active === 3 && <motion.g key="garimpo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4)}>
      <path d="M30 150C140 140 220 190 330 196S500 232 590 236" className="ae-river" strokeWidth="26" />
      <g transform="translate(92 128)">
        <path d="M-30 10h60l-8 10h-44Z" className="ae-boat" />
        <path d="M-18 10v-22h26v22M8 -2h14v12" className="ae-cabin" />
        <path d="M-24 -12h36" className="ae-roof" />
      </g>
      <text x="92" y="100" textAnchor="middle" className="bi-small bi-strong">garimpo ilegal de ouro</text>
      {[0, 1, 2, 3, 4].map(k => <motion.circle key={k} r="4" className="ae-mercury" initial={{ cx: 110, cy: 150, opacity: 0 }}
        animate={{ cx: 110 + k * 70 + 60, cy: 162 + k * 10 + 14, opacity: 1 }} transition={p(1, 0.2 + k * 0.15)} />)}
      <text x="40" y="200" className="bi-small bi-warn">mercúrio</text>
      <text x="40" y="214" className="bi-tiny">separa o ouro dos sedimentos</text>
      {[[380, 214], [430, 222]].map(([x, y], k) => <motion.g key={x} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4, 1 + k * 0.15)}>
        <Fish x={x} y={y} s={1.1} /><circle cx={x - 2} cy={y + 1} r="2.4" className="ae-mercury" />
      </motion.g>)}
      <text x="404" y="252" textAnchor="middle" className="bi-tiny">cadeia alimentar aquática</text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={p(0.4, 1.4)}>
        <Person x={530} y={174} coat="bi-coat-green" />
        <Person x={560} y={180} s={0.8} coat="bi-coat-plain" />
      </motion.g>
      <text x="590" y="120" textAnchor="end" className="bi-tiny">ribeirinhos e indígenas:</text>
      <text x="590" y="134" textAnchor="end" className="bi-tiny">o peixe é a proteína</text>
      <rect x="30" y="262" width="280" height="54" rx="12" className="bi-panel" />
      <g transform="translate(58 290)"><path d="M-14 6l4-12h20l4 12Z" className="ae-gold" /></g>
      <text x="82" y="284" className="bi-small bi-strong">ouro "esquentado"</text>
      <text x="82" y="300" className="bi-tiny">declarado como de área legal</text>
      <text x="330" y="284" className="bi-tiny">também: violência contra indígenas,</text>
      <text x="330" y="298" className="bi-tiny">armas, drogas e evasão fiscal</text>
    </motion.g>}

    <text x="30" y="336" className="bi-foot">{feet[active]}</text>
  </svg>;
}

export const SCENES_LOTE17: Record<string, React.ComponentType<Scene>> = {
  'summary-geografia-desafios-ambientais-do-seculo-xxi': GlobalCommons,
  'summary-geografia-geopolitica-ambiental': EnvironmentalPower,
  'summary-geografia-politicas-ambientais-brasileiras': EnvironmentalLaw,
  'summary-geografia-matriz-energetica': EnergyMatrix,
  'summary-geografia-energia-eletrica-no-mundo': WorldElectricity,
  'summary-geografia-producao-mineral': MineralGeography,
};
export const HEADERS_LOTE17: Record<string, string> = {
  'summary-geografia-desafios-ambientais-do-seculo-xxi': 'desafios ambientais globais',
  'summary-geografia-geopolitica-ambiental': 'geopolítica ambiental',
  'summary-geografia-politicas-ambientais-brasileiras': 'política ambiental',
  'summary-geografia-matriz-energetica': 'matriz energética',
  'summary-geografia-energia-eletrica-no-mundo': 'geração elétrica',
  'summary-geografia-producao-mineral': 'geografia mineral',
};
