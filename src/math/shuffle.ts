/**
 * Returns new array with random sorted items.
 * @param array Source array.
 * @param options Options.
 * @returns New randomly sorted array.
 * @see https://stackoverflow.com/a/12646864
 */
export function shuffle<T>(
  list: Array<T>,
  {
    random = Math.random,
  }: {
    random?: () => number;
  } = {},
): Array<T> {
  const result = [...list];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));

    [result[i] as any, result[j] as any] = [result[j], result[i]];
  }

  return result;
}
