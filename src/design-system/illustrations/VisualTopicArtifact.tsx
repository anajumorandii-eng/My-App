import { motion, useReducedMotion } from 'motion/react';

export type VisualArtifactKind =
  | 'thermal-system' | 'optical-rays' | 'newton-laws' | 'force-field' | 'electric-field'
  | 'cell-system' | 'gene-helix' | 'ecology-web'
  | 'reaction-network' | 'molecular-structure'
  | 'function-space' | 'geometric-proof'
  | 'timeline-strata' | 'territory-flows'
  | 'syntax-tree' | 'narrative-layers' | 'argument-architecture'
  | 'dialectic-lens' | 'social-network' | 'context-language';

const fold = (value: string) => value
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');

export function getVisualArtifactKind(subject: string, topic: string, title = ''): VisualArtifactKind {
  const matter = fold(subject);
  const content = fold(`${topic} ${title}`);

  if (matter.includes('fisic')) {
    if (/term|calor|gas|temperat|dilat|mudanca de estado/.test(content)) return 'thermal-system';
    if (/opt|luz|refra|refle|espelho|lente/.test(content)) return 'optical-rays';
    if (/newton|inercia|acao e reacao/.test(content)) return 'newton-laws';
    if (/eletr|carga|corrente|campo magnet|circuit/.test(content)) return 'electric-field';
    return 'force-field';
  }
  if (matter.includes('biolog')) {
    if (/genet|dna|rna|hered|cromoss|mendel/.test(content)) return 'gene-helix';
    if (/ecolog|cadeia|teia|bioma|popul|comunidade/.test(content)) return 'ecology-web';
    return 'cell-system';
  }
  if (matter.includes('quim')) {
    if (/reac|equilibr|cinet|estequ|termoquim|soluc/.test(content)) return 'reaction-network';
    return 'molecular-structure';
  }
  if (matter.includes('matem')) {
    if (/geometr|trigonom|circun|triang|polig/.test(content)) return 'geometric-proof';
    return 'function-space';
  }
  if (matter.includes('histor')) return 'timeline-strata';
  if (matter.includes('geograf')) return 'territory-flows';
  if (matter.includes('literat')) return 'narrative-layers';
  if (matter.includes('redac')) return 'argument-architecture';
  if (matter.includes('filosof')) return 'dialectic-lens';
  if (matter.includes('sociolog')) return 'social-network';
  if (matter.includes('ingles')) return 'context-language';
  return 'syntax-tree';
}

type Props = {
  subject: string;
  topic: string;
  title: string;
  active?: boolean;
  showCopy?: boolean;
};

const lineMotion = { pathLength: [0.15, 1, 0.15], opacity: [0.35, 1, 0.35] };
const loop = { duration: 4.8, repeat: Infinity, ease: 'easeInOut' as const };

function Particles() {
  return <>{[[88, 83], [112, 72], [137, 88], [99, 104], [128, 111], [151, 101]].map(([cx, cy], index) => (
    <motion.circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3.4" className="vs-artifact-accent"
      animate={{ x: [0, index % 2 ? 5 : -4, 0], y: [0, index % 3 ? -5 : 4, 0] }}
      transition={{ duration: 2.2 + index * 0.17, repeat: Infinity, ease: 'easeInOut' }} />
  ))}</>;
}

