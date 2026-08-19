import { doc, getDoc, setDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './firestore';
import { TopicMastery, ErrorLog, UserProfile, DiscursiveAttempt, BacklogItem, StudentGoals, PlanFeedback } from '../types';
import { mockMastery, mockProfile, mockBacklog, mockTopics, mockStudentGoals } from '../data/mockData';
import { remapLegacyTopicId } from '../data/legacyTopics';
import { SPLIT_TOPIC_PARENTS } from '../data/topicSplits';

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
//
// A topic that was split into finer sub-areas (SPLIT_TOPIC_PARENTS, e.g.
// "Modelagem Geométrica" -> Geometria Plana/Trigonometria/...) is a special
// case: the student's real estimate for the old, broader topic is carried
// forward to every child instead of resetting each one to an unstudied
// baseline — averaged across parents when a child drew from more than one
// old frente. This isn't more precise than what she actually reported, just
// less destructive than silently discarding it.
function reconcileMastery(saved: TopicMastery[]): TopicMastery[] {
  const byTopicId = new Map(saved.map((item) => [item.topicId, item]));
  return mockTopics.map((topic) => {
    const existing = byTopicId.get(topic.id);
    if (existing) return existing;
    const parentIds = SPLIT_TOPIC_PARENTS[topic.id];
    const parents = parentIds?.map((id) => byTopicId.get(id)).filter((m): m is TopicMastery => !!m);
    if (parents && parents.length > 0) {
      return {
        topicId: topic.id,
        level: Math.round(parents.reduce((sum, m) => sum + m.level, 0) / parents.length),
        uncertainty: parents.reduce((sum, m) => sum + m.uncertainty, 0) / parents.length,
        lastReviewed: parents.reduce((latest, m) => (m.lastReviewed > latest ? m.lastReviewed : latest), parents[0].lastReviewed),
        errorSignals: Math.max(...parents.map((m) => m.errorSignals)),
      };
    }
    return {
      topicId: topic.id,
      level: 0,
      uncertainty: 0.9,
      lastReviewed: new Date(0).toISOString(),
      errorSignals: 0,
    };
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

// A backlog entry is the student's own diagnosis (state, dependência,
// incidência, lacuna, urgência, custo — all self-scored), not a full-catalog
// row like mastery, so it's never dropped or reset here. Only the topicId is
// touched, and only when the rename is unambiguous (see legacyTopics.ts) —
// anything else stays as-is and the backlog UI surfaces it for the student
// to resolve instead of letting it silently disappear.
function reconcileBacklog(saved: BacklogItem[]): { items: BacklogItem[]; changed: boolean } {
  let changed = false;
  const currentTopicIds = new Set(mockTopics.map((t) => t.id));
  const items = saved.map((item) => {
    let topicId = remapLegacyTopicId(item.topicId);
    // A frente the item pointed at may since have been split into finer
    // topics (see topicSplits.ts). If the item names a specific chapter,
    // find the one new topic whose chapters actually include it — a precise
    // remap, not a guess. Without a chapter to go on there's no way to know
    // which child topic she meant, so it's left for her to resolve in the
    // "tópico não existe mais" UI rather than picked arbitrarily.
    if (item.subtopic && !currentTopicIds.has(topicId)) {
      const match = mockTopics.find((t) => t.chapters?.includes(item.subtopic!));
      if (match) topicId = match.id;
    }
    if (topicId === item.topicId) return item;
    changed = true;
    return { ...item, topicId };
  });
  return { items, changed };
}

export async function getUserBacklog(uid: string): Promise<BacklogItem[]> {
  const ref = doc(db, 'users', uid, 'data', 'backlog');
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const saved = (snap.data().items as BacklogItem[]) ?? [];
    const { items, changed } = reconcileBacklog(saved);
    if (changed) {
      await setDoc(ref, { items });
    }
    return items;
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
