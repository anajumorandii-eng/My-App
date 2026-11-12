import React, { useEffect, useRef, useState } from 'react';
import { useLiveReducedMotion } from '../../hooks/useLiveReducedMotion';
import { advanceSynthesis, newBaseOpacity } from './pcrAnimation';
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
  /** Pergunta sobre o que a PRÓXIMA etapa vai mostrar; a última não tem próxima. */
  predict?: { question: string; options: [string, string]; right: 0 | 1; why: string };
}

export const PCR_PHASES: readonly Phase[] = [
  { title: ['Entre no', 'DNA.'], kicker: '01 / A molécula', rail: 'DNA', text: 'Duas fitas complementares guardam a informação. Aproxime a molécula e acompanhe como a PCR produz novas cópias.', number: '01', unit: 'Molécula inicial', action: 'Aquecer a reação', label: 'Dupla hélice', detail: 'As fitas são antiparalelas. Os pares de bases complementares unem as duas cadeias nesta representação do DNA.', predict: { question: 'O que o calor de cerca de 95 °C faz com a dupla hélice?', options: ['Separa as duas fitas', 'Quebra cada fita em pedaços'], right: 0, why: 'O calor rompe as ligações de hidrogênio entre as bases; a cadeia de cada fita continua inteira.' } },
  { title: ['O calor', 'separa.'], kicker: '02 / Desnaturação', rail: 'Separar', text: 'O aquecimento desfaz o pareamento entre as bases. As duas fitas se separam e cada uma pode servir de molde.', number: '95°', unit: 'Celsius · exemplo', action: 'Resfriar e ligar primers', label: 'Fitas separadas', detail: 'O calor separa as fitas ao romper as interações entre elas. A cadeia de cada fita permanece íntegra.', predict: { question: 'Ao resfriar, o que se liga primeiro às fitas separadas?', options: ['As fitas longas, refazendo a hélice', 'Os primers'], right: 1, why: 'Os primers são curtos e estão em grande excesso: acham a sequência complementar antes de as fitas longas se reassociarem.' } },
  { title: ['O início', 'da cópia.'], kicker: '03 / Anelamento', rail: 'Primers', text: 'Ao resfriar, os primers se ligam a sequências complementares em fitas opostas. Eles definem onde a síntese começa.', number: '58°', unit: 'Celsius · exemplo', action: 'Iniciar a síntese', label: 'Primer', detail: 'Os primers são pequenos trechos de DNA. A temperatura de anelamento varia conforme as sequências usadas.', predict: { question: 'Em que sentido a nova fita vai crescer?', options: ['5′ → 3′', '3′ → 5′'], right: 0, why: 'A polimerase só acrescenta nucleotídeos à extremidade 3′ do primer.' } },
  { title: ['A informação', 'se multiplica.'], kicker: '04 / Extensão', rail: 'Copiar', text: 'A polimerase estende os primers. As novas fitas crescem no sentido 5′ → 3′, incorporando nucleotídeos complementares.', number: '72°', unit: 'Celsius · exemplo', action: 'Comparar os cenários', label: 'DNA polimerase', detail: 'A polimerase acrescenta nucleotídeos à extremidade 3′ do primer. O movimento na cena representa a progressão da síntese.', predict: { question: 'E se a reação não tivesse primers?', options: ['A cópia aconteceria, só mais devagar', 'Nenhuma fita nova seria sintetizada'], right: 1, why: 'Sem a extremidade 3′ de um primer, a polimerase não tem onde começar.' } },
  { title: ['E sem', 'primers?'], kicker: '05 / Compare o resultado', rail: 'Comparar', text: 'Com primers, duas novas fitas são sintetizadas. Cada molécula resultante tem uma fita original e uma nova.', number: '02', unit: 'Novas fitas sintetizadas', action: 'Rever a experiência', label: 'Nova fita', detail: 'Em ciclos repetidos, a quantidade do trecho-alvo aumenta. A cena mostra uma representação simplificada da síntese.' },
];

const SEM_PRIMERS = 'Sem primers desde o início da reação, a polimerase não tem um ponto de partida. Não há amplificação do trecho-alvo.';
const DETALHE_SEM_PRIMERS = 'O DNA inicial continua presente, mas, sem primers, a polimerase não inicia novas fitas.';
const DETALHE_FITA_PRONTA = 'Cada molécula resultante tem uma fita original e uma nova. A nova fita foi sintetizada no sentido 5′ → 3′ a partir do primer.';

