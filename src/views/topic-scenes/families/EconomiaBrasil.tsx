import React from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import { BRAZIL } from './GeografiaFisica';
import { ArrowHead, Person, type Scene } from './cenaKit';
import './EconomiaBrasil.css';

function usePaced() {
  const t = useSceneMotion();
  return (duration: number, delay = 0) => (t.duration === 0 ? t : { ...t, duration, delay });
}
type Paced = ReturnType<typeof usePaced>;

// Lote 19: Indústria II, Geoeconomia, Espaço Agrário e Espaço Industrial
// Brasileiro II. Os quatro abriam com a FlowScene/ContextScene genérica —
// caixas num eixo que só trocavam texto. Aqui cada recorte move a peça que o
// capítulo explica: a fábrica que muda de país enquanto o P&D fica, a
// barreira que corta o chip, o calcário que corrige o solo, a seta que sai
// da RMSP. Nomes, datas e lugares vêm do resumo; nada é medido, e as
// proporções desenhadas dizem isso no rodapé.

// Um recorte por vez: os outros ficam montados e transparentes, para que a
// troca seja uma transição e o detector de colisão ignore o que não aparece.
function Stage({ on, p, children }: { on: boolean; p: Paced; children: React.ReactNode }) {
  return <motion.g initial={false} animate={{ opacity: on ? 1 : 0, y: on ? 0 : 6 }} transition={p(0.45)}
    style={{ pointerEvents: on ? 'auto' : 'none' }}>{children}</motion.g>;
}

function Factory({ x, y, s = 1, cls = 'eb-factory' }: { x: number; y: number; s?: number; cls?: string }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M13 16V-22h8V16" className={cls} />
    <path d="M-26 16V-2l12-8v8l12-8v8l12-8V16Z" className={cls} />
    <path d="M-19 4h6v6h-6ZM-7 4h6v6h-6ZM5 4h6v6h-6Z" className="eb-window" />
  </g>;
}

