import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import type { SceneEntry } from '../types';
import '../TopicScene.css';

export function MovimentoDialetico({ entry }: { entry: SceneEntry }) {
  const [completo, setCompleto] = useState(false);
  const transition = useSceneMotion();
  const [um, dois, tres] = entry.items;
  return (
    <section className="tc-scene" aria-label={entry.question}>
      <header><small>CRIVO · movimento dialético</small><h4>{entry.question}</h4></header>
      <svg viewBox="0 0 480 210" role="img" aria-label={completo ? `${tres.label}: o movimento se completou` : `${um.label} e ${dois.label} em oposição`}>
        <motion.g animate={{ x: completo ? 244 : 0, y: completo ? 62 : 0 }} transition={transition}><circle cx="126" cy="72" r="46" className="tc-momento tc-momento-um" /><text x="126" y="77" textAnchor="middle" className="tc-label">{um.label}</text></motion.g>
        <motion.g animate={{ x: completo ? -244 : 0, y: completo ? -62 : 0 }} transition={transition}><circle cx="354" cy="134" r="46" className="tc-momento tc-momento-dois" /><text x="354" y="139" textAnchor="middle" className="tc-label">{dois.label}</text></motion.g>
        <motion.path d="M172 72Q240 30 308 72Q240 176 172 72" animate={{ pathLength: completo ? 1 : 0, opacity: completo ? 1 : 0 }} transition={transition} className="tc-ciclo" />
        <motion.text x="240" y="200" textAnchor="middle" className="tc-caption" animate={{ opacity: completo ? 1 : 0 }} transition={transition}>{tres.label}</motion.text>
      </svg>
      <div className="tc-choices"><button type="button" onClick={() => setCompleto(!completo)}>{completo ? 'Voltar ao início' : 'Completar o movimento'}</button></div>
      {completo && <><p className="tc-observation" role="status"><strong>{tres.label}:</strong> {tres.claim}</p><blockquote className="tc-quote">“{tres.quote}” <cite>{tres.section}</cite></blockquote></>}
    </section>
  );
}
