// Using `Object.prototype.hasOwnProperty` instead of `Object.hasOwn` to support more environments
const hasOwn = Object.prototype.hasOwnProperty;

/**
 * Returns generator that iterates over each unique own key of all given objects.
 * @param objects Objects to pick keys.
 * @yields Every unique own key.
 */
export function* keys(...objects: Array<Record<string, any>>): Generator<string, void, unknown> {
  const map: Record<string, any> = {};

  for (const item of objects) {
    for (const key in item) {
      if (hasOwn.call(item, key)) {
        if (map[key]) {
          continue;
        } else {
          map[key] = true;
          yield key;
        }
      }
    }
  }
}
