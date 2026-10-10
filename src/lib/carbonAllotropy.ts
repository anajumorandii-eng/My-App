import { MOLECULAS } from './geometriaMolecular';
import type { SpatialPoint } from './spatialSolid';
import type { Atom, Bond } from '../views/visual-instruments/ScienceObjectView';

export function diamondFragment() {
  const atoms: Atom[] = [], bonds: Bond[] = [], points = new Map<string, SpatialPoint>();
  const add = (point: SpatialPoint, label = '', radius = 8) => {
    const key = point.map(value => value.toFixed(5)).join(',');
    if (!points.has(key)) { points.set(key, point); atoms.push({ point, label, radius, kind: label ? 'central' : 'ligand' }); }
    return points.get(key)!;
  };
  const center = add([0, 0, 0], 'C', 14);
  const directions = MOLECULAS.CH4.ligacoes;
  for (const direction of directions) {
    const neighbor = add(direction.map(value => value * 45) as SpatialPoint, 'C', 10);
    bonds.push({ from: center, to: neighbor });
    for (const next of directions) {
      const point = neighbor.map((value, i) => value - 45 * next[i]) as SpatialPoint;
      if (Math.hypot(...point) < 1e-8) continue;
      bonds.push({ from: neighbor, to: add(point) });
    }
  }
  return { atoms, bonds };
}

/** Fragmento de três folhas hexagonais; deslizar a superior preserva suas ligações. */
export function graphiteFragment(slide = 0) {
  const atoms: Atom[] = [], bonds: Bond[] = [];
  const sheet = new Map<string, SpatialPoint>();
  const length = 21;
  for (let q = -1; q <= 1; q++) for (let r = -1; r <= 1; r++) {
    const cx = 1.5 * length * q, cy = Math.sqrt(3) * length * (r + q / 2);
    for (let i = 0; i < 6; i++) {
      const angle = i * Math.PI / 3, point: SpatialPoint = [cx + length * Math.cos(angle), cy + length * Math.sin(angle), 0];
      const key = point.map(value => value.toFixed(5)).join(',');
      if (!sheet.has(key)) sheet.set(key, point);
    }
  }
  const base = [...sheet.values()];
  for (let layer = 0; layer < 3; layer++) {
    const z = (layer - 1) * 25, offset = layer === 1 ? length : layer === 2 ? slide : 0;
    const points = base.map(([x, y]): SpatialPoint => [x + offset - 10, y, z]);
    points.forEach((point, i) => {
      const reference = Math.abs(base[i][0] - length) < 1e-5 && Math.abs(base[i][1]) < 1e-5;
      atoms.push({ point, label: reference ? 'C' : '', radius: reference ? 9 : 5, kind: 'ligand' });
    });
    for (let a = 0; a < points.length; a++) for (let b = a + 1; b < points.length; b++) {
      if (Math.abs(Math.hypot(...points[a].map((value, i) => value - points[b][i])) - length) < 1e-5) bonds.push({ from: points[a], to: points[b] });
    }
  }
  return { atoms, bonds };
}
