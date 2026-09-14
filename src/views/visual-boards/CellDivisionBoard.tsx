import React from 'react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';

/**
 * Mitose e meiose com a contagem de cromossomos visível em cada etapa.
 *
 * O que decora mal é "mitose faz duas células, meiose faz quatro". O número de
 * células é consequência; o que importa é o que acontece com a carga
 * cromossômica — mitose conserva (2n → 2n), meiose reduz pela metade (2n → n).
 * E a redução acontece na primeira divisão, não na segunda: é a separação dos
 * homólogos em MI que reduz, enquanto MII só separa cromátides, como a mitose.
 * Por isso a cena mostra os cromossomos, e não as células.
 */
function DivisionScene({ emphasis }: { emphasis: 'esquerda' | 'direita' | 'nenhum' }) {
  const meiose = emphasis === 'direita';

  const Celula = ({ x, y, r, n, label }: { x: number; y: number; r: number; n: 2 | 1; label?: string }) => (
    <g className="vs-cell" data-ploidia={n === 2 ? 'diploide' : 'haploide'}>
      <circle cx={x} cy={y} r={r} />
      {/* Um par de homólogos quando 2n, um só cromossomo quando n. */}
      <path className="vs-chromo vs-chromo--a" d={`M${x - (n === 2 ? 9 : 0)} ${y - 9} l0 18`} />
      {n === 2 && <path className="vs-chromo vs-chromo--b" d={`M${x + 9} ${y - 9} l0 18`} />}
      {label && <text className="vs-cell-label" x={x} y={y + r + 14} textAnchor="middle">{label}</text>}
    </g>
  );

  return (
    <svg className="vs-piston vs-scene" viewBox="0 0 320 330" role="img" data-emphasis={emphasis}
      aria-label={meiose
        ? 'Meiose: uma célula diploide origina quatro células haploides, com a redução ocorrendo na primeira divisão'
        : 'Mitose: uma célula diploide origina duas células diploides idênticas'}>
      <Celula x={54} y={150} r={26} n={2} label="2n" />

      <path className="vs-div-arrow" d="M86 150 L118 150" />
      <path className="vs-arrow" d="M120 150 l-10 -5 l0 10 z" />
      <text className="vs-div-stage" x="102" y="136" textAnchor="middle">{meiose ? 'MI' : 'mitose'}</text>

      {meiose ? (
        <>
          {/* Depois de MI já são haploides: a redução foi aqui. */}
          <Celula x={158} y={104} r={22} n={1} />
          <Celula x={158} y={196} r={22} n={1} />
          <text className="vs-reduction" x="158" y="150" textAnchor="middle">n</text>

          <path className="vs-div-arrow" d="M184 104 L212 104 M184 196 L212 196" />
          <path className="vs-arrow" d="M214 104 l-10 -5 l0 10 z" />
          <path className="vs-arrow" d="M214 196 l-10 -5 l0 10 z" />
          <text className="vs-div-stage" x="198" y="88" textAnchor="middle">MII</text>

          <Celula x={246} y={78} r={17} n={1} />
          <Celula x={246} y={130} r={17} n={1} />
          <Celula x={246} y={170} r={17} n={1} />
          <Celula x={246} y={222} r={17} n={1} />
          <text className="vs-cell-label" x="246" y="252" textAnchor="middle">4 × n</text>
        </>
      ) : (
        <>
          <Celula x={176} y={108} r={24} n={2} />
          <Celula x={176} y={192} r={24} n={2} />
          <text className="vs-cell-label" x="176" y="252" textAnchor="middle">2 × 2n · idênticas</text>
        </>
      )}

      <text className="vs-scene-caption" x="160" y="290" textAnchor="middle">
        {meiose ? '2n → n · a redução é em MI' : '2n → 2n · carga conservada'}
      </text>
      <text className="vs-scene-caption" x="160" y="310" textAnchor="middle">
        {meiose ? 'MII separa cromátides, como a mitose' : 'crescimento e reparo'}
      </text>
    </svg>
  );
}

export default function CellDivisionBoard(props: BoardProps) {
  const par = boardPair(props);
  return (
    <BoardShell
      title="Mitose e meiose"
      subtitle="O número de células é consequência. O que importa é a carga."
      condition={{ label: 'a pergunta', value: '2n ou n' }}
      ariaLabel="Prancha ilustrada de divisão celular"
      scene={<DivisionScene emphasis={par.emphasis} />}
      sceneNotes={{ up: 'conserva ↑', down: '↓ reduz' }}
      emphasis={par.emphasis}
      left={{
        label: 'Mitose',
        headline: 'Conserva a carga.',
        detail: 'Uma célula 2n gera duas células 2n geneticamente idênticas. É a divisão do crescimento, da regeneração e da reprodução assexuada.',
        formula: '2n → 2n · 2 células',
      }}
      right={{
        label: 'Meiose',
        headline: 'Reduz pela metade.',
        detail: 'Uma célula 2n gera quatro células n, com variabilidade. A redução ocorre na primeira divisão, quando os homólogos se separam.',
        formula: '2n → n · 4 células',
      }}
      leftState={par.leftState}
      rightState={par.rightState}
      leftSelected={par.leftSelected}
      rightSelected={par.rightSelected}
      onSelectLeft={par.selectLeft}
      onSelectRight={par.selectRight}
      equation={{ label: 'Onde reduz', general: 'MI separa homólogos', condition: 'MII', reduced: 'separa cromátides' }}
      supports={
        <>
          <section className="vs-formula-note">
            <span className="vs-note-title">A pegadinha da redução</span>
            <strong>É em MI, não em MII</strong>
            <p>Depois da primeira divisão as células já são haploides. A segunda separa cromátides-irmãs, exatamente como a mitose — por isso MII não reduz nada.</p>
          </section>
          <section className="vs-formula-note">
            <span className="vs-note-title">De onde vem a variabilidade</span>
            <strong>Permuta e segregação</strong>
            <p>O crossing-over na prófase I e a orientação aleatória dos pares na metáfase I. A meiose não só reduz: ela embaralha, e é isso que a torna útil à evolução.</p>
          </section>
        </>
      }
      closing="contar células distingue os dois processos por fora; contar cromossomos explica por que eles existem."
    />
  );
}
