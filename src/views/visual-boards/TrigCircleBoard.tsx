import React from 'react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';

/**
 * Círculo trigonométrico com o ponto no arco e as duas projeções.
 *
 * Seno e cosseno deixam de ser "o de cima e o de baixo da fração" quando se vê
 * que são as duas coordenadas do mesmo ponto: cosseno no eixo horizontal, seno
 * no vertical. A relação fundamental então não é uma fórmula a decorar — é
 * Pitágoras no triângulo que as duas projeções formam com o raio 1.
 */
function TrigScene({ emphasis }: { emphasis: 'esquerda' | 'direita' | 'nenhum' }) {
  const cx = 158, cy = 168, r = 104;
  // 60° destaca o seno (projeção vertical maior), 30° o cosseno.
  const grau = emphasis === 'esquerda' ? 60 : emphasis === 'direita' ? 30 : 45;
  const rad = (grau * Math.PI) / 180;
  const px = cx + Math.cos(rad) * r;
  const py = cy - Math.sin(rad) * r;

  return (
    <svg className="vs-piston vs-scene" viewBox="0 0 320 330" role="img" data-emphasis={emphasis}
      aria-label={`Círculo trigonométrico de raio 1 com um ponto a ${grau} graus e as projeções de seno e cosseno`}>
      <circle className="vs-unit-circle" cx={cx} cy={cy} r={r} />
      <line className="vs-axis" x1={cx - r - 22} y1={cy} x2={cx + r + 22} y2={cy} />
      <line className="vs-axis" x1={cx} y1={cy - r - 22} x2={cx} y2={cy + r + 22} />

      {/* Arco do ângulo, junto ao centro. */}
      <path className="vs-angle-arc" d={`M${cx + 30} ${cy} A 30 30 0 0 0 ${cx + Math.cos(rad) * 30} ${cy - Math.sin(rad) * 30}`} />
      <text className="vs-angle-label" x={cx + 40} y={cy - 14}>{grau}°</text>

      {/* Raio 1 até o ponto: a hipotenusa do triângulo. */}
      <line className="vs-radius" x1={cx} y1={cy} x2={px} y2={py} />
      <circle className="vs-point" cx={px} cy={py} r="6" />

      {/* Projeções: seno sobe no eixo vertical, cosseno anda no horizontal. */}
      <line className="vs-proj vs-proj--sin" x1={px} y1={py} x2={px} y2={cy} />
      <line className="vs-proj vs-proj--cos" x1={px} y1={cy} x2={cx} y2={cy} />
      <line className="vs-proj vs-proj--sin vs-proj--ghost" x1={cx} y1={py} x2={px} y2={py} />

      <text className="vs-proj-label vs-proj-label--sin" x={cx - 12} y={py + 4} textAnchor="end">sen</text>
      <text className="vs-proj-label vs-proj-label--cos" x={(cx + px) / 2} y={cy + 20} textAnchor="middle">cos</text>
      <text className="vs-radius-label" x={(cx + px) / 2 - 16} y={(cy + py) / 2 - 6}>1</text>

      <text className="vs-scene-caption" x="160" y="306" textAnchor="middle">sen²θ + cos²θ = 1</text>
    </svg>
  );
}

export default function TrigCircleBoard(props: BoardProps) {
  const par = boardPair(props);
  return (
    <BoardShell
      title="Círculo trigonométrico"
      subtitle="Seno e cosseno são as duas coordenadas do mesmo ponto."
      condition={{ label: 'raio', value: '= 1' }}
      ariaLabel="Prancha ilustrada da relação fundamental da trigonometria"
      scene={<TrigScene emphasis={par.emphasis} />}
      sceneNotes={{ up: 'seno ↑', down: '↓ cosseno' }}
      emphasis={par.emphasis}
      left={{
        label: 'Seno',
        headline: 'A altura do ponto.',
        detail: 'Projeção no eixo vertical. Vale 0 em 0°, 1 em 90° — e nunca passa disso, porque o raio é 1.',
        formula: 'sen θ ∈ [−1, 1]',
      }}
      right={{
        label: 'Cosseno',
        headline: 'O avanço horizontal.',
        detail: 'Projeção no eixo horizontal. Começa em 1 e cai até 0 em 90°, no sentido oposto ao do seno.',
        formula: 'cos θ ∈ [−1, 1]',
      }}
      leftState={par.leftState}
      rightState={par.rightState}
      leftSelected={par.leftSelected}
      rightSelected={par.rightSelected}
      onSelectLeft={par.selectLeft}
      onSelectRight={par.selectRight}
      equation={{ label: 'Relação fundamental', general: 'sen²θ + cos²θ = 1', condition: 'raio 1', reduced: 'a² + b² = c²' }}
      supports={
        <>
          <section className="vs-formula-note">
            <span className="vs-note-title">Por que vale sempre</span>
            <strong>É o teorema de Pitágoras</strong>
            <p>Os catetos são as projeções e a hipotenusa é o raio. Com raio 1, a soma dos quadrados dá 1 em qualquer ângulo.</p>
          </section>
          <section className="vs-formula-note">
            <span className="vs-note-title">Valores notáveis</span>
            <strong>30° · 45° · 60°</strong>
            <p>sen 30° = cos 60° = 1/2. A simetria vem de trocar o ângulo pelo complementar, que troca as duas projeções.</p>
          </section>
        </>
      }
      closing="a relação fundamental não é uma identidade a decorar: é a distância do ponto ao centro, que num círculo de raio 1 vale 1 por definição."
    />
  );
}
