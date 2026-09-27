import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import type { SceneEntry } from '../types';
import '../TopicScene.css';

/** Literatura pede artefatos de leitura: voz, página, palco, paisagem e montagem.
 * Não reaproveitamos a grade de "tipos" porque ela apaga o procedimento estético
 * que distingue cada capítulo. */
export const LINGUAGENS_LITERATURA_SCENE_IDS = new Set([
  'summary-literatura-segunda-geracao-modernista-prosa',
  'summary-literatura-a-estetica-romantica-prosa',
  'summary-literatura-fernando-pessoa',
  'summary-literatura-trovadorismo-e-humanismo',
  'summary-literatura-vanguardas-artisticas',
  'summary-literatura-poesia-brasileira-contemporanea',
  'summary-literatura-poesia-brasileira-1960-1980',
  'summary-literatura-prosa-brasileira-contemporanea',
]);

const paper = { fill: 'var(--vs-paper)' } as const;
const ink = { fill: 'var(--vs-ink)' } as const;
const muted = { fill: 'var(--vs-ink-muted)' } as const;
const wine = { fill: 'var(--vs-burgundy)' } as const;

function Label({ x, y, children, accent = false }: { x: number; y: number; children: React.ReactNode; accent?: boolean }) {
  return <text x={x} y={y} textAnchor="middle" style={{ ...(accent ? wine : ink), fontSize: 13, fontWeight: 800 }}>{children}</text>;
}

function RomanticProse({ active }: { active: number }) {
  const panels = [
    { title: 'cidade', x: 18, scene: <><rect x="8" y="73" width="112" height="38" style={paper}/><path d="M14 73V42h24v31M45 73V27h29v46M80 73V48h31v25" fill="none" stroke="var(--vs-ink)" strokeWidth="3"/><circle cx="100" cy="39" r="7" fill="var(--vs-burgundy)"/></> },
    { title: 'origem', x: 160, scene: <><path d="M13 102 43 50l22 19 24-38 28 71Z" fill="color-mix(in srgb,var(--vs-burgundy) 20%,var(--vs-paper))" stroke="var(--vs-ink)" strokeWidth="3"/><path d="M48 89c9-23 24-24 36 0" fill="none" stroke="var(--vs-burgundy)" strokeWidth="4"/><circle cx="67" cy="75" r="5" style={paper} stroke="var(--vs-ink)" strokeWidth="2"/></> },
    { title: 'interior', x: 302, scene: <><path d="M8 104C33 72 51 75 75 104s43 27 57 0" fill="none" stroke="var(--vs-ink)" strokeWidth="3"/><path d="M17 102 25 71M38 96l9-41M96 100l-7-32" stroke="var(--vs-burgundy)" strokeWidth="3"/><path d="M8 104H132" stroke="var(--vs-ink)" strokeWidth="3"/></> },
    { title: 'passado', x: 444, scene: <><rect x="24" y="35" width="78" height="70" rx="3" style={paper} stroke="var(--vs-ink)" strokeWidth="3"/><path d="M38 56h49M38 71h43M38 86h38" stroke="var(--vs-ink-muted)" strokeWidth="3"/><path d="M71 36v69" stroke="var(--vs-burgundy)" strokeWidth="4"/></> },
  ];
  return <svg viewBox="0 0 580 158" role="img" aria-label="Quatro projetos narrativos do romance romântico" data-literature-artifact="romantic-prose">{panels.map((p, i) => <g key={p.title} transform={`translate(${p.x} 20)`} opacity={active === i ? 1 : .46}><rect width="132" height="126" rx="14" fill={active === i ? 'color-mix(in srgb,var(--vs-burgundy) 13%,var(--vs-paper))' : 'var(--vs-paper)'} stroke={active === i ? 'var(--vs-burgundy)' : 'var(--vs-ink-muted)'} strokeWidth={active === i ? 4 : 2}/>{p.scene}<Label x={66} y={122} accent={active === i}>{p.title}</Label></g>)}</svg>;
}

