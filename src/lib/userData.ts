import { doc, getDoc, setDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './firestore';
import { TopicMastery, ErrorLog, UserProfile, DiscursiveAttempt, BacklogItem, StudentGoals, PlanFeedback } from '../types';
import { mockMastery, mockProfile, mockBacklog, mockTopics, mockStudentGoals } from '../data/mockData';

export interface QuestionAttempt {
  id: string;
  questionId: string;
  topicId: string;
  correct: boolean;
  date: string;
}

// Keeps a saved mastery array in sync with the current topic catalog: a topic
// added or renamed in mockTopics (e.g. the curriculum being replaced with a
// real one) gets a fresh baseline entry instead of silently having no
// mastery row at all, and rows for topics that no longer exist are dropped
// instead of lingering as orphaned data nobody reads.
function reconcileMastery(saved: TopicMastery[]): TopicMastery[] {
  const byTopicId = new Map(saved.map((item) => [item.topicId, item]));
  return mockTopics.map((topic) => byTopicId.get(topic.id) ?? {
    topicId: topic.id,
    level: 0,
    uncertainty: 0.9,
    lastReviewed: new Date(0).toISOString(),
    errorSignals: 0,
  });
}

export async function getUserMastery(uid: string): Promise<TopicMastery[]> {
  const ref = doc(db, 'users', uid, 'data', 'mastery');
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const saved = (snap.data().items as TopicMastery[]) ?? [];
    const reconciled = reconcileMastery(saved);
    const changed = reconciled.length !== saved.length
      || reconciled.some((item, i) => item.topicId !== saved[i]?.topicId);
    if (changed) {
      await setDoc(ref, { items: reconciled });
    }
    return reconciled;
  }
  // First time this user shows up: seed with the demo dataset so the
  // app isn't empty, then every change from here on is their own.
  await setDoc(ref, { items: mockMastery });
  return mockMastery;
}

export async function saveUserMastery(uid: string, items: TopicMastery[]): Promise<void> {
  const ref = doc(db, 'users', uid, 'data', 'mastery');
  await setDoc(ref, { items });
}

export async function getUserProfile(uid: string): Promise<UserProfile> {
  const ref = doc(db, 'users', uid, 'data', 'profile');
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return snap.data() as UserProfile;
  }
  await setDoc(ref, mockProfile);
  return mockProfile;
}

export async function saveUserProfile(uid: string, profile: UserProfile): Promise<void> {
  const ref = doc(db, 'users', uid, 'data', 'profile');
  await setDoc(ref, profile);
}

export async function getUserErrorLogs(uid: string): Promise<ErrorLog[]> {
  const ref = collection(db, 'users', uid, 'errorLogs');
  const snap = await getDocs(query(ref, orderBy('date', 'desc')));
  return snap.docs.map((d) => d.data() as ErrorLog);
}

export async function addUserErrorLog(uid: string, log: ErrorLog): Promise<void> {
  const ref = doc(db, 'users', uid, 'errorLogs', log.id);
  await setDoc(ref, log);
}

export async function getUserAttempts(uid: string): Promise<QuestionAttempt[]> {
  const ref = collection(db, 'users', uid, 'attempts');
  const snap = await getDocs(query(ref, orderBy('date', 'desc')));
  return snap.docs.map((d) => d.data() as QuestionAttempt);
}

export async function addUserAttempt(uid: string, attempt: QuestionAttempt): Promise<void> {
  const ref = doc(db, 'users', uid, 'attempts', attempt.id);
  await setDoc(ref, attempt);
}

export async function getUserDiscursiveAttempts(uid: string): Promise<DiscursiveAttempt[]> {
  const ref = collection(db, 'users', uid, 'discursiveAttempts');
  const snap = await getDocs(query(ref, orderBy('date', 'desc')));
  return snap.docs.map((d) => d.data() as DiscursiveAttempt);
}

export async function addUserDiscursiveAttempt(uid: string, attempt: DiscursiveAttempt): Promise<void> {
  const ref = doc(db, 'users', uid, 'discursiveAttempts', attempt.id);
  await setDoc(ref, attempt);
}

export async function getUserBacklog(uid: string): Promise<BacklogItem[]> {
  const ref = doc(db, 'users', uid, 'data', 'backlog');
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return (snap.data().items as BacklogItem[]) ?? [];
  }
  await setDoc(ref, { items: mockBacklog });
  return mockBacklog;
}

export async function saveUserBacklog(uid: string, items: BacklogItem[]): Promise<void> {
  const ref = doc(db, 'users', uid, 'data', 'backlog');
  await setDoc(ref, { items });
}

export async function getStudentGoals(uid: string): Promise<StudentGoals> {
  const ref = doc(db, 'users', uid, 'data', 'goals');
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return snap.data() as StudentGoals;
  }
  await setDoc(ref, mockStudentGoals);
  return mockStudentGoals;
}

export async function saveStudentGoals(uid: string, goals: StudentGoals): Promise<void> {
  const ref = doc(db, 'users', uid, 'data', 'goals');
  await setDoc(ref, goals);
}

// Feedback estruturado de "Discordo" numa recomendação — só registrado, o
// plano não muda silenciosamente a partir disso (a estudante decide).
export async function getPlanFeedback(uid: string): Promise<PlanFeedback[]> {
  const ref = collection(db, 'users', uid, 'planFeedback');
  const snap = await getDocs(query(ref, orderBy('date', 'desc')));
  return snap.docs.map((d) => d.data() as PlanFeedback);
}

export async function addPlanFeedback(uid: string, feedback: PlanFeedback): Promise<void> {
  const ref = doc(db, 'users', uid, 'planFeedback', feedback.id);
  await setDoc(ref, feedback);
}
