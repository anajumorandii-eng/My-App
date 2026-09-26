import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import type { SceneEntry } from '../types';
import './HistoriaGeografia.css';
import './GeografiaFisica.css';
import { ClimateMap, DomainsMap, EarthSeasons, ReliefProfile, RockCycle, SoilProfiles } from './GeografiaFisica';
import './BrasilImperio.css';
import { EmpireDecline, OligarchicDecline, OligarchyPyramid, RegencyRevolts, StateFormation } from './BrasilImperio';
import { HEADERS_LOTE5, SCENES_LOTE5 } from './Populacao';
import { HEADERS_LOTE6, SCENES_LOTE6 } from './EraVargas';
import { HEADERS_LOTE7A, SCENES_LOTE7A } from './Antiguidade';
import { HEADERS_LOTE7B, SCENES_LOTE7B } from './IdadeModerna';
import { HEADERS_LOTE8, SCENES_LOTE8 } from './SeculoXX';
import { HEADERS_LOTE9, SCENES_LOTE9 } from './GeografiaMundial';
import { HEADERS_LOTE10, SCENES_LOTE10 } from './EconomiaGlobal';

const BASE_IDS = [
  'summary-historia-revolucao-francesa',
  'summary-historia-revolucao-industrial',
  'summary-geografia-projecoes-cartograficas',
  'summary-geografia-dinamica-climatica',
  'summary-historia-grandes-navegacoes-e-conquista-colonial',
  'summary-historia-a-montagem-da-colonizacao',
  'summary-historia-a-crise-do-antigo-sistema-colonial',
  'summary-geografia-movimentos-da-terra',
  'summary-geografia-relevo-brasileiro',
  'summary-geografia-pedologia',
  'summary-geografia-climatologia-do-brasil',
  'summary-geografia-dominios-morfoclimaticos',
  'summary-geografia-geologia-e-geomorfologia',
  'summary-historia-brasil-imperio-formacao-do-estado-nacional-brasileiro',
  'summary-historia-brasil-imperio-o-periodo-regencial-1831-1840',
  'summary-historia-brasil-imperio-o-declinio-do-segundo-reinado',
  'summary-historia-ascensao-e-dominio-das-oligarquias',
  'summary-historia-a-primeira-republica-o-declinio-oligarquico-1889-1930',
];

// Cenas que cuidam do próprio ritmo (usePaced) e só precisam do recorte.
const SELF_PACED: Record<string, React.ComponentType<{ active: number }>> = {
  'summary-historia-brasil-imperio-formacao-do-estado-nacional-brasileiro': StateFormation,
  'summary-historia-brasil-imperio-o-periodo-regencial-1831-1840': RegencyRevolts,
  'summary-historia-brasil-imperio-o-declinio-do-segundo-reinado': EmpireDecline,
  'summary-historia-ascensao-e-dominio-das-oligarquias': OligarchyPyramid,
  'summary-historia-a-primeira-republica-o-declinio-oligarquico-1889-1930': OligarchicDecline,
  ...SCENES_LOTE5,
  ...SCENES_LOTE6,
  ...SCENES_LOTE7A,
  ...SCENES_LOTE7B,
  ...SCENES_LOTE8,
  ...SCENES_LOTE9,
  ...SCENES_LOTE10,
};

// Rótulo do cabeçalho quando a cena não é de cronologia nem de geografia física.
const HEADERS: Record<string, string> = {
  ...HEADERS_LOTE5,
  ...HEADERS_LOTE6,
  ...HEADERS_LOTE7A,
  ...HEADERS_LOTE7B,
  ...HEADERS_LOTE8,
  ...HEADERS_LOTE9,
  ...HEADERS_LOTE10,
};

export const HISTORIA_GEOGRAFIA_IDS: ReadonlySet<string> = new Set([...BASE_IDS, ...Object.keys(SELF_PACED)]);

const FISICA: Record<string, React.ComponentType<{ active: number }>> = {
  'summary-geografia-movimentos-da-terra': EarthSeasons,
  'summary-geografia-relevo-brasileiro': ReliefProfile,
  'summary-geografia-pedologia': SoilProfiles,
  'summary-geografia-climatologia-do-brasil': ClimateMap,
  'summary-geografia-dominios-morfoclimaticos': DomainsMap,
  'summary-geografia-geologia-e-geomorfologia': RockCycle,
};

type SceneTransition = ReturnType<typeof useSceneMotion>;

// Sob movimento reduzido useSceneMotion devolve duração zero; mantê-la zero
// aqui é o que faz a cena pular direto para o estado final, completo e
// legível parado.
function paced(t: SceneTransition, duration: number, delay = 0) {
  return t.duration === 0 ? t : { ...t, duration, delay };
}

