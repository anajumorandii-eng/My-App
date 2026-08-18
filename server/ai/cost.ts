import { AiUsage } from './types';

function nonNegativeNumber(value: string | undefined): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export function estimateAiCostUsd(model: string, usage: AiUsage | undefined): number | undefined {
  if (!usage) return undefined;
  const isDeep = model === (process.env.AI_DEEP_MODEL || 'juju-deep-v1');
  const inputRate = nonNegativeNumber(process.env[isDeep ? 'AI_DEEP_INPUT_USD_PER_MILLION' : 'AI_FAST_INPUT_USD_PER_MILLION']);
  const outputRate = nonNegativeNumber(process.env[isDeep ? 'AI_DEEP_OUTPUT_USD_PER_MILLION' : 'AI_FAST_OUTPUT_USD_PER_MILLION']);
  if (inputRate === 0 && outputRate === 0) return undefined;
  const cost = ((usage.promptTokens ?? 0) * inputRate + (usage.completionTokens ?? 0) * outputRate) / 1_000_000;
  return Number(cost.toFixed(8));
}
