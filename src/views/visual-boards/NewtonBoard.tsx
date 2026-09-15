import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';

function NewtonScene({ emphasis }: { emphasis: 'esquerda' | 'direita' | 'nenhum' }) {
  const reducedMotion = useReducedMotion();
  return (
    <div className="vs-atlas-scene vs-atlas-scene--newton" data-emphasis={emphasis}>
      <motion.img
        src="/visual-assets/newton-laws-atlas.webp"
        alt="Ilustração científica de um carrinho ligado a uma roldana, com vetores de força, inércia e um par de ação e reação"
        initial={reducedMotion ? false : { opacity: 0, scale: .92 }}
        animate={{ opacity: 1, scale: emphasis === 'nenhum' ? 1 : 1.035, x: emphasis === 'esquerda' ? -8 : emphasis === 'direita' ? 8 : 0 }}
        transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 18 }}
      />
      <svg className="vs-atlas-motion vs-newton-motion" viewBox="0 0 420 300" aria-hidden="true">
        <defs><marker id="vs-force-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 8 4 0 8Z" /></marker></defs>
        <motion.g animate={reducedMotion ? { x: 0 } : { x: emphasis === 'direita' ? [0, 8, 0] : 0 }} transition={{ duration: 1.15, repeat: emphasis === 'direita' ? Infinity : 0, repeatDelay: .8 }}>
          <motion.path className="vs-force-vector vs-force-vector--drive" d="M174 140 H250" markerEnd="url(#vs-force-arrow)" initial={reducedMotion ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: .8 }} />
          <motion.path className="vs-force-vector vs-force-vector--weight" d="M151 153 V220" markerEnd="url(#vs-force-arrow)" initial={reducedMotion ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: .8, delay: .12 }} />
          <motion.path className="vs-force-vector vs-force-vector--normal" d="M151 137 V82" markerEnd="url(#vs-force-arrow)" initial={reducedMotion ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: .8, delay: .24 }} />
        </motion.g>
        <motion.circle className="vs-interaction-pulse" cx="332" cy="178" r="18"
          style={{ transformOrigin: '332px 178px' }}
          animate={reducedMotion ? { scale: 1, opacity: .75 } : { scale: [1, 1.5, 1], opacity: [.75, .12, .75] }}
          transition={{ duration: 1.8, repeat: Infinity }} />
      </svg>
      <span className="vs-atlas-label vs-atlas-label--newton-left">sem resultante: conserva</span>
      <span className="vs-atlas-label vs-atlas-label--newton-right">ΣF muda o movimento</span>
    </div>
  );
}

export default function NewtonBoard(props: BoardProps) {
  const pair = boardPair(props);
  return (
    <BoardShell
      kicker="Mapa de relações"
      title="As Leis de Newton"
      subtitle="O movimento muda quando a força resultante deixa de ser nula."
      condition={{ label: 'ideia central', value: 'ΣF = m·a' }}
      ariaLabel="Prancha ilustrada das três leis de Newton"
      scene={<NewtonScene emphasis={pair.emphasis} />}
      emphasis={pair.emphasis}
      left={{
        label: '1ª Lei · inércia',
        headline: 'Sem resultante, o estado se conserva.',
        detail: 'Repouso ou movimento retilíneo uniforme continuam enquanto nenhuma força resultante alterar o estado do corpo.',
        formula: 'ΣF = 0 → a = 0',
      }}
      right={{
        label: '2ª Lei · dinâmica',
        headline: 'A resultante produz aceleração.',
        detail: 'A direção da aceleração acompanha a força resultante; a massa mede a resistência à mudança do movimento.',
        formula: 'ΣF = m · a',
      }}
      leftState={pair.leftState}
      rightState={pair.rightState}
      leftSelected={pair.leftSelected}
      rightSelected={pair.rightSelected}
      onSelectLeft={pair.selectLeft}
      onSelectRight={pair.selectRight}
      equation={{ label: 'No elevador', general: 'N − P = m·a', condition: 'subindo', reduced: 'N > P' }}
      supports={
        <>
          <section className="vs-formula-note">
            <span className="vs-note-title">3ª Lei · ação e reação</span>
            <strong>Mesmo módulo, corpos diferentes</strong>
            <p>As forças do par têm sentidos opostos e não se anulam no diagrama de um único corpo.</p>
          </section>
          <section className="vs-formula-note">
            <span className="vs-note-title">Estratégia de prova</span>
            <strong>Isole o corpo primeiro</strong>
            <p>Desenhe apenas as forças que atuam nele, escolha o eixo e aplique a segunda lei em cada direção.</p>
          </section>
        </>
      }
      closing="as três leis formam um sistema: a primeira define o referencial, a segunda calcula a mudança e a terceira identifica a interação."
    />
  );
}
