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

test('feedback discursivo da Unicamp exige a estrutura Comando → Fonte → Conceito → Relação', () => {
  const payload = validateAiPayload('discursive-feedback', {
    board: 'Unicamp',
    subject: 'História',
    prompt: 'Analise o processo.',
    modelAnswer: ['Ponto único'],
    studentAnswer: 'Minha resposta.',
  });
  const prompt = buildAiPrompt('discursive-feedback', payload);

  assert.match(prompt, /Comando → Fonte → Conceito → Relação/);
});

test('feedback discursivo da Unesp exige a estrutura Resposta direta → Conceito\\/cálculo → Explicação → Aplicação', () => {
  const payload = validateAiPayload('discursive-feedback', {
    board: 'Unesp',
    subject: 'Física',
    prompt: 'Calcule e explique.',
    modelAnswer: ['Ponto único'],
    studentAnswer: 'Minha resposta.',
  });
  const prompt = buildAiPrompt('discursive-feedback', payload);

  assert.match(prompt, /Resposta direta → Conceito\/cálculo → Explicação → Aplicação/);
});

test('exercício discursivo de banca gerado com board injeta a estrutura esperada', () => {
  const payload = validateAiPayload('backlog-exercise', {
    topic: 'Revolução Francesa',
    subject: 'História',
    mode: 'discursive',
    board: 'Unicamp',
  });
  const prompt = buildAiPrompt('backlog-exercise', payload);

  assert.match(prompt, /banca: Unicamp/);
  assert.match(prompt, /Comando → Fonte → Conceito → Relação/);
});

test('questão de transferência avisa explicitamente que segue uma correção anterior', () => {
  const payload = validateAiPayload('backlog-exercise', {
    topic: 'Estequiometria',
    subject: 'Química',
    mode: 'solve',
    transfer: true,
  });
  const prompt = buildAiPrompt('backlog-exercise', payload);

  assert.match(prompt, /QUESTÃO DE TRANSFERÊNCIA/);
});

test('explicação de conteúdo pede os 6 elementos estruturados', () => {
  const payload = validateAiPayload('content-explanation', {
    topic: 'Efeito Doppler',
    subject: 'Física',
    question: 'Por que o som muda de tom quando a ambulância passa?',
  });
  const prompt = buildAiPrompt('content-explanation', payload);

  assert.match(prompt, /intuição/);
  assert.match(prompt, /comoCai/);
  assert.match(prompt, /pegadinha/);
  assert.match(prompt, /checagem/);
  assert.match(prompt, /ambulância passa/);
  assert.match(prompt, /APENAS com um objeto JSON válido/);
});

test('correção de resposta localiza o primeiro ponto de ruptura, não "errou tudo"', () => {
  const payload = validateAiPayload('answer-correction', {
    topic: 'Segunda Lei de Newton',
    subject: 'Física',
    question: 'Um bloco de 2kg recebe uma força de 10N. Qual a aceleração?',
    studentAnswer: 'a = F + m = 12 m/s²',
  });
  const prompt = buildAiPrompt('answer-correction', payload);

  assert.match(prompt, /rupturaPoint/);
  assert.match(prompt, /não "errou tudo"/);
  assert.match(prompt, /padraoRecorrente/);
  assert.match(prompt, /a = F \+ m = 12 m\/s²/);
});

test('correção de resposta discursiva da Unesp aplica a estrutura da banca', () => {
  const payload = validateAiPayload('answer-correction', {
    topic: 'Fotossíntese',
    subject: 'Biologia',
    question: 'Explique o papel da luz na fotossíntese.',
    studentAnswer: 'A luz ativa a clorofila.',
    board: 'Unesp',
  });
  const prompt = buildAiPrompt('answer-correction', payload);

  assert.match(prompt, /Resposta direta → Conceito\/cálculo → Explicação → Aplicação/);
});


test('toda tarefa chamada pelo cliente tem rota, validação e prompt', async () => {
  // Regressão: o cliente chamava /api/ai/error-diagnosis, que nunca existiu no
  // servidor. O diagnóstico de erro do fluxo de questões falhava sempre, e a
  // tela só dizia "não consegui diagnosticar agora" — parecia instabilidade da
  // IA, não uma rota ausente. Este teste amarra as duas pontas.
  const fs = await import('node:fs/promises');
  const cliente = await fs.readFile(new URL('../../src/views/Questoes.tsx', import.meta.url), 'utf-8');
  const rotas = await fs.readFile(new URL('./routes.ts', import.meta.url), 'utf-8');

  const chamadas = [...cliente.matchAll(/requestAiText(?:Stream)?\('([a-z-]+)'/g)].map((m) => m[1]);
  assert.ok(chamadas.includes('error-diagnosis'), 'o fluxo de questões deve pedir o diagnóstico de erro');
  for (const tarefa of new Set(chamadas)) {
    assert.match(rotas, new RegExp(`path: '/${tarefa}'`), `falta a rota /${tarefa} no servidor`);
  }
});

test('diagnóstico da questão prioriza o relato da estudante quando ele existe', () => {
  const comRelato = buildAiPrompt('error-diagnosis', validateAiPayload('error-diagnosis', {
    prompt: 'Qual organela realiza a respiração celular?',
    subject: 'Biologia',
    selectedAnswer: 'Cloroplasto',
    correctAnswer: 'Mitocôndria',
    studentAccount: 'confundi com a organela da fotossíntese',
  }));
  assert.match(comRelato, /priorize isto/);
  assert.match(comRelato, /confundi com a organela da fotossíntese/);

  const semRelato = buildAiPrompt('error-diagnosis', validateAiPayload('error-diagnosis', {
    prompt: 'Qual organela realiza a respiração celular?',
    subject: 'Biologia',
    selectedAnswer: 'Cloroplasto',
    correctAnswer: 'Mitocôndria',
  }));
  // Sem relato, o modelo tem de reconstruir o caminho a partir da alternativa
  // marcada, e é avisado de que a hipótese vale menos.
  assert.match(semRelato, /Ela não soube dizer por que errou/);
  assert.match(semRelato, /Sem relato, use "baixa"/);
});
