// Using `Object.prototype.hasOwnProperty` instead of `Object.hasOwn` to support more environments
const hasOwn = Object.prototype.hasOwnProperty;

/**
 * Return unique keys list of two received objects.
 * @param objects Objects to pick keys of.
 * @returns Array of unique keys.
 */
export function mergeKeys(...objects: Array<Record<string, any>>): string[] {
  const map: Record<string, any> = {};
  const keys: string[] = [];

  for (const item of objects) {
    for (const key in item) {
      if (hasOwn.call(item, key)) {
        if (map[key]) {
          continue;
        } else {
          map[key] = true;
          keys.push(key);
        }
      }
    }
  }

  return keys;
}
