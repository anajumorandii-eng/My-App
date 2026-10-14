import type { SummaryChange } from './summarySync';
export type StudyDataDomain = 'mastery' | 'errors' | 'schedule' | 'goals';
type DataListener = (uid: string, domain: StudyDataDomain) => void;
const dataListeners = new Set<DataListener>();
export function notifyStudyData(uid: string, domain: StudyDataDomain) {
  for (const listener of dataListeners) listener(uid,domain);
}
export function subscribeStudyData(listener: DataListener) {
  dataListeners.add(listener);
  return () => { dataListeners.delete(listener); };
}
type SummaryListener = (uid: string | null, change: SummaryChange, origin: object) => void;
const summaryListeners = new Set<SummaryListener>();
export function notifySummaryChange(uid: string | null, change: SummaryChange, origin: object) {
  for (const listener of summaryListeners) listener(uid,change,origin);
}
export function subscribeSummaryChanges(listener: SummaryListener) {
  summaryListeners.add(listener);
  return () => { summaryListeners.delete(listener); };
}

const summaryWrites = new Map<string, Promise<void>>();
// Reserve the position when an edit is made, rather than when a preceding
// request finishes. Separate retained activities must share the same order.
export function serializeSummaryWrite(uid: string, work: () => Promise<void>): Promise<void> {
  const operation = (summaryWrites.get(uid) ?? Promise.resolve()).catch(() => {}).then(work);
  summaryWrites.set(uid, operation);
  const clear = () => { if (summaryWrites.get(uid) === operation) summaryWrites.delete(uid); };
  void operation.then(clear, clear);
  return operation;
}
