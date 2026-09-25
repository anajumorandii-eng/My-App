import React from 'react';
import { motion } from 'motion/react';
import { iconTarget, iconTransition } from './iconMotion';
import { useIconMotion } from './useIconMotion';

type IconProps = React.SVGProps<SVGSVGElement>;

export function FisicaIcon(props: IconProps) {
  const { iconRef, still } = useIconMotion();
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 2} strokeLinecap="round" strokeLinejoin="round" {...props} ref={iconRef}>
      <motion.circle cx="12" cy="12" r="2" animate={iconTarget({ scale: [1, 1.3, 1] }, still)} transition={iconTransition({ repeat: Infinity, duration: 1.5 }, still)} />
      <motion.ellipse cx="12" cy="12" rx="9" ry="3" animate={iconTarget({ rotate: 360 }, still)} transition={iconTransition({ repeat: Infinity, duration: 4, ease: "linear" }, still)} />
      <motion.ellipse cx="12" cy="12" rx="9" ry="3" initial={{ rotate: 60 }} animate={iconTarget({ rotate: 420 }, still, 60)} transition={iconTransition({ repeat: Infinity, duration: 4, ease: "linear" }, still)} />
      <motion.ellipse cx="12" cy="12" rx="9" ry="3" initial={{ rotate: 120 }} animate={iconTarget({ rotate: 480 }, still, 120)} transition={iconTransition({ repeat: Infinity, duration: 4, ease: "linear" }, still)} />
    </svg>
  );
}

export function AtualidadesIcon(props: IconProps) {
  const { iconRef, still } = useIconMotion();
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 2} strokeLinecap="round" strokeLinejoin="round" {...props} ref={iconRef}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <motion.path d="M4 10h16" animate={iconTarget({ y: [0, 1, 0] }, still)} transition={iconTransition({ repeat: Infinity, duration: 2 }, still)} />
      <path d="M8 14h8" />
      <path d="M8 18h4" />
      <motion.circle cx="16" cy="16" r="2" animate={iconTarget({ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }, still)} transition={iconTransition({ repeat: Infinity, duration: 1.5 }, still)} />
    </svg>
  );
}

export function BiologiaIcon(props: IconProps) {
  const { iconRef, still } = useIconMotion();
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 2} strokeLinecap="round" strokeLinejoin="round" {...props} ref={iconRef}>
      <motion.g animate={iconTarget({ scaleX: [-1, 1, -1] }, still)} transition={iconTransition({ repeat: Infinity, duration: 3, ease: "easeInOut" }, still)}>
        <path d="M7 4c0 16 10 0 10 16" />
        <path d="M17 4c0 16-10 0-10 16" />
        <line x1="8" y1="8" x2="16" y2="8" />
        <line x1="10" y1="12" x2="14" y2="12" />
        <line x1="8" y1="16" x2="16" y2="16" />
      </motion.g>
    </svg>
  );
}

export function GeografiaIcon(props: IconProps) {
  const { iconRef, still } = useIconMotion();
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 2} strokeLinecap="round" strokeLinejoin="round" {...props} ref={iconRef}>
      <path d="M3 6l6-3 6 3 6-3v12l-6 3-6-3-6 3V6z" />
      <path d="M9 3v15" />
      <path d="M15 6v15" />
      <motion.g animate={iconTarget({ y: [0, -4, 0] }, still)} transition={iconTransition({ repeat: Infinity, duration: 1.5, ease: "easeInOut" }, still)}>
        <path d="M12 9c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
        <path d="M12 9l-3 4h6l-3-4z" fill="currentColor"/>
      </motion.g>
    </svg>
  );
}

export function HistoriaIcon(props: IconProps) {
  const { iconRef, still } = useIconMotion();
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 2} strokeLinecap="round" strokeLinejoin="round" {...props} ref={iconRef}>
      <path d="M5 22h14" />
      <path d="M5 2h14" />
      <path d="M17 22v-4.172a2 2 0 00-.586-1.414L12 12l-4.414 4.414A2 2 0 007 17.828V22" />
      <path d="M7 2v4.172a2 2 0 00.586 1.414L12 12l4.414-4.414A2 2 0 0017 6.172V2" />
      <motion.line x1="12" y1="5" x2="12" y2="10" animate={iconTarget({ y2: [5, 10, 5], opacity: [0, 1, 0] }, still)} transition={iconTransition({ repeat: Infinity, duration: 2 }, still)} />
      <motion.line x1="12" y1="14" x2="12" y2="19" animate={iconTarget({ y2: [14, 19, 14], opacity: [0, 1, 0] }, still)} transition={iconTransition({ repeat: Infinity, duration: 2, delay: 1 }, still)} />
    </svg>
  );
}

