export interface DebouncedFunction<T extends (this: any, ...args: any[]) => any> {
  (this: ThisParameterType<T>, ...args: Parameters<T>): void;

  /** Cancels registered future calls if exists. */
  cancel: VoidFunction;
}

/**
 * Simplest implementation of "debounce" function.
 * Returns function wrapper that delays original function call
 * until timeout since last call will be reached.
 * Similar to `debounce` from lodash/underscore.
 *
 * @param func Function.
 * @param timeout Timeout in milliseconds.
 * @returns Debounced function.
 */
export function debounce<T extends (...args: any) => any>(
  func: T,
  timeout: number,
): DebouncedFunction<T> {
  let timerId: ReturnType<typeof setTimeout>;

  const debounced: DebouncedFunction<T> = function (...args) {
    clearTimeout(timerId);

    timerId = setTimeout(() => func.apply(this, args), timeout);
  };

  debounced.cancel = () => {
    clearTimeout(timerId);
  };

  return debounced;
}
