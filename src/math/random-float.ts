/**
 * Returns random float number in range.
 * @param min Start of range.
 * @param max End of range.
 * @returns Random number.
 */
export function randomFloat(min: number, max: number): number {
  return min + Math.random() * (max - min);
}
