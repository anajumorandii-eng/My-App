import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import type { SceneEntry } from '../types';
import '../TopicScene.css';

const ORGANIC_CHAPTERS = {
  functions: new Set([
    'summary-quimica-nomenclatura-de-compostos-organicos-oxigenados-e-nitrogenados',
    'summary-quimica-reconhecimento-de-funcoes-organicas-e-algumas-de-suas-propriedades',
  ]),
  isomerism: 'summary-quimica-isomeria',
  reactions: 'summary-quimica-interpretando-reacoes-organicas',
  substitution: 'summary-quimica-reacoes-de-substituicao',
  alcohols: 'summary-quimica-alcoois',
} as const;

export const ORGANIC_SCENE_IDS = new Set<string>([
  ...ORGANIC_CHAPTERS.functions,
  ORGANIC_CHAPTERS.isomerism,
  ORGANIC_CHAPTERS.reactions,
  ORGANIC_CHAPTERS.substitution,
  ORGANIC_CHAPTERS.alcohols,
]);

const CUES: Record<string, string> = {
  'Álcool': 'Procure O–H ligado a um carbono saturado.',
  'Aldeído': 'A carbonila fica na ponta e o carbono mantém um H.',
  'Cetona': 'A carbonila fica entre dois carbonos.',
  'Aldeído ou cetona': 'A posição da carbonila decide: terminal é aldeído; interna é cetona.',
  'Ácido carboxílico': 'Carbonila e hidroxila ocupam o mesmo carbono: –COOH.',
  'Éter': 'O oxigênio funciona como ponte entre duas cadeias.',
  'Amina': 'O nitrogênio liga-se à cadeia sem carbonila vizinha.',
  'Amida': 'O nitrogênio está diretamente ligado ao carbono da carbonila.',
  'Nitrila': 'A assinatura é a tripla ligação terminal C≡N.',
  'Plana': 'Muda quem está ligado a quem, embora a fórmula molecular permaneça igual.',
  'Geométrica': 'A dupla impede rotação; compare grupos do mesmo lado e de lados opostos.',
  'Óptica': 'As duas estruturas são imagens no espelho que não se sobrepõem.',
  'Adição': 'A ligação π se abre e surgem duas novas ligações simples.',
  'Eliminação': 'Dois grupos saem de carbonos vizinhos e nasce uma ligação π.',
  'Substituição': 'A cadeia conserva a saturação: troca-se apenas um grupo por outro.',
  'Radicalar (alcanos)': 'Luz ou calor rompe a ligação e inicia uma cadeia de radicais.',
  'Eletrofílica (aromáticos)': 'O anel recupera a aromaticidade depois de trocar H por um eletrófilo.',
  'Nucleofílica (haletos)': 'O nucleófilo entra enquanto o haleto sai como grupo abandonador.',
  'Primário': 'O carbono do –OH ainda tem dois H e pode chegar até ácido carboxílico.',
  'Secundário': 'O carbono do –OH tem um H e forma cetona.',
  'Terciário': 'Sem H no carbono do –OH, a oxidação usual não avança.',
};

function Bond({ x1, y1, x2, y2, order = 1, accent = false }: { x1: number; y1: number; x2: number; y2: number; order?: 1 | 2 | 3; accent?: boolean }) {
  const dx = y2 === y1 ? 0 : 3;
  const dy = y2 === y1 ? 3 : 0;
  const offsets = order === 1 ? [0] : order === 2 ? [-2.5, 2.5] : [-4, 0, 4];
  return <>{offsets.map((offset) => <line key={offset} x1={x1 + dx * offset / 3} y1={y1 + dy * offset / 3} x2={x2 + dx * offset / 3} y2={y2 + dy * offset / 3} className={accent ? 'tc-organic-bond tc-organic-bond--accent' : 'tc-organic-bond'} />)}</>;
}

function Atom({ x, y, children, hetero = false, group = false }: { x: number; y: number; children: React.ReactNode; hetero?: boolean; group?: boolean }) {
  return <g>{group && <circle cx={x} cy={y - 4} r="18" className="tc-organic-highlight" />}<text x={x} y={y} textAnchor="middle" className={hetero ? 'tc-organic-atom tc-organic-atom--hetero' : 'tc-organic-atom'}>{children}</text></g>;
}

