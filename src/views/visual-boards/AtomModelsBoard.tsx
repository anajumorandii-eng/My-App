import React from 'react';
import BoardShell from './BoardShell';
import AtomMechanism from './AtomMechanism';
import { AtomLab } from './MechanismLab';
import { boardPair } from './pair';
import type { BoardProps } from './types';

export default function AtomModelsBoard(props: BoardProps) {
  const par = boardPair(props);
  return (
    <BoardShell
      title="Modelos atômicos"
      subtitle="Novas evidências revelam limites e motivam novos modelos."
      condition={{ label: 'critério', value: 'evidência' }}
      ariaLabel="Prancha ilustrada da evolução dos modelos atômicos"
      scene={<AtomMechanism />}
      sceneFirst
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
      closing="a sequência dos modelos não é cronologia a decorar: novas evidências e limites teóricos motivam sua reformulação."
    />
  );
}
