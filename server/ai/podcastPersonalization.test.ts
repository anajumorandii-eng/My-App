import assert from 'node:assert/strict';
import test from 'node:test';
import { validateAiPayload } from './validation';
import { buildAiPrompt } from './prompts';

const base = { title: 'Membranas', subject: 'Biologia', topic: 'Membranas celulares' };
test('podcast preserva duração, participantes, didática e fontes na geração', () => {
  const payload = validateAiPayload('podcast-script', { ...base, speakers: 2, durationMinutes: 12, format: 'perguntas', level: 'iniciante', pace: 'tranquilo', tone: 'acolhedor', hostStyle: 'professor', cohostStyle: 'curioso', focus: 'Explique osmose', sourceText: 'Fonte: a membrana é seletiva.', exam: 'Fuvest' });
  assert.equal(payload.durationMinutes, 12);
  const prompt = buildAiPrompt('podcast-script', payload);
  for (const fragment of ['12 minutos', 'Host1:', 'Host2:', 'osmose', 'membrana é seletiva', 'Fuvest', 'iniciante', 'perguntas', 'curioso']) assert.ok(prompt.includes(fragment), fragment);
  assert.match(prompt, /1560/);
});
test('podcast rejeita configurações inválidas e fontes exageradas', () => {
  for (const settings of [{ speakers: 3 }, { durationMinutes: 100 }, { durationMinutes: 2.5 }, { format: 'x' }, { sourceText: 'x'.repeat(12001) }]) {
    assert.throws(() => validateAiPayload('podcast-script', { ...base, ...settings }));
  }
});
test('podcast com uma pessoa pede apenas um narrador e mantém pedidos antigos válidos', () => {
  const payload = validateAiPayload('podcast-script', { ...base, speakers: 1, durationMinutes: 3 });
  assert.match(buildAiPrompt('podcast-script', payload), /um narrador/);
  assert.doesNotThrow(() => validateAiPayload('podcast-script', base));
});

test('aceita combinação de títulos de três fontes longas', () => {
  const topic = Array.from({ length: 3 }, () => 'Fisiologia e mecanismos de coordenação, sinalização e regulação do organismo '.repeat(2)).join(', ');
  assert.ok(topic.length > 300 && topic.length < 1200);
  assert.equal(validateAiPayload('podcast-script', { ...base, topic }).topic, topic.trim());
});
