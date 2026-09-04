import { RequestHandler } from 'express';

interface Counter {
  count: number;
  resetAt: number;
}

export interface DailyQuotaResult { allowed: boolean; remaining: number }
export interface DailyQuotaStore {
  consume(userId: string, date: string, maxRequests: number): Promise<DailyQuotaResult>;
}

const DEFAULT_WINDOW_MS = 10 * 60_000;
const DEFAULT_MAX_REQUESTS = 30;
const DEFAULT_DAILY_MAX_REQUESTS = 100;

function positiveInteger(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

// A cota é diária pro dia da aluna, não pro dia UTC: com toISOString() o
// limite virava às 21h de Brasília, bem no meio da janela de estudo da
// noite. 'en-CA' formata como YYYY-MM-DD, mesmo formato que o store espera.
const SAO_PAULO_DATE = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Sao_Paulo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export function saoPauloDate(now: Date = new Date()): string {
  return SAO_PAULO_DATE.format(now);
}

export function createAiDailyLimit(options?: { maxRequests?: number; store?: DailyQuotaStore }): RequestHandler {
  const maxRequests = options?.maxRequests ?? positiveInteger(process.env.AI_DAILY_LIMIT, DEFAULT_DAILY_MAX_REQUESTS);
  const counters = new Map<string, { date: string; count: number }>();

  return async (_req, res, next) => {
    const userId = res.locals.userId as string;
    const date = saoPauloDate();
    let quota: DailyQuotaResult;
    try {
      if (options?.store) {
        quota = await options.store.consume(userId, date, maxRequests);
      } else {
        const current = counters.get(userId);
        const counter = !current || current.date !== date ? { date, count: 0 } : current;
        counter.count += 1;
        counters.set(userId, counter);
        quota = { allowed: counter.count <= maxRequests, remaining: Math.max(0, maxRequests - counter.count) };

        // Mesma limpeza oportunista do limitador por janela abaixo: sem
        // ela o mapa guardaria uma entrada por aluna por dia, pra sempre.
        if (counters.size > 1_000) {
          for (const [entryKey, value] of counters) {
            if (value.date !== date) counters.delete(entryKey);
          }
        }
      }
    } catch (error) {
      console.error('AI daily quota store failed:', error);
      return res.status(503).json({ error: 'Não foi possível validar o limite de uso da IA.', code: 'AI_QUOTA_UNAVAILABLE' });
    }

    res.setHeader('X-DailyLimit-Limit', maxRequests);
    res.setHeader('X-DailyLimit-Remaining', quota.remaining);
    if (!quota.allowed) {
      return res.status(429).json({
        error: 'Seu limite diário de uso da IA foi atingido. Tente novamente amanhã.',
        code: 'AI_DAILY_LIMITED',
      });
    }
    next();
  };
}

export function createAiRateLimit(options?: { windowMs?: number; maxRequests?: number }): RequestHandler {
  const windowMs = options?.windowMs ?? positiveInteger(process.env.AI_RATE_LIMIT_WINDOW_MS, DEFAULT_WINDOW_MS);
  const maxRequests = options?.maxRequests ?? positiveInteger(process.env.AI_RATE_LIMIT_MAX, DEFAULT_MAX_REQUESTS);
  const counters = new Map<string, Counter>();

  return (req, res, next) => {
    const now = Date.now();
    const key = res.locals.userId || req.ip || req.socket.remoteAddress || 'unknown';
    const current = counters.get(key);
    const counter = !current || current.resetAt <= now
      ? { count: 0, resetAt: now + windowMs }
      : current;

    counter.count += 1;
    counters.set(key, counter);

    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - counter.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(counter.resetAt / 1000));

    if (counter.count > maxRequests) {
      res.setHeader('Retry-After', Math.ceil((counter.resetAt - now) / 1000));
      return res.status(429).json({
        error: 'Muitas solicitações de IA. Aguarde um pouco e tente novamente.',
        code: 'AI_RATE_LIMITED',
      });
    }

    // Opportunistic cleanup keeps the in-memory map bounded without a timer.
    if (counters.size > 1_000) {
      for (const [entryKey, value] of counters) {
        if (value.resetAt <= now) counters.delete(entryKey);
      }
    }

    next();
  };
}
