import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { imagemDaLente, raiosNotaveis } from '../../../lib/lenteDelgada';
import { MEDIDAS, type PreferenciasDaCena } from '../../../lib/bancadaOptica';
import { escurecer, clarear } from './coresDaCena';

/**
 * Motor da bancada óptica: three.js direto, sem React.
 *
 * A primeira versão era declarativa (react-three-fiber). O acabamento aprovado
 * pela Ana Júlia foi feito num artefato em three.js puro, e reescrever cada
 * peça em JSX era duplicar a cena com chance de divergir dela; aqui está o
 * mesmo código do artefato, com a física vinda de lenteDelgada.ts. O React
 * (BancadaOptica.tsx) só controla p, tema e preferências.
 */

const { cmPorUnidade: CM, foco: F, alturaObjeto: H, eixo: EIXO, raioLente: R, pMin: PMIN, pMax: PMAX, trilhoInicio: TI, trilhoFim: TF } = MEDIDAS;

export type IdRotulo = 'F' | 'F2' | 'objeto' | 'imagem' | 'cotaP' | 'cotaPl';

export interface OpcoesBancada {
  /** Cor da matéria, lida do ambiente: é o feixe. */
  acento: string;
  escuro: boolean;
  preferencias: PreferenciasDaCena;
  /** Falso com movimento reduzido: câmera parada e cena desenhada sob demanda. */
  movimento: boolean;
}

export interface Bancada {
  definirP(p: number): void;
  configurar(opcoes: OpcoesBancada): void;
  destruir(): void;
}

type Trio = [number, number, number];

// ---- Visuais ----
// Cada visual é uma paleta fechada: fundo, chão, metal, luz, contraluz e a
// correção de cor saem da mesma família, com um único acento no feixe — a cor
// da matéria. A primeira versão misturava chão cinza neutro, raio no acento,
// lâmpada laranja, anteparo bege e trilho preto: cinco famílias sem relação.
const BASE = {
  escuro: {
    e: true, ceu: ['#3a141a', '#2a1a0e', '#0f2016'], horizonte: '#16120b', mesa: '#2a1f13', grade: 'rgba(233,210,166,.2)', manchas: 'rgba(0,0,0,.25)',
    escuroMetal: '#2c2016', aco: '#d8c7a8', latao: '#c99552', objeto: '#ffb45e',
    anteparo: '#b8a484', eixo: '#9c8a6c', marca: '#e3cfa8', regua: '#241a10', ceuLuz: '#ffdcb0', chao: '#140d07',
    chave: '#ffe4c0', recorte: '#e0485c', recorteForca: 1.5, preenchimento: '#3fae7a', bloom: 0.72,
    tinta: '#e9d2a6', tintaOpacidade: 0.38, papel: '#120c07', vidro: '#eaf6f4',
    vinheta: 0.62, sombra: [0.0, 0.03, 0.015] as Trio, luz: [1.05, 0.97, 0.86] as Trio, poca: 'rgba(255,200,130,.13)',
  },
  claro: {
    e: false, ceu: ['#f4e8cf', '#ead9b6', '#d9c49a'], horizonte: '#e6d5b2', mesa: '#e8d8b6', grade: 'rgba(92,60,30,.3)', manchas: 'rgba(120,80,30,.10)',
    escuroMetal: '#3b2c20', aco: '#b7a78c', latao: '#a8773a', objeto: '#c0621a',
    anteparo: '#f6ecd6', eixo: '#8a7458', marca: '#f1e3c6', regua: '#3b2c20', ceuLuz: '#fff6e2', chao: '#cdb68c',
    chave: '#fff3dc', recorte: '#fff0d8', recorteForca: 0.5, preenchimento: '#e9d7b0', bloom: 0,
    tinta: '#4a2f1c', tintaOpacidade: 0.5, papel: '#f4e8cf', vidro: '#f4f8f2',
    vinheta: 0.34, sombra: [0.03, 0.015, 0.0] as Trio, luz: [1.0, 0.97, 0.9] as Trio, poca: 'rgba(255,248,230,.5)',
  },
};

type Paleta = (typeof BASE)['escuro'] & { raio: string; nucleo: string; imagem: string };

function paleta({ acento, escuro }: OpcoesBancada): Paleta {
  // No escuro o feixe é o acento vivo, com núcleo quase branco; no papel
  // creme o acento vivo sumia, então ele escurece e o núcleo acompanha.
  return escuro
    ? { ...BASE.escuro, raio: acento, nucleo: clarear(acento, 0.88), imagem: clarear(acento, 0.4) }
    : { ...BASE.claro, raio: escurecer(acento, 0.42), nucleo: escurecer(acento, 0.52), imagem: escurecer(acento, 0.42) };
}

// ---- Texturas desenhadas ----
function papel(g: CanvasRenderingContext2D, w: number, h: number, c: Paleta, fibras: number) {
  // Fibras e manchas de papel velho: o que as fichas antigas tinham de
  // matéria, agora sobre a cena.
  for (let i = 0; i < fibras; i += 1) {
    g.strokeStyle = c.e ? `rgba(255,230,190,${0.02 + Math.random() * 0.04})` : `rgba(90,60,25,${0.03 + Math.random() * 0.05})`;
    g.lineWidth = Math.random() * 1.2;
    const x = Math.random() * w, y = Math.random() * h, a = Math.random() * Math.PI, l = 6 + Math.random() * 22;
    g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a) * l * 0.5 + 3, y + Math.sin(a) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke();
  }
  for (let i = 0; i < 14; i += 1) {
    const x = Math.random() * w, y = Math.random() * h, r = 30 + Math.random() * 140;
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, c.manchas); gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2);
  }
}

/**
 * Unidade de desenho do fundo. Pela altura, o traço não estica no celular;
 * mas na coluna quase quadrada do cartão no iPad, a unidade pela altura
 * deixava as três fórmulas largas demais e uma encavalava na outra. Abaixo da
 * proporção 1,4 quem manda é a largura.
 */
function unidade(w: number, h: number) {
  return Math.min(h / 100, w / 140);
}

/**
 * Rabiscos de estudo: o caderno de óptica atrás da bancada. Tudo é conteúdo da
 * matéria — fórmulas e esquemas corretos —, em tinta fraca, na faixa de cima,
 * onde o fundo aparece acima do horizonte. As linhas de dioptria e o espelho
 * côncavo foram desenhados e saíram: caíam atrás do feixe e sujavam a leitura
 * dos raios.
 */
