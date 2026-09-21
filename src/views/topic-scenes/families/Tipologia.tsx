import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import type { SceneEntry } from '../types';
import '../TopicScene.css';

const MUTATIONS: Record<string, { before: string; after: string; effect: string }> = {
  'Silenciosa': { before: 'GAA → Glu', after: 'GAG → Glu', effect: 'códon mudou · aminoácido preservado' },
  'Missense (sentido trocado)': { before: 'GAA → Glu', after: 'GUA → Val', effect: 'substituição de aminoácido' },
  'Nonsense (sem sentido)': { before: 'UAU → Tyr', after: 'UAA → STOP', effect: 'parada prematura da tradução' },
  'Frameshift': { before: 'AUG | AAA | CCU', after: 'AUG | CAA | ACC…', effect: 'inserção de C · quadro deslocado' },
  'Múltiplo de três': { before: 'AUG | AAA | CCU', after: 'AUG | GCU | AAA | CCU', effect: '+ GCU · quadro preservado' },
};

/** A comparação mantém mecanismo e consequência visíveis mesmo sem selecionar. */
export function Tipologia({ entry }: { entry: SceneEntry }) {
  const [foco, setFoco] = useState<number | null>(null);
  const transition = useSceneMotion();
  const item = foco === null ? null : entry.items[foco];
  const mutations = entry.chapterId === 'summary-biologia-mutacoes-genicas';

  return (
    <section className="tc-scene" aria-label={entry.question}>
      <header>
        <small>CRIVO · comparar mecanismos</small>
        <h4>{entry.question}</h4>
      </header>
      <div className="tc-type-grid">
        {entry.items.map((it, i) => {
          const mutation = mutations ? MUTATIONS[it.label] : undefined;
          return <motion.button key={it.label} type="button" className="tc-type-card" aria-pressed={foco === i} aria-label={it.label} onClick={() => setFoco(foco === i ? null : i)} animate={{ scale: foco === i ? 1.01 : 1 }} transition={transition}>
            <span className="tc-type-number">{String(i + 1).padStart(2, '0')}</span>
            <strong>{it.label}</strong>
            {mutation && <span className="tc-mutation" aria-label={`${mutation.before}; ${mutation.after}; ${mutation.effect}`}>
              <code>{mutation.before}</code><span aria-hidden="true">↓</span><code>{mutation.after}</code><small>{mutation.effect}</small>
            </span>}
            <span className="tc-type-claim">{it.claim}</span>
          </motion.button>;
        })}
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
