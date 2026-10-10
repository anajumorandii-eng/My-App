import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';

/** Altera somente a câmera; nunca as coordenadas ou medidas do modelo. */
export function useSpatialRotation(initialYaw = 25, initialPitch = 12) {
  const [yaw, setYaw] = useState(initialYaw);
  const [pitch, setPitch] = useState(initialPitch);
  const gesture = useRef<{ id: number; x: number; y: number; yaw: number; pitch: number } | null>(null);
  const wrap = (value: number) => (value % 360 + 360) % 360;
  const tilt = (value: number) => Math.max(-50, Math.min(65, value));
  const reset = () => { setYaw(initialYaw); setPitch(initialPitch); };
  return {
    yaw, pitch, setYaw, setPitch, reset,
    interaction: {
      tabIndex: 0,
      onPointerDown(event: PointerEvent<SVGSVGElement>) {
        if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
        event.stopPropagation();
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
