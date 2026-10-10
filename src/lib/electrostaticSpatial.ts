import type { ElectrostaticsId } from './electrostaticsLab';
import type { SpatialPoint } from './spatialSolid';

export function electrostaticSpatial(id: ElectrostaticsId, value: number, time = 0) {
  const radial = id === 'coulomb' || id === 'field' || id === 'potential';
  const distance = radial ? value : id === 'uniform-field' ? value : .5 * value * time * time;
  const probe: SpatialPoint = [radial ? value * 11 : -70 + distance * 16, 0, 0];
  return { radial, distance, probe,
    magnitude: id === 'potential' ? 24 / value : radial ? 36 / (value * value) : id === 'uniform-field' ? 4 : value,
    force: id === 'charge-dynamics' ? 2 * value : id === 'uniform-field' ? 8 : id === 'coulomb' ? 36 / (value * value) : undefined,
    deltaV: id === 'uniform-field' ? -4 * value : undefined,
    acceleration: id === 'charge-dynamics' ? value : undefined,
  };
}

export function radialDirections(): SpatialPoint[] {
  return Array.from({ length: 24 }, (_, i) => {
    const y = 1 - 2 * (i + .5) / 24, phi = i * Math.PI * (3 - Math.sqrt(5)), r = Math.sqrt(1 - y * y);
    return [r * Math.cos(phi), y, r * Math.sin(phi)];
  });
}
