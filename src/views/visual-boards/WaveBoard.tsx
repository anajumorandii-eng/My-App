import React from 'react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';

/**
 * Onda senoidal com comprimento e amplitude medidos no próprio traço.
 *
 * O erro que esta prancha existe para atacar é confundir amplitude com
 * comprimento de onda: ambos são "o tamanho da onda" para quem decorou a
 * fórmula sem ver a curva. Aqui as duas medidas aparecem em eixos diferentes —
 * λ na horizontal, entre cristas; A na vertical, do eixo à crista — e é o que
 * torna v = λf legível em vez de memorizado.
 */
function WaveScene({ emphasis }: { emphasis: 'esquerda' | 'direita' | 'nenhum' }) {
  // Comprimento e amplitude respondem ao cartão selecionado: comprimir λ com a
  // frequência alta e esticá-lo com a baixa mostra por que o produto λf fica
  // constante quando o meio não muda.
  const lambda = emphasis === 'esquerda' ? 150 : emphasis === 'direita' ? 75 : 110;
  const amp = 52;
  const y0 = 165;

  // Duas ondas completas a partir de x=40, desenhadas por curvas cúbicas: cada
  // meia onda é um C, e o passo é meio lambda.
  const meia = lambda / 2;
  let d = `M40 ${y0}`;
  for (let i = 0; i < 4; i += 1) {
    const sobe = i % 2 === 0;
    const x0 = 40 + i * meia;
    d += ` C ${x0 + meia * 0.36} ${y0 + (sobe ? -amp * 1.25 : amp * 1.25)},`
      + ` ${x0 + meia * 0.64} ${y0 + (sobe ? -amp * 1.25 : amp * 1.25)},`
      + ` ${x0 + meia} ${y0}`;
  }

  return (
    <svg className="vs-piston vs-scene" viewBox="0 0 320 330" role="img" data-emphasis={emphasis}
      aria-label="Onda senoidal com o comprimento de onda medido entre duas cristas e a amplitude medida do eixo até a crista">
      <line className="vs-axis" x1="24" y1={y0} x2="300" y2={y0} />
      <path className="vs-wave" d={d} />

      {/* λ entre duas cristas consecutivas — a distância que se repete. */}
      <g className="vs-measure">
        <line x1={40 + meia * 0.5} y1="74" x2={40 + meia * 2.5} y2="74" />
        <line className="vs-tick" x1={40 + meia * 0.5} y1="66" x2={40 + meia * 0.5} y2="82" />
        <line className="vs-tick" x1={40 + meia * 2.5} y1="66" x2={40 + meia * 2.5} y2="82" />
        <text x={40 + meia * 1.5} y="62" textAnchor="middle">λ</text>
      </g>

      {/* A do eixo até a crista — metade da altura total, e é aqui que se erra. */}
      <g className="vs-measure vs-measure--amp">
        <line x1="286" y1={y0} x2="286" y2={y0 - amp * 0.94} />
        <line className="vs-tick" x1="278" y1={y0} x2="294" y2={y0} />
        <line className="vs-tick" x1="278" y1={y0 - amp * 0.94} x2="294" y2={y0 - amp * 0.94} />
        <text x="302" y={y0 - amp * 0.4} textAnchor="middle">A</text>
      </g>

      <text className="vs-scene-caption" x="160" y="300" textAnchor="middle">v = λ · f</text>
    </svg>
  );
}

export default function WaveBoard(props: BoardProps) {
  const par = boardPair(props);
  return (
    <BoardShell
      title="Onda: comprimento e frequência"
      subtitle="Uma perturbação que transporta energia sem transportar matéria."
      condition={{ label: 'no mesmo meio', value: 'v fixa' }}
      ariaLabel="Prancha ilustrada de ondulatória"
      scene={<WaveScene emphasis={par.emphasis} />}
      sceneNotes={{ up: 'λ maior ↑', down: '↓ f maior' }}
      emphasis={par.emphasis}
      left={{
        label: 'Comprimento de onda',
        headline: 'A distância que se repete.',
        detail: 'Medida de uma crista à crista seguinte. Quanto maior λ, menor a frequência para a mesma velocidade.',
        formula: 'λ = v / f',
      }}
      right={{
        label: 'Frequência',
        headline: 'Quantas vezes por segundo.',
        detail: 'Depende da fonte, não do meio: ao mudar de meio a frequência se conserva e o comprimento é que se ajusta.',
        formula: 'f = 1 / T · [Hz]',
      }}
      leftState={par.leftState}
      rightState={par.rightState}
      leftSelected={par.leftSelected}
      rightSelected={par.rightSelected}
      onSelectLeft={par.selectLeft}
      onSelectRight={par.selectRight}
      equation={{ label: 'Equação fundamental', general: 'v = λ · f', condition: 'com v constante', reduced: 'λ ∝ 1/f' }}
      supports={
        <>
          <section className="vs-formula-note">
            <span className="vs-note-title">Não confundir</span>
            <strong>λ é horizontal</strong>
            <strong>A é vertical</strong>
            <p>A amplitude vai do eixo até a crista — não de crista a vale. Metade da altura total.</p>
          </section>
          <section className="vs-formula-note">
            <span className="vs-note-title">Ao mudar de meio</span>
            <strong>f se conserva</strong>
            <strong>v e λ mudam</strong>
            <p>Quem impõe a frequência é a fonte. O meio só altera a velocidade, e λ acompanha.</p>
          </section>
        </>
      }
      closing="a velocidade da onda é do meio, a frequência é da fonte, e o comprimento é o que sobra da razão entre as duas."
    />
  );
}
