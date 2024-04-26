/**
 * Clamps value to be between min and max values.
 * @param value Value.
 * @param min Minimum.
 * @param max Maximum.
 * @returns Clamped value.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
