import { collection, getDocs } from 'firebase/firestore';
import { db } from './firestore';
import { Question, StudyMethod, PodcastEpisode } from '../types';

// Leitura pelo lado do aluno do banco de conteúdo compartilhado (questões,
// métodos de estudo, episódios de podcast) — antes hardcoded em
// src/data/mockData.ts, agora no Firestore (ver server/content/contentAdminRoutes.ts).
// Sem gate de publicação: qualquer aluna logada lê direto, igual ao catálogo
// de Obras Obrigatórias (src/lib/literaryCatalog.ts).

/**
 * Banco local de questões, servido como arquivo estático em vez de embutido
 * no bundle: são 1,5 MB que só as telas de Questões e Diagnóstico usam, e
 * que antes toda tela baixava. Mesma abordagem dos flashcards
 * (src/lib/flashcardContent.ts).
 *
 * Continua sendo a base offline sobre a qual o Firestore escreve por cima —
 * quando o banco compartilhado responde, ele vence.
 */
export async function getLocalQuestionBank(): Promise<Question[]> {
  const res = await fetch('/questions.json');
  if (!res.ok) throw new Error('Não foi possível carregar o banco de questões local.');
  return res.json() as Promise<Question[]>;
}

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
