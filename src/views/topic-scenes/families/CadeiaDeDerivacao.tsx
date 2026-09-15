import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import type { SceneEntry } from '../types';
import '../TopicScene.css';

/** Passos encadeados. O movimento desenha a seta do elo anterior ao seguinte:
 *  a dependência entre os passos é o conteúdo da cena. */
export function CadeiaDeDerivacao({ entry }: { entry: SceneEntry }) {
  const [elo, setElo] = useState(0);
  const transition = useSceneMotion();
  const n = entry.items.length;
  const item = entry.items[elo];
  const yDe = (i: number) => 30 + i * 42;

  return (
    <section className="tc-scene" aria-label={entry.question}>
      <header>
        <small>CRIVO · cadeia de derivação</small>
        <h4>{entry.question}</h4>
      </header>
      <svg viewBox={`0 0 480 ${yDe(n - 1) + 40}`} role="img" aria-label={`Elo ${elo + 1} de ${n}: ${item.label}`}>
        <defs>
          <marker id="tc-seta-ponta" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10Z" className="tc-seta-ponta" />
          </marker>
        </defs>
        {entry.items.map((it, i) => (
          <motion.g key={it.label} animate={{ opacity: i <= elo ? 1 : 0.22 }} transition={transition}>
            <rect x="60" y={yDe(i) - 17} width="360" height="34" rx="2" className={i === elo ? 'tc-elo tc-elo-foco' : 'tc-elo'} />
            <text x="76" y={yDe(i) + 5} className="tc-label">{it.label}</text>
          </motion.g>
        ))}
        {entry.items.slice(1).map((it, i) => (
          <motion.path
            key={`seta-${it.label}`}
            d={`M240 ${yDe(i) + 17}V${yDe(i + 1) - 17}`}
            animate={{ pathLength: i < elo ? 1 : 0, opacity: i < elo ? 1 : 0 }}
            transition={transition}
            className="tc-seta"
          />
        ))}
      </svg>
      <p className="tc-progress">elo {elo + 1} de {n}</p>
      <div className="tc-choices">
        {elo < n - 1
          ? <button type="button" onClick={() => setElo(elo + 1)}>Próximo elo</button>
          : <button type="button" onClick={() => setElo(0)}>Recomeçar a cadeia</button>}
        {elo > 0 && <button type="button" onClick={() => setElo(elo - 1)}>Elo anterior</button>}
      </div>
      <p className="tc-observation" role="status"><strong>{item.label}:</strong> {item.claim}</p>
      <blockquote className="tc-quote">“{item.quote}” <cite>{item.section}</cite></blockquote>
    </section>
  );
}
