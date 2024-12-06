const CASES = [2, 0, 1, 1, 1, 2];

/**
 * Returns the required deviation from the passed list by the passed value.
 * @param number The number used for declension.
 * @param titles An array with word declensions. For example: ['review', 'review', 'reviews'].
 * @return The word is in the correct declension.
 */
export function getDeclination(number: number, titles: string[]): string | undefined {
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
