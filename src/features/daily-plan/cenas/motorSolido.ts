import * as THREE from 'three';
import { BASE, type IdSolido } from '../../../lib/solidos';
import { criarEstudio, folhaDaMesa, malha, std, texturaMilimetrada, type OpcoesDeCor, type PaletaDeEstudio } from './estudio3d';

/**
 * Peças do laboratório de Matemática: um sólido geométrico sobre a folha, com
 * as cotas de altura e de base a tinta. As medidas saem de `lib/solidos.ts`;
 * aqui só se desenha.
 *
 * Girar é só com o dedo, como na molécula: prisma e cilindro, de frente, são
 * o mesmo retângulo, e pirâmide e cone o mesmo triângulo.
 */

export type IdRotulo = 'altura' | 'base' | 'auxiliar';

export interface CenaSolido {
  definir(id: IdSolido, altura: number): void;
  configurar(cores: OpcoesDeCor): void;
  destruir(): void;
}

/** 1 unidade da conta vira 0,36 unidade da cena. */
const ESC = 0.36;

export function montarSolido(
  palco: HTMLElement,
  rotulos: Partial<Record<IdRotulo, HTMLElement | null>>,
  coresIniciais: OpcoesDeCor,
  idInicial: IdSolido,
  alturaInicial: number,
): CenaSolido {
  let id = idInicial;
  let altura = alturaInicial;
  let giro = -0.5;
  let grupo: THREE.Group | null = null;

  const r = BASE * ESC;
  const alturaCena = () => (id === 'esfera' ? 2 * r : altura * ESC);

  function construir(c: PaletaDeEstudio) {
    const g = new THREE.Group();
    g.rotation.y = giro;
    const h = alturaCena();
    // Papel tingido pela matéria: o sólido é da mesma folha, não um objeto de
    // plástico colado nela. No claro a tinta precisa ser forte: a luz de
    // estúdio do papel creme é alta, e com 40–60% de tinta o sólido saía cinza.
    const cor = new THREE.Color(c.e ? '#3a2c20' : '#fbf4e4').lerp(new THREE.Color(c.acento), c.e ? 0.35 : 0.85);
    const mat = std(`#${cor.getHexString()}`, 0.05, 0.7);
    let solido: THREE.Mesh;
    switch (id) {
      case 'prisma': solido = malha(new THREE.BoxGeometry(r, h, r), mat, [0, h / 2, 0]); break;
      case 'cilindro': solido = malha(new THREE.CylinderGeometry(r, r, h, 48), mat, [0, h / 2, 0]); break;
      // Pirâmide de base quadrada: cone de 4 segmentos, com o raio da diagonal.
      case 'piramide': solido = malha(new THREE.ConeGeometry(r / Math.SQRT2, h, 4), mat, [0, h / 2, 0], [0, Math.PI / 4, 0]); break;
      case 'cone': solido = malha(new THREE.ConeGeometry(r, h, 48), mat, [0, h / 2, 0]); break;
      case 'esfera': solido = malha(new THREE.SphereGeometry(r, 48, 32), mat, [0, r, 0]); break;
    }
    g.add(solido);
    if (id === 'esfera') {
      // Equador a tinta: a esfera não tem aresta, e o contorno a tinta não a
      // pega; sem o equador ela lia como um disco.
      const eq = new THREE.Mesh(new THREE.TorusGeometry(r + 0.002, 0.012, 8, 96), new THREE.MeshBasicMaterial({ color: c.tinta, transparent: true, opacity: 0.6 }));
      eq.rotation.x = Math.PI / 2; eq.position.y = r;
      g.add(eq);
    }
    // Cotas a tinta, na cor da matéria: altura ao lado, base (raio ou lado) no chão.
    const tinta = new THREE.LineBasicMaterial({ color: c.acento });
    const pts: number[] = [];
    const x = (id === 'prisma' || id === 'piramide' ? r / 2 : r) + 0.25;
    if (id !== 'esfera') {
      pts.push(x, 0, 0, x, h, 0, x - 0.08, 0, 0, x + 0.08, 0, 0, x - 0.08, h, 0, x + 0.08, h, 0);
    }
    const y = 0.012;
    if (id === 'prisma' || id === 'piramide') pts.push(-r / 2, y, r / 2 + 0.2, r / 2, y, r / 2 + 0.2);
    else pts.push(0, id === 'esfera' ? r : y, 0, r, id === 'esfera' ? r : y, 0);
    g.add(new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(pts, 3)), tinta));
    grupo = g;
    return g;
  }

  const noMundo = (p: THREE.Vector3) => {
    if (!grupo) return p;
    grupo.updateMatrixWorld();
    return grupo.localToWorld(p.clone());
  };

  // Mira no meio da altura máxima: mirando mais baixo, o topo do sólido de
  // altura 8 encostava no rótulo "Laboratório de Matemática".
  const foco3d = new THREE.Vector3(0, 1.4, 0);
  const estudio = criarEstudio<IdRotulo>(palco, rotulos, coresIniciais, {
    enquadrar(camera, w, h) {
      const meia = THREE.MathUtils.degToRad(camera.fov / 2);
      // A altura máxima (8 × 0,36 ≈ 2,9) precisa caber em pé; a largura, com as cotas.
      const d = THREE.MathUtils.clamp(Math.max(2.0 / (Math.tan(meia) * (w / h)), 2.25 / Math.tan(meia)), 5, 14);
      camera.position.set(foco3d.x + d * 0.25, foco3d.y + d * 0.32, d);
      camera.lookAt(foco3d);
    },
    rotulos: {
      altura: () => noMundo(new THREE.Vector3((id === 'prisma' || id === 'piramide' ? r / 2 : r) + 0.55, alturaCena() / 2 + 0.1, 0)),
      base: () => noMundo(id === 'prisma' || id === 'piramide' ? new THREE.Vector3(0, 0.05, r / 2 + 0.55) : new THREE.Vector3(r / 2, id === 'esfera' ? r + 0.15 : 0.15, 0.3)),
      auxiliar: () => noMundo(new THREE.Vector3(-r * 0.75, alturaCena() * 0.62, 0.2)),
    },
    fixo: (c) => folhaDaMesa(texturaMilimetrada(c, [14, 9]), 9, 6, [0, 0, 0.3]),
    movel: construir,
    sombra: { esquerda: -4, direita: 4, topo: 5, base: -3 },
  });
  const { tela } = estudio;

  // Girar com o dedo: só o arraste horizontal; o vertical rola a página.
  let arrastando = false, ultimoX = 0;
  const aoApertar = (ev: PointerEvent) => { arrastando = true; ultimoX = ev.clientX; tela.setPointerCapture?.(ev.pointerId); tela.style.cursor = 'grabbing'; };
  const aoMover = (ev: PointerEvent) => {
    if (!arrastando || !grupo) return;
    giro += (ev.clientX - ultimoX) * 0.012; ultimoX = ev.clientX;
    grupo.rotation.y = giro;
    estudio.redesenhar();
  };
  const soltar = () => { arrastando = false; tela.style.cursor = ''; };
  tela.addEventListener('pointerdown', aoApertar);
  tela.addEventListener('pointermove', aoMover);
  tela.addEventListener('pointerup', soltar);
  tela.addEventListener('pointercancel', soltar);

  return {
    definir(novoId, novaAltura) {
      if (novoId === id && novaAltura === altura) return;
      id = novoId; altura = novaAltura;
      estudio.remontar();
    },
    configurar: (cores) => estudio.configurar(cores),
    destruir() {
      tela.removeEventListener('pointerdown', aoApertar);
      tela.removeEventListener('pointermove', aoMover);
      tela.removeEventListener('pointerup', soltar);
      tela.removeEventListener('pointercancel', soltar);
      estudio.destruir();
    },
  };
}
