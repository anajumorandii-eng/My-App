import { useId, type ReactNode } from 'react';
import type { CircuitComponent, StudyVisual } from '../lib/studyVisual';
import { figureInk } from '../lib/figureInk';

type Of<T extends StudyVisual['type']> = Extract<StudyVisual, { type: T }>;
const ink = figureInk.ink;

function Frame({ title, caption, width, height, className, children }: { title: string; caption: string; width: number; height: number; className: string; children: ReactNode }) {
  const id = useId();
  return <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby={`${id}-title ${id}-description`} className={`crivo-diagram ${className}`}>
    <title id={`${id}-title`}>{title}</title><desc id={`${id}-description`}>{caption}</desc>
    {children}
  </svg>;
}

const KIND_NAME: Record<CircuitComponent['kind'], string> = {
  battery: 'gerador', resistor: 'resistor', lamp: 'lâmpada', capacitor: 'capacitor', switch: 'chave', ammeter: 'amperímetro', voltmeter: 'voltímetro',
};
const SLOT = 84;

/** Símbolo na horizontal, centrado em (x, y), com os fios até as bordas do encaixe. */
function Symbol({ part, x, y }: { part: CircuitComponent; x: number; y: number }) {
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
  return <g>{body}<text x={x} y={y + 32} textAnchor="middle" fontSize="13" fontStyle="italic" fill={figureInk.nitrogen}>{part.label ?? KIND_NAME[part.kind]}</text></g>;
}

/**
 * Malha única desenhada como retângulo: os elementos vão no fio de cima, um
 * por encaixe, e um ramo em paralelo empilha seus elementos para baixo. O
 * fio de baixo fecha o circuito. Nenhum fio cruza outro.
 */
