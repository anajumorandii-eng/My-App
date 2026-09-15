import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import type { SceneEntry } from '../types';
import '../TopicScene.css';

/** A primeira camada é a base; o gesto mostra até onde seu condicionamento
 * alcança sem sugerir uma causalidade mecânica ou sem retorno. */
export function CamadasDeDeterminacao({ entry }: { entry: SceneEntry }) {
  const [camada, setCamada] = useState<number | null>(null);
  const transition = useSceneMotion();
  const [base, ...superiores] = entry.items;
  const item = camada === null ? null : superiores[camada];
  const yDe = (i: number) => 116 - i * 40;

  return (
    <section className="tc-scene" aria-label={entry.question}>
      <header><small>CRIVO · camadas de determinação</small><h4>{entry.question}</h4></header>
      <svg viewBox="0 0 480 196" role="img" aria-label={`${base.label} determina ${item ? item.label : 'as camadas acima'}`}>
        <rect x="60" y="146" width="360" height="38" rx="2" className="tc-base-camada" />
        <text x="76" y="170" className="tc-label">{base.label}</text>
        {superiores.map((it, i) => (
          <motion.g key={it.label} animate={{ opacity: camada === null || camada === i ? 1 : 0.3 }} transition={transition}>
            <rect x="60" y={yDe(i)} width="360" height="32" rx="2" className={camada === i ? 'tc-camada tc-camada-foco' : 'tc-camada'} />
            <text x="76" y={yDe(i) + 21} className="tc-label">{it.label}</text>
          </motion.g>
        ))}
        <motion.path d={`M240 146V${camada === null ? 146 : yDe(camada) + 32}`} animate={{ pathLength: camada === null ? 0 : 1, opacity: camada === null ? 0 : 1 }} transition={transition} className="tc-determinacao" />
      </svg>
      <div className="tc-choices">{superiores.map((it, i) => (
        <button key={it.label} type="button" aria-pressed={camada === i} onClick={() => setCamada(camada === i ? null : i)}>{it.label}</button>
      ))}</div>
      {item && <><p className="tc-observation" role="status"><strong>{item.label}:</strong> {item.claim}</p><blockquote className="tc-quote">“{item.quote}” <cite>{item.section}</cite></blockquote></>}
    </section>
  );
}
