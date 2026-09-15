import { useReducedMotion } from 'motion/react';
import { MOTION_DURATION, MOTION_EASE } from '../../design-system/motion/tokens';

/** Todo movimento das cenas passa por aqui: é o que o portão do movimento
 *  verifica, e é o que garante duração zero sob movimento reduzido. */
export function useSceneMotion() {
  const reduced = useReducedMotion();
  return { duration: reduced ? 0 : MOTION_DURATION.entrance, ease: MOTION_EASE };
}
