import assert from 'node:assert/strict';
import test from 'node:test';
import { buildAiPrompt } from './prompts';
import { validateAiPayload } from './validation';

test('prompt socrático preserva a identidade e os dados da aluna', () => {
  const payload = validateAiPayload('socratic', {
    question: 'Como começo?',
    topic: 'Estequiometria',
  });
  const prompt = buildAiPrompt('socratic', payload);

  assert.match(prompt, /Tutor Socrático/);
  assert.match(prompt, /Estequiometria/);
  assert.match(prompt, /Como começo\?/);
  assert.match(prompt, /não é dar a resposta pronta/);
});

test('modo inválido de backlog usa exercício direto como fallback', () => {
  const payload = validateAiPayload('backlog-exercise', {
    topic: 'Funções',
    subject: 'Matemática',
    mode: 'desconhecido',
  });
  const prompt = buildAiPrompt('backlog-exercise', payload);

  assert.match(prompt, /Crie uma questão nova e direta/);
});

test('feedback discursivo enumera todos os pontos-chave', () => {
  const payload = validateAiPayload('discursive-feedback', {
    board: 'Fuvest',
    subject: 'Biologia',
    prompt: 'Explique o fenômeno.',
    modelAnswer: ['Primeiro ponto', 'Segundo ponto'],
    studentAnswer: 'Minha resposta.',
  });
  const prompt = buildAiPrompt('discursive-feedback', payload);

  assert.match(prompt, /- Primeiro ponto\n- Segundo ponto/);
});

