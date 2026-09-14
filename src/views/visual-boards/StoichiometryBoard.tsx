import React from 'react';
import BoardShell from './BoardShell';
import { boardPair } from './pair';
import type { BoardProps } from './types';

/**
 * Balança com os dois pratos de uma reação e as caixas de proporção.
 *
 * As leis ponderais dizem duas coisas que se confundem: Lavoisier fala da massa
 * total (conserva), Proust fala da razão entre os reagentes (é fixa). A balança
 * mostra a primeira; as caixas empilhadas mostram a segunda. Dobrar um lado sem
 * dobrar o outro é exatamente o que produz reagente em excesso — que é o que a
 * prova costuma cobrar, e não o cálculo em si.
 */
function ScaleScene({ emphasis }: { emphasis: 'esquerda' | 'direita' | 'nenhum' }) {
  // Em "excesso", um dos reagentes é dobrado e sobra: a balança continua
  // equilibrada em massa, mas a proporção deixa de ser a da reação.
  const excesso = emphasis === 'direita';
  const unidadesH = excesso ? 4 : 2;

  return (
    <svg className="vs-piston vs-scene" viewBox="0 0 320 330" role="img" data-emphasis={emphasis}
      aria-label="Balança equilibrada entre reagentes e produtos, com as proporções fixas da reação e o reagente em excesso">
      {/* Balança: travessão, pratos e coluna. */}
      <g className="vs-scale">
        <line className="vs-beam" x1="52" y1="96" x2="268" y2="96" />
        <line className="vs-column" x1="160" y1="96" x2="160" y2="182" />
        <path className="vs-base" d="M124 182 L196 182 L188 194 L132 194 Z" />
        <line className="vs-hang" x1="80" y1="96" x2="80" y2="124" />
        <line className="vs-hang" x1="240" y1="96" x2="240" y2="124" />
        <path className="vs-pan" d="M46 124 L114 124 L100 146 L60 146 Z" />
        <path className="vs-pan" d="M206 124 L274 124 L260 146 L220 146 Z" />
      </g>

      <text className="vs-pan-label" x="80" y="166" textAnchor="middle">reagentes</text>
      <text className="vs-pan-label" x="240" y="166" textAnchor="middle">produtos</text>

      {/* Proporção fixa: cada caixa é uma unidade de mol. */}
      <g className="vs-mol-stack">
        {Array.from({ length: unidadesH }, (_, i) => (
          <rect key={`h${i}`} className="vs-mol vs-mol--h" x={52 + (i % 2) * 22} y={54 - Math.floor(i / 2) * 22} width="18" height="18" rx="4" />
        ))}
        <text className="vs-mol-label" x="62" y="28">H₂</text>

        <rect className="vs-mol vs-mol--o" x="102" y="54" width="18" height="18" rx="4" />
        <text className="vs-mol-label" x="111" y="46">O₂</text>

        {Array.from({ length: 2 }, (_, i) => (
          <rect key={`w${i}`} className="vs-mol vs-mol--w" x={228 + i * 22} y="54" width="18" height="18" rx="4" />
        ))}
        <text className="vs-mol-label" x="249" y="46">H₂O</text>
      </g>

      {/* O que sobra quando a proporção é quebrada. */}
      {excesso && (
        <g className="vs-excess">
          <rect x="44" y="206" width="90" height="34" rx="10" />
          <text x="89" y="222" textAnchor="middle">sobra H₂</text>
          <text x="89" y="234" textAnchor="middle">2 mol em excesso</text>
        </g>
      )}

      <text className="vs-equation-inline" x="160" y="266" textAnchor="middle">2 H₂ + 1 O₂ → 2 H₂O</text>
      <text className="vs-scene-caption" x="160" y="292" textAnchor="middle">
        {excesso ? 'massa conserva · proporção não' : 'massa conserva · proporção fixa'}
      </text>
    </svg>
  );
}

export default function StoichiometryBoard(props: BoardProps) {
  const par = boardPair(props);
  return (
    <BoardShell
      title="Leis ponderais"
      subtitle="Uma lei fala da massa total; a outra, da razão entre as partes."
      condition={{ label: 'sistema', value: 'fechado' }}
      ariaLabel="Prancha ilustrada das leis ponderais e da estequiometria"
      scene={<ScaleScene emphasis={par.emphasis} />}
      sceneNotes={{ up: 'proporção certa ↑', down: '↓ com excesso' }}
      emphasis={par.emphasis}
      left={{
        label: 'Lavoisier',
        headline: 'A massa total se conserva.',
        detail: 'Num sistema fechado, a soma das massas dos reagentes é igual à dos produtos. Nada se perde — inclusive o gás que escapa se o sistema for aberto.',
        formula: 'Σ m(reagentes) = Σ m(produtos)',
      }}
      right={{
        label: 'Proust',
        headline: 'A proporção é sempre a mesma.',
        detail: 'Uma substância tem composição fixa. Dobrar só um reagente não dobra o produto: o outro acaba antes e limita a reação.',
        formula: 'm₁ / m₂ = constante',
      }}
      leftState={par.leftState}
      rightState={par.rightState}
      leftSelected={par.leftSelected}
      rightSelected={par.rightSelected}
      onSelectLeft={par.selectLeft}
      onSelectRight={par.selectRight}
      equation={{ label: 'Reagente limitante', general: 'quem acaba primeiro', condition: 'define', reduced: 'o rendimento' }}
      supports={
        <>
          <section className="vs-formula-note">
            <span className="vs-note-title">O passo que a prova cobra</span>
            <strong>Achar o limitante</strong>
            <p>Divida a quantidade de cada reagente pelo seu coeficiente. O menor resultado é o limitante — e é ele, não o mais pesado, que decide quanto se forma.</p>
          </section>
          <section className="vs-formula-note">
            <span className="vs-note-title">Sistema aberto</span>
            <strong>A massa parece sumir</strong>
            <p>Queimar papel numa balança aberta dá massa final menor porque CO₂ e vapor saem. Lavoisier continua valendo; o que falhou foi a fronteira do sistema.</p>
          </section>
        </>
      }
      closing="conservar a massa e manter a proporção são exigências diferentes — a balança pode equilibrar com um reagente sobrando no prato."
    />
  );
}
