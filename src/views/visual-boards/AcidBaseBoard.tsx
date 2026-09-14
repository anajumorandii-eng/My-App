import React from 'react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';

/**
 * Escala de pH com a natureza logarítmica marcada no próprio eixo.
 *
 * O erro que a escala linear esconde: pH 3 não é "um pouco mais ácido" que pH
 * 5 — é cem vezes mais. Cada unidade é um fator de dez, e é isso que torna a
 * diluição de ácido um problema de logaritmo e não de proporção. A cena marca
 * as concentrações em cada degrau justamente para que a distância visual
 * constante seja lida como um salto de dez, não de um.
 */
function PhScene({ emphasis }: { emphasis: 'esquerda' | 'direita' | 'nenhum' }) {
  const foco = emphasis === 'esquerda' ? 'acido' : emphasis === 'direita' ? 'base' : 'nenhum';
  const x0 = 34, larg = 252, y = 150;
  const nX = (ph: number) => x0 + (ph / 14) * larg;

  return (
    <svg className="vs-piston vs-scene" viewBox="0 0 320 330" role="img" data-emphasis={emphasis}
      aria-label="Escala de pH de 0 a 14, com cada unidade representando um fator de dez na concentração de íons hidrogênio">
      {/* Faixas: ácida, neutra, básica. */}
      <rect className="vs-ph-band vs-ph-band--acid" data-active={foco === 'acido' ? 'true' : undefined}
        x={nX(0)} y={y - 20} width={nX(7) - nX(0)} height="40" />
      <rect className="vs-ph-band vs-ph-band--base" data-active={foco === 'base' ? 'true' : undefined}
        x={nX(7)} y={y - 20} width={nX(14) - nX(7)} height="40" />
      <line className="vs-ph-neutral" x1={nX(7)} y1={y - 30} x2={nX(7)} y2={y + 30} />
      <text className="vs-ph-neutral-label" x={nX(7)} y={y - 38} textAnchor="middle">7 · neutro</text>

      {/* Marcas de pH inteiro. */}
      {Array.from({ length: 15 }, (_, i) => (
        <g key={i} className="vs-ph-tick">
          <line x1={nX(i)} y1={y + 20} x2={nX(i)} y2={y + (i % 7 === 0 ? 28 : 25)} />
          {i % 2 === 0 && <text x={nX(i)} y={y + 42} textAnchor="middle">{i}</text>}
        </g>
      ))}

      {/* A concentração em cada degrau: é o que revela o fator de dez. */}
      <g className="vs-ph-conc">
        {[1, 3, 5, 9, 11, 13].map((ph) => (
          <text key={ph} x={nX(ph)} y={y - 30} textAnchor="middle">10⁻{ph}</text>
        ))}
      </g>

      {/* Um salto de duas unidades, medido, para mostrar que vale 100×. */}
      <g className="vs-ph-jump">
        <line x1={nX(3)} y1={y + 62} x2={nX(5)} y2={y + 62} />
        <line className="vs-tick" x1={nX(3)} y1={y + 56} x2={nX(3)} y2={y + 68} />
        <line className="vs-tick" x1={nX(5)} y1={y + 56} x2={nX(5)} y2={y + 68} />
        <text x={nX(4)} y={y + 84} textAnchor="middle">2 unidades = 100×</text>
      </g>

      <text className="vs-ph-side" x={nX(1.2)} y={y + 6} textAnchor="middle">ácido</text>
      <text className="vs-ph-side" x={nX(12.8)} y={y + 6} textAnchor="middle">básico</text>

      <text className="vs-scene-caption" x="160" y="286" textAnchor="middle">cada unidade é um fator de 10</text>
      <text className="vs-scene-caption" x="160" y="306" textAnchor="middle">pH = −log[H⁺]</text>
    </svg>
  );
}

export default function AcidBaseBoard(props: BoardProps) {
  const par = boardPair(props);
  return (
    <BoardShell
      title="A escala de pH"
      subtitle="A escala é linear no papel e logarítmica na concentração."
      condition={{ label: 'a 25 °C', value: 'pH + pOH = 14' }}
      ariaLabel="Prancha ilustrada de ácidos e bases e a escala de pH"
      scene={<PhScene emphasis={par.emphasis} />}
      sceneNotes={{ up: 'ácido ↑', down: '↓ básico' }}
      emphasis={par.emphasis}
      left={{
        label: 'Ácido',
        headline: 'Libera H⁺ em solução.',
        detail: 'Quanto mais H⁺, menor o pH. Um ácido forte ioniza quase por completo; um fraco, só em parte — e é a fração ionizada, não a concentração, que define a força.',
        formula: 'pH < 7 · [H⁺] > 10⁻⁷',
      }}
      right={{
        label: 'Base',
        headline: 'Libera OH⁻ ou captura H⁺.',
        detail: 'Arrhenius exige liberar OH⁻; Brønsted-Lowry basta receber H⁺, o que explica a amônia ser básica sem ter hidroxila na fórmula.',
        formula: 'pH > 7 · [OH⁻] > 10⁻⁷',
      }}
      leftState={par.leftState}
      rightState={par.rightState}
      leftSelected={par.leftSelected}
      rightSelected={par.rightSelected}
      onSelectLeft={par.selectLeft}
      onSelectRight={par.selectRight}
      equation={{ label: 'Definição', general: 'pH = −log[H⁺]', condition: 'a 25 °C', reduced: 'pH + pOH = 14' }}
      supports={
        <>
          <section className="vs-formula-note">
            <span className="vs-note-title">O salto que engana</span>
            <strong>pH 3 é 100× pH 5</strong>
            <p>A distância no eixo é igual, a concentração não. Por isso diluir um ácido dez vezes só muda o pH em uma unidade — e nunca o leva além de 7.</p>
          </section>
          <section className="vs-formula-note">
            <span className="vs-note-title">Forte não é concentrado</span>
            <strong>São coisas diferentes</strong>
            <p>Força é o quanto ioniza; concentração é quanto há na solução. Um ácido forte bem diluído pode ter pH maior que um fraco concentrado.</p>
          </section>
        </>
      }
      closing="ler o pH como escala logarítmica transforma «mais ácido» numa conta de potência de dez, que é como a prova cobra."
    />
  );
}