function rabiscar(g: CanvasRenderingContext2D, w: number, h: number, c: Paleta) {
  const u = unidade(w, h);
  const tinta = (a: number) => (c.e ? `rgba(233,210,166,${a})` : `rgba(74,47,28,${a})`);
  g.lineCap = 'round'; g.lineJoin = 'round';
  const texto = (t: string, x: number, y: number, tam: number, rot = 0, a = 0.34) => {
    g.save(); g.translate(x, y); g.rotate(rot); g.fillStyle = tinta(a);
    g.font = `400 ${tam * u}px Kalam, cursive`; g.fillText(t, 0, 0); g.restore();
  };
  const traco = (a = 0.3, l = 0.28) => { g.strokeStyle = tinta(a); g.lineWidth = l * u; };
  texto('1/f = 1/p + 1/p′', w * 0.05, 11 * u, 5.4, -0.05);
  texto('A = i/o = −p′/p', w * 0.62, 10 * u, 4.6, 0.04);
  texto('n₁ · sen θ₁ = n₂ · sen θ₂', w * 0.3, 4.5 * u, 3.4, -0.02, 0.28);
  { // lente com raios convergindo no foco
    const x = w * 0.2, y = 22 * u, a = 7 * u; traco(0.32);
    g.beginPath(); g.moveTo(x - 16 * u, y); g.lineTo(x + 18 * u, y); g.stroke();
    g.beginPath(); g.ellipse(x, y, 1.6 * u, a, 0, 0, Math.PI * 2); g.stroke();
    for (const k of [-0.7, 0, 0.7]) {
      g.beginPath(); g.moveTo(x - 14 * u, y + k * a); g.lineTo(x, y + k * a); g.lineTo(x + 10 * u, y); g.stroke();
    }
    g.fillStyle = tinta(0.4); g.beginPath(); g.arc(x + 10 * u, y, 0.6 * u, 0, Math.PI * 2); g.fill();
    texto('F′', x + 9 * u, y + 4 * u, 3, 0, 0.36);
  }
  { // prisma separando a luz
    const x = w * 0.5, y = 25 * u, l = 8 * u; traco(0.3);
    g.beginPath(); g.moveTo(x, y - l); g.lineTo(x + l * 0.9, y + l * 0.55); g.lineTo(x - l * 0.9, y + l * 0.55); g.closePath(); g.stroke();
    g.beginPath(); g.moveTo(x - 16 * u, y + 2 * u); g.lineTo(x - 3 * u, y); g.stroke();
    [-1, 0, 1].forEach((k, i) => { g.setLineDash(i === 1 ? [] : [1 * u, 1 * u]); g.beginPath(); g.moveTo(x + 2.5 * u, y + 1 * u); g.lineTo(x + 15 * u, y + (4 + k * 2.2) * u); g.stroke(); });
    g.setLineDash([]);
    texto('dispersão', x + 12 * u, y + 11 * u, 2.8, 0.08, 0.3);
  }
  { // olho com o cristalino
    const x = w * 0.86, y = 23 * u, r = 5.5 * u; traco(0.3);
    g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.stroke();
    g.beginPath(); g.ellipse(x - r * 0.72, y, 0.9 * u, 2.4 * u, 0, 0, Math.PI * 2); g.stroke();
    g.beginPath(); g.moveTo(x - 14 * u, y - 2.5 * u); g.lineTo(x - r * 0.72, y - 0.5 * u); g.lineTo(x + r, y + 0.4 * u); g.stroke();
    g.beginPath(); g.moveTo(x - 14 * u, y + 2.5 * u); g.lineTo(x - r * 0.72, y + 0.5 * u); g.lineTo(x + r, y - 0.4 * u); g.stroke();
    texto('retina', x + r + 1 * u, y + 1 * u, 2.6, 0, 0.3);
  }
  { // mancha de xícara: papel usado de verdade
    const x = w * 0.03, y = 4 * u, r = 7 * u;
    g.strokeStyle = c.e ? 'rgba(120,80,40,.22)' : 'rgba(120,80,30,.16)'; g.lineWidth = 1.1 * u;
    g.beginPath(); g.arc(x, y, r, 0.2, Math.PI * 1.85); g.stroke();
    g.lineWidth = 0.4 * u; g.beginPath(); g.arc(x + 0.6 * u, y + 0.3 * u, r * 0.93, 0.5, Math.PI * 1.5); g.stroke();
  }
}

/** Carimbo circular da matéria, em vinho, como nos arquivos antigos. */
function carimbar(g: CanvasRenderingContext2D, h: number, w: number, c: Paleta) {
  // No canto de cima, acima da faixa dos rótulos: no meio do fundo, no palco
  // largo do iPad em retrato, ele ficava atrás de "imagem real, invertida".
  const u = unidade(w, h), r = 5.5 * u;
  g.save(); g.translate(w * 0.9, 9 * u); g.rotate(-0.18);
  const cor = c.e ? 'rgba(224,72,92,.42)' : 'rgba(122,36,51,.38)';
  g.strokeStyle = cor; g.fillStyle = cor;
  g.lineWidth = 0.5 * u; g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.stroke();
  g.lineWidth = 0.22 * u; g.beginPath(); g.arc(0, 0, r * 0.78, 0, Math.PI * 2); g.stroke();
  g.font = `700 ${1.7 * u}px "Space Grotesk", sans-serif`; g.textAlign = 'center';
  const arco = 'CRIVO · FÍSICA · ÓPTICA · ';
  for (let i = 0; i < arco.length; i += 1) {
    const a = (i / arco.length) * Math.PI * 2 - Math.PI / 2;
    g.save(); g.rotate(a + Math.PI / 2); g.fillText(arco[i], 0, -r * 0.86); g.restore();
  }
  g.font = `700 ${2.8 * u}px Kalam, cursive`; g.fillText('lentes', 0, 1 * u);
  g.restore();
}

