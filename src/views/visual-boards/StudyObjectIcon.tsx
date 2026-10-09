import React, { useId } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { PedagogicalStage } from '../../types/summary';

type ObjectKind = 'solid' | 'curve' | 'matrix' | 'lens' | 'molecule' | 'cell' | 'book' | 'bulb' | 'target' | 'pencil' | 'globe' | 'column' | 'scales' | 'people' | 'letters' | 'wave' | 'circuit' | 'thermometer' | 'atom' | 'dna' | 'leaf' | 'terrain' | 'map' | 'rain' | 'river' | 'city' | 'network' | 'crop' | 'energy' | 'ship' | 'factory' | 'scroll' | 'fort' | 'ballot';

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
  if (subject === 'Geografia') {
    if (/coordenad|cartograf|fuso|movimentos da terra/.test(text)) return 'map';
    if (/clima/.test(text)) return 'rain';
    if (/hidro|agua|hidric/.test(text)) return 'river';
    if (/relevo|geomorf|geolog|pedolog|mineral/.test(text)) return 'terrain';
    if (/biogeo|dominio|ambient/.test(text)) return 'leaf';
    if (/energi|combustiv|eletrica/.test(text)) return 'energy';
    if (/agrari|agric/.test(text)) return 'crop';
    if (/industri/.test(text)) return 'factory';
    if (/urbano|paisagem|turismo/.test(text)) return 'city';
    if (/popula|demogra|etnica|migrat/.test(text)) return 'people';
    if (/rede|transporte|fluxos|comercio|globaliza|bloco|econom/.test(text)) return 'network';
    return 'globe';
  }
  if (subject === 'Atualidades') return 'globe';
  if (subject === 'História') {
    if (/naveg|globaliza|interioriza|espanhola/.test(text)) return 'ship';
    if (/industrial/.test(text)) return 'factory';
    if (/mineracao/.test(text)) return 'terrain';
    if (/guerra|militar|nazismo|entreguerras/.test(text)) return 'fort';
    if (/republic|brasil atual|vargas|oligarq/.test(text)) return 'ballot';
    if (/antiguidade|civilizacoes|feudal|idade media/.test(text)) return 'column';
    return 'scroll';
  }
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
        {kind === 'terrain' && <><path d="m5 39 25-14 29 14-24 16Z" fill={paint}/><path d="m5 39 30 16v6L5 45Zm30 16 24-16v6L35 61Z" fill="#956c49"/><path d="m11 39 17-27 9 12 7-15 12 29-21 12Z" fill={shade}/><path d="m28 12-5 17 8-5 6 0m7-15-5 25 9 7" fill="none" stroke="#e8dcc3"/></>}
        {kind === 'map' && <><path d="m8 16 16-5 16 6 16-6v36l-16 6-16-6-16 5Z" fill={paint}/><path d="m24 11 16 6v36l-16-6Z" fill="#f4e5c7"/><path d="m24 11v36m16-30v36M13 33q12-15 20 0t17 1" fill="none" stroke="#67898b" strokeWidth="2"/><path d="M38 25a7 7 0 1 1 14 0q0 5-7 12-7-7-7-12Z" fill="#954b56"/><circle cx="45" cy="25" r="2" fill="#f7e6c7"/></>}
        {kind === 'rain' && <><path d="m8 47 24-9 24 9-24 10Z" fill={shade}/><path d="M10 29q-6-13 7-15 2-13 14-8 10-8 16 5 14-1 10 14-1 6-12 6H19Z" fill={shade}/><path d="m19 36-4 8m17-8-4 8m17-8-4 8" stroke="#759dae" strokeWidth="3"/><path d="M14 24q0-5 9-6m5-7 7 1" stroke="#dfe8e1" fill="none"/></>}
        {kind === 'river' && <><path d="m6 24 23-12 29 15-23 26-29-12Z" fill={paint}/><path d="m6 41 29 12v7L6 48Zm29 12 23-26v7L35 60Z" fill="#a4784b"/><path d="M23 16q17 4 11 11t8 13L35 50q-21-11-13-18t-8-9Z" fill={shade}/><path d="M26 18q12 5 7 11t6 12" stroke="#d1e6e4" fill="none"/></>}
        {kind === 'city' && <><path d="m5 45 26-13 28 13-26 15Z" fill={shade}/>{[[12,24,16],[29,12,28],[44,28,17]].map(([x,y,h])=><g key={x}><path d={`M${x} ${y}l8-4 7 4-8 4Z`} fill={paint}/><path d={`M${x} ${y}l7 4v${h}l-7-4Z`} fill="#ae8157"/><path d={`M${x+7} ${y+4}l8-4v${h}l-8 4Z`} fill="#ecd9ae"/><path d={`M${x+10} ${y+8}v${h-7}m3-${h-7}v${h-7}`} stroke="#678998" strokeWidth="2"/></g>)}</>}
        {kind === 'network' && <><path d="m9 42 24-14 22 14-24 14Z" fill={shade}/><path d="M16 16 48 23 32 46ZM16 16l16 30" stroke="#9d7e56" strokeWidth="3" fill="none"/>{[[16,16],[48,23],[32,46]].map(([x,y])=><circle key={x} cx={x} cy={y} r="8" fill={paint}/>)}</>}
        {kind === 'crop' && <><path d="m6 38 24-12 28 13-26 17Z" fill={paint}/><path d="m6 38 26 18v5L6 44Zm26 18 26-17v5L32 61Z" fill="#926747"/><path d="m13 40 25-11m-18 17 25-12m-17 18 25-12" stroke="#60775a" strokeWidth="3"/><path d="M29 35V10m0 15q-13 0-13-9 13 0 13 9Zm0-4q13 0 13-10-13 0-13 10Z" fill="#91aa70" stroke="#596d44"/></>}
        {kind === 'energy' && <><path d="m10 37 22-10 22 10-22 13Z" fill={shade}/><path d="m10 37 22 13v8L10 45Zm22 13 22-13v8L32 58Z" fill="#3f6574"/><path d="m34 6-17 24h14l-6 18 23-28H35l6-14Z" fill={paint}/></>}
        {kind === 'ship' && <><path d="M5 43q26-10 54 0m-54 8q26-9 54 0" stroke="#739aa5" fill="none"/><path d="m10 38 44-3-12 15H21Z" fill={paint}/><path d="M31 35V7m-2 4L11 32h18Zm5-1 18 19H34Z" fill="#f1e1bf"/><path d="m19 43 24-2" stroke="#956945"/></>}
        {kind === 'factory' && <><path d="m9 31 23-12 24 12v22l-23 8L9 49Z" fill={shade}/><path d="m9 31 9-10 8 7 8-10v33L9 49Z" fill={paint}/><path d="M41 26V7h8v21" fill="#ae895f"/><path d="M44 4q-8-4-16 0" stroke="#a9b8b6" fill="none" strokeWidth="4"/><path d="M14 35v9m9-12v16m19-14v12m8-14v12" stroke="#f0e0bb" strokeWidth="3"/></>}
        {kind === 'scroll' && <><path d="M15 11h37v38q-9 11-17 4H12V21q-8-2-4-9 2-4 7-1Z" fill={paint}/><path d="M15 11q10 0 5 12h-8m23 30q-8-8-1-11h18" fill="#eddbb5"/><path d="M25 21h19m-19 7h19m-19 7h13" fill="none" stroke="#98734d" strokeWidth="2"/><circle cx="39" cy="38" r="5" fill="#9a4e5c"/></>}
        {kind === 'fort' && <><path d="m8 25 24-12 24 12-24 12Z" fill={paint}/><path d="m8 25 24 12v20L8 45Zm24 12 24-12v20L32 57Z" fill={shade}/><path d="M8 25V15h7v6l8-4v-6l9-4v6l9 4v-6l8 4v6l7 4v10L32 47Z" fill="#b7c4c2"/><path d="M27 54V43q5-8 10-3v14" fill="#52717a"/></>}
        {kind === 'ballot' && <><path d="m10 29 22-11 23 11-22 12Z" fill={paint}/><path d="m10 29 23 12v19L10 48Zm23 12 22-12v19L33 60Z" fill={shade}/><path d="m20 29 14-6 8 4-14 7Z" fill="#574c40"/><path d="m24 6 19 6-11 20-15-6Z" fill="#f1e2c3"/><path d="m23 17 4 4 9-6" stroke="#637d64" fill="none" strokeWidth="2"/></>}
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
