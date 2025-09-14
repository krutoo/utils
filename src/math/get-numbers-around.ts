/** Options for `getNumbersAround` function. */
export interface GetNumbersAroundOptions {
  /** Range size. For range = 2 and target = 3 result will be [1, 2, 3, 4, 5]. */
  range?: number;

  /** Bottom limit of range. */
  min?: number;

  /** Top limit of range. */
  max?: number;
}

/**
 * Returns sorted list of numbers around target number, including target number.
 * Useful for making pagination buttons in UI.
 * @param target Target value.
 * @param options Options of borders and range of result set of numbers.
 * @returns Array of sorted numbers.
 */
export function getNumbersAround(
  target: number,
  { range = 1, min = -Infinity, max = Infinity }: GetNumbersAroundOptions = {},
): number[] {
  const numbers: number[] = [];

  for (let i = Math.max(min, target - range); i <= Math.min(max, target + range); i++) {
    numbers.push(i);
  }

  return numbers;
}
