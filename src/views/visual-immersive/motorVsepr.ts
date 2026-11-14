import * as THREE from 'three';
import { MOLECULAS, type IdMolecula } from '../../lib/geometriaMolecular';
import { basic, criarEstudio, folhaDaMesa, malha, std, texturaMilimetrada, type OpcoesDeCor, type PaletaDeEstudio } from '../../features/daily-plan/cenas/estudio3d';
import { LIGACAO, RAIO, corDoElemento } from '../../features/daily-plan/cenas/motorMolecula';
import { ESTAGIOS, dipoloResultante, type TipoDeNuvem } from './vseprStages';

/**
 * Motor WebGL da cena imersiva de geometria molecular.
 *
 * É a primeira cena imersiva em WebGL; a PCR e a de Lenz desenham em Canvas 2D.
 * Aqui o volume é o assunto — tetraedro, pirâmide e ângulo só se leem com luz,
 * sombra e oclusão de verdade — e o aplicativo já tinha um estúdio three.js
 * aprovado nas cenas do Hoje. Este motor monta sobre ele (`criarEstudio`): o
 * mesmo renderizador compartilhado, o papel milimetrado, o traço a tinta. Um
 * segundo contexto WebGL traria de volta o travamento do iPad que o
 * renderizador único resolveu.
 *
 * A diferença para `motorMolecula.ts`, do Hoje, é o movimento: lá a molécula é
 * trocada; aqui uma vira a outra. As quatro nuvens ficam nas mesmas posições
 * (`vseprStages.ts`) e o que se move é o que a repulsão explica. Nada gira nem
 * se mexe sozinho: o laço só roda durante uma transição ou um gesto, e para.
 */
export type IdRotuloVsepr = 'central' | 'n0' | 'n1' | 'n2' | 'n3' | 'angulo';

export interface CenaVsepr {
  /** Leva a cena à molécula. `instantaneo` pula a transição (pausa, movimento reduzido). */
  definir(id: IdMolecula, opcoes: { dipolo: boolean; instantaneo: boolean }): void;
  girar(passos: number, instantaneo: boolean): void;
  aproximar(sim: boolean, instantaneo: boolean): void;
  /** Redesenha no lugar: o texto da casca mudou de altura e o espaço livre é outro. */
  reenquadrar(): void;
  configurar(cores: OpcoesDeCor): void;
  destruir(): void;
}

const ALTURA = 2.3;
const EIXO_Y = new THREE.Vector3(0, 1, 0);

interface Slot {
  tipo: TipoDeNuvem;
  dir: THREE.Vector3;
  alvo: THREE.Vector3;
  /** 0 a 1: quanto da nuvem já apareceu. */
  presenca: number;
  atomo?: THREE.Mesh;
  varetas: THREE.Mesh[];
  nuvem?: THREE.Mesh;
  eletrons: THREE.Mesh[];
  seta?: THREE.Mesh;
}

