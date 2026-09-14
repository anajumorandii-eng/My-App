import React from 'react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';

/**
 * Potência e logaritmo como a mesma igualdade lida de dois lados.
 *
 * "Log é o expoente" é a definição, mas ela passa batida quando aparece só como
 * frase. A cena escreve a mesma relação duas vezes — 2³ = 8 e log₂8 = 3 — com
 * os três papéis (base, expoente, resultado) marcados em cores que se mantêm de
 * um lado ao outro. Quem enxerga que o log devolve o expoente que estava
 * escondido para de decorar as propriedades: elas viram as regras de potência
 * lidas ao contrário.
 */
function LogScene({ emphasis }: { emphasis: 'esquerda' | 'direita' | 'nenhum' }) {
  const ladoLog = emphasis === 'direita';

  return (
    <svg className="vs-piston vs-scene" viewBox="0 0 320 330" role="img" data-emphasis={emphasis}
      aria-label="A mesma relação escrita como potência, dois elevado a três igual a oito, e como logaritmo, log de oito na base dois igual a três">
      {/* Potência. */}
      <g className="vs-log-form" data-active={ladoLog ? undefined : 'true'}>
        <text className="vs-log-eq" x="160" y="88" textAnchor="middle">
          <tspan className="vs-role vs-role--base">2</tspan>
          <tspan className="vs-role vs-role--exp" dy="-10" fontSize="0.66em">3</tspan>
          <tspan dy="10"> = </tspan>
          <tspan className="vs-role vs-role--res">8</tspan>
        </text>
        <text className="vs-log-tag" x="160" y="112" textAnchor="middle">potência</text>
      </g>

      {/* A ponte entre as duas leituras. */}
      <g className="vs-log-bridge">
        <path d="M118 134 C 118 160, 202 160, 202 134" />
        <path className="vs-arrow" d="M202 134 l-5 10 l10 0 z" />
        <path className="vs-arrow" d="M118 134 l-5 10 l10 0 z" />
        <text x="160" y="176" textAnchor="middle">mesma igualdade</text>
      </g>

      {/* Logaritmo. */}
      <g className="vs-log-form" data-active={ladoLog ? 'true' : undefined}>
        <text className="vs-log-eq" x="160" y="230" textAnchor="middle">
          <tspan>log</tspan>
          <tspan className="vs-role vs-role--base" dy="7" fontSize="0.66em">2</tspan>
          <tspan className="vs-role vs-role--res" dy="-7"> 8</tspan>
          <tspan> = </tspan>
          <tspan className="vs-role vs-role--exp">3</tspan>
        </text>
        <text className="vs-log-tag" x="160" y="254" textAnchor="middle">logaritmo</text>
      </g>

      {/* Legenda dos três papéis, que é o que amarra as duas formas. */}
      <g className="vs-log-legend">
        <circle className="vs-role--base" cx="52" cy="290" r="5" />
        <text x="64" y="294">base</text>
        <circle className="vs-role--exp" cx="128" cy="290" r="5" />
        <text x="140" y="294">expoente</text>
        <circle className="vs-role--res" cx="230" cy="290" r="5" />
        <text x="242" y="294">resultado</text>
      </g>

      <text className="vs-scene-caption" x="160" y="46" textAnchor="middle">o log devolve o expoente</text>
    </svg>
  );
}

export default function LogarithmBoard(props: BoardProps) {
  const par = boardPair(props);
  return (
    <BoardShell
      title="Logaritmo é expoente"
      subtitle="A mesma igualdade, lida de dois lados."
      condition={{ label: 'sempre', value: 'base > 0' }}
      ariaLabel="Prancha ilustrada de logaritmos"
      scene={<LogScene emphasis={par.emphasis} />}
      sceneNotes={{ up: 'potência ↑', down: '↓ logaritmo' }}
      emphasis={par.emphasis}
      left={{
        label: 'Forma exponencial',
        headline: 'A base elevada ao expoente.',
        detail: 'Parte da base e do expoente para chegar ao resultado. É a leitura direta, e a que a maioria aprende primeiro.',
        formula: 'aˣ = b',
      }}
      right={{
        label: 'Forma logarítmica',
        headline: 'O expoente que faltava.',
        detail: 'Parte da base e do resultado para descobrir o expoente. Mesma relação, pergunta invertida — é isso e nada mais.',
        formula: 'logₐ b = x',
      }}
      leftState={par.leftState}
      rightState={par.rightState}
      leftSelected={par.leftSelected}
      rightSelected={par.rightSelected}
      onSelectLeft={par.selectLeft}
      onSelectRight={par.selectRight}
      equation={{ label: 'Equivalência', general: 'aˣ = b', condition: 'equivale a', reduced: 'logₐ b = x' }}
      supports={
        <>
          <section className="vs-formula-note">
            <span className="vs-note-title">As propriedades não são novas</span>
            <strong>São as de potência ao contrário</strong>
            <p>aˣ·aʸ = aˣ⁺ʸ vira log(mn) = log m + log n. Multiplicar por dentro é somar por fora, porque expoentes somam quando as potências multiplicam.</p>
          </section>
          <section className="vs-formula-note">
            <span className="vs-note-title">Condição de existência</span>
            <strong>Logaritmando &gt; 0</strong>
            <p>Não existe expoente que leve uma base positiva a um número negativo ou a zero. A base também precisa ser positiva e diferente de 1 — senão a potência não varia.</p>
          </section>
        </>
      }
      closing="quem lê log como «qual é o expoente» resolve a maioria das equações sem aplicar nenhuma propriedade decorada."
    />
  );
}
