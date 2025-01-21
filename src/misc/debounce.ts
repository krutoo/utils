/**
 * Simplest implementation of "debounce" function.
 * Returns function wrapper that delays original function call
 * until timeout since last call will be reached.
 * Analogue of debounce from lodash/underscore.
 *
 * @param func Function.
 * @param timeout Timeout in milliseconds.
 * @returns Debounced function.
 */
export function debounce<T extends (...args: any) => any>(
  func: T,
  timeout: number,
): (...args: Parameters<T>) => void {
  let timerId: ReturnType<typeof setTimeout>;

  return (...args) => {
    clearTimeout(timerId);

    timerId = setTimeout(() => func(...args), timeout);
  };
}
