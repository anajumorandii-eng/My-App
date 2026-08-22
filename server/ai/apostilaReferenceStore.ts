import { Firestore } from 'firebase-admin/firestore';

export interface ApostilaReference {
  subject: string;
  topicName: string;
  chapters: { title: string; volume: string }[];
  text: string;
}

export interface ApostilaReferenceStore {
  getReference(subject: string, topicName: string): Promise<ApostilaReference | null>;
}

// Normaliza pra um id de documento estável — o mesmo texto de tópico
// (ex.: "Análises Quantitativas e Estequiometria") deve sempre bater com
// o mesmo doc, mesmo com variação de acentuação/espaço vinda do cliente.
export function slugify(text: string): string {
  return text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// O client às vezes manda "Nome do Tópico — Subtópico" (Tutor.tsx); a
// referência é indexada só pelo tópico, então descarta o sufixo.
function baseTopicName(topic: string): string {
  return topic.split(' — ')[0].trim();
}

export function referenceDocId(subject: string, topic: string): string {
  return `${slugify(subject)}__${slugify(baseTopicName(topic))}`;
}

export class FirestoreApostilaReferenceStore implements ApostilaReferenceStore {
  constructor(private readonly db: Firestore) {}

  async getReference(subject: string, topic: string): Promise<ApostilaReference | null> {
    const doc = await this.db.collection('apostilaReferencias').doc(referenceDocId(subject, topic)).get();
    if (!doc.exists) return null;
    return doc.data() as ApostilaReference;
  }
}
