import { RateLimiter as Limiter, Interval } from 'limiter';

const AMOUNT_BEFORE_RATELIMIT = 1;

interface RateLimiter {
  get: (key: string) => boolean;
}

const useRateLimiter = (interval: Interval): RateLimiter => {
  const limiters: Map<string, Limiter> = new Map();

  const get = (key: string): boolean => {
    let limiter = limiters.get(key);
    if (!limiter) {
      limiter = new Limiter({
        tokensPerInterval: AMOUNT_BEFORE_RATELIMIT,
        interval: interval,
      });
      limiters.set(key, limiter);
    }

    return !limiter.tryRemoveTokens(1);
  };

  return { get };
};

export { useRateLimiter };
