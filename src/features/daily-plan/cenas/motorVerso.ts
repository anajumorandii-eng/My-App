import * as THREE from 'three';
import type { Verso } from '../../../lib/escansao';
import { criarEstudio, faceDeTexto, folhaDaMesa, malha, std, texturaMilimetrada, type Estudio, type OpcoesDeCor, type PaletaDeEstudio } from './estudio3d';

/**
 * Laboratório de Literatura: o verso em tipos móveis, um tipo por sílaba
 * poética, com a posição gravada embaixo.
 *
 * As tônicas que definem o metro sobem e ganham a cor da matéria; o que vem
 * depois da última tônica fica num tipo apagado, fora da contagem, que é a
 * regra que mais derruba na prova. No celular o decassílabo quebra depois da
 * 6ª sílaba, onde o heroico tem a cesura: numa fileira só, dez tipos ficavam
 * com a letra ilegível.
 */

export type IdRotulo = 'ultima' | 'sobra';

export interface CenaVerso {
  definir(verso: Verso): void;
  configurar(cores: OpcoesDeCor): void;
  destruir(): void;
}

const BAIXO = 0.6;
const ALTO = 0.95;
const PROF = 0.5;
const VAO = 0.08;
const largura = (s: string) => 0.5 + 0.15 * s.length;

interface Tipo { texto: string; x: number; z: number; l: number; tonica: boolean; sobra: boolean; pos: number }

export function montarVerso(
  palco: HTMLElement,
  rotulos: Partial<Record<IdRotulo, HTMLElement | null>>,
  coresIniciais: OpcoesDeCor,
  inicial: Verso,
): CenaVerso {
  let verso = inicial;
  let estreito = false;

  function tipos(): Tipo[] {
    const todos = verso.silabas.map((s, i) => ({ texto: s, tonica: verso.tonicas.includes(i + 1), sobra: false, pos: i + 1 }));
    if (verso.sobra) todos.push({ texto: verso.sobra, tonica: false, sobra: true, pos: 0 });
    const quebra = estreito && verso.silabas.length > 7 ? 6 : todos.length;
    const fileiras = [todos.slice(0, quebra), todos.slice(quebra)].filter((f) => f.length);
    const out: Tipo[] = [];
    fileiras.forEach((fila, k) => {
      const ls = fila.map((t) => largura(t.texto));
      const total = ls.reduce((s, l) => s + l, 0) + VAO * (fila.length - 1);
      let x = -total / 2;
      // Fileiras bem separadas e câmera alta: com 0,6 de vão, o tipo alto da
      // frente ("ver") cobria a tônica de trás ("que‿ar").
      const z = fileiras.length === 1 ? 0 : k === 0 ? -1.0 : 0.9;
      fila.forEach((t, i) => { out.push({ ...t, x: x + ls[i] / 2, z, l: ls[i] }); x += ls[i] + VAO; });
    });
    return out;
  }

  function construir(c: PaletaDeEstudio) {
    const g = new THREE.Group();
    const papel = new THREE.Color(c.e ? '#3a2c20' : '#f4e8cf');
    const acento = new THREE.Color(c.acento);
    for (const t of tipos()) {
      const alt = t.tonica ? ALTO : BAIXO;
      const tom = t.tonica ? papel.clone().lerp(acento, c.e ? 0.55 : 0.8) : papel.clone();
      const mat = t.sobra
        ? std(`#${papel.getHexString()}`, 0, 0.9, { transparent: true, opacity: 0.4, depthWrite: false })
        : std(`#${tom.getHexString()}`, 0.05, 0.7);
      g.add(malha(new THREE.BoxGeometry(t.l, alt, PROF), mat, [t.x, alt / 2, t.z]));
      const tinta = t.tonica ? (c.e ? '#1a120b' : '#fbf4e4') : c.tinta;
      const face = faceDeTexto(t.texto, t.l * 0.96, alt * 0.94, { cor: tinta, legenda: t.sobra ? undefined : `${t.pos}` });
      face.position.set(t.x, alt / 2, t.z + PROF / 2 + 0.003);
      if (t.sobra) (face.material as THREE.MeshBasicMaterial).opacity = 0.55;
      g.add(face);
    }
    return g;
  }

  const foco3d = new THREE.Vector3(0, 0.35, 0.05);
  let estudio: Estudio | null = null;
  estudio = criarEstudio<IdRotulo>(palco, rotulos, coresIniciais, {
    enquadrar(camera, w, h) {
      const agora = w < 560;
      if (agora !== estreito) { estreito = agora; estudio?.remontar(); }
      const ts = tipos();
      const larguraTotal = Math.max(...ts.map((t) => Math.abs(t.x) + t.l / 2)) * 2 + 0.6;
      const meia = THREE.MathUtils.degToRad(camera.fov / 2);
      const d = THREE.MathUtils.clamp(Math.max(larguraTotal / 2 / (Math.tan(meia) * (w / h)), 1.5 / Math.tan(meia)), 3.5, 16);
      camera.position.set(foco3d.x, foco3d.y + d * (estreito ? 0.75 : 0.36), foco3d.z + d);
      camera.lookAt(foco3d);
    },
    rotulos: {
      ultima: () => { const t = tipos().find((x) => x.pos === verso.silabas.length)!; // Na frente do tipo, na mesa: em cima, no celular, o rótulo caía sobre a
      // fileira de trás.
      return new THREE.Vector3(t.x, 0.02, t.z + PROF / 2 + 0.42); },
      sobra: () => { const t = tipos().find((x) => x.sobra); return t ? new THREE.Vector3(t.x, 0.02, t.z + PROF / 2 + 0.42) : new THREE.Vector3(0, -99, 0); },
    },
    fixo: (c) => folhaDaMesa(texturaMilimetrada(c, [16, 10]), 11, 7, [0, 0, 0.2]),
    movel: construir,
    sombra: { esquerda: -5, direita: 5, topo: 4, base: -4 },
  });

  return {
    definir(novo) {
      if (novo.id === verso.id) return;
      verso = novo;
      estudio?.remontar();
    },
    configurar: (cores) => estudio?.configurar(cores),
    destruir: () => estudio?.destruir(),
  };
}
