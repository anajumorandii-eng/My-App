import { workStudyGuides } from '../data/workStudyGuides';
import type { WorkDossier } from '../types/literaryWorks';
import { visibleDossier } from './workDossiers';

/** Reúne síntese, análise e evidência sem promover material em revisão. */
export function getWorkStudyGuide(dossier: WorkDossier) {
  const profile = workStudyGuides[dossier.slug];
  const published = visibleDossier(dossier, false);
  const analysis = published.modules.find(module => module.moduleType === 'analise_integral');
  const introduction = published.modules.find(module => module.moduleType === 'comece_aqui');
  if (!profile || !analysis || !introduction) return null;
  return {
    profile,
    analysis,
    introduction,
    edition: published.edition,
    units: published.units.map(unit => ({
      ...unit,
      passages: published.evidence.filter(card => card.unitId === unit.id),
    })),
  };
}
