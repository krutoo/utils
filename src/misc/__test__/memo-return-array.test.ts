import { test, describe } from 'node:test';
import { expect } from '@std/expect';
import { memoReturnArray } from '../memo-return-array.ts';

describe('memoReturnArray', () => {
  test('should return previous result when new array has same items', () => {
    const func = memoReturnArray(() => [1, 2, 3]);

    const a = func();
    const b = func();

    expect(Object.is(a, b)).toBe(true);
  });
});
