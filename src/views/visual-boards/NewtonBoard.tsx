import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';

function NewtonScene({ emphasis }: { emphasis: 'esquerda' | 'direita' | 'nenhum' }) {
  const reducedMotion = useReducedMotion();
  const lineTransition = { duration: 1.05, ease: 'easeOut' as const };
  return (
    <svg className="vs-piston vs-scene vs-newton-scene" viewBox="0 0 320 330" role="img"
      aria-label="Mapa radial das três leis de Newton, ligando inércia, força resultante e ação e reação">
      <defs>
        <filter id="chalk-glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="1.2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <g className="vs-newton-sparks" aria-hidden="true">
        <path d="M145 101l-8-15M160 97V78M176 101l9-15M105 155H87M215 155h18M111 201l-13 12M210 201l13 12" />
      </g>
      <motion.circle className="vs-newton-core" cx="160" cy="165" r="53"
        initial={reducedMotion ? false : { opacity: 0, scale: .82 }}
        animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 150, damping: 18 }} />
      <text className="vs-newton-core-copy" x="160" y="157" textAnchor="middle">LEIS DE</text>
      <text className="vs-newton-core-copy" x="160" y="178" textAnchor="middle">NEWTON</text>
      <motion.path className={`vs-newton-link${emphasis === 'esquerda' ? ' is-active' : ''}`} d="M126 124 78 76"
        initial={reducedMotion ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={lineTransition} />
      <motion.path className={`vs-newton-link${emphasis === 'direita' ? ' is-active' : ''}`} d="M194 124 244 76"
        initial={reducedMotion ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...lineTransition, delay: .12 }} />
      <motion.path className="vs-newton-link" d="M160 218v60"
        initial={reducedMotion ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ ...lineTransition, delay: .24 }} />

      <g className="vs-newton-law vs-newton-law--one">
        <rect x="16" y="26" width="120" height="62" rx="17" />
        <text x="76" y="51" textAnchor="middle">1ª Lei · Inércia</text>
        <text x="76" y="72" textAnchor="middle">ΣF = 0</text>
      </g>
      <g className="vs-newton-law vs-newton-law--two">
        <rect x="184" y="26" width="120" height="62" rx="17" />
        <text x="244" y="51" textAnchor="middle">2ª Lei · Força</text>
        <text x="244" y="72" textAnchor="middle">ΣF = m · a</text>
      </g>
      <g className="vs-newton-law vs-newton-law--three">
        <rect x="91" y="264" width="138" height="58" rx="17" />
        <text x="160" y="288" textAnchor="middle">3ª Lei · Par</text>
        <text x="160" y="308" textAnchor="middle">F₁ = −F₂</text>
      </g>
      <text className="vs-newton-hand" x="12" y="245" transform="rotate(-5 12 245)">desenhe as forças</text>
      <path className="vs-newton-hand-arrow" d="M94 239q28-12 47-29" />
    </svg>
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