function Bulb({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx="0" cy="-3" r="12" className="eb-glow" />
    <path d="M-5 5q-6-4-6-10a11 11 0 0 1 22 0q0 6-6 10Z" className="eb-bulb" />
    <path d="M-4 8h8M-3 11h6" className="eb-bulb-base" />
  </g>;
}

// ------------------------------------------------------------------ Indústria II

// A volta da economia circular, em pontos: rotacionar um grupo em torno de
// um centro do viewBox deixou a bolinha parada sobre a palavra "circular".
const ORBIT = Array.from({ length: 17 }, (_, k) => {
  const a = (Math.PI * 2 * k) / 16 - Math.PI / 2;
  return [200 + 58 * Math.cos(a), 222 + 58 * Math.sin(a)] as const;
});

export function NewIndustrialGeography({ active }: Scene) {
  const p = usePaced();
  const hands = ['a etapa muda de país', 'a vizinhança ensina', 'o resíduo volta'];
  const loop = [
    { at: [200, 164], label: 'produzir', lx: 200, ly: 146, anchor: 'middle' },
    { at: [258, 222], label: 'usar', lx: 276, ly: 226, anchor: 'start' },
    { at: [200, 280], label: 'reparar e reusar', lx: 200, ly: 312, anchor: 'middle' },
    { at: [142, 222], label: 'resíduo → insumo', lx: 124, ly: 226, anchor: 'end' },
  ] as const;
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Nova geografia industrial: deslocalização da manufatura, cluster com transbordamento de conhecimento e economia circular; recorte ${active + 1} em foco`}>
    <ArrowHead id="eb-head-ind" />
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">INDÚSTRIA II · A PRODUÇÃO SE REORGANIZA</text>
    {hands.map((h, k) => <motion.text key={h} x="590" y="42" textAnchor="end" className="bi-hand" initial={false}
      animate={{ opacity: active === k ? 1 : 0 }} transition={p(0.4, active === k ? 0.5 : 0)}>{h}</motion.text>)}

    <Stage on={active === 0} p={p}>
      <path d="M40 80q44-22 104-14q66 6 108 24q12 70 0 150q-44 22-110 20q-66 0-98-22q-14-80-4-158Z" className="eb-land-rich" />
      <text x="146" y="92" textAnchor="middle" className="bi-label">país desenvolvido</text>
      {[
        { x: 84, label: 'P&D', icon: <Bulb x={0} y={2} s={0.9} /> },
        { x: 146, label: 'design', icon: <path d="M-11 11L7 -7l5 5L-6 16ZM-11 11l-2 6 7-1M4 -10l5 -5 6 6-5 5" className="bi-icon" /> },
        { x: 208, label: 'marketing', icon: <path d="M-12 -5h6l12-8v26l-12-8h-6ZM-7 5l3 9h5l-2-8M10 -4q5 4 0 8" className="bi-icon" /> },
      ].map(({ x, label, icon }, k) => <g key={label}>
        <motion.g initial={false} animate={{ scale: active === 0 ? [1, 1.14, 1] : 1 }} transition={p(0.7, 0.9 + k * 0.2)}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
          <circle cx={x} cy="130" r="22" className="eb-badge" />
          <g transform={`translate(${x} 130)`}>{icon}</g>
        </motion.g>
        <text x={x} y="168" textAnchor="middle" className="bi-small bi-strong">{label}</text>
      </g>)}
      <g transform="translate(146 216)"><path d="M-26 16V-2l12-8v8l12-8v8l12-8V16ZM13 16V-22h8V16" className="eb-ghost" /></g>
      <text x="146" y="250" textAnchor="middle" className="bi-tiny">a manufatura saiu daqui</text>

      <path d="M378 94q64-28 156-18q44 10 50 40q8 66-4 130q-62 20-134 14q-54-6-68-30q-12-70 0-136Z" className="eb-land-cheap" />
      <text x="480" y="92" textAnchor="middle" className="bi-label">mão de obra mais barata</text>
      {[426, 480, 534].map((x, k) => <motion.g key={x} initial={false} animate={{ opacity: active === 0 ? 1 : 0 }} transition={p(0.4, 1.3 + k * 0.12)}>
        <Person x={x} y={200} s={0.72} coat={k === 1 ? 'bi-coat-army' : 'bi-coat-plain'} hat="cap" />
      </motion.g>)}
      <motion.g initial={false} animate={active === 0 ? { x: [-334, -167, 0], y: [56, -40, 0] } : { x: 0, y: 0 }} transition={p(1.3, 0.2)}>
        <Factory x={480} y={160} />
      </motion.g>

      <path d="M420 234C384 262 300 262 252 232" className="eb-route" markerEnd="url(#eb-head-ind)" />
      {[0, 1, 2].map(k => <motion.rect key={k} width="13" height="11" rx="2" className="eb-crate" initial={false}
        animate={active === 0 ? { x: [414, 336, 258], y: [228, 252, 230], opacity: [0, 1, 0] } : { x: 336, y: 252, opacity: 0 }}
        transition={p(1.4, 1.5 + k * 0.45)} />)}
      <text x="336" y="278" textAnchor="middle" className="bi-tiny">cadeia logística</text>
      <text x="146" y="286" textAnchor="middle" className="bi-small bi-strong">fica o maior valor agregado</text>
      <text x="480" y="286" textAnchor="middle" className="bi-small bi-strong">migra a manufatura intensiva</text>
      <text x="480" y="300" textAnchor="middle" className="bi-small bi-strong">em mão de obra</text>
      <text x="30" y="324" className="bi-small">No Brasil, o mesmo movimento desconcentrou a indústria de São Paulo para outras regiões.</text>
    </Stage>

    <Stage on={active === 1} p={p}>
      <text x="190" y="70" textAnchor="middle" className="bi-label">Vale do Silício, Califórnia</text>
      <ellipse cx="190" cy="180" rx="164" ry="100" className="eb-cluster" />
      <g transform="translate(190 146)">
        <path d="M-26 -8L0 -24L26 -8Z" className="eb-uni-roof" />
        <path d="M-24 -8h48v4h-48ZM-18 -4v22M-6 -4v22M6 -4v22M18 -4v22M-26 18h52" className="eb-uni" />
      </g>
      <text x="190" y="184" textAnchor="middle" className="bi-tiny">universidade de pesquisa (Stanford)</text>
      {[[84, 150], [296, 150], [96, 238], [284, 238]].map(([x, y]) => <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
        <path d="M-14 16V-20h18V16ZM4 16V-6h12V16Z" className="eb-tower" />
        <path d="M-9 -14h8M-9 -6h8M-9 2h8M8 0h4M8 8h4" className="eb-window-line" />
      </g>)}
      <g transform="translate(190 236)">
        <path d="M-12 14q-5-16 6-22l-4-7h20l-4 7q11 6 6 22Z" className="eb-bag" />
        <path d="M3 -3q-6-3-7 1t6 3q7 1 5 5t-8 1M0 -6v18" className="eb-bag-mark" />
      </g>
      <text x="190" y="266" textAnchor="middle" className="bi-tiny">capital de risco</text>
      <motion.g initial={false} animate={active === 1 ? { x: [0, 106, 212], y: [0, -30, 0] } : { x: 212, y: 0 }} transition={p(1.4, 0.5)}>
        <Bulb x={84} y={118} s={0.7} />
      </motion.g>
      <motion.g initial={false} animate={active === 1 ? { x: [0, -106, -212], y: [0, -20, 0] } : { x: -212, y: 0 }} transition={p(1.4, 1.1)}>
        <Bulb x={296} y={118} s={0.7} />
      </motion.g>
      <motion.g initial={false} animate={{ x: active === 1 ? [0, 150] : 150 }} transition={p(1.8, 0.8)}>
        <Person x={96} y={200} s={0.5} coat="bi-coat-royal" />
      </motion.g>

      <rect x="376" y="62" width="214" height="238" rx="14" className="bi-panel" />
      <text x="392" y="86" className="bi-panel-title">À DISTÂNCIA</text>
      <g transform="translate(404 128)"><path d="M-10 14V-16h14V14ZM4 14V-4h9V14Z" className="eb-tower" /></g>
      <g transform="translate(560 128)"><path d="M-10 14V-16h14V14ZM4 14V-4h9V14Z" className="eb-tower" /></g>
      <path d="M422 126H542" className="eb-far" />
      <motion.g initial={false} animate={active === 1 ? { x: [0, 50, 70], opacity: [1, 0.6, 0] } : { x: 70, opacity: 0 }} transition={p(1.6, 0.6)}>
        <Bulb x={430} y={112} s={0.55} />
      </motion.g>
      <text x="483" y="162" textAnchor="middle" className="bi-small">a troca informal se perde</text>
      <path d="M392 180H574" className="eb-divider" />
      <text x="392" y="204" className="bi-panel-title">NO BRASIL</text>
      <text x="392" y="224" className="bi-small">Campinas e</text>
      <text x="392" y="240" className="bi-small">São José dos Campos</text>
      <text x="392" y="256" className="bi-small">ITA: indústria aeroespacial</text>
      <text x="483" y="280" textAnchor="middle" className="bi-hand-sm">transbordamento de conhecimento</text>
      <text x="30" y="324" className="bi-small">Não surge por acaso: universidades, capital de investimento e políticas de fomento.</text>
    </Stage>

    <Stage on={active === 2} p={p}>
      <text x="30" y="72" className="bi-panel-title">MODELO LINEAR</text>
      {[
        { x: 170, label: 'extrair', icon: <path d="M-20 12L-4 -12L6 2l6-6 12 18ZM8 -16l10 10M13 -21l-8 8" className="bi-icon" /> },
        { x: 330, label: 'produzir', icon: <path d="M-18 12V0l9-6v6l9-6v6l9-6V12ZM10 12V-14h6V12" className="bi-icon" /> },
        { x: 490, label: 'descartar', icon: <path d="M-12 -8h24l-3 22h-18ZM-15 -8h30M-5 -8v-5h10v5M-4 -2v12M4 -2v12" className="bi-icon" /> },
      ].map(({ x, label, icon }) => <g key={label}>
        <g transform={`translate(${x} 92)`}>{icon}</g>
        <text x={x} y="126" textAnchor="middle" className="bi-small">{label}</text>
      </g>)}
      <path d="M200 92H290" className="bi-arrow-static" markerEnd="url(#eb-head-ind)" />
      <path d="M360 92H450" className="bi-arrow-static" markerEnd="url(#eb-head-ind)" />
      <motion.path d="M470 74L512 112M512 74L470 112" className="bi-cross" initial={false}
        animate={{ pathLength: active === 2 ? 1 : 0 }} transition={p(0.6, 0.6)} />

      <circle cx="200" cy="222" r="58" className="eb-loop" />
      {loop.map(({ at: [x, y], label, lx, ly, anchor }) => <g key={label}>
        <circle cx={x} cy={y} r="11" className="eb-loop-node" />
        <text x={lx} y={ly} textAnchor={anchor} className="bi-small bi-strong">{label}</text>
      </g>)}
      <motion.circle r="6" className="eb-orbit" initial={false} cx={200} cy={164}
        animate={active === 2 ? { cx: ORBIT.map(([x]) => x), cy: ORBIT.map(([, y]) => y) } : { cx: 200, cy: 164 }} transition={p(2.6, 0.9)} />
      <text x="200" y="226" textAnchor="middle" className="bi-label">circular</text>

      <rect x="340" y="150" width="250" height="150" rx="14" className="bi-panel" />
      <text x="356" y="174" className="bi-panel-title">NÃO É SÓ RECICLAGEM</text>
      {['redesenho para durar', 'reparo e reuso antes do descarte', 'resíduo de um vira insumo de outro', 'menos matéria-prima virgem'].map((line, k) =>
        <motion.g key={line} initial={false} animate={{ opacity: active === 2 ? 1 : 0, x: active === 2 ? 0 : -6 }} transition={p(0.4, 1 + k * 0.15)}>
          <circle cx="360" cy={194 + k * 20} r="3.5" className="bi-dot" />
          <text x="370" y={198 + k * 20} className="bi-small">{line}</text>
        </motion.g>)}
      <text x="356" y="284" className="bi-tiny">aço e cimento: captura de carbono</text>
    </Stage>

    <text x="30" y="342" className="bi-foot">Esquemático, sem escala.</text>
  </svg>;
}

// ------------------------------------------------------------------ Geoeconomia

function Node({ x, y, label, on }: { x: number; y: number; label: string; on: boolean }) {
  return <g>
    <rect x={x - 55} y={y - 20} width="110" height="40" rx="12" className={on ? 'eb-node eb-node-on' : 'eb-node'} />
    <text x={x} y={y + 5} textAnchor="middle" className={on ? 'bi-label bi-on' : 'bi-label'}>{label}</text>
  </g>;
}

export function Geoeconomics({ active }: Scene) {
  const p = usePaced();
  const panels = [
    ['CONTENÇÃO SEM GUERRA', 'EUA: conter o avanço tecnológico-militar chinês sem conflito armado.', 'China: já restringiu exportações de terras-raras como resposta.'],
    ['TARIFAS DOS EUA · A PARTIR DE 2018', 'Objetivo: reduzir o déficit comercial americano.', 'Pressão contra subsídios estatais e transferência forçada de tecnologia.'],
    ['SANÇÕES OCIDENTAIS · 2022', 'Reservas do banco central russo no exterior: congeladas.', 'Bancos russos fora do SWIFT: pagamentos internacionais dificultados.'],
    ['DESDOLARIZAÇÃO · AINDA LIMITADA', 'Moedas locais, alternativas ao SWIFT, reservas em outras moedas e ouro.', 'O dólar segue com a maior parte das reservas e do comércio global.'],
  ];
  const ring = Array.from({ length: 6 }, (_, k) => {
    const a = (Math.PI / 3) * k - Math.PI / 2;
    return [300 + 58 * Math.cos(a), 150 + 58 * Math.sin(a)] as const;
  });
  const cut = ring[2];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Geoeconomia: chips contra terras-raras, tarifas de 2018, sanções de 2022 e desdolarização; recorte ${active + 1} em foco`}>
    <ArrowHead id="eb-head-geo" />
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">GEOECONOMIA · PRESSÃO SEM FORÇA MILITAR</text>

    <Node x={95} y={126} label="EUA" on={active <= 1} />
    <Node x={525} y={126} label="China" on={active !== 2} />
    <Node x={525} y={216} label="Rússia" on={active >= 2} />

    <Stage on={active === 0} p={p}>
      <text x="310" y="84" textAnchor="middle" className="bi-small">chips avançados · litografia EUV</text>
      <path d="M150 108H470" className="eb-lane" />
      <motion.g initial={false} animate={{ x: active === 0 ? [0, 118] : 118 }} transition={p(1.1, 0.2)}>
        <g transform="translate(180 108)">
          <rect x="-11" y="-11" width="22" height="22" rx="3" className="eb-chip" />
          <path d="M-6 -15v4M0 -15v4M6 -15v4M-6 11v4M0 11v4M6 11v4M-15 -6h4M-15 0h4M-15 6h4M11 -6h4M11 0h4M11 6h4" className="eb-chip-pin" />
          <rect x="-5" y="-5" width="10" height="10" className="eb-chip-core" />
        </g>
      </motion.g>
      <motion.path d="M322 92V124" className="eb-barrier" initial={false} animate={{ pathLength: active === 0 ? 1 : 0 }} transition={p(0.4, 1.2)} />
      <path d="M150 150H470" className="eb-lane" />
      <motion.g initial={false} animate={{ x: active === 0 ? [0, -122] : -122 }} transition={p(1.1, 0.5)}>
        <g transform="translate(440 150)">
          <path d="M-13 9l4-15 7 5 5-11 9 9-2 12Z" className="eb-ore" />
          <path d="M-9 -6l7 5M2 -12l-4 11M11 -3l-6 2" className="eb-ore-facet" />
        </g>
      </motion.g>
      <motion.path d="M298 134V166" className="eb-barrier" initial={false} animate={{ pathLength: active === 0 ? 1 : 0 }} transition={p(0.4, 1.5)} />
      <text x="310" y="186" textAnchor="middle" className="bi-small">terras-raras: extração e refino</text>
      <text x="310" y="222" textAnchor="middle" className="bi-hand-sm">a cadeia de suprimento vira campo de batalha</text>
    </Stage>

    <Stage on={active === 1} p={p}>
      <text x="310" y="70" textAnchor="middle" className="bi-date">2018</text>
      <path d="M470 126H150" className="eb-lane" markerEnd="url(#eb-head-geo)" />
      <g transform="translate(310 126)">
        <path d="M-15 -8V-34h30V-8M-19 -34h38l-19-12Z" className="eb-booth" />
        <text x="0" y="-16" textAnchor="middle" className="eb-booth-text">tarifa</text>
      </g>
      {[0, 1, 2].map(k => <motion.g key={k} initial={false} animate={{ x: active === 1 ? [0, -260 + k * 26] : -260 + k * 26 }} transition={p(1.4, 0.3 + k * 0.35)}>
        <g transform="translate(440 126)">
          <rect x="-9" y="-8" width="18" height="16" rx="2" className="eb-crate" />
          <path d="M-9 0h18M0 -8v16" className="eb-crate-line" />
        </g>
      </motion.g>)}
      {[0, 1, 2].map(k => <motion.circle key={k} cx={188 + k * 26} cy="110" r="6" className="eb-tag" initial={false}
        animate={{ scale: active === 1 ? [0, 1.3, 1] : 1 }} transition={p(0.4, 1.4 + k * 0.35)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />)}
      <text x="240" y="160" textAnchor="middle" className="bi-tiny">mais caros ao entrar</text>
      <text x="420" y="160" textAnchor="middle" className="bi-tiny">produtos chineses</text>
      <text x="310" y="210" textAnchor="middle" className="bi-hand-sm">tarifa: taxa geral; sanção: objetivo político</text>
    </Stage>

    <Stage on={active === 2} p={p}>
      <text x="300" y="72" textAnchor="middle" className="bi-date">2022</text>
      {ring.map(([x, y], k) => { const [nx, ny] = ring[(k + 1) % 6]; return <path key={k} d={`M${x} ${y}L${nx} ${ny}`} className="eb-net" />; })}
      {ring.map(([x, y], k) => k !== 2 && <circle key={k} cx={x} cy={y} r="7" className="eb-bank" />)}
      <text x="300" y="155" textAnchor="middle" className="bi-label">SWIFT</text>
      <motion.g initial={false} animate={{ x: active === 2 ? [0, 0, 112] : 112, y: active === 2 ? [0, 0, 48] : 48 }} transition={p(1.4, 0.4)}>
        <circle cx={cut[0]} cy={cut[1]} r="7" className="eb-bank eb-bank-out" />
      </motion.g>
      <motion.path d={`M${cut[0] - 7} ${cut[1] - 7}L${cut[0] + 7} ${cut[1] + 7}M${cut[0] + 7} ${cut[1] - 7}L${cut[0] - 7} ${cut[1] + 7}`} className="bi-cross" initial={false}
        animate={{ pathLength: active === 2 ? 1 : 0 }} transition={p(0.3, 1.6)} />
      <text x="440" y="250" textAnchor="middle" className="bi-tiny">bancos russos fora da rede</text>
      <g transform="translate(160 196)">
        <rect x="-26" y="-22" width="52" height="42" rx="5" className="eb-vault" />
        <circle cx="0" cy="-1" r="11" className="eb-vault-dial" />
        <path d="M0 -12v22M-11 -1h22" className="eb-vault-line" />
        <motion.path d="M18 -18v-8a8 8 0 0 1 16 0v8" className="eb-lock" initial={false}
          animate={{ y: active === 2 ? [-8, 0] : 0 }} transition={p(0.5, 1.2)} />
        <rect x="14" y="-19" width="24" height="16" rx="3" className="eb-lock-body" />
      </g>
      <text x="160" y="238" textAnchor="middle" className="bi-tiny">reservas russas no exterior</text>
    </Stage>

    <Stage on={active === 3} p={p}>
      <motion.g initial={false} animate={{ scale: active === 3 ? [0.6, 1.08, 1] : 1 }} transition={p(0.7, 0.2)}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <circle cx="310" cy="128" r="38" className="eb-coin" />
        <circle cx="310" cy="128" r="30" className="eb-coin-rim" />
        <text x="310" y="134" textAnchor="middle" className="eb-coin-text">US$</text>
      </motion.g>
      <text x="310" y="184" textAnchor="middle" className="bi-small bi-strong">moeda de reserva dominante</text>
      <g transform="translate(196 128)">
        <path d="M-18 8l5-12h26l5 12ZM-14 -4l4-9h20l4 9" className="eb-gold" />
      </g>
      <text x="196" y="156" textAnchor="middle" className="bi-tiny">ouro</text>
      <g transform="translate(424 128)">
        <ellipse cx="0" cy="8" rx="15" ry="5" className="eb-coin-small" />
        <ellipse cx="0" cy="2" rx="15" ry="5" className="eb-coin-small" />
        <ellipse cx="0" cy="-4" rx="15" ry="5" className="eb-coin-small" />
      </g>
      <text x="424" y="156" textAnchor="middle" className="bi-tiny">moedas locais</text>
      <path d="M525 148V194" className="eb-lane" />
      <motion.circle cx="525" cy="152" r="6" className="eb-coin-small" initial={false}
        animate={{ y: active === 3 ? [0, 38, 0, 38] : 38 }} transition={p(1.8, 0.6)} />
      <text x="536" y="175" className="bi-tiny">yuan</text>
      <text x="170" y="210" className="bi-tiny">reservas internacionais</text>
      <rect x="170" y="216" width="270" height="14" rx="7" className="bi-gauge" />
      <motion.rect x="170" y="216" height="14" rx="7" className="eb-bar-dollar" initial={false}
        animate={{ width: active === 3 ? [0, 176] : 176 }} transition={p(0.9, 0.5)} />
      <text x="258" y="226" textAnchor="middle" className="bi-bar-text">dólar</text>
      <text x="400" y="226" textAnchor="middle" className="eb-bar-rest">demais</text>
    </Stage>

    <rect x="30" y="256" width="560" height="64" rx="12" className="bi-panel" />
    {panels.map(([title, a, b], k) => <motion.g key={title} initial={false} animate={{ opacity: active === k ? 1 : 0 }} transition={p(0.4, active === k ? 0.2 : 0)}>
      <text x="48" y="277" className="bi-panel-title">{title}</text>
      <text x="48" y="296" className="bi-small">{a}</text>
      <text x="48" y="312" className="bi-small">{b}</text>
    </motion.g>)}
    <text x="30" y="340" className="bi-foot">Esquemático: posições, setas e barra não medem valores.</text>
  </svg>;
}

// ------------------------------------------------------------ mapa do Brasil

// Mesmo contorno BRAZIL de GeografiaFisica (x = 616,8 + 7,9·lon;
// y = 76,2 − 7,70·lat), reduzido a 0,8 e deslocado para a metade esquerda.
const MAP = 'translate(14 40) scale(.8)';
const geo = (x: number, y: number) => [14 + 0.8 * x, 40 + 0.8 * y] as const;

// Regiões desenhadas à mão sobre o contorno, em coordenadas do contorno:
// o Cerrado do Centro-Oeste, o Matopiba (MA, TO, PI, BA) e a Amazônia.
const CERRADO = 'M222 146L257 161L269 192L261 230L222 246L182 238L159 199L174 169Z';
const MATOPIBA = 'M257 96L286 128L276 150L266 176L247 177L228 154L234 115Z';
const AMAZONIA = 'M60 110L86 66L114 61L139 40L213 45L216 76L236 90L230 130L222 146L174 169L143 180L102 153L32 133L37 112Z';

function MapLabel({ x, y, children, anchor = 'middle', on = true }: { x: number; y: number; children: string; anchor?: 'start' | 'middle' | 'end'; on?: boolean }) {
  return <text x={x} y={y} textAnchor={anchor} className={on ? 'eb-map-label eb-map-on' : 'eb-map-label'}>{children}</text>;
}

// ------------------------------------------------------------ Espaço agrário

export function AgrarianSpace({ active }: Scene) {
  const p = usePaced();
  const feet = [
    'Proporções ilustrativas, sem escala.',
    'Revolução Verde: mecanização, insumos químicos e melhoramento genético de sementes.',
    'Muitas vezes sobre Cerrado nativo; em menor escala, Caatinga e transições amazônicas.',
    'Reforma agrária: prevista na Constituição, aplicada de forma limitada e descontínua.',
  ];
  const [csx, csy] = geo(222, 262);
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Espaço agrário brasileiro: latifúndio e agricultura familiar, correção do solo do Cerrado, fronteira no Matopiba e conflitos pela terra; recorte ${active + 1} em foco`}>
    <ArrowHead id="eb-head-agr" />
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">O ESPAÇO AGRÁRIO BRASILEIRO</text>

    <g transform={MAP}>
      <path d={BRAZIL} className="bi-land" />
      <motion.path d={AMAZONIA} className="eb-amazon" initial={false} animate={{ opacity: active === 3 ? 1 : 0 }} transition={p(0.5)} />
      <motion.path d={CERRADO} className="eb-cerrado" initial={false} animate={{ opacity: active === 1 || active === 2 ? 1 : 0.18 }} transition={p(0.5)} />
      <motion.path d={MATOPIBA} className="eb-matopiba" initial={false} animate={{ opacity: active === 2 ? 1 : 0 }} transition={p(0.5, 0.9)} />
      <motion.path d="M222 262C208 240 194 226 198 204" className="eb-front" markerEnd="url(#eb-head-agr)" initial={false}
        animate={{ pathLength: active === 2 ? 1 : 0, opacity: active === 2 ? 1 : 0 }} transition={p(0.8, 0.2)} />
      <motion.path d="M206 192C216 168 230 150 242 138" className="eb-front" markerEnd="url(#eb-head-agr)" initial={false}
        animate={{ pathLength: active === 2 ? 1 : 0, opacity: active === 2 ? 1 : 0 }} transition={p(0.8, 0.9)} />
    </g>

    <Stage on={active === 0} p={p}>
      <g transform="translate(80 232)">
        <path d="M-16 -12h28a4 4 0 0 1 4 4v22h-28a4 4 0 0 1-4-4Z" className="bi-scroll" />
        <path d="M-10 -5h18M-10 1h18M-10 7h12" className="bi-scroll-line" />
      </g>
      <MapLabel x={80} y={264}>herança das</MapLabel>
      <MapLabel x={80} y={277}>sesmarias</MapLabel>
      {[[150, 190], [190, 210], [210, 170], [240, 230]].map(([x, y], k) => <motion.rect key={k} x={x - 11} y={y - 8} width="22" height="16" rx="2" className="eb-plot-big"
        initial={false} animate={{ scale: active === 0 ? [0, 1] : 1 }} transition={p(0.4, 0.4 + k * 0.1)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />)}
      {[[268, 150], [256, 208], [228, 262], [286, 128], [200, 280]].map(([x, y], k) => <motion.rect key={k} x={x - 4} y={y - 4} width="8" height="8" rx="1.5" className="eb-plot-small"
        initial={false} animate={{ scale: active === 0 ? [0, 1] : 1 }} transition={p(0.3, 0.9 + k * 0.08)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />)}
    </Stage>
    <Stage on={active === 1} p={p}>
      <MapLabel x={geo(222, 205)[0]} y={geo(222, 205)[1]} on>Cerrado</MapLabel>
    </Stage>
    <Stage on={active === 2} p={p}>
      <MapLabel x={csx + 8} y={csy + 14} anchor="start" on>Centro-Sul</MapLabel>
      <MapLabel x={150} y={212} anchor="end" on>Centro-Oeste</MapLabel>
      <path d="M226 108L221 116" className="eb-leader" />
      <MapLabel x={236} y={104} on>Matopiba</MapLabel>
    </Stage>
    <Stage on={active === 3} p={p}>
      <MapLabel x={126} y={126} on>Amazônia</MapLabel>
      <g transform="translate(150 150)">
        <path d="M-8 -10h12l4 4v16h-16Z" className="eb-doc" />
        <circle cx="2" cy="4" r="4" className="eb-stamp" />
      </g>
      <MapLabel x={150} y={178}>grilagem</MapLabel>
    </Stage>

    <rect x="312" y="56" width="280" height="248" rx="14" className="bi-panel" />

    <Stage on={active === 0} p={p}>
      <text x="328" y="80" className="bi-panel-title">QUEM TEM A TERRA, QUEM ALIMENTA</text>
      <rect x="328" y="92" width="248" height="20" rx="6" className="eb-bar-fam" />
      <motion.rect x="328" y="92" height="20" rx="6" className="eb-bar-lat" initial={false}
        animate={{ width: active === 0 ? [0, 172] : 172 }} transition={p(0.9, 0.3)} />
      <text x="414" y="106" textAnchor="middle" className="bi-bar-text">latifúndio</text>
      <text x="538" y="106" textAnchor="middle" className="eb-bar-rest">familiar</text>
      <text x="328" y="126" className="bi-tiny">área agrícola ocupada</text>

      <g transform="translate(390 158)">
        <rect x="-44" y="-18" width="74" height="36" rx="3" className="eb-field-big" />
        <path d="M-40 -10h66M-40 -2h66M-40 6h66M-40 14h66" className="eb-furrow" />
        <path d="M34 18V-10a8 8 0 0 1 16 0V18Z" className="eb-silo" />
      </g>
      <text x="394" y="198" textAnchor="middle" className="bi-small">soja · milho · carne</text>
      <path d="M394 204v14" className="bi-arrow-static" markerEnd="url(#eb-head-agr)" />
      <g transform="translate(394 238)">
        <path d="M-28 0h56l-8 12h-40Z" className="eb-hull" />
        <path d="M-18 -10h11v10h-11ZM-5 -10h11v10h-11ZM8 -16h11v16h-11Z" className="eb-container" />
      </g>
      <text x="394" y="266" textAnchor="middle" className="bi-small bi-strong">exportação</text>

      <g transform="translate(528 160)">
        <rect x="-26" y="-10" width="30" height="24" rx="3" className="eb-field-small" />
        <path d="M-22 -3h22M-22 4h22M-22 10h22" className="eb-furrow" />
        <path d="M10 14V0l9-8 9 8v14Z" className="eb-house" />
      </g>
      <text x="528" y="198" textAnchor="middle" className="bi-small">feijão · mandioca</text>
      <text x="528" y="212" textAnchor="middle" className="bi-small">hortaliças</text>
      <g transform="translate(528 238)">
        <path d="M-18 -4h36l-5 16h-26Z" className="eb-basket" />
        <path d="M-12 -4q12-16 24 0" className="eb-basket-handle" />
        <circle cx="-7" cy="-7" r="4" className="eb-veg" /><circle cx="3" cy="-8" r="4" className="eb-veg-b" />
      </g>
      <text x="528" y="266" textAnchor="middle" className="bi-small bi-strong">mercado interno</text>
      <text x="452" y="292" textAnchor="middle" className="bi-hand-sm">familiar não é subsistência</text>
    </Stage>

    <Stage on={active === 1} p={p}>
      <text x="328" y="80" className="bi-panel-title">REVOLUÇÃO DO CERRADO</text>
      <text x="328" y="100" className="bi-small">a partir das décadas de 1960 e 1970</text>
      <g>
        <rect x="336" y="172" width="150" height="26" className="eb-soil-top" />
        <rect x="336" y="198" width="150" height="26" className="eb-soil-mid" />
        <rect x="336" y="224" width="150" height="22" className="eb-soil-deep" />
        <motion.rect x="336" y="172" width="150" height="26" className="eb-soil-fixed" initial={false}
          animate={{ opacity: active === 1 ? [0, 0, 1] : 1 }} transition={p(1.8, 0.3)} />
      </g>
      <motion.text x="411" y="216" textAnchor="middle" className="eb-soil-text" initial={false}
        animate={{ opacity: active === 1 ? [1, 1, 0] : 0 }} transition={p(1.8, 0.3)}>ácido</motion.text>
      <motion.text x="411" y="216" textAnchor="middle" className="eb-soil-text" initial={false}
        animate={{ opacity: active === 1 ? [0, 0, 1] : 1 }} transition={p(1.8, 0.3)}>corrigido</motion.text>
      <g transform="translate(540 134) rotate(-28)">
        <path d="M-16 -18h32l3 36h-38Z" className="eb-sack" />
        <path d="M-16 -18q16 -8 32 0" className="eb-sack-tie" />
      </g>
      <text x="548" y="176" textAnchor="middle" className="bi-tiny">calcário</text>
      <text x="548" y="188" textAnchor="middle" className="bi-tiny">+ adubação</text>
      {[0, 1, 2, 3, 4, 5].map(k => <motion.circle key={k} cx={506 - k * 12} cy="150" r="2.6" className="eb-lime" initial={false}
        animate={active === 1 ? { y: [0, 22], opacity: [0, 1, 0] } : { y: 22, opacity: 0 }} transition={p(0.8, 0.2 + k * 0.12)} />)}
      {[356, 386, 416, 446, 476].map((x, k) => <motion.g key={x} initial={false} animate={{ scaleY: active === 1 ? [0, 0, 1] : 1 }}
        transition={p(1.6, 0.8 + k * 0.08)} style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}>
        <path d={`M${x} 172V150M${x} 160q-9-2-10-10q9 0 10 8M${x} 156q9-2 10-10q-9 0-10 8`} className="eb-sprout" />
      </motion.g>)}
      <text x="328" y="270" className="bi-small">baixo potencial → principal polo de grãos</text>
      <text x="452" y="294" textAnchor="middle" className="bi-hand-sm">o solo não era fértil: foi corrigido</text>
    </Stage>

    <Stage on={active === 2} p={p}>
      <text x="328" y="80" className="bi-panel-title">A FRONTEIRA AVANÇA</text>
      <text x="328" y="100" className="bi-small">Centro-Sul → Centro-Oeste → Matopiba</text>
      {[['MA', 'Maranhão'], ['TO', 'Tocantins'], ['PI', 'Piauí'], ['BA', 'Bahia']].map(([uf, name], k) => <motion.g key={uf} initial={false}
        animate={{ opacity: active === 2 ? 1 : 0, y: active === 2 ? 0 : 8 }} transition={p(0.4, 1 + k * 0.15)}>
        <rect x={334 + k * 64} y="118" width="50" height="40" rx="9" className="eb-uf" />
        <text x={359 + k * 64} y="144" textAnchor="middle" className="eb-uf-text">{uf}</text>
        <text x={359 + k * 64} y="172" textAnchor="middle" className="bi-tiny">{name}</text>
      </motion.g>)}
      {['soja e outros grãos', 'novas áreas na produção comercial', 'a mais recente, após o Centro-Oeste'].map((line, k) =>
        <g key={line}><circle cx="334" cy={200 + k * 22} r="3.5" className="bi-dot" /><text x="344" y={204 + k * 22} className="bi-small">{line}</text></g>)}
      <text x="452" y="290" textAnchor="middle" className="bi-hand-sm">a fronteira segue os grãos</text>
    </Stage>

    <Stage on={active === 3} p={p}>
      <text x="328" y="80" className="bi-panel-title">CONFLITOS PELA TERRA</text>
      <Person x={362} y={104} s={0.82} coat="bi-coat-dark" hat="brim" />
      <text x="362" y="150" textAnchor="middle" className="bi-tiny">grandes</text>
      <text x="362" y="161" textAnchor="middle" className="bi-tiny">proprietários</text>
      <path d="M396 118h28M424 126h-28" className="eb-tension" />
      {[478, 508, 538].map((x, k) => <Person key={x} x={x} y={104} s={0.72} coat={['bi-coat-green', 'bi-coat-plain', 'bi-coat-army'][k]} hat={k === 1 ? 'cap' : undefined} />)}
      <text x="508" y="150" textAnchor="middle" className="bi-tiny">sem-terra (MST, anos 1980)</text>
      <text x="508" y="161" textAnchor="middle" className="bi-tiny">quilombolas e indígenas</text>
      <text x="508" y="172" textAnchor="middle" className="bi-tiny">pequenos agricultores</text>
      <text x="328" y="198" className="bi-panel-title">GRILAGEM NA FRONTEIRA</text>
      {[
        { x: 360, label: 'documento falso', icon: <g><path d="M-12 -16h18l6 6v24h-24Z" className="eb-doc" /><circle cx="2" cy="4" r="6" className="eb-stamp" /></g> },
        { x: 452, label: 'desmatamento', icon: <g><path d="M-4 14v-10h8v10ZM-14 -6a14 12 0 0 1 28 0Z" className="eb-tree" /><path d="M-18 16h36" className="bi-ground" /></g> },
        { x: 544, label: 'pasto ou lavoura', icon: <g><path d="M-20 14h40M-14 14v-8M-6 14v-12M2 14v-8M10 14v-12" className="eb-sprout" /></g> },
      ].map(({ x, label, icon }, k) => <motion.g key={label} initial={false} animate={{ opacity: active === 3 ? 1 : 0 }} transition={p(0.4, 0.6 + k * 0.35)}>
        <g transform={`translate(${x} 228)`}>{icon}</g>
        <text x={x} y="264" textAnchor="middle" className="bi-tiny">{label}</text>
      </motion.g>)}
      <path d="M382 228h36" className="bi-arrow-static" markerEnd="url(#eb-head-agr)" />
      <path d="M478 228h36" className="bi-arrow-static" markerEnd="url(#eb-head-agr)" />
      <text x="452" y="292" textAnchor="middle" className="bi-hand-sm">problema estrutural, não só histórico</text>
    </Stage>

    {feet.map((line, k) => <motion.text key={line} x="30" y="332" className="bi-foot" initial={false}
      animate={{ opacity: active === k ? 1 : 0 }} transition={p(0.4)}>{line}</motion.text>)}
  </svg>;
}

// ------------------------------------------------------ Espaço industrial II

export function IndustrialDeconcentration({ active }: Scene) {
  const p = usePaced();
  const [spx, spy] = geo(249, 257);
  const targets = [
    { at: geo(214, 240), label: 'interior SP', lx: -14, ly: 4, anchor: 'end' },
    { at: geo(222, 200), label: 'Centro-Oeste', lx: -14, ly: 4, anchor: 'end' },
    { at: geo(272, 224), label: 'MG', lx: 14, ly: 4, anchor: 'start' },
    { at: geo(310, 176), label: 'Nordeste', lx: -14, ly: 4, anchor: 'end' },
    { at: geo(336, 140), label: '', lx: 0, ly: 0, anchor: 'start' },
  ] as const;
  const fiscal = [
    { at: geo(313, 176), label: 'BA', lx: -12 },
    { at: geo(341, 138), label: 'PE', lx: -12 },
    { at: geo(222, 290), label: 'Sul', lx: -12 },
  ];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Espaço industrial brasileiro II: desconcentração a partir da RMSP, guerra fiscal do ICMS e desindustrialização precoce; recorte ${active + 1} em foco`}>
    <ArrowHead id="eb-head-bri" />
    <rect x="8" y="8" width="604" height="344" rx="18" className="bi-paper" />
    <text x="30" y="40" className="bi-kicker">O ESPAÇO INDUSTRIAL BRASILEIRO II</text>

    <motion.g initial={false} animate={{ opacity: active === 2 ? 0.45 : 1 }} transition={p(0.5)}>
      <path d={BRAZIL} transform={MAP} className="bi-land" />
      <Factory x={spx} y={spy - 6} s={0.8} cls="eb-factory eb-factory-sp" />
      <text x={spx + 22} y={spy + 26} className="eb-map-label eb-map-on">São Paulo</text>
    </motion.g>
    <rect x="312" y="56" width="280" height="248" rx="14" className="bi-panel" />

    <Stage on={active === 0} p={p}>
      {targets.map(({ at: [x, y], label, lx, ly, anchor }, k) => <g key={`${x}-${y}`}>
        <motion.path d={`M${spx - 4} ${spy - 26}Q${(spx + x) / 2 - 10} ${(spy + y) / 2 - 16} ${x} ${y + 6}`} className="eb-spread" markerEnd="url(#eb-head-bri)"
          initial={false} animate={{ pathLength: active === 0 ? [0, 1] : 1 }} transition={p(0.6, 0.2 + k * 0.12)} />
        <motion.g initial={false} animate={{ opacity: active === 0 ? [0, 1] : 1 }} transition={p(0.4, 0.6 + k * 0.12)}>
          <Factory x={x} y={y - 4} s={0.42} />
        </motion.g>
        {label && <MapLabel x={x + lx} y={y + ly} anchor={anchor}>{label}</MapLabel>}
      </g>)}
      <text x="328" y="80" className="bi-panel-title">DESCONCENTRAÇÃO · 1970–1980</text>
      <text x="328" y="104" className="bi-small bi-strong">empurra: a RMSP saturada</text>
      {[
        { x: 372, label: 'congestionamento', icon: <path d="M-16 4h12l3-6h8l3 6h6v6h-32ZM-12 12a2 2 0 1 0 0.1 0M8 12a2 2 0 1 0 0.1 0" className="bi-icon" /> },
        { x: 468, label: 'terreno caro', icon: <path d="M-14 10V-2l10-8 10 8v12ZM8 -6l6 -6 6 6-6 6Z" className="bi-icon" /> },
        { x: 548, label: 'poluição', icon: <path d="M-14 12V-2h8V12ZM-10 -6q-4-6 2-10q6-4 2-10M4 -2q-4-6 2-10q6-4 2-10" className="bi-icon" /> },
      ].map(({ x, label, icon }) => <g key={label}><g transform={`translate(${x} 128)`}>{icon}</g>
        <text x={x} y="156" textAnchor="middle" className="bi-tiny">{label}</text></g>)}
      <text x="328" y="176" className="bi-tiny">e mão de obra e custo de vida mais caros</text>
      <text x="328" y="202" className="bi-small bi-strong">atrai: outros estados</text>
      {[
        { x: 366, label: 'transporte', icon: <path d="M-16 12L-6 -12M16 12L6 -12M0 -8v4M0 2v4M0 10v2" className="bi-icon" /> },
        { x: 452, label: 'energia', icon: <path d="M4 -14l-12 16h8l-4 12 12-16h-8Z" className="bi-icon" /> },
        { x: 538, label: 'incentivos', icon: <path d="M-14 -8h22l6 8-6 8h-22ZM-8 0a2 2 0 1 0 0.1 0" className="bi-icon" /> },
      ].map(({ x, label, icon }) => <g key={label}><g transform={`translate(${x} 226)`}>{icon}</g>
        <text x={x} y="254" textAnchor="middle" className="bi-tiny">{label}</text></g>)}
      <text x="452" y="286" textAnchor="middle" className="bi-hand-sm">SP perde peso, mas segue a maior</text>
    </Stage>

    <Stage on={active === 1} p={p}>
      {fiscal.map(({ at: [x, y], label, lx }, k) => <motion.g key={label} initial={false} animate={{ scale: active === 1 ? [0, 1.2, 1] : 1 }}
        transition={p(0.5, 0.4 + k * 0.25)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <circle cx={x} cy={y} r="9" className="eb-pin" />
        <path d={`M${x - 5} ${y + 2}h10l-1.5-4h-7Z`} className="eb-pin-car" />
        <MapLabel x={x + lx} y={y + 4} anchor="end" on>{label}</MapLabel>
      </motion.g>)}
      <text x="328" y="80" className="bi-panel-title">GUERRA FISCAL · ICMS</text>
      <g transform="translate(452 122)">
        <Factory x={0} y={0} s={0.8} />
        <path d="M-12 26h18l4 -6h-22Z" className="eb-car" />
      </g>
      <text x="452" y="186" textAnchor="middle" className="bi-tiny">montadora procura sede</text>
      {[{ x: 360, label: 'estado' }, { x: 544, label: 'estado vizinho' }].map(({ x, label }, k) => <g key={label}>
        <path d={`M${x - 40} 146h80v18h-80Z`} className="eb-podium" />
        <text x={x} y="159" textAnchor="middle" className="eb-podium-text">{label}</text>
        <motion.g initial={false} animate={{ scale: active === 1 ? [0, 1, 1.18, 1] : 1 }} transition={p(1.2, 0.5 + k * 0.4)}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
          <path d={`M${x - 22} 114h34l8 9-8 9h-34Z`} className="eb-tax-tag" />
          <text x={x - 3} y="127" textAnchor="middle" className="eb-tax-text">− ICMS</text>
        </motion.g>
      </g>)}
      <path d="M422 116H392M482 116H512" className="eb-tension" />
      {['perda de arrecadação sem retorno certo', 'disputa judicial entre estados', 'STF e reforma tributária: coordenação'].map((line, k) =>
        <motion.g key={line} initial={false} animate={{ opacity: active === 1 ? 1 : 0, x: active === 1 ? 0 : -6 }} transition={p(0.4, 1.5 + k * 0.2)}>
          <circle cx="334" cy={212 + k * 20} r="3.5" className="bi-dot bi-dot-warn" />
          <text x="344" y={216 + k * 20} className="bi-small">{line}</text>
        </motion.g>)}
      <text x="452" y="290" textAnchor="middle" className="bi-hand-sm">ganha o estado, perde a federação?</text>
    </Stage>

    <Stage on={active === 2} p={p}>
      <text x="328" y="80" className="bi-panel-title">DESINDUSTRIALIZAÇÃO PRECOCE</text>
      <text x="340" y="100" className="bi-tiny">peso da indústria de transformação no PIB</text>
      <path d="M340 106V250H584" className="bi-axis eb-axis" />
      <text x="584" y="266" textAnchor="end" className="bi-tiny">renda per capita →</text>
      <motion.path d="M342 240C420 214 470 128 522 126C552 126 568 150 582 172" className="eb-curve-rich" initial={false}
        animate={{ pathLength: active === 2 ? [0, 1] : 1 }} transition={p(1.2, 0.3)} />
      <text x="522" y="118" textAnchor="middle" className="bi-tiny">EUA e Europa Ocidental</text>
      <motion.path d="M342 244C372 226 394 180 416 178C436 178 452 200 470 222" className="eb-curve-br" initial={false}
        animate={{ pathLength: active === 2 ? [0, 1] : 1 }} transition={p(1.2, 1.2)} />
      <text x="408" y="168" textAnchor="middle" className="bi-label bi-on">Brasil</text>
      <motion.path d="M416 184V250" className="bi-marker" initial={false} animate={{ opacity: active === 2 ? [0, 1] : 1 }} transition={p(0.4, 2.2)} />
      <text x="452" y="290" textAnchor="middle" className="bi-hand-sm">cai antes de enriquecer</text>
      <text x="30" y="316" className="bi-small">Pressões: manufaturados chineses e câmbio valorizado em certos períodos.</text>
    </Stage>

    <motion.text x="30" y="336" className="bi-foot" initial={false} animate={{ opacity: active === 2 ? 1 : 0 }} transition={p(0.4)}>
      Curvas esquemáticas: cai a participação no PIB, não o volume produzido.</motion.text>
    <motion.text x="30" y="336" className="bi-foot" initial={false} animate={{ opacity: active === 2 ? 0 : 1 }} transition={p(0.4)}>
      Esquemático, sem escala: setas mostram direção, não volume.</motion.text>
  </svg>;
}

export const SCENES_LOTE19: Record<string, React.ComponentType<Scene>> = {
  'summary-geografia-industria-ii': NewIndustrialGeography,
  'summary-geografia-gedeconomia-mundial': Geoeconomics,
  'summary-geografia-o-espaco-agrario-brasileiro': AgrarianSpace,
  'summary-geografia-o-espaco-industrial-brasileiro-ii': IndustrialDeconcentration,
};
export const HEADERS_LOTE19: Record<string, string> = {
  'summary-geografia-industria-ii': 'nova geografia industrial',
  'summary-geografia-gedeconomia-mundial': 'instrumentos geoeconômicos',
  'summary-geografia-o-espaco-agrario-brasileiro': 'terra, técnica e fronteira',
  'summary-geografia-o-espaco-industrial-brasileiro-ii': 'desconcentração industrial',
};
