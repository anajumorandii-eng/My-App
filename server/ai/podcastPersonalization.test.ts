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
  for (const settings of [{ speakers: 3 }, { durationMinutes: 100 }, { durationMinutes: 2.5 }, { format: 'x' }, { sourceText: 'x'.repeat(24001) }]) {
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

test('aprofundamento multibanca mantém fontes e exige mecanismo, limites e recuperação', () => {
  const payload = validateAiPayload('podcast-script', { ...base, targetBoards: ['Fuvest', 'Unicamp', 'UNESP'], level: 'avancado', sourceText: '[F1] Questão fornecida' });
  const prompt = buildAiPrompt('podcast-script', payload);
  assert.match(prompt, /FUVEST, UNICAMP, UNESP/);
  assert.match(prompt, /mecanismo causal/);
  assert.match(prompt, /recuperação sem consulta/);
  assert.match(prompt, /F1/);
  assert.doesNotThrow(() => validateAiPayload('podcast-script', { ...base, targetBoards: [] }));
  assert.throws(() => validateAiPayload('podcast-script', { ...base, targetBoards: ['x'.repeat(101)] }));
});

test('a reflexão orienta perguntas sobre o entendimento, sem simular audição ou diagnóstico', () => {
  const payload = validateAiPayload('podcast-script', { ...base, learnerReflection: 'Lembro o nome, mas não consigo explicar o mecanismo.' });
  const prompt = buildAiPrompt('podcast-script', payload);
  assert.match(prompt, /comparar a explicação inicial e a revisada/);
  assert.match(prompt, /Áudio não transcrito não foi ouvido/);
  assert.match(prompt, /não consigo explicar o mecanismo/);
});

test('podcast de banca específica ignora outras bancas recebidas por cliente antigo', () => {
 const payload=validateAiPayload('podcast-script',{...base,exam:'COMVEST',targetBoards:['FUVEST','ENEM']});
 assert.deepEqual(payload.targetBoards,['UNICAMP']);
 const prompt=buildAiPrompt('podcast-script',payload);
 assert.match(prompt,/Banca exclusiva deste episódio: UNICAMP/);
 assert.match(prompt,/Não distribua o tempo entre outras bancas/);
 assert.match(prompt,/Sem fontes suficientes desta banca, declare a limitação/);
 assert.doesNotMatch(prompt,/Bancas consideradas neste estudo|FUVEST|ENEM/);
});
test('foco geral continua admitindo várias bancas e chamadas antigas sem banca', () => {
 const prompt=buildAiPrompt('podcast-script',validateAiPayload('podcast-script',{...base,exam:'Geral',targetBoards:['Fuvest','Unicamp']}));
 assert.match(prompt,/Bancas consideradas neste estudo: FUVEST, UNICAMP/);
 assert.doesNotMatch(prompt,/Banca exclusiva/);
 assert.match(buildAiPrompt('podcast-script',validateAiPayload('podcast-script',base)),/origens disponíveis nas fontes/);
});
