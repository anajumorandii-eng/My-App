import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import type { SceneEntry } from '../types';
import './HistoriaGeografia.css';

export const HISTORIA_GEOGRAFIA_IDS: ReadonlySet<string> = new Set([
  'summary-historia-revolucao-francesa',
  'summary-historia-revolucao-industrial',
  'summary-geografia-projecoes-cartograficas',
  'summary-geografia-dinamica-climatica',
]);

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

export function HistoriaGeografia({ entry }: { entry: SceneEntry }) {
  const [active, setActive] = useState(0);
  const transition = useSceneMotion();
  const item = entry.items[active];
  const history = entry.chapterId.startsWith('summary-historia-');
  return <section className="tc-scene hg-scene" aria-label={entry.question}>
    <header><small>CRIVO · {history ? 'cronologia e causalidade' : entry.chapterId === 'summary-geografia-dinamica-climatica' ? 'mecanismo do clima' : 'cartografia comparada'}</small><h4>{entry.question}</h4></header>
    <div className="hg-figure" role="region" tabIndex={0} aria-label="Prancha visual: deslize para ver a figura inteira; com teclado, use as setas" onKeyDown={event => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      event.currentTarget.scrollLeft += event.key === 'ArrowRight' ? 120 : -120;
    }}>
      {entry.chapterId === 'summary-historia-revolucao-francesa' ? <FrenchRevolution active={active} t={transition} />
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
