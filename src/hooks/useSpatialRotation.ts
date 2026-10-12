import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction, type KeyboardEvent, type PointerEvent } from 'react';
import { animate } from 'motion/react';
import { readReducedMotionPreference, useLiveReducedMotion } from './useLiveReducedMotion';

/** Altera somente a câmera; nunca as coordenadas ou medidas do modelo. */
export function useSpatialRotation(initialYaw = 25, initialPitch = 12) {
  const [yaw, updateYaw] = useState(initialYaw);
  const [pitch, updatePitch] = useState(initialPitch);
  const gesture = useRef<{ id: number; x: number; y: number; yaw: number; pitch: number } | null>(null);
  const wrap = (value: number) => (value % 360 + 360) % 360;
  const tilt = (value: number) => Math.max(-50, Math.min(65, value));

  // Volta completa iniciada pela estudante, com fim e pausa. A auditoria de 11/10/2026 achou modelos
  // sem nenhum movimento; girar o objeto inteiro é o movimento que todo modelo espacial tem a mostrar.
  // Com movimento reduzido, nada anima: a vista apenas avança 90°.
  const reduced = useLiveReducedMotion();
  const spin = useRef<{ stop: () => void } | null>(null);
  const [spinning, setSpinning] = useState(false);
  const generation = useRef(0);
  const stopSpin = useCallback(() => {
    generation.current += 1;
    spin.current?.stop();
    spin.current = null;
    setSpinning(false);
  }, []);
  const setYaw: Dispatch<SetStateAction<number>> = useCallback(value => { stopSpin(); updateYaw(value); }, [stopSpin]);
  const setPitch: Dispatch<SetStateAction<number>> = useCallback(value => { stopSpin(); updatePitch(value); }, [stopSpin]);
  const reset = () => { stopSpin(); updateYaw(initialYaw); updatePitch(initialPitch); };
  useEffect(() => () => { generation.current += 1; spin.current?.stop(); }, []);
  useEffect(() => { if (reduced) stopSpin(); }, [reduced, stopSpin]);
  useEffect(() => {
    const visibilityChanged = () => { if (document.visibilityState === 'hidden') stopSpin(); };
    document.addEventListener('visibilitychange', visibilityChanged);
    return () => document.removeEventListener('visibilitychange', visibilityChanged);
  }, [stopSpin]);
  const toggleSpin = () => {
    if (spinning) { stopSpin(); return; }
    if (readReducedMotionPreference()) { setYaw(value => wrap(value + 90)); return; }
    stopSpin();
    const start = yaw, currentGeneration = generation.current;
    setSpinning(true);
    spin.current = animate(0, 360, {
      duration: 6, ease: 'easeInOut',
      onUpdate: value => {
        if (generation.current !== currentGeneration) return;
        // A media-query notification may still be pending in React. Respect
        // the current preference before applying another visible frame.
        if (readReducedMotionPreference()) { stopSpin(); return; }
        updateYaw(wrap(start + value));
      },
      onComplete: () => { if (generation.current === currentGeneration) { spin.current = null; setSpinning(false); } },
    });
  };
  return {
    yaw, pitch, setYaw, setPitch, reset, spinning, toggleSpin,
    interaction: {
      tabIndex: 0,
      onPointerDown(event: PointerEvent<SVGSVGElement>) {
        if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
        event.stopPropagation();
        stopSpin();
        gesture.current = { id: event.pointerId, x: event.clientX, y: event.clientY, yaw, pitch };
        event.currentTarget.setPointerCapture?.(event.pointerId);
      },
      onPointerMove(event: PointerEvent<SVGSVGElement>) {
        const start = gesture.current;
        if (!start || start.id !== event.pointerId) return;
        event.stopPropagation();
        setYaw(wrap(start.yaw + (event.clientX - start.x) * .7));
        setPitch(tilt(start.pitch - (event.clientY - start.y) * .45));
      },
      onPointerUp() { gesture.current = null; },
      onPointerCancel() { gesture.current = null; },
      onLostPointerCapture() { gesture.current = null; },
      onKeyDown(event: KeyboardEvent<SVGSVGElement>) {
        if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home'].includes(event.key)) return;
        event.preventDefault(); event.stopPropagation();
        const step = event.shiftKey ? 15 : 5;
        if (event.key === 'Home') reset();
        if (event.key === 'ArrowLeft') setYaw(value => wrap(value - step));
        if (event.key === 'ArrowRight') setYaw(value => wrap(value + step));
        if (event.key === 'ArrowUp') setPitch(value => tilt(value + step));
        if (event.key === 'ArrowDown') setPitch(value => tilt(value - step));
      },
    },
  };
}
