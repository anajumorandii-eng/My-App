import React, { useEffect, useRef, useState } from 'react';
import { readReducedMotionPreference, useLiveReducedMotion } from '../../hooks/useLiveReducedMotion';
import './PcrImmersion.css';

/**
 * Cena imersiva da PCR: a molécula ocupa o palco inteiro e as cinco etapas da
 * reação acontecem nela, em vez de ao lado dela.
 *
 * É o porte para React do protótipo autônomo que a Ana Júlia enviou como
 * referência de como a aba Visual deveria ser. O desenho (projeção, esferas,
 * partículas, tempos) é o do protótipo; o que muda é o que o próprio LEIA-ME
 * dele pedia para a integração: a moldura de demonstração saiu, o movimento
 * reduzido é lido ao vivo, e a saída da cena é o desafio real do capítulo
 * (`onPractice`), não um botão que só reinicia a animação.
 *
 * A cena não grava nada: evidência continua vindo só de Testar e Reconstruir.
 */
interface Phase {
  title: [string, string];
  kicker: string;
  rail: string;
  text: string;
  number: string;
  unit: string;
  action: string;
  label: string;
  detail: string;
}

export const PCR_PHASES: readonly Phase[] = [
  { title: ['Entre no', 'DNA.'], kicker: '01 / A molécula', rail: 'DNA', text: 'Duas fitas complementares guardam a informação. Aproxime a molécula e acompanhe como a PCR produz novas cópias.', number: '01', unit: 'Molécula inicial', action: 'Aquecer a reação', label: 'Dupla hélice', detail: 'As fitas são antiparalelas. Os pares de bases complementares unem as duas cadeias nesta representação do DNA.' },
  { title: ['O calor', 'separa.'], kicker: '02 / Desnaturação', rail: 'Separar', text: 'O aquecimento desfaz o pareamento entre as bases. As duas fitas se separam e cada uma pode servir de molde.', number: '95°', unit: 'Celsius · exemplo', action: 'Resfriar e ligar primers', label: 'Fitas separadas', detail: 'O calor separa as fitas ao romper as interações entre elas. A cadeia de cada fita permanece íntegra.' },
  { title: ['O início', 'da cópia.'], kicker: '03 / Anelamento', rail: 'Primers', text: 'Ao resfriar, os primers se ligam a sequências complementares em fitas opostas. Eles definem onde a síntese começa.', number: '58°', unit: 'Celsius · exemplo', action: 'Iniciar a síntese', label: 'Primer', detail: 'Os primers são pequenos trechos de DNA. A temperatura de anelamento varia conforme as sequências usadas.' },
  { title: ['A informação', 'se multiplica.'], kicker: '04 / Extensão', rail: 'Copiar', text: 'A polimerase estende os primers. As novas fitas crescem no sentido 5′ → 3′, incorporando nucleotídeos complementares.', number: '72°', unit: 'Celsius · exemplo', action: 'Comparar os cenários', label: 'DNA polimerase', detail: 'A polimerase acrescenta nucleotídeos à extremidade 3′ do primer. O movimento na cena representa a progressão da síntese.' },
  { title: ['E sem', 'primers?'], kicker: '05 / Compare o resultado', rail: 'Comparar', text: 'Com primers, há pontos de partida para a síntese. Cada fita molde recebe uma nova fita complementar.', number: '02', unit: 'Duplas após a síntese', action: 'Rever a experiência', label: 'Nova fita', detail: 'Em ciclos repetidos, a quantidade do trecho-alvo aumenta. A cena mostra uma representação simplificada da síntese.' },
];

const SEM_PRIMERS = 'Sem primers desde o início da reação, a polimerase não tem um ponto de partida. Não há amplificação do trecho-alvo.';

const ATOM = { green: '#9acbb0', cyan: '#83c6ce', gold: '#e9ca7a', violet: '#c7a0e5', white: '#d6e9d6' } as const;
const N = 28;
type P3 = { x: number; y: number; z: number };