export function StudyCircuit({ visual }: { visual: Of<'circuit'> }) {
  const rows = Math.max(1, ...visual.loop.map(item => 'parallel' in item ? item.parallel.length : 1));
  const top = 40, gap = 64, bottom = top + rows * gap + 6, left = 30, width = left * 2 + visual.loop.length * SLOT;
  return <Frame title={visual.title} caption={visual.caption} width={width} height={bottom + 24} className="crivo-circuit">
    <path d={`M${left} ${top}V${bottom}H${width - left}V${top}`} fill="none" stroke={ink} strokeWidth="1.8" />
    {visual.loop.map((item, i) => {
      const x = left + SLOT * i + SLOT / 2;
      if (!('parallel' in item)) return <Symbol key={i} part={item} x={x} y={top} />;
      const last = top + (item.parallel.length - 1) * gap;
      return <g key={i}>
        <path d={`M${x - SLOT / 2} ${top}V${last}M${x + SLOT / 2} ${top}V${last}`} stroke={ink} strokeWidth="1.8" />
        <circle cx={x - SLOT / 2} cy={top} r="3" fill={ink} /><circle cx={x + SLOT / 2} cy={top} r="3" fill={ink} />
        {item.parallel.map((part, j) => <Symbol key={j} part={part} x={x} y={top + j * gap} />)}
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
export function StudyTimeline({ visual }: { visual: Of<'timeline'> }) {
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
      <text x={mid} y={axis + 34 + i * 22} textAnchor={anchor(mid)} fontSize="12" fontStyle="italic" fill={figureInk.nitrogen}>{p.label} ({yearText(p.start)}–{yearText(p.end)})</text>
    </g>; })}
    <path d={`M${x0 - 14} ${axis}H${x1 + 18}m-8 -5 8 5 -8 5`} fill="none" stroke={ink} strokeWidth="1.8" strokeLinejoin="round" />
    {events.map((e, i) => {
      const dy = levels[i % levels.length], ex = x(e.year);
      return <g key={i}>
        <line x1={ex} y1={axis} x2={ex} y2={axis + dy + 20} stroke={figureInk.line} strokeWidth="1.2" />
        <circle cx={ex} cy={axis} r="4.5" fill={figureInk.oxygen} />
        {/* Contorno de papel: a haste de um marco próximo atravessava o texto do vizinho. */}
        <text x={ex} y={axis + dy} textAnchor={anchor(ex)} fontSize="13" fill={ink} stroke="var(--fig-paper-dot, #fffdf8)" strokeWidth="4" paintOrder="stroke" strokeLinejoin="round"><tspan fontWeight="600">{yearText(e.year)}</tspan><tspan x={ex} dy="15" fontStyle="italic">{e.label}</tspan></text>
      </g>;
    })}
  </Frame>;
}

const ROMAN = ['I', 'II', 'III', 'IV'];

/**
 * Heredograma na notação dos vestibulares: quadrado masculino, círculo
 * feminino, preenchido afetado, ponto central portador. Cada geração é uma
 * fileira, na ordem em que os indivíduos foram listados.
 */
export function StudyPedigree({ visual }: { visual: Of<'pedigree'> }) {
  const W = 520, R = 13, rowGap = 92;
  const generations = Math.max(...visual.individuals.map(p => p.generation));
  const pos = new Map<string, { x: number; y: number }>();
  for (let g = 1; g <= generations; g++) {
    const row = visual.individuals.filter(p => p.generation === g);
    row.forEach((p, i) => pos.set(p.id, { x: 60 + (W - 80) * (i + 1) / (row.length + 1), y: 34 + (g - 1) * rowGap }));
  }
  return <Frame title={visual.title} caption={visual.caption} width={W} height={34 + (generations - 1) * rowGap + 44} className="crivo-pedigree">
    {Array.from({ length: generations }, (_, g) => <text key={g} x="14" y={39 + g * rowGap} fontSize="14" fontWeight="600" fill={figureInk.muted}>{ROMAN[g]}</text>)}
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
        <text x={x} y={y + R + 16} textAnchor="middle" fontSize="12" fill={figureInk.muted}>{p.id}</text>
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
  // Passos redondos: com o máximo arredondado a 50, a régua saía 87,5 e 262,5.
  const nice = (span: number, steps: number[]) => steps.find(step => step * 4 >= span) ?? steps[steps.length - 1];
  const rainMax = 4 * nice(Math.max(...visual.months.map(m => m.rain)), [25, 50, 75, 100, 125, 150, 200, 250, 500]);
  const temps = visual.months.map(m => m.temp);
  const tMin = Math.min(0, Math.floor(Math.min(...temps) / 5) * 5), tMax = tMin + 4 * nice(Math.max(...temps) - tMin, [2.5, 5, 10, 15, 20]);
  const ry = (v: number) => b - v / rainMax * (b - t), ty = (v: number) => b - (v - tMin) / (tMax - tMin) * (b - t);
  return <div>
    <Frame title={visual.title} caption={visual.caption} width={W} height={H} className="crivo-climate">
      {[0, 1, 2, 3, 4].map(i => <g key={i} fontSize="12">
        {i > 0 && <line x1={l} x2={r} y1={b - i * (b - t) / 4} y2={b - i * (b - t) / 4} stroke={figureInk.line} strokeDasharray="2 4" />}
        <text x={l - 6} y={b - i * (b - t) / 4 + 4} textAnchor="end" fill={figureInk.nitrogen}>{rainMax * i / 4}</text>
        <text x={r + 6} y={b - i * (b - t) / 4 + 4} fill={figureInk.oxygen}>{tMin + (tMax - tMin) * i / 4}</text>
      </g>)}
      {visual.months.map((m, i) => <g key={i}>
        <rect x={l + i * step + step * .18} y={ry(m.rain)} width={step * .64} height={b - ry(m.rain)} fill={figureInk.nitrogen} fillOpacity=".55" />
        <text x={l + i * step + step / 2} y={b + 16} textAnchor="middle" fontSize="12" fill={ink}>{m.label}</text>
      </g>)}
      <polyline points={visual.months.map((m, i) => `${l + i * step + step / 2},${ty(m.temp)}`).join(' ')} fill="none" stroke={figureInk.oxygen} strokeWidth="2.4" strokeLinejoin="round" />
      {visual.months.map((m, i) => <circle key={i} cx={l + i * step + step / 2} cy={ty(m.temp)} r="3" fill={figureInk.oxygen} />)}
      <path d={`M${l} ${t - 8}V${b}H${r}V${t - 8}`} fill="none" stroke={ink} strokeWidth="1.2" />
      <text x={l} y={t - 12} textAnchor="middle" fontSize="12" fontStyle="italic" fill={figureInk.nitrogen}>mm</text>
      <text x={r} y={t - 12} textAnchor="middle" fontSize="12" fontStyle="italic" fill={figureInk.oxygen}>°C</text>
      <text x={W / 2} y={H - 18} textAnchor="middle" fontSize="13" fontStyle="italic" fill={ink}>{visual.place}</text>
    </Frame>
    <ul className="crivo-chart__legend">
      <li><svg width="16" height="10" aria-hidden="true"><rect width="16" height="10" fill={figureInk.nitrogen} fillOpacity=".55" /></svg><span>Precipitação (mm, barras)</span></li>
      <li><svg width="28" height="10" aria-hidden="true"><line x1="1" x2="27" y1="5" y2="5" stroke={figureInk.oxygen} strokeWidth="2.4" /></svg><span>Temperatura média (°C, linha)</span></li>
    </ul>
  </div>;
}
