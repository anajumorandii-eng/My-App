import assert from 'node:assert/strict';
import test from 'node:test';
import { buildAiPrompt } from './prompts';
import { validateAiPayload } from './validation';
test('modo de revisão prioriza a banca sem diagnosticar domínio ou inventar evidência', () => {
  const prompt = buildAiPrompt('review-tip', validateAiPayload('review-tip', { topic: 'Geometria Plana', subject: 'Matemática', board: 'FUVEST', chapter: 'Ângulos em Polígonos', guideMode: 'review-summary', level: 40, daysSinceReview: 0, referenceText: '[F1] Fonte de conceitos' }));
  for (const required of ['FUVEST', 'Ângulos em Polígonos', '600 a 900', 'evidência insuficiente', 'Recuperação sem consulta', 'Critérios para conferir', '[F1] Fonte de conceitos', 'LaTeX']) assert.ok(prompt.includes(required), required);
  assert.doesNotMatch(prompt, /Domínio atual estimado|Desenvolva um caderno de estudo/);
});
