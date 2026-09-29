import * as THREE from 'three';
import { fatiasPorDecimo } from '../../../lib/desigualdade';
import { criarEstudio, folhaDaMesa, malha, std, texturaMilimetrada, traco, type OpcoesDeCor, type PaletaDeEstudio } from './estudio3d';

/**
 * Laboratório de Sociologia: dez colunas, uma por décimo da população, com a
 * altura da fatia da renda que cada décimo recebe.
 *
 * O traço na altura de 10% é a igualdade: com Gini zero, todas as colunas
 * param nele. As colunas vão do papel à cor da matéria conforme a renda
 * cresce, para a leitura da esquerda à direita não depender só da altura.
 */

export type IdRotulo = 'pobres' | 'ricos' | 'igualdade';

export interface CenaDecimos {
  definir(gini: number): void;
  configurar(cores: OpcoesDeCor): void;
  destruir(): void;
}

const ESP = 0.66;
const LARG = 0.5;
/** 10% da renda vira 0,7 de altura; o décimo do topo com Gini 0,7 passa de 3. */
const ESCALA = 7;
const xDe = (i: number) => (i - 4.5) * ESP;

export function montarDecimos(
  palco: HTMLElement,
  rotulos: Partial<Record<IdRotulo, HTMLElement | null>>,
  coresIniciais: OpcoesDeCor,
  giniInicial: number,
): CenaDecimos {
  let gini = giniInicial;

  function construir(c: PaletaDeEstudio) {
    const g = new THREE.Group();
    const papel = new THREE.Color(c.e ? '#e9d2a6' : '#fbf4e4');
    const acento = new THREE.Color(c.acento);
    fatiasPorDecimo(gini).forEach((f, i) => {
      const h = Math.max(f * ESCALA, 0.02);
      const tom = papel.clone().lerp(acento, (i / 9) * (c.e ? 0.7 : 0.85));
      g.add(malha(new THREE.BoxGeometry(LARG, h, LARG), std(`#${tom.getHexString()}`, 0, 0.8), [xDe(i), h / 2, 0]));
    });
    const y = 0.1 * ESCALA, x0 = xDe(0) - LARG, x1 = xDe(9) + LARG;
    for (let x = x0; x < x1; x += 0.24) g.add(traco([new THREE.Vector3(x, y, LARG / 2 + 0.02), new THREE.Vector3(Math.min(x + 0.13, x1), y, LARG / 2 + 0.02)], c.tinta, 0.85));
    return g;
  }

  const foco3d = new THREE.Vector3(0, 1.1, 0);
  const estudio = criarEstudio<IdRotulo>(palco, rotulos, coresIniciais, {
    enquadrar(camera, w, h) {
      const meia = THREE.MathUtils.degToRad(camera.fov / 2);
      const d = THREE.MathUtils.clamp(Math.max(3.9 / (Math.tan(meia) * (w / h)), 2.2 / Math.tan(meia)), 4, 18);
      camera.position.set(foco3d.x, foco3d.y + d * 0.28, d);
      camera.lookAt(foco3d);
    },
    rotulos: {
      ricos: () => new THREE.Vector3(xDe(9) - 0.2, fatiasPorDecimo(gini)[9] * ESCALA + 0.3, 0),
      pobres: () => new THREE.Vector3(xDe(0) + 0.45, 0.1 * ESCALA + 0.8, 0),
      igualdade: () => new THREE.Vector3(xDe(0) + 0.1, 0.1 * ESCALA + 0.2, LARG / 2 + 0.05),
    },
    fixo: (c) => folhaDaMesa(texturaMilimetrada(c, [16, 10]), 11, 7, [0, 0, 0]),
    movel: construir,
    sombra: { esquerda: -5, direita: 5, topo: 5, base: -4 },
  });

  return {
    definir(novo) {
      if (novo === gini) return;
      gini = novo;
      estudio.remontar();
    },
    configurar: (cores) => estudio.configurar(cores),
    destruir: () => estudio.destruir(),
  };
}
