import * as THREE from 'three';
import { DNA_B, MOLDE, geometriaDoPar, parNaPosicao, type Base } from '../../../lib/duplaHelice';
import { basic, criarEstudio, folhaDaMesa, malha, std, texturaMilimetrada, type OpcoesDeCor, type PaletaDeEstudio } from './estudio3d';

/**
 * Peças da dupla-hélice de DNA, sobre o estúdio comum das cenas do Hoje.
 *
 * O desenho sai de `lib/duplaHelice.ts`: 10 pares por volta, 0,34 nm entre
 * pares, 2 nm de diâmetro, e o pareamento de `basePair`. A hélice fica
 * deitada ao longo do cartão — em pé, na coluna larga do iPad, sobrava papel
 * dos dois lados e ela virava um risco.
 *
 * Simplificação declarada: os degraus passam pelo eixo, como no desenho dos
 * livros. A hélice real tem sulco maior e menor, que esta cena não mostra e
 * por isso não nomeia.
 */

export type IdRotulo = 'molde' | 'complementar' | 'pontes' | 'fitaMolde3' | 'fitaMolde5' | 'fitaComp5' | 'fitaComp3';

export interface Helice {
  definirPar(indice: number): void;
  configurar(cores: OpcoesDeCor): void;
  destruir(): void;
}

/** 1 nm vira 1,5 unidade da cena. */
const ESCALA = 1.5;
const RAIO = (DNA_B.diametroNm / 2) * ESCALA;
const ALTURA = 2.3;
const N = MOLDE.length;
const COMPRIMENTO = (N - 1) * DNA_B.subidaPorParNm * ESCALA;
const X0 = -COMPRIMENTO / 2;

/**
 * Cor de cada base nas cores da logo (cobre, vinho, floresta, latão), não as
 * quatro cores saturadas dos livros: sobre o papel, elas brigavam com o acento
 * da matéria, que precisa marcar o par em foco.
 */
function corDaBase(base: Base, escuro: boolean) {
  const claro = { A: '#b0561a', T: '#8e1b2b', C: '#155c3c', G: '#8a6230' };
  const noEscuro = { A: '#e08a4a', T: '#d0566a', C: '#4fb884', G: '#d2a66a' };
  return (escuro ? noEscuro : claro)[base];
}

function pontoDaFita(indice: number, fase: number) {
  const { angulo, alturaNm } = geometriaDoPar(indice);
  const a = angulo + fase;
  return new THREE.Vector3(X0 + alturaNm * ESCALA, ALTURA + Math.cos(a) * RAIO, Math.sin(a) * RAIO);
}

