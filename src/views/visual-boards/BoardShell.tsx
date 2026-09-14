import React from 'react';
import { NODE_STATE_LABEL, type NodeState } from '../../lib/visualStudy';

/**
 * A composição que toda prancha compartilha: cabeçalho com a condição do
 * fenômeno, o par de conceitos que se contrastam, a cena no meio, e o fecho.
 *
 * O par esquerda/direita não é decoração de layout — é a forma como quase todo
 * conteúdo de prova se organiza (expansão/compressão, fotossíntese/respiração,
 * ácido/base, seno/cosseno). Amarrar os dois cartões aos dois primeiros nós do
 * mapa faz o estado de cada um vir da evidência já registrada, igual em todas
 * as pranchas, em vez de cada uma inventar a sua ligação.
 */
export interface ConceptSide {
  label: string;
  headline: string;
  detail: string;
  formula: string;
}

export interface BoardShellProps {
  kicker?: string;
  title: string;
  subtitle: string;
  condition: { label: string; value: string };
  left: ConceptSide;
  right: ConceptSide;
  leftState: NodeState;
  rightState: NodeState;
  onSelectLeft: () => void;
  onSelectRight: () => void;
  leftSelected: boolean;
  rightSelected: boolean;
  /** A cena do fenômeno. É o que muda de uma prancha para outra. */
  scene: React.ReactNode;
  /** Legendas sobrepostas à cena, quando ela tem sentido de movimento. */
  sceneNotes?: { up: string; down: string };
  emphasis?: 'esquerda' | 'direita' | 'nenhum';
  equation?: { label: string; general: string; condition: string; reduced: string };
  supports?: React.ReactNode;
  closing: string;
  ariaLabel: string;
}

export default function BoardShell({
  kicker = 'Prancha ilustrada', title, subtitle, condition,
  left, right, leftState, rightState,
  onSelectLeft, onSelectRight, leftSelected, rightSelected,
  scene, sceneNotes, emphasis = 'nenhum', equation, supports, closing, ariaLabel,
}: BoardShellProps) {
  return (
    <section className="vs-study-board" data-testid="visual-study-board" aria-label={ariaLabel}>
      <header className="vs-board-head">
        <div>
          <span className="vs-board-kicker">{kicker}</span>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <div className="vs-q-callout" aria-label={`${condition.label} ${condition.value}`}>
          <span>{condition.label}</span>
          <strong>{condition.value}</strong>
        </div>
      </header>

      <div className="vs-brush" aria-hidden="true" />

      <div className="vs-board-body">
        <ConceptCard side="expansion" data={left} state={leftState} selected={leftSelected} onSelect={onSelectLeft} />

        <div className="vs-piston-wrap" data-emphasis={emphasis === 'esquerda' ? 'expansao' : emphasis === 'direita' ? 'compressao' : 'nenhum'}>
          {scene}
          {sceneNotes && (
            <>
              <div className="vs-force-note vs-force-note--up">{sceneNotes.up}</div>
              <div className="vs-force-note vs-force-note--down">{sceneNotes.down}</div>
            </>
          )}
        </div>

        <ConceptCard side="compression" data={right} state={rightState} selected={rightSelected} onSelect={onSelectRight} />
      </div>

      {equation && (
        <div className="vs-equation-strip" aria-label={equation.label}>
          <span>{equation.label}</span>
          <strong>{equation.general}</strong>
          <i>{equation.condition}</i>
          <strong>{equation.reduced}</strong>
        </div>
      )}

      {supports && <div className="vs-support-grid">{supports}</div>}

      <footer className="vs-landscape">
        <svg className="vs-landscape-art" viewBox="0 0 640 170" aria-hidden="true" preserveAspectRatio="none">
          <path className="vs-hill vs-hill--far" d="M0 118 C 96 78, 168 96, 244 110 S 400 74, 486 92 S 592 116, 640 104 L640 170 L0 170 Z" />
          <path className="vs-hill vs-hill--near" d="M0 140 C 108 116, 190 132, 268 138 S 428 112, 520 128 S 604 144, 640 138 L640 170 L0 170 Z" />
        </svg>
        <p><strong>Ideia central:</strong> {closing}</p>
      </footer>
    </section>
  );
}

function ConceptCard({
  side, data, state, selected, onSelect,
}: {
  side: 'expansion' | 'compression';
  data: ConceptSide;
  state: NodeState;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={`vs-concept-card vs-concept-card--${side}${selected ? ' is-selected' : ''}`}
      data-state={state}
      onClick={onSelect}
    >
      <span className="vs-concept-label">{data.label}</span>
      <strong>{data.headline}</strong>
      <span>{data.detail}</span>
      <code>{data.formula}</code>
      <span className="vs-state-line"><span className="vs-swatch" />{NODE_STATE_LABEL[state]}</span>
    </button>
  );
}
