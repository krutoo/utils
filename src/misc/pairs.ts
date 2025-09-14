/**
 * Returns generator that iterates each pair of elements in array.
 * @param array Array.
 * @yields Each unique pair.
 */
export function* pairs<T>(array: T[]): Generator<readonly [T, T], void, unknown> {
  for (let i = 0; i < array.length; i++) {
    const a = array[i];

    for (let j = i + 1; j < array.length; j++) {
      const b = array[j];
      yield [a!, b!];
    }
  }
}