function texturaCeu(c: Paleta, pref: PreferenciasDaCena, aspecto: number) {
  // Diagonal da logo: vinho no alto à esquerda, âmbar no meio, floresta
  // embaixo à direita; o horizonte, que é a cor da névoa, fecha no chão. O
  // canvas segue a proporção do palco: numa textura fixa, as letras dos
  // rabiscos esticariam no celular.
  const w = 1600, h = Math.round(w / THREE.MathUtils.clamp(aspecto, 0.5, 4));
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  const g = cv.getContext('2d')!;
  const grad = g.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, c.ceu[0]); grad.addColorStop(0.5, c.ceu[1]); grad.addColorStop(1, c.ceu[2]);
  g.fillStyle = grad; g.fillRect(0, 0, w, h);
  const base = g.createLinearGradient(0, h * 0.55, 0, h);
  base.addColorStop(0, 'rgba(0,0,0,0)'); base.addColorStop(1, c.horizonte);
  g.fillStyle = base; g.fillRect(0, 0, w, h);
  papel(g, w, h, c, 3200);
  if (pref.rabiscos) rabiscar(g, w, h, c);
  if (pref.carimbo) carimbar(g, h, w, c);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function texturaMesa(c: Paleta, pref: PreferenciasDaCena) {
  // Papel milimetrado em sépia: um traço por centímetro da escala da cena
  // (0,2 unidade), mais forte a cada 5 cm. É a folha em que as fichas eram
  // desenhadas, agora deitada sob a bancada.
  const px = 512, cv = document.createElement('canvas'); cv.width = cv.height = px;
  const g = cv.getContext('2d')!;
  g.fillStyle = c.mesa; g.fillRect(0, 0, px, px);
  papel(g, px, px, c, 900);
  g.strokeStyle = c.grade;
  if (pref.papel === 'milimetrado') {
    for (let i = 0; i <= 10; i += 1) {
      g.lineWidth = i % 5 === 0 ? 3.2 : 1.3;
      const q = (i / 10) * px;
      g.beginPath(); g.moveTo(q, 0); g.lineTo(q, px); g.stroke();
      g.beginPath(); g.moveTo(0, q); g.lineTo(px, q); g.stroke();
    }
  } else if (pref.papel === 'pautado') {
    // Linhas de caderno ao longo do trilho e a margem vermelha.
    g.lineWidth = 2;
    for (let i = 0; i <= 4; i += 1) { const q = (i / 4) * px; g.beginPath(); g.moveTo(0, q); g.lineTo(px, q); g.stroke(); }
    g.strokeStyle = c.e ? 'rgba(224,72,92,.35)' : 'rgba(170,40,50,.35)'; g.lineWidth = 3;
    g.beginPath(); g.moveTo(px * 0.12, 0); g.lineTo(px * 0.12, px); g.stroke();
  }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(pref.papel === 'pautado' ? 8 : 40, 20);
  t.anisotropy = 16;
  return t;
}

function texturaRadial(interno: string, externo: string) {
  const cv = document.createElement('canvas'); cv.width = cv.height = 256;
  const g = cv.getContext('2d')!, grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, interno); grad.addColorStop(1, externo);
  g.fillStyle = grad; g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(cv);
}

function texturaEscovada() {
  // Riscos finos ao longo do trilho: é o que faz o alumínio parecer usinado.
  const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 128;
  const g = cv.getContext('2d')!;
  g.fillStyle = '#8a8a8a'; g.fillRect(0, 0, 1024, 128);
  for (let i = 0; i < 1400; i += 1) {
    const v = 110 + Math.random() * 60;
    g.fillStyle = `rgba(${v},${v},${v},${0.12 + Math.random() * 0.2})`;
    g.fillRect(Math.random() * 1024, Math.random() * 128, 60 + Math.random() * 400, 1);
  }
  const t = new THREE.CanvasTexture(cv);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(6, 1);
  return t;
}

function texturaHalo() {
  const cv = document.createElement('canvas'); cv.width = cv.height = 128;
  const g = cv.getContext('2d')!, grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(255,255,255,1)'); grad.addColorStop(0.25, 'rgba(255,255,255,.45)'); grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad; g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(cv);
}

function texturaRegua(c: Paleta) {
  // Um traço por centímetro, número a cada 10.
  const cm = (TF - TI) * CM, px = 24, cv = document.createElement('canvas');
  cv.width = Math.ceil(cm * px); cv.height = 64;
  const g = cv.getContext('2d')!;
  g.fillStyle = c.regua; g.fillRect(0, 0, cv.width, 64);
  g.fillStyle = c.marca; g.font = '600 22px "JetBrains Mono", monospace'; g.textAlign = 'center';
  for (let i = 0; i <= cm; i += 1) {
    const x = i * px, alt = i % 10 === 0 ? 30 : i % 5 === 0 ? 20 : 11;
    g.fillRect(x - 1, 0, 2, alt);
    if (i % 10 === 0 && i > 0 && i < cm) g.fillText(String(i), x, 58);
  }
  const t = new THREE.CanvasTexture(cv); t.anisotropy = 8; t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// ---- Peças ----
const std = (color: string, metalness = 0, roughness = 0.5, extra: THREE.MeshStandardMaterialParameters = {}) => new THREE.MeshStandardMaterial({ color, metalness, roughness, ...extra });
const basic = (color: string, k = 1, extra: THREE.MeshBasicMaterialParameters = {}) => new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(k), toneMapped: false, ...extra });

function malha(geo: THREE.BufferGeometry, mat: THREE.Material, pos: Trio = [0, 0, 0], rot: Trio = [0, 0, 0], sombra = true) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(...pos); m.rotation.set(...rot);
  m.castShadow = sombra; m.receiveShadow = sombra;
  return m;
}

/** Cilindro entre dois pontos: é assim que os raios e o eixo viram volume. */
function segmento(a: THREE.Vector3, b: THREE.Vector3, raio: number, cor: string, k = 1, opacidade = 1) {
  const dir = new THREE.Vector3().subVectors(b, a);
  // Sem iluminação: o raio é a própria luz. Com material iluminado, a luz da
  // cena somava à cor e o raio escurecido para o papel voltava a clarear.
  const m = new THREE.Mesh(new THREE.CylinderGeometry(raio, raio, dir.length(), 12, 1, false),
    basic(cor, k, { transparent: opacidade < 1, opacity: opacidade, depthWrite: opacidade >= 1 }));
  m.position.addVectors(a, b).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  return m;
}

function seta(altura: number) {
  const haste = 0.06, lp = 0.22, ponta = 0.24, s = new THREE.Shape();
  s.moveTo(-haste / 2, 0); s.lineTo(haste / 2, 0); s.lineTo(haste / 2, altura - ponta); s.lineTo(lp / 2, altura - ponta);
  s.lineTo(0, altura); s.lineTo(-lp / 2, altura - ponta); s.lineTo(-haste / 2, altura - ponta); s.closePath();
  return new THREE.ShapeGeometry(s);
}

