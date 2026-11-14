import React, { useEffect, useRef, useState } from 'react';
import { useLiveReducedMotion } from '../../hooks/useLiveReducedMotion';
import './PcrImmersion.css';

/**
 * O que toda cena imersiva tem em comum: etapas com previsão, as duas tintas,
 * a casca com trilho e rodapé, e o laço de desenho com câmera.
 *
 * A cena da PCR foi feita com tudo isso dentro do próprio componente, o que
 * estava certo para uma cena. A especificação dela já registrava que seria
 * errado para duas: a de Lenz teria de copiar umas duzentas linhas que não
 * falam de DNA nem de ímã. Este módulo é essa parte comum, escrita para a
 * segunda cena.
 *
 * A PCR ainda não foi migrada para cá de propósito. Outras sessões estavam
 * mexendo nela (PRs #442, #445 e #446) quando este arquivo nasceu, e mover o
 * componente inteiro no meio disso trocaria um ganho de organização por
 * conflito certo. A folha de estilo é a mesma (`PcrImmersion.css`, que apesar
 * do nome só fala de `.crivo-immersion` e `.cr-*`); a migração é o passo seguinte.
 */
export interface ImmersivePhase {
  /** Título em duas partes; a segunda sai em itálico serifado. */
  title: [string, string];
  kicker: string;
  /** Nome curto no trilho de etapas. */
  rail: string;
  text: string;
  /** Leitura grande à esquerda e a legenda dela. */
  number: string;
  unit: string;
  /** Texto do botão de avançar. */
  action: string;
  /** Nome do ponto de interesse e o detalhe que ele abre. */
  label: string;
  detail: string;
  /** Pergunta sobre o que a PRÓXIMA etapa vai mostrar; a última não tem próxima. */
  predict?: { question: string; options: [string, string]; right: 0 | 1; why: string };
}

export type TemaDaCena = 'caderno' | 'noite';

/** Cores que não dependem do assunto da cena: fundo, poeira, sombra das esferas, fios. */
export const TINTA_BASE = {
  noite: {
    fundo: '#071b19', brilho: ['#285442', '#163b31', '#071b19'], luz: '#d1eaae13', anel: '#d0ebbb12', poeira: '#d4ecc9', poeiraGrande: '#ddf7c8',
    esfera: ['#f6ffe8', '#284d42', '#071f1c'], reflexo: '#f6ffea', fio: '#eeffe833', texto: '#d8eddf', guia: '#d6ebcf66', ponto: '#ecffda', acento: '#d4f68c',
  },
  caderno: {
    fundo: '#f6f0e3', brilho: ['#fffaf0', '#f3ebdb', '#ebe1cd'], luz: '#ffffff40', anel: '#2a211814', poeira: '#8a7d68', poeiraGrande: '#c9b99a',
    esfera: ['#ffffff', '#3a3026', '#1f1812'], reflexo: '#ffffff', fio: '#ffffff55', texto: '#3a3026', guia: '#2a211866', ponto: '#86233a', acento: '#86233a',
  },
} as const;
export type TintaBase = typeof TINTA_BASE[TemaDaCena];

