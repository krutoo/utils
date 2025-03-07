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
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  timeout = 0,
  { leading = true, trailing = false }: ThrottleOptions = {},
): (...args: Parameters<T>) => void {
  let free = true;
  let queued: null | Parameters<T> = null;

  const release = () => {
    free = true;

    if (queued !== null) {
      fn(...queued);

      queued = null;
    }
  };

  return (...args: Parameters<T>): void => {
    if (free) {
      if (leading) {
        fn(...args);
      }

      free = false;

      setTimeout(release, timeout);
    } else if (trailing) {
      queued = args;
    }
  };
}
