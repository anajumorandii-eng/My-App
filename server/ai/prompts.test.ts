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

test('resolução recebe banca e subtópico pela validação e justifica cada etapa', () => {
  const payload = validateAiPayload('question-explanation', {
    board: 'FUVEST', topic: 'Funções', chapter: 'Função exponencial',
    subject: 'Matemática', prompt: 'Determine o tempo de duplicação.',
    selectedAnswer: '2 horas', correctAnswer: '2 horas', isCorrect: true,
    baseExplanation: 'Use o modelo exponencial.',
  });
  const prompt = buildAiPrompt('question-explanation', payload);
  assert.match(prompt, /Banca em foco: FUVEST/);
  assert.match(prompt, /Subtópico em foco: Função exponencial/);
  assert.match(prompt, /Em cada etapa mostre a ação, o princípio/);
  assert.match(prompt, /Se a aluna acertou/);
  assert.match(prompt, /Não invente frequência/);
});

test('revisão preserva o recorte de banca e capítulo e separa perguntas dos critérios', () => {
  const payload = validateAiPayload('review-tip', {
    board: 'Unicamp / Comvest', subject: 'Biologia', topic: 'Genética',
    chapter: 'Herança Sexual', chapters: 'Herança Sexual; Ligação Gênica',
    level: 30, daysSinceReview: 12,
  });
  const prompt = buildAiPrompt('review-tip', payload);
  assert.match(prompt, /Banca em foco: Unicamp \/ Comvest/);
  assert.match(prompt, /Subtópico em foco: Herança Sexual/);
  assert.match(prompt, /domínio baixo exige bases e pré-requisitos/);
  assert.match(prompt, /em bloco separado/);
  assert.match(prompt, /mini-exemplo resolvido por etapas/);
});

test('clientes antigos sem banca continuam válidos sem atribuição inventada', () => {
  const payload = validateAiPayload('review-tip', {
    subject: 'História', topic: 'Brasil Colônia', level: 80, daysSinceReview: 3,
  });
  assert.match(buildAiPrompt('review-tip', payload), /Banca não informada/);
  assert.throws(() => validateAiPayload('review-tip', { ...payload, board: 123 }));
  assert.throws(() => validateAiPayload('review-tip', { ...payload, chapters: 'x'.repeat(6001) }));
});


test('detalhamento inclui decisões intermediárias, limites de aplicação e rubrica da transferência', () => {
  const resolution = buildAiPrompt('question-explanation', validateAiPayload('question-explanation', {
    subject: 'Física', prompt: 'Calcule a aceleração.', selectedAnswer: '2', correctAnswer: '3',
    isCorrect: false, baseExplanation: 'Aplique a segunda lei de Newton.',
  }));
  assert.match(resolution, /resultado intermediário/);
  assert.match(resolution, /hipóteses e condições de validade/);
  assert.match(resolution, /primeiro ponto em que esse caminho/);
  assert.match(resolution, /solução comentada da transferência/);
  const review = buildAiPrompt('review-tip', validateAiPayload('review-tip', {
    subject: 'Biologia', topic: 'Genética', level: 90, daysSinceReview: 5,
  }));
  assert.match(review, /exemplos e contraexemplos/);
  assert.match(review, /dois pequenos enunciados autorais/);
  assert.match(review, /quatro perguntas de recuperação/);
  assert.match(review, /completa, parcial ou que precisa ser refeita/);
  assert.match(review, /não anuncie cobertura integral/);
});

test('redação por gênero não recebe roteiro de resposta discursiva', () => {
  for (const board of ['Fuvest', 'Unicamp', 'Unesp/Vunesp']) {
    const payload = validateAiPayload('answer-correction', { topic: 'Redação', subject: 'Redação', board, answerKind: 'essay', question: 'Escreva uma carta à direção.', studentAnswer: 'À direção, solicitamos um horário.' });
    const prompt = buildAiPrompt('answer-correction', payload);
    assert.match(prompt, /Avalie uma redação pelo gênero/);
    assert.doesNotMatch(prompt, /Comando.*Fonte.*Conceito.*Relação|conceito\/cálculo|resposta direta.*justificativa conceitual/i);
  }
});
test('modo de correção inválido é recusado', () => {
  assert.throws(() => validateAiPayload('answer-correction', { topic: 'Redação', subject: 'Redação', answerKind: 'inventado', question: 'Uma proposta', studentAnswer: 'Um texto' }), /answerKind/);
});

test('aprofundamento literário exige evidência, recorte e recuperação ativa sem diagnóstico inventado', () => {
  const prompt = buildAiPrompt('review-tip', validateAiPayload('review-tip', {
    topic: 'Obra de teste', subject: 'Literatura', chapter: 'Obra completa', board: 'UNICAMP',
    targetBoards: ['UNICAMP'], guideMode: 'literary-strategy', level: 40, daysSinceReview: 0,
    referenceText: '[F1] Análise editorial publicada',
  }));
  assert.match(prompt, /indício textual → escolha formal → efeito/);
  assert.match(prompt, /explicação em voz alta ou áudio/);
  assert.match(prompt, /não um dossiê editorial aprovado/);
  assert.doesNotMatch(prompt, /Domínio atual estimado: 40/);
});

test('guia combinado pede conexões, limites por tópico e palavras de comando sem atalhos de gabarito', () => {
  const prompt = buildAiPrompt('review-tip', validateAiPayload('review-tip', { topic: 'Ecologia + Evolução', subject: 'Biologia', guideMode: 'combined-strategy', level: 40, daysSinceReview: 0 }));
  assert.match(prompt, /Cubra cada recorte explicitamente/);
  assert.match(prompt, /Palavras-chave não são atalhos de gabarito/);
  assert.match(prompt, /Não omita silenciosamente um tópico/);
  assert.doesNotMatch(prompt, /Domínio atual estimado/);
});
