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

interface FlashcardModelSignature {
  approvedTag: string;
  legacyTags: string[];
  trainingType: FlashcardTrainingType;
}

const MODEL_SIGNATURES: FlashcardModelSignature[] = [
  { approvedTag: '01_basico_mapa_minimo', legacyTags: ['recuperacao_ativa'], trainingType: 'objetivos' },
  { approvedTag: '02_vocabulario_de_precisao', legacyTags: ['conceitos'], trainingType: 'objetivos' },
  { approvedTag: '03_por_que_funciona', legacyTags: ['causa_efeito'], trainingType: 'objetivos' },
  { approvedTag: '04_causa_consequencia', legacyTags: ['raciocinio_causal'], trainingType: 'objetivos' },
  { approvedTag: '05_comparacao_e_fronteira_conceitual', legacyTags: ['pegadinha', 'comparacao'], trainingType: 'pegadinhas' },
  { approvedTag: '06_grafico_tabela_texto_ou_experimento', legacyTags: ['graficos_tabelas', 'fontes'], trainingType: 'interpretacao' },
  { approvedTag: '07_objetiva_eliminacao_de_distratores', legacyTags: ['distratores', 'prova_objetiva'], trainingType: 'objetivos' },
  { approvedTag: '08_objetiva_decisao_sob_tempo', legacyTags: ['gestao_tempo', 'prova_objetiva'], trainingType: 'objetivos' },
  { approvedTag: '09_fuvest_1a_fase_assunto_disfarcado', legacyTags: ['fuvest', 'primeira_fase', 'prova_objetiva'], trainingType: 'padroes_bancas' },
  { approvedTag: '10_enem_contexto_e_habilidade', legacyTags: ['enem', 'prova_objetiva', 'aplicacao'], trainingType: 'padroes_bancas' },
  { approvedTag: '11_fuvest_2a_fase_resposta_pontuavel', legacyTags: ['fuvest', 'segunda_fase', 'discursiva'], trainingType: 'discursivos' },
  { approvedTag: '12_unicamp_2a_fase_c_f_c_r', legacyTags: ['unicamp', 'discursiva', 'fontes'], trainingType: 'discursivos' },
  { approvedTag: '13_vunesp_2a_fase_d_c_e_a', legacyTags: ['vunesp', 'discursiva'], trainingType: 'discursivos' },
  { approvedTag: '14_autopsia_do_erro', legacyTags: ['caderno_erros', 'metacognicao'], trainingType: 'pegadinhas' },
  { approvedTag: '15_cenario_e_se', legacyTags: ['contrafactual'], trainingType: 'objetivos' },
  { approvedTag: '16_conexao_interdisciplinar', legacyTags: ['interdisciplinar'], trainingType: 'objetivos' },
  { approvedTag: '17_sintese_de_alta_incidencia', legacyTags: ['revisao_final', 'alta_incidencia'], trainingType: 'objetivos' },
  { approvedTag: '18_questao_mista_transferencia_maxima', legacyTags: ['transferencia', 'discursiva'], trainingType: 'objetivos' },
];

const PRIORITIES: FlashcardPriority[] = ['essencial', 'alta', 'regular'];
const TRAINING_TYPES: FlashcardTrainingType[] = [
  'objetivos',
  'discursivos',
  'interpretacao',
  'pegadinhas',
  'padroes_bancas',
];
const TRAINING_TYPE_PRECEDENCE: FlashcardTrainingType[] = [
  'discursivos',
  'interpretacao',
  'pegadinhas',
  'padroes_bancas',
  'objetivos',
];
const CLASSIFICATION_ORIGINS: FlashcardClassificationOrigin[] = [
  'tagged',
  'inherited',
  'fallback',
];

