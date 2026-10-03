import assert from 'node:assert/strict';
import test from 'node:test';
import { splitPodcastScript, mergePodcastWav } from './podcastChunks';
import { pcmToWav } from '../../server/podcast/ttsService';

test('divide roteiro longo preservando o falante e todo o conteúdo', () => {
  const script = `Host1: ${'Explicação importante. '.repeat(150)}\nHost2: Entendi o exemplo.`;
  const parts = splitPodcastScript(script);
  assert.ok(parts.length > 1);
  assert.ok(parts.every(p => p.length <= 1800));
  assert.ok(parts.slice(0, -1).every(p => p.startsWith('Host1:')));
  assert.ok(parts.at(-1)?.includes('Host2: Entendi'));
  const normalize = (s: string) => s.replace(/Host[12]:/g, '').replace(/\s+/g, ' ').trim();
  assert.equal(normalize(parts.join(' ')), normalize(script));
});
test('concatena WAV sem inserir cabeçalhos no meio do áudio', () => {
  const first = pcmToWav(Buffer.from([1, 2, 3, 4]));
  const second = pcmToWav(Buffer.from([5, 6]));
  const merged = new Uint8Array(mergePodcastWav([first, second]));
  assert.deepEqual([...merged.slice(44)], [1, 2, 3, 4, 5, 6]);
  assert.equal(new DataView(merged.buffer).getUint32(40, true), 6);
  assert.throws(() => mergePodcastWav([first, pcmToWav(Buffer.from([1, 2]), 16000)]), /compatíveis/);
});
test('recusa roteiro vazio ou sem rótulos em modo de duas pessoas', () => {
  assert.throws(() => splitPodcastScript('  '));
  assert.throws(() => splitPodcastScript('texto sem falantes', true), /Host1/);
});

test('aceita WAV com blocos extras retornados por serviços de voz', () => {
  const original = pcmToWav(Buffer.from([1, 2]));
  const extended = Buffer.concat([original.subarray(0, 36), Buffer.from('JUNK'), Buffer.from([2, 0, 0, 0, 0, 0]), original.subarray(36)]);
  extended.writeUInt32LE(extended.length - 8, 4);
  assert.deepEqual([...new Uint8Array(mergePodcastWav([extended])).slice(44)], [1, 2]);
});
test('trechos respeitam limite em bytes UTF-8, inclusive caracteres de três bytes', () => {
  const chunks = splitPodcastScript('漢'.repeat(1800));
  assert.ok(chunks.length > 1);
  assert.ok(chunks.every(chunk => Buffer.byteLength(chunk) <= 4500));
  assert.equal(chunks.join(''), '漢'.repeat(1800));
});
