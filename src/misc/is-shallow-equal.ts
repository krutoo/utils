const hasOwn = Object.prototype.hasOwnProperty;

/**
 * Checks that both arguments is shallow equal.
 * Shallow equality means that two objects with same keys and values are equal.
 * @param a First value.
 * @param b Second value.
 * @returns True when values is shallow equal, false otherwise.
 */
export function isShallowEqual(a: any, b: any): boolean {
  if (Object.is(a, b)) {
    return true;
  }

  // @todo how to be with functions?
  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
    return false;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(b, keysA[i]!) || !Object.is(a[keysA[i]!], b[keysA[i]!])) {
      return false;
    }
  }

  return true;
}
