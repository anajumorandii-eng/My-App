import { RequestHandler } from 'express';

interface Counter {
  count: number;
  resetAt: number;
}

const DEFAULT_WINDOW_MS = 10 * 60_000;
const DEFAULT_MAX_REQUESTS = 30;

function positiveInteger(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function createAiRateLimit(options?: { windowMs?: number; maxRequests?: number }): RequestHandler {
  const windowMs = options?.windowMs ?? positiveInteger(process.env.AI_RATE_LIMIT_WINDOW_MS, DEFAULT_WINDOW_MS);
  const maxRequests = options?.maxRequests ?? positiveInteger(process.env.AI_RATE_LIMIT_MAX, DEFAULT_MAX_REQUESTS);
  const counters = new Map<string, Counter>();

  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip || req.socket.remoteAddress || 'unknown';
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

