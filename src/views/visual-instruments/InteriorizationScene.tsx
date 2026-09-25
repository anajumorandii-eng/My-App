import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import './InteriorizationScene.css';

// Contorno simplificado a partir de coordenadas reais (lon/lat em projeção
// retangular), não um mapa para medir: serve para situar litoral, interior e a
// linha de Tordesilhas. Cada recorte desenha só o vetor que o resumo descreve —
// bandeiras saindo de São Paulo (apresamento, depois metais), o eixo do ouro
// puxando gente e a capital para o Rio (1763), o gado subindo o São Francisco
// longe da faixa açucareira.
const OUTLINE = 'M114.4 21.0L179.2 26.5L182.8 53.2L200.8 61.9L231.0 68.7L272.8 76.1L296.6 89.2L298.7 103.4L272.8 133.8L267.8 163.6L259.8 179.1L247.6 195.8L239.0 195.2L216.6 202.0L200.8 224.3L189.3 238.6L165.5 262.1L135.3 240.4L164.1 220.6L156.9 211.3L154.0 202.0L133.8 189.6L132.4 152.4L118.0 136.9L82.0 115.2L17.9 99.1L24.4 81.1L46.7 79.2L67.6 43.9L92.8 40.8Z';
const RIVER = 'M218.8 176Q224 166 226.7 159T239.7 120Q248 112 258.4 110.7T287.9 117.5';

export function InteriorizationScene({ selected }: { selected: number }) {
  const reduced = useReducedMotion() ?? false;
  const t = (duration: number, delay = 0) => ({ duration: reduced ? 0 : duration, delay: reduced ? 0 : delay, ease: [0.4, 0, 0.2, 1] as const });
  const draw = (on: boolean, delay = 0) => ({ initial: false as const, animate: { pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }, transition: t(1.1, delay) });
  const bandeiras = selected === 0;
  const mineracao = selected === 1;
  const pecuaria = selected === 2;
  return <g className="it">
    <path d={OUTLINE} className="it-land" />
    <path d="M272.8 133.8C286 122 296 112 298.7 103.4S298 94 296.6 89.2" className="it-sugar" />
    <text x="306" y="62" className="it-small" textAnchor="end">faixa açucareira</text>
    <path d="M200.8 14V262" className="it-tordesilhas" />
    <text x="196" y="18" className="it-small" textAnchor="end">Tordesilhas (1494)</text>
    <path d={RIVER} className={pecuaria ? 'it-river it-river-on' : 'it-river'} />

    {[[213, 197, 'São Paulo', -6, 4], [239, 195, 'Rio', 7, 10], [272.8, 133.8, 'Salvador', -6, 12]].map(([x, y, name, dx, dy]) => <g key={name as string}>
      <circle cx={x as number} cy={y as number} r="3.5" className="it-city" />
      <text x={(x as number) + (dx as number)} y={(y as number) + (dy as number)} className="it-label" textAnchor={(dx as number) < 0 ? 'end' : 'start'}>{name}</text>
    </g>)}

    {/* Bandeiras */}
    <motion.path d="M213 197Q186 207 161 205" className="it-route" {...draw(bandeiras)} />
    <motion.path d="M213 197Q176 172 147 150" className="it-route" {...draw(bandeiras, 0.5)} />
    <motion.g initial={false} animate={{ opacity: bandeiras ? 1 : 0 }} transition={t(0.4, bandeiras ? 1 : 0)}>
      <text x="156" y="220" className="it-note" textAnchor="end">apresamento</text>
      <text x="141" y="146" className="it-note" textAnchor="end">metais</text>
    </motion.g>
    <motion.g initial={false} animate={bandeiras && !reduced ? { x: [0, -36, -66], y: [0, -26, -47] } : { x: bandeiras ? -66 : 0, y: bandeiras ? -47 : 0, opacity: bandeiras ? 1 : 0 }}
      transition={t(1.6, 0.5)}>
      <path d="M213 195v-16" className="it-pole" /><path d="M213 179l12 4-12 4Z" className="it-flag" />
    </motion.g>

    {/* Mineração */}
    <motion.path d="M239 195Q241 187 237 180" className="it-route" {...draw(mineracao)} />
    <motion.path d="M272.8 133.8Q270 172 242 193" className="it-capital" {...draw(mineracao, 0.9)} />
    <motion.g initial={false} animate={{ opacity: mineracao ? 1 : 0 }} transition={t(0.4, mineracao ? 0.6 : 0)}>
      {[[237, 180], [245, 174], [229, 174]].map(([x, y], k) => <path key={k} d={`M${x - 4} ${y + 3}v-4l4-3 4 3v4Z`} className="it-town" />)}
      <text x="228" y="186" className="it-note" textAnchor="end">Minas: vilas do ouro</text>
      <text x="306" y="230" className="it-note" textAnchor="end">capital → Rio, 1763</text>
    </motion.g>
    {[[272.8, 133.8], [239, 195], [298.7, 103.4]].map(([x, y], k) => <motion.circle key={k} r="3" className="it-people" initial={false}
      animate={mineracao ? { cx: [x, 237], cy: [y, 180], opacity: [1, 0.2] } : { cx: x, cy: y, opacity: 0 }}
      transition={mineracao && !reduced ? { duration: 1.8, delay: 0.3 + k * 0.3, repeat: Infinity, repeatDelay: 0.4 } : t(0)} />)}

    {/* Pecuária */}
    {[0, 1].map(k => <motion.g key={k} initial={false}
      animate={pecuaria ? { x: [0, -30 - k * 10], y: [0, 2 + k * 6], opacity: 1 } : { x: 0, y: 0, opacity: 0 }}
      transition={t(1.6, 0.3 + k * 0.4)}>
      <path d={`M${278 - k * 10} ${104 + k * 3}h10a3 3 0 0 1 3 3v3h-16v-3a3 3 0 0 1 3-3Z`} className="it-cattle" />
      <path d={`M${275 - k * 10} ${110 + k * 3}v4m12-4v4M${288 - k * 10} ${104 + k * 3}l3-3`} className="it-cattle-leg" />
    </motion.g>)}
    <motion.g initial={false} animate={{ opacity: pecuaria ? 1 : 0 }} transition={t(0.4, pecuaria ? 1 : 0)}>
      <text x="232" y="96" className="it-note" textAnchor="end">sertão · rio São Francisco</text>
    </motion.g>

    <text x="16" y="276" className="it-small">contorno simplificado; posições aproximadas</text>
  </g>;
}
