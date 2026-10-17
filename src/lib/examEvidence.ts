import data from '../data/examEvidenceCounts.json';
import { canonicalExamBoard } from './questionExamFilters';
import { studyAreaForTopic } from '../data/studyProtocols';
import type { Topic } from '../types';
export const evidenceReviewedOn = data.reviewedOn;
export const examEvidenceCohorts = data.cohorts;
export type ExamEvidenceCohort = typeof examEvidenceCohorts[number];
export interface ExamEvidenceCase {
  id: string; cohortId: string; number: number; questionId?: string; topicId: string;
  relatedTopicIds: string[]; subject: string; chapter: string; title: string; concept: string;
  trap: string; steps: string[]; commandWords: string[];
}
export const evidenceSubject = (subject: string) => subject === 'Língua Portuguesa' ? 'Português' : subject === 'Língua Inglesa' ? 'Inglês' : subject;
export function completeTopicEvidence(topic: Pick<Topic, 'id' | 'subject'>, board?: string, phase: '1a-fase' | '2a-fase' | 'ambas' = 'ambas') {
  const subject = studyAreaForTopic(topic);
  return examEvidenceCohorts.filter(cohort => (!board || canonicalExamBoard(cohort.board) === canonicalExamBoard(board)) &&
    (phase === 'ambas' || cohort.phaseGroup === phase.slice(0, 2)) && cohort.completeSubjects.includes(subject)).flatMap(cohort => {
      const group = cohort.subjects.find(item => item.subject === subject);
      if (!group) return [];
      return [{ cohort, total: group.total, count: group.topics.find(item => item.topicId === topic.id)?.count ?? 0 }];
    });
}
export async function loadExamEvidenceCases(): Promise<ExamEvidenceCase[]> {
  return (await import('../data/examEvidenceCases.json')).default;
}
/** Select by board AND topic, fairly alternating boards and topics. These are
 * editorial analyses of identified questions, not complete question statements. */
export function selectExamEvidence(cases: ExamEvidenceCase[], topicIds: string[], boards: string[], limit = 6) {
  const selectedBoards = boards.map(canonicalExamBoard);
  const pool = cases.filter(item => [item.topicId, ...item.relatedTopicIds].some(id => topicIds.includes(id)) &&
    (!selectedBoards.length || selectedBoards.includes(canonicalExamBoard(examEvidenceCohorts.find(cohort => cohort.id === item.cohortId)?.board ?? ''))));
  // Prefer an actual connection between selected topics, then recent exams.
  // The per-board buckets below still keep one board from filling the packet.
  const matches = (item: ExamEvidenceCase) => [item.topicId, ...item.relatedTopicIds].filter(id => topicIds.includes(id)).length;
  pool.sort((a, b) => matches(b) - matches(a) ||
    examEvidenceCohorts.find(cohort => cohort.id === b.cohortId)!.year - examEvidenceCohorts.find(cohort => cohort.id === a.cohortId)!.year);
  const groups = [...new Set(pool.map(item => examEvidenceCohorts.find(cohort => cohort.id === item.cohortId)!.board))];
  const buckets = groups.flatMap(board => topicIds.map(topicId => pool.filter(item => examEvidenceCohorts.find(cohort => cohort.id === item.cohortId)!.board === board && [item.topicId, ...item.relatedTopicIds].includes(topicId))));
  const result: ExamEvidenceCase[] = [], used = new Set<string>();
  for (let round = 0; result.length < limit && buckets.some(bucket => bucket[round]); round++) for (const bucket of buckets) {
    const item = bucket[round];
    if (item && !used.has(item.id) && result.length < limit) { used.add(item.id); result.push(item); }
  }
  return result;
}
