import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import type { SceneEntry } from '../types';
import '../TopicScene.css';

/** Degraus ordenados. O movimento leva o marcador de um degrau ao seguinte —
 *  a subida é o que a cena ensina. */
function labelLines(label: string): string[] {
  const words = label.split(/\s+/).filter(Boolean);
  if (words.length < 2 || label.length <= 16) return [label];

  const midpoint = Math.ceil(words.length / 2);
  return [words.slice(0, midpoint).join(' '), words.slice(midpoint).join(' ')];
}

export function EscalaDeGraus({ entry }: { entry: SceneEntry }) {
  const [grau, setGrau] = useState(0);
  const transition = useSceneMotion();
  const n = entry.items.length;
  const item = entry.items[grau];
  const alturaDe = (i: number) => 156 - (i * 116) / (n - 1);

  return (
    <section className="tc-scene" aria-label={entry.question}>
      <header>
        <small>CRIVO · graus ordenados</small>
        <h4>{entry.question}</h4>
      </header>
      <figure className="tc-scale-figure">
        <svg viewBox="0 0 480 180" role="img" aria-label={`Grau ${grau + 1} de ${n}: ${item.label}`}>
          {entry.items.map((it, i) => {
            const lines = labelLines(it.label);
            const labelY = alturaDe(i) - (lines.length - 1) * 8 + 5;

            return <g key={it.label}>
              <line x1="164" x2="445" y1={alturaDe(i)} y2={alturaDe(i)} className={i <= grau ? 'tc-degrau tc-degrau-ativo' : 'tc-degrau'} />
              <text x="152" y={labelY} textAnchor="end" className="tc-label tc-scale-label" data-testid="scale-label">
                {lines.map((line, index) => <tspan key={line} x="152" dy={index === 0 ? 0 : 16}>{line}</tspan>)}
              </text>
            </g>;
          })}
          <motion.circle
            cx="445" r="9"
            animate={{ cy: alturaDe(grau) }}
            transition={transition}
            className="tc-marcador"
          />
        </svg>
        <figcaption className="tc-scale-axis">{entry.eixo ?? 'do primeiro ao último grau'}</figcaption>
      </figure>
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
