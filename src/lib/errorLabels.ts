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
  baixa: 'Confiança baixa — hipótese da IA, não confirmada',
  media: 'Confiança média — hipótese da IA, não confirmada',
  alta: 'Confiança alta',
  confirmado: 'Confirmado por você',
};