function Pessoa({ active }: { active: number }) {
  const faces = [{ name: 'CAEIRO', x: 110, path: 'M70 112c8-51 65-51 80 0v35H70Z', cue: 'olhar' }, { name: 'REIS', x: 290, path: 'M250 112c8-51 65-51 80 0v35h-80Z', cue: 'medida' }, { name: 'CAMPOS', x: 470, path: 'M430 112c8-51 65-51 80 0v35h-80Z', cue: 'máquina' }];
  return <svg viewBox="0 0 580 210" role="img" aria-label="Três heterônimos com poéticas e concepções de mundo próprias" data-literature-artifact="heteronyms"><path d="M38 178H542" stroke="var(--vs-ink-muted)" strokeWidth="2" strokeDasharray="5 6"/>{faces.map((face, index) => <g key={face.name} opacity={active === index ? 1 : .48}><circle cx={face.x} cy="76" r="38" fill="var(--vs-paper)" stroke={active === index ? 'var(--vs-burgundy)' : 'var(--vs-ink)'} strokeWidth={active === index ? 5 : 3}/><path d={face.path} fill="color-mix(in srgb,var(--vs-burgundy) 16%,var(--vs-paper))" stroke="var(--vs-ink)" strokeWidth="3"/>{index === 0 && <><path d="M70 181c20-28 49-28 80 0" fill="none" stroke="var(--vs-burgundy)" strokeWidth="4"/><path d="M86 174v-18m19 18v-25m19 25v-18" stroke="var(--vs-ink-muted)" strokeWidth="3"/></>}{index === 1 && <><path d="M258 178h64M270 167h40" stroke="var(--vs-burgundy)" strokeWidth="4"/><path d="M290 151v29" stroke="var(--vs-ink-muted)" strokeWidth="3"/></>}{index === 2 && <><path d="M430 178h80" stroke="var(--vs-burgundy)" strokeWidth="4"/><path d="M442 168h14v10h-14zm25-17h14v27h-14zm25-28h14v55h-14z" fill="var(--vs-ink-muted)"/></>}<Label x={face.x} y={132} accent={active === index}>{face.name}</Label><text x={face.x} y="153" textAnchor="middle" style={{ ...muted, fontSize: 12 }}>{face.cue}</text></g>)}</svg>;
}

function Trovadorismo({ active }: { active: number }) {
  const items = [{ name: 'amor', male: true, direct: false }, { name: 'amigo', male: false, direct: false }, { name: 'escárnio', male: true, direct: false }, { name: 'maldizer', male: true, direct: true }];
  return <svg viewBox="0 0 580 185" role="img" aria-label="Voz e alvo organizam as cantigas medievais" data-literature-artifact="cantigas"><path d="M52 40H528M290 21v145" stroke="var(--vs-ink-muted)" strokeWidth="2" strokeDasharray="5 5"/><Label x={170} y={26}>líricas</Label><Label x={410} y={26}>satíricas</Label>{items.map((item, i) => { const x = 62 + i * 128; return <g key={item.name} opacity={active === i ? 1 : .44}><rect x={x} y="52" width="106" height="104" rx="13" fill="var(--vs-paper)" stroke={active === i ? 'var(--vs-burgundy)' : 'var(--vs-ink-muted)'} strokeWidth={active === i ? 4 : 2}/><circle cx={x + 53} cy="86" r="19" fill="color-mix(in srgb,var(--vs-burgundy) 18%,var(--vs-paper))" stroke="var(--vs-ink)" strokeWidth="2"/><path d={item.direct ? `M${x + 25} 122H${x + 81}` : `M${x + 25} 122Q${x + 53} 101 ${x + 81} 122`} fill="none" stroke="var(--vs-burgundy)" strokeWidth="4"/>{item.male ? <text x={x + 53} y="91" textAnchor="middle" style={ink}>♂</text> : <text x={x + 53} y="91" textAnchor="middle" style={ink}>♀</text>}<Label x={x + 53} y={143} accent={active === i}>{item.name}</Label></g>; })}</svg>;
}

