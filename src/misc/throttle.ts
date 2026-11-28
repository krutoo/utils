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
): (this: ThisParameterType<T>, ...args: Parameters<T>) => void {
  let free = true;
  let queued: { context: ThisParameterType<T>; args: Parameters<T> } | null = null;

  const release: (this: ThisParameterType<T>) => void = function () {
    if (queued === null) {
      free = true;
      return;
    }

    const { context, args } = queued;
    queued = null;

    setTimeout(() => release.call(this), timeout);

    fn.call(context, ...args);
  };

  if (!leading && !trailing) {
    return () => {};
  }

  return function (...args: Parameters<T>): void {
    if (free) {
      free = false;
      setTimeout(() => release.call(this), timeout);

      if (leading) {
        fn.call(this, ...args);
      } else {
        queued = { context: this, args };
      }
    } else if (trailing) {
      queued = { context: this, args };
    }
  };
}
