import { test } from '@std/testing/bdd';
import { expect } from '@std/expect/expect';
import { lerp } from '../lerp.ts';

test('should return linear interpolation', () => {
  expect(lerp(0, 10, 0)).toBe(0);
  expect(lerp(0, 10, 1)).toBe(10);
  expect(lerp(0, 10, 0.5)).toBe(5);
  expect(lerp(0, 10, 0.2)).toBe(2);
  expect(lerp(0, 10, 0.8)).toBe(8);

  expect(lerp(2, 12, 0)).toBe(2);
  expect(lerp(2, 12, 1)).toBe(12);
  expect(lerp(2, 12, 0.5)).toBe(7);
});
