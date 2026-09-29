import * as THREE from 'three';
import { ANO_ATUAL, PERIODOS, fracao, type Periodo } from '../../../lib/periodosDoBrasil';
import { criarEstudio, folhaDaMesa, malha, std, texturaMilimetrada, traco, type OpcoesDeCor, type PaletaDeEstudio } from './estudio3d';

/**
 * Laboratório de História: a faixa dos cinco séculos, em proporção, e à
 * frente o período escolhido ampliado, com um alfinete por marco.
 *
 * As linhas que ligam o bloco escolhido à faixa da frente são a ampliação
 * posta à vista: sem elas, a faixa da frente parecia outra linha do tempo, e
 * não o mesmo trecho visto de perto.
 */

export type IdRotulo = 'inicio' | 'fim' | 'm0' | 'm1' | 'm2';

export interface CenaLinhaDoTempo {
  definir(periodo: Periodo): void;
  configurar(cores: OpcoesDeCor): void;
  destruir(): void;
}

const ATRAS = 7.2;
const FRENTE = 6.2;
const Z_ATRAS = -1.3;
const Z_FRENTE = 1.1;

export function montarLinhaDoTempo(
  palco: HTMLElement,
  rotulos: Partial<Record<IdRotulo, HTMLElement | null>>,
  coresIniciais: OpcoesDeCor,
  inicial: Periodo,
): CenaLinhaDoTempo {
  let periodo = inicial;
  const xAtras = (ano: number) => -ATRAS / 2 + ((ano - PERIODOS[0].inicio) / (ANO_ATUAL - PERIODOS[0].inicio)) * ATRAS;
  const xFrente = (ano: number) => -FRENTE / 2 + ((ano - periodo.inicio) / (periodo.fim - periodo.inicio)) * FRENTE;
  const alturaPino = (i: number) => (i % 2 === 0 ? 0.95 : 0.6);

  function construir(c: PaletaDeEstudio) {
    const g = new THREE.Group();
    const papel = new THREE.Color(c.e ? '#3a2c20' : '#fbf4e4');
    const acento = new THREE.Color(c.acento);
    // Faixa de trás: um bloco por período, alternando o tom do papel.
    for (const [i, p] of PERIODOS.entries()) {
      const escolhido = p.id === periodo.id;
      const l = fracao(p) * ATRAS;
      const alt = escolhido ? 0.42 : 0.16;
      const cor = escolhido ? papel.clone().lerp(acento, c.e ? 0.55 : 0.8) : papel.clone().lerp(new THREE.Color(c.tinta), i % 2 ? 0.1 : 0.2);
      g.add(malha(new THREE.BoxGeometry(Math.max(l - 0.02, 0.02), alt, 0.55), std(`#${cor.getHexString()}`, 0, 0.8), [xAtras(p.inicio) + l / 2, alt / 2, Z_ATRAS]));
    }
    // Faixa da frente: o período ampliado, como uma régua.
    const regua = papel.clone().lerp(acento, c.e ? 0.3 : 0.45);
    g.add(malha(new THREE.BoxGeometry(FRENTE, 0.12, 0.7), std(`#${regua.getHexString()}`, 0, 0.75), [0, 0.06, Z_FRENTE]));
    // Marcas de década na régua.
    const passo = periodo.fim - periodo.inicio > 120 ? 50 : 10;
    for (let ano = Math.ceil(periodo.inicio / passo) * passo; ano < periodo.fim; ano += passo) {
      const x = xFrente(ano);
      g.add(traco([new THREE.Vector3(x, 0.125, Z_FRENTE + 0.35), new THREE.Vector3(x, 0.125, Z_FRENTE + 0.12)], c.tinta, 0.7));
    }
    // Alfinetes dos marcos, de alturas alternadas para os anos não colidirem.
    const tinta = std(c.escuroMetal, 0.4, 0.4);
    const cabeca = std(c.acento, 0.1, 0.35);
    for (const [i, m] of periodo.marcos.entries()) {
      const h = alturaPino(i), x = xFrente(m.ano);
      g.add(malha(new THREE.CylinderGeometry(0.018, 0.018, h, 10), tinta, [x, 0.12 + h / 2, Z_FRENTE]));
      g.add(malha(new THREE.SphereGeometry(0.07, 18, 14), cabeca, [x, 0.12 + h, Z_FRENTE]));
    }
    // Ampliação: das pontas do bloco escolhido às pontas da régua.
    const a0 = new THREE.Vector3(xAtras(periodo.inicio), 0.42, Z_ATRAS + 0.28);
    const a1 = new THREE.Vector3(xAtras(periodo.fim), 0.42, Z_ATRAS + 0.28);
    g.add(traco([a0, new THREE.Vector3(-FRENTE / 2, 0.12, Z_FRENTE - 0.35)], c.acento, 0.55));
    g.add(traco([a1, new THREE.Vector3(FRENTE / 2, 0.12, Z_FRENTE - 0.35)], c.acento, 0.55));
    return g;
  }

  const foco3d = new THREE.Vector3(0, 0.4, 0);
  const estudio = criarEstudio<IdRotulo>(palco, rotulos, coresIniciais, {
    enquadrar(camera, w, h) {
      const meia = THREE.MathUtils.degToRad(camera.fov / 2);
      // A faixa de trás (7,2) precisa caber inteira na largura, com os anos das pontas.
      const d = THREE.MathUtils.clamp(Math.max(4.2 / (Math.tan(meia) * (w / h)), 1.9 / Math.tan(meia)), 5, 18);
      // Mais do alto: de lado, a faixa de trás ficava colada na da frente.
      camera.position.set(foco3d.x, foco3d.y + d * 0.8, d);
      camera.lookAt(foco3d);
    },
    rotulos: {
      m0: () => new THREE.Vector3(xFrente(periodo.marcos[0]?.ano ?? periodo.inicio), 0.12 + alturaPino(0) + 0.2, Z_FRENTE),
      m1: () => new THREE.Vector3(xFrente(periodo.marcos[1]?.ano ?? periodo.inicio), 0.12 + alturaPino(1) + 0.2, Z_FRENTE),
      m2: () => new THREE.Vector3(xFrente(periodo.marcos[2]?.ano ?? periodo.inicio), 0.12 + alturaPino(2) + 0.2, Z_FRENTE),
      inicio: () => new THREE.Vector3(-FRENTE / 2 + 0.2, 0.1, Z_FRENTE + 0.75),
      fim: () => new THREE.Vector3(FRENTE / 2 - 0.2, 0.1, Z_FRENTE + 0.75),
    },
    fixo: (c) => folhaDaMesa(texturaMilimetrada(c, [16, 8]), 11, 6, [0, 0, 0]),
    movel: construir,
    sombra: { esquerda: -5, direita: 5, topo: 4, base: -4 },
  });

  return {
    definir(novo) {
      if (novo.id === periodo.id) return;
      periodo = novo;
      estudio.remontar();
    },
    configurar: (cores) => estudio.configurar(cores),
    destruir: () => estudio.destruir(),
  };
}
