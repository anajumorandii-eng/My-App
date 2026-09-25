import React, { useEffect, useRef, useState } from 'react';
import { animate, useReducedMotion } from 'motion/react';
import { MOTION_DURATION } from '../../design-system/motion/tokens';
import './MechanismFrame.css';

/** A user-started, finite demonstration. Changing a parameter stops playback. */
export function useMechanismTime() {
  const reduced = useReducedMotion();
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const animation = useRef<{ stop: () => void } | null>(null);
  const stop = () => { animation.current?.stop(); setPlaying(false); };
  useEffect(() => () => animation.current?.stop(), []);
  useEffect(() => { if (reduced) { animation.current?.stop(); setPlaying(false); } }, [reduced]);
  const seek = (value: number) => { stop(); setTime(value); };
  const play = () => {
    stop();
    if (reduced) { setTime(1); return; }
    setTime(0); setPlaying(true);
    animation.current = animate(0, 1, { duration: MOTION_DURATION.studyStep, ease: 'linear', onUpdate: setTime, onComplete: () => setPlaying(false) });
  };
  return { time, playing, reduced, seek, play, stop };
}

export function MechanismFrame({ children, controls, note }: { children: React.ReactNode; controls: React.ReactNode; note: string }) {
  return <div className="mechanism-frame"><div className="mechanism-drawing">{children}<p className="mechanism-caption">{note}</p></div><div className="mechanism-controls">{controls}</div></div>;
}

export function TimeControl({ clock, label = 'Percurso da demonstração' }: { clock: ReturnType<typeof useMechanismTime>; label?: string }) {
  return <div className="mechanism-time"><button type="button" onClick={clock.playing ? clock.stop : clock.play}>{clock.playing ? 'Pausar movimento' : 'Reproduzir movimento'}</button><label>{label}<input type="range" min="0" max="1" step="0.01" value={clock.time} onChange={event => clock.seek(Number(event.target.value))} aria-valuetext={`${Math.round(clock.time * 100)}%`} /></label></div>;
}
