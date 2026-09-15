import React, { useId, useState } from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import type { SceneEntry } from '../types';
import '../TopicScene.css';

/** Degraus ordenados. O movimento leva o marcador de um degrau ao seguinte —
 *  a subida é o que a cena ensina. */
export function EscalaDeGraus({ entry }: { entry: SceneEntry }) {
  const [grau, setGrau] = useState(0);
  const transition = useSceneMotion();
  const id = useId();
  const n = entry.items.length;
  const item = entry.items[grau];
  const alturaDe = (i: number) => 156 - (i * 116) / (n - 1);

  return (
    <section className="tc-scene" aria-label={entry.question}>
      <header>
        <small>CRIVO · graus ordenados</small>
        <h4>{entry.question}</h4>
      </header>
      <svg viewBox="0 0 480 196" role="img" aria-label={`Grau ${grau + 1} de ${n}: ${item.label}`}>
        {entry.items.map((it, i) => (
          <g key={it.label}>
            <line x1="70" x2="410" y1={alturaDe(i)} y2={alturaDe(i)} className={i <= grau ? 'tc-degrau tc-degrau-ativo' : 'tc-degrau'} />
            <text x="62" y={alturaDe(i) + 5} textAnchor="end" className="tc-label">{it.label}</text>
          </g>
        ))}
        <motion.circle
          cx="410" r="9"
          animate={{ cy: alturaDe(grau) }}
          transition={transition}
          className="tc-marcador"
        />
        <text x="70" y="188" className="tc-caption" id={`${id}-eixo`}>do grau mais distante ao mais próximo do inteligível</text>
      </svg>
      <label className="tc-slider">
        Grau: {item.label}
        <input
          type="range" min="0" max={n - 1} step="1" value={grau}
          onChange={(e) => setGrau(Number(e.target.value))}
        />
      </label>
      <p className="tc-observation" role="status"><strong>{item.label}:</strong> {item.claim}</p>
      <blockquote className="tc-quote">“{item.quote}” <cite>{item.section}</cite></blockquote>
    </section>
  );
}
