import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { GeographyContext } from '../../lib/geographyContextLab';
import './GeographyContextDiagrams.css';

export const GEOGRAPHY_CONTEXT_DIAGRAM_IDS: ReadonlySet<string> = new Set([
  'summary-geografia-energia-eletrica-no-brasil',
  'summary-geografia-estrutura-etnica-e-fluxos-migratorios',
  'summary-geografia-os-fluxos-do-comercio-externo',
  'summary-geografia-combustiveis-fosseis-e-biocombustiveis-no-brasil',
]);

// Antes os quatro capítulos dividiam a mesma fôrma — três abas, um holofote
// que deslizava entre três caixas e um ícone trocado —, o que a régua de
// 25/09 recusa como personalização. Cada cena agora desenha o seu próprio
// mecanismo, e o recorte escolhido decide o que se move.
type Scene = { i: number; reduced: boolean };

function pace(reduced: boolean, duration: number, delay = 0) {
  return { duration: reduced ? 0 : duration, delay: reduced ? 0 : delay, ease: [0.4, 0, 0.2, 1] as const };
}

/** Repetição só enquanto o recorte que ela explica está em foco. */
function loop(reduced: boolean, on: boolean, duration: number, delay = 0) {
  return reduced || !on ? pace(true, 0) : { duration, delay, repeat: Infinity, ease: 'linear' as const };
}

function Electricity({ i, reduced }: Scene) {
  const cable = [[62, 136], [97, 148], [132, 138], [160, 150], [188, 138], [214, 150], [238, 146]];
  const xs = cable.map(p => p[0]);
  const ys = cable.map(p => p[1]);
  const captions = ['fontes com ritmos e lugares diferentes', 'linhas conectam, mas têm limite e perdas', 'o consumo muda ao longo do dia'];
  return <g>
    <text x="160" y="32" textAnchor="middle" className="gcd-note">oferta ↔ demanda</text>
    <motion.g initial={false} animate={{ rotate: i === 0 ? -6 : i === 2 ? 6 : 0 }} transition={pace(reduced, 0.6)} style={{ transformOrigin: '160px 50px' }}>
      <path d="M128 50H192M128 50l-7 12h14ZM192 50l-7 12h14Z" className="gcd-line" />
      <circle cx="128" cy="64" r="3" className="gcd-spark" /><rect x="186" y="60" width="12" height="6" rx="1" className="gcd-window" />
    </motion.g>
    <path d="M160 50l-6 12h12Z" className="gcd-pivot" />
    <path d="M14 205H306" className="gcd-ground" />
    <path d="M16 128h24v77H16Z" className="gcd-water" />
    <path d="M40 120h12l10 85H40Z" className="gcd-dam" />
    <text x="40" y="222" textAnchor="middle" className="gcd-small">hidrelétrica</text>
    <path d="M98 205V122" className="gcd-line" />
    <motion.g initial={false} animate={i === 0 && !reduced ? { rotate: 360 } : { rotate: 0 }} transition={loop(reduced, i === 0, 3)} style={{ transformOrigin: '98px 120px' }}>
      <path d="M98 120V96M98 120l21 12M98 120l-21 12" className="gcd-blade" />
    </motion.g>
    <circle cx="98" cy="120" r="3.5" className="gcd-pivot" />
    <text x="100" y="222" textAnchor="middle" className="gcd-small">eólica</text>
    {[132, 188].map(x => <path key={x} d={`M${x - 10} 205L${x} 132l10 73M${x - 13} 146h26M${x - 9} 166h18`} className="gcd-tower" />)}
    <path d={`M${cable.map(p => p.join(' ')).join(' L')}`} className="gcd-cable" />
    {[0, 1, 2].map(k => <motion.circle key={k} r="4" className="gcd-spark" initial={false}
      animate={i === 1 && !reduced ? { cx: xs, cy: ys, r: [4.5, 4.3, 4, 3.7, 3.4, 3.1, 2.8] } : { cx: xs[2 + k * 2], cy: ys[2 + k * 2], r: 3.5 }}
      transition={loop(reduced, i === 1, 2.4, k * 0.8)} />)}
    {[[238, 150, 24, 55], [266, 116, 20, 89], [290, 138, 16, 67]].map(([x, y, w, h]) => <rect key={x} x={x} y={y} width={w} height={h} className="gcd-object" />)}
    {[[243, 160], [253, 160], [243, 176], [253, 176], [271, 128], [279, 128], [271, 146], [279, 146], [271, 164], [279, 164], [294, 150], [294, 168]].map(([x, y], k) =>
      <motion.rect key={k} x={x} y={y} width="6" height="8" className="gcd-window" initial={false} animate={{ opacity: i === 2 ? (k % 3 === 0 ? 0.35 : 1) : 0.55 }} transition={pace(reduced, 0.4, i === 2 ? k * 0.05 : 0)} />)}
    <motion.g initial={false} animate={{ opacity: i === 2 ? 1 : 0 }} transition={pace(reduced, 0.4)}>
      <path d="M150 240H300M150 240V214" className="gcd-axis" />
      <motion.path d="M150 236C170 237 182 234 196 230S228 228 240 226S266 210 276 212S292 232 300 234" className="gcd-curve"
        initial={false} animate={{ pathLength: i === 2 ? 1 : 0 }} transition={pace(reduced, 1.2, 0.2)} />
      <text x="152" y="211" className="gcd-small">0h</text><text x="298" y="211" textAnchor="end" className="gcd-small">24h</text>
    </motion.g>
    <text x="160" y="256" textAnchor="middle" className="gcd-caption">{captions[i]}</text>
  </g>;
}

