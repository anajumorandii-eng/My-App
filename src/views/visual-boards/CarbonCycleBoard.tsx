import React from 'react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';

/**
 * Reservatórios de carbono e os fluxos entre eles, com a seta fóssil separada.
 *
 * O ciclo do carbono é fechado há milhões de anos: fotossíntese retira,
 * respiração e decomposição devolvem, e o saldo se equilibra. O que a prancha
 * isola é a seta que não fazia parte desse equilíbrio — a queima de combustível
 * fóssil, que transfere carbono de um reservatório geológico, fora do ciclo
 * rápido, para a atmosfera. É essa assimetria que explica a alta registrada na curva
 * de Keeling, e não um aumento da respiração.
 */
function CarbonScene({ emphasis }: { emphasis: 'esquerda' | 'direita' | 'nenhum' }) {
  const fossilAtivo = emphasis === 'direita';

  return (
    <svg className="vs-piston vs-scene" viewBox="0 0 320 330" role="img" data-emphasis={emphasis}
      aria-label="Reservatórios de carbono na atmosfera, na biosfera e no subsolo, com os fluxos naturais e a emissão fóssil">
      {/* Atmosfera: o reservatório que recebe de todos. */}
      <g className="vs-reservoir vs-reservoir--air">
        <rect x="70" y="24" width="180" height="52" rx="16" />
        <text className="vs-res-name" x="160" y="47" textAnchor="middle">atmosfera</text>
        <text className="vs-res-value" x="160" y="65" textAnchor="middle">CO₂ · ~420 ppm em 2023</text>
      </g>

      {/* Biosfera: retira pela fotossíntese, devolve pela respiração. */}
      <g className="vs-reservoir vs-reservoir--bio">
        <rect x="24" y="150" width="124" height="52" rx="16" />
        <text className="vs-res-name" x="86" y="173" textAnchor="middle">biosfera</text>
        <text className="vs-res-value" x="86" y="191" textAnchor="middle">matéria orgânica</text>
      </g>

      {/* Reservatório geológico: só sai, e só porque alguém queima. */}
      <g className="vs-reservoir vs-reservoir--fossil" data-active={fossilAtivo ? 'true' : undefined}>
        <rect x="176" y="150" width="124" height="52" rx="16" />
        <text className="vs-res-name" x="238" y="173" textAnchor="middle">fóssil</text>
        <text className="vs-res-value" x="238" y="191" textAnchor="middle">carvão · petróleo</text>
      </g>

      {/* Fluxos naturais: os dois sentidos que se compensavam. */}
      <g className="vs-flow vs-flow--natural">
        <path d="M100 150 C 92 118, 96 96, 108 78" />
        <path className="vs-arrow" d="M108 78 l-7 10 l11 2 z" />
        <text x="58" y="116" textAnchor="middle">fotossíntese</text>
      </g>
      <g className="vs-flow vs-flow--natural">
        <path d="M134 78 C 142 100, 140 124, 132 150" />
        <path className="vs-arrow" d="M132 150 l6 -10 l-11 -2 z" />
        <text x="172" y="120" textAnchor="middle">respiração</text>
      </g>

      {/* Fluxo fóssil: mão única, e fora do equilíbrio antigo. */}
      <g className="vs-flow vs-flow--fossil" data-active={fossilAtivo ? 'true' : undefined}>
        <path d="M228 150 C 220 118, 218 96, 212 78" />
        <path className="vs-arrow" d="M212 78 l-8 9 l11 3 z" />
        <text x="272" y="118" textAnchor="middle">queima</text>
      </g>

      <text className="vs-scene-caption" x="160" y="250" textAnchor="middle">o ciclo fechava · a seta fóssil não fecha</text>
      <text className="vs-scene-caption" x="160" y="270" textAnchor="middle">pré-industrial ~280 → 2023 ~420 ppm</text>
    </svg>
  );
}

export default function CarbonCycleBoard(props: BoardProps) {
  const par = boardPair(props);
  return (
    <BoardShell
      title="Ciclo do carbono"
      subtitle="O ciclo fechava sozinho. Uma seta nova é que o desequilibrou."
      condition={{ label: 'Mauna Loa · 2023', value: '~420 ppm' }}
      ariaLabel="Prancha ilustrada do ciclo biogeoquímico do carbono"
      scene={<CarbonScene emphasis={par.emphasis} />}
      sceneNotes={{ up: 'entra ↑', down: '↓ sai' }}
      emphasis={par.emphasis}
      left={{
        label: 'Ciclo biológico',
        headline: 'Retira e devolve na mesma medida.',
        detail: 'Fotossíntese fixa o carbono, respiração e decomposição o devolvem. Em escala de décadas, o saldo tende a zero.',
        formula: 'fixação ≈ liberação',
      }}
      right={{
        label: 'Emissão fóssil',
        headline: 'Só devolve, nunca retira.',
        detail: 'Carbono que estava fora do ciclo há milhões de anos entra na atmosfera sem um fluxo de retorno equivalente.',
        formula: 'reservatório geológico → atmosfera',
      }}
      leftState={par.leftState}
      rightState={par.rightState}
      leftSelected={par.leftSelected}
      rightSelected={par.rightSelected}
      onSelectLeft={par.selectLeft}
      onSelectRight={par.selectRight}
      equation={{ label: 'Saldo atmosférico', general: 'entra − sai', condition: 'com queima', reduced: '> 0 · acumula' }}
      supports={
        <>
          <section className="vs-formula-note">
            <span className="vs-note-title">Erro de escala</span>
            <strong>Não é a respiração</strong>
            <p>Respiração e decomposição sempre devolveram CO₂ — e sempre tiveram contrapartida. O que mudou foi a entrada de um estoque que não participava do ciclo rápido.</p>
          </section>
          <section className="vs-formula-note">
            <span className="vs-note-title">A curva de Keeling</span>
            <strong>~280 → ~420 ppm</strong>
            <p>Marco pré-industrial e média anual de 2023 em Mauna Loa (NOAA Global Monitoring Laboratory). A medição contínua desde 1958 é serrilhada pelas estações do hemisfério norte, com tendência de alta sob o serrilhado.</p>
          </section>
        </>
      }
      closing="o problema não é existir fluxo de carbono para a atmosfera, é existir um fluxo sem retorno na mesma escala de tempo."
    />
  );
}