function ArtifactDrawing({ kind }: { kind: VisualArtifactKind }) {
  switch (kind) {
    case 'thermal-system': return <>
      <path className="vs-artifact-soft" d="M70 38h106v104H70z" />
      <path className="vs-artifact-main" d="M76 69h94M123 25v43M104 25h38M84 141h72" />
      <motion.path className="vs-artifact-energy" d="M123 59V32m-8 10 8-10 8 10" animate={{ y: [5, -3, 5] }} transition={loop} />
      <Particles />
      <text className="vs-artifact-formula" x="185" y="54">Q = 0</text>
      <text className="vs-artifact-formula" x="184" y="77">ΔU = −W</text>
      <path className="vs-artifact-dash" d="M176 94c23 0 36 12 48 34" />
    </>;
    case 'optical-rays': return <>
      <path className="vs-artifact-soft" d="M116 30c28 24 28 84 0 110-27-25-27-86 0-110Z" />
      <path className="vs-artifact-main" d="M116 30c28 24 28 84 0 110M116 30c-27 24-27 85 0 110" />
      {[-26, 0, 26].map((offset) => <motion.path key={offset} className="vs-artifact-ray" d={`M18 ${84 + offset} 102 ${84 + offset / 3} 222 84`} animate={lineMotion} transition={{ ...loop, delay: (offset + 26) / 100 }} />)}
      <motion.circle className="vs-artifact-accent" cx="222" cy="84" r="6" animate={{ r: [4, 8, 4], opacity: [0.5, 1, 0.5] }} transition={loop} />
    </>;
    case 'newton-laws': return <>
      <motion.circle className="vs-artifact-soft" cx="120" cy="88" r="35" animate={{ scale: [1, 1.04, 1] }} transition={loop} />
      <circle className="vs-artifact-main" cx="120" cy="88" r="35" />
      <path className="vs-artifact-main" d="M93 66 57 42M148 66l38-24M120 123v34" />
      <motion.path className="vs-artifact-energy" d="m52 34 17 5-12 13m123-12 17-5-5 17m-81 99 9 12 9-12" animate={lineMotion} transition={loop} />
      <text className="vs-artifact-formula" x="98" y="82">LEIS DE</text>
      <text className="vs-artifact-formula" x="99" y="98">NEWTON</text>
      <text className="vs-artifact-formula" x="22" y="28">1ª · ΣF = 0</text>
      <text className="vs-artifact-formula" x="160" y="28">2ª · ΣF = ma</text>
      <text className="vs-artifact-formula" x="141" y="166">3ª · F₁ = −F₂</text>
    </>;
    case 'force-field': return <>
      <circle className="vs-artifact-soft" cx="122" cy="86" r="46" />
      <motion.path className="vs-artifact-main" d="M26 122 122 86 218 48M122 86 72 30M122 86l38 66" animate={lineMotion} transition={loop} />
      <path className="vs-artifact-energy" d="m207 45 11 3-7 9M68 39l4-9 9 7m70 108 9 7 1-11" />
      <circle className="vs-artifact-accent" cx="122" cy="86" r="10" />
      <text className="vs-artifact-formula" x="142" y="78">ΣF = ma</text>
    </>;
    case 'electric-field': return <>
      {[34, 50, 68].map(r => <motion.circle key={r} className="vs-artifact-dash" cx="120" cy="86" r={r} animate={{ opacity: [0.18, 0.8, 0.18] }} transition={{ ...loop, delay: r / 80 }} />)}
      <circle className="vs-artifact-accent" cx="120" cy="86" r="13" />
      <text className="vs-artifact-formula" x="115" y="91">+</text>
      <path className="vs-artifact-energy" d="M120 20v35m0 62v35M54 86h35m62 0h35" />
    </>;
    case 'gene-helix': return <>
      <motion.path className="vs-artifact-main" d="M70 22c100 30 100 98 0 128M174 22C74 52 74 120 174 150" animate={lineMotion} transition={loop} />
      {[42, 62, 82, 102, 122, 142].map((y, i) => <path key={y} className="vs-artifact-dash" d={`M${i % 2 ? 91 : 76} ${y}h${i % 2 ? 63 : 90}`} />)}
      <text className="vs-artifact-formula" x="187" y="57">A·T</text><text className="vs-artifact-formula" x="187" y="79">C·G</text>
    </>;
    case 'ecology-web':
    case 'social-network': return <>
      <path className="vs-artifact-dash" d="M48 53 112 34l67 26 22 69-85 25-74-40 6-61Zm64-19 4 120M48 53l131 7L42 114l159 15M112 34 42 114m137-54-63 94" />
      {[[48,53],[112,34],[179,60],[201,129],[116,154],[42,114]].map(([cx,cy],i)=><motion.circle key={cx} className={i % 2 ? 'vs-artifact-accent' : 'vs-artifact-node'} cx={cx} cy={cy} r={i % 3 ? 7 : 10} animate={{ scale: [1,1.22,1] }} transition={{...loop,delay:i*.2}}/>)}
    </>;
    case 'cell-system': return <>
      <path className="vs-artifact-soft" d="M38 93c0-47 37-72 84-68 48 4 86 36 80 79-6 41-49 62-97 56-42-5-67-29-67-67Z" />
      <path className="vs-artifact-main" d="M38 93c0-47 37-72 84-68 48 4 86 36 80 79-6 41-49 62-97 56-42-5-67-29-67-67Z" />
      <motion.circle className="vs-artifact-accent" cx="119" cy="88" r="26" animate={{ scale: [1,.9,1] }} transition={loop}/>
      <path className="vs-artifact-dash" d="M62 69q17-19 35 0M151 119q18-19 32 2M68 127q17-16 32 2" />
    </>;
    case 'reaction-network':
    case 'molecular-structure': return <>
      <motion.g animate={{ rotate: [0, 360] }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: '120px 86px' }}>
        <path className="vs-artifact-main" d="m120 29 49 28v57l-49 28-49-28V57l49-28Z" />
        <path className="vs-artifact-dash" d="m120 29v57l49 28M120 86 71 57M120 86l49-29" />
        {[[120,29],[169,57],[169,114],[120,142],[71,114],[71,57],[120,86]].map(([cx,cy],i)=><circle key={`${cx}-${cy}`} className={i===6?'vs-artifact-accent':'vs-artifact-node'} cx={cx} cy={cy} r={i===6?9:6}/>) }
      </motion.g>
      {kind === 'reaction-network' && <text className="vs-artifact-formula" x="181" y="87">⇌</text>}
    </>;
    case 'geometric-proof': return <>
      <path className="vs-artifact-soft" d="m50 137 72-111 72 111H50Z" />
      <motion.path className="vs-artifact-main" d="m50 137 72-111 72 111H50Zm35 0 37-56 37 56M122 26v55" animate={lineMotion} transition={loop}/>
      <path className="vs-artifact-energy" d="M112 124h13v13"/><text className="vs-artifact-formula" x="169" y="45">a²+b²</text>
    </>;
    case 'function-space': return <>
      <path className="vs-artifact-dash" d="M34 29v116h182M34 116h182M76 29v116m42-116v116m42-116v116m42-116v116" />
      <motion.path className="vs-artifact-main" d="M40 131c35-3 49-17 68-48 22-36 43-49 102-51" animate={lineMotion} transition={loop}/>
      <circle className="vs-artifact-accent" cx="108" cy="83" r="6"/><text className="vs-artifact-formula" x="126" y="72">f(x)</text>
    </>;
    case 'timeline-strata': return <>
      {[42,70,98,126].map((y,i)=><motion.path key={y} className={i===2?'vs-artifact-main':'vs-artifact-soft'} d={`M35 ${y}c45 ${-8+i*3} 104 ${10-i*4} 174 0v18c-57 ${9-i*3}-118 ${-7+i*2}-174 0Z`} animate={{x:[i%2?-3:3,0,i%2?-3:3]}} transition={{...loop,delay:i*.16}}/>)}
      <path className="vs-artifact-energy" d="M57 26v120m-7-12 7 12 7-12" />
      <text className="vs-artifact-formula" x="72" y="32">tempo</text>
    </>;
    case 'territory-flows': return <>
      {[0,1,2].map(i=><path key={i} className="vs-artifact-soft" d={`M${42+i*14} ${120-i*18}c18-52 56-70 94-54 28 12 43 4 62-12`} />)}
      <motion.path className="vs-artifact-main" d="M38 132c42-18 54-75 100-72 28 2 45 20 73-24" animate={lineMotion} transition={loop}/>
      <path className="vs-artifact-energy" d="m202 38 9-2-2 9"/><circle className="vs-artifact-accent" cx="137" cy="60" r="6"/>
    </>;
    case 'narrative-layers': return <>
      <path className="vs-artifact-soft" d="M42 39c38-8 63 5 78 23 15-18 40-31 78-23v98c-33-7-60 1-78 21-18-20-45-28-78-21V39Z" />
      <path className="vs-artifact-main" d="M42 39c38-8 63 5 78 23 15-18 40-31 78-23v98c-33-7-60 1-78 21-18-20-45-28-78-21V39Zm78 23v96" />
      <motion.path className="vs-artifact-dash" d="M59 65h43M59 83h48M59 101h37M139 65h42m-42 18h35m-35 18h45" animate={lineMotion} transition={loop}/>
    </>;
    case 'argument-architecture': return <>
      <path className="vs-artifact-main" d="M38 136h164M52 124h136L174 91H66l-14 33Zm26-45h84l-13-29H91L78 79Zm43-55-18 14h36l-18-14Z" />
      <motion.path className="vs-artifact-energy" d="M121 137V31" animate={{y:[4,-4,4]}} transition={loop}/>
      <text className="vs-artifact-formula" x="190" y="57">tese</text>
    </>;
    case 'dialectic-lens': return <>
      <motion.circle className="vs-artifact-soft" cx="90" cy="82" r="52" animate={{x:[-4,4,-4]}} transition={loop}/>
      <motion.circle className="vs-artifact-soft" cx="150" cy="82" r="52" animate={{x:[4,-4,4]}} transition={loop}/>
      <path className="vs-artifact-main" d="M120 31c28 20 39 68 0 103-39-35-28-83 0-103Z" />
      <text className="vs-artifact-formula" x="39" y="151">tese</text><text className="vs-artifact-formula" x="164" y="151">antítese</text>
    </>;
    case 'context-language':
    case 'syntax-tree': return <>
      <path className="vs-artifact-main" d="M120 31v30M120 61 66 93m54-32 55 32M66 93l-30 34m30-34 29 34m80-34-26 34m26-34 31 34" />
      {[[120,31],[66,93],[175,93],[36,127],[95,127],[149,127],[206,127]].map(([cx,cy],i)=><motion.rect key={cx} className={i===0?'vs-artifact-accent':'vs-artifact-node'} x={cx-15} y={cy-8} width="30" height="16" rx="8" animate={{y:[cy-8,cy-11,cy-8]}} transition={{...loop,delay:i*.12}}/>)}
    </>;
  }
}

export function VisualTopicArtifact({ subject, topic, title, active = true, showCopy = true }: Props) {
  const reducedMotion = useReducedMotion();
  const kind = getVisualArtifactKind(subject, topic, title);
  return (
    <figure className={`vs-topic-artifact${showCopy ? '' : ' is-illustration-only'}`} data-artifact={kind} aria-label={`Representação visual de ${topic}, em ${subject}`}>
      {showCopy && <div className="vs-artifact-copy">
        <span>{subject}</span>
        <strong>{topic}</strong>
        <small>{title}</small>
      </div>}
      <motion.svg viewBox="0 0 240 175" aria-hidden="true"
        initial={reducedMotion ? false : { opacity: 0, scale: .9, rotate: -2 }}
        animate={{ opacity: active ? 1 : .62, scale: active ? 1 : .96, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 18 }}>
        <ArtifactDrawing kind={kind} />
      </motion.svg>
      <figcaption>{kind.replaceAll('-', ' ')}</figcaption>
    </figure>
  );
}
