/**
 * Returns the first argument it receives.
 * Useful as default value for some "mapper" options.
 * @param value Value that will be returned.
 * @returns First argument.
 */
export function identity<T>(value: T): T {
  return value;
}
