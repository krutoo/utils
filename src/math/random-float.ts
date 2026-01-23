import type { RandomBetween } from './types.ts';

/**
 * Returns random float number in range.
 * @param min Start of range.
 * @param max End of range.
 * @returns Random number.
 */
export const randomFloat: RandomBetween = createRandomFloat();

/**
 * Returns random float number generator.
 * @param random Function that returns random in range 0-1.
 * @returns Random number generator.
 */
export function createRandomFloat(random: () => number = Math.random): RandomBetween {
  return (min: number, max: number): number => {
    return min + random() * (max - min);
  };
}
