import React, { useState } from 'react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';

function gcd(a: number, b: number): number {
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}

function simplify(a: number, b: number): string {
  const divisor = gcd(a, b);
  return `${a / divisor}/${b / divisor}`;
}

export default function ProbabilityPairsBoard(props: BoardProps) {
  const [upper, setUpper] = useState(5);
  const pair = boardPair(props);
  const values = Array.from({ length: upper - 2 }, (_, index) => index + 3);
  const favorable = values.flatMap((m) => values.map((n) => [m, n] as const)).filter(([m, n]) => gcd(m, n) > 1).length;
  const total = values.length ** 2;
  const cell = Math.min(38, 216 / values.length);
  const gridSize = cell * values.length;
  const x0 = (320 - gridSize) / 2;
  const y0 = 68;

  return <BoardShell
    kicker="Laboratório de probabilidade"
    title="Contagem sistemática e probabilidade"
    subtitle="Defina o universo, marque o critério e conte cada par ordenado uma vez."
    condition={{ label: 'universo', value: `${total} pares` }}
    ariaLabel="Prancha de contagem de pares ordenados e probabilidade"
    emphasis={pair.emphasis}
    scene={<div className="vs-instrument">
      <svg className="vs-plane" viewBox="0 0 320 350" role="img" aria-label={`Tabela de pares ordenados de 3 a ${upper}: ${favorable} favoráveis em ${total}`}>
        <text x="160" y="28" textAnchor="middle" fill="var(--vs-ink)" fontSize="13">pares (m,n) · mdc(m,n) &gt; 1</text>
        <text x="160" y="49" textAnchor="middle" fill="var(--vs-dim)" fontSize="11">coluna = n · linha = m</text>
        {values.map((m, row) => values.map((n, col) => {
          const favorableCell = gcd(m, n) > 1;
          return <g key={`${m}-${n}`}>
            <rect x={x0 + col * cell + 1} y={y0 + row * cell + 1} width={cell - 2} height={cell - 2} rx="4"
              fill={favorableCell ? 'color-mix(in srgb, var(--vs-burgundy) 24%, var(--vs-paper-strong))' : 'var(--vs-paper-strong)'}
              stroke={favorableCell ? 'var(--vs-burgundy)' : 'var(--vs-dim)'} strokeWidth={favorableCell ? 2 : 1} />
            <text x={x0 + (col + .5) * cell} y={y0 + (row + .5) * cell + 4} textAnchor="middle" fill="var(--vs-ink)" fontSize={values.length > 5 ? 10 : 12}>{m},{n}</text>
          </g>;
        }))}
        <text x="160" y="307" textAnchor="middle" fill="var(--vs-ink)" fontSize="14">{favorable} de {total} pares · {favorable}/{total} = {simplify(favorable, total)}</text>
        <text x="160" y="330" textAnchor="middle" fill="var(--vs-dim)" fontSize="11">(3,6) e (6,3) ocupam células distintas</text>
      </svg>
      <div className="vs-plane-controls"><div className="vs-plane-control">
        <label htmlFor="probability-upper"><strong>Limite superior: {upper}</strong><span>Ambas as coordenadas vão de 3 até esse número.</span></label>
        <input id="probability-upper" type="range" min="3" max="9" step="1" value={upper} onChange={(event) => setUpper(Number(event.target.value))} />
      </div></div>
      <dl className="vs-plane-readouts"><div data-pivot="true"><dt>Contagem</dt><dd>{favorable} de {total} pares favoráveis</dd></div><div><dt>Probabilidade</dt><dd>{favorable}/{total} = {simplify(favorable, total)}</dd></div></dl>
    </div>}
    left={{ label: 'Universo', headline: 'Cada célula é um par ordenado.', detail: 'A posição de m e n importa: (3,6) e (6,3) são resultados diferentes.', formula: `|Ω| = ${total}` }}
    right={{ label: 'Evento', headline: 'O divisor comum decide.', detail: 'Uma fração m/n é redutível quando mdc(m,n) > 1. A grade evita contar o mesmo par duas vezes.', formula: `|E| = ${favorable}` }}
    leftState={pair.leftState} rightState={pair.rightState} leftSelected={pair.leftSelected} rightSelected={pair.rightSelected}
    onSelectLeft={pair.selectLeft} onSelectRight={pair.selectRight}
    equation={{ label: 'Razão', general: 'P(E) = |E| / |Ω|', condition: 'mesma chance para cada par', reduced: `${favorable}/${total} = ${simplify(favorable, total)}` }}
    closing="A razão favoráveis/possíveis só vale quando cada par do universo tem a mesma chance de ocorrer."
  />;
}
