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

it('entrega marcações do áudio com offsets reais entre requisições e ignora marcas de outro texto', async () => {
 const {withPodcastCues}=await import('../lib/podcastTiming');
 const markers:any[]=[];const chunks:string[]=[];
 vi.stubGlobal('fetch',vi.fn(async(_url,init)=>{
  const text=JSON.parse(init.body).text;chunks.push(text);
  // The one-sample fixture keeps offsets measurable without a speech service.
  return {ok:true,arrayBuffer:async()=>withPodcastCues(new Uint8Array(wav()),[{start:0,end:1/24000,text:chunks.length===1?text:'Texto de outro episódio.'}])};
 }));
 const script=`${'Primeiro parágrafo com conceitos. '.repeat(70)}\nFim do episódio.`;
 const blob=await synthesizePodcastAudio(script,'Kore',undefined,{onCues:cues=>markers.push(...cues)});
 expect(chunks.length).toBeGreaterThan(1);expect(markers.map(c=>c.text)).toEqual(chunks);
 markers.forEach((cue,i)=>{expect(cue.start).toBeCloseTo(i/24000,10);expect(cue.end).toBeCloseTo((i+1)/24000,10);});
 expect(blob.size).toBe(44+chunks.length*2);
});
it('uma falha não publica uma sequência parcial de marcações', async () => {
 const onCues=vi.fn();let calls=0;
 vi.stubGlobal('fetch',vi.fn(async()=>++calls===1?{ok:true,arrayBuffer:async()=>wav()}:{ok:false,status:503,json:async()=>({error:'Interrompido'})}));
 await expect(synthesizePodcastAudio('Texto de teste. '.repeat(300),'Kore',undefined,{onCues})).rejects.toThrow('Interrompido');
 expect(onCues).not.toHaveBeenCalled();
});
