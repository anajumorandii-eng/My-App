import * as THREE from 'three';
import { SIGLA, predicado, type Frase } from '../../../lib/analiseSintatica';
import { criarEstudio, faceDeTexto, folhaDaMesa, malha, std, texturaMilimetrada, traco, type Estudio, type OpcoesDeCor, type PaletaDeEstudio } from './estudio3d';

/**
 * Laboratório de Português: a frase em blocos, um por termo, com a função
 * embaixo e a chave do predicado por cima.
 *
 * O verbo sai na cor da matéria porque é dele que a análise parte: é a
 * transitividade que diz quantos complementos a oração pede. No celular a
 * frase quebra em duas fileiras — em uma só, a letra nos blocos ficava menor
 * que a do rótulo.
 */

export type IdRotulo = 't0' | 't1' | 't2' | 't3' | 'predicado';

export interface CenaFrase {
  definir(frase: Frase): void;
  configurar(cores: OpcoesDeCor): void;
  destruir(): void;
}

const ALT = 0.62;
const PROF = 0.5;
const VAO = 0.22;
const largura = (texto: string) => Math.max(1.0, 0.2 * texto.length + 0.35);

interface Posto { x: number; z: number; l: number }

export function montarFrase(
  palco: HTMLElement,
  rotulos: Partial<Record<IdRotulo, HTMLElement | null>>,
  coresIniciais: OpcoesDeCor,
  inicial: Frase,
): CenaFrase {
  let frase = inicial;
  let estreito = false;

  /** Posição de cada termo; no estreito, a segunda fileira começa depois do verbo. */
  function dispor(): Posto[] {
    const ls = frase.termos.map((t) => largura(t.texto));
    const iVerbo = frase.termos.findIndex((t) => t.funcao === 'verbo');
    const quebra = estreito && frase.termos.length > 2 ? iVerbo + 1 : frase.termos.length;
    const fileiras = [ls.slice(0, quebra), ls.slice(quebra)].filter((f) => f.length);
    const postos: Posto[] = [];
    fileiras.forEach((fila, k) => {
      const total = fila.reduce((s, l) => s + l, 0) + VAO * (fila.length - 1);
      let x = -total / 2;
      const z = fileiras.length === 1 ? 0 : k === 0 ? -1.0 : 1.05;
      for (const l of fila) { postos.push({ x: x + l / 2, z, l }); x += l + VAO; }
    });
    return postos;
  }

  function construir(c: PaletaDeEstudio) {
    const g = new THREE.Group();
    const papel = new THREE.Color(c.e ? '#3a2c20' : '#fbf4e4');
    const acento = new THREE.Color(c.acento);
    const postos = dispor();
    frase.termos.forEach((t, i) => {
      const { x, z, l } = postos[i];
      const verbo = t.funcao === 'verbo';
      const tom = verbo ? papel.clone().lerp(acento, c.e ? 0.55 : 0.8) : papel.clone().lerp(acento, t.funcao === 'sujeito' ? 0.08 : 0.25);
      g.add(malha(new THREE.BoxGeometry(l, ALT, PROF), std(`#${tom.getHexString()}`, 0, 0.8), [x, ALT / 2, z]));
      const tinta = verbo && !c.e ? '#fbf4e4' : c.e && verbo ? '#1a120b' : c.tinta;
      const face = faceDeTexto(t.texto, l * 0.96, ALT * 0.9, { cor: tinta });
      face.position.set(x, ALT / 2, z + PROF / 2 + 0.003);
      g.add(face);
    });
    // Chave do predicado: do verbo ao último termo, na mesma fileira ou não.
    const iVerbo = frase.termos.findIndex((t) => t.funcao === 'verbo');
    const pv = postos[iVerbo];
    const ultimo = postos[postos.length - 1];
    const y = ALT + 0.22;
    if (Math.abs(ultimo.z - pv.z) < 0.01) {
      const x0 = pv.x - pv.l / 2, x1 = ultimo.x + ultimo.l / 2;
      g.add(traco([new THREE.Vector3(x0, y - 0.1, pv.z), new THREE.Vector3(x0, y, pv.z), new THREE.Vector3(x1, y, pv.z), new THREE.Vector3(x1, y - 0.1, pv.z)], c.acento, 0.9));
    } else {
      // Duas fileiras: a chave cobre o verbo e desce até a fileira da frente.
      const x0 = pv.x - pv.l / 2, x1 = pv.x + pv.l / 2;
      g.add(traco([new THREE.Vector3(x0, y - 0.1, pv.z), new THREE.Vector3(x0, y, pv.z), new THREE.Vector3(x1, y, pv.z), new THREE.Vector3(x1 + 0.1, y, pv.z), new THREE.Vector3(x1 + 0.1, 0.02, ultimo.z - PROF / 2 - 0.15)], c.acento, 0.9));
    }
    return g;
  }

  const posRotulo = (i: number) => () => {
    const p = dispor()[i];
    return p ? new THREE.Vector3(p.x, 0.02, p.z + PROF / 2 + 0.38) : new THREE.Vector3(0, -99, 0);
  };
  const foco3d = new THREE.Vector3(0, 0.35, 0.1);
  // A disposição depende da largura do palco, que só o enquadramento conhece:
  // quando ela cruza o limite, o próprio enquadramento pede a remontagem.
  let estudio: Estudio | null = null;
  estudio = criarEstudio<IdRotulo>(palco, rotulos, coresIniciais, {
    enquadrar(camera, w, h) {
      const agora = w < 560;
      if (agora !== estreito) { estreito = agora; estudio?.remontar(); }
      const larguraTotal = estreito ? 5.4 : 8.4;
      const meia = THREE.MathUtils.degToRad(camera.fov / 2);
      const d = THREE.MathUtils.clamp(Math.max(larguraTotal / 2 / (Math.tan(meia) * (w / h)), 1.6 / Math.tan(meia)), 4, 18);
      camera.position.set(foco3d.x, foco3d.y + d * (estreito ? 0.7 : 0.42), foco3d.z + d);
      camera.lookAt(foco3d);
    },
    rotulos: {
      predicado: () => {
        const ps = dispor(), iv = frase.termos.findIndex((t) => t.funcao === 'verbo'), pv = ps[iv], u = ps[ps.length - 1];
        const x = Math.abs(u.z - pv.z) < 0.01 ? (pv.x - pv.l / 2 + u.x + u.l / 2) / 2 : pv.x;
        return new THREE.Vector3(x, ALT + 0.62, pv.z);
      },
      t0: posRotulo(0), t1: posRotulo(1), t2: posRotulo(2), t3: posRotulo(3),
    },
    fixo: (c) => folhaDaMesa(texturaMilimetrada(c, [16, 10]), 11, 7, [0, 0, 0.2]),
    movel: construir,
    sombra: { esquerda: -5.5, direita: 5.5, topo: 4, base: -4 },
  });

  return {
    definir(nova) {
      if (nova.id === frase.id) return;
      frase = nova;
      estudio?.remontar();
    },
    configurar: (cores) => estudio?.configurar(cores),
    destruir: () => estudio?.destruir(),
  };
}

export const rotuloDoTermo = (f: Frase, i: number) => (f.termos[i] ? SIGLA[f.termos[i].funcao] : '');
export const rotuloDoPredicado = predicado;
