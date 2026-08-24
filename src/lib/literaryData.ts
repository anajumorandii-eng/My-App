import { doc, getDoc, setDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firestore';
import { LiteraryMastery, LiteraryAttempt, ReadingProgress, LiteraryMasteryDimension } from '../types/literaryWorks';

// Mesmo espírito de userData.ts, mas pro domínio de Obras Obrigatórias —
// separado de propósito (ver server/literary/literaryReferenceStore.ts):
// LiteraryMastery é multidimensional (uma linha por obra+dimensão, não uma
// por tópico), então não cabe reaproveitar getUserMastery/saveUserMastery
// como estão.

function masteryDocId(workId: string, dimension: LiteraryMasteryDimension, unitId?: string): string {
  return unitId ? `${workId}__${unitId}__${dimension}` : `${workId}__${dimension}`;
}

export async function getLiteraryMastery(uid: string): Promise<LiteraryMastery[]> {
  const ref = collection(db, 'users', uid, 'literaryMastery');
  const snap = await getDocs(ref);
  return snap.docs.map((d) => d.data() as LiteraryMastery);
}

export async function saveLiteraryMastery(uid: string, mastery: LiteraryMastery): Promise<void> {
  const ref = doc(db, 'users', uid, 'literaryMastery', masteryDocId(mastery.workId, mastery.dimension, mastery.unitId));
  await setDoc(ref, mastery);
}

export async function getReadingProgress(uid: string, workId: string): Promise<ReadingProgress[]> {
  const ref = collection(db, 'users', uid, 'readingProgress');
  const snap = await getDocs(query(ref, where('workId', '==', workId)));
  return snap.docs.map((d) => d.data() as ReadingProgress);
}

export async function saveReadingProgress(uid: string, progress: ReadingProgress): Promise<void> {
  const ref = doc(db, 'users', uid, 'readingProgress', `${progress.workId}__${progress.unitId}`);
  await setDoc(ref, progress);
}

export async function getLiteraryAttempts(uid: string, questionId: string): Promise<LiteraryAttempt[]> {
  const ref = collection(db, 'users', uid, 'literaryAttempts');
  const snap = await getDocs(query(ref, where('questionId', '==', questionId)));
  return snap.docs.map((d) => d.data() as LiteraryAttempt);
}

export async function addLiteraryAttempt(uid: string, attempt: LiteraryAttempt): Promise<void> {
  const ref = doc(db, 'users', uid, 'literaryAttempts', attempt.id);
  await setDoc(ref, attempt);
}
