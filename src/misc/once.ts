/**
 * Returns function that calls original function only once.
 * All next calls will return result from first call.
 * @param fn Function.
 * @returns New wrapper function.
 */
export function once<T extends (this: any, ...args: any[]) => any>(
  fn: T,
): (this: any, ...args: Parameters<T>) => ReturnType<T> {
  let done = false;
  let result: ReturnType<T>;

  return function (...args: Parameters<T>): ReturnType<T> {
    if (!done) {
      done = true;
      result = fn.apply(this, args);
    }

    return result;
  };
}
