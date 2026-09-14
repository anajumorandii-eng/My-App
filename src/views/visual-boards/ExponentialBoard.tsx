import React from 'react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';

/**
 * Curva exponencial contra a reta linear, no mesmo par de eixos.
 *
 * A diferença entre os dois modelos não é "uma cresce mais rápido": é o que se
 * conserva a cada passo. No linear, a diferença é constante — soma-se sempre a
 * mesma quantia. No exponencial, é a razão — multiplica-se sempre pelo mesmo
 * fator. Sobrepor as duas curvas mostra por que a exponencial começa abaixo e
 * ultrapassa: no início o fator multiplica pouca coisa.
 */
function GrowthScene({ emphasis }: { emphasis: 'esquerda' | 'direita' | 'nenhum' }) {
  const x0 = 38, y0 = 244, larg = 244, alt = 196;

  // Escalas escolhidas para que as duas curvas se cruzem dentro da área útil —
  // é o cruzamento que carrega a ideia, e fora do quadro ele se perde.
  const nX = (t: number) => x0 + (t / 6) * larg;
  const nY = (v: number) => y0 - (v / 64) * alt;

  const linear = Array.from({ length: 7 }, (_, t) => `${nX(t)},${nY(4 + t * 6)}`).join(' ');
  const expo = Array.from({ length: 25 }, (_, i) => {
    const t = i / 4;
    return `${nX(t)},${nY(Math.min(64, 2 ** t))}`;
  }).join(' ');

  const destaqueExp = emphasis === 'direita';

  return (
    <svg className="vs-piston vs-scene" viewBox="0 0 320 330" role="img" data-emphasis={emphasis}
      aria-label="Crescimento linear e exponencial no mesmo gráfico: a reta soma uma constante, a curva multiplica por um fator">
      <line className="vs-axis" x1={x0} y1={y0} x2={x0 + larg + 14} y2={y0} />
      <line className="vs-axis" x1={x0} y1={y0} x2={x0} y2={y0 - alt - 14} />
      <text className="vs-axis-label" x={x0 + larg + 16} y={y0 + 14}>t</text>
      <text className="vs-axis-label" x={x0 - 10} y={y0 - alt - 16}>y</text>

      <polyline className={`vs-curve vs-curve--linear${destaqueExp ? ' is-recessed' : ''}`} points={linear} />
      <polyline className={`vs-curve vs-curve--expo${destaqueExp ? ' is-emphasized' : ''}`} points={expo} />

      {/* Os rótulos ficam nas áreas vazias do quadro, não sobre o traço: no
          começo da reta (onde a exponencial ainda rasteja) e acima da curva
          (onde a reta já ficou para trás). Encostados na linha, os três textos
          disputavam o mesmo pedaço do gráfico. */}
      <g className="vs-step vs-step--linear" data-dim={destaqueExp ? 'true' : undefined}>
        <text x={nX(0.5)} y={nY(26)}>+6 a cada passo</text>
      </g>
      <g className="vs-step vs-step--expo" data-active={destaqueExp ? 'true' : undefined}>
        <text x={nX(2.6)} y={nY(58)}>×2 a cada passo</text>
      </g>

      {/* O cruzamento: onde multiplicar passa a valer mais que somar. O rótulo
          vai para o vão entre as duas curvas, à esquerda do ponto. */}
      <circle className="vs-crossing" cx={nX(4.32)} cy={nY(29.9)} r="5.5" />
      <text className="vs-crossing-label" x={nX(4.32) - 12} y={nY(29.9) + 20} textAnchor="end">ultrapassa aqui</text>

      <text className="vs-scene-caption" x="160" y="292" textAnchor="middle">linear soma · exponencial multiplica</text>
    </svg>
  );
}

export default function ExponentialBoard(props: BoardProps) {
  const par = boardPair(props);
  return (
    <BoardShell
      title="Linear e exponencial"
      subtitle="A diferença não é a velocidade — é o que se repete a cada passo."
      condition={{ label: 'por passo', value: '+ ou ×' }}
      ariaLabel="Prancha ilustrada do modelo exponencial comparado ao linear"
      scene={<GrowthScene emphasis={par.emphasis} />}
      sceneNotes={{ up: 'soma ↑', down: '↓ multiplica' }}
      emphasis={par.emphasis}
      left={{
        label: 'Crescimento linear',
        headline: 'Soma sempre a mesma quantia.',
        detail: 'A diferença entre dois termos consecutivos é constante. É a progressão aritmética, e o gráfico é uma reta.',
        formula: 'aₙ = a₁ + (n−1)·r',
      }}
      right={{
        label: 'Crescimento exponencial',
        headline: 'Multiplica sempre pelo mesmo fator.',
        detail: 'A razão entre dois termos consecutivos é constante. Começa devagar e ultrapassa qualquer reta, por menor que seja o fator.',
        formula: 'aₙ = a₁ · qⁿ⁻¹',
      }}
      leftState={par.leftState}
      rightState={par.rightState}
      leftSelected={par.leftSelected}
      rightSelected={par.rightSelected}
      onSelectLeft={par.selectLeft}
      onSelectRight={par.selectRight}
      equation={{ label: 'Tempo de dobra', general: 'q = 2', condition: 'então', reduced: 'dobra a cada período' }}
      supports={
        <>
          <section className="vs-formula-note">
            <span className="vs-note-title">Por que começa perdendo</span>
            <strong>Multiplicar pouco é pouco</strong>
            <p>Dobrar 2 dá 4; somar 6 a 4 dá 10. A exponencial só ultrapassa quando a base acumulada fica grande — e aí a distância cresce sem limite.</p>
          </section>
          <section className="vs-formula-note">
            <span className="vs-note-title">Onde aparece na prova</span>
            <strong>Juros, meia-vida, epidemia</strong>
            <p>Juros compostos, decaimento radioativo e contágio são o mesmo modelo. Muda o sinal do expoente: fator maior que 1 cresce, menor que 1 decai.</p>
          </section>
        </>
      }
      closing="identificar se o enunciado soma ou multiplica a cada período decide o modelo inteiro — e é a única leitura que o problema realmente exige."
    />
  );
}
