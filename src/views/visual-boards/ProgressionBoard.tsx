import React from 'react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';

/**
 * Termos de uma sequência com o passo entre eles marcado.
 *
 * PA e PG são a mesma pergunta feita de dois jeitos: o que se repete entre um
 * termo e o seguinte? Somar sempre a mesma coisa dá PA; multiplicar sempre pela
 * mesma coisa dá PG. Mostrar os dois com os mesmos cinco termos e o passo
 * escrito em cima torna a identificação — que é o passo em que o aluno erra,
 * antes de qualquer fórmula — uma leitura direta.
 */
function SequenceScene({ emphasis }: { emphasis: 'esquerda' | 'direita' | 'nenhum' }) {
  const geometrica = emphasis === 'direita';

  const termos = geometrica ? [3, 6, 12, 24, 48] : [3, 8, 13, 18, 23];
  const passo = geometrica ? '×2' : '+5';

  // Altura proporcional ao valor, com teto: na PG o quinto termo estouraria a
  // caixa e o desenho perderia os primeiros.
  const maxV = Math.max(...termos);
  const alturaDe = (v: number) => 20 + (v / maxV) * 92;

  return (
    <svg className="vs-piston vs-scene" viewBox="0 0 320 330" role="img" data-emphasis={emphasis}
      aria-label={geometrica
        ? 'Progressão geométrica: cada termo é o anterior multiplicado por dois'
        : 'Progressão aritmética: cada termo é o anterior somado a cinco'}>
      <line className="vs-axis" x1="28" y1="216" x2="298" y2="216" />

      {termos.map((v, i) => {
        const x = 44 + i * 52;
        const h = alturaDe(v);
        return (
          <g key={i} className="vs-seq-term">
            <rect x={x} y={216 - h} width="34" height={h} rx="4" />
            <text className="vs-seq-value" x={x + 17} y={216 - h - 8} textAnchor="middle">{v}</text>
            <text className="vs-seq-index" x={x + 17} y="234" textAnchor="middle">a{i + 1}</text>
          </g>
        );
      })}

      {/* O passo entre termos consecutivos: é o que define a progressão. */}
      {termos.slice(0, -1).map((_, i) => {
        const x = 44 + i * 52 + 34;
        return (
          <g key={`p${i}`} className="vs-seq-step">
            <path d={`M${x + 2} 252 L${x + 16} 252`} />
            <path className="vs-arrow" d={`M${x + 18} 252 l -7 -4 l 0 8 z`} />
            <text x={x + 9} y="270" textAnchor="middle">{passo}</text>
          </g>
        );
      })}

      <text className="vs-seq-tag" x="28" y="60">{geometrica ? 'PG · razão q = 2' : 'PA · razão r = 5'}</text>
      <text className="vs-scene-caption" x="160" y="300" textAnchor="middle">
        {geometrica ? 'aₙ = a₁ · qⁿ⁻¹' : 'aₙ = a₁ + (n−1)·r'}
      </text>
    </svg>
  );
}

export default function ProgressionBoard(props: BoardProps) {
  const par = boardPair(props);
  return (
    <BoardShell
      title="PA e PG"
      subtitle="A pergunta é sempre a mesma: o que se repete entre um termo e o próximo?"
      condition={{ label: 'o passo', value: '+ ou ×' }}
      ariaLabel="Prancha ilustrada de sequências: progressão aritmética e geométrica"
      scene={<SequenceScene emphasis={par.emphasis} />}
      sceneNotes={{ up: 'soma ↑', down: '↓ multiplica' }}
      emphasis={par.emphasis}
      left={{
        label: 'Progressão aritmética',
        headline: 'A diferença é constante.',
        detail: 'Cada termo é o anterior mais a razão. Os degraus sobem sempre na mesma altura, e a soma cresce como o quadrado do número de termos.',
        formula: 'aₙ = a₁ + (n−1)·r',
      }}
      right={{
        label: 'Progressão geométrica',
        headline: 'A razão é constante.',
        detail: 'Cada termo é o anterior vezes a razão. Com q > 1 dispara; com 0 < q < 1 encolhe e a soma infinita converge.',
        formula: 'aₙ = a₁ · qⁿ⁻¹',
      }}
      leftState={par.leftState}
      rightState={par.rightState}
      leftSelected={par.leftSelected}
      rightSelected={par.rightSelected}
      onSelectLeft={par.selectLeft}
      onSelectRight={par.selectRight}
      equation={{ label: 'Soma dos n termos', general: 'Sₙ = (a₁+aₙ)·n/2', condition: 'na PG', reduced: 'Sₙ = a₁(qⁿ−1)/(q−1)' }}
      supports={
        <>
          <section className="vs-formula-note">
            <span className="vs-note-title">Como identificar</span>
            <strong>Subtraia e divida</strong>
            <p>Diferença constante entre consecutivos? PA. Quociente constante? PG. Testar os dois leva cinco segundos e evita aplicar a fórmula errada.</p>
          </section>
          <section className="vs-formula-note">
            <span className="vs-note-title">PG infinita</span>
            <strong>Só converge com |q| &lt; 1</strong>
            <p>S = a₁/(1−q) vale apenas quando cada termo é menor que o anterior. Com q ≥ 1 a soma não tem limite — e a fórmula devolve um número sem sentido.</p>
          </section>
        </>
      }
      closing="identificar o passo antes de escolher a fórmula resolve o erro mais comum do tema, que é aplicar a razão certa na progressão errada."
    />
  );
}
