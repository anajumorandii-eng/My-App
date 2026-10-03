import { afterEach, expect, it, vi } from 'vitest';
vi.mock('../lib/auth', () => ({ getFirebaseIdToken: async () => 'test-token' }));
import { synthesizePodcastAudio, PodcastAudioError } from '../lib/podcastAudio';
function wav() {
  const result = new Uint8Array(46); const view = new DataView(result.buffer);
  result.set(new TextEncoder().encode('RIFF')); result.set(new TextEncoder().encode('WAVE'), 8);
  result.set(new TextEncoder().encode('fmt '), 12); result.set(new TextEncoder().encode('data'), 36);
  view.setUint32(4, 38, true); view.setUint32(16, 16, true); view.setUint16(20, 1, true);
  view.setUint16(22, 1, true); view.setUint32(24, 24000, true); view.setUint32(28, 48000, true);
  view.setUint16(32, 2, true); view.setUint16(34, 16, true); view.setUint32(40, 2, true);
  return result.buffer;
}
afterEach(() => vi.unstubAllGlobals());
it('envia configurações em cada trecho e entrega um WAV único com progresso', async () => {
  const bodies: any[] = []; const progress: number[] = [];
  vi.stubGlobal('fetch', vi.fn(async (_url, options) => { bodies.push(JSON.parse(options.body)); return { ok: true, arrayBuffer: async () => wav() }; }));
  const options = { speakers: 2 as const, secondVoice: 'Puck', pace: 'natural' as const, tone: 'acolhedor' as const };
  const blob = await synthesizePodcastAudio(`Host1: ${'Conceito com exemplo. '.repeat(150)}\nHost2: Entendi.`, 'Kore', options, { onProgress: done => progress.push(done) });
  expect(bodies.length).toBeGreaterThan(1);
  expect(bodies.every(b => b.text.length <= 1800 && b.options.speakers === 2 && b.options.secondVoice === 'Puck')).toBe(true);
  expect(blob.size).toBe(44 + bodies.length * 2);
  expect(progress).toEqual(bodies.map((_, i) => i + 1));
});
it('interrompe ao falhar um trecho, preservando o erro útil do servidor', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, status: 503, json: async () => ({ error: 'Voz indisponível', code: 'TTS_UNAVAILABLE' }) })));
  await expect(synthesizePodcastAudio('Explicação.', 'Kore')).rejects.toMatchObject({ name: 'PodcastAudioError', status: 503, code: 'TTS_UNAVAILABLE' });
});
it('cancelamento antes da síntese impede requisições ao servidor', async () => {
  const fetch = vi.fn(); vi.stubGlobal('fetch', fetch);
  const controller = new AbortController(); controller.abort();
  await expect(synthesizePodcastAudio('Explicação.', 'Kore', undefined, { signal: controller.signal })).rejects.toThrow();
  expect(fetch).not.toHaveBeenCalled();
});
