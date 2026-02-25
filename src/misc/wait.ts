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

  return new Promise((done, fail) => {
    const timerId = setTimeout(() => done(), ms);

    if (signal) {
      const handleAbort = () => {
        clearTimeout(timerId);
        fail(signal.reason);
      };

      signal.addEventListener('abort', handleAbort, { once: true });
    }
  });
}
