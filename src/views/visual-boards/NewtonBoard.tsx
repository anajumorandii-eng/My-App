import React from 'react';
import BoardShell from './BoardShell';
import { NewtonLab } from './MechanismLab';
import { boardPair } from './pair';
import type { BoardProps } from './types';

/**
 * As três leis desenhadas ao redor de um corpo central, radialmente — é o que
 * CLAUDE.md registra como a 27ª prancha. O código chegou a regredir para
 * <img src="newton-laws-atlas.webp">, o mesmo anti-padrão do pistão adiabático
 * (arquivo respondendo 200, decodificando, e ainda assim sem servir: não
 * acompanha tema, não reage ao nó selecionado). Esta é a cena autoral de
 * verdade; a 1ª lei fica ativa quando o par realça a esquerda, a 2ª quando
 * realça a direita, e a 3ª permanece neutra por não integrar o par
 * left/right — ela só aparece em `supports`.
 */
function NewtonRadial({ emphasis }: { emphasis: 'esquerda' | 'direita' | 'nenhum' }) {
  return (
    <svg
      className="vs-newton-radial"
      viewBox="0 0 320 320"
      role="img"
      data-emphasis={emphasis}
      aria-label="Três leis de Newton dispostas ao redor de um corpo central: inércia sem força resultante, dinâmica com força e aceleração, ação e reação entre dois corpos"
    >
      <defs>
        <marker id="vs-newton-arrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto">
          <path d="M0 0 L9 4.5 L0 9 Z" fill="currentColor" />
        </marker>
      </defs>

      <path className="vs-newton-spoke" d="M160 160 L160 84" />
      <path className="vs-newton-spoke" d="M160 160 L241 208" />
      <path className="vs-newton-spoke" d="M160 160 L79 208" />

      <circle className="vs-newton-hub" cx="160" cy="160" r="28" />
      <text className="vs-newton-hub-label" x="160" y="165" textAnchor="middle">m</text>

      <g className="vs-newton-panel vs-newton-panel--1" data-active={emphasis === 'esquerda' || undefined}>
        <rect className="vs-newton-block" x="138" y="54" width="44" height="28" rx="4" />
        <path className="vs-newton-inertia-path" d="M112 68 H208" />
        <text className="vs-newton-panel-title" x="160" y="34" textAnchor="middle">1ª lei · inércia</text>
        <text className="vs-newton-panel-sub" x="160" y="104" textAnchor="middle">ΣF = 0</text>
      </g>

      <g className="vs-newton-panel vs-newton-panel--2" data-active={emphasis === 'direita' || undefined}>
        <rect className="vs-newton-block" x="222" y="196" width="38" height="24" rx="4" />
        <line className="vs-newton-force" x1="260" y1="208" x2="294" y2="208" markerEnd="url(#vs-newton-arrow)" />
        <text className="vs-newton-panel-title" x="256" y="188" textAnchor="middle">F</text>
        <text className="vs-newton-panel-sub" x="241" y="240" textAnchor="middle">ΣF = m·a</text>
      </g>

      <g className="vs-newton-panel vs-newton-panel--3">
        <rect className="vs-newton-block" x="56" y="196" width="20" height="24" rx="3" />
        <rect className="vs-newton-block" x="84" y="196" width="20" height="24" rx="3" />
        <line className="vs-newton-force" x1="76" y1="208" x2="52" y2="208" markerEnd="url(#vs-newton-arrow)" />
        <line className="vs-newton-force" x1="84" y1="208" x2="108" y2="208" markerEnd="url(#vs-newton-arrow)" />
        <text className="vs-newton-panel-title" x="79" y="188" textAnchor="middle">3ª lei</text>
        <text className="vs-newton-panel-sub" x="79" y="240" textAnchor="middle">ação = reação</text>
      </g>
    </svg>
  );
}

export default function NewtonBoard(props: BoardProps) {
  const pair = boardPair(props);
  return (
    <BoardShell
      kicker="Mapa de relações"
      title="As Leis de Newton"
      subtitle="O movimento muda quando a força resultante deixa de ser nula."
      condition={{ label: 'ideia central', value: 'ΣF = m·a' }}
      ariaLabel="Prancha ilustrada das três leis de Newton"
      scene={<NewtonRadial emphasis={pair.emphasis} />}
      emphasis={pair.emphasis}
      left={{
        label: '1ª Lei · inércia',
        headline: 'Sem resultante, o estado se conserva.',
        detail: 'Repouso ou movimento retilíneo uniforme continuam enquanto nenhuma força resultante alterar o estado do corpo.',
        formula: 'ΣF = 0 → a = 0',
      }}
      right={{
        label: '2ª Lei · dinâmica',
        headline: 'A resultante produz aceleração.',
        detail: 'A direção da aceleração acompanha a força resultante; a massa mede a resistência à mudança do movimento.',
        formula: 'ΣF = m · a',
      }}
      leftState={pair.leftState}
      rightState={pair.rightState}
      leftSelected={pair.leftSelected}
      rightSelected={pair.rightSelected}
      onSelectLeft={pair.selectLeft}
      onSelectRight={pair.selectRight}
      equation={{ label: 'No elevador', general: 'N − P = m·a', condition: 'subindo', reduced: 'N > P' }}
      supports={
        <>
          <NewtonLab />
          <section className="vs-formula-note">
            <span className="vs-note-title">3ª Lei · ação e reação</span>
            <strong>Mesmo módulo, corpos diferentes</strong>
            <p>As forças do par têm sentidos opostos e não se anulam no diagrama de um único corpo.</p>
          </section>
          <section className="vs-formula-note">
            <span className="vs-note-title">Estratégia de prova</span>
            <strong>Isole o corpo primeiro</strong>
            <p>Desenhe apenas as forças que atuam nele, escolha o eixo e aplique a segunda lei em cada direção.</p>
          </section>
        </>
      }
      closing="as três leis formam um sistema: a primeira define o referencial, a segunda calcula a mudança e a terceira identifica a interação."
    />
  );
}
