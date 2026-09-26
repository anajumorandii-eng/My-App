import React from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';

// Peças comuns às cenas de História e Geografia (Lote 4 em diante): ritmo que
// respeita movimento reduzido, figura humana, seta desenhada com ponta. As
// classes bi-* moram em BrasilImperio.css, que HistoriaGeografia carrega para
// todas as cenas.

export type Scene = { active: number };

export function usePaced() {
  const t = useSceneMotion();
  return (duration: number, delay = 0) => (t.duration === 0 ? t : { ...t, duration, delay });
}

export function Person({ x, y, s = 1, coat = 'bi-coat', hat }: { x: number; y: number; s?: number; coat?: string; hat?: 'crown' | 'kepi' | 'top' | 'brim' | 'cap' }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-11 34c0-16 5-24 11-24s11 8 11 24Z" className={coat} />
    <circle cx="0" cy="0" r="7" className="bi-face" />
    {hat === 'crown' && <path d="M-7 -6l1-9 3 4 3-6 3 6 3-4 1 9Z" className="bi-crown" />}
    {hat === 'kepi' && <path d="M-7 -4v-7h13l1 7ZM-9 -4h17" className="bi-kepi" />}
    {hat === 'top' && <path d="M-6 -6v-11h12v11ZM-10 -6h20" className="bi-hat" />}
    {hat === 'brim' && <path d="M-5 -6q5-9 10 0ZM-12 -5h24" className="bi-hat" />}
    {hat === 'cap' && <path d="M-7 -4q7-10 14 0ZM5 -5h6" className="bi-cap" />}
  </g>;
}

export function Arrow({ d, on, p, head, delay = 0 }: { d: string; on: boolean; p: ReturnType<typeof usePaced>; head: string; delay?: number }) {
  return <motion.path d={d} className="bi-arrow" markerEnd={`url(#${head})`} initial={false}
    animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }} transition={p(0.8, on ? delay : 0)} />;
}

export function ArrowHead({ id }: { id: string }) {
  return <defs><marker id={id} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
    <path d="M0 0L10 5L0 10Z" className="bi-head" />
  </marker></defs>;
}

