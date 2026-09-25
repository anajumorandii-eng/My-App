import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import './MiningColonyScene.css';

// Os três recortes do instrumento são momentos do mesmo circuito fiscal, e o
// resumo sustenta cada um: o quinto é 20% do ouro extraído; as Casas de
// Fundição devolvem o restante em barras seladas e tornam ilegal o pó que não
// passou por elas; a derrama cobra de todos a diferença até a cota anual.
// Nenhuma quantidade aqui é histórica — cinco barras são a fração, não a
// produção, e a cota é uma barra sem escala.
export function MiningColonyScene({ selected }: { selected: number }) {
  const reduced = useReducedMotion() ?? false;
  const t = (duration: number, delay = 0) => ({ duration: reduced ? 0 : duration, delay: reduced ? 0 : delay, ease: [0.4, 0, 0.2, 1] as const });
  const quinto = selected === 0;
  const fundicao = selected === 1;
  const derrama = selected === 2;
  return <g data-history-system="mining-colony" className="mc">
    <circle cx="44" cy="44" r="16" className="mc-sun" />
    <path d="M0 205C50 170 95 178 140 196C190 168 250 160 320 184V300H0Z" className="mc-hill-back" />
    <path d="M0 226C70 206 140 218 200 222C250 214 290 212 320 218V300H0Z" className="mc-hill" />
    <path d="M0 256C50 248 90 262 150 256S250 248 320 256V272H0Z" className="mc-river" />
    <text x="10" y="268" className="mc-small">rio · cascalho aurífero</text>

    <ellipse cx="40" cy="238" rx="26" ry="7" className="mc-pan" /><ellipse cx="40" cy="236.5" rx="18" ry="4" className="mc-pan-inner" />
    <circle cx="35" cy="236" r="1.4" className="mc-gold" /><circle cx="42" cy="237" r="1.2" className="mc-gold" /><circle cx="47" cy="235.5" r="1.3" className="mc-gold" />
    <path d="M66 226c-7-15-1-29 11-31 12 2 17 16 10 31Z" className="mc-sack" /><path d="M71 197h12" className="mc-sack-tie" />
    <text x="77" y="217" textAnchor="middle" className="mc-tiny">pó</text>

    <g className={fundicao ? 'mc-house mc-house-on' : 'mc-house'}>
      <rect x="170" y="98" width="13" height="34" className="mc-wall-dark" />
      <path d="M112 136l48-32 48 32Z" className="mc-roof" />
      <rect x="118" y="134" width="84" height="70" className="mc-wall" />
      <path d="M150 204v-24a10 10 0 0 1 20 0v24Z" className="mc-wall-dark" />
      <rect x="126" y="152" width="17" height="15" rx="2" className="mc-furnace" />
      <rect x="123" y="139" width="74" height="11" rx="2" className="mc-plate-bg" />
      <text x="160" y="147.5" textAnchor="middle" className="mc-plate">CASA DE FUNDIÇÃO</text>
      <motion.g initial={false} animate={{ opacity: fundicao ? 0.85 : 0 }} transition={t(0.5, 0.6)}>
        <circle cx="176" cy="88" r="6" className="mc-smoke" /><circle cx="182" cy="74" r="8" className="mc-smoke" /><circle cx="177" cy="58" r="9.5" className="mc-smoke" />
      </motion.g>
    </g>

    <g>
      <rect x="244" y="82" width="56" height="34" rx="4" className="mc-chest" />
      <rect x="244" y="92" width="56" height="4" className="mc-chest-band" />
      <rect x="267" y="96" width="10" height="8" rx="2" className="mc-lock" />
      <path d="M252 76L256 56l9 10 7-16 7 16 9-10 4 20Z" className="mc-crown" />
      <rect x="252" y="75" width="40" height="5" rx="1.5" className="mc-crown-band" />
      <circle cx="272" cy="50" r="2.6" className="mc-jewel" />
      <text x="272" y="130" textAnchor="middle" className="mc-label">Coroa</text>
    </g>

    {/* O quinto: cinco barras, uma segue para a Coroa. */}
    <motion.g initial={false} animate={{ opacity: quinto ? 1 : 0 }} transition={t(0.35)}>
      {[0, 1, 2, 3, 4].map(k => <motion.g key={k} initial={false}
        animate={k === 4 && quinto ? { x: 82, y: 14 } : { x: 0, y: 0 }} transition={t(1, 0.5)}>
        <path d={`M${92 + k * 22} 72h16l3 9h-22Z`} className="mc-bar" />
      </motion.g>)}
      <path d="M200 52c20-12 36-12 48 0" className="mc-hand-arrow" />
      <text x="206" y="44" className="mc-hand">1 de cada 5</text>
      <text x="92" y="100" className="mc-small">o ouro extraído</text>
    </motion.g>

    {/* Casas de Fundição: o pó entra, barras seladas saem; o desvio é ilegal. */}
    <motion.g initial={false} animate={{ opacity: fundicao ? 1 : 0 }} transition={t(0.35)}>
      {[0, 1, 2, 3, 4].map(k => <motion.circle key={k} r="2.4" className="mc-gold" initial={false}
        animate={fundicao ? { cx: 160, cy: 196, opacity: 0 } : { cx: 74 + (k % 3) * 5, cy: 206 + k * 2, opacity: 1 }}
        transition={t(1, k * 0.1)} />)}
      {[0, 1, 2, 3].map(k => <motion.g key={k} initial={false}
        animate={{ opacity: fundicao ? 1 : 0, y: fundicao ? 0 : 8 }} transition={t(0.4, 1.1 + k * 0.12)}>
        <path d={`M${226 + (k % 2) * 30} ${204 - Math.floor(k / 2) * 12}h18l3 9h-24Z`} className="mc-bar" />
        <circle cx={238 + (k % 2) * 30} cy={208.5 - Math.floor(k / 2) * 12} r="3" className="mc-seal" />
      </motion.g>)}
      <text x="226" y="226" className="mc-small">barras seladas</text><text x="226" y="237" className="mc-small">circulam</text>
      <path d="M90 222C120 242 200 244 222 238" className="mc-illegal" />
      <path d="M150 234l8 8M158 234l-8 8" className="mc-cross" />
      <text x="96" y="250" className="mc-small mc-warn">pó sem selo: ilegal</text>
    </motion.g>

    {/* Derrama: a arrecadação ficou abaixo da cota; a diferença sai de todos. */}
    <motion.g initial={false} animate={{ opacity: derrama ? 1 : 0 }} transition={t(0.35)}>
      <rect x="226" y="154" width="84" height="16" rx="3" className="mc-quota" />
      <rect x="226" y="154" width="54" height="16" rx="3" className="mc-quota-fill" />
      <motion.rect x="280" y="154" height="16" className="mc-quota-gap" initial={false}
        animate={{ width: derrama ? 30 : 0 }} transition={t(0.6, 1.6)} />
      <text x="226" y="149" className="mc-small">cota anual</text>
      <text x="226" y="183" className="mc-small mc-warn">diferença cobrada</text><text x="226" y="194" className="mc-small mc-warn">de todos</text>
      {[[22, 150], [52, 160], [86, 150]].map(([x, y], k) => <g key={k}>
        <path d={`M${x} ${y + 26}v-16l12-9 12 9v16Z`} className="mc-village" />
        <motion.circle r="4" className="mc-coin" initial={false}
          animate={derrama ? { cx: [x + 12, 180, 294], cy: [y + 8, 110, 162], opacity: [1, 1, 0] } : { cx: x + 12, cy: y + 8, opacity: 0 }}
          transition={t(1.4, 0.2 + k * 0.2)} />
      </g>)}
      <text x="14" y="196" className="mc-small">vilas e moradores</text>
    </motion.g>
  </g>;
}
