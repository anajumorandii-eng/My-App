import type { VectorId } from './vectorsLab';
import type { SpatialPoint } from './spatialSolid';

/** Exemplos do instrumento são planos, situados em z = 0; a vista pode girar. */
export function vectorSpatial(id: VectorId, value: number, time = 1) {
  const a: SpatialPoint = id === 'velocidade' ? [4, 0, 0] : [value, 0, 0];
  const b: SpatialPoint = [0, id === 'velocidade' ? value : id === 'composicao' ? 4 : 3, 0];
  const resultant = a.map((v, i) => v + b[i]) as SpatialPoint;
  const position = resultant.map(v => v * time) as SpatialPoint;
  return { a, b, resultant, position, magnitude: Math.hypot(...resultant) };
}
