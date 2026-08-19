export interface ContentExplanation {
  intuicao: string;
  conceito: string;
  aplicacao: string;
  comoCai: string;
  pegadinha: string;
  checagem: string;
}

export interface AnswerCorrection {
  acertos: string;
  rupturaPoint: string;
  porque: string;
  correcaoMinima: string;
  respostaModelo: string;
  padraoRecorrente: string | null;
}

function extractJson(raw: string): Record<string, unknown> | null {
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

function str(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

const EXPLANATION_FALLBACK_NOTE = 'A IA não retornou essa parte da explicação — tente pedir de novo, ou confira o texto abaixo.';

/**
 * Parses the JSON the AI was asked to return for "explicação de conteúdo".
 * Never throws: malformed output just puts the raw text in `conceito` and
 * fills the rest with a note explaining what happened, so the screen never
 * breaks — it just shows something less structured.
 */
export function parseContentExplanation(raw: string): ContentExplanation {
  const parsed = extractJson(raw);
  if (!parsed) {
    return {
      intuicao: EXPLANATION_FALLBACK_NOTE,
      conceito: raw.trim(),
      aplicacao: EXPLANATION_FALLBACK_NOTE,
      comoCai: EXPLANATION_FALLBACK_NOTE,
      pegadinha: EXPLANATION_FALLBACK_NOTE,
      checagem: EXPLANATION_FALLBACK_NOTE,
    };
  }
  return {
    intuicao: str(parsed.intuicao, EXPLANATION_FALLBACK_NOTE),
    conceito: str(parsed.conceito, EXPLANATION_FALLBACK_NOTE),
    aplicacao: str(parsed.aplicacao, EXPLANATION_FALLBACK_NOTE),
    comoCai: str(parsed.comoCai, EXPLANATION_FALLBACK_NOTE),
    pegadinha: str(parsed.pegadinha, EXPLANATION_FALLBACK_NOTE),
    checagem: str(parsed.checagem, EXPLANATION_FALLBACK_NOTE),
  };
}

const CORRECTION_FALLBACK_NOTE = 'A IA não retornou essa parte da correção — tente pedir de novo.';

/**
 * Parses the JSON the AI was asked to return for "correção de resposta".
 * Same defensive contract as parseContentExplanation: never throws,
 * degrades to the raw text in `respostaModelo` if the JSON is malformed.
 */
export function parseAnswerCorrection(raw: string): AnswerCorrection {
  const parsed = extractJson(raw);
  if (!parsed) {
    return {
      acertos: CORRECTION_FALLBACK_NOTE,
      rupturaPoint: CORRECTION_FALLBACK_NOTE,
      porque: CORRECTION_FALLBACK_NOTE,
      correcaoMinima: CORRECTION_FALLBACK_NOTE,
      respostaModelo: raw.trim(),
      padraoRecorrente: null,
    };
  }
  return {
    acertos: str(parsed.acertos, CORRECTION_FALLBACK_NOTE),
    rupturaPoint: str(parsed.rupturaPoint, CORRECTION_FALLBACK_NOTE),
    porque: str(parsed.porque, CORRECTION_FALLBACK_NOTE),
    correcaoMinima: str(parsed.correcaoMinima, CORRECTION_FALLBACK_NOTE),
    respostaModelo: str(parsed.respostaModelo, CORRECTION_FALLBACK_NOTE),
    padraoRecorrente: typeof parsed.padraoRecorrente === 'string' && parsed.padraoRecorrente.trim()
      ? parsed.padraoRecorrente.trim()
      : null,
  };
}
