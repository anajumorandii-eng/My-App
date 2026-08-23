import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from './firestore';
import { LiteraryWork, WorkEdition, ExamRequirement, WorkUnit } from '../types/literaryWorks';

// Leitura do catálogo de Obras Obrigatórias pelo lado do aluno (Fase 2 do
// roteiro) — direto do Firestore, igual ao resto do currículo. Só o que não
// carrega camada de evidência (LiteraryWork, WorkEdition, ExamRequirement,
// WorkUnit são metadados estruturais, sem editorialStatus) é lido assim;
// conteúdo analítico (ContentModule, EvidenceCard, CriticalSource,
// LiteraryQuestion) precisa do gate de publicação e ainda não tem rota de
// leitura pro aluno — ver literaryReferenceStore.ts do lado do servidor.

export async function getLiteraryWorks(): Promise<LiteraryWork[]> {
  const snap = await getDocs(collection(db, 'literaryWorks'));
  return snap.docs.map((d) => d.data() as LiteraryWork);
}

export async function getLiteraryWork(workId: string): Promise<LiteraryWork | null> {
  const snap = await getDoc(doc(db, 'literaryWorks', workId));
  return snap.exists() ? (snap.data() as LiteraryWork) : null;
}

// A rota usa o slug legível (/obras/:workSlug), não o id do Firestore.
export async function getLiteraryWorkBySlug(slug: string): Promise<LiteraryWork | null> {
  const snap = await getDocs(query(collection(db, 'literaryWorks'), where('slug', '==', slug)));
  return snap.empty ? null : (snap.docs[0].data() as LiteraryWork);
}

export async function getExamRequirements(workId: string): Promise<ExamRequirement[]> {
  const snap = await getDocs(collection(db, 'literaryWorks', workId, 'examRequirements'));
  return snap.docs.map((d) => d.data() as ExamRequirement);
}

export async function getEditions(workId: string): Promise<WorkEdition[]> {
  const snap = await getDocs(collection(db, 'literaryWorks', workId, 'editions'));
  return snap.docs.map((d) => d.data() as WorkEdition);
}

export async function getWorkUnits(workId: string): Promise<WorkUnit[]> {
  const snap = await getDocs(collection(db, 'literaryWorks', workId, 'units'));
  return snap.docs.map((d) => d.data() as WorkUnit).sort((a, b) => a.order - b.order);
}

// Todos os requisitos de todas as obras de um só golpe — usado pro catálogo
// mostrar banca/recorte de cada card sem disparar 18 requisições separadas.
export async function getAllExamRequirements(workIds: string[]): Promise<Record<string, ExamRequirement[]>> {
  const entries = await Promise.all(
    workIds.map(async (workId) => [workId, await getExamRequirements(workId)] as const)
  );
  return Object.fromEntries(entries);
}