export type TemaDaCena = 'caderno' | 'noite';

/**
 * As duas tintas da mesma cena. "Noite" é a da referência. "Caderno" existe
 * porque a referência, verde-escura e lima, é um salto de linguagem dentro de
 * um aplicativo de papel e bordô: com muitas cenas assim a aba Visual viraria
 * outro produto. O desenho é o mesmo; só a tinta muda.
 */
const PALETA = {
  noite: {
    fundo: '#071b19', brilho: ['#285442', '#163b31', '#071b19'], luz: '#d1eaae13', anel: '#d0ebbb12', poeira: '#d4ecc9', poeiraGrande: '#ddf7c8',
    atomo: { green: '#9acbb0', cyan: '#83c6ce', gold: '#e9ca7a', violet: '#c7a0e5', white: '#d6e9d6' },
    esfera: ['#f6ffe8', '#284d42', '#071f1c'], reflexo: '#f6ffea', ponte: '#dcecc3', fio: '#eeffe833', texto: '#d8eddf', guia: '#d6ebcf66', ponto: '#ecffda',
    calor: (h: number) => `rgba(${Math.round(28 + h * 55)},${Math.round(68 - h * 10)},38,.82)`,
  },
  caderno: {
    fundo: '#f6f0e3', brilho: ['#fffaf0', '#f3ebdb', '#ebe1cd'], luz: '#ffffff40', anel: '#2a211814', poeira: '#8a7d68', poeiraGrande: '#c9b99a',
    atomo: { green: '#3f8a73', cyan: '#2f6f93', gold: '#b9791c', violet: '#7d52a8', white: '#a39a88' },
    esfera: ['#ffffff', '#3a3026', '#1f1812'], reflexo: '#ffffff', ponte: '#7d7361', fio: '#ffffff55', texto: '#3a3026', guia: '#2a211866', ponto: '#86233a',
    calor: (h: number) => `rgba(${Math.round(250 - h * 8)},${Math.round(228 - h * 52)},${Math.round(196 - h * 78)},.95)`,
  },
} as const;
const N = 28;
// Centro da molécula no celular. A referência a punha em 371 px numa cena de
// 820 px, mais alta que a tela: quem estava na etapa 1 não via o trilho de
// etapas sem rolar. Aqui a cena tem 724 px e a molécula sobe e encolhe.
const MOBILE_CY = 262;
type P3 = { x: number; y: number; z: number };

const seed = (i: number) => { const value = Math.sin(i * 127.1 + 311.7) * 43758.5453; return value - Math.floor(value); };
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

