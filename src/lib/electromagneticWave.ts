import type { SpatialPoint } from './spatialSolid';

/** O tempo é fração de um período; campos normalizados em escalas distintas. */
export function electromagneticWave(x: number, frequency: number, phase: number, amplitude: number) {
  const wavelength = 240 / frequency;
  const value = Math.sin(2 * Math.PI * (x / wavelength - phase));
  const origin: SpatialPoint = [(x - 210) * .5, 0, 0];
  const electric: SpatialPoint = [0, amplitude * value, 0];
  const magnetic: SpatialPoint = [0, 0, amplitude * value];
  return { wavelength, value, origin, electric, magnetic };
}
