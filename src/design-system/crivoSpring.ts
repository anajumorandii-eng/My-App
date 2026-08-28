export interface Spring { x: number; v: number; }

export function makeSpring(initial: number): Spring { return { x: initial, v: 0 }; }

/** Semi-implicit Euler: velocity advances before position, with a safe frame cap. */
export function stepSpring(spring: Spring, target: number, dt: number, stiffness = 70, damping = 13): number {
  const safeDt = Number.isFinite(dt) ? Math.min(Math.max(dt, 0), 0.05) : 0;
  const acceleration = -stiffness * (spring.x - target) - damping * spring.v;
  spring.v += acceleration * safeDt;
  spring.x += spring.v * safeDt;
  return spring.x;
}
