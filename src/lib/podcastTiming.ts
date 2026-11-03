/** Boundaries refer to actual PCM samples, not word counts or elapsed wall time. */
export interface PodcastCue { start: number; end: number; text: string; speaker?: 1 | 2; }
const tag = (bytes: Uint8Array, offset: number) => String.fromCharCode(...bytes.subarray(offset, offset + 4));
function wavChunks(bytes: Uint8Array) {
  if (bytes.length < 44 || tag(bytes, 0) !== 'RIFF' || tag(bytes, 8) !== 'WAVE') throw new Error('O áudio não é um WAV válido.');
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const chunks: { id: string; start: number; length: number }[] = [];
  for (let offset = 12; offset + 8 <= bytes.length;) {
    const length = view.getUint32(offset + 4, true), start = offset + 8;
    if (start + length > bytes.length) throw new Error('O áudio está incompleto.');
    chunks.push({ id: tag(bytes, offset), start, length });
    offset = start + length + length % 2;
  }
  return chunks;
}
export function podcastWavDuration(bytes: Uint8Array): number {
  const chunks = wavChunks(bytes), fmt = chunks.find(c => c.id === 'fmt '), data = chunks.filter(c => c.id === 'data');
  if (!fmt || fmt.length < 16 || data.length !== 1) throw new Error('O áudio não contém PCM válido.');
  const view = new DataView(bytes.buffer, bytes.byteOffset + fmt.start, fmt.length);
  const channels = view.getUint16(2, true), rate = view.getUint32(4, true), byteRate = view.getUint32(8, true), bits = view.getUint16(14, true);
  if (view.getUint16(0, true) !== 1 || channels !== 1 || bits !== 16 || !rate || byteRate !== rate * 2 || data.some(c => c.length % 2)) throw new Error('O áudio não contém PCM compatível.');
  return data.reduce((sum, c) => sum + c.length, 0) / byteRate;
}
export function readPodcastCues(bytes: Uint8Array): PodcastCue[] {
  const duration = podcastWavDuration(bytes), chunk = wavChunks(bytes).find(c => c.id === 'crvo');
  if (!chunk || chunk.length > 65536) return [];
  try {
    const cues: unknown = JSON.parse(new TextDecoder().decode(bytes.subarray(chunk.start, chunk.start + chunk.length)));
    if (!Array.isArray(cues) || !cues.length || cues.length > 512) return [];
    let previousEnd = 0;
    for (const cue of cues) {
      if (!cue || typeof cue.text !== 'string' || !cue.text.trim() || cue.text.length > 2000 || typeof cue.start !== 'number' || typeof cue.end !== 'number' || !Number.isFinite(cue.start) || !Number.isFinite(cue.end) || cue.start < previousEnd - 0.000001 || cue.end <= cue.start || cue.end > duration + 0.000001 || (cue.speaker !== undefined && cue.speaker !== 1 && cue.speaker !== 2)) return [];
      previousEnd = cue.end;
    }
    return cues;
  } catch { return []; }
}
/** Extra RIFF chunks are ignored by audio decoders and survive server caching. */
export function withPodcastCues(wav: Uint8Array, cues: PodcastCue[]): ArrayBuffer {
  podcastWavDuration(wav);
  const json = new TextEncoder().encode(JSON.stringify(cues));
  if (json.length > 65536) return wav.slice().buffer;
  const result = new Uint8Array(wav.length + 8 + json.length + json.length % 2);
  result.set(wav); result.set(new TextEncoder().encode('crvo'), wav.length);
  const view = new DataView(result.buffer); view.setUint32(wav.length + 4, json.length, true);
  result.set(json, wav.length + 8); view.setUint32(4, result.length - 8, true);
  return result.buffer;
}
export function activePodcastCue(cues: readonly PodcastCue[], seconds: number): number {
  if (!Number.isFinite(seconds) || seconds < 0) return -1;
  let low = 0, high = cues.length - 1, result = -1;
  while (low <= high) { const middle = (low + high) >>> 1; if (cues[middle].start <= seconds) { result = middle; low = middle + 1; } else high = middle - 1; }
  return result;
}
