/**
 * orchestrator/retry.ts
 */
import type { RetryPolicy } from './types';

export class TimeoutError extends Error {
  constructor(timeoutMs: number) {
    super(`Operation timed out after ${timeoutMs}ms`);
    this.name = 'TimeoutError';
  }
}

export function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new TimeoutError(timeoutMs)), timeoutMs);
    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Runs `fn`, retrying on rejection per `policy`. `attempt` in the returned
 * value is 1-indexed and reflects how many tries were actually made.
 */
export async function withRetry<T>(
  fn: (attempt: number) => Promise<T>,
  policy: RetryPolicy
): Promise<{ value: T; attempt: number }> {
  let lastError: unknown;
  let delay = policy.backoffMs;

  for (let attempt = 1; attempt <= policy.maxAttempts; attempt++) {
    try {
      const value = await fn(attempt);
      return { value, attempt };
    } catch (err) {
      lastError = err;
      if (attempt < policy.maxAttempts) {
        await sleep(delay);
        delay *= policy.backoffMultiplier;
      }
    }
  }

  throw lastError;
}
