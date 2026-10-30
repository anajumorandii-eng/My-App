import { useId, type ReactNode, type Ref } from 'react';
import { useFigureText } from './useFigureText';
import { punnettCells, type CircuitComponent, type StudyVisual } from '../lib/studyVisual';
import { figureInk } from '../lib/figureInk';

type Of<T extends StudyVisual['type']> = Extract<StudyVisual, { type: T }>;
const ink = figureInk.ink;

function Frame({ title, caption, width, height, className, children, svgRef }: { title: string; caption: string; width: number; height: number; className: string; children: ReactNode; svgRef?: Ref<SVGSVGElement> }) {
  const id = useId();
  return <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby={`${id}-title ${id}-description`} className={`crivo-diagram ${className}`}>
    <title id={`${id}-title`}>{title}</title><desc id={`${id}-description`}>{caption}</desc>
    {children}
  </svg>;
}

const KIND_NAME: Record<CircuitComponent['kind'], string> = {
  battery: 'gerador', resistor: 'resistor', lamp: 'lâmpada', capacitor: 'capacitor', switch: 'chave', ammeter: 'amperímetro', voltmeter: 'voltímetro',
};
const SLOT = 84;

/** Símbolo na horizontal, centrado em (x, y), com os fios até as bordas do encaixe. */
function Symbol({ part, x, y, fs }: { part: CircuitComponent; x: number; y: number; fs: (n: number) => number }) {
  const half = SLOT / 2, s = { stroke: ink, strokeWidth: 1.8, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const wire = (gap: number) => <path d={`M${x - half} ${y}H${x - gap}M${x + gap} ${y}H${x + half}`} {...s} />;
  const meter = (letter: string) => <>{wire(13)}<circle cx={x} cy={y} r="13" {...s} /><text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="600" fill={ink}>{letter}</text></>;
  const body = {
    battery: <>{wire(5)}<path d={`M${x - 5} ${y - 16}V${y + 16}`} {...s} /><path d={`M${x + 5} ${y - 8}V${y + 8}`} {...s} strokeWidth="4" /><text x={x - 14} y={y - 10} fontSize="12" fill={ink}>+</text></>,
    resistor: <>{wire(22)}<path d={`M${x - 22} ${y}l4 -8l7 16l7 -16l7 16l7 -16l7 16l3 -8`} {...s} /></>,
    lamp: <>{wire(12)}<circle cx={x} cy={y} r="12" {...s} /><path d={`M${x - 8.5} ${y - 8.5}l17 17M${x + 8.5} ${y - 8.5}l-17 17`} {...s} /></>,
    capacitor: <>{wire(5)}<path d={`M${x - 5} ${y - 14}V${y + 14}M${x + 5} ${y - 14}V${y + 14}`} {...s} /></>,
    switch: <>{wire(14)}<circle cx={x - 14} cy={y} r="2.5" fill={ink} /><circle cx={x + 14} cy={y} r="2.5" fill={ink} /><path d={`M${x - 14} ${y}L${x + 12} ${y - 14}`} {...s} /></>,
    ammeter: meter('A'),
    voltmeter: meter('V'),
  }[part.kind];
  return <g>{body}<text x={x} y={y + 32} textAnchor="middle" fontSize={fs(13)} fontStyle="italic" fill={figureInk.nitrogen}>{part.label ?? KIND_NAME[part.kind]}</text></g>;
}

/**
 * Malha única desenhada como retângulo: os elementos vão no fio de cima, um
 * por encaixe, e um ramo em paralelo empilha seus elementos para baixo. O
 * fio de baixo fecha o circuito. Nenhum fio cruza outro.
 */
export function StudyCircuit({ visual }: { visual: Of<'circuit'> }) {
  const rows = Math.max(1, ...visual.loop.map(item => 'parallel' in item ? item.parallel.length : 1));
  const top = 40, gap = 64, bottom = top + rows * gap + 6, left = 30, width = left * 2 + visual.loop.length * SLOT;
  const { ref, fs } = useFigureText<SVGSVGElement>(width);
  return <Frame svgRef={ref} title={visual.title} caption={visual.caption} width={width} height={bottom + 24} className="crivo-circuit">
    <path d={`M${left} ${top}V${bottom}H${width - left}V${top}`} fill="none" stroke={ink} strokeWidth="1.8" />
    {visual.loop.map((item, i) => {
      const x = left + SLOT * i + SLOT / 2;
      if (!('parallel' in item)) return <Symbol key={i} part={item} x={x} y={top} fs={fs} />;
      const last = top + (item.parallel.length - 1) * gap;
      return <g key={i}>
        <path d={`M${x - SLOT / 2} ${top}V${last}M${x + SLOT / 2} ${top}V${last}`} stroke={ink} strokeWidth="1.8" />
        <circle cx={x - SLOT / 2} cy={top} r="3" fill={ink} /><circle cx={x + SLOT / 2} cy={top} r="3" fill={ink} />
        {item.parallel.map((part, j) => <Symbol key={j} part={part} x={x} y={top + j * gap} fs={fs} />)}
      </g>;
    })}
  </Frame>;
}

const yearText = (year: number) => year < 0 ? `${-year} a.C.` : String(year);

/**
 * Linha do tempo em escala: a distância entre dois marcos é proporcional ao
 * intervalo. Os marcos ficam acima do eixo, em três alturas que se alternam,
 * e os períodos abaixo dele: com os dois do mesmo lado, "Golpe do Estado
 * Novo" caía em cima do rótulo do período "Estado Novo".
 */
function TimelineAxis({ visual, fs }: { visual: Of<'timeline'>; fs: (n: number) => number }) {
  const W = 560, axis = 168, x0 = 40, x1 = W - 40, periods = visual.periods ?? [];
  const events = [...visual.events].sort((a, b) => a.year - b.year);
  const years = [...events.map(e => e.year), ...periods.flatMap(p => [p.start, p.end])];
  const min = Math.min(...years), max = Math.max(...years);
  const x = (year: number) => x0 + (year - min) / ((max - min) || 1) * (x1 - x0);
  const levels = [-30, -76, -122];
  const anchor = (at: number) => at < 110 ? 'start' : at > W - 110 ? 'end' : 'middle';
  return <Frame title={visual.title} caption={visual.caption} width={W} height={axis + 34 + periods.length * 22} className="crivo-timeline">
    {periods.map((p, i) => { const mid = (x(p.start) + x(p.end)) / 2; return <g key={`p${i}`}>
      <rect x={x(p.start)} y={axis + 7} width={Math.max(2, x(p.end) - x(p.start))} height="7" rx="2" fill={figureInk.nitrogen} fillOpacity={.3 + .2 * (i % 2)} />
      <text x={mid} y={axis + 34 + i * 22} textAnchor={anchor(mid)} fontSize={fs(12)} fontStyle="italic" fill={figureInk.nitrogen}>{p.label} ({yearText(p.start)}–{yearText(p.end)})</text>
    </g>; })}
    <path d={`M${x0 - 14} ${axis}H${x1 + 18}m-8 -5 8 5 -8 5`} fill="none" stroke={ink} strokeWidth="1.8" strokeLinejoin="round" />
    {events.map((e, i) => {
      const dy = levels[i % levels.length], ex = x(e.year);
      return <g key={i}>
        <line x1={ex} y1={axis} x2={ex} y2={axis + dy + 20} stroke={figureInk.line} strokeWidth="1.2" />
        <circle cx={ex} cy={axis} r="4.5" fill={figureInk.oxygen} />
        {/* Contorno de papel: a haste de um marco próximo atravessava o texto do vizinho. */}
        <text x={ex} y={axis + dy} textAnchor={anchor(ex)} fontSize={fs(13)} fill={ink} stroke="var(--fig-paper-dot, #fffdf8)" strokeWidth="4" paintOrder="stroke" strokeLinejoin="round"><tspan fontWeight="600">{yearText(e.year)}</tspan><tspan x={ex} dy="15" fontStyle="italic">{e.label}</tspan></text>
      </g>;
    })}
  </Frame>;
}

/** Abaixo desta largura a linha do tempo vira lista vertical. */
export const TIMELINE_STACK_PX = 480;

/**
 * Seis marcos lado a lado não cabem em 300 px de celular nem com o piso de
 * texto: o rótulo de um encostava no do vizinho. Na tela estreita a escala
 * vira lista, em HTML, onde o rótulo quebra linha em vez de sumir.
 */
export function StudyTimeline({ visual }: { visual: Of<'timeline'> }) {
  const { ref, width, fs } = useFigureText<HTMLDivElement>(560);
  const events = [...visual.events].sort((a, b) => a.year - b.year);
  const periods = visual.periods ?? [];
  return <div ref={ref}>
    {width > 0 && width < TIMELINE_STACK_PX ? <>
      <ol aria-label={visual.title} className="crivo-vtimeline">
        {events.map((event, i) => <li key={i} className="crivo-vtimeline__event">
          <b>{yearText(event.year)}</b><span>{event.label}</span>
          {periods.filter(period => period.start <= event.year && event.year <= period.end).map(period => <em key={period.label}>{period.label}</em>)}
        </li>)}
      </ol>
      {periods.length > 0 && <ul aria-label="Períodos" className="crivo-vtimeline__periods">
        {periods.map(period => <li key={period.label}><b>{yearText(period.start)}–{yearText(period.end)}</b> {period.label}</li>)}
      </ul>}
    </> : <TimelineAxis visual={visual} fs={fs} />}
  </div>;
}

const ROMAN = ['I', 'II', 'III', 'IV'];

/**
 * Heredograma na notação dos vestibulares: quadrado masculino, círculo
 * feminino, preenchido afetado, ponto central portador. Cada geração é uma
 * fileira, na ordem em que os indivíduos foram listados.
 */
export function StudyPedigree({ visual }: { visual: Of<'pedigree'> }) {
  const W = 520, R = 13, rowGap = 92;
  const { ref, fs } = useFigureText<SVGSVGElement>(W);
  const generations = Math.max(...visual.individuals.map(p => p.generation));
  const pos = new Map<string, { x: number; y: number }>();
  for (let g = 1; g <= generations; g++) {
    const row = visual.individuals.filter(p => p.generation === g);
    row.forEach((p, i) => pos.set(p.id, { x: 60 + (W - 80) * (i + 1) / (row.length + 1), y: 34 + (g - 1) * rowGap }));
  }
  return <Frame svgRef={ref} title={visual.title} caption={visual.caption} width={W} height={34 + (generations - 1) * rowGap + 44} className="crivo-pedigree">
    {Array.from({ length: generations }, (_, g) => <text key={g} x="14" y={39 + g * rowGap} fontSize={fs(14)} fontWeight="600" fill={figureInk.muted}>{ROMAN[g]}</text>)}
    {visual.couples.map((c, i) => {
      const a = pos.get(c.a)!, b = pos.get(c.b)!, mid = (a.x + b.x) / 2, kids = c.children.map(k => pos.get(k)!);
      const sib = a.y + rowGap / 2;
      return <g key={i} stroke={ink} strokeWidth="1.6" fill="none">
        <path d={`M${Math.min(a.x, b.x) + R} ${a.y}H${Math.max(a.x, b.x) - R}`} />
        {kids.length > 0 && <path d={`M${mid} ${a.y}V${sib}M${Math.min(mid, ...kids.map(k => k.x))} ${sib}H${Math.max(mid, ...kids.map(k => k.x))}${kids.map(k => `M${k.x} ${sib}V${k.y - R}`).join('')}`} />}
      </g>;
    })}
    {visual.individuals.map(p => {
      const { x, y } = pos.get(p.id)!, fill = p.affected ? ink : 'var(--fig-paper-dot, #fffdf8)';
      return <g key={p.id}>
        {p.sex === 'M' ? <rect x={x - R} y={y - R} width={R * 2} height={R * 2} fill={fill} stroke={ink} strokeWidth="1.8" />
          : <circle cx={x} cy={y} r={R} fill={fill} stroke={ink} strokeWidth="1.8" />}
        {p.carrier && !p.affected && <circle cx={x} cy={y} r="4" fill={ink} />}
        <text x={x} y={y + R + 16} textAnchor="middle" fontSize={fs(12)} fill={figureInk.muted}>{p.id}</text>
      </g>;
    })}
  </Frame>;
}

/**
 * Climograma: chuva em barras (eixo da esquerda, mm) e temperatura em linha
 * (eixo da direita, °C), como nas questões de Geografia. Os dois eixos têm
 * escala própria; um eixo só achataria a temperatura contra a chuva.
 */
export function StudyClimate({ visual }: { visual: Of<'climate'> }) {
  const W = 500, H = 300, l = 52, r = W - 52, t = 26, b = 236, step = (r - l) / 12;
  const { ref, fs } = useFigureText<SVGSVGElement>(W);
  // Passos redondos: com o máximo arredondado a 50, a régua saía 87,5 e 262,5.
  const nice = (span: number, steps: number[]) => steps.find(step => step * 4 >= span) ?? steps[steps.length - 1];
  const rainMax = 4 * nice(Math.max(...visual.months.map(m => m.rain)), [25, 50, 75, 100, 125, 150, 200, 250, 500]);
  const temps = visual.months.map(m => m.temp);
  const tMin = Math.min(0, Math.floor(Math.min(...temps) / 5) * 5), tMax = tMin + 4 * nice(Math.max(...temps) - tMin, [2.5, 5, 10, 15, 20]);
  const ry = (v: number) => b - v / rainMax * (b - t), ty = (v: number) => b - (v - tMin) / (tMax - tMin) * (b - t);
  return <div>
    <Frame svgRef={ref} title={visual.title} caption={visual.caption} width={W} height={H} className="crivo-climate">
      {[0, 1, 2, 3, 4].map(i => <g key={i} fontSize={fs(12)}>
        {i > 0 && <line x1={l} x2={r} y1={b - i * (b - t) / 4} y2={b - i * (b - t) / 4} stroke={figureInk.line} strokeDasharray="2 4" />}
        <text x={l - 6} y={b - i * (b - t) / 4 + 4} textAnchor="end" fill={figureInk.nitrogen}>{rainMax * i / 4}</text>
        <text x={r + 6} y={b - i * (b - t) / 4 + 4} fill={figureInk.oxygen}>{tMin + (tMax - tMin) * i / 4}</text>
      </g>)}
      {visual.months.map((m, i) => <g key={i}>
        <rect x={l + i * step + step * .18} y={ry(m.rain)} width={step * .64} height={b - ry(m.rain)} fill={figureInk.nitrogen} fillOpacity=".55" />
        <text x={l + i * step + step / 2} y={b + 16} textAnchor="middle" fontSize={fs(12)} fill={ink}>{m.label}</text>
      </g>)}
      <polyline points={visual.months.map((m, i) => `${l + i * step + step / 2},${ty(m.temp)}`).join(' ')} fill="none" stroke={figureInk.oxygen} strokeWidth="2.4" strokeLinejoin="round" />
      {visual.months.map((m, i) => <circle key={i} cx={l + i * step + step / 2} cy={ty(m.temp)} r="3" fill={figureInk.oxygen} />)}
      <path d={`M${l} ${t - 8}V${b}H${r}V${t - 8}`} fill="none" stroke={ink} strokeWidth="1.2" />
      <text x={l} y={t - 12} textAnchor="middle" fontSize={fs(12)} fontStyle="italic" fill={figureInk.nitrogen}>mm</text>
      <text x={r} y={t - 12} textAnchor="middle" fontSize={fs(12)} fontStyle="italic" fill={figureInk.oxygen}>°C</text>
      <text x={W / 2} y={H - 18} textAnchor="middle" fontSize={fs(13)} fontStyle="italic" fill={ink}>{visual.place}</text>
    </Frame>
    <ul className="crivo-chart__legend">
      <li><svg width="16" height="10" aria-hidden="true"><rect width="16" height="10" fill={figureInk.nitrogen} fillOpacity=".55" /></svg><span>Precipitação (mm, barras)</span></li>
      <li><svg width="28" height="10" aria-hidden="true"><line x1="1" x2="27" y1="5" y2="5" stroke={figureInk.oxygen} strokeWidth="2.4" /></svg><span>Temperatura média (°C, linha)</span></li>
    </ul>
  </div>;
}

/**
 * Quadro de Punnett em tabela HTML: lê em qualquer largura e no PDF, e o
 * leitor de tela percorre linha e coluna. Genótipos e proporção vêm de
 * punnettCells; o modelo só informa os gametas.
 */
export function StudyPunnett({ visual }: { visual: Of<'punnett'> }) {
  const { rows, ratio } = punnettCells(visual.gametes);
  const [left, top] = visual.parents ?? ['♀', '♂'];
  return <div className="crivo-punnett">
    <table aria-label={visual.title}>
      <thead><tr><th scope="col" className="crivo-punnett__corner"><span>{top}</span><span>{left}</span></th>
        {visual.gametes[0].map((g, i) => <th key={i} scope="col">{g}</th>)}</tr></thead>
      <tbody>{rows.map((row, r) => <tr key={r}><th scope="row">{visual.gametes[1][r]}</th>{row.map((cell, c) => <td key={c}>{cell}</td>)}</tr>)}</tbody>
    </table>
    <p className="crivo-punnett__ratio"><b>Proporção genotípica:</b> {ratio.map(item => `${item.count} ${item.genotype}`).join(' : ')}</p>
  </div>;
}

/** Abaixo desta largura o ciclo vira lista que retorna ao início. */
export const CYCLE_RING_PX = 460;

/**
 * Ciclo fechado: carbono, nitrogênio, água, ciclo celular, Krebs. O fluxo
 * linear não voltava ao começo, e o retorno é justamente o que o ciclo ensina.
 * Na tela larga, etapas num anel com setas; na estreita, lista com o retorno
 * escrito, porque o anel em 300 px empilhava caixas sobre as setas.
 */
export function StudyCycle({ visual }: { visual: Of<'cycle'> }) {
  const { ref, width } = useFigureText<HTMLDivElement>(CYCLE_RING_PX);
  const n = visual.steps.length;
  const at = (i: number) => (-90 + 360 * i / n) * Math.PI / 180;
  const R = 38, gap = 360 / n * 0.3;
  const arc = (i: number) => {
    const a = at(i) + gap * Math.PI / 180, b = at(i + 1) - gap * Math.PI / 180;
    const p = (t: number) => `${50 + R * Math.cos(t)} ${50 + R * Math.sin(t)}`;
    return `M${p(a)}A${R} ${R} 0 0 1 ${p(b)}`;
  };
  return <div ref={ref}>
    {width > 0 && width < CYCLE_RING_PX ? <ol aria-label={visual.title} className="crivo-flow">
      {visual.steps.map((step, i) => <li key={i} className="crivo-flow__item">
        {i > 0 && <span aria-hidden="true" className="crivo-cycle__down">↓</span>}
        <div className="crivo-flow__step">{step}</div>
      </li>)}
      <li className="crivo-cycle__return">↺ recomeça em: {visual.steps[0]}</li>
    </ol> : <div className="crivo-cycle" role="img" aria-label={`${visual.title}: ${visual.steps.join(' → ')} → volta ao início`}>
      <svg viewBox="0 0 100 100" aria-hidden="true" className="crivo-cycle__ring">
        <defs><marker id="crivo-cycle-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill={figureInk.oxygen} /></marker></defs>
        {visual.steps.map((_, i) => <path key={i} d={arc(i)} fill="none" stroke={figureInk.oxygen} strokeWidth=".7" markerEnd="url(#crivo-cycle-head)" />)}
      </svg>
      {visual.steps.map((step, i) => <div key={i} className="crivo-cycle__step" style={{ left: `${50 + R * Math.cos(at(i))}%`, top: `${50 + R * Math.sin(at(i))}%` }}>{step}</div>)}
      {visual.center && <div className="crivo-cycle__center">{visual.center}</div>}
    </div>}
  </div>;
}
