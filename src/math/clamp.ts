/**
 * Clamps value to be between min and max values.
 * @param value Value.
 * @param min Minimum.
 * @param max Maximum.
 * @returns Clamped value.
 */
export function clamp(value: number, min: number, max: number) {
  // check that value is non NaN
  if (value !== value) {
    return value;
  }

  let result = value;

  if (result < min) {
    result = min;
  }

  if (result > max) {
    result = max;
  }

  return result;
}
