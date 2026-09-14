import React from 'react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';
import { SceneNote } from './SceneNote';

/**
 * Diagrama de entalpia como degrau entre reagentes e produtos.
 *
 * O sinal de ΔH é o que mais se erra, e quase sempre por ler o calor do ponto
 * de vista errado: exotérmica libera calor, então o sistema perde energia e ΔH
 * é negativo — mesmo que a vizinhança esquente. O degrau resolve isso sem
 * fórmula: se o produto está abaixo, o sistema desceu de energia. A barreira de
 * ativação aparece junto porque ser exotérmica não torna a reação espontânea ou
 * rápida, que é a segunda confusão do tema.
 */
function EnthalpyScene({ emphasis }: { emphasis: 'esquerda' | 'direita' | 'nenhum' }) {
  const endo = emphasis === 'direita';

  const yReag = endo ? 210 : 112;
  const yProd = endo ? 112 : 210;
  const yPico = Math.min(yReag, yProd) - 46;

  return (
    <svg className="vs-piston vs-scene" viewBox="0 0 320 330" role="img" data-emphasis={emphasis}
      aria-label={endo
        ? 'Diagrama de entalpia endotérmico: os produtos estão acima dos reagentes, delta H positivo'
        : 'Diagrama de entalpia exotérmico: os produtos estão abaixo dos reagentes, delta H negativo'}>
      <line className="vs-axis" x1="46" y1="272" x2="298" y2="272" />
      <line className="vs-axis" x1="46" y1="272" x2="46" y2="52" />
      <text className="vs-axis-label" x="30" y="60">H</text>
      <text className="vs-axis-label" x="290" y="292">caminho</text>

      {/* Patamares e o caminho com a barreira de ativação entre eles. */}
      <line className="vs-level-line" x1="62" y1={yReag} x2="132" y2={yReag} />
      <line className="vs-level-line" x1="214" y1={yProd} x2="286" y2={yProd} />
      <path className="vs-path-curve" d={`M132 ${yReag} C 158 ${yPico}, 188 ${yPico}, 214 ${yProd}`} />

      <text className="vs-level-name" x="62" y={yReag - 12}>reagentes</text>
      <text className="vs-level-name" x="214" y={yProd - 12}>produtos</text>

      {/* ΔH: a diferença entre os patamares, com o sinal que ela implica. */}
      <g className="vs-delta">
        <line x1="176" y1={yReag} x2="176" y2={yProd} strokeDasharray="4 4" />
        <line className="vs-tick" x1="168" y1={yReag} x2="184" y2={yReag} />
        <line className="vs-tick" x1="168" y1={yProd} x2="184" y2={yProd} />
        <text x="192" y={(yReag + yProd) / 2 + 4}>ΔH {endo ? '> 0' : '< 0'}</text>
      </g>

      {/* Ativação: existe nos dois casos, e não depende do sinal de ΔH. */}
      <g className="vs-activation">
        <line x1="120" y1={yReag} x2="120" y2={yPico} strokeDasharray="3 4" />
        <text x="104" y={(yReag + yPico) / 2} textAnchor="end">Ea</text>
      </g>

      {/* A pegadinha do tema: a barreira existe nos dois casos e não tem
          relação com o sinal de ΔH — reação exotérmica também precisa dela. */}
      <SceneNote text="Ea existe nos dois" at={[173, yPico + 4]} to={[266, 80]} align="end" />

      <text className="vs-scene-caption" x="172" y="312" textAnchor="middle">
        {endo ? 'o sistema absorve · a vizinhança esfria' : 'o sistema libera · a vizinhança esquenta'}
      </text>
    </svg>
  );
}

export default function ThermochemBoard(props: BoardProps) {
  const par = boardPair(props);
  return (
    <BoardShell
      title="Entalpia e o sinal de ΔH"
      subtitle="O sinal é do sistema, não de quem está sentindo o calor."
      condition={{ label: 'referência', value: 'o sistema' }}
      ariaLabel="Prancha ilustrada de termoquímica: entalpia, delta H e energia de ativação"
      scene={<EnthalpyScene emphasis={par.emphasis} />}
      sceneNotes={{ up: 'exotérmica ↑', down: '↓ endotérmica' }}
      emphasis={par.emphasis}
      left={{
        label: 'Exotérmica',
        headline: 'Os produtos ficam abaixo.',
        detail: 'O sistema perde energia para a vizinhança, que esquenta. Combustão e neutralização são os casos típicos.',
        formula: 'ΔH < 0 · Hprodutos < Hreagentes',
      }}
      right={{
        label: 'Endotérmica',
        headline: 'Os produtos ficam acima.',
        detail: 'O sistema absorve energia e a vizinhança esfria. Fotossíntese e a maioria das dissoluções de sal em água.',
        formula: 'ΔH > 0 · Hprodutos > Hreagentes',
      }}
      leftState={par.leftState}
      rightState={par.rightState}
      leftSelected={par.leftSelected}
      rightSelected={par.rightSelected}
      onSelectLeft={par.selectLeft}
      onSelectRight={par.selectRight}
      equation={{ label: 'Definição', general: 'ΔH = Hprod − Hreag', condition: 'exotérmica', reduced: 'ΔH < 0' }}
      supports={
        <>
          <section className="vs-formula-note">
            <span className="vs-note-title">A troca de sinal</span>
            <strong>Quem perde é o sistema</strong>
            <p>"Libera calor" e "ΔH negativo" dizem a mesma coisa de pontos de vista opostos. O sinal sempre se refere ao sistema — a mão que sente o frasco esquentar está na vizinhança.</p>
          </section>
          <section className="vs-formula-note">
            <span className="vs-note-title">Ea é outra coisa</span>
            <strong>Exotérmica ≠ rápida</strong>
            <p>A barreira de ativação decide a velocidade; o ΔH decide o saldo. Uma reação muito exotérmica pode não acontecer sem um empurrão inicial — é o caso do papel no ar.</p>
          </section>
        </>
      }
      closing="o degrau responde sozinho o que o sinal significa: produto embaixo, o sistema desceu de energia e liberou o que faltava."
    />
  );
}
