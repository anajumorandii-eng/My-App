import data from '../data/examEvidenceCounts.json';
import fuvestData from '../data/fuvestIncidenceCounts.json';
import { canonicalExamBoard } from './questionExamFilters';
import { studyAreaForTopic } from '../data/studyProtocols';
import type { Topic } from '../types';
export const evidenceReviewedOn = fuvestData.reviewedOn;
export interface ExamEvidenceCohort {
  id: string; board: string; year: number; phase: string; phaseGroup: string; version: string;
  examUrl: string; answerKeyUrl: string | null; reviewedOn: string; examSha256?: string; answerKeySha256?: string | null;
  completeSubjects: string[]; totalQuestions: number; excludedNumbers: (number|string)[]; classification: string;
  subjects: {subject: string; total: number; topics: {topicId: string; count: number; numbers: (number|string)[]}[]}[];
}
// The complete five-edition FUVEST corpus replaces the previous selected-2026 sample.
export const examEvidenceCohorts: ExamEvidenceCohort[] = [...data.cohorts.filter(cohort => cohort.board !== 'FUVEST'), ...fuvestData.cohorts];
export interface ExamEvidenceCase {
  id: string; cohortId: string; number: number | string; questionId?: string; topicId: string;
  relatedTopicIds: string[]; subject: string; chapter: string; title: string; concept: string;
  trap: string; steps: string[]; commandWords: string[];
}
export const evidenceSubject = (subject: string) => subject === 'Língua Portuguesa' ? 'Português' : subject === 'Língua Inglesa' ? 'Inglês' : subject;
export function completeTopicEvidence(topic: Pick<Topic, 'id' | 'subject'>, board?: string, phase: '1a-fase' | '2a-fase' | 'ambas' = 'ambas', fuvestCareer?: 'medicina') {
  const subject = studyAreaForTopic(topic);
  return examEvidenceCohorts.filter(cohort => (!board || canonicalExamBoard(cohort.board) === canonicalExamBoard(board)) &&
    (phase === 'ambas' || cohort.phaseGroup === phase.slice(0, 2)) && cohort.completeSubjects.includes(subject)).flatMap(cohort => {
      const group = cohort.subjects.find(item => item.subject === subject);
      if (!group) return [];
      if (fuvestCareer === 'medicina' && cohort.board === 'FUVEST' && cohort.phase.includes('dia 2')) {
        if (!['Biologia','Física','Geografia','Química'].includes(subject)) return [];
        const own = group.topics.map(row=>({...row,numbers:row.numbers.filter(number=>/^[BFGQ]0?[1-3]$/i.test(String(number)))}));
        const total = own.reduce((sum,row)=>sum+row.numbers.length,0);
        if(!total)return [];
        return [{cohort,total,count:own.find(row=>row.topicId===topic.id)?.numbers.length ?? 0}];
      }
      return [{ cohort, total: group.total, count: group.topics.find(item => item.topicId === topic.id)?.count ?? 0 }];
    });
}
export async function loadExamEvidenceCases(): Promise<ExamEvidenceCase[]> {
  const legacy = (await import('../data/examEvidenceCases.json')).default.filter(item => !item.cohortId.startsWith('fuvest-'));
  const corpus = (await import('../data/fuvestIncidence.json')).default;
  const current = corpus.questions.filter(question => question.year >= 2022 && !question.excluded).map(question => ({
    id: question.id, cohortId: question.paperId, number: question.number,
    topicId: question.topicId ?? `fuvest-unmapped:${question.topic}`, relatedTopicIds: question.relatedTopicIds,
    subject: question.subject, chapter: question.subtopics.join(' · '), title: question.summary,
    concept: question.rationale, trap: question.trap, steps: question.strategy, commandWords: [],
  }));
  return [...legacy, ...current];
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
