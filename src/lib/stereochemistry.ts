import type { SpatialPoint } from './spatialSolid';

export type StereoCase = 'cis' | 'trans' | 'original' | 'mirror';
export interface StereoModel {
  atoms: { point: SpatialPoint; label: string; kind: 'central' | 'ligand'; radius: number }[];
  bonds: { from: SpatialPoint; to: SpatialPoint; count: number }[];
  description: string;
}

/** Coordenadas dos exemplos, antes da rotação da câmera. Grupos CH₃ são abreviados. */
export function stereochemistryModel(kind: StereoCase): StereoModel {
  if (kind === 'original' || kind === 'mirror') {
    const sign = kind === 'mirror' ? -1 : 1;
    const points: SpatialPoint[] = [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]];
    const center: SpatialPoint = [0, 0, 0];
    const ligands = points.map(([x, y, z], i) => ({
      point: [x * 46 * sign, y * 46, z * 46] as SpatialPoint,
      label: ['H', 'F', 'Cl', 'Br'][i], kind: 'ligand' as const, radius: 18,
    }));
    return {
      atoms: [{ point: center, label: 'C', kind: 'central', radius: 22 }, ...ligands],
      bonds: ligands.map(atom => ({ from: center, to: atom.point, count: 1 })),
      description: `Carbono tetraédrico ligado a H, F, Cl e Br: ${kind === 'mirror' ? 'imagem especular' : 'modelo original'}. Quatro substituintes diferentes; a rotação da vista conserva a configuração.`,
    };
  }
  const left: SpatialPoint = [-32, 0, 0], right: SpatialPoint = [32, 0, 0];
  const height = 48;
  const atoms: StereoModel['atoms'] = [
    { point: left, label: 'C', kind: 'central', radius: 17 },
    { point: right, label: 'C', kind: 'central', radius: 17 },
    { point: [-60, height, 0], label: 'CH₃', kind: 'ligand', radius: 21 },
    { point: [-60, -height, 0], label: 'H', kind: 'ligand', radius: 14 },
    { point: [60, kind === 'cis' ? height : -height, 0], label: 'CH₃', kind: 'ligand', radius: 21 },
    { point: [60, kind === 'cis' ? -height : height, 0], label: 'H', kind: 'ligand', radius: 14 },
  ];
  return {
    atoms,
    bonds: [{ from: left, to: right, count: 2 }, ...[2, 3, 4, 5].map(i => ({ from: i < 4 ? left : right, to: atoms[i].point, count: 1 }))],
    description: `${kind}-but-2-eno: grupos CH₃ ${kind === 'cis' ? 'do mesmo lado' : 'em lados opostos'} da ligação dupla. O entorno da dupla é plano; girar a câmera não converte cis em trans.`,
  };
}
