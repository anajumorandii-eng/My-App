import assert from 'node:assert/strict';
import test from 'node:test';
import { classifyFlashcard, resolveFlashcardClassification } from './flashcardTaxonomy';
import { Flashcard } from '../types';

function card(patch: Partial<Flashcard>): Flashcard {
  return {
    id: 'card-1',
    subject: 'Biologia',
    topicId: 'bio_ecologia',
    chapter: 'Ecologia',
    front: 'Pergunta',
    back: 'Resposta',
    tags: [],
    source: 'sistema_priorizado',
    ...patch,
  };
}

test('lê prioridade explícita do sistema priorizado', () => {
  assert.deepEqual(classifyFlashcard(card({
    tags: ['prioridade_essencial', '01_basico_mapa_minimo'],
  })), {
    priority: 'essencial',
    trainingType: 'objetivos',
    classificationOrigin: 'tagged',
  });
});

test('classifica lembre_se como regular e objetivo herdado', () => {
  assert.deepEqual(classifyFlashcard(card({
    source: 'lembre_se',
    tags: ['lembrese'],
  })), {
    priority: 'regular',
    trainingType: 'objetivos',
    classificationOrigin: 'inherited',
  });
});

test('lembre_se prevalece sobre metadados explícitos conflitantes', () => {
  assert.deepEqual(classifyFlashcard(card({
    source: 'lembre_se',
    priority: 'essencial',
    trainingType: 'discursivos',
    classificationOrigin: 'tagged',
  })), {
    priority: 'regular',
    trainingType: 'objetivos',
    classificationOrigin: 'inherited',
  });
});

test('classifica cada tag de modelo na família de treino correta', () => {
  const cases: Array<[string, Flashcard['trainingType']]> = [
    ['01_basico_mapa_minimo', 'objetivos'],
    ['02_vocabulario_de_precisao', 'objetivos'],
    ['03_por_que_funciona', 'objetivos'],
    ['04_causa_consequencia', 'objetivos'],
    ['05_comparacao_e_fronteira_conceitual', 'pegadinhas'],
    ['06_grafico_tabela_texto_ou_experimento', 'interpretacao'],
    ['07_objetiva_eliminacao_de_distratores', 'objetivos'],
    ['08_objetiva_decisao_sob_tempo', 'objetivos'],
    ['09_fuvest_1a_fase_assunto_disfarcado', 'padroes_bancas'],
    ['10_enem_contexto_e_habilidade', 'padroes_bancas'],
    ['11_fuvest_2a_fase_resposta_pontuavel', 'discursivos'],
    ['12_unicamp_2a_fase_c_f_c_r', 'discursivos'],
    ['13_vunesp_2a_fase_d_c_e_a', 'discursivos'],
    ['14_autopsia_do_erro', 'pegadinhas'],
    ['15_cenario_e_se', 'objetivos'],
    ['16_conexao_interdisciplinar', 'objetivos'],
    ['17_sintese_de_alta_incidencia', 'objetivos'],
    ['18_questao_mista_transferencia_maxima', 'objetivos'],
  ];

  for (const [tag, trainingType] of cases) {
    assert.deepEqual(classifyFlashcard(card({
      tags: ['prioridade_alta', tag],
    })), {
      priority: 'alta',
      trainingType,
      classificationOrigin: 'tagged',
    }, tag);
  }
});

test('usa precedência determinística independente da ordem das tags', () => {
  const tags = [
    '01_basico_mapa_minimo',
    '17_sintese_de_alta_incidencia',
    '18_questao_mista_transferencia_maxima',
  ];

  assert.equal(classifyFlashcard(card({
    tags: ['prioridade_regular', ...tags],
  })).trainingType, 'objetivos');
  assert.equal(classifyFlashcard(card({
    tags: ['prioridade_regular', ...tags.reverse()],
  })).trainingType, 'objetivos');

  const mixedFamilies = [
    '01_basico_mapa_minimo',
    '11_fuvest_2a_fase_resposta_pontuavel',
  ];
  assert.deepEqual(classifyFlashcard(card({
    tags: ['prioridade_alta', ...mixedFamilies],
  })), {
    priority: 'alta',
    trainingType: 'discursivos',
    classificationOrigin: 'tagged',
  });
  assert.deepEqual(classifyFlashcard(card({
    tags: ['prioridade_alta', ...mixedFamilies.reverse()],
  })), {
    priority: 'alta',
    trainingType: 'discursivos',
    classificationOrigin: 'tagged',
  });
});