function FunctionalGroup({ label }: { label: string }) {
  if (label === 'Aldeído ou cetona') return <svg viewBox="0 0 220 104" role="img" aria-label="Carbonila terminal de aldeído comparada à carbonila interna de cetona" data-structure="carbonyl-position">
    <text x="8" y="23" className="tc-organic-mini-label">terminal</text><Atom x={55} y={55}>R</Atom><Bond x1={72} y1={49} x2={100} y2={49}/><Atom x={112} y={55}>C</Atom><Bond x1={112} y1={41} x2={112} y2={15} order={2} accent/><Atom x={112} y={12} hetero>O</Atom><Bond x1={126} y1={49} x2={152} y2={49}/><Atom x={165} y={55}>H</Atom>
    <text x="8" y="91" className="tc-organic-mini-label">interna</text><Atom x={72} y={91}>R</Atom><Bond x1={86} y1={85} x2={104} y2={85}/><Atom x={116} y={91}>C</Atom><Bond x1={116} y1={77} x2={116} y2={57} order={2} accent/><Atom x={116} y={54} hetero>O</Atom><Bond x1={130} y1={85} x2={150} y2={85}/><Atom x={166} y={91}>R′</Atom>
  </svg>;
  return <svg viewBox="0 0 220 94" role="img" aria-label={`Estrutura característica de ${label}`} data-structure={label}>
    {label === 'Álcool' && <><Atom x={34} y={53}>CH₃</Atom><Bond x1={58} y1={47} x2={88} y2={47}/><Atom x={108} y={53}>CH₂</Atom><Bond x1={132} y1={47} x2={157} y2={47} accent/><Atom x={170} y={53} hetero group>O</Atom><Bond x1={180} y1={47} x2={197} y2={47} accent/><Atom x={209} y={53} hetero>H</Atom></>}
    {label === 'Aldeído' && <><Atom x={42} y={55}>CH₃</Atom><Bond x1={67} y1={49} x2={104} y2={49}/><Atom x={118} y={55}>C</Atom><Bond x1={118} y1={41} x2={118} y2={14} order={2} accent/><Atom x={118} y={12} hetero group>O</Atom><Bond x1={132} y1={49} x2={166} y2={49} accent/><Atom x={181} y={55}>H</Atom></>}
    {label === 'Cetona' && <><Atom x={34} y={55}>CH₃</Atom><Bond x1={59} y1={49} x2={92} y2={49}/><Atom x={106} y={55}>C</Atom><Bond x1={106} y1={41} x2={106} y2={14} order={2} accent/><Atom x={106} y={12} hetero group>O</Atom><Bond x1={120} y1={49} x2={151} y2={49}/><Atom x={178} y={55}>CH₃</Atom></>}
    {label === 'Ácido carboxílico' && <><Atom x={33} y={55}>CH₃</Atom><Bond x1={58} y1={49} x2={91} y2={49}/><Atom x={105} y={55}>C</Atom><Bond x1={105} y1={41} x2={105} y2={14} order={2} accent/><Atom x={105} y={12} hetero group>O</Atom><Bond x1={119} y1={49} x2={149} y2={49} accent/><Atom x={162} y={55} hetero group>O</Atom><Bond x1={173} y1={49} x2={194} y2={49} accent/><Atom x={207} y={55} hetero>H</Atom></>}
    {label === 'Éter' && <><Atom x={42} y={55}>CH₃</Atom><Bond x1={68} y1={49} x2={96} y2={49} accent/><Atom x={110} y={55} hetero group>O</Atom><Bond x1={123} y1={49} x2={151} y2={49} accent/><Atom x={178} y={55}>CH₃</Atom></>}
    {label === 'Amina' && <><Atom x={44} y={55}>CH₃</Atom><Bond x1={70} y1={49} x2={101} y2={49} accent/><Atom x={116} y={55} hetero group>N</Atom><Bond x1={125} y1={42} x2={147} y2={20} accent/><Atom x={158} y={20}>H</Atom><Bond x1={127} y1={55} x2={151} y2={72} accent/><Atom x={163} y={79}>H</Atom></>}
    {label === 'Amida' && <><Atom x={28} y={55}>R</Atom><Bond x1={42} y1={49} x2={76} y2={49}/><Atom x={90} y={55}>C</Atom><Bond x1={90} y1={41} x2={90} y2={14} order={2} accent/><Atom x={90} y={12} hetero group>O</Atom><Bond x1={104} y1={49} x2={135} y2={49} accent/><Atom x={150} y={55} hetero group>N</Atom><text x="180" y="55" className="tc-organic-atom">H₂</text></>}
    {label === 'Nitrila' && <><Atom x={46} y={55}>CH₃</Atom><Bond x1={72} y1={49} x2={108} y2={49}/><Atom x={121} y={55}>C</Atom><Bond x1={134} y1={49} x2={170} y2={49} order={3} accent/><Atom x={186} y={55} hetero group>N</Atom></>}
  </svg>;
}

