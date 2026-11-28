/**
 * Returns interpolation factor for given range and target value.
 *
 * When `x === y`, the range is empty: the factor is non-unique for `value === x`
 * and has no solution otherwise, so `0` is returned as a neutral fallback.
 *
 * @param x Start of the range.
 * @param y End of the range.
 * @param value Value to find factor for.
 * @returns Interpolation factor to use with `lerp`.
 */
export function invLerp(x: number, y: number, value: number): number {
  if (x === y) {
    return 0;
  }

  return (value - x) / (y - x);
}
