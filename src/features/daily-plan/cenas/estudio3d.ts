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

export interface OpcoesDeTexto {
  /** Proporção largura/altura da face, para a letra não sair esticada. */
  proporcao: number;
  cor: string;
  /** Sem fundo, a tinta fica sobre a face iluminada do bloco, e o bloco
   * continua com a luz e a sombra da cena. */
  fundo?: string;
  /** Linha menor abaixo da principal (posição da sílaba, ano). */
  legenda?: string;
  fonte?: string;
}

/**
 * Texto a tinta numa face de bloco (palavra, sílaba). Em canvas, e não em
 * rótulo HTML: com dez sílabas lado a lado, os rótulos disputavam o mesmo
 * espaço e o de cima empurrava o de baixo para fora do bloco.
 */
export function texturaDeTexto(texto: string, { proporcao, cor, fundo, legenda, fonte = 'Newsreader, Georgia, serif' }: OpcoesDeTexto) {
  const alt = 160, larg = Math.round(alt * proporcao);
  const cv = document.createElement('canvas'); cv.width = larg; cv.height = alt;
  const g = cv.getContext('2d')!;
  if (fundo) { g.fillStyle = fundo; g.fillRect(0, 0, larg, alt); }
  g.fillStyle = cor; g.textAlign = 'center'; g.textBaseline = 'middle';
  let tam = legenda ? 72 : 84;
  g.font = `600 ${tam}px ${fonte}`;
  // Reduz até caber com folga: palavra longa em bloco estreito vazava da face.
  while (tam > 24 && g.measureText(texto).width > larg * 0.86) { tam -= 4; g.font = `600 ${tam}px ${fonte}`; }
  g.fillText(texto, larg / 2, legenda ? alt * 0.42 : alt / 2);
  if (legenda) {
    g.globalAlpha = 0.7; g.font = `500 34px Inter, system-ui, sans-serif`;
    g.fillText(legenda, larg / 2, alt * 0.82);
  }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}

/** Plano com o texto, colado na frente de um bloco de largura `l` e altura `a`. */
export function faceDeTexto(texto: string, l: number, a: number, opcoes: Omit<OpcoesDeTexto, 'proporcao'>) {
  const mat = new THREE.MeshBasicMaterial({ map: texturaDeTexto(texto, { ...opcoes, proporcao: l / a }), toneMapped: false, transparent: true, depthWrite: false });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(l, a), mat);
  m.userData.semContorno = true;
  return m;
}

/** Traço a tinta entre pontos (régua, cota, raio). */
export function traco(pontos: THREE.Vector3[], cor: string, opacidade = 1) {
  const mat = new THREE.LineBasicMaterial({ color: cor, transparent: opacidade < 1, opacity: opacidade });
  return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pontos), mat);
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
  /** Só redesenha: a peça foi mexida no lugar (girar a molécula), sem refazer. */
  redesenhar(): void;
  configurar(cores: OpcoesDeCor): void;
  destruir(): void;
}

/**
 * Um renderizador só para todas as cenas, reaproveitado de uma aba à outra.
 *
 * A Ana Júlia gravou o iPad travando ao trocar de aba. Medido: cada troca
 * criava um contexto WebGL novo e recompilava do zero todos os programas de
 * sombreamento da cena — a segunda visita a uma aba bloqueava a tela de 4 a
 * 8 segundos. Com um contexto só, o three.js guarda os programas já
 * compilados, e só uma cena aparece por vez no cartão do Hoje.
 */
let compartilhado: { renderer: THREE.WebGLRenderer; ambiente: THREE.Texture } | null = null;

function rendererCompartilhado() {
  if (compartilhado) return compartilhado;
  // Canvas transparente: o cartão aparece por trás da cena, e a borda se
  // dissolve por máscara no CSS em vez de terminar num retângulo.
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  // PCF suave no lugar de VSM: o VSM desfocava o mapa de sombra em várias
  // passadas a cada desenho, e a sombra suave não precisa disso.
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  // A sombra só muda quando a cena muda (gesto, tema): o estúdio pede a
  // atualização em cada remontagem, e girar a molécula não refaz o mapa.
  renderer.shadowMap.autoUpdate = false;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  // Reflexos de estúdio para vidro e metal; sem eles ficam cinza e chapados.
  const pmrem = new THREE.PMREMGenerator(renderer);
  const ambiente = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
  compartilhado = { renderer, ambiente };
  return compartilhado;
}

/**
 * Densidade de pixels da cena: até 2× (com 1,5× o iPhone de tela 3× mostrava
 * a cena serrilhada), mas sem passar de ~1.600 pixels de largura desenhada —
 * no iPad em paisagem a coluna larga a 2× passava de 2.000 pixels por quadro.
 */