export function montarVsepr(
  palco: HTMLElement,
  rotulos: Partial<Record<IdRotuloVsepr, HTMLElement | null>>,
  coresIniciais: OpcoesDeCor,
  inicial: { id: IdMolecula; dipolo: boolean },
  /**
   * Onde a molécula cabe, em px do palco. Quem sabe é a casca: o espaço livre
   * fica entre título, leitura, ferramentas e texto, e muda com a etapa. Com
   * posição fixa, a molécula caía sob o título de três linhas no computador e
   * sobre o texto no celular.
   */
  quadro: (largura: number, altura: number) => { cx: number; cy: number; tamanho: number },
): CenaVsepr {
  let id = inicial.id;
  let dipolo = inicial.dipolo;
  // Deste lado as três nuvens de baixo aparecem separadas, o CO₂ fica de
  // perfil e a água abre o V para a frente, com os pares livres atrás. De
  // frente, uma ligação se escondia atrás do átomo central.
  let giro = 2.04, giroAlvo = giro;
  let zoom = 1, zoomAlvo = 1;
  let grupo: THREE.Group | null = null;
  let arco: THREE.Line | null = null;
  let resultante: THREE.Group | null = null;
  const slots: Slot[] = ESTAGIOS[id].nuvens.map(n => ({
    tipo: n.tipo, dir: new THREE.Vector3(...n.direcao), alvo: new THREE.Vector3(...n.direcao), presenca: 1, varetas: [], eletrons: [],
  }));

  const centralPuxa = () => id === 'NH3' || id === 'H2O';

  /** Põe cada peça onde a direção atual da nuvem manda. */
  function posicionar() {
    for (const s of slots) {
      const d = s.dir, k = s.presenca;
      if (s.atomo) {
        s.atomo.visible = s.tipo === 'ligacao' && k > 0.01;
        s.atomo.position.copy(d).multiplyScalar(LIGACAO * (0.55 + 0.45 * k));
        s.atomo.scale.setScalar(Math.max(k, 0.001));
      }
      const q = new THREE.Quaternion().setFromUnitVectors(EIXO_Y, d);
      const lado = new THREE.Vector3().crossVectors(d, Math.abs(d.y) < 0.9 ? EIXO_Y : new THREE.Vector3(1, 0, 0)).normalize();
      s.varetas.forEach((v, i) => {
        v.visible = s.tipo === 'ligacao' && k > 0.01;
        v.quaternion.copy(q);
        v.scale.set(1, Math.max(k, 0.001), 1);
        v.position.copy(d).multiplyScalar(LIGACAO * 0.5 * k);
        // Ligação dupla: duas varetas lado a lado.
        if (s.varetas.length === 2) v.position.addScaledVector(lado, i === 0 ? -0.09 : 0.09);
      });
      if (s.nuvem) {
        s.nuvem.visible = s.tipo === 'par' && k > 0.01;
        s.nuvem.quaternion.copy(q);
        s.nuvem.scale.set(0.75 * k, 1.5 * k, 0.75 * k);
        s.nuvem.position.copy(d).multiplyScalar(0.95);
      }
      s.eletrons.forEach((e, i) => {
        e.visible = s.tipo === 'par' && k > 0.5;
        e.position.copy(d).multiplyScalar(1.15).addScaledVector(lado, (i ? 1 : -1) * 0.12);
      });
      if (s.seta) {
        // Seta do dipolo da ligação, apontando para quem puxa os elétrons.
        s.seta.visible = dipolo && s.tipo === 'ligacao' && k > 0.9;
        const para = centralPuxa() ? d.clone().negate() : d;
        s.seta.quaternion.setFromUnitVectors(EIXO_Y, para);
        s.seta.position.copy(d).multiplyScalar(LIGACAO * 0.52).addScaledVector(lado, 0.2);
      }
    }
    const ligadas = slots.filter(s => s.tipo === 'ligacao');
    if (arco && ligadas.length >= 2) {
      const a = ligadas[ligadas.length - 2].dir, b = ligadas[ligadas.length - 1].dir;
      const pos = arco.geometry.getAttribute('position') as THREE.BufferAttribute;
      const reto = a.dot(b) < -0.999;
      // Em 180° a interpolação passa pelo centro; o arco dá a meia-volta por cima.
      const eixo = reto ? new THREE.Vector3().crossVectors(a, EIXO_Y).normalize() : null;
      const p = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        const t = i / (pos.count - 1);
        if (eixo) p.copy(a).applyAxisAngle(eixo, -Math.PI * t); else p.copy(a).lerp(b, t).normalize();
        p.multiplyScalar(0.72);
        pos.setXYZ(i, p.x, p.y, p.z);
      }
      pos.needsUpdate = true;
      arco.visible = Math.min(ligadas[ligadas.length - 2].presenca, ligadas[ligadas.length - 1].presenca) > 0.6;
    }
    if (resultante) {
      const r = dipolo ? dipoloResultante(ESTAGIOS[id]) : null;
      resultante.visible = !!r && slots.every(s => s.dir.distanceToSquared(s.alvo) < 1e-4);
      if (r) resultante.quaternion.setFromUnitVectors(EIXO_Y, new THREE.Vector3(...r));
    }
  }

  function construir(c: PaletaDeEstudio) {
    const m = MOLECULAS[id];
    const g = new THREE.Group();
    g.position.y = ALTURA;
    g.rotation.set(0.28, giro, 0);
    g.add(malha(new THREE.SphereGeometry(RAIO[m.central], 32, 24), std(corDoElemento(m.central, c.e), 0.15, 0.4)));
    const matVareta = std(c.escuroMetal, 0.5, 0.45);
    const matSeta = basic(c.acento, c.e ? 1.25 : 1);
    for (const s of slots) {
      s.atomo = malha(new THREE.SphereGeometry(RAIO[m.ligante], 28, 20), std(corDoElemento(m.ligante, c.e), 0.1, 0.45));
      g.add(s.atomo);
      const dupla = id === 'CO2';
      s.varetas = (dupla ? [0, 1] : [0]).map(() => malha(new THREE.CylinderGeometry(dupla ? 0.05 : 0.07, dupla ? 0.05 : 0.07, LIGACAO, 16), matVareta));
      // Par livre: nuvem translúcida na cor da cena, com os dois elétrons dela.
      s.nuvem = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 16), basic(c.acento, 1, { transparent: true, opacity: c.e ? 0.24 : 0.2, depthWrite: false }));
      s.eletrons = [0, 1].map(() => malha(new THREE.SphereGeometry(0.06, 12, 10), basic(c.acento, c.e ? 1.3 : 1), [0, 0, 0], [0, 0, 0], false));
      s.seta = malha(new THREE.ConeGeometry(0.075, 0.3, 14), matSeta, [0, 0, 0], [0, 0, 0], false);
      g.add(...s.varetas, s.nuvem, ...s.eletrons, s.seta);
    }
    arco = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(Array.from({ length: 33 }, () => new THREE.Vector3())),
      new THREE.LineBasicMaterial({ color: c.acento, transparent: true, opacity: 0.9 }),
    );
    g.add(arco);
    // Dipolo resultante: haste e ponta, mais grossas que as setas das ligações.
    resultante = new THREE.Group();
    resultante.add(malha(new THREE.CylinderGeometry(0.045, 0.045, 1.15, 12), matSeta, [0, 0.9, 0], [0, 0, 0], false));
    resultante.add(malha(new THREE.ConeGeometry(0.13, 0.36, 16), matSeta, [0, 1.62, 0], [0, 0, 0], false));
    g.add(resultante);
    grupo = g;
    posicionar();
    return g;
  }

  const noMundo = (local: THREE.Vector3) => {
    if (!grupo) return local.clone().add(new THREE.Vector3(0, ALTURA, 0));
    grupo.updateMatrixWorld();
    return grupo.localToWorld(local.clone());
  };
  const noSlot = (i: number) => () => {
    const s = slots[i];
    return s.tipo === 'ligacao' ? noMundo(s.dir.clone().multiplyScalar(LIGACAO).add(new THREE.Vector3(0, RAIO[MOLECULAS[id].ligante] + 0.14, 0))) : new THREE.Vector3(0, -99, 0);
  };
  const meioDoAngulo = () => {
    const ligadas = slots.filter(s => s.tipo === 'ligacao');
    const a = ligadas[ligadas.length - 2]?.dir, b = ligadas[ligadas.length - 1]?.dir;
    if (!a || !b) return new THREE.Vector3(0, 1, 0);
    const meio = a.clone().add(b);
    return meio.lengthSq() < 1e-4 ? new THREE.Vector3().crossVectors(new THREE.Vector3().crossVectors(a, EIXO_Y), a).normalize() : meio.normalize();
  };

  const foco = new THREE.Vector3(0, ALTURA, 0);
  const estudio = criarEstudio<IdRotuloVsepr>(palco, rotulos, coresIniciais, {
    enquadrar(camera, w, h) {
      // O desvio de vista desloca a imagem até o espaço livre sem entortar a
      // perspectiva, como faria mirar a câmera para o lado.
      const { cx, cy, tamanho } = quadro(w, h);
      const meia = THREE.MathUtils.degToRad(camera.fov / 2);
      const d = (3.9 * h) / (2 * Math.tan(meia) * Math.max(tamanho, 40)) / zoom;
      camera.setViewOffset(w, h, w / 2 - cx, h / 2 - cy, w, h);
      camera.far = Math.max(160, d * 3);
      camera.position.set(foco.x, foco.y + d * 0.16, d);
      camera.lookAt(foco);
    },
    rotulos: {
      // Abaixo do átomo: ao lado, o símbolo do central encostava no do ligante
      // ("O C" no CO₂) e parecia uma fórmula.
      central: () => noMundo(new THREE.Vector3()).add(new THREE.Vector3(0, -0.98, 0)),
      n0: noSlot(0), n1: noSlot(1), n2: noSlot(2), n3: noSlot(3),
      angulo: () => noMundo(meioDoAngulo().multiplyScalar(1.0)),
    },
    fixo: (c) => folhaDaMesa(texturaMilimetrada(c, [16, 10]), 11, 7, [0, 0, 0.2]),
    movel: construir,
    sombra: { esquerda: -5, direita: 5, topo: 5, base: -4 },
  });
  const { tela, camera } = estudio;
  // O toque vertical continua rolando a página, como nas outras cenas imersivas.
  tela.style.touchAction = 'pan-y';
  tela.style.cursor = 'grab';

  const api: CenaVsepr = {
    definir, girar, aproximar, reenquadrar: () => { if (!quadro_) aplicar(); },
    configurar: (cores) => { estudio.configurar(cores); pedir(); },
    destruir,
  };

  // ---- Laço: só existe enquanto algo ainda está a caminho do alvo. ----
  let quadro_ = 0, anterior = 0, vivo = true;
  const emRepouso = () => Math.abs(giroAlvo - giro) < 1e-3 && Math.abs(zoomAlvo - zoom) < 1e-3
    // Um centésimo de unidade já não se vê; esperar mais só deixava o laço
    // rodando meio segundo além do movimento (o roteiro de conferência achou).
    && slots.every(s => s.presenca > 0.99 && s.dir.distanceToSquared(s.alvo) < 1e-4);
  function assentar() {
    giro = giroAlvo; zoom = zoomAlvo;
    for (const s of slots) { s.dir.copy(s.alvo); s.presenca = 1; }
  }
  function aplicar() {
    if (grupo) grupo.rotation.y = giro;
    posicionar();
    estudio.redesenhar(true);
  }
  function passo(agora: number) {
    quadro_ = 0;
    if (!vivo) return;
    const dt = anterior ? Math.min((agora - anterior) / 1000, 0.05) : 0.016; anterior = agora;
    const k = 1 - Math.exp(-dt * 3.4);
    giro += (giroAlvo - giro) * Math.min(1, dt * 6);
    zoom += (zoomAlvo - zoom) * k;
    for (const s of slots) {
      s.dir.lerp(s.alvo, k).normalize();
      s.presenca += (1 - s.presenca) * k;
    }
    if (emRepouso()) assentar();
    aplicar();
    if (!emRepouso()) quadro_ = requestAnimationFrame(passo); else anterior = 0;
  }
  function pedir(instantaneo = false) {
    if (instantaneo) { cancelAnimationFrame(quadro_); quadro_ = 0; anterior = 0; assentar(); aplicar(); return; }
    if (!quadro_) quadro_ = requestAnimationFrame(passo);
  }

  function definir(novo: IdMolecula, opcoes: { dipolo: boolean; instantaneo: boolean }) {
    const mudouDipolo = opcoes.dipolo !== dipolo;
    dipolo = opcoes.dipolo;
    if (novo !== id) {
      id = novo;
      ESTAGIOS[id].nuvens.forEach((n, i) => {
        const s = slots[i];
        // Nuvem que muda de natureza (ligação que vira par livre) some e nasce
        // de novo no lugar; a que só muda de direção desliza.
        if (n.tipo !== s.tipo) { s.presenca = 0; if (s.tipo === 'vazia' || n.tipo === 'vazia') s.dir.set(...n.direcao); }
        s.tipo = n.tipo;
        s.alvo.set(...n.direcao);
      });
      // Os átomos mudam com a molécula: as peças são refeitas uma vez, na troca,
      // já nas direções em que estavam, e a transição segue no lugar.
      estudio.remontar();
    } else if (!mudouDipolo && !opcoes.instantaneo) return;
    pedir(opcoes.instantaneo);
  }
  function girar(passos: number, instantaneo: boolean) { giroAlvo += (Math.PI / 3) * passos; pedir(instantaneo); }
  function aproximar(sim: boolean, instantaneo: boolean) { zoomAlvo = sim ? 1.25 : 1; pedir(instantaneo); }

  // Girar com o dedo: só o gesto horizontal.
  let arrastando = false, ultimoX = 0;
  const aoApertar = (ev: PointerEvent) => { arrastando = true; ultimoX = ev.clientX; tela.setPointerCapture?.(ev.pointerId); tela.style.cursor = 'grabbing'; };
  const aoMover = (ev: PointerEvent) => {
    if (!arrastando) return;
    giroAlvo += (ev.clientX - ultimoX) * 0.012; giro = giroAlvo; ultimoX = ev.clientX;
    aplicar();
  };
  const soltar = () => { arrastando = false; tela.style.cursor = 'grab'; };
  tela.addEventListener('pointerdown', aoApertar);
  tela.addEventListener('pointermove', aoMover);
  for (const nome of ['pointerup', 'pointercancel', 'lostpointercapture']) tela.addEventListener(nome, soltar);

  function destruir() {
    vivo = false;
    cancelAnimationFrame(quadro_);
    tela.removeEventListener('pointerdown', aoApertar);
    tela.removeEventListener('pointermove', aoMover);
    for (const nome of ['pointerup', 'pointercancel', 'lostpointercapture']) tela.removeEventListener(nome, soltar);
    camera.clearViewOffset();
    tela.style.cursor = '';
    estudio.destruir();
  }

  return api;
}
