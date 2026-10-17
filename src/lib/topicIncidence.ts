import type { Topic } from '../types';
import { completeTopicEvidence } from './examEvidence';

/** Descriptive, sample-shrunk signal. Selected examples never enter incidence.
 * Average available phases within each board, then boards; never add a regional
 * percentage to a board percentage. n/(n+20) is an editorial conservative factor,
 * not a confidence interval or a forecast. */
export function topicIncidenceWeight(topic: Pick<Topic, 'id' | 'subject'>, board?: string, phase: '1a-fase' | '2a-fase' | 'ambas' = 'ambas'): number {
  const records = completeTopicEvidence(topic, board, phase);
  const boards = [...new Set(records.map(record => record.cohort.board))];
  if (!boards.length) return 0;
  return boards.reduce((total, name) => {
    const own = records.filter(record => record.cohort.board === name);
    const phases = [...new Set(own.map(record => record.cohort.phaseGroup))];
    const signal = phases.reduce((sum, group) => {
      const rows = own.filter(record => record.cohort.phaseGroup === group);
      const n = rows.reduce((value, row) => value + row.total, 0);
      const hits = rows.reduce((value, row) => value + row.count, 0);
      return sum + (n ? hits / (n + 20) : 0);
    }, 0) / phases.length;
    return total + signal;
  }, 0) / boards.length;
}
