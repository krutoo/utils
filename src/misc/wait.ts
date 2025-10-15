export interface WaitOptions {
  /** Abort signal. */
  signal?: AbortSignal;
}

/**
 * Returns promise that resolves after specified timeout.
 * @param ms Timeout in milliseconds.
 * @param options Options.
 * @returns Promise.
 */
export function wait(ms: number, options: WaitOptions = {}): Promise<void> {
  const { signal } = options;

  if (signal?.aborted) {
    return Promise.reject(signal.reason);
  }

  return new Promise((resolve, reject) => {
    const timerId = setTimeout(() => resolve(), ms);

    if (signal) {
      const handleAbort = () => {
        clearTimeout(timerId);
        reject(signal.reason);
      };

      signal.addEventListener('abort', handleAbort, { once: true });
    }
  });
}
