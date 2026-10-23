import geometry from '../data/reviewed-apostilas/geometria-plana.json';
import { hasCorruptedApostilaText } from './apostilaTextQuality';
import type { StudySource } from './studySources';

export interface ReviewedApostilaReference {
  subject: string;
  topicName: string;
  chapters: { title: string; volume: string }[];
  text: string;
  url: string;
  excerpt: true;
  format: 'markdown';
}
const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();

/** Selected passages checked against the page images, not unchecked OCR.
 * Unsupported chapters must not receive a neighboring chapter's reference.
 */
export function getReviewedApostilaReference(subject: string, topic: string, chapter = ''): ReviewedApostilaReference | null {
  const [baseTopic, suffix] = topic.split(' — ');
  if (normalize(subject) !== normalize(geometry.subject) || normalize(baseTopic) !== normalize(geometry.topicName)) return null;
  const selectedChapter = chapter || suffix || '';
  const sections = selectedChapter ? geometry.sections.filter(section => normalize(section.chapter) === normalize(selectedChapter)) : geometry.sections;
  if (!sections.length) return null;
  return {
    subject: geometry.subject, topicName: geometry.topicName,
    chapters: sections.map(section => ({ title: section.chapter, volume: '1' })),
    url: geometry.url, excerpt: true, format: 'markdown',
    text: [
      'Recortes conferidos nas imagens da apostila; notação matemática recomposta. Seleção parcial de conceitos, sem transcrição dos exercícios ou figuras. Não cobre todos os capítulos de Geometria Plana.',
      ...sections.map(section => `### ${section.chapter}\n${section.text}`),
    ].join('\n\n'),
  };
}

/** Repair the displayed source in old guides; never silently rewrite their
 * generated explanation or substitute unrelated sources using the same AS1 id.
 */
export function replaceCorruptedApostilaSource(source: StudySource, chapter: string): StudySource | null {
  if (!hasCorruptedApostilaText(source.content)) return null;
  const match = /^Apostila:\s*(.*?)\s+—\s+(.*?)$/.exec(source.title);
  if (!match) return null;
  const reference = getReviewedApostilaReference(match[1], match[2], chapter);
  if (!reference) return null;
  return { ...source, title: `Apostila: ${reference.subject} — ${reference.topicName} (recorte conferido)`, content: reference.text, url: reference.url, excerpt: true, format: reference.format };
}
