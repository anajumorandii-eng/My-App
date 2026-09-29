import * as THREE from 'three';
import { ESTATUA, PAREDE, ampliacao } from '../../../lib/caverna';
import { basic, criarEstudio, folhaDaMesa, malha, std, texturaMilimetrada, texturaRadial, traco, type OpcoesDeCor, type PaletaDeEstudio } from './estudio3d';

/**
 * Laboratório de Filosofia: a caverna de Platão com a sombra calculada.
 *
 * Fogo, estátua e parede estão numa reta; a sombra é a silhueta da estátua
 * ampliada por D/d (`lib/caverna.ts`), desenhada na parede, e não uma sombra
 * do renderizador: a do renderizador vinha borrada e do tamanho que a luz
 * quisesse, e a lição aqui é justamente o tamanho. Os dois raios do fogo às
 * pontas da estátua seguem até a parede e fecham os triângulos semelhantes.
 *
 * A montagem vai girada, com a parede voltada para a câmera: de frente para
 * o eixo, a parede aparecia de perfil e a sombra sumia.
 */

export type IdRotulo = 'fogo' | 'estatua' | 'sombra';

export interface CenaCaverna {
  definir(d: number): void;
  configurar(cores: OpcoesDeCor): void;
  destruir(): void;
}

/** Altura do fogo e da base da estátua (em cima do muro baixo). */
const Y0 = 0.55;
const GIRO = 0.72;
const X_FOGO = -PAREDE / 2;

/** Perfil de uma ânfora: meia silhueta, de baixo para cima, altura 1. */
const PERFIL: [number, number][] = [
  [0, 0], [0.16, 0], [0.18, 0.06], [0.3, 0.3], [0.32, 0.45], [0.26, 0.64], [0.14, 0.78], [0.12, 0.9], [0.18, 0.96], [0.18, 1], [0, 1],
];

