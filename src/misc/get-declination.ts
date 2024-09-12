/**
 * Returns the required deviation from the passed list by the passed value.
 * @param number The number used for declension.
 * @param titles An array with word declensions. For example: ['review', 'review', 'reviews'].
 * @return The word is in the correct declension.
 */
export function getDeclination(number: number, titles: string[]): string | undefined {
  const cases = [2, 0, 1, 1, 1, 2];
  const positiveNumber = Math.abs(number);
  const index = positiveNumber % 100 > 4 && positiveNumber % 100 < 20
    ? 2
    : cases[positiveNumber % 10 < 5 ? positiveNumber % 10 : 5];

  return titles[index!];
}
