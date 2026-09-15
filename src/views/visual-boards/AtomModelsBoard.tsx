import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import BoardShell from './BoardShell';
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
  const x = emphasis === 'esquerda' ? -8 : emphasis === 'direita' ? 8 : 0;
  const showRutherford = emphasis !== 'direita';
  const showBohr = emphasis !== 'esquerda';
  return (
    <div className="vs-atlas-scene vs-atlas-scene--atom" data-emphasis={emphasis}>
      <motion.img
        src="/visual-assets/atom-models-atlas.webp"
        alt="Ilustração científica da experiência da folha de ouro de Rutherford ao lado de um átomo de Bohr com níveis luminosos"
        initial={reduced ? false : { opacity: 0, scale: .92 }}
        animate={{ opacity: 1, scale: emphasis === 'nenhum' ? 1 : 1.035, x }}
        transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 120, damping: 18 }}
      />
      <svg className="vs-atlas-motion vs-atom-motion" viewBox="0 0 420 300" aria-hidden="true">
        {showRutherford && <g>
          {[126, 146, 166].map((y, index) => <motion.path key={y} className="vs-alpha-ray" d={`M20 ${y} C82 ${y - 2}, 118 ${y + 2}, 178 ${y}`}
            initial={reduced ? false : { pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: .9 }}
            transition={reduced ? { duration: 0 } : { duration: .8, delay: index * .12 }} />)}
          <motion.path className="vs-alpha-ray vs-alpha-ray--deflected" d="M20 186 C92 184, 132 180, 164 160 C178 150, 183 128, 176 98"
            initial={reduced ? false : { pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={reduced ? { duration: 0 } : { duration: 1.15, delay: .22 }} />
        </g>}
        {showBohr && <g>
          <circle className="vs-electron-orbit" cx="311" cy="151" r="64" />
          <motion.circle className="vs-electron-dot" cx="311" cy="87" r="5"
            animate={reduced ? { rotate: 0 } : { rotate: 360 }} transition={{ duration: 4.8, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '311px 151px' }} />
          <motion.path className="vs-photon-wave" d="M335 92 q8-10 16 0t16 0t16 0"
            initial={reduced ? false : { pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: [0, 1, .45] }}
            transition={reduced ? { duration: 0 } : { duration: 1.2, repeat: Infinity, repeatDelay: .5 }} />
        </g>}
      </svg>
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
