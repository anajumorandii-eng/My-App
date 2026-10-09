import React, { useId } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { PedagogicalStage } from '../../types/summary';

type ObjectKind = 'solid' | 'curve' | 'matrix' | 'lens' | 'molecule' | 'cell' | 'book' | 'bulb' | 'target' | 'pencil' | 'globe' | 'column' | 'scales' | 'people' | 'letters' | 'wave' | 'circuit' | 'thermometer' | 'atom' | 'dna' | 'leaf';

export function chapterObject(subject: string, topic: string): ObjectKind {
  const text = topic.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  if (subject === 'Matemática') {
    if (/matriz|determinante|sistema linear/.test(text)) return 'matrix';
    if (/prisma|piramid|solido|cubo|paralelepiped|revolucao|volume/.test(text)) return 'solid';
    return /geometri|triangul|circulo|circunferen/.test(text) ? 'target' : 'curve';
  }
  if (subject === 'Física') {
    if (/onda|som|acustic|interfer|difracao/.test(text)) return 'wave';
    if (/calor|term|gas|gases|dilatacao/.test(text)) return 'thermometer';
    if (/eletri|circuit|magnet|capacitor|resistor/.test(text)) return 'circuit';
    if (/optica|lente|espelho|luz|visao/.test(text)) return 'lens';
    return 'scales';
  }
  if (subject === 'Química') return /atom|periodic|radioativ|nuclear/.test(text) ? 'atom' : 'molecule';
  if (subject === 'Biologia') {
    if (/dna|rna|nucleic|genet|genica|sintese proteica/.test(text)) return 'dna';
    return /ecolog|vegetal|planta|fotossint|ambiente/.test(text) ? 'leaf' : 'cell';
  }
  if (subject === 'Geografia' || subject === 'Atualidades') return 'globe';
  if (subject === 'História') return 'column';
  if (subject === 'Filosofia') return 'scales';
  if (subject === 'Sociologia') return 'people';
  if (subject === 'Redação') return 'pencil';
  if (subject === 'Gramática' || (subject === 'Inglês' || subject === 'Língua Inglesa')) return 'letters';
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
    <motion.svg className="vs-object-icon" viewBox="0 0 64 64" aria-hidden="true" data-study-object={kind}
      animate={{ y: selected && !reduced ? -2 : 0 }}
      transition={{ duration: reduced ? 0 : 0.2 }}>
      <defs>
        <linearGradient id={id + '-paint'} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f6d895" /><stop offset="0.52" stopColor="#d89f57" /><stop offset="1" stopColor="#996238" /></linearGradient>
        <linearGradient id={id + '-shade'} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#bfcfd7" /><stop offset="0.5" stopColor="#7395a6" /><stop offset="1" stopColor="#36596b" /></linearGradient>
        <radialGradient id={id + '-orb'} cx="32%" cy="23%" r="75%"><stop stopColor="#dce9e3" /><stop offset="0.45" stopColor="#86b5a1" /><stop offset="1" stopColor="#3d715e" /></radialGradient>
      </defs>
      <ellipse cx="32" cy="55" rx="20" ry="3.5" fill="currentColor" opacity="0.12" />
      <g stroke="#574331" strokeWidth="1.15" strokeLinejoin="round">
        {kind === 'globe' && <><path d="M31 45v9m-13 2h29" strokeWidth="4" fill="none" /><circle cx="32" cy="28" r="21" fill={shade} /><path d="M24 11 17 21l8 6 4-3 8 9-2 9 9-4 5-11-9-5-4-10Z" fill="#a1bca2" /><ellipse cx="32" cy="28" rx="10" ry="21" fill="none" stroke="#dae5dc" strokeOpacity=".55" /><path d="M13 21q19 9 38 0M13 35q19-8 38 0" fill="none" stroke="#dae5dc" strokeOpacity=".55" /></>}
        {kind === 'column' && <><path d="m12 15 20-8 20 8v7H12Z" fill={paint} /><path d="M16 22h32v27H16Z" fill="#ecd7b0" /><path d="M22 23v24m9-24v24m10-24v24" stroke="#ad895c" strokeWidth="4" /><path d="M12 49h40v8H12Z" fill={paint} /></>}
        {kind === 'scales' && <><path d="M32 12v41m-18 3h36M12 23l20-7 20 7" strokeWidth="4" fill="none" stroke="#a37945" /><path d="m12 23-8 19h16Zm40 0-8 19h16Z" stroke="#7b6449" fill="none" /><path d="M4 42q8 14 16 0Zm40 0q8 14 16 0Z" fill={paint} /><circle cx="32" cy="15" r="5" fill={shade} /></>}
        {kind === 'people' && <><path d="M9 48v-8q0-10 9-10t9 10v8Zm29 0v-8q0-10 9-10t9 10v8Z" fill={shade} /><circle cx="18" cy="22" r="8" fill={paint} /><circle cx="47" cy="22" r="8" fill={paint} /><path d="M20 54V40q0-12 12-12t12 12v14Z" fill={paint} /><circle cx="32" cy="19" r="10" fill={shade} /></>}
        {kind === 'letters' && <><path d="m9 18 33-7 13 8-33 8Z" fill={paint} /><path d="m9 18 13 9v27L9 45Z" fill="#a67b4c" /><path d="m22 27 33-8v27l-33 8Z" fill="#ead9b3" /><text x="28" y="45" fill="#795335" stroke="none" fontSize="21" fontFamily="Georgia">Aa</text></>}
        {kind === 'wave' && <><path d="m7 43 16-9 34 10-16 11Z" fill={shade} /><path d="M9 31q7-28 14 0t14 0t14 0" fill="none" stroke="#daa85e" strokeWidth="5" /><path d="M10 32h44" stroke="#537786" strokeDasharray="2 3" fill="none" /></>}
        {kind === 'circuit' && <><path d="m9 22 31-10 15 9v26L24 57 9 47Z" fill={shade} /><path d="m17 29 28-9v22l-28 9Z" fill="none" stroke="#ebc783" strokeWidth="3" /><path d="m27 26 6-2v6l-6 2Z" fill={paint} /><path d="m28 40 6-2v10l-6 2Z" fill={paint} /><circle cx="46" cy="23" r="5" fill={paint} /></>}
        {kind === 'thermometer' && <><path d="M25 39V14a7 7 0 0 1 14 0v25a12 12 0 1 1-14 0Z" fill={shade} /><path d="M30 42V19h4v23a7 7 0 1 1-4 0Z" fill="#a55156" stroke="none" /><path d="M37 17h6m-6 7h6m-6 7h6" stroke="#eee0c9" /></>}
        {kind === 'atom' && <><ellipse cx="32" cy="31" rx="25" ry="10" fill="none" stroke="#7297a3" strokeWidth="2" /><ellipse cx="32" cy="31" rx="25" ry="10" transform="rotate(60 32 31)" fill="none" stroke="#7297a3" strokeWidth="2" /><ellipse cx="32" cy="31" rx="25" ry="10" transform="rotate(120 32 31)" fill="none" stroke="#7297a3" strokeWidth="2" /><circle cx="32" cy="31" r="9" fill={paint} /><circle cx="55" cy="27" r="4" fill={shade} /><circle cx="17" cy="10" r="4" fill={shade} /></>}
        {kind === 'dna' && <><path d="M18 9c0 17 28 17 28 33q0 8-7 13M46 9c0 17-28 17-28 33q0 8 7 13" fill="none" strokeWidth="5" stroke="#a56866" /><path d="m20 14 24 0m-20 10h16m-21 10h26m-25 11h24m-18 8h12" fill="none" stroke="#7593a2" strokeWidth="3" /></>}
        {kind === 'leaf' && <><path d="M14 49C7 20 29 11 53 10c1 23-4 41-25 42Z" fill={'url(#' + id + '-orb)'} /><path d="M11 55 44 21M27 38l-7-10m7 10 15-1M36 29l-5-10" stroke="#f3e5b8" fill="none" strokeWidth="2" /></>}
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
