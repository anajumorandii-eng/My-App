import React from 'react';
import type { GeographyContext } from '../../lib/geographyContextLab';
import ExceptionalHumanitiesIllustration, { type ExceptionalHumanitiesKind } from './ExceptionalHumanitiesIllustration';

const drawings: Record<string, ExceptionalHumanitiesKind> = {
  'summary-geografia-energia-eletrica-no-brasil': 'electricity',
  'summary-geografia-estrutura-etnica-e-fluxos-migratorios': 'migration',
  'summary-geografia-os-fluxos-do-comercio-externo': 'trade',
  'summary-geografia-combustiveis-fosseis-e-biocombustiveis-no-brasil': 'fuels',
};
export const GEOGRAPHY_CONTEXT_DIAGRAM_IDS: ReadonlySet<string> = new Set(Object.keys(drawings));

export function GeographyContextDiagram({ config, index }: { config: GeographyContext; index: number }) {
  return <ExceptionalHumanitiesIllustration kind={drawings[config.chapterId]} index={index} chapterId={config.chapterId} ariaLabel={`${config.title}: ${config.cases[index].label} em foco`} />;
}