export function InglesIcon(props: IconProps) {
  const { iconRef, still } = useIconMotion();
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 2} strokeLinecap="round" strokeLinejoin="round" {...props} ref={iconRef}>
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
      <motion.text x="12" y="14" fontSize="10" textAnchor="middle" fill="currentColor" stroke="none" fontWeight="bold" animate={iconTarget({ opacity: [1, 0, 1], scale: [1, 0.8, 1] }, still)} transition={iconTransition({ repeat: Infinity, duration: 2 }, still)}>EN</motion.text>
    </svg>
  );
}

export function RedacaoIcon(props: IconProps) {
  const { iconRef, still } = useIconMotion();
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 2} strokeLinecap="round" strokeLinejoin="round" {...props} ref={iconRef}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6" />
      <motion.path d="M16 13H8" animate={iconTarget({ pathLength: [0, 1] }, still)} transition={iconTransition({ repeat: Infinity, duration: 1.5, ease: "easeOut" }, still)} />
      <motion.path d="M16 17H8" animate={iconTarget({ pathLength: [0, 1] }, still)} transition={iconTransition({ repeat: Infinity, duration: 1.5, ease: "easeOut", delay: 0.5 }, still)} />
      <motion.path d="M10 9H8" animate={iconTarget({ pathLength: [0, 1] }, still)} transition={iconTransition({ repeat: Infinity, duration: 1.5, ease: "easeOut", delay: 1 }, still)} />
    </svg>
  );
}

export function GramaticaIcon(props: IconProps) {
  const { iconRef, still } = useIconMotion();
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 2} strokeLinecap="round" strokeLinejoin="round" {...props} ref={iconRef}>
      <path d="M4 19.5v-15A2.5 2.5 0 016.5 2H20v20H6.5a2.5 2.5 0 010-5H20" />
      <motion.path d="M8 7h6" animate={iconTarget({ opacity: [1, 0.3, 1] }, still)} transition={iconTransition({ repeat: Infinity, duration: 2 }, still)} />
      <motion.path d="M8 11h8" animate={iconTarget({ opacity: [1, 0.3, 1] }, still)} transition={iconTransition({ repeat: Infinity, duration: 2, delay: 0.3 }, still)} />
      <motion.path d="M14 15l2 2 4-4" stroke="currentColor" animate={iconTarget({ pathLength: [0, 1], opacity: [0, 1] }, still)} transition={iconTransition({ repeat: Infinity, duration: 2, delay: 1 }, still)} />
    </svg>
  );
}

export function LiteraturaIcon(props: IconProps) {
  const { iconRef, still } = useIconMotion();
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 2} strokeLinecap="round" strokeLinejoin="round" {...props} ref={iconRef}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      <motion.path d="M12 7c-2-2-4-3-6-3" animate={iconTarget({ d: ["M12 7c-2-2-4-3-6-3", "M12 7c0-2-2-5-6-5", "M12 7c-2-2-4-3-6-3"] }, still)} transition={iconTransition({ repeat: Infinity, duration: 2 }, still)} />
      <motion.path d="M12 7c2-2 4-3 6-3" animate={iconTarget({ d: ["M12 7c2-2 4-3 6-3", "M12 7c0-2 2-5 6-5", "M12 7c2-2 4-3 6-3"] }, still)} transition={iconTransition({ repeat: Infinity, duration: 2, delay: 1 }, still)} />
    </svg>
  );
}

export function EntendimentoIcon(props: IconProps) {
  const { iconRef, still } = useIconMotion();
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 2} strokeLinecap="round" strokeLinejoin="round" {...props} ref={iconRef}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <motion.circle cx="12" cy="12" r="3" animate={iconTarget({ cx: [10, 14, 10] }, still)} transition={iconTransition({ repeat: Infinity, duration: 2, ease: "easeInOut" }, still)} />
      <path d="M3 22l18-18" strokeDasharray="4 4" opacity="0.3" />
    </svg>
  );
}

