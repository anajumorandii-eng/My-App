import { TopicMastery, MasteryOrigin } from '../types';

// The untouched baseline reconcileMastery() (userData.ts) writes for a topic
// the student has never engaged with — level 0, epoch lastReviewed.
const EPOCH = new Date(0).toISOString();

function isUntouched(m: TopicMastery): boolean {
  return m.level === 0 && m.lastReviewed === EPOCH;
}

// Dashboard-level read of "where is this student's mastery data coming
// from" — used to choose which first-run/empty state to show. Deliberately
// does NOT infer 'diagnostic complete' from account existence alone: an
// authenticated user with an all-baseline mastery array is still 'seed'
// (first access, no diagnostic yet), not 'observed'.
export function deriveMasteryOrigin(mastery: TopicMastery[], isPersisted: boolean): MasteryOrigin {
  if (!isPersisted) return 'demo';
  if (mastery.length === 0 || mastery.every(isUntouched)) return 'seed';
  if (mastery.some((m) => m.origin === 'observed')) return 'observed';
  if (mastery.some((m) => m.origin === 'diagnostic')) return 'diagnostic';
  // Reviewed before the `origin` field existed (or by a call site not yet
  // tagged): real evidence exists even though it isn't labeled — that's
  // closer to the truth than calling it 'seed'.
  return 'observed';
}
