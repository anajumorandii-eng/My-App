import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { escurecer, clarear } from './coresDaCena';

/**
 * Estúdio comum das cenas 3D do Hoje: o que toda cena de matéria compartilha.
 *
 * A bancada óptica foi aprovada pela Ana Júlia depois de três rodadas —
 * parada, sem fundo próprio, fundida ao cartão, em papel e tinta. Cada matéria
 * nova precisa sair igual nesse ponto, e a forma de garantir é não reescrever:
 * renderizador transparente, luzes, contorno a tinta, rótulos em HTML e o
 * desenho só quando algo muda moram aqui. A cena traz só as peças dela.
 */

export type Trio = [number, number, number];

export interface OpcoesDeCor {
  /** Cor da matéria, lida do ambiente. */
  acento: string;
  escuro: boolean;
}

/** Paleta de papel e tinta, fechada por tema; o único acento é o da matéria. */
const BASE = {
  escuro: {
    e: true, mesa: '#2a1f13', grade: 'rgba(233,210,166,.2)', manchas: 'rgba(0,0,0,.25)',
    escuroMetal: '#2c2016', aco: '#d8c7a8', latao: '#c99552', ceuLuz: '#ffdcb0', chao: '#140d07',
    chave: '#ffe4c0', recorte: '#e0485c', recorteForca: 1.5, preenchimento: '#3fae7a',
    tinta: '#e9d2a6', tintaOpacidade: 0.38, papel: '#120c07', poca: 'rgba(255,200,130,.13)',
  },
  claro: {
    e: false, mesa: '#e8d8b6', grade: 'rgba(92,60,30,.3)', manchas: 'rgba(120,80,30,.10)',
    escuroMetal: '#3b2c20', aco: '#b7a78c', latao: '#a8773a', ceuLuz: '#fff6e2', chao: '#cdb68c',
    chave: '#fff3dc', recorte: '#fff0d8', recorteForca: 0.5, preenchimento: '#e9d7b0',
    tinta: '#4a2f1c', tintaOpacidade: 0.5, papel: '#f4e8cf', poca: 'rgba(255,248,230,.5)',
  },
};

export type PaletaDeEstudio = (typeof BASE)['escuro'] & { acento: string; acentoClaro: string };

export function paletaDeEstudio({ acento, escuro }: OpcoesDeCor): PaletaDeEstudio {
  // No escuro o acento vivo; no papel creme ele sumia, então escurece.
  return escuro
    ? { ...BASE.escuro, acento, acentoClaro: clarear(acento, 0.4) }
    : { ...BASE.claro, acento: escurecer(acento, 0.42), acentoClaro: escurecer(acento, 0.42) };
}

// ---- Materiais e peças ----
export const std = (color: string, metalness = 0, roughness = 0.5, extra: THREE.MeshStandardMaterialParameters = {}) =>
  new THREE.MeshStandardMaterial({ color, metalness, roughness, ...extra });
export const basic = (color: string, k = 1, extra: THREE.MeshBasicMaterialParameters = {}) =>
  new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(k), toneMapped: false, ...extra });

export function malha(geo: THREE.BufferGeometry, mat: THREE.Material, pos: Trio = [0, 0, 0], rot: Trio = [0, 0, 0], sombra = true) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(...pos); m.rotation.set(...rot);
  m.castShadow = sombra; m.receiveShadow = sombra;
  return m;
}

/** Fibras e manchas de papel velho, desenhadas num canvas. */
export function fibrasDePapel(g: CanvasRenderingContext2D, w: number, h: number, c: PaletaDeEstudio, fibras: number) {
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

export function texturaRadial(interno: string, externo: string) {
  const cv = document.createElement('canvas'); cv.width = cv.height = 256;
  const g = cv.getContext('2d')!, grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, interno); grad.addColorStop(1, externo);
  g.fillStyle = grad; g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(cv);
}

/**
 * Folha da mesa que some num degradê oval. Num plano sem fim, com o canvas
 * transparente, a mesa terminava numa linha reta — a borda de imagem que a
 * Ana Júlia recusou.
 */
export function folhaDaMesa(mapa: THREE.Texture, largura: number, profundidade: number, pos: Trio) {
  const mat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.85, map: mapa, alphaMap: texturaRadial('#ffffff', '#000000'), transparent: true, depthWrite: false });
  return malha(new THREE.PlaneGeometry(largura, profundidade), mat, pos, [-Math.PI / 2, 0, 0]);
}

