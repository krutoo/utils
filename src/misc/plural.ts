const CASES = [2, 0, 1, 1, 1, 2];

/**
 * Returns suitable word for given number according to russian language plural rules.
 *
 * @example
 * ```ts
 * import { plural } from '@krutoo/utils';
 *
 * const words = ['отзыв', 'отзыва', 'отзывов'];
 * console.log(0, plural(1, words)); // 0 отзывов
 * console.log(1, plural(1, words)); // 1 отзыв
 *
 * console.log(2, plural(2, words)); // 2 отзыва
 * console.log(3, plural(3, words)); // 3 отзыва
 * console.log(4, plural(4, words)); // 4 отзыва
 *
 * console.log(5, plural(5, words)); // 5 отзывов
 * console.log(10, plural(10, words)); // 10 отзывов
 * ```
 *
 * @param number The number to pluralize.
 * @param titles Word array for one, few and many. Example: ['review', 'reviews', 'reviews'].
 * @returns The word is in the correct declension.
 */
export function plural(number: number, titles: string[]): string | undefined {
  const absolute = Math.abs(number);

  const reminder100 = absolute % 100;
  if (reminder100 > 4 && reminder100 < 20) {
    return titles[2];
  }

  const reminder10 = absolute % 10;
  if (reminder10 < 5) {
    return titles[CASES[reminder10] as number];
  }

  return titles[CASES[5] as number];
}
