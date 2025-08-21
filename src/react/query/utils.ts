/**
 * Generates random string.
 * @param prefix Prefix.
 * @returns String.
 */
export function generateId(prefix: string = ''): string {
  return `${prefix}${Math.random().toString(16).slice(2)}`;
}