function IsomerDiagram({ label }: { label: string }) {
  if (label === 'Plana') return <svg viewBox="0 0 220 110" role="img" aria-label="Butano de quatro carbonos e 2-metilpropano de quatro carbonos: mesma fórmula C4H10, conectividades distintas" data-structure="constitutional-isomers"><polyline points="18,35 52,16 86,35 120,16" className="tc-organic-skeleton"/><polyline points="18,82 52,63 86,82" className="tc-organic-skeleton"/><line x1="52" y1="63" x2="52" y2="98" className="tc-organic-bond"/><text x="135" y="29" className="tc-organic-mini-label">butano · 4 C</text><text x="103" y="76" className="tc-organic-mini-label">2-metilpropano · 4 C</text><text x="130" y="99" className="tc-organic-formula-note">ambos C₄H₁₀</text></svg>;
  if (label === 'Geométrica') return <svg viewBox="0 0 220 110" role="img" aria-label="cis e trans but-2-eno: grupos CH3 no mesmo lado ou em lados opostos da ligação dupla" data-structure="cis-trans"><Bond x1={36} y1={52} x2={76} y2={52} order={2}/><Bond x1={139} y1={52} x2={179} y2={52} order={2}/><path d="M36 49 20 23M76 49 92 23M36 55 20 78M76 55 92 78M139 49 123 23M179 55 195 78M139 55 123 78M179 49 195 23" className="tc-organic-bond"/><text x="2" y="19" className="tc-organic-mini-label">CH₃</text><text x="83" y="19" className="tc-organic-mini-label">CH₃</text><text x="2" y="91" className="tc-organic-mini-label">H</text><text x="92" y="91" className="tc-organic-mini-label">H</text><text x="108" y="19" className="tc-organic-mini-label">CH₃</text><text x="190" y="19" className="tc-organic-mini-label">H</text><text x="119" y="91" className="tc-organic-mini-label">H</text><text x="185" y="91" className="tc-organic-mini-label">CH₃</text><text x="49" y="108" className="tc-organic-formula-note">cis</text><text x="151" y="108" className="tc-organic-formula-note">trans</text></svg>;
  return <svg viewBox="0 0 220 100" role="img" aria-label="Par de enantiômeros em imagem especular" data-structure="enantiomers"><line x1="110" y1="8" x2="110" y2="94" className="tc-organic-mirror"/><g transform="translate(55 52)"><circle r="10" className="tc-organic-center"/><line x1="-8" y1="-8" x2="-31" y2="-29" className="tc-organic-bond"/><line x1="8" y1="-8" x2="31" y2="-29" className="tc-organic-bond"/><path d="M-7 8L-28 31L2 15Z" className="tc-organic-wedge"/><text x="0" y="5" textAnchor="middle" className="tc-organic-atom">C*</text></g><g transform="translate(165 52) scale(-1 1)"><circle r="10" className="tc-organic-center"/><line x1="-8" y1="-8" x2="-31" y2="-29" className="tc-organic-bond"/><line x1="8" y1="-8" x2="31" y2="-29" className="tc-organic-bond"/><path d="M-7 8L-28 31L2 15Z" className="tc-organic-wedge"/></g><text x="165" y="57" textAnchor="middle" className="tc-organic-atom">C*</text></svg>;
}

