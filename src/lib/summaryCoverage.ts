import type { CurriculumSubject } from '../data/summaryCurriculum';
import type { InteractiveSummary } from '../types/summary';

export interface MissingSummaryTopic { subject: string; topic: string; track: string; semester?: 1 | 2; }
export interface DuplicateSummaryTopic { subject: string; topic: string; summaryIds: string[]; }
export interface ExtraSummaryTopic { subject: string; topic: string; summaryId: string; }
export interface SummaryCoverageAudit {
  missing: MissingSummaryTopic[];
  duplicates: DuplicateSummaryTopic[];
  extras: ExtraSummaryTopic[];
  invalidSubjects: string[];
}

const keyOf = (subject: string, topic: string) => `${subject}\u0000${topic}`;

export function auditSummaryCoverage(curriculum: CurriculumSubject[], summaries: InteractiveSummary[]): SummaryCoverageAudit {
  const curriculumSubjects = new Set(curriculum.map((item) => item.subject));
  const curriculumTopics = new Map(
    curriculum.flatMap((item) => item.topics).map((topic) => [keyOf(topic.subject, topic.title), topic]),
  );
  const summariesByTopic = new Map<string, InteractiveSummary[]>();

  for (const summary of summaries) {
    const key = keyOf(summary.subject, summary.topic);
    summariesByTopic.set(key, [...(summariesByTopic.get(key) ?? []), summary]);
  }

  const missing = [...curriculumTopics.entries()]
    .filter(([key]) => !summariesByTopic.has(key))
    .map(([, topic]) => ({ subject: topic.subject, topic: topic.title, track: topic.track, ...(topic.semester ? { semester: topic.semester } : {}) }));
  const duplicates = [...summariesByTopic.entries()]
    .filter(([key, items]) => curriculumTopics.has(key) && items.length > 1)
    .map(([, items]) => ({ subject: items[0].subject, topic: items[0].topic, summaryIds: items.map((item) => item.id) }));
  const extras = summaries
    .filter((summary) => !curriculumTopics.has(keyOf(summary.subject, summary.topic)))
    .map((summary) => ({ subject: summary.subject, topic: summary.topic, summaryId: summary.id }));
  const invalidSubjects = [...new Set(summaries.map((summary) => summary.subject).filter((subject) => !curriculumSubjects.has(subject)))];

  return { missing, duplicates, extras, invalidSubjects };
}
