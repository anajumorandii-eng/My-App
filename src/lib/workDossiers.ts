import type { WorkDossier } from '../types/literaryWorks';

// Carregado sob demanda: cada dossiê pesa dezenas de kB e só a página da
// obra precisa dele. Lista explícita, e não glob, para que o node:test
// consiga importar este módulo sem o Vite.
const LOADERS: Record<string, () => Promise<{ default: unknown }>> = {
  'memorias-de-martha': () => import('../data/obras/dossies/memorias-de-martha.json'),
  nebulosas: () => import('../data/obras/dossies/nebulosas.json'),
  'opusculo-humanitario': () => import('../data/obras/dossies/opusculo-humanitario.json'),
};

export const DOSSIER_SLUGS = Object.keys(LOADERS);

export async function loadWorkDossier(slug: string): Promise<WorkDossier | null> {
  const load = LOADERS[slug];
  return load ? ((await load()).default as WorkDossier) : null;
}

/** O que a aluna vê: só o que passou pela revisão editorial. A revisão mostra
 *  tudo, e a tela marca cada bloco ainda não publicado. */
export function visibleDossier(dossier: WorkDossier, review: boolean): WorkDossier {
  if (review) return dossier;
  return {
    ...dossier,
    units: dossier.units.filter((unit) => unit.guide.editorialStatus === 'published'),
    modules: dossier.modules.filter((module) => module.editorialStatus === 'published'),
    evidence: dossier.evidence.filter((card) => card.editorialStatus === 'published'),
  };
}
