import type { SpatialPoint } from './spatialSolid';

export function membraneLipids() {
  const lipids: { head: SpatialPoint; tails: [SpatialPoint, SpatialPoint][] }[] = [];
  for (const y of [-22, 22]) for (let x = -90; x <= 90; x += 15) for (let z = -36; z <= 36; z += 18) {
    if (Math.abs(x) < 24 && Math.abs(z) < 24) continue;
    lipids.push({ head: [x, y, z], tails: [-3, 3].map(offset => [[x + offset, y - Math.sign(y) * 5, z], [x + offset, Math.sign(y) * 2, z]]) as [SpatialPoint, SpatialPoint][] });
  }
  return lipids;
}

export function membraneTransport(pump: boolean, time: number) {
  if (!pump) return [{ point: [0, 70 - 140 * time, 0] as SpatialPoint, label: 'soluto', kind: 'neutral' }];
  const sodium = Math.min(1, 2 * time), potassium = Math.max(0, 2 * time - 1);
  return [
    ...[-10, 0, 10].map(x => ({ point: [x, -70 + 140 * sodium, 0] as SpatialPoint, label: 'Na⁺', kind: 'sodium' })),
    ...[-7, 7].map(x => ({ point: [x, 70 - 140 * potassium, 12] as SpatialPoint, label: 'K⁺', kind: 'potassium' })),
  ];
}