export function MatematicaIcon(props: IconProps) {
  const { iconRef, still } = useIconMotion();
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 2} strokeLinecap="round" strokeLinejoin="round" {...props} ref={iconRef}>
      <motion.path d="M3 21l18-18" animate={iconTarget({ pathLength: [0, 1] }, still)} transition={iconTransition({ repeat: Infinity, duration: 2, ease: "easeInOut" }, still)} />
      <motion.path d="M3 10a8 8 0 0 1 18 4" animate={iconTarget({ pathLength: [0, 1], rotate: [0, 10, 0] }, still)} transition={iconTransition({ repeat: Infinity, duration: 3, ease: "easeInOut" }, still)} />
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <circle cx="20" cy="20" r="2" />
    </svg>
  );
}

export function QuimicaIcon(props: IconProps) {
  const { iconRef, still } = useIconMotion();
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 2} strokeLinecap="round" strokeLinejoin="round" {...props} ref={iconRef}>
      <path d="M9 3h6" />
      <path d="M10 3v5l-4 8a2 2 0 0 0 1.73 3h10.54A2 2 0 0 0 20 16l-4-8V3" />
      <motion.circle cx="12" cy="15" r="1" animate={iconTarget({ y: [0, -5], opacity: [1, 0] }, still)} transition={iconTransition({ repeat: Infinity, duration: 1.5 }, still)} />
      <motion.circle cx="14" cy="17" r="1" animate={iconTarget({ y: [0, -6], opacity: [1, 0] }, still)} transition={iconTransition({ repeat: Infinity, duration: 1.2, delay: 0.3 }, still)} />
      <motion.circle cx="10" cy="16" r="1" animate={iconTarget({ y: [0, -4], opacity: [1, 0] }, still)} transition={iconTransition({ repeat: Infinity, duration: 1.8, delay: 0.6 }, still)} />
    </svg>
  );
}

export function FilosofiaIcon(props: IconProps) {
  const { iconRef, still } = useIconMotion();
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 2} strokeLinecap="round" strokeLinejoin="round" {...props} ref={iconRef}>
      <path d="M12 2a5 5 0 0 0-5 5c0 2.5 2 4.5 2 7h6c0-2.5 2-4.5 2-7a5 5 0 0 0-5-5z" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <motion.path d="M12 7v4" animate={iconTarget({ opacity: [0.2, 1, 0.2] }, still)} transition={iconTransition({ repeat: Infinity, duration: 2 }, still)} />
      <motion.circle cx="12" cy="5" r="1" fill="currentColor" animate={iconTarget({ opacity: [0, 1, 0] }, still)} transition={iconTransition({ repeat: Infinity, duration: 2 }, still)} />
    </svg>
  );
}

export function SociologiaIcon(props: IconProps) {
  const { iconRef, still } = useIconMotion();
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={props.strokeWidth || 2} strokeLinecap="round" strokeLinejoin="round" {...props} ref={iconRef}>
      <circle cx="12" cy="6" r="3" />
      <path d="M8 14c-2 0-4 1-4 3v2h8" />
      <circle cx="5" cy="10" r="2" />
      <path d="M3 16c-1 0-2 .5-2 1.5v1h3" />
      <circle cx="19" cy="10" r="2" />
      <path d="M21 16c1 0 2 .5 2 1.5v1h-3" />
      <motion.path d="M12 14c2 0 4 1 4 3v2H8v-2c0-2 2-3 4-3z" animate={iconTarget({ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }, still)} transition={iconTransition({ repeat: Infinity, duration: 2, ease: "easeInOut" }, still)} />
      <motion.line x1="7" y1="10" x2="10" y2="8" animate={iconTarget({ strokeDasharray: ["0, 10", "10, 0"] }, still)} transition={iconTransition({ repeat: Infinity, duration: 1.5 }, still)} />
      <motion.line x1="17" y1="10" x2="14" y2="8" animate={iconTarget({ strokeDasharray: ["0, 10", "10, 0"] }, still)} transition={iconTransition({ repeat: Infinity, duration: 1.5, delay: 0.5 }, still)} />
    </svg>
  );
}
