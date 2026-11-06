import { authHeaders } from './auth';
import type { PrintCoverContext } from './printCoverSpec';

/** A geração da segunda cena ocorre só quando a estudante escolhe o livreto. */
export async function requestBookletArtwork(context: PrintCoverContext, signal: AbortSignal): Promise<Uint8Array> {
  if (!context.subject || !(context.topic || context.work)) throw new Error('Não foi possível identificar o conteúdo para ilustrar a contracapa.');
  const response = await fetch('/api/cover-illustrations', {
    method: 'POST',
    headers: { ...(await authHeaders()), 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...context, side: 'back' }),
    signal,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Não foi possível criar a arte da contracapa. Tente novamente.');
  if (typeof data.dataUrl !== 'string' || data.dataUrl.length > 8_388_640 || !/^data:image\/png;base64,[A-Za-z0-9+/]+={0,2}$/.test(data.dataUrl)) throw new Error('A ilustração da contracapa recebida é inválida.');
  return Uint8Array.from(atob(data.dataUrl.slice('data:image/png;base64,'.length)), char => char.charCodeAt(0));
}
