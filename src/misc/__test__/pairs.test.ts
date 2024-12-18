import { describe, test } from 'node:test';
import { expect } from '@std/expect';
import { pairs } from '../pairs.ts';

describe('pairs', () => {
  test('should iterate over each pair', () => {
    const list = [1, 2, 3];
    const result: string[] = [];

    for (const [a, b] of pairs(list)) {
      result.push(`${a} ${b}`);
    }

    expect(result).toEqual(['1 2', '1 3', '2 3']);
  });
});
