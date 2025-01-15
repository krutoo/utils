/**
 * Returns generator that iterates each pair of elements in array.
 *
 * @example
 * ```ts
 * import { pairs } from "@krutoo/utils";
 *
 * const list = [1, 2, 3];
 *
 * for (const [a, b] of pairs(list)) {
 *   console.log(a, b);
 * }
 *
 * // output:
 * // 1 2
 * // 1 3
 * // 2 3
 * ```
 *
 * @param array Array.
 * @yields Each unique pair.
 */
export function* pairs<T>(array: T[]): Generator<readonly [T, T], void, unknown> {
  for (let i = 0; i < array.length; i++) {
    const a = array[i];

    for (let j = i + 1; j < array.length; j++) {
      const b = array[j];
      yield [a!, b!] as const;
    }
  }
}
