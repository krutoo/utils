/**
 * Returns random integer number in range.
 * @param min Start of range.
 * @param max End of range.
 * @returns Random number.
 */
export function randomInteger(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max + 1 - min));
}
