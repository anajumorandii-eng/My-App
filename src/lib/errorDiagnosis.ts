import { ErrorLog, Intervention, InterventionType } from '../types';

export interface ErrorDiagnosis {
  type: ErrorLog['type'];
  breakPoint: string;
  evidence: string;
  confidence: 'baixa' | 'media';
  intervention: Intervention;
}

const ERROR_TYPES: ErrorLog['type'][] = [
  'conceptual',
  'concept_confusion',
  'interpretation',
  'data_selection',
  'strategy',
  'calculation',
  'prerequisite',
  'insufficient_justification',
  'time',
  'attention',
];

const INTERVENTION_TYPES: InterventionType[] = [
  'recuperacao_ativa',
  'questao_guiada',
  'comparacao_conceitos',
  'microbloco_prerequisito',
  'questao_aplicacao',
  'revisao_curta',
  'aula_completa',
];

const FALLBACK_INTERVENTION: Intervention = {
  type: 'recuperacao_ativa',
  description: 'Tente explicar o conceito com suas próprias palavras antes de tentar outra questão do mesmo tópico.',
};

function isErrorType(value: unknown): value is ErrorLog['type'] {
  return typeof value === 'string' && (ERROR_TYPES as string[]).includes(value);
}

function isInterventionType(value: unknown): value is InterventionType {
  return typeof value === 'string' && (INTERVENTION_TYPES as string[]).includes(value);
}

/**
 * Parses the JSON diagnosis the AI was asked to return. The model is asked
 * for JSON only, but LLM output is never fully trustworthy — this always
 * returns something usable instead of throwing, and clamps confidence so a
 * hallucinated "alta"/"confirmado" from the model can never be treated as a
 * confirmed fact (only the student confirming it can do that).
 */
export function parseErrorDiagnosis(raw: string): ErrorDiagnosis {
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      const interventionRaw = parsed?.intervention;
      const intervention: Intervention = {
        type: isInterventionType(interventionRaw?.type) ? interventionRaw.type : FALLBACK_INTERVENTION.type,
        description:
          typeof interventionRaw?.description === 'string' && interventionRaw.description.trim()
            ? interventionRaw.description.trim()
            : FALLBACK_INTERVENTION.description,
      };
      return {
        type: isErrorType(parsed?.type) ? parsed.type : 'conceptual',
        breakPoint: typeof parsed?.breakPoint === 'string' && parsed.breakPoint.trim() ? parsed.breakPoint.trim() : raw.trim(),
        evidence: typeof parsed?.evidence === 'string' ? parsed.evidence.trim() : '',
        // Só aceita "baixa"/"media" do modelo — qualquer outra coisa (incluindo
        // uma eventual "alta"/"confirmado" que o modelo não deveria ter usado)
        // é rebaixada para "baixa", nunca tratada como fato confirmado.
        confidence: parsed?.confidence === 'media' ? 'media' : 'baixa',
        intervention,
      };
    } catch {
      // cai no fallback abaixo
    }
  }

  return {
    type: 'conceptual',
    breakPoint: raw.trim() || 'Não foi possível identificar o ponto exato — revise o raciocínio da questão manualmente.',
    evidence: '',
    confidence: 'baixa',
    intervention: FALLBACK_INTERVENTION,
  };
}