function FrenchRevolution({ active, t }: { active: number; t: SceneTransition }) {
  const stops = [88, 235, 382, 529];
  const labels = [
    ['crise fiscal', '1789'],
    ['Assembleia', 'jun. 1789'],
    ['Bastilha', 'jul. 1789'],
    ['Terror', '1793–94'],
  ];
  // Ícones desenhados para cada elo: déficit, juramento da Assembleia,
  // fortaleza e guilhotina. O elo ativo acende; os anteriores ficam acesos
  // porque a cadeia é cumulativa — o Terror não se explica sem os três antes.
  const icons = [
    <g key="fiscal"><path d="M-20 22h40M-16 22V12h9v10M-3 22V4h9v18M10 22V-4h9v26" className="hg-icon-coin" /><path d="M-24 -18l14 12 10-7 22 18" className="hg-icon-down" /><path d="M16 1l6 4-1-7" className="hg-icon-down" /></g>,
    <g key="assembleia"><path d="M-24 -6L0 -22L24 -6Z" className="hg-icon-roof" /><path d="M-20 -6h40v4h-40zM-16 -2v22M-6 -2v22M6 -2v22M16 -2v22M-22 20h44" className="hg-icon-stone" /></g>,
    <g key="bastilha"><path d="M-22 22V-8h-4v-8h7v5h5v-5h6v5h5v-5h6v5h5v-5h7v8h-4v30Z" className="hg-icon-stone" /><path d="M-6 22v-12a6 6 0 0 1 12 0v12" className="hg-icon-door" /><path d="M-15 -2h5v6h-5zM10 -2h5v6h-5z" className="hg-icon-door" /></g>,
    <g key="terror"><path d="M-14 24V-20M14 24V-20M-18 -20h36M-20 24h40" className="hg-icon-wood" /><path d="M-12 -14h24l-24 12Z" className="hg-icon-blade" /></g>,
  ];
  const progress = active / 3;
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Revolução Francesa: crise fiscal, Assembleia Nacional, Bastilha e Terror; etapa ${active + 1} destacada`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="hg-paper" />
    <text x="30" y="43" className="hg-kicker">FRANÇA · 1789–1794</text>
    <text x="590" y="43" textAnchor="end" className="hg-hand">elo a elo</text>
    {stops.map((x, i) => <motion.g key={`icon-${x}`} className="hg-icon" initial={false}
      animate={{ opacity: i <= active ? 1 : 0.35, y: i === active ? -4 : 0 }} transition={paced(t, 0.5, i === active ? 0.35 : 0)}>
      <g transform={`translate(${x} 112)`}>{icons[i]}</g>
    </motion.g>)}
    <path d="M88 180H529" className="hg-timeline" />
    <motion.path d="M88 180H529" className="hg-timeline-progress" initial={false} animate={{ pathLength: Math.max(progress, 0.001) }} transition={paced(t, 0.9)} />
    {stops.map((x, i) => <g key={x} className={i === active ? 'hg-stop hg-stop-active' : i < active ? 'hg-stop hg-stop-past' : 'hg-stop'}>
      <circle cx={x} cy="180" r="21" />
      <text x={x} y="186" textAnchor="middle" className="hg-number">{i + 1}</text>
      <text x={x} y="224" textAnchor="middle" className="hg-date">{labels[i][1]}</text>
      <text x={x} y="246" textAnchor="middle" className="hg-label">{labels[i][0]}</text>
    </g>)}
    <motion.g initial={false} animate={{ x: stops[active] - stops[0] }} transition={paced(t, 0.9)}>
      <circle cx="88" cy="180" r="30" className="hg-cockade-ring" />
    </motion.g>
    <motion.g initial={false} animate={{ opacity: active >= 1 ? 1 : 0.25 }} transition={paced(t, 0.4, 0.5)}>
      <path d="M88 262V274H235V262" className="hg-bracket" />
      <text x="161" y="293" textAnchor="middle" className="hg-annotation">conflito fiscal e político</text>
    </motion.g>
    <motion.g initial={false} animate={{ opacity: active >= 3 ? 1 : 0.25 }} transition={paced(t, 0.4, 0.6)}>
      <path d="M382 262V274H529V262" className="hg-bracket hg-bracket-late" />
      <text x="455" y="293" textAnchor="middle" className="hg-annotation">radicalização, sem causa única</text>
    </motion.g>
    <text x="30" y="332" className="hg-footnote">guerra externa + desconfiança interna → contexto do Terror</text>
  </svg>;
}

function ProjectionComparison({ active, t }: { active: number; t: SceneTransition }) {
  const centers = [108, 310, 512];
  const titles = ['CONFORME', 'EQUIVALENTE', 'EQUIDISTANTE'];
  // Indicatriz de Tissot: o mesmo círculo pequeno do globo, redesenhado por
  // cada projeção. Na conforme ele continua círculo mas cresce com a
  // latitude; na equivalente achata sem mudar de área (π·11·5,8 ≈ π·8²).
  const conformal = [[118, 12], [141, 8.5], [166, 6], [191, 8.5], [214, 12]];
  const equalArea = [[130, 11, 5.8], [166, 8, 8], [202, 11, 5.8]];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Propriedades cartográficas comparadas: conforme preserva forma local, equivalente preserva área, equidistante preserva distâncias desde um centro; ${titles[active].toLowerCase()} selecionada`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="hg-paper" />
    <text x="30" y="39" className="hg-kicker">A ESCOLHA DA PROJEÇÃO MUDA O QUE SE PRESERVA</text>
    {centers.map((x, i) => <g key={x} className={active === i ? 'hg-projection hg-projection-active' : 'hg-projection'}>
      <rect x={x - 91} y="55" width="182" height="248" rx="13" className="hg-panel" />
      <text x={x} y="82" textAnchor="middle" className="hg-panel-title">{titles[i]}</text>
      {i === 0 && <g>
        <rect x={x - 60} y="105" width="120" height="122" className="hg-map-shape" />
        {[125, 147, 169, 195].map(y => <path key={y} d={`M${x - 60} ${y}H${x + 60}`} className="hg-graticule" />)}
        <path d={`M${x - 30} 105V227M${x} 105V227M${x + 30} 105V227`} className="hg-graticule" />
        <path d={`M${x - 40} 116q17-10 29 5l-6 14-22-4Zm15 51q22-6 35 8l-10 22-23-4Z`} className="hg-land" />
        {conformal.map(([cy, r], k) => <motion.circle key={cy} cx={x + 32} cy={cy} r={r} className="hg-tissot"
          initial={false} animate={{ scale: active === i ? 1 : 0.85, opacity: active === i ? 1 : 0.55 }}
          transition={paced(t, 0.45, active === i ? 0.08 * k : 0)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />)}
      </g>}
      {i === 1 && <g>
        <ellipse cx={x} cy="166" rx="65" ry="61" className="hg-map-shape" />
        <path d={`M${x - 65} 166H${x + 65}M${x - 54} 135H${x + 54}M${x - 54} 197H${x + 54}M${x} 105V227`} className="hg-graticule" />
        <path d={`M${x - 34} 121q17-11 31 4l-11 14-18-3Zm9 44q26-7 39 9l-12 21-28-5Z`} className="hg-land" />
        {equalArea.map(([cy, rx, ry], k) => <motion.ellipse key={cy} cx={x + 30} cy={cy} rx={rx} ry={ry} className="hg-tissot"
          initial={false} animate={{ scale: active === i ? 1 : 0.85, opacity: active === i ? 1 : 0.55 }}
          transition={paced(t, 0.45, active === i ? 0.1 * k : 0)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />)}
      </g>}
      {i === 2 && <g>
        <circle cx={x} cy="166" r="62" className="hg-map-shape" />
        {[20, 40].map(r => <circle key={r} cx={x} cy="166" r={r} className="hg-graticule" />)}
        <path d={`M${x - 62} 166H${x + 62}M${x} 104V228M${x - 44} 122l88 88M${x + 44} 122l-88 88`} className="hg-graticule" />
        {[20, 40, 60].map(d => <path key={d} d={`M${x + d} 160v12`} className="hg-ruler" />)}
        <motion.circle cx={x} cy="166" r="4" className="hg-traveler" initial={false}
          animate={active === i && t.duration !== 0 ? { x: [0, 20, 20, 40, 40, 60] } : { x: active === i ? 60 : 0 }}
          transition={paced(t, 1.6)} />
        <circle cx={x} cy="166" r="5" className="hg-center" />
      </g>}
      <text x={x} y="257" textAnchor="middle" className="hg-preserve">{['forma local', 'área relativa', 'distância do centro'][i]}</text>
      <text x={x} y="282" textAnchor="middle" className="hg-preserve-small">{['áreas se alteram', 'formas se alteram', 'outros pares variam'][i]}</text>
    </g>)}
    <text x="30" y="324" className="hg-footnote">Círculos: o mesmo círculo do globo, redesenhado por cada projeção.</text>
    <text x="30" y="342" className="hg-footnote">Esquemas de propriedades; não são mapas para medir lugares.</text>
  </svg>;
}

function IndustrialRevolution({ active, t }: { active: number; t: SceneTransition }) {
  // Três trabalhadores saem do campo cercado e entram na fábrica: é a
  // relação que o capítulo ensina (cercamento → mão de obra disponível), e
  // por isso o movimento só acontece a partir do segundo recorte.
  const workers = [60, 90, 120];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Revolução Industrial: cercamentos geram trabalho assalariado e capital; condições fabris documentadas e pressão social contribuem para leis fabris; recorte ${active + 1} destacado`}>
    <defs><marker id="hg-arrowhead" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4 0 8Z" className="hg-arrowhead" /></marker></defs>
    <rect x="8" y="8" width="604" height="344" rx="18" className="hg-paper" />
    <text x="28" y="39" className="hg-kicker">INGLATERRA · TRABALHO, FÁBRICA E REFORMA</text>
    <g className={active === 0 ? 'hg-process-active' : 'hg-process'}>
      <path d="M30 170H146M30 201H146M30 232H146M68 160V241M110 160V241" className="hg-field" />
      <path d="M150 150V248M146 172h8M146 214h8" className="hg-fence" />
      <text x="90" y="277" textAnchor="middle" className="hg-label">cercamentos</text>
    </g>
    <path d="M162 205H234" className="hg-arrow" />
    <text x="198" y="170" textAnchor="middle" className="hg-small">mão de obra</text>
    <text x="198" y="185" textAnchor="middle" className="hg-small">+ capital</text>
    <g className={active === 1 ? 'hg-process-active' : 'hg-process'}>
      <path d="M250 151H380V247H250Z" className="hg-factory" />
      <path d="M262 151V109H280V151M296 151V125H314V151" className="hg-chimney" />
      <path d="M338 178h29v28h-29Zm-74 44h60" className="hg-window" />
      <path d="M344 222h16v25h-16Z" className="hg-door" />
      <motion.g initial={false} animate={{ opacity: active >= 1 ? 0.9 : 0 }} transition={paced(t, 0.6, 0.9)}>
        <circle cx="271" cy="96" r="7" className="hg-smoke" /><circle cx="279" cy="80" r="9" className="hg-smoke" /><circle cx="272" cy="61" r="11" className="hg-smoke" />
      </motion.g>
      <text x="315" y="277" textAnchor="middle" className="hg-label">trabalho fabril</text>
    </g>
    {workers.map((x, k) => <motion.g key={x} initial={false}
      animate={{ x: active >= 1 ? 262 + k * 16 - x : 0, y: active >= 1 ? 8 : 0 }} transition={paced(t, 1.1, 0.12 * k)}>
      <circle cx={x} cy="184" r="5" className="hg-worker-head" />
      <path d={`M${x - 6} 206c0-9 3-14 6-14s6 5 6 14Z`} className="hg-worker" />
    </motion.g>)}
    <motion.g initial={false} animate={{ x: active >= 1 ? 96 : 0, opacity: active >= 1 ? 0 : 1 }} transition={paced(t, 1.1, 0.2)}>
      <circle cx="178" cy="226" r="7" className="hg-coin" /><text x="178" y="229.5" textAnchor="middle" className="hg-coin-mark">£</text>
    </motion.g>
    <path d="M390 205H446" className="hg-arrow" />
    <text x="418" y="185" textAnchor="middle" className="hg-small">investigação</text>
    <g className={active === 2 ? 'hg-process-active' : 'hg-process'}>
      <path d="M458 118h109v132H458z" className="hg-document" />
      <path d="M474 147h73M474 165h73M474 183h58" className="hg-document-line" />
      <text x="512" y="138" textAnchor="middle" className="hg-doc-title">Factory Acts</text>
      <motion.g initial={false} animate={{ scale: active >= 2 ? 1 : 0.4, opacity: active >= 2 ? 1 : 0 }}
        transition={paced(t, 0.5, 0.8)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <circle cx="540" cy="224" r="15" className="hg-seal" /><path d="M533 224l5 5 9-10" className="hg-seal-mark" />
      </motion.g>
      <text x="512" y="277" textAnchor="middle" className="hg-label">leis fabris</text>
    </g>
    <motion.g initial={false} animate={{ x: active >= 2 ? 90 : 0, opacity: active >= 2 ? 1 : 0 }} transition={paced(t, 0.9, 0.1)}>
      <circle cx="372" cy="170" r="9" className="hg-lens" /><path d="M378 177l8 8" className="hg-lens-handle" />
    </motion.g>
    <path d="M416 289H586" className="hg-bracket" />
    <text x="500" y="307" textAnchor="middle" className="hg-small">documentação + pressão social</text>
    <text x="28" y="337" className="hg-footnote">A reforma levou décadas; a lei não surgiu automaticamente da fábrica.</text>
  </svg>;
}

function RainMechanisms({ active, t }: { active: number; t: SceneTransition }) {
  const centers = [108, 310, 512];
  const titles = ['CONVECTIVA', 'OROGRÁFICA', 'FRONTAL'];
  // A parcela de ar percorre o caminho que a obriga a subir; só ao chegar lá
  // em cima a nuvem se fecha e a chuva cai. A ordem — subir, esfriar,
  // condensar — é o conteúdo, então a nuvem espera a parcela.
  const paths = [
    (x: number) => ({ cx: [x, x, x], cy: [228, 180, 140] }),
    (x: number) => ({ cx: [x - 74, x - 46, x - 28], cy: [218, 178, 132] }),
    (x: number) => ({ cx: [x - 60, x - 16, x + 10], cy: [205, 172, 140] }),
  ];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Chuva convectiva por ar aquecido, orográfica por relevo e frontal pelo encontro de massas de ar; ${titles[active].toLowerCase()} selecionada`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="hg-paper" />
    <text x="28" y="39" className="hg-kicker">TRÊS CAMINHOS PARA O AR ÚMIDO SUBIR</text>
    {centers.map((x, i) => {
      const on = active === i;
      const route = paths[i](x);
      const cloud = paced(t, 0.5, on ? 1.1 : 0);
      return <g key={x} className={on ? 'hg-projection hg-projection-active' : 'hg-projection'}>
        <rect x={x - 91} y="55" width="182" height="255" rx="13" className="hg-panel" />
        <text x={x} y="82" textAnchor="middle" className="hg-panel-title">{titles[i]}</text>
        {i === 2 && <path d={`M${x - 72} 237 L${x - 72} 222 q34 -2 64 -44 q30 -38 72 -44 V237Z`} className="hg-cold-air" />}
        <path d={`M${x - 72} 237H${x + 72}`} className="hg-ground-line" />
        {i === 0 && <path d={`M${x - 44} 231q-4-6 0-12t0-12m25 24q-4-6 0-12t0-12m25 24q-4-6 0-12t0-12`} className="hg-heat" />}
        {i === 1 && <><path d={`M${x - 67} 237l65-98 64 98Z`} className="hg-mountain" /><path d={`M${x - 14} 157l12-18 12 18-6-2-6 4-6-4Z`} className="hg-snow" />
          <text x={x - 84} y="260" className="hg-small">barlavento</text><text x={x + 30} y="256" className="hg-small">sotavento</text><text x={x + 30} y="268" className="hg-small">seco</text></>}
        {i === 2 && <><text x={x + 26} y="222" className="hg-small">ar frio</text><text x={x - 84} y="150" className="hg-small hg-warm-label">ar quente</text></>}
        <path d={`M${route.cx[0]} ${route.cy[0]} L${route.cx[1]} ${route.cy[1]} L${route.cx[2]} ${route.cy[2]}`} className="hg-route" />
        <motion.circle r="6" className={i === 2 ? 'hg-parcel hg-parcel-warm' : 'hg-parcel'} initial={false}
          animate={on && t.duration !== 0 ? { cx: route.cx, cy: route.cy } : { cx: route.cx[2], cy: route.cy[2] }}
          transition={paced(t, 1.1)} />
        <motion.path d={`M${route.cx[2] - 30} ${route.cy[2] - 8}q-5-17 14-20 11-14 26-3 19-3 24 16 14 9 2 21h-58q-16-3-8-14Z`}
          className="hg-cloud" initial={false} animate={{ opacity: on ? 1 : 0.7, scale: on ? 1 : 0.92 }} transition={cloud}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
        <motion.g initial={false} animate={{ opacity: on ? 1 : 0.5, y: on ? 4 : 0 }} transition={paced(t, 0.5, on ? 1.5 : 0)}>
          <path d={`M${route.cx[2] - 16} ${route.cy[2] + 20}l-4 12m18-12-4 12m18-12-4 12`} className="hg-rain" />
        </motion.g>
        <text x={x} y="287" textAnchor="middle" className="hg-preserve">{['aquecimento', 'barreira do relevo', 'massas em encontro'][i]}</text>
      </g>;
    })}
    <text x="28" y="335" className="hg-footnote">A causa da ascensão distingue os tipos; eles podem ocorrer em regiões diferentes.</text>
  </svg>;
}


// Contornos simplificados a partir de coordenadas reais (projeção
// retangular). Situam a rota e o Brasil; não servem para medir distância.
const NAV_BRAZIL = 'M72.2 173.3L104.6 176.5L106.4 192L115.4 197L130.5 201L151.4 205.3L163.3 212.9L164.4 221.2L151.4 238.8L148.9 256.1L144.9 265.1L138.8 274.8L134.5 274.4L123.3 278.4L115.4 291.4L109.6 299.6L97.8 313.3L82.6 300.7L97 289.2L93.4 283.8L92 278.4L81.9 271.2L81.2 249.6L74 240.6L56 228L24 218.6L27.2 208.2L38.4 207.1L48.8 186.6L61.4 184.8Z';
const NAV_AFRICA = 'M269.1 63.1L254.7 84L243.2 94.8L228.8 116.4L227.4 139.1L242.5 161.4L261.2 175.8L293.6 171.1L322.4 177.6L324.2 195.6L337.5 223.7L333.2 253.2L344 289.2L356.2 315.8L380 314.4L401.6 296.4L417.8 278L436.2 246L431.5 216.5L441.2 195.6L473.6 149.5L446.6 146.6L430.4 135.8L416 112.8L407 84L380 78.6L362 76.8L326 58.8L290 62.4Z';
const NAV_IBERIA = 'M257.6 36.5L255.8 52.7L258 58.8L268.4 60.6L282.8 59.5L290 52.3L300.8 40.8L283.5 35.8Z';
const NAV_INDIA = 'M527.6 102L534.8 107.4L552.1 123.6L554.6 136.2L564.7 156.4L569 162.8L578.7 145.2L579.1 134.8L596 121.8L608.6 112.8L606.8 94.8L556.4 80.4Z';
const NAV_ROUTE = 'M255.8 52.7L225.2 105.6L210.8 163.2L225.2 228L272 292.8L326 325.2L362 328.8L405.2 307.2L441.2 264L459.2 206.4L498.8 170.4L562.9 151.5';

function Navigations({ active, t }: { active: number; t: SceneTransition }) {
  const on = (i: number) => active >= i;
  const route = [255.8, 225.2, 210.8, 225.2, 272, 326, 362, 405.2, 441.2, 459.2, 498.8, 562.9];
  const routeY = [52.7, 105.6, 163.2, 228, 292.8, 325.2, 328.8, 307.2, 264, 206.4, 170.4, 151.5];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Grandes Navegações: tecnologia náutica, rota do Cabo até a Índia, pau-brasil por escambo e colonização após ameaças de invasão; elo ${active + 1} destacado`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="hg-sea" />
    <text x="30" y="36" className="hg-kicker">PORTUGAL · XV–XVI</text>
    <text x="590" y="36" textAnchor="end" className="hg-hand">elo a elo</text>
    <path d={NAV_IBERIA} className="hg-land" /><path d={NAV_AFRICA} className="hg-land" /><path d={NAV_INDIA} className="hg-land" />
    <motion.path d={NAV_BRAZIL} className="hg-land" initial={false} animate={{ opacity: active === 1 ? 0.45 : 1 }} transition={paced(t, 0.5)} />
    <text x="290" y="120" className="hg-geo-label">ÁFRICA</text><text x="560" y="72" className="hg-geo-label" textAnchor="middle">ÍNDIA</text><text x="70" y="250" className="hg-geo-label">BRASIL</text>

    <motion.path d={NAV_ROUTE} className="hg-sea-route" initial={false} animate={{ pathLength: 1 }} transition={paced(t, 1.6)} />
    <circle cx="255.8" cy="52.7" r="4" className="hg-port" /><text x="248" y="50" textAnchor="end" className="hg-small">Lisboa</text>
    <circle cx="356.2" cy="318" r="3.5" className="hg-port" /><text x="366" y="338" className="hg-small">Cabo, 1488</text>
    <circle cx="562.9" cy="151.5" r="4" className="hg-port" /><text x="604" y="178" textAnchor="end" className="hg-small">Calicute, 1498</text>
    <motion.g initial={false} animate={active === 0 && t.duration !== 0 ? { x: route.map(v => v - 255.8), y: routeY.map(v => v - 52.7) } : { x: 562.9 - 255.8, y: 151.5 - 52.7 }}
      transition={paced(t, 2.4)}>
      <path d="M244 60h24l-4 6h-16Z" className="hg-hull" /><path d="M256 60V42M256 43l10 8h-10M256 44l-8 7h8" className="hg-sail" />
    </motion.g>
    <text x="300" y="70" className="hg-hand-small">tecnologia náutica</text>

    <motion.g initial={false} animate={{ opacity: on(1) ? 1 : 0.15 }} transition={paced(t, 0.4, 0.3)}>
      <path d="M548 128h14v10h-14zM566 124h14v14h-14z" className="hg-spice" />
      <circle cx="555" cy="127" r="3" className="hg-spice-dot" /><circle cx="573" cy="122" r="3" className="hg-spice-dot" />
      <path d={NAV_ROUTE} className="hg-profit" transform="translate(6 -6)" />
      <text x="482" y="110" className="hg-hand-small">especiarias: prioridade</text>
    </motion.g>

    <motion.g initial={false} animate={{ opacity: on(2) ? 1 : 0.15 }} transition={paced(t, 0.4, 0.3)}>
      {[0, 1, 2].map(k => <path key={k} d={`M${128 + k * 3} ${232 + k * 8}h22`} className="hg-log" />)}
      <path d="M172 250l-8-8M166 244l4-10 6 6Z" className="hg-axe" />
      <text x="176" y="236" className="hg-hand-small">pau-brasil por escambo</text>
    </motion.g>

    <motion.g initial={false} animate={{ opacity: on(3) ? 1 : 0.15 }} transition={paced(t, 0.4, 0.2)}>
      {[0, 1].map(k => <motion.g key={k} initial={false} animate={{ x: active === 3 ? -40 : 0 }} transition={paced(t, 1.2, 0.3 + k * 0.3)}>
        <path d={`M${222 + k * 18} ${188 + k * 26}h18l-3 5h-12Z`} className="hg-hull hg-hull-foreign" />
        <path d={`M${231 + k * 18} ${188 + k * 26}v-14l8 9h-8`} className="hg-sail-foreign" />
      </motion.g>)}
      {[[150, 236], [132, 274], [158, 214]].map(([x, y], k) => <motion.path key={k} d={`M${x - 6} ${y + 4}v-8h3v-3h6v3h3v8Z`} className="hg-fort"
        initial={false} animate={{ scale: active === 3 ? 1 : 0.6 }} transition={paced(t, 0.4, 1 + k * 0.2)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />)}
      <text x="190" y="296" className="hg-hand-small">ameaças → colonização, 1530</text>
    </motion.g>
    <text x="30" y="344" className="hg-footnote">Contornos simplificados; rota esquemática.</text>
  </svg>;
}

function Colonization({ active, t }: { active: number; t: SceneTransition }) {
  // Metáfora de balança, avisada no rodapé: cada fator sozinho não inclina
  // o prato; só os três juntos. É a afirmação do capítulo ("nenhum
  // isoladamente seria suficiente"), não uma medida de peso.
  const all = active === 3;
  const factors = [
    { label: 'resistência', x: 390 },
    { label: 'epidemias', x: 450 },
    { label: 'oposição jesuíta', x: 510 },
  ];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Montagem da colonização: resistência indígena, epidemias e oposição jesuíta só juntas explicam a passagem ao tráfico transatlântico; fator ${active + 1} destacado`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="hg-paper" />
    <text x="30" y="40" className="hg-kicker">MÃO DE OBRA NA COLÔNIA · SÉCULO XVI</text>
    <path d="M296 300h48l-24-86Z" className="hg-pivot" />
    <motion.g initial={false} animate={{ rotate: all ? 5 : 0 }} transition={paced(t, 0.9, all ? 0.9 : 0)} style={{ transformOrigin: '320px 214px' }}>
      <path d="M130 214H510" className="hg-beam" />
      <path d="M150 214l-30 50h100l-30-50M490 214l-30 50h100l-30-50" className="hg-rope" />
      <path d="M110 264h120a60 14 0 0 1-120 0ZM410 264h120a60 14 0 0 1-120 0Z" className="hg-pan" />
      <text x="170" y="300" textAnchor="middle" className="hg-label">escravização</text>
      <text x="170" y="316" textAnchor="middle" className="hg-label">indígena</text>
      <text x="470" y="300" textAnchor="middle" className="hg-label">tráfico transatlântico</text>
      <text x="470" y="316" textAnchor="middle" className="hg-label">de africanos</text>
      {factors.map((f, k) => {
        const present = all || active === k;
        return <motion.g key={f.label} initial={false} animate={{ y: present ? 0 : -118, opacity: present ? 1 : 0.35 }} transition={paced(t, 0.6, all ? k * 0.2 : 0)}>
          <rect x={f.x - 20} y="232" width="40" height="30" rx="6" className="hg-weight" />
          {k === 0 && <path d={`M${f.x - 8} 254l10-14 6 8M${f.x + 2} 240l6-4`} className="hg-weight-icon" />}
          {k === 1 && <g><circle cx={f.x} cy="247" r="6" className="hg-weight-icon" />{[0, 60, 120, 180, 240, 300].map(a => <path key={a} d={`M${f.x + 6 * Math.cos(a * Math.PI / 180)} ${247 + 6 * Math.sin(a * Math.PI / 180)}l${3 * Math.cos(a * Math.PI / 180)} ${3 * Math.sin(a * Math.PI / 180)}`} className="hg-weight-icon" />)}</g>}
          {k === 2 && <path d={`M${f.x} 238v18M${f.x - 6} 244h12`} className="hg-weight-icon" />}
        </motion.g>;
      })}
    </motion.g>
    {factors.map((f, k) => <text key={f.label} x={f.x} y={160 + (k % 2) * 16} textAnchor="middle" className={all || active === k ? 'hg-factor hg-factor-on' : 'hg-factor'}>{f.label}</text>)}
    <motion.text x="320" y="90" textAnchor="middle" className="hg-hand" initial={false} animate={{ opacity: 1 }} key={all ? 'all' : 'one'} transition={paced(t, 0.4, 0.8)}>
      {all ? 'juntos, inclinam a balança' : 'sozinho, não basta'}
    </motion.text>
    <text x="30" y="344" className="hg-footnote">Metáfora: sem peso medido.</text>
  </svg>;
}

function ColonialRevolts({ active, t }: { active: number; t: SceneTransition }) {
  const both = active === 2;
  const minas = active === 0 || both;
  const bahia = active === 1 || both;
  // A composição social é o contraste do capítulo: três figuras de elite
  // em Minas; artesão, soldado, escravizado e liberto na Bahia.
  const elite = [120, 150, 180];
  const popular = [[404, 'artesão'], [448, 'soldado'], [492, 'escravizado'], [536, 'liberto']] as const;
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Crise do antigo sistema colonial: Inconfidência Mineira (1789) e Conjuração Baiana (1798) com composição e pautas diferentes contra o mesmo pacto colonial; recorte ${active + 1} destacado`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="hg-paper" />
    <text x="30" y="40" className="hg-kicker">O PACTO COLONIAL CONTESTADO</text>
    <g>
      <path d="M296 70l4-16 8 8 12-14 12 14 8-8 4 16Z" className="hg-crown" />
      <text x="320" y="88" textAnchor="middle" className="hg-small">metrópole</text>
      {[0, 1, 2, 3].map(k => <motion.ellipse key={k} cx="320" cy={104 + k * 14} rx="6" ry="8" className="hg-chain" initial={false}
        animate={k === 2 && both ? { x: 10, rotate: 30 } : { x: 0, rotate: 0 }} transition={paced(t, 0.5, 1)} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />)}
      <text x="320" y="176" textAnchor="middle" className="hg-small">colônia</text>
    </g>

    <motion.g initial={false} animate={{ opacity: minas ? 1 : 0.35 }} transition={paced(t, 0.4)}>
      <rect x="40" y="70" width="210" height="236" rx="14" className={minas ? 'hg-panel hg-panel-on' : 'hg-panel'} />
      <text x="145" y="96" textAnchor="middle" className="hg-panel-title hg-panel-title-sm">INCONFIDÊNCIA MINEIRA · 1789</text>
      <path d="M60 170l30-34 22 22 26-30 34 42Z" className="hg-mountain" />
      {elite.map((x, k) => <motion.g key={x} initial={false} animate={{ opacity: minas ? 1 : 0.4 }} transition={paced(t, 0.4, minas ? 0.2 + k * 0.12 : 0)}>
        <rect x={x - 8} y="186" width="16" height="4" className="hg-hat" /><rect x={x - 5} y="176" width="10" height="11" className="hg-hat" />
        <circle cx={x} cy="196" r="6" className="hg-face" /><path d={`M${x - 10} 226c0-14 4-22 10-22s10 8 10 22Z`} className="hg-coat" />
      </motion.g>)}
      <text x="145" y="250" textAnchor="middle" className="hg-small">elites locais de Minas</text>
      <text x="145" y="272" textAnchor="middle" className="hg-label">impostos sobre o ouro</text>
      <text x="145" y="290" textAnchor="middle" className="hg-small">inspiração: independência dos EUA</text>
      {both && <motion.path d="M250 150C276 140 294 132 312 132" className="hg-crack" initial={{ pathLength: t.duration === 0 ? 1 : 0 }} animate={{ pathLength: 1 }} transition={paced(t, 0.6, 0.4)} />}
    </motion.g>

    <motion.g initial={false} animate={{ opacity: bahia ? 1 : 0.35 }} transition={paced(t, 0.4)}>
      <rect x="370" y="70" width="210" height="236" rx="14" className={bahia ? 'hg-panel hg-panel-on' : 'hg-panel'} />
      <text x="475" y="96" textAnchor="middle" className="hg-panel-title hg-panel-title-sm">CONJURAÇÃO BAIANA · 1798</text>
      <path d="M384 162q30-10 60 0t60 0t60 0" className="hg-wave-line" /><path d="M500 150v-24h10v24M496 126h18" className="hg-rope" />
      {popular.map(([x, role], k) => <motion.g key={role} initial={false} animate={{ opacity: bahia ? 1 : 0.4 }} transition={paced(t, 0.4, bahia ? 0.2 + k * 0.12 : 0)}>
        <circle cx={x} cy="196" r="6" className={k >= 2 ? 'hg-face hg-face-dark' : 'hg-face'} />
        <path d={`M${x - 10} 226c0-14 4-22 10-22s10 8 10 22Z`} className={k === 1 ? 'hg-coat hg-coat-soldier' : 'hg-coat hg-coat-plain'} />
        {k === 0 && <path d={`M${x + 8} 206l6-6m-2-2l4 4`} className="hg-tool" />}
        {k === 1 && <rect x={x - 6} y="186" width="12" height="4" className="hg-cap" />}
        <text x={x} y={240 + (k % 2) * 11} textAnchor="middle" className="hg-tiny">{role}</text>
      </motion.g>)}
      <text x="475" y="268" textAnchor="middle" className="hg-small">participação mais popular</text>
      <text x="475" y="288" textAnchor="middle" className="hg-label">pautas radicais: abolição</text>
      {both && <motion.path d="M370 150C344 140 326 132 328 132" className="hg-crack" initial={{ pathLength: t.duration === 0 ? 1 : 0 }} animate={{ pathLength: 1 }} transition={paced(t, 0.6, 0.6)} />}
    </motion.g>
    <motion.text x="310" y="232" textAnchor="middle" className="hg-hand-small" initial={false} animate={{ opacity: both ? 1 : 0 }} transition={paced(t, 0.4, 1.1)}>mesmo</motion.text>
    <motion.text x="310" y="250" textAnchor="middle" className="hg-hand-small" initial={false} animate={{ opacity: both ? 1 : 0 }} transition={paced(t, 0.4, 1.1)}>descontentamento</motion.text>
    <text x="30" y="336" className="hg-footnote">Composição e motivação diferentes; o mesmo alvo: o pacto colonial.</text>
  </svg>;
}

export function HistoriaGeografia({ entry }: { entry: SceneEntry }) {
  const [active, setActive] = useState(0);
  const transition = useSceneMotion();
  const item = entry.items[active];
  const history = entry.chapterId.startsWith('summary-historia-');
  return <section className="tc-scene hg-scene" aria-label={entry.question}>
    <header><small>CRIVO · {HEADERS[entry.chapterId] ?? (history ? 'cronologia e causalidade' : FISICA[entry.chapterId] || entry.chapterId === 'summary-geografia-dinamica-climatica' ? 'geografia física' : 'cartografia comparada')}</small><h4>{entry.question}</h4></header>
    <div className="hg-figure" role="region" tabIndex={0} aria-label="Prancha visual: deslize para ver a figura inteira; com teclado, use as setas" onKeyDown={event => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      event.currentTarget.scrollLeft += event.key === 'ArrowRight' ? 120 : -120;
    }}>
      {SELF_PACED[entry.chapterId] ? React.createElement(SELF_PACED[entry.chapterId], { active })
        : FISICA[entry.chapterId] ? React.createElement(FISICA[entry.chapterId], { active })
        : entry.chapterId === 'summary-historia-grandes-navegacoes-e-conquista-colonial' ? <Navigations active={active} t={transition} />
        : entry.chapterId === 'summary-historia-a-montagem-da-colonizacao' ? <Colonization active={active} t={transition} />
        : entry.chapterId === 'summary-historia-a-crise-do-antigo-sistema-colonial' ? <ColonialRevolts active={active} t={transition} />
        : entry.chapterId === 'summary-historia-revolucao-francesa' ? <FrenchRevolution active={active} t={transition} />
        : entry.chapterId === 'summary-historia-revolucao-industrial' ? <IndustrialRevolution active={active} t={transition} />
          : entry.chapterId === 'summary-geografia-dinamica-climatica' ? <RainMechanisms active={active} t={transition} />
            : <ProjectionComparison active={active} t={transition} />}
    </div>
    <p className="hg-pan-hint">Deslize a prancha para ver toda a figura. Com teclado, use as setas.</p>
    <div className="hg-controls" aria-label="Selecione um recorte da prancha">
      {entry.items.map((candidate, index) => <motion.button key={candidate.label} type="button" aria-pressed={active === index} onClick={() => setActive(index)} animate={{ y: active === index ? -2 : 0 }} transition={transition}>{candidate.label}</motion.button>)}
    </div>
    <aside className="hg-detail" role="status" aria-live="polite"><strong>{item.label}</strong><p>{item.claim}</p><blockquote>“{item.quote}” <cite>{item.section}</cite></blockquote></aside>
    {!history && entry.nota && <p className="hg-note">{entry.nota}</p>}
  </section>;
}
