import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { MOTION_DURATION, MOTION_EASE } from '../design-system/motion/tokens';
import type { InteractiveSummary, SummarySection } from '../types/summary';

const words = (value: string, max = 4) => value.replace(/[—–:;,.()[\]]/g, ' ').split(/\s+/).filter(word => word.length > 2).slice(0, max);
const short = (value: string, size = 22) => value.length <= size ? value : `${value.slice(0, size - 1).trim()}…`;
const line = { initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 }, exit: { opacity: 0 } };

function Physics({ labels }: { labels: string[] }) {
  return <><path className="tv-axis" d="M38 194H420M82 220V35" /><motion.path {...line} className="tv-primary" d="M92 178 Q190 48 385 105" />
    <motion.g {...line} className="tv-vector"><path d="M230 106h82l-12-8m12 8-12 8"/><path d="M230 106V52l-8 12m8-12 8 12"/></motion.g>
    <circle className="tv-object" cx="230" cy="106" r="18"/><text x="326" y="96">{short(labels[0])}</text><text x="95" y="210">{short(labels[1])}</text></>;
}
function PhysicsWave({ labels }: { labels: string[] }) { return <><path className="tv-axis" d="M40 130H425"/><motion.path {...line} className="tv-primary" d="M42 130q48-92 96 0t96 0t96 0t96 0"/><path className="tv-guide" d="M138 130V38M42 38h96"/><text x="66" y="220">{short(labels[0])}</text><text x="290" y="76">λ · f = v</text></>; }
function PhysicsOptics({ labels }: { labels: string[] }) { return <><path className="tv-axis" d="M230 32v188"/><path className="tv-lens" d="M230 42q-42 88 0 176M230 42q42 88 0 176"/><motion.path {...line} className="tv-primary" d="M45 72l185 58 182 0M45 188l185-58 182-58"/><circle className="tv-object" cx="357" cy="130" r="7"/><text x="48" y="220">{short(labels[0])}</text><text x="300" y="210">{short(labels[1])}</text></>; }
function PhysicsCircuit({ labels }: { labels: string[] }) { return <><motion.path {...line} className="tv-primary" d="M70 70h115m90 0h115v120H70V70"/><path className="tv-vector" d="M185 58v24m12-34v44M275 70v40l-18 12 36 16-36 16 36 16-18 12v8"/><circle className="tv-object" cx="70" cy="130" r="8"/><text x="102" y="220">{short(labels[0])}</text><text x="300" y="220">V = R·i</text></>; }
function PhysicsThermal({ labels }: { labels: string[] }) { return <><rect className="tv-vessel" x="145" y="54" width="170" height="142" rx="14"/><motion.path {...line} className="tv-primary" d="M145 120h170M230 120V38m-10 14 10-14 10 14"/>{[[180,155],[220,168],[268,148],[200,184],[286,178]].map(([x,y])=><circle key={`${x}-${y}`} className="tv-mark" cx={x} cy={y} r="6"/>)}<text x="70" y="220">{short(labels[0])}</text><text x="290" y="220">Q ↔ W ↔ ΔU</text></>; }
function Chemistry({ labels }: { labels: string[] }) {
  return <><g className="tv-molecule">{[[105,118],[145,82],[183,122],[145,160]].map(([x,y],i)=><React.Fragment key={i}><motion.circle initial={{scale:0}} animate={{scale:1}} exit={{scale:0}} cx={x} cy={y} r={i?15:22}/>{i>0&&<path d={`M105 118L${x} ${y}`}/>}</React.Fragment>)}</g>
    <motion.path {...line} className="tv-primary" d="M215 120h68l-12-8m12 8-12 8"/><g className="tv-orbit"><circle cx="350" cy="120" r="57"/><circle cx="350" cy="120" r="31"/><circle cx="350" cy="63" r="6"/></g><text x="72" y="205">{short(labels[0])}</text><text x="315" y="205">{short(labels[1])}</text></>;
}
function ChemAcid({ labels }: { labels: string[] }) { return <><path className="tv-axis" d="M48 132H412"/>{[0,2,4,6,7,8,10,12,14].map(n=><g key={n}><path d={`M${48+n*26} 120v24`} stroke="currentColor"/><text x={48+n*26} y="164" textAnchor="middle">{n}</text></g>)}<motion.path {...line} className="tv-primary" d="M52 92h154m12 0h186"/><text x="75" y="80">ácido</text><text x="222" y="80">neutro</text><text x="335" y="80">base</text><text x="120" y="215">{short(labels[0])}</text></>; }
function ChemOrganic({ labels }: { labels: string[] }) { return <><motion.path {...line} className="tv-primary" d="M70 132l65-45 66 45 66-45 66 45 66-45"/>{[70,135,201,267,333,399].map((x,i)=><circle key={x} className={i%2?'tv-node':'tv-object'} cx={x} cy={i%2?87:132} r="10"/>)}<text x="94" y="205">cadeia · função · propriedade</text><text x="300" y="58">{short(labels[0])}</text></>; }
function ChemSolution({ labels }: { labels: string[] }) { return <>{[105,230,355].map((x,i)=><g key={x}><path className="tv-vessel" d={`M${x-38} 54v116q0 28 38 28t38-28V54`}/>{Array.from({length:3+i}).map((_,j)=><circle key={j} className="tv-mark" cx={x-22+j*18} cy={170-j%2*22} r="5"/>)} </g>)}<motion.path {...line} className="tv-primary" d="M145 126h45m80 0h45"/><text x="96" y="224">{short(labels[0])}</text><text x="302" y="224">{short(labels[1])}</text></>; }
function Biology({ labels }: { labels: string[] }) {
  return <><motion.path {...line} className="tv-organic" d="M228 210C98 174 81 45 230 40c142 5 126 137-2 170Z"/><path className="tv-vein" d="M228 196V57M225 96l-62-26M226 125l75-37M226 153l-69 28"/><g className="tv-cell"><circle cx="230" cy="122" r="34"/><circle cx="230" cy="122" r="12"/></g><text x="64" y="228">{short(labels[0])}</text><text x="300" y="228">{short(labels[1])}</text></>;
}
function BioGenetics({ labels }: { labels: string[] }) { return <><motion.path {...line} className="tv-primary" d="M108 42c110 45 130 130 244 170M352 42C242 87 222 172 108 212"/>{[68,102,136,170].map(y=><path key={y} className="tv-vein" d={`M${130+(y-68)*.65} ${y}h${200-(y-68)*1.3}`}/>)}<text x="68" y="232">{short(labels[0])}</text><text x="300" y="232">gene → fenótipo</text></>; }
function BioEcology({ labels }: { labels: string[] }) { return <><circle className="tv-object" cx="230" cy="55" r="20"/>{[[90,135],[230,135],[370,135],[150,210],[310,210]].map(([x,y],i)=><g key={i}><motion.path {...line} className="tv-link" d={`M230 75L${x} ${y-14}`}/><circle className="tv-node" cx={x} cy={y} r="14"/></g>)}<text x="55" y="232">{short(labels[0])}</text><text x="280" y="232">energia ↓ a cada nível</text></>; }
function BioCell({ labels }: { labels: string[] }) { return <><motion.path {...line} className="tv-organic" d="M86 124c0-78 75-100 147-75 60-35 144 2 141 78 4 78-91 102-152 70-66 30-136 1-136-73Z"/><circle className="tv-cell" cx="225" cy="123" r="40"/><circle className="tv-object" cx="225" cy="123" r="14"/>{[[145,93],[304,100],[160,165],[292,166]].map(([x,y])=><circle key={`${x}-${y}`} className="tv-mark" cx={x} cy={y} r="8"/>)}<text x="90" y="226">{short(labels[0])}</text><text x="300" y="226">{short(labels[1])}</text></>; }
function Mathematics({ labels }: { labels: string[] }) {
  return <><path className="tv-axis" d="M42 198H425M84 220V32"/><motion.path {...line} className="tv-primary" d="M91 188C145 188 155 70 225 70s77 118 180 118"/><path className="tv-guide" d="M225 70v118M84 70h141"/><circle className="tv-object" cx="225" cy="70" r="7"/><text x="240" y="58">{short(labels[0])}</text><text x="290" y="215">{short(labels[1])}</text></>;
}
function MathRadical({ labels }: { labels: string[] }) {
  return <><path className="tv-axis" d="M42 198H425M84 220V32"/><motion.path {...line} className="tv-primary" d="M84 190Q125 190 146 160T205 118T280 84T398 58"/><path className="tv-guide" d="M205 118V198M84 118h121"/><text x="100" y="72">ⁿ√(aᵐ) = aᵐ⁄ⁿ</text><text x="220" y="112">{short(labels[0])}</text></>;
}
function MathTrig({ labels }: { labels: string[] }) {
  return <><path className="tv-axis" d="M42 130H425M230 220V32"/><circle className="tv-guide" cx="230" cy="130" r="82"/><motion.path {...line} className="tv-primary" d="M230 130L294 79M230 130h64M294 130V79"/><circle className="tv-object" cx="294" cy="79" r="7"/><text x="244" y="120">θ</text><text x="306" y="75">{short(labels[0])}</text></>;
}
function MathProbability({ labels }: { labels: string[] }) {
  return <><circle className="tv-object" cx="72" cy="125" r="9"/><motion.path {...line} className="tv-primary" d="M82 125L180 70M82 125l98 58M190 70l96-34M190 70l96 45M190 183l96-42M190 183l96 35"/>{[[190,70],[190,183],[296,36],[296,115],[296,141],[296,218]].map(([x,y])=><circle key={`${x}-${y}`} className="tv-node" cx={x} cy={y} r="9"/>)}<text x="315" y="80">{short(labels[0])}</text><text x="315" y="188">{short(labels[1])}</text></>;
}
function MathGeometry({ labels }: { labels: string[] }) {
  return <><motion.path {...line} className="tv-primary" d="M70 190L168 48l82 142Zm200 0l52-132 72 132Z"/><circle className="tv-guide" cx="319" cy="124" r="65"/><path className="tv-guide" d="M168 48v142M270 190l124-132"/><text x="82" y="220">{short(labels[0])}</text><text x="300" y="220">{short(labels[1])}</text></>;
}
function MathExponential({ labels }: { labels: string[] }) {
  return <><path className="tv-axis" d="M42 198H425M84 220V32"/><motion.path {...line} className="tv-primary" d="M84 190C180 188 276 164 405 38"/><path className="tv-guide" d="M84 190h321"/><text x="290" y="76">f(x)=aˣ</text><text x="120" y="220">{short(labels[0])}</text></>;
}
function History({ labels }: { labels: string[] }) {
  return <><path className="tv-axis" d="M42 130H425"/>{[75,165,255,345,415].map((x,i)=><motion.g key={x} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{delay:i*MOTION_DURATION.micro/2}}><circle className={i===2?'tv-object':'tv-mark'} cx={x} cy="130" r={i===2?12:6}/><path d={`M${x} 105v50`}/></motion.g>)}<path className="tv-break" d="M238 42l-14 35 19 18-16 31"/><text x="44" y="190">{short(labels[0])}</text><text x="278" y="78">{short(labels[1])}</text></>;
}
function Geography({ labels }: { labels: string[] }) {
  return <><motion.path {...line} className="tv-territory" d="M89 54l103-18 67 39 99-12 48 77-42 58-102 14-53-39-101 13-42-65Z"/>{[0,1,2].map(i=><path key={i} className="tv-contour" d={`M${115+i*20} ${92+i*12}q70-45 147 5t93 36q-53 49-125 27t-115-68Z`}/>)}<path className="tv-route" d="M102 167Q213 72 366 157"/><circle className="tv-object" cx="102" cy="167" r="7"/><circle className="tv-object" cx="366" cy="157" r="7"/><text x="78" y="224">{short(labels[0])}</text><text x="285" y="224">{short(labels[1])}</text></>;
}
function Language({ labels, literary=false }: { labels: string[]; literary?: boolean }) {
  return literary ? <><path className="tv-page" d="M72 44q87-22 158 23v147q-71-42-158-19Zm316 0q-87-22-158 23v147q71-42 158-19Z"/><motion.path {...line} className="tv-primary" d="M106 90h82M106 116h96M106 142h69M270 90h82M258 116h102M278 142h70"/><text x="86" y="232">{short(labels[0])}</text><text x="278" y="232">{short(labels[1])}</text></>
  : <><g className="tv-sentence">{labels.slice(0,4).map((label,i)=><motion.g key={label+i} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{delay:i*MOTION_DURATION.micro/2}}><rect x={42+i*99} y={78+(i%2)*38} width="82" height="34" rx="8"/><text x={83+i*99} y={100+(i%2)*38} textAnchor="middle">{short(label,12)}</text></motion.g>)}</g><motion.path {...line} className="tv-primary" d="M82 154Q227 215 380 153"/><text x="160" y="213">forma → sentido → uso</text></>;
}
function Argument({ labels }: { labels: string[] }) {
  return <><g className="tv-argument">{['tese','evidência','análise'].map((label,i)=><motion.g key={label} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} exit={{opacity:0}} transition={{delay:i*MOTION_DURATION.micro/2}}><rect x={52+i*133} y={87} width="108" height="62" rx="10"/><text x={106+i*133} y="114" textAnchor="middle">{label}</text><text x={106+i*133} y="134" textAnchor="middle">{short(labels[i]||labels[0],13)}</text></motion.g>)}</g><path className="tv-primary" d="M160 118h25m108 0h25"/><text x="140" y="205">posição sustentada, não opinião solta</text></>;
}
function Network({ labels, dialectic=false }: { labels: string[]; dialectic?: boolean }) {
  return dialectic ? <><circle className="tv-node" cx="122" cy="120" r="46"/><circle className="tv-node" cx="338" cy="120" r="46"/><motion.path {...line} className="tv-primary" d="M174 120h112m-12-8 12 8-12 8M186 108l-12 12 12 12"/><text x="122" y="116" textAnchor="middle">{short(labels[0],13)}</text><text x="338" y="116" textAnchor="middle">{short(labels[1],13)}</text><text x="230" y="201" textAnchor="middle">tensão → argumento → consequência</text></>
  : <>{[[230,58],[112,114],[348,114],[160,202],[300,202]].map(([x,y],i)=><g key={i}><motion.path {...line} className="tv-link" d={`M230 128L${x} ${y}`}/><circle className={i===0?'tv-object':'tv-node'} cx={x} cy={y} r={i===0?20:14}/></g>)}<text x="230" y="133" textAnchor="middle">atores</text><text x="75" y="232">{short(labels[0])}</text><text x="292" y="232">{short(labels[1])}</text></>;
}

