import React, { useEffect, useRef, useState } from 'react';
import { BookOpen, Cog, Lightbulb, PenLine, Sparkles, Target } from 'lucide-react';
import { SceneViewport } from './SceneViewport';
import { NODE_STATE_LABEL, type NodeState } from '../../lib/visualStudy';
import { useMolduraTecnologica } from './ambiente';

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
   * Moldura tecnológica: fundo escuro com aurora e partículas, título grande
   * de letreiro, cartões de vidro que inclinam sob o dedo, leituras em
   * monoespaçada. A Ana Júlia mandou vídeos de sites imersivos e pediu "assim,
   * moderno e tecnológico". Por enquanto é opcional: vale só para o piloto de
   * cinco capítulos, até ela aprovar e a moldura virar a de todas as pranchas.
   *
   * Sem a prop, vale o contexto do Visual (`usaMolduraTecnologica`), que é a
   * lista única de capítulos. A prop existe para teste e para forçar.
   */
  tecnologico?: boolean;
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
  scene, sceneFirst = false, sceneNotes, emphasis = 'nenhum', equation, supports, closing, ariaLabel, tecnologico: tecnologicoProp,
}: BoardShellProps) {
  const doContexto = useMolduraTecnologica();
  const tecnologico = tecnologicoProp ?? doContexto;
  const compacto = useCompacto();
  // Luz que segue o dedo ou o mouse: a borda dos vidros acende perto dele,
  // como nos sites de referência. Só grava duas variáveis CSS; o desenho é
  // todo do CSS.
  const moverLuz = (evento: React.PointerEvent<HTMLElement>) => {
    const caixa = evento.currentTarget.getBoundingClientRect();
    evento.currentTarget.style.setProperty('--luz-x', `${evento.clientX - caixa.left}px`);
    evento.currentTarget.style.setProperty('--luz-y', `${evento.clientY - caixa.top}px`);
  };
  const [face, setFace] = useState<Face>('essencial');
  // No desktop nada se esconde: as duas faces aparecem juntas, como sempre.
  const mostra = (alvo: Face) => !compacto || face === alvo;
  const scenePanel = <div className="vs-piston-wrap" data-emphasis={emphasis === 'esquerda' ? 'expansao' : emphasis === 'direita' ? 'compressao' : 'nenhum'}>
    <SceneViewport notas={sceneNotes}>{scene}</SceneViewport>
  </div>;

  return (
    <section
      className={`vs-study-board${sceneFirst ? ' vs-study-board--scene-first' : ''}${tecnologico ? ' vs-study-board--tech' : ''}`}
      data-testid="visual-study-board"
      aria-label={ariaLabel}
      onPointerMove={tecnologico ? moverLuz : undefined}
    >
      {tecnologico && <CampoParticulas />}
      <header className="vs-board-head">
        <div>
          <span className="vs-board-kicker">{tecnologico && <span className="vs-tech-dot" aria-hidden="true" />}{kicker}</span>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <div className="vs-q-callout" data-long={condition.value.length > 6 || undefined} data-frase={condition.value.length > 18 || undefined} aria-label={`${condition.label} ${condition.value}`}>
          <span>{condition.label}</span>
          <strong>{tecnologico ? <Embaralhado valor={condition.value} /> : condition.value}</strong>
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
        <ConceptCard side="expansion" data={left} state={leftState} selected={leftSelected} onSelect={onSelectLeft} tecnologico={tecnologico} />
        {!sceneFirst && scenePanel}
        <ConceptCard side="compression" data={right} state={rightState} selected={rightSelected} onSelect={onSelectRight} tecnologico={tecnologico} />
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
        {!tecnologico && <svg className="vs-landscape-art" viewBox="0 0 640 170" aria-hidden="true" preserveAspectRatio="none">
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
        <p>{tecnologico && <span className="vs-tech-dot" aria-hidden="true" />}<strong>Ideia central:</strong> {closing}</p>
      </footer>
    </section>
  );
}

function ConceptCard({
  side, data, state, selected, onSelect, tecnologico,
}: {
  side: 'expansion' | 'compression';
  data: ConceptSide;
  state: NodeState;
  selected: boolean;
  onSelect: () => void;
  tecnologico?: boolean;
}) {
  // Vidro que inclina sob o ponteiro: a profundidade dos cartões flutuantes
  // da referência. Só variáveis CSS; o movimento reduzido anula no CSS.
  const inclinar = (evento: React.PointerEvent<HTMLButtonElement>) => {
    const caixa = evento.currentTarget.getBoundingClientRect();
    const x = (evento.clientX - caixa.left) / caixa.width - 0.5;
    const y = (evento.clientY - caixa.top) / caixa.height - 0.5;
    evento.currentTarget.style.setProperty('--incl-x', `${(-y * 6).toFixed(2)}deg`);
    evento.currentTarget.style.setProperty('--incl-y', `${(x * 8).toFixed(2)}deg`);
  };
  const soltar = (evento: React.PointerEvent<HTMLButtonElement>) => {
    evento.currentTarget.style.removeProperty('--incl-x');
    evento.currentTarget.style.removeProperty('--incl-y');
  };
  return (
    <button
      type="button"
      className={`vs-concept-card vs-concept-card--${side}${selected ? ' is-selected' : ''}`}
      data-state={state}
      onClick={onSelect}
      onPointerMove={tecnologico ? inclinar : undefined}
      onPointerLeave={tecnologico ? soltar : undefined}
    >
      <span className="vs-concept-label">{tecnologico && <span className="vs-concept-icon">{iconeDoEstagio(data.label)}</span>}{data.label}</span>
      <strong>{data.headline}</strong>
      <span>{data.detail}</span>
      <code>{data.formula}</code>
      <span className="vs-state-line"><span className="vs-swatch" />{NODE_STATE_LABEL[state]}</span>
    </button>
  );
}

/**
 * Ícone da etiqueta do cartão, pelo estágio pedagógico (`STAGE_LABEL`). Um
 * estágio sem ícone próprio recebe o brilho genérico, em vez de um desenho que
 * não diga nada sobre ele.
 */
function iconeDoEstagio(rotulo: string) {
  const Icone = ({
    'Intuição': Lightbulb, 'Conceito': BookOpen, 'Aplicação': Cog, 'Estratégia': Target, 'Exercício': PenLine,
  } as Record<string, typeof Sparkles>)[rotulo] ?? Sparkles;
  return <Icone aria-hidden="true" strokeWidth={2} />;
}

function prefereMenosMovimento() {
  if (typeof window === 'undefined' || !window.matchMedia) return true;
  // O painel Personalizar também desliga o movimento: fora de "completo", o
  // campo de partículas fica parado e o valor não embaralha.
  const efeitos = document.documentElement.dataset.efeitos;
  if (efeitos && efeitos !== 'completo') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Valor da condição que "decodifica" ao mudar: os caracteres passam por
 * símbolos aleatórios por um instante e assentam no valor novo, o efeito de
 * letreiro dos sites de referência. A primeira renderização já mostra o valor
 * certo, e com movimento reduzido (ou sem `matchMedia`, como nos testes) não
 * há embaralhamento nenhum — o número nunca fica escondido.
 */
function Embaralhado({ valor }: { valor: string }) {
  const [exibido, setExibido] = useState(valor);
  const anterior = useRef(valor);
  useEffect(() => {
    if (anterior.current === valor) return;
    anterior.current = valor;
    if (prefereMenosMovimento()) { setExibido(valor); return; }
    const simbolos = '0123456789×+−=#%';
    let passo = 0;
    const total = 9;
    const id = window.setInterval(() => {
      passo += 1;
      if (passo >= total) { window.clearInterval(id); setExibido(valor); return; }
      const fixos = Math.floor((passo / total) * valor.length);
      setExibido(valor.split('').map((c, k) => (k < fixos || c === ' ' ? c : simbolos[Math.floor(Math.random() * simbolos.length)])).join(''));
    }, 38);
    return () => window.clearInterval(id);
  }, [valor]);
  return <span aria-live="polite">{exibido}</span>;
}

/**
 * Campo de partículas atrás do cabeçalho: pontos que derivam devagar e se
 * ligam quando ficam próximos, e se afastam do ponteiro. É o "espaço" dos sites
 * imersivos, feito em canvas 2D em vez de WebGL: o app já pesa o bastante e um
 * motor 3D inteiro por um fundo não se paga no iPad.
 *
 * Para quando sai da tela ou a aba fica oculta, e não anima com movimento
 * reduzido (desenha um quadro parado). Sem canvas (jsdom), não faz nada.
 */
function CampoParticulas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext?.('2d');
    if (!canvas || !ctx) return;
    const parado = prefereMenosMovimento();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let largura = 0, altura = 0, quadro = 0, visivel = true;
    const ponteiro = { x: -999, y: -999 };
    const pontos = Array.from({ length: 64 }, () => ({ x: Math.random(), y: Math.random(), vx: (Math.random() - 0.5) * 0.00035, vy: (Math.random() - 0.5) * 0.00035, r: 0.6 + Math.random() * 1.4, sx: 0, sy: 0 }));
    const medir = () => {
      const caixa = canvas.getBoundingClientRect();
      largura = caixa.width; altura = caixa.height;
      canvas.width = largura * dpr; canvas.height = altura * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    // A cor sai do ambiente do capítulo (`--amb-a-rgb`), lida a cada quadro:
    // trocar de capítulo troca a cor sem remontar o canvas.
    const cor = () => getComputedStyle(canvas).getPropertyValue('--amb-a-rgb').trim() || '120, 220, 255';
    const desenhar = () => {
      ctx.clearRect(0, 0, largura, altura);
      const rgb = cor();
      for (const p of pontos) {
        if (!parado) { p.x = (p.x + p.vx + 1) % 1; p.y = (p.y + p.vy + 1) % 1; }
        const px = p.x * largura, py = p.y * altura;
        const dx = px - ponteiro.x, dy = py - ponteiro.y, d = Math.hypot(dx, dy);
        const fuga = d < 90 ? (90 - d) / 90 * 14 : 0;
        p.sx = px + (d ? dx / d * fuga : 0);
        p.sy = py + (d ? dy / d * fuga : 0);
      }
      for (let a = 0; a < pontos.length; a++) {
        const pa = pontos[a];
        for (let b = a + 1; b < pontos.length; b++) {
          const pb = pontos[b];
          const d = Math.hypot(pa.sx - pb.sx, pa.sy - pb.sy);
          if (d < 110) { ctx.strokeStyle = `rgba(${rgb}, ${(1 - d / 110) * 0.22})`; ctx.lineWidth = 0.7; ctx.beginPath(); ctx.moveTo(pa.sx, pa.sy); ctx.lineTo(pb.sx, pb.sy); ctx.stroke(); }
        }
        ctx.fillStyle = `rgba(${rgb}, .75)`; ctx.beginPath(); ctx.arc(pa.sx, pa.sy, pa.r, 0, Math.PI * 2); ctx.fill();
      }
      if (!parado && visivel) quadro = requestAnimationFrame(desenhar);
    };
    const mover = (e: PointerEvent) => { const c = canvas.getBoundingClientRect(); ponteiro.x = e.clientX - c.left; ponteiro.y = e.clientY - c.top; };
    const sair = () => { ponteiro.x = -999; ponteiro.y = -999; };
    const observador = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(([entrada]) => {
      const antes = visivel; visivel = entrada.isIntersecting && !document.hidden;
      if (visivel && !antes && !parado) quadro = requestAnimationFrame(desenhar);
    }) : null;
    medir(); desenhar();
    observador?.observe(canvas);
    window.addEventListener('resize', medir);
    const alvo = canvas.parentElement;
    alvo?.addEventListener('pointermove', mover);
    alvo?.addEventListener('pointerleave', sair);
    return () => { cancelAnimationFrame(quadro); observador?.disconnect(); window.removeEventListener('resize', medir); alvo?.removeEventListener('pointermove', mover); alvo?.removeEventListener('pointerleave', sair); };
  }, []);
  return <canvas ref={ref} className="vs-tech-particulas" aria-hidden="true" />;
}
