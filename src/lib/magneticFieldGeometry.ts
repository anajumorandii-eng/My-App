import type { SpatialPoint } from './spatialSolid';

export function wireMagneticField(angle: number, radius: number, z = 0) {
  const phase = angle * Math.PI / 180;
  return { point: [radius * Math.cos(phase), radius * Math.sin(phase), z] as SpatialPoint, direction: [-Math.sin(phase), Math.cos(phase), 0] as SpatialPoint };
}

export function spatialRing(radius: number, z = 0): SpatialPoint[] {
  return Array.from({ length: 73 }, (_, i) => wireMagneticField(i * 5, radius, z).point);
}
