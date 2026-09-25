import React from 'react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';
import PhMechanism from './PhMechanism';

export default function AcidBaseBoard(props: BoardProps) {
  const par = boardPair(props);
  return (
    <BoardShell
      title="A escala de pH"
      subtitle="A escala é linear no papel e logarítmica na concentração."
      condition={{ label: 'a 25 °C', value: 'pH + pOH = 14' }}
      ariaLabel="Prancha ilustrada de ácidos e bases e a escala de pH"
      scene={<PhMechanism />}
      sceneFirst
      emphasis={par.emphasis}
      left={{
        label: 'Ácido',
        headline: 'Libera H⁺ em solução.',
        detail: 'Quanto mais H⁺, menor o pH. Um ácido forte ioniza quase por completo; um fraco, só em parte — e é a fração ionizada, não a concentração, que define a força.',
        formula: 'pH < 7 · [H⁺] > 10⁻⁷',
      }}
      right={{
        label: 'Base',
        headline: 'Libera OH⁻ ou captura H⁺.',
        detail: 'Arrhenius exige liberar OH⁻; Brønsted-Lowry basta receber H⁺, o que explica a amônia ser básica sem ter hidroxila na fórmula.',
        formula: 'pH > 7 · [OH⁻] > 10⁻⁷',
      }}
      leftState={par.leftState}
      rightState={par.rightState}
      leftSelected={par.leftSelected}
      rightSelected={par.rightSelected}
      onSelectLeft={par.selectLeft}
      onSelectRight={par.selectRight}
      equation={{ label: 'Definição', general: 'pH = −log[H⁺]', condition: 'a 25 °C', reduced: 'pH + pOH = 14' }}
      supports={
        <>
          <section className="vs-formula-note">
            <span className="vs-note-title">O salto que engana</span>
            <strong>pH 3: [H₃O⁺] 100× maior</strong>
            <p>A diferença de duas unidades corresponde a um fator 100 na concentração de H₃O⁺, na aproximação ideal. Diluição de ácido fraco exige considerar o equilíbrio; próximo da neutralidade, a autoionização da água também importa.</p>
          </section>
          <section className="vs-formula-note">
            <span className="vs-note-title">Forte não é concentrado</span>
            <strong>São coisas diferentes</strong>
            <p>Força é o quanto ioniza; concentração é quanto há na solução. Um ácido forte bem diluído pode ter pH maior que um fraco concentrado.</p>
          </section>
        </>
      }
      closing="ler o pH como escala logarítmica transforma «mais ácido» numa conta de potência de dez, que é como a prova cobra."
    />
  );
}
