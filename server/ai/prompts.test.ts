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

test('diagnóstico de erro a partir do relato manual pede JSON estruturado', () => {
  const payload = validateAiPayload('error-hypothesis', {
    topic: 'Trigonometria',
    subject: 'Física',
    notes: 'Não vi que precisava decompor a força em componentes.',
  });
  const prompt = buildAiPrompt('error-hypothesis', payload);

  assert.match(prompt, /primeiro ponto de ruptura/);
  assert.match(prompt, /Não vi que precisava decompor/);
  assert.match(prompt, /concept_confusion/);
  assert.match(prompt, /microbloco_prerequisito/);
  assert.match(prompt, /APENAS com um objeto JSON válido/);
  assert.match(prompt, /Nunca marque confidence como "alta"/);
});

test('diagnóstico de erro a partir de uma questão respondida usa a resposta escolhida', () => {
  const payload = validateAiPayload('error-hypothesis', {
    topic: 'Genética',
    subject: 'Biologia',
    questionPrompt: 'Qual a proporção fenotípica de Aa x Aa?',
    selectedAnswer: '1:1',
    correctAnswer: '3:1',
  });
  const prompt = buildAiPrompt('error-hypothesis', payload);

  assert.match(prompt, /Qual a proporção fenotípica/);
  assert.match(prompt, /Resposta escolhida pelo aluno: 1:1/);
  assert.match(prompt, /Resposta correta: 3:1/);
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

