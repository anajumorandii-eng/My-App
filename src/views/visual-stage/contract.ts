import type { VisualMap } from '../../lib/visualStudy';

/**
 * Contrato do palco imersivo da aba Visual.
 *
 * Antes, a página de um capítulo empilhava cena, galeria, conceitos, desafio,
 * mapa e só depois o texto das cinco etapas: em Geometria Molecular eram 4.380px
 * de rolagem, e a cena e a leitura nunca estavam na tela ao mesmo tempo. O palco
 * junta tudo num lugar só; este contrato é o que uma cena recebe dele e o que ela
 * pode, opcionalmente, devolver. Cena que ignora o contrato continua funcionando:
 * o palco deriva os pontos de investigação dos nós do mapa.
 */
export type StageMode = 'explorar' | 'testar' | 'reconstruir';

/** O que o palco entrega a toda cena. Todos os campos são leitura do estado da tela. */
export interface StageSceneProps {
  /** Etapa ativa do trilho (0..4, ordem intuicao→exercicio). */
  activeStep: number;
  onStepChange: (step: number) => void;
  /** Nó do mapa selecionado; o inspetor do palco explica esse nó. */
  selectedId: string | null;
  onSelect: (nodeId: string) => void;
  mode: StageMode;
  /** Verdadeiro em Testar e Reconstruir. Em Testar a cena nem é montada. */
  challengeActive: boolean;
  /** Elemento que a cena deve destacar, quando o palco pede foco. */
  focusTarget?: string | null;
}

/** Ponto da cena que leva a um nó ou a uma etapa. Nunca cria conteúdo: aponta para o mapa. */
export interface StageHotspot {
  id: string;
  label: string;
  nodeId?: string;
  step?: number;
}

/** Camada que a cena pede para o palco hospedar como aba (ex.: modelo espacial). */
export interface StageLayer {
  id: string;
  label: string;
}

export interface StageSceneDeclaration {
  hotspots?: StageHotspot[];
  layers?: StageLayer[];
}

/**
 * Valida o que a cena declarou contra o mapa do capítulo. Ponto que aponta para
 * nó inexistente ou etapa fora do trilho é descartado em vez de virar botão que
 * não leva a lugar nenhum; sem declaração válida, um ponto por nó do mapa.
 */
export function resolveStageDeclaration(map: VisualMap, declaration?: StageSceneDeclaration | null) {
  const nodeIds = new Set(map.nodes.map((node) => node.id));
  const declared = (declaration?.hotspots ?? []).filter((spot) =>
    (spot.nodeId === undefined || nodeIds.has(spot.nodeId))
    && (spot.step === undefined || (Number.isInteger(spot.step) && spot.step >= 0 && spot.step < map.nodes.length))
    && (spot.nodeId !== undefined || spot.step !== undefined)
    && spot.label.trim().length > 0);
  const hotspots: StageHotspot[] = declared.length > 0
    ? declared
    : map.nodes.map((node, step) => ({ id: `etapa-${step}`, label: node.label, nodeId: node.id, step }));
  const seen = new Set<string>();
  const layers = (declaration?.layers ?? []).filter((layer) => {
    if (seen.has(layer.id) || !layer.label.trim()) return false;
    seen.add(layer.id);
    return true;
  });
  return { hotspots, layers };
}

/** Etapa que um ponto representa: a declarada, ou a posição do nó no mapa. */
export function hotspotStep(map: VisualMap, spot: StageHotspot): number {
  if (spot.step !== undefined) return spot.step;
  return map.nodes.findIndex((node) => node.id === spot.nodeId);
}
