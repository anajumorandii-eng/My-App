import { useId } from 'react';
import type { StudyVisual } from '../lib/studyVisual';
import { figureInk } from '../lib/figureInk';
type Geometry = Extract<StudyVisual, { type: 'geometry' }>;

const W = 400, H = 300, PAD = 40;

/**
 * Figura geométrica desenhada a partir das coordenadas do modelo. A escala é
 * uniforme nos dois eixos: esticar um deles para preencher o quadro faria o
 * quadrado virar retângulo e o ângulo reto deixar de parecer reto.
 */
export function StudyGeometry({ visual }: { visual: Geometry }) {
  const id = useId();
  const circles = visual.circles ?? [];
  const byId = new Map(visual.points.map(p => [p.id, p]));
  const xs = visual.points.map(p => p.x), ys = visual.points.map(p => p.y);
  for (const c of circles) { const o = byId.get(c.center)!; xs.push(o.x - c.radius, o.x + c.radius); ys.push(o.y - c.radius, o.y + c.radius); }
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const scale = Math.min((W - 2 * PAD) / ((maxX - minX) || 1), (H - 2 * PAD) / ((maxY - minY) || 1));
  const offX = (W - (maxX - minX) * scale) / 2, offY = (H - (maxY - minY) * scale) / 2;
  const at = (pid: string) => { const p = byId.get(pid)!; return { x: offX + (p.x - minX) * scale, y: H - offY - (p.y - minY) * scale }; };
  // Rótulos se afastam do centro da figura: assim saem do lado de fora do
  // polígono, em vez de cair sobre os lados.
  const center = visual.points.map(p => at(p.id)).reduce((sum, p, _, all) => ({ x: sum.x + p.x / all.length, y: sum.y + p.y / all.length }), { x: 0, y: 0 });
  const away = (x: number, y: number, distance: number) => {
    const dx = x - center.x, dy = y - center.y, len = Math.hypot(dx, dy) || 1;
    return { x: x + dx / len * distance, y: y + dy / len * distance };
  };
  const edgeKey = (a: string, b: string) => a < b ? `${a}|${b}` : `${b}|${a}`;
  const segmentEdges = new Set((visual.segments ?? []).map(s => edgeKey(s.from, s.to)));
  const polygonEdges = [...new Map((visual.polygons ?? []).flatMap(p => p.vertices.map((v, i) => [v, p.vertices[(i + 1) % p.vertices.length]] as const))
    .filter(([a, b]) => !segmentEdges.has(edgeKey(a, b)))
    .map(edge => [edgeKey(...edge), edge] as const)).values()];
  const label = { fontSize: 15, fill: figureInk.ink } as const;

  return <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby={`${id}-title ${id}-description`} className="crivo-geometry">
    <title id={`${id}-title`}>{visual.title}</title><desc id={`${id}-description`}>{visual.caption}</desc>
    {(visual.polygons ?? []).map((polygon, i) => <polygon key={`p${i}`}
      points={polygon.vertices.map(v => { const p = at(v); return `${p.x},${p.y}`; }).join(' ')}
      fill={figureInk.line} fillOpacity=".45" stroke="none" />)}
    {/* O contorno vai lado a lado, e o lado que também é segmento fica só com
        o segmento: com o contorno inteiro por baixo, o lado tracejado (aresta
        oculta, construção auxiliar) saía contínuo, porque o traço sólido
        preenchia as falhas do tracejado. */}
    {polygonEdges.map(([from, to], i) => { const a = at(from), b = at(to); return <line key={`e${i}`}
      x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={figureInk.ink} strokeWidth="1.8" strokeLinecap="round" />; })}
    {circles.map((circle, i) => { const o = at(circle.center), r = circle.radius * scale; return <g key={`c${i}`}>
      <circle cx={o.x} cy={o.y} r={r} fill="none" stroke={figureInk.ink} strokeWidth="1.8" />
      {circle.label && <>
        <line x1={o.x} y1={o.y} x2={o.x + r} y2={o.y} stroke={figureInk.nitrogen} strokeWidth="1.4" strokeDasharray="5 4" />
        <text x={o.x + r / 2} y={o.y - 6} textAnchor="middle" fontStyle="italic" {...label} fill={figureInk.nitrogen}>{circle.label}</text>
      </>}
    </g>; })}
    {(visual.segments ?? []).map((segment, i) => {
      // A medida vai na perpendicular do lado, do lado oposto ao centro da
      // figura. Afastar do centro em linha reta deixava o "5 cm" da
      // hipotenusa em cima do próprio traço.
      const a = at(segment.from), b = at(segment.to), mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
      let nx = -(b.y - a.y) / len, ny = (b.x - a.x) / len;
      if (nx * (mx - center.x) + ny * (my - center.y) < 0) { nx = -nx; ny = -ny; }
      const mid = { x: mx + nx * 12, y: my + ny * 12 };
      const anchor = nx > .35 ? 'start' : nx < -.35 ? 'end' : 'middle';
      return <g key={`s${i}`}>
        <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={segment.arrow ? figureInk.oxygen : figureInk.ink} strokeWidth={segment.arrow ? 2.2 : 1.8} strokeLinecap="round" strokeDasharray={segment.dashed ? '6 5' : undefined} />
        {/* Seta para força, velocidade, campo e raio de luz: sem ela o
            diagrama de corpo livre vira um traço sem sentido. */}
        {segment.arrow && (() => { const ux = (b.x - a.x) / len, uy = (b.y - a.y) / len, h = 11;
          return <path d={`M${b.x - ux * h - uy * h * .5} ${b.y - uy * h + ux * h * .5}L${b.x} ${b.y}L${b.x - ux * h + uy * h * .5} ${b.y - uy * h - ux * h * .5}`} fill="none" stroke={figureInk.oxygen} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />; })()}
        {segment.label && <text x={mid.x} y={mid.y + 5 + ny * 4} textAnchor={anchor} fontStyle="italic" {...label} fill={segment.arrow ? figureInk.oxygen : figureInk.nitrogen}>{segment.label}</text>}
      </g>;
    })}
    {(visual.angles ?? []).map((angle, i) => {
      const v = at(angle.vertex), a = at(angle.from), b = at(angle.to);
      const ua = Math.atan2(a.y - v.y, a.x - v.x), ub = Math.atan2(b.y - v.y, b.x - v.x);
      let delta = ub - ua; while (delta <= -Math.PI) delta += 2 * Math.PI; while (delta > Math.PI) delta -= 2 * Math.PI;
      const r = 22, mid = ua + delta / 2;
      const p = (t: number, rr = r) => ({ x: v.x + Math.cos(t) * rr, y: v.y + Math.sin(t) * rr });
      const s = p(ua), e = p(ub), text = p(mid, r + 16);
      const mark = angle.right
        ? (() => { const q = 14, c1 = p(ua, q), c3 = p(ub, q); return <path d={`M${c1.x} ${c1.y}L${c1.x + c3.x - v.x} ${c1.y + c3.y - v.y}L${c3.x} ${c3.y}`} fill="none" stroke={figureInk.oxygen} strokeWidth="1.5" />; })()
        : <path d={`M${s.x} ${s.y}A${r} ${r} 0 0 ${delta > 0 ? 1 : 0} ${e.x} ${e.y}`} fill="none" stroke={figureInk.oxygen} strokeWidth="1.5" />;
      return <g key={`a${i}`}>{mark}
        {angle.label && <text x={text.x} y={text.y + 5} textAnchor="middle" fontStyle="italic" {...label} fill={figureInk.oxygen}>{angle.label}</text>}
      </g>;
    })}
    {visual.points.filter(point => !point.hidden).map(point => { const p = at(point.id), t = away(p.x, p.y, 16); return <g key={point.id}>
      <circle cx={p.x} cy={p.y} r="3" fill={figureInk.ink} />
      <text x={t.x} y={t.y + 5} textAnchor="middle" fontWeight="600" {...label}>{point.id}</text>
    </g>; })}
  </svg>;
}