export function montarHelice(
  palco: HTMLElement,
  rotulos: Partial<Record<IdRotulo, HTMLElement | null>>,
  coresIniciais: OpcoesDeCor,
  indiceInicial: number,
  aoEscolher: (indice: number) => void,
): Helice {
  let foco = indiceInicial;
  const degraus: THREE.Object3D[] = [];

  function construirFixo(c: PaletaDeEstudio) {
    const g = new THREE.Group();
    g.add(folhaDaMesa(texturaMilimetrada(c, [24, 12]), 16, 9, [0, 0, 0.4]));
    // As duas fitas: tubos ao longo da hélice, a molde em latão e a
    // complementar em metal escuro, para que se leia qual é qual sem legenda
    // de cor.
    for (const [fase, cor] of [[0, c.latao], [Math.PI, c.escuroMetal]] as const) {
      const pontos: THREE.Vector3[] = [];
      for (let t = -0.4; t <= N - 1 + 0.4; t += 0.1) pontos.push(pontoDaFita(t, fase));
      const curva = new THREE.CatmullRomCurve3(pontos);
      g.add(malha(new THREE.TubeGeometry(curva, 240, 0.11, 12, false), std(cor, 0.6, 0.35)));
    }
    return g;
  }

  function construirMovel(c: PaletaDeEstudio) {
    const g = new THREE.Group();
    degraus.length = 0;
    for (let i = 0; i < N; i += 1) {
      const par = parNaPosicao(i);
      const a = pontoDaFita(i, 0), b = pontoDaFita(i, Math.PI);
      const meio = a.clone().add(b).multiplyScalar(0.5);
      const emFoco = i === foco;
      const degrau = new THREE.Group(); degrau.name = `par-${i}`;
      // Cada degrau em duas metades, uma por base, que se encontram no eixo.
      for (const [de, base] of [[a, par.molde], [b, par.complementar]] as const) {
        const dir = new THREE.Vector3().subVectors(meio, de);
        const comprimento = dir.length() - 0.06;
        const peca = malha(new THREE.CylinderGeometry(0.09, 0.09, comprimento, 12), std(corDaBase(base, c.e), 0.1, 0.55));
        peca.position.copy(de).addScaledVector(dir.clone().normalize(), comprimento / 2 + 0.02);
        peca.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
        if (!emFoco) (peca.material as THREE.MeshStandardMaterial).color.lerp(new THREE.Color(c.papel), 0.25);
        degrau.add(peca);
      }
      if (emFoco) {
        // As pontes de hidrogênio: 2 em A–T, 3 em C–G, na cor da matéria, no
        // ponto em que as bases se encontram.
        const eixo = new THREE.Vector3().subVectors(b, a).normalize();
        const lado = new THREE.Vector3(1, 0, 0);
        for (let k = 0; k < par.pontesDeHidrogenio; k += 1) {
          const desvio = (k - (par.pontesDeHidrogenio - 1) / 2) * 0.14;
          const ponte = malha(new THREE.CylinderGeometry(0.025, 0.025, 0.16, 8), basic(c.acento, c.e ? 1.4 : 1), [0, 0, 0], [0, 0, 0], false);
          ponte.position.copy(meio).addScaledVector(lado, desvio);
          ponte.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), eixo);
          degrau.add(ponte);
        }
        // Moldura de tinta em volta do par em foco, para o olho achar o par
        // mesmo quando a hélice o gira para trás.
        const anel = new THREE.Mesh(new THREE.TorusGeometry(RAIO + 0.22, 0.02, 8, 64), basic(c.acento, c.e ? 1.2 : 1, { transparent: true, opacity: 0.7 }));
        anel.position.set(meio.x, ALTURA, 0); anel.rotation.y = Math.PI / 2;
        degrau.add(anel);
      }
      // Área de toque do degrau inteiro, maior que as peças.
      const toque = new THREE.Mesh(new THREE.BoxGeometry(0.44, RAIO * 2.4, RAIO * 2.4), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
      toque.position.set(meio.x, ALTURA, 0); toque.userData.indice = i;
      degrau.add(toque);
      degraus.push(toque);
      g.add(degrau);
    }
    return g;
  }

  const foco3d = new THREE.Vector3(0, ALTURA - 0.2, 0);
  const estudio = criarEstudio<IdRotulo>(palco, rotulos, coresIniciais, {
    // Quase de frente, um pouco de cima e de lado: de frente exato os
    // degraus viram traços e a hélice parece um zigue-zague plano.
    enquadrar(camera, w, h) {
      const meia = THREE.MathUtils.degToRad(camera.fov / 2);
      const d = THREE.MathUtils.clamp(Math.max(4.6 / (Math.tan(meia) * (w / h)), 3.0 / Math.tan(meia)), 8, 20);
      const ang = -0.32;
      camera.position.set(foco3d.x + Math.sin(ang) * d, foco3d.y + d * 0.2, Math.cos(ang) * d);
      camera.lookAt(foco3d);
    },
    rotulos: {
      molde: () => pontoDaFita(foco, 0).add(new THREE.Vector3(0, 0.45, 0)),
      complementar: () => pontoDaFita(foco, Math.PI).add(new THREE.Vector3(0, 0.45, 0)),
      pontes: () => new THREE.Vector3(X0 + foco * DNA_B.subidaPorParNm * ESCALA, ALTURA - RAIO - 0.55, 0),
      fitaMolde3: () => pontoDaFita(-0.9, 0),
      fitaMolde5: () => pontoDaFita(N - 0.1, 0),
      fitaComp5: () => pontoDaFita(-0.9, Math.PI),
      fitaComp3: () => pontoDaFita(N - 0.1, Math.PI),
    },
    fixo: construirFixo,
    movel: construirMovel,
    sombra: { esquerda: -8, direita: 8, topo: 6, base: -4 },
  });
  const { camera, tela } = estudio;

  // Toque num degrau escolhe o par.
  const raycaster = new THREE.Raycaster(), ptr = new THREE.Vector2();
  const aoTocar = (ev: PointerEvent) => {
    const r = tela.getBoundingClientRect();
    ptr.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(ptr, camera);
    const acerto = raycaster.intersectObjects(degraus, false)[0];
    if (acerto) aoEscolher(acerto.object.userData.indice as number);
  };
  tela.addEventListener('pointerup', aoTocar);

  return {
    definirPar(indice) {
      const i = parNaPosicao(indice).indice;
      if (i === foco) return;
      foco = i;
      estudio.remontar();
    },
    configurar: (cores) => estudio.configurar(cores),
    destruir() {
      tela.removeEventListener('pointerup', aoTocar);
      estudio.destruir();
    },
  };
}
