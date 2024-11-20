import { test } from '@std/testing/bdd';
import { expect } from '@std/expect';
import { forEachPair } from '../for-each-pair.ts';

test('forEachPair', () => {
  const list = [1, 2, 3];
  const result: string[] = [];

  forEachPair(list, (a, b) => {
    result.push(`${a} ${b}`);
  });

  expect(result).toEqual([
    '1 2',
    '1 3',
    '2 3',
  ]);
});