const FALLBACK_CLASSIFICATION: FlashcardClassification = {
  priority: 'regular',
  trainingType: 'objetivos',
  classificationOrigin: 'fallback',
};
const INHERITED_CLASSIFICATION: FlashcardClassification = {
  priority: 'regular',
  trainingType: 'objetivos',
  classificationOrigin: 'inherited',
};

type MaterializedClassification =
  | { status: 'absent' }
  | { status: 'invalid' }
  | { status: 'valid'; classification: FlashcardClassification };

export interface FlashcardClassificationResolution {
  classification: FlashcardClassification;
  materializedConsistent: boolean;
}

function readMaterializedClassification(card: Flashcard): MaterializedClassification {
  const values = [card.priority, card.trainingType, card.classificationOrigin];
  if (values.every((value) => value === undefined)) return { status: 'absent' };
  if (
    !card.priority
    || !PRIORITIES.includes(card.priority)
    || !card.trainingType
    || !TRAINING_TYPES.includes(card.trainingType)
    || !card.classificationOrigin
    || !CLASSIFICATION_ORIGINS.includes(card.classificationOrigin)
    || (card.source === 'sistema_priorizado' && card.classificationOrigin === 'inherited')
  ) {
    return { status: 'invalid' };
  }

  return {
    status: 'valid',
    classification: {
      priority: card.priority,
      trainingType: card.trainingType,
      classificationOrigin: card.classificationOrigin,
    },
  };
}

function classificationsEqual(
  left: FlashcardClassification,
  right: FlashcardClassification,
): boolean {
  return left.priority === right.priority
    && left.trainingType === right.trainingType
    && left.classificationOrigin === right.classificationOrigin;
}

export function deriveFlashcardClassification(card: Flashcard): FlashcardClassification {
  if (card.source === 'lembre_se') return INHERITED_CLASSIFICATION;

  const tagSet = new Set(card.tags);
  const taggedPriorities = new Set(
    card.tags
      .filter((tag) => tag.startsWith('prioridade_'))
      .map((tag) => tag.replace('prioridade_', '')),
  );
  const [priorityValue] = taggedPriorities;
  const priority = priorityValue as FlashcardPriority | undefined;
  const approvedTrainingTypes = new Set(
    MODEL_SIGNATURES
      .filter(({ approvedTag }) => tagSet.has(approvedTag))
      .map(({ trainingType }) => trainingType),
  );
  const approvedTrainingType = TRAINING_TYPE_PRECEDENCE.find(
    (trainingType) => approvedTrainingTypes.has(trainingType),
  );
  const legacyTrainingTypes = new Set(
    MODEL_SIGNATURES
      .filter(({ legacyTags }) => legacyTags.every((tag) => tagSet.has(tag)))
      .map(({ trainingType }) => trainingType),
  );
  const [legacyTrainingType] = legacyTrainingTypes;
  const trainingType = approvedTrainingType
    ?? (legacyTrainingTypes.size === 1 ? legacyTrainingType : undefined);

  if (
    taggedPriorities.size !== 1
    || !priority
    || !PRIORITIES.includes(priority)
    || !trainingType
  ) {
    return FALLBACK_CLASSIFICATION;
  }

  return { priority, trainingType, classificationOrigin: 'tagged' };
}

export function resolveFlashcardClassification(card: Flashcard): FlashcardClassificationResolution {
  const derived = deriveFlashcardClassification(card);
  if (card.source === 'lembre_se') {
    return { classification: INHERITED_CLASSIFICATION, materializedConsistent: true };
  }

  const materialized = readMaterializedClassification(card);
  if (materialized.status === 'invalid') {
    return { classification: FALLBACK_CLASSIFICATION, materializedConsistent: false };
  }
  if (materialized.status === 'absent') {
    return { classification: derived, materializedConsistent: true };
  }
  return {
    classification: derived,
    materializedConsistent: classificationsEqual(materialized.classification, derived),
  };
}

export function classifyFlashcard(card: Flashcard): FlashcardClassification {
  return resolveFlashcardClassification(card).classification;
}
