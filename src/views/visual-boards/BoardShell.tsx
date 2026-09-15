import React, { useEffect, useState } from 'react';
import { SceneViewport } from './SceneViewport';
import { NODE_STATE_LABEL, type NodeState } from '../../lib/visualStudy';

/**
 * A composição que toda prancha compartilha: cabeçalho com a condição do
 * fenômeno, o par de conceitos que se contrastam, a cena no meio, e o fecho.
 *
 * No celular a prancha inteira vira um rolo muito longo — a cena, os dois
 * cartões, a tira de equação e os apoios, um atrás do outro. Por isso o conteúdo
 * se divide em duas faces alternáveis abaixo de 900px. São **duas**, e não as
 * três da referência, porque só há dois blocos de conteúdo com sentido próprio
 * aqui: uma terceira aba precisaria de conteúdo inventado para se justificar, e
 * estrutura que não codifica nada verdadeiro é enfeite.
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

type Face = 'essencial' | 'relacoes';

const FACE_LABEL: Record<Face, string> = { essencial: 'Essencial', relacoes: 'Relações' };

/**
 * Verdadeiro abaixo de 900px, o breakpoint móvel do projeto.
 *
 * Começa em `false` e só vira depois do primeiro efeito: no jsdom dos testes o
 * `matchMedia` devolve `matches: false`, e no servidor não existe. Assim a
 * prancha completa continua sendo o padrão em toda parte que não é um celular
 * de verdade.
 */
function useCompacto(): boolean {
  const [compacto, setCompacto] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const media = window.matchMedia('(max-width: 900px)');
    const aplicar = () => setCompacto(media.matches);
    aplicar();
    media.addEventListener?.('change', aplicar);
    return () => media.removeEventListener?.('change', aplicar);
  }, []);
  return compacto;
}

export default function BoardShell({
  kicker = 'Prancha ilustrada', title, subtitle, condition,
  left, right, leftState, rightState,
  onSelectLeft, onSelectRight, leftSelected, rightSelected,
  scene, sceneNotes, emphasis = 'nenhum', equation, supports, closing, ariaLabel,
}: BoardShellProps) {
  const compacto = useCompacto();
  const [face, setFace] = useState<Face>('essencial');
  // No desktop nada se esconde: as duas faces aparecem juntas, como sempre.
  const mostra = (alvo: Face) => !compacto || face === alvo;

  return (
    <section className="vs-study-board" data-testid="visual-study-board" aria-label={ariaLabel}>
      <header className="vs-board-head">
        <div>
          <span className="vs-board-kicker">{kicker}</span>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <div className="vs-q-callout" data-long={condition.value.length > 6 || undefined} aria-label={`${condition.label} ${condition.value}`}>
          <span>{condition.label}</span>
          <strong>{condition.value}</strong>
        </div>
      </header>

      <div className="vs-brush" aria-hidden="true" />

      {compacto && (
        <div role="tablist" aria-label="Seções da prancha" className="vs-faces">
          {(Object.keys(FACE_LABEL) as Face[]).map((alvo) => (
            <button
              key={alvo}
              role="tab"
              type="button"
              aria-selected={face === alvo}
              onClick={() => setFace(alvo)}
            >
              {FACE_LABEL[alvo]}
            </button>
          ))}
        </div>
      )}

      {mostra('essencial') && (
      <div className="vs-board-body">
        <ConceptCard side="expansion" data={left} state={leftState} selected={leftSelected} onSelect={onSelectLeft} />

        <div className="vs-piston-wrap" data-emphasis={emphasis === 'esquerda' ? 'expansao' : emphasis === 'direita' ? 'compressao' : 'nenhum'}>
          <SceneViewport notas={sceneNotes}>{scene}</SceneViewport>
        </div>

        <ConceptCard side="compression" data={right} state={rightState} selected={rightSelected} onSelect={onSelectRight} />
      </div>
      )}

      {mostra('relacoes') && equation && (
        <div className="vs-equation-strip" aria-label={equation.label}>
          <span>{equation.label}</span>
          <strong>{equation.general}</strong>
          <i>{equation.condition}</i>
          <strong>{equation.reduced}</strong>
        </div>
      )}

      {mostra('relacoes') && supports && <div className="vs-support-grid">{supports}</div>}

      <footer className="vs-landscape">
        <svg className="vs-landscape-art" viewBox="0 0 640 170" aria-hidden="true" preserveAspectRatio="none">
          <defs>
            <filter id="vs-landscape-grain" x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="grain" />
              <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .05 0" />
              <feComposite operator="over" in2="SourceGraphic" />
            </filter>
          </defs>
          <path className="vs-hill vs-hill--far" d="M0 108 C 90 66, 176 88, 250 100 S 402 64, 488 84 S 590 106, 640 96 L640 170 L0 170 Z" />
          <path className="vs-hill vs-hill--mid" d="M0 128 C 100 100, 182 118, 260 122 S 414 94, 502 112 S 596 130, 640 120 L640 170 L0 170 Z" />
          <path className="vs-hill vs-hill--near" d="M0 146 C 108 122, 190 136, 268 142 S 428 118, 520 132 S 604 148, 640 142 L640 170 L0 170 Z" filter="url(#vs-landscape-grain)" />
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
