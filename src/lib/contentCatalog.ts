import { collection, getDocs } from 'firebase/firestore';
import { db } from './firestore';
import { Question, StudyMethod, PodcastEpisode } from '../types';

// Leitura pelo lado do aluno do banco de conteúdo compartilhado (questões,
// métodos de estudo, episódios de podcast) — antes hardcoded em
// src/data/mockData.ts, agora no Firestore (ver server/content/contentAdminRoutes.ts).
// Sem gate de publicação: qualquer aluna logada lê direto, igual ao catálogo
// de Obras Obrigatórias (src/lib/literaryCatalog.ts).

export async function getQuestions(): Promise<Question[]> {
  const snap = await getDocs(collection(db, 'questions'));
  return snap.docs.map((d) => d.data() as Question);
}

export async function getStudyMethods(): Promise<StudyMethod[]> {
  const snap = await getDocs(collection(db, 'studyMethods'));
  return snap.docs.map((d) => d.data() as StudyMethod);
}

export async function getPodcastEpisodes(): Promise<PodcastEpisode[]> {
  const snap = await getDocs(collection(db, 'podcastEpisodes'));
  return snap.docs.map((d) => d.data() as PodcastEpisode);
}
