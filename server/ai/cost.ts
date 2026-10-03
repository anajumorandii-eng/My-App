import { AiUsage } from './types';

function nonNegativeNumber(value: string | undefined): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export function estimateAiCostUsd(_model: string, usage: AiUsage | undefined): number | undefined {
  if (!usage) return undefined;
  const inputRate = nonNegativeNumber(process.env.AI_INPUT_USD_PER_MILLION);
  const outputRate = nonNegativeNumber(process.env.AI_OUTPUT_USD_PER_MILLION);
  if (inputRate === 0 && outputRate === 0) return undefined;
  const cost = ((usage.promptTokens ?? 0) * inputRate + (usage.completionTokens ?? 0) * outputRate) / 1_000_000;
  return Number(cost.toFixed(8));
}
