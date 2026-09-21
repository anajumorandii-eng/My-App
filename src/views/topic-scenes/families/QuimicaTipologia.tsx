import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import type { SceneEntry } from '../types';
import '../TopicScene.css';

const FORMULAS: Record<string, string> = {
  'Álcool': 'R–OH',
  'Aldeído ou cetona': 'R–CHO  /  R–CO–R′',
  'Ácido carboxílico': 'R–C(=O)–OH',
  'Éter': 'R–O–R′',
};

function Geometry({ label }: { label: string }) {
  const atom = (x: number, y: number, key: string, central = false) => (
    <circle key={key} cx={x} cy={y} r={central ? 11 : 8} className={central ? 'tc-chem-atom tc-chem-atom--central' : 'tc-chem-atom'} />
  );
  const bond = (x1: number, y1: number, x2: number, y2: number, key: string) => (
    <line key={key} x1={x1} y1={y1} x2={x2} y2={y2} className="tc-chem-bond" />
  );
  const center = atom(60, 42, 'c', true);

  if (label === 'Linear') return <svg viewBox="0 0 120 84" aria-hidden="true">{bond(20, 42, 100, 42, 'b')}{atom(18, 42, 'a')}{center}{atom(102, 42, 'd')}</svg>;
  if (label === 'Trigonal plana') return <svg viewBox="0 0 120 84" aria-hidden="true">{bond(60, 42, 60, 10, 'b1')}{bond(60, 42, 27, 67, 'b2')}{bond(60, 42, 93, 67, 'b3')}{atom(60, 9, 'a')}{center}{atom(25, 69, 'd')}{atom(95, 69, 'e')}</svg>;
  if (label === 'Tetraédrica') return <svg viewBox="0 0 120 84" aria-hidden="true">{bond(60, 42, 60, 9, 'b1')}{bond(60, 42, 24, 64, 'b2')}{bond(60, 42, 96, 64, 'b3')}<path d="M60 42 L91 20" className="tc-chem-bond tc-chem-bond--wedge" />{atom(60, 8, 'a')}{center}{atom(22, 66, 'd')}{atom(98, 66, 'e')}{atom(94, 18, 'f')}</svg>;
  if (label === 'Piramidal trigonal') return <svg viewBox="0 0 120 84" aria-hidden="true">{bond(60, 38, 25, 67, 'b1')}{bond(60, 38, 95, 67, 'b2')}<path d="M60 38 L60 73" className="tc-chem-bond tc-chem-bond--wedge" /><circle cx="55" cy="13" r="2.7" className="tc-chem-pair" /><circle cx="65" cy="13" r="2.7" className="tc-chem-pair" />{center}{atom(23, 69, 'a')}{atom(97, 69, 'd')}{atom(60, 74, 'e')}</svg>;
  const water = label.includes('H2O');
  return <svg viewBox="0 0 120 84" aria-hidden="true">{bond(60, 42, 25, 68, 'b1')}{bond(60, 42, 95, 68, 'b2')}{center}{atom(23, 70, 'a')}{atom(97, 70, 'd')}<circle cx="49" cy="17" r="2.7" className="tc-chem-pair" /><circle cx="56" cy="14" r="2.7" className="tc-chem-pair" />{water && <><circle cx="64" cy="14" r="2.7" className="tc-chem-pair" /><circle cx="71" cy="17" r="2.7" className="tc-chem-pair" /></>}</svg>;
}

export function QuimicaTipologia({ entry }: { entry: SceneEntry }) {
  const [foco, setFoco] = useState<number | null>(null);
  const transition = useSceneMotion();
  const item = foco === null ? null : entry.items[foco];
  const geometry = entry.chapterId === 'summary-quimica-geometria-molecular';

  return (
    <section className="tc-scene tc-chem-scene" aria-label={entry.question}>
      <header>
        <small>CRIVO · modelo químico</small>
        <h4>{entry.question}</h4>
      </header>
      <div className={`tc-chem-grid${geometry ? ' tc-chem-grid--geometry' : ''}`}>
        {entry.items.map((it, i) => (
          <motion.button key={it.label} type="button" className="tc-chem-card" aria-pressed={foco === i} onClick={() => setFoco(foco === i ? null : i)} animate={{ opacity: foco === null || foco === i ? 1 : 0.58, scale: foco === i ? 1.015 : 1 }} transition={transition}>
            <span className="tc-chem-visual">
              {geometry ? <Geometry label={it.label} /> : <span className="tc-chem-formula">{FORMULAS[it.label] ?? it.label}</span>}
            </span>
            <strong>{it.label}</strong>
            <span>{it.claim}</span>
          </motion.button>
        ))}
      </div>
      {item && <p className="tc-observation" role="status"><strong>{item.label}:</strong> {item.claim}</p>}
    </section>
  );
}