function ReactionDiagram({ label }: { label: string }) {
  const aromatic = label.startsWith('Eletrofílica');
  if (aromatic) return <svg viewBox="0 0 220 100" role="img" aria-label="Substituição eletrofílica no anel aromático" data-structure="electrophilic-substitution"><polygon points="42,20 72,37 72,70 42,87 12,70 12,37" className="tc-organic-ring"/><circle cx="42" cy="53" r="19" className="tc-organic-ring"/><text x="91" y="58" className="tc-organic-arrow">+ Br₂ →</text><polygon points="184,20 214,37 214,70 184,87 154,70 154,37" className="tc-organic-ring"/><text x="184" y="14" textAnchor="middle" className="tc-organic-atom tc-organic-atom--hetero">Br</text></svg>;
  if (label.startsWith('Radicalar')) return <svg viewBox="0 0 220 100" role="img" aria-label="Cloração radicalar do metano ativada por luz" data-structure="radical-substitution"><text x="8" y="58" className="tc-organic-formula">CH₄ + Cl₂</text><text x="101" y="42" className="tc-organic-condition">hν</text><text x="94" y="60" className="tc-organic-arrow">⟶</text><text x="132" y="58" className="tc-organic-formula">CH₃Cl + HCl</text></svg>;
  if (label.startsWith('Nucleofílica')) return <svg viewBox="0 0 220 100" role="img" aria-label="Hidróxido substituindo bromo em um haleto orgânico" data-structure="nucleophilic-substitution"><text x="7" y="57" className="tc-organic-formula">R–Br + OH⁻</text><text x="101" y="58" className="tc-organic-arrow">⟶</text><text x="133" y="57" className="tc-organic-formula">R–OH + Br⁻</text></svg>;
  if (label === 'Adição') return <svg viewBox="0 0 220 100" role="img" aria-label="Ligação dupla convertida em ligação simples por adição" data-structure="addition"><text x="8" y="25" className="tc-organic-mini-label">antes</text><Atom x={55} y={59}>C</Atom><Bond x1={68} y1={53} x2={101} y2={53} order={2}/><Atom x={114} y={59}>C</Atom><text x="136" y="59" className="tc-organic-arrow">⟶</text><Atom x={169} y={59}>C</Atom><Bond x1={181} y1={53} x2={199} y2={53}/><Atom x={211} y={59}>C</Atom><text x="169" y="88" className="tc-organic-atom tc-organic-atom--hetero">H</text><text x="211" y="88" className="tc-organic-atom tc-organic-atom--hetero">Br</text></svg>;
  if (label === 'Eliminação') return <svg viewBox="0 0 220 100" role="img" aria-label="Eliminação formando ligação dupla" data-structure="elimination"><Atom x={32} y={55}>C</Atom><Bond x1={44} y1={49} x2={72} y2={49}/><Atom x={85} y={55}>C</Atom><text x="32" y="85" className="tc-organic-atom tc-organic-atom--hetero">H</text><text x="85" y="85" className="tc-organic-atom tc-organic-atom--hetero">X</text><text x="105" y="55" className="tc-organic-arrow">⟶</text><Atom x={151} y={55}>C</Atom><Bond x1={164} y1={49} x2={196} y2={49} order={2}/><Atom x={209} y={55}>C</Atom></svg>;
  return <svg viewBox="0 0 220 100" role="img" aria-label="Troca de halogênio por hidroxila sem mudar a saturação" data-structure="substitution"><text x="8" y="57" className="tc-organic-formula">R–X + OH⁻</text><text x="100" y="58" className="tc-organic-arrow">⟶</text><text x="135" y="57" className="tc-organic-formula">R–OH + X⁻</text></svg>;
}

