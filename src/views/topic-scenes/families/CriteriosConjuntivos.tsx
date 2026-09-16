import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import type { SceneEntry } from '../types';
import '../TopicScene.css';

/** Condições que só definem o fenômeno reunidas todas ao mesmo tempo.
 *  O movimento preenche cada critério marcado; o veredito muda de "válido"
 *  para "incompleto" assim que um único critério é derrubado — é isso que
 *  torna a conjunção, e não a soma, o conteúdo da cena. */
export function CriteriosConjuntivos({ entry }: { entry: SceneEntry }) {
  const [marcados, setMarcados] = useState<boolean[]>(() => entry.items.map(() => false));
  const transition = useSceneMotion();
  const n = entry.items.length;
  const algumMarcado = marcados.some(Boolean);
  const todosMarcados = marcados.every(Boolean);
  const faltantes = entry.items.filter((_, i) => !marcados[i]).map((it) => it.label);

  function alternar(i: number) {
    setMarcados((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  }

  return (
    <section className="tc-scene" aria-label={entry.question}>
      <header>
        <small>CRIVO · critérios conjuntivos</small>
        <h4>{entry.question}</h4>
      </header>
      <svg viewBox="0 0 480 160" role="img" aria-label={todosMarcados ? 'Todos os critérios reunidos' : 'Critérios incompletos'}>
        {entry.items.map((it, i) => {
          const x = 40 + ((i + 0.5) * 400) / n;
          const ativo = marcados[i];
          return (
            <motion.g key={it.label} animate={{ opacity: ativo ? 1 : 0.35 }} transition={transition}>
              <motion.rect
                x={x - 58} width="116" rx="3"
                animate={{ y: ativo ? 38 : 58, height: ativo ? 74 : 54 }}
                transition={transition}
                className={ativo ? 'tc-criterio tc-criterio-ativo' : 'tc-criterio'}
              />
              <text x={x} y="130" textAnchor="middle" className="tc-label">{it.label}</text>
            </motion.g>
          );
        })}
        <motion.rect x="30" y="144" width="420" height="10" rx="2" animate={{ opacity: todosMarcados ? 1 : 0.2 }} transition={transition} className="tc-veredito-barra" />
      </svg>
      <div className="tc-choices">
        {entry.items.map((it, i) => (
          <button
            key={it.label}
            type="button"
            aria-pressed={marcados[i]}
            onClick={() => alternar(i)}
          >
            {it.label}
          </button>
        ))}
      </div>
      {algumMarcado && (
        <>
          <p className="tc-observation" role="status">
            {todosMarcados
              ? `Reúne todos os critérios: ${entry.items.map((it) => it.label).join(', ')}.`
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
