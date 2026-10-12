import type { InteractiveSummary } from '../../types/summary';
import { buildVisualMap } from '../../lib/visualStudy';
import { planStageFocus, type FocusCandidate } from '../../lib/stageFocus';
import { GEOGRAPHY_CONTEXTS } from '../../lib/geographyContextLab';
import { HISTORY_INSTRUMENTS, type HistoryInstrumentConfig } from '../../lib/historyInstrumentLab';
import { HISTORY_PHASES } from '../../lib/historyPhaseLab';
import { CURRENT_AFFAIRS_CONTEXTS, type CurrentAffairsDossierConfig } from '../../lib/currentAffairsContextLab';
import type { StageSceneDeclaration } from './contract';

/**
 * Pontos de investigação dos laboratórios de recortes de História, Geografia e
 * Atualidades.
 *
 * Os instrumentos chegam ao registro embrulhados em `lazyBoard`, então o
 * `Componente.stage` que `declarations.ts` procura nunca é visível antes de o
 * módulo carregar. A declaração mora aqui, nos dados puros dos laboratórios, e
 * usa as mesmas listas de recortes que os componentes usam (`*Items`), para
 * que a barra do palco e o instrumento não discordem sobre o que cada etapa
 * mostra.
 */

export interface CaseItem extends FocusCandidate { claim: string }

export function contextCaseItems(config: { cases: readonly { label: string; observation: string; conclusion: string }[] }): CaseItem[] {
  return config.cases.map((item) => ({ label: item.label, claim: `${item.observation} ${item.conclusion}` }));
}

export function historyStateItems(config: HistoryInstrumentConfig): CaseItem[] {
  return config.states.map((item) => ({ label: item.label, claim: `${item.focus} ${item.relation} ${item.evidence}` }));
}

/** Um ponto por etapa, com o recorte que a etapa abre; etapa que não cita recorte fica com o título do nó. */
export function casesDeclaration(summary: InteractiveSummary, items: FocusCandidate[]): StageSceneDeclaration {
  const map = buildVisualMap(summary);
  const plan = planStageFocus(items, summary.sections);
  return {
    hotspots: map.nodes.map((node, step) => {
      const caso = plan.byStep[step]?.[0];
      return { id: `etapa-${step}`, label: caso === undefined ? node.label : items[caso].label, nodeId: node.id, step };
    }),
  };
}

/** Peças do dossiê tiradas de uma seção: o próprio dossiê registra a origem de cada uma. */
export function piecesOfSection(config: CurrentAffairsDossierConfig, sectionId: string | undefined) {
  return sectionId ? config.pieces.filter((piece) => piece.sectionId === sectionId) : [];
}

function dossierDeclaration(summary: InteractiveSummary, config: CurrentAffairsDossierConfig): StageSceneDeclaration {
  return {
    hotspots: buildVisualMap(summary).nodes.map((node, step) => ({
      id: `etapa-${step}`, label: piecesOfSection(config, node.sectionId)[0]?.label ?? node.label, nodeId: node.id, step,
    })),
  };
}

// HISTORY_INSTRUMENTS não guarda o capítulo; os dois que abrem um capítulo de
// História (os outros três ficam atrás de cenas autorais) são nomeados aqui.
const HISTORY_INSTRUMENT_CHAPTERS: Record<string, keyof typeof HISTORY_INSTRUMENTS> = {
  'summary-historia-a-interiorizacao-da-colonizacao': 'interiorization',
  'summary-historia-a-mineracao-no-brasil-colonial': 'mining-colony',
};

const BY_CHAPTER = new Map<string, (summary: InteractiveSummary) => StageSceneDeclaration>([
  ...Object.values(GEOGRAPHY_CONTEXTS).map((config) => [config.chapterId, (s: InteractiveSummary) => casesDeclaration(s, contextCaseItems(config))] as const),
  ...Object.values(HISTORY_PHASES).map((config) => [config.chapterId, (s: InteractiveSummary) => casesDeclaration(s, contextCaseItems(config))] as const),
  ...Object.entries(HISTORY_INSTRUMENT_CHAPTERS).map(([chapterId, id]) => [chapterId, (s: InteractiveSummary) => casesDeclaration(s, historyStateItems(HISTORY_INSTRUMENTS[id]))] as const),
  ...Object.values(CURRENT_AFFAIRS_CONTEXTS).map((config) => [config.chapterId, (s: InteractiveSummary) => dossierDeclaration(s, config)] as const),
]);

/** Declaração do laboratório que abre o capítulo, quando ele é um dos migrados. */
export function instrumentStageDeclaration(summary: InteractiveSummary): StageSceneDeclaration | null {
  return BY_CHAPTER.get(summary.id)?.(summary) ?? null;
}
