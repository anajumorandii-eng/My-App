import type { WorkDossier } from '../types/literaryWorks';

// Carregado sob demanda: cada dossiê pesa dezenas de kB e só a página da
// obra precisa dele. Lista explícita, e não glob, para que o node:test
// consiga importar este módulo sem o Vite.
const LOADERS: Record<string, () => Promise<{ default: unknown }>> = {
  'no-seu-pescoco': () => import('../data/obras/dossies/no-seu-pescoco.json'),
  'funerais-da-mamae-grande': () => import('../data/obras/dossies/funerais-da-mamae-grande.json'),
  'caminho-de-pedras': () => import('../data/obras/dossies/caminho-de-pedras.json'),
  'paixao-segundo-gh': () => import('../data/obras/dossies/paixao-segundo-gh.json'),
  geografia: () => import('../data/obras/dossies/geografia.json'),
  'balada-de-amor-ao-vento': () => import('../data/obras/dossies/balada-de-amor-ao-vento.json'),
  'cancao-para-ninar-menino-grande': () => import('../data/obras/dossies/cancao-para-ninar-menino-grande.json'),
  'visao-das-plantas': () => import('../data/obras/dossies/visao-das-plantas.json'),
  'memorias-de-martha': () => import('../data/obras/dossies/memorias-de-martha.json'),
  nebulosas: () => import('../data/obras/dossies/nebulosas.json'),
  'opusculo-humanitario': () => import('../data/obras/dossies/opusculo-humanitario.json'),
  'morangos-mofados': () => import('../data/obras/dossies/morangos-mofados.json'),
  'olhos-dagua': () => import('../data/obras/dossies/olhos-dagua.json'),
  'a-vida-nao-e-util': () => import('../data/obras/dossies/a-vida-nao-e-util.json'),
  'prosas-seguidas-de-odes-minimas': () => import('../data/obras/dossies/prosas-seguidas-de-odes-minimas.json'),
  'cancoes-escolhidas-14-letras': () => import('../data/obras/dossies/cancoes-escolhidas-14-letras.json'),
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
