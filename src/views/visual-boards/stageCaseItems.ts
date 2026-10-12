import type { StageCaseItem } from '../visual-stage/stageCases';

/**
 * Casos que cada prancha migrada alterna, num módulo sem React.
 *
 * A mesma lista serve à cena (que abre o caso da etapa) e à barra do palco
 * (que nomeia o ponto de investigação de cada etapa, em `declarations.ts`).
 * Se cada uma tivesse sua cópia, a barra podia anunciar "Osmose" enquanto a
 * cena abria a bomba — mesma família de defeito do texto do nó 0 no cartão
 * que o `boardPair` coloria como nó 1.
 *
 * O rótulo é o que casa com o texto do capítulo (`planStageFocus`): "Lei de
 * Hess" e "Osmose" são títulos ou termos das próprias seções. `claim` é a
 * afirmação que a cena mostra; em Reconstruir ela é coberta quando entregaria
 * a relação oculta.
 */
export const THERMO_CASES: StageCaseItem[] = [
  { label: 'Exotérmica', claim: 'Hprodutos < Hreagentes: ΔH negativo. O calor é liberado para a vizinhança.' },
  { label: 'Endotérmica', claim: 'Hprodutos > Hreagentes: ΔH positivo. O calor é absorvido pelo sistema.' },
  { label: 'Lei de Hess', claim: 'A → B: −40 kJ. B → C: −60 kJ. Soma: −100 kJ — o mesmo ΔH do caminho direto A → C.' },
];

export const GIBBS_CASES: StageCaseItem[] = [
  { label: 'Entalpia', claim: 'Em T = 0 K o termo TΔS some e ΔG = ΔH. Nesta reta ΔH > 0, desfavorável; um ΔH negativo favoreceria, mas não decide sozinho.' },
  { label: 'Entropia', claim: 'Com ΔS > 0, cada kelvin a mais desconta ΔS de ΔG: a reta desce, e a inclinação é −ΔS.' },
  { label: 'Energia livre de Gibbs', claim: 'ΔG = 0 marca o equilíbrio. Acima dessa temperatura, ΔG < 0: espontânea.' },
];

export const MEMBRANE_CASES: StageCaseItem[] = [
  { label: 'Difusão facilitada', claim: 'Soluto neutro: o fluxo líquido segue da maior para a menor concentração, por uma proteína, sem consumo direto de ATP.' },
  { label: 'Bomba de sódio e potássio', claim: 'Um ATP é hidrolisado por ciclo. Saem três Na⁺ e entram dois K⁺: saldo de uma carga positiva para fora.' },
  { label: 'Osmose', claim: 'Quem atravessa é a água: do meio hipotônico para o hipertônico, com solutos que não atravessam a membrana.' },
];

export const PHOTO_CASES: StageCaseItem[] = [
  { label: 'Reações fotoquímicas', claim: 'Nas membranas dos tilacoides, as reações fotoquímicas produzem ATP e NADPH. A água fornece elétrons; o oxigênio liberado vem da água.' },
  { label: 'Fixação de carbono', claim: 'No estroma, o ciclo de Calvin usa ATP e NADPH para incorporar CO₂ em moléculas orgânicas.' },
  { label: 'Quimiossíntese', claim: 'Certos procariontes oxidam substâncias inorgânicas e usam essa energia para fixar CO₂, sem luz e sem cloroplasto.' },
];

export const ATOM_CASES: StageCaseItem[] = [
  { label: 'Rutherford', claim: 'Os grandes desvios de algumas partículas alfa sustentam um núcleo pequeno, denso e positivo.' },
  { label: 'Bohr', claim: 'O elétron só ocupa níveis permitidos; a diferença de energia entre eles sai ou entra como um fóton, hν = |ΔE|.' },
];

export const MENDEL_CASES: StageCaseItem[] = [
  { label: 'Primeira lei', claim: 'Aa × Aa: os dois alelos vão para gametas diferentes, e as quatro casas dão 3 dominantes : 1 recessivo.' },
  { label: 'Segunda lei', claim: 'AaBb × AaBb: dois pares se separam independentemente, e as dezesseis casas dão 9 : 3 : 3 : 1.' },
];

export const INTERACTION_CASES: StageCaseItem[] = [
  { label: 'Segunda lei', claim: 'As dezesseis casas de AaBb × AaBb seguem a segregação independente: 9 A_B_ : 3 A_bb : 3 aaB_ : 1 aabb.' },
  { label: 'Epistasia', claim: 'Genes complementares: só A_B_ completa as duas etapas da via e forma pigmento. As mesmas casas viram 9 : 7.' },
];

/** Prancha do registro → casos que a barra do palco anuncia por etapa. */
export function boardStageCases(boardId: string, summaryId: string): StageCaseItem[] | null {
  switch (boardId) {
    case 'termoquimica': return summaryId === 'summary-quimica-termoquimica-ii' ? GIBBS_CASES : THERMO_CASES;
    case 'membrana': return MEMBRANE_CASES;
    case 'bioenergetica': return PHOTO_CASES;
    case 'modelos-atomicos': return ATOM_CASES;
    case 'mendel': return summaryId === 'summary-biologia-segunda-lei-de-mendel-e-interacao-genica' ? INTERACTION_CASES : MENDEL_CASES;
    default: return null;
  }
}
