import { RateLimiter as Limiter, Interval } from 'limiter';

const AMOUNT_BEFORE_RATELIMIT = 0;

interface RateLimiter {
  get: (key: string) => boolean;
  limit: (key: string) => void;
}

const useRateLimiter = (interval: Interval): RateLimiter => {
  const limiters: Map<string, Limiter> = new Map();

  const get = (key: string): boolean => {
    const limiter = limiters.get(key);
    if (!limiter) {
      return false;
    }

    return !limiter.tryRemoveTokens(1);
  };

  const limit = (key: string): void => {
    if (!!limiters.get(key)) {
      return;
    }
    const limiter = new Limiter({
      tokensPerInterval: AMOUNT_BEFORE_RATELIMIT,
      interval: interval,
    });
    limiters.set(key, limiter);
  };

  return { get, limit };
};

export { useRateLimiter };
