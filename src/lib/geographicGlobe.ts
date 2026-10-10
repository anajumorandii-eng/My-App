import { rotateSpatialPoint, type SpatialPoint } from './spatialSolid';

export function geographicPoint(latitude: number, longitude: number, radius = 104): SpatialPoint {
  const lat = latitude * Math.PI / 180, lon = longitude * Math.PI / 180;
  return [radius * Math.cos(lat) * Math.sin(lon), radius * Math.sin(lat), radius * Math.cos(lat) * Math.cos(lon)];
}

export function projectGeographicPoint(latitude: number, longitude: number, yaw: number, pitch: number) {
  const [x, y, depth] = rotateSpatialPoint(geographicPoint(latitude, longitude), yaw, pitch);
  return { x: 160 + x, y: 150 - y, depth, visible: depth >= -1e-8 };
}

/** Segmentos do hemisfério visível: linhas nunca atravessam a parte oculta. */
export function visibleGeographicPath(points: [number, number][], yaw: number, pitch: number): string {
  let drawing = '', previous: ReturnType<typeof projectGeographicPoint> | null = null;
  for (const [lat, lon] of points) {
    const point = projectGeographicPoint(lat, lon, yaw, pitch);
    if (previous && point.visible !== previous.visible) {
      const fraction = previous.depth / (previous.depth - point.depth);
      const x = previous.x + fraction * (point.x - previous.x), y = previous.y + fraction * (point.y - previous.y);
      drawing += `${previous.visible ? 'L' : 'M'}${x.toFixed(2)},${y.toFixed(2)} `;
    }
    if (point.visible) drawing += `${previous ? 'L' : 'M'}${point.x.toFixed(2)},${point.y.toFixed(2)} `;
    previous = point;
  }
  return drawing;
}
