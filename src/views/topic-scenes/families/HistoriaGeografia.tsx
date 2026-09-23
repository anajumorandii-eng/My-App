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

function FrenchRevolution({ active }: { active: number }) {
  const stops = [88, 235, 382, 529];
  const labels = [
    ['crise fiscal', '1789'],
    ['Assembleia', 'jun. 1789'],
    ['Bastilha', 'jul. 1789'],
    ['Terror', '1793–94'],
  ];
  return <svg viewBox="0 0 620 350" role="img" aria-label={`Revolução Francesa: crise fiscal, Assembleia Nacional, Bastilha e Terror; etapa ${active + 1} destacada`}>
    <rect x="8" y="8" width="604" height="334" rx="18" className="hg-paper" />
    <text x="30" y="43" className="hg-kicker">FRANÇA · 1789–1794</text>
    <path d="M88 158H529" className="hg-timeline" />
    {stops.map((x, i) => <g key={x} className={active === i ? 'hg-stop hg-stop-active' : 'hg-stop'}>
      <circle cx={x} cy="158" r="21" />
      <text x={x} y="164" textAnchor="middle" className="hg-number">{i + 1}</text>
      <text x={x} y="202" textAnchor="middle" className="hg-date">{labels[i][1]}</text>
      <text x={x} y="225" textAnchor="middle" className="hg-label">{labels[i][0]}</text>
    </g>)}
    <path d="M88 110V75H235V110" className="hg-bracket" />
    <text x="161" y="93" textAnchor="middle" className="hg-annotation">conflito fiscal e político</text>
    <path d="M382 246V274H529V246" className="hg-bracket hg-bracket-late" />
    <text x="455" y="296" textAnchor="middle" className="hg-annotation">radicalização, sem causa única</text>
    <text x="30" y="329" className="hg-footnote">guerra externa + desconfiança interna → contexto do Terror</text>
  </svg>;
}

function ProjectionComparison({ active }: { active: number }) {
  const centers = [108, 310, 512];
  const titles = ['CONFORME', 'EQUIVALENTE', 'EQUIDISTANTE'];
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
      </g>}
      {i === 1 && <g>
        <ellipse cx={x} cy="166" rx="65" ry="61" className="hg-map-shape" />
        <path d={`M${x - 65} 166H${x + 65}M${x - 54} 135H${x + 54}M${x - 54} 197H${x + 54}M${x} 105V227`} className="hg-graticule" />
        <path d={`M${x - 34} 121q17-11 31 4l-11 14-18-3Zm9 44q26-7 39 9l-12 21-28-5Z`} className="hg-land" />
      </g>}
      {i === 2 && <g>
        <circle cx={x} cy="166" r="62" className="hg-map-shape" />
        {[20, 40].map(r => <circle key={r} cx={x} cy="166" r={r} className="hg-graticule" />)}
        <path d={`M${x - 62} 166H${x + 62}M${x} 104V228M${x - 44} 122l88 88M${x + 44} 122l-88 88`} className="hg-graticule" />
        <circle cx={x} cy="166" r="5" className="hg-center" />
      </g>}
      <text x={x} y="257" textAnchor="middle" className="hg-preserve">{['forma local', 'área relativa', 'distância do centro'][i]}</text>
      <text x={x} y="282" textAnchor="middle" className="hg-preserve-small">{['áreas se alteram', 'formas se alteram', 'outros pares variam'][i]}</text>
    </g>)}
    <text x="30" y="334" className="hg-footnote">Esquemas de propriedades; não são mapas para medir lugares.</text>
  </svg>;
}

