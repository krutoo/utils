// @todo maybe replace memoReturnArray to shallowMemoize
const stub = Symbol();

/** Options for `memoReturnArray`. */
export interface MemoReturnArrayOptions {
  /** Equality checker. */
  isEqual?: (a: any, b: any) => boolean;
}

/**
 * Decorates given function (returns new function).
 * Result function memoizes array returned from it.
 * If all array items are same, previous call result will be returned.
 *
 * Useful in Redux and Reselect when your selector returns new array with same items.
 * @param func Function.
 * @param options Options.
 * @returns Function.
 */
export function memoReturnArray<T extends (...args: any[]) => any[]>(
  func: T,
  { isEqual = Object.is }: MemoReturnArrayOptions = {},
): (...args: Parameters<T>) => ReturnType<T> {
  let lastResult: typeof stub | ReturnType<T> = stub;

  return (...args: Parameters<T>): ReturnType<T> => {
    if (lastResult === stub) {
      const result = func(...args) as ReturnType<T>;

      lastResult = result;

      return result;
    }

    const result = func(...args) as ReturnType<T>;

    if (result.length !== lastResult.length) {
      lastResult = result;

      return result;
    }

    for (let i = 0; i < result.length; i++) {
      if (!isEqual(lastResult[i], result[i])) {
        lastResult = result;

        return result;
      }
    }

    return lastResult;
  };
}
