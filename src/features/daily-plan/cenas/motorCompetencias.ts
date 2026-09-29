import * as THREE from 'three';
import { COMPETENCIAS, MAXIMO, NIVEL, folhas, type IdCompetencia } from '../../../lib/competenciasEnem';
import { criarEstudio, folhaDaMesa, malha, std, texturaMilimetrada, traco, type OpcoesDeCor, type PaletaDeEstudio } from './estudio3d';

/**
 * Laboratório de Redação: as cinco competências como pilhas de folhas, uma
 * folha por nível de 40 pontos.
 *
 * O contorno tracejado de cada pilha marca os 200 do teto: sem ele, uma pilha
 * de três folhas não dizia se estava perto ou longe do máximo. As folhas saem
 * levemente tortas, sempre do mesmo jeito (o giro vem da posição, não de
 * sorteio), para a pilha não mudar de forma a cada remontagem.
 */

export type IdRotulo = `n${IdCompetencia}` | `r${IdCompetencia}`;

export interface CenaCompetencias {
  definir(notas: Record<IdCompetencia, number>, foco: IdCompetencia): void;
  configurar(cores: OpcoesDeCor): void;
  destruir(): void;
}

const ESP = 1.45;
// Folha grossa de propósito: com a espessura real, cinco níveis davam uma
// pilha baixa demais para ler a diferença entre 120 e 160.
const FOLHA = { l: 0.95, e: 0.26, p: 0.7 };
const xDe = (i: number) => (i - 2) * ESP;

export function montarCompetencias(
  palco: HTMLElement,
  rotulos: Partial<Record<IdRotulo, HTMLElement | null>>,
  coresIniciais: OpcoesDeCor,
  notasIniciais: Record<IdCompetencia, number>,
  focoInicial: IdCompetencia,
): CenaCompetencias {
  let notas = notasIniciais;
  let foco = focoInicial;

  function construir(c: PaletaDeEstudio) {
    const g = new THREE.Group();
    const papel = new THREE.Color(c.e ? '#e9d2a6' : '#fbf4e4');
    const acento = new THREE.Color(c.acento);
    COMPETENCIAS.forEach((comp, i) => {
      const x = xDe(i);
      const emFoco = comp.id === foco;
      const tom = emFoco ? papel.clone().lerp(acento, c.e ? 0.6 : 0.7) : papel.clone().lerp(new THREE.Color(c.tinta), c.e ? 0.35 : 0.06);
      const mat = std(`#${tom.getHexString()}`, 0, 0.85);
      for (let k = 0; k < folhas(notas[comp.id]); k += 1) {
        const giro = Math.sin(i * 7.1 + k * 2.3) * 0.09;
        g.add(malha(new THREE.BoxGeometry(FOLHA.l, FOLHA.e * 0.82, FOLHA.p), mat, [x + Math.sin(k * 1.7 + i) * 0.025, FOLHA.e * (k + 0.41), 0], [0, giro, 0]));
      }
      // Teto de 200: contorno da pilha cheia.
      const topo = (MAXIMO / NIVEL) * FOLHA.e, l = FOLHA.l / 2 + 0.05, p = FOLHA.p / 2 + 0.05;
      const cantos = [[-l, -p], [l, -p], [l, p], [-l, p], [-l, -p]] as const;
      const opac = emFoco ? 0.75 : 0.3;
      const cor = emFoco ? c.acento : c.tinta;
      g.add(traco(cantos.map(([a, b]) => new THREE.Vector3(x + a, topo, b)), cor, opac));
      for (const [a, b] of cantos.slice(0, 4)) g.add(traco([new THREE.Vector3(x + a, 0.005, b), new THREE.Vector3(x + a, topo, b)], cor, opac * 0.6));
    });
    return g;
  }

  const foco3d = new THREE.Vector3(0, 0.75, 0);
  const estudio = criarEstudio<IdRotulo>(palco, rotulos, coresIniciais, {
    enquadrar(camera, w, h) {
      const meia = THREE.MathUtils.degToRad(camera.fov / 2);
      const d = THREE.MathUtils.clamp(Math.max(3.9 / (Math.tan(meia) * (w / h)), 1.35 / Math.tan(meia)), 4, 18);
      camera.position.set(foco3d.x, foco3d.y + d * 0.42, d);
      camera.lookAt(foco3d);
    },
    rotulos: Object.fromEntries(COMPETENCIAS.flatMap((comp, i) => [
      [`n${comp.id}`, () => new THREE.Vector3(xDe(i), (MAXIMO / NIVEL) * FOLHA.e + 0.28, 0)],
      [`r${comp.id}`, () => new THREE.Vector3(xDe(i), 0.02, FOLHA.p / 2 + 0.8)],
    ])) as Record<IdRotulo, () => THREE.Vector3>,
    fixo: (c) => folhaDaMesa(texturaMilimetrada(c, [16, 10]), 11, 7, [0, 0, 0]),
    movel: construir,
    sombra: { esquerda: -5, direita: 5, topo: 4, base: -4 },
  });

  return {
    definir(novas, novoFoco) {
      if (novoFoco === foco && COMPETENCIAS.every((c) => novas[c.id] === notas[c.id])) return;
      notas = novas; foco = novoFoco;
      estudio.remontar();
    },
    configurar: (cores) => estudio.configurar(cores),
    destruir: () => estudio.destruir(),
  };
}