export function TopicVisual({ summary, section, index }: { summary: InteractiveSummary; section: SummarySection; index: number }) {
  const reduced = useReducedMotion();
  const labels = [...words(section.title), ...words(summary.topic), ...words(summary.title)].slice(0, 5);
  const subject = summary.subject;
  let scene: React.ReactNode;
  const corpus = `${summary.topic} ${summary.title} ${section.title}`.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  if (subject === 'Física' && /onda|som|acust|frequencia/.test(corpus)) scene = <PhysicsWave labels={labels}/>;
  else if (subject === 'Física' && /optica|lente|espelho|refracao|reflexao/.test(corpus)) scene = <PhysicsOptics labels={labels}/>;
  else if (subject === 'Física' && /eletric|circuit|resistor|corrente/.test(corpus)) scene = <PhysicsCircuit labels={labels}/>;
  else if (subject === 'Física' && /term|calor|gas|temperatura/.test(corpus)) scene = <PhysicsThermal labels={labels}/>;
  else if (subject === 'Física') scene = <Physics labels={labels}/>;
  else if (subject === 'Química' && /acido|base|ph|neutral/.test(corpus)) scene = <ChemAcid labels={labels}/>;
  else if (subject === 'Química' && /organic|carbon|hidrocarbon|funcao/.test(corpus)) scene = <ChemOrganic labels={labels}/>;
  else if (subject === 'Química' && /solu|concentr|mistura|solubil/.test(corpus)) scene = <ChemSolution labels={labels}/>;
  else if (subject === 'Química') scene = <Chemistry labels={labels}/>;
  else if (subject === 'Biologia' && /genet|mendel|dna|rna|hered/.test(corpus)) scene = <BioGenetics labels={labels}/>;
  else if (subject === 'Biologia' && /ecolog|cadeia|ciclo|popul|bioma/.test(corpus)) scene = <BioEcology labels={labels}/>;
  else if (subject === 'Biologia' && /celul|membrana|mitose|meiose/.test(corpus)) scene = <BioCell labels={labels}/>;
  else if (subject === 'Biologia') scene = <Biology labels={labels}/>;
  else if (subject === 'Matemática' && /radic|potenc/.test(corpus)) scene = <MathRadical labels={labels}/>;
  else if (subject === 'Matemática' && /trigon|seno|cosseno|angulo/.test(corpus)) scene = <MathTrig labels={labels}/>;
  else if (subject === 'Matemática' && /probabil|combinat|contagem/.test(corpus)) scene = <MathProbability labels={labels}/>;
  else if (subject === 'Matemática' && /geometr|triang|circulo|polig|area|volume/.test(corpus)) scene = <MathGeometry labels={labels}/>;
  else if (subject === 'Matemática' && /exponencial|logarit/.test(corpus)) scene = <MathExponential labels={labels}/>;
  else if (subject === 'Matemática') scene = <Mathematics labels={labels}/>;
  else if (subject === 'História') scene = <History labels={labels}/>;
  else if (subject === 'Geografia' || subject === 'Atualidades') scene = <Geography labels={labels}/>;
  else if (subject === 'Literatura') scene = <Language labels={labels} literary/>;
  else if (subject === 'Gramática' || subject === 'Língua Inglesa' || subject === 'Entendimento de Texto') scene = <Language labels={labels}/>;
  else if (subject === 'Redação') scene = <Argument labels={labels}/>;
  else if (subject === 'Filosofia') scene = <Network labels={labels} dialectic/>;
  else scene = <Network labels={labels}/>;
  return <figure className="topic-visual" data-subject={subject} aria-label={`Representação visual de ${section.title}`}>
    <AnimatePresence mode="wait" initial={false}><motion.svg key={section.id} viewBox="0 0 460 250" role="img"
      initial={reduced ? false : { opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
      transition={{ duration: reduced ? 0 : MOTION_DURATION.component, ease: MOTION_EASE }}>{scene}</motion.svg></AnimatePresence>
    <figcaption><span>{String(index + 1).padStart(2,'0')}</span><strong>{section.title}</strong><small>{summary.topic}</small></figcaption>
  </figure>;
}