function IndustrialRevolution({ active }: { active: number }) {
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Revolução Industrial: cercamentos geram trabalho assalariado e capital; condições fabris documentadas e pressão social contribuem para leis fabris; recorte ${active + 1} destacado`}>
    <defs><marker id="hg-arrowhead" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4 0 8Z" fill="#477981" /></marker></defs>
    <rect x="8" y="8" width="604" height="344" rx="18" className="hg-paper" />
    <text x="28" y="39" className="hg-kicker">INGLATERRA · TRABALHO, FÁBRICA E REFORMA</text>
    <g className={active === 0 ? 'hg-process-active' : 'hg-process'}>
      <path d="M35 170H174M35 201H174M35 232H174M72 160V241M127 160V241" className="hg-field" />
      <path d="M171 155V245" className="hg-fence" />
      <text x="104" y="277" textAnchor="middle" className="hg-label">cercamentos</text>
    </g>
    <path d="M178 195H239" className="hg-arrow" />
    <text x="209" y="166" textAnchor="middle" className="hg-small">mão de obra</text>
    <text x="209" y="181" textAnchor="middle" className="hg-small">+ capital</text>
    <g className={active === 1 ? 'hg-process-active' : 'hg-process'}>
      <path d="M251 151H384V247H251Z" className="hg-factory" />
      <path d="M263 151V109H281V151M297 151V125H315V151" className="hg-chimney" />
      <path d="M266 178h29v28h-29Zm45 0h29v28h-29Zm-45 44h74" className="hg-window" />
      <text x="318" y="277" textAnchor="middle" className="hg-label">trabalho fabril</text>
    </g>
    <path d="M387 195H438" className="hg-arrow" />
    <text x="413" y="165" textAnchor="middle" className="hg-small">investigação</text>
    <g className={active === 2 ? 'hg-process-active' : 'hg-process'}>
      <path d="M451 118h109v132H451z" className="hg-document" />
      <path d="M467 147h73M467 165h73M467 183h58M467 201h73" className="hg-document-line" />
      <text x="506" y="277" textAnchor="middle" className="hg-label">leis fabris</text>
    </g>
    <path d="M409 289H578" className="hg-bracket" />
    <text x="493" y="307" textAnchor="middle" className="hg-small">documentação + pressão social</text>
    <text x="28" y="337" className="hg-footnote">A reforma levou décadas; a lei não surgiu automaticamente da fábrica.</text>
  </svg>;
}

function RainMechanisms({ active }: { active: number }) {
  const centers = [108, 310, 512];
  const titles = ['CONVECTIVA', 'OROGRÁFICA', 'FRONTAL'];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Chuva convectiva por ar aquecido, orográfica por relevo e frontal pelo encontro de massas de ar; ${titles[active].toLowerCase()} selecionada`}>
    <defs><marker id="hg-arrowhead" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4 0 8Z" fill="#477981" /></marker></defs>
    <rect x="8" y="8" width="604" height="344" rx="18" className="hg-paper" />
    <text x="28" y="39" className="hg-kicker">TRÊS CAMINHOS PARA O AR ÚMIDO SUBIR</text>
    {centers.map((x, i) => <g key={x} className={active === i ? 'hg-projection hg-projection-active' : 'hg-projection'}>
      <rect x={x - 91} y="55" width="182" height="255" rx="13" className="hg-panel" />
      <text x={x} y="82" textAnchor="middle" className="hg-panel-title">{titles[i]}</text>
      <path d={`M${x - 72} 237H${x + 72}`} className="hg-ground-line" />
      {i === 0 && <g>
        <path d={`M${x - 44} 231v-25m25 25v-29m25 29v-25`} className="hg-heat" />
        <path d={`M${x} 201v-64`} className="hg-rain-arrow" />
        <path d={`M${x - 31} 126q-6-19 15-24 12-16 28-3 23-5 28 18 17 10 3 25h-65q-20-3-9-16Z`} className="hg-cloud" />
        <path d={`M${x - 15} 148l-5 15m24-15-5 15m24-15-5 15`} className="hg-rain" />
      </g>}
      {i === 1 && <g>
        <path d={`M${x - 67} 237l65-98 64 98Z`} className="hg-mountain" />
        <path d={`M${x - 74} 200q30 0 47-32l21-30`} className="hg-rain-arrow" />
        <path d={`M${x - 47} 139q-4-17 17-19 12-13 27-2 17-2 23 17Z`} className="hg-cloud" />
        <path d={`M${x - 30} 149l-5 15m20-15-5 15`} className="hg-rain" />
        <text x={x - 48} y="260" className="hg-small">barlavento</text>
      </g>}
      {i === 2 && <g>
        <path d={`M${x - 70} 224q30 0 68-57 32-42 71-43`} className="hg-front" />
        <path d={`M${x - 35} 203q30-39 48-73`} className="hg-rain-arrow" />
        <path d={`M${x - 14} 119q-5-15 12-18 12-15 25-3 21-3 26 18Z`} className="hg-cloud" />
        <path d={`M${x + 2} 135l-5 15m21-15-5 15m21-15-5 15`} className="hg-rain" />
      </g>}
      <text x={x} y="287" textAnchor="middle" className="hg-preserve">{['aquecimento', 'barreira do relevo', 'massas em encontro'][i]}</text>
    </g>)}
    <text x="28" y="335" className="hg-footnote">A causa da ascensão distingue os tipos; eles podem ocorrer em regiões diferentes.</text>
  </svg>;
}

export function HistoriaGeografia({ entry }: { entry: SceneEntry }) {
  const [active, setActive] = useState(0);
  const transition = useSceneMotion();
  const item = entry.items[active];
  const history = entry.chapterId.startsWith('summary-historia-');
  return <section className="tc-scene hg-scene" aria-label={entry.question}>
    <header><small>CRIVO · {history ? 'cronologia e causalidade' : 'cartografia comparada'}</small><h4>{entry.question}</h4></header>
    <div className="hg-figure" role="region" tabIndex={0} aria-label="Prancha visual: deslize para ver a figura inteira; com teclado, use as setas" onKeyDown={event => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      event.currentTarget.scrollLeft += event.key === 'ArrowRight' ? 120 : -120;
    }}>
      {entry.chapterId === 'summary-historia-revolucao-francesa' ? <FrenchRevolution active={active} />
        : entry.chapterId === 'summary-historia-revolucao-industrial' ? <IndustrialRevolution active={active} />
          : entry.chapterId === 'summary-geografia-dinamica-climatica' ? <RainMechanisms active={active} />
            : <ProjectionComparison active={active} />}
    </div>
    <p className="hg-pan-hint">Deslize a prancha para ver toda a figura. Com teclado, use as setas.</p>
    <div className="hg-controls" aria-label="Selecione um recorte da prancha">
      {entry.items.map((candidate, index) => <motion.button key={candidate.label} type="button" aria-pressed={active === index} onClick={() => setActive(index)} animate={{ y: active === index ? -2 : 0 }} transition={transition}>{candidate.label}</motion.button>)}
    </div>
    <aside className="hg-detail" role="status" aria-live="polite"><strong>{item.label}</strong><p>{item.claim}</p><blockquote>“{item.quote}” <cite>{item.section}</cite></blockquote></aside>
    {!history && entry.nota && <p className="hg-note">{entry.nota}</p>}
  </section>;
}
