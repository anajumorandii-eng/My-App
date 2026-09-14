import React from 'react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';

/**
 * Bicamada lipídica com as duas formas de atravessá-la.
 *
 * O que separa transporte passivo de ativo não é o tipo de substância nem o
 * tamanho dela: é a direção em relação ao gradiente. A favor do gradiente, a
 * célula não gasta nada; contra ele, precisa de ATP. Por isso as duas setas
 * apontam para lados opostos e só uma carrega a moeda energética — e é o que
 * torna a bomba de sódio e potássio compreensível em vez de decorada.
 */
function MembraneScene({ emphasis }: { emphasis: 'esquerda' | 'direita' | 'nenhum' }) {
  const ativo = emphasis === 'direita';
  const topo = 118;      // topo da bicamada
  const fundo = 182;     // base da bicamada

  return (
    <svg className="vs-piston vs-scene" viewBox="0 0 320 330" role="img" data-emphasis={emphasis}
      aria-label="Bicamada lipídica com transporte passivo a favor do gradiente e transporte ativo contra ele, com gasto de ATP">
      {/* Concentração: mais partículas em cima, menos embaixo. É o gradiente. */}
      <g className="vs-gradient-dots" aria-hidden="true">
        {[[52, 40], [96, 62], [148, 36], [196, 58], [246, 42], [274, 70], [122, 84], [216, 88]].map(([x, y], i) => (
          <circle key={`a${i}`} cx={x} cy={y} r="5" />
        ))}
        {[[74, 246], [186, 262], [252, 240]].map(([x, y], i) => (
          <circle key={`b${i}`} cx={x} cy={y} r="5" />
        ))}
      </g>
      <text className="vs-conc-label" x="20" y="44">+</text>
      <text className="vs-conc-label" x="20" y="256">−</text>

      {/* Bicamada: cabeças polares nas duas faces, caudas no miolo. */}
      <rect className="vs-bilayer" x="16" y={topo} width="288" height={fundo - topo} />
      {Array.from({ length: 16 }, (_, i) => {
        const x = 26 + i * 18;
        return (
          <g key={i} className="vs-phospho">
            <circle cx={x} cy={topo + 9} r="7" />
            <line x1={x - 3} y1={topo + 16} x2={x - 3} y2={topo + 30} />
            <line x1={x + 3} y1={topo + 16} x2={x + 3} y2={topo + 30} />
            <circle cx={x} cy={fundo - 9} r="7" />
            <line x1={x - 3} y1={fundo - 16} x2={x - 3} y2={fundo - 30} />
            <line x1={x + 3} y1={fundo - 16} x2={x + 3} y2={fundo - 30} />
          </g>
        );
      })}

      {/* Passivo: desce com o gradiente, sem custo. */}
      <g className="vs-transport vs-transport--passive" data-dim={ativo ? 'true' : undefined}>
        <path d="M86 92 L86 210" />
        <path className="vs-arrow" d="M86 210 l-6 -11 l12 0 z" />
        <text x="86" y="82" textAnchor="middle">passivo</text>
      </g>

      {/* Ativo: sobe contra o gradiente, e a proteína carrega ATP. */}
      <g className="vs-transport vs-transport--active" data-active={ativo ? 'true' : undefined}>
        <rect className="vs-pump" x="198" y={topo - 10} width="40" height={fundo - topo + 20} rx="12" />
        <path d="M218 212 L218 96" />
        <path className="vs-arrow" d="M218 96 l-6 11 l12 0 z" />
        <text x="218" y="86" textAnchor="middle">ativo</text>
        <text className="vs-atp" x="264" y="158" textAnchor="middle">ATP</text>
      </g>

      <text className="vs-scene-caption" x="160" y="300" textAnchor="middle">a favor: grátis · contra: ATP</text>
    </svg>
  );
}

export default function MembraneBoard(props: BoardProps) {
  const par = boardPair(props);
  return (
    <BoardShell
      title="Membrana e transporte"
      subtitle="Quem decide o custo é a direção, não a substância."
      condition={{ label: 'bicamada', value: 'seletiva' }}
      ariaLabel="Prancha ilustrada de membranas celulares e transporte"
      scene={<MembraneScene emphasis={par.emphasis} />}
      sceneNotes={{ up: 'menos concentrado ↑', down: '↓ mais concentrado' }}
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
        detail: 'Exige proteína transportadora e ATP. É o que mantém o sódio fora e o potássio dentro, contra as duas tendências naturais.',
        formula: 'ΔG > 0 · com ATP',
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
          <section className="vs-formula-note">
            <span className="vs-note-title">Não confundir</span>
            <strong>Facilitada ainda é passiva</strong>
            <p>Ter proteína no caminho não torna o transporte ativo. O que define é o sentido: enquanto for a favor do gradiente, não há gasto de ATP.</p>
          </section>
          <section className="vs-formula-note">
            <span className="vs-note-title">Osmose</span>
            <strong>Quem se move é a água</strong>
            <p>Do meio menos concentrado em soluto para o mais concentrado — sentido oposto ao que a intuição sugere quando se pensa no soluto.</p>
          </section>
        </>
      }
      closing="a mesma substância atravessa a mesma membrana de graça ou a custo de ATP, e a única coisa que muda é o lado para onde ela vai."
    />
  );
}
