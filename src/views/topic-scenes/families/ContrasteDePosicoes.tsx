import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import type { SceneEntry } from '../types';
import '../TopicScene.css';

/** Respostas rivais à mesma pergunta. O movimento mostra o peso migrando de
 *  uma posição para a outra — é a comparação, não uma entrada decorativa. */
export function ContrasteDePosicoes({ entry }: { entry: SceneEntry }) {
  const [escolhida, setEscolhida] = useState<number | null>(null);
  const [trecho, setTrecho] = useState(false);
  const transition = useSceneMotion();
  const item = escolhida === null ? null : entry.items[escolhida];
  const n = entry.items.length;

  return (
    <section className="tc-scene" aria-label={entry.question}>
      <header>
        <small>CRIVO · posições em disputa</small>
        <h4>{entry.question}</h4>
      </header>
      <svg viewBox="0 0 480 190" role="img" aria-label={item ? `Posição em foco: ${item.label}` : 'Nenhuma posição em foco'}>
        <path d="M40 150H440" className="tc-base" />
        {entry.items.map((it, i) => {
          const x = 40 + ((i + 0.5) * 400) / n;
          const emFoco = escolhida === i;
          return (
            <motion.g key={it.label} animate={{ opacity: escolhida === null || emFoco ? 1 : 0.32 }} transition={transition}>
              <motion.rect
                x={x - 62} width="124" rx="3"
                animate={{ y: emFoco ? 46 : 74, height: emFoco ? 104 : 76 }}
                transition={transition}
                className={emFoco ? 'tc-pillar tc-pillar-foco' : 'tc-pillar'}
              />
              <text x={x} y="36" textAnchor="middle" className="tc-label">{it.label}</text>
            </motion.g>
          );
        })}
      </svg>
      <div className="tc-choices">
        {entry.items.map((it, i) => (
          <button
            key={it.label}
            type="button"
            aria-pressed={escolhida === i}
            onClick={() => { setEscolhida(escolhida === i ? null : i); setTrecho(false); }}
          >
            {it.label}
          </button>
        ))}
      </div>
      {item && (
        <>
          <p className="tc-observation" role="status"><strong>{item.label}:</strong> {item.claim}</p>
          <button type="button" className="tc-quote-toggle" aria-expanded={trecho} onClick={() => setTrecho((v) => !v)}>
            Ver o trecho do capítulo
          </button>
          {trecho && <blockquote className="tc-quote">“{item.quote}” <cite>{item.section}</cite></blockquote>}
        </>
      )}
    </section>
  );
}
