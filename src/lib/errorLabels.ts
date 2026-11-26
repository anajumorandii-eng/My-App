import { ErrorLog, InterventionType } from '../types';

export const ERROR_TYPE_LABELS: Record<ErrorLog['type'], string> = {
  conceptual: 'Erro de conceito',
  concept_confusion: 'Confusão entre conceitos',
  interpretation: 'Interpretação/comando',
  data_selection: 'Seleção de dados',
  strategy: 'Estratégia',
  calculation: 'Cálculo/execução',
  prerequisite: 'Falta de pré-requisito',
  insufficient_justification: 'Justificativa insuficiente',
  time: 'Falta de tempo',
  attention: 'Distração',
  unknown: 'Não sei o motivo do meu erro',
};

export const INTERVENTION_LABELS: Record<InterventionType, string> = {
  recuperacao_ativa: 'Pergunta de recuperação ativa',
  questao_guiada: 'Questão guiada',
  comparacao_conceitos: 'Comparação entre conceitos',
  microbloco_prerequisito: 'Microbloco de pré-requisito',
  questao_aplicacao: 'Nova questão de aplicação',
  revisao_curta: 'Revisão curta',
  aula_completa: 'Aula completa',
};

export const CONFIDENCE_LABELS: Record<NonNullable<ErrorLog['confidence']>, string> = {
  // "Hipótese da IA" valia só para os registros com hipótese gerada; os que
  // vêm da correção guiada são diagnóstico dela, ainda não confirmado.
  baixa: 'Confiança baixa — diagnóstico ainda não confirmado',
  media: 'Confiança média — diagnóstico ainda não confirmado',
  alta: 'Confiança alta',
  confirmado: 'Confirmado por você',
};
