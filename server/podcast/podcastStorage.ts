import { getStorage } from 'firebase-admin/storage';
import { getFirebaseAdminApp } from '../auth/firebaseAuth';

// Cache persistente do áudio já narrado (Gemini TTS), keyed pelo mesmo hash
// de model+voz+texto usado pelo cache em memória de GeminiTtsService. Sem
// isso, cada reinício/nova revisão do Cloud Run (ou qualquer instância além
// da que gerou o áudio pela primeira vez, já que o Cloud Run normalmente
// roda mais de uma) perde o cache em memória e regenera o mesmo episódio do
// zero — cobrando de novo pela síntese. Mesmo padrão de bucket privado de
// server/literary/literaryStorage.ts.
const PREFIX = 'podcast-audio';

function bucket() {
  const bucketName = process.env.FIREBASE_STORAGE_BUCKET || `${process.env.FIREBASE_PROJECT_ID}.appspot.com`;
  return getStorage(getFirebaseAdminApp()).bucket(bucketName);
}

// Nunca deixa uma falha de Storage (bucket não configurado, permissão,
// indisponibilidade) quebrar a narração em si — só significa que o áudio é
// gerado de novo, exatamente como se este cache não existisse.
export async function readCachedAudio(cacheKey: string): Promise<Buffer | null> {
  try {
    const file = bucket().file(`${PREFIX}/${cacheKey}.wav`);
    const [exists] = await file.exists();
    if (!exists) return null;
    const [buffer] = await file.download();
    return buffer;
  } catch (error) {
    console.error('Failed to read cached podcast audio from Storage:', error);
    return null;
  }
}

export async function writeCachedAudio(cacheKey: string, buffer: Buffer): Promise<void> {
  try {
    await bucket().file(`${PREFIX}/${cacheKey}.wav`).save(buffer, { contentType: 'audio/wav', private: true });
  } catch (error) {
    console.error('Failed to persist podcast audio to Storage:', error);
  }
}
