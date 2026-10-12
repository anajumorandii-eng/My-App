import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import type { SceneEntry } from '../types';
import { GeometriaMolecularStage } from './GeometriaMolecularStage';
import { MolecularGlyph } from '../MolecularGlyph';
import '../TopicScene.css';

const FORMULAS: Record<string, string> = {
  'Álcool': 'R–OH',
  'Aldeído ou cetona': 'R–CHO  /  R–CO–R′',
  'Ácido carboxílico': 'R–C(=O)–OH',
  'Éter': 'R–O–R′',
};

export function QuimicaTipologia({ entry }: { entry: SceneEntry }) {
  // Geometria Molecular virou palco próprio (molécula girável + galeria na
  // mesma cena). Fica num componente à parte porque os hooks são outros.
  if (entry.chapterId === 'summary-quimica-geometria-molecular') return <GeometriaMolecularStage entry={entry} />;
  return <QuimicaTipologiaCartoes entry={entry} />;
}

function QuimicaTipologiaCartoes({ entry }: { entry: SceneEntry }) {
  const [foco, setFoco] = useState<number | null>(null);
  const transition = useSceneMotion();
  const item = foco === null ? null : entry.items[foco];
  const geometry = entry.chapterId === 'summary-quimica-geometria-molecular';

  return (
    <><section className="tc-scene tc-chem-scene" aria-label={entry.question}>
      <header>
        <small>CRIVO · modelo químico</small>
        <h4>{entry.question}</h4>
      </header>
      <div className={`tc-chem-grid${geometry ? ' tc-chem-grid--geometry' : ''}`}>
        {entry.items.map((it, i) => (
          <motion.button key={it.label} type="button" className="tc-chem-card" aria-pressed={foco === i} onClick={() => setFoco(foco === i ? null : i)} animate={{ opacity: foco === null || foco === i ? 1 : 0.58, scale: foco === i ? 1.015 : 1 }} transition={transition}>
            <span className="tc-chem-visual">
              {geometry ? <MolecularGlyph label={it.label} /> : <span className="tc-chem-formula">{FORMULAS[it.label] ?? it.label}</span>}
            </span>
            <strong>{it.label}</strong>
            <span>{it.claim}</span>
          </motion.button>
        ))}
      </div>
      {item && <p className="tc-observation" role="status"><strong>{item.label}:</strong> {item.claim}</p>}
    </section></>
  );
}
