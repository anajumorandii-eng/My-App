import React, { useId } from 'react';
import type { PhysicsSpatialDrawing, SpatialTrace } from '../../lib/physicsSpatialDrawing';
import { rotateSpatialPoint, type SpatialPoint } from '../../lib/spatialSolid';
import type { SpatialCamera } from './SpatialLabFrame';

type Role = SpatialTrace['role'];
const COLOR: Record<Role, string> = { body: 'var(--vs-ink)', signal: 'var(--vs-burgundy)', reference: 'var(--vs-dim)', sum: 'var(--vs-blue)' };
const VIEW_W = 360, VIEW_H = 320, CX = 180, CY = 150;
/** Distância da câmera: perspectiva leve, só para profundidade — não deforma a leitura das medidas. */
const CAMERA_DISTANCE = 520;
const LIGHT: SpatialPoint = (() => { const l: SpatialPoint = [-.45, .75, .5]; const n = Math.hypot(...l); return l.map(v => v / n) as SpatialPoint; })();

type Item =
  | { kind: 'trace'; depth: number; trace: SpatialTrace; points: [number, number, number][]; shade: number }
  | { kind: 'dot'; depth: number; role: Role; x: number; y: number; r: number };

/**
 * Palco comum dos modelos espaciais. Antes, cada laboratório desenhava traço fino
 * sem profundidade e o objeto ocupava um terço do quadro; a auditoria de 11/10/2026
 * mostrou que isso não era lido como 3D. Aqui tudo passa pela mesma pipeline:
 * enquadramento pelo raio do modelo (girar não muda o tamanho), perspectiva leve,
 * ordenação de trás para frente, faces sombreadas pela luz, piso em grade e
 * sombras de contato que acompanham a câmera.
 */