/**
 * Contorno a tinta nas arestas das peças sólidas: o traço das fichas
 * desenhadas à mão, agora seguindo o volume. Vidro, raios, luz e chão ficam de
 * fora — contorno neles viraria ruído.
 */
function tracar(grupo: THREE.Object3D, c: Paleta) {
  const mat = new THREE.LineBasicMaterial({ color: c.tinta, transparent: true, opacity: c.tintaOpacidade, depthWrite: false });
  const alvos: THREE.Mesh[] = [];
  grupo.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh || Array.isArray(m.material)) return;
    const mat0 = m.material as THREE.Material & { isMeshBasicMaterial?: boolean; isMeshPhysicalMaterial?: boolean };
    if (mat0.transparent || mat0.isMeshBasicMaterial || mat0.isMeshPhysicalMaterial) return;
    const tipo = m.geometry.type;
    if (tipo === 'PlaneGeometry' || tipo === 'SphereGeometry' || tipo === 'TorusGeometry' || tipo === 'ShapeGeometry') return;
    alvos.push(m);
  });
  for (const m of alvos) m.add(new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry, 35), mat));
}

function descartar(obj: THREE.Object3D) {
  obj.traverse((o) => {
    const m = o as THREE.Mesh;
    m.geometry?.dispose();
    const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
    for (const x of mats) {
      // O halo é compartilhado entre montagens e sai só no destruir().
      const mapa = (x as THREE.MeshBasicMaterial).map;
      if (mapa && !mapa.userData.compartilhada) mapa.dispose();
      x.dispose();
    }
  });
}

