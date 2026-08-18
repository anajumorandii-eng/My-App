import { GeminiProvider } from './geminiProvider';
import { OmniRouteProvider } from './omniRouteProvider';
import { AiProvider } from './types';

export function createAiProvider(env: NodeJS.ProcessEnv = process.env): AiProvider {
  const provider = env.AI_PROVIDER?.trim().toLowerCase() || 'gemini';

  if (provider === 'omniroute') {
    return new OmniRouteProvider(
      env.OMNIROUTE_API_KEY,
      env.OMNIROUTE_BASE_URL,
      env.OMNIROUTE_MODEL,
    );
  }

  return new GeminiProvider(env.GEMINI_API_KEY, env.GEMINI_MODEL);
}

