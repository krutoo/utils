/**
 * Clamps value to be between min and max values.
 * @param value Value.
 * @param min Minimum.
 * @param max Maximum.
 * @returns Clamped value.
 */
export function clamp(value: number, min: number, max: number): number {
  // check that value is non NaN
  if (value !== value) {
    return value;
  }

  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
}
