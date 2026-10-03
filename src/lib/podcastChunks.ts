const CHUNK_SIZE = 1800;
// Cada trecho mantém a identificação do falante, inclusive quando uma fala
// longa precisa ser repartida em mais de uma requisição.
export function splitPodcastScript(script: string, dialogue = false): string[] {
  const text = script.trim();
  if (!text || text.length > 24000) throw new Error('O roteiro deve ter entre 1 e 24000 caracteres.');
  if (dialogue && (!/^Host1:/m.test(text) || !/^Host2:/m.test(text) || text.split('\n').some(line => line.trim() && !/^Host[12]:\s*\S/.test(line)))) {
    throw new Error('O roteiro precisa identificar as duas pessoas como Host1: e Host2:. Gere novamente.');
  }
  const units = text.split(/\n+/).filter(Boolean);
  const chunks: string[] = [];
  let current = '';
  for (const unit of units) {
    const label = unit.match(/^Host[12]:\s*/)?.[0] ?? '';
    let remaining = unit.slice(label.length).trim();
    while (remaining) {
      const limit = CHUNK_SIZE - label.length;
      let end = 0; let bytes = new TextEncoder().encode(label).length;
      for (const char of remaining) { const count = new TextEncoder().encode(char).length; if (end + char.length > limit || bytes + count > 4500) break; end += char.length; bytes += count; }
      if (end < remaining.length) {
        const sentenceEnd = remaining.slice(0, end).search(/[.!?]\s+[^.!?]*$/);
        const spaceEnd = remaining.lastIndexOf(' ', end);
        if (sentenceEnd > limit / 2) end = sentenceEnd + 1;
        else if (spaceEnd > 0) end = spaceEnd;
      }
      const part = label + remaining.slice(0, end).trim();
      if (current && (current.length + part.length + 1 > CHUNK_SIZE || new TextEncoder().encode(current + '\n' + part).length > 4500)) { chunks.push(current); current = ''; }
      current = current ? `${current}\n${part}` : part;
      remaining = remaining.slice(end).trim();
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

// Normaliza o WAV PCM, inclusive respostas com blocos adicionais, antes de
// concatenar os dados. Cabeçalhos internos não entram na faixa de áudio.
export function mergePodcastWav(parts: Uint8Array[]): ArrayBuffer {
  if (!parts.length) throw new Error('Nenhum trecho de áudio recebido.');
  const fail = () => { throw new Error('Os trechos de áudio não são WAV compatíveis. Tente gerar novamente.'); };
  const tag = (data: Uint8Array, offset: number) => String.fromCharCode(...data.slice(offset, offset + 4));
  let format: Uint8Array | null = null;
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (const part of parts) {
    if (part.length < 44 || tag(part, 0) !== 'RIFF' || tag(part, 8) !== 'WAVE') fail();
    const view = new DataView(part.buffer, part.byteOffset, part.byteLength);
    let fmt: Uint8Array | null = null; let data: Uint8Array | null = null;
    for (let offset = 12; offset + 8 <= part.length;) {
      const length = view.getUint32(offset + 4, true); const start = offset + 8;
      if (start + length > part.length) fail();
      if (tag(part, offset) === 'fmt ' && length >= 16) fmt = part.slice(start, start + 16);
      if (tag(part, offset) === 'data') data = part.slice(start, start + length);
      offset = start + length + (length % 2);
    }
    if (!fmt || !data) fail();
    const fmtView = new DataView(fmt!.buffer, fmt!.byteOffset, fmt!.byteLength);
    if (fmtView.getUint16(0, true) !== 1 || fmtView.getUint16(2, true) !== 1 || fmtView.getUint16(14, true) !== 16 || data!.length % 2) fail();
    if (format && format.some((byte, i) => byte !== fmt![i])) fail();
    format = fmt; chunks.push(data!); size += data!.length;
  }
  const merged = new Uint8Array(44 + size); const view = new DataView(merged.buffer); const encoder = new TextEncoder();
  merged.set(encoder.encode('RIFF')); view.setUint32(4, 36 + size, true); merged.set(encoder.encode('WAVEfmt '), 8);
  view.setUint32(16, 16, true); merged.set(format!, 20); merged.set(encoder.encode('data'), 36); view.setUint32(40, size, true);
  let offset = 44; for (const chunk of chunks) { merged.set(chunk, offset); offset += chunk.length; }
  return merged.buffer;
}
