export type ConfidenceLevel = 'high' | 'moderate' | 'low' | 'insufficient_data';

// Mirrors the shape of TopicMastery.uncertainty (0-1). 0.8 is deliberately
// close to the untouched-baseline uncertainty (0.9) reconcileMastery()
// (userData.ts) writes for a topic no one has looked at yet — that baseline
// should read as "insufficient data", not merely "low confidence".
const INSUFFICIENT_DATA_THRESHOLD = 0.8;
const LOW_THRESHOLD = 0.5;
const MODERATE_THRESHOLD = 0.25;

export function confidenceFromUncertainty(uncertainty: number): ConfidenceLevel {
  if (uncertainty > INSUFFICIENT_DATA_THRESHOLD) return 'insufficient_data';
  if (uncertainty > LOW_THRESHOLD) return 'low';
  if (uncertainty > MODERATE_THRESHOLD) return 'moderate';
  return 'high';
}

export const CONFIDENCE_LABEL: Record<ConfidenceLevel, string> = {
  high: 'Confiança alta',
  moderate: 'Confiança moderada',
  low: 'Confiança baixa',
  insufficient_data: 'Dados insuficientes',
};
