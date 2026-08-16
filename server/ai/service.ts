import { AiGenerationError, AiTimeoutError, AiUnavailableError } from './errors';
import { AiGenerationRequest, AiGenerationResult, AiProvider } from './types';

const DEFAULT_TIMEOUT_MS = 60_000;

export class AiService {
  constructor(
    private readonly provider: AiProvider,
    private readonly timeoutMs = DEFAULT_TIMEOUT_MS,
  ) {}

  async generate(request: AiGenerationRequest): Promise<AiGenerationResult> {
    if (!this.provider.isConfigured) throw new AiUnavailableError();

    let timeout: ReturnType<typeof setTimeout> | undefined;
    try {
      const text = await Promise.race([
        this.provider.generate(request),
        new Promise<never>((_, reject) => {
          timeout = setTimeout(() => reject(new AiTimeoutError()), this.timeoutMs);
        }),
      ]);

      const normalized = text.trim();
      if (!normalized) throw new AiGenerationError('O provedor retornou uma resposta vazia.');
      return { text: normalized, provider: this.provider.name, model: this.provider.model };
    } catch (error) {
      if (error instanceof AiTimeoutError || error instanceof AiGenerationError) throw error;
      throw new AiGenerationError(undefined, { cause: error });
    } finally {
      if (timeout) clearTimeout(timeout);
    }
  }
}

export function parseAiTimeout(value: string | undefined): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 1_000 && parsed <= 180_000
    ? parsed
    : DEFAULT_TIMEOUT_MS;
}

