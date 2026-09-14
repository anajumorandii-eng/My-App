import React from 'react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';

/**
 * Dois béqueres com a mesma quantidade de soluto e volumes diferentes.
 *
 * Diluir é a operação que mais confunde porque duas grandezas se comportam de
 * modo oposto: o volume muda, a quantidade de soluto não. Daí vem C₁V₁ = C₂V₂ —
 * não como fórmula, mas como a constatação de que o produto é a própria massa
 * de soluto, que ninguém tirou nem colocou. A cena mantém o mesmo número de
 * partículas nos dois recipientes justamente para que isso fique visível.
 */
function SolutionScene({ emphasis }: { emphasis: 'esquerda' | 'direita' | 'nenhum' }) {
  const diluido = emphasis === 'direita';

  // Mesmas 8 partículas nos dois casos — é o ponto da prancha.
  const posConc: Array<[number, number]> = [
    [-24, -22], [4, -30], [26, -12], [-10, 0], [18, 10], [-28, 18], [8, 28], [30, 24],
  ];
  const posDil: Array<[number, number]> = [
    [-46, -34], [-8, -44], [36, -30], [-30, -6], [22, 2], [-42, 26], [6, 34], [44, 18],
  ];

  const Bequer = ({ cx, topo, larg, alt, rotulo, conc, pontos }: {
    cx: number; topo: number; larg: number; alt: number; rotulo: string; conc: string;
    pontos: Array<[number, number]>;
  }) => (
    <g className="vs-beaker">
      <path className="vs-beaker-wall" d={`M${cx - larg / 2} ${topo} L${cx - larg / 2} ${topo + alt} L${cx + larg / 2} ${topo + alt} L${cx + larg / 2} ${topo}`} />
      <rect className="vs-solution" x={cx - larg / 2 + 2} y={topo + 12} width={larg - 4} height={alt - 14} />
      {pontos.map(([dx, dy], i) => (
        <circle key={i} className="vs-solute" cx={cx + dx} cy={topo + alt / 2 + dy + 6} r="5" />
      ))}
      <text className="vs-beaker-label" x={cx} y={topo + alt + 20} textAnchor="middle">{rotulo}</text>
      <text className="vs-beaker-conc" x={cx} y={topo + alt + 36} textAnchor="middle">{conc}</text>
    </g>
  );

  return (
    <svg className="vs-piston vs-scene" viewBox="0 0 320 330" role="img" data-emphasis={emphasis}
      aria-label="Dois béqueres com a mesma quantidade de soluto: à esquerda em volume pequeno e concentrado, à direita em volume maior e diluído">
      <Bequer cx={82} topo={76} larg={92} alt={112} rotulo="V₁ = 100 mL" conc="C₁ = 2 mol/L" pontos={posConc} />
      <Bequer cx={228} topo={56} larg={126} alt={132} rotulo="V₂ = 200 mL" conc="C₂ = 1 mol/L" pontos={diluido ? posDil : posConc} />

      {/* A seta da diluição: entra solvente, não soluto. */}
      <g className="vs-dilute-arrow" data-active={diluido ? 'true' : undefined}>
        <path d="M136 132 L166 132" />
        <path className="vs-arrow" d="M168 132 l-10 -5 l0 10 z" />
        <text x="151" y="120" textAnchor="middle">+ H₂O</text>
      </g>

      <text className="vs-scene-caption" x="160" y="250" textAnchor="middle">as 8 partículas são as mesmas nos dois</text>
      <text className="vs-scene-caption" x="160" y="272" textAnchor="middle">muda o volume, não a quantidade</text>
      <text className="vs-mass-eq" x="160" y="302" textAnchor="middle">C₁V₁ = C₂V₂ = n soluto</text>
    </svg>
  );
}

export default function SolutionsBoard(props: BoardProps) {
  const par = boardPair(props);
  return (
    <BoardShell
      title="Concentração e diluição"
      subtitle="Diluir muda o volume. A quantidade de soluto fica onde estava."
      condition={{ label: 'conservado', value: 'n soluto' }}
      ariaLabel="Prancha ilustrada de dispersões: concentração e diluição"
      scene={<SolutionScene emphasis={par.emphasis} />}
      sceneNotes={{ up: 'concentrado ↑', down: '↓ diluído' }}
      emphasis={par.emphasis}
      left={{
        label: 'Concentração',
        headline: 'Quanto de soluto por volume.',
        detail: 'Razão entre a quantidade de soluto e o volume da solução — não do solvente. É a distinção que derruba metade dos cálculos.',
        formula: 'C = n / V',
      }}
      right={{
        label: 'Diluição',
        headline: 'Acrescenta solvente, só isso.',
        detail: 'O soluto continua o mesmo; o volume é que cresce. Por isso o produto C·V se conserva, e é dele que sai a fórmula.',
        formula: 'C₁V₁ = C₂V₂',
      }}
      leftState={par.leftState}
      rightState={par.rightState}
      leftSelected={par.leftSelected}
      rightSelected={par.rightSelected}
      onSelectLeft={par.selectLeft}
      onSelectRight={par.selectRight}
      equation={{ label: 'O que se conserva', general: 'C · V', condition: 'é', reduced: 'a quantidade de soluto' }}
      supports={
        <>
          <section className="vs-formula-note">
            <span className="vs-note-title">Volume da solução</span>
            <strong>Não é o do solvente</strong>
            <p>Dissolver sal em 100 mL de água não dá 100 mL de solução. A concentração usa o volume final, que é o que o balão volumétrico marca.</p>
          </section>
          <section className="vs-formula-note">
            <span className="vs-note-title">Mistura de soluções</span>
            <strong>Some os solutos</strong>
            <p>Juntar duas soluções do mesmo soluto: C₁V₁ + C₂V₂ = Cf·Vf. A mesma ideia da diluição — o soluto total não muda, só se redistribui.</p>
          </section>
        </>
      }
      closing="a fórmula da diluição não é uma regra nova: é dizer que ninguém tirou nem acrescentou soluto ao copo."
    />
  );
}
