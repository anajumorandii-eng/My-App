import React from 'react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';
import PhMechanism from './PhMechanism';
import AcidTheoryMechanism from './AcidTheoryMechanism';

export default function AcidBaseBoard(props: BoardProps) {
  const par = boardPair(props);
  return (
    <BoardShell
      title="Ácidos, bases e equações iônicas"
      subtitle="Compare transferência de próton, doação de par eletrônico e cancelamento de espectadores."
      condition={{ label: 'Compare', value: 'H⁺ / e⁻' }}
      ariaLabel="Prancha ilustrada de ácidos e bases e a escala de pH"
      scene={<AcidTheoryMechanism />}
      sceneFirst
      emphasis={par.emphasis}
      left={{
        label: 'Ácido',
        headline: 'Doa H⁺ ou recebe um par.',
        detail: 'Quanto mais H⁺, menor o pH. Um ácido forte ioniza quase por completo; um fraco, só em parte — a força é caracterizada pela constante de equilíbrio no solvente, e a fração ionizada também depende da concentração.',
        formula: 'pH < 7 · [H⁺] > 10⁻⁷',
      }}
      right={{
        label: 'Base',
        headline: 'Recebe H⁺ ou doa um par.',
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
          <PhMechanism />
          <section className="vs-formula-note">
            <span className="vs-note-title">O salto que engana</span>
            <strong>pH 3 versus pH 5: fator 100</strong>
            <p>A diferença de duas unidades corresponde a um fator 100 na concentração de H₃O⁺, na aproximação ideal. Diluição de ácido fraco exige considerar o equilíbrio; próximo da neutralidade, a autoionização da água também importa.</p>
          </section>
          <section className="vs-formula-note">
            <span className="vs-note-title">Forte não é concentrado</span>
            <strong>São coisas diferentes</strong>
            <p>A constante de equilíbrio caracteriza a força; concentração é quanto há na solução. Um ácido forte bem diluído pode ter pH maior que um fraco concentrado.</p>
          </section>
        </>
      }
      closing="identifique primeiro a teoria: próton em Brønsted–Lowry, par eletrônico em Lewis; na equação iônica, preserve apenas as espécies transformadas."
    />
  );
}
