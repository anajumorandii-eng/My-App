import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import type { SceneEntry } from '../types';
import '../TopicScene.css';

/** Condições que só definem o fenômeno reunidas todas ao mesmo tempo.
 *  O movimento preenche cada critério marcado; o veredito muda assim que um
 *  único critério é derrubado — é isso que torna a conjunção, e não a soma,
 *  o conteúdo da cena. Texto do veredito é neutro entre matérias (não
 *  "conceito válido"), porque a mesma família serve tanto definições
 *  filosóficas quanto explicações causais de História. */
export function CriteriosConjuntivos({ entry }: { entry: SceneEntry }) {
  const [marcados, setMarcados] = useState<boolean[]>(() => entry.items.map(() => false));
  const transition = useSceneMotion();
  const climate = entry.chapterId === 'summary-geografia-clima-mundial';
  const criteria = climate ? entry.items.filter(it => it.label !== 'Nenhum isolado') : entry.items;
  const algumMarcado = marcados.some(Boolean);
  const todosMarcados = criteria.every(it => marcados[entry.items.indexOf(it)]);
  const faltantes = criteria.filter(it => !marcados[entry.items.indexOf(it)]).map(it => it.label);

  function alternar(i: number) {
    setMarcados((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  }

  return (
    <section className="tc-scene" aria-label={entry.question}>
      <header>
        <small>CRIVO · critérios conjuntivos</small>
        <h4>{entry.question}</h4>
      </header>
      <div className="tc-criteria-grid">
        {criteria.map(it => {
          const i = entry.items.indexOf(it);
          return <motion.button key={it.label} type="button" className="tc-criterion-card" aria-label={it.label} aria-pressed={marcados[i]} onClick={() => alternar(i)} animate={{ scale: marcados[i] ? 1.01 : 1 }} transition={transition}>
            <span className="tc-criterion-head"><strong>{it.label}</strong><span aria-hidden="true">{marcados[i] ? '✓' : '+'}</span></span>
            <span>{it.claim}</span>
          </motion.button>;
        })}
      </div>
      {climate && <p className="tc-nota">Latitude, altitude e influência oceânica atuam juntas; nenhum fator, sozinho, determina o clima observado.</p>}
      {algumMarcado && (
        <>
          <p className="tc-observation" role="status">
            {todosMarcados
              ? `Reúne todos os critérios: ${criteria.map((it) => it.label).join(', ')}.`
              : `Ainda falta: ${faltantes.join(', ')}.`}
          </p>
          {entry.items.map((it, i) => marcados[i] && (
            <blockquote key={it.label} className="tc-quote">“{it.quote}” <cite>{it.section}</cite></blockquote>
          ))}
        </>
      )}
    </section>
  );
}