function Migration({ i, reduced }: Scene) {
  const arcX = [70, 104, 140, 176, 206, 224];
  const arcY = [150, 116, 100, 100, 118, 146];
  const walker = i === 0 ? 0 : i === 2 ? 5 : 2;
  return <g>
    <text x="160" y="32" textAnchor="middle" className="gcd-note">transporte + redes de apoio</text>
    <path d="M14 205H306" className="gcd-ground" />
    <path d="M24 205v-44l27-22 28 22v44Z" className="gcd-object" /><path d="M44 205v-22h14v22" className="gcd-line" />
    <text x="51" y="222" textAnchor="middle" className="gcd-small">origem</text>
    {['trabalho', 'família', 'moradia'].map((w, k) => <motion.text key={w} x="18" y={70 + k * 13} className="gcd-tag" initial={false}
      animate={{ opacity: i === 0 ? 1 : 0.3, x: i === 0 ? 0 : -4 }} transition={pace(reduced, 0.4, i === 0 ? k * 0.12 : 0)}>{w}</motion.text>)}
    <path d="M84 158C120 88 200 88 232 158" className="gcd-route" />
    {[[108, 112, 'informação'], [160, 96, 'transporte'], [210, 112, 'apoio']].map(([x, y, w], k) => <motion.g key={w as string} initial={false}
      animate={{ opacity: i >= 1 ? 1 : 0.3, scale: i === 1 ? 1 : 0.85 }} transition={pace(reduced, 0.4, i === 1 ? 0.3 + k * 0.2 : 0)}
      style={{ transformOrigin: `${x}px ${y}px` }}>
      <circle cx={x as number} cy={y as number} r="7" className="gcd-waypoint" />
      <text x={x as number} y={(y as number) - 12} textAnchor="middle" className="gcd-small">{w}</text>
    </motion.g>)}
    <motion.g initial={false} animate={i === 1 && !reduced ? { x: arcX.map(v => v - 70), y: arcY.map(v => v - 150) } : { x: arcX[walker] - 70, y: arcY[walker] - 150 }}
      transition={pace(reduced, 1.8)}>
      <circle cx="70" cy="138" r="5" className="gcd-person-head" />
      <path d="M64 158c0-9 3-14 6-14s6 5 6 14Z" className="gcd-person" />
      <rect x="75" y="148" width="6" height="7" rx="1" className="gcd-bag" />
    </motion.g>
    {[[238, 150, 24, 55], [266, 118, 22, 87], [292, 140, 14, 65]].map(([x, y, w, h]) => <rect key={x} x={x} y={y} width={w} height={h} className="gcd-object" />)}
    <text x="266" y="222" textAnchor="middle" className="gcd-small">destino</text>
    <path d="M232 214C188 240 128 240 86 214" className="gcd-return" />
    <motion.g initial={false} animate={i === 2 && !reduced ? { x: [0, -70, -140], y: [0, 17, 0] } : { x: i === 2 ? -140 : 0, y: 0 }}
      transition={loop(reduced, i === 2, 2.6)}>
      <rect x="222" y="206" width="14" height="10" rx="1.5" className="gcd-envelope" /><path d="M222 207l7 5 7-5" className="gcd-envelope-flap" />
    </motion.g>
    <text x="160" y="256" textAnchor="middle" className="gcd-caption">vínculos com a origem podem continuar</text>
  </g>;
}