function Vanguardas({ active }: { active: number }) {
  const labels = ['FUT', 'CUB', 'EXP', 'DAD', 'SUR'];
  return <svg viewBox="0 0 580 190" role="img" aria-label="Cinco procedimentos visuais das vanguardas europeias" data-literature-artifact="avant-garde">{labels.map((name, i) => { const x = 24 + i * 108; return <g key={name} opacity={active === i ? 1 : .42}><rect x={x} y="24" width="92" height="128" rx="12" fill="var(--vs-paper)" stroke={active === i ? 'var(--vs-burgundy)' : 'var(--vs-ink-muted)'} strokeWidth={active === i ? 4 : 2}/>{i === 0 && <><path d={`M${x+18} 108h52l-17-32h20l-36-38`} fill="none" stroke="var(--vs-burgundy)" strokeWidth="5"/><path d={`M${x+16} 123h59`} stroke="var(--vs-ink)" strokeWidth="3"/></>}{i === 1 && <><path d={`M${x+18} 48l42-12 17 35-33 17-26-18z`} fill="color-mix(in srgb,var(--vs-burgundy) 26%,var(--vs-paper))" stroke="var(--vs-ink)" strokeWidth="3"/><path d={`M${x+18} 110l58-23M${x+44} 39v49`} stroke="var(--vs-burgundy)" strokeWidth="3"/></>}{i === 2 && <><path d={`M${x+26} 112c-12-39 15-69 42-63 22 4 17 32 1 39 22 11 5 41-13 31-13 13-26 4-30-7Z`} fill="color-mix(in srgb,var(--vs-burgundy) 35%,var(--vs-paper))" stroke="var(--vs-ink)" strokeWidth="3"/><circle cx={x+47} cy="76" r="4" style={paper}/></>}{i === 3 && <><path d={`M${x+20} 48l55 67M${x+75} 48l-55 67`} stroke="var(--vs-burgundy)" strokeWidth="6"/><text x={x+47} y="91" textAnchor="middle" style={{...ink,fontSize:27}}>?</text></>}{i === 4 && <><path d={`M${x+18} 93c21-45 40 26 58-29`} fill="none" stroke="var(--vs-burgundy)" strokeWidth="5"/><circle cx={x+68} cy="55" r="16" fill="color-mix(in srgb,var(--vs-burgundy) 26%,var(--vs-paper))" stroke="var(--vs-ink)" strokeWidth="2"/></>}<Label x={x+46} y={138} accent={active===i}>{name}</Label></g>; })}</svg>;
}

// A antiga `Landscape` servia quatro capítulos com dois desenhos: montanha,
// porta e cerca para o Romance de 30 *e* para a poesia de 1960-1980;
// megafone e folha para a poesia *e* para a prosa contemporâneas. O
// empréstimo que a régua proíbe (auditoria 35). Cada capítulo tem agora a
// própria cena, tirada dos seus itens; o quadro aceso é o do item escolhido.
const Painel = ({ x, w, ativo, titulo, children }: { x: number; w: number; ativo: boolean; titulo: string; children: React.ReactNode }) =>
  <motion.g initial={false} animate={{ opacity: ativo ? 1 : 0.4 }}>
    <rect x={x} y="14" width={w} height="150" rx="14" style={paper} stroke={ativo ? 'var(--vs-burgundy)' : 'var(--vs-ink-muted)'} strokeWidth={ativo ? 3.5 : 2} />
    {children}
    <Label x={x + w / 2} y={184} accent={ativo}>{titulo}</Label>
  </motion.g>;
