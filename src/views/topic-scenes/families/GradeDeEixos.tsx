import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import type { SceneEntry } from '../types';
import '../TopicScene.css';

/** Tipos gerados pelo cruzamento de dois eixos independentes. Os controles
 *  dos dois eixos, não os quatro rótulos resultantes, são o conteúdo: mover
 *  em cada eixo isoladamente muda a célula, e o rótulo de cada eixo vem da
 *  entrada, nunca chumbado no componente. */
export function GradeDeEixos({ entry }: { entry: SceneEntry }) {
  const [eixoA, setEixoA] = useState<0 | 1>(0);
  const [eixoB, setEixoB] = useState<0 | 1>(0);
  const transition = useSceneMotion();
  const eixos = entry.eixos;
  const celulaAtual = entry.items.find((it) => it.celula && it.celula.eixoA === eixoA && it.celula.eixoB === eixoB) ?? null;

  return (
    <section className="tc-scene" aria-label={entry.question}>
      <header>
        <small>CRIVO · cruzamento de eixos</small>
        <h4>{entry.question}</h4>
      </header>
      <svg viewBox="0 0 220 220" role="img" aria-label={celulaAtual ? `Célula selecionada: ${celulaAtual.label}` : 'Nenhuma célula selecionada'}>
        {[0, 1].map((a) =>
          [0, 1].map((b) => {
            const ativo = a === eixoA && b === eixoB;
            const x = a === 0 ? 10 : 115;
            const y = b === 0 ? 115 : 10;
            const it = entry.items.find((i2) => i2.celula && i2.celula.eixoA === a && i2.celula.eixoB === b);
            return (
              <motion.g key={`${a}-${b}`} animate={{ opacity: ativo ? 1 : 0.4 }} transition={transition}>
                <rect x={x} y={y} width="95" height="95" rx="3" className={ativo ? 'tc-celula tc-celula-ativa' : 'tc-celula'} />
                {it && <text x={x + 47} y={y + 52} textAnchor="middle" className="tc-label">{it.label}</text>}
              </motion.g>
            );
          }),
        )}
      </svg>
      {eixos && (
        <div className="tc-eixos">
          <fieldset className="tc-eixo">
            <legend>{eixos.a.nome}</legend>
            <div className="tc-choices">
              {eixos.a.polos.map((polo, i) => (
                <button key={polo} type="button" aria-pressed={eixoA === i} onClick={() => setEixoA(i as 0 | 1)}>
                  {polo}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="tc-eixo">
            <legend>{eixos.b.nome}</legend>
            <div className="tc-choices">
              {eixos.b.polos.map((polo, i) => (
                <button key={polo} type="button" aria-pressed={eixoB === i} onClick={() => setEixoB(i as 0 | 1)}>
                  {polo}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
      )}
      {celulaAtual && (
        <>
          <p className="tc-observation" role="status"><strong>{celulaAtual.label}:</strong> {celulaAtual.claim}</p>
          <blockquote className="tc-quote">“{celulaAtual.quote}” <cite>{celulaAtual.section}</cite></blockquote>
        </>
      )}
    </section>
  );
}
