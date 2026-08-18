import { ProxyAgent, setGlobalDispatcher } from 'undici';
import { GeminiProvider } from './geminiProvider';
import { OmniRouteProvider } from './omniRouteProvider';
import { AiProvider } from './types';

export function createAiProvider(env: NodeJS.ProcessEnv = process.env): AiProvider {
  const provider = env.AI_PROVIDER?.trim().toLowerCase() || 'gemini';

  if (provider === 'omniroute') {
    if (env.OMNIROUTE_PROXY_URL) {
      setGlobalDispatcher(new ProxyAgent(env.OMNIROUTE_PROXY_URL));
    }

    return new OmniRouteProvider({
      baseUrl: env.OMNIROUTE_BASE_URL,
      apiKey: env.OMNIROUTE_API_KEY,
      deepModel: env.AI_DEEP_MODEL,
      fastModel: env.AI_FAST_MODEL,
    });
  }

  return new GeminiProvider(env.GEMINI_API_KEY, env.GEMINI_MODEL);
}
