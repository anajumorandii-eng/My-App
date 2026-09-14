import React from 'react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';

/**
 * Malha única com os resistores em série e o mesmo circuito em paralelo.
 *
 * A regra decorada — "em série soma, em paralelo é o inverso da soma dos
 * inversos" — esconde o motivo. Em série há um caminho só, então a corrente é a
 * mesma em todo ponto e as tensões se repartem. Em paralelo há caminhos
 * alternativos, então a tensão é a mesma nos dois ramos e a corrente é que se
 * divide. Trocar entre os dois desenhos mostra que o que muda é o número de
 * caminhos, e todo o resto decorre disso.
 */
function CircuitScene({ emphasis }: { emphasis: 'esquerda' | 'direita' | 'nenhum' }) {
  const paralelo = emphasis === 'direita';

  // O rótulo é contra-rotacionado: girando junto com a caixa, o R₂ do ramo
  // vertical saía deitado e obrigava a virar a cabeça para ler.
  const Resistor = ({ x, y, rot = 0, label }: { x: number; y: number; rot?: number; label: string }) => (
    <g className="vs-resistor" transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x="-22" y="-10" width="44" height="20" rx="4" />
      <text x="0" y="5" textAnchor="middle" transform={`rotate(${-rot})`}>{label}</text>
    </g>
  );

  return (
    <svg className="vs-piston vs-scene" viewBox="0 0 320 330" role="img" data-emphasis={emphasis}
      aria-label={paralelo
        ? 'Circuito com dois resistores em paralelo: mesma tensão nos ramos e corrente dividida'
        : 'Circuito de malha única com dois resistores em série: mesma corrente e tensão repartida'}>
      {/* Bateria: traço longo é o polo positivo. */}
      <g className="vs-battery">
        <line x1="42" y1="122" x2="42" y2="152" />
        <line className="vs-battery--short" x1="58" y1="130" x2="58" y2="144" />
        <text x="50" y="176" textAnchor="middle">U</text>
      </g>

      {paralelo ? (
        <>
          <path className="vs-wire" d="M42 122 L42 74 L268 74 L268 122" />
          <path className="vs-wire" d="M58 152 L58 214 L268 214 L268 152" />
          <path className="vs-wire" d="M148 74 L148 106 M148 138 L148 214" />
          <path className="vs-wire" d="M226 74 L226 106 M226 138 L226 214" />
          <Resistor x={148} y={122} label="R₁" />
          <Resistor x={226} y={122} label="R₂" />
          <text className="vs-circuit-note" x="160" y="250" textAnchor="middle">mesma tensão · a corrente se divide</text>
          <text className="vs-circuit-note" x="160" y="270" textAnchor="middle">i = i₁ + i₂</text>
        </>
      ) : (
        <>
          <path className="vs-wire" d="M42 122 L42 74 L120 74 M180 74 L268 74 L268 190 L58 190 L58 152" />
          <Resistor x={150} y={74} label="R₁" />
          <path className="vs-wire" d="M268 116 L268 128" />
          <Resistor x={268} y={122} rot={90} label="R₂" />
          <text className="vs-circuit-note" x="160" y="250" textAnchor="middle">um caminho só · mesma corrente</text>
          <text className="vs-circuit-note" x="160" y="270" textAnchor="middle">U = U₁ + U₂</text>
        </>
      )}

      <text className="vs-scene-caption" x="160" y="300" textAnchor="middle">
        {paralelo ? 'Req = (R₁·R₂)/(R₁+R₂) · menor que cada um' : 'Req = R₁ + R₂'}
      </text>
    </svg>
  );
}

export default function CircuitBoard(props: BoardProps) {
  const par = boardPair(props);
  return (
    <BoardShell
      title="Série e paralelo"
      subtitle="O que muda é o número de caminhos. O resto decorre disso."
      condition={{ label: 'lei de Ohm', value: 'U = R·i' }}
      ariaLabel="Prancha ilustrada de circuitos de malha única"
      scene={<CircuitScene emphasis={par.emphasis} />}
      sceneNotes={{ up: 'série ↑', down: '↓ paralelo' }}
      emphasis={par.emphasis}
      left={{
        label: 'Em série',
        headline: 'Um caminho só.',
        detail: 'A corrente é a mesma em todo ponto da malha, e a tensão da fonte se reparte entre os resistores na proporção das resistências.',
        formula: 'i igual · U = U₁ + U₂ · Req = R₁ + R₂',
      }}
      right={{
        label: 'Em paralelo',
        headline: 'Caminhos alternativos.',
        detail: 'Os dois ramos ficam sob a mesma tensão, e a corrente se divide entre eles — mais pelo ramo de menor resistência.',
        formula: 'U igual · i = i₁ + i₂ · 1/Req = 1/R₁ + 1/R₂',
      }}
      leftState={par.leftState}
      rightState={par.rightState}
      leftSelected={par.leftSelected}
      rightSelected={par.rightSelected}
      onSelectLeft={par.selectLeft}
      onSelectRight={par.selectRight}
      equation={{ label: 'Resistência equivalente', general: 'série soma', condition: 'paralelo', reduced: 'menor que a menor' }}
      supports={
        <>
          <section className="vs-formula-note">
            <span className="vs-note-title">Conferência rápida</span>
            <strong>Paralelo sempre reduz</strong>
            <p>A equivalente em paralelo é menor que o menor dos resistores. Se der maior, a conta está errada — abrir um caminho novo nunca dificulta a passagem.</p>
          </section>
          <section className="vs-formula-note">
            <span className="vs-note-title">O que a lâmpada faz</span>
            <strong>Série apaga tudo</strong>
            <p>Queimar uma lâmpada em série abre o único caminho e apaga as outras. Em paralelo, os demais ramos continuam fechados — é por isso que a instalação da casa é em paralelo.</p>
          </section>
        </>
      }
      closing="identificar quantos caminhos a corrente tem responde, de uma vez, o que é igual e o que se divide no circuito."
    />
  );
}
