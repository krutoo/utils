import { test } from '@std/testing/bdd';
import { expect } from '@std/expect/expect';
import { shuffle } from '../shuffle.ts';

test('should randomly sort items', () => {
  const input = [1, 2, 3, 4, 5, 6, 7];
  const output = shuffle(input);

  expect(output.length === input.length).toBe(true);
  expect(output.every((item) => input.includes(item))).toBe(true);
  expect(output.some((item, index) => input[index] !== item)).toBe(true);
});