function Trade({ i, reduced }: Scene) {
  const captions = ['o que se exporta depende do que o território produz', 'estradas, portos e gargalos somam custo', 'poucos produtos ou parceiros: mais vulnerabilidade'];
  const legs = [[0, 16, 'produto'], [1, 13, 'estrada'], [1, 13, 'porto'], [2, 13, 'frete']] as const;
  return <g>
    <text x="160" y="32" textAnchor="middle" className="gcd-note">o custo do corredor altera o preço final</text>
    <path d="M14 196H150" className="gcd-ground" />
    <path d="M150 204C200 200 250 208 306 204V240H150Z" className="gcd-sea" />
    <path d="M160 222q12-6 24 0t24 0t24 0t24 0" className="gcd-wave" />
    {[150, 160, 170, 180].map(y => <path key={y} d={`M18 ${y}h40`} className="gcd-crop" />)}
    <path d="M62 196v-44h14v44M62 152a7 7 0 0 1 14 0" className="gcd-object" />
    <text x="44" y="214" textAnchor="middle" className="gcd-small">produção</text>
    <path d="M80 196H146" className="gcd-road" />
    <motion.g initial={false} animate={{ x: i === 0 ? 0 : 62 }} transition={pace(reduced, 1.4)}>
      <rect x="80" y="178" width="18" height="12" rx="1.5" className="gcd-cargo" /><path d="M98 182h7l3 4v4H98Z" className="gcd-object" />
      <circle cx="85" cy="192" r="3" className="gcd-wheel" /><circle cx="102" cy="192" r="3" className="gcd-wheel" />
    </motion.g>
    <path d="M156 196V120M156 124h30M186 124v16" className="gcd-crane" />
    <text x="162" y="112" className="gcd-small">porto</text>
    <motion.g initial={false} animate={{ x: i === 2 ? 70 : 0 }} transition={pace(reduced, 1.6, 0.2)}>
      <path d="M160 204h56l-8 12h-40Z" className="gcd-ship" /><rect x="176" y="192" width="12" height="12" className="gcd-cargo" /><rect x="190" y="192" width="12" height="12" className="gcd-cargo" />
    </motion.g>
    {[[262, 150, 18, 44], [284, 132, 20, 62]].map(([x, y, w, h]) => <rect key={x} x={x} y={y} width={w} height={h} className="gcd-object" />)}
    <text x="283" y="124" textAnchor="middle" className="gcd-small">mercado</text>
    <g>
      <text x="28" y="50" className="gcd-small">preço final</text>
      {legs.map(([from, h, w], k) => {
        const yTop = 112 - legs.slice(0, k + 1).reduce((s, l) => s + l[1], 0);
        return <motion.g key={w} initial={false} animate={{ opacity: i >= from ? 1 : 0.15 }} transition={pace(reduced, 0.4, i >= from ? 0.4 + k * 0.25 : 0)}>
          <rect x="28" y={yTop} width="22" height={h} className={k === 0 ? 'gcd-price-base' : 'gcd-price-leg'} />
          <text x="56" y={yTop + h - 2} className="gcd-small">{w}</text>
        </motion.g>;
      })}
    </g>
    <text x="160" y="256" textAnchor="middle" className="gcd-caption">{captions[i]}</text>
  </g>;
}

