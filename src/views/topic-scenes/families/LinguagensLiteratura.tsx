import React, { useState } from 'react';
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

function Landscape({ active, chapterId }: { active: number; chapterId: string }) {
  const contemporary = chapterId.includes('contemporanea');
  return <svg viewBox="0 0 580 190" role="img" aria-label={contemporary ? 'Poema contemporâneo entre voz, rede e publicação' : 'Paisagem social e forma literária'} data-literature-artifact={contemporary ? 'contemporary-literature' : 'social-landscape'}>
    <path d="M25 150C90 87 144 113 205 150s123 48 182-6 112-31 167 6" fill="none" stroke="var(--vs-ink)" strokeWidth="4"/>
    {contemporary ? <><rect x="40" y="45" width="116" height="80" rx="13" style={paper} stroke="var(--vs-ink)" strokeWidth="3"/><path d="M82 105v-37m-19 37h38" stroke="var(--vs-burgundy)" strokeWidth="5"/><circle cx="82" cy="56" r="9" fill="var(--vs-burgundy)"/><rect x="232" y="32" width="100" height="122" rx="15" style={paper} stroke="var(--vs-burgundy)" strokeWidth="4"/><path d="M250 58h63M250 79h45M250 100h56M250 121h34" stroke="var(--vs-ink-muted)" strokeWidth="4"/><path d="M390 123c36-59 83-59 122 0" fill="none" stroke="var(--vs-burgundy)" strokeWidth="5"/><circle cx="450" cy="77" r="22" fill="color-mix(in srgb,var(--vs-burgundy) 20%,var(--vs-paper))" stroke="var(--vs-ink)" strokeWidth="3"/></> : <><path d="M62 135l52-84 57 84" fill="color-mix(in srgb,var(--vs-burgundy) 18%,var(--vs-paper))" stroke="var(--vs-ink)" strokeWidth="3"/><path d="M215 136h125" stroke="var(--vs-ink-muted)" strokeWidth="3"/><path d="M242 136V68h55v68" style={paper} stroke="var(--vs-ink)" strokeWidth="3"/><path d="M390 122h132" stroke="var(--vs-burgundy)" strokeWidth="5"/><path d="M406 122V88m26 34V71m26 51V92m26 30V59" stroke="var(--vs-ink)" strokeWidth="4"/></>}<circle cx={[82,282,460][active % 3]} cy="164" r="9" fill="var(--vs-burgundy)"/><Label x={290} y={181} accent>{contemporary ? 'voz · circulação · forma' : 'paisagem · conflito · linguagem'}</Label>
  </svg>;
}

function Art({ entry, active }: { entry: SceneEntry; active: number }) {
  if (entry.chapterId.includes('romantica-prosa')) return <RomanticProse active={active}/>;
  if (entry.chapterId.includes('fernando-pessoa')) return <Pessoa active={active}/>;
  if (entry.chapterId.includes('trovadorismo')) return <Trovadorismo active={active}/>;
  if (entry.chapterId.includes('vanguardas')) return <Vanguardas active={active}/>;
  return <Landscape active={active} chapterId={entry.chapterId}/>;
}

export function LinguagensLiteratura({ entry }: { entry: SceneEntry }) {
  const [active, setActive] = useState(0);
  const item = entry.items[active];
  return <section className="tc-scene" aria-label={entry.question} data-literature-board="detailed">
    <header><small>CRIVO · oficina de leitura literária</small><h4>{entry.question}</h4></header>
    <div style={{ border: '1px solid var(--vs-ink-muted)', borderRadius: 18, padding: '8px 6px', background: 'color-mix(in srgb,var(--vs-paper) 86%, transparent)' }}><Art entry={entry} active={active}/></div>
    <div className="tc-type-grid" style={{ marginTop: 14 }}>{entry.items.map((candidate, index) => <button key={candidate.label} type="button" className="tc-type-card" aria-pressed={active === index} onClick={() => setActive(index)} style={{ borderColor: active === index ? 'var(--vs-burgundy)' : undefined }}><span className="tc-type-number">{String(index + 1).padStart(2, '0')}</span><strong>{candidate.label}</strong><span className="tc-type-claim">{candidate.claim}</span></button>)}</div>
    {entry.nota && <p className="tc-nota">{entry.nota}</p>}
    <aside className="tc-organic-detail" role="status"><div><small>lente de leitura</small><strong>{item.label}</strong><p>{item.claim}</p></div><blockquote>“{item.quote}” <cite>{item.section}</cite></blockquote></aside>
  </section>;
}