test('usa fallback quando faltam tags válidas de prioridade ou modelo', () => {
  assert.deepEqual(classifyFlashcard(card({
    tags: ['prioridade_invalida', 'tag_desconhecida'],
  })), {
    priority: 'regular',
    trainingType: 'objetivos',
    classificationOrigin: 'fallback',
  });
});

test('recognizes all 18 legacy signatures as approved model equivalents', () => {
  const cases: Array<[
    legacyTags: string[],
    approvedTag: string,
    trainingType: Flashcard['trainingType'],
  ]> = [
    [['recuperacao_ativa'], '01_basico_mapa_minimo', 'objetivos'],
    [['conceitos'], '02_vocabulario_de_precisao', 'objetivos'],
    [['causa_efeito'], '03_por_que_funciona', 'objetivos'],
    [['raciocinio_causal'], '04_causa_consequencia', 'objetivos'],
    [['pegadinha', 'comparacao'], '05_comparacao_e_fronteira_conceitual', 'pegadinhas'],
    [['graficos_tabelas', 'fontes'], '06_grafico_tabela_texto_ou_experimento', 'interpretacao'],
    [['distratores', 'prova_objetiva'], '07_objetiva_eliminacao_de_distratores', 'objetivos'],
    [['gestao_tempo', 'prova_objetiva'], '08_objetiva_decisao_sob_tempo', 'objetivos'],
    [['fuvest', 'primeira_fase', 'prova_objetiva'], '09_fuvest_1a_fase_assunto_disfarcado', 'padroes_bancas'],
    [['enem', 'prova_objetiva', 'aplicacao'], '10_enem_contexto_e_habilidade', 'padroes_bancas'],
    [['fuvest', 'segunda_fase', 'discursiva'], '11_fuvest_2a_fase_resposta_pontuavel', 'discursivos'],
    [['unicamp', 'discursiva', 'fontes'], '12_unicamp_2a_fase_c_f_c_r', 'discursivos'],
    [['vunesp', 'discursiva', 'unesp', 'famerp', 'unifesp'], '13_vunesp_2a_fase_d_c_e_a', 'discursivos'],
    [['caderno_erros', 'metacognicao'], '14_autopsia_do_erro', 'pegadinhas'],
    [['contrafactual'], '15_cenario_e_se', 'objetivos'],
    [['interdisciplinar'], '16_conexao_interdisciplinar', 'objetivos'],
    [['revisao_final', 'alta_incidencia'], '17_sintese_de_alta_incidencia', 'objetivos'],
    [['transferencia', 'discursiva'], '18_questao_mista_transferencia_maxima', 'objetivos'],
  ];

  for (const [legacyTags, approvedTag, trainingType] of cases) {
    const expected = {
      priority: 'alta',
      trainingType,
      classificationOrigin: 'tagged',
    };

    assert.deepEqual(classifyFlashcard(card({
      tags: ['prioridade_alta', ...legacyTags],
    })), expected, approvedTag);
    assert.deepEqual(classifyFlashcard(card({
      tags: ['prioridade_alta', approvedTag],
    })), expected, approvedTag);
  }
});

test('legacy signatures are independent from tag order', () => {
  const tags = ['fontes', 'tag_de_assunto', 'discursiva', 'unicamp', 'prioridade_essencial'];

  assert.deepEqual(classifyFlashcard(card({ tags })), {
    priority: 'essencial',
    trainingType: 'discursivos',
    classificationOrigin: 'tagged',
  });
  assert.deepEqual(classifyFlashcard(card({ tags: [...tags].reverse() })), {
    priority: 'essencial',
    trainingType: 'discursivos',
    classificationOrigin: 'tagged',
  });
});

test('legacy transfer signature takes precedence over generic discursiva tag', () => {
  assert.deepEqual(classifyFlashcard(card({
    tags: ['prioridade_alta', 'transferencia', 'discursiva'],
  })), {
    priority: 'alta',
    trainingType: 'objetivos',
    classificationOrigin: 'tagged',
  });
});