export function SpatialStage({ model, camera, label, dataAttributes }: {
  model: PhysicsSpatialDrawing; camera: SpatialCamera; label: string; dataAttributes: Record<string, string>;
}) {
  const uid = useId().replace(/:/g, '');
  const all = [...model.traces.flatMap(t => t.points), ...model.dots.map(d => d.point), ...model.labels.map(l => l.point)];
  const extent = Math.max(1, ...all.map(p => Math.hypot(...p)));
  const zoom = Math.min(2.4, 128 / extent);
  // O raio da esfera é desenhado em pixels; convertido para o espaço do modelo, impede o piso de atravessar a esfera.
  const floorY = all.length ? Math.min(...all.map(p => p[1]), ...model.dots.map(d => d.point[1] - (d.radius ?? 5) / Math.sqrt(zoom))) - 6 : -40;
  const toView = (p: SpatialPoint): [number, number, number] => {
    const [x, y, z] = rotateSpatialPoint(p, camera.yaw, camera.pitch);
    const k = CAMERA_DISTANCE / (CAMERA_DISTANCE - z * zoom * .6);
    return [CX + x * zoom * k, CY - y * zoom * k, z];
  };

  const items: Item[] = [];
  for (const raw of model.traces) {
    // Contorno que volta ao ponto inicial é uma superfície (anel, face, corte), não um arame: preencher dá corpo ao objeto.
    const loop = raw.points.length > 3 && Math.hypot(...raw.points[0].map((v, i) => v - raw.points[raw.points.length - 1][i])) < 1e-6;
    const trace = loop && !raw.arrow && !raw.dashed ? { ...raw, closed: true } : raw;
    const pts = trace.points.map(toView);
    const depth = pts.reduce((s, p) => s + p[2], 0) / Math.max(1, pts.length);
    let shade = .5;
    if (trace.closed && trace.points.length >= 3) {
      const q = trace.points.map(p => rotateSpatialPoint(p, camera.yaw, camera.pitch));
      const a = q[0], b = q[Math.floor(q.length / 3)], c = q[Math.floor(2 * q.length / 3)];
      const u = b.map((v, i) => v - a[i]), w = c.map((v, i) => v - a[i]);
      const n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
      const len = Math.hypot(...n) || 1;
      shade = Math.abs((n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2]) / len);
    }
    items.push({ kind: 'trace', depth, trace, points: pts, shade });
  }
  for (const dot of model.dots) {
    const [x, y, z] = toView(dot.point);
    items.push({ kind: 'dot', depth: z, role: dot.role, x, y, r: (dot.radius ?? 5) * Math.sqrt(zoom) });
  }
  items.sort((a, b) => a.depth - b.depth);
  const zs = items.map(i => i.depth), zMin = Math.min(0, ...zs), zMax = Math.max(1, ...zs);
  const near = (z: number) => (z - zMin) / Math.max(1e-6, zMax - zMin);

  const span = Math.max(40, extent * .95), step = span / 4;
  const grid: [SpatialPoint, SpatialPoint][] = [];
  for (let i = -4; i <= 4; i++) {
    grid.push([[i * step, floorY, -span], [i * step, floorY, span]]);
    grid.push([[-span, floorY, i * step], [span, floorY, i * step]]);
  }
  const shadowCenter = toView([0, floorY, 0]);
  const path = (pts: [number, number, number][], closed?: boolean) => pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ') + (closed ? ' Z' : '');

  return <svg {...camera.interaction} className="vs-plane vs-science-object vs-spatial-stage" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
    viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} role="img" aria-label={label} data-view-yaw={camera.yaw} data-view-pitch={camera.pitch} {...dataAttributes}>
    <defs>
      <radialGradient id={`${uid}-bg`} cx="42%" cy="30%" r="85%">
        <stop offset="0" stopColor="var(--vs-paper-strong)" /><stop offset=".62" stopColor="var(--vs-paper)" />
        <stop offset="1" stopColor="var(--vs-line)" stopOpacity=".55" />
      </radialGradient>
      <radialGradient id={`${uid}-key`} cx="30%" cy="12%" r="55%"><stop offset="0" stopColor="#fff" stopOpacity=".55" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
      <radialGradient id={`${uid}-floorfade`} cx="50%" cy="50%" r="50%"><stop offset=".25" stopColor="#fff" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></radialGradient>
      <mask id={`${uid}-floormask`} maskUnits="userSpaceOnUse" x="0" y="0" width={VIEW_W} height={VIEW_H}>
        <ellipse cx={shadowCenter[0]} cy={shadowCenter[1]} rx={span * zoom * 1.25} ry={span * zoom * .9} fill={`url(#${uid}-floorfade)`} />
      </mask>
      <radialGradient id={`${uid}-shadow`}><stop offset="0" stopColor="var(--vs-ink)" stopOpacity=".28" /><stop offset=".55" stopColor="var(--vs-ink)" stopOpacity=".1" /><stop offset="1" stopColor="var(--vs-ink)" stopOpacity="0" /></radialGradient>
      <filter id={`${uid}-soft`} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.2" /></filter>
      <filter id={`${uid}-glow`} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.4" /></filter>
      <filter id={`${uid}-lift`} x="-30%" y="-50%" width="160%" height="200%"><feDropShadow dx="0" dy="1.2" stdDeviation="1.4" floodColor="#2a2118" floodOpacity=".16" /></filter>
      {(Object.keys(COLOR) as Role[]).map(role => <React.Fragment key={role}>
        <marker id={`${uid}-arrow-${role}`} viewBox="0 0 12 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0.6L11 5L0 9.4L2.6 5Z" fill={COLOR[role]} /></marker>
        <radialGradient id={`${uid}-sphere-${role}`} cx="36%" cy="30%" r="72%" fx="30%" fy="24%">
          <stop offset="0" stopColor="#fff" stopOpacity=".9" /><stop offset=".22" stopColor={COLOR[role]} stopOpacity=".62" />
          <stop offset=".7" stopColor={COLOR[role]} /><stop offset="1" stopColor="#120c0a" stopOpacity=".75" />
        </radialGradient>
        <linearGradient id={`${uid}-face-${role}`} x1="0" y1="0" x2=".35" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".7" /><stop offset=".35" stopColor={COLOR[role]} stopOpacity=".55" /><stop offset="1" stopColor={COLOR[role]} />
        </linearGradient>
      </React.Fragment>)}
    </defs>
    <rect x="0" y="0" width={VIEW_W} height={VIEW_H} rx="16" fill={`url(#${uid}-bg)`} data-spatial-backdrop="true" />
    <rect x="0" y="0" width={VIEW_W} height={VIEW_H} rx="16" fill={`url(#${uid}-key)`} pointerEvents="none" />
    <g data-spatial-floor="true" mask={`url(#${uid}-floormask)`}>
      <g stroke="var(--vs-dim)" strokeWidth=".55" opacity=".42">
        {grid.map(([a, b], i) => { const p = toView(a), q = toView(b); return <line key={i} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} />; })}
      </g>
    </g>
    <ellipse cx={shadowCenter[0]} cy={shadowCenter[1]} rx={extent * zoom * .72} ry={extent * zoom * .72 * Math.max(.16, Math.abs(Math.sin(camera.pitch * Math.PI / 180)))} fill={`url(#${uid}-shadow)`} />
    <g filter={`url(#${uid}-soft)`}>
      {model.dots.map((d, i) => { const s = toView([d.point[0], floorY, d.point[2]]); const r = (d.radius ?? 5) * Math.sqrt(zoom); return <ellipse key={i} cx={s[0]} cy={s[1]} rx={r * .95} ry={r * .32} fill="var(--vs-ink)" opacity=".16" />; })}
    </g>
    {items.map((item, i) => {
      const fade = .5 + .5 * near(item.depth);
      if (item.kind === 'dot') return <g key={i} opacity={.72 + .28 * near(item.depth)}>
        <circle cx={item.x} cy={item.y} r={item.r} fill={`url(#${uid}-sphere-${item.role})`} />
        <circle cx={item.x} cy={item.y} r={item.r} fill="none" stroke="#000" strokeOpacity=".18" strokeWidth=".5" />
        {item.r > 4 && <ellipse cx={item.x - item.r * .32} cy={item.y - item.r * .38} rx={item.r * .26} ry={item.r * .16} fill="#fff" opacity=".75" transform={`rotate(-30 ${item.x - item.r * .32} ${item.y - item.r * .38})`} />}
      </g>;
      const { trace } = item, color = COLOR[trace.role], d = path(item.points, trace.closed);
      const width = (trace.role === 'reference' ? 1.1 : 2.3) * (.78 + .5 * near(item.depth));
      const accent = trace.role === 'signal' || trace.role === 'sum';
      return <g key={i} data-spatial-role={trace.role}>
        {trace.closed && <path d={d} fill={`url(#${uid}-face-${trace.role})`} fillOpacity={trace.role === 'reference' ? .06 + .14 * item.shade : .16 + .42 * item.shade} stroke="none" />}
        {accent && !trace.closed && <path d={d} fill="none" stroke={color} strokeOpacity=".22" strokeWidth={width * 3.2} filter={`url(#${uid}-glow)`} strokeLinecap="round" />}
        {!trace.dashed && trace.role !== 'reference' && <path d={d} fill="none" stroke="var(--vs-paper-strong)" strokeOpacity={.85 * fade} strokeWidth={width + 2.2} strokeLinejoin="round" strokeLinecap="round" />}
        <path d={d} fill="none" stroke={color} strokeOpacity={fade} strokeWidth={width} strokeDasharray={trace.dashed ? '5 4' : undefined}
          strokeLinejoin="round" strokeLinecap="round" markerEnd={trace.arrow ? `url(#${uid}-arrow-${trace.role})` : undefined} />
      </g>;
    })}
    {model.labels.map((l, i) => {
      const [x, y] = toView(l.point), w = Math.max(20, l.text.length * 6.2 + 14);
      return <g key={i} className="vs-spatial-label" filter={`url(#${uid}-lift)`}>
        <rect x={x - w / 2} y={y - 9.5} width={w} height="19" rx="9.5" fill="var(--vs-paper-strong)" fillOpacity=".94" stroke="var(--vs-line)" strokeWidth=".6" />
        <text x={x} y={y + 3.8} textAnchor="middle" fill="var(--vs-ink)">{l.text}</text>
      </g>;
    })}
  </svg>;
}
