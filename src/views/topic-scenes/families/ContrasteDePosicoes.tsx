import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import type { SceneEntry } from '../types';
import '../TopicScene.css';

/** Respostas rivais à mesma pergunta. O movimento mostra o peso migrando de
 *  uma posição para a outra — é a comparação, não uma entrada decorativa. */
/** Quebra o rótulo para caber na largura da coluna, em até três linhas.
 *  Numa linha só, "Relativismo metodológico" e "Relativismo moral radical"
 *  se sobrepunham e vazavam do quadro. ~9 px por letra na fonte de 18 px. */
function linhas(rotulo: string, n: number): string[] {
  const cabe = Math.max(8, Math.floor((400 / n - 10) / 9));
  const saida: string[] = [];
  let atual = '';
  for (const palavra of rotulo.split(' ')) {
    const tentativa = atual ? `${atual} ${palavra}` : palavra;
    if (tentativa.length > cabe && atual) { saida.push(atual); atual = palavra; } else atual = tentativa;
  }
  if (atual) saida.push(atual);
  return saida.length > 3 ? [...saida.slice(0, 2), saida.slice(2).join(' ')] : saida;
}

export function ContrasteDePosicoes({ entry }: { entry: SceneEntry }) {
  const [escolhida, setEscolhida] = useState<number | null>(null);
  const [trecho, setTrecho] = useState(false);
  const transition = useSceneMotion();
  const item = escolhida === null ? null : entry.items[escolhida];
  const n = entry.items.length;

  return (
    <section className="tc-scene" aria-label={entry.question}>
      <header>
        <small>CRIVO · posições em disputa</small>
        <h4>{entry.question}</h4>
      </header>
      {/* Topo em −24: rótulo de três linhas precisa de espaço acima da coluna. */}
      <svg viewBox="0 -24 480 214" role="img" aria-label={item ? `Posição em foco: ${item.label}` : 'Nenhuma posição em foco'}>
        <path d="M40 150H440" className="tc-base" />
        {entry.items.map((it, i) => {
          const x = 40 + ((i + 0.5) * 400) / n;
          const emFoco = escolhida === i;
          return (
            <motion.g key={it.label} animate={{ opacity: escolhida === null || emFoco ? 1 : 0.32 }} transition={transition}>
              {/* Sem initial, o motion escrevia y e height como "undefined" no
                  primeiro quadro: erro de console em 18 telas de Sociologia. */}
              <motion.rect
                x={x - 62} width="124" rx="3"
                initial={{ y: emFoco ? 46 : 74, height: emFoco ? 104 : 76 }}
                animate={{ y: emFoco ? 46 : 74, height: emFoco ? 104 : 76 }}
                transition={transition}
                className={emFoco ? 'tc-pillar tc-pillar-foco' : 'tc-pillar'}
              />
              <text x={x} y={40 - (linhas(it.label, n).length - 1) * 17} textAnchor="middle" className="tc-label">
                {linhas(it.label, n).map((l, k) => <tspan key={k} x={x} dy={k === 0 ? 0 : 17}>{l}</tspan>)}
              </text>
            </motion.g>
          );
        })}
      </svg>
      <div className="tc-choices">
        {entry.items.map((it, i) => (
          <button
            key={it.label}
            type="button"
            aria-pressed={escolhida === i}
            onClick={() => { setEscolhida(escolhida === i ? null : i); setTrecho(false); }}
          >
            {it.label}
          </button>
        ))}
      </div>
      {item && (
        <>
          <p className="tc-observation" role="status"><strong>{item.label}:</strong> {item.claim}</p>
          <button type="button" className="tc-quote-toggle" aria-expanded={trecho} onClick={() => setTrecho((v) => !v)}>
            Ver o trecho do capítulo
          </button>
          {trecho && <blockquote className="tc-quote">“{item.quote}” <cite>{item.section}</cite></blockquote>}
        </>
      )}
    </section>
  );
}
