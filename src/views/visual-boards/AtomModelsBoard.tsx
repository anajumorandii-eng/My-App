import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import BoardShell from './BoardShell';
import { AtomLab } from './MechanismLab';
import { boardPair } from './pair';
import type { BoardProps } from './types';

/**
 * Os modelos atômicos lado a lado, cada um com o experimento que o derrubou.
 *
 * A sequência Dalton → Thomson → Rutherford → Bohr costuma ser decorada como
 * lista de nomes. O que a torna inteligível é que cada modelo caiu por um
 * experimento específico, e o seguinte nasceu para explicar exatamente o que o
 * anterior não explicava. Por isso a cena mostra o modelo junto do achado que o
 * substituiu, em vez de quatro desenhos soltos em ordem cronológica.
 */
function AtomAtlas({ emphasis }: { emphasis: 'esquerda' | 'direita' | 'nenhum' }) {
  const reduced = useReducedMotion();
  return (
    <div className="vs-atlas-scene vs-atlas-scene--atom" data-emphasis={emphasis}>
      <motion.img
        src="/visual-assets/atom-models-atlas.webp"
        alt="Ilustração científica da experiência da folha de ouro de Rutherford ao lado de um átomo de Bohr com níveis luminosos"
        initial={reduced ? false : { opacity: 0, scale: .92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 18 }}
      />

      <span className="vs-atlas-label vs-atlas-label--atom-left">α atravessa a lâmina</span>
      <span className="vs-atlas-label vs-atlas-label--atom-right">ΔE libera um fóton</span>
    </div>
  );
}

export default function AtomModelsBoard(props: BoardProps) {
  const par = boardPair(props);
  return (
    <BoardShell
      title="Modelos atômicos"
      subtitle="Cada modelo caiu por um experimento — e o seguinte nasceu dele."
      condition={{ label: 'critério', value: 'evidência' }}
      ariaLabel="Prancha ilustrada da evolução dos modelos atômicos"
      scene={<AtomAtlas emphasis={par.emphasis} />}
      sceneNotes={{ up: 'Rutherford ↑', down: '↓ Bohr' }}
      emphasis={par.emphasis}
      left={{
        label: 'Rutherford',
        headline: 'O átomo é quase todo vazio.',
        detail: 'A folha de ouro deixou quase toda partícula alfa passar, e desviou pouquíssimas. Logo, a carga positiva está concentrada num núcleo minúsculo.',
        formula: 'núcleo denso + eletrosfera vazia',
      }}
      right={{
        label: 'Bohr',
        headline: 'As órbitas têm energia definida.',
        detail: 'O modelo anterior previa que o elétron espiralaria até o núcleo. Bohr quantizou os níveis: o elétron só ocupa órbitas específicas e salta entre elas.',
        formula: 'ΔE = h · ν',
      }}
      leftState={par.leftState}
      rightState={par.rightState}
      leftSelected={par.leftSelected}
      rightSelected={par.rightSelected}
      onSelectLeft={par.selectLeft}
      onSelectRight={par.selectRight}
      equation={{ label: 'O que Bohr explica', general: 'espectro de linhas', condition: 'e não', reduced: 'espectro contínuo' }}
      supports={
        <>
          <AtomLab />
          <section className="vs-formula-note">
            <span className="vs-note-title">A pergunta de cada modelo</span>
            <strong>Dalton → Thomson</strong>
            <strong>Thomson → Rutherford</strong>
            <p>Raios catódicos mostraram que o átomo tem parte negativa; a folha de ouro mostrou que a positiva está concentrada, não espalhada no pudim.</p>
          </section>
          <section className="vs-formula-note">
            <span className="vs-note-title">Por que o salto emite luz</span>
            <strong>Cor = diferença de energia</strong>
            <p>A energia perdida no salto sai como fóton de frequência exata. Por isso cada elemento tem um espectro próprio — é a assinatura dos seus níveis.</p>
          </section>
        </>
      }
      closing="a sequência dos modelos não é cronologia a decorar: cada um responde ao experimento que derrubou o anterior."
    />
  );
}