function Fuels({ i, reduced }: Scene) {
  // O que o esquema compara é para onde vai o carbono, não quanto: por isso
  // os pontos não têm escala, e a legenda da faixa diz só o sentido do saldo.
  const band = ['entra carbono antigo', 'o mesmo carbono circula', 'o ciclo acrescenta emissões'];
  return <g>
    <text x="160" y="32" textAnchor="middle" className="gcd-note">carbono recente não zera impactos</text>
    <rect x="14" y="42" width="292" height="30" rx="8" className="gcd-air" />
    <text x="20" y="54" className="gcd-small">atmosfera</text>
    <motion.text x="300" y="66" textAnchor="end" className="gcd-small" key={i} initial={{ opacity: reduced ? 1 : 0 }} animate={{ opacity: 1 }} transition={pace(reduced, 0.4, 0.8)}>{band[i]}</motion.text>
    <path d="M14 176H306" className="gcd-ground" />
    <path d="M22 206q40-10 90 0v26q-50 8-90 0Z" className="gcd-fossil" />
    <text x="67" y="224" textAnchor="middle" className="gcd-fossil-label">fóssil</text>
    <path d="M60 206V176M52 176l8-54 8 54M54 150h12" className="gcd-line" />
    {[0, 1, 2, 3, 4].map(k => <motion.circle key={`f${k}`} r="3.5" className="gcd-carbon-old" initial={false}
      animate={i === 0 ? { cx: 100 + (k - 2) * 14, cy: 60 } : { cx: 60, cy: 214 }} transition={pace(reduced, 1.2, i === 0 ? k * 0.15 : 0)} />)}
    <path d="M160 176v-48M150 176v-38M170 176v-42M160 146q-16-6-16-20M150 156q-12 0-16-12M170 150q14-4 14-18" className="gcd-cane" />
    <path d="M186 170C200 130 200 100 188 76M140 80C128 104 128 138 142 170" className="gcd-return" />
    {[0, 1, 2].map(k => <motion.circle key={`r${k}`} r="3.5" className="gcd-carbon-new" initial={false}
      animate={i === 1 && !reduced ? { cx: [140, 136, 160, 186, 190, 186, 160, 140], cy: [168, 120, 150, 168, 120, 76, 62, 80] } : { cx: 150 + k * 10, cy: i === 1 ? 62 : 140 + k * 8 }}
      transition={loop(reduced, i === 1, 3.2, k * 1)} />)}
    <text x="160" y="196" textAnchor="middle" className="gcd-small">cana, soja</text>
    <path d="M226 176v-16h22l6 8v8ZM230 160v-8h10v8" className="gcd-object" /><circle cx="232" cy="178" r="5" className="gcd-wheel" /><circle cx="250" cy="178" r="3.5" className="gcd-wheel" />
    <path d="M266 176v-14h22v14ZM288 166h10l4 5v5h-14" className="gcd-object" /><circle cx="272" cy="178" r="3.5" className="gcd-wheel" /><circle cx="296" cy="178" r="3.5" className="gcd-wheel" />
    {[[236, 0], [292, 1]].map(([x, k]) => <motion.circle key={`c${k}`} r="3.5" className="gcd-carbon-extra" initial={false}
      animate={i === 2 ? { cx: x - 10 + k * 20, cy: 62 } : { cx: x, cy: 150 }} transition={pace(reduced, 1.1, i === 2 ? 0.3 + k * 0.3 : 0)} />)}
    <text x="264" y="196" textAnchor="middle" className="gcd-small">manejo e transporte</text>
    <text x="160" y="256" textAnchor="middle" className="gcd-caption">solo, cultivo e transporte mudam o balanço</text>
  </g>;
}

const drawings: Record<string, React.ComponentType<Scene>> = {
  'summary-geografia-energia-eletrica-no-brasil': Electricity,
  'summary-geografia-estrutura-etnica-e-fluxos-migratorios': Migration,
  'summary-geografia-os-fluxos-do-comercio-externo': Trade,
  'summary-geografia-combustiveis-fosseis-e-biocombustiveis-no-brasil': Fuels,
};

export function GeographyContextDiagram({ config, index }: { config: GeographyContext; index: number }) {
  const reduced = useReducedMotion() ?? false;
  const Drawing = drawings[config.chapterId];
  return <svg className="vs-plane gcd-diagram" viewBox="0 0 320 270" role="img" aria-label={`${config.title}: ${config.cases[index].label} em foco`} data-geography-context={config.chapterId}>
    <rect x="6" y="7" width="308" height="255" rx="12" className="gcd-paper" />
    <Drawing i={index} reduced={reduced} />
  </svg>;
}
