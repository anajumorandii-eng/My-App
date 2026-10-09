import React, { useId } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { PedagogicalStage } from '../../types/summary';

type ObjectKind = 'solid' | 'curve' | 'matrix' | 'lens' | 'molecule' | 'cell' | 'book' | 'bulb' | 'target' | 'pencil';

function chapterObject(subject: string, topic: string): ObjectKind {
  if (subject === 'Matemática') {
    if (/matriz|determinante|sistema linear/i.test(topic)) return 'matrix';
    if (/funç|fun[cç]ao|gr[aá]fico|progress|logarit|exponencial/i.test(topic)) return 'curve';
    return 'solid';
  }
  if (subject === 'Física') return 'lens';
  if (subject === 'Química') return 'molecule';
  if (subject === 'Biologia') return 'cell';
  return 'book';
}

/** Ícones de navegação; a representação do fenômeno continua no artefato próprio do capítulo. */
export function StudyObjectIcon({ subject, topic = '', stage, selected = false }: {
  subject: string;
  topic?: string;
  stage?: PedagogicalStage;
  selected?: boolean;
}) {
  const id = useId().replace(/:/g, '');
  const reduced = useReducedMotion();
  const kind = stage ? ({
    intuicao: 'bulb', conceito: 'book', aplicacao: 'solid', estrategia: 'target', exercicio: 'pencil',
  } satisfies Record<PedagogicalStage, ObjectKind>)[stage] : chapterObject(subject, topic);
  const paint = 'url(#' + id + '-paint)';
  const shade = 'url(#' + id + '-shade)';
  return (
    <motion.svg className="vs-object-icon" viewBox="0 0 64 64" aria-hidden="true"
      animate={{ y: selected && !reduced ? -2 : 0 }}
      transition={{ duration: reduced ? 0 : 0.2 }}>
      <defs>
        <linearGradient id={id + '-paint'} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f6d895" /><stop offset="0.52" stopColor="#d89f57" /><stop offset="1" stopColor="#996238" /></linearGradient>
        <linearGradient id={id + '-shade'} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#bfcfd7" /><stop offset="0.5" stopColor="#7395a6" /><stop offset="1" stopColor="#36596b" /></linearGradient>
        <radialGradient id={id + '-orb'} cx="32%" cy="23%" r="75%"><stop stopColor="#dce9e3" /><stop offset="0.45" stopColor="#86b5a1" /><stop offset="1" stopColor="#3d715e" /></radialGradient>
      </defs>
      <ellipse cx="32" cy="55" rx="20" ry="3.5" fill="currentColor" opacity="0.12" />
      <g stroke="#574331" strokeWidth="1.15" strokeLinejoin="round">
        {kind === 'solid' && <><path d="m12 22 20-11 20 11-20 12Z" fill={paint} /><path d="m12 22 20 12v21L12 44Z" fill="#bc8953" /><path d="m32 34 20-12v22L32 55Z" fill="#8c603f" /><path d="M32 11v23m-20-12 20 12 20-12" fill="none" stroke="#fff4d7" strokeOpacity=".65" /><path d="m20 28 20 12v-9M20 39l20-11" fill="none" stroke="#f4d4a5" strokeDasharray="2 2" /></>}
        {kind === 'curve' && <><path d="m9 43 17-9 28 10-17 10Z" fill={shade} /><path d="m15 38 11-24 20 7-9 26Z" fill="#eee2c4" /><path d="m20 39 8-17m-8 17 18 6" stroke="#6a584d" fill="none" /><path d="M23 37q8-26 13 2" stroke="#852636" strokeWidth="3" fill="none" /><path d="m9 43 28 11v4L9 47Zm28 11 17-10v4L37 58Z" fill="#557687" /></>}
        {kind === 'matrix' && <><path d="m12 18 28-7 13 9-28 8Z" fill={paint} /><path d="m12 18 13 10v27L12 45Z" fill="#956442" /><path d="m25 28 28-8v27l-28 8Z" fill="#ecd29b" />{[0, 1, 2].flatMap(y => [0, 1, 2].map(x => <path key={y + '-' + x} d={'M' + (29 + x * 7) + ' ' + (32 + y * 7 - x * 2) + 'v3'} stroke="#795039" strokeWidth="3" />))}</>}
        {kind === 'lens' && <><path d="m11 38 12-6 31 10-12 7Z" fill={paint} /><path d="m11 38 31 11v7L11 45Zm31 11 12-7v7l-12 7Z" fill="#a16f3f" /><path d="M29 16v30" stroke="#8c704d" strokeWidth="4" /><ellipse cx="29" cy="24" rx="12" ry="18" fill={shade} /><ellipse cx="27" cy="22" rx="7" ry="13" fill="#c8e3e6" fillOpacity=".8" /><path d="m13 25 37 6" stroke="#d9a54c" strokeWidth="2" fill="none" /></>}
        {kind === 'molecule' && <><path d="m15 35 19-14 15 19m-34-5 21 14 13-9" stroke="#98a7ab" strokeWidth="5" /><circle cx="15" cy="35" r="9" fill={shade} /><circle cx="34" cy="21" r="11" fill={paint} /><circle cx="49" cy="40" r="7" fill={shade} /><circle cx="36" cy="49" r="7" fill="#b88485" /><path d="m12 31 3-2m16-14 4-2m11 24 3-1" stroke="#fff" strokeOpacity=".7" strokeWidth="2.5" /></>}
        {kind === 'cell' && <><ellipse cx="32" cy="31" rx="23" ry="21" fill={'url(#' + id + '-orb)'} /><path d="M13 28q6-17 20-13" stroke="#dce9df" strokeWidth="2" fill="none" /><ellipse cx="34" cy="32" rx="10" ry="9" fill="#7398a8" /><ellipse cx="32" cy="30" rx="4" ry="4" fill="#b1c8d1" /><path d="m18 37 4 2m18 3 5-3m-3-19 3 3" stroke="#e9d2a2" strokeWidth="3" fill="none" /></>}
        {kind === 'book' && <><path d="m10 18 21 5 23-6v29l-22 9-22-7Z" fill={shade} /><path d="m13 15 18 5v29l-18-6Zm18 5 20-8v29l-20 8Z" fill="#f4e6c9" /><path d="m17 23 10 3m-10 5 10 3m-10 5 10 3m9-16 12-4m-12 10 12-4m-12 10 12-4" stroke="#baa27c" /><path d="M31 20v30" stroke="#8c7352" strokeWidth="2" /></>}
        {kind === 'bulb' && <><path d="M23 37C8 22 20 10 32 10s24 12 9 27l-4 8H27Z" fill={paint} /><path d="M27 45h10v8H27Z" fill={shade} /><path d="m25 26 7 8 7-8m-7 8v10" stroke="#9b663e" fill="none" /><path d="M21 20q2-5 7-6" stroke="#fff5d5" strokeWidth="3" fill="none" /></>}
        {kind === 'target' && <><ellipse cx="34" cy="30" rx="19" ry="22" fill={paint} /><ellipse cx="32" cy="28" rx="16" ry="20" fill="#f5e1ba" /><ellipse cx="32" cy="28" rx="10" ry="13" fill="#b47668" /><ellipse cx="32" cy="28" rx="4" ry="5" fill="#efd2aa" /><path d="m11 45 20-16m-20 16 2-8m-2 8 8-1" stroke="#426d7c" strokeWidth="3" fill="none" /><path d="m31 49-3 7h15l-7-7" fill="#a77848" /></>}
        {kind === 'pencil' && <><path d="m16 46 26-35 9 7-26 35Z" fill={paint} /><path d="m16 46 9 7-13 4Z" fill="#f0dfb7" /><path d="m12 57 3-7 4 3Z" fill="#574331" /><path d="m42 11 4-5 9 7-4 5Z" fill="#b98080" /><path d="m22 47 25-33" stroke="#fff1c5" strokeWidth="2" /></>}
      </g>
    </motion.svg>
  );
}
