import * as THREE from 'three';
import { MOLECULAS, type IdMolecula, type Molecula, type Vetor } from '../../../lib/geometriaMolecular';
import { basic, criarEstudio, folhaDaMesa, malha, std, texturaMilimetrada, type OpcoesDeCor, type PaletaDeEstudio } from './estudio3d';

/**
 * Peças da molécula em bolas e varetas, sobre o estúdio comum das cenas do Hoje.
 *
 * As direções das ligações e dos pares livres saem de
 * `lib/geometriaMolecular.ts`, conferido no node:test; aqui só se desenha.
 *
 * Girar é o único movimento, e só com o dedo: geometria molecular se entende
 * olhando de mais de um lado — a pirâmide da amônia, de frente, parece um
 * triângulo plano. Nada gira sozinho (a Ana Júlia recusou movimento solto).
 */

export type IdRotulo = 'central' | 'l0' | 'l1' | 'l2' | 'l3' | 'angulo';

export interface CenaMolecula {
  definirMolecula(id: IdMolecula): void;
  configurar(cores: OpcoesDeCor): void;
  destruir(): void;
}

const LIGACAO = 1.6;
const ALTURA = 2.3;
const RAIO: Record<string, number> = { H: 0.24, C: 0.4, N: 0.4, O: 0.38, B: 0.38, F: 0.34 };

/** Cores dos elementos em tons da paleta do caderno, não as saturadas do CPK. */
function corDoElemento(el: string, escuro: boolean) {
  const claro: Record<string, string> = { H: '#f6eedc', C: '#3b2c20', N: '#2f5d8a', O: '#8e1b2b', B: '#a8773a', F: '#4f7a34' };
  const noEscuro: Record<string, string> = { H: '#efe2c9', C: '#5a4634', N: '#6a9fd0', O: '#d0566a', B: '#d2a66a', F: '#8fc06a' };
  return (escuro ? noEscuro : claro)[el] ?? '#888888';
}

const vec = (v: Vetor, k = 1) => new THREE.Vector3(v[0] * k, v[1] * k, v[2] * k);

function cilindroEntre(a: THREE.Vector3, b: THREE.Vector3, raio: number, mat: THREE.Material) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const m = malha(new THREE.CylinderGeometry(raio, raio, dir.length(), 16), mat);
  m.position.addVectors(a, b).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  return m;
}