export function montarBancada(
  palco: HTMLElement,
  rotulos: Partial<Record<IdRotulo, HTMLElement | null>>,
  opcoesIniciais: OpcoesBancada,
  pInicial: number,
  aoArrastar: (p: number) => void,
): Bancada {
  let opcoes = opcoesIniciais;
  let p = pInicial;

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const tela = renderer.domElement;
  tela.style.touchAction = 'pan-y';
  palco.prepend(tela);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 160);
  // Reflexos de estúdio para o vidro e o latão. Sem eles a lente com
  // transmissão fica cinza e chapada.
  const pmrem = new THREE.PMREMGenerator(renderer);
  const ambiente = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = ambiente;
  scene.environmentIntensity = 0.45;

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  // Brilho só no escuro: no claro o creme passa do limiar e a cena inteira
  // estouraria. Limiar alto: brilham seta, raios e focos, que são luz; o latão
  // e o anteparo, que só refletem, ficam de fora. A profundidade de campo
  // (BokehPass) foi testada e saiu: serrilhava as bordas do anteparo.
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.55, 0.4, 0.92);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  // Vinheta, grão de filme e correção de cor dividida, depois da conversão de
  // cor: o acabamento de câmera que tira da cena a cara de render limpo, e
  // amarra peças de materiais diferentes na mesma família de cor.
  const cinema = new ShaderPass({
    uniforms: { tDiffuse: { value: null }, uTempo: { value: 0 }, uVinheta: { value: 0.5 }, uGrao: { value: 0.03 }, uSombra: { value: new THREE.Vector3() }, uLuz: { value: new THREE.Vector3(1, 1, 1) } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: `uniform sampler2D tDiffuse; uniform float uTempo, uVinheta, uGrao; uniform vec3 uSombra, uLuz; varying vec2 vUv;
      float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      void main(){
        vec4 c = texture2D(tDiffuse, vUv);
        float lum = dot(c.rgb, vec3(0.299, 0.587, 0.114));
        c.rgb += uSombra * (1.0 - lum);
        c.rgb *= mix(vec3(1.0), uLuz, lum);
        vec2 d = (vUv - 0.5) * vec2(1.0, 0.85);
        c.rgb *= mix(1.0 - uVinheta, 1.0, smoothstep(0.78, 0.18, length(d)));
        c.rgb += (h(vUv * 1200.0 + uTempo) - 0.5) * uGrao;
        gl_FragColor = c;
      }`,
  });
  composer.addPass(cinema);

  const halo = texturaHalo(); halo.userData.compartilhada = true;
  const escovado = texturaEscovada(); escovado.userData.compartilhada = true;
  const brilhoHalo = (pos: Trio, cor: string, escala: number, opacidade: number) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: halo, color: cor, transparent: true, opacity: opacidade, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
    s.position.set(...pos); s.scale.set(escala, escala, 1);
    return s;
  };

  function botao(c: Paleta, pos: Trio, raio = 0.08) {
    // Serrilhado de aperto: facetado de propósito.
    const g = new THREE.Group(); g.position.set(...pos); g.rotation.x = Math.PI / 2;
    g.add(malha(new THREE.CylinderGeometry(raio, raio, 0.09, 18), std(c.escuroMetal, 0.6, 0.45, { flatShading: true })));
    g.add(malha(new THREE.CylinderGeometry(raio * 0.55, raio * 0.55, 0.02, 24), std(c.latao, 1, 0.25), [0, 0.05, 0]));
    return g;
  }
  function carro(c: Paleta, x: number, altura: number) {
    const g = new THREE.Group(); g.position.x = x;
    g.add(malha(new RoundedBoxGeometry(0.62, 0.22, 1.12, 3, 0.04), std(c.escuroMetal, 0.75, 0.32), [0, 0.3, 0]));
    g.add(malha(new THREE.BoxGeometry(0.64, 0.03, 1.14), std(c.aco, 0.9, 0.42), [0, 0.3, 0]));
    g.add(botao(c, [0, 0.3, 0.62]));
    g.add(malha(new THREE.CylinderGeometry(0.09, 0.11, 0.06, 20), std(c.aco, 0.9, 0.48), [0, 0.44, 0]));
    if (altura > 0) g.add(malha(new THREE.CylinderGeometry(0.05, 0.05, altura, 20), std(c.aco, 0.95, 0.3), [0, 0.44 + altura / 2, 0]));
    return g;
  }

  function construirFixo(c: Paleta) {
    const g = new THREE.Group();
    g.add(malha(new THREE.PlaneGeometry(80, 40), std('#ffffff', 0, 0.85, { map: texturaMesa(c, opcoes.preferencias) }), [0, -0.28, 0], [-Math.PI / 2, 0, 0]));
    // Poça de luz sob a bancada e sombra de contato do trilho: sem elas a
    // bancada parecia flutuar sobre um chão uniforme.
    const poca = new THREE.Mesh(new THREE.PlaneGeometry(26, 12), new THREE.MeshBasicMaterial({ map: texturaRadial(c.poca, 'rgba(255,255,255,0)'), transparent: true, depthWrite: false, toneMapped: false }));
    poca.rotation.x = -Math.PI / 2; poca.position.set(-1, -0.275, 0.5); g.add(poca);
    const contato = new THREE.Mesh(new THREE.PlaneGeometry(TF - TI + 1.6, 2.4), new THREE.MeshBasicMaterial({ map: texturaRadial('rgba(0,0,0,.55)', 'rgba(0,0,0,0)'), transparent: true, depthWrite: false }));
    contato.rotation.x = -Math.PI / 2; contato.position.set((TI + TF) / 2, -0.27, 0); g.add(contato);
    // Trilho em cauda de andorinha, com a face escovada e a régua gravada na
    // face inclinada voltada para a câmera.
    const s = new THREE.Shape();
    s.moveTo(-0.5, -0.12); s.lineTo(0.5, -0.12); s.lineTo(0.5, 0.04); s.lineTo(0.3, 0.19); s.lineTo(-0.3, 0.19); s.lineTo(-0.5, 0.04); s.closePath();
    const perfil = new THREE.ExtrudeGeometry(s, { depth: TF - TI, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015, bevelSegments: 2 });
    perfil.rotateY(Math.PI / 2); perfil.translate(TI, 0, 0);
    g.add(malha(perfil, std(c.escuroMetal, 0.8, 0.3)));
    g.add(malha(new THREE.PlaneGeometry(TF - TI, 0.6), std(c.aco, 0.6, 0.62, { roughnessMap: escovado, bumpMap: escovado, bumpScale: 0.6 }), [(TI + TF) / 2, 0.195, 0], [-Math.PI / 2, 0, 0], false));
    g.add(malha(new THREE.PlaneGeometry(TF - TI, 0.25), std('#ffffff', 0.3, 0.5, { map: texturaRegua(c) }), [(TI + TF) / 2, 0.115, 0.4], [-Math.atan2(0.2, 0.15), 0, 0], false));
    for (const x of [TI + 0.4, TF - 0.4]) g.add(malha(new THREE.BoxGeometry(0.5, 0.16, 1.5), std(c.escuroMetal, 0.6, 0.4), [x, -0.2, 0]));
    // Eixo óptico e focos.
    g.add(segmento(new THREE.Vector3(TI + 0.6, EIXO, 0), new THREE.Vector3(TF - 0.3, EIXO, 0), 0.005, c.eixo, 1, 0.45));
    for (const x of [-F, F]) {
      g.add(malha(new THREE.SphereGeometry(0.055, 20, 20), basic(c.raio, c.e ? 1.6 : 1), [x, EIXO, 0], [0, 0, 0], false));
      g.add(brilhoHalo([x, EIXO, 0], c.raio, 0.5, c.e ? 0.7 : 0.35));
    }
    // Lente biconvexa: perfil girado em torno do eixo, mais grossa no centro.
    const pts: THREE.Vector2[] = [], esp = 0.24, n = 28;
    for (let i = 0; i <= n; i += 1) { const r = (R * i) / n; pts.push(new THREE.Vector2(r, -esp * (1 - (r / R) ** 2) - 0.01)); }
    for (let i = n; i >= 0; i -= 1) { const r = (R * i) / n; pts.push(new THREE.Vector2(r, esp * (1 - (r / R) ** 2) + 0.01)); }
    const lathe = new THREE.LatheGeometry(pts, 72); lathe.rotateZ(-Math.PI / 2);
    const lente = new THREE.Group(); lente.position.y = EIXO;
    lente.add(malha(lathe, new THREE.MeshPhysicalMaterial({ color: c.vidro, transmission: 1, thickness: 0.8, roughness: 0.02, ior: 1.52, dispersion: 4, clearcoat: 1, clearcoatRoughness: 0.03, iridescence: 0.25, iridescenceIOR: 1.3, attenuationColor: new THREE.Color(c.vidro), attenuationDistance: 3 })));
    lente.add(malha(new THREE.TorusGeometry(R + 0.06, 0.07, 24, 96), std(c.latao, 1, 0.22), [0, 0, 0], [0, Math.PI / 2, 0]));
    lente.add(malha(new THREE.CylinderGeometry(R + 0.13, R + 0.13, 0.12, 96, 1, true), std(c.latao, 1, 0.35, { flatShading: true, side: THREE.DoubleSide }), [0, 0, 0], [0, 0, Math.PI / 2]));
    for (let i = 0; i < 6; i += 1) {
      const a = (i * Math.PI) / 3;
      lente.add(malha(new THREE.CylinderGeometry(0.028, 0.028, 0.05, 12), std(c.aco, 1, 0.15), [0.07, Math.cos(a) * (R + 0.13), Math.sin(a) * (R + 0.13)], [0, 0, Math.PI / 2]));
    }
    // Garfo do anel até o carro. O anel fica inteiro acima do carro: na
    // primeira versão, com o eixo mais baixo, ele atravessava o carro.
    lente.add(malha(new THREE.BoxGeometry(0.14, 0.26, 0.26), std(c.latao, 1, 0.3), [0, -R - 0.13 - 0.1, 0]));
    g.add(lente);
    g.add(carro(c, 0, EIXO - R - 0.13 - 0.2 - 0.47));
    return g;
  }

  type Movel = THREE.Group & { userData: { animar?: (t: number) => void } };
  function construirMovel(c: Paleta): Movel {
    const g = new THREE.Group() as Movel;
    const im = imagemDaLente(p, F)!;
    // Caixa de luz: a lâmpada fica recuada e a seta, num porta-slide à frente,
    // exatamente em x = -p. Colada na face da caixa, a seta ficava escondida
    // pela própria caixa no ângulo da câmera.
    const cx = new THREE.Group(); cx.position.x = -p; cx.name = 'objeto';
    const base = EIXO - 0.3, alt = H + 0.55, recuo = -0.72;
    cx.add(carro(c, recuo, base - 0.47));
    const casa = new THREE.Group(); casa.position.set(recuo, base + alt / 2, 0);
    casa.add(malha(new RoundedBoxGeometry(0.5, alt, 0.8, 4, 0.07), std(c.escuroMetal, 0.55, 0.38)));
    for (const z of [-0.16, -0.05, 0.06, 0.17]) casa.add(malha(new THREE.BoxGeometry(0.38, 0.06, 0.04), std(c.aco, 0.9, 0.3), [0, alt / 2 + 0.03, z]));
    casa.add(malha(new THREE.CylinderGeometry(0.3, 0.3, 0.04, 40), basic(c.objeto, c.e ? 1.6 : 1.1), [0.26, -0.05, 0], [0, 0, Math.PI / 2], false));
    cx.add(casa);
    cx.add(malha(new THREE.BoxGeometry(0.62, 0.04, 0.04), std(c.aco, 1, 0.25), [recuo / 2 + 0.05, EIXO - 0.12, -0.24]));
    cx.add(malha(new THREE.BoxGeometry(0.04, H + 0.3, 0.04), std(c.aco, 1, 0.25), [0, EIXO + H / 2 - 0.02, -0.24]));
    cx.add(malha(new THREE.BoxGeometry(0.03, 0.04, 0.26), std(c.aco, 1, 0.25), [0, EIXO - 0.12, -0.12]));
    const s = new THREE.Mesh(seta(H), basic(c.objeto, c.e ? 2.2 : 1.4, { side: THREE.DoubleSide }));
    s.position.set(0, EIXO, 0); s.rotation.y = Math.PI / 2; cx.add(s);
    cx.add(brilhoHalo([0, EIXO + H * 0.55, 0], c.objeto, 1.3, c.e ? 0.45 : 0.25));
    cx.add(brilhoHalo([recuo + 0.3, base + alt / 2 - 0.05, 0], c.objeto, 1.6, c.e ? 0.35 : 0.2));
    const luz = new THREE.PointLight(c.objeto, c.e ? 6 : 3, 5, 2); luz.position.set(0.3, EIXO + H * 0.6, 0); cx.add(luz);
    // Área de toque maior que a caixa, para o dedo achar o objeto.
    const toque = new THREE.Mesh(new THREE.BoxGeometry(1.6, 3.4, 1.6), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
    toque.position.set(-0.4, EIXO, 0); cx.add(toque);
    g.add(cx);

    // Raios notáveis e o feixe inteiro: um cone do topo do objeto até a borda
    // da lente e outro da lente até o topo da imagem, como numa sala escura
    // com fumaça. É o que dá corpo à convergência.
    const v = (pt: { x: number; y: number }) => new THREE.Vector3(pt.x, EIXO + pt.y, 0);
    const rs = raiosNotaveis(p, F, H);
    for (const r of rs) for (let j = 0; j < 2; j += 1) {
      g.add(segmento(v(r[j]), v(r[j + 1]), 0.02, c.nucleo, c.e ? 1.1 : 1));
      g.add(segmento(v(r[j]), v(r[j + 1]), 0.06, c.raio, c.e ? 1.2 : 1, 0.2));
    }
    const pos: number[] = [], seg = 48;
    const disco = (i: number) => { const a = (i / seg) * Math.PI * 2; return [0, EIXO + Math.cos(a) * R * 0.96, Math.sin(a) * R * 0.96]; };
    for (const apice of [v(rs[0][0]), v(rs[0][2])]) for (let i = 0; i < seg; i += 1) pos.push(apice.x, apice.y, apice.z, ...disco(i), ...disco(i + 1));
    const feixe = new THREE.BufferGeometry(); feixe.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.add(new THREE.Mesh(feixe, new THREE.MeshBasicMaterial({ color: c.raio, transparent: true, opacity: c.e ? 0.045 : 0.07, side: THREE.DoubleSide, depthWrite: false, blending: c.e ? THREE.AdditiveBlending : THREE.NormalBlending, toneMapped: false })));

    // Poeira parada dentro dos dois cones, que só se acende porque a luz passa
    // por ela, e pulsos correndo do objeto à imagem: o sentido da luz.
    const pontos: number[] = [], fases: number[] = [];
    for (const [apice, qtd] of [[v(rs[0][0]), 260], [v(rs[0][2]), 180]] as const) for (let i = 0; i < qtd; i += 1) {
      const a = Math.random() * Math.PI * 2, rr = Math.sqrt(Math.random()) * R * 0.9, t = Math.pow(Math.random(), 0.8);
      const q = apice.clone().lerp(new THREE.Vector3(0, EIXO + Math.cos(a) * rr, Math.sin(a) * rr), t);
      pontos.push(q.x, q.y, q.z); fases.push(Math.random() * 6.28);
    }
    const poeiraGeo = new THREE.BufferGeometry();
    poeiraGeo.setAttribute('position', new THREE.Float32BufferAttribute(pontos, 3));
    g.add(new THREE.Points(poeiraGeo, new THREE.PointsMaterial({ size: 0.05, map: halo, color: c.e ? c.nucleo : c.raio, transparent: true, opacity: c.e ? 0.55 : 0.35, depthWrite: false, blending: c.e ? THREE.AdditiveBlending : THREE.NormalBlending, toneMapped: false })));
    const base0 = Float32Array.from(pontos);
    const pulsos = rs.flatMap((r, i) => {
      const tr = [v(r[0]), v(r[1]), v(r[2])];
      const l1 = tr[0].distanceTo(tr[1]), total = l1 + tr[1].distanceTo(tr[2]);
      return [0, 1].map((k) => {
        const sp = brilhoHalo([0, 0, 0], c.e ? '#ffffff' : c.raio, 0.34, c.e ? 0.95 : 0.8);
        g.add(sp);
        return { sp, tr, l1, total, desloc: k / 2 + i / 6 };
      });
    });
    g.userData.animar = (tempo: number) => {
      const arr = poeiraGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < fases.length; i += 1) {
        arr[i * 3 + 1] = base0[i * 3 + 1] + Math.sin(tempo * 0.6 + fases[i]) * 0.035;
        arr[i * 3 + 2] = base0[i * 3 + 2] + Math.cos(tempo * 0.45 + fases[i]) * 0.035;
      }
      poeiraGeo.attributes.position.needsUpdate = true;
      for (const pu of pulsos) {
        const d = (((tempo * 0.55) / 3 + pu.desloc) % 1) * pu.total;
        if (d < pu.l1) pu.sp.position.lerpVectors(pu.tr[0], pu.tr[1], d / pu.l1);
        else pu.sp.position.lerpVectors(pu.tr[1], pu.tr[2], (d - pu.l1) / (pu.total - pu.l1));
      }
    };
    g.userData.animar(0);

    // Cotas de desenho técnico no chão, à frente do trilho: p do objeto à
    // lente e p′ da lente à imagem, com traços de chamada e setas nas pontas.
    const zc = 1.25, yc = -0.265, pc: number[] = [];
    const cota = (x1: number, x2: number) => {
      pc.push(x1, yc, zc, x2, yc, zc);
      for (const x of [x1, x2]) pc.push(x, yc, zc - 0.2, x, yc, zc + 0.2);
      for (const [x, sentido] of [[x1, 1], [x2, -1]]) pc.push(x, yc, zc, x + sentido * 0.22, yc, zc - 0.08, x, yc, zc, x + sentido * 0.22, yc, zc + 0.08);
    };
    cota(-p, 0); cota(0, im.pLinha);
    const cotaGeo = new THREE.BufferGeometry(); cotaGeo.setAttribute('position', new THREE.Float32BufferAttribute(pc, 3));
    g.add(new THREE.LineSegments(cotaGeo, new THREE.LineBasicMaterial({ color: c.tinta, transparent: true, opacity: 0.85 })));

    // Anteparo, com a imagem: a seta do objeto, invertida e na escala do aumento.
    const ap = new THREE.Group(); ap.position.x = im.pLinha;
    const alturaImg = Math.abs(im.aumento) * H;
    ap.add(carro(c, 0, EIXO - 1.35 - 0.44));
    ap.add(malha(new THREE.BoxGeometry(0.04, 2.7, 2.3), std(c.anteparo, 0, 0.95), [0.05, EIXO, 0]));
    // Moldura em quatro barras: um box em wireframe mostrava as diagonais dos
    // triângulos, e o anteparo parecia rachado.
    for (const y of [1.39, -1.39]) ap.add(malha(new THREE.BoxGeometry(0.12, 0.1, 2.46), std(c.escuroMetal, 0.7, 0.35), [0.06, EIXO + y, 0]));
    for (const z of [1.19, -1.19]) ap.add(malha(new THREE.BoxGeometry(0.1, 2.86, 0.08), std(c.escuroMetal, 0.7, 0.35), [0.06, EIXO, z]));
    const si = new THREE.Mesh(seta(alturaImg), basic(c.imagem, c.e ? 1.8 : 1, { side: THREE.DoubleSide }));
    si.position.set(0.025, EIXO, 0); si.rotation.set(Math.PI, Math.PI / 2, 0); ap.add(si);
    ap.add(brilhoHalo([0, EIXO - alturaImg * 0.55, 0], c.imagem, 1.1 + alturaImg, c.e ? 0.5 : 0.25));
    g.add(ap);
    return g;
  }

  let fixo: THREE.Group | null = null;
  let movel: Movel | null = null;
  let luzes: THREE.Group | null = null;
  let aspectoDoFundo = 0;
  let sujo = true;

  function trocarFundo() {
    const c = paleta(opcoes);
    aspectoDoFundo = palco.clientWidth / Math.max(palco.clientHeight, 1);
    (scene.background as THREE.Texture | null)?.dispose?.();
    scene.background = texturaCeu(c, opcoes.preferencias, aspectoDoFundo);
    sujo = true;
  }

  function montarMovel() {
    if (movel) { scene.remove(movel); descartar(movel); }
    movel = construirMovel(paleta(opcoes)); tracar(movel, paleta(opcoes)); scene.add(movel);
    sujo = true;
  }

  function montarTudo() {
    const c = paleta(opcoes);
    for (const o of [fixo, luzes]) if (o) { scene.remove(o); descartar(o); }
    trocarFundo();
    scene.fog = new THREE.Fog(c.horizonte, 13, 30);
    luzes = new THREE.Group();
    luzes.add(new THREE.HemisphereLight(c.ceuLuz, c.chao, c.e ? 0.3 : 0.75));
    const chave = new THREE.DirectionalLight(c.chave, c.e ? 1.3 : 1.8);
    chave.position.set(-3, 11, 7); chave.castShadow = true; chave.shadow.mapSize.set(1024, 1024); chave.shadow.bias = -0.0006; chave.shadow.radius = 7; chave.shadow.blurSamples = 12;
    Object.assign(chave.shadow.camera, { left: -11, right: 11, top: 8, bottom: -5 });
    luzes.add(chave);
    // Contraluz na cor do visual, por trás, e um preenchimento baixo pelo lado
    // oposto: desenham a borda do latão e do vidro sem tingir o chão de frente.
    // Em ciano, a contraluz tingia o chão inteiro.
    const recorte = new THREE.DirectionalLight(c.recorte, c.recorteForca); recorte.position.set(5, 6, -10); luzes.add(recorte);
    const preench = new THREE.DirectionalLight(c.preenchimento, c.e ? 0.35 : 0.3); preench.position.set(9, 0.6, -6); luzes.add(preench);
    scene.add(luzes);
    fixo = construirFixo(c); tracar(fixo, c); scene.add(fixo);
    palco.style.setProperty('--tinta-cena', c.tinta);
    palco.style.setProperty('--papel-cena', c.papel);
    montarMovel();
    bloom.enabled = c.e;
    bloom.strength = c.bloom;
    cinema.uniforms.uVinheta.value = c.vinheta;
    cinema.uniforms.uGrao.value = c.e ? 0.03 : 0.016;
    cinema.uniforms.uSombra.value.set(...c.sombra);
    cinema.uniforms.uLuz.value.set(...c.luz);
  }

  // ---- Câmera e rótulos ----
  const alvo = new THREE.Vector3(-1.3, 1.9, 0);
  function posicionarCamera(t: number) {
    // Baixa, na diagonal do trilho: a caixa de luz em primeiro plano, a lente
    // no meio e o anteparo ao fundo. De frente, a bancada inteira cabia na
    // coluna mas virava um risco fino. A distância acompanha a proporção da
    // coluna, do iPad ao celular, e o travelling é lento como numa vitrine.
    const w = palco.clientWidth, h = Math.max(palco.clientHeight, 1), meia = THREE.MathUtils.degToRad(camera.fov / 2);
    // Duas contas: a largura (bancada inteira na coluna) e a altura (do chão
    // ao topo do anteparo). Só com a da largura, no palco largo do iPad em
    // retrato a câmera chegava perto demais e cortava a frente do trilho.
    const d = THREE.MathUtils.clamp(Math.max(6.0 / (Math.tan(meia) * (w / h)), 3.3 / Math.tan(meia)), 9, 20);
    const tt = opcoes.movimento ? t : 0, ang = -0.66 + Math.sin(tt * 0.1) * 0.08;
    camera.position.set(alvo.x + Math.sin(ang) * d, alvo.y + d * (0.14 + Math.sin(tt * 0.07) * 0.012), Math.cos(ang) * d);
    camera.lookAt(alvo);
    // Atualizada aqui, antes de projetar os rótulos: sem isso eles saíam na
    // posição do quadro anterior, e sob demanda ficavam fora da cena.
    camera.updateMatrixWorld();
  }
  const pontosDosRotulos: Record<IdRotulo, () => THREE.Vector3> = {
    F: () => new THREE.Vector3(-F, EIXO - 0.25, 0),
    F2: () => new THREE.Vector3(F, EIXO - 0.25, 0),
    objeto: () => new THREE.Vector3(-p - 0.3, EIXO + H + 0.9, 0),
    imagem: () => new THREE.Vector3(imagemDaLente(p, F)!.pLinha, EIXO + 1.75, 0),
    cotaP: () => new THREE.Vector3(-p / 2, -0.26, 1.25),
    cotaPl: () => new THREE.Vector3(imagemDaLente(p, F)!.pLinha / 2, -0.26, 1.25),
  };
  const tmp = new THREE.Vector3();
  function posicionarRotulos() {
    const w = palco.clientWidth, h = palco.clientHeight;
    for (const id of Object.keys(pontosDosRotulos) as IdRotulo[]) {
      const el = rotulos[id];
      if (!el) continue;
      tmp.copy(pontosDosRotulos[id]()).project(camera);
      // Preso dentro da cena: no celular o objeto fica perto da borda e o
      // rótulo saía pela metade.
      const meia = el.offsetWidth / 2 + 4;
      const x = THREE.MathUtils.clamp(((tmp.x + 1) / 2) * w, meia, Math.max(meia, w - meia));
      const y = Math.max(((1 - tmp.y) / 2) * h, el.offsetHeight + 4);
      el.style.transform = `translate(-50%, -100%) translate(${x}px, ${y}px)`;
    }
  }

  function redimensionar() {
    const w = palco.clientWidth, h = palco.clientHeight;
    if (!w || !h) return;
    if (fixo && Math.abs(w / h - aspectoDoFundo) > 0.15) trocarFundo();
    renderer.setSize(w, h, false);
    tela.style.width = '100%'; tela.style.height = '100%';
    composer.setPixelRatio(renderer.getPixelRatio());
    composer.setSize(w, h);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    sujo = true;
  }

  // ---- Laço ----
  // Fora da tela, parado; com movimento reduzido, desenha só quando algo muda.
  let visivel = true;
  let quadro = 0;
  function laco(agora: number) {
    quadro = requestAnimationFrame(laco);
    if (!visivel || document.hidden) return;
    if (!opcoes.movimento && !sujo) return;
    const t = agora / 1000;
    posicionarCamera(t);
    if (opcoes.movimento) movel?.userData.animar?.(t);
    cinema.uniforms.uTempo.value = opcoes.movimento ? t % 100 : 0;
    posicionarRotulos();
    composer.render();
    sujo = false;
  }

  // ---- Arraste ----
  const raycaster = new THREE.Raycaster(), ptr = new THREE.Vector2(), plano = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), ponto = new THREE.Vector3();
  let arrastando = false;
  const mirar = (ev: PointerEvent) => {
    const r = tela.getBoundingClientRect();
    ptr.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(ptr, camera);
  };
  const aoApertar = (ev: PointerEvent) => {
    const obj = movel?.getObjectByName('objeto');
    if (!obj) return;
    mirar(ev);
    if (raycaster.intersectObject(obj, true).length) {
      arrastando = true;
      tela.setPointerCapture?.(ev.pointerId);
      tela.style.cursor = 'grabbing';
    }
  };
  const aoMover = (ev: PointerEvent) => {
    if (!arrastando) return;
    mirar(ev);
    if (raycaster.ray.intersectPlane(plano, ponto)) aoArrastar(THREE.MathUtils.clamp(-ponto.x, PMIN, PMAX));
  };
  const soltar = () => { arrastando = false; tela.style.cursor = ''; };
  tela.addEventListener('pointerdown', aoApertar);
  tela.addEventListener('pointermove', aoMover);
  tela.addEventListener('pointerup', soltar);
  tela.addEventListener('pointercancel', soltar);

  const observadorTamanho = new ResizeObserver(redimensionar);
  observadorTamanho.observe(palco);
  const observadorVisivel = typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver(([e]) => { visivel = e.isIntersecting; sujo = true; })
    : null;
  observadorVisivel?.observe(palco);

  montarTudo();
  redimensionar();
  quadro = requestAnimationFrame(laco);

  // Rabiscos e carimbo são desenhados no canvas com Kalam e Space Grotesk: o
  // primeiro fundo pode sair na letra do sistema se a fonte ainda não chegou.
  let vivo = true;
  document.fonts?.ready.then(() => { if (vivo) trocarFundo(); }).catch(() => {});

  return {
    definirP(novo) {
      const q = THREE.MathUtils.clamp(novo, PMIN, PMAX);
      if (q === p) return;
      p = q;
      montarMovel();
    },
    configurar(novas) {
      const antes = opcoes;
      opcoes = novas;
      if (antes.acento !== novas.acento || antes.escuro !== novas.escuro
        || antes.preferencias.papel !== novas.preferencias.papel
        || antes.preferencias.rabiscos !== novas.preferencias.rabiscos
        || antes.preferencias.carimbo !== novas.preferencias.carimbo) montarTudo();
      sujo = true;
    },
    destruir() {
      vivo = false;
      cancelAnimationFrame(quadro);
      observadorTamanho.disconnect();
      observadorVisivel?.disconnect();
      tela.removeEventListener('pointerdown', aoApertar);
      tela.removeEventListener('pointermove', aoMover);
      tela.removeEventListener('pointerup', soltar);
      tela.removeEventListener('pointercancel', soltar);
      for (const o of [fixo, movel, luzes]) if (o) descartar(o);
      (scene.background as THREE.Texture | null)?.dispose?.();
      halo.dispose(); escovado.dispose(); ambiente.dispose(); pmrem.dispose();
      composer.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      tela.remove();
    },
  };
}
