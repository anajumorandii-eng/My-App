import React from 'react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';
import { SceneNote } from './SceneNote';

/**
 * Coluna de líquido com a pressão crescendo na profundidade, e dois corpos.
 *
 * Duas confusões convivem aqui. A primeira é achar que a pressão depende do
 * formato ou do volume do recipiente — ela depende só da profundidade, e é por
 * isso que a linha de pressão é horizontal. A segunda é achar que o empuxo
 * depende do peso do corpo; ele depende do volume submerso. Flutuar ou afundar
 * sai da comparação entre densidades, e a cena mostra os dois corpos no mesmo
 * líquido para que a comparação seja direta.
 */
function FluidScene({ emphasis }: { emphasis: 'esquerda' | 'direita' | 'nenhum' }) {
  const focoEmpuxo = emphasis === 'direita';
  const superficie = 96;
  const fundo = 258;

  return (
    <svg className="vs-piston vs-scene" viewBox="0 0 320 330" role="img" data-emphasis={emphasis}
      aria-label="Recipiente com líquido: a pressão cresce com a profundidade e o empuxo depende do volume submerso">
      {/* Recipiente e líquido. */}
      <rect className="vs-liquid" x="34" y={superficie} width="252" height={fundo - superficie} />
      <path className="vs-vessel" d={`M34 ${superficie - 16} L34 ${fundo} L286 ${fundo} L286 ${superficie - 16}`} />
      <line className="vs-surface" x1="34" y1={superficie} x2="286" y2={superficie} />

      {/* Pressão: cresce com a profundidade, e só com ela. */}
      <g className="vs-pressure" data-dim={focoEmpuxo ? 'true' : undefined}>
        {[0, 1, 2, 3].map((i) => {
          const y = superficie + 26 + i * 36;
          const larg = 10 + i * 13;
          return (
            <g key={i}>
              <path d={`M40 ${y} l ${larg} 0`} />
              <path className="vs-arrow" d={`M${40 + larg + 2} ${y} l -8 -4 l 0 8 z`} />
            </g>
          );
        })}
        <text x="40" y={superficie - 24}>p = p₀ + ρgh</text>
      </g>

      {/* Dois corpos: o que flutua e o que afunda, no mesmo líquido. */}
      <g className="vs-body vs-body--float" data-active={focoEmpuxo ? 'true' : undefined}>
        <rect x="150" y={superficie - 12} width="46" height="34" rx="4" />
        <text x="173" y={superficie + 10} textAnchor="middle">ρ &lt; ρ𝑓</text>
        <path className="vs-buoy" d={`M173 ${superficie + 40} L173 ${superficie + 26}`} />
        <path className="vs-arrow" d={`M173 ${superficie + 24} l -5 10 l 10 0 z`} />
        <text className="vs-buoy-label" x="173" y={superficie + 56} textAnchor="middle">E = P</text>
      </g>

      <g className="vs-body vs-body--sink" data-active={focoEmpuxo ? 'true' : undefined}>
        <rect x="228" y={fundo - 36} width="40" height="34" rx="4" />
        <text x="248" y={fundo - 14} textAnchor="middle">ρ &gt; ρ𝑓</text>
        <path className="vs-buoy" d={`M248 ${fundo - 62} L248 ${fundo - 48}`} />
        <path className="vs-arrow" d={`M248 ${fundo - 64} l -5 10 l 10 0 z`} />
        <text className="vs-buoy-label" x="248" y={fundo - 72} textAnchor="middle">E &lt; P</text>
      </g>

      {/* As setas de pressão crescem sozinhas; o que elas não contam é que o
          crescimento é da profundidade, não do volume acima. */}
      {/* Dentro do recipiente, no vão entre as setas de pressão e o corpo que
          afunda. Embaixo do vaso não cabe: ali já correm as duas legendas da
          cena, e o rótulo encostava nelas. */}
      <SceneNote text="só a profundidade" at={[92, superficie + 134]} to={[152, superficie + 150]} align="middle" />
      {focoEmpuxo && <SceneNote text="empuxo = líquido deslocado" at={[173, superficie + 34]} to={[186, superficie - 40]} align="start" />}

      <text className="vs-scene-caption" x="160" y="292" textAnchor="middle">
        {focoEmpuxo ? 'E = ρ𝑓 · V submerso · g' : 'a pressão depende só da profundidade'}
      </text>
      <text className="vs-scene-caption" x="160" y="312" textAnchor="middle">
        {focoEmpuxo ? 'quem decide é a densidade, não o peso' : 'o formato do recipiente não entra'}
      </text>
    </svg>
  );
}

export default function HydrostaticsBoard(props: BoardProps) {
  const par = boardPair(props);
  return (
    <BoardShell
      title="Pressão e empuxo"
      subtitle="Uma depende da profundidade; o outro, do volume submerso."
      condition={{ label: 'no fluido', value: 'ρgh' }}
      ariaLabel="Prancha ilustrada de hidrostática: pressão e empuxo"
      scene={<FluidScene emphasis={par.emphasis} />}
      sceneNotes={{ up: 'pressão ↑', down: '↓ empuxo' }}
      emphasis={par.emphasis}
      left={{
        label: 'Pressão hidrostática',
        headline: 'Cresce com a profundidade.',
        detail: 'Só a altura da coluna importa. Dois pontos na mesma profundidade têm a mesma pressão, mesmo em recipientes de formatos diferentes.',
        formula: 'p = p₀ + ρ·g·h',
      }}
      right={{
        label: 'Empuxo',
        headline: 'Vale o peso do líquido deslocado.',
        detail: 'Depende do volume submerso e da densidade do fluido — não da densidade nem do peso do corpo. Flutuar é o empuxo empatar com o peso.',
        formula: 'E = ρ𝑓 · V · g',
      }}
      leftState={par.leftState}
      rightState={par.rightState}
      leftSelected={par.leftSelected}
      rightSelected={par.rightSelected}
      onSelectLeft={par.selectLeft}
      onSelectRight={par.selectRight}
      equation={{ label: 'Flutua quando', general: 'E = P', condition: 'ou seja', reduced: 'ρcorpo < ρfluido' }}
      supports={
        <>
          <section className="vs-formula-note">
            <span className="vs-note-title">Paradoxo hidrostático</span>
            <strong>O formato não entra</strong>
            <p>Um tubo fino e uma piscina larga, à mesma profundidade, exercem a mesma pressão no fundo. O que pesa é a altura da coluna, não o volume total.</p>
          </section>
          <section className="vs-formula-note">
            <span className="vs-note-title">Por que o navio flutua</span>
            <strong>Densidade média</strong>
            <p>Aço afunda, navio de aço flutua: o casco encerra ar, e a densidade média do conjunto fica menor que a da água. O empuxo compara o corpo inteiro, não o material.</p>
          </section>
        </>
      }
      closing="pressão pergunta a que profundidade, empuxo pergunta quanto volume — misturar as duas perguntas é o erro que resolve metade dos exercícios errado."
    />
  );
}
