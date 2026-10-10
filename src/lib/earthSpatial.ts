import { declinacao, INCLINACAO } from './estacoesDoAno';
import { geographicPoint } from './geographicGlobe';
import type { SpatialPoint } from './spatialSolid';

const tilt = INCLINACAO * Math.PI / 180;
export const earthAxis: SpatialPoint = [Math.sin(tilt), Math.cos(tilt), 0];

/** Eixo fixo no espaço; o dia muda a direção do Sol no plano orbital xz. */
export function earthSunDirection(day: number): SpatialPoint {
  const delta = declinacao(day) * Math.PI / 180;
  const cosine = Math.max(-1, Math.min(1, Math.sin(delta) / Math.sin(tilt)));
  const sign = Math.sin(2 * Math.PI * (day + 10) / 365) >= 0 ? 1 : -1;
  return [cosine, 0, sign * Math.sqrt(Math.max(0, 1 - cosine * cosine))];
}

export function earthSurface(latitude: number, longitude: number, rotation: number, radius = 100): SpatialPoint {
  const [x, y, z] = geographicPoint(latitude, longitude + rotation, radius);
  return [x * Math.cos(tilt) + y * Math.sin(tilt), -x * Math.sin(tilt) + y * Math.cos(tilt), z];
}

export function solarIncidence(point: SpatialPoint, day: number) {
  const sun = earthSunDirection(day), length = Math.hypot(...point);
  return point.reduce((sum, value, i) => sum + value * sun[i], 0) / length;
}