function densidade(largura: number) {
  return Math.max(1, Math.min(window.devicePixelRatio || 1, 2, 1600 / Math.max(largura, 1)));
}

export function criarEstudio<Id extends string>(
  palco: HTMLElement,
  elementos: Partial<Record<Id, HTMLElement | null>>,
  coresIniciais: OpcoesDeCor,
  config: ConfigDoEstudio<Id>,
): Estudio {
  let cores = coresIniciais;

  const { renderer, ambiente } = rendererCompartilhado();
  const tela = renderer.domElement;
  tela.style.touchAction = 'pan-y';
  tela.style.cursor = '';
  palco.prepend(tela);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 160);
  scene.environment = ambiente;
  scene.environmentIntensity = 0.45;

  let fixo: THREE.Object3D | null = null;
  let pecas: THREE.Object3D | null = null;
  let luzes: THREE.Group | null = null;
  let sujo = true;
  let sombraVelha = true;

  function remontar() {
    if (!pronto) return;
    const c = paletaDeEstudio(cores);
    if (pecas) { scene.remove(pecas); descartar(pecas); }
    pecas = config.movel(c); tracar(pecas, c); scene.add(pecas);
    sombraVelha = true;
    sujo = true;
  }
  function montarTudo() {
    if (!pronto) return;
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
    // Caixas já postas neste desenho, na ordem de `config.rotulos`: quem vem
    // antes tem prioridade e fica no ponto; quem colide desce até ficar livre.
    // Com a molécula girando, o ângulo caía sobre o rótulo de um átomo
    // ("109,5°H" no metano) — um ponto fixo na cena não garante espaço livre
    // na tela.
    const postas: { x0: number; x1: number; y0: number; y1: number }[] = [];
    for (const id of Object.keys(config.rotulos) as Id[]) {
      const el = elementos[id];
      if (!el || !el.textContent) continue;
      tmp.copy(config.rotulos[id]()).project(camera);
      // Preso dentro da cena: perto da borda o rótulo saía pela metade.
      const larg = el.offsetWidth, alt = el.offsetHeight;
      const meia = larg / 2 + 4;
      const x = THREE.MathUtils.clamp(((tmp.x + 1) / 2) * w, meia, Math.max(meia, w - meia));
      let y = Math.max(((1 - tmp.y) / 2) * h, alt + 4);
      for (let tentativa = 0; tentativa < 8; tentativa += 1) {
        const choque = postas.find((c) => x - larg / 2 < c.x1 && x + larg / 2 > c.x0 && y - alt < c.y1 && y > c.y0);
        if (!choque) break;
        y = choque.y1 + alt + 2;
      }
      postas.push({ x0: x - larg / 2, x1: x + larg / 2, y0: y - alt, y1: y });
      el.style.transform = `translate(-50%, -100%) translate(${x}px, ${y}px)`;
    }
  }

  function redimensionar() {
    const w = palco.clientWidth, h = palco.clientHeight;
    if (!w || !h) return;
    renderer.setPixelRatio(densidade(w));
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
    if (sombraVelha) { renderer.shadowMap.needsUpdate = true; sombraVelha = false; }
    renderer.render(scene, camera);
    sujo = false;
  }

  const observadorTamanho = new ResizeObserver(redimensionar);
  observadorTamanho.observe(palco);
  const observadorVisivel = typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver(([e]) => { visivel = e.isIntersecting; sujo = true; })
    : null;
  observadorVisivel?.observe(palco);

  // A cena é montada no quadro seguinte ao toque na aba: montada ali mesmo,
  // a aba só mudava de cor depois de a cena inteira estar pronta, e o toque
  // parecia não pegar. Até lá, remontar() e configurar() só guardam estado.
  let pronto = false;
  redimensionar();
  quadro = requestAnimationFrame(() => {
    pronto = true;
    montarTudo();
    quadro = requestAnimationFrame(laco);
  });

  // Números e letras desenhados em canvas usam as fontes do app: se a fonte
  // ainda não chegou, o primeiro desenho sai na letra do sistema.
  let vivo = true;
  // Só refaz se a fonte ainda não tinha chegado: refazer sempre dobrava o
  // custo de abrir a aba.
  if (document.fonts && document.fonts.status !== 'loaded') {
    document.fonts.ready.then(() => { if (vivo) montarTudo(); }).catch(() => {});
  }

  return {
    camera,
    tela,
    remontar,
    remontarTudo: montarTudo,
    redesenhar() { sujo = true; },
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
      // O renderizador e o ambiente ficam para a próxima cena: é o contexto
      // compartilhado que evita recompilar tudo na troca de aba.
      renderer.renderLists.dispose();
      if (tela.parentElement === palco) tela.remove();
    },
  };
}
