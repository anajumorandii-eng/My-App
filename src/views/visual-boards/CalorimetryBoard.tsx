import React from 'react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';
import { SceneNote } from './SceneNote';

/**
 * Curva de aquecimento da água, com os patamares onde a temperatura não sobe.
 *
 * A pergunta que o gráfico responde de imediato: se está recebendo calor, por
 * que a temperatura para de subir? Porque durante a mudança de estado a energia
 * vai romper ligações entre as moléculas, não acelerá-las. Os dois patamares —
 * fusão a 0 °C e ebulição a 100 °C — são calor latente; as rampas entre eles são
 * calor sensível. Ver o gráfico torna Q = mcΔT e Q = mL duas leituras da mesma
 * curva, em vez de duas fórmulas a escolher no chute.
 */
function HeatingScene({ emphasis }: { emphasis: 'esquerda' | 'direita' | 'nenhum' }) {
  const focoLatente = emphasis === 'direita';
  const x0 = 40, y0 = 250, larg = 248, alt = 186;

  // Eixo: temperatura de −40 a 140 °C; tempo em unidades de calor fornecido.
  const nX = (q: number) => x0 + (q / 10) * larg;
  const nY = (t: number) => y0 - ((t + 40) / 180) * alt;

  // Rampa (gelo) · patamar de fusão · rampa (água) · patamar de ebulição · rampa (vapor)
  const pontos = [
    [0, -40], [1.4, 0], [3.4, 0], [6, 100], [8.4, 100], [10, 140],
  ].map(([q, t]) => `${nX(q)},${nY(t)}`).join(' ');

  return (
    <svg className="vs-piston vs-scene" viewBox="0 0 320 330" role="img" data-emphasis={emphasis}
      aria-label="Curva de aquecimento da água: rampas de calor sensível separadas por dois patamares de calor latente, na fusão e na ebulição">
      <line className="vs-axis" x1={x0} y1={y0} x2={x0 + larg + 14} y2={y0} />
      <line className="vs-axis" x1={x0} y1={y0} x2={x0} y2={y0 - alt - 14} />
      <text className="vs-axis-label" x={x0 + larg + 16} y={y0 + 14}>Q</text>
      <text className="vs-axis-label" x={x0 - 14} y={y0 - alt - 16}>T</text>

      {/* Marcas das duas temperaturas de mudança de estado. */}
      {[0, 100].map((t) => (
        <g key={t} className="vs-temp-mark">
          <line x1={x0 - 5} y1={nY(t)} x2={x0 + larg} y2={nY(t)} strokeDasharray="3 5" />
          <text x={x0 - 9} y={nY(t) + 4} textAnchor="end">{t}°</text>
        </g>
      ))}

      {/* Os patamares: é onde a temperatura não muda apesar do calor entrando. */}
      <g className="vs-plateau" data-active={focoLatente ? 'true' : undefined}>
        <rect x={nX(1.4)} y={nY(0) - 7} width={nX(3.4) - nX(1.4)} height="14" />
        <rect x={nX(6)} y={nY(100) - 7} width={nX(8.4) - nX(6)} height="14" />
      </g>

      <polyline className="vs-heat-curve" points={pontos} />

      {/* Rótulos de estado, nas rampas. */}
      <g className="vs-phase-label" data-dim={focoLatente ? 'true' : undefined}>
        <text x={nX(0.6)} y={nY(-28)}>gelo</text>
        <text x={nX(4.6)} y={nY(38)}>água</text>
        <text x={nX(9.2)} y={nY(124)}>vapor</text>
      </g>

      <g className="vs-latent-label" data-active={focoLatente ? 'true' : undefined}>
        <text x={nX(2.4)} y={nY(0) - 16} textAnchor="middle">fusão</text>
        <text x={nX(7.2)} y={nY(100) - 16} textAnchor="middle">ebulição</text>
      </g>

      {/* O patamar é o ponto do capítulo: entra calor e a temperatura não sobe. */}
      <SceneNote text="aqui T não sobe" at={[nX(7.2), nY(100)]} to={[nX(4.4), nY(126)]} align="end" />
      <SceneNote text="aqui T sobe" at={[nX(4.6), nY(50)]} to={[nX(7.4), nY(28)]} align="start" />

      <text className="vs-scene-caption" x="160" y="292" textAnchor="middle">
        {focoLatente ? 'no patamar: Q = m·L · T não muda' : 'na rampa: Q = m·c·ΔT'}
      </text>
      <text className="vs-scene-caption" x="160" y="312" textAnchor="middle">
        {focoLatente ? 'a energia rompe ligações, não acelera' : 'a energia aumenta a agitação'}
      </text>
    </svg>
  );
}

export default function CalorimetryBoard(props: BoardProps) {
  const par = boardPair(props);
  return (
    <BoardShell
      title="Calor sensível e latente"
      subtitle="Se está recebendo calor, por que a temperatura para de subir?"
      condition={{ label: 'no patamar', value: 'ΔT = 0' }}
      ariaLabel="Prancha ilustrada de calorimetria: calor sensível e calor latente"
      scene={<HeatingScene emphasis={par.emphasis} />}
      sceneNotes={{ up: 'rampa ↑', down: '↓ patamar' }}
      emphasis={par.emphasis}
      left={{
        label: 'Calor sensível',
        headline: 'Muda a temperatura.',
        detail: 'A energia aumenta a agitação das moléculas dentro do mesmo estado físico. É a rampa do gráfico, e depende do calor específico do material.',
        formula: 'Q = m · c · ΔT',
      }}
      right={{
        label: 'Calor latente',
        headline: 'Muda o estado.',
        detail: 'A energia rompe as ligações entre as moléculas em vez de acelerá-las. A temperatura fica parada enquanto durar a mudança de fase.',
        formula: 'Q = m · L',
      }}
      leftState={par.leftState}
      rightState={par.rightState}
      leftSelected={par.leftSelected}
      rightSelected={par.rightSelected}
      onSelectLeft={par.selectLeft}
      onSelectRight={par.selectRight}
      equation={{ label: 'Água', general: 'L fusão = 80 cal/g', condition: 'contra', reduced: 'L vaporização = 540 cal/g' }}
      supports={
        <>
          <section className="vs-formula-note">
            <span className="vs-note-title">Por que a ebulição custa mais</span>
            <strong>540 contra 80 cal/g</strong>
            <p>Fundir só afrouxa a rede cristalina; vaporizar separa as moléculas por completo. O patamar de cima é o mais longo do gráfico, e não por acaso.</p>
          </section>
          <section className="vs-formula-note">
            <span className="vs-note-title">O erro de misturar</span>
            <strong>Some por etapa</strong>
            <p>Levar gelo a −20 °C até vapor exige cinco parcelas: três sensíveis e duas latentes. Aplicar uma fórmula só ao percurso inteiro é o erro clássico do tema.</p>
          </section>
        </>
      }
      closing="cada trecho do gráfico tem a sua fórmula, e o formato da curva já diz qual usar em cada um."
    />
  );
}
