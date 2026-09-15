import type { InteractiveSummary } from '../../types/summary';
import type { LastroIssue, SceneEntry } from './types';

/** Caixa e espaço em branco são normalizados. Acento, nunca: trocar "Platão"
 *  por "Platao" é uma citação que não está no texto. */
const normalizar = (texto: string) => texto.replace(/\s+/g, ' ').trim().toLowerCase();

export function validarLastro(
  entry: SceneEntry,
  summary: InteractiveSummary | undefined,
): LastroIssue[] {
  if (!summary) return [{ chapterId: entry.chapterId, label: '—', reason: 'capitulo-ausente' }];
  const issues: LastroIssue[] = [];
  for (const item of entry.items) {
    const section = summary.sections.find((s) => s.title === item.section);
    if (!section) {
      issues.push({ chapterId: entry.chapterId, label: item.label, reason: 'secao-ausente' });
      continue;
    }
    if (!normalizar(section.content).includes(normalizar(item.quote))) {
      issues.push({ chapterId: entry.chapterId, label: item.label, reason: 'trecho-ausente' });
    }
  }
  return issues;
}
