import assert from 'node:assert/strict';
import test from 'node:test';
import { pcmToWav } from './ttsService';

test('gera um cabeçalho RIFF/WAVE válido de 44 bytes com os campos corretos', () => {
  const pcm = Buffer.from(new Uint8Array(1000)); // 1000 bytes of silence
  const wav = pcmToWav(pcm, 24000, 1, 16);

  assert.equal(wav.length, 44 + pcm.length);
  assert.equal(wav.toString('ascii', 0, 4), 'RIFF');
  assert.equal(wav.readUInt32LE(4), 36 + pcm.length);
  assert.equal(wav.toString('ascii', 8, 12), 'WAVE');
  assert.equal(wav.toString('ascii', 12, 16), 'fmt ');
  assert.equal(wav.readUInt32LE(16), 16); // fmt chunk size
  assert.equal(wav.readUInt16LE(20), 1); // PCM format
  assert.equal(wav.readUInt16LE(22), 1); // channels
  assert.equal(wav.readUInt32LE(24), 24000); // sample rate
  assert.equal(wav.readUInt32LE(28), 24000 * 1 * 2); // byte rate
  assert.equal(wav.readUInt16LE(32), 2); // block align
  assert.equal(wav.readUInt16LE(34), 16); // bit depth
  assert.equal(wav.toString('ascii', 36, 40), 'data');
  assert.equal(wav.readUInt32LE(40), pcm.length);
});

test('preserva os bytes originais do PCM após o cabeçalho', () => {
  const pcm = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);
  const wav = pcmToWav(pcm);
  assert.deepEqual(wav.subarray(44), pcm);
});

test('calcula corretamente byte rate e block align para outras configurações', () => {
  const pcm = Buffer.alloc(10);
  const wav = pcmToWav(pcm, 16000, 2, 16); // estéreo, 16kHz
  assert.equal(wav.readUInt16LE(22), 2); // channels
  assert.equal(wav.readUInt32LE(24), 16000); // sample rate
  assert.equal(wav.readUInt16LE(32), 4); // block align = channels * bitDepth/8
  assert.equal(wav.readUInt32LE(28), 16000 * 4); // byte rate
});
