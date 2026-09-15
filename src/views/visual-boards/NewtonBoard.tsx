import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import BoardShell from './BoardShell';
import { NewtonLab } from './MechanismLab';
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
        animate={{ opacity: 1, scale: 1 }}
        transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 18 }}
      />

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
          <NewtonLab />
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
