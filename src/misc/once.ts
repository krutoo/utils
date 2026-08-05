import type { AnyFunction } from '../mod.ts';

/**
 * Returns function that calls original function only once.
 * All next calls will return result from first call.
 * @param fn Function.
 * @returns New wrapper function.
 */
export function once<T extends AnyFunction>(
  fn: T,
): (this: ThisParameterType<T>, ...args: Parameters<T>) => ReturnType<T> {
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
