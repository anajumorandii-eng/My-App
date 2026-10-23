import { createHash } from 'node:crypto';
import { getStorage } from 'firebase-admin/storage';
import { getFirebaseAdminApp } from '../auth/firebaseAuth';
import firebaseConfig from '../../firebase-applet-config.json';

export interface StudyPdfStorage {
  read(uid: string, documentId: string): Promise<Buffer | null>;
  write(uid: string, documentId: string, pdf: Buffer): Promise<void>;
}

function file(uid: string, documentId: string) {
  const owner = createHash('sha256').update(uid).digest('hex');
  const bucket = process.env.FIREBASE_STORAGE_BUCKET || firebaseConfig.storageBucket;
  return getStorage(getFirebaseAdminApp()).bucket(bucket).file(`study-pdfs/${owner}/${documentId}.pdf`);
}

export const studyPdfStorage: StudyPdfStorage = {
  async read(uid, documentId) {
    try { const [buffer] = await file(uid, documentId).download(); return buffer; }
    catch (error) {
      if ((error as { code?: number }).code === 404) return null;
      throw error;
    }
  },
  async write(uid, documentId, pdf) {
    await file(uid, documentId).save(pdf, { contentType: 'application/pdf', private: true });
  },
};
