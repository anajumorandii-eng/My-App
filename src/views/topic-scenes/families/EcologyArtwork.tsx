import React, { useId } from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import { MOTION_DURATION } from '../../../design-system/motion/tokens';

/** Botanical strokes are reusable drawing primitives, not interchangeable chapter scenes. */
export function Plant({ x, y, size = 1, canopy = false }: { x: number; y: number; size?: number; canopy?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${size})`}>
    {canopy ? <><path d="M-6 0 0-113 8 0M1-58-32-93M3-78 32-110" fill="none" stroke="#73563d" strokeWidth="8"/>
      <path d="M-8-152C-37-174-68-134-52-113-80-89-38-57-17-73 1-42 35-61 34-83 72-77 82-119 51-133 44-163 11-174-8-152Z" fill="var(--eco-leaf)" stroke="var(--eco-deep)" strokeWidth="2"/>
      <path d="M-44-120Q-12-102 0-80M37-137 5-104M-19-152-4-108M46-100 13-89" fill="none" stroke="var(--eco-vein)" strokeWidth="2" opacity=".65"/></> : <>
      <path d="M0 0Q-8-56 9-111" fill="none" stroke="var(--eco-deep)" strokeWidth="4"/>
      {[-1, 1, -1, 1].map((side, i) => <g key={i} transform={`translate(${i > 1 ? 3 : -2} ${-28 - i * 21}) scale(${side} 1)`}>
        <path d="M0 0Q-7-34-45-29Q-35 5 0 0Z" fill="var(--eco-leaf)" stroke="var(--eco-deep)" strokeWidth="1.5"/>
        <path d="M0 0-37-24M-15-10-16-23M-25-16-34-14" fill="none" stroke="var(--eco-vein)" strokeWidth="1"/>
      </g>)}
    </>}
  </g>;
}

export function Fish({ x, y, size = 1 }: { x: number; y: number; size?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${size})`}><path d="M-34 0Q-10-24 24-9L44-26 40 0 44 26 23 9Q-9 24-34 0Z" fill="var(--eco-fish)" stroke="var(--eco-deep)" strokeWidth="1.5"/><path d="M-5-15 4-27 15-13M-4 15 7 24 17 12M-15-11Q-7 0-15 11" fill="none" stroke="var(--eco-deep)" strokeWidth="1.5"/><circle cx="-23" cy="-2" r="2.5" fill="var(--eco-deep)"/></g>;
}

export function Flow({ d, active, replay = 0 }: { d: string; active: boolean; replay?: number }) {
  const reduced = useSceneMotion().duration === 0;
  const arrow = useId().replace(/:/g, '');
  return <g><defs><marker id={arrow} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0 7 3.5 0 7Z" fill="var(--eco-accent)"/></marker></defs><path d={d} className="eco-flow-guide" markerEnd={`url(#${arrow})`}/><motion.path key={`${active}-${replay}`} d={d} className="eco-flow-live" markerEnd={`url(#${arrow})`} initial={reduced ? false : { pathLength: 0 }} animate={{ pathLength: 1, opacity: active ? 1 : .18 }} transition={{ duration: reduced ? 0 : active ? MOTION_DURATION.mechanism : MOTION_DURATION.component }}/></g>;
}

export function Soil({ top = 330 }: { top?: number }) {
  return <g><path d={`M20 ${top}Q120 ${top - 16} 220 ${top}T480 ${top}V510H20Z`} fill="var(--eco-soil)"/>
    {Array.from({ length: 35 }, (_, i) => <path key={i} d={`M${30 + (i * 67) % 438} ${top + 20 + (i * 29) % (480 - top)}l7 2`} stroke="var(--eco-grain)" strokeWidth="2" opacity=".45"/>)}</g>;
}
