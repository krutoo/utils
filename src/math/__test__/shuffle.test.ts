import { describe, test } from 'node:test';
import { expect } from '@std/expect/expect';
import { shuffle } from '../shuffle.ts';

describe('shuffle', () => {
  test('should randomly sort items', () => {
    const refer = [1, 2, 3, 4, 5, 6, 7];
    const input = [...refer];

    const output = shuffle(input);

    expect(input === output).toBe(true);
    let matchCount = 0;
    for (let i = 0; i < input.length; i++) {
      if (refer[i] === output[i]) {
        matchCount++;
      }
    }

    expect(matchCount < 7).toBe(true);
  });
});
