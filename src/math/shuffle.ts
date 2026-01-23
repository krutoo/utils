export interface ShuffleOptions {
  random?: () => number;
}

/**
 * Randomly sorts items in given array.
 * Mutates given array. For immutability use `shuffle([...list])`.
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