const traco = { fill: 'none', stroke: 'var(--vs-ink)', strokeWidth: 3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
const tracoV = { ...traco, stroke: 'var(--vs-burgundy)' };

function Romance30({ active }: { active: number }) {
  return <svg viewBox="0 0 580 196" role="img" aria-label="O interior como cenário pitoresco ou como condição que determina a vida" data-literature-artifact="romance-de-30">
    <Painel x={20} w={260} ativo={active === 0} titulo="cenário pitoresco">
      {/* Moldura de cartão-postal: o interior visto de fora, para ser admirado. */}
      <rect x="44" y="30" width="212" height="118" rx="4" fill="none" stroke="var(--vs-ink-muted)" strokeWidth="2" strokeDasharray="6 5" />
      <circle cx="210" cy="60" r="16" fill="color-mix(in srgb,var(--vs-burgundy) 25%,var(--vs-paper))" stroke="var(--vs-burgundy)" strokeWidth="2.5" />
      <path d="M60 130c30-30 60-30 90 0s60 30 90 0" {...traco} />
      <path d="M100 130V78M100 78c-18-4-26 4-30 12M100 78c16-8 28-2 32 6M100 78c-6-14 0-20 8-24" {...traco} />
    </Painel>
    <Painel x={300} w={260} ativo={active === 1} titulo="condição que determina a vida">
      <circle cx="510" cy="48" r="18" style={wine} opacity=".8" />
      <path d="M320 132h220" {...traco} />
      {[340, 380, 420, 460, 500].map((x) => <path key={x} d={`M${x} 132l6-10 8 6 6-8`} stroke="var(--vs-ink-muted)" strokeWidth="2" fill="none" />)}
      {[360, 392, 420].map((x, k) => <g key={x}><circle cx={x} cy={88 + k * 2} r="7" {...traco} /><path d={`M${x} ${95 + k * 2}v18l-6 14M${x} ${113 + k * 2}l6 14`} {...traco} /></g>)}
      <path d="M452 132V96h-8M452 104h8" {...traco} />
      <text x={430} y={58} textAnchor="middle" style={{ ...muted, fontSize: 12, fontWeight: 700 }}>fome · exploração</text>
    </Painel>
  </svg>;
}

function Poesia6080({ active }: { active: number }) {
  return <svg viewBox="0 0 580 196" role="img" aria-label="Concretismo e poema-processo, a passagem de Ferreira Gullar e o lirismo do cotidiano de Adélia Prado" data-literature-artifact="poesia-60-80">
    <Painel x={12} w={176} ativo={active === 0} titulo="concretismo · processo">
      {['P', 'O', 'E', 'M', 'A'].map((l, k) => <text key={k} x={40 + k * 26} y={60 + (k % 2) * 30} style={{ ...ink, fontSize: 22, fontWeight: 900 }}>{l}</text>)}
      <path d="M40 120h120M40 132h80" stroke="var(--vs-ink-muted)" strokeWidth="3" strokeDasharray="10 6" />
    </Painel>
    <Painel x={202} w={176} ativo={active === 1} titulo="Gullar: Poema Sujo">
      {/* Do concretismo ao Poema Sujo, escrito no exílio: a grade vira página longa. */}
      {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={220 + c * 14} y={52 + r * 14} width="10" height="10" style={muted} />))}
      <path d="M270 74h20" {...tracoV} /><path d="M284 68l8 6-8 6" {...tracoV} />
      <rect x="300" y="34" width="60" height="112" rx="3" style={paper} stroke="var(--vs-ink)" strokeWidth="2.5" />
      {Array.from({ length: 8 }, (_, k) => <path key={k} d={`M308 ${48 + k * 12}h${44 - (k % 3) * 8}`} stroke="var(--vs-ink-muted)" strokeWidth="2" />)}
    </Painel>
    <Painel x={392} w={176} ativo={active === 2} titulo="Adélia: cotidiano e corpo">
      <path d="M420 70h40v34a16 16 0 0 1-16 16h-8a16 16 0 0 1-16-16Z" {...traco} /><path d="M460 78c12 0 12 20 0 20" {...traco} />
      <path d="M430 60c0-8 6-8 6-16M446 60c0-8 6-8 6-16" stroke="var(--vs-ink-muted)" strokeWidth="2" fill="none" />
      <path d="M520 130c-18-12-24-30-12-36 6-3 12 2 12 2s6-5 12-2c12 6 6 24-12 36Z" style={{ fill: 'color-mix(in srgb,var(--vs-burgundy) 30%,var(--vs-paper))' }} stroke="var(--vs-burgundy)" strokeWidth="2.5" />
    </Painel>
  </svg>;
}