/** Papel milimetrado em sépia, um traço por quadro e um mais forte a cada cinco. */
export function texturaMilimetrada(c: PaletaDeEstudio, repeticao: [number, number]) {
  const px = 512, cv = document.createElement('canvas'); cv.width = cv.height = px;
  const g = cv.getContext('2d')!;
  g.fillStyle = c.mesa; g.fillRect(0, 0, px, px);
  fibrasDePapel(g, px, px, c, 900);
  g.strokeStyle = c.grade;
  for (let i = 0; i <= 10; i += 1) {
    g.lineWidth = i % 5 === 0 ? 3.2 : 1.3;
    const q = (i / 10) * px;
    g.beginPath(); g.moveTo(q, 0); g.lineTo(q, px); g.stroke();
    g.beginPath(); g.moveTo(0, q); g.lineTo(px, q); g.stroke();
  }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeticao); t.anisotropy = 16;
  return t;
}

/**
 * Contorno a tinta nas arestas das peças sólidas: o traço das fichas
 * desenhadas à mão, agora seguindo o volume. Vidro, luz e chão ficam de fora —
 * contorno neles viraria ruído.
 */
export function tracar(grupo: THREE.Object3D, c: PaletaDeEstudio) {
  const mat = new THREE.LineBasicMaterial({ color: c.tinta, transparent: true, opacity: c.tintaOpacidade, depthWrite: false });
  const alvos: THREE.Mesh[] = [];
  grupo.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh || Array.isArray(m.material) || m.userData.semContorno) return;
    const mat0 = m.material as THREE.Material & { isMeshBasicMaterial?: boolean; isMeshPhysicalMaterial?: boolean };
    if (mat0.transparent || mat0.isMeshBasicMaterial || mat0.isMeshPhysicalMaterial) return;
    const tipo = m.geometry.type;
    if (tipo === 'PlaneGeometry' || tipo === 'SphereGeometry' || tipo === 'TorusGeometry' || tipo === 'ShapeGeometry' || tipo === 'TubeGeometry') return;
    alvos.push(m);
  });
  for (const m of alvos) m.add(new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry, 35), mat));
}

export function descartar(obj: THREE.Object3D) {
  obj.traverse((o) => {
    const m = o as THREE.Mesh;
    m.geometry?.dispose();
    const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
    for (const x of mats) {
      // Texturas marcadas como compartilhadas saem só no destruir().
      const { map: mapa, alphaMap } = x as THREE.MeshStandardMaterial;
      if (mapa && !mapa.userData.compartilhada) mapa.dispose();
      alphaMap?.dispose();
      x.dispose();
    }
  });
}

/** Luz de estúdio: céu e chão, chave com sombra suave, contraluz vinho e preenchimento baixo. */
function luzesDeEstudio(c: PaletaDeEstudio, sombra: { esquerda: number; direita: number; topo: number; base: number }) {
  const luzes = new THREE.Group();
  luzes.add(new THREE.HemisphereLight(c.ceuLuz, c.chao, c.e ? 0.3 : 0.75));
  const chave = new THREE.DirectionalLight(c.chave, c.e ? 1.3 : 1.8);
  chave.position.set(-3, 11, 7); chave.castShadow = true; chave.shadow.mapSize.set(1024, 1024);
  chave.shadow.bias = -0.0006; chave.shadow.radius = 7; chave.shadow.blurSamples = 12;
  Object.assign(chave.shadow.camera, { left: sombra.esquerda, right: sombra.direita, top: sombra.topo, bottom: sombra.base });
  luzes.add(chave);
  // Contraluz por trás e preenchimento baixo do outro lado: desenham a borda
  // das peças sem tingir o chão de frente. Na cor da matéria, a contraluz
  // tingia o chão inteiro.
  const recorte = new THREE.DirectionalLight(c.recorte, c.recorteForca); recorte.position.set(5, 6, -10); luzes.add(recorte);
  const preench = new THREE.DirectionalLight(c.preenchimento, c.e ? 0.35 : 0.3); preench.position.set(9, 0.6, -6); luzes.add(preench);
  return luzes;
}

export interface ConfigDoEstudio<Id extends string> {
  /** Posiciona a câmera para o tamanho atual do palco. */
  enquadrar: (camera: THREE.PerspectiveCamera, largura: number, altura: number) => void;
  /** Ponto 3D de cada rótulo HTML, relido a cada desenho. */
  rotulos: Record<Id, () => THREE.Vector3>;
  /**
   * Peças que dependem do estado da cena (p, par em foco…): refeitas a cada
   * gesto. O que não muda com o gesto vai em `fixo`, feito só na troca de
   * tema — a régua da bancada, redesenhada a cada passo do arraste, pesava.
   */
  movel: (c: PaletaDeEstudio) => THREE.Object3D;
  fixo?: (c: PaletaDeEstudio) => THREE.Object3D;
  sombra?: { esquerda: number; direita: number; topo: number; base: number };
}

export interface Estudio {
  camera: THREE.PerspectiveCamera;
  tela: HTMLCanvasElement;
  /** Refaz as peças móveis (mudou o estado da cena). */
  remontar(): void;
  /** Refaz tudo, fixo inclusive (mudou uma preferência que o fixo usa). */
  remontarTudo(): void;
  configurar(cores: OpcoesDeCor): void;
  destruir(): void;
}

