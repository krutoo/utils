/**
 * Calls callback for each pair of elements in array.
 * @param array Array.
 * @param callback Callback.
 * @example
 * ```ts
 * import { forEachPair } from "@krutoo/utils";
 *
 * const list = [1, 2, 3];
 *
 * forEachPair((a, b) => {
 *   console.log(a, b);
 * });
 *
 * // output:
 * // 1 2
 * // 1 3
 * // 2 3
 * ```
 */
export function forEachPair<T>(
  array: T[],
  callback: (a: T, b: T) => void,
) {
  for (let i = 0; i < array.length; i++) {
    const a = array[i];

    for (let j = i + 1; j < array.length; j++) {
      const b = array[j];
      callback(a!, b!);
    }
  }
}
