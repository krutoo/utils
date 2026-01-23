import type { RandomBetween } from './types.ts';

/**
 * Returns random integer number in range.
 * @param min Start of range.
 * @param max End of range.
 * @returns Random number.
 */
export const randomInteger: RandomBetween = createRandomInteger();

/**
 * Returns random integer number generator.
 * @param random Function that returns random in range 0-1.
 * @returns Random number generator.
 */
export function createRandomInteger(random: () => number = Math.random): RandomBetween {
  return (min: number, max: number): number => {
    return Math.floor(min + random() * (max + 1 - min));
  };
}
