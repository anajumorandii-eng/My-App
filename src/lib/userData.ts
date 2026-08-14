import { doc, getDoc, setDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './firestore';
import { TopicMastery, ErrorLog, UserProfile, DiscursiveAttempt, BacklogItem } from '../types';
import { mockMastery, mockProfile, mockBacklog } from '../data/mockData';

export interface QuestionAttempt {
  id: string;
  questionId: string;
  topicId: string;
  correct: boolean;
  date: string;
}

export async function getUserMastery(uid: string): Promise<TopicMastery[]> {
  const ref = doc(db, 'users', uid, 'data', 'mastery');
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return (snap.data().items as TopicMastery[]) ?? [];
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
