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

function MutationWorkbench({ entry, focus, onFocus }: { entry: SceneEntry; focus: number; onFocus: (index: number) => void }) {
  const item = entry.items[focus];
  const mutation = MUTATIONS[item.label];
  const isFrame = item.label === 'Frameshift';
  const isMultiple = item.label === 'Múltiplo de três';
  return <div className="tc-mutation-workbench" data-bio-system="gene-mutation">
    <div className="tc-mutation-tabs" role="tablist" aria-label="Tipo de mutação">
      {entry.items.map((candidate, index) => <button key={candidate.label} type="button" role="tab" aria-selected={focus === index} onClick={() => onFocus(index)}>{candidate.label}</button>)}
    </div>
    <div className="tc-mutation-figure" role="img" aria-label={`${item.label}: ${mutation.before}; ${mutation.after}; ${mutation.effect}`}>
      <div className="tc-gene-strand" aria-hidden="true"><span>DNA molde</span><i/><i/><i/><i/><i/><i/><i/><i/></div>
      <div className="tc-codon-comparison">
        <section><small>antes</small><code>{mutation.before}</code><p>{isFrame || isMultiple ? 'leitura em trincas' : 'códon traduzido'}</p></section>
        <span className="tc-mutation-arrow" aria-hidden="true">→</span>
        <section className="tc-codon-after"><small>depois</small><code>{mutation.after}</code><p>{isFrame ? 'todas as trincas seguintes mudam' : isMultiple ? 'trincas seguintes preservadas' : mutation.effect}</p></section>
      </div>
      <div className="tc-protein-strip" aria-label="consequência na proteína">
        <span className={item.label === 'Silenciosa' ? 'tc-protein-same' : ''}>proteína</span><b>{item.label === 'Silenciosa' ? 'mesmo aminoácido' : item.label === 'Nonsense (sem sentido)' ? 'STOP precoce' : isFrame ? 'sequência reescrita' : isMultiple ? 'aminoácido extra' : 'aminoácido trocado'}</b>
      </div>
    </div>
    <p className="tc-observation" role="status"><strong>{item.label}:</strong> {item.claim}</p>
    <blockquote className="tc-quote">“{item.quote}” <cite>{item.section}</cite></blockquote>
  </div>;
}

/** A comparação mantém mecanismo e consequência visíveis mesmo sem selecionar. */
export function Tipologia({ entry }: { entry: SceneEntry }) {
  const [foco, setFoco] = useState<number | null>(null);
  const transition = useSceneMotion();
  const item = foco === null ? null : entry.items[foco];
  const mutations = entry.chapterId === 'summary-biologia-mutacoes-genicas';

  if (mutations) {
    return <section className="tc-scene" aria-label={entry.question}>
      <header><small>CRIVO · leitura de código genético</small><h4>{entry.question}</h4></header>
      <MutationWorkbench entry={entry} focus={foco ?? 0} onFocus={setFoco} />
      {entry.nota && <p className="tc-nota">{entry.nota}</p>}
    </section>;
  }

  return (
    <section className="tc-scene" aria-label={entry.question}>
      <header>
        <small>CRIVO · comparar mecanismos</small>
        <h4>{entry.question}</h4>
      </header>
      <div className="tc-type-grid">
        {entry.items.map((it, i) => {
          return <motion.button key={it.label} type="button" className="tc-type-card" aria-pressed={foco === i} aria-label={it.label} onClick={() => setFoco(foco === i ? null : i)} animate={{ scale: foco === i ? 1.01 : 1 }} transition={transition}>
            <span className="tc-type-number">{String(i + 1).padStart(2, '0')}</span>
            <strong>{it.label}</strong>
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
