import React, { useId, useState } from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import type { SceneEntry } from '../types';
import './HistoriaGeografia.css';
import { FrenchRevolutionPlate, ClimatePlate } from './HumanitiesPrototypes';
import { HumanitiesCorePlate } from './HumanitiesCorePlate';
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
import { HEADERS_LOTE11, SCENES_LOTE11 } from './Geopolitica';
import { HEADERS_LOTE12, SCENES_LOTE12 } from './OrienteMedio';
import { HEADERS_LOTE13, SCENES_LOTE13 } from './HistoriaMundial';
import { HEADERS_LOTE14, SCENES_LOTE14 } from './BrasilRepublica';
import { HEADERS_LOTE15, SCENES_LOTE15 } from './Cartografia';
import { HEADERS_LOTE16, SCENES_LOTE16 } from './AguasBiomas';
import { HEADERS_LOTE17, SCENES_LOTE17 } from './AmbienteEnergia';
import { HEADERS_LOTE18, SCENES_LOTE18 } from './Globalizacao';
import { HEADERS_LOTE19, SCENES_LOTE19 } from './EconomiaBrasil';

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
  ...SCENES_LOTE11,
  ...SCENES_LOTE12,
  ...SCENES_LOTE13,
  ...SCENES_LOTE14,
  ...SCENES_LOTE15,
  ...SCENES_LOTE16,
  ...SCENES_LOTE17,
  ...SCENES_LOTE18,
  ...SCENES_LOTE19,
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
  ...HEADERS_LOTE11,
  ...HEADERS_LOTE12,
  ...HEADERS_LOTE13,
  ...HEADERS_LOTE14,
  ...HEADERS_LOTE15,
  ...HEADERS_LOTE16,
  ...HEADERS_LOTE17,
  ...HEADERS_LOTE18,
  ...HEADERS_LOTE19,
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

function FrenchRevolution({ active }: { active: number; t: SceneTransition }) {
  return <FrenchRevolutionPlate active={active}/>;
}

function ProjectionComparison({ active, t }: { active: number; t: SceneTransition }) {
  const centers = [108, 310, 512];
  const titles = ['CONFORME', 'EQUIVALENTE', 'EQUIDISTANTE'];
  // Indicatriz de Tissot: o mesmo círculo pequeno do globo, redesenhado por
  // cada projeção. Na conforme ele continua círculo mas cresce com a
  // latitude; na equivalente achata sem mudar de área (π·11·5,8 ≈ π·8²).
  const conformal = [[118, 12], [141, 8.5], [166, 6], [191, 8.5], [214, 12]];
  const equalArea = [[130, 11, 5.8], [166, 8, 8], [202, 11, 5.8]];
  return <HumanitiesCorePlate kind="projection" active={active}>{<svg viewBox="0 0 620 360" role="img" aria-label={`Propriedades cartográficas comparadas: conforme preserva forma local, equivalente preserva área, equidistante preserva distâncias desde um centro; ${titles[active].toLowerCase()} selecionada`}>
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
  </svg>}</HumanitiesCorePlate>;
}

