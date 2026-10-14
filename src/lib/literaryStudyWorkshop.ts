import type { WorkDossier } from '../types/literaryWorks';
export interface LiteraryStudyNote { analysis: string; retrieval: string; revision: string; checked: string[]; comparison: string }
export const emptyLiteraryStudyNote = (): LiteraryStudyNote => ({ analysis: '', retrieval: '', revision: '', checked: [], comparison: '' });
export function publishedLiteraryPassages(dossier: WorkDossier, unitId?: string) {
  const units = new Set(dossier.units.filter(unit => unit.guide.editorialStatus === 'published').map(unit => unit.id));
  return dossier.evidence.filter(card => card.editorialStatus === 'published' && units.has(card.unitId) && (!unitId || card.unitId === unitId));
}
export function readLiteraryNotebook(key: string): Record<string, LiteraryStudyNote> {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? '{}');
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    const validEntries: [string, LiteraryStudyNote][] = [];
    for (const [id, note] of Object.entries(value)) {
      const entry = note as LiteraryStudyNote;
      if (entry && ['analysis', 'retrieval', 'revision', 'comparison'].every(field => typeof (entry as unknown as Record<string, unknown>)[field] === 'string') && Array.isArray(entry.checked) && entry.checked.every(item => typeof item === 'string')) validEntries.push([id, entry]);
    }
    return Object.fromEntries(validEntries);
  } catch { return {}; }
}
