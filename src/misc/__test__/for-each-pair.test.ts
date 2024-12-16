import { describe, test } from 'node:test';
import { expect } from '@std/expect';
import { forEachPair } from '../for-each-pair.ts';

describe('forEachPair', () => {
  test('should call callback for each pair', () => {
    const list = [1, 2, 3];
    const result: string[] = [];

    forEachPair(list, (a, b) => {
      result.push(`${a} ${b}`);
    });

    expect(result).toEqual(['1 2', '1 3', '2 3']);
  });
});