export function montarCaverna(
  palco: HTMLElement,
  rotulos: Partial<Record<IdRotulo, HTMLElement | null>>,
  coresIniciais: OpcoesDeCor,
  dInicial: number,
): CenaCaverna {
  let d = dInicial;
  const grupoGiro = new THREE.Matrix4().makeRotationY(GIRO);
  const noMundo = (x: number, y: number, z = 0) => new THREE.Vector3(x, y, z).applyMatrix4(grupoGiro);

  function construir(c: PaletaDeEstudio) {
    const g = new THREE.Group();
    g.rotation.y = GIRO;
    const pedra = new THREE.Color(c.e ? '#4a3a2a' : '#d9c7a4');
    const acento = new THREE.Color(c.acento);
    // Parede do fundo, em x = +PAREDE/2, voltada para o fogo.
    const xp = PAREDE / 2;
    g.add(malha(new THREE.BoxGeometry(0.25, 4.3, 3.4), std(`#${pedra.getHexString()}`, 0, 0.95), [xp + 0.125, 2.15, 0]));
    // Muro baixo por onde passam os objetos, e o trilho da estátua.
    g.add(malha(new THREE.BoxGeometry(PAREDE - 0.6, Y0, 0.5), std(`#${pedra.clone().lerp(new THREE.Color(c.tinta), 0.12).getHexString()}`, 0, 0.9), [0.2, Y0 / 2, -0.9]));
    // Estátua: ânfora em torno, com a altura da lib.
    const pontos = PERFIL.map(([r, y]) => new THREE.Vector2(r * ESTATUA, y * ESTATUA));
    const tom = new THREE.Color(c.e ? '#e9d2a6' : '#fbf4e4').lerp(acento, c.e ? 0.45 : 0.7);
    const xe = X_FOGO + d;
    g.add(malha(new THREE.CylinderGeometry(0.3, 0.34, Y0, 24), std(c.escuroMetal, 0.2, 0.6), [xe, Y0 / 2, 0]));
    g.add(malha(new THREE.LatheGeometry(pontos, 40), std(`#${tom.getHexString()}`, 0.05, 0.6), [xe, Y0, 0]));
    // Sombra na parede: a mesma silhueta, ampliada por D/d a partir da altura do fogo.
    const k = ampliacao(d);
    const forma = new THREE.Shape();
    const cheio = [...PERFIL.map(([r, y]) => [r, y] as const), ...PERFIL.slice().reverse().map(([r, y]) => [-r, y] as const)];
    cheio.forEach(([r, y], i) => { const px = r * ESTATUA * k, py = y * ESTATUA * k; if (i === 0) forma.moveTo(px, py); else forma.lineTo(px, py); });
    const sombra = new THREE.Mesh(new THREE.ShapeGeometry(forma), basic(c.e ? '#050302' : '#2a1c10', 1, { transparent: true, opacity: c.e ? 0.85 : 0.6, depthWrite: false }));
    sombra.rotation.y = -Math.PI / 2;
    sombra.position.set(xp - 0.01, Y0, 0);
    g.add(sombra);
    // Fogo: brasas e chama, com halo.
    g.add(malha(new THREE.CylinderGeometry(0.05, 0.05, 0.7, 8), std(c.escuroMetal, 0, 0.9), [X_FOGO, 0.12, 0], [0, 0, 1.1]));
    g.add(malha(new THREE.CylinderGeometry(0.05, 0.05, 0.7, 8), std(c.escuroMetal, 0, 0.9), [X_FOGO, 0.12, 0], [0, 0, -1.1]));
    g.add(malha(new THREE.ConeGeometry(0.2, Y0 + 0.15, 18), basic(c.e ? '#ffb347' : '#e07b1a', c.e ? 1.3 : 1), [X_FOGO, (Y0 + 0.15) / 2 + 0.1, 0], [0, 0, 0], false));
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: texturaRadial('rgba(255,170,70,.6)', 'rgba(255,170,70,0)'), depthWrite: false }));
    // Sem luz pontual de verdade: uma luz a mais muda o conjunto de luzes da
    // cena e obriga o renderizador compartilhado a recompilar os programas,
    // que é o travamento na troca de aba que acabou de ser tirado.
    halo.position.set(X_FOGO, Y0, 0); halo.scale.setScalar(1.8); g.add(halo);
    // Raios do fogo às pontas da estátua, até a parede.
    const f = new THREE.Vector3(X_FOGO, Y0, 0);
    const topoEstatua = new THREE.Vector3(xe, Y0 + ESTATUA, 0);
    const topoSombra = new THREE.Vector3(xp - 0.02, Y0 + ESTATUA * k, 0);
    g.add(traco([f, topoSombra], c.acento, 0.8));
    g.add(traco([f, new THREE.Vector3(xp - 0.02, Y0, 0)], c.acento, 0.5));
    g.add(traco([topoEstatua, new THREE.Vector3(xe, Y0, 0)], c.acento, 0.8));
    return g;
  }

  const foco3d = new THREE.Vector3(0, 1.5, 0);
  const estudio = criarEstudio<IdRotulo>(palco, rotulos, coresIniciais, {
    enquadrar(camera, w, h) {
      const meia = THREE.MathUtils.degToRad(camera.fov / 2);
      const d0 = THREE.MathUtils.clamp(Math.max(3.4 / (Math.tan(meia) * (w / h)), 2.5 / Math.tan(meia)), 5, 18);
      camera.position.set(foco3d.x - 0.5, foco3d.y + d0 * 0.22, d0);
      camera.lookAt(foco3d);
    },
    rotulos: {
      sombra: () => noMundo(PAREDE / 2 - 0.1, Y0 + ESTATUA * ampliacao(d) + 0.28),
      estatua: () => noMundo(X_FOGO + d, Y0 + ESTATUA + 0.32),
      fogo: () => noMundo(X_FOGO, Y0 + 0.62),
    },
    fixo: (c) => folhaDaMesa(texturaMilimetrada(c, [16, 10]), 12, 8, [0, 0, 0]),
    movel: construir,
    sombra: { esquerda: -5, direita: 5, topo: 5, base: -4 },
  });

  return {
    definir(novo) {
      if (novo === d) return;
      d = novo;
      estudio.remontar();
    },
    configurar: (cores) => estudio.configurar(cores),
    destruir: () => estudio.destruir(),
  };
}
