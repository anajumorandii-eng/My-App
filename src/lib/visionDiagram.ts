export type VisionDefect = 'miopia' | 'hipermetropia';
type Point = [number, number];

/** Esquema paraxial, sem acomodação; as coordenadas são unidades do desenho. */
export function visionDiagram(kind: VisionDefect, corrected: boolean) {
  const axis = 150;
  const eyeX = 116;
  const lensX = 58;
  const retinaX = 260;
  const baselineFocus = kind === 'miopia' ? 205 : 282;
  const incomingHeight = 34;
  const eyePower = 1 / (baselineFocus - eyeX);
  const separation = eyeX - lensX;
  const neededVergence = 1 / (retinaX - eyeX) - eyePower;
  const lensPower = corrected ? neededVergence / (1 + separation * neededVergence) : 0;
  const eyeHeight = incomingHeight * (1 - separation * lensPower);
  const focusX = eyeX + 1 / (eyePower + lensPower / (1 - separation * lensPower));
  const rays = [-1, 1].map(sign => {
    const inputY = axis + sign * incomingHeight;
    const eyeY = axis + sign * eyeHeight;
    const retinaY = axis + sign * eyeHeight * (1 - (retinaX - eyeX) / (focusX - eyeX));
    const points: Point[] = [[16, inputY]];
    if (corrected) points.push([lensX, inputY]);
    points.push([eyeX, eyeY]);
    if (focusX < retinaX - 1e-8) points.push([focusX, axis]);
    points.push([retinaX, retinaY]);
    const extension: Point[] = focusX > retinaX + 1e-8 ? [[retinaX, retinaY], [focusX, axis]] : [];
    return { points, extension };
  });
  return { eyeX, lensX, retinaX, focusX, incomingHeight, eyeHeight, rays };
}
