/**
 * Calls callback for each pair of elements in array.
 * @param array Array.
 * @param callback Callback.
 */
export function forEachPair<T>(array: T[], callback: (a: T, b: T) => void): void {
  for (let i = 0; i < array.length; i++) {
    const a = array[i];

    for (let j = i + 1; j < array.length; j++) {
      const b = array[j];
      callback(a!, b!);
    }
  }
}