export function criarEstudio<Id extends string>(
  palco: HTMLElement,
  elementos: Partial<Record<Id, HTMLElement | null>>,
  coresIniciais: OpcoesDeCor,
  config: ConfigDoEstudio<Id>,
): Estudio {
  let cores = coresIniciais;

  // Canvas transparente: o cartão aparece por trás da cena, e a borda se
  // dissolve por máscara no CSS em vez de terminar num retângulo. Até 2× de
  // densidade: com 1,5× o iPhone (3×) mostrava a cena serrilhada.
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const tela = renderer.domElement;
  tela.style.touchAction = 'pan-y';
  palco.prepend(tela);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 160);
  // Reflexos de estúdio para vidro e metal; sem eles ficam cinza e chapados.
  const pmrem = new THREE.PMREMGenerator(renderer);
  const ambiente = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = ambiente;
  scene.environmentIntensity = 0.45;

  let fixo: THREE.Object3D | null = null;
  let pecas: THREE.Object3D | null = null;
  let luzes: THREE.Group | null = null;
  let sujo = true;

  function remontar() {
    const c = paletaDeEstudio(cores);
    if (pecas) { scene.remove(pecas); descartar(pecas); }
    pecas = config.movel(c); tracar(pecas, c); scene.add(pecas);
    sujo = true;
  }
  function montarTudo() {
    const c = paletaDeEstudio(cores);
    for (const o of [luzes, fixo]) if (o) { scene.remove(o); descartar(o); }
    fixo = config.fixo ? config.fixo(c) : null;
    if (fixo) { tracar(fixo, c); scene.add(fixo); }
    luzes = luzesDeEstudio(c, config.sombra ?? { esquerda: -11, direita: 11, topo: 8, base: -5 });
    scene.add(luzes);
    palco.style.setProperty('--tinta-cena', c.tinta);
    palco.style.setProperty('--papel-cena', c.papel);
    remontar();
  }

  const tmp = new THREE.Vector3();
  function posicionarRotulos() {
    const w = palco.clientWidth, h = palco.clientHeight;
    for (const id of Object.keys(config.rotulos) as Id[]) {
      const el = elementos[id];
      if (!el) continue;
      tmp.copy(config.rotulos[id]()).project(camera);
      // Preso dentro da cena: perto da borda o rótulo saía pela metade.
      const meia = el.offsetWidth / 2 + 4;
      const x = THREE.MathUtils.clamp(((tmp.x + 1) / 2) * w, meia, Math.max(meia, w - meia));
      const y = Math.max(((1 - tmp.y) / 2) * h, el.offsetHeight + 4);
      el.style.transform = `translate(-50%, -100%) translate(${x}px, ${y}px)`;
    }
  }

  function redimensionar() {
    const w = palco.clientWidth, h = palco.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    tela.style.width = '100%'; tela.style.height = '100%';
    camera.aspect = w / h; camera.updateProjectionMatrix();
    sujo = true;
  }

  // Nada se mexe sozinho: a cena só redesenha quando algo muda (gesto,
  // controle, tema, tamanho), e nunca fora da tela.
  let visivel = true;
  let quadro = 0;
  function laco() {
    quadro = requestAnimationFrame(laco);
    if (!visivel || document.hidden || !sujo) return;
    config.enquadrar(camera, palco.clientWidth, Math.max(palco.clientHeight, 1));
    // Atualizada antes de projetar os rótulos: sem isso, sob demanda, eles
    // ficavam na posição do quadro anterior.
    camera.updateMatrixWorld();
    posicionarRotulos();
    renderer.render(scene, camera);
    sujo = false;
  }

  const observadorTamanho = new ResizeObserver(redimensionar);
  observadorTamanho.observe(palco);
  const observadorVisivel = typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver(([e]) => { visivel = e.isIntersecting; sujo = true; })
    : null;
  observadorVisivel?.observe(palco);

  montarTudo();
  redimensionar();
  quadro = requestAnimationFrame(laco);

  // Números e letras desenhados em canvas usam as fontes do app: se a fonte
  // ainda não chegou, o primeiro desenho sai na letra do sistema.
  let vivo = true;
  document.fonts?.ready.then(() => { if (vivo) montarTudo(); }).catch(() => {});

  return {
    camera,
    tela,
    remontar,
    remontarTudo: montarTudo,
    configurar(novas) {
      const mudou = novas.acento !== cores.acento || novas.escuro !== cores.escuro;
      cores = novas;
      if (mudou) montarTudo();
      sujo = true;
    },
    destruir() {
      vivo = false;
      cancelAnimationFrame(quadro);
      observadorTamanho.disconnect();
      observadorVisivel?.disconnect();
      for (const o of [fixo, pecas, luzes]) if (o) descartar(o);
      ambiente.dispose(); pmrem.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      tela.remove();
    },
  };
}
