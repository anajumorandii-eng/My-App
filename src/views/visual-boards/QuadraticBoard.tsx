import React from 'react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';

/**
 * Parábola com as raízes, o vértice e o discriminante lido no desenho.
 *
 * O Δ costuma ser tratado como etapa mecânica da fórmula, quando é o que decide
 * a geometria: Δ > 0 corta o eixo duas vezes, Δ = 0 tangencia, Δ < 0 não toca.
 * Ver a parábola subir e perder as raízes torna o sinal do discriminante uma
 * leitura, não uma conta — e o vértice deixa de ser fórmula decorada quando se
 * vê que ele está sempre no meio das duas raízes.
 */
function ParabolaScene({ emphasis }: { emphasis: 'esquerda' | 'direita' | 'nenhum' }) {
  const semRaiz = emphasis === 'direita';

  const cx = 160, eixoY = 214, escala = 30;
  // y = x² + c: deslocar c para cima tira as raízes sem mudar a forma.
  const c = semRaiz ? 1.15 : -2.2;
  const px = (x: number) => cx + x * escala;
  const py = (y: number) => eixoY - y * escala;

  const pontos = Array.from({ length: 49 }, (_, i) => {
    const x = -3 + i / 8;
    return `${px(x)},${py(Math.min(5.2, x * x + c))}`;
  }).join(' ');

  const raiz = Math.sqrt(Math.max(0, -c));

  return (
    <svg className="vs-piston vs-scene" viewBox="0 0 320 330" role="img" data-emphasis={emphasis}
      aria-label={semRaiz
        ? 'Parábola inteiramente acima do eixo x, sem raízes reais, discriminante negativo'
        : 'Parábola cortando o eixo x em dois pontos, com o vértice entre as raízes'}>
      <line className="vs-axis" x1="24" y1={eixoY} x2="296" y2={eixoY} />
      <line className="vs-axis" x1={cx} y1="42" x2={cx} y2="272" />
      <text className="vs-axis-label" x="300" y={eixoY + 14}>x</text>
      <text className="vs-axis-label" x={cx - 12} y="40">y</text>

      <polyline className="vs-parabola" points={pontos} />

      {!semRaiz && (
        <g className="vs-roots">
          <circle cx={px(-raiz)} cy={eixoY} r="6" />
          <circle cx={px(raiz)} cy={eixoY} r="6" />
          <text x={px(-raiz)} y={eixoY + 22} textAnchor="middle">x′</text>
          <text x={px(raiz)} y={eixoY + 22} textAnchor="middle">x″</text>
        </g>
      )}

      {/* Vértice: sempre no meio das raízes, e é de onde sai −b/2a. */}
      <g className="vs-vertex">
        <circle cx={cx} cy={py(c)} r="6" />
        <line x1={cx} y1={py(c)} x2={cx} y2={eixoY} strokeDasharray="4 4" />
        <text x={cx + 12} y={py(c) + 4}>vértice</text>
      </g>

      <text className="vs-delta-tag" x="46" y="66">{semRaiz ? 'Δ < 0' : 'Δ > 0'}</text>
      <text className="vs-scene-caption" x="160" y="300" textAnchor="middle">
        {semRaiz ? 'não corta o eixo · sem raiz real' : 'corta em dois pontos · duas raízes'}
      </text>
    </svg>
  );
}

export default function QuadraticBoard(props: BoardProps) {
  const par = boardPair(props);
  return (
    <BoardShell
      title="Equação do 2º grau"
      subtitle="O discriminante é uma leitura do gráfico, não uma etapa da conta."
      condition={{ label: 'quando', value: 'a > 0' }}
      ariaLabel="Prancha ilustrada de equações do segundo grau e da parábola"
      scene={<ParabolaScene emphasis={par.emphasis} />}
      sceneNotes={{ up: 'duas raízes ↑', down: '↓ nenhuma' }}
      emphasis={par.emphasis}
      left={{
        label: 'Δ > 0',
        headline: 'Corta o eixo em dois pontos.',
        detail: 'Duas raízes reais distintas. O vértice fica abaixo do eixo quando a concavidade é para cima, exatamente no meio das raízes.',
        formula: 'x = (−b ± √Δ) / 2a',
      }}
      right={{
        label: 'Δ < 0',
        headline: 'Não toca o eixo.',
        detail: 'Nenhuma raiz real: a parábola fica inteira de um lado. Com a > 0 e Δ < 0, a expressão é positiva para todo x — o que resolve a inequação de imediato.',
        formula: 'sem raiz real · sinal constante',
      }}
      leftState={par.leftState}
      rightState={par.rightState}
      leftSelected={par.leftSelected}
      rightSelected={par.rightSelected}
      onSelectLeft={par.selectLeft}
      onSelectRight={par.selectRight}
      equation={{ label: 'Discriminante', general: 'Δ = b² − 4ac', condition: 'Δ = 0', reduced: 'tangencia o eixo' }}
      supports={
        <>
          <section className="vs-formula-note">
            <span className="vs-note-title">O vértice sem fórmula</span>
            <strong>Está no meio das raízes</strong>
            <p>xᵥ = (x′ + x″)/2, que é a mesma coisa que −b/2a pelas relações de Girard. Saber isso dispensa decorar a fórmula do vértice.</p>
          </section>
          <section className="vs-formula-note">
            <span className="vs-note-title">Estudo de sinal</span>
            <strong>Δ &lt; 0 resolve a inequação</strong>
            <p>Sem raiz real, a expressão não troca de sinal: basta olhar o coeficiente a. É a pergunta que a prova faz quando pede "para todo x real".</p>
          </section>
        </>
      }
      closing="Δ, vértice e raízes descrevem o mesmo desenho — quem enxerga a parábola resolve sem precisar da fórmula inteira."
    />
  );
}