function PoesiaContemporanea({ active }: { active: number }) {
  return <svg viewBox="0 0 580 196" role="img" aria-label="Poesia sem escola dominante, slam e circulação digital" data-literature-artifact="poesia-contemporanea">
    <Painel x={12} w={176} ativo={active === 0} titulo="sem centro">
      {/* Vozes do mesmo tamanho e nenhuma no meio: não há hierarquia. */}
      {[[50, 50], [100, 40], [150, 56], [60, 110], [110, 118], [156, 104]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r="14" fill="none" stroke="var(--vs-ink)" strokeWidth="2.5" />)}
      <circle cx="100" cy="80" r="8" fill="none" stroke="var(--vs-ink-muted)" strokeWidth="2" strokeDasharray="3 3" />
    </Painel>
    <Painel x={202} w={176} ativo={active === 1} titulo="slam: dito em voz alta">
      <rect x="276" y="40" width="28" height="44" rx="14" {...traco} /><path d="M268 70c0 20 44 20 44 0M290 90v20M278 110h24" {...traco} />
      {[230, 350].map((x) => <path key={x} d={`M${x} 60c${x < 290 ? '-10 10 -10 30 0 40' : '10 10 10 30 0 40'}`} {...tracoV} />)}
      {[232, 262, 318, 348].map((x) => <circle key={x} cx={x} cy={140} r="7" style={muted} />)}
    </Painel>
    <Painel x={392} w={176} ativo={active === 2} titulo="sem intermediário">
      <rect x="420" y="34" width="46" height="84" rx="8" {...traco} /><path d="M432 50h22M432 62h22M432 74h14" stroke="var(--vs-ink-muted)" strokeWidth="2" />
      <path d="M470 76h40" {...tracoV} /><path d="M502 68l10 8-10 8" {...tracoV} />
      <rect x="500" y="108" width="50" height="30" rx="4" fill="none" stroke="var(--vs-ink-muted)" strokeWidth="2" strokeDasharray="4 3" />
      <path d="M498 106l54 34" stroke="var(--vs-burgundy)" strokeWidth="2.5" />
      <text x={525} y={154} textAnchor="middle" style={{ ...muted, fontSize: 11, fontWeight: 700 }}>editora</text>
    </Painel>
  </svg>;
}

