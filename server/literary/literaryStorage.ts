import { createHash } from 'node:crypto';
import { getStorage } from 'firebase-admin/storage';
import { getFirebaseAdminApp } from '../auth/firebaseAuth';

// PDFs de obras protegidas por direito autoral nunca vão pra public/ nem pro
// bundle do front-end (ver seção 2.2 do roteiro) — ficam num bucket privado,
// acessados só por URL assinada e temporária.
const PRIVATE_PREFIX = 'literary-works';

function bucket() {
  const bucketName = process.env.FIREBASE_STORAGE_BUCKET || `${process.env.FIREBASE_PROJECT_ID}.appspot.com`;
  return getStorage(getFirebaseAdminApp()).bucket(bucketName);
}

export function computeFileHash(buffer: Buffer): string {
  return createHash('sha256').update(buffer).digest('hex');
}

// Quase toda edição é PDF, mas "Canções Escolhidas — 14 letras" (Paulo César
// Pinheiro) chegou como .docx (ver AUDITORIA_FASE0.md) — sem conversão
// confiável disponível no pipeline, o upload aceita o formato original em
// vez de forçar uma conversão frágil.
const EXTENSION_BY_MIME: Record<string, string> = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
};

function sourceFilePath(workId: string, editionId: string, mimeType: string): string {
  const ext = EXTENSION_BY_MIME[mimeType] ?? 'bin';
  return `${PRIVATE_PREFIX}/${workId}/${editionId}.${ext}`;
}

/** Sobe o arquivo original (PDF na quase totalidade dos casos) pro bucket privado. Retorna o sourceFileId (o próprio path) e o hash, pra WorkEdition. */
export async function uploadWorkEditionSource(workId: string, editionId: string, fileBuffer: Buffer, mimeType = 'application/pdf'): Promise<{ sourceFileId: string; fileHash: string }> {
  const path = sourceFilePath(workId, editionId, mimeType);
  const file = bucket().file(path);
  await file.save(fileBuffer, { contentType: mimeType, private: true });
  return { sourceFileId: path, fileHash: computeFileHash(fileBuffer) };
}

/** URL temporária pra auditoria/leitura administrativa — nunca cacheada nem exposta publicamente. */
export async function getSignedReadUrl(sourceFileId: string, expiresInMinutes = 15): Promise<string> {
  const [url] = await bucket().file(sourceFileId).getSignedUrl({
    action: 'read',
    expires: Date.now() + expiresInMinutes * 60 * 1000,
  });
  return url;
}

export async function downloadWorkEditionSource(sourceFileId: string): Promise<Buffer> {
  const [buffer] = await bucket().file(sourceFileId).download();
  return buffer;
}
