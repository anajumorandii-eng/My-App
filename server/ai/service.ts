import { AiGenerationError, AiTimeoutError, AiUnavailableError } from './errors';
import { AiGenerationRequest, AiGenerationResult, AiProvider } from './types';
import { createHash } from 'node:crypto';

const DEFAULT_TIMEOUT_MS = 150_000;
const CACHEABLE_TASKS = new Set(['review-tip', 'method-example', 'podcast-script']);

interface CacheEntry { result: AiGenerationResult; expiresAt: number }

export class AiService {
  private readonly cache = new Map<string, CacheEntry>();

  constructor(
    private readonly provider: AiProvider,
    private readonly timeoutMs = DEFAULT_TIMEOUT_MS,
    private readonly cacheTtlMs = 10 * 60_000,
  ) {}

  async generate(request: AiGenerationRequest): Promise<AiGenerationResult> {
    if (!this.provider.isConfigured) throw new AiUnavailableError();

    const cacheKey = this.cacheKey(request);
    const cached = cacheKey ? this.cache.get(cacheKey) : undefined;
    if (cached && cached.expiresAt > Date.now()) return { ...cached.result, cached: true };

    let timeout: ReturnType<typeof setTimeout> | undefined;
    const controller = new AbortController();
    try {
      const providerResult = await Promise.race([
        this.provider.generate({ ...request, signal: controller.signal }),
        new Promise<never>((_, reject) => {
          timeout = setTimeout(() => {
            controller.abort();
            reject(new AiTimeoutError());
          }, this.timeoutMs);
        }),
      ]);

      const detail = typeof providerResult === 'string' ? { text: providerResult } : providerResult;
      const normalized = detail.text.trim();
      if (!normalized) throw new AiGenerationError('O provedor retornou uma resposta vazia.');
      const result: AiGenerationResult = {
        text: normalized,
        provider: this.provider.name,
        model: detail.model ?? this.provider.modelForTask?.(request.task) ?? this.provider.model,
        ...(detail.usage ? { usage: detail.usage } : {}),
        ...(detail.fallback ? { fallback: true } : {}),
      };
      if (cacheKey) {
        if (this.cache.size >= 500) this.cache.delete(this.cache.keys().next().value!);
        this.cache.set(cacheKey, { result, expiresAt: Date.now() + this.cacheTtlMs });
      }
      return result;
    } catch (error) {
      if (error instanceof AiTimeoutError || error instanceof AiGenerationError) throw error;
      throw new AiGenerationError(undefined, { cause: error });
    } finally {
      if (timeout) clearTimeout(timeout);
    }
  }

  private cacheKey(request: AiGenerationRequest): string | null {
    if (!request.userId || !CACHEABLE_TASKS.has(request.task) || this.cacheTtlMs <= 0) return null;
    return createHash('sha256').update(`${request.userId}\0${request.task}\0${request.prompt}`).digest('hex');
  }
}

export function parseAiTimeout(value: string | undefined): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 1_000 && parsed <= 300_000
    ? parsed
    : DEFAULT_TIMEOUT_MS;
}