export function montarMolecula(
  palco: HTMLElement,
  rotulos: Partial<Record<IdRotulo, HTMLElement | null>>,
  coresIniciais: OpcoesDeCor,
  idInicial: IdMolecula,
): CenaMolecula {
  let molecula: Molecula = MOLECULAS[idInicial];
  let giro = -0.55;
  let grupo: THREE.Group | null = null;

  function construir(c: PaletaDeEstudio) {
    const g = new THREE.Group();
    g.position.y = ALTURA;
    g.rotation.set(0.28, giro, 0);
    const m = molecula;
    g.add(malha(new THREE.SphereGeometry(RAIO[m.central], 32, 24), std(corDoElemento(m.central, c.e), 0.15, 0.4)));
    const varetas = std(c.escuroMetal, 0.5, 0.45);
    for (const v of m.ligacoes) {
      const ponta = vec(v, LIGACAO);
      g.add(malha(new THREE.SphereGeometry(RAIO[m.ligante], 28, 20), std(corDoElemento(m.ligante, c.e), 0.1, 0.45), [ponta.x, ponta.y, ponta.z]));
      if (m.id === 'CO2') {
        // Ligação dupla C=O: duas varetas paralelas, lado a lado.
        for (const d of [-0.09, 0.09]) {
          const off = new THREE.Vector3(0, d, 0);
          g.add(cilindroEntre(off.clone(), ponta.clone().add(off), 0.05, varetas));
        }
      } else {
        g.add(cilindroEntre(new THREE.Vector3(), ponta, 0.07, varetas));
      }
    }
    // Pares não ligantes: nuvens translúcidas na cor da matéria, cada uma com
    // os seus dois elétrons. É o que empurra as ligações e fecha o ângulo.
    for (const v of m.paresLivres) {
      const dir = vec(v).normalize();
      const nuvem = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 16), basic(c.acento, 1, { transparent: true, opacity: c.e ? 0.2 : 0.18, depthWrite: false }));
      nuvem.scale.set(0.75, 1.5, 0.75);
      nuvem.position.copy(dir).multiplyScalar(0.95);
      nuvem.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
      g.add(nuvem);
      const lado = new THREE.Vector3().crossVectors(dir, Math.abs(dir.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0)).normalize();
      for (const k of [-1, 1]) {
        const eletron = malha(new THREE.SphereGeometry(0.06, 12, 10), basic(c.acento, c.e ? 1.3 : 1), [0, 0, 0], [0, 0, 0], false);
        eletron.position.copy(dir).multiplyScalar(1.15).addScaledVector(lado, k * 0.12);
        g.add(eletron);
      }
    }
    // Arco do ângulo entre as duas primeiras ligações, a tinta da matéria.
    const a = vec(m.ligacoes[0]).normalize(), b = vec(m.ligacoes[1]).normalize();
    const pontos: THREE.Vector3[] = [];
    for (let t = 0; t <= 1.0001; t += 1 / 32) pontos.push(new THREE.Vector3().copy(a).lerp(b, t).normalize().multiplyScalar(0.72));
    if (m.anguloGraus === 180) {
      // Em 180° o lerp passa pelo centro; o arco vai por cima, em meia-volta.
      pontos.length = 0;
      for (let t = 0; t <= Math.PI + 1e-4; t += Math.PI / 32) pontos.push(new THREE.Vector3(Math.cos(t) * 0.72, Math.sin(t) * 0.72, 0));
    }
    const arco = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pontos), new THREE.LineBasicMaterial({ color: c.acento, transparent: true, opacity: 0.9 }));
    g.add(arco);
    grupo = g;
    return g;
  }

  /** Posição no mundo de um ponto da molécula, já com o giro aplicado. */
  const noMundo = (local: THREE.Vector3) => {
    if (!grupo) return local.clone().add(new THREE.Vector3(0, ALTURA, 0));
    grupo.updateMatrixWorld();
    return grupo.localToWorld(local.clone());
  };
  const bissetriz = () => {
    const m = molecula;
    if (m.anguloGraus === 180) return new THREE.Vector3(0, 1, 0);
    return vec(m.ligacoes[0]).add(vec(m.ligacoes[1])).normalize();
  };
  const ligante = (i: number) => () => {
    const v = molecula.ligacoes[i];
    return v ? noMundo(vec(v, LIGACAO).add(new THREE.Vector3(0, RAIO[molecula.ligante] + 0.12, 0))) : new THREE.Vector3(0, -99, 0);
  };

  // Mira um pouco acima do centro: a molécula desce no quadro e o átomo de
  // cima não encosta na borda, que se dissolve pela máscara.
  const foco3d = new THREE.Vector3(0, ALTURA + 0.3, 0);
  const estudio = criarEstudio<IdRotulo>(palco, rotulos, coresIniciais, {
    enquadrar(camera, w, h) {
      const meia = THREE.MathUtils.degToRad(camera.fov / 2);
      // Enquadra a molécula (cerca de 4,4 unidades de ponta a ponta) com pouca
      // folga: a 7 unidades, no celular, ela ocupava um terço do palco.
      const d = THREE.MathUtils.clamp(Math.max(2.6 / (Math.tan(meia) * (w / h)), 2.5 / Math.tan(meia)), 5, 14);
      camera.position.set(foco3d.x, foco3d.y + d * 0.18, d);
      camera.lookAt(foco3d);
    },
    rotulos: {
      // Ao lado do átomo, em coordenadas do mundo: em cima, o rótulo caía sobre
      // o par livre da amônia e da água, que apontam para cima.
      central: () => noMundo(new THREE.Vector3()).add(new THREE.Vector3(-0.78, -0.02, 0)),
      l0: ligante(0), l1: ligante(1), l2: ligante(2), l3: ligante(3),
      angulo: () => noMundo(bissetriz().multiplyScalar(molecula.anguloGraus === 180 ? 1.05 : 0.95)),
    },
    fixo: (c) => folhaDaMesa(texturaMilimetrada(c, [16, 10]), 11, 7, [0, 0, 0.2]),
    movel: construir,
    sombra: { esquerda: -5, direita: 5, topo: 5, base: -4 },
  });
  const { tela } = estudio;

  // Girar com o dedo: só o gesto horizontal; o vertical continua rolando a página.
  let arrastando = false;
  let ultimoX = 0;
  const aoApertar = (ev: PointerEvent) => { arrastando = true; ultimoX = ev.clientX; tela.setPointerCapture?.(ev.pointerId); tela.style.cursor = 'grabbing'; };
  const aoMover = (ev: PointerEvent) => {
    if (!arrastando || !grupo) return;
    giro += (ev.clientX - ultimoX) * 0.012;
    ultimoX = ev.clientX;
    grupo.rotation.y = giro;
    estudio.redesenhar();
  };
  const soltar = () => { arrastando = false; tela.style.cursor = ''; };
  tela.addEventListener('pointerdown', aoApertar);
  tela.addEventListener('pointermove', aoMover);
  tela.addEventListener('pointerup', soltar);
  tela.addEventListener('pointercancel', soltar);

  return {
    definirMolecula(id) {
      if (id === molecula.id) return;
      molecula = MOLECULAS[id];
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
