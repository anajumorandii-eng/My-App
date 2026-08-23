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

  const tagSet = new Set(card.tags);
  const taggedPriorities = new Set(
    card.tags
      .filter((tag) => tag.startsWith('prioridade_'))
      .map((tag) => tag.replace('prioridade_', '')),
  );
  const [priorityValue] = taggedPriorities;
  const priority = priorityValue as FlashcardPriority | undefined;
  const matchedTrainingTypes = new Set(
    MODEL_SIGNATURES
      .filter(({ approvedTag, legacyTags }) => (
        tagSet.has(approvedTag) || legacyTags.every((tag) => tagSet.has(tag))
      ))
      .map(({ trainingType }) => trainingType),
  );
  const [trainingType] = matchedTrainingTypes;

  if (
    taggedPriorities.size !== 1
    || !priority
    || !PRIORITIES.includes(priority)
    || matchedTrainingTypes.size !== 1
    || !trainingType
  ) {
    return { priority: 'regular', trainingType: 'objetivos', classificationOrigin: 'fallback' };
  }

  return { priority, trainingType, classificationOrigin: 'tagged' };
}
