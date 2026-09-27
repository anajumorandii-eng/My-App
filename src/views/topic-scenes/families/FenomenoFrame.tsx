import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import type { SceneEntry } from '../types';
import '../TopicScene.css';
import './QuimicaFenomenos.css';

// Moldura comum às cenas de fenômeno (Química, Biologia): cabeçalho, figura,
// escolha do caso, afirmação e citação literal. Só a cena muda de capítulo
// para capítulo — o mesmo contrato que o BoardShell garante às pranchas.

export type Cena = { ativo: string; t: ReturnType<typeof useSceneMotion> };
export type CenaFenomeno = { cena: React.ComponentType<Cena>; rotulos: string[]; titulo: string };

export const FOCO = (ligado: boolean) => ({ opacity: ligado ? 1 : 0.28 });

// `t` vem da família, que chama useSceneMotion(): é ela quem responde pelo
// movimento reduzido, e o portão de movimento confere isso arquivo a arquivo.
export function FenomenoFrame({ entry, cenas, t }: { entry: SceneEntry; cenas: Record<string, CenaFenomeno>; t: ReturnType<typeof useSceneMotion> }) {
  const [ativo, setAtivo] = useState(0);
  const { cena: CenaAtual, titulo } = cenas[entry.chapterId];
  const item = entry.items[ativo];
  return <section className="tc-scene qf-scene" aria-label={entry.question}>
    <header><small>CRIVO · {titulo}</small><h4>{entry.question}</h4></header>
    {/* No celular o quadro de 480 encolhia a ~350 px e as legendas caíam para
        7 px. Mesmo precedente das cenas de História e Geografia: largura
        mínima e rolagem só dentro da prancha, nunca da página. */}
    <div className="qf-figure" role="region" tabIndex={0} aria-label="Prancha visual: deslize para ver a figura inteira; com teclado, use as setas" onKeyDown={(event) => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault();
      event.currentTarget.scrollLeft += event.key === 'ArrowRight' ? 120 : -120;
    }}>
      <svg viewBox="0 0 480 300" className="qf-svg" role="img" aria-label={`${item.label}: ${item.claim}`}>
        <CenaAtual ativo={item.label} t={t} />
      </svg>
    </div>
    <p className="qf-pan-hint">Deslize a prancha para ver toda a figura. Com teclado, use as setas.</p>
    <div className="tc-choices" role="group" aria-label="Escolha o caso da prancha">
      {entry.items.map((it, i) => <motion.button key={it.label} type="button" aria-pressed={ativo === i} onClick={() => setAtivo(i)} initial={false} animate={{ y: ativo === i ? -2 : 0 }} transition={t}>{it.label}</motion.button>)}
    </div>
    <p className="tc-observation" role="status" aria-live="polite"><strong>{item.label}:</strong> {item.claim}</p>
    <blockquote className="tc-quote">“{item.quote}” <cite>{item.section}</cite></blockquote>
    <p className="qf-nota">Desenho esquemático: formas e proporções ilustram o mecanismo; o texto e a citação vêm do resumo.</p>
  </section>;
}
