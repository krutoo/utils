import type { AnyFunction } from '../mod.ts';

export interface ThrottleOptions {
  leading?: boolean;
  trailing?: boolean;
}

/**
 * Creates a throttled function that only invokes func at most once per every wait milliseconds.
 * @param fn Function.
 * @param timeout Timeout in milliseconds.
 * @param options Options.
 * @returns Throttled function.
 */
export function throttle<T extends AnyFunction>(
  fn: T,
  timeout = 0,
  { leading = true, trailing = false }: ThrottleOptions = {},
): (...args: Parameters<T>) => void {
  let free = true;
  let queued: Parameters<T> | null = null;

  const release = () => {
    if (queued === null) {
      free = true;
      return;
    }

    const args = queued;
    queued = null;

    setTimeout(release, timeout);

    fn(...args);
  };

  if (!leading && !trailing) {
    return () => {};
  }

  return (...args: Parameters<T>): void => {
    if (free) {
      free = false;
      setTimeout(release, timeout);

      if (leading) {
        fn(...args);
      } else {
        queued = args;
      }
    } else if (trailing) {
      queued = args;
    }
  };
}
