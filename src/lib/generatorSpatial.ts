import type { SpatialPoint } from './spatialSolid';
/** B em +z; bobina gira em torno de y, com normal inicialmente paralela a B. */
export function generatorSpatial(phase: number, omega: number) {
  const theta = phase * Math.PI / 180;
  const normal: SpatialPoint = [Math.sin(theta), 0, Math.cos(theta)];
  const u: SpatialPoint = [Math.cos(theta), 0, -Math.sin(theta)];
  const points: SpatialPoint[] = [[-65,-50],[65,-50],[65,50],[-65,50]].map(([x,y]) => [x*u[0],y,x*u[2]]);
  return { points, normal, fluxLinkage: .4 * Math.cos(theta), emf: .4 * omega * Math.sin(theta) };
}
