import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import './EngenhoScene.css';

// A linha do tempo de três cartões dizia "três momentos" de algo que o
// capítulo apresenta como três peças simultâneas da mesma sociedade. Aqui
// elas ocupam o mesmo engenho, e o recorte decide qual se acende: a
// hierarquia casa-grande/senzala (com o aviso historiográfico do próprio
// dado), a fuga para o quilombo, as roças e o artesanato que abastecem.
export function EngenhoScene({ index, label }: { index: number; label: string }) {
  const reduced = useReducedMotion() ?? false;
  const t = (d: number, delay = 0) => ({ duration: reduced ? 0 : d, delay: reduced ? 0 : delay, ease: [0.4, 0, 0.2, 1] as const });
  const focus = (i: number) => ({ initial: false as const, animate: { opacity: index === i ? 1 : 0.5 }, transition: t(0.4) });
  return <svg className="vs-plane" viewBox="0 0 460 260" role="img" aria-label={`Além do canavial: a sociedade colonial açucareira: ${label} em foco`} data-history-phase="dinamica-interna-colonizacao">
    <rect x="4" y="4" width="452" height="252" rx="12" className="en-sky" />
    <path d="M300 180C330 110 370 70 400 66C430 70 450 96 456 110V190H300Z" className="en-hill" />
    <path d="M4 186H456V224H4Z" className="en-field-bg" />
    {Array.from({ length: 26 }, (_, k) => <path key={k} d={`M${14 + k * 11} 222v-26m0 8l-5-5m5 12l5-5`} className="en-cane" />)}

    <motion.g {...focus(0)}>
      <path d="M150 74l48-26 48 26Z" className="en-roof" />
      <rect x="156" y="72" width="84" height="46" className="en-wall" />
      {[166, 186, 206, 226].map(x => <rect key={x} x={x - 4} y="80" width="8" height="10" className="en-window" />)}
      {[166, 186, 206, 226].map(x => <rect key={`d${x}`} x={x - 4} y="98" width="8" height="12" className="en-window" />)}
      <text x="198" y="42" textAnchor="middle" className="en-label">casa-grande</text>
      <path d="M142 146l66-10 66 10Z" className="en-roof-low" />
      <rect x="148" y="146" width="120" height="26" className="en-wall-low" />
      {[166, 196, 226, 252].map(x => <rect key={x} x={x - 4} y="156" width="8" height="16" className="en-door" />)}
      <text x="208" y="184" textAnchor="middle" className="en-label">senzala</text>
      <motion.path d="M120 84V160" className="en-hier" initial={false} animate={{ opacity: index === 0 ? 1 : 0, y: index === 0 ? 0 : -8 }} transition={t(0.6, 0.2)} />
      <motion.text x="126" y="131" className="en-hand" initial={false} animate={{ opacity: index === 0 ? 1 : 0 }} transition={t(0.4, 0.6)}>hierarquia</motion.text>
    </motion.g>

    <g>
      <rect x="282" y="138" width="36" height="34" className="en-mill" />
      <circle cx="326" cy="160" r="12" className="en-wheel" />
      <path d="M326 148v24M314 160h24M318 152l16 16M334 152l-16 16" className="en-wheel-spoke" />
      <text x="300" y="132" textAnchor="middle" className="en-small">engenho</text>
    </g>

    <motion.g {...focus(1)}>
      <path d="M376 104V82M386 104V78M396 104V80M406 104V76M416 104V82M426 104V80" className="en-palisade" />
      <path d="M392 98l8-6 8 6v6h-16Z" className="en-hut" />
      <text x="402" y="60" textAnchor="middle" className="en-label">quilombo</text>
      {[0, 1, 2].map(k => <motion.g key={k} initial={false}
        animate={index === 1 ? { x: 120 - k * 8, y: -58 + k * 4, opacity: 1 } : { x: 0, y: 0, opacity: index === 1 ? 1 : 0.4 }}
        transition={t(1.6, 0.3 + k * 0.3)}>
        <circle cx={262 + k * 6} cy="136" r="3.5" className="en-person-head" />
        <path d={`M${258 + k * 6} 150c0-7 2-10 4-10s4 3 4 10Z`} className="en-person" />
      </motion.g>)}
      <motion.text x="446" y="124" textAnchor="end" className="en-hand" initial={false} animate={{ opacity: index === 1 ? 1 : 0 }} transition={t(0.4, 1.4)}>Palmares, c. 1600–1695</motion.text>
    </motion.g>

    <motion.g {...focus(2)}>
      <path d="M30 140l22-16 22 16v30H30Z" className="en-hut" />
      <path d="M42 170v-12h10v12" className="en-door" />
      <text x="52" y="116" textAnchor="middle" className="en-label">roças e ofícios</text>
      {[0, 1, 2].map(k => <path key={k} d={`M${84 + k * 16} 172h12v-10h-12Z`} className="en-plot" />)}
      <motion.g initial={false} animate={index === 2 ? { x: [0, 110, 212], opacity: [1, 1, 0.9] } : { x: 0, opacity: 0.5 }} transition={t(1.8, 0.3)}>
        <path d="M70 180h14l-2 6h-10Z" className="en-basket" /><circle cx="74" cy="178" r="2.2" className="en-crop" /><circle cx="80" cy="178" r="2.2" className="en-crop" />
      </motion.g>
      <motion.text x="138" y="238" className="en-hand" initial={false} animate={{ opacity: index === 2 ? 1 : 0 }} transition={t(0.4, 1)}>livres pobres abastecem o engenho</motion.text>
    </motion.g>
    {index === 0 && <text x="20" y="242" className="en-small">leitura clássica (Freyre, 1933), depois criticada</text>}
    {index === 1 && <text x="20" y="242" className="en-small">fuga, quilombos, sabotagem, ritmo reduzido</text>}
  </svg>;
}