export const seed = (i: number) => { const value = Math.sin(i * 127.1 + 311.7) * 43758.5453; return value - Math.floor(value); };
const rgba = (hex: string, alpha: number) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${alpha})`; };

/** O tema escuro do aplicativo marca `<html class="dark">`; a cena acompanha. */
function useAppEscuro(): boolean {
  const ler = () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const [escuro, setEscuro] = useState(ler);
  useEffect(() => {
    const observer = new MutationObserver(() => setEscuro(ler()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return escuro;
}

/**
 * Estado que a casca mostra e o laço lê: etapa, previsão, detalhe, aproximação,
 * pausa, movimento reduzido e tinta. As regras são as que a PCR fixou.
 */
export function useImmersiveState(phases: readonly ImmersivePhase[], temaInicial?: TemaDaCena) {
  const [phase, setPhase] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [detail, setDetail] = useState(false);
  // O que a estudante previu ao sair da etapa anterior. Vale só nesta visita:
  // a cena não é avaliação, e evidência continua vindo de Testar e Reconstruir.
  const [previsao, setPrevisao] = useState<{ acertou: boolean; porque: string } | null>(null);
  const [paused, setPaused] = useState(false);
  const reduced = useLiveReducedMotion();
  // Sem escolha, a tinta segue o tema do aplicativo; quem troca pelo botão fica
  // com a escolha enquanto a cena estiver aberta.
  const appEscuro = useAppEscuro();
  const [escolhida, setEscolhida] = useState<TemaDaCena | null>(temaInicial ?? null);
  const tema: TemaDaCena = escolhida ?? (appEscuro ? 'noite' : 'caderno');
  const turn = useRef(0);

  const goTo = (value: number) => { setPhase(value); setDetail(false); setPrevisao(null); };
  const prever = (escolha: number) => {
    const pergunta = phases[phase].predict;
    if (!pergunta) return;
    setPhase(phase + 1); setDetail(false);
    setPrevisao({ acertou: escolha === pergunta.right, porque: pergunta.why });
  };
  return {
    phase, goTo, prever, previsao, detail, setDetail, zoomed, setZoomed, paused, setPaused, reduced, tema,
    alternarTinta: () => setEscolhida(tema === 'noite' ? 'caderno' : 'noite'),
    turn,
  };
}
export type ImmersiveState = ReturnType<typeof useImmersiveState>;

export interface ImmersiveFrame {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  mobile: boolean;
  /** Segundos desde o quadro anterior, limitados a 0,05. */
  delta: number;
  /** Tempo de cena: não anda com a cena pausada nem com movimento reduzido. */
  elapsed: number;
  rotation: number;
  tilt: number;
  zoom: number;
  /** Fração do caminho que uma grandeza anda até o alvo neste quadro. */
  ease: number;
  /** Parada: pausa manual ou movimento reduzido. */
  still: boolean;
  /** A etapa ou o cenário mudaram desde o quadro anterior. */
  changed: boolean;
  pal: TintaBase;
  tema: TemaDaCena;
  dragging: boolean;
}

/**
 * Canvas, câmera e laço. A cena entrega `draw` e recebe um quadro pronto.
 *
 * As três regras que custaram correção na PCR moram aqui, para a cena seguinte
 * não ter de reaprendê-las:
 * - o laço só desenha com a cena na tela E a aba à frente, guardadas em
 *   separado (com uma variável só, voltar à aba religava o desenho fora da tela);
 * - a pausa manual conserva o estado (`ease` vira 0), e trocar de etapa
 *   durante a pausa mostra direto o resultado (`ease` vira 1 nesse quadro);
 * - movimento reduzido é independente da pausa e apresenta sempre o estado final.
 */
export function useImmersiveCanvas(options: {
  state: ImmersiveState;
  /** Muda quando o cenário da cena muda sem trocar de etapa (ex.: com e sem primers). */
  variant?: string;
  /** Deriva da câmera em rad/s; 0 para cenas que não devem girar sozinhas. */
  autoSpin?: number;
  camera?: { rotation: number; tilt: number; tiltLimit?: number };
  draw: (frame: ImmersiveFrame) => void;
}) {
  const shell = useRef<HTMLDivElement>(null), canvas = useRef<HTMLCanvasElement>(null);
  const { state } = options;
  // O laço lê tudo por aqui: recriá-lo a cada clique reiniciaria a animação.
  const live = useRef(options); live.current = options;

  useEffect(() => {
    const shellEl = shell.current, canvasEl = canvas.current;
    // jsdom não implementa Canvas 2D: sem contexto, a cena fica só com o texto,
    // que é o que os testes de componente verificam.
    const ctx = canvasEl?.getContext?.('2d', { alpha: false });
    if (!shellEl || !canvasEl || !ctx) return;
    const inicio = live.current.camera ?? { rotation: .18, tilt: .12 };
    const limite = inicio.tiltLimit ?? .4;
    let width = 960, height = 720, frameId = 0, previousTime = 0, visible = true, naTela = true;
    let elapsed = 0, rotation = inicio.rotation, rotationTarget = inicio.rotation, tilt = inicio.tilt, tiltTarget = inicio.tilt, zoom = 1;
    let dragging = false, lastX = 0, lastY = 0;
    let lastPhase = live.current.state.phase, lastVariant = live.current.variant, lastPaused = false, lastZoomed = false, lastTurn = live.current.state.turn.current;

    const resize = () => {
      const rect = shellEl.getBoundingClientRect(); width = rect.width; height = rect.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.6);
      canvasEl.width = Math.round(width * ratio); canvasEl.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const observer = new ResizeObserver(resize); observer.observe(shellEl); resize();

    const frame = (timestamp: number) => {
      frameId = requestAnimationFrame(frame);
      if (!visible) return;
      const { state: now, variant, autoSpin = 0, draw } = live.current;
      const delta = previousTime ? Math.min((timestamp - previousTime) / 1000, .05) : .016; previousTime = timestamp;
      const changed = now.phase !== lastPhase || variant !== lastVariant; lastPhase = now.phase; lastVariant = variant;
      const zoomChanged = now.zoomed !== lastZoomed; lastZoomed = now.zoomed;
      if (now.paused && !lastPaused) { rotationTarget = rotation; tiltTarget = tilt; }
      lastPaused = now.paused;
      if (now.turn.current !== lastTurn) { rotationTarget += Math.PI / 3 * (now.turn.current - lastTurn); lastTurn = now.turn.current; }
      const instant = now.reduced || (now.paused && changed);
      const ease = instant ? 1 : now.paused ? 0 : 1 - Math.exp(-delta * 3);
      const still = now.paused || now.reduced;
      if (!still) { elapsed += delta; if (!dragging) rotationTarget += delta * autoSpin; }
      const cameraEase = still ? 1 : Math.min(1, delta * 5);
      rotation += (rotationTarget - rotation) * cameraEase;
      tilt += (tiltTarget - tilt) * cameraEase;
      zoom += ((now.zoomed ? 1.25 : 1) - zoom) * (now.reduced || (still && zoomChanged) ? 1 : ease);
      draw({ ctx, width, height, mobile: width < 641, delta, elapsed, rotation, tilt, zoom, ease, still, changed, pal: TINTA_BASE[now.tema], tema: now.tema, dragging });
    };
    frameId = requestAnimationFrame(frame);

    const down = (event: PointerEvent) => { dragging = true; lastX = event.clientX; lastY = event.clientY; canvasEl.setPointerCapture?.(event.pointerId); };
    const move = (event: PointerEvent) => {
      if (!dragging) return;
      rotationTarget += (event.clientX - lastX) * .008; tiltTarget = Math.max(-limite, Math.min(limite, tiltTarget + (event.clientY - lastY) * .002));
      lastX = event.clientX; lastY = event.clientY;
    };
    const up = () => { dragging = false; };
    canvasEl.addEventListener('pointerdown', down); canvasEl.addEventListener('pointermove', move);
    for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) canvasEl.addEventListener(name, up);
    const atualizar = () => { visible = naTela && !document.hidden; previousTime = 0; };
    document.addEventListener('visibilitychange', atualizar);
    const onScreen = new IntersectionObserver(entries => { naTela = entries[entries.length - 1].isIntersecting; atualizar(); });
    onScreen.observe(shellEl);
    return () => {
      cancelAnimationFrame(frameId); observer.disconnect(); onScreen.disconnect();
      document.removeEventListener('visibilitychange', atualizar);
      canvasEl.removeEventListener('pointerdown', down); canvasEl.removeEventListener('pointermove', move);
      for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) canvasEl.removeEventListener(name, up);
    };
  }, []);
  // `state` só entra aqui para o tipo de retorno ficar junto do resto.
  void state;
  return { shell, canvas };
}

/** Fundo comum: cor chapada, brilho radial (que pode esquentar), feixe de luz e poeira determinística. */
export function paintBackdrop(frame: ImmersiveFrame, particles: readonly { x: number; y: number; z: number; size: number; speed: number }[], centro?: string) {
  const { ctx, width, height, pal, elapsed } = frame;
  ctx.fillStyle = pal.fundo; ctx.fillRect(0, 0, width, height);
  const glow = ctx.createRadialGradient(width * .67, height * .36, 0, width * .65, height * .35, width * .65);
  glow.addColorStop(0, centro ?? pal.brilho[0]); glow.addColorStop(.45, pal.brilho[1]); glow.addColorStop(1, pal.brilho[2]);
  ctx.fillStyle = glow; ctx.fillRect(0, 0, width, height);
  const light = ctx.createLinearGradient(width * .7, 0, width * .2, height * .7); light.addColorStop(0, pal.luz); light.addColorStop(.6, pal.fundo + '00');
  ctx.fillStyle = light; ctx.fillRect(0, 0, width, height);
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i]; const x = (p.x * .5 + .5) * width + Math.sin(elapsed * p.speed * .15 + i) * 12;
    const y = (((p.y * .5 + .5) * height - elapsed * p.speed * 3) % height + height) % height;
    ctx.globalAlpha = .05 + p.z * .2;
    if (p.size > 3) { const g = ctx.createRadialGradient(x, y, 0, x, y, p.size * 3); g.addColorStop(0, pal.poeiraGrande); g.addColorStop(1, pal.poeiraGrande + '00'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, p.size * 3, 0, Math.PI * 2); ctx.fill(); }
    else { ctx.fillStyle = pal.poeira; ctx.beginPath(); ctx.arc(x, y, p.size * .45, 0, Math.PI * 2); ctx.fill(); }
  }
  ctx.globalAlpha = 1;
}
export const makeParticles = (count = 95) => Array.from({ length: count }, (_, i) => ({ x: seed(i) * 2 - 1, y: seed(i + 95) * 2 - 1, z: seed(i + 190), size: 1 + seed(i + 285) * 3.5, speed: .18 + seed(i + 380) * .4 }));

/** Esferas com volume, geradas uma vez por cor e por tinta e desenhadas com `drawImage`. */
export function makeSphereSprites() {
  const sprites = new Map<string, HTMLCanvasElement>();
  return (color: string, tema: TemaDaCena) => {
    const key = tema + color, cached = sprites.get(key);
    if (cached) return cached;
    const pal = TINTA_BASE[tema];
    const sprite = document.createElement('canvas'); sprite.width = 80; sprite.height = 80;
    const c = sprite.getContext('2d')!;
    const g = c.createRadialGradient(28, 23, 1, 39, 39, 35);
    g.addColorStop(0, pal.esfera[0]); g.addColorStop(.15, color); g.addColorStop(.53, color); g.addColorStop(.84, pal.esfera[1]); g.addColorStop(1, pal.esfera[2]);
    c.fillStyle = g; c.beginPath(); c.arc(40, 40, 35, 0, Math.PI * 2); c.fill();
    c.strokeStyle = rgba(color, .7); c.lineWidth = 1; c.stroke();
    const shine = c.createRadialGradient(28, 22, 0, 28, 22, 15); shine.addColorStop(0, pal.reflexo + 'c9'); shine.addColorStop(1, pal.reflexo + '00');
    c.fillStyle = shine; c.beginPath(); c.arc(28, 22, 15, 0, Math.PI * 2); c.fill();
    sprites.set(key, sprite); return sprite;
  };
}

/**
 * Onde fica o botão do ponto de interesse, dado o ponto da cena que ele comenta.
 * Os limites são os medidos na PCR: a largura reservada inclui a folga das duas
 * ferramentas à direita, senão a etiqueta para debaixo do botão de aproximar.
 */
export function placeHotspot(frame: ImmersiveFrame, anchor: { x: number; y: number }, hotspot: HTMLButtonElement | null, limits?: { minY?: number; minX?: number }) {
  const { ctx, width, mobile, pal } = frame;
  const labelWidth = mobile ? 236 : 250;
  const x = Math.max(limits?.minX ?? 0, Math.min(width - labelWidth - 14, Math.max(mobile ? 18 : width * .47, anchor.x + 24)));
  const y = Math.max(limits?.minY ?? (mobile ? 236 : 240), Math.min(mobile ? 292 : 400, anchor.y - 20));
  if (hotspot) { hotspot.style.left = x + 'px'; hotspot.style.top = y + 'px'; }
  ctx.strokeStyle = pal.guia; ctx.lineWidth = .7; ctx.beginPath(); ctx.moveTo(anchor.x, anchor.y); ctx.lineTo(x, y); ctx.stroke();
  ctx.fillStyle = pal.ponto; ctx.beginPath(); ctx.arc(anchor.x, anchor.y, 2.4, 0, Math.PI * 2); ctx.fill();
}

/**
 * A casca: tudo o que fica por cima do canvas. A cena entrega as etapas e o
 * que varia com o cenário (leitura, etiqueta, texto); o resto é igual em todas.
 */
export function ImmersiveShell(props: {
  state: ImmersiveState;
  phases: readonly ImmersivePhase[];
  refs: { shell: React.RefObject<HTMLDivElement | null>; canvas: React.RefObject<HTMLCanvasElement | null>; hotspot: React.RefObject<HTMLButtonElement | null> };
  sectionLabel: string;
  canvasLabel: string;
  eyebrow: string;
  indicator: string;
  watermark: string;
  /** Nome do objeto nos botões de câmera: "Girar molécula", "Girar cena". */
  objeto: string;
  /** O que a etapa atual mostra, quando difere do que está em `phases` (cenário alternativo). */
  reading?: { number: string; unit: string };
  label?: string;
  text?: string;
  detailText?: string;
  hotspotHint?: string;
  /** Controles próprios da cena, abaixo do texto (ex.: os dois cenários da última etapa). */
  children?: React.ReactNode;
  /**
   * Palco próprio no lugar do canvas 2D. A cena de geometria molecular desenha
   * em WebGL sobre o estúdio do Hoje, que cria o canvas dele; a casca, as
   * etapas e as previsões continuam as mesmas.
   */
  stage?: React.ReactNode;
  footNote?: string;
  /** Avisa do clique em girar a cena que não tem laço lendo `state.turn`. */
  onTurn?: () => void;
}) {
  const { state, phases, refs } = props;
  const data = phases[state.phase];
  const label = props.label ?? data.label;
  const reading = props.reading ?? { number: data.number, unit: data.unit };
  const { paused, reduced, tema, zoomed, previsao } = state;
  return <section className="crivo-immersion" data-tema={tema} aria-label={props.sectionLabel}>
    <div className="cr-shell" ref={refs.shell}>
      {props.stage ?? <canvas ref={refs.canvas} className="cr-canvas" role="img" aria-label={props.canvasLabel} />}
      <div className="cr-indicator"><span className="cr-dot" /><span>{props.indicator}</span></div>
      <div className="cr-intro">
        <div className="cr-eyebrow">{props.eyebrow}</div>
        <h2>{data.title[0]}<br /><em>{data.title[1]}</em></h2>
      </div>
      <div className="cr-watermark" aria-hidden="true">{props.watermark}</div>
      <div className="cr-temp"><span className="cr-temp-number">{reading.number}</span><span className="cr-temp-caption">{reading.unit}</span></div>
      <div className="cr-tools">
        <button type="button" className="cr-tool" aria-label={`Girar ${props.objeto}`} onClick={() => { state.turn.current += 1; props.onTurn?.(); }}>↻</button>
        <button type="button" className="cr-tool" aria-label={`${zoomed ? 'Afastar' : 'Aproximar'} ${props.objeto}`} aria-pressed={zoomed} onClick={() => state.setZoomed(value => !value)}>{zoomed ? '−' : '＋'}</button>
      </div>
      <button type="button" ref={refs.hotspot} className="cr-label" aria-label={`Inspecionar ${label.toLowerCase()}`} aria-expanded={state.detail} onClick={() => { state.setDetail(true); state.setZoomed(true); }}>
        <span className="cr-label-dot" /><span className="cr-label-copy">{label}<small>{props.hotspotHint ?? 'Toque para explorar'}</small></span>
      </button>
      <div className="cr-view-note">Arraste para girar · Toque para explorar</div>
      <div className="cr-bottom">
        <div className="cr-readout">
          <div className="cr-copy">
            <div className="cr-stage-kicker">{data.kicker}</div>
            {previsao && <p className="cr-feedback" data-acertou={previsao.acertou} role="status">
              {/* No acerto, a explicação é o próprio texto da etapa logo abaixo. */}
              <strong>{previsao.acertou ? 'Você previu certo.' : 'Não foi isso.'}</strong>{!previsao.acertou && <> {previsao.porque}</>}
            </p>}
            <p className="cr-description" aria-live="polite">{props.text ?? data.text}</p>
            {state.detail && <p className="cr-detail">{props.detailText ?? data.detail}</p>}
            {props.children}
          </div>
          {data.predict && <div className="cr-predict" role="group" aria-label="Antes de avançar, preveja">
            <p><span>Antes de avançar</span>{data.predict.question}</p>
            <div>{data.predict.options.map((option, index) => <button key={option} type="button" className="cr-choice" onClick={() => state.prever(index)}>{option}</button>)}</div>
          </div>}
          <div className="cr-actions">
            <button type="button" className="cr-next" onClick={() => state.goTo((state.phase + 1) % phases.length)}><span>{data.action}</span><span aria-hidden="true">→</span></button>
          </div>
        </div>
        <nav className="cr-rail" aria-label="Etapas da experiência">
          {phases.map((item, index) => <button key={item.rail} type="button" className="cr-step" aria-current={index === state.phase ? 'step' : undefined} onClick={() => state.goTo(index)}>
            <span>{String(index + 1).padStart(2, '0')}</span>{item.rail}
          </button>)}
        </nav>
        <div className="cr-foot">
          <button type="button" className="cr-motion" disabled={reduced} aria-pressed={paused || reduced} onClick={() => state.setPaused(value => !value)}>
            <span aria-hidden="true">{paused || reduced ? '▷' : 'Ⅱ'}</span> {reduced ? 'Movimento reduzido' : paused ? 'Retomar movimento' : 'Pausar movimento'}
          </button>
          <button type="button" className="cr-motion cr-tema" aria-pressed={tema === 'noite'} onClick={state.alternarTinta}>
            <span aria-hidden="true">◐</span> {tema === 'noite' ? 'Ver em caderno' : 'Ver em noite'}
          </button>
          <span className="cr-foot-text">{props.footNote ?? 'Geometria e tempo simplificados'}</span>
        </div>
      </div>
    </div>
  </section>;
}
