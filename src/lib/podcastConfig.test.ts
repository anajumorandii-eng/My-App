import assert from 'node:assert/strict';
import test from 'node:test';
import { resolvePodcastVoice } from './podcastConfig';
const voices = ['Kore', 'Puck'].map(name => ({ value: `pt-BR-Chirp3-HD-${name}`, label: name }));
test('preferências de vozes removidas migram para vozes diferentes do catálogo', () => {
  assert.equal(resolvePodcastVoice('pt-BR-Neural2-A', voices), voices[0].value);
  assert.equal(resolvePodcastVoice('pt-BR-Standard-B', voices, 'Puck'), voices[1].value);
  assert.equal(resolvePodcastVoice('Puck', voices), voices[1].value);
  assert.equal(resolvePodcastVoice('pt-BR-Neural2-A', []), 'pt-BR-Neural2-A');
});

test('migração de diálogo preserva uma voz válida e escolhe outra diferente', async () => {
  const { resolvePodcastVoices } = await import('./podcastConfig');
  assert.deepEqual(resolvePodcastVoices('Puck', 'pt-BR-Standard-B', voices), { voiceName: voices[1].value, secondVoice: voices[0].value });
  assert.deepEqual(resolvePodcastVoices('pt-BR-Neural2-A', 'Kore', voices), { voiceName: voices[1].value, secondVoice: voices[0].value });
  assert.deepEqual(resolvePodcastVoices('Kore', 'Kore', voices), { voiceName: voices[0].value, secondVoice: voices[0].value });
});
