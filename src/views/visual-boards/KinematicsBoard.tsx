import React from 'react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';

/**
 * Gráfico de velocidade por tempo, com a área embaixo da curva marcada.
 *
 * O que separa MRU de MRUV é a inclinação: reta horizontal significa velocidade
 * constante, reta inclinada significa aceleração constante. Mas a informação
 * que a prova mais cobra está na área, não na linha — a área sob v×t é o
 * deslocamento, e é por isso que o MRUV dá a fórmula com t². Ver o retângulo
 * virar trapézio explica o termo quadrático sem precisar deduzi-lo.
 */
function KinematicsScene({ emphasis }: { emphasis: 'esquerda' | 'direita' | 'nenhum' }) {
  const acelerado = emphasis === 'direita';
  const x0 = 46, y0 = 232, larg = 226, alt = 168;

  const nX = (t: number) => x0 + (t / 6) * larg;
  const nY = (v: number) => y0 - (v / 12) * alt;

  // MRU: v constante em 5. MRUV: v = 2 + 1,5t, chegando a 11 em t=6.
  const v0 = acelerado ? 2 : 5;
  const vf = acelerado ? 11 : 5;

  return (
    <svg className="vs-piston vs-scene" viewBox="0 0 320 330" role="img" data-emphasis={emphasis}
      aria-label={acelerado
        ? 'Gráfico de velocidade por tempo em movimento acelerado: reta inclinada e área em trapézio'
        : 'Gráfico de velocidade por tempo em movimento uniforme: reta horizontal e área em retângulo'}>
      <line className="vs-axis" x1={x0} y1={y0} x2={x0 + larg + 16} y2={y0} />
      <line className="vs-axis" x1={x0} y1={y0} x2={x0} y2={y0 - alt - 16} />
      <text className="vs-axis-label" x={x0 + larg + 18} y={y0 + 14}>t</text>
      <text className="vs-axis-label" x={x0 - 12} y={y0 - alt - 18}>v</text>

      {/* Área sob a curva = deslocamento. É o ponto da prancha. */}
      <path className="vs-area" d={`M${nX(0)} ${y0} L${nX(0)} ${nY(v0)} L${nX(6)} ${nY(vf)} L${nX(6)} ${y0} Z`} />
      <text className="vs-area-label" x={nX(3)} y={y0 - 30} textAnchor="middle">Δs = área</text>

      <polyline className="vs-kin-line" points={`${nX(0)},${nY(v0)} ${nX(6)},${nY(vf)}`} />

      {/* A inclinação é a aceleração — zero no uniforme. */}
      {acelerado && (
        <g className="vs-slope">
          <line x1={nX(4)} y1={nY(8)} x2={nX(5.4)} y2={nY(8)} strokeDasharray="4 3" />
          <line x1={nX(5.4)} y1={nY(8)} x2={nX(5.4)} y2={nY(10.1)} strokeDasharray="4 3" />
          <text x={nX(5.6)} y={nY(9)}>a</text>
        </g>
      )}

      <text className="vs-kin-tag" x={x0 + 10} y={y0 - alt - 2}>{acelerado ? 'MRUV · a ≠ 0' : 'MRU · a = 0'}</text>
      <text className="vs-scene-caption" x="160" y="272" textAnchor="middle">
        {acelerado ? 'trapézio · Δs = v₀t + at²/2' : 'retângulo · Δs = v · t'}
      </text>
      <text className="vs-scene-caption" x="160" y="294" textAnchor="middle">a inclinação é a aceleração</text>
    </svg>
  );
}

export default function KinematicsBoard(props: BoardProps) {
  const par = boardPair(props);
  return (
    <BoardShell
      title="Velocidade por tempo"
      subtitle="A inclinação dá a aceleração; a área dá o deslocamento."
      condition={{ label: 'no gráfico', value: 'v × t' }}
      ariaLabel="Prancha ilustrada de cinemática: movimento uniforme e uniformemente variado"
      scene={<KinematicsScene emphasis={par.emphasis} />}
      sceneNotes={{ up: 'uniforme ↑', down: '↓ acelerado' }}
      emphasis={par.emphasis}
      left={{
        label: 'Movimento uniforme',
        headline: 'Reta horizontal.',
        detail: 'A velocidade não muda, então a aceleração é zero e a área sob o gráfico é um retângulo simples.',
        formula: 'a = 0 · Δs = v · t',
      }}
      right={{
        label: 'Uniformemente variado',
        headline: 'Reta inclinada.',
        detail: 'A aceleração é a inclinação, constante. A área vira trapézio — e é do triângulo em cima do retângulo que sai o termo com t².',
        formula: 'a ≠ 0 · Δs = v₀t + at²/2',
      }}
      leftState={par.leftState}
      rightState={par.rightState}
      leftSelected={par.leftSelected}
      rightSelected={par.rightSelected}
      onSelectLeft={par.selectLeft}
      onSelectRight={par.selectRight}
      equation={{ label: 'Leitura do gráfico', general: 'inclinação = a', condition: 'área', reduced: 'Δs' }}
      supports={
        <>
          <section className="vs-formula-note">
            <span className="vs-note-title">De onde vem o t²</span>
            <strong>O triângulo do trapézio</strong>
            <p>Retângulo v₀·t mais triângulo (at)·t/2. Somados, dão v₀t + at²/2 — a fórmula deixa de ser decorada quando se vê a figura.</p>
          </section>
          <section className="vs-formula-note">
            <span className="vs-note-title">Cuidado com o sinal</span>
            <strong>Área abaixo do eixo é negativa</strong>
            <p>Se a velocidade fica negativa, o móvel voltou: essa área subtrai do deslocamento. Distância percorrida e deslocamento deixam de coincidir.</p>
          </section>
        </>
      }
      closing="ler inclinação e área responde quase toda questão de cinemática sem substituir nada em fórmula."
    />
  );
}
