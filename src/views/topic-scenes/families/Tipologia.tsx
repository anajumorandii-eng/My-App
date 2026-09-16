import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import type { SceneEntry } from '../types';
import '../TopicScene.css';

/** Tipos ideais paralelos. O movimento destaca o tipo em foco, mas a nota
 *  de honestidade — que casos reais combinam mais de um tipo — fica
 *  sempre visível, nunca escondida atrás de um clique. */
export function Tipologia({ entry }: { entry: SceneEntry }) {
  const [foco, setFoco] = useState<number | null>(null);
  const transition = useSceneMotion();
  const item = foco === null ? null : entry.items[foco];
  const n = entry.items.length;

  return (
    <section className="tc-scene" aria-label={entry.question}>
      <header>
        <small>CRIVO · tipos ideais</small>
        <h4>{entry.question}</h4>
      </header>
      <svg viewBox="0 0 480 160" role="img" aria-label={item ? `Tipo em foco: ${item.label}` : 'Nenhum tipo em foco'}>
        {entry.items.map((it, i) => {
          const x = 40 + ((i + 0.5) * 400) / n;
          const emFoco = foco === i;
          return (
            <motion.g key={it.label} animate={{ opacity: foco === null || emFoco ? 1 : 0.32 }} transition={transition}>
              <motion.circle cx={x} cy="82" animate={{ r: emFoco ? 44 : 34 }} transition={transition} className={emFoco ? 'tc-tipo tc-tipo-foco' : 'tc-tipo'} />
              <text x={x} y="140" textAnchor="middle" className="tc-label">{it.label}</text>
            </motion.g>
          );
        })}
      </svg>
      <div className="tc-choices">
        {entry.items.map((it, i) => (
          <button
            key={it.label}
            type="button"
            aria-pressed={foco === i}
            onClick={() => setFoco(foco === i ? null : i)}
          >
            {it.label}
          </button>
        ))}
      </div>
      {entry.nota && <p className="tc-nota">{entry.nota}</p>}
      {item && (
        <>
          <p className="tc-observation" role="status"><strong>{item.label}:</strong> {item.claim}</p>
          <blockquote className="tc-quote">“{item.quote}” <cite>{item.section}</cite></blockquote>
        </>
      )}
    </section>
  );
}
