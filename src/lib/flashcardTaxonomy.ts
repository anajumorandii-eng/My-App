import {
  Flashcard,
  FlashcardClassificationOrigin,
  FlashcardPriority,
  FlashcardTrainingType,
} from '../types';

export interface FlashcardClassification {
  priority: FlashcardPriority;
  trainingType: FlashcardTrainingType;
  classificationOrigin: FlashcardClassificationOrigin;
}

const TYPE_BY_MODEL_TAG: Record<string, FlashcardTrainingType> = {
  '01_basico_mapa_minimo': 'objetivos',
  '02_vocabulario_de_precisao': 'objetivos',
  '03_por_que_funciona': 'objetivos',
  '04_causa_consequencia': 'objetivos',
  '05_comparacao_e_fronteira_conceitual': 'pegadinhas',
  '06_grafico_tabela_texto_ou_experimento': 'interpretacao',
  '07_objetiva_eliminacao_de_distratores': 'objetivos',
  '08_objetiva_decisao_sob_tempo': 'objetivos',
  '09_fuvest_1a_fase_assunto_disfarcado': 'padroes_bancas',
  '10_enem_contexto_e_habilidade': 'padroes_bancas',
  '11_fuvest_2a_fase_resposta_pontuavel': 'discursivos',
  '12_unicamp_2a_fase_c_f_c_r': 'discursivos',
  '13_vunesp_2a_fase_d_c_e_a': 'discursivos',
  '14_autopsia_do_erro': 'pegadinhas',
  '15_cenario_e_se': 'objetivos',
  '16_conexao_interdisciplinar': 'objetivos',
  '17_sintese_de_alta_incidencia': 'objetivos',
  '18_questao_mista_transferencia_maxima': 'objetivos',
};

const TRAINING_TYPE_PRECEDENCE: FlashcardTrainingType[] = [
  'discursivos',
  'interpretacao',
  'pegadinhas',
  'padroes_bancas',
  'objetivos',
];

const PRIORITIES: FlashcardPriority[] = ['essencial', 'alta', 'regular'];

export function classifyFlashcard(card: Flashcard): FlashcardClassification {
  if (card.source === 'lembre_se') {
    return { priority: 'regular', trainingType: 'objetivos', classificationOrigin: 'inherited' };
  }

  if (card.priority && card.trainingType && card.classificationOrigin) {
    return {
      priority: card.priority,
      trainingType: card.trainingType,
      classificationOrigin: card.classificationOrigin,
    };
  }

  const priorityTag = card.tags.find((tag) => tag.startsWith('prioridade_'));
  const priority = priorityTag?.replace('prioridade_', '') as FlashcardPriority | undefined;
  const taggedTrainingTypes = new Set(
    card.tags.map((tag) => TYPE_BY_MODEL_TAG[tag]).filter(Boolean),
  );
  const trainingType = TRAINING_TYPE_PRECEDENCE.find((type) => taggedTrainingTypes.has(type));

  if (!priority || !PRIORITIES.includes(priority) || !trainingType) {
    return { priority: 'regular', trainingType: 'objetivos', classificationOrigin: 'fallback' };
  }

  return { priority, trainingType, classificationOrigin: 'tagged' };
}
