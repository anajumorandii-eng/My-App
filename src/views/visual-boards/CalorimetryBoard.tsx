import {PhysicsDrawingWindow} from './PhysicsDrawingWindow';
import React, { useId } from 'react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';
import { SceneNote } from './SceneNote';

/**
 * Curva de aquecimento da água, com os patamares onde a temperatura não sobe.
 *
 * A pergunta que o gráfico responde de imediato: se está recebendo calor, por
 * que a temperatura para de subir? Porque durante a mudança de estado a energia
 * reorganiza interações intermoleculares. Os dois patamares —
 * fusão a 0 °C e ebulição a 100 °C — são calor latente; as rampas entre eles são
 * calor sensível. Ver o gráfico torna Q = mcΔT e Q = mL duas leituras da mesma
 * curva, em vez de duas fórmulas a escolher no chute.
 */
function HeatingScene({ emphasis }: { emphasis: 'esquerda' | 'direita' | 'nenhum' }) {
  const focoLatente = emphasis === 'direita';
  const x0 = 40, y0 = 250, larg = 248, alt = 186;

  // Eixo Q esquemático: comprimentos não representam razões de energia.
  const nX = (q: number) => x0 + (q / 10) * larg;
  const nY = (t: number) => y0 - ((t + 40) / 180) * alt;

  // Rampa (gelo) · patamar de fusão · rampa (água) · patamar de ebulição · rampa (vapor)
  const pontos = [
    [0, -40], [1.4, 0], [3.4, 0], [6, 100], [8.4, 100], [10, 140],
  ].map(([q, t]) => `${nX(q)},${nY(t)}`).join(' ');

  return (
    <svg className="vs-piston vs-scene" viewBox="0 0 320 370" role="img" data-emphasis={emphasis}
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
      <g className="vs-phase-label">
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
        {focoLatente ? 'a energia reorganiza as interações' : 'a energia aumenta a agitação'}
      </text>
      <text x="160" y="337" textAnchor="middle" fontSize="12">água pura a 1 atm · T em °C</text>
      <text x="160" y="356" textAnchor="middle" fontSize="12">Q em escala esquemática; não comparar larguras</text>
    </svg>
  );
}

function TransferScene() {
  const marker = `transfer-${useId().replace(/:/g, '')}`;
  const arrow = { stroke: 'var(--vs-burgundy)', strokeWidth: 2.5, fill: 'none', markerEnd: `url(#${marker})` };
  return <svg className="vs-plane vs-scene" viewBox="0 0 320 530" role="img" aria-label="Calor e temperatura: condução no sólido, convecção em fluido e irradiação no vácuo" style={{ fontSize: 13, fill: 'var(--vs-ink)' }}>
    <defs><marker id={marker} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--vs-burgundy)" /></marker></defs>
    <text x="160" y="25" textAnchor="middle" fontWeight="800">Temperatura: estado térmico · °C, K, °F</text>
    <text x="160" y="47" textAnchor="middle">Calor: energia em trânsito · J ou cal</text>
    <text x="160" y="70" textAnchor="middle">0 °C = 273,15 K = 32 °F</text>
    <text x="160" y="90" textAnchor="middle">TK = T°C + 273,15 · T°F = 1,8T°C + 32</text>
    <g data-heat-transfer="conduction">
      <text x="16" y="123" fontWeight="800">01 · Condução: contato no sólido</text>
      <rect x="35" y="160" width="250" height="40" rx="5" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="2" />
      {[52, 82, 112, 142, 172, 202, 232, 262].map((x, i) => <g key={x}>
        <circle cx={x} cy="180" r="4" fill="var(--vs-ink)" />
        <path d={`M${x-6} 172q-5 8 0 16M${x+6} 172q5 8 0 16`} fill="none" stroke="var(--vs-burgundy)" strokeWidth={i < 3 ? 2 : 1} />
      </g>)}
      <line x1="67" y1="146" x2="255" y2="146" {...arrow} />
      <text x="36" y="221">quente</text><text x="285" y="221" textAnchor="end">frio</text>
      <text x="160" y="240" textAnchor="middle">energia passa; matéria não circula</text>
    </g>
    <g data-heat-transfer="convection">
      <text x="16" y="274" fontWeight="800">02 · Convecção: fluido em circulação</text>
      <path d="M45 289V360H180V289" stroke="var(--vs-ink)" strokeWidth="3" fill="var(--vs-paper)" />
      <path d="M49 304Q85 299 112 304T177 304" stroke="var(--vs-ink)" fill="none" />
      <path d="M70 344V315Q98 294 153 315" {...arrow} />
      <path d="M153 320V344Q115 359 72 348" {...arrow} />
      <path d="M66 374q8-19 16 0q8-19 16 0q8-19 16 0q8-19 16 0" fill="none" stroke="var(--vs-burgundy)" strokeWidth="3" />
      <text x="194" y="315">quente sobe</text><text x="194" y="337">frio desce</text>
      <text x="194" y="359">gravidade ↓</text>
      <text x="160" y="395" textAnchor="middle">aquecido: menos denso · transporta matéria</text>
    </g>
    <g data-heat-transfer="radiation">
      <text x="16" y="427" fontWeight="800">03 · Irradiação: ondas eletromagnéticas</text>
      <circle cx="47" cy="469" r="17" stroke="var(--vs-burgundy)" strokeWidth="3" fill="var(--vs-paper)" />
      {[0,1,2,3,4,5,6,7].map(i => <path key={i} d="M47 446V439" transform={`rotate(${45*i} 47 469)`} stroke="var(--vs-burgundy)" strokeWidth="2" />)}
      <path d="M77 469q10-15 20 0t20 0t20 0t20 0t20 0t20 0t20 0h26" {...arrow} />
      <rect x="250" y="452" width="28" height="36" rx="3" stroke="var(--vs-ink)" fill="var(--vs-paper)" strokeWidth="2" />
      <text x="160" y="517" textAnchor="middle">atravessa o vácuo · dispensa meio material</text>
    </g>
  </svg>;
}

export default function CalorimetryBoard(props: BoardProps) {
  const par = boardPair(props);
  return (
    <BoardShell
      title="Calor, temperatura e transferência"
      subtitle="Temperatura descreve o estado; calor atravessa a fronteira entre corpos."
      condition={{ label: 'no patamar', value: 'ΔT = 0' }}
      ariaLabel="Prancha ilustrada de calorimetria: calor sensível e calor latente"
      scene={<div className="vs-instrument vs-calor-scenes"><PhysicsDrawingWindow><TransferScene /><HeatingScene emphasis={par.emphasis} /></PhysicsDrawingWindow></div>}
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
        detail: 'A energia reorganiza as interações entre as partículas durante a mudança de fase. A temperatura fica parada enquanto durar a mudança de fase.',
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
            <p>Na água a 1 atm, vaporizar exige mais energia por grama que fundir. São interações intermoleculares: as moléculas de água continuam intactas. A curva é esquemática e não mede a razão entre os calores latentes.</p>
          </section>
          <section className="vs-formula-note">
            <span className="vs-note-title">O erro de misturar</span>
            <strong>Some por etapa</strong>
            <p>Levar gelo a −20 °C até vapor a 140 °C, a 1 atm, exige cinco parcelas: três sensíveis e duas latentes. Aplicar uma fórmula só ao percurso inteiro é o erro clássico do tema.</p>
          </section>
        </>
      }
      closing="o calor flui do mais quente ao mais frio; temperatura não mede a quantidade total de energia de um corpo."
    />
  );
}
