import { authHeaders } from './auth';

export async function studyPdfDocumentId(key: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(key));
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function loadSavedStudyPdf(documentId: string, signal: AbortSignal): Promise<Blob | undefined> {
  const response = await fetch(`/api/study-pdf/saved/${documentId}`, { headers: await authHeaders(), signal });
  if (response.status === 404) return undefined;
  if (!response.ok) throw new Error('Não foi possível recuperar o PDF salvo. Tente novamente para manter sua capa.');
  const blob = await response.blob();
  if (!blob.type.startsWith('application/pdf') || await blob.slice(0, 5).text() !== '%PDF-') throw new Error('Não foi possível recuperar o PDF salvo. Tente novamente para manter sua capa.');
  return blob;
}