function AlcoholDiagram({ label }: { label: string }) {
  if (label === 'Primário') return <svg viewBox="0 0 240 100" role="img" aria-label="Álcool primário oxidando a aldeído e depois a ácido" data-structure="primary-alcohol"><text x="5" y="56" className="tc-organic-formula">R–CH₂OH</text><text x="75" y="56" className="tc-organic-arrow">⟶</text><text x="104" y="56" className="tc-organic-formula">R–CHO</text><text x="155" y="56" className="tc-organic-arrow">⟶</text><text x="184" y="56" className="tc-organic-formula">R–COOH</text><text x="86" y="32" className="tc-organic-condition">[O]</text><text x="166" y="32" className="tc-organic-condition">[O]</text></svg>;
  if (label === 'Secundário') return <svg viewBox="0 0 240 100" role="img" aria-label="Álcool secundário oxidando a cetona" data-structure="secondary-alcohol"><text x="18" y="57" className="tc-organic-formula">R–CH(OH)–R′</text><text x="112" y="57" className="tc-organic-arrow">⟶</text><text x="155" y="57" className="tc-organic-formula">R–CO–R′</text><text x="126" y="32" className="tc-organic-condition">[O]</text></svg>;
  return <svg viewBox="0 0 240 100" role="img" aria-label="Álcool terciário sem oxidação convencional" data-structure="tertiary-alcohol"><text x="18" y="57" className="tc-organic-formula">R₃C–OH</text><text x="92" y="57" className="tc-organic-arrow">⟶</text><line x1="137" y1="31" x2="188" y2="78" className="tc-organic-no-reaction"/><line x1="188" y1="31" x2="137" y2="78" className="tc-organic-no-reaction"/><text x="199" y="57" className="tc-organic-mini-label">sem H no C–OH</text></svg>;
}

function Structure({ chapterId, label }: { chapterId: string; label: string }) {
  if (ORGANIC_CHAPTERS.functions.has(chapterId)) return <FunctionalGroup label={label} />;
  if (chapterId === ORGANIC_CHAPTERS.isomerism) return <IsomerDiagram label={label} />;
  if (chapterId === ORGANIC_CHAPTERS.alcohols) return <AlcoholDiagram label={label} />;
  return <ReactionDiagram label={label} />;
}

export function QuimicaOrganica({ entry }: { entry: SceneEntry }) {
  const [focus, setFocus] = useState(0);
  const transition = useSceneMotion();
  const item = entry.items[focus];
  const functionChapter = ORGANIC_CHAPTERS.functions.has(entry.chapterId);

  return <section className="tc-scene tc-organic-scene" aria-label={entry.question}>
    <header><small>CRIVO · estrutura orgânica</small><h4>{entry.question}</h4></header>
    <div className="tc-organic-legend" aria-label="Legenda do desenho">
      <span><i className="tc-organic-swatch tc-organic-swatch--hetero" /> O/N e grupo funcional</span>
      <span><i className="tc-organic-swatch tc-organic-swatch--bond" /> ligações que definem a função</span>
    </div>
    <div className={`tc-chem-grid tc-organic-grid${entry.items.length > 6 ? ' tc-organic-grid--dense' : ''}`}>
      {entry.items.map((candidate, index) => <motion.button key={candidate.label} type="button" className="tc-chem-card tc-organic-card" aria-pressed={focus === index} onClick={() => setFocus(index)} animate={{ opacity: focus === index ? 1 : 0.7, scale: focus === index ? 1.012 : 1 }} transition={transition}>
        <span className="tc-chem-visual"><Structure chapterId={entry.chapterId} label={candidate.label} /></span>
        <span className="tc-organic-card-copy"><strong>{candidate.label}</strong><span>{candidate.claim}</span></span>
      </motion.button>)}
    </div>
    <aside className="tc-organic-detail" role="status">
      <div><small>{functionChapter ? 'Como reconhecer' : 'O que observar'}</small><strong>{item.label}</strong><p>{CUES[item.label] ?? item.claim}</p></div>
      <blockquote>“{item.quote}” <cite>{item.section}</cite></blockquote>
    </aside>
  </section>;
}
