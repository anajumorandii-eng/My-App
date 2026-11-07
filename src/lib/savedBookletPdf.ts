import { authHeaders } from './auth';

export type SavedBookletPdf = { blob: Blob; sheets: number; blankPages?: number };

export async function loadSavedBookletPdf(documentId: string, signal: AbortSignal): Promise<SavedBookletPdf | undefined> {
  const response = await fetch(`/api/study-pdf/saved/${documentId}/booklet`, { headers: await authHeaders(), signal });
  if (response.status === 404) return undefined;
  if (!response.ok) throw new Error('Não foi possível recuperar o livreto salvo. Tente novamente para manter suas capas.');
  const blob = await response.blob();
  const sheets = Number(response.headers.get('X-Booklet-Sheets'));
  if (!blob.type.startsWith('application/pdf') || await blob.slice(0, 5).text() !== '%PDF-' || !Number.isInteger(sheets) || sheets < 1 || sheets > 200) throw new Error('Não foi possível recuperar o livreto salvo. Tente novamente para manter suas capas.');
  return { blob, sheets };
}

export async function saveBookletPdf(documentId: string, blob: Blob, signal: AbortSignal): Promise<void> {
  const response = await fetch(`/api/study-pdf/saved/${documentId}/booklet`, {
    method: 'PUT', headers: { ...(await authHeaders()), 'Content-Type': 'application/pdf' }, body: blob, signal,
  });
  if (!response.ok) throw new Error('Não foi possível salvar o livreto na sua conta. Tente salvar novamente; o arquivo preparado será reaproveitado.');
}
