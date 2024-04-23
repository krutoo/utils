/**
 * Returns new array with random sorted items.
 * @param array Source array.
 * @returns New randomly sorted array.
 */
// https://stackoverflow.com/a/12646864
export function shuffle<T>(list: Array<T>): Array<T> {
  const result = [...list];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    // deno-lint-ignore no-explicit-any
    [result[i] as any, result[j] as any] = [result[j], result[i]];
  }

  return result;
}