function IndustrialRevolution({ active, t }: { active: number; t: SceneTransition }) {
  const uid = useId().replace(/:/g, '');
  // Três trabalhadores saem do campo cercado e entram na fábrica: é a
  // relação que o capítulo ensina (cercamento → mão de obra disponível), e
  // por isso o movimento só acontece a partir do segundo recorte.
  const workers = [60, 90, 120];
  return <HumanitiesCorePlate kind="industry" active={active}>{<svg viewBox="0 0 620 360" role="img" aria-label={`Revolução Industrial: cercamentos geram trabalho assalariado e capital; condições fabris documentadas e pressão social contribuem para leis fabris; recorte ${active + 1} destacado`}>
    <defs><marker id={`${uid}-hg-arrowhead`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4 0 8Z" className="hg-arrowhead" /></marker></defs>
    <rect x="8" y="8" width="604" height="344" rx="18" className="hg-paper" />
    <text x="28" y="39" className="hg-kicker">INGLATERRA · TRABALHO, FÁBRICA E REFORMA</text>
    <g className={active === 0 ? 'hg-process-active' : 'hg-process'}>
      <path d="M30 170H146M30 201H146M30 232H146M68 160V241M110 160V241" className="hg-field" />
      <path d="M150 150V248M146 172h8M146 214h8" className="hg-fence" />
      <text x="90" y="277" textAnchor="middle" className="hg-label">cercamentos</text>
    </g>
    <path d="M162 205H234" className="hg-arrow" markerEnd={`url(#${uid}-hg-arrowhead)`} />
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
    <path d="M390 205H446" className="hg-arrow" markerEnd={`url(#${uid}-hg-arrowhead)`} />
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
  </svg>}</HumanitiesCorePlate>;
}

function RainMechanisms({ active }: { active: number; t: SceneTransition }) {
  return <ClimatePlate active={active}/>;
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
  return <HumanitiesCorePlate kind="navigation" active={active}>{<svg viewBox="0 0 620 360" role="img" aria-label={`Grandes Navegações: tecnologia náutica, rota do Cabo até a Índia, pau-brasil por escambo e colonização após ameaças de invasão; elo ${active + 1} destacado`}>
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
      <text x="612" y="110" textAnchor="end" className="hg-hand-small">especiarias: prioridade</text>
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
  </svg>}</HumanitiesCorePlate>;
}

function Colonization({ active, t }: { active: number; t: SceneTransition }) {
  const all = active === 3;
  const traits = [
    { label: 'Grande propriedade', detail: 'latifúndio', x: 28 },
    { label: 'Exportação', detail: 'monocultura açucareira', x: 228 },
    { label: 'Trabalho escravizado', detail: 'coerção em larga escala', x: 428 },
  ];
  return <HumanitiesCorePlate kind="colonization" active={active}>{<svg viewBox="0 0 620 360" role="img" aria-label={`Montagem da colonização: características do modelo de plantation; recorte ${active + 1} destacado`}>
    <rect x="8" y="8" width="604" height="344" rx="18" className="hg-paper" />
    <text x="30" y="40" className="hg-kicker">ECONOMIA AÇUCAREIRA · PLANTATION</text>
    {traits.map((trait, index) => <motion.g key={trait.label} initial={false} animate={{ opacity: all || active === index ? 1 : 0.45 }} transition={paced(t, 0.4)}>
      <rect x={trait.x} y="100" width="164" height="138" rx="12" className="hg-panel" />
      <text x={trait.x + 82} y="128" textAnchor="middle" className="hg-label">{trait.label}</text>
      {index === 0 && <g>{[0, 1, 2, 3].map(row => <path key={row} d={`M${trait.x + 24} ${155 + row * 15}h116`} className="hg-document-line" />)}</g>}
      {index === 1 && <g><path d={`M${trait.x + 27} 188h105l-17 20H${trait.x + 44}Z`} className="hg-fort" /><path d={`M${trait.x + 78} 187v-42l32 30h-32`} className="hg-document-line" /></g>}
      {index === 2 && <g><circle cx={trait.x + 82} cy="158" r="10" className="hg-document-line" /><path d={`M${trait.x + 82} 170v35m0-25-20 15m20-15 20 15m-20 10-13 20m13-20 13 20`} className="hg-document-line" /></g>}
      <text x={trait.x + 82} y="260" textAnchor="middle" className="hg-small">{trait.detail}</text>
    </motion.g>)}
    <text x="310" y="308" textAnchor="middle" className="hg-hand">{all ? 'A combinação caracteriza o modelo' : 'Uma característica do modelo em foco'}</text>
    <text x="30" y="340" className="hg-footnote">Modelo produtivo; a coexistência de formas de cativeiro variou por região.</text>
  </svg>}</HumanitiesCorePlate>;
}

function ColonialRevolts({ active, t }: { active: number; t: SceneTransition }) {
  const both = active === 2;
  const minas = active === 0 || both;
  const bahia = active === 1 || both;
  // A composição social é o contraste do capítulo: três figuras de elite
  // em Minas; artesão, soldado, escravizado e liberto na Bahia.
  const elite = [120, 150, 180];
  const popular = [[404, 'artesão'], [448, 'soldado'], [492, 'escravizado'], [536, 'liberto']] as const;
  return <HumanitiesCorePlate kind="revolts" active={active}>{<svg viewBox="0 0 620 360" role="img" aria-label={`Crise do antigo sistema colonial: Inconfidência Mineira (1789) e Conjuração Baiana (1798) com composição e pautas diferentes contra o mesmo pacto colonial; recorte ${active + 1} destacado`}>
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
  </svg>}</HumanitiesCorePlate>;
}

export function HistoriaGeografia({ entry }: { entry: SceneEntry }) {
  const [active, setActive] = useState(0);
  const [comparing, setComparing] = useState(false);
  const [comparisonIndex, setComparisonIndex] = useState(1);
  const panelId = useId();
  const locatePanel = (panel: number) => {
    const element = document.getElementById(`${panelId}-${panel}`);
    element?.focus();
    element?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
  };
  const otherIndex = comparisonIndex === active ? (active + 1) % entry.items.length : comparisonIndex;
  const displayed = active;
  const transition = useSceneMotion();
  const item = entry.items[active];
  const other = entry.items[otherIndex];
  const history = entry.chapterId.startsWith('summary-historia-');
  const renderDrawing = (selected: number) => (SELF_PACED[entry.chapterId] ? React.createElement(SELF_PACED[entry.chapterId], { active: selected })
        : FISICA[entry.chapterId] ? React.createElement(FISICA[entry.chapterId], { active: selected })
        : entry.chapterId === 'summary-historia-grandes-navegacoes-e-conquista-colonial' ? <Navigations active={selected} t={transition} />
        : entry.chapterId === 'summary-historia-a-montagem-da-colonizacao' ? <Colonization active={selected} t={transition} />
        : entry.chapterId === 'summary-historia-a-crise-do-antigo-sistema-colonial' ? <ColonialRevolts active={selected} t={transition} />
        : entry.chapterId === 'summary-historia-revolucao-francesa' ? <FrenchRevolution active={selected} t={transition} />
        : entry.chapterId === 'summary-historia-revolucao-industrial' ? <IndustrialRevolution active={selected} t={transition} />
          : entry.chapterId === 'summary-geografia-dinamica-climatica' ? <RainMechanisms active={selected} t={transition} />
            : <ProjectionComparison active={selected} t={transition} />);
  return <section className="tc-scene hg-scene" aria-label={entry.question}>
    <header><small>CRIVO · {HEADERS[entry.chapterId] ?? (history ? 'cronologia e causalidade' : FISICA[entry.chapterId] || entry.chapterId === 'summary-geografia-dinamica-climatica' ? 'geografia física' : 'cartografia comparada')}</small><h4>{entry.question}</h4></header>
    <div className="hu-recortes" role="group" aria-label="Selecione um recorte da prancha">
      {entry.items.map((candidate, index) => <motion.button key={candidate.label} type="button" aria-pressed={active === index} onClick={() => { setActive(index); }} initial={false} animate={{ y: active === index ? -2 : 0 }} transition={transition}><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><span>{candidate.label}</span></motion.button>)}
    </div>
    <div className="hu-toolbar"><span>{comparing ? `A · ${item.label} / B · ${other.label}` : `${active + 1} de ${entry.items.length} recortes · ${item.label}`}</span>
      {entry.items.length > 1 && <button type="button" className="hu-action" aria-pressed={comparing} onClick={() => { setComparing(!comparing); }}>{comparing ? 'Fechar comparação' : 'Comparar recortes'}</button>}
    </div>
    <div className={`hg-figure-group${comparing ? ' hg-figure-group--pair' : ''}`}>
      {(comparing ? [active, otherIndex] : [displayed]).map((selected, panel) => <div className="hg-figure-panel" key={panel}>
        {comparing && <h5>{panel === 0 ? 'A' : 'B'} · {entry.items[selected].label}</h5>}
    <div id={`${panelId}-${panel}`} className="hg-figure" role="region" tabIndex={0} aria-label={`${comparing ? `Painel ${panel === 0 ? 'A' : 'B'} · ${entry.items[selected].label}. ` : ''}Prancha visual: deslize para ver a figura inteira; com teclado, use as setas`} onKeyDown={event => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      event.currentTarget.scrollLeft += event.key === 'ArrowRight' ? 120 : -120;
    }}>
      {renderDrawing(selected)}
    </div>
      </div>)}
    </div>
    <p className="hg-pan-hint">Deslize a prancha para ver toda a figura. Com teclado, use as setas.</p>
    {comparing ? <div className="hu-comparison" role="group" aria-label="Comparação entre recortes">
      <article><small>Recorte A · selecionado acima</small><h5>{item.label}</h5><p>{item.claim}</p>
        <button type="button" className="hu-action" onClick={() => locatePanel(0)}>Localizar painel A</button>
        <Source item={item} /></article>
      <article><label>Recorte B<select aria-label="Recorte B" value={otherIndex} onChange={event => setComparisonIndex(Number(event.target.value))}>
        {entry.items.map((candidate, index) => index !== active && <option value={index} key={candidate.label}>{candidate.label}</option>)}
      </select></label><h5>{other.label}</h5><p>{other.claim}</p>
        <button type="button" className="hu-action" onClick={() => locatePanel(1)}>Localizar painel B</button>
        <Source item={other} /></article>
    </div> : <div className="hg-detail" role="status" aria-live="polite"><strong>{item.label}</strong><p>{item.claim}</p><Source item={item} /></div>}
    {!history && entry.nota && <p className="hg-note">{entry.nota}</p>}
  </section>;
}

function Source({ item }: { item: SceneEntry['items'][number] }) {
  return <details className="hu-source"><summary>Conferir no capítulo · {item.section}</summary><blockquote>“{item.quote}”<cite>{item.section}</cite></blockquote></details>;
}
