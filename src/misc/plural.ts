const CASES = [2, 0, 1, 1, 1, 2];

/**
 * Returns suitable word for given number according to russian language plural rules.
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