const seed = (i: number) => { const value = Math.sin(i * 127.1 + 311.7) * 43758.5453; return value - Math.floor(value); };
const rgba = (hex: string, alpha: number) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${alpha})`; };

export default function PcrImmersion({ onPractice }: { onPractice?: () => void }) {
  const [phase, setPhase] = useState(0);
  const [primers, setPrimers] = useState(true);
  const [zoomed, setZoomed] = useState(false);
  const [detail, setDetail] = useState(false);
  const reduced = useLiveReducedMotion();
  const [paused, setPaused] = useState(() => readReducedMotionPreference());
  useEffect(() => { if (reduced) setPaused(true); }, [reduced]);

  const shell = useRef<HTMLDivElement>(null), canvas = useRef<HTMLCanvasElement>(null), hotspot = useRef<HTMLButtonElement>(null);
  // O laço de desenho lê o estado por aqui: recriá-lo a cada clique reiniciaria
  // a separação das fitas e a síntese no meio da transição.
  const live = useRef({ phase, primers, zoomed, paused, turn: 0 });
  live.current.phase = phase; live.current.primers = primers; live.current.zoomed = zoomed; live.current.paused = paused;

  const goTo = (value: number) => { setPhase(value); setPrimers(true); setDetail(false); };

  useEffect(() => {
    const shellEl = shell.current, canvasEl = canvas.current;
    // jsdom não implementa Canvas 2D: sem contexto, a cena fica só com o texto,
    // que é o que os testes de componente verificam.
    const ctx = canvasEl?.getContext?.('2d', { alpha: false });
    if (!shellEl || !canvasEl || !ctx) return;
    let width = 960, height = 720, frameId = 0, previousTime = 0, visible = true;
    let elapsed = 0, rotation = .18, rotationTarget = .18, tilt = .12, tiltTarget = .12;
    let separation = 0, primerAmount = 0, extension = 0, zoom = 1, cameraShift = 0, heat = 0;
    let dragging = false, lastX = 0, lastY = 0, lastPhase = 0, lastTurn = live.current.turn;
    const sprites = new Map<string, HTMLCanvasElement>();
    const particles = Array.from({ length: 95 }, (_, i) => ({ x: seed(i) * 2 - 1, y: seed(i + 95) * 2 - 1, z: seed(i + 190), size: 1 + seed(i + 285) * 3.5, speed: .18 + seed(i + 380) * .4 }));

    const sphereSprite = (color: string) => {
      const cached = sprites.get(color);
      if (cached) return cached;
      const sprite = document.createElement('canvas'); sprite.width = 80; sprite.height = 80;
      const c = sprite.getContext('2d')!;
      const g = c.createRadialGradient(28, 23, 1, 39, 39, 35);
      g.addColorStop(0, '#f6ffe8'); g.addColorStop(.15, color); g.addColorStop(.53, color); g.addColorStop(.84, '#284d42'); g.addColorStop(1, '#071f1c');
      c.fillStyle = g; c.beginPath(); c.arc(40, 40, 35, 0, Math.PI * 2); c.fill();
      c.strokeStyle = rgba(color, .7); c.lineWidth = 1; c.stroke();
      const shine = c.createRadialGradient(28, 22, 0, 28, 22, 15); shine.addColorStop(0, '#f6ffeac9'); shine.addColorStop(1, '#f6ffea00');
      c.fillStyle = shine; c.beginPath(); c.arc(28, 22, 15, 0, Math.PI * 2); c.fill();
      sprites.set(color, sprite); return sprite;
    };

    const resize = () => {
      const rect = shellEl.getBoundingClientRect(); width = rect.width; height = rect.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.6);
      canvasEl.width = Math.round(width * ratio); canvasEl.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const observer = new ResizeObserver(resize); observer.observe(shellEl); resize();

    const point = (index: number, strand: number, complement = false): P3 => {
      const angle = index * .57 + (strand ? Math.PI : 0) + (complement ? Math.PI : 0), r = 41;
      return { x: Math.cos(angle) * r + (strand ? separation : -separation), y: (index - (N - 1) / 2) * 12, z: Math.sin(angle) * r };
    };
    const project = (p: P3) => {
      const mobile = width < 641;
      const cosine = Math.cos(rotation), sine = Math.sin(rotation);
      const rx = p.x * cosine + p.z * sine, rz = -p.x * sine + p.z * cosine;
      const ry = p.y * Math.cos(tilt) - rz * Math.sin(tilt), z = p.y * Math.sin(tilt) + rz * Math.cos(tilt);
      const angle = mobile ? -.32 : -.49;
      const x = rx * Math.cos(angle) - ry * Math.sin(angle), y = rx * Math.sin(angle) + ry * Math.cos(angle);
      const perspective = 800 / (800 + z);
      const base = mobile ? Math.min(width / 355, 1.28) : Math.min(width / 660, 1.58);
      const scale = base * zoom * perspective;
      return { x: width * (mobile ? .52 : .665) + x * scale, y: (mobile ? 371 : 315) + y * scale + cameraShift, z, scale };
    };

    const background = () => {
      ctx.fillStyle = '#071b19'; ctx.fillRect(0, 0, width, height);
      const mobile = width < 641;
      const glow = ctx.createRadialGradient(width * .67, height * .36, 0, width * .65, height * .35, width * .65);
      glow.addColorStop(0, heat > .1 ? `rgba(${Math.round(28 + heat * 55)},${Math.round(68 - heat * 10)},38,.82)` : '#285442');
      glow.addColorStop(.45, '#163b31'); glow.addColorStop(1, '#071b19'); ctx.fillStyle = glow; ctx.fillRect(0, 0, width, height);
      const light = ctx.createLinearGradient(width * .7, 0, width * .2, height * .7); light.addColorStop(0, '#d1eaae13'); light.addColorStop(.6, '#c8e7b900');
      ctx.fillStyle = light; ctx.fillRect(0, 0, width, height);
      ctx.save(); ctx.translate(width * .66, mobile ? 373 : 330); ctx.rotate(-.35);
      ctx.strokeStyle = '#d0ebbb12'; ctx.lineWidth = .7;
      for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(0, 0, (mobile ? 158 : 280) + i * 24, (mobile ? 70 : 115) + i * 15, 0, .24, Math.PI * 1.56); ctx.stroke(); }
      ctx.restore();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]; const x = (p.x * .5 + .5) * width + Math.sin(elapsed * p.speed * .15 + i) * 12;
        const y = (((p.y * .5 + .5) * height - elapsed * p.speed * 3) % height + height) % height;
        ctx.globalAlpha = .05 + p.z * .2;
        if (p.size > 3) { const g = ctx.createRadialGradient(x, y, 0, x, y, p.size * 3); g.addColorStop(0, '#ddf7c8'); g.addColorStop(1, '#ddf7c800'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, p.size * 3, 0, Math.PI * 2); ctx.fill(); }
        else { ctx.fillStyle = '#d4ecc9'; ctx.beginPath(); ctx.arc(x, y, p.size * .45, 0, Math.PI * 2); ctx.fill(); }
      }
      ctx.globalAlpha = 1;
    };

    type Projected = ReturnType<typeof project>;
    type Item = { kind: 'sphere'; q: Projected; r: number; color: string; alpha: number; z: number } | { kind: 'bond'; p: Projected; q: Projected; r: number; color: string; alpha: number; z: number };
    const drawMolecule = () => {
      const { phase: now, primers: withPrimers } = live.current;
      const items: Item[] = [];
      const addSphere = (p: P3, r: number, color: string, alpha = 1) => { const q = project(p); items.push({ kind: 'sphere', q, r: r * q.scale, color, alpha, z: q.z }); };
      const addBond = (a: P3, b: P3, color: string, r = 2, alpha = 1) => { const p = project(a), q = project(b); items.push({ kind: 'bond', p, q, color, r: r * (p.scale + q.scale) / 2, alpha, z: (p.z + q.z) / 2 }); };
      const mix = (a: P3, b: P3, t: number): P3 => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: a.z + (b.z - a.z) * t });
      for (let strand = 0; strand < 2; strand++) {
        const color = strand ? ATOM.cyan : ATOM.green;
        for (let i = 0; i < N; i++) {
          const p = point(i, strand);
          if (i < N - 1) { const q = point(i + 1, strand); addBond(p, q, color, 3.2); addSphere(mix(p, q, .5), 3.5, color); }
          addSphere(p, 5.7, color);
          const opposite = point(i, 1 - strand), localOpposite = point(i, strand, true), localCenter = mix(p, localOpposite, .43);
          addBond(p, localCenter, color, 2.5, .85); addSphere(localCenter, 3.6, color);
          if (i % 2 === 0) addSphere({ x: p.x + 3, y: p.y - 4, z: p.z + 5 }, 2.2, ATOM.white, .65);
          if (strand === 0 && separation < 50) addBond(mix(p, opposite, .42), mix(p, opposite, .58), '#dcecc3', 1.2, Math.max(0, 1 - separation / 45) * .7);
          const isPrimer = strand === 0 ? i >= N - 4 : i < 4;
          const fraction = strand === 0 ? (N - 4 - i) / (N - 4) : (i - 3) / (N - 4);
          const copied = isPrimer ? primerAmount : Math.max(0, Math.min(1, (extension - fraction) * 7));
          if (copied > .005) {
            const newColor = isPrimer ? ATOM.gold : ATOM.violet;
            addSphere(localOpposite, 5.5, newColor, copied);
            const baseEnd = mix(localOpposite, p, .46); addBond(localOpposite, baseEnd, newColor, 2.4, copied); addSphere(baseEnd, 3.4, newColor, copied);
            addBond(baseEnd, localCenter, '#dcecc3', 1, copied * .7);
            if ((strand === 0 && i < N - 1) || (strand === 1 && i > 0)) addBond(localOpposite, point(i + (strand === 0 ? 1 : -1), strand, true), newColor, 3, copied);
          }
        }
      }
      if (now === 3 && extension < .995 && primerAmount > .8) {
        for (let strand = 0; strand < 2; strand++) {
          const i = strand === 0 ? (N - 4) * (1 - extension) : 3 + (N - 4) * extension;
          const p = point(i, strand, true);
          for (let j = 0; j < 19; j++) { const a = j * 2.39996, r = 11 + seed(j) * 6; addSphere({ x: p.x + Math.cos(a) * r, y: p.y + Math.sin(a) * r * .8, z: p.z + Math.cos(j * 1.3) * 11 }, 7 + seed(j + 5) * 4, ATOM.gold, .85); }
        }
      }
      items.sort((a, b) => b.z - a.z);
      for (const item of items) {
        const depth = Math.max(.42, Math.min(1, 1 - (item.z + 55) / 480)); ctx.globalAlpha = item.alpha * depth;
        if (item.kind === 'sphere') { const size = item.r * 2.3; ctx.drawImage(sphereSprite(item.color), item.q.x - size / 2, item.q.y - size / 2, size, size); }
        else {
          ctx.strokeStyle = item.color; ctx.lineWidth = item.r; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(item.p.x, item.p.y); ctx.lineTo(item.q.x, item.q.y); ctx.stroke();
          ctx.strokeStyle = '#eeffe833'; ctx.lineWidth = item.r * .22; ctx.beginPath(); ctx.moveTo(item.p.x - 1, item.p.y - 1); ctx.lineTo(item.q.x - 1, item.q.y - 1); ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      // As pontas de cada fita molde: a orientação não muda com a câmera.
      if (now > 0) {
        ctx.font = '11px Inter, Arial, sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#d8eddf';
        for (let strand = 0; strand < 2; strand++) for (const index of [0, N - 1]) { const p = project(point(index, strand)); ctx.fillText((strand === 0) === (index === 0) ? '5′' : '3′', p.x, p.y + (index === 0 ? -15 : 22)); }
      }
      let target = point(10, 1);
      if (now === 2) target = point(2, 1, true);
      if (now === 3) target = point(3 + (N - 4) * Math.min(extension, .95), 1, true);
      if (now === 4) target = point(10, 1, withPrimers);
      const anchor = project(target), mobile = width < 641, labelWidth = mobile ? 132 : 166;
      const labelX = Math.min(width - labelWidth - 14, Math.max(mobile ? 18 : width * .47, anchor.x + 24));
      const labelY = Math.max(mobile ? 310 : 170, Math.min(mobile ? 479 : 438, anchor.y - 20));
      if (hotspot.current) { hotspot.current.style.left = labelX + 'px'; hotspot.current.style.top = labelY + 'px'; }
      ctx.strokeStyle = '#d6ebcf66'; ctx.lineWidth = .7; ctx.beginPath(); ctx.moveTo(anchor.x, anchor.y); ctx.lineTo(labelX, labelY); ctx.stroke();
      ctx.fillStyle = '#ecffda'; ctx.beginPath(); ctx.arc(anchor.x, anchor.y, 2, 0, Math.PI * 2); ctx.fill();
    };

    const frame = (timestamp: number) => {
      frameId = requestAnimationFrame(frame);
      if (!visible) return;
      const state = live.current;
      const delta = previousTime ? Math.min((timestamp - previousTime) / 1000, .05) : .016; previousTime = timestamp;
      if (state.phase !== lastPhase) { if (state.phase === 3) extension = 0; lastPhase = state.phase; }
      if (state.turn !== lastTurn) { rotationTarget += Math.PI / 3 * (state.turn - lastTurn); lastTurn = state.turn; }
      // Pausada, a cena salta para o estado final da etapa em vez de congelar a
      // meio caminho: com movimento reduzido ainda se vê o resultado de cada passo.
      const ease = state.paused ? 1 : 1 - Math.exp(-delta * 3);
      if (!state.paused) { elapsed += delta; if (!dragging) rotationTarget += delta * .055; }
      rotation += (rotationTarget - rotation) * Math.min(1, delta * 5);
      tilt += (tiltTarget - tilt) * Math.min(1, delta * 5);
      separation += ((state.phase === 0 ? 0 : 88) - separation) * ease;
      const hasPrimers = state.phase >= 2 && (state.phase !== 4 || state.primers);
      primerAmount += ((hasPrimers ? 1 : 0) - primerAmount) * ease;
      if (state.phase === 3) extension = state.paused ? 1 : Math.min(1, extension + delta * .105);
      else extension += ((state.phase === 4 && state.primers ? 1 : 0) - extension) * ease;
      zoom += ((state.zoomed ? 1.25 : 1) - zoom) * ease;
      cameraShift += ((state.phase === 2 ? 14 : 0) - cameraShift) * ease;
      heat += ((state.phase === 1 ? 1 : 0) - heat) * ease;
      background(); drawMolecule();
    };
    frameId = requestAnimationFrame(frame);

    const down = (event: PointerEvent) => { dragging = true; lastX = event.clientX; lastY = event.clientY; canvasEl.setPointerCapture?.(event.pointerId); };
    const move = (event: PointerEvent) => {
      if (!dragging) return;
      rotationTarget += (event.clientX - lastX) * .008; tiltTarget = Math.max(-.4, Math.min(.4, tiltTarget + (event.clientY - lastY) * .002));
      lastX = event.clientX; lastY = event.clientY;
    };
    const up = () => { dragging = false; };
    canvasEl.addEventListener('pointerdown', down); canvasEl.addEventListener('pointermove', move);
    for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) canvasEl.addEventListener(name, up);
    const visibility = () => { visible = !document.hidden; previousTime = 0; };
    document.addEventListener('visibilitychange', visibility);
    // Fora da tela o laço não desenha: são noventa e poucas partículas e
    // centenas de esferas por quadro, à toa enquanto se lê o texto abaixo.
    const onScreen = new IntersectionObserver(entries => { visible = entries[0].isIntersecting && !document.hidden; previousTime = 0; });
    onScreen.observe(shellEl);
    return () => {
      cancelAnimationFrame(frameId); observer.disconnect(); onScreen.disconnect();
      document.removeEventListener('visibilitychange', visibility);
      canvasEl.removeEventListener('pointerdown', down); canvasEl.removeEventListener('pointermove', move);
      for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) canvasEl.removeEventListener(name, up);
    };
  }, []);

  const data = PCR_PHASES[phase];
  const semPrimers = phase === 4 && !primers;
  const label = semPrimers ? 'Fita molde' : data.label;
  return <section className="crivo-immersion" aria-label="Cena imersiva: reação em cadeia da polimerase">
    <div className="cr-shell" ref={shell}>
      <canvas ref={canvas} className="cr-canvas" role="img" aria-label="Modelo tridimensional esquemático do DNA. As etapas mostram a separação das fitas, a ligação dos primers e a síntese de novas fitas." />
      <div className="cr-indicator"><span className="cr-dot" /><span>Exploração molecular</span></div>
      <div className="cr-intro">
        <div className="cr-eyebrow">PCR · Reação em cadeia da polimerase</div>
        <h2>{data.title[0]}<br /><em>{data.title[1]}</em></h2>
        <p className="cr-sub">Uma mudança de escala.<br />Um novo jeito de enxergar.</p>
      </div>
      <div className="cr-watermark" aria-hidden="true">PCR</div>
      <div className="cr-temp"><span className="cr-temp-number">{semPrimers ? '00' : data.number}</span><span className="cr-temp-caption">{semPrimers ? 'Novas fitas sintetizadas' : data.unit}</span></div>
      <div className="cr-tools">
        <button type="button" className="cr-tool" aria-label="Girar molécula" onClick={() => { live.current.turn += 1; }}>↻</button>
        <button type="button" className="cr-tool" aria-label={zoomed ? 'Afastar molécula' : 'Aproximar molécula'} aria-pressed={zoomed} onClick={() => setZoomed(value => !value)}>{zoomed ? '−' : '＋'}</button>
      </div>
      <button type="button" ref={hotspot} className="cr-label" aria-label={`Inspecionar ${label.toLowerCase()}`} aria-expanded={detail} onClick={() => { setDetail(true); setZoomed(true); }}>
        <span className="cr-label-dot" /><span className="cr-label-copy">{label}<small>{phase === 4 ? 'Compare na cena' : 'Toque para explorar'}</small></span>
      </button>
      <div className="cr-view-note">Arraste para girar · Toque para explorar</div>
      <div className="cr-bottom">
        <div className="cr-readout">
          <div className="cr-copy">
            <div className="cr-stage-kicker">{data.kicker}</div>
            <p className="cr-description" aria-live="polite">{semPrimers ? SEM_PRIMERS : data.text}</p>
            {detail && <p className="cr-detail">{data.detail}</p>}
            {phase === 4 && <div className="cr-compare" role="group" aria-label="Cenário da reação">
              <button type="button" className="cr-choice" aria-pressed={primers} onClick={() => setPrimers(true)}>Com primers</button>
              <button type="button" className="cr-choice" aria-pressed={!primers} onClick={() => setPrimers(false)}>Sem primers</button>
            </div>}
          </div>
          <div className="cr-actions">
            {phase === 4 && onPractice && <button type="button" className="cr-practice" onClick={onPractice}>Testar o que entendi</button>}
            <button type="button" className="cr-next" onClick={() => goTo((phase + 1) % PCR_PHASES.length)}><span>{data.action}</span><span aria-hidden="true">→</span></button>
          </div>
        </div>
        <nav className="cr-rail" aria-label="Etapas da experiência">
          {PCR_PHASES.map((item, index) => <button key={item.rail} type="button" className="cr-step" aria-current={index === phase ? 'step' : undefined} onClick={() => goTo(index)}>
            <span>{String(index + 1).padStart(2, '0')}</span>{item.rail}
          </button>)}
        </nav>
        <div className="cr-foot">
          <button type="button" className="cr-motion" aria-pressed={paused} onClick={() => setPaused(value => !value)}>
            <span aria-hidden="true">{paused ? '▷' : 'Ⅱ'}</span> {paused ? 'Retomar movimento' : 'Pausar movimento'}
          </button>
          <span className="cr-foot-text">Demonstração · Geometria e tempo simplificados</span>
        </div>
      </div>
    </div>
  </section>;
}