test('falls back for incompatible models or generic discursiva alone', () => {
  const fallback = {
    priority: 'regular',
    trainingType: 'objetivos',
    classificationOrigin: 'fallback',
  };

  assert.deepEqual(classifyFlashcard(card({
    tags: ['prioridade_alta', 'transferencia', 'discursiva', 'fuvest', 'segunda_fase'],
  })), fallback);
  assert.deepEqual(classifyFlashcard(card({
    tags: ['prioridade_alta', 'discursiva'],
  })), fallback);
});

test('falls back for missing invalid or conflicting priorities', () => {
  const fallback = {
    priority: 'regular',
    trainingType: 'objetivos',
    classificationOrigin: 'fallback',
  };

  assert.deepEqual(classifyFlashcard(card({ tags: ['recuperacao_ativa'] })), fallback);
  assert.deepEqual(classifyFlashcard(card({
    tags: ['prioridade_invalida', 'recuperacao_ativa'],
  })), fallback);
  assert.deepEqual(classifyFlashcard(card({
    tags: ['prioridade_alta', 'prioridade_essencial', 'recuperacao_ativa'],
  })), fallback);
});

test('lembre_se keeps its invariant with invalid materialized metadata', () => {
  assert.deepEqual(classifyFlashcard(card({
    source: 'lembre_se',
    priority: 'invalida' as Flashcard['priority'],
    trainingType: 'invalido' as Flashcard['trainingType'],
    classificationOrigin: 'invalida' as Flashcard['classificationOrigin'],
  })), {
    priority: 'regular',
    trainingType: 'objetivos',
    classificationOrigin: 'inherited',
  });
});

test('invalid materialized enums return a safe fallback instead of masking tags', () => {
  const invalidMetadata: Partial<Flashcard>[] = [
    { priority: 'urgente' as Flashcard['priority'] },
    { trainingType: 'leitura' as Flashcard['trainingType'] },
    { classificationOrigin: 'manual' as Flashcard['classificationOrigin'] },
  ];
  const fallback = {
    priority: 'regular',
    trainingType: 'objetivos',
    classificationOrigin: 'fallback',
  };

  for (const invalid of invalidMetadata) {
    assert.deepEqual(classifyFlashcard(card({
      tags: ['prioridade_alta', '06_grafico_tabela_texto_ou_experimento'],
      priority: 'alta',
      trainingType: 'interpretacao',
      classificationOrigin: 'tagged',
      ...invalid,
    })), fallback);
  }
});

test('materialized origin incompatible with sistema_priorizado returns safe fallback', () => {
  assert.deepEqual(classifyFlashcard(card({
    tags: ['prioridade_alta', '06_grafico_tabela_texto_ou_experimento'],
    priority: 'alta',
    trainingType: 'interpretacao',
    classificationOrigin: 'inherited',
  })), {
    priority: 'regular',
    trainingType: 'objetivos',
    classificationOrigin: 'fallback',
  });
});

test('valid but stale materialized metadata cannot mask tag derivation', () => {
  assert.deepEqual(classifyFlashcard(card({
    tags: ['prioridade_alta', '06_grafico_tabela_texto_ou_experimento'],
    priority: 'essencial',
    trainingType: 'objetivos',
    classificationOrigin: 'tagged',
  })), {
    priority: 'alta',
    trainingType: 'interpretacao',
    classificationOrigin: 'tagged',
  });
});

test('lembre_se validates absent exact divergent partial and invalid materialized states', () => {
  const inherited = {
    priority: 'regular',
    trainingType: 'objetivos',
    classificationOrigin: 'inherited',
  } as const;
  const cases: Array<[
    label: string,
    metadata: Partial<Flashcard>,
    materializedConsistent: boolean,
  ]> = [
    ['absent', {}, true],
    ['exact', inherited, true],
    ['divergent', { ...inherited, priority: 'essencial' }, false],
    ['partial', { priority: 'regular' }, false],
    ['invalid', {
      ...inherited,
      classificationOrigin: 'manual' as Flashcard['classificationOrigin'],
    }, false],
  ];

  for (const [label, metadata, materializedConsistent] of cases) {
    const legacyCard = card({ source: 'lembre_se', tags: ['lembrese'], ...metadata });
    assert.deepEqual(resolveFlashcardClassification(legacyCard), {
      classification: inherited,
      materializedConsistent,
    }, label);
    assert.deepEqual(classifyFlashcard(legacyCard), inherited, label);
  }
});
