export interface ShuffleOptions {
  random?: () => number;
}

/**
 * Randomly sorts items in given array.
 * @param list Source array.
 * @param options Options.
 * @returns Exactly given array.
 * @see https://stackoverflow.com/a/12646864
 */
export function shuffle<T extends any[]>(
  list: T,
  { random = Math.random }: ShuffleOptions = {},
): T {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));

    [list[i] as any, list[j] as any] = [list[j], list[i]];
  }

  return list;
}

/**
 * Returns new array with random sorted items.
 * @param list Source array.
 * @param options Options.
 * @returns New randomly sorted array.
 * @see https://stackoverflow.com/a/12646864
 */
export function toShuffled<T>(list: Array<T>, options: ShuffleOptions = {}): Array<T> {
  return shuffle([...list], options);
}
