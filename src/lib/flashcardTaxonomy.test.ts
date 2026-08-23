import assert from 'node:assert/strict';
import test from 'node:test';
import { classifyFlashcard } from './flashcardTaxonomy';
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
    '09_fuvest_1a_fase_assunto_disfarcado',
    '05_comparacao_e_fronteira_conceitual',
    '06_grafico_tabela_texto_ou_experimento',
    '11_fuvest_2a_fase_resposta_pontuavel',
  ];

  assert.equal(classifyFlashcard(card({
    tags: ['prioridade_regular', ...tags],
  })).trainingType, 'discursivos');
  assert.equal(classifyFlashcard(card({
    tags: ['prioridade_regular', ...tags.slice(0, -1)],
  })).trainingType, 'interpretacao');
  assert.equal(classifyFlashcard(card({
    tags: ['prioridade_regular', ...tags.slice(0, -2)],
  })).trainingType, 'pegadinhas');
  assert.equal(classifyFlashcard(card({
    tags: ['prioridade_regular', ...tags.slice(0, -3)],
  })).trainingType, 'padroes_bancas');
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