function ProsaContemporanea({ active }: { active: number }) {
  return <svg viewBox="0 0 580 196" role="img" aria-label="Realismo, autoficção e fragmentação; hibridação com jornalismo e ensaio; linguagens digitais" data-literature-artifact="prosa-contemporanea">
    <Painel x={12} w={176} ativo={active === 0} titulo="fragmento e autoficção">
      {[[36, 36, 50, 34], [96, 44, 56, 28], [44, 82, 40, 40], [98, 84, 62, 36]].map(([x, y, w, h], k) => <rect key={k} x={x} y={y} width={w} height={h} rx="3" style={paper} stroke="var(--vs-ink)" strokeWidth="2.5" transform={`rotate(${[-4, 3, 5, -3][k]} ${x + w / 2} ${y + h / 2})`} />)}
      <text x={100} y={146} textAnchor="middle" style={{ ...wine, fontSize: 14, fontWeight: 900 }}>“eu”</text>
    </Painel>
    <Painel x={202} w={176} ativo={active === 1} titulo="jornalismo + ensaio">
      <rect x="220" y="36" width="70" height="96" rx="3" style={paper} stroke="var(--vs-ink)" strokeWidth="2.5" /><path d="M228 48h54" stroke="var(--vs-ink)" strokeWidth="6" />
      {[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M228 ${64 + k * 12}h24M258 ${64 + k * 12}h24`} stroke="var(--vs-ink-muted)" strokeWidth="2" />)}
      <rect x="290" y="36" width="70" height="96" rx="3" style={{ fill: 'color-mix(in srgb,var(--vs-burgundy) 12%,var(--vs-paper))' }} stroke="var(--vs-burgundy)" strokeWidth="2.5" />
      {[0, 1, 2, 3, 4, 5].map((k) => <path key={k} d={`M298 ${50 + k * 12}h${50 - (k % 2) * 10}`} stroke="var(--vs-ink-muted)" strokeWidth="2" />)}
    </Painel>
    <Painel x={392} w={176} ativo={active === 2} titulo="linguagens digitais">
      <path d="M414 44h70a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8h-50l-12 10V76h-8a8 8 0 0 1-8-8V52a8 8 0 0 1 8-8Z" {...traco} />
      <path d="M548 94h-70a8 8 0 0 0-8 8v16a8 8 0 0 0 8 8h50l12 10v-10h8a8 8 0 0 0 8-8v-16a8 8 0 0 0-8-8Z" {...tracoV} />
      <path d="M428 60h46M490 110h40" stroke="var(--vs-ink-muted)" strokeWidth="2" />
    </Painel>
  </svg>;
}


function Art({ entry, active }: { entry: SceneEntry; active: number }) {
  if (entry.chapterId.includes('romantica-prosa')) return <RomanticProse active={active}/>;
  if (entry.chapterId.includes('fernando-pessoa')) return <Pessoa active={active}/>;
  if (entry.chapterId.includes('trovadorismo')) return <Trovadorismo active={active}/>;
  if (entry.chapterId.includes('vanguardas')) return <Vanguardas active={active}/>;
  if (entry.chapterId.includes('segunda-geracao-modernista-prosa')) return <Romance30 active={active}/>;
  if (entry.chapterId.includes('1960-1980')) return <Poesia6080 active={active}/>;
  if (entry.chapterId.includes('poesia-brasileira-contemporanea')) return <PoesiaContemporanea active={active}/>;
  return <ProsaContemporanea active={active}/>;
}

export function LinguagensLiteratura({ entry }: { entry: SceneEntry }) {
  const [active, setActive] = useState(0);
  const transition = useSceneMotion();
  const item = entry.items[active];
  return <motion.section className="tc-scene" aria-label={entry.question} data-literature-board="detailed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={transition}>
    <header><small>CRIVO · oficina de leitura literária</small><h4>{entry.question}</h4></header>
    <div style={{ border: '1px solid var(--vs-ink-muted)', borderRadius: 18, padding: '8px 6px', background: 'color-mix(in srgb,var(--vs-paper) 86%, transparent)' }}><Art entry={entry} active={active}/></div>
    <div className="tc-type-grid" style={{ marginTop: 14 }}>{entry.items.map((candidate, index) => <button key={candidate.label} type="button" className="tc-type-card" aria-pressed={active === index} onClick={() => setActive(index)} style={{ borderColor: active === index ? 'var(--vs-burgundy)' : undefined }}><span className="tc-type-number">{String(index + 1).padStart(2, '0')}</span><strong>{candidate.label}</strong><span className="tc-type-claim">{candidate.claim}</span></button>)}</div>
    {entry.nota && <p className="tc-nota">{entry.nota}</p>}
    <aside className="tc-organic-detail" role="status"><div><small>lente de leitura</small><strong>{item.label}</strong><p>{item.claim}</p></div><blockquote>“{item.quote}” <cite>{item.section}</cite></blockquote></aside>
  </motion.section>;
}
