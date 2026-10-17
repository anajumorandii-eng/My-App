export interface LearningReflection { before: string; reasoning: string; after: string; next: string }
export const emptyReflection = (): LearningReflection => ({ before: '', reasoning: '', after: '', next: '' });
export const reflectionKey = (uid: string | null, topicId: string) => `crivo:reflection:v1:${encodeURIComponent(uid ?? 'guest')}:${encodeURIComponent(topicId)}`;
export function readReflection(uid: string | null, topicId: string): LearningReflection {
  try {
    const value = JSON.parse(localStorage.getItem(reflectionKey(uid, topicId)) ?? 'null');
    return value && ['before', 'reasoning', 'after', 'next'].every(field => typeof value[field] === 'string') ? { before: value.before, reasoning: value.reasoning, after: value.after, next: value.next } : emptyReflection();
  } catch { return emptyReflection(); }
}
export function saveReflection(uid: string | null, topicId: string, note: LearningReflection) {
  localStorage.setItem(reflectionKey(uid, topicId), JSON.stringify(note));
}
export function reflectionForTutor(uid: string | null, topicId: string) {
  const note = readReflection(uid, topicId);
  if (!Object.values(note).some(value => value.trim())) return '';
  const excerpt = (value: string) => value.length > 1350 ? `${value.slice(0, 1300)} [recorte; continuação guardada no registro]` : value;
  return `Registro da estudante, não diagnóstico de domínio:\nAntes de consultar: ${excerpt(note.before)}\nMeu raciocínio: ${excerpt(note.reasoning)}\nO que revisei: ${excerpt(note.after)}\nComo vou verificar: ${excerpt(note.next)}`;
}

/** Áudio permanece no navegador, separado por conta e tópico; não há envio automático. */
async function voiceStore() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('crivo-learning-reflections', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('voices');
    request.onsuccess = () => { request.result.onversionchange = () => request.result.close(); resolve(request.result); };
    request.onerror = () => reject(request.error);
  });
}
export async function readReflectionVoice(key: string): Promise<Blob | null> {
  if (typeof indexedDB === 'undefined') return null;
  const db = await voiceStore();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('voices', 'readonly');
    const request = transaction.objectStore('voices').get(key);
    let result: Blob | null = null;
    request.onsuccess = () => { result = request.result instanceof Blob ? request.result : null; };
    transaction.oncomplete = () => { db.close(); resolve(result); };
    transaction.onabort = () => { db.close(); reject(transaction.error); };
  });
}
export async function saveReflectionVoice(key: string, blob: Blob) {
  const db = await voiceStore();
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction('voices', 'readwrite');
    transaction.objectStore('voices').put(blob, key);
    transaction.oncomplete = () => { db.close(); resolve(); };
    transaction.onabort = () => { db.close(); reject(transaction.error); };
  });
}
