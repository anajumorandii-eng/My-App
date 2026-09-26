import React from 'react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';
import MembraneMechanism from './MembraneMechanism';
import OsmosisMechanism from './OsmosisMechanism';

export default function MembraneBoard(props: BoardProps) {
  const par = boardPair(props);
  return (
    <BoardShell
      title="Membrana e transporte"
      subtitle="Gradiente, permeabilidade e energia determinam o transporte."
      condition={{ label: 'bicamada', value: 'seletiva' }}
      ariaLabel="Prancha ilustrada de membranas celulares e transporte"
      scene={<MembraneMechanism />}
      sceneFirst
      emphasis={par.emphasis}
      left={{
        label: 'Transporte passivo',
        headline: 'A favor do gradiente.',
        detail: 'Difusão simples, facilitada e osmose. A partícula desce a própria diferença de concentração; a célula não gasta energia.',
        formula: 'ΔG < 0 · sem ATP',
      }}
      right={{
        label: 'Transporte ativo',
        headline: 'Contra o gradiente.',
        detail: 'Exige acoplamento a uma fonte de energia: ATP no transporte ativo primário ou outro gradiente no secundário. A bomba Na⁺/K⁺ usa ATP diretamente.',
        formula: 'contra o gradiente · energia',
      }}
      leftState={par.leftState}
      rightState={par.rightState}
      leftSelected={par.leftSelected}
      rightSelected={par.rightSelected}
      onSelectLeft={par.selectLeft}
      onSelectRight={par.selectRight}
      equation={{ label: 'Bomba de Na⁺/K⁺', general: '3 Na⁺ saem', condition: 'por ATP', reduced: '2 K⁺ entram' }}
      supports={
        <>
          <OsmosisMechanism />
          <section className="vs-formula-note">
            <span className="vs-note-title">Não confundir</span>
            <strong>Facilitada ainda é passiva</strong>
            <p>Ter proteína no caminho não torna o transporte ativo. O que define é o sentido: enquanto for a favor do gradiente, não há gasto de ATP.</p>
          </section>
          <section className="vs-formula-note">
            <span className="vs-note-title">Osmose</span>
            <strong>Quem se move é a água</strong>
            <p>Considerando solutos não permeantes e a mesma pressão inicial, o fluxo líquido vai do meio hipotônico ao hipertônico. A pressão da parede vegetal pode equilibrar esse fluxo.</p>
          </section>
        </>
      }
      closing="o transporte depende da permeabilidade e do gradiente; o ativo precisa de uma fonte de energia."
    />
  );
}