export default function PcrImmersion({ onPractice, temaInicial }: { onPractice?: () => void; temaInicial?: TemaDaCena }) {
  const [phase, setPhase] = useState(0);
  const [primers, setPrimers] = useState(true);
  const [zoomed, setZoomed] = useState(false);
  const [detail, setDetail] = useState(false);
  // Sem escolha, a tinta segue o tema do aplicativo: em caderno fixo, a cena
  // virava um quadro claro no meio do tema escuro. Quem troca pelo botão fica
  // com a escolha enquanto a cena estiver aberta.
  const appEscuro = useAppEscuro();
  const [escolhida, setEscolhida] = useState<TemaDaCena | null>(temaInicial ?? null);
  const tema: TemaDaCena = escolhida ?? (appEscuro ? 'noite' : 'caderno');
  // O que a estudante previu ao sair da etapa anterior. Vale só nesta visita:
  // a cena não é avaliação, e evidência continua vindo de Testar e Reconstruir.
  const [previsao, setPrevisao] = useState<{ acertou: boolean; porque: string } | null>(null);
  const reduced = useLiveReducedMotion();
  const [paused, setPaused] = useState(false);
  const [synthesisComplete, setSynthesisComplete] = useState(false);

  const shell = useRef<HTMLDivElement>(null), canvas = useRef<HTMLCanvasElement>(null), hotspot = useRef<HTMLButtonElement>(null);
  // O laço de desenho lê o estado por aqui: recriá-lo a cada clique reiniciaria
  // a separação das fitas e a síntese no meio da transição.
  const live = useRef({ phase, primers, zoomed, paused, reduced, tema, turn: 0 });
  live.current.reduced = reduced;
  live.current.tema = tema; live.current.phase = phase; live.current.primers = primers; live.current.zoomed = zoomed; live.current.paused = paused;

  const goTo = (value: number) => { setPhase(value); setPrimers(true); setDetail(false); setPrevisao(null); if (value !== phase) setSynthesisComplete(false); };
  const prever = (escolha: number) => {
    const pergunta = PCR_PHASES[phase].predict;
    if (!pergunta) return;
    setPhase(phase + 1); setPrimers(true); setDetail(false);
    setSynthesisComplete(false);
    setPrevisao({ acertou: escolha === pergunta.right, porque: pergunta.why });
  };

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
    let lastPrimers = true, lastPaused = false, lastZoomed = false, completed = false;
    const sprites = new Map<string, HTMLCanvasElement>();
    const particles = Array.from({ length: 95 }, (_, i) => ({ x: seed(i) * 2 - 1, y: seed(i + 95) * 2 - 1, z: seed(i + 190), size: 1 + seed(i + 285) * 3.5, speed: .18 + seed(i + 380) * .4 }));

    const sphereSprite = (color: string) => {
      const pal = PALETA[live.current.tema], key = live.current.tema + color;
      const cached = sprites.get(key);
      if (cached) return cached;
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
      const base = mobile ? Math.min(width / 355, 1.28) * .74 : Math.min(width / 660, 1.58);
      const scale = base * zoom * perspective;
      return { x: width * (mobile ? .52 : .665) + x * scale, y: (mobile ? MOBILE_CY : 330) + y * scale + cameraShift, z, scale };
    };

    const background = () => {
      const pal = PALETA[live.current.tema];
      ctx.fillStyle = pal.fundo; ctx.fillRect(0, 0, width, height);
      const mobile = width < 641;
      const glow = ctx.createRadialGradient(width * .67, height * .36, 0, width * .65, height * .35, width * .65);
      glow.addColorStop(0, heat > .1 ? pal.calor(heat) : pal.brilho[0]);
      glow.addColorStop(.45, pal.brilho[1]); glow.addColorStop(1, pal.brilho[2]); ctx.fillStyle = glow; ctx.fillRect(0, 0, width, height);
      const light = ctx.createLinearGradient(width * .7, 0, width * .2, height * .7); light.addColorStop(0, pal.luz); light.addColorStop(.6, pal.fundo + '00');
      ctx.fillStyle = light; ctx.fillRect(0, 0, width, height);
      ctx.save(); ctx.translate(width * (mobile ? .52 : .66), mobile ? MOBILE_CY : 330); ctx.rotate(-.35);
      ctx.strokeStyle = pal.anel; ctx.lineWidth = .7;
      for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(0, 0, (mobile ? 128 : 280) + i * 24, (mobile ? 58 : 115) + i * 15, 0, .24, Math.PI * 1.56); ctx.stroke(); }
      ctx.restore();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]; const x = (p.x * .5 + .5) * width + Math.sin(elapsed * p.speed * .15 + i) * 12;
        const y = (((p.y * .5 + .5) * height - elapsed * p.speed * 3) % height + height) % height;
        ctx.globalAlpha = .05 + p.z * .2;
        if (p.size > 3) { const g = ctx.createRadialGradient(x, y, 0, x, y, p.size * 3); g.addColorStop(0, pal.poeiraGrande); g.addColorStop(1, pal.poeiraGrande + '00'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, p.size * 3, 0, Math.PI * 2); ctx.fill(); }
        else { ctx.fillStyle = pal.poeira; ctx.beginPath(); ctx.arc(x, y, p.size * .45, 0, Math.PI * 2); ctx.fill(); }
      }
      ctx.globalAlpha = 1;
    };

    type Projected = ReturnType<typeof project>;
    type Item = { kind: 'sphere'; q: Projected; r: number; color: string; alpha: number; z: number } | { kind: 'bond'; p: Projected; q: Projected; r: number; color: string; alpha: number; z: number };
    const drawMolecule = () => {
      const { phase: now, primers: withPrimers } = live.current;
      const pal = PALETA[live.current.tema], ATOM = pal.atomo;
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
          if (strand === 0 && separation < 50) addBond(mix(p, opposite, .42), mix(p, opposite, .58), pal.ponte, 1.2, Math.max(0, 1 - separation / 45) * .7);
          const isPrimer = strand === 0 ? i >= N - 4 : i < 4;
          const order = strand === 0 ? N - 5 - i : i - 4;
          const copied = isPrimer ? primerAmount : newBaseOpacity(extension, order, N - 4);
          if (copied > .005) {
            const newColor = isPrimer ? ATOM.gold : ATOM.violet;
            addSphere(localOpposite, 5.5, newColor, copied);
            const baseEnd = mix(localOpposite, p, .46); addBond(localOpposite, baseEnd, newColor, 2.4, copied); addSphere(baseEnd, 3.4, newColor, copied);
            addBond(baseEnd, localCenter, pal.ponte, 1, copied * .7);
            if ((strand === 0 && i < N - 1) || (strand === 1 && i > 0)) addBond(localOpposite, point(i + (strand === 0 ? 1 : -1), strand, true), newColor, 3, copied);
          }
        }
      }
      if (now === 3 && extension < 1 && primerAmount > .8) {
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
          ctx.strokeStyle = pal.fio; ctx.lineWidth = item.r * .22; ctx.beginPath(); ctx.moveTo(item.p.x - 1, item.p.y - 1); ctx.lineTo(item.q.x - 1, item.q.y - 1); ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      // As pontas de cada fita molde: a orientação não muda com a câmera.
      if (now > 0) {
        ctx.font = '600 13px Inter, Arial, sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = pal.texto;
        for (let strand = 0; strand < 2; strand++) for (const index of [0, N - 1]) { const p = project(point(index, strand)); ctx.fillText((strand === 0) === (index === 0) ? '5′' : '3′', p.x, p.y + (index === 0 ? -15 : 22)); }
      }
      let target = point(10, 1);
      if (now === 2) target = point(2, 1, true);
      if (now === 3) target = extension >= 1 ? point(10, 1, true) : point(3 + (N - 4) * extension, 1, true);
      if (now === 4) target = point(10, 1, withPrimers);
      // A largura inclui a folga das duas ferramentas à direita: sem ela a etiqueta
      // parava debaixo do botão de aproximar.
      const anchor = project(target), mobile = width < 641, labelWidth = mobile ? 236 : 250;
      const labelX = Math.min(width - labelWidth - 14, Math.max(mobile ? 18 : width * .47, anchor.x + 24));
      const labelY = Math.max(mobile ? 236 : 240, Math.min(mobile ? 292 : 400, anchor.y - 20));
      if (hotspot.current) { hotspot.current.style.left = labelX + 'px'; hotspot.current.style.top = labelY + 'px'; }
      ctx.strokeStyle = pal.guia; ctx.lineWidth = .7; ctx.beginPath(); ctx.moveTo(anchor.x, anchor.y); ctx.lineTo(labelX, labelY); ctx.stroke();
      ctx.fillStyle = pal.ponto; ctx.beginPath(); ctx.arc(anchor.x, anchor.y, 2.4, 0, Math.PI * 2); ctx.fill();
    };

    const frame = (timestamp: number) => {
      frameId = requestAnimationFrame(frame);
      if (!visible) return;
      const state = live.current;
      const delta = previousTime ? Math.min((timestamp - previousTime) / 1000, .05) : .016; previousTime = timestamp;
      const changed = state.phase !== lastPhase || state.primers !== lastPrimers;
      const zoomChanged = state.zoomed !== lastZoomed; lastZoomed = state.zoomed;
      if (state.phase !== lastPhase) { if (state.phase === 3) extension = 0; completed = false; lastPhase = state.phase; }
      lastPrimers = state.primers;
      if (state.paused && !lastPaused) { rotationTarget = rotation; tiltTarget = tilt; }
      lastPaused = state.paused;
      if (state.turn !== lastTurn) { rotationTarget += Math.PI / 3 * (state.turn - lastTurn); lastTurn = state.turn; }
      // Trocar explicitamente de etapa/cenário continua mostrando seu resultado
      // mesmo com a pausa ligada. Pausar a etapa corrente conserva seu progresso.
      const instant = state.reduced || (state.paused && changed);
      const ease = instant ? 1 : state.paused ? 0 : 1 - Math.exp(-delta * 3);
      const still = state.paused || state.reduced;
      if (!still) { elapsed += delta; if (!dragging) rotationTarget += delta * .055; }
      const cameraEase = still ? 1 : Math.min(1, delta * 5);
      rotation += (rotationTarget - rotation) * cameraEase;
      tilt += (tiltTarget - tilt) * cameraEase;
      separation += ((state.phase === 0 ? 0 : 88) - separation) * ease;
      const hasPrimers = state.phase >= 2 && (state.phase !== 4 || state.primers);
      primerAmount += ((hasPrimers ? 1 : 0) - primerAmount) * ease;
      if (state.phase === 3) extension = advanceSynthesis(extension, delta, state.paused, instant);
      else extension += ((state.phase === 4 && state.primers ? 1 : 0) - extension) * ease;
      if (state.phase === 3 && extension >= 1 && !completed) { completed = true; setSynthesisComplete(true); }
      zoom += ((state.zoomed ? 1.25 : 1) - zoom) * (state.reduced || (still && zoomChanged) ? 1 : ease);
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
    // Duas condições independentes: a aba estar à frente e a cena estar na
    // tela. Antes o retorno à aba punha `visible = true` sozinho; quem tinha
    // rolado até a leitura, trocado de aba e voltado ficava com a cena
    // desenhando fora da tela, porque o IntersectionObserver só avisa quando a
    // interseção muda.
    let naTela = true;
    const atualizar = () => { visible = naTela && !document.hidden; previousTime = 0; };
    const visibility = atualizar;
    document.addEventListener('visibilitychange', visibility);
    // Fora da tela o laço não desenha: são noventa e poucas partículas e
    // centenas de esferas por quadro, à toa enquanto se lê o texto abaixo.
    const onScreen = new IntersectionObserver(entries => { naTela = entries[entries.length - 1].isIntersecting; atualizar(); });
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
  const fitaPronta = phase === 3 && (reduced || synthesisComplete);
  const label = semPrimers ? 'Fita molde' : fitaPronta ? 'Nova fita' : data.label;
  const detailText = semPrimers ? DETALHE_SEM_PRIMERS : fitaPronta ? DETALHE_FITA_PRONTA : data.detail;
  return <section className="crivo-immersion" data-tema={tema} aria-label="Cena imersiva: reação em cadeia da polimerase">
    <div className="cr-shell" ref={shell}>
      <canvas ref={canvas} className="cr-canvas" role="img" aria-label="Modelo tridimensional esquemático do DNA. As etapas mostram a separação das fitas, a ligação dos primers e a síntese de novas fitas." />
      <div className="cr-indicator"><span className="cr-dot" /><span>Exploração molecular</span></div>
      <div className="cr-intro">
        <div className="cr-eyebrow">PCR · Reação em cadeia da polimerase</div>
        <h2>{data.title[0]}<br /><em>{data.title[1]}</em></h2>
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
            {previsao && <p className="cr-feedback" data-acertou={previsao.acertou} role="status">
              {/* No acerto, a explicação é o próprio texto da etapa logo abaixo:
                  repeti-la aqui fazia o bloco subir sobre a molécula. */}
              <strong>{previsao.acertou ? 'Você previu certo.' : 'Não foi isso.'}</strong>{!previsao.acertou && <> {previsao.porque}</>}
            </p>}
            <p className="cr-description" aria-live="polite">{semPrimers ? SEM_PRIMERS : data.text}</p>
            {detail && <p className="cr-detail">{detailText}</p>}
            {phase === 4 && <div className="cr-compare" role="group" aria-label="Cenário da reação">
              <button type="button" className="cr-choice" aria-pressed={primers} onClick={() => setPrimers(true)}>Com primers</button>
              <button type="button" className="cr-choice" aria-pressed={!primers} onClick={() => setPrimers(false)}>Sem primers</button>
            </div>}
          </div>
          {data.predict && <div className="cr-predict" role="group" aria-label="Antes de avançar, preveja">
            <p><span>Antes de avançar</span>{data.predict.question}</p>
            <div>{data.predict.options.map((option, index) => <button key={option} type="button" className="cr-choice" onClick={() => prever(index)}>{option}</button>)}</div>
          </div>}
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
          <button type="button" className="cr-motion" disabled={reduced} aria-pressed={paused || reduced} onClick={() => setPaused(value => !value)}>
            <span aria-hidden="true">{paused || reduced ? '▷' : 'Ⅱ'}</span> {reduced ? 'Movimento reduzido' : paused ? 'Retomar movimento' : 'Pausar movimento'}
          </button>
          <button type="button" className="cr-motion cr-tema" aria-pressed={tema === 'noite'} onClick={() => setEscolhida(tema === 'noite' ? 'caderno' : 'noite')}>
            <span aria-hidden="true">◐</span> {tema === 'noite' ? 'Ver em caderno' : 'Ver em noite'}
          </button>
          <span className="cr-foot-text">Geometria e tempo simplificados</span>
        </div>
      </div>
    </div>
  </section>;
}
