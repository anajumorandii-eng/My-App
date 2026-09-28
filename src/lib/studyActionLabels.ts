import type { StudyAction } from '../types';

/**
 * Nome curto, em português, do tipo de ação do plano.
 *
 * Plano e Sessão mostravam `action.type.replace('_', ' ')`: a estudante lia
 * "Theory", "review" e "error analysis" no meio de uma tela em português. O
 * Hoje tem os seus rótulos de verbo ("Revisar para consolidar"), que são
 * chamada para agir; aqui é classificação, numa linha de metadados.
 */
export const STUDY_ACTION_TYPE_LABELS: Record<StudyAction['type'], string> = {
  theory: 'Teoria',
  practice: 'Prática',
  review: 'Revisão',
  error_analysis: 'Análise de erros',
};
