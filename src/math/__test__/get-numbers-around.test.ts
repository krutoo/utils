import { describe, test } from 'node:test';
import { expect } from '@std/expect';
import { getNumbersAround } from '../get-numbers-around.ts';

describe('getNumbersAround', () => {
  test('should work with defaults', () => {
    expect(getNumbersAround(0)).toEqual([-1, 0, 1]);
    expect(getNumbersAround(1)).toEqual([0, 1, 2]);
    expect(getNumbersAround(2)).toEqual([1, 2, 3]);
    expect(getNumbersAround(10)).toEqual([9, 10, 11]);
    expect(getNumbersAround(54)).toEqual([53, 54, 55]);
  });

  test('should handle options', () => {
    expect(getNumbersAround(0, { min: -10, range: 3 })).toEqual([-3, -2, -1, 0, 1, 2, 3]);
    expect(getNumbersAround(3, { range: 3 })).toEqual([0, 1, 2, 3, 4, 5, 6]);
    expect(getNumbersAround(97, { range: 2, max: 98 })).toEqual([95, 96, 97, 98]);
    expect(getNumbersAround(99, { range: 2, max: 100 })).toEqual([97, 98, 99, 100]);
  });
});
