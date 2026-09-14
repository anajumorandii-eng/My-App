import React from 'react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';

/**
 * Transferência de elétron contra compartilhamento, com o par visível.
 *
 * "Metal com ametal é iônica, ametal com ametal é covalente" funciona como
 * regra e falha como explicação. O que decide é a diferença de
 * eletronegatividade: grande o bastante, um átomo arranca o elétron do outro e
 * sobram dois íons que se atraem; pequena, os dois puxam com força parecida e
 * acabam dividindo o par. A cena mostra o elétron saindo em um caso e ficando
 * no meio no outro — e é daí que decorrem ponto de fusão, condução e
 * solubilidade, que a prova cobra mais que o nome da ligação.
 */
function BondScene({ emphasis }: { emphasis: 'esquerda' | 'direita' | 'nenhum' }) {
  const covalente = emphasis === 'direita';

  return (
    <svg className="vs-piston vs-scene" viewBox="0 0 320 330" role="img" data-emphasis={emphasis}
      aria-label={covalente
        ? 'Ligação covalente: dois átomos compartilhando um par de elétrons'
        : 'Ligação iônica: um átomo transfere o elétron para o outro e os dois íons se atraem'}>
      {/* Os dois átomos. Na iônica eles viram íons e mudam de tamanho. */}
      <g className="vs-atom vs-atom--left" data-carga={covalente ? undefined : 'positiva'}>
        <circle cx="96" cy="140" r={covalente ? 38 : 30} />
        <text className="vs-atom-symbol" x="96" y={146} textAnchor="middle">{covalente ? 'H' : 'Na'}</text>
        {!covalente && <text className="vs-atom-charge" x="128" y="112">+</text>}
      </g>

      <g className="vs-atom vs-atom--right" data-carga={covalente ? undefined : 'negativa'}>
        <circle cx="224" cy="140" r={covalente ? 38 : 44} />
        <text className="vs-atom-symbol" x="224" y={146} textAnchor="middle">{covalente ? 'H' : 'Cl'}</text>
        {!covalente && <text className="vs-atom-charge" x="262" y="106">−</text>}
      </g>

      {covalente ? (
        <>
          {/* Par compartilhado: dois elétrons no meio, pertencendo aos dois. */}
          <g className="vs-shared-pair">
            <circle cx="152" cy="140" r="6" />
            <circle cx="168" cy="140" r="6" />
            <path className="vs-overlap" d="M134 140 a 26 26 0 0 0 52 0 a 26 26 0 0 0 -52 0" />
          </g>
          <text className="vs-bond-note" x="160" y="200" textAnchor="middle">o par pertence aos dois</text>
        </>
      ) : (
        <>
          {/* Transferência: o elétron sai de um e chega ao outro. */}
          <g className="vs-transfer">
            <path d="M132 122 C 156 100, 190 100, 210 118" />
            <path className="vs-arrow" d="M210 118 l-11 -3 l3 11 z" />
            <circle className="vs-electron" cx="170" cy="104" r="6" />
            <text x="170" y="88" textAnchor="middle">e⁻</text>
          </g>
          <text className="vs-bond-note" x="160" y="200" textAnchor="middle">o elétron muda de dono</text>
        </>
      )}

      {/* A consequência macroscópica, que é o que a prova pergunta. */}
      <g className="vs-bond-outcome">
        <text x="160" y="240" textAnchor="middle">{covalente ? 'moléculas separadas' : 'retículo cristalino'}</text>
        <text x="160" y="260" textAnchor="middle">{covalente ? 'fusão baixa · não conduz' : 'fusão alta · conduz dissolvido'}</text>
      </g>

      <text className="vs-scene-caption" x="160" y="296" textAnchor="middle">
        {covalente ? 'ΔEletronegatividade pequena' : 'ΔEletronegatividade grande'}
      </text>
    </svg>
  );
}

export default function BondingBoard(props: BoardProps) {
  const par = boardPair(props);
  return (
    <BoardShell
      title="Iônica e covalente"
      subtitle="Quem decide é a diferença de eletronegatividade, não a tabela."
      condition={{ label: 'critério', value: 'Δ E.N.' }}
      ariaLabel="Prancha ilustrada de ligações químicas"
      scene={<BondScene emphasis={par.emphasis} />}
      sceneNotes={{ up: 'transfere ↑', down: '↓ compartilha' }}
      emphasis={par.emphasis}
      left={{
        label: 'Ligação iônica',
        headline: 'O elétron muda de dono.',
        detail: 'A diferença de eletronegatividade é grande o bastante para um átomo arrancar o elétron do outro. Sobram dois íons que se atraem num retículo.',
        formula: 'Δ > 1,7 · cátion + ânion',
      }}
      right={{
        label: 'Ligação covalente',
        headline: 'O par fica no meio.',
        detail: 'Os dois puxam com força parecida e dividem o par de elétrons. O resultado são moléculas discretas, não um retículo.',
        formula: 'Δ < 1,7 · par compartilhado',
      }}
      leftState={par.leftState}
      rightState={par.rightState}
      leftSelected={par.leftSelected}
      rightSelected={par.rightSelected}
      onSelectLeft={par.selectLeft}
      onSelectRight={par.selectRight}
      equation={{ label: 'O que decorre', general: 'retículo', condition: 'contra', reduced: 'moléculas' }}
      supports={
        <>
          <section className="vs-formula-note">
            <span className="vs-note-title">O que a prova pergunta</span>
            <strong>Fusão, condução, solubilidade</strong>
            <p>Iônico funde alto e conduz quando dissolvido ou fundido — não no sólido, onde os íons estão presos. Covalente molecular funde baixo e não conduz.</p>
          </section>
          <section className="vs-formula-note">
            <span className="vs-note-title">Não é uma fronteira</span>
            <strong>É um contínuo</strong>
            <p>O 1,7 é convenção. Ligações reais ficam entre os extremos: a covalente polar já tem o par puxado para um lado, e é isso que torna a água o solvente que é.</p>
          </section>
        </>
      }
      closing="a regra do metal com ametal acerta quase sempre porque metais têm eletronegatividade baixa — mas é a diferença, e não a posição na tabela, que decide."
    />
  );
}
