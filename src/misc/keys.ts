// Using `Object.prototype.hasOwnProperty` instead of `Object.hasOwn` to support more environments
const hasOwn = Object.prototype.hasOwnProperty;

/**
 * Returns generator that iterates over each unique own key of all given objects.
 * @param objects Objects to pick keys.
 * @yields Every unique own key.
 * @example
 * ```js
 * import { keys } from '@krutoo/utils';
 *
 * const a = { foo: 1 };
 * const b = { foo: 2, bar: 3 };
 * const c = { bar: 4, baz: 5 };
 *
 * for (const key of keys(a,b,c)) {
 *   console.log(key);
 * }
 *
 * // logs: foo, bar, baz
 * ```
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
