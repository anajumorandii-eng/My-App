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
  /** A figura ocupa a primeira linha; os conceitos continuam selecionáveis abaixo. */
  sceneFirst?: boolean;
  /** Legendas sobrepostas à cena, quando ela tem sentido de movimento. */
  sceneNotes?: { up: string; down: string };
  emphasis?: 'esquerda' | 'direita' | 'nenhum';
  equation?: { label: string; general: string; condition: string; reduced: string };
  supports?: React.ReactNode;
  closing: string;
  ariaLabel: string;
  /**
   * Moldura de caderno ilustrado: título de marcador, subtítulo em quadro de
   * definição, cartões como quadros com etiqueta e ícone, ideia central numa
   * pílula com estrela. A cena tinha ganhado o traço dos pôsteres que a Ana
   * Júlia mandou, mas a página em volta continuava com cara de jornal. Por
   * enquanto é opcional: vale só para o piloto de cinco capítulos, até ela
   * aprovar e a moldura virar a de todas as pranchas.
   */
  caderno?: boolean;
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
  scene, sceneFirst = false, sceneNotes, emphasis = 'nenhum', equation, supports, closing, ariaLabel, caderno = false,
}: BoardShellProps) {
  const compacto = useCompacto();
  const [face, setFace] = useState<Face>('essencial');
  // No desktop nada se esconde: as duas faces aparecem juntas, como sempre.
  const mostra = (alvo: Face) => !compacto || face === alvo;
  const scenePanel = <div className="vs-piston-wrap" data-emphasis={emphasis === 'esquerda' ? 'expansao' : emphasis === 'direita' ? 'compressao' : 'nenhum'}>
    <SceneViewport notas={sceneNotes}>{scene}</SceneViewport>
  </div>;

  return (
    <section className={`vs-study-board${sceneFirst ? ' vs-study-board--scene-first' : ''}${caderno ? ' vs-study-board--caderno' : ''}`} data-testid="visual-study-board" aria-label={ariaLabel}>
      <header className="vs-board-head">
        <div>
          <span className="vs-board-kicker">{caderno && <EstrelaIcone />}{kicker}</span>
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
        {sceneFirst && scenePanel}
        <ConceptCard side="expansion" data={left} state={leftState} selected={leftSelected} onSelect={onSelectLeft} caderno={caderno} />
        {!sceneFirst && scenePanel}
        <ConceptCard side="compression" data={right} state={rightState} selected={rightSelected} onSelect={onSelectRight} caderno={caderno} />
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
        {!caderno && <svg className="vs-landscape-art" viewBox="0 0 640 170" aria-hidden="true" preserveAspectRatio="none">
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
        </svg>}
        <p>{caderno && <EstrelaIcone />}<strong>Ideia central:</strong> {closing}</p>
      </footer>
    </section>
  );
}

function ConceptCard({
  side, data, state, selected, onSelect, caderno,
}: {
  side: 'expansion' | 'compression';
  data: ConceptSide;
  state: NodeState;
  selected: boolean;
  onSelect: () => void;
  caderno?: boolean;
}) {
  return (
    <button
      type="button"
      className={`vs-concept-card vs-concept-card--${side}${selected ? ' is-selected' : ''}`}
      data-state={state}
      onClick={onSelect}
    >
      <span className="vs-concept-label">{caderno && <span className="vs-concept-icon">{iconeDoEstagio(data.label)}</span>}{data.label}</span>
      <strong>{data.headline}</strong>
      <span>{data.detail}</span>
      <code>{data.formula}</code>
      <span className="vs-state-line"><span className="vs-swatch" />{NODE_STATE_LABEL[state]}</span>
    </button>
  );
}

const EstrelaIcone = () => <svg className="vs-star-icon" viewBox="0 0 20 20" aria-hidden="true">
  <path d="M10 1.8l2.4 5.2 5.6.6-4.2 3.8 1.2 5.6L10 14.2 5 17l1.2-5.6L2 7.6l5.6-.6z" />
</svg>;

/**
 * Ícone da etiqueta do cartão, pelo estágio pedagógico. O rótulo é o de
 * `STAGE_LABEL`; um estágio sem ícone próprio recebe a estrela, em vez de um
 * desenho que não diga nada sobre ele.
 */
function iconeDoEstagio(rotulo: string) {
  const tracos: Record<string, React.ReactNode> = {
    'Intuição': <><path d="M10 2.5a5 5 0 0 0-3 9c.6.5 1 1.2 1 2V14h4v-.5c0-.8.4-1.5 1-2a5 5 0 0 0-3-9z" /><path d="M8 16.5h4M8.8 18.5h2.4" /></>,
    'Conceito': <><path d="M10 5c-2-1.3-4.5-1.5-7-1v11.5c2.5-.5 5-.3 7 1 2-1.3 4.5-1.5 7-1V4c-2.5-.5-5-.3-7 1z" /><path d="M10 5v11.5" /></>,
    'Aplicação': <><circle cx="10" cy="10" r="2.6" /><path d="M10 2.5v2.2M10 15.3v2.2M2.5 10h2.2M15.3 10h2.2M4.7 4.7l1.6 1.6M13.7 13.7l1.6 1.6M4.7 15.3l1.6-1.6M13.7 6.3l1.6-1.6" /><circle cx="10" cy="10" r="5.4" /></>,
    'Estratégia': <><circle cx="10" cy="10" r="7" /><circle cx="10" cy="10" r="4" /><circle cx="10" cy="10" r="1.2" /></>,
    'Exercício': <><path d="M13.5 3.5l3 3-9 9-4 1 1-4z" /><path d="M11.5 5.5l3 3" /></>,
  };
  const traco = tracos[rotulo];
  return traco
    ? <svg viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{traco}</svg>
    : <EstrelaIcone />;
}
