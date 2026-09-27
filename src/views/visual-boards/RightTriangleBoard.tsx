import React, { useState } from 'react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';

const decimal = (value: number) => value.toFixed(2).replace('.', ',');

export default function RightTriangleBoard(props: BoardProps) {
  const [angle, setAngle] = useState(40);
  const pair = boardPair(props);
  const radians = angle * Math.PI / 180;
  const opposite = 5 * Math.sin(radians);
  const adjacent = 5 * Math.cos(radians);
  const x = 45 + 205 * Math.cos(radians);
  const y = 238 - 205 * Math.sin(radians);
  return <BoardShell
    kicker="Laboratório de trigonometria"
    title="Trigonometria no triângulo retângulo"
    subtitle="Seno, cosseno e tangente são razões entre lados definidos pelo ângulo escolhido."
    condition={{ label: 'hipotenusa', value: '5 unidades' }}
    ariaLabel="Prancha de razões trigonométricas no triângulo retângulo"
    emphasis={pair.emphasis}
    scene={<div className="vs-instrument">
      <svg className="vs-plane" viewBox="0 0 320 325" role="img" aria-label={`Triângulo retângulo com hipotenusa 5 e ângulo de ${angle} graus`}>
        <path d={`M45 238H${x}V${y}Z`} fill="color-mix(in srgb, var(--vs-blue) 9%, transparent)" stroke="var(--vs-ink)" strokeWidth="2.5" strokeLinejoin="round" />
        <path d={`M${x - 13} 238v-13h13`} fill="none" stroke="var(--vs-ink)" strokeWidth="2" />
        <path d={`M79 238A34 34 0 0 0 ${45 + Math.cos(radians) * 34} ${238 - Math.sin(radians) * 34}`} fill="none" stroke="var(--vs-burgundy)" strokeWidth="2" />
        <text x="72" y="218" fill="var(--vs-burgundy)" fontSize="13">{angle}°</text>
        <text x={(45 + x) / 2} y="258" textAnchor="middle" fill="var(--vs-blue)" fontSize="13">adj. {decimal(adjacent)}</text>
        <text x={Math.min(296, x + 9)} y={(238 + y) / 2} textAnchor={x > 270 ? 'end' : 'start'} fill="var(--vs-burgundy)" fontSize="13">op. {decimal(opposite)}</text>
        <text x={(45 + x) / 2 - 10} y={(238 + y) / 2 - 9} textAnchor="middle" fill="var(--vs-ink)" fontSize="13">hip. 5</text>
        <text x="160" y="300" textAnchor="middle" fill="var(--vs-dim)" fontSize="12">Ângulo muda os catetos; hipotenusa = 5.</text>
      </svg>
      <div className="vs-plane-controls"><div className="vs-plane-control">
        <label htmlFor="triangle-angle"><strong>Ângulo: {angle}°</strong><span>Observe a relação entre os catetos.</span></label>
        <input id="triangle-angle" type="range" min="20" max="70" step="10" value={angle} onChange={(event) => setAngle(Number(event.target.value))} />
      </div></div>
      <dl className="vs-plane-readouts"><div data-pivot="true"><dt>Seno</dt><dd>sen {angle}° = {decimal(opposite)}/5,00 = {decimal(Math.sin(radians))}</dd></div><div><dt>Cosseno</dt><dd>cos {angle}° = {decimal(adjacent)}/5,00 = {decimal(Math.cos(radians))}</dd></div><div><dt>Tangente</dt><dd>tg {angle}° = {decimal(opposite)}/{decimal(adjacent)} = {decimal(Math.tan(radians))}</dd></div></dl>
    </div>}
    left={{ label: 'Seno', headline: 'Oposto dividido pela hipotenusa.', detail: 'O cateto oposto fica diante do ângulo marcado. Quando o ângulo cresce, esse cateto também cresce.', formula: 'sen θ = oposto / hipotenusa' }}
    right={{ label: 'Cosseno', headline: 'Adjacente dividido pela hipotenusa.', detail: 'O cateto adjacente encosta no ângulo marcado. Ele diminui quando o ângulo aumenta.', formula: 'cos θ = adjacente / hipotenusa' }}
    leftState={pair.leftState} rightState={pair.rightState} leftSelected={pair.leftSelected} rightSelected={pair.rightSelected}
    onSelectLeft={pair.selectLeft} onSelectRight={pair.selectRight}
    equation={{ label: 'Razões', general: 'sen θ = oposto / hipotenusa', condition: 'tg θ', reduced: 'oposto / adjacente' }}
    closing="Identifique o ângulo primeiro; oposto e adjacente dependem da posição dele no triângulo."
  />;
}
