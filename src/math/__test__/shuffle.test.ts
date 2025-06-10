import { describe, test } from 'node:test';
import { expect } from '@std/expect/expect';
import { shuffle, toShuffled } from '../shuffle.ts';

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

describe('toShuffled', () => {
  test('should return randomly sorted copy', () => {
    const refer = [1, 2, 3, 4, 5, 6, 7];

    const input = [...refer];
    const output = toShuffled(input);

    // check that input is not mutated
    for (let i = 0; i < refer.length; i++) {
      expect(input[i] === refer[i]).toBe(true);
    }

    // check that output is new array but with same items
    expect(output === input).toBe(false);
    expect(output.length === input.length).toBe(true);
    expect(output.every(item => input.includes(item))).toBe(true);
    expect(output.some((item, index) => input[index] !== item)).toBe(true);
  });
});
