import type { SolidConfigId } from './solidInstruments';

export type SpatialPoint = [number, number, number];
export interface SpatialFace { points: SpatialPoint[]; kind: 'body' | 'base' | 'cut' | 'comparison' }
export interface SpatialLine { from: SpatialPoint; to: SpatialPoint; label: string; dashed?: boolean }
export interface SpatialModel { faces: SpatialFace[]; lines: SpatialLine[]; scale: number }

/** Coordenadas do sólido em unidades reais; a rotação muda a vista, nunca as medidas. */
export function rotateSpatialPoint([x, y, z]: SpatialPoint, yaw: number, pitch: number): SpatialPoint {
  const a = yaw * Math.PI / 180, b = pitch * Math.PI / 180;
  const u = x * Math.cos(a) + z * Math.sin(a), v = -x * Math.sin(a) + z * Math.cos(a);
  return [u, y * Math.cos(b) - v * Math.sin(b), y * Math.sin(b) + v * Math.cos(b)];
}

function ring(n: number, r: number, y: number, dx = 0): SpatialPoint[] {
  return Array.from({ length: n }, (_, i) => {
    const angle = i * 2 * Math.PI / n;
    return [dx + r * Math.cos(angle), y, r * Math.sin(angle)];
  });
}

function box(a: number, b: number, c: number, dx = 0, floor = -c / 2, comparison = false): SpatialFace[] {
  const p = (x: number, y: number, z: number): SpatialPoint => [dx + x - a / 2, floor + y, z - b / 2];
  const bottom = [p(0, 0, 0), p(a, 0, 0), p(a, 0, b), p(0, 0, b)];
  const top = [p(0, c, 0), p(a, c, 0), p(a, c, b), p(0, c, b)];
  return [{ points: bottom, kind: 'base' }, { points: top, kind: comparison ? 'comparison' : 'body' },
    ...bottom.map((point, i): SpatialFace => ({
      points: [point, bottom[(i + 1) % 4], top[(i + 1) % 4], top[i]],
      kind: comparison ? 'comparison' : 'body',
    }))];
}

export function spatialSolid(id: SolidConfigId, v: Record<string, number>, shape = 'cilindro'): SpatialModel {
  const faces: SpatialFace[] = [], lines: SpatialLine[] = [];
  let scale = 11;
  if (id === 'bloco') {
    const { a, b, c } = v;
    faces.push(...box(a, b, c));
    lines.push(
      { from: [-a / 2, -c / 2, -b / 2], to: [a / 2, c / 2, b / 2], label: 'D', dashed: true },
      { from: [-a / 2, -c / 2, -b / 2], to: [a / 2, -c / 2, b / 2], label: 'd', dashed: true },
    );
    scale = 11.5;
  } else if (id === 'prisma' || id === 'piramide') {
    const { n, l, h } = v, radius = l / (2 * Math.sin(Math.PI / n));
    const bottom = ring(n, radius, -h / 2, id === 'prisma' ? -v.s / 2 : 0);
    faces.push({ points: bottom, kind: 'base' });
    if (id === 'prisma') {
      const top = ring(n, radius, h / 2, v.s / 2);
      faces.push({ points: top, kind: 'base' });
      bottom.forEach((p, i) => faces.push({ points: [p, bottom[(i + 1) % n], top[(i + 1) % n], top[i]], kind: 'body' }));
      lines.push({ from: [-v.s / 2, -h / 2, 0], to: [-v.s / 2, h / 2, 0], label: 'h', dashed: true });
      scale = 17;
    } else {
      const apex: SpatialPoint = [0, h / 2, 0];
      bottom.forEach((p, i) => faces.push({ points: [p, bottom[(i + 1) % n], apex], kind: 'body' }));
      if (v.t < 1) faces.push({ points: ring(n, radius * v.t, h / 2 - h * v.t), kind: 'cut' });
      lines.push({ from: [0, -h / 2, 0], to: apex, label: 'h', dashed: true });
      scale = 12;
    }
  } else if (id === 'revolucao') {
    const n = 32, { r, h } = v;
    if (shape === 'esfera') {
      const bands = 16;
      for (let j = 0; j < bands; j++) {
        const low = -Math.PI / 2 + j * Math.PI / bands, high = low + Math.PI / bands;
        const bottom = ring(n, r * Math.cos(low), r * Math.sin(low));
        const top = ring(n, r * Math.cos(high), r * Math.sin(high));
        bottom.forEach((p, i) => faces.push({ points: [p, bottom[(i + 1) % n], top[(i + 1) % n], top[i]], kind: 'body' }));
      }
      lines.push({ from: [0, 0, 0], to: [r, 0, 0], label: 'r', dashed: true });
    } else {
      const bottom = ring(n, r, -h / 2);
      faces.push({ points: bottom, kind: 'base' });
      if (shape === 'cone') {
        const apex: SpatialPoint = [0, h / 2, 0];
        bottom.forEach((p, i) => faces.push({ points: [p, bottom[(i + 1) % n], apex], kind: 'body' }));
      } else {
        const top = ring(n, r, h / 2);
        faces.push({ points: top, kind: 'base' });
        bottom.forEach((p, i) => faces.push({ points: [p, bottom[(i + 1) % n], top[(i + 1) % n], top[i]], kind: 'body' }));
      }
      lines.push({ from: [0, -h / 2, 0], to: [0, h / 2, 0], label: 'h', dashed: true });
      lines.push({ from: [0, -h / 2, 0], to: [r, -h / 2, 0], label: 'r', dashed: true });
    }
    scale = 12;
  } else {
    const { a, k } = v, larger = a * k, gap = a * 0.6, total = a + larger + gap;
    faces.push(...box(a, a, a, -total / 2 + a / 2, -larger / 2));
    faces.push(...box(larger, larger, larger, total / 2 - larger / 2, -larger / 2, true));
    // Aqui a comparação é a razão entre os cubos, como no desenho anotado.
    scale = 210 / Math.hypot(total, larger, larger);
  }
  return { faces, lines, scale };
}

export function projectSpatialModel(model: SpatialModel, yaw: number, pitch: number) {
  const transform = (p: SpatialPoint) => rotateSpatialPoint(p, yaw, pitch);
  const screen = ([x, y]: SpatialPoint): [number, number] => [160 + x * model.scale, 150 - y * model.scale];
  const faces = model.faces.map((face, index) => {
    const points = face.points.map(transform);
    const depth = points.reduce((sum, p) => sum + p[2], 0) / points.length;
    const a = points[0], b = points[1], c = points[2];
    const u = b.map((v, i) => v - a[i]), v = c.map((value, i) => value - a[i]);
    const normal = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    const length = Math.hypot(...normal) || 1;
    const light = 0.55 + 0.35 * Math.abs((-0.4 * normal[0] + 0.7 * normal[1] + 0.5 * normal[2]) / length);
    return { index, kind: face.kind, points: points.map(screen), depth, light };
  }).sort((a, b) => a.depth - b.depth);
  const lines = model.lines.map(line => ({ ...line, from: screen(transform(line.from)), to: screen(transform(line.to)) }));
  return { faces, lines };
}
