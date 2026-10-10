import type { SpatialPoint } from './spatialSolid';

/** q > 0, B na direção +z. Comprimentos são normalizados; qvB = 0,6 N. */
export function magneticTrajectory(theta: number, time: number) {
  const angle = theta * Math.PI / 180, phase = 2 * Math.PI * time;
  const perpendicular = theta === 0 ? 0 : Math.sin(angle);
  const parallel = theta === 90 ? 0 : Math.cos(angle);
  const position: SpatialPoint = [30 * perpendicular * Math.cos(phase), -30 * perpendicular * Math.sin(phase), 30 * parallel * (phase - Math.PI)];
  const velocity: SpatialPoint = [-perpendicular * Math.sin(phase), -perpendicular * Math.cos(phase), parallel];
  const force: SpatialPoint = [-.6 * perpendicular * Math.cos(phase), .6 * perpendicular * Math.sin(phase), 0];
  return { position, velocity, force, kind: theta === 0 ? 'retilínea' : theta === 90 ? 'circular' : 'helicoidal', magnitude: .6 * perpendicular };
}
